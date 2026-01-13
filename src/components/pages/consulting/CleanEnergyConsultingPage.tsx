// ===========================================
// Clean Energy Consulting Page
// ===========================================
// Expert consultants for renewable energy, sustainability,
// grid modernization, and energy transition
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  ArrowLeft,
  Zap,
  Sun,
  Wind,
  Leaf,
  Target,
  TrendingUp,
  Shield,
  Users,
  CheckCircle2,
  Star,
  Clock,
  Calendar,
  Award,
  Briefcase,
  ChevronRight,
  FileText,
  BarChart3,
  Globe,
  Lightbulb,
  Settings,
  Factory,
  Battery,
  Gauge,
  Waves,
  CloudSun
} from 'lucide-react';

// Types
interface Consultant {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  projectsCompleted: number;
  avatar: string;
  isAvailable: boolean;
  isFeatured: boolean;
  credentials: string[];
  industries: string[];
}

interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  duration: string;
  priceRange: string;
  icon: React.ReactNode;
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
}

// Sample Data - Top Clean Energy Consultants
const CLEANENERGY_CONSULTANTS: Consultant[] = [
  {
    id: 'energy-1',
    name: 'Dr. Amanda Green',
    title: 'Chief Sustainability Officer',
    company: 'Former Tesla Energy',
    expertise: ['Energy Storage', 'Solar Strategy', 'Grid Integration'],
    bio: 'Led Tesla Energy strategy for utility-scale storage. Expert in battery technology, grid services, and renewable integration.',
    hourlyRate: 750,
    rating: 4.98,
    reviewCount: 89,
    projectsCompleted: 67,
    avatar: '/avatars/energy-consultant-1.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Stanford Energy', 'Former Tesla Energy VP', 'DOE Advisor'],
    industries: ['Utilities', 'Energy Storage', 'Solar']
  },
  {
    id: 'energy-2',
    name: 'Michael Chen',
    title: 'Offshore Wind Director',
    company: 'Former Ørsted',
    expertise: ['Offshore Wind', 'Project Development', 'Permitting'],
    bio: 'Developed 5 GW of offshore wind projects globally. Expert in floating wind, marine permitting, and supply chain development.',
    hourlyRate: 700,
    rating: 4.97,
    reviewCount: 112,
    projectsCompleted: 84,
    avatar: '/avatars/energy-consultant-2.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['MS Marine Engineering', 'Former Ørsted Director', 'AWEA Board'],
    industries: ['Wind', 'Offshore', 'Utilities']
  },
  {
    id: 'energy-3',
    name: 'Dr. Sarah Thompson',
    title: 'Grid Modernization Expert',
    company: 'Former NREL',
    expertise: ['Grid Integration', 'DERs', 'Transmission Planning'],
    bio: 'Led grid integration research at NREL. Expert in renewable integration studies, transmission planning, and distribution system optimization.',
    hourlyRate: 650,
    rating: 4.96,
    reviewCount: 98,
    projectsCompleted: 76,
    avatar: '/avatars/energy-consultant-3.jpg',
    isAvailable: true,
    isFeatured: false,
    credentials: ['PhD MIT Energy', 'Former NREL Director', 'IEEE Fellow'],
    industries: ['Utilities', 'Grid', 'DER']
  },
  {
    id: 'energy-4',
    name: 'James Wilson',
    title: 'Hydrogen & Clean Fuels Lead',
    company: 'Former Shell New Energies',
    expertise: ['Green Hydrogen', 'Clean Fuels', 'Decarbonization'],
    bio: 'Built Shell hydrogen strategy across 15 countries. Expert in electrolyzer technology, hydrogen infrastructure, and industrial decarbonization.',
    hourlyRate: 800,
    rating: 4.95,
    reviewCount: 67,
    projectsCompleted: 48,
    avatar: '/avatars/energy-consultant-4.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD ChemE Stanford', 'Former Shell VP', 'Hydrogen Council'],
    industries: ['Oil & Gas', 'Heavy Industry', 'Transportation']
  },
  {
    id: 'energy-5',
    name: 'Dr. Emily Rodriguez',
    title: 'Corporate Sustainability Director',
    company: 'Former Apple Environment',
    expertise: ['Net Zero Strategy', 'Corporate PPAs', 'ESG'],
    bio: 'Led Apple to carbon neutrality across supply chain. Expert in corporate renewable procurement, science-based targets, and ESG reporting.',
    hourlyRate: 600,
    rating: 4.94,
    reviewCount: 134,
    projectsCompleted: 98,
    avatar: '/avatars/energy-consultant-5.jpg',
    isAvailable: false,
    isFeatured: false,
    credentials: ['MBA/MS Berkeley', 'Former Apple Director', 'RE100 Expert'],
    industries: ['Technology', 'Manufacturing', 'Retail']
  },
  {
    id: 'energy-6',
    name: 'Robert Park',
    title: 'Energy Finance Specialist',
    company: 'Former Goldman Sachs Clean Energy',
    expertise: ['Project Finance', 'Tax Equity', 'M&A'],
    bio: 'Financed $15B+ in renewable projects at Goldman Sachs. Expert in tax equity structures, project finance, and clean energy M&A.',
    hourlyRate: 850,
    rating: 4.99,
    reviewCount: 78,
    projectsCompleted: 62,
    avatar: '/avatars/energy-consultant-6.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['MBA Harvard', 'Former Goldman MD', 'IRA Expert'],
    industries: ['Finance', 'Utilities', 'Developers']
  }
];

// Service Offerings
const CLEANENERGY_SERVICES: ServiceOffering[] = [
  {
    id: 'renewable-strategy',
    title: 'Renewable Energy Strategy',
    description: 'Comprehensive renewable energy strategy including resource assessment, technology selection, and implementation roadmap.',
    deliverables: ['Resource Assessment', 'Technology Analysis', 'Financial Modeling', 'Implementation Roadmap', 'Policy Analysis'],
    duration: '6-12 weeks',
    priceRange: '$100,000 - $350,000',
    icon: <Sun className="w-6 h-6" />
  },
  {
    id: 'project-development',
    title: 'Project Development Support',
    description: 'End-to-end support for renewable project development from site selection to financial close.',
    deliverables: ['Site Screening', 'Permitting Strategy', 'Interconnection Support', 'PPA Negotiation', 'Financing Strategy'],
    duration: '12-30 weeks',
    priceRange: '$200,000 - $750,000',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'grid-integration',
    title: 'Grid Integration & Storage',
    description: 'Grid modernization and energy storage solutions for utilities and large energy consumers.',
    deliverables: ['Integration Study', 'Storage Sizing', 'Grid Services Design', 'Regulatory Strategy', 'Technology Selection'],
    duration: '10-24 weeks',
    priceRange: '$175,000 - $600,000',
    icon: <Battery className="w-6 h-6" />
  },
  {
    id: 'decarbonization',
    title: 'Industrial Decarbonization',
    description: 'Comprehensive decarbonization strategy for hard-to-abate industrial sectors.',
    deliverables: ['Emissions Baseline', 'Technology Assessment', 'Hydrogen Feasibility', 'CCUS Analysis', 'Transition Roadmap'],
    duration: '12-24 weeks',
    priceRange: '$250,000 - $800,000',
    icon: <Factory className="w-6 h-6" />
  },
  {
    id: 'corporate-sustainability',
    title: 'Corporate Net Zero Strategy',
    description: 'Science-based net zero strategies including renewable procurement, efficiency, and carbon management.',
    deliverables: ['Carbon Footprint', 'Science-Based Targets', 'PPA Strategy', 'Efficiency Program', 'ESG Reporting'],
    duration: '8-16 weeks',
    priceRange: '$125,000 - $400,000',
    icon: <Leaf className="w-6 h-6" />
  },
  {
    id: 'energy-finance',
    title: 'Clean Energy Finance',
    description: 'Project financing, tax equity structuring, and M&A advisory for clean energy assets.',
    deliverables: ['Financial Modeling', 'Tax Equity Structure', 'Due Diligence', 'Transaction Support', 'IRA Optimization'],
    duration: '8-20 weeks',
    priceRange: '$150,000 - $500,000',
    icon: <BarChart3 className="w-6 h-6" />
  }
];

// Case Studies
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Fortune 100 Tech Company: 100% Renewable Goal',
    client: 'Major Technology Company',
    industry: 'Technology',
    challenge: 'Needed strategy to achieve 100% renewable electricity across global operations including data centers.',
    solution: 'Developed global renewable procurement strategy with 2 GW of PPAs, on-site solar, and 24/7 carbon-free matching.',
    results: ['100% renewable achieved in 3 years', '2 GW of new clean energy', '$200M annual energy savings', 'Net zero operations'],
    image: '/case-studies/tech-renewable.jpg'
  },
  {
    id: 'cs-2',
    title: 'Utility: Offshore Wind Development',
    client: 'Major US Utility',
    industry: 'Utilities',
    challenge: 'Utility entering offshore wind needed strategy for 3 GW development program including supply chain.',
    solution: 'Developed comprehensive offshore wind program including site selection, permitting strategy, and domestic supply chain plan.',
    results: ['3 GW pipeline secured', '$12B investment program', '5,000 jobs created', 'First project in construction'],
    image: '/case-studies/offshore-wind.jpg'
  },
  {
    id: 'cs-3',
    title: 'Steel Manufacturer: Green Hydrogen Transition',
    client: 'Global Steel Producer',
    industry: 'Heavy Industry',
    challenge: 'Needed decarbonization pathway for steel production with 50% emission reduction by 2030.',
    solution: 'Designed green hydrogen production strategy with on-site electrolyzers and direct reduced iron process.',
    results: ['50% emission reduction path', '500 MW electrolyzer project', '$2B green financing secured', 'First green steel produced'],
    image: '/case-studies/green-steel.jpg'
  }
];

// Industry Stats
const INDUSTRY_STATS = [
  { label: 'Global Clean Energy Investment', value: '$1.7T', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'IRA Clean Energy Credits', value: '$370B', icon: <Zap className="w-5 h-5" /> },
  { label: 'Renewable Growth Rate', value: '+9%', icon: <Sun className="w-5 h-5" /> },
  { label: 'Clean Energy Jobs', value: '14M+', icon: <Users className="w-5 h-5" /> }
];

const CleanEnergyConsultingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'cases'>('consultants');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'clean-energy',
    serviceType: 'clean-energy-consulting',
    serviceName: 'Clean Energy Consulting',
  });

  const expertiseFilters = [
    'all',
    'Solar',
    'Wind',
    'Energy Storage',
    'Hydrogen',
    'Grid',
    'Corporate Sustainability'
  ];

  const filteredConsultants = selectedExpertise === 'all'
    ? CLEANENERGY_CONSULTANTS
    : CLEANENERGY_CONSULTANTS.filter(c => c.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase())));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-900/30 via-gray-950 to-green-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <button
            onClick={() => navigate('/service-providers')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Consulting Services
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-lime-500/20 rounded-xl">
                  <Zap className="w-8 h-8 text-lime-400" />
                </div>
                <span className="px-4 py-1 bg-lime-500/20 text-lime-300 rounded-full text-sm font-medium">
                  Clean Energy
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Clean Energy
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-400"> Consulting</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Work with world-class energy experts from Tesla, Ørsted, NREL, and leading utilities
                to accelerate your clean energy transition and achieve sustainability goals.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('consultants')}
                  className="px-6 py-3 bg-lime-600 hover:bg-lime-500 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Browse Consultants
                </button>
                <button
                  onClick={consultationModal.openModal}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Request Consultation
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>IRA Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>NDA Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>50 GW Deployed</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {INDUSTRY_STATS.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 text-lime-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'consultants', label: 'Expert Consultants', icon: <Users className="w-4 h-4" /> },
              { id: 'services', label: 'Service Offerings', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'cases', label: 'Case Studies', icon: <FileText className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-lime-500 text-lime-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Consultants Tab */}
        {activeTab === 'consultants' && (
          <div>
            {/* Expertise Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {expertiseFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedExpertise(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedExpertise === filter
                        ? 'bg-lime-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {filter === 'all' ? 'All Expertise' : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Consultant Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConsultants.map((consultant) => (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  onClick={() => navigate(`/service-providers/${consultant.id}`)}
                />
              ))}
            </div>

            {/* CTA Banner */}
            <div className="mt-12 bg-gradient-to-r from-lime-900/50 to-green-900/50 border border-lime-500/30 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Can't find the right expert?</h3>
                  <p className="text-gray-300">
                    Tell us about your project and we'll match you with the perfect consultant within 48 hours.
                  </p>
                </div>
                <button
                  onClick={consultationModal.openModal}
                  className="px-8 py-4 bg-lime-600 hover:bg-lime-500 rounded-xl font-semibold transition-all whitespace-nowrap"
                >
                  Get Matched
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Clean Energy Consulting Services</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive clean energy services from strategy to deployment, delivered by industry-leading experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CLEANENERGY_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Process Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Engagement Process</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Assessment', desc: 'Evaluate your energy needs and sustainability goals', icon: <Gauge className="w-6 h-6" /> },
                  { step: '2', title: 'Strategy', desc: 'Develop comprehensive clean energy roadmap', icon: <Target className="w-6 h-6" /> },
                  { step: '3', title: 'Implementation', desc: 'Execute projects with expert support', icon: <Settings className="w-6 h-6" /> },
                  { step: '4', title: 'Optimization', desc: 'Continuous improvement and monitoring', icon: <Zap className="w-6 h-6" /> }
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-lime-400">
                        {item.icon}
                      </div>
                      <div className="text-sm text-lime-400 mb-2">Step {item.step}</div>
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    {item.step !== '4' && (
                      <ChevronRight className="hidden md:block absolute top-1/2 -right-4 w-6 h-6 text-gray-600 -translate-y-1/2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Case Studies Tab */}
        {activeTab === 'cases' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Clean Energy Success Stories</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how leading organizations have accelerated their clean energy transition with our consulting services.
              </p>
            </div>

            <div className="space-y-8">
              {CASE_STUDIES.map((study) => (
                <CaseStudyCard key={study.id} study={study} />
              ))}
            </div>

            {/* Testimonials */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8 text-center">What Our Clients Say</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <TestimonialCard
                  quote="Their renewable strategy helped us achieve 100% clean electricity 2 years ahead of schedule while saving $200M in energy costs."
                  author="Chief Sustainability Officer"
                  company="Fortune 100 Technology Company"
                  rating={5}
                />
                <TestimonialCard
                  quote="The offshore wind expertise was invaluable. They helped us navigate permitting and secure financing for our first 1 GW project."
                  author="VP Development"
                  company="Major US Utility"
                  rating={5}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Energy Capabilities Section */}
      <div className="bg-gray-900/50 border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">Clean Energy Technologies & Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <Sun className="w-6 h-6" />, label: 'Solar PV' },
              { icon: <Wind className="w-6 h-6" />, label: 'Wind Energy' },
              { icon: <Battery className="w-6 h-6" />, label: 'Energy Storage' },
              { icon: <Zap className="w-6 h-6" />, label: 'Grid Integration' },
              { icon: <Waves className="w-6 h-6" />, label: 'Offshore Wind' },
              { icon: <Factory className="w-6 h-6" />, label: 'Green Hydrogen' },
              { icon: <Leaf className="w-6 h-6" />, label: 'Net Zero' },
              { icon: <CloudSun className="w-6 h-6" />, label: 'Carbon Capture' },
              { icon: <Globe className="w-6 h-6" />, label: 'ESG & Reporting' },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Project Finance' },
              { icon: <Lightbulb className="w-6 h-6" />, label: 'Energy Efficiency' },
              { icon: <Settings className="w-6 h-6" />, label: 'Smart Grid' }
            ].map((cap, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:border-lime-500/50 transition-colors"
              >
                <div className="text-lime-400 mb-2 flex justify-center">{cap.icon}</div>
                <div className="text-sm font-medium">{cap.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-lime-600 to-green-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Clean Energy Transition?</h2>
          <p className="text-xl text-lime-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our energy experts and discover how we can help you achieve your sustainability goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={consultationModal.openModal}
              className="px-8 py-4 bg-white text-lime-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={() => navigate('/register?role=service-provider&industry=clean-energy')}
              className="px-8 py-4 bg-lime-700 hover:bg-lime-800 rounded-xl font-semibold transition-all"
            >
              Join as Energy Consultant
            </button>
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

// Consultant Card Component
const ConsultantCard: React.FC<{
  consultant: Consultant;
  onClick: () => void;
}> = ({ consultant, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-lime-500/50 transition-all cursor-pointer group"
    >
      {consultant.isFeatured && (
        <div className="flex justify-end mb-2">
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
            <Award className="w-3 h-3" />
            Featured
          </span>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lime-500 to-green-500 flex items-center justify-center text-xl font-bold">
          {consultant.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg group-hover:text-lime-400 transition-colors">
            {consultant.name}
          </h3>
          <p className="text-sm text-gray-400">{consultant.title}</p>
          <p className="text-sm text-lime-400">{consultant.company}</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{consultant.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {consultant.expertise.slice(0, 3).map((exp, i) => (
          <span key={i} className="px-2 py-1 bg-lime-500/10 text-lime-300 text-xs rounded-lg">
            {exp}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{consultant.rating}</span>
            <span className="text-gray-500">({consultant.reviewCount})</span>
          </div>
          <div className="text-gray-400">
            {consultant.projectsCompleted} projects
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">${consultant.hourlyRate}</div>
          <div className="text-xs text-gray-400">/hour</div>
        </div>
      </div>

      <div className="mt-4">
        <div className={`flex items-center gap-2 text-sm ${consultant.isAvailable ? 'text-green-400' : 'text-orange-400'}`}>
          <div className={`w-2 h-2 rounded-full ${consultant.isAvailable ? 'bg-green-400' : 'bg-orange-400'}`} />
          {consultant.isAvailable ? 'Available for projects' : 'Limited availability'}
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard: React.FC<{ service: ServiceOffering }> = ({ service }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-lime-500/50 transition-all">
      <div className="text-lime-400 mb-4">{service.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{service.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          {service.duration}
        </div>
      </div>

      <div className="text-lime-400 font-semibold mb-4">{service.priceRange}</div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-lime-400 hover:text-lime-300 flex items-center gap-1"
      >
        {expanded ? 'Hide' : 'View'} Deliverables
        <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <ul className="mt-4 space-y-2">
          {service.deliverables.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Case Study Card Component
const CaseStudyCard: React.FC<{ study: CaseStudy }> = ({ study }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-lime-500/50 transition-all">
      <div className="grid md:grid-cols-3">
        <div className="bg-gradient-to-br from-lime-900/50 to-green-900/50 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-lime-400 mb-2">{study.industry}</div>
            <div className="text-lg font-semibold">{study.client}</div>
          </div>
        </div>
        <div className="md:col-span-2 p-8">
          <h3 className="text-xl font-semibold mb-4">{study.title}</h3>

          <div className="space-y-4 mb-6">
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Challenge</div>
              <p className="text-sm text-gray-300">{study.challenge}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Solution</div>
              <p className="text-sm text-gray-300">{study.solution}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {study.results.map((result, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  company: string;
  rating: number;
}> = ({ quote, author, company, rating }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <blockquote className="text-gray-300 mb-4 italic">"{quote}"</blockquote>
      <div className="text-sm">
        <div className="font-medium">{author}</div>
        <div className="text-gray-400">{company}</div>
      </div>
    </div>
  );
};

export default CleanEnergyConsultingPage;
