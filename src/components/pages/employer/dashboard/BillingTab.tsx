// ===========================================
// Employer Dashboard - Billing Tab
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Download, X, ArrowUpRight } from 'lucide-react';

const INVOICES = [
  { date: 'Mar 1, 2025', amount: '$2,499.00', status: 'Paid', id: 'INV-2025-003' },
  { date: 'Feb 1, 2025', amount: '$2,499.00', status: 'Paid', id: 'INV-2025-002' },
  { date: 'Jan 1, 2025', amount: '$2,499.00', status: 'Paid', id: 'INV-2025-001' },
  { date: 'Dec 1, 2024', amount: '$2,499.00', status: 'Paid', id: 'INV-2024-012' },
];

const BillingTab: React.FC = () => {
  const [showToast, setShowToast] = useState('');
  const [viewInvoice, setViewInvoice] = useState<typeof INVOICES[0] | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {showToast}
        </div>
      )}

      {/* Current Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-white">Enterprise Plan</h3>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <p className="text-gray-400 text-sm">Unlimited job postings, full analytics, priority support</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">$2,499<span className="text-sm text-gray-400">/month</span></div>
            <div className="text-sm text-gray-400">Billed annually ($29,988/yr)</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { feature: 'Job Postings', usage: 'Unlimited', limit: '' },
            { feature: 'AI Match Credits', usage: '8,234', limit: '/ 10,000' },
            { feature: 'Team Seats', usage: '12', limit: '/ 25' },
            { feature: 'API Calls', usage: '45,678', limit: '/ 100,000' },
          ].map((item) => (
            <div key={item.feature} className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs">{item.feature}</div>
              <div className="text-white font-semibold mt-1">{item.usage}<span className="text-gray-500 text-sm">{item.limit}</span></div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={() => setShowUpgradeModal(true)} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" /> Manage Plan
          </button>
        </div>
      </motion.div>

      {/* Plan Features */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Plan Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Unlimited job postings', 'AI-powered candidate matching', 'Advanced analytics & reporting',
            'Clearance pipeline tracking', 'Campus recruiting tools', 'Dedicated account manager',
            'Custom integrations (ATS)', 'Priority support (24/7)', 'Diversity pipeline insights',
            'Branded employer profile', 'Event management', 'Bulk candidate export',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Payment Method</h3>
          <button onClick={() => triggerToast('Payment method update screen opened!')} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Update</button>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
          <CreditCard className="w-8 h-8 text-blue-400" />
          <div>
            <div className="text-white text-sm font-medium">Visa ending in 4242</div>
            <div className="text-gray-500 text-xs">Expires 12/2026</div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
          <button onClick={() => triggerToast('All invoices download started!')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"><Download className="w-3 h-3" /> Download All</button>
        </div>
        <div className="space-y-2">
          {INVOICES.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-white text-sm font-medium">{invoice.id}</div>
                  <div className="text-gray-500 text-xs">{invoice.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium text-sm">{invoice.amount}</span>
                <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{invoice.status}</span>
                <button onClick={(e) => { e.stopPropagation(); setViewInvoice(invoice); }} className="text-gray-400 hover:text-white p-1 transition-colors" title="View Invoice"><Download className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewInvoice(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Invoice {viewInvoice.id}</h3>
              <button onClick={() => setViewInvoice(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 text-sm">Invoice Date</span>
                <span className="text-white text-sm font-medium">{viewInvoice.date}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 text-sm">Amount</span>
                <span className="text-white text-sm font-medium">{viewInvoice.amount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 text-sm">Status</span>
                <span className="text-emerald-400 text-sm font-medium">{viewInvoice.status}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 text-sm">Plan</span>
                <span className="text-white text-sm font-medium">Enterprise Plan</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 text-sm">Payment Method</span>
                <span className="text-white text-sm font-medium">Visa *4242</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setViewInvoice(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              <button onClick={() => { setViewInvoice(null); triggerToast(`Invoice ${viewInvoice.id} download started!`); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"><Download className="w-4 h-4" /> Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Manage Plan</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-gray-400 text-sm mb-6">You are currently on the Enterprise Plan. Contact your account manager for plan changes or upgrades.</p>

            <div className="space-y-3 mb-6">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Enterprise Plan</div>
                    <div className="text-gray-400 text-xs mt-0.5">Current plan</div>
                  </div>
                  <div className="text-emerald-400 text-sm font-medium">$2,499/mo</div>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => { setShowUpgradeModal(false); triggerToast('Account manager notified about upgrade interest!'); }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium flex items-center gap-2">Enterprise+ <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">UPGRADE</span></div>
                    <div className="text-gray-400 text-xs mt-0.5">Unlimited everything, dedicated infra, SLA guarantee</div>
                  </div>
                  <div className="text-purple-400 text-sm font-medium">Custom</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              <button onClick={() => { setShowUpgradeModal(false); triggerToast('Your account manager has been notified!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Contact Account Manager</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTab;
