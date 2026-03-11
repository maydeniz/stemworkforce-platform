// ===========================================
// PRICING PAGE - Unified Pricing for All Personas
// 3-category hierarchy: Individuals, Organizations, Public Sector
// ===========================================

import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  ChevronDown,
  Star,
  Zap,
  Send,
  Building2,
  ArrowRight,
  Users,
  Shield,
} from 'lucide-react';
import { useDocumentTitle } from '@/hooks';
import { useNotifications } from '@/contexts/NotificationContext';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import type { PersonaType, PricingTier } from '@/config/pricing';
import {
  ANNUAL_DISCOUNT_PCT,
  PERSONA_LABELS,
  PERSONA_CATEGORIES,
  getPersonaTiers,
  formatPrice,
  formatAnnualPrice,
  effectiveMonthlyPrice,
  getHighlightedTier,
} from '@/config/pricing';

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function featureKeyToLabel(key: string): string {
  const spaced = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
  return spaced
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bCrm\b/g, 'CRM')
    .replace(/\bHris\b/g, 'HRIS')
    .replace(/\bAts\b/g, 'ATS')
    .replace(/\bFed R A M P\b/gi, 'FedRAMP')
    .replace(/\bFed ?Ramp\b/gi, 'FedRAMP')
    .replace(/\bItar\b/g, 'ITAR')
    .replace(/\bEar\b/g, 'EAR')
    .replace(/\bGdpr\b/g, 'GDPR')
    .replace(/\bSoc2\b/g, 'SOC 2');
}

function limitKeyToLabel(key: string): string {
  return featureKeyToLabel(key);
}

function formatLimitValue(value: number, key: string): string {
  if (value === -1) return 'Unlimited';
  if (value === 0) return '--';
  if (key.toLowerCase().includes('percent')) return `${value}%`;
  if (key.toLowerCase().includes('gb')) return `${value} GB`;
  if (key.toLowerCase().includes('frequency')) return value === 1 ? 'Daily' : `Every ${value} days`;
  return value.toLocaleString();
}

// ---------------------------------------------------------------------------
// SOCIAL PROOF
// ---------------------------------------------------------------------------

const SOCIAL_PROOF_STATS = [
  { label: 'STEM Jobs Listed', value: '40,000+' },
  { label: 'Partner Organizations', value: '500+' },
  { label: 'Education Programs', value: '1,200+' },
  { label: 'Clearance-Ready Roles', value: '8,000+' },
];

// ---------------------------------------------------------------------------
// FAQ DATA
// ---------------------------------------------------------------------------

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Can I change plans at any time?',
    answer:
      'Yes. You can upgrade or downgrade your plan at any time from your dashboard. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle. Any overage is prorated.',
  },
  {
    question: 'Do you offer annual billing?',
    answer: `Yes! When you choose annual billing you save ${ANNUAL_DISCOUNT_PCT}% compared to monthly billing. The full year is billed upfront at the discounted rate.`,
  },
  {
    question: 'How does the free trial work?',
    answer:
      'All paid plans include a 14-day free trial. No credit card is required to start. You get full access to every feature in the plan during the trial period.',
  },
  {
    question: 'Do you support purchase orders (POs) for government?',
    answer:
      'Yes. We accept government purchase orders, ACH transfers, and wire payments for all government and enterprise accounts. We also support CAGE codes and SAM UEI for procurement. Reach out to our sales team to set up PO-based billing with Net 30/60/90 terms.',
  },
  {
    question: 'Is there an academic/nonprofit discount?',
    answer:
      'Yes. Verified 501(c)(3) nonprofits and accredited academic institutions receive special pricing. Contact our sales team with your organization details for a custom quote.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, American Express), ACH bank transfers, wire transfers, and purchase orders for enterprise and government customers.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. You can cancel your subscription at any time from your account settings. You will retain access to your plan features through the end of your current billing period. No cancellation fees apply.',
  },
  {
    question: 'Do you offer custom enterprise pricing?',
    answer:
      'Absolutely. For organizations with unique requirements, multi-site deployments, or large user bases, our enterprise team will craft a tailored pricing package. Use the contact form below or email sales@stemworkforce.net.',
  },
  {
    question: 'Can I invite my team?',
    answer:
      'Yes. All paid plans include team member seats. You can invite colleagues from your dashboard. Additional seats are available for enterprise plans.',
  },
];

// Category icon mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  individuals: <Users size={16} />,
  organizations: <Building2 size={16} />,
  public_sector: <Shield size={16} />,
};

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

const TierCard: React.FC<{
  tier: PricingTier;
  isAnnual: boolean;
  isHighlighted: boolean;
}> = ({ tier, isAnnual, isHighlighted }) => {
  const isCustom = tier.price_monthly < 0;
  const isFree = tier.price_monthly === 0;

  const displayPrice = isAnnual
    ? formatAnnualPrice(tier.price_annual)
    : formatPrice(tier.price_monthly);

  const effMonthly = effectiveMonthlyPrice(tier);
  const showEffective = isAnnual && !isFree && !isCustom;

  const featureEntries = Object.entries(tier.features);
  const limitEntries = Object.entries(tier.limits);

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 transition-all ${
        isHighlighted
          ? 'bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/50 shadow-lg shadow-yellow-500/5'
          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 bg-yellow-500 text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full">
          <Star size={12} fill="currentColor" />
          Most Popular
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-1">{tier.name}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{tier.description}</p>
      </div>

      <div className="text-center mb-8">
        {isCustom ? (
          <span className="text-4xl font-bold text-white">Contact Sales</span>
        ) : (
          <>
            <span className="text-4xl font-bold text-white">{displayPrice}</span>
            {showEffective && (
              <div className="mt-1 text-sm text-gray-400">
                <span className="line-through text-gray-500">
                  {formatPrice(tier.price_monthly)}
                </span>{' '}
                <span className="text-green-400 font-medium">
                  ${effMonthly.toFixed(2)}/mo billed annually
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <Link
        to={tier.cta_link}
        className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all mb-8 ${
          isHighlighted
            ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
            : 'bg-white/10 hover:bg-white/[0.15] text-white border border-white/10'
        }`}
      >
        {tier.cta_text}
        <ArrowRight size={14} className="inline-block ml-1.5 -mt-0.5" />
      </Link>

      {limitEntries.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Limits
          </p>
          {limitEntries.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{limitKeyToLabel(key)}</span>
              <span
                className={`font-medium ${
                  value === -1 ? 'text-green-400' : value === 0 ? 'text-gray-600' : 'text-white'
                }`}
              >
                {formatLimitValue(value, key)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Features
        </p>
        <ul className="space-y-2.5">
          {featureEntries.map(([key, enabled]) => (
            <li key={key} className="flex items-start gap-2.5 text-sm">
              {enabled ? (
                <Check size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <X size={16} className="text-gray-600 flex-shrink-0 mt-0.5" />
              )}
              <span className={enabled ? 'text-gray-300' : 'text-gray-600'}>
                {featureKeyToLabel(key)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ComparisonTable: React.FC<{
  tiers: PricingTier[];
  isAnnual: boolean;
}> = ({ tiers, isAnnual }) => {
  if (tiers.length === 0) return null;

  const featureKeys = Object.keys(tiers[0].features);
  const limitKeys = Object.keys(tiers[0].limits);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium w-1/3">Feature</th>
            {tiers.map((tier) => (
              <th
                key={tier.id}
                className={`text-center py-4 px-4 font-semibold ${
                  tier.highlighted ? 'text-yellow-400' : 'text-white'
                }`}
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/5">
            <td className="py-3 px-4 text-gray-300 font-medium">Price</td>
            {tiers.map((tier) => (
              <td key={tier.id} className="py-3 px-4 text-center text-white font-semibold">
                {tier.price_monthly < 0
                  ? 'Custom'
                  : isAnnual
                  ? formatAnnualPrice(tier.price_annual)
                  : formatPrice(tier.price_monthly)}
              </td>
            ))}
          </tr>

          {featureKeys.map((key, idx) => (
            <tr
              key={key}
              className={`border-b border-white/5 ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
            >
              <td className="py-3 px-4 text-gray-400">{featureKeyToLabel(key)}</td>
              {tiers.map((tier) => (
                <td key={tier.id} className="py-3 px-4 text-center">
                  {tier.features[key] ? (
                    <Check size={16} className="text-green-400 mx-auto" />
                  ) : (
                    <X size={16} className="text-gray-600 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          ))}

          {limitKeys.length > 0 && (
            <tr className="border-b border-white/10">
              <td
                colSpan={tiers.length + 1}
                className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Limits
              </td>
            </tr>
          )}
          {limitKeys.map((key, idx) => (
            <tr
              key={key}
              className={`border-b border-white/5 ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
            >
              <td className="py-3 px-4 text-gray-400">{limitKeyToLabel(key)}</td>
              {tiers.map((tier) => {
                const val = tier.limits[key] ?? 0;
                return (
                  <td
                    key={tier.id}
                    className={`py-3 px-4 text-center font-medium ${
                      val === -1 ? 'text-green-400' : val === 0 ? 'text-gray-600' : 'text-white'
                    }`}
                  >
                    {formatLimitValue(val, key)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FaqAccordionItem: React.FC<{
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => (
  <div className="border border-white/10 rounded-2xl overflow-hidden transition-colors hover:border-white/20">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-5 text-left"
      aria-expanded={isOpen}
    >
      <span className="text-white font-medium pr-4">{item.question}</span>
      <ChevronDown
        size={18}
        className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    {isOpen && (
      <div className="px-6 pb-5 -mt-1">
        <p className="text-gray-400 leading-relaxed text-sm">{item.answer}</p>
      </div>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const PricingPage: React.FC = () => {
  useDocumentTitle('Pricing | STEMWorkforce');

  const { info } = useNotifications();

  // State — default to annual billing (higher conversion per expert recommendation)
  const [activeCategory, setActiveCategory] = useState('organizations');
  const [activePersona, setActivePersona] = useState<PersonaType>('employer');
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });

  // Active category's personas
  const activePersonas = useMemo(
    () => PERSONA_CATEGORIES.find((c) => c.key === activeCategory)?.personas ?? [],
    [activeCategory],
  );

  // Derived data
  const tiers = useMemo(() => getPersonaTiers(activePersona), [activePersona]);
  const highlightedTier = useMemo(() => getHighlightedTier(activePersona), [activePersona]);

  // When category changes, select the first persona in that category
  const handleCategoryChange = useCallback(
    (categoryKey: string) => {
      setActiveCategory(categoryKey);
      const cat = PERSONA_CATEGORIES.find((c) => c.key === categoryKey);
      if (cat && cat.personas.length > 0) {
        setActivePersona(cat.personas[0]);
      }
    },
    [],
  );

  const handleContactSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      info('Thank you! Our team will contact you within 1 business day.');
      setContactForm({ name: '', email: '', organization: '', message: '' });
    },
    [info],
  );

  const handleFaqToggle = useCallback((index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  }, []);

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Home', path: '/' },
      { label: 'Pricing', path: '/pricing' },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ----------------------------------------------------------------- */}
      {/* HERO */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,197,24,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-16">
          <Breadcrumb items={breadcrumbItems} className="mb-8" />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm mb-8">
              <Zap size={14} />
              <span>Transparent Pricing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              The STEM Workforce Advantage,{' '}
              <span className="text-yellow-400">at Every Scale</span>
            </h1>

            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              From individual career growth to enterprise workforce development.
              Start free, scale as you grow, and only pay for what you use.
            </p>

            {/* ------------------------------------------------------------- */}
            {/* SOCIAL PROOF BAR */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {SOCIAL_PROOF_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* CATEGORY TABS (3 groups) */}
            {/* ------------------------------------------------------------- */}
            <div className="flex justify-center gap-3 mb-6">
              {PERSONA_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeCategory === cat.key
                      ? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/20'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {CATEGORY_ICONS[cat.key]}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PERSONA PILLS (within active category) */}
            {/* ------------------------------------------------------------- */}
            {activePersonas.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {activePersonas.map((persona) => (
                  <button
                    key={persona}
                    onClick={() => setActivePersona(persona)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activePersona === persona
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'bg-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {PERSONA_LABELS[persona]}
                  </button>
                ))}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* BILLING TOGGLE — defaulting to annual */}
            {/* ------------------------------------------------------------- */}
            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
              <span
                className={`text-sm font-medium transition-colors ${
                  !isAnnual ? 'text-white' : 'text-gray-500'
                }`}
              >
                Monthly
              </span>

              <button
                onClick={() => setIsAnnual((prev) => !prev)}
                aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isAnnual ? 'bg-yellow-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                    isAnnual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`text-sm font-medium transition-colors ${
                  isAnnual ? 'text-white' : 'text-gray-500'
                }`}
              >
                Annual
              </span>

              {isAnnual && (
                <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                  Save {ANNUAL_DISCOUNT_PCT}%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* TIER CARDS */}
      {/* ----------------------------------------------------------------- */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`grid gap-8 max-w-6xl mx-auto ${
              tiers.length === 2
                ? 'md:grid-cols-2'
                : tiers.length === 3
                ? 'lg:grid-cols-3'
                : tiers.length >= 4
                ? 'lg:grid-cols-4'
                : ''
            }`}
          >
            {tiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                isAnnual={isAnnual}
                isHighlighted={highlightedTier?.id === tier.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* FEATURE COMPARISON TABLE */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Detailed{' '}
              <span className="text-yellow-400">Feature Comparison</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Compare every feature and limit across{' '}
              {PERSONA_LABELS[activePersona]} plans side by side.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
            <ComparisonTable tiers={tiers} isAnnual={isAnnual} />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* ENTERPRISE / GOVERNMENT CONTACT FORM */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
              <Building2 size={14} />
              <span>Enterprise & Government</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Need a <span className="text-yellow-400">Custom Solution</span>?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              For enterprise organizations, federal agencies, and multi-site
              deployments, our team will create a tailored package. We support
              POs, CAGE codes, SAM UEI, and Net 30/60/90 terms.
            </p>
          </div>

          <form
            onSubmit={handleContactSubmit}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-sm"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Work Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-sm"
                  placeholder="jane@agency.gov"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-organization"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Organization
              </label>
              <input
                id="contact-organization"
                type="text"
                required
                value={contactForm.organization}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    organization: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-sm"
                placeholder="Department of Energy, Lockheed Martin, etc."
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-sm resize-none"
                placeholder="Tell us about your organization, team size, and requirements..."
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all text-sm"
            >
              <Send size={16} />
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* FAQ SECTION */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Frequently Asked{' '}
              <span className="text-yellow-400">Questions</span>
            </h2>
            <p className="text-gray-400">
              Everything you need to know about our plans and billing.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <FaqAccordionItem
                key={index}
                item={item}
                isOpen={openFaqIndex === index}
                onToggle={() => handleFaqToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
