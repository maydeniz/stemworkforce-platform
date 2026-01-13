// ===========================================
// Robotics & Automation Consulting Page
// ===========================================
// Expert consultants for industrial robotics, autonomous systems,
// automation strategy, and Industry 4.0 transformation
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  ArrowLeft,
  Bot,
  Cog,
  Factory,
  Cpu,
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
  Layers,
  Move,
  Eye,
  Wrench,
  Package
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

// Sample Data - Top Robotics Consultants
const ROBOTICS_CONSULTANTS: Consultant[] = [
  {
    id: 'robot-1',
    name: 'Dr. Marcus Chen',
    title: 'Chief Robotics Officer',
    company: 'Former Boston Dynamics',
    expertise: ['Autonomous Systems', 'Motion Planning', 'Humanoid Robots'],
    bio: 'Led development of Atlas and Spot robots at Boston Dynamics. PhD in Robotics from MIT. Expert in dynamic locomotion and whole-body control.',
    hourlyRate: 800,
    rating: 4.98,
    reviewCount: 78,
    projectsCompleted: 54,
    avatar: '/avatars/robot-consultant-1.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD MIT Robotics', 'Former Boston Dynamics VP', '40+ Patents'],
    industries: ['Defense', 'Logistics', 'Manufacturing']
  },
  {
    id: 'robot-2',
    name: 'Dr. Sarah Park',
    title: 'Industrial Automation Director',
    company: 'Former FANUC',
    expertise: ['Industrial Robots', 'Factory Automation', 'Cobots'],
    bio: 'Deployed 10,000+ industrial robots across automotive and electronics manufacturing. Expert in cell design, programming, and optimization.',
    hourlyRate: 600,
    rating: 4.96,
    reviewCount: 134,
    projectsCompleted: 98,
    avatar: '/avatars/robot-consultant-2.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['MS Mechanical Engineering', 'Former FANUC Director', 'RIA Certified'],
    industries: ['Automotive', 'Electronics', 'Manufacturing']
  },
  {
    id: 'robot-3',
    name: 'James Wilson',
    title: 'Autonomous Vehicle Systems Lead',
    company: 'Former Waymo',
    expertise: ['Self-Driving Tech', 'Sensor Fusion', 'SLAM'],
    bio: 'Built perception and planning systems at Waymo. Expert in LiDAR, camera fusion, and real-time navigation for autonomous vehicles.',
    hourlyRate: 750,
    rating: 4.97,
    reviewCount: 89,
    projectsCompleted: 62,
    avatar: '/avatars/robot-consultant-3.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Stanford AI', 'Former Waymo Lead', 'AV Pioneer'],
    industries: ['Automotive', 'Logistics', 'Mining']
  },
  {
    id: 'robot-4',
    name: 'Dr. Emily Rodriguez',
    title: 'Warehouse Automation Expert',
    company: 'Former Amazon Robotics',
    expertise: ['Warehouse Robots', 'AGVs/AMRs', 'Fulfillment Automation'],
    bio: 'Scaled Amazon Robotics from 1K to 500K robots. Expert in warehouse automation strategy, AMR deployment, and fulfillment optimization.',
    hourlyRate: 650,
    rating: 4.95,
    reviewCount: 112,
    projectsCompleted: 84,
    avatar: '/avatars/robot-consultant-4.jpg',
    isAvailable: true,
    isFeatured: false,
    credentials: ['PhD CMU RI', 'Former Amazon Robotics', 'Logistics Expert'],
    industries: ['E-commerce', 'Logistics', '3PL']
  },
  {
    id: 'robot-5',
    name: 'Michael Thompson',
    title: 'RPA & Process Automation',
    company: 'Former UiPath',
    expertise: ['RPA', 'Intelligent Automation', 'Process Mining'],
    bio: 'Led enterprise RPA implementations at Fortune 100 companies. Expert in bot development, process optimization, and hyperautomation.',
    hourlyRate: 500,
    rating: 4.93,
    reviewCount: 156,
    projectsCompleted: 127,
    avatar: '/avatars/robot-consultant-5.jpg',
    isAvailable: false,
    isFeatured: false,
    credentials: ['UiPath Certified', 'Former UiPath VP', 'Automation Expert'],
    industries: ['Financial Services', 'Healthcare', 'Insurance']
  },
  {
    id: 'robot-6',
    name: 'Dr. Robert Kim',
    title: 'Surgical Robotics Specialist',
    company: 'Former Intuitive Surgical',
    expertise: ['Surgical Robots', 'Medical Automation', 'Haptics'],
    bio: 'Core team member on da Vinci surgical system. Expert in medical robotics, haptic feedback, and FDA regulatory for robotic devices.',
    hourlyRate: 850,
    rating: 4.99,
    reviewCount: 56,
    projectsCompleted: 38,
    avatar: '/avatars/robot-consultant-6.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['MD/PhD Stanford', 'Former Intuitive CSO', 'Surgical Robotics Pioneer'],
    industries: ['Medical Devices', 'Healthcare', 'Biotech']
  }
];

// Service Offerings
const ROBOTICS_SERVICES: ServiceOffering[] = [
  {
    id: 'automation-strategy',
    title: 'Automation Strategy & Roadmap',
    description: 'Comprehensive automation assessment and strategic roadmap for manufacturing, logistics, or enterprise operations.',
    deliverables: ['Automation Readiness Assessment', 'ROI Analysis', '3-Year Automation Roadmap', 'Technology Selection', 'Implementation Plan'],
    duration: '6-10 weeks',
    priceRange: '$100,000 - $300,000',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'robot-integration',
    title: 'Robot Cell Design & Integration',
    description: 'End-to-end robot cell design, integration, and deployment for manufacturing applications.',
    deliverables: ['Cell Layout Design', 'Robot Selection', 'Tooling Design', 'Programming', 'Safety Integration'],
    duration: '12-24 weeks',
    priceRange: '$200,000 - $1,000,000',
    icon: <Cog className="w-6 h-6" />
  },
  {
    id: 'amr-deployment',
    title: 'AMR/AGV Deployment',
    description: 'Mobile robot fleet deployment for warehouse, manufacturing, or healthcare environments.',
    deliverables: ['Facility Assessment', 'Fleet Sizing', 'Navigation Design', 'Software Integration', 'Deployment Support'],
    duration: '10-20 weeks',
    priceRange: '$175,000 - $750,000',
    icon: <Move className="w-6 h-6" />
  },
  {
    id: 'cobot-implementation',
    title: 'Collaborative Robot Solutions',
    description: 'Safe human-robot collaboration implementation with risk assessment and deployment.',
    deliverables: ['Risk Assessment', 'Cobot Selection', 'Application Design', 'Safety Validation', 'Operator Training'],
    duration: '8-16 weeks',
    priceRange: '$125,000 - $400,000',
    icon: <Bot className="w-6 h-6" />
  },
  {
    id: 'computer-vision',
    title: 'Vision Systems & AI',
    description: 'Machine vision and AI implementation for quality inspection, guidance, and autonomous navigation.',
    deliverables: ['Vision System Design', 'AI Model Development', 'Camera/Lighting Selection', 'Integration', 'Performance Validation'],
    duration: '10-20 weeks',
    priceRange: '$150,000 - $500,000',
    icon: <Eye className="w-6 h-6" />
  },
  {
    id: 'rpa-enterprise',
    title: 'Enterprise RPA & Hyperautomation',
    description: 'Robotic Process Automation at scale with intelligent automation and process mining.',
    deliverables: ['Process Discovery', 'Bot Development', 'CoE Establishment', 'Governance Framework', 'Scaling Strategy'],
    duration: '12-24 weeks',
    priceRange: '$200,000 - $800,000',
    icon: <Layers className="w-6 h-6" />
  }
];

// Case Studies
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Automotive OEM: Full Factory Automation',
    client: 'Major Auto Manufacturer',
    industry: 'Automotive',
    challenge: 'Legacy assembly plant with low automation needed modernization to compete with new EV-focused facilities.',
    solution: 'Designed and deployed 200+ robot cells with advanced vision systems, collaborative robots, and digital twin integration.',
    results: ['85% automation rate achieved', '$120M annual labor savings', '40% productivity improvement', '99.7% quality rate'],
    image: '/case-studies/auto-robot.jpg'
  },
  {
    id: 'cs-2',
    title: 'E-commerce Giant: Warehouse Automation',
    client: 'Top 5 E-commerce Company',
    industry: 'Logistics',
    challenge: 'Needed to scale fulfillment capacity 3x while reducing cost per order and improving delivery speed.',
    solution: 'Implemented 1,000+ AMRs with goods-to-person picking, automated packing, and AI-powered inventory management.',
    results: ['3x throughput increase', '60% reduction in pick time', '$45M annual savings', 'Same-day shipping enabled'],
    image: '/case-studies/warehouse-robot.jpg'
  },
  {
    id: 'cs-3',
    title: 'Healthcare System: Pharmacy & Lab Automation',
    client: 'Top 10 Health System',
    industry: 'Healthcare',
    challenge: 'Manual pharmacy dispensing and lab processing causing errors and capacity constraints.',
    solution: 'Deployed pharmacy automation with IV compounding robots and lab automation for specimen processing.',
    results: ['99.99% dispensing accuracy', '70% reduction in pharmacy errors', '50% capacity increase', '$8M annual savings'],
    image: '/case-studies/pharma-robot.jpg'
  }
];

// Industry Stats
const INDUSTRY_STATS = [
  { label: 'Industrial Robot Installs', value: '500K+', icon: <Bot className="w-5 h-5" /> },
  { label: 'Automation Market', value: '$320B', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Cobot Growth Rate', value: '+42%', icon: <Cog className="w-5 h-5" /> },
  { label: 'AMR Market by 2028', value: '$18B', icon: <Move className="w-5 h-5" /> }
];

const RoboticsConsultingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'cases'>('consultants');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'robotics',
    serviceType: 'robotics-consulting',
    serviceName: 'Robotics & Automation Consulting',
  });

  const expertiseFilters = [
    'all',
    'Industrial Robots',
    'AMR/AGV',
    'Autonomous Systems',
    'Cobots',
    'Vision Systems',
    'RPA'
  ];

  const filteredConsultants = selectedExpertise === 'all'
    ? ROBOTICS_CONSULTANTS
    : ROBOTICS_CONSULTANTS.filter(c => c.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase())));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-gray-950 to-orange-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
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
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Bot className="w-8 h-8 text-amber-400" />
                </div>
                <span className="px-4 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium">
                  Robotics & Automation
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Robotics & Automation
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400"> Consulting</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Work with world-class robotics experts from Boston Dynamics, Amazon Robotics, and FANUC
                to transform your operations with intelligent automation.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('consultants')}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold transition-all flex items-center gap-2"
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
                  <span>Vetted Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>NDA Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>10K+ Deployments</span>
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
                  <div className="flex items-center gap-3 text-amber-400 mb-3">
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
                    ? 'border-amber-500 text-amber-400'
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
                        ? 'bg-amber-600 text-white'
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
            <div className="mt-12 bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-500/30 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Can't find the right expert?</h3>
                  <p className="text-gray-300">
                    Tell us about your project and we'll match you with the perfect consultant within 48 hours.
                  </p>
                </div>
                <button
                  onClick={consultationModal.openModal}
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold transition-all whitespace-nowrap"
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
              <h2 className="text-3xl font-bold mb-4">Robotics & Automation Services</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive automation services from strategy to deployment, delivered by industry-leading experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROBOTICS_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Process Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Engagement Process</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Site Assessment', desc: 'Evaluate your current operations and goals', icon: <Eye className="w-6 h-6" /> },
                  { step: '2', title: 'Solution Design', desc: 'Custom automation architecture and ROI analysis', icon: <Settings className="w-6 h-6" /> },
                  { step: '3', title: 'Integration', desc: 'Seamless deployment with minimal disruption', icon: <Cog className="w-6 h-6" /> },
                  { step: '4', title: 'Optimization', desc: 'Continuous improvement and scaling', icon: <Zap className="w-6 h-6" /> }
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
                        {item.icon}
                      </div>
                      <div className="text-sm text-amber-400 mb-2">Step {item.step}</div>
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
              <h2 className="text-3xl font-bold mb-4">Automation Success Stories</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how leading organizations have transformed with our robotics and automation solutions.
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
                  quote="Their robotics expertise helped us achieve 85% automation in our assembly plant. The ROI was realized in just 18 months."
                  author="VP Manufacturing"
                  company="Global Automotive OEM"
                  rating={5}
                />
                <TestimonialCard
                  quote="The AMR deployment transformed our fulfillment center. We now ship 3x the volume with fewer errors and faster delivery."
                  author="Chief Operations Officer"
                  company="E-commerce Company"
                  rating={5}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Robotics Capabilities Section */}
      <div className="bg-gray-900/50 border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">Automation Technologies We Deploy</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <Bot className="w-6 h-6" />, label: 'Industrial Robots' },
              { icon: <Move className="w-6 h-6" />, label: 'AMR/AGV' },
              { icon: <Cog className="w-6 h-6" />, label: 'Cobots' },
              { icon: <Eye className="w-6 h-6" />, label: 'Machine Vision' },
              { icon: <Layers className="w-6 h-6" />, label: 'RPA' },
              { icon: <Cpu className="w-6 h-6" />, label: 'PLCs/Controls' },
              { icon: <Wrench className="w-6 h-6" />, label: 'End Effectors' },
              { icon: <Package className="w-6 h-6" />, label: 'Palletizing' },
              { icon: <Factory className="w-6 h-6" />, label: 'Assembly' },
              { icon: <Settings className="w-6 h-6" />, label: 'Material Handling' },
              { icon: <Database className="w-6 h-6" />, label: 'Digital Twin' },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Analytics' }
            ].map((cap, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:border-amber-500/50 transition-colors"
              >
                <div className="text-amber-400 mb-2 flex justify-center">{cap.icon}</div>
                <div className="text-sm font-medium">{cap.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Operations?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our robotics experts and discover how automation can transform your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={consultationModal.openModal}
              className="px-8 py-4 bg-white text-amber-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={() => navigate('/register?role=service-provider&industry=robotics')}
              className="px-8 py-4 bg-amber-700 hover:bg-amber-800 rounded-xl font-semibold transition-all"
            >
              Join as Robotics Consultant
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
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-amber-500/50 transition-all cursor-pointer group"
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl font-bold">
          {consultant.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg group-hover:text-amber-400 transition-colors">
            {consultant.name}
          </h3>
          <p className="text-sm text-gray-400">{consultant.title}</p>
          <p className="text-sm text-amber-400">{consultant.company}</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{consultant.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {consultant.expertise.slice(0, 3).map((exp, i) => (
          <span key={i} className="px-2 py-1 bg-amber-500/10 text-amber-300 text-xs rounded-lg">
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
      <div className="text-amber-400 mb-4">{service.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{service.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          {service.duration}
        </div>
      </div>

      <div className="text-amber-400 font-semibold mb-4">{service.priceRange}</div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all">
      <div className="grid md:grid-cols-3">
        <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-amber-400 mb-2">{study.industry}</div>
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

export default RoboticsConsultingPage;
