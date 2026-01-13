// ===========================================
// Advanced Manufacturing Consulting Page
// ===========================================
// Expert consultants for smart manufacturing, Industry 4.0,
// digital transformation, and manufacturing excellence
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  ArrowLeft,
  Factory,
  Cog,
  Cpu,
  Layers,
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
  Zap,
  BarChart3,
  Settings,
  Database,
  Wrench,
  Package,
  Truck,
  Gauge,
  CircuitBoard,
  Activity
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

// Sample Data - Top Manufacturing Consultants
const MANUFACTURING_CONSULTANTS: Consultant[] = [
  {
    id: 'mfg-1',
    name: 'Dr. Robert Schmidt',
    title: 'Chief Manufacturing Officer',
    company: 'Former Siemens Digital Industries',
    expertise: ['Industry 4.0', 'Digital Twin', 'Smart Factory'],
    bio: 'Led digital manufacturing transformation at Siemens serving 100+ factories globally. Expert in MES, PLM, and digital twin implementation.',
    hourlyRate: 750,
    rating: 4.98,
    reviewCount: 112,
    projectsCompleted: 89,
    avatar: '/avatars/mfg-consultant-1.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Manufacturing Systems', 'Former Siemens VP', 'Industry 4.0 Pioneer'],
    industries: ['Automotive', 'Aerospace', 'Electronics']
  },
  {
    id: 'mfg-2',
    name: 'Sarah Chen',
    title: 'Lean Manufacturing Director',
    company: 'Former Toyota Production System',
    expertise: ['Lean Manufacturing', 'TPS', 'Continuous Improvement'],
    bio: 'Trained directly in Toyota Production System in Japan. Implemented lean transformations saving $500M+ across 50+ facilities.',
    hourlyRate: 600,
    rating: 4.97,
    reviewCount: 167,
    projectsCompleted: 134,
    avatar: '/avatars/mfg-consultant-2.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['Lean Six Sigma MBB', 'TPS Certified', 'Former Toyota Sensei'],
    industries: ['Automotive', 'Healthcare', 'Consumer Goods']
  },
  {
    id: 'mfg-3',
    name: 'Michael Thompson',
    title: 'Supply Chain Excellence Lead',
    company: 'Former Apple Operations',
    expertise: ['Supply Chain', 'Procurement', 'Global Operations'],
    bio: 'Built Apple supply chain for iPhone production. Expert in supplier development, global logistics, and supply chain resilience.',
    hourlyRate: 700,
    rating: 4.96,
    reviewCount: 98,
    projectsCompleted: 72,
    avatar: '/avatars/mfg-consultant-3.jpg',
    isAvailable: true,
    isFeatured: false,
    credentials: ['MBA MIT Sloan', 'Former Apple VP', 'APICS Certified'],
    industries: ['Technology', 'Consumer Electronics', 'Retail']
  },
  {
    id: 'mfg-4',
    name: 'Dr. Emily Johnson',
    title: 'Additive Manufacturing Expert',
    company: 'Former GE Additive',
    expertise: ['Additive Manufacturing', '3D Printing', 'DFAM'],
    bio: 'Pioneered metal 3D printing production at GE. Expert in design for additive, material science, and production scaling.',
    hourlyRate: 800,
    rating: 4.95,
    reviewCount: 78,
    projectsCompleted: 54,
    avatar: '/avatars/mfg-consultant-4.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Materials Science', 'Former GE Director', '25 Patents'],
    industries: ['Aerospace', 'Medical Devices', 'Defense']
  },
  {
    id: 'mfg-5',
    name: 'James Wilson',
    title: 'Manufacturing AI Specialist',
    company: 'Former Rockwell Automation',
    expertise: ['Manufacturing AI', 'Predictive Maintenance', 'IIoT'],
    bio: 'Built AI/ML platform for industrial automation at Rockwell. Expert in predictive quality, maintenance optimization, and IIoT.',
    hourlyRate: 650,
    rating: 4.94,
    reviewCount: 89,
    projectsCompleted: 67,
    avatar: '/avatars/mfg-consultant-5.jpg',
    isAvailable: false,
    isFeatured: false,
    credentials: ['MS CS Stanford', 'Former Rockwell Lead', 'IIoT Expert'],
    industries: ['Manufacturing', 'Energy', 'Utilities']
  },
  {
    id: 'mfg-6',
    name: 'Dr. Amanda Foster',
    title: 'Semiconductor Manufacturing Lead',
    company: 'Former Intel Fab Operations',
    expertise: ['Semiconductor Fab', 'Yield Engineering', 'Process Control'],
    bio: 'Led fab operations at Intel achieving world-class yields. Expert in semiconductor process control, yield engineering, and fab automation.',
    hourlyRate: 850,
    rating: 4.99,
    reviewCount: 67,
    projectsCompleted: 48,
    avatar: '/avatars/mfg-consultant-6.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD EE Berkeley', 'Former Intel VP', 'CHIPS Act Advisor'],
    industries: ['Semiconductor', 'Electronics', 'Photonics']
  }
];

// Service Offerings
const MANUFACTURING_SERVICES: ServiceOffering[] = [
  {
    id: 'industry-4',
    title: 'Industry 4.0 Transformation',
    description: 'Comprehensive smart manufacturing strategy including digital twin, IIoT, and connected factory implementation.',
    deliverables: ['Digital Maturity Assessment', 'Technology Roadmap', 'Pilot Implementation', 'Scale-Up Strategy', 'Change Management'],
    duration: '12-24 weeks',
    priceRange: '$200,000 - $750,000',
    icon: <CircuitBoard className="w-6 h-6" />
  },
  {
    id: 'lean-transformation',
    title: 'Lean Manufacturing Excellence',
    description: 'End-to-end lean transformation including value stream mapping, continuous improvement, and operational excellence.',
    deliverables: ['Value Stream Mapping', 'Waste Elimination', 'Standard Work', 'Kaizen Events', 'Lean Culture Development'],
    duration: '16-40 weeks',
    priceRange: '$175,000 - $600,000',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain Optimization',
    description: 'Strategic supply chain design and optimization for resilience, cost reduction, and improved service levels.',
    deliverables: ['Supply Chain Assessment', 'Network Optimization', 'Supplier Development', 'Risk Mitigation', 'S&OP Design'],
    duration: '10-20 weeks',
    priceRange: '$150,000 - $500,000',
    icon: <Truck className="w-6 h-6" />
  },
  {
    id: 'additive-mfg',
    title: 'Additive Manufacturing Strategy',
    description: 'End-to-end additive manufacturing strategy from use case identification to production implementation.',
    deliverables: ['Use Case Assessment', 'Technology Selection', 'DFAM Training', 'Pilot Production', 'Qualification Support'],
    duration: '12-24 weeks',
    priceRange: '$175,000 - $600,000',
    icon: <Layers className="w-6 h-6" />
  },
  {
    id: 'predictive-maintenance',
    title: 'Predictive Maintenance & AI',
    description: 'Implement AI-powered predictive maintenance and quality systems for improved uptime and reduced defects.',
    deliverables: ['Sensor Strategy', 'ML Model Development', 'Integration', 'Pilot Deployment', 'ROI Tracking'],
    duration: '10-20 weeks',
    priceRange: '$150,000 - $450,000',
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: 'greenfield',
    title: 'New Factory Design & Launch',
    description: 'End-to-end support for greenfield facility design, equipment selection, and production launch.',
    deliverables: ['Layout Design', 'Equipment Selection', 'Process Design', 'Launch Planning', 'Ramp-Up Support'],
    duration: '24-52 weeks',
    priceRange: '$500,000 - $2,000,000',
    icon: <Factory className="w-6 h-6" />
  }
];

// Case Studies
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Automotive OEM: Smart Factory Transformation',
    client: 'Major European Automaker',
    industry: 'Automotive',
    challenge: 'Legacy factory with aging equipment needed digital transformation to compete with new EV-native facilities.',
    solution: 'Implemented comprehensive Industry 4.0 program including digital twin, IIoT, AI-powered quality, and MES modernization.',
    results: ['35% productivity improvement', '60% defect reduction', '$85M annual savings', 'OEE improved to 92%'],
    image: '/case-studies/auto-smart-factory.jpg'
  },
  {
    id: 'cs-2',
    title: 'Medical Device Company: Lean Transformation',
    client: 'Global Medical Device Manufacturer',
    industry: 'Medical Devices',
    challenge: 'Long lead times and high WIP inventory impacting customer service and cash flow.',
    solution: 'Designed and implemented lean manufacturing system across 8 production lines with cellular manufacturing and pull systems.',
    results: ['70% lead time reduction', '50% inventory reduction', '$25M cash flow improvement', '99% on-time delivery'],
    image: '/case-studies/medical-lean.jpg'
  },
  {
    id: 'cs-3',
    title: 'Semiconductor: New Fab Launch',
    client: 'US Semiconductor Company',
    industry: 'Semiconductor',
    challenge: 'Needed to launch new $10B fab with accelerated timeline under CHIPS Act funding.',
    solution: 'Provided comprehensive fab launch support including process development, yield engineering, and workforce development.',
    results: ['Production start 6 months early', '95% yield in Year 1', '2,000 jobs created', 'CHIPS Act milestones achieved'],
    image: '/case-studies/semi-fab.jpg'
  }
];

// Industry Stats
const INDUSTRY_STATS = [
  { label: 'Industry 4.0 Market', value: '$165B', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'CHIPS Act Manufacturing', value: '$52B', icon: <Factory className="w-5 h-5" /> },
  { label: 'Manufacturing Jobs Gap', value: '2.1M', icon: <Users className="w-5 h-5" /> },
  { label: 'Smart Factory Growth', value: '+24%', icon: <CircuitBoard className="w-5 h-5" /> }
];

const ManufacturingConsultingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'cases'>('consultants');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'manufacturing',
    serviceType: 'manufacturing-consulting',
    serviceName: 'Advanced Manufacturing Consulting',
  });

  const expertiseFilters = [
    'all',
    'Industry 4.0',
    'Lean Manufacturing',
    'Supply Chain',
    'Additive Manufacturing',
    'Semiconductor',
    'Manufacturing AI'
  ];

  const filteredConsultants = selectedExpertise === 'all'
    ? MANUFACTURING_CONSULTANTS
    : MANUFACTURING_CONSULTANTS.filter(c => c.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase())));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-gray-950 to-zinc-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-slate-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl" />
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
                <div className="p-3 bg-slate-500/20 rounded-xl">
                  <Factory className="w-8 h-8 text-slate-400" />
                </div>
                <span className="px-4 py-1 bg-slate-500/20 text-slate-300 rounded-full text-sm font-medium">
                  Advanced Manufacturing
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Advanced Manufacturing
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-zinc-400"> Consulting</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Work with world-class manufacturing experts from Siemens, Toyota, Apple, and Intel
                to transform your operations with smart manufacturing and operational excellence.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('consultants')}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-xl font-semibold transition-all flex items-center gap-2"
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
                  <span>CHIPS Act Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>NDA Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>500+ Factories</span>
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
                  <div className="flex items-center gap-3 text-slate-400 mb-3">
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
                    ? 'border-slate-500 text-slate-400'
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
                        ? 'bg-slate-600 text-white'
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
            <div className="mt-12 bg-gradient-to-r from-slate-900/50 to-zinc-900/50 border border-slate-500/30 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Can't find the right expert?</h3>
                  <p className="text-gray-300">
                    Tell us about your project and we'll match you with the perfect consultant within 48 hours.
                  </p>
                </div>
                <button
                  onClick={consultationModal.openModal}
                  className="px-8 py-4 bg-slate-600 hover:bg-slate-500 rounded-xl font-semibold transition-all whitespace-nowrap"
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
              <h2 className="text-3xl font-bold mb-4">Manufacturing Consulting Services</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive manufacturing services from strategy to implementation, delivered by industry-leading experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MANUFACTURING_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Process Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Engagement Process</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Assessment', desc: 'Evaluate current operations and benchmarks', icon: <Gauge className="w-6 h-6" /> },
                  { step: '2', title: 'Strategy', desc: 'Develop improvement roadmap and business case', icon: <Target className="w-6 h-6" /> },
                  { step: '3', title: 'Implementation', desc: 'Execute with hands-on expert support', icon: <Wrench className="w-6 h-6" /> },
                  { step: '4', title: 'Sustainment', desc: 'Ensure lasting improvements and capability building', icon: <Zap className="w-6 h-6" /> }
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        {item.icon}
                      </div>
                      <div className="text-sm text-slate-400 mb-2">Step {item.step}</div>
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
              <h2 className="text-3xl font-bold mb-4">Manufacturing Success Stories</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how leading manufacturers have transformed with our consulting services.
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
                  quote="Their Industry 4.0 expertise helped us achieve a 35% productivity improvement. The digital twin implementation was transformative."
                  author="VP Manufacturing"
                  company="Major European Automaker"
                  rating={5}
                />
                <TestimonialCard
                  quote="The lean transformation cut our lead time by 70% and freed up $25M in working capital. Their Toyota-trained consultants are world-class."
                  author="Chief Operations Officer"
                  company="Global Medical Device Company"
                  rating={5}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manufacturing Capabilities Section */}
      <div className="bg-gray-900/50 border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">Manufacturing Technologies & Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <CircuitBoard className="w-6 h-6" />, label: 'Industry 4.0' },
              { icon: <Layers className="w-6 h-6" />, label: 'Digital Twin' },
              { icon: <Cog className="w-6 h-6" />, label: 'Lean/TPS' },
              { icon: <Activity className="w-6 h-6" />, label: 'Predictive Maint.' },
              { icon: <Package className="w-6 h-6" />, label: 'Additive Mfg' },
              { icon: <Truck className="w-6 h-6" />, label: 'Supply Chain' },
              { icon: <Database className="w-6 h-6" />, label: 'MES/MOM' },
              { icon: <Cpu className="w-6 h-6" />, label: 'Automation' },
              { icon: <Factory className="w-6 h-6" />, label: 'Fab Operations' },
              { icon: <Gauge className="w-6 h-6" />, label: 'Quality Systems' },
              { icon: <Settings className="w-6 h-6" />, label: 'Process Control' },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Analytics' }
            ].map((cap, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:border-slate-500/50 transition-colors"
              >
                <div className="text-slate-400 mb-2 flex justify-center">{cap.icon}</div>
                <div className="text-sm font-medium">{cap.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-slate-600 to-zinc-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Manufacturing Operations?</h2>
          <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our manufacturing experts and discover how we can help you achieve operational excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={consultationModal.openModal}
              className="px-8 py-4 bg-white text-slate-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={() => navigate('/register?role=service-provider&industry=manufacturing')}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-800 rounded-xl font-semibold transition-all"
            >
              Join as Manufacturing Consultant
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
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-slate-500/50 transition-all cursor-pointer group"
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-500 to-zinc-500 flex items-center justify-center text-xl font-bold">
          {consultant.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg group-hover:text-slate-400 transition-colors">
            {consultant.name}
          </h3>
          <p className="text-sm text-gray-400">{consultant.title}</p>
          <p className="text-sm text-slate-400">{consultant.company}</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{consultant.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {consultant.expertise.slice(0, 3).map((exp, i) => (
          <span key={i} className="px-2 py-1 bg-slate-500/10 text-slate-300 text-xs rounded-lg">
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-slate-500/50 transition-all">
      <div className="text-slate-400 mb-4">{service.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{service.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          {service.duration}
        </div>
      </div>

      <div className="text-slate-400 font-semibold mb-4">{service.priceRange}</div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1"
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-slate-500/50 transition-all">
      <div className="grid md:grid-cols-3">
        <div className="bg-gradient-to-br from-slate-900/50 to-zinc-900/50 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">{study.industry}</div>
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

export default ManufacturingConsultingPage;
