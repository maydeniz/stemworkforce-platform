// ===========================================
// React Hooks for Marketplace Data
// Provides easy integration with the marketplace API
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import {
  marketplaceApi,
  MarketplaceCategory,
  MarketplaceProvider,
  MarketplaceService,
  MarketplaceBooking,
  MarketplaceReview,
  MarketplacePayout,
  MarketplaceStats,
} from '@/services/marketplaceApi';

// ===========================================
// Stats Hook
// ===========================================

export function useMarketplaceStats() {
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketplaceApi.stats.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch marketplace stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

// ===========================================
// Categories Hook
// ===========================================

export function useMarketplaceCategories(activeOnly: boolean = false) {
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = activeOnly
        ? await marketplaceApi.categories.getActive()
        : await marketplaceApi.categories.list();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  const createCategory = useCallback(async (category: Omit<MarketplaceCategory, 'id' | 'created_at'>) => {
    const created = await marketplaceApi.categories.create(category);
    setCategories(prev => [...prev, created]);
    return created;
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<MarketplaceCategory>) => {
    const updated = await marketplaceApi.categories.update(id, updates);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await marketplaceApi.categories.delete(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}

// ===========================================
// Providers Hook
// ===========================================

interface UseMarketplaceProvidersOptions {
  status?: string;
  verification_status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useMarketplaceProviders(options?: UseMarketplaceProvidersOptions) {
  const [providers, setProviders] = useState<MarketplaceProvider[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { providers: data, total: count } = await marketplaceApi.providers.list(options);
      setProviders(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch providers'));
    } finally {
      setLoading(false);
    }
  }, [options?.status, options?.verification_status, options?.search, options?.page, options?.limit]);

  const approveProvider = useCallback(async (id: string) => {
    await marketplaceApi.providers.approve(id);
    setProviders(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' as const } : p));
  }, []);

  const rejectProvider = useCallback(async (id: string, reason?: string) => {
    await marketplaceApi.providers.reject(id, reason);
    setProviders(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' as const } : p));
  }, []);

  const suspendProvider = useCallback(async (id: string, reason?: string) => {
    await marketplaceApi.providers.suspend(id, reason);
    setProviders(prev => prev.map(p => p.id === id ? { ...p, status: 'suspended' as const } : p));
  }, []);

  const verifyProvider = useCallback(async (id: string) => {
    await marketplaceApi.providers.verify(id);
    setProviders(prev => prev.map(p => p.id === id ? { ...p, verification_status: 'verified' as const } : p));
  }, []);

  const updateCommissionRate = useCallback(async (id: string, rate: number) => {
    await marketplaceApi.providers.updateCommissionRate(id, rate);
    setProviders(prev => prev.map(p => p.id === id ? { ...p, commission_rate: rate } : p));
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    total,
    loading,
    error,
    approveProvider,
    rejectProvider,
    suspendProvider,
    verifyProvider,
    updateCommissionRate,
    refetch: fetchProviders,
  };
}

// ===========================================
// Services Hook
// ===========================================

interface UseMarketplaceServicesOptions {
  category_id?: string;
  provider_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export function useMarketplaceServices(options?: UseMarketplaceServicesOptions) {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { services: data, total: count } = await marketplaceApi.services.list(options);
      setServices(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch services'));
    } finally {
      setLoading(false);
    }
  }, [options?.category_id, options?.provider_id, options?.is_active, options?.is_featured, options?.search, options?.page, options?.limit]);

  const setActive = useCallback(async (id: string, isActive: boolean) => {
    await marketplaceApi.services.setActive(id, isActive);
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: isActive } : s));
  }, []);

  const setFeatured = useCallback(async (id: string, isFeatured: boolean) => {
    await marketplaceApi.services.setFeatured(id, isFeatured);
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_featured: isFeatured } : s));
  }, []);

  const deleteService = useCallback(async (id: string) => {
    await marketplaceApi.services.delete(id);
    setServices(prev => prev.filter(s => s.id !== id));
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    total,
    loading,
    error,
    setActive,
    setFeatured,
    deleteService,
    refetch: fetchServices,
  };
}

// ===========================================
// Bookings/Orders Hook
// ===========================================

interface UseMarketplaceBookingsOptions {
  status?: string;
  payment_status?: string;
  provider_id?: string;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export function useMarketplaceBookings(options?: UseMarketplaceBookingsOptions) {
  const [bookings, setBookings] = useState<MarketplaceBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { bookings: data, total: count } = await marketplaceApi.bookings.list(options);
      setBookings(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bookings'));
    } finally {
      setLoading(false);
    }
  }, [options?.status, options?.payment_status, options?.provider_id, options?.customer_id, options?.date_from, options?.date_to, options?.page, options?.limit]);

  const updateStatus = useCallback(async (id: string, status: MarketplaceBooking['status']) => {
    await marketplaceApi.bookings.updateStatus(id, status);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }, []);

  const processRefund = useCallback(async (id: string, reason?: string) => {
    await marketplaceApi.bookings.processRefund(id, reason);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, payment_status: 'refunded' as const, status: 'cancelled' as const } : b));
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    total,
    loading,
    error,
    updateStatus,
    processRefund,
    refetch: fetchBookings,
  };
}

// ===========================================
// Reviews Hook
// ===========================================

interface UseMarketplaceReviewsOptions {
  status?: string;
  is_flagged?: boolean;
  provider_id?: string;
  service_id?: string;
  min_rating?: number;
  page?: number;
  limit?: number;
}

export function useMarketplaceReviews(options?: UseMarketplaceReviewsOptions) {
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { reviews: data, total: count } = await marketplaceApi.reviews.list(options);
      setReviews(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
    } finally {
      setLoading(false);
    }
  }, [options?.status, options?.is_flagged, options?.provider_id, options?.service_id, options?.min_rating, options?.page, options?.limit]);

  const approveReview = useCallback(async (id: string) => {
    await marketplaceApi.reviews.approve(id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const, is_flagged: false } : r));
  }, []);

  const hideReview = useCallback(async (id: string, reason?: string) => {
    await marketplaceApi.reviews.hide(id, reason);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'hidden' as const } : r));
  }, []);

  const removeReview = useCallback(async (id: string, reason?: string) => {
    await marketplaceApi.reviews.remove(id, reason);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'removed' as const } : r));
  }, []);

  const flagReview = useCallback(async (id: string, reason: string) => {
    await marketplaceApi.reviews.flag(id, reason);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_flagged: true, flag_reason: reason } : r));
  }, []);

  const unflagReview = useCallback(async (id: string) => {
    await marketplaceApi.reviews.unflag(id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_flagged: false, flag_reason: null } : r));
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    total,
    loading,
    error,
    approveReview,
    hideReview,
    removeReview,
    flagReview,
    unflagReview,
    refetch: fetchReviews,
  };
}

// ===========================================
// Payouts Hook
// ===========================================

interface UseMarketplacePayoutsOptions {
  status?: string;
  provider_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export function useMarketplacePayouts(options?: UseMarketplacePayoutsOptions) {
  const [payouts, setPayouts] = useState<MarketplacePayout[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { payouts: data, total: count } = await marketplaceApi.payouts.list(options);
      setPayouts(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch payouts'));
    } finally {
      setLoading(false);
    }
  }, [options?.status, options?.provider_id, options?.date_from, options?.date_to, options?.page, options?.limit]);

  const processPayout = useCallback(async (id: string, reference?: string) => {
    await marketplaceApi.payouts.process(id, reference);
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'processing' as const } : p));
  }, []);

  const completePayout = useCallback(async (id: string, reference?: string) => {
    await marketplaceApi.payouts.complete(id, reference);
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'completed' as const } : p));
  }, []);

  const markFailed = useCallback(async (id: string, reason?: string) => {
    await marketplaceApi.payouts.markFailed(id, reason);
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'failed' as const } : p));
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  return {
    payouts,
    total,
    loading,
    error,
    processPayout,
    completePayout,
    markFailed,
    refetch: fetchPayouts,
  };
}

// ===========================================
// Revenue Analytics Hook
// ===========================================

export function useMarketplaceRevenue(periodDays: number = 30) {
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number; commission: number }[]>([]);
  const [topProviders, setTopProviders] = useState<MarketplaceProvider[]>([]);
  const [topServices, setTopServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [revenue, providers, services] = await Promise.all([
        marketplaceApi.stats.getRevenueByPeriod(periodDays),
        marketplaceApi.stats.getTopProviders(10),
        marketplaceApi.stats.getTopServices(10),
      ]);
      setRevenueData(revenue);
      setTopProviders(providers);
      setTopServices(services);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch revenue data'));
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    revenueData,
    topProviders,
    topServices,
    loading,
    error,
    refetch: fetchData,
  };
}
