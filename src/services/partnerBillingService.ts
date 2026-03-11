// ===========================================
// Partner Billing Service
// Stripe integration for education-partner subscriptions.
// Pricing data is imported from the unified config in @/config/pricing.
// ===========================================

import { supabase } from '@/lib/supabase';
import { getPersonaTiers, type PricingTier as UnifiedPricingTier } from '@/config/pricing';

// ===========================================
// TYPES
// ===========================================

export interface PricingTier {
  id: string;
  name: string;
  stripePriceId: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  limits: {
    maxPrograms: number; // -1 = unlimited
    maxStudentProfiles: number;
    maxEmployerConnections: number;
    maxEventsPerYear: number;
    canAccessEmployerNetwork: boolean;
    canTrackOutcomes: boolean;
    canHostEvents: boolean;
    hasAdvancedAnalytics: boolean;
    hasApiAccess: boolean;
    hasDedicatedSupport: boolean;
    hasWhiteLabeling: boolean;
    hasDedicatedManager: boolean;
  };
  highlighted?: boolean;
  popular?: boolean;
}

export interface PartnerSubscription {
  id: string;
  partnerId: string;
  tierId: string;
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

export interface BillingRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'draft';
  invoiceDate: string;
  dueDate?: string;
  pdfUrl?: string;
}

// ===========================================
// PRICING TIERS (derived from unified config)
// ===========================================

/**
 * Convert a unified PricingTier to the education-partner-specific shape
 * expected by consumers of this service.
 */
function toLocalTier(t: UnifiedPricingTier): PricingTier {
  // Build a human-readable feature list from the boolean feature flags
  const featureLabels: string[] = Object.entries(t.features)
    .filter(([, enabled]) => enabled)
    .map(([key]) =>
      key
        // camelCase -> space-separated words, capitalise first letter
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (c) => c.toUpperCase())
    );

  return {
    id: t.tierKey,
    name: t.name,
    stripePriceId: t.stripe_price_id_monthly ?? '',
    price: t.price_monthly,
    interval: 'month',
    description: t.description,
    features: featureLabels,
    limits: {
      maxPrograms: t.limits.maxPrograms ?? 0,
      maxStudentProfiles: t.limits.maxStudentProfiles ?? 0,
      maxEmployerConnections: t.limits.maxEmployerConnections ?? 0,
      maxEventsPerYear: t.limits.maxEventsPerYear ?? 0,
      canAccessEmployerNetwork: t.features.employerNetworkAccess ?? t.features.basicProfile ?? false,
      canTrackOutcomes: t.features.studentOutcomeTracking ?? false,
      canHostEvents: t.features.coHostEvents ?? false,
      hasAdvancedAnalytics: t.features.advancedAnalytics ?? false,
      hasApiAccess: t.features.apiAccess ?? false,
      hasDedicatedSupport: t.features.prioritySupport ?? false,
      hasWhiteLabeling: t.features.whiteLabel ?? false,
      hasDedicatedManager: t.features.dedicatedManager ?? false,
    },
    highlighted: t.highlighted,
    popular: t.highlighted,
  };
}

export const PRICING_TIERS: PricingTier[] = getPersonaTiers('education_partner').map(toLocalTier);

// ===========================================
// BILLING SERVICE FUNCTIONS
// ===========================================

/**
 * Get current subscription for a partner
 */
export async function getPartnerSubscription(partnerId: string): Promise<PartnerSubscription | null> {
  const { data, error } = await supabase
    .from('education_partners')
    .select('id, tier, subscription_status, stripe_customer_id, subscription_ends_at')
    .eq('id', partnerId)
    .single();

  if (error || !data) {
    console.error('Error fetching subscription:', error);
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
export async function createCheckoutSession(
  partnerId: string,
  tierId: string,
  successUrl: string,
  _cancelUrl: string // Prefixed with _ as placeholder for Stripe integration
): Promise<{ sessionId: string; url: string } | null> {
  console.log('Creating checkout session for partner:', partnerId, 'tier:', tierId);

  // PLACEHOLDER: In production, this would:
  // 1. Call Stripe API to create checkout session
  // 2. Return the session ID and URL

  const tier = PRICING_TIERS.find(t => t.id === tierId);
  if (!tier) {
    console.error('Invalid tier:', tierId);
    return null;
  }

  // For now, return a mock session
  const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // PLACEHOLDER: Would call Supabase edge function that calls Stripe
  // const { data, error } = await supabase.functions.invoke('create-checkout-session', {
  //   body: { partnerId, priceId: tier.stripePriceId, successUrl, cancelUrl }
  // });

  return {
    sessionId: mockSessionId,
    url: `${successUrl}?session_id=${mockSessionId}&tier=${tierId}` // Mock redirect
  };
}

/**
 * Create a Stripe customer portal session
 * PLACEHOLDER - In production, this calls Stripe API
 */
export async function createPortalSession(
  partnerId: string,
  returnUrl: string
): Promise<{ url: string } | null> {
  console.log('Creating portal session for partner:', partnerId);

  // PLACEHOLDER: In production, this would call Stripe to create portal session
  // const { data, error } = await supabase.functions.invoke('create-portal-session', {
  //   body: { partnerId, returnUrl }
  // });

  // For now, return a mock URL
  return {
    url: `${returnUrl}?portal=true`
  };
}

/**
 * Handle successful checkout - update partner subscription
 * Called from webhook or success page
 */
export async function handleCheckoutSuccess(
  partnerId: string,
  tierId: string,
  stripeCustomerId?: string,
  _stripeSubscriptionId?: string // Prefixed with _ as placeholder for Stripe integration
): Promise<boolean> {
  const tier = PRICING_TIERS.find(t => t.id === tierId);
  if (!tier) return false;

  const { error } = await supabase
    .from('education_partners')
    .update({
      tier: tierId,
      subscription_status: tierId === 'starter' ? 'free' : 'active',
      stripe_customer_id: stripeCustomerId,
      subscription_ends_at: tierId !== 'starter'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        : null,
      // Update feature flags based on tier
      can_list_programs: true,
      can_host_events: tier.limits.canHostEvents,
      can_access_employer_network: tier.limits.canAccessEmployerNetwork,
      can_track_outcomes: tier.limits.canTrackOutcomes,
      max_program_listings: tier.limits.maxPrograms,
      max_events_per_year: tier.limits.maxEventsPerYear,
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId);

  if (error) {
    console.error('Error updating subscription:', error);
    return false;
  }

  return true;
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(partnerId: string): Promise<boolean> {
  // PLACEHOLDER: In production, call Stripe to cancel subscription
  // const { data, error } = await supabase.functions.invoke('cancel-subscription', {
  //   body: { partnerId }
  // });

  const { error } = await supabase
    .from('education_partners')
    .update({
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId);

  if (error) {
    console.error('Error cancelling subscription:', error);
    return false;
  }

  return true;
}

/**
 * Get invoices for a partner
 * PLACEHOLDER - In production, fetches from Stripe
 */
export async function getInvoices(partnerId: string): Promise<Invoice[]> {
  console.log('Fetching invoices for partner:', partnerId);

  // PLACEHOLDER: Would fetch from Stripe via edge function
  // For now, return mock data
  return [
    {
      id: 'inv_mock_001',
      amount: 499,
      currency: 'usd',
      status: 'paid',
      invoiceDate: '2025-01-01',
      pdfUrl: '#'
    },
    {
      id: 'inv_mock_002',
      amount: 499,
      currency: 'usd',
      status: 'paid',
      invoiceDate: '2024-12-01',
      pdfUrl: '#'
    }
  ];
}

/**
 * Get billing history for a partner
 * PLACEHOLDER - In production, fetches from Stripe
 */
export async function getBillingHistory(partnerId: string): Promise<BillingRecord[]> {
  console.log('Fetching billing history for partner:', partnerId);

  // PLACEHOLDER: Would fetch from Stripe via edge function
  // For demo purposes, return empty array for starter tier
  // In production, this would return real billing history
  return [];
}

/**
 * Get payment methods for a partner
 * PLACEHOLDER - In production, fetches from Stripe
 */
export async function getPaymentMethods(partnerId: string): Promise<PaymentMethod[]> {
  console.log('Fetching payment methods for partner:', partnerId);

  // PLACEHOLDER: Would fetch from Stripe via edge function
  // For now, return mock data
  return [
    {
      id: 'pm_mock_001',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2026,
      isDefault: true
    }
  ];
}

/**
 * Check if partner can perform action based on tier limits
 */
export function checkTierLimit(
  subscription: PartnerSubscription,
  action: 'addProgram' | 'hostEvent' | 'trackOutcomes' | 'accessApi',
  currentCount?: number
): { allowed: boolean; reason?: string } {
  const tier = PRICING_TIERS.find(t => t.id === subscription.tierId);
  if (!tier) {
    return { allowed: false, reason: 'Invalid subscription tier' };
  }

  switch (action) {
    case 'addProgram':
      if (tier.limits.maxPrograms === -1) {
        return { allowed: true };
      }
      if (currentCount !== undefined && currentCount >= tier.limits.maxPrograms) {
        return {
          allowed: false,
          reason: `You've reached the limit of ${tier.limits.maxPrograms} programs. Upgrade to add more.`
        };
      }
      return { allowed: true };

    case 'hostEvent':
      if (!tier.limits.canHostEvents) {
        return {
          allowed: false,
          reason: 'Event hosting is available on Growth and Enterprise plans.'
        };
      }
      if (tier.limits.maxEventsPerYear !== -1 && currentCount !== undefined && currentCount >= tier.limits.maxEventsPerYear) {
        return {
          allowed: false,
          reason: `You've reached the limit of ${tier.limits.maxEventsPerYear} events per year. Upgrade to Enterprise for unlimited events.`
        };
      }
      return { allowed: true };

    case 'trackOutcomes':
      if (!tier.limits.canTrackOutcomes) {
        return {
          allowed: false,
          reason: 'Outcome tracking is available on Growth and Enterprise plans.'
        };
      }
      return { allowed: true };

    case 'accessApi':
      if (!tier.limits.hasApiAccess) {
        return {
          allowed: false,
          reason: 'API access is available on Enterprise plans only.'
        };
      }
      return { allowed: true };

    default:
      return { allowed: true };
  }
}
