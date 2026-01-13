// ===========================================
// Security Clearance Processing Services Page
// Clearance sponsorship, processing, and support
// for defense and government contractors
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Building2,
  Award,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Eye,
  ScrollText,
  Scale,
  HelpCircle,
  ClipboardCheck,
  Timer,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface ClearanceLevel {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  timeline: string;
  requirements: string[];
  agencies: string[];
  color: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  priceRange: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
  timeline: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// ===========================================
// Data
// ===========================================

const clearanceLevels: ClearanceLevel[] = [
  {
    id: 'confidential',
    name: 'Confidential',
    abbreviation: 'C',
    description: 'Entry-level clearance for access to information that could cause damage to national security.',
    timeline: '1-3 months',
    requirements: [
      'U.S. Citizenship',
      'Background investigation (NACLC)',
      'Credit check',
      'Criminal history check',
      'Employment verification',
    ],
    agencies: ['DoD', 'DOE', 'DHS'],
    color: 'green',
  },
  {
    id: 'secret',
    name: 'Secret',
    abbreviation: 'S',
    description: 'Mid-level clearance for access to information that could cause serious damage to national security.',
    timeline: '3-6 months',
    requirements: [
      'U.S. Citizenship',
      'Background investigation (T3)',
      'Credit check',
      'Criminal history check',
      'Employment verification (10 years)',
      'Reference interviews',
    ],
    agencies: ['DoD', 'DOE', 'DHS', 'FBI'],
    color: 'yellow',
  },
  {
    id: 'top-secret',
    name: 'Top Secret',
    abbreviation: 'TS',
    description: 'High-level clearance for access to information that could cause exceptionally grave damage to national security.',
    timeline: '6-12 months',
    requirements: [
      'U.S. Citizenship',
      'Single Scope Background Investigation (T5)',
      'Full financial disclosure',
      'Polygraph (for some positions)',
      'Extended reference interviews',
      'Foreign contact disclosure',
    ],
    agencies: ['DoD', 'CIA', 'NSA', 'DOE'],
    color: 'red',
  },
  {
    id: 'ts-sci',
    name: 'TS/SCI',
    abbreviation: 'TS/SCI',
    description: 'Top Secret with Sensitive Compartmented Information access for the most sensitive intelligence programs.',
    timeline: '12-18 months',
    requirements: [
      'Top Secret clearance',
      'Additional SCI indoctrination',
      'Polygraph (CI or Full Scope)',
      'Continuous Evaluation enrollment',
      'Special Access Program briefings',
      'Lifestyle polygraph may be required',
    ],
    agencies: ['CIA', 'NSA', 'NGA', 'DIA', 'NRO'],
    color: 'purple',
  },
  {
    id: 'q-clearance',
    name: 'Q Clearance (DOE)',
    abbreviation: 'Q',
    description: 'DOE equivalent of Top Secret for access to nuclear weapons design information and materials.',
    timeline: '6-12 months',
    requirements: [
      'U.S. Citizenship',
      'T5 investigation',
      'Psychological evaluation',
      'Drug testing',
      'Nuclear-specific background checks',
      'Continuous Evaluation',
    ],
    agencies: ['DOE', 'NNSA', 'National Labs'],
    color: 'orange',
  },
];

const services: Service[] = [
  {
    id: 'sponsorship',
    title: 'Clearance Sponsorship',
    description: 'We sponsor clearance investigations for candidates who need to be cleared for government contract work.',
    icon: Shield,
    features: [
      'Full sponsorship as contractor of record',
      'SF-86 preparation assistance',
      'e-QIP submission support',
      'Investigation liaison',
      'Status tracking and updates',
      'Adjudication support',
    ],
    priceRange: '$2,500 - $15,000',
  },
  {
    id: 'reinstatement',
    title: 'Clearance Reinstatement',
    description: 'Expedited processing for candidates with lapsed clearances (within 2 years of active status).',
    icon: KeyRound,
    features: [
      'Reinstatement eligibility review',
      'Documentation gathering',
      'Fast-track processing',
      'Agency coordination',
      'Status monitoring',
      '2-4 week typical timeline',
    ],
    priceRange: '$1,000 - $3,500',
  },
  {
    id: 'upgrade',
    title: 'Clearance Upgrades',
    description: 'Support for upgrading existing clearances to higher levels (Secret to TS, TS to TS/SCI).',
    icon: TrendingUp,
    features: [
      'Upgrade eligibility assessment',
      'Additional investigation support',
      'Polygraph preparation',
      'SCI indoctrination coordination',
      'SAP access processing',
      'Continuous Evaluation enrollment',
    ],
    priceRange: '$3,500 - $12,000',
  },
  {
    id: 'crossover',
    title: 'Clearance Crossover',
    description: 'Transfer clearances between agencies or from industrial to government (reciprocity processing).',
    icon: ScrollText,
    features: [
      'Reciprocity research',
      'Cross-agency coordination',
      'Documentation preparation',
      'Gap analysis',
      'Investigation bridging',
      'Status verification',
    ],
    priceRange: '$1,500 - $5,000',
  },
  {
    id: 'appeals',
    title: 'Denial Appeals & Mitigation',
    description: 'Expert support for clearance denials, revocations, and adverse action appeals.',
    icon: Scale,
    features: [
      'Case review and analysis',
      'Mitigation strategy development',
      'Appeal letter preparation',
      'Documentation gathering',
      'Hearing representation coordination',
      'Expert witness support',
    ],
    priceRange: '$5,000 - $25,000',
  },
  {
    id: 'consulting',
    title: 'FSO & Security Consulting',
    description: 'Facility Security Officer support, NISPOM compliance, and security program development.',
    icon: Building2,
    features: [
      'Virtual FSO services',
      'NISPOM compliance audits',
      'Security program development',
      'Insider threat programs',
      'Security training',
      'DCSA inspection prep',
    ],
    priceRange: '$150 - $350/hour',
  },
];

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Eligibility Review',
    description: 'We assess your background, identify potential issues, and determine the best path forward.',
    icon: ClipboardCheck,
    timeline: '1-2 days',
  },
  {
    step: 2,
    title: 'SF-86 Preparation',
    description: 'Our specialists help you complete the SF-86 accurately and completely, avoiding common pitfalls.',
    icon: FileText,
    timeline: '1-2 weeks',
  },
  {
    step: 3,
    title: 'Investigation Initiation',
    description: 'We submit your e-QIP, verify receipt, and track the investigation through DCSA.',
    icon: Eye,
    timeline: '1-2 weeks',
  },
  {
    step: 4,
    title: 'Investigation Support',
    description: 'We provide guidance during the investigation, including interview prep and document requests.',
    icon: UserCheck,
    timeline: 'Varies by level',
  },
  {
    step: 5,
    title: 'Adjudication',
    description: 'We monitor the adjudication process and assist with any additional requirements or concerns.',
    icon: Scale,
    timeline: '2-8 weeks',
  },
  {
    step: 6,
    title: 'Clearance Granted',
    description: 'Upon approval, we coordinate your indoctrination and ensure proper system access.',
    icon: ShieldCheck,
    timeline: '1 week',
  },
];

const faqs: FAQ[] = [
  {
    question: 'Who can sponsor a security clearance?',
    answer: 'Only government agencies or cleared contractors with a legitimate need can sponsor security clearances. As a cleared contractor, we can sponsor clearances for candidates working on our government contracts.',
  },
  {
    question: 'Can I get a clearance without a current job offer?',
    answer: 'Generally, no. Clearances require a "need to know" tied to a specific contract or position. However, some contractors (including us) may sponsor clearances for candidates in our talent pipeline for upcoming contracts.',
  },
  {
    question: 'Will past marijuana use disqualify me?',
    answer: 'Not necessarily. Occasional past use (especially if it was years ago) typically won\'t disqualify you. Recent or heavy use is more concerning. Honesty on the SF-86 is critical—lying is an automatic disqualifier.',
  },
  {
    question: 'How long does a clearance take?',
    answer: 'Confidential: 1-3 months. Secret: 3-6 months. Top Secret: 6-12 months. TS/SCI: 12-18 months. Actual times vary based on background complexity and agency backlogs.',
  },
  {
    question: 'What happens if my clearance is denied?',
    answer: 'You have the right to appeal. We can help you understand the reasons for denial, develop mitigation strategies, and prepare your appeal. Many initial denials are successfully overturned.',
  },
  {
    question: 'Do I need a polygraph?',
    answer: 'For most Secret and Top Secret clearances, no. However, certain agencies (CIA, NSA, FBI) and positions (especially TS/SCI) require a counterintelligence or full-scope polygraph.',
  },
];

// ===========================================
// Components
// ===========================================

const ClearanceLevelCard: React.FC<{ level: ClearanceLevel; index: number }> = ({ level, index }) => {
  const colorStyles: Record<string, string> = {
    green: 'bg-green-100 border-green-500 text-green-700',
    yellow: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    red: 'bg-red-100 border-red-500 text-red-700',
    purple: 'bg-purple-100 border-purple-500 text-purple-700',
    orange: 'bg-orange-100 border-orange-500 text-orange-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className={`p-4 border-l-4 ${colorStyles[level.color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">{level.abbreviation}</span>
            <h3 className="text-lg font-bold text-gray-900">{level.name}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-600">
              <Timer className="w-4 h-4" />
              <span className="text-sm">{level.timeline}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4">{level.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements:</h4>
          <ul className="space-y-1">
            {level.requirements.slice(0, 4).map((req, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-1">
          {level.agencies.map((agency, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {agency}
            </span>
          ))}
        </div>
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
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
            <p className="text-slate-600 text-sm font-medium">{service.priceRange}</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{service.description}</p>

        <ul className="space-y-2 mb-4">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
          Learn More
          <ArrowRight className="w-4 h-4" />
        </button>
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

const ClearanceServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full mb-6">
                <Shield className="w-5 h-5 text-slate-300" />
                <span className="text-slate-300 font-medium">Security Clearance Services</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Navigate the Clearance
                <span className="text-slate-400"> Process</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Expert guidance through security clearance sponsorship, processing, and
                maintenance. We've helped thousands of professionals obtain and maintain
                clearances at every level.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Start Clearance Process
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Speak with an Expert
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Shield className="w-10 h-10 text-slate-300 mb-3" />
                <div className="text-3xl font-bold">15K+</div>
                <div className="text-gray-300">Clearances Processed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Clock className="w-10 h-10 text-slate-300 mb-3" />
                <div className="text-3xl font-bold">30%</div>
                <div className="text-gray-300">Faster Than Average</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-10 h-10 text-slate-300 mb-3" />
                <div className="text-3xl font-bold">98%</div>
                <div className="text-gray-300">Approval Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Building2 className="w-10 h-10 text-slate-300 mb-3" />
                <div className="text-3xl font-bold">Cage</div>
                <div className="text-gray-300">Cleared Facility</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clearance Levels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Clearance Levels We Process
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From Confidential to TS/SCI, we support all levels of security clearances
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clearanceLevels.map((level, index) => (
            <ClearanceLevelCard key={level.id} level={level} index={index} />
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Clearance Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive support throughout the entire clearance lifecycle
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A streamlined approach to getting you cleared faster
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {step.timeline}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </motion.div>
            ))}
          </div>
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
              <h3 className="font-bold text-gray-900 mb-2">Important: Honesty is Critical</h3>
              <p className="text-gray-600">
                The most important factor in obtaining a clearance is honesty. Falsifying or omitting
                information on the SF-86 is a federal crime and will result in permanent disqualification.
                Many issues that candidates worry about (past drug use, financial problems, foreign contacts)
                can often be mitigated with honest disclosure and proper explanation. Our specialists will
                help you present your background accurately and address any concerns proactively.
              </p>
            </div>
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
            Common questions about the security clearance process
          </p>
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Cleared?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Schedule a confidential consultation with our clearance specialists.
            We'll assess your background and create a path to obtaining your clearance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearanceServicesPage;
