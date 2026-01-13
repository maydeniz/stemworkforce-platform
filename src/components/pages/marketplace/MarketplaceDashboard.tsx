import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  ShoppingCart, Star, Users, Package, DollarSign,
  Plus, Edit, Eye, Search, Download,
  TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle2,
  XCircle, Clock, MessageSquare, Award, BookOpen,
  FileText, Video, UserCheck, Settings, Tag
} from 'lucide-react';

// ===========================================
// MARKETPLACE - COMPREHENSIVE VERSION
// ===========================================

interface MarketplaceStats {
  totalProviders: number;
  activeProviders: number;
  totalServices: number;
  totalPurchases: number;
  totalRevenue: number;
  avgRating: number | string;
  totalReviews: number;
}

interface MarketplaceProvider {
  id: string;
  status: string;
  provider_type: string;
  specializations: string[];
  average_rating: number;
  total_reviews: number;
  total_sales: number;
  total_earnings: number;
  bio: string;
  users?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

interface MarketplaceService {
  id: string;
  service_name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  marketplace_categories?: {
    name: string;
  };
}

interface MarketplaceReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  status: string;
  provider_id: string;
  marketplace_providers?: {
    users?: {
      full_name?: string;
    };
  };
  users?: {
    full_name?: string;
  };
}

interface MarketplacePurchase {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  marketplace_services?: {
    service_name: string;
  };
  marketplace_providers?: {
    users?: {
      full_name?: string;
    };
  };
  users?: {
    full_name?: string;
  };
}

// Extended interfaces for components with additional fetched fields
interface ExtendedMarketplaceService extends MarketplaceService {
  delivery_method?: string;
  total_purchases?: number;
  marketplace_providers?: {
    users?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

interface MarketplaceCategory {
  id: string;
  category_key: string;
  name: string;
  description: string;
  commission_rate: number;
  is_active: boolean;
  display_order?: number;
  service_count?: number;
}

interface ExtendedMarketplacePurchase extends MarketplacePurchase {
  buyer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

interface ExtendedMarketplaceReview extends MarketplaceReview {
  reviewer?: {
    first_name?: string;
    last_name?: string;
  };
  marketplace_services?: {
    service_name: string;
  };
  review_text?: string;
}

interface ProviderPayout {
  id: string;
  amount: number;
  status: string;
  payout_method?: string;
  created_at: string;
  marketplace_providers?: {
    users?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

const MarketplaceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);

  useEffect(() => {
    fetchMarketplaceStats();
  }, []);

  const fetchMarketplaceStats = async () => {
    setLoading(true);
    try {
      const [providers, services, purchases, reviews] = await Promise.all([
        supabase.from('marketplace_providers').select('*', { count: 'exact' }),
        supabase.from('marketplace_services').select('*', { count: 'exact' }),
        supabase.from('marketplace_purchases').select('amount', { count: 'exact' }),
        supabase.from('marketplace_reviews').select('rating', { count: 'exact' })
      ]);

      const totalRevenue = purchases.data?.reduce((sum: number, p: { amount?: number }) => sum + (p.amount || 0), 0) || 0;
      const avgRating = reviews.data && reviews.data.length > 0
        ? (reviews.data.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.data.length).toFixed(1)
        : 0;

      setStats({
        totalProviders: providers.count || 0,
        activeProviders: providers.data?.filter(p => p.status === 'active').length || 0,
        totalServices: services.count || 0,
        totalPurchases: purchases.count || 0,
        totalRevenue,
        avgRating,
        totalReviews: reviews.count || 0
      });
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'providers', label: 'Service Providers', icon: Users },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'payouts', label: 'Payouts', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Marketplace Management</h1>
        <p className="text-slate-400 mt-1">Manage services, providers, and transactions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <MarketplaceOverview stats={stats} loading={loading} />}
      {activeTab === 'providers' && <ProvidersTab />}
      {activeTab === 'services' && <ServicesTab />}
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'reviews' && <ReviewsTab />}
      {activeTab === 'payouts' && <PayoutsTab />}
      {activeTab === 'settings' && <MarketplaceSettingsTab />}
    </div>
  );
};

// ===========================================
// MARKETPLACE OVERVIEW
// ===========================================

const MarketplaceOverview = ({ stats, loading }: { stats: MarketplaceStats | null; loading: boolean }) => {
  const metrics = [
    { label: 'Active Providers', value: stats?.activeProviders || 0, icon: Users, color: 'violet', change: '+8', positive: true },
    { label: 'Total Services', value: stats?.totalServices || 0, icon: Package, color: 'blue', change: '+15', positive: true },
    { label: 'Purchases', value: stats?.totalPurchases || 0, icon: ShoppingCart, color: 'emerald', change: '+42%', positive: true },
    { label: 'Revenue', value: stats?.totalRevenue || 0, format: 'currency', icon: DollarSign, color: 'amber', change: '+28%', positive: true },
    { label: 'Avg Rating', value: stats?.avgRating || 0, icon: Star, color: 'yellow', change: '+0.2', positive: true },
    { label: 'Total Reviews', value: stats?.totalReviews || 0, icon: MessageSquare, color: 'cyan', change: '+67', positive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg bg-${metric.color}-500/20`}>
                <metric.icon size={20} className={`text-${metric.color}-400`} />
              </div>
              <span className={`flex items-center gap-1 text-sm ${metric.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {metric.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold">
              {loading ? '...' :
                metric.format === 'currency' ? `$${metric.value.toLocaleString()}` :
                metric.value.toLocaleString()
              }
            </p>
            <p className="text-sm text-slate-400 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Revenue by Category</h3>
          <div className="space-y-4">
            {[
              { category: 'Career Coaching', revenue: 12500, percent: 35, color: 'violet' },
              { category: 'Resume Services', revenue: 8900, percent: 25, color: 'blue' },
              { category: 'Interview Prep', revenue: 7100, percent: 20, color: 'emerald' },
              { category: 'Skills Training', revenue: 4300, percent: 12, color: 'amber' },
              { category: 'Mentorship', revenue: 2900, percent: 8, color: 'cyan' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-slate-400">${item.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${item.color}-500 rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Top Providers</h3>
          <div className="space-y-3">
            {[
              { name: 'Sarah Johnson', specialty: 'Executive Coaching', rating: 4.9, sales: 156, revenue: 8500 },
              { name: 'Michael Chen', specialty: 'Resume Writing', rating: 4.8, sales: 234, revenue: 7200 },
              { name: 'Emily Davis', specialty: 'Tech Interview Prep', rating: 4.9, sales: 89, revenue: 5400 },
              { name: 'James Wilson', specialty: 'Career Transition', rating: 4.7, sales: 67, revenue: 4100 },
              { name: 'Lisa Brown', specialty: 'LinkedIn Optimization', rating: 4.8, sales: 145, revenue: 3600 },
            ].map((provider, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm">
                    {provider.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-sm text-slate-400">{provider.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-medium">{provider.rating}</span>
                  </div>
                  <p className="text-sm text-slate-400">{provider.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Recent Purchases</h3>
        <div className="space-y-3">
          {[
            { buyer: 'John Doe', service: '1-Hour Career Coaching', provider: 'Sarah Johnson', amount: 150, time: '5 min ago' },
            { buyer: 'Jane Smith', service: 'Executive Resume Package', provider: 'Michael Chen', amount: 299, time: '23 min ago' },
            { buyer: 'Robert Kim', service: 'Mock Technical Interview', provider: 'Emily Davis', amount: 75, time: '1 hour ago' },
            { buyer: 'Amanda Lee', service: 'LinkedIn Profile Review', provider: 'Lisa Brown', amount: 49, time: '2 hours ago' },
          ].map((purchase, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <ShoppingCart size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">{purchase.service}</p>
                  <p className="text-sm text-slate-400">{purchase.buyer} → {purchase.provider}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-emerald-400">${purchase.amount}</p>
                <p className="text-xs text-slate-500">{purchase.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// PROVIDERS TAB
// ===========================================

const ProvidersTab = () => {
  const [providers, setProviders] = useState<MarketplaceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<MarketplaceProvider | null>(null);

  useEffect(() => {
    fetchProviders();
  }, [statusFilter]);

  const fetchProviders = async () => {
    setLoading(true);
    let query = supabase
      .from('marketplace_providers')
      .select('*, users(first_name, last_name, email)')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error) setProviders(data || []);
    setLoading(false);
  };

  const handleApprove = async (providerId: string) => {
    await supabase
      .from('marketplace_providers')
      .update({ status: 'active', approved_at: new Date().toISOString() })
      .eq('id', providerId);
    fetchProviders();
  };

  const handleSuspend = async (providerId: string) => {
    await supabase
      .from('marketplace_providers')
      .update({ status: 'suspended' })
      .eq('id', providerId);
    fetchProviders();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search providers..."
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium">
          <Plus size={18} />
          Add Provider
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Provider</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Specialty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Sales</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : providers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No providers found</td></tr>
            ) : (
              providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm">
                        {provider.users?.first_name?.[0]}{provider.users?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">{provider.users?.first_name} {provider.users?.last_name}</p>
                        <p className="text-sm text-slate-400">{provider.users?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium capitalize">{provider.provider_type?.replace('_', ' ')}</p>
                    <p className="text-sm text-slate-400">{provider.specializations?.slice(0, 2).join(', ')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-medium">{provider.average_rating?.toFixed(1) || '-'}</span>
                      <span className="text-slate-400 text-sm">({provider.total_reviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{provider.total_sales || 0}</p>
                    <p className="text-sm text-slate-400">${provider.total_earnings?.toLocaleString() || 0}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      provider.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      provider.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedProvider(provider); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      {provider.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(provider.id)}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-emerald-400"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                      {provider.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(provider.id)}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-red-400"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Provider Detail Modal */}
      {showModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Provider Details</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-2xl">
                  {selectedProvider.users?.first_name?.[0]}{selectedProvider.users?.last_name?.[0]}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{selectedProvider.users?.first_name} {selectedProvider.users?.last_name}</h4>
                  <p className="text-slate-400 capitalize">{selectedProvider.provider_type?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold">{selectedProvider.average_rating?.toFixed(1) || '-'}</p>
                  <p className="text-sm text-slate-400">Rating</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold">{selectedProvider.total_reviews || 0}</p>
                  <p className="text-sm text-slate-400">Reviews</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold">{selectedProvider.total_sales || 0}</p>
                  <p className="text-sm text-slate-400">Sales</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold">${selectedProvider.total_earnings?.toLocaleString() || 0}</p>
                  <p className="text-sm text-slate-400">Earnings</p>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Bio</h5>
                <p className="text-slate-400 text-sm">{selectedProvider.bio || 'No bio provided'}</p>
              </div>

              <div>
                <h5 className="font-medium mb-2">Specializations</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.specializations?.map((spec: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium transition-colors">
                  View Services
                </button>
                <button className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors">
                  Message Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// SERVICES TAB
// ===========================================

const ServicesTab = () => {
  const [services, setServices] = useState<ExtendedMarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchServices();
  }, [categoryFilter]);

  const fetchServices = async () => {
    setLoading(true);
    let query = supabase
      .from('marketplace_services')
      .select('*, marketplace_providers(users(first_name, last_name)), marketplace_categories(name)')
      .order('created_at', { ascending: false });

    if (categoryFilter !== 'all') {
      query = query.eq('category_id', categoryFilter);
    }

    const { data, error } = await query;
    if (!error) setServices(data || []);
    setLoading(false);
  };

  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    await supabase
      .from('marketplace_services')
      .update({ is_active: !currentStatus })
      .eq('id', serviceId);
    fetchServices();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm w-64"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            <option value="coaching">Career Coaching</option>
            <option value="resume">Resume Services</option>
            <option value="interview">Interview Prep</option>
            <option value="training">Skills Training</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400 col-span-full text-center py-8">Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center py-8">No services found</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-violet-600 to-fuchsia-600 relative">
                <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                  service.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-black/30 backdrop-blur rounded text-xs">
                    {service.marketplace_categories?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-1">{service.service_name}</h4>
                <p className="text-sm text-slate-400 line-clamp-2">{service.description}</p>
                
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {service.duration_minutes || 60} min
                  </span>
                  <span>•</span>
                  <span className="capitalize">{service.delivery_method || 'Video Call'}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold">${service.price}</p>
                    <p className="text-xs text-slate-500">{service.total_purchases || 0} purchases</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(service.id, service.is_active)}
                      className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${
                        service.is_active ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {service.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===========================================
// CATEGORIES TAB
// ===========================================

const CategoriesTab = () => {
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MarketplaceCategory | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('marketplace_categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!error) setCategories(data || []);
    setLoading(false);
  };

  const categoryIcons: Record<string, typeof UserCheck> = {
    career_coaching: UserCheck,
    resume_services: FileText,
    interview_prep: Video,
    skills_training: BookOpen,
    mentorship: Users,
    linkedin_optimization: Award,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Service Categories</h3>
        <button
          onClick={() => { setEditingCategory(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400 col-span-full text-center py-8">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center py-8">No categories found</p>
        ) : (
          categories.map((category) => {
            const Icon = categoryIcons[category.category_key] || Package;
            return (
              <div key={category.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-violet-500/20">
                    <Icon size={24} className="text-violet-400" />
                  </div>
                  <button
                    onClick={() => { setEditingCategory(category); setShowModal(true); }}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                </div>
                <h4 className="font-semibold text-lg">{category.name}</h4>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{category.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-sm">
                  <span className="text-slate-400">{category.service_count || 0} services</span>
                  <span className={category.is_active ? 'text-emerald-400' : 'text-slate-500'}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  Commission: {category.commission_rate || 15}%
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Category Edit Modal */}
      {showModal && (
        <CategoryEditModal
          category={editingCategory}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchCategories(); }}
        />
      )}
    </div>
  );
};

interface CategoryEditModalProps {
  category: MarketplaceCategory | null;
  onClose: () => void;
  onSave: () => void;
}

const CategoryEditModal = ({ category, onClose, onSave }: CategoryEditModalProps) => {
  const [formData, setFormData] = useState({
    category_key: category?.category_key || '',
    name: category?.name || '',
    description: category?.description || '',
    commission_rate: category?.commission_rate || 15,
    is_active: category?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      await supabase.from('marketplace_categories').update(formData).eq('id', category.id);
    } else {
      await supabase.from('marketplace_categories').insert(formData);
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold">{category ? 'Edit Category' : 'Add Category'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category Key</label>
            <input
              type="text"
              value={formData.category_key}
              onChange={(e) => setFormData({ ...formData, category_key: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              placeholder="career_coaching"
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
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Commission Rate (%)</label>
            <input
              type="number"
              value={formData.commission_rate}
              onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              min="0"
              max="100"
              step="0.5"
            />
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
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium transition-colors"
            >
              {category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===========================================
// ORDERS TAB
// ===========================================

const OrdersTab = () => {
  const [orders, setOrders] = useState<ExtendedMarketplacePurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from('marketplace_purchases')
      .select(`
        *,
        marketplace_services(service_name),
        buyer:users!marketplace_purchases_buyer_id_fkey(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
          <Download size={16} />
          Export Orders
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Order #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No orders found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{order.buyer?.first_name} {order.buyer?.last_name}</p>
                    <p className="text-sm text-slate-400">{order.buyer?.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm">{order.marketplace_services?.service_name}</td>
                  <td className="px-4 py-4 font-medium">${order.amount?.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      order.status === 'refunded' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                      <Eye size={16} />
                    </button>
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
// REVIEWS TAB
// ===========================================

const ReviewsTab = () => {
  const [reviews, setReviews] = useState<ExtendedMarketplaceReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('marketplace_reviews')
      .select(`
        *,
        reviewer:users!marketplace_reviews_reviewer_id_fkey(first_name, last_name),
        marketplace_services(service_name)
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!error) setReviews(data || []);
    setLoading(false);
  };

  const handleApproveReview = async (reviewId: string) => {
    await supabase.from('marketplace_reviews').update({ status: 'approved' }).eq('id', reviewId);
    fetchReviews();
  };

  const handleRejectReview = async (reviewId: string) => {
    await supabase.from('marketplace_reviews').update({ status: 'rejected' }).eq('id', reviewId);
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <div className="flex gap-3">
          <select className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm">
            <option value="all">All Reviews</option>
            <option value="pending">Pending Moderation</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-400 text-center py-8">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No reviews found</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm">
                    {review.reviewer?.first_name?.[0]}{review.reviewer?.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">{review.reviewer?.first_name} {review.reviewer?.last_name}</p>
                    <p className="text-sm text-slate-400">{review.marketplace_services?.service_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                      />
                    ))}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    review.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                    review.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-slate-300">{review.review_text}</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
                {review.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveReview(review.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectReview(review.id)}
                      className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===========================================
// PAYOUTS TAB
// ===========================================

const PayoutsTab = () => {
  const [payouts, setPayouts] = useState<ProviderPayout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('provider_payouts')
      .select('*, marketplace_providers(users(first_name, last_name))')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!error) setPayouts(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Pending Payouts</p>
          <p className="text-2xl font-bold mt-2">$4,250</p>
          <p className="text-sm text-amber-400 mt-1">12 providers</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">This Month Paid</p>
          <p className="text-2xl font-bold mt-2">$28,500</p>
          <p className="text-sm text-emerald-400 mt-1">45 payouts</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Platform Commission</p>
          <p className="text-2xl font-bold mt-2">$5,025</p>
          <p className="text-sm text-slate-400 mt-1">15% avg rate</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Failed Payouts</p>
          <p className="text-2xl font-bold mt-2">$320</p>
          <p className="text-sm text-red-400 mt-1">2 failed</p>
        </div>
      </div>

      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Recent Payouts</h3>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium">
          <DollarSign size={18} />
          Process Pending
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Provider</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Method</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : payouts.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No payouts found</td></tr>
            ) : (
              payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium">
                      {payout.marketplace_providers?.users?.first_name} {payout.marketplace_providers?.users?.last_name}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-medium">${payout.amount?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm capitalize">{payout.payout_method || 'Stripe'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      payout.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      payout.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      payout.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {new Date(payout.created_at).toLocaleDateString()}
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
// MARKETPLACE SETTINGS TAB
// ===========================================

const MarketplaceSettingsTab = () => {
  const [settings, setSettings] = useState({
    default_commission_rate: 15,
    min_payout_amount: 50,
    payout_schedule: 'weekly',
    auto_approve_providers: false,
    auto_approve_reviews: false,
    require_verification: true,
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-6">Marketplace Configuration</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Default Commission Rate (%)</label>
            <input
              type="number"
              value={settings.default_commission_rate}
              onChange={(e) => setSettings({ ...settings, default_commission_rate: parseFloat(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              min="0"
              max="50"
              step="0.5"
            />
            <p className="text-xs text-slate-500 mt-1">Platform fee taken from each transaction</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Minimum Payout Amount ($)</label>
            <input
              type="number"
              value={settings.min_payout_amount}
              onChange={(e) => setSettings({ ...settings, min_payout_amount: parseFloat(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payout Schedule</label>
            <select
              value={settings.payout_schedule}
              onChange={(e) => setSettings({ ...settings, payout_schedule: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-6">Moderation Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-800">
            <div>
              <p className="font-medium">Auto-approve Providers</p>
              <p className="text-sm text-slate-400">Skip manual review for new providers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auto_approve_providers}
                onChange={(e) => setSettings({ ...settings, auto_approve_providers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-800">
            <div>
              <p className="font-medium">Auto-approve Reviews</p>
              <p className="text-sm text-slate-400">Publish reviews without moderation</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auto_approve_reviews}
                onChange={(e) => setSettings({ ...settings, auto_approve_reviews: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Require Provider Verification</p>
              <p className="text-sm text-slate-400">Providers must verify identity before selling</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.require_verification}
                onChange={(e) => setSettings({ ...settings, require_verification: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
            </label>
          </div>
        </div>
      </div>

      <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium transition-colors">
        Save Settings
      </button>
    </div>
  );
};

export default MarketplaceDashboard;
