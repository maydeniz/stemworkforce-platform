// @ts-nocheck
// ===========================================
// Marketplace Providers Tab Component
// Service Provider Management for Admin
// ===========================================

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  ExternalLink,
  MoreVertical,
  UserCheck,
  UserX,
  Ban,
  RefreshCw,
  Download,
  Shield,
  TrendingUp,
  MessageSquare,
  X,
  ChevronDown,
} from 'lucide-react';

// Provider categories
const PROVIDER_CATEGORIES = [
  { id: 'all', label: 'All Providers' },
  { id: 'career_coaching', label: 'Career Coaching', color: 'violet' },
  { id: 'resume_services', label: 'Resume Services', color: 'blue' },
  { id: 'interview_prep', label: 'Interview Preparation', color: 'emerald' },
  { id: 'executive_coaching', label: 'Executive Coaching', color: 'amber' },
  { id: 'ai_transformation', label: 'AI Transformation', color: 'cyan' },
  { id: 'leadership_development', label: 'Leadership Development', color: 'pink' },
  { id: 'federal_consulting', label: 'Federal/Government', color: 'slate' },
  { id: 'stem_education', label: 'STEM Education', color: 'indigo' },
];

// Provider status options
const STATUS_OPTIONS = [
  { id: 'all', label: 'All Status' },
  { id: 'active', label: 'Active', color: 'emerald' },
  { id: 'pending', label: 'Pending Approval', color: 'amber' },
  { id: 'suspended', label: 'Suspended', color: 'red' },
  { id: 'inactive', label: 'Inactive', color: 'slate' },
];

// Sample provider data
const sampleProviders = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 123-4567',
    avatar_url: null,
    bio: 'Executive coach with 15+ years experience in tech leadership development.',
    category: 'executive_coaching',
    specializations: ['Tech Leadership', 'Career Transitions', 'C-Suite Coaching'],
    hourly_rate: 250,
    rating: 4.9,
    review_count: 127,
    total_bookings: 342,
    total_earnings: 85500,
    status: 'active',
    is_verified: true,
    is_featured: true,
    created_at: '2024-06-15T10:00:00Z',
    last_active_at: '2025-01-18T14:30:00Z',
    location: 'San Francisco, CA',
    stripe_connected: true,
  },
  {
    id: '2',
    user_id: 'user-2',
    name: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    phone: '+1 (555) 234-5678',
    avatar_url: null,
    bio: 'AI transformation consultant helping organizations adopt machine learning.',
    category: 'ai_transformation',
    specializations: ['AI Strategy', 'ML Implementation', 'Data Science'],
    hourly_rate: 300,
    rating: 4.8,
    review_count: 89,
    total_bookings: 156,
    total_earnings: 46800,
    status: 'active',
    is_verified: true,
    is_featured: false,
    created_at: '2024-08-20T10:00:00Z',
    last_active_at: '2025-01-17T09:15:00Z',
    location: 'Austin, TX',
    stripe_connected: true,
  },
  {
    id: '3',
    user_id: 'user-3',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    phone: '+1 (555) 345-6789',
    avatar_url: null,
    bio: 'Professional resume writer with expertise in STEM and federal positions.',
    category: 'resume_services',
    specializations: ['Federal Resumes', 'Technical Writing', 'LinkedIn Optimization'],
    hourly_rate: 150,
    rating: 4.7,
    review_count: 234,
    total_bookings: 567,
    total_earnings: 85050,
    status: 'active',
    is_verified: true,
    is_featured: true,
    created_at: '2024-03-10T10:00:00Z',
    last_active_at: '2025-01-18T11:45:00Z',
    location: 'Washington, DC',
    stripe_connected: true,
  },
  {
    id: '4',
    user_id: 'user-4',
    name: 'David Park',
    email: 'david.park@example.com',
    phone: '+1 (555) 456-7890',
    avatar_url: null,
    bio: 'Career coach specializing in STEM career transitions and interview prep.',
    category: 'career_coaching',
    specializations: ['STEM Careers', 'Career Pivots', 'Salary Negotiation'],
    hourly_rate: 175,
    rating: 4.6,
    review_count: 156,
    total_bookings: 289,
    total_earnings: 50575,
    status: 'pending',
    is_verified: false,
    is_featured: false,
    created_at: '2025-01-10T10:00:00Z',
    last_active_at: '2025-01-15T16:20:00Z',
    location: 'Seattle, WA',
    stripe_connected: false,
  },
  {
    id: '5',
    user_id: 'user-5',
    name: 'Jennifer Williams',
    email: 'jennifer.w@example.com',
    phone: '+1 (555) 567-8901',
    avatar_url: null,
    bio: 'Leadership development specialist with Fortune 500 experience.',
    category: 'leadership_development',
    specializations: ['Team Building', 'Executive Presence', 'Change Management'],
    hourly_rate: 275,
    rating: 4.9,
    review_count: 98,
    total_bookings: 187,
    total_earnings: 51425,
    status: 'active',
    is_verified: true,
    is_featured: false,
    created_at: '2024-05-22T10:00:00Z',
    last_active_at: '2025-01-18T08:00:00Z',
    location: 'New York, NY',
    stripe_connected: true,
  },
  {
    id: '6',
    user_id: 'user-6',
    name: 'Robert Thompson',
    email: 'robert.t@example.com',
    phone: '+1 (555) 678-9012',
    avatar_url: null,
    bio: 'Federal hiring expert and security clearance specialist.',
    category: 'federal_consulting',
    specializations: ['Federal Hiring', 'Clearance Process', 'GS Position Strategy'],
    hourly_rate: 200,
    rating: 4.5,
    review_count: 67,
    total_bookings: 134,
    total_earnings: 26800,
    status: 'suspended',
    is_verified: true,
    is_featured: false,
    created_at: '2024-04-18T10:00:00Z',
    last_active_at: '2025-01-05T12:30:00Z',
    location: 'Arlington, VA',
    stripe_connected: true,
  },
  {
    id: '7',
    user_id: 'user-7',
    name: 'Dr. Michael Torres',
    email: 'michael.torres@example.com',
    phone: '+1 (555) 789-0123',
    avatar_url: null,
    bio: 'STEM education consultant specializing in curriculum development and workforce readiness programs.',
    category: 'stem_education',
    specializations: ['Curriculum Design', 'STEM Workforce Development', 'Educational Technology'],
    hourly_rate: 185,
    rating: 4.8,
    review_count: 142,
    total_bookings: 278,
    total_earnings: 51430,
    status: 'active',
    is_verified: true,
    is_featured: true,
    created_at: '2024-02-28T10:00:00Z',
    last_active_at: '2025-01-18T15:20:00Z',
    location: 'Boston, MA',
    stripe_connected: true,
  },
  {
    id: '8',
    user_id: 'user-8',
    name: 'Amanda Foster',
    email: 'amanda.f@example.com',
    phone: '+1 (555) 890-1234',
    avatar_url: null,
    bio: 'Interview preparation expert with 10+ years helping candidates land roles at FAANG companies.',
    category: 'interview_prep',
    specializations: ['Technical Interviews', 'Behavioral Coaching', 'Mock Interviews'],
    hourly_rate: 195,
    rating: 4.9,
    review_count: 312,
    total_bookings: 645,
    total_earnings: 125775,
    status: 'active',
    is_verified: true,
    is_featured: true,
    created_at: '2023-11-15T10:00:00Z',
    last_active_at: '2025-01-18T16:45:00Z',
    location: 'Palo Alto, CA',
    stripe_connected: true,
  },
  {
    id: '9',
    user_id: 'user-9',
    name: 'James Mitchell',
    email: 'james.m@example.com',
    phone: '+1 (555) 901-2345',
    avatar_url: null,
    bio: 'Career coach focused on helping veterans transition to civilian tech careers.',
    category: 'career_coaching',
    specializations: ['Veteran Transitions', 'Tech Career Paths', 'Skills Translation'],
    hourly_rate: 165,
    rating: 4.7,
    review_count: 189,
    total_bookings: 356,
    total_earnings: 58740,
    status: 'active',
    is_verified: true,
    is_featured: false,
    created_at: '2024-01-20T10:00:00Z',
    last_active_at: '2025-01-17T14:10:00Z',
    location: 'San Diego, CA',
    stripe_connected: true,
  },
  {
    id: '10',
    user_id: 'user-10',
    name: 'Dr. Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+1 (555) 012-3456',
    avatar_url: null,
    bio: 'AI/ML transformation consultant with expertise in healthcare and manufacturing automation.',
    category: 'ai_transformation',
    specializations: ['Healthcare AI', 'Manufacturing Automation', 'AI Ethics'],
    hourly_rate: 350,
    rating: 4.9,
    review_count: 76,
    total_bookings: 124,
    total_earnings: 43400,
    status: 'active',
    is_verified: true,
    is_featured: true,
    created_at: '2024-07-08T10:00:00Z',
    last_active_at: '2025-01-18T10:30:00Z',
    location: 'Chicago, IL',
    stripe_connected: true,
  },
  {
    id: '11',
    user_id: 'user-11',
    name: 'Lisa Chang',
    email: 'lisa.chang@example.com',
    phone: '+1 (555) 123-7890',
    avatar_url: null,
    bio: 'Executive resume specialist serving C-level professionals and senior leaders.',
    category: 'resume_services',
    specializations: ['Executive Resumes', 'Board Profiles', 'Personal Branding'],
    hourly_rate: 225,
    rating: 4.8,
    review_count: 167,
    total_bookings: 412,
    total_earnings: 92700,
    status: 'pending',
    is_verified: false,
    is_featured: false,
    created_at: '2025-01-05T10:00:00Z',
    last_active_at: '2025-01-18T09:00:00Z',
    location: 'Denver, CO',
    stripe_connected: false,
  },
];

const MarketplaceProvidersTab: React.FC = () => {
  const [providers, setProviders] = useState(sampleProviders);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Filter providers
  const filteredProviders = providers.filter((provider) => {
    if (categoryFilter !== 'all' && provider.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && provider.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        provider.name.toLowerCase().includes(query) ||
        provider.email.toLowerCase().includes(query) ||
        provider.specializations.some((s) => s.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Stats
  const activeProviders = providers.filter((p) => p.status === 'active').length;
  const pendingProviders = providers.filter((p) => p.status === 'pending').length;
  const totalEarnings = providers.reduce((sum, p) => sum + p.total_earnings, 0);
  const avgRating = providers.length > 0
    ? (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      case 'inactive': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = PROVIDER_CATEGORIES.find((c) => c.id === category);
    if (!cat || !cat.color) return 'bg-slate-500/20 text-slate-400';
    return `bg-${cat.color}-500/20 text-${cat.color}-400`;
  };

  const handleApprove = (providerId: string) => {
    setProviders(providers.map(p =>
      p.id === providerId ? { ...p, status: 'active', is_verified: true } : p
    ));
    setShowActionMenu(null);
  };

  const handleSuspend = (providerId: string) => {
    setProviders(providers.map(p =>
      p.id === providerId ? { ...p, status: 'suspended' } : p
    ));
    setShowActionMenu(null);
  };

  const handleReactivate = (providerId: string) => {
    setProviders(providers.map(p =>
      p.id === providerId ? { ...p, status: 'active' } : p
    ));
    setShowActionMenu(null);
  };

  const handleToggleFeatured = (providerId: string) => {
    setProviders(providers.map(p =>
      p.id === providerId ? { ...p, is_featured: !p.is_featured } : p
    ));
    setShowActionMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Providers</p>
              <p className="text-2xl font-bold text-white">{activeProviders}</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pending Approval</p>
              <p className="text-2xl font-bold text-white">{pendingProviders}</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Earnings</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalEarnings)}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg. Rating</p>
              <p className="text-2xl font-bold text-white flex items-center gap-1">
                {avgRating} <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </p>
            </div>
            <div className="p-3 bg-violet-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-violet-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {PROVIDER_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.id} value={status.id}>{status.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Provider
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {PROVIDER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoryFilter === cat.id
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {cat.label} ({providers.filter(p => cat.id === 'all' || p.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-400">
        Showing {filteredProviders.length} of {providers.length} providers
      </div>

      {/* Providers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Earnings
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Bookings
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Loading providers...
                </td>
              </tr>
            ) : filteredProviders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No providers found
                </td>
              </tr>
            ) : (
              filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm">
                        {provider.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{provider.name}</p>
                          {provider.is_verified && (
                            <Shield className="w-4 h-4 text-blue-400" title="Verified" />
                          )}
                          {provider.is_featured && (
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" title="Featured" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{provider.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(provider.category)}`}>
                      {PROVIDER_CATEGORIES.find(c => c.id === provider.category)?.label || provider.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-white font-medium">{provider.rating}</span>
                      <span className="text-slate-400 text-sm">({provider.review_count})</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{formatCurrency(provider.total_earnings)}</p>
                    <p className="text-xs text-slate-400">{formatCurrency(provider.hourly_rate)}/hr</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white">{provider.total_bookings}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button
                        onClick={() => {
                          setSelectedProvider(provider);
                          setShowDetailModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === provider.id ? null : provider.id)}
                        className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Action Menu */}
                      {showActionMenu === provider.id && (
                        <div className="absolute right-0 top-10 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                          <div className="py-1">
                            {provider.status === 'pending' && (
                              <button
                                onClick={() => handleApprove(provider.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve Provider
                              </button>
                            )}
                            {provider.status === 'active' && (
                              <button
                                onClick={() => handleSuspend(provider.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                              >
                                <Ban className="w-4 h-4" />
                                Suspend Provider
                              </button>
                            )}
                            {provider.status === 'suspended' && (
                              <button
                                onClick={() => handleReactivate(provider.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Reactivate
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleFeatured(provider.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-400 hover:bg-slate-700"
                            >
                              <Star className="w-4 h-4" />
                              {provider.is_featured ? 'Remove Featured' : 'Mark Featured'}
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                              <Mail className="w-4 h-4" />
                              Send Message
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                              <ExternalLink className="w-4 h-4" />
                              View Public Profile
                            </button>
                          </div>
                        </div>
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
      {showDetailModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Provider Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Provider Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-xl">
                  {selectedProvider.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{selectedProvider.name}</h3>
                    {selectedProvider.is_verified && (
                      <Shield className="w-5 h-5 text-blue-400" />
                    )}
                    {selectedProvider.is_featured && (
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <p className="text-slate-400">{selectedProvider.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedProvider.status)}`}>
                      {selectedProvider.status}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {selectedProvider.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Bio</h4>
                <p className="text-slate-400">{selectedProvider.bio}</p>
              </div>

              {/* Specializations */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.specializations.map((spec: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">{selectedProvider.rating}</p>
                  <p className="text-xs text-slate-400">Rating</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">{selectedProvider.review_count}</p>
                  <p className="text-xs text-slate-400">Reviews</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">{selectedProvider.total_bookings}</p>
                  <p className="text-xs text-slate-400">Bookings</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">{formatCurrency(selectedProvider.total_earnings)}</p>
                  <p className="text-xs text-slate-400">Earnings</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Stripe Connect</p>
                    <p className="text-xs text-slate-400">
                      {selectedProvider.stripe_connected ? 'Connected' : 'Not Connected'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedProvider.stripe_connected
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedProvider.stripe_connected ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedProvider.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleApprove(selectedProvider.id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Provider
                  </button>
                )}
                {selectedProvider.status === 'active' && (
                  <button
                    onClick={() => {
                      handleSuspend(selectedProvider.id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg font-medium"
                  >
                    <Ban className="w-4 h-4" />
                    Suspend Provider
                  </button>
                )}
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium">
                  <Mail className="w-4 h-4" />
                  Send Message
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceProvidersTab;
