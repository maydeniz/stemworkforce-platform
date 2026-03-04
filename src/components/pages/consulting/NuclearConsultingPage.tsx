// ===========================================
// Nuclear & Clean Energy Consulting Page
// Industry-specific consulting for nuclear power,
// SMRs, fusion, and clean energy transition
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  Atom,
  Zap,
  Shield,
  FileText,
  DollarSign,
  Globe,
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
  Flame,
  Battery,
  Gauge,
  HardHat,
  Leaf,
  Activity,
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
  energyImpact?: string;
}

// ===========================================
// Sample Data - Nuclear & Clean Energy Consultants
// ===========================================

const nuclearConsultants: Consultant[] = [
  {
    id: 'nuc-1',
    name: 'Dr. Katherine Brooks',
    title: 'Former Chief Nuclear Officer',
    company: 'Former Exelon',
    expertise: ['Nuclear Operations', 'Fleet Management', 'NRC Licensing', 'Safety Culture'],
    rating: 4.98,
    reviews: 62,
    hourlyRate: 675,
    availability: 'limited',
    image: '/images/consultants/nuc-1.jpg',
    bio: 'Former CNO at Exelon overseeing 21 nuclear reactors across the U.S. fleet. Expert in nuclear operations excellence, regulatory compliance, and safety culture development.',
    credentials: ['PhD Nuclear Engineering - MIT', 'Senior Reactor Operator License', 'INPO Excellence Award'],
    yearsExperience: 32,
    projectsCompleted: 48,
    specialization: 'Nuclear Operations & Safety',
    clearance: 'Q Clearance',
  },
  {
    id: 'nuc-2',
    name: 'Dr. James Wilson',
    title: 'VP of Advanced Reactors',
    company: 'Former NuScale Power',
    expertise: ['SMR Technology', 'Advanced Reactors', 'NRC Design Certification', 'Technology Development'],
    rating: 4.96,
    reviews: 45,
    hourlyRate: 625,
    availability: 'available',
    image: '/images/consultants/nuc-2.jpg',
    bio: 'Former VP at NuScale Power who led the first-ever SMR design certification by the NRC. Expert in advanced reactor technologies and regulatory pathways for new designs.',
    credentials: ['PhD Nuclear Engineering - Stanford', 'Former NRC Advisory Committee', '35+ Patents'],
    yearsExperience: 28,
    projectsCompleted: 36,
    specialization: 'Small Modular Reactors',
    clearance: 'L Clearance',
  },
  {
    id: 'nuc-3',
    name: 'Sarah Mitchell',
    title: 'Director of Regulatory Affairs',
    company: 'Former NRC',
    expertise: ['NRC Licensing', 'Regulatory Strategy', 'Part 50/52 Applications', 'Inspection Readiness'],
    rating: 4.97,
    reviews: 71,
    hourlyRate: 550,
    availability: 'available',
    image: '/images/consultants/nuc-3.jpg',
    bio: 'Former NRC Branch Chief with 25 years of regulatory experience. Expert in licensing new reactors, license renewals, and regulatory inspection processes.',
    credentials: ['MS Nuclear Engineering - Penn State', 'Former NRC Branch Chief', 'NEI Regulatory Expert'],
    yearsExperience: 25,
    projectsCompleted: 89,
    specialization: 'NRC Licensing & Compliance',
  },
  {
    id: 'nuc-4',
    name: 'Dr. Michael Chen',
    title: 'Chief Science Officer',
    company: 'Former Commonwealth Fusion',
    expertise: ['Fusion Energy', 'Plasma Physics', 'Superconducting Magnets', 'Fusion Technology'],
    rating: 4.95,
    reviews: 38,
    hourlyRate: 700,
    availability: 'limited',
    image: '/images/consultants/nuc-4.jpg',
    bio: 'Former Chief Science Officer at Commonwealth Fusion Systems. Led development of high-temperature superconducting magnets for SPARC fusion device.',
    credentials: ['PhD Plasma Physics - Princeton', 'MIT Plasma Science Center Fellow', 'DOE Fusion Advisory'],
    yearsExperience: 22,
    projectsCompleted: 29,
    specialization: 'Fusion Energy Technology',
    clearance: 'Q Clearance',
  },
  {
    id: 'nuc-5',
    name: 'Dr. Rachel Green',
    title: 'VP of Clean Energy Strategy',
    company: 'Former DOE',
    expertise: ['Clean Energy Policy', 'IRA Implementation', 'DOE Programs', 'Grid Modernization'],
    rating: 4.94,
    reviews: 56,
    hourlyRate: 575,
    availability: 'available',
    image: '/images/consultants/nuc-5.jpg',
    bio: 'Former DOE Deputy Assistant Secretary for Clean Energy. Expert in IRA clean energy incentives, DOE loan programs, and clean energy deployment strategies.',
    credentials: ['PhD Energy Policy - UC Berkeley', 'Former DOE Deputy Assistant Secretary', 'Climate Fellow'],
    yearsExperience: 20,
    projectsCompleted: 67,
    specialization: 'Clean Energy Policy & Incentives',
  },
  {
    id: 'nuc-6',
    name: 'Robert Thompson',
    title: 'Managing Director',
    company: 'Former Lazard Energy',
    expertise: ['Nuclear Finance', 'Project Development', 'PPA Structuring', 'M&A Strategy'],
    rating: 4.93,
    reviews: 49,
    hourlyRate: 650,
    availability: 'available',
    image: '/images/consultants/nuc-6.jpg',
    bio: 'Former Managing Director at Lazard leading nuclear and clean energy advisory. Advised on $40B+ in nuclear project financing and M&A transactions.',
    credentials: ['MBA - Wharton', 'Former Lazard Managing Director', 'Nuclear Technologies Institute Board'],
    yearsExperience: 24,
    projectsCompleted: 78,
    specialization: 'Nuclear & Clean Energy Finance',
  },
];

// ===========================================
// Service Offerings
// ===========================================

const serviceOfferings: ServiceOffering[] = [
  {
    id: 'nrc-licensing',
    title: 'NRC Licensing & Regulatory Support',
    description: 'Comprehensive support for NRC licensing processes, from pre-application engagement through license issuance and maintenance.',
    icon: FileText,
    priceRange: '$200,000 - $1,000,000',
    duration: '12-36 months',
    deliverables: [
      'Regulatory strategy development',
      'Pre-application meetings with NRC',
      'License application preparation',
      'Safety analysis report development',
      'Environmental report preparation',
      'NRC inspection readiness',
      'Technical specification development',
      'Ongoing regulatory compliance support',
    ],
    popular: true,
  },
  {
    id: 'smr-deployment',
    title: 'SMR Deployment Strategy',
    description: 'End-to-end support for deploying Small Modular Reactors, from technology selection through site development and financing.',
    icon: Atom,
    priceRange: '$150,000 - $500,000',
    duration: '6-18 months',
    deliverables: [
      'SMR technology assessment',
      'Site selection criteria development',
      'Grid integration analysis',
      'Economic feasibility study',
      'Vendor evaluation & selection',
      'Financing strategy development',
      'Community engagement planning',
      'Regulatory pathway mapping',
    ],
    popular: true,
  },
  {
    id: 'nuclear-life-extension',
    title: 'Nuclear Life Extension Program',
    description: 'Extend the operating life of existing nuclear plants through subsequent license renewal, equipment upgrades, and safety enhancements.',
    icon: Shield,
    priceRange: '$100,000 - $400,000',
    duration: '6-24 months',
    deliverables: [
      'License renewal application support',
      'Aging management program review',
      'Safety system upgrades assessment',
      'Economic viability analysis',
      'Environmental review support',
      'NRC inspection preparation',
      'Digital I&C modernization planning',
      'Long-term operation strategy',
    ],
  },
  {
    id: 'fusion-development',
    title: 'Fusion Energy Development',
    description: 'Strategic advisory for fusion energy ventures, from technology development through regulatory framework navigation and commercialization.',
    icon: Flame,
    priceRange: '$175,000 - $600,000',
    duration: '6-18 months',
    deliverables: [
      'Fusion technology assessment',
      'Regulatory framework analysis',
      'NRC vs non-NRC pathway evaluation',
      'Investment readiness preparation',
      'Technology milestone planning',
      'IP strategy development',
      'DOE program alignment',
      'Commercialization roadmap',
    ],
  },
  {
    id: 'clean-energy-incentives',
    title: 'IRA & Clean Energy Incentives',
    description: 'Maximize value from Inflation Reduction Act nuclear production tax credits, DOE loan programs, and other clean energy incentives.',
    icon: DollarSign,
    priceRange: '$75,000 - $300,000',
    duration: '2-6 months',
    deliverables: [
      'IRA incentive eligibility assessment',
      'Production Tax Credit optimization',
      'Investment Tax Credit analysis',
      'DOE LPO application support',
      'State incentive identification',
      'Prevailing wage compliance',
      'Domestic content requirements',
      'Ongoing compliance monitoring',
    ],
  },
  {
    id: 'grid-decarbonization',
    title: 'Grid Decarbonization Strategy',
    description: 'Develop comprehensive strategies for decarbonizing industrial operations and data centers with nuclear and clean energy.',
    icon: Leaf,
    priceRange: '$100,000 - $350,000',
    duration: '3-9 months',
    deliverables: [
      'Carbon footprint baseline',
      'Clean energy technology assessment',
      'Nuclear integration feasibility',
      'PPA structuring & negotiation',
      '24/7 clean energy strategy',
      'RECs and carbon credit optimization',
      'Scope 2 emissions reduction plan',
      'Implementation roadmap',
    ],
  },
];

// ===========================================
// Case Studies
// ===========================================

const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'SMR Deployment for Data Center Campus',
    client: 'Major Tech Company',
    industry: 'Technology',
    challenge: 'A hyperscale data center operator needed 24/7 carbon-free power for a new 500MW campus, but renewable intermittency and grid constraints made traditional solutions infeasible.',
    solution: 'We developed a comprehensive SMR deployment strategy, including site selection, NRC regulatory pathway, utility integration, and long-term PPA structuring for four 300MW SMR units.',
    results: [
      '24/7 carbon-free power secured for 60+ years',
      '$2.3B in IRA production tax credits captured',
      'Zero Scope 2 emissions for entire campus',
      'Utility partnership established',
      'First-of-kind tech sector SMR deployment',
    ],
    image: '/images/case-studies/smr-datacenter.jpg',
    consultant: 'Dr. James Wilson',
    energyImpact: '1.2GW Clean Energy',
  },
  {
    id: 'case-2',
    title: 'Nuclear Fleet License Renewal Program',
    client: 'Major Utility',
    industry: 'Electric Utilities',
    challenge: 'A major utility needed to extend the operating licenses for 6 nuclear units approaching 40-year limits, requiring complex regulatory processes and aging management programs.',
    solution: 'Our team led the subsequent license renewal program for all 6 units, developing comprehensive aging management programs and supporting NRC reviews through approval.',
    results: [
      'All 6 units approved for 80-year operation',
      '40 additional years of carbon-free generation',
      '$500M in replacement capacity costs avoided',
      'Average 18-month approval timeline',
      'Zero safety findings during NRC reviews',
    ],
    image: '/images/case-studies/license-renewal.jpg',
    consultant: 'Dr. Katherine Brooks',
    energyImpact: '45TWh/year Preserved',
  },
  {
    id: 'case-3',
    title: 'Fusion Company Investment Readiness',
    client: 'Fusion Energy Startup',
    industry: 'Clean Energy',
    challenge: 'A promising fusion energy company needed to prepare for Series C funding while navigating an uncertain regulatory landscape and demonstrating a path to commercialization.',
    solution: 'We developed a comprehensive investment readiness program, including technology milestone validation, regulatory pathway analysis, and commercialization strategy.',
    results: [
      '$400M Series C funding secured',
      'NRC pre-application meetings initiated',
      'Clear regulatory pathway established',
      'DOE milestone partnership achieved',
      'Strategic utility partnerships signed',
    ],
    image: '/images/case-studies/fusion-funding.jpg',
    consultant: 'Dr. Michael Chen',
    energyImpact: 'Future: 500MW+',
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
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
            {consultant.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
              <BadgeCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-emerald-600 font-medium">{consultant.title}</p>
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
            <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
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
          <button onClick={onRequestConsultation} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
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
        service.popular ? 'ring-2 ring-emerald-500' : ''
      }`}
    >
      {service.popular && (
        <div className="bg-emerald-500 text-white text-center py-1 text-sm font-medium">
          High Demand
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-emerald-600 font-semibold">{service.priceRange}</span>
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
              <li className="text-sm text-emerald-600 font-medium ml-6">
                +{service.deliverables.length - 4} more deliverables
              </li>
            )}
          </ul>
        </div>

        <button className="mt-6 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
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
      <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center relative">
        <Atom className="w-24 h-24 text-white/30" />
        {study.energyImpact && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
            <span className="text-emerald-600 font-bold text-sm">{study.energyImpact}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
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

        <button className="mt-6 w-full px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
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

const NuclearConsultingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'case-studies'>('consultants');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'nuclear',
    serviceType: 'nuclear-consulting',
    serviceName: 'Nuclear Technologies Consulting',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Energy Alert Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <Leaf className="w-5 h-5" />
            <span className="font-medium">
              IRA Nuclear Production Tax Credit now available: $15/MWh for existing plants, up to $25/MWh for new builds
            </span>
            <a href="#services" className="underline font-semibold hover:text-emerald-100">
              Learn more →
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full mb-6">
                <Atom className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Nuclear & Clean Energy Consulting</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Powering the
                <span className="text-emerald-400"> Clean Energy</span> Transition
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Expert guidance for nuclear operations, SMR deployment, fusion energy development,
                and clean energy strategy. Our consultants bring decades of experience from NRC,
                DOE, and leading nuclear operators.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2">
                  <Atom className="w-5 h-5" />
                  Explore SMR Solutions
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Schedule Discovery Call
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Atom className="w-10 h-10 text-emerald-400 mb-3" />
                <div className="text-3xl font-bold">93</div>
                <div className="text-gray-300">U.S. Operating Reactors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Zap className="w-10 h-10 text-emerald-400 mb-3" />
                <div className="text-3xl font-bold">775</div>
                <div className="text-gray-300">TWh Clean Energy/Year</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Target className="w-10 h-10 text-emerald-400 mb-3" />
                <div className="text-3xl font-bold">200GW</div>
                <div className="text-gray-300">SMR Pipeline by 2040</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <DollarSign className="w-10 h-10 text-emerald-400 mb-3" />
                <div className="text-3xl font-bold">$30B+</div>
                <div className="text-gray-300">IRA Nuclear Incentives</div>
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
                    ? 'border-emerald-500 text-emerald-600'
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
                Nuclear & Clean Energy Industry Leaders
              </h2>
              <p className="text-gray-600">
                Work with former NRC regulators, nuclear executives, and DOE policy experts
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {nuclearConsultants.map((consultant, index) => (
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
                Comprehensive Nuclear & Clean Energy Services
              </h2>
              <p className="text-gray-600">
                From NRC licensing to SMR deployment, we support your clean energy journey
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
                Transformative Clean Energy Impact
              </h2>
              <p className="text-gray-600">
                See how our consultants are enabling the nuclear renaissance
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

      {/* Nuclear Technologies Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              The Future of Clean Energy is Nuclear
            </h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">
              From advanced SMRs to fusion energy, we're at the forefront of nuclear innovation
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Atom, label: 'Small Modular Reactors', desc: 'NuScale, X-energy, TerraPower' },
              { icon: Flame, label: 'Fusion Energy', desc: 'Commonwealth, TAE, Helion' },
              { icon: Shield, label: 'Advanced Reactors', desc: 'HTGR, MSR, SFR technologies' },
              { icon: Battery, label: 'Hydrogen Production', desc: 'Nuclear-powered electrolysis' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold mb-1">{item.label}</h3>
                <p className="text-emerald-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Full-Lifecycle Nuclear Expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our consultants cover every aspect of nuclear and clean energy operations
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: FileText, label: 'NRC Licensing', desc: 'Part 50, 52, and 53 expertise' },
              { icon: HardHat, label: 'Construction', desc: 'Project management & oversight' },
              { icon: Activity, label: 'Operations', desc: 'Safety culture & performance' },
              { icon: Gauge, label: 'Decommissioning', desc: 'End-of-life planning' },
              { icon: DollarSign, label: 'Finance', desc: 'Project financing & PPAs' },
              { icon: Leaf, label: 'Sustainability', desc: 'ESG & carbon accounting' },
              { icon: Users, label: 'Workforce', desc: 'Training & development' },
              { icon: Globe, label: 'Policy', desc: 'Regulatory & government affairs' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-emerald-600" />
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
              Ready to Lead the Clean Energy Transition?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you're extending existing plants, deploying new SMRs, or exploring fusion,
              our experts are ready to accelerate your clean energy journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={consultationModal.openModal} className="px-8 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2">
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

export default NuclearConsultingPage;
