// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Car,
  Home,
  Baby,
  Briefcase,
  GraduationCap,
  DollarSign,
  Phone,
  MapPin,
  CheckCircle,
  FileText,
  Users,
  Clock,
  ArrowRight,
  Building2,
  Shield,
  Stethoscope,
  Utensils,
  Bus,
  Wrench,
  BookOpen,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

// WIOA Supportive Services Categories
const SUPPORTIVE_SERVICES = [
  {
    id: 'transportation',
    name: 'Transportation Assistance',
    icon: Car,
    description: 'Help getting to training, job interviews, and work',
    color: 'blue',
    services: [
      { name: 'Bus/Transit Passes', description: 'Monthly or weekly transit passes for public transportation' },
      { name: 'Gas Cards/Mileage Reimbursement', description: 'Fuel assistance for those without public transit access' },
      { name: 'Vehicle Repairs', description: 'Essential car repairs to maintain reliable transportation' },
      { name: 'Rideshare Credits', description: 'Uber/Lyft credits for job interviews or first weeks of work' },
      { name: 'Bicycle Purchase', description: 'Bicycle and safety equipment for commuting' }
    ],
    eligibility: [
      'Enrolled in WIOA-funded training program',
      'Demonstrate transportation barrier to employment',
      'No other means of obtaining transportation assistance'
    ],
    maxAmount: '$1,500/year'
  },
  {
    id: 'childcare',
    name: 'Childcare & Dependent Care',
    icon: Baby,
    description: 'Support for childcare while in training or job searching',
    color: 'pink',
    services: [
      { name: 'Licensed Childcare Subsidies', description: 'Payment assistance for licensed daycare centers' },
      { name: 'Before/After School Care', description: 'Coverage for school-age children during training hours' },
      { name: 'Summer Camp Assistance', description: 'Childcare during summer when school is out' },
      { name: 'Emergency Backup Care', description: 'Short-term care when regular arrangements fall through' },
      { name: 'Elder/Dependent Care', description: 'Care assistance for elderly or disabled dependents' }
    ],
    eligibility: [
      'Enrolled in WIOA program or active job search',
      'Have dependent children under 13 or special needs dependents',
      'Cannot access subsidized childcare through other programs'
    ],
    maxAmount: '$5,000/year'
  },
  {
    id: 'housing',
    name: 'Housing Assistance',
    icon: Home,
    description: 'Emergency housing support to maintain stability during training',
    color: 'emerald',
    services: [
      { name: 'Emergency Rent Assistance', description: 'One-time rent payment to prevent eviction' },
      { name: 'Utility Payment Assistance', description: 'Help with electric, gas, or water bills' },
      { name: 'Security Deposit Assistance', description: 'Help securing new housing closer to training/work' },
      { name: 'Temporary Housing', description: 'Short-term housing during training relocation' }
    ],
    eligibility: [
      'Enrolled in WIOA program',
      'Facing housing emergency that threatens program completion',
      'Exhausted other housing assistance options'
    ],
    maxAmount: '$2,000/year'
  },
  {
    id: 'workclothing',
    name: 'Work Clothing & Tools',
    icon: Briefcase,
    description: 'Professional attire and tools needed for employment',
    color: 'purple',
    services: [
      { name: 'Interview Clothing', description: 'Professional attire for job interviews' },
      { name: 'Work Uniforms', description: 'Required uniforms or dress code clothing' },
      { name: 'Safety Equipment', description: 'Steel-toe boots, safety glasses, hard hats' },
      { name: 'Tools of the Trade', description: 'Required tools for skilled trades occupations' },
      { name: 'Licensing/Testing Fees', description: 'Fees for required occupational licenses' }
    ],
    eligibility: [
      'Accepted job offer or enrolled in training',
      'Cannot afford required work attire/tools',
      'Items directly related to employment'
    ],
    maxAmount: '$800/year'
  },
  {
    id: 'healthcare',
    name: 'Health & Wellness',
    icon: Stethoscope,
    description: 'Medical and health-related support services',
    color: 'red',
    services: [
      { name: 'Physical Exams', description: 'Required physicals for employment or training' },
      { name: 'Drug Screenings', description: 'Pre-employment drug testing fees' },
      { name: 'Vision/Dental Emergency', description: 'Emergency care that impacts work readiness' },
      { name: 'Mental Health Referrals', description: 'Connection to counseling and mental health services' },
      { name: 'Prescription Assistance', description: 'Help accessing necessary medications' }
    ],
    eligibility: [
      'Health issue creates barrier to employment',
      'Not covered by other insurance or programs',
      'Directly impacts ability to work or complete training'
    ],
    maxAmount: '$500/year'
  },
  {
    id: 'education',
    name: 'Educational Support',
    icon: BookOpen,
    description: 'Books, supplies, and educational materials',
    color: 'amber',
    services: [
      { name: 'Textbooks & Course Materials', description: 'Required books and supplies for training' },
      { name: 'Laptop/Computer Assistance', description: 'Technology needed for online learning' },
      { name: 'Internet Access', description: 'Home internet service for remote learning' },
      { name: 'GED/HiSET Testing Fees', description: 'High school equivalency exam fees' },
      { name: 'College Application Fees', description: 'Application and transcript fees' }
    ],
    eligibility: [
      'Enrolled in WIOA-approved training',
      'Cannot afford required educational materials',
      'Materials directly support training completion'
    ],
    maxAmount: '$1,200/year'
  }
];

// Application Process Steps
const APPLICATION_STEPS = [
  {
    step: 1,
    title: 'Visit Your Local Career Center',
    description: 'Meet with a WIOA case manager to discuss your needs and determine eligibility',
    icon: Building2,
    action: 'Find a Career Center'
  },
  {
    step: 2,
    title: 'Complete Needs Assessment',
    description: 'Work with your case manager to identify barriers and document supportive service needs',
    icon: FileText,
    action: 'Download Assessment Form'
  },
  {
    step: 3,
    title: 'Provide Documentation',
    description: 'Submit required documents including ID, income verification, and need documentation',
    icon: CheckCircle,
    action: 'View Required Documents'
  },
  {
    step: 4,
    title: 'Receive Approval & Services',
    description: 'Once approved, receive direct payment or vouchers for approved supportive services',
    icon: DollarSign,
    action: 'Track Application Status'
  }
];

// Required Documents
const REQUIRED_DOCUMENTS = [
  { name: 'Government-issued ID', description: 'Driver\'s license, state ID, or passport' },
  { name: 'Social Security Card', description: 'Original or certified copy' },
  { name: 'Proof of Income', description: 'Pay stubs, tax returns, or benefits statements' },
  { name: 'Proof of Address', description: 'Utility bill, lease, or official mail' },
  { name: 'WIOA Enrollment Documentation', description: 'Proof of program enrollment or eligibility' },
  { name: 'Need Documentation', description: 'Bills, estimates, or quotes for requested services' }
];

// FAQ Items
const FAQ_ITEMS = [
  {
    question: 'Who is eligible for WIOA Supportive Services?',
    answer: 'Adults and dislocated workers enrolled in WIOA Title I programs who face barriers to employment or training participation. You must demonstrate that the supportive service is necessary and that you cannot obtain it through other sources.'
  },
  {
    question: 'How much assistance can I receive?',
    answer: 'Supportive service amounts vary by type and local workforce area. Generally, individual services are capped between $500-$5,000 annually, with a total maximum of $10,000 per program year. Your case manager will explain specific limits.'
  },
  {
    question: 'Can I receive multiple types of supportive services?',
    answer: 'Yes, you can receive multiple supportive services simultaneously if you demonstrate need for each and they are necessary for your employment or training success. Each service is evaluated independently.'
  },
  {
    question: 'How long does approval take?',
    answer: 'Most supportive service requests are reviewed within 3-5 business days. Emergency requests (housing, utilities) may be expedited. Your case manager will provide a timeline based on your specific situation.'
  },
  {
    question: 'What if my request is denied?',
    answer: 'You have the right to appeal any denial. Ask your case manager about the grievance process. You may also be referred to other community resources that can help meet your needs.'
  },
  {
    question: 'Do I need to pay back supportive services?',
    answer: 'No, WIOA supportive services are not loans and do not need to be repaid. However, you must remain enrolled in your WIOA program and making satisfactory progress to continue receiving services.'
  }
];

// Community Resources
const COMMUNITY_RESOURCES = [
  { name: 'SNAP (Food Stamps)', description: 'Food assistance program', link: '#' },
  { name: 'LIHEAP', description: 'Utility bill assistance', link: '#' },
  { name: 'Medicaid', description: 'Healthcare coverage', link: '#' },
  { name: 'TANF', description: 'Temporary cash assistance', link: '#' },
  { name: 'Section 8 Housing', description: 'Rental assistance vouchers', link: '#' },
  { name: '211', description: 'Connect to local services', link: 'tel:211' }
];

export default function SupportiveServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);

  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Heart className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              WIOA Supportive Services
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Remove barriers to your success. Get help with transportation, childcare, housing,
              and other needs while you train for a new career.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Find Your Career Center
              </Link>
              <button
                onClick={() => setShowDocuments(true)}
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                Required Documents
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-slate-900/50 border-y border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400">$10K</div>
              <div className="text-slate-400 text-sm">Max Annual Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">6</div>
              <div className="text-slate-400 text-sm">Service Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">3-5 Days</div>
              <div className="text-slate-400 text-sm">Typical Approval Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">Free</div>
              <div className="text-slate-400 text-sm">No Repayment Required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Services */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Available Supportive Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Click on each category to see specific services, eligibility requirements, and maximum funding amounts.
            </p>
          </div>

          <div className="space-y-4">
            {SUPPORTIVE_SERVICES.map((service) => {
              const Icon = service.icon;
              const isExpanded = expandedService === service.id;
              const colorClasses = {
                blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
                emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                red: 'bg-red-500/20 text-red-400 border-red-500/30',
                amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              };

              return (
                <div key={service.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleService(service.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${colorClasses[service.color]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                        <p className="text-slate-400 text-sm">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 font-semibold hidden sm:block">
                        Up to {service.maxAmount}
                      </span>
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
                        {/* Services List */}
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            Available Services
                          </h4>
                          <ul className="space-y-2">
                            {service.services.map((s, idx) => (
                              <li key={idx} className="bg-slate-800/50 p-3 rounded-lg">
                                <div className="text-white font-medium">{s.name}</div>
                                <div className="text-slate-400 text-sm">{s.description}</div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Eligibility */}
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-amber-400" />
                            Eligibility Requirements
                          </h4>
                          <ul className="space-y-2">
                            {service.eligibility.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-300">
                                <CheckCircle className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                            <div className="text-emerald-400 font-semibold">Maximum Assistance</div>
                            <div className="text-2xl text-white font-bold">{service.maxAmount}</div>
                          </div>
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

      {/* How to Apply */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How to Apply for Supportive Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Follow these steps to request supportive services through your local American Job Center.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {APPLICATION_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative">
                  {step.step < 4 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-slate-700 -z-10" />
                  )}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {step.step}
                      </div>
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{step.description}</p>
                    <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 flex items-center gap-1">
                      {step.action}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Required Documents Modal/Section */}
      {showDocuments && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Required Documents</h3>
              <button
                onClick={() => setShowDocuments(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-400 mb-6">
                Bring these documents to your appointment at the American Job Center:
              </p>
              <ul className="space-y-4">
                {REQUIRED_DOCUMENTS.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">{doc.name}</div>
                      <div className="text-slate-400 text-sm">{doc.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className="text-amber-400 font-semibold">Note</div>
                    <div className="text-slate-300 text-sm">
                      Additional documentation may be required based on your specific situation
                      and the type of support requested.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">
              Common questions about WIOA supportive services
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
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

      {/* Community Resources */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Additional Community Resources</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Beyond WIOA supportive services, these programs may also help with your needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {COMMUNITY_RESOURCES.map((resource, idx) => (
              <a
                key={idx}
                href={resource.link}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-emerald-500/50 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-white font-medium">{resource.name}</div>
                  <div className="text-slate-400 text-sm">{resource.description}</div>
                </div>
                <ExternalLink className="h-5 w-5 text-slate-500 group-hover:text-emerald-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-300 mb-6">
              Contact your local American Job Center to speak with a WIOA case manager
              about supportive services that can help you succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Find Your Career Center
              </Link>
              <a
                href="tel:1-877-872-5627"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Call 1-877-US2-JOBS
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
