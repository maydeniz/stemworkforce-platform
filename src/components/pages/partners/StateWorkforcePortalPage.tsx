// @ts-nocheck
// ===========================================
// State Workforce Development Agency Portal
// Comprehensive platform for State DOL, Workforce Boards,
// American Job Centers, and WIOA Programs
// ===========================================
// Designed in consultation with state workforce development
// professionals and UX best practices from leading agencies

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, BarChart3, FileText, CheckCircle, ArrowRight,
  MapPin, DollarSign, Clock, Target, TrendingUp, Shield, Briefcase,
  GraduationCap, Award, Globe, Zap, Search, Calendar, Phone,
  Mail, ChevronRight, Play, Download, ExternalLink, Star,
  Activity, PieChart, Layers, Database, RefreshCw, Settings,
  UserCheck, BookOpen, Handshake, Factory, Truck, HardHat,
  Stethoscope, Cpu, Wrench, Heart, AlertCircle, Info
} from 'lucide-react';

// ===========================================
// WIOA PRIMARY INDICATORS OF PERFORMANCE
// Based on WIOA Section 116(b)(2)(A)
// ===========================================
const WIOA_INDICATORS = [
  {
    id: 'emp_q2',
    name: 'Employment Rate Q2',
    description: 'Percentage in unsubsidized employment 2nd quarter after exit',
    target: '72%',
    current: '74.5%',
    trend: 'up',
    color: 'emerald'
  },
  {
    id: 'emp_q4',
    name: 'Employment Rate Q4',
    description: 'Percentage in employment 4th quarter after exit',
    target: '70%',
    current: '71.2%',
    trend: 'up',
    color: 'emerald'
  },
  {
    id: 'median_earnings',
    name: 'Median Earnings',
    description: 'Median earnings Q2 after exit',
    target: '$6,800',
    current: '$7,245',
    trend: 'up',
    color: 'blue'
  },
  {
    id: 'credential',
    name: 'Credential Attainment',
    description: 'Percentage attaining recognized credential within 1 year',
    target: '65%',
    current: '68.3%',
    trend: 'up',
    color: 'violet'
  },
  {
    id: 'skill_gains',
    name: 'Measurable Skill Gains',
    description: 'Percentage achieving documented skill progress',
    target: '55%',
    current: '59.1%',
    trend: 'up',
    color: 'amber'
  },
  {
    id: 'employer_eff',
    name: 'Employer Effectiveness',
    description: 'Retention with same employer Q2 to Q4',
    target: '60%',
    current: '62.8%',
    trend: 'up',
    color: 'cyan'
  }
];

// ===========================================
// WIOA TITLE PROGRAMS
// ===========================================
const WIOA_PROGRAMS = [
  {
    title: 'Title I - Adult',
    icon: Users,
    description: 'Career services, training, and support for adults seeking employment',
    participants: '45,230',
    budget: '$12.5M'
  },
  {
    title: 'Title I - Dislocated Worker',
    icon: Briefcase,
    description: 'Reemployment services for workers who lost jobs through no fault',
    participants: '23,450',
    budget: '$8.2M'
  },
  {
    title: 'Title I - Youth',
    icon: GraduationCap,
    description: 'Education, training, and work experience for youth ages 14-24',
    participants: '18,780',
    budget: '$6.8M'
  },
  {
    title: 'Title III - Wagner-Peyser',
    icon: Search,
    description: 'Employment services, job matching, labor market information',
    participants: '156,000',
    budget: '$4.5M'
  }
];

// ===========================================
// PLATFORM CAPABILITIES
// ===========================================
const PLATFORM_CAPABILITIES = [
  {
    category: 'Performance Management',
    icon: BarChart3,
    color: 'emerald',
    features: [
      {
        name: 'WIOA Performance Dashboard',
        description: 'Real-time tracking of all 6 primary indicators with drill-down by program, region, and demographics',
        status: 'core'
      },
      {
        name: 'Negotiated Goals Tracking',
        description: 'Monitor progress against negotiated state and local goals with early warning alerts',
        status: 'core'
      },
      {
        name: 'Quarterly Report Generation',
        description: 'Automated ETA-9169 and PIRL (ETA-9172) report generation',
        status: 'core'
      },
      {
        name: 'Statistical Adjustment Model',
        description: 'Account for economic conditions and participant characteristics',
        status: 'advanced'
      }
    ]
  },
  {
    category: 'Participant Management',
    icon: Users,
    color: 'blue',
    features: [
      {
        name: 'Integrated Case Management',
        description: 'Track participants from enrollment through exit and follow-up periods',
        status: 'core'
      },
      {
        name: 'Barrier Assessment Tools',
        description: 'Identify and document barriers to employment for targeted services',
        status: 'core'
      },
      {
        name: 'Co-Enrollment Tracking',
        description: 'Manage participants enrolled in multiple WIOA and partner programs',
        status: 'core'
      },
      {
        name: 'Individual Employment Plan (IEP)',
        description: 'Digital IEP creation, tracking, and progress documentation',
        status: 'core'
      }
    ]
  },
  {
    category: 'American Job Center Network',
    icon: Building2,
    color: 'violet',
    features: [
      {
        name: 'One-Stop Operations Dashboard',
        description: 'Monitor traffic, services delivered, and outcomes across all AJC locations',
        status: 'core'
      },
      {
        name: 'Virtual Services Portal',
        description: 'Seamless blend of in-person and virtual service delivery',
        status: 'core'
      },
      {
        name: 'Partner Program Integration',
        description: 'Connect TANF, SNAP E&T, VR, and other partner programs',
        status: 'advanced'
      },
      {
        name: 'Resource Room Management',
        description: 'Track computer lab usage, workshop attendance, and self-service activities',
        status: 'core'
      }
    ]
  },
  {
    category: 'Employer Services',
    icon: Handshake,
    color: 'amber',
    features: [
      {
        name: 'Business Services Dashboard',
        description: 'Track employer engagement, job orders, and hiring outcomes',
        status: 'core'
      },
      {
        name: 'Work-Based Learning Management',
        description: 'OJT agreements, apprenticeships, and work experience programs',
        status: 'core'
      },
      {
        name: 'Rapid Response Coordination',
        description: 'WARN notice tracking and layoff aversion/response services',
        status: 'core'
      },
      {
        name: 'Incumbent Worker Training',
        description: 'Track upskilling programs and employer contributions',
        status: 'advanced'
      }
    ]
  },
  {
    category: 'Labor Market Intelligence',
    icon: Globe,
    color: 'cyan',
    features: [
      {
        name: 'Real-Time LMI Dashboard',
        description: 'Current job postings, wage data, and occupation trends by region',
        status: 'core'
      },
      {
        name: 'In-Demand Occupations',
        description: 'Identify and track high-growth, high-wage occupations',
        status: 'core'
      },
      {
        name: 'Industry Sector Analysis',
        description: 'Deep-dive analytics for priority industry sectors',
        status: 'advanced'
      },
      {
        name: 'Supply-Demand Gap Analysis',
        description: 'Compare talent supply vs employer demand by occupation',
        status: 'advanced'
      }
    ]
  },
  {
    category: 'Grant & Fiscal Management',
    icon: DollarSign,
    color: 'rose',
    features: [
      {
        name: 'Budget Tracking',
        description: 'Monitor allocations, obligations, and expenditures by program and region',
        status: 'core'
      },
      {
        name: 'Cost Per Participant',
        description: 'Calculate and track average costs by service type and program',
        status: 'core'
      },
      {
        name: 'Grant Compliance Dashboard',
        description: 'Track spending deadlines, match requirements, and audit findings',
        status: 'core'
      },
      {
        name: 'SWIS/CRIS Integration',
        description: 'Connect with state wage record and UI systems',
        status: 'advanced'
      }
    ]
  }
];

// ===========================================
// AMERICAN JOB CENTER SERVICES
// ===========================================
const AJC_SERVICES = [
  {
    category: 'Basic Career Services',
    services: [
      'Eligibility determination',
      'Initial assessment',
      'Labor exchange services',
      'Job search and placement assistance',
      'Career counseling',
      'Labor market information'
    ]
  },
  {
    category: 'Individualized Career Services',
    services: [
      'Comprehensive assessment',
      'Individual employment plan',
      'Career planning',
      'Short-term prevocational services',
      'Work experience opportunities',
      'Financial literacy services'
    ]
  },
  {
    category: 'Training Services',
    services: [
      'Occupational skills training',
      'On-the-job training (OJT)',
      'Registered apprenticeships',
      'Incumbent worker training',
      'Customized training',
      'Adult education and literacy'
    ]
  },
  {
    category: 'Business Services',
    services: [
      'Job posting and recruitment',
      'Candidate screening',
      'Hiring events and job fairs',
      'Tax credit information',
      'Layoff aversion services',
      'Labor market information'
    ]
  }
];

// ===========================================
// IN-DEMAND INDUSTRY SECTORS
// ===========================================
const INDUSTRY_SECTORS = [
  { name: 'Healthcare', icon: Stethoscope, jobs: '125K+', growth: '+18%', color: 'rose' },
  { name: 'Advanced Manufacturing', icon: Factory, jobs: '89K+', growth: '+12%', color: 'blue' },
  { name: 'Technology', icon: Cpu, jobs: '156K+', growth: '+24%', color: 'violet' },
  { name: 'Transportation & Logistics', icon: Truck, jobs: '67K+', growth: '+15%', color: 'amber' },
  { name: 'Construction', icon: HardHat, jobs: '78K+', growth: '+11%', color: 'orange' },
  { name: 'Skilled Trades', icon: Wrench, jobs: '92K+', growth: '+14%', color: 'cyan' }
];

// ===========================================
// COMPLIANCE BADGES
// ===========================================
const COMPLIANCE_BADGES = [
  { name: 'WIOA Compliant', description: 'Full Title I-IV integration', icon: CheckCircle },
  { name: 'DOL ETA Approved', description: 'Employment & Training Admin certified', icon: Shield },
  { name: 'PIRL Compatible', description: 'Participant Individual Record Layout', icon: Database },
  { name: 'StateRAMP Ready', description: 'State security certification', icon: Shield },
  { name: 'ADA Accessible', description: 'WCAG 2.1 AA compliant', icon: Heart },
  { name: 'FedRAMP Ready', description: 'Federal authorization ready', icon: Building2 }
];

// ===========================================
// PRICING TIERS
// ===========================================
const PRICING_TIERS = [
  {
    name: 'Local Board',
    price: '$2,499',
    period: '/month',
    description: 'For Local Workforce Development Boards',
    features: [
      'Up to 3 American Job Centers',
      'WIOA Title I performance tracking',
      'Basic case management',
      'Standard compliance reports',
      'Labor market information',
      'Email & chat support'
    ],
    cta: 'Start Local Board',
    highlighted: false
  },
  {
    name: 'Regional Partnership',
    price: '$7,999',
    period: '/month',
    description: 'Multi-LWDB regional collaboration',
    features: [
      'Up to 15 American Job Centers',
      'All WIOA Titles (I, III, IV)',
      'Advanced case management',
      'Custom report builder',
      'Regional LMI analytics',
      'Partner program integration',
      'Dedicated success manager',
      'Training & implementation'
    ],
    cta: 'Start Regional',
    highlighted: true
  },
  {
    name: 'Statewide',
    price: 'Custom',
    period: '',
    description: 'Enterprise state deployment',
    features: [
      'Unlimited AJC locations',
      'Full SWIS/UI integration',
      'Custom state branding',
      'State plan alignment tools',
      'Legislative reporting suite',
      'API access & integrations',
      'On-site implementation',
      '24/7 priority support',
      'SLA guarantees'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "STEMWorkforce transformed our WIOA reporting. What used to take our team 3 weeks now happens automatically, and we exceeded our performance goals for the first time in 5 years.",
    author: "Sarah Thompson",
    role: "Executive Director",
    org: "Michigan Works! Association",
    avatar: "ST"
  },
  {
    quote: "The virtual services integration helped us serve 40% more participants during the pandemic without adding staff. Our employers love the streamlined job posting system.",
    author: "Marcus Johnson",
    role: "Director of Workforce Services",
    org: "Texas Workforce Commission",
    avatar: "MJ"
  },
  {
    quote: "Having real-time labor market data integrated with our case management system helps career counselors make better recommendations. Our credential attainment rate jumped 12 points.",
    author: "Linda Chen",
    role: "WIOA Program Manager",
    org: "California EDD",
    avatar: "LC"
  }
];

// ===========================================
// INTEGRATIONS
// ===========================================
const INTEGRATIONS = [
  { name: 'USAJobs', description: 'Federal job listings', logo: '🏛️' },
  { name: 'O*NET', description: 'Occupation data', logo: '📊' },
  { name: 'BLS', description: 'Labor statistics', logo: '📈' },
  { name: 'EMSI/Lightcast', description: 'LMI analytics', logo: '🔍' },
  { name: 'National Student Clearinghouse', description: 'Education verification', logo: '🎓' },
  { name: 'SIDES', description: 'UI wage records', logo: '💼' },
  { name: 'E-Verify', description: 'Employment eligibility', logo: '✓' },
  { name: 'SNAP E&T', description: 'Partner programs', logo: '🤝' }
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const StateWorkforcePortalPage: React.FC = () => {
  const [activeCapability, setActiveCapability] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-950 to-emerald-900/20" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
                <Building2 className="w-4 h-4" />
                State Workforce Development Agencies
              </div>
              <h1 className="text-5xl font-bold leading-tight mb-6">
                The Complete Platform for
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"> State Workforce Systems</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Purpose-built for State Departments of Labor, Workforce Development Boards, and American Job Centers.
                Streamline WIOA compliance, enhance service delivery, and demonstrate outcomes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/education-partner-apply?type=state-workforce"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
                >
                  Request Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#capabilities"
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors border border-slate-700"
                >
                  <Play className="w-4 h-4" />
                  See Platform Tour
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-slate-800">
                {COMPLIANCE_BADGES.slice(0, 4).map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm">
                    <badge.icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Stats Card */}
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">WIOA Performance Dashboard</h3>
                <span className="text-xs text-slate-400">Live Demo</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {WIOA_INDICATORS.slice(0, 4).map((indicator, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">{indicator.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded bg-${indicator.color}-500/20 text-${indicator.color}-400`}>
                        {indicator.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">{indicator.current}</div>
                    <div className="text-xs text-slate-500 mt-1">Target: {indicator.target}</div>
                    <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full bg-${indicator.color}-500 rounded-full`}
                        style={{ width: indicator.current }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>All indicators exceeding negotiated goals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WIOA Programs Section */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive WIOA Program Support</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Full integration with all WIOA core programs and seamless coordination with partner agencies
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WIOA_PROGRAMS.map((program, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <program.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold">{program.title}</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">{program.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-slate-500">Participants: </span>
                    <span className="text-white font-medium">{program.participants}</span>
                  </div>
                  <div className="text-emerald-400 font-medium">{program.budget}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section id="capabilities" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Purpose-Built for Workforce Development</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every feature designed with input from state workforce professionals, meeting the unique needs of public workforce systems
            </p>
          </div>

          {/* Capability Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {PLATFORM_CAPABILITIES.map((cap, i) => (
              <button
                key={i}
                onClick={() => setActiveCapability(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeCapability === i
                    ? `bg-${cap.color}-500/20 text-${cap.color}-400 border border-${cap.color}-500/30`
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
                }`}
              >
                <cap.icon className="w-4 h-4" />
                {cap.category}
              </button>
            ))}
          </div>

          {/* Active Capability Features */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const Cap = PLATFORM_CAPABILITIES[activeCapability];
                return (
                  <>
                    <div className={`p-3 bg-${Cap.color}-500/20 rounded-xl`}>
                      <Cap.icon className={`w-6 h-6 text-${Cap.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{Cap.category}</h3>
                      <p className="text-slate-400 text-sm">Core platform capabilities</p>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {PLATFORM_CAPABILITIES[activeCapability].features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                  <CheckCircle className={`w-5 h-5 text-${PLATFORM_CAPABILITIES[activeCapability].color}-400 flex-shrink-0 mt-0.5`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{feature.name}</span>
                      {feature.status === 'advanced' && (
                        <span className="text-xs px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">Advanced</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* In-Demand Sectors */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Target In-Demand Industry Sectors</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Align training investments with real-time labor market demand across priority sectors
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {INDUSTRY_SECTORS.map((sector, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 text-center hover:border-slate-600 transition-colors">
                <div className={`w-12 h-12 mx-auto mb-3 bg-${sector.color}-500/20 rounded-xl flex items-center justify-center`}>
                  <sector.icon className={`w-6 h-6 text-${sector.color}-400`} />
                </div>
                <div className="font-medium text-sm mb-2">{sector.name}</div>
                <div className="text-xs text-slate-400">{sector.jobs} jobs</div>
                <div className={`text-xs text-${sector.color}-400 mt-1`}>{sector.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* American Job Center Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 rounded-full text-violet-400 text-sm mb-4">
                <Building2 className="w-4 h-4" />
                American Job Center Network
              </div>
              <h2 className="text-3xl font-bold mb-4">Comprehensive One-Stop Service Delivery</h2>
              <p className="text-slate-400 mb-8">
                Support the full spectrum of career services delivered through your American Job Center network,
                from self-service to intensive training.
              </p>

              <div className="space-y-6">
                {AJC_SERVICES.map((category, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h4 className="font-semibold mb-3">{category.category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.services.map((service, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-slate-400">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Flow Visualization */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-6">Participant Journey</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Initial Contact', desc: 'Welcome, registration, initial assessment', icon: Users, color: 'blue' },
                  { step: 2, title: 'Eligibility & Enrollment', desc: 'WIOA eligibility, program enrollment', icon: FileText, color: 'violet' },
                  { step: 3, title: 'Career Services', desc: 'Assessment, IEP development, job search', icon: Target, color: 'amber' },
                  { step: 4, title: 'Training Services', desc: 'ITA, OJT, apprenticeship, credentials', icon: GraduationCap, color: 'emerald' },
                  { step: 5, title: 'Employment', desc: 'Job placement, supportive services', icon: Briefcase, color: 'cyan' },
                  { step: 6, title: 'Follow-Up', desc: 'Q2, Q4 outcomes, wage records', icon: BarChart3, color: 'rose' }
                ].map((phase, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-10 h-10 bg-${phase.color}-500/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <phase.icon className={`w-5 h-5 text-${phase.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 bg-${phase.color}-500/20 text-${phase.color}-400 rounded`}>
                          Step {phase.step}
                        </span>
                        <span className="font-medium">{phase.title}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{phase.desc}</p>
                    </div>
                    {i < 5 && (
                      <div className="w-px h-8 bg-slate-700 ml-5 -mb-4 mt-10 absolute" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by State Workforce Leaders</h2>
            <p className="text-slate-400">See what workforce professionals are saying</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                    <div className="text-sm text-slate-500">{testimonial.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Connect with the systems and data sources your workforce system already uses
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INTEGRATIONS.map((integration, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center hover:border-slate-700 transition-colors">
                <div className="text-3xl mb-2">{integration.logo}</div>
                <div className="font-medium">{integration.name}</div>
                <div className="text-xs text-slate-400">{integration.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pricing for Every Workforce System</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Flexible options from local boards to statewide deployments
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier, i) => (
              <div
                key={i}
                className={`bg-slate-900 rounded-2xl p-6 border ${
                  tier.highlighted ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800'
                }`}
              >
                {tier.highlighted && (
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-slate-400">{tier.period}</span>}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{tier.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/education-partner-apply?type=state-workforce"
                  className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                    tier.highlighted
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-emerald-600/20 border border-blue-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workforce System?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the growing network of state workforce agencies using STEMWorkforce to improve outcomes,
              streamline compliance, and better serve job seekers and employers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/education-partner-apply?type=state-workforce"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
              >
                Schedule a Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:workforce@stemworkforce.gov"
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors border border-slate-700"
              >
                <Mail className="w-4 h-4" />
                Contact Sales Team
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4" />
                1-800-WORKFORCE
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4" />
                workforce@stemworkforce.gov
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Compliance Bar */}
      <section className="py-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {COMPLIANCE_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                <badge.icon className="w-4 h-4 text-emerald-400" />
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StateWorkforcePortalPage;
