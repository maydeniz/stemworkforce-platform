// ===========================================
// Billing Tab - Industry Partner Dashboard
// Subscription and payment management
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Loader2
} from 'lucide-react';
import type { PartnerTier } from '@/types/industryPartner';

// ===========================================
// TYPES
// ===========================================

interface BillingTabProps {
  partnerId: string;
  currentTier: PartnerTier;
}

// ===========================================
// PRICING TIERS
// ===========================================

const PRICING_TIERS = [
  {
    id: 'starter' as PartnerTier,
    name: 'Starter',
    price: 0,
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
      hasInternshipManagement: false,
      hasCareerFairAccess: false,
      hasAdvancedAnalytics: false
    },
    icon: Star,
    popular: false
  },
  {
    id: 'growth' as PartnerTier,
    name: 'Growth',
    price: 1499,
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
      maxJobs: -1,
      maxFeaturedJobs: 5,
      hasInternshipManagement: true,
      hasCareerFairAccess: true,
      hasAdvancedAnalytics: true
    },
    icon: Zap,
    popular: true
  },
  {
    id: 'enterprise' as PartnerTier,
    name: 'Enterprise',
    price: -1, // Custom
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
      hasInternshipManagement: true,
      hasCareerFairAccess: true,
      hasAdvancedAnalytics: true
    },
    icon: Crown,
    popular: false
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const BillingTab: React.FC<BillingTabProps> = ({ partnerId: _partnerId, currentTier }) => {
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [billingNotification, setBillingNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const currentPlan = PRICING_TIERS.find(t => t.id === currentTier) || PRICING_TIERS[0];

  const handleUpgrade = async (tierId: PartnerTier) => {
    if (tierId === currentTier) return;

    setUpgrading(tierId);

    // Simulate API call
    setTimeout(() => {
      setBillingNotification({ type: 'success', message: `Upgrade to ${tierId} initiated! Redirecting to Stripe checkout...` });
      setUpgrading(null);
      setTimeout(() => setBillingNotification(null), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {billingNotification && (
        <div className={`p-4 rounded-lg text-sm flex items-center justify-between ${
          billingNotification.type === 'success'
            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
            : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          <span>{billingNotification.message}</span>
          <button onClick={() => setBillingNotification(null)} className="ml-4 hover:opacity-80">
            <span className="text-lg">&times;</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Billing & Subscription</h2>
        <p className="text-gray-400">Manage your partnership plan and billing</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gray-900 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <currentPlan.icon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Current Plan: {currentPlan.name}</h3>
              <p className="text-gray-400">{currentPlan.description}</p>
            </div>
          </div>
          {currentPlan.price > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${currentPlan.price}</div>
              <div className="text-sm text-gray-400">/month</div>
            </div>
          )}
          {currentPlan.price === 0 && (
            <div className="text-2xl font-bold text-emerald-400">Free</div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Plan Features</h4>
            <ul className="space-y-1">
              {currentPlan.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Usage</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Job Postings</span>
                <span className="text-white">
                  {currentPlan.limits.maxJobs === -1 ? 'Unlimited' : `0 / ${currentPlan.limits.maxJobs}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Featured Jobs</span>
                <span className="text-white">
                  {currentPlan.limits.maxFeaturedJobs === -1 ? 'Unlimited' :
                   currentPlan.limits.maxFeaturedJobs === 0 ? 'Not included' :
                   `0 / ${currentPlan.limits.maxFeaturedJobs}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Internship Programs</span>
                <span className="text-white">
                  {currentPlan.limits.hasInternshipManagement ? 'Available' : 'Not included'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          {currentTier === 'enterprise' ? 'All Plans' : 'Upgrade Your Plan'}
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => {
            const Icon = tier.icon;
            const isCurrent = tier.id === currentTier;
            const isDowngrade = PRICING_TIERS.findIndex(t => t.id === tier.id) <
                               PRICING_TIERS.findIndex(t => t.id === currentTier);

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-2xl p-6 ${
                  tier.popular
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white'
                    : 'bg-gray-900 border border-gray-800'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tier.popular ? 'bg-white/20' : 'bg-emerald-500/20'
                  }`}>
                    <Icon className={`w-5 h-5 ${tier.popular ? 'text-white' : 'text-emerald-400'}`} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${tier.popular ? 'text-white' : 'text-white'}`}>{tier.name}</h4>
                    {isCurrent && (
                      <span className={`text-xs ${tier.popular ? 'text-emerald-100' : 'text-emerald-400'}`}>
                        Current Plan
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  {tier.price === -1 ? (
                    <div className={`text-2xl font-bold ${tier.popular ? 'text-white' : 'text-white'}`}>
                      Custom
                    </div>
                  ) : tier.price === 0 ? (
                    <div className={`text-2xl font-bold ${tier.popular ? 'text-white' : 'text-white'}`}>
                      Free
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${tier.popular ? 'text-white' : 'text-white'}`}>
                        ${tier.price}
                      </span>
                      <span className={tier.popular ? 'text-emerald-100' : 'text-gray-400'}>/mo</span>
                    </div>
                  )}
                  <p className={`text-sm ${tier.popular ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        tier.popular ? 'text-emerald-100' : 'text-emerald-400'
                      }`} />
                      <span className={tier.popular ? 'text-white' : 'text-gray-300'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={isCurrent || upgrading === tier.id}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? `${tier.popular ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'} cursor-default`
                      : isDowngrade
                      ? `${tier.popular ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'} hover:opacity-80`
                      : tier.popular
                      ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {upgrading === tier.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isCurrent ? 'Current Plan' :
                   isDowngrade ? 'Downgrade' :
                   tier.price === -1 ? 'Contact Sales' :
                   <>Upgrade <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      {currentTier !== 'starter' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-white">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-400">Expires 12/26</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpdatePaymentModal(true)}
              className="px-4 py-2 text-emerald-400 hover:text-emerald-300 text-sm"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Billing History */}
      {currentTier !== 'starter' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
          <div className="text-center py-8 text-gray-400">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No billing history yet</p>
          </div>
        </div>
      )}

      {/* Update Payment Method Modal */}
      {showUpdatePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpdatePaymentModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Update Payment Method</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CVC</label>
                  <input type="text" placeholder="123" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Billing Address</label>
                <input type="text" placeholder="123 Main St, City, State" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUpdatePaymentModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowUpdatePaymentModal(false)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">Update Card</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTab;
