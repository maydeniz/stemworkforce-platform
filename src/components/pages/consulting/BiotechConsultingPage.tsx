// ===========================================
// Biotechnology Consulting Page
// ===========================================
// Expert consultants for biotech R&D, regulatory affairs,
// clinical development, and life sciences strategy
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  ArrowLeft,
  FlaskConical,
  Microscope,
  Dna,
  Pill,
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
  HeartPulse,
  TestTube,
  Beaker,
  Leaf
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

// Sample Data - Top Biotech Consultants
const BIOTECH_CONSULTANTS: Consultant[] = [
  {
    id: 'biotech-1',
    name: 'Dr. Emily Harrison',
    title: 'Chief Scientific Officer',
    company: 'Former Genentech',
    expertise: ['Drug Discovery', 'Clinical Development', 'Regulatory Strategy'],
    bio: 'Led development of 5 FDA-approved biologics at Genentech. PhD in Molecular Biology from MIT. Expert in oncology and immunology therapeutics.',
    hourlyRate: 850,
    rating: 4.98,
    reviewCount: 89,
    projectsCompleted: 62,
    avatar: '/avatars/biotech-consultant-1.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD MIT Molecular Biology', 'Former Genentech CSO', '5 FDA Approvals'],
    industries: ['Pharmaceuticals', 'Biotech', 'Healthcare']
  },
  {
    id: 'biotech-2',
    name: 'Dr. James Patterson',
    title: 'Regulatory Affairs Director',
    company: 'Former FDA CDER',
    expertise: ['FDA Submissions', 'IND/NDA Strategy', 'Regulatory Compliance'],
    bio: '20 years at FDA CDER reviewing biologics applications. Expert in navigating complex regulatory pathways and accelerated approval strategies.',
    hourlyRate: 700,
    rating: 4.97,
    reviewCount: 134,
    projectsCompleted: 98,
    avatar: '/avatars/biotech-consultant-2.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['PharmD Johns Hopkins', 'Former FDA CDER', 'RAC Certified'],
    industries: ['Pharmaceuticals', 'Biotech', 'Medical Devices']
  },
  {
    id: 'biotech-3',
    name: 'Dr. Aisha Patel',
    title: 'Gene Therapy Specialist',
    company: 'Former Spark Therapeutics',
    expertise: ['Gene Therapy', 'Cell Therapy', 'AAV Vectors'],
    bio: 'Pioneer in gene therapy development with 3 approved gene therapies. Expert in AAV manufacturing and clinical translation.',
    hourlyRate: 900,
    rating: 4.99,
    reviewCount: 67,
    projectsCompleted: 45,
    avatar: '/avatars/biotech-consultant-3.jpg',
    isAvailable: true,
    isFeatured: true,
    credentials: ['MD/PhD Penn', 'Former Spark CSO', 'Gene Therapy Pioneer'],
    industries: ['Gene Therapy', 'Rare Diseases', 'Biotech']
  },
  {
    id: 'biotech-4',
    name: 'Dr. Michael Chen',
    title: 'Bioprocess Development Lead',
    company: 'Former Amgen',
    expertise: ['Bioprocess Scale-Up', 'CMC Strategy', 'Manufacturing Excellence'],
    bio: 'Scaled manufacturing for 8 blockbuster biologics at Amgen. Expert in process development, tech transfer, and manufacturing optimization.',
    hourlyRate: 650,
    rating: 4.94,
    reviewCount: 112,
    projectsCompleted: 84,
    avatar: '/avatars/biotech-consultant-4.jpg',
    isAvailable: true,
    isFeatured: false,
    credentials: ['PhD ChemE Stanford', 'Former Amgen VP', 'Lean Six Sigma MBB'],
    industries: ['Biotech', 'Pharmaceuticals', 'CDMO']
  },
  {
    id: 'biotech-5',
    name: 'Dr. Sarah Kim',
    title: 'Clinical Operations Expert',
    company: 'Former Moderna',
    expertise: ['Clinical Trial Design', 'Adaptive Trials', 'Biomarker Strategy'],
    bio: 'Led clinical development for Moderna COVID-19 vaccine. Expert in accelerated development timelines and innovative trial designs.',
    hourlyRate: 750,
    rating: 4.96,
    reviewCount: 78,
    projectsCompleted: 56,
    avatar: '/avatars/biotech-consultant-5.jpg',
    isAvailable: false,
    isFeatured: true,
    credentials: ['MD Harvard', 'Former Moderna VP', 'ACRP Certified'],
    industries: ['Vaccines', 'Infectious Disease', 'Biotech']
  },
  {
    id: 'biotech-6',
    name: 'Dr. Robert Thompson',
    title: 'Synthetic Biology Pioneer',
    company: 'Former Ginkgo Bioworks',
    expertise: ['Synthetic Biology', 'Strain Engineering', 'Biomanufacturing'],
    bio: 'Founded synthetic biology platform at Ginkgo. Expert in organism design, metabolic engineering, and bio-based manufacturing.',
    hourlyRate: 800,
    rating: 4.95,
    reviewCount: 54,
    projectsCompleted: 38,
    avatar: '/avatars/biotech-consultant-6.jpg',
    isAvailable: true,
    isFeatured: false,
    credentials: ['PhD Caltech', 'Former Ginkgo CSO', 'Synthetic Biology Pioneer'],
    industries: ['Synthetic Biology', 'Industrial Biotech', 'Agriculture']
  }
];

// Service Offerings
const BIOTECH_SERVICES: ServiceOffering[] = [
  {
    id: 'drug-discovery',
    title: 'Drug Discovery Strategy',
    description: 'Comprehensive target identification, validation, and lead optimization strategy for novel therapeutics development.',
    deliverables: ['Target Landscape Analysis', 'Competitive Intelligence', 'Lead Optimization Roadmap', 'IP Strategy', 'Partnership Recommendations'],
    duration: '6-12 weeks',
    priceRange: '$100,000 - $350,000',
    icon: <FlaskConical className="w-6 h-6" />
  },
  {
    id: 'regulatory-strategy',
    title: 'Regulatory Strategy & Submissions',
    description: 'End-to-end regulatory strategy development and submission support for IND, NDA, BLA, and global regulatory filings.',
    deliverables: ['Regulatory Pathway Assessment', 'Pre-IND Meeting Support', 'Submission Documents', 'FDA Interaction Strategy', 'Global Filing Strategy'],
    duration: '8-20 weeks',
    priceRange: '$150,000 - $500,000',
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 'clinical-development',
    title: 'Clinical Development Planning',
    description: 'Strategic clinical development planning from Phase 1 through pivotal trials, including protocol design and endpoint selection.',
    deliverables: ['Clinical Development Plan', 'Protocol Synopsis', 'Endpoint Strategy', 'Biomarker Integration', 'Trial Optimization'],
    duration: '8-16 weeks',
    priceRange: '$175,000 - $450,000',
    icon: <HeartPulse className="w-6 h-6" />
  },
  {
    id: 'cmc-strategy',
    title: 'CMC & Manufacturing Strategy',
    description: 'Chemistry, Manufacturing, and Controls strategy for biologics, including process development and technology transfer.',
    deliverables: ['CMC Roadmap', 'Process Development Plan', 'Tech Transfer Protocol', 'Analytical Method Development', 'Scale-Up Strategy'],
    duration: '12-24 weeks',
    priceRange: '$200,000 - $600,000',
    icon: <Beaker className="w-6 h-6" />
  },
  {
    id: 'gene-cell-therapy',
    title: 'Gene & Cell Therapy Development',
    description: 'Specialized consulting for advanced therapies including gene therapy, CAR-T, and cell-based treatments.',
    deliverables: ['Vector Design Strategy', 'Manufacturing Platform', 'Regulatory Pathway', 'Clinical Translation Plan', 'Patient Access Strategy'],
    duration: '12-30 weeks',
    priceRange: '$250,000 - $800,000',
    icon: <Dna className="w-6 h-6" />
  },
  {
    id: 'biotech-bd',
    title: 'Business Development & Partnering',
    description: 'Strategic support for licensing, M&A, and partnership transactions in the life sciences sector.',
    deliverables: ['Asset Valuation', 'Partner Identification', 'Due Diligence Support', 'Deal Structuring', 'Negotiation Support'],
    duration: '6-16 weeks',
    priceRange: '$125,000 - $400,000',
    icon: <Briefcase className="w-6 h-6" />
  }
];

// Case Studies
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Rare Disease Biotech: Accelerated FDA Approval',
    client: 'Emerging Biotech Company',
    industry: 'Rare Diseases',
    challenge: 'Startup with promising gene therapy needed regulatory strategy to achieve breakthrough designation and accelerated approval.',
    solution: 'Developed comprehensive regulatory strategy, secured Breakthrough Therapy designation, and designed pivotal trial with surrogate endpoints.',
    results: ['Breakthrough Therapy Designation in 8 weeks', 'FDA approval 18 months ahead of schedule', '$2.1B acquisition by major pharma', '95% reduction in patient treatment burden'],
    image: '/case-studies/rare-disease.jpg'
  },
  {
    id: 'cs-2',
    title: 'Oncology Platform: Clinical Development Optimization',
    client: 'Mid-Stage Oncology Company',
    industry: 'Oncology',
    challenge: 'Company needed to optimize Phase 2/3 trial design to improve probability of success while reducing timeline and cost.',
    solution: 'Implemented adaptive trial design with biomarker-driven patient selection and innovative endpoints.',
    results: ['40% reduction in patient enrollment', '$45M cost savings', 'Improved response rate to 67%', 'Phase 3 initiation 12 months early'],
    image: '/case-studies/oncology.jpg'
  },
  {
    id: 'cs-3',
    title: 'mRNA Therapeutics: Manufacturing Scale-Up',
    client: 'mRNA Therapeutics Company',
    industry: 'mRNA Technology',
    challenge: 'Needed to scale mRNA manufacturing from lab to commercial while maintaining quality and reducing COGS.',
    solution: 'Designed modular manufacturing platform with continuous processing and real-time quality monitoring.',
    results: ['10x manufacturing capacity increase', '60% reduction in COGS', 'Batch-to-batch consistency >99%', 'EMA and FDA approval of manufacturing process'],
    image: '/case-studies/mrna.jpg'
  }
];

// Industry Stats
const INDUSTRY_STATS = [
  { label: 'Global Biotech Market', value: '$2.4T', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'FDA Novel Approvals 2024', value: '55+', icon: <Pill className="w-5 h-5" /> },
  { label: 'Gene Therapy Trials', value: '2,000+', icon: <Dna className="w-5 h-5" /> },
  { label: 'Biotech Talent Gap', value: '500K+', icon: <Users className="w-5 h-5" /> }
];

const BiotechConsultingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'cases'>('consultants');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'biotech',
    serviceType: 'biotech-consulting',
    serviceName: 'Biotechnology Consulting',
  });

  const expertiseFilters = [
    'all',
    'Drug Discovery',
    'Regulatory',
    'Clinical Development',
    'CMC',
    'Gene Therapy',
    'Synthetic Biology'
  ];

  const filteredConsultants = selectedExpertise === 'all'
    ? BIOTECH_CONSULTANTS
    : BIOTECH_CONSULTANTS.filter(c => c.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase())));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-gray-950 to-teal-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
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
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Dna className="w-8 h-8 text-emerald-400" />
                </div>
                <span className="px-4 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                  Biotechnology
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Biotechnology
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> Consulting</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Work with world-class biotech experts from Genentech, Moderna, FDA, and leading life sciences companies
                to accelerate your drug development and regulatory success.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('consultants')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold transition-all flex items-center gap-2"
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
                  <span>FDA Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>NDA Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>50+ Approvals</span>
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
                  <div className="flex items-center gap-3 text-emerald-400 mb-3">
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
                    ? 'border-emerald-500 text-emerald-400'
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
                        ? 'bg-emerald-600 text-white'
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
            <div className="mt-12 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Can't find the right expert?</h3>
                  <p className="text-gray-300">
                    Tell us about your project and we'll match you with the perfect consultant within 48 hours.
                  </p>
                </div>
                <button
                  onClick={consultationModal.openModal}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold transition-all whitespace-nowrap"
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
              <h2 className="text-3xl font-bold mb-4">Biotechnology Consulting Services</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive biotech services from discovery to commercialization, delivered by industry-leading experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BIOTECH_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Process Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Engagement Process</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Scientific Review', desc: 'Deep-dive into your science and objectives', icon: <Microscope className="w-6 h-6" /> },
                  { step: '2', title: 'Expert Matching', desc: 'We match you with therapeutic area experts', icon: <Users className="w-6 h-6" /> },
                  { step: '3', title: 'Strategy Development', desc: 'Detailed plans tailored to your program', icon: <FileText className="w-6 h-6" /> },
                  { step: '4', title: 'Execution Support', desc: 'Ongoing guidance through milestones', icon: <Zap className="w-6 h-6" /> }
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                        {item.icon}
                      </div>
                      <div className="text-sm text-emerald-400 mb-2">Step {item.step}</div>
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
              <h2 className="text-3xl font-bold mb-4">Biotech Success Stories</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how leading biotech companies have accelerated their programs with our consulting services.
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
                  quote="Their regulatory expertise was instrumental in achieving our Breakthrough Therapy designation. The team's FDA experience is unparalleled."
                  author="CEO"
                  company="Series B Gene Therapy Company"
                  rating={5}
                />
                <TestimonialCard
                  quote="The clinical development strategy they designed saved us $40M and 18 months. Their oncology expertise is world-class."
                  author="Chief Medical Officer"
                  company="Oncology Biotech"
                  rating={5}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Biotech Capabilities Section */}
      <div className="bg-gray-900/50 border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">Therapeutic Areas & Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <HeartPulse className="w-6 h-6" />, label: 'Oncology' },
              { icon: <Dna className="w-6 h-6" />, label: 'Gene Therapy' },
              { icon: <Pill className="w-6 h-6" />, label: 'Small Molecules' },
              { icon: <FlaskConical className="w-6 h-6" />, label: 'Biologics' },
              { icon: <Microscope className="w-6 h-6" />, label: 'Cell Therapy' },
              { icon: <TestTube className="w-6 h-6" />, label: 'mRNA' },
              { icon: <Shield className="w-6 h-6" />, label: 'Immunology' },
              { icon: <Beaker className="w-6 h-6" />, label: 'CNS' },
              { icon: <Leaf className="w-6 h-6" />, label: 'Rare Disease' },
              { icon: <Database className="w-6 h-6" />, label: 'Vaccines' },
              { icon: <Settings className="w-6 h-6" />, label: 'CMC' },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Regulatory' }
            ].map((cap, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:border-emerald-500/50 transition-colors"
              >
                <div className="text-emerald-400 mb-2 flex justify-center">{cap.icon}</div>
                <div className="text-sm font-medium">{cap.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Biotech Program?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our biotech experts and discover how we can help advance your therapeutic development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={consultationModal.openModal}
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={() => navigate('/register?role=service-provider&industry=biotech')}
              className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 rounded-xl font-semibold transition-all"
            >
              Join as Biotech Consultant
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
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer group"
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl font-bold">
          {consultant.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition-colors">
            {consultant.name}
          </h3>
          <p className="text-sm text-gray-400">{consultant.title}</p>
          <p className="text-sm text-emerald-400">{consultant.company}</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{consultant.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {consultant.expertise.slice(0, 3).map((exp, i) => (
          <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-lg">
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
      <div className="text-emerald-400 mb-4">{service.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{service.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          {service.duration}
        </div>
      </div>

      <div className="text-emerald-400 font-semibold mb-4">{service.priceRange}</div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all">
      <div className="grid md:grid-cols-3">
        <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-emerald-400 mb-2">{study.industry}</div>
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

export default BiotechConsultingPage;
