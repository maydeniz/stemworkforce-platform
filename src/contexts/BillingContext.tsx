// ===========================================
// BILLING CONTEXT - Persona-Aware Subscription Management
// ===========================================
// Resolves the active user's persona from their auth role,
// then maps their subscription tier to the unified pricing config.
// Works for ALL 9 persona types, not just employers.
// ===========================================

import React, { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  ALL_PRICING_TIERS,
  getPersonaTiers,
  getTierById,
  getTierByPersonaAndKey,
  tierHasFeature,
  getTierLimit,
  type PricingTier,
  type PersonaType,
} from '@/config/pricing';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface SubscriptionFeatures {
  maxJobPostings: number;
  advancedAnalytics: boolean;
  candidateSearch: boolean;
  advancedFilters: boolean;
  eventSponsorship: boolean;
  eventSponsorsPerQuarter: number;
  employerBranding: boolean;
  prioritySupport: boolean;
  customIntegrations: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  dedicatedManager: boolean;
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: SubscriptionFeatures;
  stripePriceId?: string;
}

export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

interface BillingContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  plans: SubscriptionPlan[];
  currentFeatures: SubscriptionFeatures;
  /** The detected persona for the current user */
  currentPersona: PersonaType;
  /** The resolved PricingTier from the unified config */
  currentPricingTier: PricingTier;
  /** All pricing tiers from the unified config (all personas) */
  pricingTiers: PricingTier[];
  /** Get pricing tiers for a specific persona */
  getPersonaTiers: (persona: PersonaType) => PricingTier[];
  // Feature checks — work across all personas
  canAccessFeature: (feature: keyof SubscriptionFeatures | string) => boolean;
  canPostJob: () => boolean;
  getJobPostingsRemaining: () => number;
  canSponsorEvent: () => boolean;
  // Usage helpers
  getUsage: (metric: string) => { used: number; limit: number };
  isTrialing: () => boolean;
  daysLeftInTrial: () => number;
  // Subscription actions
  subscribeToPlan: (planId: string) => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
  resumeSubscription: () => Promise<{ success: boolean; error?: string }>;
  updatePaymentMethod: () => Promise<{ success: boolean; portalUrl?: string; error?: string }>;
  // Usage tracking
  jobPostingsUsed: number;
  eventSponsorsUsed: number;
}

// ---------------------------------------------------------------------------
// Role → Persona mapping
// ---------------------------------------------------------------------------

/**
 * Map a user's role string (from app_metadata — server-controlled) to a PersonaType.
 * This is the single source of truth for role → persona resolution.
 *
 * C3 FIX: Caller must pass app_metadata.role (server-only), NOT user_metadata.role
 * (user-editable). See BillingProvider below.
 */
function roleToPersona(role: string | undefined): PersonaType {
  switch (role) {
    case 'employer':
    case 'partner_industry':
      return 'employer';
    case 'partner':
    case 'industry_partner':
      return 'industry_partner';
    case 'education_provider':
    case 'educator':
    case 'partner_academic':
      return 'education_partner';
    case 'service_provider':
    case 'provider':
      return 'service_provider';
    case 'student':
    case 'intern':
    case 'learner':
      return 'student';
    case 'government':
    case 'partner_federal':
      return 'government';
    case 'partner_lab':
    case 'national_lab':
      return 'national_labs';
    case 'partner_nonprofit':
    case 'nonprofit':
      return 'nonprofit';
    case 'jobseeker':
    case 'job_seeker':
    case 'job seeker':
    case undefined:
      return 'jobseeker';
    default:
      // M2: Warn on unrecognized roles so they can be added to the switch
      console.warn(`[BillingContext] Unrecognized role "${role}" — defaulting to jobseeker persona. Add this role to roleToPersona().`);
      return 'jobseeker';
  }
}

// ---------------------------------------------------------------------------
// Derive SubscriptionFeatures from a PricingTier.
// This bridges the old typed interface to the new dynamic pricing config.
// Works for ANY persona — missing keys default to false / 0.
// ---------------------------------------------------------------------------

// M4 FIX: Returns -1 (not Infinity) for unlimited limits.
// Infinity is not JSON-serializable (becomes null) causing subtle bugs if
// features are ever persisted or passed through postMessage.
// Callers must check `=== -1` to mean "unlimited".
function featuresFromPricingTier(tier: PricingTier): SubscriptionFeatures {
  // Raw -1 passthrough: unlimited is represented as -1, not Infinity
  const limit = (key: string) => getTierLimit(tier, key);
  return {
    maxJobPostings: limit('maxJobPostings'),
    advancedAnalytics: tierHasFeature(tier, 'advancedAnalytics'),
    candidateSearch: tierHasFeature(tier, 'candidateSearch'),
    advancedFilters: tierHasFeature(tier, 'advancedFilters'),
    eventSponsorship: tierHasFeature(tier, 'eventSponsorship'),
    eventSponsorsPerQuarter: limit('eventSponsorsPerQuarter'),
    employerBranding: tierHasFeature(tier, 'employerBranding'),
    prioritySupport: tierHasFeature(tier, 'prioritySupport'),
    customIntegrations: tierHasFeature(tier, 'customIntegrations'),
    apiAccess: tierHasFeature(tier, 'apiAccess'),
    whiteLabel: tierHasFeature(tier, 'whiteLabel'),
    dedicatedManager: tierHasFeature(tier, 'dedicatedManager'),
  };
}

/**
 * Resolve the correct PricingTier for a persona + subscription tier key.
 * Falls back to the first (cheapest/free) tier for the persona.
 */
function resolvePricingTier(persona: PersonaType, tierKey: string): PricingTier {
  // Try exact tierKey match first
  const match = getTierByPersonaAndKey(persona, tierKey);
  if (match) return match;

  // Fallback: return the first tier for this persona (free/starter)
  const personaTiers = getPersonaTiers(persona);
  return personaTiers[0] ?? getPersonaTiers('jobseeker')[0];
}

// Build the available plans from employer pricing tiers (for backwards compat)
const employerPricingTiers = getPersonaTiers('employer');
const availablePlans: SubscriptionPlan[] = employerPricingTiers.flatMap((tier) => {
  const baseFeatures = featuresFromPricingTier(tier);
  const tierKey = (tier.tierKey === 'teams' ? 'starter' : tier.tierKey) as SubscriptionTier;
  const plans: SubscriptionPlan[] = [];

  plans.push({
    id: tier.id,
    tier: tierKey,
    name: tier.name,
    price: tier.price_monthly,
    interval: 'month',
    features: baseFeatures,
    stripePriceId: tier.stripe_price_id_monthly,
  });

  if (tier.price_annual > 0) {
    plans.push({
      id: `${tier.id}_annual`,
      tier: tierKey,
      name: `${tier.name} (Annual)`,
      price: tier.price_annual,
      interval: 'year',
      features: baseFeatures,
      stripePriceId: tier.stripe_price_id_annual,
    });
  }

  return plans;
});

// ---------------------------------------------------------------------------
// CONTEXT PROVIDER
// ---------------------------------------------------------------------------

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobPostingsUsed, setJobPostingsUsed] = useState(0);
  const [eventSponsorsUsed, setEventSponsorsUsed] = useState(0);

  // Detect the current user's persona from their role.
  // C3 FIX: Read from app_metadata (server-controlled, not user-editable).
  // user_metadata can be written by any user via supabase.auth.updateUser(),
  // which would allow self-escalation to any persona/tier.
  const currentPersona = useMemo<PersonaType>(() => {
    const role = (user as { app_metadata?: { role?: string } } | null)?.app_metadata?.role;
    return roleToPersona(role);
  }, [user]);

  // Fetch subscription data when user changes
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setIsLoading(false);
        return;
      }

      try {
        // In production, this would fetch from your backend/Supabase
        // For now, we simulate a free tier subscription
        const mockSubscription: Subscription = {
          id: 'sub_mock_' + user.id,
          tier: 'free',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
        };

        setSubscription(mockSubscription);
        setJobPostingsUsed(0);
        setEventSponsorsUsed(0);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  // Resolve the current pricing tier from persona + subscription tier key
  const currentPricingTier = useMemo(() => {
    const tierKey = subscription?.tier === 'free' ? 'free' : (subscription?.tier ?? 'free');
    // Map the SubscriptionTier to the persona's tierKey naming
    const personaTiers = getPersonaTiers(currentPersona);
    const firstTier = personaTiers[0];
    // Try the subscription tier key; if no match, use the first (free/cheapest) tier
    return resolvePricingTier(currentPersona, tierKey === 'free' ? (firstTier?.tierKey ?? 'free') : tierKey);
  }, [currentPersona, subscription?.tier]);

  // Get current features based on resolved pricing tier
  const currentFeatures = useMemo(
    () => featuresFromPricingTier(currentPricingTier),
    [currentPricingTier],
  );

  // Feature access check — works with both typed SubscriptionFeatures keys
  // and arbitrary feature strings from any persona's pricing tier
  const canAccessFeature = useCallback(
    (feature: keyof SubscriptionFeatures | string): boolean => {
      // Check the typed features first (backwards compat for employer-centric code)
      const typedValue = currentFeatures[feature as keyof SubscriptionFeatures];
      if (typedValue !== undefined) {
        if (typeof typedValue === 'boolean') return typedValue;
        if (typeof typedValue === 'number') return typedValue > 0;
      }
      // Check the raw pricing tier features (supports any persona's features)
      return tierHasFeature(currentPricingTier, feature);
    },
    [currentFeatures, currentPricingTier],
  );

  // M4: -1 is the unlimited sentinel (Infinity is not JSON-safe)
  const canPostJob = useCallback((): boolean => {
    if (currentFeatures.maxJobPostings === -1) return true;
    return jobPostingsUsed < currentFeatures.maxJobPostings;
  }, [currentFeatures, jobPostingsUsed]);

  const getJobPostingsRemaining = useCallback((): number => {
    if (currentFeatures.maxJobPostings === -1) return -1; // caller should display "Unlimited"
    return Math.max(0, currentFeatures.maxJobPostings - jobPostingsUsed);
  }, [currentFeatures, jobPostingsUsed]);

  const canSponsorEvent = useCallback((): boolean => {
    if (!currentFeatures.eventSponsorship) return false;
    if (currentFeatures.eventSponsorsPerQuarter === -1) return true;
    return eventSponsorsUsed < currentFeatures.eventSponsorsPerQuarter;
  }, [currentFeatures, eventSponsorsUsed]);

  // Subscribe to a plan.
  // M3 FIX: No longer fakes a 'trialing' state for paid plans without a real
  // Stripe call. Previously this set status='trialing' with no backend record,
  // creating user expectation mismatch and potential billing disputes.
  // Free/starter downgrades still apply locally since no payment is involved.
  const subscribeToPlan = useCallback(async (planId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const plan = availablePlans.find(p => p.id === planId);
      if (!plan) {
        const tier = getTierById(planId);
        if (!tier) return { success: false, error: 'Plan not found' };

        const isFree = ['free', 'starter', 'community', 'pilot'].includes(tier.tierKey);
        if (isFree) {
          setSubscription(prev => prev ? { ...prev, tier: 'free' as SubscriptionTier, status: 'active' } : null);
          return { success: true };
        }
        if (tier.tierKey === 'enterprise' || tier.price_monthly === 0) {
          return { success: false, error: 'Please contact sales@stemworkforce.net for this plan.' };
        }
        // Paid plan — Stripe integration required
        return {
          success: false,
          error: 'Online checkout coming soon. Contact sales@stemworkforce.net to upgrade.',
        };
      }

      if (plan.tier === 'free' || plan.tier === 'starter') {
        setSubscription(prev => prev ? { ...prev, tier: plan.tier, status: 'active' } : null);
        return { success: true };
      }

      if (plan.tier === 'enterprise') {
        return { success: false, error: 'Please contact sales@stemworkforce.net for Enterprise pricing.' };
      }

      // Paid plan — Stripe integration required; do not fake trialing state
      return {
        success: false,
        error: 'Online checkout coming soon. Contact sales@stemworkforce.net to upgrade.',
      };
    } catch {
      return { success: false, error: 'Failed to process subscription request.' };
    }
  }, []);

  const cancelSubscription = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to cancel subscription' };
    }
  }, []);

  const resumeSubscription = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: false } : null);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to resume subscription' };
    }
  }, []);

  const updatePaymentMethod = useCallback(async (): Promise<{ success: boolean; portalUrl?: string; error?: string }> => {
    return {
      success: false,
      error: 'Payment management coming soon. Contact sales@stemworkforce.net',
    };
  }, []);

  // Usage lookup — persona-aware: resolves limits from the current pricing tier.
  // M4: limit of -1 means unlimited. Callers should check `limit === -1`.
  const getUsage = useCallback((metric: string): { used: number; limit: number } => {
    const limit = getTierLimit(currentPricingTier, metric); // -1 = unlimited

    let used = 0;
    if (metric === 'maxJobPostings') used = jobPostingsUsed;
    else if (metric === 'eventSponsorsPerQuarter') used = eventSponsorsUsed;

    return { used, limit };
  }, [currentPricingTier, jobPostingsUsed, eventSponsorsUsed]);

  const isTrialing = useCallback((): boolean => {
    return subscription?.status === 'trialing';
  }, [subscription?.status]);

  const daysLeftInTrial = useCallback((): number => {
    if (subscription?.status !== 'trialing' || !subscription.trialEnd) return 0;
    const msLeft = subscription.trialEnd.getTime() - Date.now();
    return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
  }, [subscription]);

  const value: BillingContextType = {
    subscription,
    isLoading,
    plans: availablePlans,
    currentFeatures,
    currentPersona,
    currentPricingTier,
    pricingTiers: ALL_PRICING_TIERS,
    getPersonaTiers,
    canAccessFeature,
    canPostJob,
    getJobPostingsRemaining,
    canSponsorEvent,
    getUsage,
    isTrialing,
    daysLeftInTrial,
    subscribeToPlan,
    cancelSubscription,
    resumeSubscription,
    updatePaymentMethod,
    jobPostingsUsed,
    eventSponsorsUsed,
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = (): BillingContextType => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

export default BillingContext;
