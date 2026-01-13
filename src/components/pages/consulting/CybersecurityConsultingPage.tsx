// ===========================================
// Cybersecurity Consulting Page
// Industry-specific consulting for enterprise security,
// zero trust, threat intelligence, and compliance
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConsultationModal } from '@/hooks';
import { ConsultationRequestModal, AuthRequiredModal } from '@/components/common';
import {
  Shield,
  Eye,
  Users,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Target,
  BookOpen,
  Phone,
  Mail,
  Calendar,
  BadgeCheck,
  Bug,
  Fingerprint,
  Network,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Laptop,
  CloudCog,
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
  threatsPrevented?: string;
}

// ===========================================
// Sample Data - Cybersecurity Consultants
// ===========================================

const cybersecurityConsultants: Consultant[] = [
  {
    id: 'cyber-1',
    name: 'Marcus Williams',
    title: 'Former CISO',
    company: 'Former JPMorgan Chase',
    expertise: ['Enterprise Security', 'Zero Trust', 'Risk Management', 'Board Advisory'],
    rating: 4.98,
    reviews: 94,
    hourlyRate: 625,
    availability: 'limited',
    image: '/images/consultants/cyber-1.jpg',
    bio: 'Former CISO at JPMorgan Chase overseeing $600M+ security budget and 3,000+ security professionals. Expert in building world-class security programs for Fortune 100 companies.',
    credentials: ['CISSP', 'CISM', 'Former CISO JPMorgan', 'Forbes Cybersecurity Council'],
    yearsExperience: 28,
    projectsCompleted: 76,
    specialization: 'Enterprise Security Strategy',
    clearance: 'TS/SCI',
  },
  {
    id: 'cyber-2',
    name: 'Dr. Emily Zhang',
    title: 'Chief Threat Intelligence Officer',
    company: 'Former NSA',
    expertise: ['Threat Intelligence', 'Nation-State Threats', 'APT Analysis', 'Cyber Warfare'],
    rating: 4.97,
    reviews: 68,
    hourlyRate: 700,
    availability: 'available',
    image: '/images/consultants/cyber-2.jpg',
    bio: 'Former NSA senior analyst with 20 years in government intelligence. Expert in nation-state threat analysis, APT hunting, and strategic threat intelligence programs.',
    credentials: ['PhD Cybersecurity - Georgia Tech', 'Former NSA Senior Analyst', 'SANS Instructor'],
    yearsExperience: 22,
    projectsCompleted: 54,
    specialization: 'Threat Intelligence & APT',
    clearance: 'TS/SCI',
  },
  {
    id: 'cyber-3',
    name: 'David Chen',
    title: 'VP of Offensive Security',
    company: 'Former Mandiant',
    expertise: ['Red Team', 'Penetration Testing', 'Adversary Simulation', 'Attack Surface'],
    rating: 4.96,
    reviews: 82,
    hourlyRate: 575,
    availability: 'available',
    image: '/images/consultants/cyber-3.jpg',
    bio: 'Former VP at Mandiant leading red team operations for Fortune 500 companies. Expert in adversary simulation, advanced penetration testing, and breach assessment.',
    credentials: ['OSCP', 'OSCE', 'Former Mandiant VP', 'DEF CON Speaker'],
    yearsExperience: 18,
    projectsCompleted: 142,
    specialization: 'Offensive Security & Red Team',
  },
  {
    id: 'cyber-4',
    name: 'Sarah Mitchell',
    title: 'Head of Cloud Security',
    company: 'Former Microsoft',
    expertise: ['Cloud Security', 'Azure/AWS/GCP', 'DevSecOps', 'Container Security'],
    rating: 4.95,
    reviews: 71,
    hourlyRate: 550,
    availability: 'available',
    image: '/images/consultants/cyber-4.jpg',
    bio: 'Former Microsoft principal security architect. Built cloud security programs for global enterprises across Azure, AWS, and GCP environments.',
    credentials: ['CCSP', 'AWS Security Specialty', 'Azure Security Architect', 'Microsoft Fellow'],
    yearsExperience: 16,
    projectsCompleted: 89,
    specialization: 'Cloud Security Architecture',
  },
  {
    id: 'cyber-5',
    name: 'Robert Thompson',
    title: 'Director of Compliance',
    company: 'Former Deloitte',
    expertise: ['SOC 2', 'HIPAA', 'PCI-DSS', 'FedRAMP', 'Compliance Automation'],
    rating: 4.94,
    reviews: 63,
    hourlyRate: 475,
    availability: 'available',
    image: '/images/consultants/cyber-5.jpg',
    bio: 'Former Deloitte director leading cybersecurity compliance for healthcare, financial services, and federal clients. Expert in SOC 2, HIPAA, PCI-DSS, and FedRAMP.',
    credentials: ['CISA', 'CRISC', 'PCI QSA', 'Former Deloitte Director'],
    yearsExperience: 20,
    projectsCompleted: 167,
    specialization: 'Security Compliance & Audit',
  },
  {
    id: 'cyber-6',
    name: 'Dr. James Anderson',
    title: 'Chief Security Architect',
    company: 'Former Google',
    expertise: ['Zero Trust', 'Identity & Access', 'Security Architecture', 'SASE'],
    rating: 4.96,
    reviews: 58,
    hourlyRate: 600,
    availability: 'limited',
    image: '/images/consultants/cyber-6.jpg',
    bio: 'Former Google principal security architect who helped design BeyondCorp zero trust framework. Expert in identity-centric security architectures for global enterprises.',
    credentials: ['PhD Computer Science - MIT', 'Google Security Fellow', 'BeyondCorp Architect'],
    yearsExperience: 19,
    projectsCompleted: 67,
    specialization: 'Zero Trust Architecture',
  },
];

// ===========================================
// Service Offerings
// ===========================================

const serviceOfferings: ServiceOffering[] = [
  {
    id: 'security-program',
    title: 'Security Program Development',
    description: 'Build a comprehensive, risk-based cybersecurity program aligned with business objectives and industry frameworks like NIST CSF, ISO 27001, and CIS Controls.',
    icon: Shield,
    priceRange: '$150,000 - $500,000',
    duration: '3-9 months',
    deliverables: [
      'Security program assessment',
      'Risk-based security strategy',
      'Policy & procedure development',
      'Security governance framework',
      'Metrics & KPI dashboard',
      'Board-ready reporting',
      'Security awareness program',
      'Continuous improvement roadmap',
    ],
    popular: true,
  },
  {
    id: 'zero-trust',
    title: 'Zero Trust Architecture',
    description: 'Design and implement a zero trust security architecture that verifies every user, device, and transaction regardless of network location.',
    icon: Fingerprint,
    priceRange: '$200,000 - $750,000',
    duration: '6-18 months',
    deliverables: [
      'Zero trust maturity assessment',
      'Identity-centric architecture design',
      'Microsegmentation strategy',
      'ZTNA implementation plan',
      'Device trust framework',
      'Data classification & protection',
      'Vendor evaluation & selection',
      'Phased implementation roadmap',
    ],
    popular: true,
  },
  {
    id: 'threat-intelligence',
    title: 'Threat Intelligence Program',
    description: 'Build an actionable threat intelligence program that provides early warning of threats and enables proactive defense.',
    icon: Radar,
    priceRange: '$100,000 - $350,000',
    duration: '3-6 months',
    deliverables: [
      'Threat landscape assessment',
      'Intelligence requirements analysis',
      'Collection strategy development',
      'TIP platform selection',
      'Analyst training program',
      'Intelligence sharing framework',
      'Detection rule development',
      'Executive threat briefings',
    ],
  },
  {
    id: 'red-team',
    title: 'Red Team Assessment',
    description: 'Simulate real-world attacks against your organization to identify vulnerabilities and test detection and response capabilities.',
    icon: Bug,
    priceRange: '$75,000 - $250,000',
    duration: '4-8 weeks',
    deliverables: [
      'Reconnaissance & OSINT',
      'Social engineering testing',
      'Network penetration testing',
      'Application security testing',
      'Physical security assessment',
      'Purple team exercises',
      'Executive debrief',
      'Remediation roadmap',
    ],
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security Assessment',
    description: 'Comprehensive security assessment of your cloud environments across AWS, Azure, and GCP to identify risks and implement controls.',
    icon: CloudCog,
    priceRange: '$75,000 - $300,000',
    duration: '4-12 weeks',
    deliverables: [
      'Cloud security posture assessment',
      'IAM policy review',
      'Network security analysis',
      'Data protection review',
      'Container & Kubernetes security',
      'DevSecOps pipeline review',
      'Compliance gap analysis',
      'Remediation prioritization',
    ],
  },
  {
    id: 'incident-response',
    title: 'Incident Response & Recovery',
    description: 'Build incident response capabilities and recover from active security incidents with forensics, containment, and remediation support.',
    icon: ShieldAlert,
    priceRange: '$50,000 - $500,000',
    duration: '1-12 weeks',
    deliverables: [
      'Incident triage & assessment',
      'Forensic investigation',
      'Malware analysis',
      'Containment & eradication',
      'Business continuity support',
      'Root cause analysis',
      'Lessons learned report',
      'IR program enhancement',
    ],
  },
];

// ===========================================
// Case Studies
// ===========================================

const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Global Bank Zero Trust Transformation',
    client: 'Top 5 Global Bank',
    industry: 'Financial Services',
    challenge: 'A global bank with 200,000 employees across 60 countries needed to transform from perimeter-based security to zero trust while maintaining regulatory compliance.',
    solution: 'We designed and implemented a comprehensive zero trust architecture including identity governance, microsegmentation, and continuous verification across all systems.',
    results: [
      '85% reduction in lateral movement risk',
      'Eliminated VPN for 150,000 remote workers',
      'Achieved continuous compliance automation',
      'Reduced attack surface by 60%',
      '$50M annual security cost savings',
    ],
    image: '/images/case-studies/bank-zt.jpg',
    consultant: 'Dr. James Anderson',
    threatsPrevented: '10M+ blocked threats/day',
  },
  {
    id: 'case-2',
    title: 'Healthcare System Ransomware Recovery',
    client: 'Regional Healthcare System',
    industry: 'Healthcare',
    challenge: 'A major healthcare system was hit by ransomware that encrypted 75% of systems, threatening patient care and HIPAA compliance.',
    solution: 'Our team led incident response, containing the attack within 4 hours, restoring critical systems within 48 hours, and implementing enhanced security controls.',
    results: [
      'Critical systems restored in 48 hours',
      'Zero ransom payment made',
      'Patient care maintained throughout',
      'HIPAA compliance preserved',
      'Built SOC with 24/7 monitoring',
    ],
    image: '/images/case-studies/healthcare-ir.jpg',
    consultant: 'Marcus Williams',
    threatsPrevented: 'Full recovery achieved',
  },
  {
    id: 'case-3',
    title: 'Tech Company APT Detection & Response',
    client: 'Fortune 500 Tech Company',
    industry: 'Technology',
    challenge: 'A leading technology company suspected nation-state actors had penetrated their network but couldn\'t confirm scope or attribution.',
    solution: 'We conducted deep threat hunting, identified a sophisticated APT group with 6-month dwell time, and led a comprehensive remediation effort.',
    results: [
      'Nation-state APT group identified',
      'All 47 compromised systems found',
      'Threat actors fully evicted',
      'Advanced detection capabilities deployed',
      'Attribution shared with FBI/CISA',
    ],
    image: '/images/case-studies/apt-hunt.jpg',
    consultant: 'Dr. Emily Zhang',
    threatsPrevented: 'APT evicted',
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
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
            {consultant.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
              <BadgeCheck className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-red-600 font-medium">{consultant.title}</p>
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
            <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {consultant.credentials.slice(0, 3).map((cred, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
              {cred}
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
          <button onClick={onRequestConsultation} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
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
        service.popular ? 'ring-2 ring-red-500' : ''
      }`}
    >
      {service.popular && (
        <div className="bg-red-500 text-white text-center py-1 text-sm font-medium">
          Most Requested
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-red-600 font-semibold">{service.priceRange}</span>
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
              <li className="text-sm text-red-600 font-medium ml-6">
                +{service.deliverables.length - 4} more deliverables
              </li>
            )}
          </ul>
        </div>

        <button className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
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
      <div className="h-48 bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center relative">
        <Shield className="w-24 h-24 text-white/30" />
        {study.threatsPrevented && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
            <span className="text-red-600 font-bold text-sm">{study.threatsPrevented}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
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

        <button className="mt-6 w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
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

const CybersecurityConsultingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultants' | 'services' | 'case-studies'>('consultants');

  // Consultation modal hook
  const consultationModal = useConsultationModal({
    industry: 'cybersecurity',
    serviceType: 'cybersecurity-consulting',
    serviceName: 'Cybersecurity Consulting',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Threat Alert Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              Critical: 2024 saw 38% increase in ransomware attacks. Is your organization prepared?
            </span>
            <a href="#services" className="underline font-semibold hover:text-red-100">
              Get assessment →
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full mb-6">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-medium">Enterprise Cybersecurity Consulting</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Defend Your Digital
                <span className="text-red-400"> Enterprise</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                World-class security expertise from former CISOs, NSA analysts, and leading
                security architects. Protect your organization against sophisticated threats
                with proven strategies and cutting-edge solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Assessment
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency Response
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <ShieldAlert className="w-10 h-10 text-red-400 mb-3" />
                <div className="text-3xl font-bold">$4.45M</div>
                <div className="text-gray-300">Avg. Breach Cost</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Clock className="w-10 h-10 text-red-400 mb-3" />
                <div className="text-3xl font-bold">277</div>
                <div className="text-gray-300">Days to Detect</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Bug className="w-10 h-10 text-red-400 mb-3" />
                <div className="text-3xl font-bold">3.4B</div>
                <div className="text-gray-300">Phishing Emails/Day</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Target className="w-10 h-10 text-red-400 mb-3" />
                <div className="text-3xl font-bold">83%</div>
                <div className="text-gray-300">Orgs Attacked</div>
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
                    ? 'border-red-500 text-red-600'
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
                Elite Security Professionals
              </h2>
              <p className="text-gray-600">
                Work with former CISOs, NSA analysts, and security architects from leading organizations
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {cybersecurityConsultants.map((consultant, index) => (
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
                Comprehensive Cybersecurity Services
              </h2>
              <p className="text-gray-600">
                From strategic advisory to incident response, we protect your digital enterprise
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
                Battle-Tested Security Expertise
              </h2>
              <p className="text-gray-600">
                See how our consultants have protected Fortune 500 companies from sophisticated threats
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

      {/* Security Domains Section */}
      <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Full-Spectrum Cyber Defense
            </h2>
            <p className="text-red-100 max-w-2xl mx-auto">
              Our experts cover every domain of enterprise cybersecurity
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: 'Security Strategy', desc: 'Program development & governance' },
              { icon: Fingerprint, label: 'Identity & Access', desc: 'Zero trust & IAM' },
              { icon: Network, label: 'Network Security', desc: 'Segmentation & SASE' },
              { icon: CloudCog, label: 'Cloud Security', desc: 'AWS, Azure, GCP' },
              { icon: Laptop, label: 'Endpoint Security', desc: 'EDR & XDR solutions' },
              { icon: Eye, label: 'Threat Detection', desc: 'SIEM & SOC operations' },
              { icon: Bug, label: 'Offensive Security', desc: 'Red team & pen testing' },
              { icon: ShieldCheck, label: 'Compliance', desc: 'SOC 2, HIPAA, PCI-DSS' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold mb-1">{item.label}</h3>
                <p className="text-red-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frameworks Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Framework & Compliance Expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We help you align with industry-leading security frameworks and compliance requirements
            </p>
          </div>
          <div className="grid md:grid-cols-6 gap-6">
            {[
              'NIST CSF',
              'ISO 27001',
              'SOC 2',
              'PCI-DSS',
              'HIPAA',
              'FedRAMP',
              'CMMC',
              'CIS Controls',
              'MITRE ATT&CK',
              'GDPR',
              'CCPA',
              'Zero Trust',
            ].map((framework, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-red-50 transition-colors">
                <span className="font-semibold text-gray-900">{framework}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Response Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full mb-4">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-medium text-sm">24/7 Emergency Response</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Under Active Attack?
              </h2>
              <p className="text-gray-400 mb-6">
                Our incident response team is available 24/7 to help you contain, investigate,
                and recover from security incidents. Don't face a breach alone.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency Hotline
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  IR Retainer Info
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Our IR Process</h3>
              <div className="space-y-4">
                {[
                  { step: '1', label: 'Triage', desc: 'Immediate assessment within 1 hour' },
                  { step: '2', label: 'Contain', desc: 'Stop the bleeding and limit damage' },
                  { step: '3', label: 'Investigate', desc: 'Full forensic analysis and attribution' },
                  { step: '4', label: 'Remediate', desc: 'Eliminate threats and harden defenses' },
                  { step: '5', label: 'Recover', desc: 'Restore operations and prevent recurrence' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-gray-400 text-sm">{item.desc}</div>
                    </div>
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
              Secure Your Enterprise Today
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you need a security assessment, zero trust implementation, or incident response,
              our experts are ready to protect your organization.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={consultationModal.openModal} className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2">
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

export default CybersecurityConsultingPage;
