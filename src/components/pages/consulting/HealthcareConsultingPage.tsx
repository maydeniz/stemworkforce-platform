// ===========================================
// Healthcare & Medical Technology Consulting Page
// ===========================================
// Expert consultants for digital health, medical devices,
// health IT, and healthcare transformation
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  ArrowLeft,
  HeartPulse,
  Stethoscope,
  Activity,
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
  Lock,
  Database,
  Smartphone,
  Wifi,
  Brain,
  Microscope,
  Pill
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

// Sample Data - Top Healthcare Consultants
const HEALTHCARE_CONSULTANTS: Consultant[] = [
  {
    id: 'health-1',
    name: 'Dr. Jennifer Martinez',
    title: 'Chief Digital Health Officer',
    company: 'Former Mayo Clinic',
    expertise: ['Digital Health Strategy', 'Telehealth', 'Patient Experience'],
    bio: 'Led digital transformation at Mayo Clinic serving 1.2M patients annually. Expert in virtual care implementation and patient engagement platforms.',
    hourlyRate: 700,
    rating: 4.98,
    reviewCount: 112,
    projectsCompleted: 78,
    avatar: '/avatars/health-consultant-1.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['MD/MBA Harvard', 'Former Mayo Clinic CDO', 'HIMSS Fellow'],
    industries: ['Health Systems', 'Digital Health', 'Telehealth']
  },
  {
    id: 'health-2',
    name: 'David Chen',
    title: 'Medical Device Regulatory Expert',
    company: 'Former FDA CDRH',
    expertise: ['FDA 510(k)', 'De Novo Pathway', 'EU MDR'],
    bio: '15 years at FDA CDRH reviewing Class II/III medical devices. Expert in regulatory strategy for AI/ML-enabled devices and software as medical device (SaMD).',
    hourlyRate: 650,
    rating: 4.97,
    reviewCount: 145,
    projectsCompleted: 112,
    avatar: '/avatars/health-consultant-2.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['MS Biomedical Engineering', 'Former FDA CDRH', 'RAC Certified'],
    industries: ['Medical Devices', 'Digital Health', 'AI Healthcare']
  },
  {
    id: 'health-3',
    name: 'Dr. Sarah Williams',
    title: 'Health IT Transformation Lead',
    company: 'Former Epic',
    expertise: ['EHR Implementation', 'Interoperability', 'FHIR/HL7'],
    bio: 'Led Epic implementations at 50+ health systems. Expert in EHR optimization, interoperability standards, and clinical workflow design.',
    hourlyRate: 550,
    rating: 4.95,
    reviewCount: 167,
    projectsCompleted: 134,
    avatar: '/avatars/health-consultant-3.jpg',
    isAvailable: true,
    isFeatured: false,
    credentials: ['PhD Health Informatics', 'Former Epic VP', 'CPHIMS Certified'],
    industries: ['Health Systems', 'EHR', 'Health IT']
  },
  {
    id: 'health-4',
    name: 'Michael Thompson',
    title: 'Healthcare AI Strategist',
    company: 'Former Google Health',
    expertise: ['Clinical AI', 'Predictive Analytics', 'ML in Healthcare'],
    bio: 'Built AI diagnostic tools at Google Health. Specializes in clinical decision support, radiology AI, and responsible AI in healthcare.',
    hourlyRate: 750,
    rating: 4.96,
    reviewCount: 89,
    projectsCompleted: 62,
    avatar: '/avatars/health-consultant-4.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD ML Stanford', 'Former Google Health', 'FDA AI Expert'],
    industries: ['Digital Health', 'AI/ML', 'Diagnostics']
  },
  {
    id: 'health-5',
    name: 'Dr. Amanda Foster',
    title: 'Value-Based Care Expert',
    company: 'Former CMS Innovation',
    expertise: ['Value-Based Care', 'Population Health', 'APM Design'],
    bio: 'Led alternative payment model design at CMS. Expert in risk-based contracting, care management programs, and quality measurement.',
    hourlyRate: 600,
    rating: 4.94,
    reviewCount: 98,
    projectsCompleted: 74,
    avatar: '/avatars/health-consultant-5.jpg',
    isAvailable: false,
    isFeatured: false,
    credentials: ['MD/MPH Yale', 'Former CMS', 'Population Health Expert'],
    industries: ['Payers', 'Health Systems', 'ACOs']
  },
  {
    id: 'health-6',
    name: 'Robert Kim',
    title: 'Healthcare Cybersecurity Director',
    company: 'Former HHS CISA',
    expertise: ['HIPAA Security', 'Healthcare Cyber', 'Incident Response'],
    bio: 'Protected healthcare infrastructure at HHS. Expert in HIPAA security assessments, healthcare-specific threats, and security program development.',
    hourlyRate: 625,
    rating: 4.93,
    reviewCount: 76,
    projectsCompleted: 58,
    avatar: '/avatars/health-consultant-6.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['CISSP', 'Former HHS CISO', 'Healthcare Security Expert'],
    industries: ['Health Systems', 'Payers', 'Digital Health']
  }
];

// Service Offerings
const HEALTHCARE_SERVICES: ServiceOffering[] = [
  {
    id: 'digital-health-strategy',
    title: 'Digital Health Strategy',
    description: 'Comprehensive digital health transformation strategy including telehealth, patient engagement, and digital front door initiatives.',
    deliverables: ['Digital Health Assessment', 'Telehealth Roadmap', 'Patient Experience Design', 'Technology Selection', 'Implementation Plan'],
    duration: '6-12 weeks',
    priceRange: '$100,000 - $300,000',
    icon: <Smartphone className="w-6 h-6" />
  },
  {
    id: 'medical-device-regulatory',
    title: 'Medical Device Regulatory',
    description: 'FDA and global regulatory strategy for medical devices, SaMD, and AI/ML-enabled technologies.',
    deliverables: ['Regulatory Pathway Assessment', '510(k)/De Novo Strategy', 'Submission Preparation', 'FDA Meeting Support', 'EU MDR Compliance'],
    duration: '8-24 weeks',
    priceRange: '$125,000 - $400,000',
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 'ehr-optimization',
    title: 'EHR Optimization & Implementation',
    description: 'Epic, Cerner, or other EHR implementation, optimization, and workflow redesign for improved clinical efficiency.',
    deliverables: ['Workflow Analysis', 'System Configuration', 'Training Program', 'Go-Live Support', 'Optimization Roadmap'],
    duration: '12-40 weeks',
    priceRange: '$250,000 - $1,500,000',
    icon: <Database className="w-6 h-6" />
  },
  {
    id: 'healthcare-ai',
    title: 'Healthcare AI Implementation',
    description: 'Clinical AI strategy and implementation including diagnostics, clinical decision support, and operational AI.',
    deliverables: ['AI Use Case Assessment', 'Vendor Evaluation', 'Clinical Validation', 'Implementation', 'Monitoring Framework'],
    duration: '10-24 weeks',
    priceRange: '$175,000 - $600,000',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'value-based-care',
    title: 'Value-Based Care Transformation',
    description: 'Design and implement value-based care programs including risk stratification, care management, and performance analytics.',
    deliverables: ['VBC Strategy', 'Population Health Analytics', 'Care Model Design', 'Quality Metrics', 'Financial Modeling'],
    duration: '12-24 weeks',
    priceRange: '$200,000 - $500,000',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'healthcare-security',
    title: 'Healthcare Cybersecurity',
    description: 'HIPAA security assessments, healthcare-specific threat protection, and security program development.',
    deliverables: ['HIPAA Risk Assessment', 'Security Program Design', 'Incident Response Plan', 'Vendor Risk Management', 'Staff Training'],
    duration: '8-16 weeks',
    priceRange: '$100,000 - $350,000',
    icon: <Lock className="w-6 h-6" />
  }
];

// Case Studies
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Regional Health System: Virtual Care Transformation',
    client: '15-Hospital Health System',
    industry: 'Health Systems',
    challenge: 'Legacy health system needed comprehensive telehealth strategy to serve rural communities and compete with disruptors.',
    solution: 'Designed and implemented enterprise virtual care platform with specialty e-consults, remote patient monitoring, and digital front door.',
    results: ['500K+ virtual visits in Year 1', '35% reduction in ED visits', '$45M annual revenue growth', '92% patient satisfaction'],
    image: '/case-studies/health-system.jpg'
  },
  {
    id: 'cs-2',
    title: 'AI Diagnostics Company: FDA De Novo Clearance',
    client: 'AI Medical Device Startup',
    industry: 'Digital Health',
    challenge: 'Novel AI algorithm for diabetic retinopathy screening needed De Novo pathway strategy and clinical validation.',
    solution: 'Developed regulatory strategy, designed pivotal clinical trial, and navigated FDA interactions through clearance.',
    results: ['De Novo clearance in 14 months', 'First autonomous AI diagnostic', 'CMS coverage achieved', '$250M Series C raised'],
    image: '/case-studies/ai-diagnostics.jpg'
  },
  {
    id: 'cs-3',
    title: 'Academic Medical Center: EHR Optimization',
    client: 'Top 20 Academic Medical Center',
    industry: 'Health IT',
    challenge: 'Physician burnout crisis with 4+ hours daily on EHR documentation, leading to turnover and patient safety concerns.',
    solution: 'Implemented ambient AI documentation, optimized clinical workflows, and redesigned order sets and templates.',
    results: ['60% reduction in documentation time', '45% decrease in physician burnout', '$18M annual savings', '40% improvement in patient face time'],
    image: '/case-studies/amc.jpg'
  }
];

// Industry Stats
const INDUSTRY_STATS = [
  { label: 'Digital Health Market', value: '$660B', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Healthcare AI Growth', value: '+47%', icon: <Brain className="w-5 h-5" /> },
  { label: 'Telehealth Adoption', value: '85%', icon: <Wifi className="w-5 h-5" /> },
  { label: 'Healthcare IT Spend', value: '$280B', icon: <Database className="w-5 h-5" /> }
];

const HealthcareConsultingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'cases'>('consultants');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'healthcare',
    serviceType: 'healthcare-consulting',
    serviceName: 'Healthcare & Medical Technology Consulting',
  });

  const expertiseFilters = [
    'all',
    'Digital Health',
    'Medical Device',
    'EHR/Health IT',
    'Healthcare AI',
    'Value-Based Care',
    'Cybersecurity'
  ];

  const filteredConsultants = selectedExpertise === 'all'
    ? HEALTHCARE_CONSULTANTS
    : HEALTHCARE_CONSULTANTS.filter(c => c.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase())));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-gray-950 to-cyan-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
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
                <div className="p-3 bg-teal-500/20 rounded-xl">
                  <HeartPulse className="w-8 h-8 text-teal-400" />
                </div>
                <span className="px-4 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm font-medium">
                  Healthcare & Medical Technology
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Healthcare
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400"> Consulting</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Work with world-class healthcare experts from Mayo Clinic, FDA, Google Health, and leading health systems
                to transform care delivery and accelerate innovation.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('consultants')}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-xl font-semibold transition-all flex items-center gap-2"
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
                  <span>HIPAA Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>BAA Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>100+ Implementations</span>
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
                  <div className="flex items-center gap-3 text-teal-400 mb-3">
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
                    ? 'border-teal-500 text-teal-400'
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
                        ? 'bg-teal-600 text-white'
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
            <div className="mt-12 bg-gradient-to-r from-teal-900/50 to-cyan-900/50 border border-teal-500/30 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Can't find the right expert?</h3>
                  <p className="text-gray-300">
                    Tell us about your project and we'll match you with the perfect consultant within 48 hours.
                  </p>
                </div>
                <button
                  onClick={consultationModal.openModal}
                  className="px-8 py-4 bg-teal-600 hover:bg-teal-500 rounded-xl font-semibold transition-all whitespace-nowrap"
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
              <h2 className="text-3xl font-bold mb-4">Healthcare Consulting Services</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive healthcare technology and transformation services delivered by industry-leading experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HEALTHCARE_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Process Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Engagement Process</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Discovery Session', desc: 'Understand your clinical and operational needs', icon: <Stethoscope className="w-6 h-6" /> },
                  { step: '2', title: 'Expert Matching', desc: 'We match you with domain-specific experts', icon: <Users className="w-6 h-6" /> },
                  { step: '3', title: 'Strategy Design', desc: 'Detailed plans aligned with your goals', icon: <FileText className="w-6 h-6" /> },
                  { step: '4', title: 'Implementation', desc: 'Hands-on support through go-live', icon: <Zap className="w-6 h-6" /> }
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-400">
                        {item.icon}
                      </div>
                      <div className="text-sm text-teal-400 mb-2">Step {item.step}</div>
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
              <h2 className="text-3xl font-bold mb-4">Healthcare Success Stories</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how leading healthcare organizations have transformed with our consulting services.
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
                  quote="Their digital health expertise helped us launch a virtual care program that now serves 500,000 patients. The ROI exceeded all expectations."
                  author="Chief Digital Officer"
                  company="Regional Health System"
                  rating={5}
                />
                <TestimonialCard
                  quote="The FDA regulatory guidance was invaluable. They helped us navigate De Novo pathway and achieve clearance 6 months ahead of schedule."
                  author="CEO"
                  company="AI Diagnostics Startup"
                  rating={5}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Healthcare Capabilities Section */}
      <div className="bg-gray-900/50 border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">Healthcare Technology Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <Smartphone className="w-6 h-6" />, label: 'Digital Health' },
              { icon: <Stethoscope className="w-6 h-6" />, label: 'Telehealth' },
              { icon: <Database className="w-6 h-6" />, label: 'EHR/EMR' },
              { icon: <Brain className="w-6 h-6" />, label: 'Clinical AI' },
              { icon: <Activity className="w-6 h-6" />, label: 'Remote Monitoring' },
              { icon: <Shield className="w-6 h-6" />, label: 'FDA/Regulatory' },
              { icon: <Lock className="w-6 h-6" />, label: 'HIPAA Security' },
              { icon: <Wifi className="w-6 h-6" />, label: 'Interoperability' },
              { icon: <HeartPulse className="w-6 h-6" />, label: 'Value-Based Care' },
              { icon: <Microscope className="w-6 h-6" />, label: 'Med Devices' },
              { icon: <Pill className="w-6 h-6" />, label: 'Pharmacy' },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Analytics' }
            ].map((cap, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:border-teal-500/50 transition-colors"
              >
                <div className="text-teal-400 mb-2 flex justify-center">{cap.icon}</div>
                <div className="text-sm font-medium">{cap.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Healthcare Delivery?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our healthcare experts and discover how technology can improve patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={consultationModal.openModal}
              className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={() => navigate('/register?role=service-provider&industry=healthcare')}
              className="px-8 py-4 bg-teal-700 hover:bg-teal-800 rounded-xl font-semibold transition-all"
            >
              Join as Healthcare Consultant
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
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition-all cursor-pointer group"
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
          {consultant.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg group-hover:text-teal-400 transition-colors">
            {consultant.name}
          </h3>
          <p className="text-sm text-gray-400">{consultant.title}</p>
          <p className="text-sm text-teal-400">{consultant.company}</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{consultant.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {consultant.expertise.slice(0, 3).map((exp, i) => (
          <span key={i} className="px-2 py-1 bg-teal-500/10 text-teal-300 text-xs rounded-lg">
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition-all">
      <div className="text-teal-400 mb-4">{service.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{service.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          {service.duration}
        </div>
      </div>

      <div className="text-teal-400 font-semibold mb-4">{service.priceRange}</div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1"
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-teal-500/50 transition-all">
      <div className="grid md:grid-cols-3">
        <div className="bg-gradient-to-br from-teal-900/50 to-cyan-900/50 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-teal-400 mb-2">{study.industry}</div>
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

export default HealthcareConsultingPage;
