// Static color class maps for Tailwind JIT compatibility
const billDashColors: Record<string, { iconBg: string; iconText: string; bar: string; hoverBorder: string }> = {
  emerald: { iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-400', bar: 'bg-emerald-500', hoverBorder: 'hover:border-emerald-500/30' },
  blue: { iconBg: 'bg-blue-500/20', iconText: 'text-blue-400', bar: 'bg-blue-500', hoverBorder: 'hover:border-blue-500/30' },
  violet: { iconBg: 'bg-violet-500/20', iconText: 'text-violet-400', bar: 'bg-violet-500', hoverBorder: 'hover:border-violet-500/30' },
  amber: { iconBg: 'bg-amber-500/20', iconText: 'text-amber-400', bar: 'bg-amber-500', hoverBorder: 'hover:border-amber-500/30' },
  cyan: { iconBg: 'bg-cyan-500/20', iconText: 'text-cyan-400', bar: 'bg-cyan-500', hoverBorder: 'hover:border-cyan-500/30' },
  slate: { iconBg: 'bg-slate-500/20', iconText: 'text-slate-400', bar: 'bg-slate-500', hoverBorder: 'hover:border-slate-500/30' },
};

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CreditCard, DollarSign, TrendingUp, Users, Package, Receipt,
  Calendar, CheckCircle2, XCircle, AlertCircle, Download,
  ArrowUpRight, ArrowDownRight, RefreshCw,
  Plus, Edit, Eye, Search, Zap,
  Building2, User, GraduationCap, Shield, Star
} from 'lucide-react';

// ===========================================
// BILLING & SUBSCRIPTIONS - COMPREHENSIVE
// ===========================================

interface BillingStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  mrr: number;
  arr: number;
  totalInvoices: number;
  paidInvoices: number;
  plans: SubscriptionPlan[];
}

interface Subscription {
  id: string;
  subscriber_id?: string;
  subscriber_type?: string;
  status: string;
  current_period_end?: string;
  subscription_plans?: { name: string; price_monthly: number; target_type?: string } | null;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  target_type?: string;
  stakeholder_type?: string;
  price_monthly: number;
  price_annual?: number;
  features?: Record<string, any>;
  limits?: { max_jobs?: number; max_users?: number };
  is_popular?: boolean;
  is_active?: boolean;
  stripe_product_id?: string;
}

interface Invoice {
  id: string;
  invoice_number?: string;
  subscription_id?: string;
  amount: number;
  status: string;
  due_date?: string;
  created_at?: string;
}

interface Addon {
  id: string;
  name: string;
  description?: string;
  price?: number;
  billing_type?: string;
  is_active?: boolean;
}

const BillingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BillingStats | null>(null);

  useEffect(() => {
    fetchBillingStats();
  }, []);

  const fetchBillingStats = async () => {
    setLoading(true);
    try {
      const [subscriptions, invoices, plans] = await Promise.all([
        supabase.from('subscriptions').select('*', { count: 'exact' }),
        supabase.from('invoices').select('*', { count: 'exact' }),
        supabase.from('subscription_plans').select('*')
      ]);

      const activeSubscriptions = subscriptions.data?.filter(s => s.status === 'active') || [];
      const mrr = activeSubscriptions.reduce((sum, s) => {
        const plan = plans.data?.find(p => p.id === s.plan_id);
        return sum + (plan?.price_monthly || 0);
      }, 0);

      setStats({
        totalSubscriptions: subscriptions.count || 0,
        activeSubscriptions: activeSubscriptions.length,
        mrr,
        arr: mrr * 12,
        totalInvoices: invoices.count || 0,
        paidInvoices: invoices.data?.filter(i => i.status === 'paid').length || 0,
        plans: plans.data || []
      });
    } catch (error) {
      console.error('Error fetching billing stats:', error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'subscriptions', label: 'Subscriptions', icon: Users },
    { id: 'plans', label: 'Plans', icon: Package },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'addons', label: 'Add-ons', icon: Plus },
    { id: 'settings', label: 'Stripe Settings', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing & Revenue</h1>
        <p className="text-slate-400 mt-1">Manage subscriptions, plans, and revenue</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <BillingOverview stats={stats} loading={loading} />}
      {activeTab === 'subscriptions' && <SubscriptionsTab />}
      {activeTab === 'plans' && <PlansTab />}
      {activeTab === 'invoices' && <InvoicesTab />}
      {activeTab === 'addons' && <AddonsTab />}
      {activeTab === 'settings' && <StripeSettingsTab />}
    </div>
  );
};

// ===========================================
// BILLING OVERVIEW
// ===========================================

const BillingOverview = ({ stats, loading }: { stats: BillingStats | null; loading: boolean }) => {
  const metrics = [
    { label: 'Monthly Recurring Revenue', value: stats?.mrr || 0, format: 'currency', change: '+18%', positive: true, icon: DollarSign, color: 'emerald' },
    { label: 'Annual Recurring Revenue', value: stats?.arr || 0, format: 'currency', change: '+24%', positive: true, icon: TrendingUp, color: 'blue' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions || 0, format: 'number', change: '+12', positive: true, icon: Users, color: 'violet' },
    { label: 'Churn Rate', value: 2.3, format: 'percent', change: '-0.5%', positive: true, icon: ArrowDownRight, color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${billDashColors[metric.color]?.iconBg || 'bg-slate-500/20'}`}>
                <metric.icon size={20} className={billDashColors[metric.color]?.iconText || 'text-slate-400'} />
              </div>
              <span className={`flex items-center gap-1 text-sm ${metric.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {metric.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold">
              {loading ? '...' : 
                metric.format === 'currency' ? `$${metric.value.toLocaleString()}` :
                metric.format === 'percent' ? `${metric.value}%` :
                metric.value.toLocaleString()
              }
            </p>
            <p className="text-sm text-slate-400 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end gap-2">
            {[8500, 9200, 9800, 10500, 11200, 11800, 12100, 12450, 12800, 13200, 13600, 14000].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(value / 14000) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Revenue by Stakeholder</h3>
          <div className="space-y-4">
            {[
              { type: 'Employers', revenue: 45000, percent: 60, color: 'emerald', icon: Building2 },
              { type: 'Training Providers', revenue: 15000, percent: 20, color: 'blue', icon: GraduationCap },
              { type: 'Job Seekers', revenue: 7500, percent: 10, color: 'violet', icon: User },
              { type: 'Government', revenue: 5000, percent: 7, color: 'amber', icon: Shield },
              { type: 'Events', revenue: 2500, percent: 3, color: 'cyan', icon: Calendar },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${billDashColors[item.color]?.iconBg || 'bg-slate-500/20'}`}>
                  <item.icon size={16} className={billDashColors[item.color]?.iconText || 'text-slate-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm text-slate-400">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${billDashColors[item.color]?.bar || 'bg-slate-500'} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
                <span className="text-sm font-medium w-20 text-right">${item.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Transactions</h3>
          <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { customer: 'TechCorp Inc.', plan: 'Mission Control', amount: 1999, status: 'paid', date: '2024-12-28' },
            { customer: 'QuantumLabs', plan: 'Talent Engine', amount: 499, status: 'paid', date: '2024-12-27' },
            { customer: 'BioMed Solutions', plan: 'Institution', amount: 999, status: 'pending', date: '2024-12-27' },
            { customer: 'John Smith', plan: 'Career Pro', amount: 12.99, status: 'paid', date: '2024-12-26' },
            { customer: 'AI Training Co.', plan: 'Growth', amount: 299, status: 'failed', date: '2024-12-26' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
                  {tx.customer[0]}
                </div>
                <div>
                  <p className="font-medium">{tx.customer}</p>
                  <p className="text-sm text-slate-400">{tx.plan}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${tx.amount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tx.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                  tx.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// SUBSCRIPTIONS TAB
// ===========================================

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    let query = supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans(name, price_monthly, target_type)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error) setSubscriptions(data || []);
    setLoading(false);
  };

  const handleCancelSubscription = async (subId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', subId);
    
    fetchSubscriptions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past Due</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium">
          <Plus size={18} />
          New Subscription
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Next Billing</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : subscriptions.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No subscriptions found</td></tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium">{sub.subscriber_id?.slice(0, 8)}...</p>
                    <p className="text-sm text-slate-400 capitalize">{sub.subscriber_type}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{sub.subscription_plans?.name || 'Unknown Plan'}</p>
                    <p className="text-sm text-slate-400 capitalize">{sub.subscription_plans?.target_type}</p>
                  </td>
                  <td className="px-4 py-4 font-medium">
                    ${sub.subscription_plans?.price_monthly?.toLocaleString() || 0}/mo
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      sub.status === 'trialing' ? 'bg-blue-500/20 text-blue-400' :
                      sub.status === 'past_due' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-amber-400">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleCancelSubscription(sub.id)}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-red-400"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===========================================
// PLANS TAB
// ===========================================

const PlansTab = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('target_type', { ascending: true })
      .order('display_order', { ascending: true });

    if (!error) setPlans(data || []);
    setLoading(false);
  };

  const plansByType = plans.reduce((acc: Record<string, SubscriptionPlan[]>, plan: SubscriptionPlan) => {
    const type = plan.target_type || plan.stakeholder_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(plan);
    return acc;
  }, {});

  const typeIcons: Record<string, any> = {
    employer: Building2,
    training_provider: GraduationCap,
    job_seeker: User,
    government: Shield,
    event_organizer: Calendar,
  };

  const typeColors: Record<string, string> = {
    employer: 'emerald',
    training_provider: 'blue',
    job_seeker: 'violet',
    government: 'amber',
    event_organizer: 'cyan',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Subscription Plans</h3>
        <button
          onClick={() => { setEditingPlan(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Add Plan
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-400 py-8">Loading plans...</p>
      ) : (
        Object.entries(plansByType).map(([type, typePlans]: [string, SubscriptionPlan[]]) => {
          const Icon = typeIcons[type] || Package;
          const color = typeColors[type] || 'slate';
          
          return (
            <div key={type} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${billDashColors[color]?.iconBg || 'bg-slate-500/20'}`}>
                  <Icon size={18} className={billDashColors[color]?.iconText || 'text-slate-400'} />
                </div>
                <h4 className="font-semibold capitalize">{type.replace('_', ' ')} Plans</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {typePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-slate-900 border border-slate-800 rounded-xl p-5 ${billDashColors[color]?.hoverBorder || 'hover:border-slate-500/30'} transition-colors relative`}
                  >
                    {plan.is_popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star size={12} />
                        Popular
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h5 className="font-semibold text-lg">{plan.name}</h5>
                        <p className="text-sm text-slate-400">{plan.description}</p>
                      </div>
                      <button
                        onClick={() => { setEditingPlan(plan); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold">
                        {plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly}`}
                      </span>
                      {plan.price_monthly > 0 && (
                        <span className="text-slate-400">/month</span>
                      )}
                      {(plan.price_annual ?? 0) > 0 && (
                        <p className="text-sm text-slate-500">${plan.price_annual}/year (save 17%)</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {plan.features && Object.entries(plan.features).slice(0, 5).map(([key]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.limits && (
                      <div className="pt-4 border-t border-slate-800 space-y-1 text-sm text-slate-400">
                        {plan.limits.max_jobs && <p>Up to {plan.limits.max_jobs === -1 ? 'Unlimited' : plan.limits.max_jobs} jobs</p>}
                        {plan.limits.max_users && <p>Up to {plan.limits.max_users === -1 ? 'Unlimited' : plan.limits.max_users} users</p>}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>Stripe: {plan.stripe_product_id ? '✓ Connected' : '✗ Not set'}</span>
                      <span className={plan.is_active ? 'text-emerald-400' : 'text-red-400'}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Plan Edit Modal */}
      {showModal && (
        <PlanEditModal
          plan={editingPlan}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchPlans(); }}
        />
      )}
    </div>
  );
};

// ===========================================
// PLAN EDIT MODAL
// ===========================================

const PlanEditModal = ({ plan, onClose, onSave }: { plan: SubscriptionPlan | null; onClose: () => void; onSave: () => void }) => {
  const [formData, setFormData] = useState({
    plan_key: '',
    name: plan?.name || '',
    description: plan?.description || '',
    target_type: plan?.target_type || plan?.stakeholder_type || 'employer',
    price_monthly: plan?.price_monthly || 0,
    price_annual: plan?.price_annual || 0,
    is_active: true,
    stripe_product_id: '',
    stripe_price_id_monthly: '',
    stripe_price_id_annual: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (plan) {
      await supabase.from('subscription_plans').update(formData).eq('id', plan.id);
    } else {
      await supabase.from('subscription_plans').insert(formData);
    }
    
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold">{plan ? 'Edit Plan' : 'Create Plan'}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Plan Key</label>
              <input
                type="text"
                value={formData.plan_key}
                onChange={(e) => setFormData({ ...formData, plan_key: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                placeholder="employer_starter"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                placeholder="Starter"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Type</label>
            <select
              value={formData.target_type}
              onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
            >
              <option value="employer">Employer</option>
              <option value="training_provider">Training Provider</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="government">Government</option>
              <option value="event_organizer">Event Organizer</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Price ($)</label>
              <input
                type="number"
                value={formData.price_monthly}
                onChange={(e) => setFormData({ ...formData, price_monthly: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Annual Price ($)</label>
              <input
                type="number"
                value={formData.price_annual}
                onChange={(e) => setFormData({ ...formData, price_annual: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-800">
            <h4 className="font-medium mb-3">Stripe Integration</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.stripe_product_id}
                onChange={(e) => setFormData({ ...formData, stripe_product_id: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                placeholder="Stripe Product ID (prod_xxx)"
              />
              <input
                type="text"
                value={formData.stripe_price_id_monthly}
                onChange={(e) => setFormData({ ...formData, stripe_price_id_monthly: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                placeholder="Stripe Monthly Price ID (price_xxx)"
              />
              <input
                type="text"
                value={formData.stripe_price_id_annual}
                onChange={(e) => setFormData({ ...formData, stripe_price_id_annual: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                placeholder="Stripe Annual Price ID (price_xxx)"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800"
            />
            <label htmlFor="is_active" className="text-sm">Active</label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
            >
              {plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===========================================
// INVOICES TAB
// ===========================================

const InvoicesTab = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*, subscriptions(subscription_plans(name))')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!error) setInvoices(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Invoices</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Invoice #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No invoices found</td></tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4 font-mono text-sm">{invoice.invoice_number || invoice.id.slice(0, 8)}</td>
                  <td className="px-4 py-4 text-sm">{invoice.subscription_id?.slice(0, 8)}...</td>
                  <td className="px-4 py-4 font-medium">${invoice.amount?.toLocaleString() || 0}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                      invoice.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===========================================
// ADD-ONS TAB
// ===========================================

const AddonsTab = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('addon_services')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!error) setAddons(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Add-on Services</h3>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium">
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400 col-span-full text-center py-8">Loading...</p>
        ) : addons.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center py-8">No add-ons configured</p>
        ) : (
          addons.map((addon) => (
            <div key={addon.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Zap size={20} className="text-violet-400" />
                </div>
                <span className={`px-2 py-1 rounded text-xs ${addon.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {addon.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h4 className="font-semibold">{addon.name}</h4>
              <p className="text-sm text-slate-400 mt-1">{addon.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xl font-bold">${addon.price}</span>
                <span className="text-sm text-slate-500">/{addon.billing_type || 'one-time'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===========================================
// STRIPE SETTINGS TAB
// ===========================================

const StripeSettingsTab = () => {
  // NOTE: Secret keys should NEVER be stored or handled in frontend
  // They should be configured via environment variables on the server
  const [settings, setSettings] = useState({
    stripe_publishable_key: '',
    // stripe_secret_key and stripe_webhook_secret must be set via:
    // 1. Supabase Edge Function environment variables
    // 2. Server-side .env file
    // NEVER expose these in frontend code
    test_mode: true,
    stripe_connected: false,
  });
  
  const [connectionStatus, setConnectionStatus] = useState('checking');
  
  useEffect(() => {
    // Check if Stripe is configured (without exposing secrets)
    checkStripeConnection();
  }, []);
  
  const checkStripeConnection = async () => {
    try {
      // Call a secure endpoint to check connection status
      const { data } = await supabase.functions.invoke('check-stripe-status');
      if (data?.connected) {
        setConnectionStatus('connected');
        setSettings(s => ({ ...s, stripe_connected: true }));
      } else {
        setConnectionStatus('not_configured');
      }
    } catch (err) {
      setConnectionStatus('error');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-violet-500/20">
            <CreditCard size={22} className="text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold">Stripe Configuration</h3>
            <p className="text-sm text-slate-400">Connect your Stripe account</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className={`p-4 rounded-lg mb-6 ${
          connectionStatus === 'connected' ? 'bg-emerald-500/20 border border-emerald-500/30' :
          connectionStatus === 'error' ? 'bg-red-500/20 border border-red-500/30' :
          'bg-amber-500/20 border border-amber-500/30'
        }`}>
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <>
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-emerald-400 font-medium">Stripe Connected</span>
              </>
            ) : connectionStatus === 'checking' ? (
              <>
                <RefreshCw size={18} className="text-amber-400 animate-spin" />
                <span className="text-amber-400">Checking connection...</span>
              </>
            ) : (
              <>
                <AlertCircle size={18} className="text-amber-400" />
                <span className="text-amber-400 font-medium">Stripe Not Configured</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="test_mode"
              checked={settings.test_mode}
              onChange={(e) => setSettings({ ...settings, test_mode: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800"
            />
            <label htmlFor="test_mode" className="text-sm">Test Mode</label>
            <span className="text-xs text-amber-400 ml-2">(Use test keys)</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Publishable Key</label>
            <input
              type="text"
              value={settings.stripe_publishable_key}
              onChange={(e) => setSettings({ ...settings, stripe_publishable_key: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm font-mono"
              placeholder="pk_test_..."
            />
            <p className="text-xs text-slate-500 mt-1">This is the only key safe for frontend use</p>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h4 className="font-medium text-amber-400 mb-2">⚠️ Secret Key Configuration</h4>
            <p className="text-sm text-slate-400 mb-2">
              For security, Stripe Secret Keys and Webhook Secrets must be configured server-side:
            </p>
            <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
              <li>Set <code className="text-emerald-400">STRIPE_SECRET_KEY</code> in Supabase Edge Function secrets</li>
              <li>Set <code className="text-emerald-400">STRIPE_WEBHOOK_SECRET</code> in Supabase Edge Function secrets</li>
              <li>Never expose secret keys in frontend code</li>
            </ul>
          </div>

          <button 
            onClick={async () => {
              // Save only the publishable key
              const { error } = await supabase.from('platform_settings').upsert({
                key: 'stripe_publishable_key',
                value: settings.stripe_publishable_key,
                updated_at: new Date().toISOString()
              });
              if (!error) {
                alert('Publishable key saved successfully');
              }
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors mt-4"
          >
            Save Publishable Key
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Webhook Endpoint</h3>
        <p className="text-sm text-slate-400 mb-3">Add this URL to your Stripe webhook settings:</p>
        <div className="p-3 bg-slate-800 rounded-lg font-mono text-sm break-all">
          {window.location.origin}/api/webhooks/stripe
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Events to enable: customer.subscription.created, customer.subscription.updated, 
          customer.subscription.deleted, invoice.paid, invoice.payment_failed
        </p>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Setup Instructions</h3>
        <ol className="text-sm text-slate-400 list-decimal list-inside space-y-2">
          <li>Create a Stripe account at <a href="https://stripe.com" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com</a></li>
          <li>Go to Developers → API Keys and copy your keys</li>
          <li>Enter your Publishable Key above</li>
          <li>In Supabase Dashboard → Edge Functions → Secrets, add:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><code className="text-emerald-400">STRIPE_SECRET_KEY</code></li>
              <li><code className="text-emerald-400">STRIPE_WEBHOOK_SECRET</code></li>
            </ul>
          </li>
          <li>Deploy the Edge Functions from your project</li>
          <li>Configure webhook endpoint in Stripe Dashboard</li>
        </ol>
      </div>
    </div>
  );
};

export default BillingDashboard;
