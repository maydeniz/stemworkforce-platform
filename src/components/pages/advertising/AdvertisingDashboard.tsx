import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Megaphone, BarChart3, Image, MousePointer, Eye, DollarSign,
  Plus, Edit, Play, Pause, Calendar, Target, Layers,
  TrendingUp, ArrowUpRight, ArrowDownRight, Search,
  Upload, Mail, CheckCircle2,
  Download
} from 'lucide-react';

// ===========================================
// ADVERTISING MANAGEMENT - COMPREHENSIVE
// ===========================================

interface AdStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
  ctr: string | number;
}

interface Campaign {
  id: string;
  campaign_name: string;
  campaign_type: string;
  status: string;
  budget_total?: number;
  spent_total?: number;
  total_impressions?: number;
  total_clicks?: number;
  advertisers?: { company_name: string } | null;
}

interface Creative {
  id: string;
  creative_name: string;
  ad_size: string;
  image_url?: string;
  is_active: boolean;
  impressions?: number;
  clicks?: number;
  ad_campaigns?: { campaign_name: string } | null;
}

interface Placement {
  id: string;
  name: string;
  placement_key: string;
  page_type: string;
  ad_sizes: string[];
  base_cpm: number;
  premium_multiplier?: number;
  is_active: boolean;
}

interface NewsletterAd {
  id: string;
  status: string;
  newsletter_type: string;
  emails_sent?: number;
  opens?: number;
  clicks?: number;
  scheduled_date?: string;
  price?: number;
  advertisers?: { company_name: string } | null;
}

interface Sponsorship {
  id: string;
  sponsorship_level: string;
  status: string;
  industry?: string;
  start_date?: string;
  end_date?: string;
  total_value?: number;
  advertisers?: { company_name: string } | null;
}

const AdvertisingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdStats | null>(null);

  useEffect(() => {
    fetchAdStats();
  }, []);

  const fetchAdStats = async () => {
    setLoading(true);
    try {
      const [campaigns, impressions, clicks] = await Promise.all([
        supabase.from('ad_campaigns').select('*', { count: 'exact' }),
        supabase.from('ad_impressions').select('cost', { count: 'exact' }),
        supabase.from('ad_clicks').select('cost', { count: 'exact' })
      ]);

      const activeCampaigns = campaigns.data?.filter(c => c.status === 'active') || [];
      const totalRevenue = impressions.data?.reduce((sum, i) => sum + (i.cost || 0), 0) || 0;
      const impressionCount = impressions.count ?? 0;
      const clickCount = clicks.count ?? 0;

      setStats({
        totalCampaigns: campaigns.count || 0,
        activeCampaigns: activeCampaigns.length,
        totalImpressions: impressionCount,
        totalClicks: clickCount,
        totalRevenue,
        ctr: impressionCount > 0 ? ((clickCount / impressionCount) * 100).toFixed(2) : 0
      });
    } catch (error) {
      console.error('Error fetching ad stats:', error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'creatives', label: 'Creatives', icon: Image },
    { id: 'placements', label: 'Placements', icon: Layers },
    { id: 'newsletter', label: 'Newsletter Ads', icon: Mail },
    { id: 'sponsorships', label: 'Sponsorships', icon: Target },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Advertising Management</h1>
        <p className="text-slate-400 mt-1">Manage campaigns, creatives, and ad performance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <AdOverview stats={stats} loading={loading} />}
      {activeTab === 'campaigns' && <CampaignsTab />}
      {activeTab === 'creatives' && <CreativesTab />}
      {activeTab === 'placements' && <PlacementsTab />}
      {activeTab === 'newsletter' && <NewsletterAdsTab />}
      {activeTab === 'sponsorships' && <SponsorshipsTab />}
      {activeTab === 'reports' && <AdReportsTab />}
    </div>
  );
};

// ===========================================
// AD OVERVIEW
// ===========================================

const AdOverview = ({ stats, loading }: { stats: AdStats | null; loading: boolean }) => {
  const metrics = [
    { label: 'Active Campaigns', value: stats?.activeCampaigns || 0, icon: Megaphone, color: 'amber', change: '+3', positive: true },
    { label: 'Total Impressions', value: stats?.totalImpressions || 0, format: 'number', icon: Eye, color: 'blue', change: '+24%', positive: true },
    { label: 'Total Clicks', value: stats?.totalClicks || 0, format: 'number', icon: MousePointer, color: 'emerald', change: '+18%', positive: true },
    { label: 'CTR', value: stats?.ctr || 0, format: 'percent', icon: Target, color: 'violet', change: '+0.3%', positive: true },
    { label: 'Ad Revenue', value: stats?.totalRevenue || 0, format: 'currency', icon: DollarSign, color: 'cyan', change: '+32%', positive: true },
    { label: 'Avg CPM', value: 28.50, format: 'currency', icon: TrendingUp, color: 'rose', change: '+$2.30', positive: true },
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
                metric.format === 'percent' ? `${metric.value}%` :
                metric.value.toLocaleString()
              }
            </p>
            <p className="text-sm text-slate-400 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Impressions & Clicks (Last 30 Days)</h3>
          <div className="h-64 flex items-end gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const impressions = Math.floor(Math.random() * 50) + 30;
              const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.02));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5" style={{ height: `${impressions}%` }}>
                    <div className="flex-1 bg-amber-500/60 rounded-t-sm" />
                    <div className="bg-emerald-500" style={{ height: `${(clicks / impressions) * 100}%`, minHeight: '2px' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500/60" />
              <span className="text-sm text-slate-400">Impressions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-sm text-slate-400">Clicks</span>
            </div>
          </div>
        </div>

        {/* Revenue by Placement */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Revenue by Placement</h3>
          <div className="space-y-4">
            {[
              { placement: 'Homepage Leaderboard', revenue: 4500, percent: 35, cpm: 32 },
              { placement: 'Job Search Sidebar', revenue: 3200, percent: 25, cpm: 28 },
              { placement: 'Industry Pages', revenue: 2800, percent: 22, cpm: 45 },
              { placement: 'Newsletter', revenue: 1500, percent: 12, cpm: 22 },
              { placement: 'Sponsored Jobs', revenue: 800, percent: 6, cpm: 18 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.placement}</span>
                  <span className="text-sm text-slate-400">${item.revenue} | ${item.cpm} CPM</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Advertisers */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Top Advertisers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Intel Corporation', spent: 8500, campaigns: 3, impressions: '245K' },
            { name: 'NVIDIA', spent: 6200, campaigns: 2, impressions: '189K' },
            { name: 'AWS', spent: 5400, campaigns: 4, impressions: '156K' },
            { name: 'Google Cloud', spent: 4800, campaigns: 2, impressions: '142K' },
          ].map((advertiser, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center font-bold">
                  {advertiser.name[0]}
                </div>
                <div>
                  <p className="font-medium">{advertiser.name}</p>
                  <p className="text-xs text-slate-400">{advertiser.campaigns} campaigns</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Spent</span>
                <span className="font-medium">${advertiser.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-400">Impressions</span>
                <span>{advertiser.impressions}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// CAMPAIGNS TAB
// ===========================================

const CampaignsTab = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const fetchCampaigns = async () => {
    setLoading(true);
    let query = supabase
      .from('ad_campaigns')
      .select('*, advertisers(company_name)')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error) setCampaigns(data || []);
    setLoading(false);
  };

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    await supabase.from('ad_campaigns').update({ status: newStatus }).eq('id', campaignId);
    fetchCampaigns();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          onClick={() => { setEditingCampaign(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          New Campaign
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Campaign</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Advertiser</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Budget</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Performance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : campaigns.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No campaigns found</td></tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium">{campaign.campaign_name}</p>
                    <p className="text-sm text-slate-400 capitalize">{campaign.campaign_type}</p>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {campaign.advertisers?.company_name || 'Unknown'}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">${campaign.budget_total?.toLocaleString() || 0}</p>
                    <p className="text-sm text-slate-400">
                      Spent: ${campaign.spent_total?.toLocaleString() || 0}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm">{campaign.total_impressions?.toLocaleString() || 0} impr</p>
                    <p className="text-sm text-slate-400">{campaign.total_clicks?.toLocaleString() || 0} clicks</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      campaign.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                      campaign.status === 'pending_review' ? 'bg-blue-500/20 text-blue-400' :
                      campaign.status === 'completed' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {campaign.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {campaign.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange(campaign.id, 'paused')}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-amber-400"
                          title="Pause"
                        >
                          <Pause size={16} />
                        </button>
                      ) : campaign.status === 'paused' ? (
                        <button
                          onClick={() => handleStatusChange(campaign.id, 'active')}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-emerald-400"
                          title="Resume"
                        >
                          <Play size={16} />
                        </button>
                      ) : campaign.status === 'pending_review' ? (
                        <button
                          onClick={() => handleStatusChange(campaign.id, 'active')}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-emerald-400"
                          title="Approve"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      ) : null}
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => { setEditingCampaign(campaign); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CampaignModal
          campaign={editingCampaign}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchCampaigns(); }}
        />
      )}
    </div>
  );
};

// ===========================================
// CAMPAIGN MODAL
// ===========================================

const CampaignModal = ({ campaign, onClose, onSave }: { campaign: Campaign | null; onClose: () => void; onSave: () => void }) => {
  const [formData, setFormData] = useState({
    campaign_name: campaign?.campaign_name || '',
    campaign_type: campaign?.campaign_type || 'banner',
    pricing_model: 'cpm',
    cpm_rate: 25,
    cpc_rate: 1,
    budget_type: 'total',
    budget_total: campaign?.budget_total || 1000,
    budget_daily: 50,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    target_industries: [] as string[],
    target_user_types: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (campaign) {
      await supabase.from('ad_campaigns').update(formData).eq('id', campaign.id);
    } else {
      await supabase.from('ad_campaigns').insert({
        ...formData,
        status: 'draft'
      });
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold">{campaign ? 'Edit Campaign' : 'Create Campaign'}</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <input
              type="text"
              value={formData.campaign_name}
              onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Type</label>
              <select
                value={formData.campaign_type}
                onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              >
                <option value="banner">Banner Ads</option>
                <option value="sponsored_job">Sponsored Jobs</option>
                <option value="industry_spotlight">Industry Spotlight</option>
                <option value="newsletter">Newsletter</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pricing Model</label>
              <select
                value={formData.pricing_model}
                onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              >
                <option value="cpm">CPM (Cost per 1000 Impressions)</option>
                <option value="cpc">CPC (Cost per Click)</option>
                <option value="flat_rate">Flat Rate</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            {formData.pricing_model === 'cpm' && (
              <div>
                <label className="block text-sm font-medium mb-2">CPM Rate ($)</label>
                <input
                  type="number"
                  value={formData.cpm_rate}
                  onChange={(e) => setFormData({ ...formData, cpm_rate: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                  step="0.01"
                  min="0"
                />
              </div>
            )}
            {formData.pricing_model === 'cpc' && (
              <div>
                <label className="block text-sm font-medium mb-2">CPC Rate ($)</label>
                <input
                  type="number"
                  value={formData.cpc_rate}
                  onChange={(e) => setFormData({ ...formData, cpc_rate: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                  step="0.01"
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Budget Type</label>
              <select
                value={formData.budget_type}
                onChange={(e) => setFormData({ ...formData, budget_type: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              >
                <option value="daily">Daily Budget</option>
                <option value="total">Total Budget</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {formData.budget_type === 'daily' ? 'Daily Budget ($)' : 'Total Budget ($)'}
              </label>
              <input
                type="number"
                value={formData.budget_type === 'daily' ? formData.budget_daily : formData.budget_total}
                onChange={(e) => setFormData({
                  ...formData,
                  [formData.budget_type === 'daily' ? 'budget_daily' : 'budget_total']: parseFloat(e.target.value)
                })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date (optional)</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Targeting */}
          <div>
            <label className="block text-sm font-medium mb-2">Target Industries</label>
            <div className="flex flex-wrap gap-2">
              {['semiconductor', 'quantum', 'ai_ml', 'clean_energy', 'biotech', 'aerospace', 'healthcare', 'cybersecurity'].map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => {
                    const industries = formData.target_industries.includes(industry)
                      ? formData.target_industries.filter((i: string) => i !== industry)
                      : [...formData.target_industries, industry];
                    setFormData({ ...formData, target_industries: industries });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                    formData.target_industries.includes(industry)
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {industry.replace('_', ' ')}
                </button>
              ))}
            </div>
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
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium transition-colors"
            >
              {campaign ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===========================================
// CREATIVES TAB
// ===========================================

const CreativesTab = () => {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreatives();
  }, []);

  const fetchCreatives = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ad_creatives')
      .select('*, ad_campaigns(campaign_name)')
      .order('created_at', { ascending: false });
    
    if (!error) setCreatives(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Ad Creatives</h3>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium">
          <Upload size={18} />
          Upload Creative
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400 col-span-full text-center py-8">Loading...</p>
        ) : creatives.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center py-8">No creatives found</p>
        ) : (
          creatives.map((creative) => (
            <div key={creative.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="h-40 bg-slate-800 flex items-center justify-center">
                {creative.image_url ? (
                  <img src={creative.image_url} alt={creative.creative_name} className="w-full h-full object-cover" />
                ) : (
                  <Image size={48} className="text-slate-600" />
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium">{creative.creative_name || 'Untitled'}</h4>
                <p className="text-sm text-slate-400">{creative.ad_campaigns?.campaign_name}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{creative.ad_size || 'Unknown size'}</span>
                  <span className={creative.is_active ? 'text-emerald-400' : 'text-slate-500'}>
                    {creative.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-sm">
                  <span>{creative.impressions?.toLocaleString() || 0} impr</span>
                  <span>{creative.clicks?.toLocaleString() || 0} clicks</span>
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
// PLACEMENTS TAB
// ===========================================

const PlacementsTab = () => {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ad_placements')
      .select('*')
      .order('base_cpm', { ascending: false });
    
    if (!error) setPlacements(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Ad Placements</h3>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium">
          <Plus size={18} />
          Add Placement
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Placement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Page</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Base CPM</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Multiplier</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : placements.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No placements found</td></tr>
            ) : (
              placements.map((placement) => (
                <tr key={placement.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium">{placement.name}</p>
                    <p className="text-sm text-slate-400">{placement.placement_key}</p>
                  </td>
                  <td className="px-4 py-4 text-sm capitalize">{placement.page_type}</td>
                  <td className="px-4 py-4 text-sm">{placement.ad_sizes?.join(', ') || '-'}</td>
                  <td className="px-4 py-4 font-medium">${placement.base_cpm}</td>
                  <td className="px-4 py-4 text-sm">{placement.premium_multiplier}x</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      placement.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {placement.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                      <Edit size={16} />
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
// NEWSLETTER ADS TAB
// ===========================================

const NewsletterAdsTab = () => {
  const [sponsorships, setSponsorships] = useState<NewsletterAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsletterSponsors();
  }, []);

  const fetchNewsletterSponsors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('newsletter_sponsorships')
      .select('*, advertisers(company_name)')
      .order('scheduled_date', { ascending: false });
    
    if (!error) setSponsorships(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Newsletter Sponsorships</h3>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium">
          <Plus size={18} />
          Schedule Sponsorship
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400 col-span-full text-center py-8">Loading...</p>
        ) : sponsorships.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center py-8">No newsletter sponsorships found</p>
        ) : (
          sponsorships.map((sponsor) => (
            <div key={sponsor.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Mail size={20} className="text-amber-400" />
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  sponsor.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' :
                  sponsor.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {sponsor.status}
                </span>
              </div>
              <h4 className="font-medium">{sponsor.advertisers?.company_name}</h4>
              <p className="text-sm text-slate-400 capitalize">{sponsor.newsletter_type?.replace('_', ' ')}</p>
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-slate-500">Sent</p>
                  <p className="font-medium">{sponsor.emails_sent?.toLocaleString() || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Opens</p>
                  <p className="font-medium">{sponsor.opens?.toLocaleString() || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Clicks</p>
                  <p className="font-medium">{sponsor.clicks?.toLocaleString() || '-'}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  <Calendar size={14} className="inline mr-1" />
                  {sponsor.scheduled_date}
                </span>
                <span className="font-medium">${sponsor.price}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===========================================
// SPONSORSHIPS TAB
// ===========================================

const SponsorshipsTab = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('industry_sponsorships')
      .select('*, advertisers(company_name)')
      .order('start_date', { ascending: false });
    
    if (!error) setSponsorships(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Industry Sponsorships</h3>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium">
          <Plus size={18} />
          New Sponsorship
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-slate-400 col-span-full text-center py-8">Loading...</p>
        ) : sponsorships.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center py-8">No sponsorships found</p>
        ) : (
          sponsorships.map((sponsor) => (
            <div key={sponsor.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    sponsor.sponsorship_level === 'presenting' ? 'bg-amber-500/20 text-amber-400' :
                    sponsor.sponsorship_level === 'premier' ? 'bg-violet-500/20 text-violet-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {sponsor.sponsorship_level} sponsor
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  sponsor.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {sponsor.status}
                </span>
              </div>
              <h4 className="font-semibold text-lg">{sponsor.advertisers?.company_name}</h4>
              <p className="text-slate-400 capitalize">{sponsor.industry?.replace('_', ' ')} Industry</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
                <div>
                  <p className="text-sm text-slate-500">Period</p>
                  <p className="font-medium">{sponsor.start_date} - {sponsor.end_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Value</p>
                  <p className="font-medium">${sponsor.total_value?.toLocaleString()}</p>
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
// REPORTS TAB
// ===========================================

const AdReportsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Advertising Reports</h3>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-medium mb-4">Campaign Performance Report</h4>
          <p className="text-sm text-slate-400 mb-4">Detailed metrics for all campaigns including impressions, clicks, CTR, and revenue.</p>
          <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
            Generate Report
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-medium mb-4">Advertiser Summary</h4>
          <p className="text-sm text-slate-400 mb-4">Summary of all advertiser accounts, spend, and campaign activity.</p>
          <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
            Generate Report
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-medium mb-4">Revenue Analysis</h4>
          <p className="text-sm text-slate-400 mb-4">Revenue breakdown by placement, industry, and time period.</p>
          <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingDashboard;
