// ===========================================
// PRICING PAGE - Tiered Pricing for Partners
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Pricing tiers
const pricingTiers = {
  jobseeker: {
    name: 'Career Pro',
    subtitle: 'For Job Seekers',
    icon: '👤',
    tiers: [
      {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Get started with job search',
        features: [
          'Browse all job listings',
          'Apply to jobs',
          'Basic profile',
          'Email alerts',
          'Save up to 10 jobs'
        ],
        cta: 'Get Started',
        popular: false
      },
      {
        name: 'Career Pro',
        price: '$19.99',
        period: '/month',
        description: 'Accelerate your job search',
        features: [
          'Everything in Free',
          'Priority application review',
          'AI resume optimization',
          'Clearance eligibility check',
          'Unlimited saved jobs',
          'Profile insights & analytics',
          'Interview preparation tools',
          'Direct recruiter messaging'
        ],
        cta: 'Start Free Trial',
        popular: true
      }
    ]
  },
  employer: {
    name: 'Employer Plans',
    subtitle: 'For Organizations',
    icon: '🏢',
    tiers: [
      {
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
      {
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
      {
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
    ]
  },
  educator: {
    name: 'Education Provider',
    subtitle: 'For Training Providers',
    icon: '🎓',
    tiers: [
      {
        name: 'Basic',
        price: 'Free',
        period: 'forever',
        description: 'List your programs',
        features: [
          'Up to 3 program listings',
          'Basic program profile',
          'Student enrollment tracking',
          'Email support',
          'Standard visibility'
        ],
        cta: 'Get Started Free',
        popular: false
      },
      {
        name: 'Institution',
        price: '$199',
        period: '/month',
        description: 'For colleges & training centers',
        features: [
          'Unlimited program listings',
          'Featured program placement',
          'Outcome tracking & reporting',
          'Employer partnership tools',
          'Priority support',
          'Analytics dashboard',
          'Student success metrics',
          'Industry alignment reports'
        ],
        cta: 'Start Free Trial',
        popular: true
      },
      {
        name: 'University',
        price: 'Custom',
        period: 'pricing',
        description: 'For large institutions',
        features: [
          'Everything in Institution',
          'Multi-department management',
          'Custom branding',
          'Dedicated success manager',
          'Career services integration',
          'Alumni tracking',
          'Custom analytics & reports',
          'API access'
        ],
        cta: 'Contact Sales',
        popular: false
      }
    ]
  }
};

// Partner type specific features
const partnerFeatures = {
  federal: {
    name: 'Federal Government',
    icon: '🏛️',
    color: '#3b82f6',
    features: [
      'USAJobs API integration',
      'Veterans preference automation',
      'OFCCP compliance tracking',
      'Security clearance pipeline',
      'Federal hiring timeline management'
    ]
  },
  'national-lab': {
    name: 'National Laboratory',
    icon: '⚛️',
    color: '#8b5cf6',
    features: [
      'Q-clearance eligibility screening',
      'ITAR/EAR compliance tools',
      'Research talent matching',
      'University partnership management',
      'PhD/PostDoc pipeline'
    ]
  },
  academic: {
    name: 'Academic Institution',
    icon: '🎓',
    color: '#f59e0b',
    features: [
      'Student placement tracking',
      'Graduate outcome reporting',
      'Industry curriculum alignment',
      'Employer partnership portal',
      'Career services integration'
    ]
  },
  private: {
    name: 'Private Sector',
    icon: '🏢',
    color: '#F5C518',
    features: [
      'AI-powered talent matching',
      'Skills-based assessments',
      'Diversity pipeline programs',
      'Campus recruitment tools',
      'Employer branding suite'
    ]
  },
  nonprofit: {
    name: 'Non-Profit',
    icon: '💚',
    color: '#06b6d4',
    features: [
      'Grant outcome tracking',
      'Volunteer management',
      'Community impact metrics',
      'Funder reporting automation',
      'Partner network tools'
    ]
  }
};

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'employer' | 'educator' | 'jobseeker'>('employer');

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,197,24,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm mb-8">
            <span>💰</span>
            <span>Pricing</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Simple, Transparent <span className="text-yellow-400">Pricing</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </p>

          {/* Category Tabs */}
          <div className="inline-flex bg-gray-900 rounded-2xl p-1.5 border border-gray-800">
            {[
              { id: 'employer', label: 'Employers', icon: '🏢' },
              { id: 'educator', label: 'Education Providers', icon: '🎓' },
              { id: 'jobseeker', label: 'Job Seekers', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                  selectedCategory === tab.id
                    ? 'bg-yellow-500 text-gray-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid gap-8 max-w-5xl mx-auto ${
            pricingTiers[selectedCategory].tiers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
          }`}>
            {pricingTiers[selectedCategory].tiers.map((tier) => (
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
                  onClick={() => navigate('/register')}
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
        </div>
      </section>

      {/* Partner-Specific Features */}
      {selectedCategory === 'employer' && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Features by <span className="text-yellow-400">Organization Type</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We provide specialized features based on your organization type
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(partnerFeatures).map((partner) => (
                <div 
                  key={partner.name}
                  className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${partner.color}20` }}
                    >
                      {partner.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                  </div>
                  <ul className="space-y-2">
                    {partner.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                        <span style={{ color: partner.color }}>•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked <span className="text-yellow-400">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Can I switch plans at any time?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.'
              },
              {
                q: 'Do you offer discounts for government or non-profit organizations?',
                a: 'Yes, we offer special pricing for government agencies, educational institutions, and 501(c)(3) non-profits. Contact our sales team for details.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, ACH bank transfers, and purchase orders for Enterprise customers.'
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your current billing period.'
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-8 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-3xl border border-yellow-500/20">
            <h2 className="text-2xl font-bold text-white mb-2">Need a Custom Solution?</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
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
      </section>
    </div>
  );
};

export default PricingPage;
