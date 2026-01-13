// ===========================================
// AI & Machine Learning Consulting Page
// ===========================================
// Expert consultants for AI transformation, ML implementation,
// and enterprise AI strategy
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  ArrowLeft,
  Brain,
  Cpu,
  Network,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Users,
  Building2,
  CheckCircle2,
  Star,
  Clock,
  Calendar,
  MessageSquare,
  Award,
  Briefcase,
  ChevronRight,
  FileText,
  Zap,
  BarChart3,
  Lock,
  Globe,
  Lightbulb,
  Settings,
  Database,
  Code2,
  Bot
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

// Sample Data - Top AI Consultants
const AI_CONSULTANTS: Consultant[] = [
  {
    id: 'ai-1',
    name: 'Dr. Sarah Chen',
    title: 'Chief AI Strategist',
    company: 'Former Google DeepMind',
    expertise: ['LLM Implementation', 'AI Governance', 'Enterprise AI Strategy'],
    bio: 'Led AI initiatives at Google and McKinsey. PhD in Machine Learning from Stanford. Helped Fortune 500 companies achieve $500M+ in AI-driven value.',
    hourlyRate: 750,
    rating: 4.98,
    reviewCount: 127,
    projectsCompleted: 89,
    avatar: '/avatars/ai-consultant-1.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Stanford ML', 'Former Google DeepMind', 'McKinsey Partner'],
    industries: ['Technology', 'Financial Services', 'Healthcare']
  },
  {
    id: 'ai-2',
    name: 'Marcus Johnson',
    title: 'AI Implementation Director',
    company: 'Former Microsoft Azure AI',
    expertise: ['MLOps', 'Computer Vision', 'AI Infrastructure'],
    bio: 'Built and scaled AI platforms serving 100M+ users. Expert in production ML systems and enterprise AI architecture.',
    hourlyRate: 550,
    rating: 4.95,
    reviewCount: 94,
    projectsCompleted: 67,
    avatar: '/avatars/ai-consultant-2.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['MS MIT CSAIL', 'Azure AI Architect', '15 Patents'],
    industries: ['Manufacturing', 'Retail', 'Technology']
  },
  {
    id: 'ai-3',
    name: 'Dr. Priya Sharma',
    title: 'AI Ethics & Governance Lead',
    company: 'Former OpenAI',
    expertise: ['AI Ethics', 'Responsible AI', 'AI Policy'],
    bio: 'Pioneered responsible AI frameworks at OpenAI. Advises governments and Fortune 100 on AI governance and compliance.',
    hourlyRate: 600,
    rating: 4.97,
    reviewCount: 82,
    projectsCompleted: 54,
    avatar: '/avatars/ai-consultant-3.jpg',
    isAvailable: true,
    isFeatured: false,
    credentials: ['PhD Berkeley Ethics', 'Former OpenAI', 'IEEE AI Ethics Board'],
    industries: ['Government', 'Healthcare', 'Financial Services']
  },
  {
    id: 'ai-4',
    name: 'Dr. James Liu',
    title: 'Generative AI Architect',
    company: 'Former Anthropic',
    expertise: ['Generative AI', 'NLP', 'Transformer Models'],
    bio: 'Core contributor to Claude and GPT architectures. Specializes in enterprise LLM deployment and fine-tuning strategies.',
    hourlyRate: 800,
    rating: 4.99,
    reviewCount: 56,
    projectsCompleted: 41,
    avatar: '/avatars/ai-consultant-4.jpg',
    isAvailable: false,
    isFeatured: true,
    credentials: ['PhD CMU NLP', 'Former Anthropic', '50+ Papers'],
    industries: ['Technology', 'Legal', 'Media']
  },
  {
    id: 'ai-5',
    name: 'Elena Rodriguez',
    title: 'AI Product Strategy',
    company: 'Former Amazon AWS AI',
    expertise: ['AI Product Management', 'ML Platform Strategy', 'AI Monetization'],
    bio: 'Launched 10+ AI products at Amazon. Expert in AI product-market fit and go-to-market strategy.',
    hourlyRate: 500,
    rating: 4.92,
    reviewCount: 71,
    projectsCompleted: 48,
    avatar: '/avatars/ai-consultant-5.jpg',
    isAvailable: true,
    isFeatured: false,
    credentials: ['MBA Wharton', 'Former AWS AI PM Lead', 'AI Product Expert'],
    industries: ['E-commerce', 'SaaS', 'FinTech']
  },
  {
    id: 'ai-6',
    name: 'Dr. Michael Foster',
    title: 'AI for Manufacturing',
    company: 'Former Tesla AI',
    expertise: ['Industrial AI', 'Computer Vision', 'Predictive Maintenance'],
    bio: 'Built AI systems for Tesla Autopilot manufacturing. Specializes in AI-driven quality control and predictive analytics.',
    hourlyRate: 650,
    rating: 4.94,
    reviewCount: 63,
    projectsCompleted: 52,
    avatar: '/avatars/ai-consultant-6.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Georgia Tech', 'Former Tesla AI', 'Industry 4.0 Expert'],
    industries: ['Manufacturing', 'Automotive', 'Aerospace']
  }
];

// Service Offerings
const AI_SERVICES: ServiceOffering[] = [
  {
    id: 'ai-strategy',
    title: 'AI Strategy & Roadmap',
    description: 'Comprehensive AI strategy development aligned with business objectives, including opportunity identification, capability assessment, and implementation roadmap.',
    deliverables: ['AI Maturity Assessment', 'Use Case Prioritization', '3-Year AI Roadmap', 'Investment Business Case', 'Change Management Plan'],
    duration: '4-8 weeks',
    priceRange: '$75,000 - $250,000',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'llm-implementation',
    title: 'Enterprise LLM Implementation',
    description: 'End-to-end implementation of large language models for enterprise use cases, including fine-tuning, RAG systems, and production deployment.',
    deliverables: ['LLM Selection & Architecture', 'Fine-tuning Pipeline', 'RAG Implementation', 'Security & Compliance', 'Production Deployment'],
    duration: '8-16 weeks',
    priceRange: '$150,000 - $500,000',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'mlops',
    title: 'MLOps & AI Platform',
    description: 'Design and implementation of scalable ML operations infrastructure for continuous model training, deployment, and monitoring.',
    deliverables: ['MLOps Architecture', 'CI/CD for ML', 'Model Registry', 'Monitoring & Observability', 'Cost Optimization'],
    duration: '12-20 weeks',
    priceRange: '$200,000 - $750,000',
    icon: <Settings className="w-6 h-6" />
  },
  {
    id: 'ai-governance',
    title: 'AI Governance & Ethics',
    description: 'Establish responsible AI frameworks, governance structures, and compliance programs aligned with emerging regulations.',
    deliverables: ['AI Governance Framework', 'Ethics Guidelines', 'Bias Audit Process', 'Regulatory Compliance', 'Training Programs'],
    duration: '6-12 weeks',
    priceRange: '$100,000 - $300,000',
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision Solutions',
    description: 'Custom computer vision implementations for quality control, security, autonomous systems, and visual analytics.',
    deliverables: ['Use Case Analysis', 'Model Development', 'Edge Deployment', 'Integration', 'Ongoing Optimization'],
    duration: '10-20 weeks',
    priceRange: '$175,000 - $600,000',
    icon: <Cpu className="w-6 h-6" />
  },
  {
    id: 'ai-transformation',
    title: 'AI Transformation Program',
    description: 'Comprehensive organizational transformation to become an AI-first enterprise, including culture, processes, and technology.',
    deliverables: ['Transformation Roadmap', 'AI Center of Excellence', 'Talent Strategy', 'Technology Stack', 'Success Metrics'],
    duration: '6-18 months',
    priceRange: '$500,000 - $2,000,000',
    icon: <Sparkles className="w-6 h-6" />
  }
];

// Case Studies
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Fortune 100 Bank: AI-Powered Fraud Detection',
    client: 'Major US Bank',
    industry: 'Financial Services',
    challenge: 'Legacy fraud detection systems missing 23% of sophisticated fraud attempts, costing $180M annually.',
    solution: 'Implemented real-time ML fraud detection with ensemble models and explainable AI for regulatory compliance.',
    results: ['94% fraud detection rate (up from 77%)', '$127M annual fraud prevention', '60% reduction in false positives', 'Full regulatory compliance'],
    image: '/case-studies/bank-ai.jpg'
  },
  {
    id: 'cs-2',
    title: 'Automotive OEM: Predictive Quality Control',
    client: 'Global Auto Manufacturer',
    industry: 'Manufacturing',
    challenge: 'Quality defects causing $50M in warranty claims annually, with defects detected late in production.',
    solution: 'Deployed computer vision and predictive analytics across 12 production lines for real-time defect detection.',
    results: ['78% reduction in defect escape rate', '$38M annual warranty savings', '15% productivity improvement', 'Zero product recalls'],
    image: '/case-studies/auto-ai.jpg'
  },
  {
    id: 'cs-3',
    title: 'Healthcare System: Clinical AI Assistant',
    client: 'Top 10 US Health System',
    industry: 'Healthcare',
    challenge: 'Physician burnout from documentation burden, spending 2+ hours daily on clinical notes.',
    solution: 'Implemented ambient clinical AI with specialized medical LLM for automated note generation and coding.',
    results: ['70% reduction in documentation time', '40% improvement in physician satisfaction', '$12M annual savings', 'Improved patient face time'],
    image: '/case-studies/health-ai.jpg'
  }
];

// Industry Stats
const INDUSTRY_STATS = [
  { label: 'AI Market Size by 2030', value: '$1.8T', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Enterprise AI Adoption', value: '72%', icon: <Building2 className="w-5 h-5" /> },
  { label: 'AI Talent Gap', value: '4M+', icon: <Users className="w-5 h-5" /> },
  { label: 'Productivity Gains', value: '40%', icon: <Zap className="w-5 h-5" /> }
];

const AIConsultingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'cases'>('consultants');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'ai',
    serviceType: 'ai-consulting',
    serviceName: 'AI & Machine Learning Consulting',
  });

  const expertiseFilters = [
    'all',
    'LLM Implementation',
    'AI Strategy',
    'MLOps',
    'Computer Vision',
    'AI Ethics',
    'Generative AI'
  ];

  const filteredConsultants = selectedExpertise === 'all'
    ? AI_CONSULTANTS
    : AI_CONSULTANTS.filter(c => c.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase())));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-950 to-blue-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
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
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
                <span className="px-4 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                  AI & Machine Learning
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Enterprise AI
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"> Consulting</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Work with world-class AI experts from Google, OpenAI, Microsoft, and top consulting firms
                to transform your organization with artificial intelligence.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('consultants')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-all flex items-center gap-2"
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
                  <span>Fortune 500 Trusted</span>
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
                  <div className="flex items-center gap-3 text-purple-400 mb-3">
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
                    ? 'border-purple-500 text-purple-400'
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
                        ? 'bg-purple-600 text-white'
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
            <div className="mt-12 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Can't find the right expert?</h3>
                  <p className="text-gray-300">
                    Tell us about your project and we'll match you with the perfect consultant within 48 hours.
                  </p>
                </div>
                <button
                  onClick={consultationModal.openModal}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-all whitespace-nowrap"
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
              <h2 className="text-3xl font-bold mb-4">AI Consulting Services</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive AI services from strategy to implementation, delivered by industry-leading experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AI_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Process Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Engagement Process</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Discovery Call', desc: 'Understand your challenges and objectives', icon: <MessageSquare className="w-6 h-6" /> },
                  { step: '2', title: 'Expert Matching', desc: 'We match you with the ideal consultant', icon: <Users className="w-6 h-6" /> },
                  { step: '3', title: 'Proposal & SOW', desc: 'Detailed scope, timeline, and pricing', icon: <FileText className="w-6 h-6" /> },
                  { step: '4', title: 'Engagement', desc: 'Kickoff and continuous collaboration', icon: <Zap className="w-6 h-6" /> }
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                        {item.icon}
                      </div>
                      <div className="text-sm text-purple-400 mb-2">Step {item.step}</div>
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
              <h2 className="text-3xl font-bold mb-4">AI Success Stories</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how leading organizations have transformed their operations with our AI consulting services.
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
                  quote="The AI strategy developed by their team helped us identify $50M in efficiency gains within the first year. Their expertise in enterprise AI is unmatched."
                  author="CTO"
                  company="Fortune 100 Financial Services"
                  rating={5}
                />
                <TestimonialCard
                  quote="They didn't just implement AI - they transformed how our organization thinks about and uses data. The MLOps infrastructure they built is world-class."
                  author="VP of Engineering"
                  company="Global Manufacturing Company"
                  rating={5}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Capabilities Section */}
      <div className="bg-gray-900/50 border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">AI Capabilities We Deliver</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <Bot className="w-6 h-6" />, label: 'LLM & ChatGPT' },
              { icon: <Database className="w-6 h-6" />, label: 'RAG Systems' },
              { icon: <Cpu className="w-6 h-6" />, label: 'Computer Vision' },
              { icon: <Network className="w-6 h-6" />, label: 'Deep Learning' },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Predictive Analytics' },
              { icon: <Code2 className="w-6 h-6" />, label: 'MLOps' },
              { icon: <Lock className="w-6 h-6" />, label: 'AI Security' },
              { icon: <Globe className="w-6 h-6" />, label: 'NLP & Translation' },
              { icon: <Lightbulb className="w-6 h-6" />, label: 'AI Strategy' },
              { icon: <Shield className="w-6 h-6" />, label: 'AI Governance' },
              { icon: <Settings className="w-6 h-6" />, label: 'AI Automation' },
              { icon: <TrendingUp className="w-6 h-6" />, label: 'AI Analytics' }
            ].map((cap, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors"
              >
                <div className="text-purple-400 mb-2 flex justify-center">{cap.icon}</div>
                <div className="text-sm font-medium">{cap.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform with AI?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our AI experts and discover how artificial intelligence can drive your business forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={consultationModal.openModal}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={() => navigate('/register?role=service-provider&industry=ai')}
              className="px-8 py-4 bg-purple-700 hover:bg-purple-800 rounded-xl font-semibold transition-all"
            >
              Join as AI Consultant
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
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold">
          {consultant.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors">
            {consultant.name}
          </h3>
          <p className="text-sm text-gray-400">{consultant.title}</p>
          <p className="text-sm text-purple-400">{consultant.company}</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{consultant.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {consultant.expertise.slice(0, 3).map((exp, i) => (
          <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-lg">
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
      <div className="text-purple-400 mb-4">{service.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{service.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          {service.duration}
        </div>
      </div>

      <div className="text-purple-400 font-semibold mb-4">{service.priceRange}</div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
      <div className="grid md:grid-cols-3">
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-purple-400 mb-2">{study.industry}</div>
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

export default AIConsultingPage;
