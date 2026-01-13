// ===========================================
// Marketplace API Service Layer
// Complete backend integration for marketplace functionality
// ===========================================

import { supabase } from '@/lib/supabase';

// ===========================================
// Types
// ===========================================

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface MarketplaceProvider {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  phone: string | null;
  email: string;
  address: Record<string, unknown> | null;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  verification_status: 'unverified' | 'pending' | 'verified';
  rating: number;
  review_count: number;
  total_orders: number;
  total_revenue: number;
  commission_rate: number;
  payout_method: string | null;
  payout_details: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    full_name: string;
  };
}

export interface MarketplaceService {
  id: string;
  provider_id: string;
  category_id: string;
  title: string;
  description: string;
  short_description: string | null;
  price: number;
  price_type: 'fixed' | 'hourly' | 'starting_at' | 'contact';
  duration_minutes: number | null;
  is_active: boolean;
  is_featured: boolean;
  images: string[] | null;
  tags: string[] | null;
  requirements: string | null;
  deliverables: string | null;
  rating: number;
  review_count: number;
  order_count: number;
  created_at: string;
  updated_at: string;
  provider?: MarketplaceProvider;
  category?: MarketplaceCategory;
}

export interface MarketplaceBooking {
  id: string;
  service_id: string;
  provider_id: string;
  customer_id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  booking_date: string | null;
  booking_time: string | null;
  total_amount: number;
  commission_amount: number;
  provider_payout: number;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_method: string | null;
  payment_id: string | null;
  notes: string | null;
  customer_notes: string | null;
  provider_notes: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  service?: MarketplaceService;
  provider?: MarketplaceProvider;
  customer?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface MarketplaceReview {
  id: string;
  booking_id: string;
  service_id: string;
  provider_id: string;
  customer_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  status: 'pending' | 'approved' | 'hidden' | 'removed';
  provider_response: string | null;
  provider_responded_at: string | null;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  customer?: {
    full_name: string;
  };
  service?: {
    title: string;
  };
}

export interface MarketplacePayout {
  id: string;
  provider_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payout_method: string;
  payout_reference: string | null;
  period_start: string;
  period_end: string;
  bookings_count: number;
  gross_amount: number;
  commission_amount: number;
  processed_at: string | null;
  notes: string | null;
  created_at: string;
  provider?: MarketplaceProvider;
}

export interface MarketplaceStats {
  totalProviders: number;
  activeProviders: number;
  pendingProviders: number;
  totalServices: number;
  activeServices: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalCommission: number;
  pendingPayouts: number;
  pendingReviews: number;
  flaggedReviews: number;
}

// ===========================================
// Categories API
// ===========================================

export const marketplaceCategoriesApi = {
  // Get all categories
  async list(): Promise<MarketplaceCategory[]> {
    const { data, error } = await supabase
      .from('marketplace_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get active categories
  async getActive(): Promise<MarketplaceCategory[]> {
    const { data, error } = await supabase
      .from('marketplace_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create category
  async create(category: Omit<MarketplaceCategory, 'id' | 'created_at'>): Promise<MarketplaceCategory> {
    const { data, error } = await supabase
      .from('marketplace_categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update category
  async update(id: string, updates: Partial<MarketplaceCategory>): Promise<MarketplaceCategory> {
    const { data, error } = await supabase
      .from('marketplace_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete category
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ===========================================
// Providers API
// ===========================================

export const marketplaceProvidersApi = {
  // List providers with filters
  async list(filters?: {
    status?: string;
    verification_status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ providers: MarketplaceProvider[]; total: number }> {
    let query = supabase
      .from('marketplace_providers')
      .select('*, users(email, full_name)', { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.verification_status && filters.verification_status !== 'all') {
      query = query.eq('verification_status', filters.verification_status);
    }
    if (filters?.search) {
      query = query.ilike('business_name', `%${filters.search}%`);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const providers = (data || []).map(p => ({
      ...p,
      user: p.users,
    }));

    return { providers, total: count || 0 };
  },

  // Get single provider
  async get(id: string): Promise<MarketplaceProvider | null> {
    const { data, error } = await supabase
      .from('marketplace_providers')
      .select('*, users(email, full_name)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? { ...data, user: data.users } : null;
  },

  // Update provider
  async update(id: string, updates: Partial<MarketplaceProvider>): Promise<MarketplaceProvider> {
    const { data, error } = await supabase
      .from('marketplace_providers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Approve provider
  async approve(id: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_providers')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  // Reject provider
  async reject(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_providers')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Suspend provider
  async suspend(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_providers')
      .update({
        status: 'suspended',
        suspension_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Verify provider
  async verify(id: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_providers')
      .update({
        verification_status: 'verified',
        verified_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Update commission rate
  async updateCommissionRate(id: string, rate: number): Promise<void> {
    const { error } = await supabase
      .from('marketplace_providers')
      .update({ commission_rate: rate })
      .eq('id', id);

    if (error) throw error;
  },
};

// ===========================================
// Services API
// ===========================================

export const marketplaceServicesApi = {
  // List services with filters
  async list(filters?: {
    category_id?: string;
    provider_id?: string;
    is_active?: boolean;
    is_featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ services: MarketplaceService[]; total: number }> {
    let query = supabase
      .from('marketplace_services')
      .select('*, marketplace_providers(id, business_name, rating), marketplace_categories(id, name)', { count: 'exact' });

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters?.provider_id) {
      query = query.eq('provider_id', filters.provider_id);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const services = (data || []).map(s => ({
      ...s,
      provider: s.marketplace_providers,
      category: s.marketplace_categories,
    }));

    return { services, total: count || 0 };
  },

  // Get single service
  async get(id: string): Promise<MarketplaceService | null> {
    const { data, error } = await supabase
      .from('marketplace_services')
      .select('*, marketplace_providers(*), marketplace_categories(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      provider: data.marketplace_providers,
      category: data.marketplace_categories,
    } : null;
  },

  // Update service
  async update(id: string, updates: Partial<MarketplaceService>): Promise<MarketplaceService> {
    const { data, error } = await supabase
      .from('marketplace_services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Activate/deactivate service
  async setActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('marketplace_services')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  },

  // Feature/unfeature service
  async setFeatured(id: string, isFeatured: boolean): Promise<void> {
    const { error } = await supabase
      .from('marketplace_services')
      .update({ is_featured: isFeatured })
      .eq('id', id);

    if (error) throw error;
  },

  // Delete service
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ===========================================
// Bookings/Orders API
// ===========================================

export const marketplaceBookingsApi = {
  // List bookings with filters
  async list(filters?: {
    status?: string;
    payment_status?: string;
    provider_id?: string;
    customer_id?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ bookings: MarketplaceBooking[]; total: number }> {
    let query = supabase
      .from('marketplace_bookings')
      .select(`
        *,
        marketplace_services(id, title, price),
        marketplace_providers(id, business_name),
        users!marketplace_bookings_customer_id_fkey(id, full_name, email)
      `, { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.payment_status && filters.payment_status !== 'all') {
      query = query.eq('payment_status', filters.payment_status);
    }
    if (filters?.provider_id) {
      query = query.eq('provider_id', filters.provider_id);
    }
    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const bookings = (data || []).map(b => ({
      ...b,
      service: b.marketplace_services,
      provider: b.marketplace_providers,
      customer: b.users,
    }));

    return { bookings, total: count || 0 };
  },

  // Get single booking
  async get(id: string): Promise<MarketplaceBooking | null> {
    const { data, error } = await supabase
      .from('marketplace_bookings')
      .select(`
        *,
        marketplace_services(*),
        marketplace_providers(*),
        users!marketplace_bookings_customer_id_fkey(id, full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      service: data.marketplace_services,
      provider: data.marketplace_providers,
      customer: data.users,
    } : null;
  },

  // Update booking status
  async updateStatus(id: string, status: MarketplaceBooking['status']): Promise<void> {
    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    if (status === 'cancelled') {
      updates.cancelled_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('marketplace_bookings')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  // Process refund
  async processRefund(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_bookings')
      .update({
        payment_status: 'refunded',
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },
};

// ===========================================
// Reviews API
// ===========================================

export const marketplaceReviewsApi = {
  // List reviews with filters
  async list(filters?: {
    status?: string;
    is_flagged?: boolean;
    provider_id?: string;
    service_id?: string;
    min_rating?: number;
    page?: number;
    limit?: number;
  }): Promise<{ reviews: MarketplaceReview[]; total: number }> {
    let query = supabase
      .from('marketplace_reviews')
      .select(`
        *,
        users!marketplace_reviews_customer_id_fkey(full_name),
        marketplace_services(title)
      `, { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.is_flagged !== undefined) {
      query = query.eq('is_flagged', filters.is_flagged);
    }
    if (filters?.provider_id) {
      query = query.eq('provider_id', filters.provider_id);
    }
    if (filters?.service_id) {
      query = query.eq('service_id', filters.service_id);
    }
    if (filters?.min_rating) {
      query = query.gte('rating', filters.min_rating);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const reviews = (data || []).map(r => ({
      ...r,
      customer: r.users,
      service: r.marketplace_services,
    }));

    return { reviews, total: count || 0 };
  },

  // Approve review
  async approve(id: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_reviews')
      .update({ status: 'approved', is_flagged: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  // Hide review
  async hide(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_reviews')
      .update({
        status: 'hidden',
        moderation_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Remove review
  async remove(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_reviews')
      .update({
        status: 'removed',
        moderation_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Flag review
  async flag(id: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_reviews')
      .update({
        is_flagged: true,
        flag_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Unflag review
  async unflag(id: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_reviews')
      .update({
        is_flagged: false,
        flag_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },
};

// ===========================================
// Payouts API
// ===========================================

export const marketplacePayoutsApi = {
  // List payouts with filters
  async list(filters?: {
    status?: string;
    provider_id?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ payouts: MarketplacePayout[]; total: number }> {
    let query = supabase
      .from('marketplace_payouts')
      .select('*, marketplace_providers(id, business_name)', { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.provider_id) {
      query = query.eq('provider_id', filters.provider_id);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const payouts = (data || []).map(p => ({
      ...p,
      provider: p.marketplace_providers,
    }));

    return { payouts, total: count || 0 };
  },

  // Get pending payouts summary
  async getPendingSummary(): Promise<{ count: number; total_amount: number }> {
    const { data, error, count } = await supabase
      .from('marketplace_payouts')
      .select('amount', { count: 'exact' })
      .eq('status', 'pending');

    if (error) throw error;

    const total_amount = (data || []).reduce((sum, p) => sum + p.amount, 0);
    return { count: count || 0, total_amount };
  },

  // Process payout
  async process(id: string, reference?: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_payouts')
      .update({
        status: 'processing',
        payout_reference: reference,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Complete payout
  async complete(id: string, reference?: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_payouts')
      .update({
        status: 'completed',
        payout_reference: reference,
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Mark payout as failed
  async markFailed(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_payouts')
      .update({
        status: 'failed',
        notes: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  // Create bulk payouts
  async createBulkPayouts(providerIds: string[], periodStart: string, periodEnd: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('create-marketplace-payouts', {
      body: { provider_ids: providerIds, period_start: periodStart, period_end: periodEnd },
    });

    if (error) throw error;
    return data;
  },
};

// ===========================================
// Stats API
// ===========================================

export const marketplaceStatsApi = {
  // Get marketplace overview stats
  async getStats(): Promise<MarketplaceStats> {
    const [
      providersResult,
      activeProvidersResult,
      pendingProvidersResult,
      servicesResult,
      activeServicesResult,
      ordersResult,
      pendingOrdersResult,
      completedOrdersResult,
      pendingPayoutsResult,
      pendingReviewsResult,
      flaggedReviewsResult,
    ] = await Promise.all([
      supabase.from('marketplace_providers').select('id', { count: 'exact', head: true }),
      supabase.from('marketplace_providers').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('marketplace_providers').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('marketplace_services').select('id', { count: 'exact', head: true }),
      supabase.from('marketplace_services').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('marketplace_bookings').select('id', { count: 'exact', head: true }),
      supabase.from('marketplace_bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('marketplace_bookings').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('marketplace_payouts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('marketplace_reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('marketplace_reviews').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
    ]);

    // Get revenue stats
    const { data: revenueData } = await supabase
      .from('marketplace_bookings')
      .select('total_amount, commission_amount')
      .eq('payment_status', 'paid');

    const totalRevenue = (revenueData || []).reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const totalCommission = (revenueData || []).reduce((sum, b) => sum + (b.commission_amount || 0), 0);

    return {
      totalProviders: providersResult.count || 0,
      activeProviders: activeProvidersResult.count || 0,
      pendingProviders: pendingProvidersResult.count || 0,
      totalServices: servicesResult.count || 0,
      activeServices: activeServicesResult.count || 0,
      totalOrders: ordersResult.count || 0,
      pendingOrders: pendingOrdersResult.count || 0,
      completedOrders: completedOrdersResult.count || 0,
      totalRevenue,
      totalCommission,
      pendingPayouts: pendingPayoutsResult.count || 0,
      pendingReviews: pendingReviewsResult.count || 0,
      flaggedReviews: flaggedReviewsResult.count || 0,
    };
  },

  // Get revenue by period
  async getRevenueByPeriod(periodDays: number = 30): Promise<{ date: string; revenue: number; commission: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const { data, error } = await supabase
      .from('marketplace_bookings')
      .select('created_at, total_amount, commission_amount')
      .gte('created_at', startDate.toISOString())
      .eq('payment_status', 'paid');

    if (error) throw error;

    // Group by date
    const byDate: Record<string, { revenue: number; commission: number }> = {};
    for (const booking of data || []) {
      const date = booking.created_at.split('T')[0];
      if (!byDate[date]) {
        byDate[date] = { revenue: 0, commission: 0 };
      }
      byDate[date].revenue += booking.total_amount || 0;
      byDate[date].commission += booking.commission_amount || 0;
    }

    return Object.entries(byDate).map(([date, values]) => ({
      date,
      ...values,
    })).sort((a, b) => a.date.localeCompare(b.date));
  },

  // Get top providers
  async getTopProviders(limit: number = 10): Promise<MarketplaceProvider[]> {
    const { data, error } = await supabase
      .from('marketplace_providers')
      .select('*')
      .eq('status', 'approved')
      .order('total_revenue', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get top services
  async getTopServices(limit: number = 10): Promise<MarketplaceService[]> {
    const { data, error } = await supabase
      .from('marketplace_services')
      .select('*, marketplace_providers(business_name)')
      .eq('is_active', true)
      .order('order_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(s => ({
      ...s,
      provider: s.marketplace_providers,
    }));
  },
};

// ===========================================
// Export all marketplace APIs
// ===========================================

export const marketplaceApi = {
  categories: marketplaceCategoriesApi,
  providers: marketplaceProvidersApi,
  services: marketplaceServicesApi,
  bookings: marketplaceBookingsApi,
  reviews: marketplaceReviewsApi,
  payouts: marketplacePayoutsApi,
  stats: marketplaceStatsApi,
};
