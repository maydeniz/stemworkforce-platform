import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Lock, Eye, Server, Database, CheckCircle,
  FileText, Download, ExternalLink, Award, Building2,
  Globe, Clock, AlertTriangle,
  ChevronRight, ArrowRight
} from 'lucide-react';

// =====================================================
// SECURITY & COMPLIANCE PAGE
// Public-facing page demonstrating compliance readiness
// =====================================================

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/50' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/50' },
};

const CERTIFICATIONS = [
  {
    id: 'soc2',
    name: 'SOC 2 Type 2',
    status: 'in_progress',
    icon: Shield,
    color: 'emerald',
    description: 'Service Organization Control 2 - Trust Services Criteria covering Security, Availability, Processing Integrity, Confidentiality, and Privacy.',
    timeline: 'Q2 2025',
    details: [
      'Annual third-party audits',
      'Continuous monitoring controls',
      'Trust Services Criteria compliance',
      'AICPA standards adherence',
    ],
  },
  {
    id: 'fedramp',
    name: 'FedRAMP Moderate',
    status: 'in_progress',
    icon: Building2,
    color: 'blue',
    description: 'Federal Risk and Authorization Management Program - Standardized approach to security assessment for cloud services used by federal agencies.',
    timeline: 'Q3 2025',
    details: [
      'NIST 800-53 Rev 5 controls',
      '325+ security controls implemented',
      '3PAO assessment scheduled',
      'Continuous monitoring program',
    ],
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    status: 'compliant',
    icon: Eye,
    color: 'violet',
    description: 'Health Insurance Portability and Accountability Act compliance for any health-related data handling.',
    timeline: 'Current',
    details: [
      'PHI encryption at rest and in transit',
      'Access controls and audit logging',
      'Business Associate Agreements',
      'Workforce training and policies',
    ],
  },
  {
    id: 'gdpr',
    name: 'GDPR Ready',
    status: 'compliant',
    icon: Globe,
    color: 'indigo',
    description: 'General Data Protection Regulation compliance for data privacy of EU residents.',
    timeline: 'Current',
    details: [
      'Data subject rights implementation',
      'Consent management',
      'Data processing agreements',
      'Privacy by design principles',
    ],
  },
];

const SECURITY_FEATURES = [
  {
    category: 'Data Protection',
    icon: Database,
    features: [
      { name: 'Encryption at Rest', description: 'AES-256 encryption for all stored data', status: 'active' },
      { name: 'Encryption in Transit', description: 'TLS 1.3 for all data transmission', status: 'active' },
      { name: 'Key Management', description: 'AWS KMS with FIPS 140-2 Level 3 HSMs', status: 'active' },
      { name: 'Data Residency', description: 'US-only data storage locations', status: 'active' },
    ],
  },
  {
    category: 'Access Control',
    icon: Lock,
    features: [
      { name: 'Multi-Factor Authentication', description: 'Required for all user accounts', status: 'active' },
      { name: 'Role-Based Access Control', description: 'Granular permissions per user role', status: 'active' },
      { name: 'Single Sign-On', description: 'SAML 2.0 and OAuth 2.0 support', status: 'active' },
      { name: 'Session Management', description: 'Configurable timeouts and device trust', status: 'active' },
    ],
  },
  {
    category: 'Monitoring & Detection',
    icon: Eye,
    features: [
      { name: 'Audit Logging', description: 'Comprehensive activity logs with 1-year retention', status: 'active' },
      { name: 'SIEM Integration', description: '24/7 security event monitoring', status: 'active' },
      { name: 'Intrusion Detection', description: 'Real-time threat detection and alerting', status: 'active' },
      { name: 'Vulnerability Scanning', description: 'Weekly automated scans and remediation', status: 'active' },
    ],
  },
  {
    category: 'Infrastructure Security',
    icon: Server,
    features: [
      { name: 'Cloud Infrastructure', description: 'AWS with GovCloud readiness', status: 'active' },
      { name: 'DDoS Protection', description: 'AWS Shield and WAF', status: 'active' },
      { name: 'Backup & Recovery', description: 'Daily backups with cross-region replication', status: 'active' },
      { name: 'Disaster Recovery', description: 'RTO 4 hours, RPO 1 hour', status: 'active' },
    ],
  },
];

const DOCUMENTS = [
  { name: 'Security Whitepaper', description: 'Comprehensive security architecture overview', available: true, icon: FileText },
  { name: 'Privacy Policy', description: 'How we collect, use, and protect your data', available: true, icon: Eye },
  { name: 'Terms of Service', description: 'Platform usage terms and conditions', available: true, icon: FileText },
  { name: 'Data Processing Agreement', description: 'For enterprise customers and partners', available: true, icon: FileText },
  { name: 'SOC 2 Type 2 Report', description: 'Available upon request after certification', available: false, icon: Shield },
  { name: 'FedRAMP Package', description: 'Available upon ATO issuance', available: false, icon: Building2 },
];

const FAQS = [
  {
    question: 'Is the platform FedRAMP authorized?',
    answer: 'We are actively pursuing FedRAMP Moderate authorization with a target ATO date of Q3 2025. Our platform has been designed from the ground up to meet FedRAMP requirements, including NIST 800-53 controls and continuous monitoring.',
  },
  {
    question: 'How is my data protected?',
    answer: 'All data is encrypted at rest using AES-256 and in transit using TLS 1.3. We use AWS KMS for key management with FIPS 140-2 Level 3 validated HSMs. Data is stored exclusively in US-based data centers.',
  },
  {
    question: 'Do you have a SOC 2 report?',
    answer: 'We are currently preparing for our SOC 2 Type 2 audit scheduled for Q2 2025. Upon completion, the report will be available to customers and prospects under NDA.',
  },
  {
    question: 'Can you handle classified or CUI data?',
    answer: 'Our current implementation supports unclassified data with the security controls necessary for CUI when deployed in appropriate environments. For classified data handling, please contact us about our government deployment options.',
  },
  {
    question: 'What happens in case of a security incident?',
    answer: 'We have a documented Incident Response Plan that includes immediate containment, investigation, and notification procedures. Affected customers are notified within 72 hours of any confirmed breach as required by various regulations.',
  },
];

export default function SecurityCompliancePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Compliant
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            Planned
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Enterprise Security & Compliance
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Security You Can Trust,
              <br />
              <span className="text-emerald-400">Compliance You Need</span>
            </h1>
            <p className="text-xl text-slate-400 mt-6 leading-relaxed">
              Built with enterprise-grade security and designed for FedRAMP Moderate and SOC 2 Type 2
              certification. Your data is protected by industry-leading controls and continuous monitoring.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a
                href="#certifications"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium"
              >
                View Certifications
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
              >
                Request Security Info
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Data Encrypted', value: 'AES-256', icon: Lock },
            { label: 'Uptime SLA', value: '99.9%', icon: Server },
            { label: 'Security Controls', value: '325+', icon: Shield },
            { label: 'Data Centers', value: 'US Only', icon: Globe },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <item.icon className="w-6 h-6 mx-auto text-emerald-400 mb-2" />
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-xs text-slate-400 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Readiness Banner */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-indigo-600/20 border border-emerald-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-bold">SOC 2 & FedRAMP Ready</h2>
          </div>
          <p className="text-slate-300 text-lg max-w-3xl">
            Our platform is designed and built to meet the rigorous requirements of <strong className="text-emerald-400">SOC 2 Type 2</strong> and
            <strong className="text-blue-400"> FedRAMP Moderate</strong> certifications. All technical controls are implemented
            and we are actively preparing for formal audits and authorization.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300">NIST 800-53 Controls</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300">Trust Services Criteria</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300">AICPA Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300">Continuous Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div id="certifications" className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Compliance Certifications</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            We maintain compliance with industry standards and regulations to ensure your data is protected.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              className={`bg-slate-900 border border-slate-800 rounded-xl p-6 hover:${colorMap[cert.color]?.border ?? 'border-slate-500/50'} transition-colors`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${colorMap[cert.color]?.bg ?? 'bg-slate-500/20'} rounded-lg`}>
                    <cert.icon className={`w-6 h-6 ${colorMap[cert.color]?.text ?? 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{cert.name}</h3>
                    <div className="text-sm text-slate-500">Target: {cert.timeline}</div>
                  </div>
                </div>
                {getStatusBadge(cert.status)}
              </div>
              <p className="text-slate-400 text-sm mb-4">{cert.description}</p>
              <div className="space-y-2">
                {cert.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Features Section */}
      <div className="bg-slate-900/50 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Security Features</h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
              Enterprise-grade security controls protect your data at every layer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SECURITY_FEATURES.map((category, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <category.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold">{category.category}</h3>
                </div>
                <div className="space-y-4">
                  {category.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">{feature.name}</div>
                        <div className="text-sm text-slate-400">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documentation Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Security Documentation</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Access our security documentation and compliance reports.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCUMENTS.map((doc, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                doc.available
                  ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 cursor-pointer'
                  : 'bg-slate-900/50 border-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <doc.icon className={`w-5 h-5 ${doc.available ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className={doc.available ? 'text-white' : 'text-slate-500'}>{doc.name}</div>
                  <div className="text-xs text-slate-500">{doc.description}</div>
                </div>
              </div>
              {doc.available ? (
                <Download className="w-4 h-4 text-slate-400" />
              ) : (
                <Lock className="w-4 h-4 text-slate-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-900/50 border-y border-slate-800 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-slate-400 mt-3">
              Common questions about our security and compliance practices.
            </p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      expandedFaq === i ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 text-slate-400 border-t border-slate-800 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Information?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Our security team is available to answer your questions and provide additional documentation upon request.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/about#contact"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium"
            >
              Contact Security Team
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:security@stemworkforce.gov"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
            >
              security@stemworkforce.gov
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>SOC 2 Type 2 Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>FedRAMP Moderate Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-violet-400" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>GDPR Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
