// ===========================================
// Semiconductor & CHIPS Act Consulting Page
// Industry-specific consulting for semiconductor manufacturing,
// supply chain, and CHIPS Act compliance
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  Cpu,
  Factory,
  DollarSign,
  Users,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Shield,
  Target,
  BookOpen,
  Phone,
  Mail,
  Calendar,
  BadgeCheck,
  AlertTriangle,
  Layers,
  Settings,
  Package,
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
  fundingSecured?: string;
}

// ===========================================
// Sample Data - Semiconductor Consultants
// ===========================================

const semiconductorConsultants: Consultant[] = [
  {
    id: 'semi-1',
    name: 'Dr. Robert Chen',
    title: 'VP of Manufacturing Operations',
    company: 'Former TSMC',
    expertise: ['Fab Operations', 'Process Engineering', 'Yield Optimization', 'CHIPS Act'],
    rating: 4.98,
    reviews: 87,
    hourlyRate: 650,
    availability: 'limited',
    image: '/images/consultants/semi-1.jpg',
    bio: 'Former VP at TSMC with 28 years in semiconductor manufacturing. Led the ramp-up of 5nm and 3nm nodes. Expert in fab construction, process development, and yield improvement programs.',
    credentials: ['PhD Electrical Engineering - Stanford', 'TSMC Manufacturing Excellence Award', 'IEEE Fellow'],
    yearsExperience: 28,
    projectsCompleted: 42,
    specialization: 'Advanced Node Manufacturing',
  },
  {
    id: 'semi-2',
    name: 'Jennifer Martinez',
    title: 'Director of Supply Chain Strategy',
    company: 'Former Intel',
    expertise: ['Supply Chain Resilience', 'Vendor Management', 'Global Logistics', 'Risk Mitigation'],
    rating: 4.95,
    reviews: 64,
    hourlyRate: 525,
    availability: 'available',
    image: '/images/consultants/semi-2.jpg',
    bio: 'Former Intel supply chain director who redesigned global semiconductor supply networks. Expert in supply chain resilience, multi-sourcing strategies, and geopolitical risk management.',
    credentials: ['MBA - MIT Sloan', 'APICS Certified Supply Chain Professional', 'Intel Achievement Award'],
    yearsExperience: 22,
    projectsCompleted: 58,
    specialization: 'Supply Chain Resilience',
  },
  {
    id: 'semi-3',
    name: 'Dr. William Park',
    title: 'Senior Policy Advisor',
    company: 'Former Commerce Department',
    expertise: ['CHIPS Act Compliance', 'Federal Grants', 'Policy Navigation', 'Regulatory Affairs'],
    rating: 4.97,
    reviews: 43,
    hourlyRate: 575,
    availability: 'available',
    image: '/images/consultants/semi-3.jpg',
    bio: 'Former senior advisor at the Department of Commerce who helped draft CHIPS Act implementation guidelines. Expert in navigating federal semiconductor incentive programs.',
    credentials: ['JD - Georgetown Law', 'Former Commerce Dept Senior Advisor', 'CHIPS Program Architect'],
    yearsExperience: 18,
    projectsCompleted: 31,
    specialization: 'CHIPS Act & Federal Policy',
  },
  {
    id: 'semi-4',
    name: 'Dr. Lisa Wang',
    title: 'Chief Technology Officer',
    company: 'Former GlobalFoundries',
    expertise: ['Process Development', 'Device Physics', 'Technology Roadmapping', 'R&D Strategy'],
    rating: 4.94,
    reviews: 52,
    hourlyRate: 600,
    availability: 'limited',
    image: '/images/consultants/semi-4.jpg',
    bio: 'Former CTO at GlobalFoundries with expertise in mature node optimization and specialty technologies. Led development of FD-SOI and RF technologies for automotive and IoT applications.',
    credentials: ['PhD Physics - MIT', '45+ Patents', 'SEMI Standards Committee Chair'],
    yearsExperience: 25,
    projectsCompleted: 38,
    specialization: 'Specialty Technologies',
  },
  {
    id: 'semi-5',
    name: 'Michael Thompson',
    title: 'Managing Director',
    company: 'Former McKinsey Semiconductors',
    expertise: ['M&A Strategy', 'Market Analysis', 'Investment Due Diligence', 'Competitive Strategy'],
    rating: 4.92,
    reviews: 71,
    hourlyRate: 700,
    availability: 'available',
    image: '/images/consultants/semi-5.jpg',
    bio: 'Former McKinsey partner leading the global semiconductor practice. Advised on $50B+ in semiconductor M&A transactions and industry transformations.',
    credentials: ['MBA - Harvard Business School', 'Former McKinsey Partner', 'Semiconductor Industry Analyst'],
    yearsExperience: 20,
    projectsCompleted: 89,
    specialization: 'Strategy & M&A',
  },
  {
    id: 'semi-6',
    name: 'Dr. Patricia Hughes',
    title: 'VP of Engineering',
    company: 'Former Applied Materials',
    expertise: ['Equipment Engineering', 'Fab Construction', 'Clean Room Design', 'Process Equipment'],
    rating: 4.96,
    reviews: 39,
    hourlyRate: 550,
    availability: 'available',
    image: '/images/consultants/semi-6.jpg',
    bio: 'Former VP at Applied Materials with deep expertise in semiconductor equipment and fab construction. Helped design and commission 12 greenfield fabs globally.',
    credentials: ['PhD Materials Science - UC Berkeley', 'SEMI Standards Contributor', 'Applied Materials Fellow'],
    yearsExperience: 24,
    projectsCompleted: 45,
    specialization: 'Fab Construction & Equipment',
  },
];

// ===========================================
// Service Offerings
// ===========================================

const serviceOfferings: ServiceOffering[] = [
  {
    id: 'chips-grant',
    title: 'CHIPS Act Grant Application',
    description: 'End-to-end support for CHIPS and Science Act funding applications, from eligibility assessment to proposal submission and negotiation.',
    icon: DollarSign,
    priceRange: '$150,000 - $500,000',
    duration: '3-6 months',
    deliverables: [
      'Eligibility & program fit assessment',
      'Application strategy & timeline',
      'Technical proposal writing',
      'Financial projections & modeling',
      'Community benefit plan development',
      'Workforce development plan',
      'Environmental compliance documentation',
      'Post-submission support & negotiations',
    ],
    popular: true,
  },
  {
    id: 'fab-planning',
    title: 'Fab Site Selection & Planning',
    description: 'Comprehensive support for greenfield and brownfield fab development, from site selection to construction planning and permitting.',
    icon: Factory,
    priceRange: '$250,000 - $1,000,000',
    duration: '6-12 months',
    deliverables: [
      'Multi-criteria site evaluation',
      'Infrastructure requirements analysis',
      'Utility & water availability assessment',
      'Workforce availability study',
      'State & local incentive negotiation',
      'Environmental impact assessment',
      'Construction timeline & phasing',
      'Equipment procurement strategy',
    ],
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain Resilience Program',
    description: 'Build a resilient, diversified semiconductor supply chain with multi-sourcing strategies, risk assessment, and supplier qualification.',
    icon: Package,
    priceRange: '$100,000 - $350,000',
    duration: '3-6 months',
    deliverables: [
      'Supply chain mapping & visualization',
      'Single-source risk identification',
      'Alternative supplier qualification',
      'Geopolitical risk assessment',
      'Inventory optimization strategy',
      'Supplier relationship frameworks',
      'Crisis response playbooks',
      'Ongoing monitoring dashboards',
    ],
    popular: true,
  },
  {
    id: 'process-transfer',
    title: 'Technology & Process Transfer',
    description: 'Expert guidance for transferring semiconductor manufacturing processes between fabs, including qualification and yield ramp support.',
    icon: Settings,
    priceRange: '$200,000 - $750,000',
    duration: '6-18 months',
    deliverables: [
      'Process documentation audit',
      'Equipment matching analysis',
      'Process recipe optimization',
      'Qualification test planning',
      'Yield improvement roadmap',
      'Training program development',
      'Statistical process control setup',
      'Production ramp support',
    ],
  },
  {
    id: 'workforce-dev',
    title: 'Semiconductor Workforce Development',
    description: 'Comprehensive workforce strategy for building and retaining semiconductor talent, from training programs to academic partnerships.',
    icon: Users,
    priceRange: '$75,000 - $250,000',
    duration: '3-9 months',
    deliverables: [
      'Workforce needs assessment',
      'Training curriculum development',
      'Academic partnership framework',
      'Apprenticeship program design',
      'Retention strategy development',
      'Career pathway mapping',
      'Veteran hiring programs',
      'Diversity & inclusion initiatives',
    ],
  },
  {
    id: 'compliance',
    title: 'Regulatory & Export Compliance',
    description: 'Navigate complex semiconductor export controls, technology transfer regulations, and national security requirements.',
    icon: Shield,
    priceRange: '$100,000 - $400,000',
    duration: '2-6 months',
    deliverables: [
      'Export control classification',
      'ITAR/EAR compliance assessment',
      'Technology control plans',
      'Foreign national screening',
      'Deemed export procedures',
      'License application support',
      'Compliance training programs',
      'Ongoing compliance monitoring',
    ],
  },
];

// ===========================================
// Case Studies
// ===========================================

const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Major Memory Manufacturer CHIPS Act Success',
    client: 'Global Memory Company',
    industry: 'Semiconductor Manufacturing',
    challenge: 'A leading memory manufacturer needed to secure CHIPS Act funding for a $15B fab expansion in the U.S. The complex application required extensive technical, financial, and community benefit documentation.',
    solution: 'Our team provided end-to-end application support, including technical proposal writing, financial modeling, workforce development planning, and community engagement strategy. We worked closely with Commerce Department officials throughout the process.',
    results: [
      '$3.5B in CHIPS Act direct funding secured',
      '$6B in federal loan guarantees approved',
      'Application approved in record 8 months',
      'Created 3,000+ direct manufacturing jobs',
      'Established 5 community college partnerships',
    ],
    image: '/images/case-studies/chips-memory.jpg',
    consultant: 'Dr. William Park',
    fundingSecured: '$3.5B',
  },
  {
    id: 'case-2',
    title: 'Automotive Chip Supply Chain Transformation',
    client: 'Fortune 50 Automaker',
    industry: 'Automotive',
    challenge: 'After the 2021 chip shortage caused $10B+ in lost production, a major automaker needed to completely redesign their semiconductor supply chain to prevent future disruptions.',
    solution: 'We conducted comprehensive supply chain mapping, identified 47 single-source risks, and developed a multi-sourcing strategy. We helped qualify 12 new suppliers and established strategic inventory buffers for critical components.',
    results: [
      'Reduced single-source dependencies by 78%',
      'Established 30-day strategic inventory buffer',
      '12 new qualified suppliers onboarded',
      'Zero production stoppages in 2023-2024',
      '$2.1B in avoided lost production',
    ],
    image: '/images/case-studies/auto-supply.jpg',
    consultant: 'Jennifer Martinez',
  },
  {
    id: 'case-3',
    title: 'Greenfield Fab Site Selection & Development',
    client: 'Advanced Logic Manufacturer',
    industry: 'Semiconductor Manufacturing',
    challenge: 'An advanced logic manufacturer needed to select a site for a new $20B fab in the Americas, considering workforce availability, infrastructure, incentives, and regulatory requirements.',
    solution: 'We evaluated 15 potential sites across 8 states, developed a weighted scoring model, and led negotiations with state and local governments. We also designed the workforce development strategy and environmental compliance approach.',
    results: [
      'Optimal site selected in 4 months',
      '$1.8B in state and local incentives secured',
      'Construction permits approved in record time',
      'Pipeline of 5,000+ qualified workers established',
      'Fab operational 6 months ahead of schedule',
    ],
    image: '/images/case-studies/fab-site.jpg',
    consultant: 'Dr. Patricia Hughes',
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
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
            {consultant.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
              <BadgeCheck className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-amber-600 font-medium">{consultant.title}</p>
            <p className="text-gray-500 text-sm">{consultant.company}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${availabilityColors[consultant.availability]}`}>
            {availabilityText[consultant.availability]}
          </span>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">{consultant.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {consultant.expertise.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
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
          <button onClick={onRequestConsultation} className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
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
        service.popular ? 'ring-2 ring-amber-500' : ''
      }`}
    >
      {service.popular && (
        <div className="bg-amber-500 text-white text-center py-1 text-sm font-medium">
          Most Requested
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-amber-600 font-semibold">{service.priceRange}</span>
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
              <li className="text-sm text-amber-600 font-medium ml-6">
                +{service.deliverables.length - 4} more deliverables
              </li>
            )}
          </ul>
        </div>

        <button className="mt-6 w-full px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
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
      <div className="h-48 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
        <Factory className="w-24 h-24 text-white/30" />
        {study.fundingSecured && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
            <span className="text-amber-600 font-bold">{study.fundingSecured} Secured</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
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

        <button className="mt-6 w-full px-4 py-2 border border-amber-600 text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
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

const SemiconductorConsultingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'case-studies'>('consultants');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'semiconductor',
    serviceType: 'semiconductor-consulting',
    serviceName: 'Semiconductor & CHIPS Act Consulting',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* CHIPS Act Alert Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              CHIPS Act Deadline Alert: Next funding round applications due Q2 2025.
            </span>
            <a href="#services" className="underline font-semibold hover:text-amber-100">
              Start your application today →
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-6">
                <Cpu className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-medium">Semiconductor & CHIPS Act Consulting</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Navigate the Semiconductor
                <span className="text-amber-400"> Renaissance</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Expert guidance for CHIPS Act applications, fab development, supply chain resilience,
                and semiconductor manufacturing excellence. Our consultants have decades of experience
                at Intel, TSMC, Applied Materials, and the Commerce Department.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  CHIPS Act Application Help
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Schedule Discovery Call
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <DollarSign className="w-10 h-10 text-amber-400 mb-3" />
                <div className="text-3xl font-bold">$52.7B</div>
                <div className="text-gray-300">CHIPS Act Funding</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Factory className="w-10 h-10 text-amber-400 mb-3" />
                <div className="text-3xl font-bold">28+</div>
                <div className="text-gray-300">New U.S. Fab Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Users className="w-10 h-10 text-amber-400 mb-3" />
                <div className="text-3xl font-bold">115K</div>
                <div className="text-gray-300">New Jobs Created</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Target className="w-10 h-10 text-amber-400 mb-3" />
                <div className="text-3xl font-bold">20%</div>
                <div className="text-gray-300">Global Share Target</div>
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
                    ? 'border-amber-500 text-amber-600'
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
                Semiconductor Industry Veterans
              </h2>
              <p className="text-gray-600">
                Work with former executives from Intel, TSMC, Applied Materials, and the Commerce Department
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {semiconductorConsultants.map((consultant, index) => (
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
                Comprehensive Semiconductor Consulting Services
              </h2>
              <p className="text-gray-600">
                From CHIPS Act applications to fab construction, we support every stage of your semiconductor journey
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
                Proven Results in Semiconductor Excellence
              </h2>
              <p className="text-gray-600">
                See how our consultants have helped companies secure billions in CHIPS Act funding
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

      {/* CHIPS Act CTA Section */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Secure Your CHIPS Act Funding?
              </h2>
              <p className="text-lg text-amber-100 mb-6">
                Our team has helped clients secure over $8 billion in CHIPS Act funding.
                Let us guide you through the application process and maximize your chances of success.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Free eligibility assessment',
                  'Application strategy development',
                  'Technical proposal support',
                  'Ongoing Commerce Department liaison',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-8 py-3 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors flex items-center gap-2">
                Start Your Application
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">CHIPS Act Funding by Category</h3>
              <div className="space-y-4">
                {[
                  { label: 'Manufacturing Incentives', amount: '$39B', percent: 74 },
                  { label: 'R&D Programs', amount: '$11B', percent: 21 },
                  { label: 'Workforce Development', amount: '$2.7B', percent: 5 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span>{item.label}</span>
                      <span className="font-bold">{item.amount}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Full-Spectrum Semiconductor Expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our consultants cover every aspect of the semiconductor value chain
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Factory, label: 'Fab Construction', desc: 'Greenfield & brownfield development' },
              { icon: Cpu, label: 'Process Development', desc: 'Advanced & mature node optimization' },
              { icon: Package, label: 'Supply Chain', desc: 'Resilience & risk mitigation' },
              { icon: DollarSign, label: 'CHIPS Act', desc: 'Grant applications & compliance' },
              { icon: Users, label: 'Workforce', desc: 'Training & development programs' },
              { icon: Shield, label: 'Compliance', desc: 'Export controls & security' },
              { icon: Layers, label: 'Technology', desc: 'Roadmapping & IP strategy' },
              { icon: TrendingUp, label: 'Strategy', desc: 'M&A & market analysis' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Your Semiconductor Transformation
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you're planning a new fab, navigating CHIPS Act applications, or building
              supply chain resilience, our experts are ready to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={consultationModal.openModal} className="px-8 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2">
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

export default SemiconductorConsultingPage;
