// ===========================================
// Quantum Technologies Consulting Page
// ===========================================
// Expert consultants for quantum computing strategy,
// quantum-safe cryptography, and quantum algorithms
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  ArrowLeft,
  Atom,
  Cpu,
  Lock,
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
  GraduationCap,
  FileText,
  Zap,
  Settings,
  Database,
  Code2,
  Network,
  FlaskConical,
  Binary,
  Waves
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
}

// Sample Data - Top Quantum Consultants
const QUANTUM_CONSULTANTS: Consultant[] = [
  {
    id: 'qc-1',
    name: 'Dr. Robert Hawking',
    title: 'Quantum Technologies Pioneer',
    company: 'Former IBM Quantum',
    expertise: ['Quantum Algorithms', 'Error Correction', 'Quantum Hardware'],
    bio: 'Led quantum computing research at IBM for 12 years. Co-developed the first commercial quantum error correction protocols. Advisor to 3 national quantum initiatives.',
    hourlyRate: 900,
    rating: 4.99,
    reviewCount: 48,
    projectsCompleted: 34,
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD MIT Physics', 'Former IBM Fellow', '200+ Publications'],
    industries: ['Technology', 'Financial Services', 'Government']
  },
  {
    id: 'qc-2',
    name: 'Dr. Lisa Quantum',
    title: 'Quantum Cryptography Expert',
    company: 'Former Google Quantum AI',
    expertise: ['Post-Quantum Cryptography', 'QKD', 'Quantum Security'],
    bio: 'Pioneer in quantum-safe cryptography. Led Google\'s quantum security initiative. Helped governments prepare for the post-quantum era.',
    hourlyRate: 850,
    rating: 4.97,
    reviewCount: 62,
    projectsCompleted: 45,
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Caltech', 'Former Google Q AI', 'NIST Advisor'],
    industries: ['Cybersecurity', 'Financial Services', 'Defense']
  },
  {
    id: 'qc-3',
    name: 'Dr. Yuki Tanaka',
    title: 'Quantum Machine Learning',
    company: 'Former D-Wave Systems',
    expertise: ['Quantum ML', 'Optimization', 'Quantum Annealing'],
    bio: 'Expert in quantum machine learning and optimization algorithms. Helped Fortune 500 companies achieve quantum advantage in logistics and finance.',
    hourlyRate: 750,
    rating: 4.95,
    reviewCount: 41,
    projectsCompleted: 29,
    isAvailable: true,
    isFeatured: false,
    credentials: ['PhD Stanford', 'Former D-Wave Lead', 'QML Pioneer'],
    industries: ['Logistics', 'Finance', 'Manufacturing']
  },
  {
    id: 'qc-4',
    name: 'Dr. Michael Sterling',
    title: 'Quantum Strategy Advisor',
    company: 'Former McKinsey Quantum Practice',
    expertise: ['Quantum Strategy', 'Use Case Identification', 'Quantum Readiness'],
    bio: 'Founded McKinsey\'s quantum computing practice. Has advised 50+ enterprises on quantum strategy and readiness assessments.',
    hourlyRate: 700,
    rating: 4.96,
    reviewCount: 87,
    projectsCompleted: 63,
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Oxford Physics', 'McKinsey Partner', 'World Economic Forum'],
    industries: ['All Industries']
  },
  {
    id: 'qc-5',
    name: 'Dr. Anna Petrova',
    title: 'Quantum Chemistry Specialist',
    company: 'Former Roche Quantum',
    expertise: ['Quantum Chemistry', 'Drug Discovery', 'Molecular Simulation'],
    bio: 'Pioneered quantum computing applications in pharmaceutical R&D. Led quantum-accelerated drug discovery at Roche.',
    hourlyRate: 800,
    rating: 4.94,
    reviewCount: 35,
    projectsCompleted: 24,
    isAvailable: false,
    isFeatured: false,
    credentials: ['PhD ETH Zurich', 'Former Roche Q Lead', '80+ Patents'],
    industries: ['Pharmaceuticals', 'Chemicals', 'Materials Science']
  },
  {
    id: 'qc-6',
    name: 'Dr. James Chen',
    title: 'Quantum Hardware Architect',
    company: 'Former IonQ',
    expertise: ['Trapped Ion Systems', 'Quantum Hardware', 'System Integration'],
    bio: 'Designed trapped ion quantum processors at IonQ. Expert in quantum hardware selection and enterprise system integration.',
    hourlyRate: 850,
    rating: 4.98,
    reviewCount: 29,
    projectsCompleted: 21,
    isAvailable: true,
    isFeatured: true,
    credentials: ['PhD Berkeley', 'Former IonQ Principal', '50 Patents'],
    industries: ['Technology', 'Research', 'Defense']
  }
];

// Service Offerings
const QUANTUM_SERVICES: ServiceOffering[] = [
  {
    id: 'quantum-strategy',
    title: 'Quantum Readiness Assessment',
    description: 'Comprehensive evaluation of your organization\'s quantum computing readiness, including use case identification and strategic roadmap development.',
    deliverables: ['Quantum Maturity Assessment', 'Use Case Portfolio', '5-Year Quantum Roadmap', 'Investment Framework', 'Skills Gap Analysis'],
    duration: '6-10 weeks',
    priceRange: '$125,000 - $350,000',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'pqc-migration',
    title: 'Post-Quantum Cryptography Migration',
    description: 'Prepare your organization for the post-quantum era with cryptographic inventory, risk assessment, and migration planning.',
    deliverables: ['Cryptographic Inventory', 'Risk Assessment', 'Migration Roadmap', 'Vendor Evaluation', 'Implementation Support'],
    duration: '12-24 weeks',
    priceRange: '$200,000 - $750,000',
    icon: <Lock className="w-6 h-6" />
  },
  {
    id: 'quantum-poc',
    title: 'Quantum Proof of Concept',
    description: 'Hands-on quantum computing proof of concept for your highest-value use case, with benchmarking against classical approaches.',
    deliverables: ['Use Case Selection', 'Algorithm Development', 'Hardware Evaluation', 'Performance Benchmarks', 'Production Roadmap'],
    duration: '8-16 weeks',
    priceRange: '$175,000 - $500,000',
    icon: <FlaskConical className="w-6 h-6" />
  },
  {
    id: 'quantum-training',
    title: 'Quantum Technologies Training',
    description: 'Executive and technical training programs to build quantum literacy across your organization.',
    deliverables: ['Executive Briefings', 'Technical Workshops', 'Hands-on Labs', 'Certification Program', 'Ongoing Learning Path'],
    duration: '2-8 weeks',
    priceRange: '$50,000 - $200,000',
    icon: <GraduationCap className="w-6 h-6" />
  },
  {
    id: 'quantum-optimization',
    title: 'Quantum Optimization Implementation',
    description: 'Implement quantum-inspired or true quantum optimization solutions for logistics, finance, or scheduling problems.',
    deliverables: ['Problem Formulation', 'Algorithm Selection', 'Implementation', 'Classical Hybrid Integration', 'Performance Optimization'],
    duration: '10-20 weeks',
    priceRange: '$250,000 - $800,000',
    icon: <Settings className="w-6 h-6" />
  },
  {
    id: 'quantum-advisory',
    title: 'Quantum Advisory Retainer',
    description: 'Ongoing access to quantum experts for strategic guidance, technology evaluation, and industry insights.',
    deliverables: ['Monthly Strategy Sessions', 'Technology Briefings', 'Investment Due Diligence', 'Partnership Evaluation', 'Industry Intel'],
    duration: '12-month commitment',
    priceRange: '$15,000 - $50,000/month',
    icon: <MessageSquare className="w-6 h-6" />
  }
];

// Case Studies
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'qcs-1',
    title: 'Global Bank: Post-Quantum Security Transformation',
    client: 'Top 5 Global Bank',
    industry: 'Financial Services',
    challenge: 'With $2T in assets under management, the bank needed to protect against "harvest now, decrypt later" attacks and prepare for NIST PQC standards.',
    solution: 'Conducted comprehensive cryptographic inventory across 500+ applications, developed migration roadmap, and implemented hybrid cryptographic solutions.',
    results: ['Identified 2,400+ cryptographic vulnerabilities', 'Developed 5-year migration roadmap', 'Implemented PQC pilots for trading systems', 'Achieved regulatory compliance ahead of schedule']
  },
  {
    id: 'qcs-2',
    title: 'Pharmaceutical Giant: Quantum Drug Discovery',
    client: 'Top 10 Pharma Company',
    industry: 'Life Sciences',
    challenge: 'Traditional molecular simulation taking 6+ months per compound, limiting drug discovery pipeline to 50 candidates per year.',
    solution: 'Implemented quantum-classical hybrid workflows for molecular simulation, using quantum computers for electron structure calculations.',
    results: ['80% reduction in simulation time', '3x increase in candidate throughput', '$120M estimated R&D savings', 'First quantum-designed drug in clinical trials']
  },
  {
    id: 'qcs-3',
    title: 'Logistics Leader: Quantum Route Optimization',
    client: 'Global Logistics Company',
    industry: 'Transportation & Logistics',
    challenge: 'Managing 100,000+ daily deliveries with classical optimization taking hours, unable to respond to real-time disruptions.',
    solution: 'Deployed quantum-inspired optimization for vehicle routing, with real-time re-optimization capabilities.',
    results: ['15% reduction in total miles driven', '$45M annual fuel savings', 'Real-time optimization in minutes', '23% improvement in on-time delivery']
  }
];

// Industry Stats
const INDUSTRY_STATS = [
  { label: 'Quantum Market by 2030', value: '$125B', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Q-Day Expected', value: '2030-35', icon: <Lock className="w-5 h-5" /> },
  { label: 'Enterprise Pilots', value: '500+', icon: <Building2 className="w-5 h-5" /> },
  { label: 'Quantum Advantage Use Cases', value: '50+', icon: <Zap className="w-5 h-5" /> }
];

const QuantumConsultingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'cases'>('consultants');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'quantum',
    serviceType: 'quantum-consulting',
    serviceName: 'Quantum Technologies Consulting',
  });

  const expertiseFilters = [
    'all',
    'Quantum Strategy',
    'Post-Quantum Cryptography',
    'Quantum Algorithms',
    'Quantum ML',
    'Quantum Hardware'
  ];

  const filteredConsultants = selectedExpertise === 'all'
    ? QUANTUM_CONSULTANTS
    : QUANTUM_CONSULTANTS.filter(c =>
        c.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-gray-950 to-purple-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          {/* Quantum particle effect */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
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
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Atom className="w-8 h-8 text-cyan-400" />
                </div>
                <span className="px-4 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium">
                  Quantum Technologies
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Quantum Technologies
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"> Consulting</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Work with quantum pioneers from IBM, Google, IonQ, and leading research institutions
                to prepare your organization for the quantum era.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('consultants')}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Browse Experts
                </button>
                <button
                  onClick={consultationModal.openModal}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Request Assessment
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>PhD-Level Experts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>Clearance Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>NIST Aligned</span>
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
                  <div className="flex items-center gap-3 text-cyan-400 mb-3">
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

      {/* Quantum Risk Alert Banner */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border-y border-orange-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Lock className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-orange-300">Post-Quantum Alert:</span>
              <span className="text-gray-300 ml-2">
                NIST PQC standards finalized. Is your cryptography quantum-safe? Our experts can help.
              </span>
            </div>
            <button
              onClick={consultationModal.openModal}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-sm font-medium transition-all"
            >
              Get PQC Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'consultants', label: 'Quantum Experts', icon: <Users className="w-4 h-4" /> },
              { id: 'services', label: 'Service Offerings', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'cases', label: 'Case Studies', icon: <FileText className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
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
                        ? 'bg-cyan-600 text-white'
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
                <div
                  key={consultant.id}
                  onClick={() => navigate(`/service-providers/${consultant.id}`)}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer group"
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                      {consultant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                        {consultant.name}
                      </h3>
                      <p className="text-sm text-gray-400">{consultant.title}</p>
                      <p className="text-sm text-cyan-400">{consultant.company}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">{consultant.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {consultant.expertise.slice(0, 3).map((exp, i) => (
                      <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-300 text-xs rounded-lg">
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
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Quantum Consulting Services</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From readiness assessments to post-quantum cryptography migration, we help you navigate the quantum future.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {QUANTUM_SERVICES.map((service) => (
                <div key={service.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
                  <div className="text-cyan-400 mb-4">{service.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{service.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {service.duration}
                    </div>
                  </div>

                  <div className="text-cyan-400 font-semibold mb-4">{service.priceRange}</div>

                  <ul className="space-y-2">
                    {service.deliverables.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Quantum Success Stories</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how leading organizations are achieving quantum advantage with our consultants.
              </p>
            </div>

            <div className="space-y-8">
              {CASE_STUDIES.map((study) => (
                <div key={study.id} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="grid md:grid-cols-3">
                    <div className="bg-gradient-to-br from-cyan-900/50 to-purple-900/50 p-8 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm text-cyan-400 mb-2">{study.industry}</div>
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quantum Capabilities */}
      <div className="bg-gray-900/50 border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">Quantum Capabilities We Deliver</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <Atom className="w-6 h-6" />, label: 'Quantum Strategy' },
              { icon: <Lock className="w-6 h-6" />, label: 'PQC Migration' },
              { icon: <Binary className="w-6 h-6" />, label: 'Quantum Algorithms' },
              { icon: <FlaskConical className="w-6 h-6" />, label: 'Quantum Chemistry' },
              { icon: <Network className="w-6 h-6" />, label: 'Quantum ML' },
              { icon: <Cpu className="w-6 h-6" />, label: 'Hardware Selection' },
              { icon: <Settings className="w-6 h-6" />, label: 'Optimization' },
              { icon: <Shield className="w-6 h-6" />, label: 'Quantum Security' },
              { icon: <Waves className="w-6 h-6" />, label: 'Quantum Sensing' },
              { icon: <Code2 className="w-6 h-6" />, label: 'SDK Training' },
              { icon: <Database className="w-6 h-6" />, label: 'Quantum Simulation' },
              { icon: <Building2 className="w-6 h-6" />, label: 'Enterprise Readiness' }
            ].map((cap, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:border-cyan-500/50 transition-colors"
              >
                <div className="text-cyan-400 mb-2 flex justify-center">{cap.icon}</div>
                <div className="text-sm font-medium">{cap.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Prepare for the Quantum Era</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            The quantum future is coming. Our experts can help you assess your readiness, protect your cryptography, and identify quantum opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={consultationModal.openModal}
              className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Request Quantum Assessment
            </button>
            <button
              onClick={() => navigate('/register?role=service-provider&industry=quantum')}
              className="px-8 py-4 bg-cyan-700 hover:bg-cyan-800 rounded-xl font-semibold transition-all"
            >
              Join as Quantum Expert
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

export default QuantumConsultingPage;
