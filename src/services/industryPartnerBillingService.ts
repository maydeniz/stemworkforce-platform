// ===========================================
// Industry Partner Billing Service
// Placeholder Stripe integration for employer subscriptions
// ===========================================

import { supabase } from '@/lib/supabase';
import type { PartnerTier } from '@/types/industryPartner';

// ===========================================
// TYPES
// ===========================================

export interface IndustryPricingTier {
  id: PartnerTier;
  name: string;
  stripePriceId: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  limits: {
    maxJobs: number; // -1 = unlimited
    maxFeaturedJobs: number;
    maxInternshipPrograms: number;
    maxApprenticeshipPrograms: number;
    hasCareerFairAccess: boolean;
    hasAdvancedCandidateMatching: boolean;
    hasUniversityRelations: boolean;
    hasAdvancedAnalytics: boolean;
    hasApiAccess: boolean;
    hasDedicatedSupport: boolean;
    hasEmployerBranding: boolean;
  };
  highlighted?: boolean;
  popular?: boolean;
}

export interface IndustryPartnerSubscription {
  id: string;
  partnerId: string;
  tierId: PartnerTier;
  status: 'active' | 'past_due' | 'cancelled' | 'trialing' | 'free';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  paymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface IndustryBillingRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

export interface IndustryPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface IndustryInvoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'draft';
  invoiceDate: string;
  dueDate?: string;
  pdfUrl?: string;
}

// ===========================================
// PRICING TIERS CONFIGURATION
// ===========================================

export const INDUSTRY_PRICING_TIERS: IndustryPricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    stripePriceId: 'price_industry_starter_placeholder',
    price: 0,
    interval: 'month',
    description: 'Basic talent access',
    features: [
      'Post up to 5 jobs',
      'Basic candidate search',
      'Company profile page',
      'Access to talent directory',
      'Email support'
    ],
    limits: {
      maxJobs: 5,
      maxFeaturedJobs: 0,
      maxInternshipPrograms: 0,
      maxApprenticeshipPrograms: 0,
      hasCareerFairAccess: false,
      hasAdvancedCandidateMatching: false,
      hasUniversityRelations: false,
      hasAdvancedAnalytics: false,
      hasApiAccess: false,
      hasDedicatedSupport: false,
      hasEmployerBranding: false
    },
    popular: false
  },
  {
    id: 'growth',
    name: 'Growth',
    stripePriceId: 'price_industry_growth_monthly_placeholder',
    price: 1499,
    interval: 'month',
    description: 'Build your talent pipeline',
    features: [
      'Unlimited job postings',
      'Advanced candidate matching',
      'Internship program hosting (5 programs)',
      'Career fair participation',
      'Employer branding tools',
      'Featured job listings (5)',
      'Dedicated recruiter support',
      'Analytics dashboard'
    ],
    limits: {
      maxJobs: -1, // unlimited
      maxFeaturedJobs: 5,
      maxInternshipPrograms: 5,
      maxApprenticeshipPrograms: 0,
      hasCareerFairAccess: true,
      hasAdvancedCandidateMatching: true,
      hasUniversityRelations: true,
      hasAdvancedAnalytics: true,
      hasApiAccess: false,
      hasDedicatedSupport: true,
      hasEmployerBranding: true
    },
    highlighted: true,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    stripePriceId: 'price_industry_enterprise_placeholder',
    price: -1, // Custom pricing
    interval: 'month',
    description: 'Strategic workforce partner',
    features: [
      'Everything in Growth',
      'Unlimited internship programs',
      'Apprenticeship program management',
      'DOL compliance support',
      'Curriculum advisory access',
      'Event sponsorship priority',
      'API integrations (ATS, HRIS)',
      'Executive partnership reviews',
      'Dedicated account manager'
    ],
    limits: {
      maxJobs: -1,
      maxFeaturedJobs: -1,
      maxInternshipPrograms: -1, // unlimited
      maxApprenticeshipPrograms: -1, // unlimited
      hasCareerFairAccess: true,
      hasAdvancedCandidateMatching: true,
      hasUniversityRelations: true,
      hasAdvancedAnalytics: true,
      hasApiAccess: true,
      hasDedicatedSupport: true,
      hasEmployerBranding: true
    },
    popular: false
  }
];

// ===========================================
// BILLING SERVICE FUNCTIONS
// ===========================================

/**
 * Get current subscription for an industry partner
 */
export async function getIndustryPartnerSubscription(partnerId: string): Promise<IndustryPartnerSubscription | null> {
  const { data, error } = await supabase
    .from('industry_partners')
    .select('id, tier, subscription_status, stripe_customer_id, subscription_ends_at')
    .eq('id', partnerId)
    .single();

  if (error || !data) {
    console.error('Error fetching industry partner subscription:', error);
    return null;
  }

  return {
    id: data.id,
    partnerId: data.id,
    tierId: data.tier || 'starter',
    status: data.subscription_status || 'free',
    stripeCustomerId: data.stripe_customer_id,
    currentPeriodEnd: data.subscription_ends_at
  };
}

/**
 * Create a Stripe checkout session for subscription
 * PLACEHOLDER - In production, this calls Stripe API
 */
export async function createIndustryCheckoutSession(
  partnerId: string,
  tierId: PartnerTier,
  successUrl: string,
  _cancelUrl: string
): Promise<{ sessionId: string; url: string } | null> {
  console.log('Creating checkout session for industry partner:', partnerId, 'tier:', tierId);

  const tier = INDUSTRY_PRICING_TIERS.find(t => t.id === tierId);
  if (!tier) {
    console.error('Invalid tier:', tierId);
    return null;
  }

  // For enterprise tier, redirect to contact sales
  if (tier.price === -1) {
    return {
      sessionId: 'enterprise_contact',
      url: `${successUrl}?contact_sales=true&tier=${tierId}`
    };
  }

  // PLACEHOLDER: In production, this would call Stripe API
  const mockSessionId = `cs_industry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    sessionId: mockSessionId,
    url: `${successUrl}?session_id=${mockSessionId}&tier=${tierId}`
  };
}

/**
 * Create a Stripe customer portal session
 * PLACEHOLDER - In production, this calls Stripe API
 */
export async function createIndustryPortalSession(
  partnerId: string,
  returnUrl: string
): Promise<{ url: string } | null> {
  console.log('Creating portal session for industry partner:', partnerId);

  return {
    url: `${returnUrl}?portal=true`
  };
}

/**
 * Handle successful checkout - update partner subscription
 * Called from webhook or success page
 */
export async function handleIndustryCheckoutSuccess(
  partnerId: string,
  tierId: PartnerTier,
  stripeCustomerId?: string,
  _stripeSubscriptionId?: string
): Promise<boolean> {
  const tier = INDUSTRY_PRICING_TIERS.find(t => t.id === tierId);
  if (!tier) return false;

  const { error } = await supabase
    .from('industry_partners')
    .update({
      tier: tierId,
      subscription_status: tierId === 'starter' ? 'free' : 'active',
      stripe_customer_id: stripeCustomerId,
      subscription_ends_at: tierId !== 'starter'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null,
      // Update feature flags based on tier
      max_job_postings: tier.limits.maxJobs,
      max_featured_jobs: tier.limits.maxFeaturedJobs,
      max_internship_programs: tier.limits.maxInternshipPrograms,
      max_apprenticeship_programs: tier.limits.maxApprenticeshipPrograms,
      has_career_fair_access: tier.limits.hasCareerFairAccess,
      has_advanced_matching: tier.limits.hasAdvancedCandidateMatching,
      has_university_relations: tier.limits.hasUniversityRelations,
      has_advanced_analytics: tier.limits.hasAdvancedAnalytics,
      has_api_access: tier.limits.hasApiAccess,
      has_employer_branding: tier.limits.hasEmployerBranding,
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId);

  if (error) {
    console.error('Error updating industry partner subscription:', error);
    return false;
  }

  return true;
}

/**
 * Cancel subscription at period end
 */
export async function cancelIndustrySubscription(partnerId: string): Promise<boolean> {
  const { error } = await supabase
    .from('industry_partners')
    .update({
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId);

  if (error) {
    console.error('Error cancelling industry partner subscription:', error);
    return false;
  }

  return true;
}

/**
 * Get invoices for an industry partner
 * PLACEHOLDER - In production, fetches from Stripe
 */
export async function getIndustryInvoices(partnerId: string): Promise<IndustryInvoice[]> {
  console.log('Fetching invoices for industry partner:', partnerId);

  // PLACEHOLDER: Would fetch from Stripe via edge function
  return [
    {
      id: 'inv_industry_001',
      amount: 1499,
      currency: 'usd',
      status: 'paid',
      invoiceDate: '2025-01-01',
      pdfUrl: '#'
    },
    {
      id: 'inv_industry_002',
      amount: 1499,
      currency: 'usd',
      status: 'paid',
      invoiceDate: '2024-12-01',
      pdfUrl: '#'
    }
  ];
}

/**
 * Get billing history for an industry partner
 * PLACEHOLDER - In production, fetches from Stripe
 */
export async function getIndustryBillingHistory(partnerId: string): Promise<IndustryBillingRecord[]> {
  console.log('Fetching billing history for industry partner:', partnerId);

  return [];
}

/**
 * Get payment methods for an industry partner
 * PLACEHOLDER - In production, fetches from Stripe
 */
export async function getIndustryPaymentMethods(partnerId: string): Promise<IndustryPaymentMethod[]> {
  console.log('Fetching payment methods for industry partner:', partnerId);

  return [
    {
      id: 'pm_industry_001',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2026,
      isDefault: true
    }
  ];
}

/**
 * Check if industry partner can perform action based on tier limits
 */
export function checkIndustryTierLimit(
  subscription: IndustryPartnerSubscription,
  action: 'postJob' | 'featureJob' | 'createInternship' | 'createApprenticeship' | 'attendCareerFair' | 'accessApi',
  currentCount?: number
): { allowed: boolean; reason?: string; upgradeRequired?: PartnerTier } {
  const tier = INDUSTRY_PRICING_TIERS.find(t => t.id === subscription.tierId);
  if (!tier) {
    return { allowed: false, reason: 'Invalid subscription tier' };
  }

  switch (action) {
    case 'postJob':
      if (tier.limits.maxJobs === -1) {
        return { allowed: true };
      }
      if (currentCount !== undefined && currentCount >= tier.limits.maxJobs) {
        return {
          allowed: false,
          reason: `You've reached the limit of ${tier.limits.maxJobs} job postings. Upgrade to Growth for unlimited postings.`,
          upgradeRequired: 'growth'
        };
      }
      return { allowed: true };

    case 'featureJob':
      if (tier.limits.maxFeaturedJobs === -1) {
        return { allowed: true };
      }
      if (tier.limits.maxFeaturedJobs === 0) {
        return {
          allowed: false,
          reason: 'Featured job listings are available on Growth and Enterprise plans.',
          upgradeRequired: 'growth'
        };
      }
      if (currentCount !== undefined && currentCount >= tier.limits.maxFeaturedJobs) {
        return {
          allowed: false,
          reason: `You've reached the limit of ${tier.limits.maxFeaturedJobs} featured jobs. Upgrade to Enterprise for unlimited featured listings.`,
          upgradeRequired: 'enterprise'
        };
      }
      return { allowed: true };

    case 'createInternship':
      if (tier.limits.maxInternshipPrograms === -1) {
        return { allowed: true };
      }
      if (tier.limits.maxInternshipPrograms === 0) {
        return {
          allowed: false,
          reason: 'Internship program hosting is available on Growth and Enterprise plans.',
          upgradeRequired: 'growth'
        };
      }
      if (currentCount !== undefined && currentCount >= tier.limits.maxInternshipPrograms) {
        return {
          allowed: false,
          reason: `You've reached the limit of ${tier.limits.maxInternshipPrograms} internship programs. Upgrade to Enterprise for unlimited programs.`,
          upgradeRequired: 'enterprise'
        };
      }
      return { allowed: true };

    case 'createApprenticeship':
      if (tier.limits.maxApprenticeshipPrograms === -1) {
        return { allowed: true };
      }
      if (tier.limits.maxApprenticeshipPrograms === 0) {
        return {
          allowed: false,
          reason: 'DOL-registered apprenticeship programs are available on Enterprise plans only.',
          upgradeRequired: 'enterprise'
        };
      }
      return { allowed: true };

    case 'attendCareerFair':
      if (!tier.limits.hasCareerFairAccess) {
        return {
          allowed: false,
          reason: 'Career fair participation is available on Growth and Enterprise plans.',
          upgradeRequired: 'growth'
        };
      }
      return { allowed: true };

    case 'accessApi':
      if (!tier.limits.hasApiAccess) {
        return {
          allowed: false,
          reason: 'API access (ATS/HRIS integrations) is available on Enterprise plans only.',
          upgradeRequired: 'enterprise'
        };
      }
      return { allowed: true };

    default:
      return { allowed: true };
  }
}

/**
 * Get tier by ID
 */
export function getIndustryTierById(tierId: PartnerTier): IndustryPricingTier | undefined {
  return INDUSTRY_PRICING_TIERS.find(t => t.id === tierId);
}

/**
 * Calculate upgrade savings (annual vs monthly)
 */
export function calculateAnnualSavings(tierId: PartnerTier): { monthlyTotal: number; annualTotal: number; savings: number } | null {
  const tier = INDUSTRY_PRICING_TIERS.find(t => t.id === tierId);
  if (!tier || tier.price <= 0) {
    return null;
  }

  const monthlyTotal = tier.price * 12;
  const annualTotal = Math.round(tier.price * 12 * 0.83); // ~17% discount for annual
  const savings = monthlyTotal - annualTotal;

  return { monthlyTotal, annualTotal, savings };
}
