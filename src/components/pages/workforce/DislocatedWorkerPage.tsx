// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Briefcase,
  GraduationCap,
  DollarSign,
  Heart,
  Phone,
  FileText,
  Users,
  Building2,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  Shield,
  TrendingUp,
  BookOpen,
  Laptop,
  Wrench,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  Target,
  Award,
  Handshake
} from 'lucide-react';

// Eligibility categories for dislocated workers
const ELIGIBILITY_CATEGORIES = [
  {
    id: 'layoff',
    title: 'Laid Off Workers',
    description: 'Lost your job through no fault of your own due to layoff, plant closure, or reduction in force',
    icon: AlertTriangle,
    criteria: [
      'Terminated or laid off through no fault of your own',
      'Received notice of layoff or plant closure',
      'Eligible for or exhausted unemployment insurance'
    ]
  },
  {
    id: 'self-employed',
    title: 'Self-Employed / Business Owners',
    description: 'Business closed due to economic conditions',
    icon: Building2,
    criteria: [
      'Self-employed but business closed',
      'Lost income due to economic downturn',
      'Natural disaster caused business failure'
    ]
  },
  {
    id: 'displaced-homemaker',
    title: 'Displaced Homemakers',
    description: 'Previously provided unpaid household services and now need employment',
    icon: Heart,
    criteria: [
      'Previously provided unpaid services to family members in the home',
      'No longer supported by spouse due to death, disability, separation, or divorce',
      'Unemployed or underemployed and having difficulty obtaining employment'
    ]
  },
  {
    id: 'spouse-military',
    title: 'Military Spouses',
    description: 'Spouse of active duty military who lost employment due to relocation',
    icon: Shield,
    criteria: [
      'Spouse of active duty military member',
      'Lost employment due to military relocation',
      'Unemployed or underemployed spouse of service member'
    ]
  }
];

// Available services
const SERVICES = [
  {
    id: 'career-counseling',
    title: 'Career Counseling & Assessment',
    description: 'One-on-one guidance to explore career options based on your skills and interests',
    icon: Users,
    details: [
      'Skills and aptitude assessments',
      'Career exploration and planning',
      'Labor market information',
      'Transferable skills analysis'
    ]
  },
  {
    id: 'job-search',
    title: 'Job Search Assistance',
    description: 'Tools and support to find your next job opportunity',
    icon: Briefcase,
    details: [
      'Resume and cover letter writing',
      'Interview preparation and coaching',
      'Job matching and referrals',
      'Access to job fairs and hiring events'
    ]
  },
  {
    id: 'training',
    title: 'Skills Training',
    description: 'Occupational skills training for in-demand careers',
    icon: GraduationCap,
    details: [
      'Individual Training Accounts (ITAs)',
      'On-the-job training (OJT) programs',
      'Registered Apprenticeships',
      'Customized training with employers'
    ]
  },
  {
    id: 'supportive',
    title: 'Supportive Services',
    description: 'Remove barriers to your employment success',
    icon: Heart,
    details: [
      'Transportation assistance',
      'Childcare subsidies',
      'Work clothing and tools',
      'Emergency housing assistance'
    ]
  },
  {
    id: 'rapid-response',
    title: 'Rapid Response Services',
    description: 'Immediate assistance when layoffs are announced',
    icon: AlertCircle,
    details: [
      'On-site services at affected workplaces',
      'Unemployment insurance information',
      'Career transition workshops',
      'Peer support groups'
    ]
  },
  {
    id: 'trade-act',
    title: 'Trade Adjustment Assistance',
    description: 'Special benefits for workers displaced due to foreign trade',
    icon: TrendingUp,
    details: [
      'Extended training benefits',
      'Trade Readjustment Allowances (TRA)',
      'Job search allowances',
      'Relocation allowances'
    ]
  }
];

// Process steps
const ENROLLMENT_STEPS = [
  {
    step: 1,
    title: 'Apply for Unemployment',
    description: 'File for unemployment insurance benefits if you haven\'t already',
    icon: FileText
  },
  {
    step: 2,
    title: 'Visit Career Center',
    description: 'Go to your local American Job Center to register and meet with a counselor',
    icon: Building2
  },
  {
    step: 3,
    title: 'Complete Assessment',
    description: 'Work with your counselor to assess your skills and career goals',
    icon: Target
  },
  {
    step: 4,
    title: 'Create Employment Plan',
    description: 'Develop an Individual Employment Plan (IEP) with specific goals and timelines',
    icon: Calendar
  },
  {
    step: 5,
    title: 'Access Services',
    description: 'Begin receiving training, job search assistance, and support services',
    icon: CheckCircle
  }
];

// Success stories
const SUCCESS_STORIES = [
  {
    name: 'Michael R.',
    previousJob: 'Manufacturing Supervisor',
    newJob: 'IT Project Manager',
    quote: 'After 15 years in manufacturing, I was scared when the plant closed. The dislocated worker program paid for my CompTIA certifications and helped me transition to tech.',
    training: 'IT Project Management Certificate',
    salaryChange: '+15%'
  },
  {
    name: 'Sarah T.',
    previousJob: 'Retail Manager',
    newJob: 'Healthcare Administrator',
    quote: 'I thought my career was over at 52. The career counselors helped me see that my management skills were valuable in healthcare.',
    training: 'Healthcare Administration Associate Degree',
    salaryChange: '+25%'
  },
  {
    name: 'David L.',
    previousJob: 'Coal Miner',
    newJob: 'Wind Turbine Technician',
    quote: 'The program connected me with an apprenticeship in renewable energy. Now I\'m in a growing field with a future.',
    training: 'Wind Energy Technician Apprenticeship',
    salaryChange: '+10%'
  }
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: 'How long can I receive dislocated worker services?',
    answer: 'Services are available as long as you are actively participating in approved activities and making progress toward employment. Most participants complete within 1-2 years, but there is no strict time limit for WIOA Dislocated Worker services.'
  },
  {
    question: 'Can I receive training while collecting unemployment?',
    answer: 'Yes! In most states, you can continue receiving unemployment benefits while enrolled in approved training. Some states offer extended benefits for those in training. Your career counselor can explain your state\'s specific policies.'
  },
  {
    question: 'What if I find a job before completing training?',
    answer: 'You can exit the program at any time if you find employment. Your career counselor will help you evaluate job offers and determine if accepting is in your best interest. Some training can be completed while working.'
  },
  {
    question: 'Do I have to repay training costs if I don\'t complete?',
    answer: 'No, WIOA training funds are not loans and do not need to be repaid. However, you are expected to make reasonable efforts to complete training and find employment.'
  },
  {
    question: 'Can I choose any training program I want?',
    answer: 'Training must be for an in-demand occupation in your area and be on the state\'s Eligible Training Provider List (ETPL). Your counselor will help you find programs that match your interests and have good job outcomes.'
  },
  {
    question: 'What if I was self-employed?',
    answer: 'Self-employed individuals whose businesses closed due to economic conditions may qualify as dislocated workers. You\'ll need to provide documentation of your business closure.'
  }
];

export default function DislocatedWorkerPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-900 via-slate-900 to-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <TrendingUp className="h-10 w-10 text-amber-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Dislocated Worker Services
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Lost your job? We're here to help. Get free career counseling, skills training,
              and support services to transition to your next career.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-400 transition flex items-center gap-2"
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

      {/* Urgent Notice */}
      <div className="bg-amber-500/10 border-y border-amber-500/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 text-amber-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">
              Just received a layoff notice? Contact your local Career Center immediately for Rapid Response services.
            </span>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="py-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-400">100%</div>
              <div className="text-slate-400 text-sm">Free Services</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">$10K+</div>
              <div className="text-slate-400 text-sm">Training Funding Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">1-on-1</div>
              <div className="text-slate-400 text-sm">Career Counseling</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">2,500+</div>
              <div className="text-slate-400 text-sm">Career Centers Nationwide</div>
            </div>
          </div>
        </div>
      </div>

      {/* Who Qualifies Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Who Qualifies as a Dislocated Worker?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Click on a category to see if you qualify for dislocated worker services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ELIGIBILITY_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isExpanded = selectedCategory === category.id;

              return (
                <div
                  key={category.id}
                  className={`bg-slate-900 border rounded-xl overflow-hidden transition cursor-pointer ${
                    isExpanded ? 'border-amber-500' : 'border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedCategory(isExpanded ? null : category.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500/20 rounded-lg">
                        <Icon className="h-6 w-6 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{category.title}</h3>
                        <p className="text-slate-400 text-sm">{category.description}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-amber-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <h4 className="text-sm font-medium text-white mb-3">Eligibility Criteria:</h4>
                        <ul className="space-y-2">
                          {category.criteria.map((criterion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                              <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              {criterion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
            <p className="text-emerald-400 font-medium mb-2">Not sure if you qualify?</p>
            <p className="text-slate-300 text-sm">
              Don't worry! Visit your local career center for a free eligibility determination.
              Counselors can help you understand all available programs.
            </p>
          </div>
        </div>
      </div>

      {/* Available Services */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Services Available to You</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Dislocated workers have access to a comprehensive range of free services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isExpanded = expandedService === service.id;

              return (
                <div
                  key={service.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Icon className="h-5 w-5 text-amber-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{service.description}</p>

                    <button
                      onClick={() => setExpandedService(isExpanded ? null : service.id)}
                      className="text-amber-400 text-sm font-medium hover:text-amber-300 flex items-center gap-1"
                    >
                      {isExpanded ? 'Show Less' : 'See Details'}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <ul className="mt-4 space-y-2">
                        {service.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enrollment Process */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How to Get Started</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Follow these steps to enroll in dislocated worker services.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-slate-700" />

            <div className="grid lg:grid-cols-5 gap-6">
              {ENROLLMENT_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative text-center">
                    <div className="bg-slate-950 relative z-10 inline-block">
                      <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="text-white font-bold text-xl">{step.step}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Real people who successfully transitioned to new careers with dislocated worker services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{story.name}</div>
                    <div className="text-emerald-400 text-sm font-medium">{story.salaryChange} salary</div>
                  </div>
                </div>

                <blockquote className="text-slate-300 text-sm italic mb-4">
                  "{story.quote}"
                </blockquote>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Before:</span>
                    <span className="text-slate-300">{story.previousJob}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">After:</span>
                    <span className="text-white font-medium">{story.newJob}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400">{story.training}</span>
                  </div>
                </div>
              </div>
            ))}
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
                    <HelpCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
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

      {/* Rapid Response CTA */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-900/50 to-slate-900 border border-red-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Facing a Mass Layoff?</h2>
                </div>
                <p className="text-slate-300 mb-4">
                  If your employer has announced a layoff affecting 50 or more workers, Rapid Response
                  services can be provided on-site to help all affected employees.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    On-site career transition workshops
                  </li>
                  <li className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Group unemployment insurance filing
                  </li>
                  <li className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Immediate access to training information
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-slate-400 mb-4">Employers or unions can request Rapid Response</p>
                <Link
                  to="/workforce/rapid-response"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition"
                >
                  Request Rapid Response
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-900/50 to-slate-900 border border-amber-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Career Transition?
            </h2>
            <p className="text-slate-300 mb-6">
              Visit your local American Job Center today to meet with a career counselor
              and begin accessing dislocated worker services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/workforce/career-centers"
                className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-400 transition flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Find a Career Center
              </Link>
              <Link
                to="/workforce/training-providers"
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              >
                <GraduationCap className="h-5 w-5" />
                Explore Training Programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
