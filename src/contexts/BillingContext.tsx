// ===========================================
// BILLING CONTEXT - Stripe Integration & Subscription Management
// ===========================================

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Subscription tier types
export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

// Feature flags based on subscription
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

// Subscription plan details
export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: SubscriptionFeatures;
  stripePriceId?: string;
}

// Current subscription status
export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

// Billing context type
interface BillingContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  plans: SubscriptionPlan[];
  currentFeatures: SubscriptionFeatures;
  // Feature checks
  canAccessFeature: (feature: keyof SubscriptionFeatures) => boolean;
  canPostJob: () => boolean;
  getJobPostingsRemaining: () => number;
  canSponsorEvent: () => boolean;
  // Subscription actions
  subscribeToPlan: (planId: string) => Promise<{ success: boolean; checkoutUrl?: string; error?: string }>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
  resumeSubscription: () => Promise<{ success: boolean; error?: string }>;
  updatePaymentMethod: () => Promise<{ success: boolean; portalUrl?: string; error?: string }>;
  // Usage tracking
  jobPostingsUsed: number;
  eventSponsorsUsed: number;
}

// Default features for each tier
const tierFeatures: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxJobPostings: 3,
    advancedAnalytics: false,
    candidateSearch: false,
    advancedFilters: false,
    eventSponsorship: false,
    eventSponsorsPerQuarter: 0,
    employerBranding: false,
    prioritySupport: false,
    customIntegrations: false,
    apiAccess: false,
    whiteLabel: false,
    dedicatedManager: false,
  },
  starter: {
    maxJobPostings: 3,
    advancedAnalytics: false,
    candidateSearch: true,
    advancedFilters: false,
    eventSponsorship: false,
    eventSponsorsPerQuarter: 0,
    employerBranding: false,
    prioritySupport: false,
    customIntegrations: false,
    apiAccess: false,
    whiteLabel: false,
    dedicatedManager: false,
  },
  professional: {
    maxJobPostings: 25,
    advancedAnalytics: true,
    candidateSearch: true,
    advancedFilters: true,
    eventSponsorship: true,
    eventSponsorsPerQuarter: 1,
    employerBranding: true,
    prioritySupport: true,
    customIntegrations: false,
    apiAccess: false,
    whiteLabel: false,
    dedicatedManager: false,
  },
  enterprise: {
    maxJobPostings: Infinity,
    advancedAnalytics: true,
    candidateSearch: true,
    advancedFilters: true,
    eventSponsorship: true,
    eventSponsorsPerQuarter: Infinity,
    employerBranding: true,
    prioritySupport: true,
    customIntegrations: true,
    apiAccess: true,
    whiteLabel: true,
    dedicatedManager: true,
  },
};

// Available subscription plans
const availablePlans: SubscriptionPlan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'Starter',
    price: 0,
    interval: 'month',
    features: tierFeatures.free,
  },
  {
    id: 'professional-monthly',
    tier: 'professional',
    name: 'Professional',
    price: 299,
    interval: 'month',
    features: tierFeatures.professional,
    stripePriceId: 'price_professional_monthly', // Replace with actual Stripe price ID
  },
  {
    id: 'professional-yearly',
    tier: 'professional',
    name: 'Professional (Annual)',
    price: 2990, // ~2 months free
    interval: 'year',
    features: tierFeatures.professional,
    stripePriceId: 'price_professional_yearly', // Replace with actual Stripe price ID
  },
  {
    id: 'enterprise',
    tier: 'enterprise',
    name: 'Enterprise',
    price: 0, // Custom pricing
    interval: 'month',
    features: tierFeatures.enterprise,
  },
];

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobPostingsUsed, setJobPostingsUsed] = useState(0);
  const [eventSponsorsUsed, setEventSponsorsUsed] = useState(0);

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
        // For now, we'll simulate a free tier subscription

        // Simulated subscription data
        const mockSubscription: Subscription = {
          id: 'sub_mock_' + user.id,
          tier: 'free', // Default to free tier
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
        };

        setSubscription(mockSubscription);
        setJobPostingsUsed(2); // Mock: 2 jobs already posted
        setEventSponsorsUsed(0);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  // Get current features based on subscription tier
  const currentFeatures = subscription
    ? tierFeatures[subscription.tier]
    : tierFeatures.free;

  // Check if user can access a specific feature
  const canAccessFeature = useCallback((feature: keyof SubscriptionFeatures): boolean => {
    const featureValue = currentFeatures[feature];
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    if (typeof featureValue === 'number') {
      return featureValue > 0;
    }
    return false;
  }, [currentFeatures]);

  // Check if user can post more jobs
  const canPostJob = useCallback((): boolean => {
    if (currentFeatures.maxJobPostings === Infinity) return true;
    return jobPostingsUsed < currentFeatures.maxJobPostings;
  }, [currentFeatures, jobPostingsUsed]);

  // Get remaining job postings
  const getJobPostingsRemaining = useCallback((): number => {
    if (currentFeatures.maxJobPostings === Infinity) return Infinity;
    return Math.max(0, currentFeatures.maxJobPostings - jobPostingsUsed);
  }, [currentFeatures, jobPostingsUsed]);

  // Check if user can sponsor more events
  const canSponsorEvent = useCallback((): boolean => {
    if (!currentFeatures.eventSponsorship) return false;
    if (currentFeatures.eventSponsorsPerQuarter === Infinity) return true;
    return eventSponsorsUsed < currentFeatures.eventSponsorsPerQuarter;
  }, [currentFeatures, eventSponsorsUsed]);

  // Subscribe to a plan (redirects to Stripe Checkout)
  const subscribeToPlan = useCallback(async (planId: string): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> => {
    try {
      const plan = availablePlans.find(p => p.id === planId);
      if (!plan) {
        return { success: false, error: 'Plan not found' };
      }

      if (plan.tier === 'free') {
        // Handle downgrade to free
        setSubscription(prev => prev ? { ...prev, tier: 'free' } : null);
        return { success: true };
      }

      if (plan.tier === 'enterprise') {
        // Enterprise requires sales contact
        return { success: false, error: 'Please contact sales for Enterprise pricing' };
      }

      // In production, this would call your backend to create a Stripe Checkout session
      // const response = await fetch('/api/stripe/create-checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId: plan.stripePriceId }),
      // });
      // const { checkoutUrl } = await response.json();

      // For demo, simulate success and upgrade
      setSubscription(prev => prev ? {
        ...prev,
        tier: plan.tier,
        status: 'trialing',
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 day trial
      } : null);

      // Mock checkout URL
      return {
        success: true,
        checkoutUrl: `https://checkout.stripe.com/demo?plan=${planId}`
      };
    } catch (error) {
      return { success: false, error: 'Failed to start subscription' };
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // In production, call your backend to cancel via Stripe
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to cancel subscription' };
    }
  }, []);

  // Resume a canceled subscription
  const resumeSubscription = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: false } : null);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to resume subscription' };
    }
  }, []);

  // Open Stripe Customer Portal for payment method updates
  const updatePaymentMethod = useCallback(async (): Promise<{ success: boolean; portalUrl?: string; error?: string }> => {
    try {
      // In production, create a Stripe Customer Portal session
      return {
        success: true,
        portalUrl: 'https://billing.stripe.com/demo'
      };
    } catch (error) {
      return { success: false, error: 'Failed to open billing portal' };
    }
  }, []);

  const value: BillingContextType = {
    subscription,
    isLoading,
    plans: availablePlans,
    currentFeatures,
    canAccessFeature,
    canPostJob,
    getJobPostingsRemaining,
    canSponsorEvent,
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
