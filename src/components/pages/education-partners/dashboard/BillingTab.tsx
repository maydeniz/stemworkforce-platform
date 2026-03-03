// ===========================================
// Billing Tab - Partner Dashboard
// Subscription management with Stripe integration
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  Star,
  Zap,
  Loader2,
  AlertCircle,
  Download,
  Receipt,
  ArrowRight,
  Shield,
  Crown
} from 'lucide-react';
import {
  PRICING_TIERS,
  getPartnerSubscription,
  createCheckoutSession,
  getBillingHistory,
  type PartnerSubscription,
  type BillingRecord
} from '@/services/partnerBillingService';

// ===========================================
// TYPES
// ===========================================

interface BillingTabProps {
  partnerId: string;
  currentTier: string;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

const BillingTab: React.FC<BillingTabProps> = ({ partnerId, currentTier }) => {
  const [subscription, setSubscription] = useState<PartnerSubscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [showContactSalesModal, setShowContactSalesModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showDownloadNotification, setShowDownloadNotification] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, [partnerId]);

  const loadBillingData = async () => {
    setLoading(true);
    const [sub, history] = await Promise.all([
      getPartnerSubscription(partnerId),
      getBillingHistory(partnerId)
    ]);
    setSubscription(sub);
    setBillingHistory(history);
    setLoading(false);
  };

  const handleUpgrade = async (tierId: string) => {
    setUpgrading(tierId);
    const successUrl = `${window.location.origin}/education-partner-dashboard?tab=billing&success=true`;
    const cancelUrl = `${window.location.origin}/education-partner-dashboard?tab=billing&cancelled=true`;
    const result = await createCheckoutSession(partnerId, tierId, successUrl, cancelUrl);

    if (result?.url) {
      window.location.href = result.url;
    } else {
      setUpgrading(null);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'enterprise': return Crown;
      case 'growth': return Star;
      default: return Zap;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const currentPlan = PRICING_TIERS.find(t => t.id === currentTier) || PRICING_TIERS[0];

  return (
    <div className="space-y-8">
      {/* Current Plan Banner */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {React.createElement(getTierIcon(currentTier), { className: 'w-6 h-6 text-indigo-400' })}
              <h2 className="text-xl font-bold text-white">
                {currentPlan.name} Plan
              </h2>
              {currentPlan.popular && (
                <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                  Popular
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-4">
              {subscription?.status === 'active'
                ? `Your subscription renews on ${subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}`
                : 'Free plan - no billing'}
            </p>
            {subscription?.status === 'active' && (
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">
                  Next billing: <span className="text-white">${currentPlan.price}/month</span>
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {currentPlan.price === 0 ? 'Free' : currentPlan.price === -1 ? 'Custom' : `$${currentPlan.price}`}
            </div>
            <div className="text-gray-400 text-sm">per month</div>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRICING_TIERS.map((tier) => {
            const isCurrentTier = tier.id === currentTier;
            const TierIcon = getTierIcon(tier.id);

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative bg-gray-900 border rounded-xl p-6 ${
                  tier.popular
                    ? 'border-indigo-500'
                    : isCurrentTier
                      ? 'border-emerald-500'
                      : 'border-gray-800'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-indigo-500 text-white text-xs rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                {isCurrentTier && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tier.popular ? 'bg-indigo-500/20' : 'bg-gray-800'
                  }`}>
                    <TierIcon className={`w-5 h-5 ${tier.popular ? 'text-indigo-400' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{tier.name}</h4>
                    <p className="text-sm text-gray-400">{tier.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-white">
                    {tier.price === 0 ? 'Free' : tier.price === -1 ? 'Custom' : `$${tier.price}`}
                  </div>
                  {tier.price > 0 && <div className="text-gray-400 text-sm">per month</div>}
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {tier.limits.maxPrograms === -1 ? 'Unlimited' : tier.limits.maxPrograms} programs
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {tier.limits.maxStudentProfiles === -1 ? 'Unlimited' : tier.limits.maxStudentProfiles.toLocaleString()} student profiles
                  </li>
                  {tier.limits.canHostEvents && (
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      Host events & career fairs
                    </li>
                  )}
                  {tier.limits.hasAdvancedAnalytics && (
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      Advanced analytics
                    </li>
                  )}
                  {tier.limits.hasApiAccess && (
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      API access & integrations
                    </li>
                  )}
                  {tier.limits.hasDedicatedSupport && (
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      Dedicated account manager
                    </li>
                  )}
                  {tier.limits.hasWhiteLabeling && (
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      White-label branding
                    </li>
                  )}
                </ul>

                {isCurrentTier ? (
                  <button
                    disabled
                    className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : tier.price === -1 ? (
                  <button onClick={() => setShowContactSalesModal(true)} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    Contact Sales
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={upgrading === tier.id}
                    className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    } disabled:opacity-50`}
                  >
                    {upgrading === tier.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {tier.price > currentPlan.price ? 'Upgrade' : 'Downgrade'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white">Feature Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Feature</th>
                {PRICING_TIERS.map(tier => (
                  <th key={tier.id} className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="px-6 py-4 text-sm text-gray-300">Programs</td>
                {PRICING_TIERS.map(tier => (
                  <td key={tier.id} className="px-6 py-4 text-center text-sm text-white">
                    {tier.limits.maxPrograms === -1 ? '∞' : tier.limits.maxPrograms}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-6 py-4 text-sm text-gray-300">Student Profiles</td>
                {PRICING_TIERS.map(tier => (
                  <td key={tier.id} className="px-6 py-4 text-center text-sm text-white">
                    {tier.limits.maxStudentProfiles === -1 ? '∞' : tier.limits.maxStudentProfiles.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-6 py-4 text-sm text-gray-300">Employer Connections</td>
                {PRICING_TIERS.map(tier => (
                  <td key={tier.id} className="px-6 py-4 text-center text-sm text-white">
                    {tier.limits.maxEmployerConnections === -1 ? '∞' : tier.limits.maxEmployerConnections}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-6 py-4 text-sm text-gray-300">Host Events</td>
                {PRICING_TIERS.map(tier => (
                  <td key={tier.id} className="px-6 py-4 text-center">
                    {tier.limits.canHostEvents ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-6 py-4 text-sm text-gray-300">Advanced Analytics</td>
                {PRICING_TIERS.map(tier => (
                  <td key={tier.id} className="px-6 py-4 text-center">
                    {tier.limits.hasAdvancedAnalytics ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-6 py-4 text-sm text-gray-300">API Access</td>
                {PRICING_TIERS.map(tier => (
                  <td key={tier.id} className="px-6 py-4 text-center">
                    {tier.limits.hasApiAccess ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-6 py-4 text-sm text-gray-300">Dedicated Support</td>
                {PRICING_TIERS.map(tier => (
                  <td key={tier.id} className="px-6 py-4 text-center">
                    {tier.limits.hasDedicatedSupport ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-300">White Labeling</td>
                {PRICING_TIERS.map(tier => (
                  <td key={tier.id} className="px-6 py-4 text-center">
                    {tier.limits.hasWhiteLabeling ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Billing History</h3>
          <button onClick={() => { setShowDownloadNotification(true); setTimeout(() => setShowDownloadNotification(false), 3000); }} className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>
        {billingHistory.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No billing history yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {billingHistory.map((record) => (
              <div key={record.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    record.status === 'paid' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                  }`}>
                    <Receipt className={`w-5 h-5 ${
                      record.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-white">{record.description}</div>
                    <div className="text-sm text-gray-400">{formatDate(record.date)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-medium text-white">${record.amount.toFixed(2)}</div>
                    <div className={`text-xs ${
                      record.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </div>
                  </div>
                  {record.invoiceUrl && (
                    <a
                      href={record.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Payment Method</h3>
          <button onClick={() => setShowUpdatePaymentModal(true)} className="text-sm text-indigo-400 hover:text-indigo-300">
            Update
          </button>
        </div>
        {subscription?.paymentMethod ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
              <CreditCard className="w-6 h-4 text-gray-400" />
            </div>
            <div>
              <div className="font-medium text-white">
                •••• •••• •••• {subscription.paymentMethod.last4}
              </div>
              <div className="text-sm text-gray-400">
                Expires {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <div className="flex-1">
              <div className="text-white">No payment method on file</div>
              <div className="text-sm text-gray-400">Add a payment method to upgrade your plan</div>
            </div>
            <button onClick={() => setShowAddCardModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
              Add Card
            </button>
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <Shield className="w-5 h-5" />
        <span>
          All payments are securely processed through Stripe. We never store your full card details.
        </span>
      </div>

      {/* Contact Sales Modal */}
      {showContactSalesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowContactSalesModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Contact Enterprise Sales</h3>
            <p className="text-gray-400 mb-4">
              Get a custom Enterprise plan tailored to your institution's needs, including unlimited programs, white-label branding, dedicated support, and API access.
            </p>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="you@institution.edu" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea rows={3} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 resize-none" placeholder="Tell us about your needs..." />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowContactSalesModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowContactSalesModal(false)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Send Inquiry</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Method Modal */}
      {showUpdatePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpdatePaymentModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Update Payment Method</h3>
            <p className="text-gray-400 mb-4">Enter your new card details. Your card information is securely processed through Stripe.</p>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expiry</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="MM / YY" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CVC</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="123" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowUpdatePaymentModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowUpdatePaymentModal(false)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Update Card</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddCardModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Add Payment Method</h3>
            <p className="text-gray-400 mb-4">Add a card to upgrade your plan. Your card information is securely processed through Stripe.</p>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cardholder Name</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="Name on card" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expiry</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="MM / YY" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CVC</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500" placeholder="123" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAddCardModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowAddCardModal(false)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Add Card</button>
            </div>
          </div>
        </div>
      )}

      {/* Download Notification */}
      {showDownloadNotification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Download Started</p>
              <p className="text-gray-400 text-xs">Your billing history is being prepared for download.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTab;
