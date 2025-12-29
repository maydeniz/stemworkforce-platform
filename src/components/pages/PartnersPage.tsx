// ===========================================
// PARTNERS PAGE - Comprehensive Partner Portal
// Value propositions for each partner type
// ===========================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Partner type definitions
const partnerTypes = {
  federal: {
    id: 'federal',
    name: 'Federal Government',
    icon: '🏛️',
    color: '#3b82f6',
    description: 'Federal agencies, departments, and prime contractors',
    count: 45,
    clearanceLevels: ['Public Trust', 'Secret', 'Top Secret', 'TS/SCI'],
    citizenshipOptions: ['U.S. Citizen Only', 'U.S. Person'],
    specialRequirements: ['Veterans Preference', 'OFCCP Compliance', 'E-Verify Required', 'Drug Testing'],
    valueProps: [
      'Access to security-cleared talent pipeline',
      'Automated veterans preference calculations',
      'OFCCP compliance tracking & reporting',
      'Pre-screened candidates with clearance eligibility',
      'Integration with USAJobs API',
      'Federal hiring timeline management'
    ],
    features: ['Clearance Pre-Screening', 'USAJobs Sync', 'Veterans Priority']
  },
  'national-lab': {
    id: 'national-lab',
    name: 'National Laboratory',
    icon: '⚛️',
    color: '#8b5cf6',
    description: 'DOE, NASA, and federally funded research labs',
    count: 17,
    clearanceLevels: ['L Clearance', 'Q Clearance', 'TS/SCI', 'SAP'],
    citizenshipOptions: ['U.S. Citizen Only', 'U.S. Person (ITAR)'],
    specialRequirements: ['ITAR Compliance', 'Export Control', 'Facility Clearance', 'Polygraph'],
    valueProps: [
      'Access to PhD-level research talent',
      'ITAR/EAR compliance built-in',
      'Q-clearance eligibility screening',
      'Research internship pipeline programs',
      'University partnership management',
      'Science & engineering skill matching'
    ],
    features: ['Q-Clearance Pipeline', 'ITAR Compliance', 'Research Matching']
  },
  municipality: {
    id: 'municipality',
    name: 'State/Local Government',
    icon: '🏙️',
    color: '#10b981',
    description: 'State agencies, cities, counties, municipalities',
    count: 125,
    clearanceLevels: ['State Background Check', 'Fingerprint Clearance', 'State-level Clearance'],
    citizenshipOptions: ['U.S. Citizen', 'Work Authorized', 'Flexible'],
    specialRequirements: ['Civil Service Rules', 'Union Agreements', 'Local Hiring Preference', 'Residency Requirements'],
    valueProps: [
      'Local talent pipeline development',
      'Civil service exam integration',
      'Union-compliant hiring workflows',
      'Community workforce programs',
      'Apprenticeship tracking',
      'Local hiring preference automation'
    ],
    features: ['Civil Service Integration', 'Union Compliance', 'Local Hiring']
  },
  academic: {
    id: 'academic',
    name: 'Academic Institution',
    icon: '🎓',
    color: '#f59e0b',
    description: 'Universities, colleges, and community colleges',
    count: 320,
    clearanceLevels: ['Background Check', 'Education Verification', 'None Required'],
    citizenshipOptions: ['Open to All', 'Visa Sponsorship Available', 'Work Authorized'],
    specialRequirements: ['Accreditation', 'Title IX Compliance', 'FERPA', 'Institutional Agreement'],
    valueProps: [
      'Connect students to industry opportunities',
      'Track graduate employment outcomes',
      'Employer partnership management',
      'Industry-aligned curriculum insights',
      'Career services integration',
      'Internship & co-op program management'
    ],
    features: ['Student Placement', 'Outcome Tracking', 'Curriculum Alignment']
  },
  private: {
    id: 'private',
    name: 'Private Sector',
    icon: '🏢',
    color: '#F5C518',
    description: 'Private companies and corporations',
    count: 850,
    clearanceLevels: ['None Required', 'Client-Required', 'Background Check'],
    citizenshipOptions: ['Open to All', 'Visa Sponsorship Available', 'U.S. Work Authorization'],
    specialRequirements: ['E-Verify', 'Background Check', 'Drug Screening', 'Skills Assessment'],
    valueProps: [
      'Access to emerging tech talent',
      'AI-powered candidate matching',
      'Skills-based assessment integration',
      'Diversity pipeline programs',
      'Campus recruitment management',
      'Employer branding tools'
    ],
    features: ['AI Matching', 'Skills Assessment', 'Employer Branding']
  },
  nonprofit: {
    id: 'nonprofit',
    name: 'Non-Profit Organization',
    icon: '💚',
    color: '#06b6d4',
    description: '501(c)(3) organizations and workforce NGOs',
    count: 65,
    clearanceLevels: ['Background Check', 'Volunteer Screening', 'None Required'],
    citizenshipOptions: ['Open to All', 'Volunteer-Friendly', 'Work Authorized'],
    specialRequirements: ['501(c)(3) Status', 'Grant Compliance', 'Volunteer Regulations'],
    valueProps: [
      'Workforce development program management',
      'Grant outcome tracking & reporting',
      'Volunteer & participant management',
      'Community impact measurement',
      'Funder reporting automation',
      'Collaborative partner networks'
    ],
    features: ['Grant Tracking', 'Impact Metrics', 'Partner Networks']
  }
};

// Pricing tiers for partners
const pricingTiers = {
  starter: {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 active job postings',
      'Basic candidate search',
      'Email support',
      'Standard job listing',
      'Basic analytics'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  professional: {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'For growing organizations',
    features: [
      'Up to 25 active job postings',
      'Advanced candidate matching',
      'Clearance eligibility screening',
      'Priority support',
      'Featured job listings',
      'Detailed analytics dashboard',
      'Event sponsorship (1/quarter)',
      'Employer branding page'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations',
    features: [
      'Unlimited job postings',
      'AI-powered talent matching',
      'Full clearance pipeline management',
      'Dedicated account manager',
      'Custom integrations (ATS, HRIS)',
      'White-label options',
      'Unlimited event sponsorships',
      'Custom reporting & analytics',
      'Multi-site/department management',
      'API access'
    ],
    cta: 'Contact Sales',
    popular: false
  }
};

// Stats
const platformStats = [
  { label: 'Active Job Seekers', value: '125,000+', icon: '👤' },
  { label: 'Partner Organizations', value: '1,400+', icon: '🏢' },
  { label: 'Jobs Posted Monthly', value: '8,500+', icon: '📋' },
  { label: 'Successful Placements', value: '45,000+', icon: '✅' }
];

const PartnersPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPartnerType, setSelectedPartnerType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'features'>('overview');

  const handlePartnerSelect = (partnerId: string) => {
    setSelectedPartnerType(partnerId);
  };

  const handleGetStarted = () => {
    navigate('/register?type=partner');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,197,24,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm mb-8">
              <span>🤝</span>
              <span>Partner Portal</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">STEM Workforce</span> Ecosystem
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Connect with government, academia, industry, and national labs to develop the emerging tech workforce together.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
              >
                Become a Partner
              </button>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all"
              >
                Partner Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platformStats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 py-4">
            {[
              { id: 'overview', label: 'Partner Types' },
              { id: 'features', label: 'Features & Benefits' },
              { id: 'pricing', label: 'Pricing' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'features' | 'pricing')}
                className={`py-3 px-2 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types Section */}
      {activeTab === 'overview' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Partner <span className="text-yellow-400">Categories</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We support diverse organizations across the STEM workforce ecosystem, each with tailored features and compliance support.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {Object.values(partnerTypes).map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => handlePartnerSelect(partner.id)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedPartnerType === partner.id
                      ? 'bg-white/10 border-yellow-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${partner.color}20` }}
                    >
                      {partner.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                      <p className="text-sm text-gray-400">{partner.count}+ partners</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{partner.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {partner.features.map((feature, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 text-xs rounded-md"
                        style={{ 
                          backgroundColor: `${partner.color}15`,
                          color: partner.color
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Partner Details */}
            {selectedPartnerType && partnerTypes[selectedPartnerType as keyof typeof partnerTypes] && (
              <div className="bg-white/5 rounded-3xl border border-white/10 p-8 mb-16">
                <div className="flex items-start gap-6 mb-8">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                    style={{ backgroundColor: `${partnerTypes[selectedPartnerType as keyof typeof partnerTypes].color}20` }}
                  >
                    {partnerTypes[selectedPartnerType as keyof typeof partnerTypes].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {partnerTypes[selectedPartnerType as keyof typeof partnerTypes].name}
                    </h3>
                    <p className="text-gray-400">
                      {partnerTypes[selectedPartnerType as keyof typeof partnerTypes].description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">Value Propositions</h4>
                    <ul className="space-y-3">
                      {partnerTypes[selectedPartnerType as keyof typeof partnerTypes].valueProps.map((prop, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span className="text-white">{prop}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Clearance Levels Supported</h4>
                      <div className="flex flex-wrap gap-2">
                        {partnerTypes[selectedPartnerType as keyof typeof partnerTypes].clearanceLevels.map((level, i) => (
                          <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-sm">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Citizenship Options</h4>
                      <div className="flex flex-wrap gap-2">
                        {partnerTypes[selectedPartnerType as keyof typeof partnerTypes].citizenshipOptions.map((opt, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Special Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {partnerTypes[selectedPartnerType as keyof typeof partnerTypes].specialRequirements.map((req, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                  <p className="text-gray-400">
                    Ready to connect with {partnerTypes[selectedPartnerType as keyof typeof partnerTypes].name.toLowerCase()} talent?
                  </p>
                  <button
                    onClick={handleGetStarted}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {activeTab === 'features' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Partner <span className="text-yellow-400">Features</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need to build your emerging tech workforce pipeline
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '📋',
                  title: 'Job & Internship Posting',
                  description: 'Post opportunities with industry-specific requirements, clearance levels, and citizenship options',
                  features: ['Featured listings', 'Industry targeting', 'Clearance requirements']
                },
                {
                  icon: '🎯',
                  title: 'AI Talent Matching',
                  description: 'Our AI matches candidates based on skills, experience, clearance eligibility, and culture fit',
                  features: ['Skills matching', 'Clearance screening', 'Diversity analytics']
                },
                {
                  icon: '📅',
                  title: 'Event Sponsorship',
                  description: 'Sponsor or co-sponsor career fairs, conferences, and training events in your industry',
                  features: ['Virtual & in-person', 'Brand visibility', 'Lead generation']
                },
                {
                  icon: '🛡️',
                  title: 'Clearance Pipeline',
                  description: 'Access candidates with active clearances or verified clearance eligibility',
                  features: ['Pre-screening', 'SF-86 readiness', 'Timeline tracking']
                },
                {
                  icon: '📊',
                  title: 'Analytics Dashboard',
                  description: 'Track job performance, applicant flow, and hiring metrics in real-time',
                  features: ['ROI tracking', 'Pipeline analytics', 'Benchmark data']
                },
                {
                  icon: '🔗',
                  title: 'Integrations',
                  description: 'Connect with your existing ATS, HRIS, and compliance systems',
                  features: ['ATS sync', 'HRIS integration', 'API access']
                },
                {
                  icon: '🎓',
                  title: 'Campus Recruiting',
                  description: 'Build relationships with universities and training programs',
                  features: ['University partnerships', 'Internship programs', 'Early talent']
                },
                {
                  icon: '📢',
                  title: 'Employer Branding',
                  description: 'Showcase your organization to attract top STEM talent',
                  features: ['Company profile', 'Culture content', 'Employee stories']
                },
                {
                  icon: '⚖️',
                  title: 'Compliance Tools',
                  description: 'Stay compliant with federal, state, and industry regulations',
                  features: ['EEO reporting', 'Veterans preference', 'OFCCP tracking']
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((f, j) => (
                      <span key={j} className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {activeTab === 'pricing' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Simple, Transparent <span className="text-yellow-400">Pricing</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Choose the plan that fits your organization's needs. All plans include core platform features.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {Object.values(pricingTiers).map((tier) => (
                <div 
                  key={tier.name}
                  className={`relative p-8 rounded-3xl border ${
                    tier.popular 
                      ? 'bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/50' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 text-gray-900 text-sm font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      <span className="text-gray-400">{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleGetStarted}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      tier.popular
                        ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Enterprise CTA */}
            <div className="mt-16 text-center">
              <div className="inline-block p-8 bg-white/5 rounded-3xl border border-white/10 max-w-2xl">
                <h3 className="text-xl font-semibold text-white mb-2">Need a Custom Solution?</h3>
                <p className="text-gray-400 mb-6">
                  For large organizations, multi-state deployments, or custom integrations, 
                  our enterprise team will create a tailored solution.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all">
                    📞 Talk to Sales
                  </button>
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl transition-all">
                    📄 Download Pricing Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your STEM Workforce?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join over 1,400 partner organizations connecting with emerging tech talent.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
            >
              Get Started Free →
            </button>
            <Link
              to="/events"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all"
            >
              View Partner Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;
