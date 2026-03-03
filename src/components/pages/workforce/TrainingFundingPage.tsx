// @ts-nocheck

// Static Tailwind color map
const fundingBorderColors: Record<string, string> = {
  emerald: 'border-emerald-500',
  blue: 'border-blue-500',
  purple: 'border-purple-500',
  amber: 'border-amber-500',
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  GraduationCap,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  MapPin,
  Phone,
  ArrowRight,
  Clock,
  Target,
  Award,
  BookOpen,
  Briefcase,
  TrendingUp,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Calculator,
  Percent,
  Calendar,
  Star,
  Wrench,
  Laptop,
  Stethoscope,
  Truck,
  Zap
} from 'lucide-react';

// Funding sources
const FUNDING_SOURCES = [
  {
    id: 'ita',
    name: 'Individual Training Account (ITA)',
    description: 'WIOA-funded voucher for approved training programs',
    maxAmount: '$10,000 - $15,000',
    duration: 'Up to 2 years',
    icon: DollarSign,
    color: 'emerald',
    features: [
      'Covers tuition, fees, books, and supplies',
      'Training must be on ETPL (Eligible Training Provider List)',
      'Must lead to in-demand occupation',
      'No repayment required'
    ],
    eligibility: [
      'WIOA eligible (Adult, Dislocated Worker, or Youth)',
      'Unable to obtain other grant assistance',
      'Training selected leads to self-sufficient employment'
    ],
    process: [
      'Complete WIOA eligibility determination',
      'Meet with career counselor for assessment',
      'Research approved training programs',
      'Apply for ITA through career center'
    ]
  },
  {
    id: 'pell',
    name: 'Pell Grant',
    description: 'Federal grant for undergraduate education',
    maxAmount: '$7,395/year (2024-25)',
    duration: 'Up to 6 years',
    icon: Award,
    color: 'blue',
    features: [
      'Based on financial need (EFC from FAFSA)',
      'Works for degrees and certificates',
      'Can be combined with ITA',
      'No repayment required'
    ],
    eligibility: [
      'US citizen or eligible non-citizen',
      'Financial need based on FAFSA',
      'Enrolled in eligible program',
      'Maintain satisfactory academic progress'
    ],
    process: [
      'Complete FAFSA at studentaid.gov',
      'Review Student Aid Report (SAR)',
      'School determines award amount',
      'Funds applied to tuition/fees'
    ]
  },
  {
    id: 'tap',
    name: 'Trade Adjustment Assistance (TAA)',
    description: 'Extended benefits for trade-affected workers',
    maxAmount: 'Full tuition + allowances',
    duration: 'Up to 130 weeks',
    icon: TrendingUp,
    color: 'purple',
    features: [
      'Extended training benefits beyond ITA',
      'Trade Readjustment Allowances (income support)',
      'Job search and relocation allowances',
      'Health Coverage Tax Credit (HCTC)'
    ],
    eligibility: [
      'Job loss due to foreign trade impact',
      'Employer received TAA certification',
      'Enrolled in approved training',
      'Exhausted or ineligible for UI'
    ],
    process: [
      'Verify employer has TAA petition approved',
      'Register at career center within deadlines',
      'Select approved training program',
      'Maintain participation requirements'
    ]
  },
  {
    id: 'apprenticeship',
    name: 'Registered Apprenticeship',
    description: 'Earn while you learn with employer sponsorship',
    maxAmount: 'Paid training + wages',
    duration: '1-6 years depending on trade',
    icon: Wrench,
    color: 'amber',
    features: [
      'Earn wages while training',
      'Employer pays for instruction',
      'Industry-recognized credential',
      'Progressive wage increases'
    ],
    eligibility: [
      'Meet program entry requirements',
      'Pass employer screening/aptitude tests',
      'Commit to program completion',
      'May require minimum age (16-18)'
    ],
    process: [
      'Search for apprenticeship openings',
      'Apply directly to employer/sponsor',
      'Complete interview and assessment',
      'Sign apprenticeship agreement'
    ]
  }
];

// In-demand careers with funding info
const FUNDED_CAREERS = [
  {
    field: 'Healthcare',
    icon: Stethoscope,
    color: 'red',
    careers: [
      { title: 'Registered Nurse', funding: 'ITA + Pell', duration: '2-4 years', salary: '$77,600' },
      { title: 'Medical Assistant', funding: 'ITA', duration: '9-12 months', salary: '$37,190' },
      { title: 'Dental Hygienist', funding: 'ITA + Pell', duration: '2-3 years', salary: '$77,810' },
      { title: 'Pharmacy Technician', funding: 'ITA', duration: '6-12 months', salary: '$36,740' }
    ]
  },
  {
    field: 'Technology',
    icon: Laptop,
    color: 'blue',
    careers: [
      { title: 'Software Developer', funding: 'ITA + Pell', duration: '6-24 months', salary: '$120,730' },
      { title: 'Cybersecurity Analyst', funding: 'ITA', duration: '6-18 months', salary: '$102,600' },
      { title: 'Data Analyst', funding: 'ITA', duration: '6-12 months', salary: '$82,360' },
      { title: 'Cloud Administrator', funding: 'ITA', duration: '3-12 months', salary: '$90,270' }
    ]
  },
  {
    field: 'Skilled Trades',
    icon: Wrench,
    color: 'amber',
    careers: [
      { title: 'Electrician', funding: 'Apprenticeship', duration: '4-5 years', salary: '$60,040' },
      { title: 'HVAC Technician', funding: 'ITA + Apprenticeship', duration: '6-24 months', salary: '$50,590' },
      { title: 'Plumber', funding: 'Apprenticeship', duration: '4-5 years', salary: '$59,880' },
      { title: 'Welder', funding: 'ITA', duration: '3-12 months', salary: '$47,010' }
    ]
  },
  {
    field: 'Transportation',
    icon: Truck,
    color: 'green',
    careers: [
      { title: 'CDL Truck Driver', funding: 'ITA', duration: '3-8 weeks', salary: '$48,310' },
      { title: 'Diesel Mechanic', funding: 'ITA', duration: '6-24 months', salary: '$52,020' },
      { title: 'Aircraft Mechanic', funding: 'ITA + Pell', duration: '18-24 months', salary: '$65,550' },
      { title: 'Logistics Coordinator', funding: 'ITA', duration: '6-12 months', salary: '$47,810' }
    ]
  }
];

// Funding comparison
const FUNDING_COMPARISON = [
  { feature: 'Maximum Amount', ita: '$10,000-$15,000', pell: '$7,395/year', taa: 'Full tuition', apprenticeship: 'N/A (paid)' },
  { feature: 'Income Requirement', ita: 'WIOA eligible', pell: 'Need-based', taa: 'Trade-affected', apprenticeship: 'None' },
  { feature: 'Repayment Required', ita: 'No', pell: 'No', taa: 'No', apprenticeship: 'No' },
  { feature: 'Training Type', ita: 'ETPL programs', pell: 'Title IV schools', taa: 'Approved programs', apprenticeship: 'Registered programs' },
  { feature: 'Stackable with Others', ita: 'Yes', pell: 'Yes', taa: 'Limited', apprenticeship: 'Sometimes' },
  { feature: 'Duration', ita: 'Up to 2 years', pell: 'Up to 6 years', taa: 'Up to 130 weeks', apprenticeship: '1-6 years' }
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: 'Can I combine different funding sources?',
    answer: 'Yes! Many students combine ITA with Pell Grants to cover more costs. Your career counselor and school financial aid office can help you maximize available funding. WIOA requires you to apply for other funding first, so ITA often fills the gap after Pell.'
  },
  {
    question: 'What if my ITA doesn\'t cover the full program cost?',
    answer: 'If your ITA doesn\'t cover everything, you may be able to: (1) Combine with Pell Grant, (2) Apply for state-specific grants, (3) Use employer tuition assistance, (4) Consider shorter/less expensive programs, or (5) Request additional ITA funding if available in your area.'
  },
  {
    question: 'How long does it take to get ITA approved?',
    answer: 'Typically 2-4 weeks from initial career center visit to ITA approval. The process includes eligibility determination, career counseling, training program research, and paperwork. Plan ahead and allow time before your training start date.'
  },
  {
    question: 'What happens if I drop out of training?',
    answer: 'If you leave training early, you may not receive additional WIOA funding for future training. Communicate with your career counselor if you\'re struggling - they may be able to provide supportive services or help you transfer programs. ITAs don\'t require repayment even if you don\'t complete.'
  },
  {
    question: 'Do I have to be unemployed to get an ITA?',
    answer: 'Not necessarily. WIOA Adult program serves employed individuals who need training for self-sufficient employment. If you\'re underemployed or in a dead-end job, you may qualify. Dislocated workers and youth have different eligibility criteria.'
  },
  {
    question: 'Can I use funding for online training programs?',
    answer: 'Yes, if the online program is on your state\'s Eligible Training Provider List (ETPL). Many coding bootcamps, healthcare programs, and certificate courses are approved for ITA funding. Check with your career center for approved online options.'
  }
];

export default function TrainingFundingPage() {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <DollarSign className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Training Funding & Financial Aid
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Don't let cost stop you. Learn about free training programs, ITAs, grants,
              and other ways to fund your career training.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Apply for ITA
              </Link>
              <Link
                to="/workforce/fafsa-assistant"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                FAFSA Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-900/50 border-y border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400">$10K+</div>
              <div className="text-slate-400 text-sm">ITA Funding Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">$0</div>
              <div className="text-slate-400 text-sm">Repayment Required</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">2-4 wks</div>
              <div className="text-slate-400 text-sm">Approval Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">1000s</div>
              <div className="text-slate-400 text-sm">Approved Programs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Sources */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Training Funding Options</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Multiple funding sources can help pay for your career training. Click each to learn more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FUNDING_SOURCES.map((source) => {
              const Icon = source.icon;
              const isExpanded = expandedSource === source.id;
              const colorClasses = {
                emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              };

              return (
                <div
                  key={source.id}
                  className={`bg-slate-900 border rounded-xl overflow-hidden transition ${
                    isExpanded ? (fundingBorderColors[source.color] || 'border-slate-500') : 'border-slate-800'
                  }`}
                >
                  <button
                    onClick={() => setExpandedSource(isExpanded ? null : source.id)}
                    className="w-full p-6 text-left hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${colorClasses[source.color]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white">{source.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">{source.description}</p>
                        <div className="flex gap-4 mt-3 text-sm">
                          <span className="text-emerald-400 font-medium">{source.maxAmount}</span>
                          <span className="text-slate-500">|</span>
                          <span className="text-slate-300">{source.duration}</span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-800">
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {/* Features */}
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-400" />
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {source.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Eligibility */}
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-400" />
                            Eligibility
                          </h4>
                          <ul className="space-y-2">
                            {source.eligibility.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                                <Target className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Process */}
                      <div className="mt-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-purple-400" />
                          How to Apply
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {source.process.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg">
                              <span className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {idx + 1}
                              </span>
                              <span className="text-slate-300 text-sm">{step}</span>
                            </div>
                          ))}
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

      {/* Comparison Table */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Compare Funding Options</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Side-by-side comparison of major training funding sources.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-400 font-medium">Feature</th>
                  <th className="px-4 py-3 text-center text-emerald-400 font-medium">ITA</th>
                  <th className="px-4 py-3 text-center text-blue-400 font-medium">Pell Grant</th>
                  <th className="px-4 py-3 text-center text-purple-400 font-medium">TAA</th>
                  <th className="px-4 py-3 text-center text-amber-400 font-medium">Apprenticeship</th>
                </tr>
              </thead>
              <tbody>
                {FUNDING_COMPARISON.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-800">
                    <td className="px-4 py-3 text-white font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.ita}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.pell}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.taa}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.apprenticeship}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Careers by Funding */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Fundable In-Demand Careers</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Popular career paths that qualify for training funding through ITAs and other programs.
            </p>
          </div>

          {/* Field tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {FUNDED_CAREERS.map((field) => {
              const Icon = field.icon;
              return (
                <button
                  key={field.field}
                  onClick={() => setSelectedField(selectedField === field.field ? null : field.field)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                    selectedField === field.field
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {field.field}
                </button>
              );
            })}
          </div>

          {/* Careers grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(selectedField
              ? FUNDED_CAREERS.filter(f => f.field === selectedField)
              : FUNDED_CAREERS
            ).map((field) =>
              field.careers.map((career, idx) => (
                <div
                  key={`${field.field}-${idx}`}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/50 transition"
                >
                  <h4 className="text-white font-semibold mb-2">{career.title}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Funding:</span>
                      <span className="text-emerald-400">{career.funding}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Duration:</span>
                      <span className="text-slate-300">{career.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Avg Salary:</span>
                      <span className="text-white font-medium">{career.salary}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/workforce/training-providers"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Search All Training Programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ITA Calculator Preview */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Calculator className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Estimate Your Funding</h2>
                <p className="text-slate-400">See how much training funding you might receive</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">If Pell Eligible</div>
                <div className="text-2xl font-bold text-blue-400">Up to $7,395</div>
                <div className="text-slate-500 text-xs">Per academic year</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Plus ITA</div>
                <div className="text-2xl font-bold text-emerald-400">+ $10,000</div>
                <div className="text-slate-500 text-xs">Average maximum</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Total Potential</div>
                <div className="text-2xl font-bold text-white">$17,395+</div>
                <div className="text-slate-500 text-xs">Combined funding</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/workforce/fafsa-assistant"
                className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                Complete FAFSA
              </Link>
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Apply for ITA
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
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
                    <HelpCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
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
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Fund Your Training?
            </h2>
            <p className="text-slate-300 mb-6">
              Visit your local American Job Center to learn about ITA eligibility and apply for funding.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
              >
                <Building2 className="h-5 w-5" />
                Find Career Center
              </Link>
              <Link
                to="/workforce/training-providers"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <GraduationCap className="h-5 w-5" />
                Browse Training Programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
