// ===========================================
// Aerospace & Defense Consulting Page
// Industry-specific consulting for aerospace,
// defense, and space technology sectors
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  Plane,
  Rocket,
  Shield,
  DollarSign,
  Users,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Target,
  BookOpen,
  Phone,
  Mail,
  Calendar,
  BadgeCheck,
  Radar,
  Navigation,
  Crosshair,
  Factory,
  Cog,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface Consultant {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  availability: 'available' | 'limited' | 'booked';
  image: string;
  bio: string;
  credentials: string[];
  yearsExperience: number;
  projectsCompleted: number;
  specialization: string;
  clearance?: string;
}

interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  priceRange: string;
  duration: string;
  deliverables: string[];
  popular?: boolean;
}

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  image: string;
  consultant: string;
  contractValue?: string;
}

// ===========================================
// Sample Data - Aerospace & Defense Consultants
// ===========================================

const aerospaceConsultants: Consultant[] = [
  {
    id: 'aero-1',
    name: 'Gen. (Ret.) Michael Harrison',
    title: 'Former Deputy Commander',
    company: 'Former U.S. Space Command',
    expertise: ['Space Operations', 'DoD Programs', 'National Security', 'Strategic Planning'],
    rating: 4.98,
    reviews: 47,
    hourlyRate: 750,
    availability: 'limited',
    image: '/images/consultants/aero-1.jpg',
    bio: 'Retired 3-star general with 35 years of military service. Former Deputy Commander of U.S. Space Command overseeing satellite operations and space domain awareness.',
    credentials: ['MS Astronautical Engineering - AFIT', 'Former Deputy Commander USSPACECOM', 'Space Policy Expert'],
    yearsExperience: 35,
    projectsCompleted: 38,
    specialization: 'Space & National Security',
    clearance: 'TS/SCI',
  },
  {
    id: 'aero-2',
    name: 'Dr. Susan Chen',
    title: 'VP of Engineering',
    company: 'Former SpaceX',
    expertise: ['Launch Systems', 'Propulsion', 'Reusability', 'Mission Operations'],
    rating: 4.97,
    reviews: 56,
    hourlyRate: 675,
    availability: 'available',
    image: '/images/consultants/aero-2.jpg',
    bio: 'Former VP of Propulsion at SpaceX who led development of Raptor engine and Starship program. Expert in launch vehicle design, reusability, and commercial space operations.',
    credentials: ['PhD Aerospace Engineering - Caltech', 'Former SpaceX VP', '20+ Patents'],
    yearsExperience: 22,
    projectsCompleted: 43,
    specialization: 'Launch & Propulsion Systems',
    clearance: 'Secret',
  },
  {
    id: 'aero-3',
    name: 'Robert Mitchell',
    title: 'SVP of Defense Programs',
    company: 'Former Lockheed Martin',
    expertise: ['Defense Acquisition', 'Program Management', 'Systems Engineering', 'ITAR Compliance'],
    rating: 4.96,
    reviews: 82,
    hourlyRate: 625,
    availability: 'available',
    image: '/images/consultants/aero-3.jpg',
    bio: 'Former SVP at Lockheed Martin with 30 years in defense programs. Managed $50B+ portfolio including F-35, THAAD, and classified programs.',
    credentials: ['MS Systems Engineering - MIT', 'PMP', 'Former LMT SVP Defense Programs'],
    yearsExperience: 30,
    projectsCompleted: 94,
    specialization: 'Defense Acquisition & Programs',
    clearance: 'TS/SCI',
  },
  {
    id: 'aero-4',
    name: 'Dr. Patricia Williams',
    title: 'Chief Scientist',
    company: 'Former DARPA',
    expertise: ['Advanced Technologies', 'Autonomy & AI', 'Hypersonics', 'Directed Energy'],
    rating: 4.95,
    reviews: 39,
    hourlyRate: 700,
    availability: 'limited',
    image: '/images/consultants/aero-4.jpg',
    bio: 'Former DARPA program manager who led revolutionary technology programs in autonomy, hypersonics, and advanced sensors. Expert in defense R&D strategy.',
    credentials: ['PhD Physics - Stanford', 'Former DARPA PM', 'National Academy Member'],
    yearsExperience: 25,
    projectsCompleted: 52,
    specialization: 'Advanced Defense Technology',
    clearance: 'TS/SCI',
  },
  {
    id: 'aero-5',
    name: 'James Anderson',
    title: 'Director of BD',
    company: 'Former Northrop Grumman',
    expertise: ['Federal BD', 'Proposal Management', 'Capture Strategy', 'Government Relations'],
    rating: 4.94,
    reviews: 67,
    hourlyRate: 550,
    availability: 'available',
    image: '/images/consultants/aero-5.jpg',
    bio: 'Former Director of Business Development at Northrop Grumman with $20B+ in lifetime contract wins. Expert in federal capture, proposal strategy, and customer engagement.',
    credentials: ['MBA - UVA Darden', 'APMP Certified', 'Former NG Director BD'],
    yearsExperience: 24,
    projectsCompleted: 156,
    specialization: 'Federal Capture & BD',
    clearance: 'TS/SCI',
  },
  {
    id: 'aero-6',
    name: 'Dr. Lisa Park',
    title: 'Chief Engineer',
    company: 'Former Boeing Defense',
    expertise: ['Aircraft Design', 'Systems Integration', 'Production Engineering', 'Certification'],
    rating: 4.96,
    reviews: 48,
    hourlyRate: 600,
    availability: 'available',
    image: '/images/consultants/aero-6.jpg',
    bio: 'Former Chief Engineer at Boeing Defense, Space & Security. Led engineering for major aircraft programs including the KC-46 tanker and advanced fighter concepts.',
    credentials: ['PhD Aerospace Engineering - MIT', 'Boeing Technical Fellow', 'AIAA Fellow'],
    yearsExperience: 28,
    projectsCompleted: 61,
    specialization: 'Aircraft Systems Engineering',
    clearance: 'Secret',
  },
];

// ===========================================
// Service Offerings
// ===========================================

const serviceOfferings: ServiceOffering[] = [
  {
    id: 'federal-capture',
    title: 'Federal Capture & BD',
    description: 'Win major DoD and federal contracts with proven capture strategies, proposal excellence, and customer engagement tactics.',
    icon: Target,
    priceRange: '$100,000 - $500,000',
    duration: '3-12 months',
    deliverables: [
      'Opportunity assessment & qualification',
      'Capture strategy development',
      'Customer engagement plan',
      'Competitive analysis',
      'Win theme development',
      'Teaming strategy',
      'Proposal management support',
      'Orals preparation',
    ],
    popular: true,
  },
  {
    id: 'space-strategy',
    title: 'Commercial Space Strategy',
    description: 'Navigate the commercial space industry with market entry strategy, business model development, and investor readiness.',
    icon: Rocket,
    priceRange: '$150,000 - $400,000',
    duration: '3-9 months',
    deliverables: [
      'Market opportunity assessment',
      'Competitive landscape analysis',
      'Business model development',
      'Technology roadmap',
      'Go-to-market strategy',
      'Investor presentation',
      'Partnership strategy',
      'Regulatory pathway',
    ],
    popular: true,
  },
  {
    id: 'defense-rd',
    title: 'Defense R&D Strategy',
    description: 'Align technology development with DoD priorities and secure R&D funding through SBIR, STTR, and other programs.',
    icon: Cpu,
    priceRange: '$75,000 - $250,000',
    duration: '2-6 months',
    deliverables: [
      'Technology readiness assessment',
      'DoD alignment analysis',
      'SBIR/STTR strategy',
      'DIU/AFWERX engagement',
      'Proposal development support',
      'Technology transition plan',
      'IP strategy development',
      'Milestone planning',
    ],
  },
  {
    id: 'program-recovery',
    title: 'Program Turnaround & Recovery',
    description: 'Rescue troubled defense programs with root cause analysis, replanning, and performance improvement strategies.',
    icon: Cog,
    priceRange: '$200,000 - $750,000',
    duration: '3-12 months',
    deliverables: [
      'Root cause analysis',
      'Schedule assessment',
      'Cost-to-complete analysis',
      'Technical risk review',
      'Customer communication strategy',
      'Recovery plan development',
      'Performance monitoring',
      'Stakeholder management',
    ],
  },
  {
    id: 'itar-compliance',
    title: 'ITAR & Export Control',
    description: 'Navigate complex export control regulations with ITAR compliance programs, licensing support, and risk management.',
    icon: Shield,
    priceRange: '$75,000 - $300,000',
    duration: '2-6 months',
    deliverables: [
      'ITAR compliance assessment',
      'Export classification review',
      'TAA/MLA development',
      'DSP-5 license applications',
      'Technology control plans',
      'Training program development',
      'Foreign national screening',
      'Compliance monitoring',
    ],
  },
  {
    id: 'mro-optimization',
    title: 'MRO & Sustainment Optimization',
    description: 'Improve aircraft maintenance, repair, and overhaul operations with digital transformation and predictive maintenance.',
    icon: Factory,
    priceRange: '$100,000 - $400,000',
    duration: '4-12 months',
    deliverables: [
      'MRO process assessment',
      'Digital twin implementation',
      'Predictive maintenance strategy',
      'Parts inventory optimization',
      'Workforce planning',
      'Facility utilization analysis',
      'Cost reduction roadmap',
      'Performance metrics',
    ],
  },
];

// ===========================================
// Case Studies
// ===========================================

const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Major Defense Contract Capture',
    client: 'Mid-Tier Defense Contractor',
    industry: 'Defense',
    challenge: 'A mid-tier defense contractor needed to break into a major DoD program opportunity worth $2B+ against entrenched primes.',
    solution: 'We developed a comprehensive capture strategy including innovative teaming arrangements, customer engagement, and a compelling proposal that differentiated their solution.',
    results: [
      '$2.3B contract award won',
      'Beat 3 major prime contractors',
      'Created 500+ direct jobs',
      'Established new customer relationship',
      '10-year program of record',
    ],
    image: '/images/case-studies/defense-capture.jpg',
    consultant: 'James Anderson',
    contractValue: '$2.3B',
  },
  {
    id: 'case-2',
    title: 'Commercial Space Market Entry',
    client: 'Space Technology Startup',
    industry: 'Space',
    challenge: 'A venture-backed space startup needed to transition from R&D to commercial operations and secure its first major satellite operator customer.',
    solution: 'We developed market entry strategy, refined business model, prepared investor materials for Series B, and led customer engagement with major satellite operators.',
    results: [
      '$180M Series B funding secured',
      'First commercial contract signed',
      'Established relationships with 5 operators',
      'Clear path to profitability identified',
      'Strategic partnership with prime',
    ],
    image: '/images/case-studies/space-startup.jpg',
    consultant: 'Dr. Susan Chen',
    contractValue: '$180M Raised',
  },
  {
    id: 'case-3',
    title: 'Troubled Program Recovery',
    client: 'Major Prime Contractor',
    industry: 'Defense',
    challenge: 'A major aircraft program was 18 months behind schedule, $500M over budget, and facing potential cancellation by the customer.',
    solution: 'We led a comprehensive program assessment, developed a recovery plan, and worked with the customer to reset expectations while implementing performance improvements.',
    results: [
      'Program saved from cancellation',
      'Delivered first aircraft in 12 months',
      'Reduced cost overrun by 40%',
      'Rebuilt customer relationship',
      'Received follow-on contract',
    ],
    image: '/images/case-studies/program-recovery.jpg',
    consultant: 'Robert Mitchell',
    contractValue: 'Saved $500M+',
  },
];

// ===========================================
// Component: Consultant Card
// ===========================================

const ConsultantCard: React.FC<{ consultant: Consultant; index: number; onRequestConsultation: () => void }> = ({ consultant, index, onRequestConsultation }) => {
  const availabilityColors = {
    available: 'bg-green-100 text-green-700',
    limited: 'bg-yellow-100 text-yellow-700',
    booked: 'bg-red-100 text-red-700',
  };

  const availabilityText = {
    available: 'Available Now',
    limited: 'Limited Availability',
    booked: 'Fully Booked',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
            {consultant.name.split(' ').slice(-2).map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
              <BadgeCheck className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-slate-600 font-medium">{consultant.title}</p>
            <p className="text-gray-500 text-sm">{consultant.company}</p>
            {consultant.clearance && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                <Shield className="w-3 h-3" />
                {consultant.clearance}
              </span>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${availabilityColors[consultant.availability]}`}>
            {availabilityText[consultant.availability]}
          </span>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">{consultant.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {consultant.expertise.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{consultant.rating}</span>
                <span className="text-gray-500 text-sm">({consultant.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>{consultant.projectsCompleted} projects</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">${consultant.hourlyRate}/hr</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={onRequestConsultation} className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Consultation
          </button>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================
// Component: Service Card
// ===========================================

const ServiceCard: React.FC<{ service: ServiceOffering; index: number }> = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
        service.popular ? 'ring-2 ring-slate-700' : ''
      }`}
    >
      {service.popular && (
        <div className="bg-slate-800 text-white text-center py-1 text-sm font-medium">
          Most Requested
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-slate-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-slate-600 font-semibold">{service.priceRange}</span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {service.duration}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-gray-600">{service.description}</p>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Deliverables:</h4>
          <ul className="space-y-1">
            {service.deliverables.slice(0, 4).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
            {service.deliverables.length > 4 && (
              <li className="text-sm text-slate-600 font-medium ml-6">
                +{service.deliverables.length - 4} more deliverables
              </li>
            )}
          </ul>
        </div>

        <button className="mt-6 w-full px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
          Request Proposal
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ===========================================
// Component: Case Study Card
// ===========================================

const CaseStudyCard: React.FC<{ study: CaseStudy; index: number }> = ({ study, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative">
        <Plane className="w-24 h-24 text-white/30" />
        {study.contractValue && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
            <span className="text-slate-700 font-bold text-sm">{study.contractValue}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
            {study.industry}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{study.title}</h3>
        <p className="text-gray-500 text-sm mb-4">Consultant: {study.consultant}</p>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Challenge</h4>
            <p className="text-gray-600 text-sm">{study.challenge}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Solution</h4>
            <p className="text-gray-600 text-sm">{study.solution}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Results</h4>
            <ul className="space-y-1">
              {study.results.slice(0, 3).map((result, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="mt-6 w-full px-4 py-2 border border-slate-700 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          Read Full Case Study
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ===========================================
// Main Component
// ===========================================

const AerospaceConsultingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'case-studies'>('consultants');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'aerospace',
    serviceType: 'aerospace-consulting',
    serviceName: 'Aerospace & Defense Consulting',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Industry Alert Banner */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <Rocket className="w-5 h-5" />
            <span className="font-medium">
              FY2025 Defense Budget: $886B approved. Major opportunities in space, hypersonics, and autonomous systems.
            </span>
            <a href="#services" className="underline font-semibold hover:text-slate-200">
              Capture strategy →
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Plane className="w-5 h-5 text-slate-300" />
                <span className="text-slate-300 font-medium">Aerospace & Defense Consulting</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Dominate the
                <span className="text-slate-400"> Defense</span> Market
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Elite consulting from retired generals, former prime executives, and DARPA innovators.
                Win major contracts, develop breakthrough technologies, and lead in the new space age.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Capture Strategy
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Schedule Discovery Call
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <DollarSign className="w-10 h-10 text-slate-300 mb-3" />
                <div className="text-3xl font-bold">$886B</div>
                <div className="text-gray-300">FY2025 DoD Budget</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Rocket className="w-10 h-10 text-slate-300 mb-3" />
                <div className="text-3xl font-bold">$29B</div>
                <div className="text-gray-300">Space Force Budget</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Cpu className="w-10 h-10 text-slate-300 mb-3" />
                <div className="text-3xl font-bold">$17B</div>
                <div className="text-gray-300">AI/Autonomy Spend</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Crosshair className="w-10 h-10 text-slate-300 mb-3" />
                <div className="text-3xl font-bold">$7.3B</div>
                <div className="text-gray-300">Hypersonics R&D</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'consultants', label: 'Expert Consultants', icon: Users },
              { id: 'services', label: 'Service Offerings', icon: Briefcase },
              { id: 'case-studies', label: 'Case Studies', icon: BookOpen },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === id
                    ? 'border-slate-700 text-slate-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Consultants Tab */}
        {activeTab === 'consultants' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Defense & Aerospace Industry Leaders
              </h2>
              <p className="text-gray-600">
                Work with retired generals, former prime executives, and DARPA innovators
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {aerospaceConsultants.map((consultant, index) => (
                <ConsultantCard key={consultant.id} consultant={consultant} index={index} onRequestConsultation={consultationModal.openModal} />
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div id="services">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Comprehensive A&D Advisory Services
              </h2>
              <p className="text-gray-600">
                From capture strategy to program recovery, we support your mission success
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceOfferings.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Case Studies Tab */}
        {activeTab === 'case-studies' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Mission-Critical Results
              </h2>
              <p className="text-gray-600">
                See how our consultants have won major contracts and saved troubled programs
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((study, index) => (
                <CaseStudyCard key={study.id} study={study} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Domains Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Full-Spectrum Aerospace & Defense Expertise
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Our consultants cover every domain of the aerospace and defense industry
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Rocket, label: 'Space Systems', desc: 'Satellites, launch, ground' },
              { icon: Plane, label: 'Aircraft', desc: 'Fighter, UAV, commercial' },
              { icon: Crosshair, label: 'Missiles & Munitions', desc: 'Hypersonics, precision' },
              { icon: Radar, label: 'Sensors & C4ISR', desc: 'Radar, EW, comms' },
              { icon: Navigation, label: 'Autonomy & AI', desc: 'Drones, robotics, ML' },
              { icon: Shield, label: 'Cybersecurity', desc: 'Defense, compliance' },
              { icon: Factory, label: 'Manufacturing', desc: 'Production, supply chain' },
              { icon: Target, label: 'Capture & BD', desc: 'Federal, international' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold mb-1">{item.label}</h3>
                <p className="text-slate-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customers Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              We Know Your Customers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our consultants have deep relationships across the defense acquisition community
            </p>
          </div>
          <div className="grid md:grid-cols-6 gap-6">
            {[
              'U.S. Air Force',
              'U.S. Space Force',
              'U.S. Army',
              'U.S. Navy',
              'DARPA',
              'DIU',
              'NATO',
              'NASA',
              'NRO',
              'MDA',
              'SOCOM',
              'AFWERX',
            ].map((customer, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors">
                <span className="font-semibold text-slate-700">{customer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Clearance Section */}
      <div className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 rounded-full mb-4">
                <Shield className="w-4 h-4 text-slate-600" />
                <span className="text-slate-600 font-medium text-sm">Cleared Personnel</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Security-Cleared Expertise
              </h2>
              <p className="text-gray-600 mb-6">
                Many of our consultants hold active security clearances and can support
                classified programs and sensitive discussions. We maintain strict OPSEC
                and handle all engagements with appropriate safeguards.
              </p>
              <div className="space-y-3">
                {[
                  'TS/SCI cleared consultants available',
                  'Secure facility access for classified work',
                  'ITAR/EAR compliance expertise',
                  'NIST 800-171 / CMMC certified processes',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Clearance Levels Available</h3>
              <div className="space-y-4">
                {[
                  { level: 'TS/SCI', count: '12 consultants', color: 'bg-slate-800' },
                  { level: 'Top Secret', count: '28 consultants', color: 'bg-slate-700' },
                  { level: 'Secret', count: '45 consultants', color: 'bg-slate-600' },
                  { level: 'Public Trust', count: '67 consultants', color: 'bg-slate-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-24 h-8 ${item.color} rounded-md flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{item.level}</span>
                    </div>
                    <span className="text-gray-600">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Win Your Next Major Contract?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you're capturing a major program, entering commercial space, or recovering
              a troubled project, our experts are ready to support your mission.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={consultationModal.openModal} className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Consultation
              </button>
              <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Request Modal */}
      <ConsultationRequestModal
        isOpen={consultationModal.isOpen}
        onClose={consultationModal.closeModal}
        industry={consultationModal.industry}
        serviceType={consultationModal.serviceType}
        serviceName={consultationModal.serviceName}
      />

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={consultationModal.isAuthModalOpen}
        onClose={consultationModal.closeAuthModal}
        industry={consultationModal.industry}
        serviceName={consultationModal.serviceName}
      />
    </div>
  );
};

export default AerospaceConsultingPage;
