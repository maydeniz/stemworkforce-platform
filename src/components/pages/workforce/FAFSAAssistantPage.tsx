// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  GraduationCap,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  Star,
  Building2,
  Phone,
  BookOpen,
  Calculator,
  Lock,
  Eye,
  Key,
  RefreshCw,
  Globe,
  Info,
  Target,
  Zap
} from 'lucide-react';

// FAFSA timeline
const FAFSA_TIMELINE = [
  { date: 'October 1', event: 'FAFSA Opens', description: 'New application available for upcoming academic year' },
  { date: 'December - March', event: 'Priority Deadlines', description: 'Many states and schools have early deadlines' },
  { date: 'March - May', event: 'State Deadlines', description: 'State grant programs have varying deadlines' },
  { date: 'June 30', event: 'Federal Deadline', description: 'Last day to submit FAFSA for the academic year' }
];

// Documents needed
const REQUIRED_DOCUMENTS = [
  {
    category: 'Identification',
    icon: Shield,
    items: [
      'Social Security Number',
      'Driver\'s license (if applicable)',
      'Alien Registration Number (if not a U.S. citizen)'
    ]
  },
  {
    category: 'Tax Information',
    icon: FileText,
    items: [
      'Federal tax returns (yours and parents\' if dependent)',
      'W-2 forms and other records of income',
      'Records of untaxed income (child support, interest income)',
      'IRS Data Retrieval Tool can import directly'
    ]
  },
  {
    category: 'Financial Information',
    icon: DollarSign,
    items: [
      'Bank statements and records of investments',
      'Records of other assets (real estate, business)',
      'Current bank account balances',
      'Investment account statements'
    ]
  },
  {
    category: 'School Information',
    icon: GraduationCap,
    items: [
      'FSA ID (username and password)',
      'List of schools you want to receive your FAFSA',
      'High school diploma date (or GED)',
      'Expected enrollment date'
    ]
  }
];

// Step by step guide
const COMPLETION_STEPS = [
  {
    step: 1,
    title: 'Create an FSA ID',
    description: 'Your electronic signature for FAFSA',
    icon: Key,
    time: '10-15 minutes',
    tips: [
      'Go to studentaid.gov/fsa-id',
      'Both student AND parent need separate FSA IDs',
      'Use permanent email addresses you check regularly',
      'Save your username and password securely',
      'Verify your email address immediately'
    ],
    warnings: [
      'FSA ID takes 1-3 days to fully process',
      'Don\'t share your FSA ID with anyone (even parents)'
    ]
  },
  {
    step: 2,
    title: 'Gather Your Documents',
    description: 'Collect tax and financial information',
    icon: FileText,
    time: '15-30 minutes',
    tips: [
      'Have prior year tax returns ready',
      'Collect W-2s for all jobs',
      'Know your bank account balances',
      'If divorced, use custodial parent\'s info',
      'Keep all documents together for easy reference'
    ],
    warnings: [
      'Use tax info from 2 years prior (e.g., 2022 taxes for 2024-25 FAFSA)',
      'Don\'t estimate - use actual figures'
    ]
  },
  {
    step: 3,
    title: 'Complete the FAFSA Form',
    description: 'Fill out the online application',
    icon: Globe,
    time: '30-45 minutes',
    tips: [
      'Go to studentaid.gov/fafsa',
      'Use IRS Data Retrieval Tool to import tax info',
      'Answer all questions - don\'t leave blanks',
      'List up to 10 schools to receive your information',
      'Save your work frequently'
    ],
    warnings: [
      'Watch for FAFSA scam sites - only use studentaid.gov',
      'Never pay to file FAFSA - it\'s FREE'
    ]
  },
  {
    step: 4,
    title: 'Sign and Submit',
    description: 'Use your FSA ID to sign',
    icon: CheckCircle,
    time: '5 minutes',
    tips: [
      'Both student and parent must sign (if dependent)',
      'Use FSA IDs to sign electronically',
      'Review all information before submitting',
      'Print or save confirmation page',
      'Note your confirmation number'
    ],
    warnings: [
      'Parent must use THEIR OWN FSA ID to sign',
      'Submit before state priority deadlines'
    ]
  },
  {
    step: 5,
    title: 'Review Your SAR',
    description: 'Check your Student Aid Report',
    icon: Eye,
    time: '10 minutes',
    tips: [
      'SAR arrives 3-5 days after submission',
      'Check for errors or rejected fields',
      'Note your Expected Family Contribution (EFC)',
      'Schools use SAR to create financial aid packages',
      'Make corrections if needed'
    ],
    warnings: [
      'Contact schools if SAR shows issues',
      'You may be selected for verification - respond promptly'
    ]
  }
];

// Common mistakes
const COMMON_MISTAKES = [
  {
    mistake: 'Missing deadlines',
    impact: 'Lost grant and scholarship opportunities',
    solution: 'File as early as possible after October 1'
  },
  {
    mistake: 'Wrong tax year',
    impact: 'Rejection or incorrect aid calculation',
    solution: 'Use "prior-prior year" taxes (2 years before school year)'
  },
  {
    mistake: 'Leaving fields blank',
    impact: 'Application processing delays',
    solution: 'Enter $0 or N/A instead of leaving blank'
  },
  {
    mistake: 'Not listing enough schools',
    impact: 'Schools won\'t receive your information',
    solution: 'List all schools you\'re considering (up to 10)'
  },
  {
    mistake: 'Parent/student FSA ID mix-up',
    impact: 'Application errors, delays, potential rejection',
    solution: 'Each person creates and uses their OWN FSA ID'
  },
  {
    mistake: 'Forgetting to sign',
    impact: 'FAFSA won\'t be processed',
    solution: 'Both student and parent (if dependent) must sign with FSA IDs'
  }
];

// Types of aid
const AID_TYPES = [
  {
    type: 'Pell Grant',
    description: 'Federal grant for undergraduate students with financial need',
    amount: 'Up to $7,395/year (2024-25)',
    repay: false,
    icon: Star
  },
  {
    type: 'Federal Student Loans',
    description: 'Low-interest loans for students and parents',
    amount: '$5,500 - $12,500/year',
    repay: true,
    icon: DollarSign
  },
  {
    type: 'Federal Work-Study',
    description: 'Part-time job to earn money for school expenses',
    amount: 'Varies by school',
    repay: false,
    icon: Building2
  },
  {
    type: 'State Grants',
    description: 'Grants from your state based on need and/or merit',
    amount: 'Varies by state',
    repay: false,
    icon: Target
  },
  {
    type: 'School Grants',
    description: 'Grants from your college or university',
    amount: 'Varies by school',
    repay: false,
    icon: GraduationCap
  }
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: 'Am I considered independent or dependent?',
    answer: 'Most students under 24 are dependent and must include parent information. You\'re independent if you\'re 24+, married, a veteran, have legal dependents, were in foster care, emancipated minor, homeless, or in graduate school. Dependency status is NOT based on whether parents claim you on taxes or help pay for school.'
  },
  {
    question: 'My parents won\'t help me pay or share their information. What do I do?',
    answer: 'Unfortunately, being a dependent student, you still need parent info even if they won\'t help pay. Options: 1) Request a dependency override from your school\'s financial aid office, 2) Document unusual circumstances, 3) Consider waiting until age 24, or 4) Explore private loans (not recommended). Talk to your school\'s financial aid office about your specific situation.'
  },
  {
    question: 'Do I need to complete FAFSA every year?',
    answer: 'Yes! FAFSA must be filed each academic year you want financial aid. Your aid eligibility can change based on income, family size, and other factors. Set a reminder to file each October when the new FAFSA opens.'
  },
  {
    question: 'What is verification and why was I selected?',
    answer: 'Verification is when your school confirms your FAFSA information is accurate. About 1/3 of students are selected (randomly or due to data inconsistencies). You\'ll need to provide tax transcripts and other documents. Respond quickly - aid can\'t be disbursed until verification is complete.'
  },
  {
    question: 'Can I get financial aid for online programs?',
    answer: 'Yes, if the school is accredited and participates in federal student aid programs. The program must lead to a degree or certificate. Check the school\'s accreditation and federal aid eligibility before enrolling.'
  },
  {
    question: 'I\'m going to a career training program. Should I complete FAFSA?',
    answer: 'Yes! Many career and technical training programs qualify for federal aid including Pell Grants. Additionally, completing FAFSA is often required for WIOA funding (ITAs) - you must apply for Pell first. Check if your program is at a Title IV eligible institution.'
  }
];

// Help resources
const HELP_RESOURCES = [
  { name: 'FAFSA Help Hotline', contact: '1-800-433-3243', type: 'phone' },
  { name: 'Federal Student Aid', contact: 'studentaid.gov', type: 'website' },
  { name: 'FAFSA on the Web', contact: 'studentaid.gov/fafsa', type: 'website' },
  { name: 'FSA ID Help', contact: 'studentaid.gov/fsa-id', type: 'website' }
];

export default function FAFSAAssistantPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FileText className="h-10 w-10 text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              FAFSA Completion Assistant
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Complete your Free Application for Federal Student Aid (FAFSA) with confidence.
              Step-by-step guidance to unlock grants, loans, and work-study opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://studentaid.gov/h/apply-for-aid/fafsa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-400 transition flex items-center gap-2"
              >
                <Globe className="h-5 w-5" />
                Start FAFSA Now
              </a>
              <a
                href="https://studentaid.gov/fsa-id/create-account/launch"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <Key className="h-5 w-5" />
                Create FSA ID
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-emerald-500/10 border-y border-emerald-500/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 text-emerald-400">
            <Zap className="h-5 w-5" />
            <span className="font-medium">
              FAFSA is FREE! Never pay to file. Only use studentaid.gov
            </span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="py-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">$7,395</div>
              <div className="text-white font-medium">Max Pell Grant</div>
              <div className="text-slate-500 text-sm">2024-25 academic year</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">FREE</div>
              <div className="text-white font-medium">Cost to File</div>
              <div className="text-slate-500 text-sm">Always free at studentaid.gov</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">45 min</div>
              <div className="text-white font-medium">Average Time</div>
              <div className="text-slate-500 text-sm">With documents ready</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">Oct 1</div>
              <div className="text-white font-medium">Opens Each Year</div>
              <div className="text-slate-500 text-sm">File early for best aid</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">FAFSA Deadlines</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              File early! Many states and schools have priority deadlines for maximum aid.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {FAFSA_TIMELINE.map((item, idx) => (
              <div key={idx} className="relative">
                {idx < FAFSA_TIMELINE.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-slate-700" />
                )}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative z-10">
                  <div className="text-purple-400 font-bold text-lg mb-2">{item.date}</div>
                  <div className="text-white font-semibold mb-1">{item.event}</div>
                  <div className="text-slate-400 text-sm">{item.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <AlertCircle className="h-5 w-5 text-amber-400 inline-block mr-2" />
            <span className="text-amber-400 font-medium">
              Check your state's deadline at studentaid.gov/apply-for-aid/fafsa/fafsa-deadlines
            </span>
          </div>
        </div>
      </div>

      {/* Documents Needed */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What You'll Need</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Gather these documents before starting to make the process faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REQUIRED_DOCUMENTS.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.category} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold">{category.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Step-by-Step Guide</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Follow these steps to complete your FAFSA successfully.
            </p>
          </div>

          <div className="space-y-4">
            {COMPLETION_STEPS.map((step) => {
              const Icon = step.icon;
              const isExpanded = expandedStep === step.step;

              return (
                <div
                  key={step.step}
                  className={`bg-slate-900 border rounded-xl overflow-hidden transition ${
                    isExpanded ? 'border-purple-500' : 'border-slate-800'
                  }`}
                >
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-800/50 transition text-left"
                  >
                    <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{step.description}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-800">
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        {/* Tips */}
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                            Tips for Success
                          </h4>
                          <ul className="space-y-2">
                            {step.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                                <Star className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Warnings */}
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            Watch Out For
                          </h4>
                          <ul className="space-y-2">
                            {step.warnings.map((warning, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Avoid These Common Mistakes</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Learn from others' errors to get your FAFSA right the first time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMON_MISTAKES.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <h3 className="text-white font-semibold">{item.mistake}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-500 text-sm">Impact:</span>
                    <p className="text-red-400 text-sm">{item.impact}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-sm">Solution:</span>
                    <p className="text-emerald-400 text-sm">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Types of Aid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Aid Can You Receive?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              FAFSA unlocks access to these types of financial aid.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AID_TYPES.map((aid) => {
              const Icon = aid.icon;
              return (
                <div key={aid.type} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${aid.repay ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
                      <Icon className={`h-5 w-5 ${aid.repay ? 'text-amber-400' : 'text-emerald-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{aid.type}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        aid.repay ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {aid.repay ? 'Must Repay' : 'Free Money'}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{aid.description}</p>
                  <p className="text-purple-400 font-medium">{aid.amount}</p>
                </div>
              );
            })}
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
                    <HelpCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
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

      {/* Help Resources */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-900/50 to-slate-900 border border-purple-500/30 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Need Help?</h2>
              <p className="text-slate-400">Free assistance is available</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {HELP_RESOURCES.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.type === 'phone' ? `tel:${resource.contact}` : `https://${resource.contact}`}
                  target={resource.type === 'website' ? '_blank' : undefined}
                  rel={resource.type === 'website' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition"
                >
                  {resource.type === 'phone' ? (
                    <Phone className="h-5 w-5 text-purple-400" />
                  ) : (
                    <Globe className="h-5 w-5 text-purple-400" />
                  )}
                  <div>
                    <div className="text-white font-medium">{resource.name}</div>
                    <div className="text-slate-400 text-sm">{resource.contact}</div>
                  </div>
                  {resource.type === 'website' && <ExternalLink className="h-4 w-4 text-slate-500 ml-auto" />}
                </a>
              ))}
            </div>

            <div className="text-center">
              <p className="text-slate-400 mb-4">
                Your local career center can also provide free FAFSA completion assistance.
              </p>
              <Link
                to="/workforce/career-centers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-400 transition"
              >
                <Building2 className="h-5 w-5" />
                Find In-Person Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your FAFSA?
            </h2>
            <p className="text-slate-300 mb-6">
              Remember: FAFSA is free, opens October 1, and the earlier you file, the more aid you may receive!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://studentaid.gov/h/apply-for-aid/fafsa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-400 transition flex items-center gap-2"
              >
                <Globe className="h-5 w-5" />
                Go to FAFSA
              </a>
              <Link
                to="/workforce/training-funding"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <DollarSign className="h-5 w-5" />
                Other Funding Options
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
