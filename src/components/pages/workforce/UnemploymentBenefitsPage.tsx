// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Globe,
  Calendar,
  Users,
  Building2,
  MapPin,
  ArrowRight,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Heart,
  Search,
  ExternalLink,
  Info,
  XCircle,
  Timer,
  TrendingUp,
  ClipboardList
} from 'lucide-react';

// Eligibility requirements
const ELIGIBILITY_REQUIREMENTS = [
  {
    id: 'work-history',
    title: 'Work History',
    description: 'Earned enough wages during your base period',
    icon: Briefcase,
    details: [
      'Worked during the base period (typically last 12-18 months)',
      'Earned minimum wages (varies by state, often $2,500-$5,000)',
      'Worked for covered employers (most private employers)',
      'May use alternate base period if standard doesn\'t qualify'
    ]
  },
  {
    id: 'separation',
    title: 'Reason for Separation',
    description: 'Lost job through no fault of your own',
    icon: AlertTriangle,
    details: [
      'Laid off due to lack of work',
      'Company closed or relocated',
      'Reduction in force or restructuring',
      'Contract ended (temporary/seasonal work)',
      'Some states allow quitting for "good cause"'
    ]
  },
  {
    id: 'availability',
    title: 'Availability & Job Search',
    description: 'Able, available, and actively seeking work',
    icon: Search,
    details: [
      'Physically able to work',
      'Available for full-time work',
      'Actively searching for suitable employment',
      'Register with state job service',
      'Complete required job search activities'
    ]
  }
];

// What disqualifies you
const DISQUALIFYING_FACTORS = [
  { reason: 'Voluntarily quit without good cause', icon: XCircle },
  { reason: 'Fired for misconduct or violation of company policy', icon: XCircle },
  { reason: 'Refused suitable work without good reason', icon: XCircle },
  { reason: 'Not actively searching for work', icon: XCircle },
  { reason: 'Self-employed (most states) - check for PUA availability', icon: XCircle },
  { reason: 'Not legally authorized to work', icon: XCircle }
];

// Application steps
const APPLICATION_STEPS = [
  {
    step: 1,
    title: 'Gather Required Documents',
    description: 'Collect information you\'ll need to apply',
    icon: FileText,
    items: [
      'Social Security Number',
      'Driver\'s license or state ID',
      'Last employer information (name, address, dates)',
      'Reason for separation',
      'Direct deposit information (optional)',
      'Alien registration number (if applicable)'
    ]
  },
  {
    step: 2,
    title: 'File Your Claim',
    description: 'Apply online through your state\'s unemployment website',
    icon: Globe,
    items: [
      'File in the state where you worked',
      'Apply as soon as you lose your job',
      'Most states allow online filing 24/7',
      'Have all documents ready before starting',
      'Save confirmation number'
    ]
  },
  {
    step: 3,
    title: 'Complete Identity Verification',
    description: 'Verify your identity to prevent fraud',
    icon: Shield,
    items: [
      'May require ID.me or similar verification',
      'Upload photo ID and selfie',
      'Answer security questions',
      'Video call option if automatic fails'
    ]
  },
  {
    step: 4,
    title: 'Wait for Determination',
    description: 'Your state reviews your claim',
    icon: Clock,
    items: [
      'Typically 2-3 weeks for initial determination',
      'Employer notified and may contest',
      'May need to attend fact-finding interview',
      'Appeals process available if denied'
    ]
  },
  {
    step: 5,
    title: 'Certify Weekly/Biweekly',
    description: 'Report your job search activities and earnings',
    icon: Calendar,
    items: [
      'Complete certification each week/biweek',
      'Report any work and earnings',
      'Document job search activities',
      'Report any job offers or interviews'
    ]
  }
];

// Benefits overview
const BENEFITS_INFO = [
  { label: 'Weekly Benefit', value: '$100 - $800+', note: 'Varies by state and wages' },
  { label: 'Duration', value: '12 - 26 weeks', note: 'Standard benefit period' },
  { label: 'Waiting Period', value: '0 - 1 week', note: 'Most states have 1 week' },
  { label: 'Extension Programs', value: 'Available', note: 'During high unemployment' }
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: 'How much will I receive in unemployment benefits?',
    answer: 'Benefits are typically 40-50% of your previous weekly wages, up to a maximum set by your state. Maximums range from about $300/week to over $800/week depending on the state. Use your state\'s benefits calculator for an estimate.'
  },
  {
    question: 'When should I file for unemployment?',
    answer: 'File immediately after losing your job, even if you expect severance pay or have vacation time coming. There\'s usually a one-week waiting period before benefits begin, and delays in filing mean delays in receiving benefits.'
  },
  {
    question: 'Can I work part-time and still collect unemployment?',
    answer: 'Yes, in most states you can work part-time and receive partial benefits. You must report all earnings. Typically, benefits are reduced by a portion of your earnings (often 50-75 cents for each dollar earned up to a threshold).'
  },
  {
    question: 'What if my employer disputes my claim?',
    answer: 'If your employer contests your claim, you\'ll have a fact-finding interview or hearing. Gather documentation (termination letters, performance reviews, etc.) to support your case. You can appeal if the initial decision is unfavorable.'
  },
  {
    question: 'Can I receive unemployment while in school or training?',
    answer: 'In many states, yes - especially if enrolled in state-approved training. Some states waive job search requirements for those in training. Check with your career center about training programs that qualify.'
  },
  {
    question: 'What happens if I refuse a job offer?',
    answer: 'Refusing suitable work can disqualify you from benefits. "Suitable" considers your skills, experience, prior wages, and commute distance. Early in your claim, you have more flexibility; later, you may need to accept lower-paying positions.'
  },
  {
    question: 'Are unemployment benefits taxable?',
    answer: 'Yes, unemployment benefits are taxable income. You can choose to have federal taxes withheld (typically 10%) when you file your claim. State tax treatment varies. You\'ll receive a 1099-G for tax filing.'
  },
  {
    question: 'What if I was fired?',
    answer: 'Being fired doesn\'t automatically disqualify you. If terminated for reasons other than "misconduct" (such as poor fit, inability to meet requirements, or performance issues), you may still qualify. Misconduct involving willful violation of company rules typically disqualifies you.'
  }
];

// State resources (sample - would be comprehensive)
const STATE_RESOURCES = [
  { state: 'California', website: 'edd.ca.gov', phone: '1-800-300-5616', maxBenefit: '$450/week' },
  { state: 'Texas', website: 'twc.texas.gov', phone: '1-800-939-6631', maxBenefit: '$549/week' },
  { state: 'Florida', website: 'floridajobs.org', phone: '1-800-204-2418', maxBenefit: '$275/week' },
  { state: 'New York', website: 'labor.ny.gov', phone: '1-888-209-8124', maxBenefit: '$504/week' },
  { state: 'Illinois', website: 'ides.illinois.gov', phone: '1-800-244-5631', maxBenefit: '$505/week' },
  { state: 'Pennsylvania', website: 'uc.pa.gov', phone: '1-888-313-7284', maxBenefit: '$594/week' }
];

export default function UnemploymentBenefitsPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Shield className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Unemployment Insurance Benefits
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Lost your job? Unemployment benefits provide temporary income while you search for new work.
              Learn how to file, what you'll receive, and your next steps.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.careeronestop.org/LocalHelp/UnemploymentBenefits/find-unemployment-benefits.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition flex items-center gap-2"
              >
                <Globe className="h-5 w-5" />
                Find Your State's UI Website
              </a>
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Find Career Center
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Action Banner */}
      <div className="bg-amber-500/10 border-y border-amber-500/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 text-amber-400">
            <Timer className="h-5 w-5" />
            <span className="font-medium">
              File as soon as you lose your job! Delays in filing = delays in receiving benefits.
            </span>
          </div>
        </div>
      </div>

      {/* Benefits Overview */}
      <div className="py-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS_INFO.map((info, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-400">{info.value}</div>
                <div className="text-white font-medium">{info.label}</div>
                <div className="text-slate-500 text-sm">{info.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Are You Eligible?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              To qualify for unemployment benefits, you generally must meet these requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {ELIGIBILITY_REQUIREMENTS.map((req) => {
              const Icon = req.icon;
              return (
                <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{req.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{req.description}</p>
                  <ul className="space-y-2">
                    {req.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Disqualifying factors */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              What May Disqualify You
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {DISQUALIFYING_FACTORS.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  {factor.reason}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Application Steps */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How to Apply</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Follow these steps to file your unemployment claim.
            </p>
          </div>

          <div className="space-y-4">
            {APPLICATION_STEPS.map((step) => {
              const Icon = step.icon;
              const isExpanded = expandedStep === step.step;

              return (
                <div
                  key={step.step}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-800/50 transition text-left"
                  >
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className="text-slate-400 text-sm">{step.description}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {step.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* State Resources */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">State Unemployment Resources</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Unemployment insurance is administered by states. Find your state's resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STATE_RESOURCES.map((state) => (
              <div
                key={state.state}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{state.state}</h3>
                <div className="space-y-2 text-sm">
                  <a
                    href={`https://${state.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <Globe className="h-4 w-4" />
                    {state.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={`tel:${state.phone}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    {state.phone}
                  </a>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <DollarSign className="h-4 w-4" />
                    Max: {state.maxBenefit}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://www.careeronestop.org/LocalHelp/UnemploymentBenefits/find-unemployment-benefits.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              Find All State UI Websites
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* While on UI Section */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">While Receiving Benefits</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Use this time wisely. Here's what you can do while collecting unemployment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Free Training</h3>
              <p className="text-slate-400 text-sm mb-4">
                Use WIOA programs to learn new skills while on UI. Many states waive job search requirements for approved training.
              </p>
              <Link
                to="/workforce/training-funding"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1"
              >
                Explore Training Options
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Support Services</h3>
              <p className="text-slate-400 text-sm mb-4">
                Access supportive services like transportation assistance, childcare help, and emergency housing support.
              </p>
              <Link
                to="/workforce/supportive-services"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                View Supportive Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Visit Career Center</h3>
              <p className="text-slate-400 text-sm mb-4">
                Get one-on-one career counseling, resume help, interview coaching, and job referrals at your local career center.
              </p>
              <Link
                to="/workforce/career-centers"
                className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
              >
                Find a Career Center
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* RESEA Program */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/50 to-slate-900 border border-blue-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <ClipboardList className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">RESEA Program</h2>
                <p className="text-slate-400">Reemployment Services and Eligibility Assessment</p>
              </div>
            </div>

            <p className="text-slate-300 mb-6">
              If you're receiving unemployment benefits, you may be selected for RESEA - a mandatory program
              that helps you return to work faster. Benefits include:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-slate-300">One-on-one career counseling</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-slate-300">Labor market information</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-slate-300">Resume and interview assistance</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-slate-300">Referrals to training programs</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <div className="text-slate-300 text-sm">
                <strong className="text-amber-400">Important:</strong> If selected for RESEA, attendance is mandatory.
                Failure to attend may result in loss of benefits.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span className="text-white font-medium">{faq.question}</span>
                  </div>
                  {expandedFaq === idx ? (
                    <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-4 text-slate-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need Help Filing Your Claim?
            </h2>
            <p className="text-slate-300 mb-6">
              Visit your local American Job Center for in-person assistance with your unemployment claim.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition flex items-center gap-2"
              >
                <Building2 className="h-5 w-5" />
                Find Career Center
              </Link>
              <Link
                to="/workforce/dislocated-workers"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                Dislocated Worker Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
