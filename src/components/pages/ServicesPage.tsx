// ===========================================
// Services Page Component
// Overview of all services with category organization
// Using Partners-style yellow/gold accent palette
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_CATEGORIES, type Service, type ServiceCategory } from '@/data/services';

const ServicesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,197,24,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm mb-8">
            <span>⚡</span>
            <span>Workforce Solutions</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Services</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Research-based workforce development solutions tailored to the unique
            challenges of technology-intensive industries.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
            >
              Schedule a Consultation
            </Link>
            <Link
              to="/industries"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
            >
              Explore Industries
            </Link>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 border-y border-white/5 sticky top-16 bg-dark-bg/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              All Services
            </button>
            {SERVICE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {SERVICE_CATEGORIES.filter(
            (category) => activeCategory === null || category.id === activeCategory
          ).map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              expandedService={expandedService}
              onToggleService={(id) =>
                setExpandedService(expandedService === id ? null : id)
              }
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-yellow-400">Approach</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              What makes our workforce solutions different
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: '🔬',
                title: 'Research-Based',
                description:
                  'Our methods are grounded in evidence, not assumptions or generic frameworks.',
              },
              {
                icon: '🎯',
                title: 'Industry-Specific',
                description:
                  'Deep expertise in each sector ensures solutions fit your unique context.',
              },
              {
                icon: '🤝',
                title: 'Partnership Model',
                description:
                  'We build internal capabilities, not dependency on external consultants.',
              },
              {
                icon: '📊',
                title: 'Measurable Outcomes',
                description:
                  'Clear metrics and accountability for every engagement.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Flexible <span className="text-yellow-400">Engagement Models</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Choose the approach that fits your needs and timeline
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                tier: 'Assessment',
                name: 'Diagnostic & Discovery',
                description:
                  'Rapid assessments that provide clarity on your current state and priority actions.',
                features: [
                  'Rapid diagnostics',
                  'Gap identification',
                  'Priority recommendations',
                  'Executive briefing',
                ],
                cta: 'Start with an Assessment',
              },
              {
                tier: 'Strategy',
                name: 'Planning & Design',
                description:
                  'Comprehensive strategies and roadmaps aligned with your business objectives.',
                features: [
                  'Deep analysis',
                  'Custom strategy development',
                  'Implementation roadmaps',
                  'Stakeholder alignment',
                ],
                cta: 'Develop Your Strategy',
                highlighted: true,
              },
              {
                tier: 'Partnership',
                name: 'Implementation & Transformation',
                description:
                  'Ongoing partnership to implement strategies and drive lasting change.',
                features: [
                  'Full implementation support',
                  'Change management',
                  'Continuous optimization',
                  'Capability building',
                ],
                cta: 'Partner for Transformation',
              },
            ].map((model, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border transition-all ${
                  model.highlighted
                    ? 'bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/50 scale-105 shadow-2xl'
                    : 'bg-white/5 border-white/10 hover:border-yellow-500/30'
                }`}
              >
                {model.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 text-gray-900 text-xs font-semibold rounded-full">
                    Most Flexible
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-sm font-medium text-yellow-400 mb-2">
                    {model.tier}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{model.name}</h3>
                  <p className="text-sm text-gray-400">{model.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {model.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    model.highlighted
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  {model.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Workforce?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's discuss how our services can address your specific workforce challenges
              and help you build the capabilities you need for success.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
              >
                Schedule a Consultation
              </Link>
              <Link
                to="/partners"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Category Section Component
const CategorySection: React.FC<{
  category: ServiceCategory;
  expandedService: string | null;
  onToggleService: (id: string) => void;
}> = ({ category, expandedService, onToggleService }) => {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl">
          {category.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{category.name}</h2>
          <p className="text-gray-400">{category.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isExpanded={expandedService === service.id}
            onToggle={() => onToggleService(service.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard: React.FC<{
  service: Service;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ service, isExpanded, onToggle }) => {
  return (
    <div
      className={`p-6 rounded-2xl bg-white/5 border transition-all cursor-pointer ${
        isExpanded ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-white/10 hover:border-yellow-500/30'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl">
          {service.icon}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180 text-yellow-400' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
      <p className="text-sm text-gray-400 mb-4">{service.shortDescription}</p>

      {isExpanded && (
        <div className="pt-4 border-t border-white/10 space-y-4 animate-fadeIn">
          <p className="text-sm text-gray-300">{service.fullDescription}</p>

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Benefits</h4>
            <ul className="space-y-1">
              {service.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-yellow-400">•</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Deliverables</h4>
            <ul className="space-y-1">
              {service.deliverables.map((deliverable, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-green-400">✓</span>
                  {deliverable}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Ideal For</h4>
            <div className="flex flex-wrap gap-2">
              {service.idealFor.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <Link
            to="/contact"
            className="block w-full py-2 rounded-lg font-medium text-center text-sm transition-all bg-yellow-500 hover:bg-yellow-400 text-gray-900 mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            Learn More
          </Link>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
