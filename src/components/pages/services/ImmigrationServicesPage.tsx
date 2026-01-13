// ===========================================
// Immigration & Visa Services Page
// H-1B, O-1, EB visa sponsorship and support
// for STEM professionals and employers
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  FileText,
  Users,
  CheckCircle,
  ArrowRight,
  Building2,
  Award,
  Star,
  Phone,
  Calendar,
  AlertTriangle,
  Briefcase,
  Target,
  Plane,
  HelpCircle,
  GraduationCap,
  Shield,
  Landmark,
  Timer,
  UserCheck,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface VisaCategory {
  id: string;
  name: string;
  description: string;
  timeline: string;
  requirements: string[];
  benefits: string[];
  forWhom: string[];
  icon: React.ElementType;
  color: string;
  popular?: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  forEmployers?: boolean;
  forCandidates?: boolean;
}

interface SuccessStory {
  quote: string;
  author: string;
  visa: string;
  company: string;
  timeline: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// ===========================================
// Data
// ===========================================

const visaCategories: VisaCategory[] = [
  {
    id: 'h1b',
    name: 'H-1B Specialty Occupation',
    description: 'The most common work visa for STEM professionals with a bachelor\'s degree or higher in a specialty occupation.',
    timeline: '3-6 months (lottery dependent)',
    requirements: [
      'Bachelor\'s degree or higher in relevant field',
      'Job offer in specialty occupation',
      'Employer willing to sponsor',
      'Prevailing wage compliance',
      'Cap-subject (annual lottery) or cap-exempt',
    ],
    benefits: [
      'Valid for 3 years, extendable to 6',
      'Dual intent (can pursue green card)',
      'Spouse can apply for work authorization',
      'Can change employers (portability)',
      'Premium processing available (15 days)',
    ],
    forWhom: ['Engineers', 'Scientists', 'Researchers', 'IT Professionals', 'Data Scientists'],
    icon: Briefcase,
    color: 'blue',
    popular: true,
  },
  {
    id: 'o1',
    name: 'O-1 Extraordinary Ability',
    description: 'For individuals with extraordinary ability or achievement in their field, demonstrated by sustained national/international acclaim.',
    timeline: '2-4 months',
    requirements: [
      'Extraordinary ability in sciences, arts, business, or athletics',
      'Evidence of sustained acclaim (awards, publications, etc.)',
      'Coming to work in area of extraordinary ability',
      'No lottery or annual cap',
      '8 criteria (must meet 3+)',
    ],
    benefits: [
      'No annual cap or lottery',
      'Initial validity up to 3 years',
      'Unlimited extensions',
      'Can include essential support staff (O-2)',
      'Faster processing available',
    ],
    forWhom: ['Top Researchers', 'Award Winners', 'Distinguished Scientists', 'Tech Leaders', 'Entrepreneurs'],
    icon: Award,
    color: 'purple',
  },
  {
    id: 'eb1',
    name: 'EB-1 Priority Workers',
    description: 'Employment-based green card for priority workers including extraordinary ability, outstanding professors/researchers, and multinational managers.',
    timeline: '1-2 years',
    requirements: [
      'Extraordinary ability (EB-1A) OR',
      'Outstanding professor/researcher (EB-1B) OR',
      'Multinational manager/executive (EB-1C)',
      'No labor certification required (EB-1A)',
      'Permanent job offer (EB-1B, EB-1C)',
    ],
    benefits: [
      'No PERM labor certification (EB-1A)',
      'Priority date immediately current',
      'Spouse and children included',
      'Permanent residency (green card)',
      'Path to citizenship',
    ],
    forWhom: ['Nobel Laureates', 'Senior Scientists', 'Patent Holders', 'Senior Executives', 'Distinguished Researchers'],
    icon: Star,
    color: 'gold',
  },
  {
    id: 'eb2',
    name: 'EB-2 Advanced Degree',
    description: 'Employment-based green card for professionals with advanced degrees or exceptional ability in sciences, arts, or business.',
    timeline: '2-5 years',
    requirements: [
      'Advanced degree (Master\'s or PhD) OR',
      'Bachelor\'s + 5 years experience OR',
      'Exceptional ability with evidence',
      'PERM labor certification (usually)',
      'National Interest Waiver possible (EB-2 NIW)',
    ],
    benefits: [
      'NIW waives employer sponsorship',
      'Self-petition possible (NIW)',
      'Includes spouse and children',
      'Permanent residency',
      'Premium processing for I-140',
    ],
    forWhom: ['PhD Holders', 'Senior Engineers', 'Research Scientists', 'Healthcare Professionals', 'Entrepreneurs (NIW)'],
    icon: GraduationCap,
    color: 'green',
    popular: true,
  },
  {
    id: 'eb3',
    name: 'EB-3 Skilled Workers',
    description: 'Employment-based green card for skilled workers, professionals, and other workers with at least 2 years of experience.',
    timeline: '3-7 years',
    requirements: [
      'Bachelor\'s degree OR',
      '2+ years of relevant experience',
      'Permanent job offer',
      'PERM labor certification required',
      'Employer sponsorship required',
    ],
    benefits: [
      'Lower qualification bar than EB-2',
      'Includes spouse and children',
      'Permanent residency',
      'Employer can request premium processing',
      'Path to citizenship',
    ],
    forWhom: ['Engineers', 'IT Specialists', 'Technicians', 'Healthcare Workers', 'Skilled Tradespeople'],
    icon: Users,
    color: 'teal',
  },
  {
    id: 'l1',
    name: 'L-1 Intracompany Transfer',
    description: 'For multinational companies to transfer executives, managers, or specialized knowledge workers from foreign offices.',
    timeline: '2-4 months',
    requirements: [
      'Employed by company abroad for 1+ year',
      'Coming to US office in executive/managerial role (L-1A) OR',
      'Specialized knowledge role (L-1B)',
      'Company must have qualifying relationship',
      'New office possible (with limitations)',
    ],
    benefits: [
      'No annual cap',
      'Spouse eligible to work (L-2 EAD)',
      'Up to 7 years (L-1A) or 5 years (L-1B)',
      'Dual intent allowed',
      'Blanket L petitions for large employers',
    ],
    forWhom: ['Executives', 'Managers', 'Specialized Employees', 'New Office Founders', 'Global Mobility'],
    icon: Globe,
    color: 'orange',
  },
];

const services: Service[] = [
  {
    id: 'employer-compliance',
    title: 'Employer Immigration Compliance',
    description: 'Ensure your organization meets all immigration compliance requirements, from I-9 audits to LCA posting.',
    icon: Shield,
    features: [
      'I-9 audit and remediation',
      'LCA posting compliance',
      'Public Access File maintenance',
      'H-1B wage level compliance',
      'FDNS site visit preparation',
      'Policy development',
    ],
    forEmployers: true,
  },
  {
    id: 'green-card',
    title: 'Green Card Processing',
    description: 'Full-service employment-based green card processing from PERM through I-485 adjustment of status.',
    icon: Landmark,
    features: [
      'PERM labor certification',
      'I-140 petition preparation',
      'I-485 adjustment of status',
      'Consular processing support',
      'Priority date tracking',
      'Family member petitions',
    ],
    forEmployers: true,
    forCandidates: true,
  },
  {
    id: 'visa-sponsorship',
    title: 'Visa Sponsorship',
    description: 'Complete H-1B, O-1, L-1, and other nonimmigrant visa sponsorship and petition services.',
    icon: FileText,
    features: [
      'Visa category analysis',
      'LCA filing and approval',
      'Petition preparation',
      'RFE response handling',
      'Premium processing coordination',
      'Visa stamping guidance',
    ],
    forEmployers: true,
  },
  {
    id: 'o1-extraordinary',
    title: 'O-1 Visa Strategy',
    description: 'Specialized service for building and presenting O-1 extraordinary ability cases.',
    icon: Award,
    features: [
      'Criteria evaluation',
      'Evidence compilation',
      'Expert letter strategy',
      'Petition letter drafting',
      'Advisory opinion assistance',
      'Premium processing',
    ],
    forCandidates: true,
  },
  {
    id: 'eb2-niw',
    title: 'EB-2 NIW Self-Petition',
    description: 'National Interest Waiver green card strategy for self-petitioning without employer sponsorship.',
    icon: Target,
    features: [
      'NIW eligibility assessment',
      'Evidence development',
      'Expert letter coordination',
      'Petition letter drafting',
      'National interest argument',
      'Self-petition filing',
    ],
    forCandidates: true,
  },
  {
    id: 'cap-exempt',
    title: 'Cap-Exempt H-1B',
    description: 'H-1B strategies for cap-exempt employers (universities, research institutions, nonprofits).',
    icon: GraduationCap,
    features: [
      'Cap-exemption analysis',
      'Non-profit qualification review',
      'University affiliation strategies',
      'Concurrent employment',
      'Cap-gap solutions',
      'Status maintenance',
    ],
    forEmployers: true,
    forCandidates: true,
  },
];

const successStories: SuccessStory[] = [
  {
    quote: "STEM Workforce helped me navigate the O-1 process after H-1B denials. Their expertise in building extraordinary ability cases was invaluable.",
    author: 'Dr. Priya Sharma',
    visa: 'O-1A',
    company: 'AI Research Lab',
    timeline: 'Approved in 3 months',
  },
  {
    quote: "We sponsored 50+ H-1B visas last year with zero denials. Their compliance guidance kept us audit-ready and confident.",
    author: 'Sarah Mitchell',
    visa: 'Employer Program',
    company: 'Tech Startup',
    timeline: '50+ visas processed',
  },
  {
    quote: "The EB-2 NIW route let me get my green card without waiting for employer sponsorship. Now I have the flexibility to grow my career.",
    author: 'Dr. Wei Chen',
    visa: 'EB-2 NIW',
    company: 'Self-petitioner',
    timeline: 'Green card in 18 months',
  },
];

const faqs: FAQ[] = [
  {
    question: 'What is the H-1B lottery and when does it occur?',
    answer: 'The H-1B lottery occurs each year in March for employment starting October 1st. USCIS accepts registrations in early March, conducts a random lottery, and only selected registrations may file full petitions. The annual cap is 65,000 plus 20,000 for US advanced degree holders.',
  },
  {
    question: 'What qualifies someone for an O-1 visa?',
    answer: 'O-1 requires demonstrating extraordinary ability through sustained national or international acclaim. Applicants must meet at least 3 of 8 criteria including awards, publications, judging, original contributions, high salary, and critical roles for distinguished organizations.',
  },
  {
    question: 'How long does the green card process take?',
    answer: 'Timeline varies significantly by category and country of birth. EB-1: 1-2 years. EB-2/EB-3 (most countries): 2-5 years. EB-2/EB-3 (India/China): 10+ years due to per-country caps. EB-2 NIW can be faster as it skips PERM.',
  },
  {
    question: 'Can I change employers on an H-1B?',
    answer: 'Yes! H-1B portability allows you to start working for a new employer as soon as your new H-1B petition is filed (not just approved). The new employer must file a new H-1B petition on your behalf.',
  },
  {
    question: 'What is the EB-2 National Interest Waiver?',
    answer: 'NIW allows you to self-petition for a green card without employer sponsorship or PERM labor certification. You must prove your work has substantial merit, national importance, and that waiving the job offer requirement benefits the US.',
  },
  {
    question: 'Can my spouse work on an H-4 visa?',
    answer: 'Yes, if the H-1B principal has an approved I-140 or is in H-1B status beyond the 6-year limit due to pending green card. The H-4 spouse must file for an Employment Authorization Document (EAD).',
  },
];

// ===========================================
// Components
// ===========================================

const VisaCategoryCard: React.FC<{ visa: VisaCategory; index: number }> = ({ visa, index }) => {
  const Icon = visa.icon;
  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-100 border-blue-500 text-blue-600',
    purple: 'bg-purple-100 border-purple-500 text-purple-600',
    gold: 'bg-amber-100 border-amber-500 text-amber-600',
    green: 'bg-green-100 border-green-500 text-green-600',
    teal: 'bg-teal-100 border-teal-500 text-teal-600',
    orange: 'bg-orange-100 border-orange-500 text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
        visa.popular ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {visa.popular && (
        <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
          Most Common
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorStyles[visa.color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{visa.name}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Timer className="w-4 h-4" />
              <span>{visa.timeline}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{visa.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Ideal For:</h4>
          <div className="flex flex-wrap gap-1">
            {visa.forWhom.map((item, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Benefits:</h4>
          <ul className="space-y-1">
            {visa.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          Learn More
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
            <div className="flex gap-2 mt-1">
              {service.forEmployers && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Employers</span>
              )}
              {service.forCandidates && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Candidates</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{service.description}</p>

        <ul className="space-y-2">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const FAQItem: React.FC<{ faq: FAQ; index: number }> = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900">{faq.question}</span>
        <HelpCircle className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 text-sm">
          {faq.answer}
        </div>
      )}
    </motion.div>
  );
};

// ===========================================
// Main Component
// ===========================================

const ImmigrationServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-6">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">Immigration & Visa Services</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Navigate U.S. Immigration
                <span className="text-blue-400"> With Confidence</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Expert immigration support for STEM professionals and employers.
                From H-1B sponsorship to green card processing, we guide you through
                every step of the journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Assess Your Options
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Speak with an Attorney
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Globe className="w-10 h-10 text-blue-400 mb-3" />
                <div className="text-3xl font-bold">5,000+</div>
                <div className="text-gray-300">Visas Processed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-10 h-10 text-blue-400 mb-3" />
                <div className="text-3xl font-bold">98%</div>
                <div className="text-gray-300">Approval Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Building2 className="w-10 h-10 text-blue-400 mb-3" />
                <div className="text-3xl font-bold">500+</div>
                <div className="text-gray-300">Employer Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <UserCheck className="w-10 h-10 text-blue-400 mb-3" />
                <div className="text-3xl font-bold">50+</div>
                <div className="text-gray-300">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visa Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Visa Categories We Support
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert guidance across the full range of employment-based immigration options
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visaCategories.map((visa, index) => (
            <VisaCategoryCard key={visa.id} visa={visa} index={index} />
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Immigration Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive support for employers and professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real results from professionals and employers we've helped
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">"{story.quote}"</blockquote>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {story.visa}
                  </span>
                  <span className="text-green-600 text-sm font-medium">{story.timeline}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{story.author}</div>
                  <div className="text-gray-500 text-sm">{story.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Common questions about U.S. immigration for STEM professionals
          </p>
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Legal Disclaimer</h3>
              <p className="text-gray-600">
                This information is for general educational purposes only and does not constitute legal advice.
                Immigration laws are complex and constantly changing. Individual cases vary significantly.
                We strongly recommend consulting with a qualified immigration attorney for advice specific
                to your situation. STEM Workforce works with partner immigration attorneys who specialize
                in employment-based immigration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Immigration Journey?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our immigration specialists. We'll assess your
            options and create a strategy tailored to your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Download Visa Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmigrationServicesPage;
