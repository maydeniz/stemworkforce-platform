/**
 * Base Partner API - Consolidates common CRUD operations across partner types
 *
 * This abstract base class provides shared functionality for:
 * - Education Partners
 * - Industry Partners
 * - Nonprofit Partners
 * - National Labs Partners
 * - Government Partners
 * - Municipality Partners
 *
 * Each partner API should extend this class and only implement partner-specific methods.
 */

import { supabase } from '@/lib/supabase';

// Generic partner interface - all partners have these base fields
export interface BasePartner {
  id: string;
  user_id: string;
  name: string;
  organization_name?: string;
  email: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Configuration for each partner type
export interface PartnerConfig<T extends BasePartner> {
  /** The Supabase table name */
  tableName: string;
  /** Human-readable partner type name */
  typeName: string;
  /** Default select fields (use '*' for all) */
  defaultSelect?: string;
  /** Transform function to convert DB data to typed object */
  transformFromDB?: (data: Record<string, unknown>) => T;
  /** Transform function to convert typed object to DB format */
  transformToDB?: (partner: Partial<T>) => Record<string, unknown>;
}

// Standard API response type
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter options (extend in subclasses for partner-specific filters)
export interface BaseFilterOptions {
  search?: string;
  status?: string;
}

/**
 * Abstract base class for all partner APIs
 * Provides common CRUD operations and can be extended for partner-specific functionality
 */
export abstract class BasePartnerApi<
  T extends BasePartner,
  TFilters extends BaseFilterOptions = BaseFilterOptions
> {
  protected config: PartnerConfig<T>;

  constructor(config: PartnerConfig<T>) {
    this.config = config;
  }

  /**
   * Get a single partner by user ID
   */
  async getByUserId(userId: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.config.tableName)
        .select(this.config.defaultSelect || '*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const transformed = this.config.transformFromDB
        ? this.config.transformFromDB(data as unknown as Record<string, unknown>)
        : (data as unknown as T);

      return { data: transformed, error: null, success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { data: null, error: message, success: false };
    }
  }

  /**
   * Get a single partner by ID
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.config.tableName)
        .select(this.config.defaultSelect || '*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const transformed = this.config.transformFromDB
        ? this.config.transformFromDB(data as unknown as Record<string, unknown>)
        : (data as unknown as T);

      return { data: transformed, error: null, success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { data: null, error: message, success: false };
    }
  }

  /**
   * Get all partners with optional filtering and pagination
   */
  async getAll(
    filters?: TFilters,
    pagination?: PaginationOptions
  ): Promise<ApiResponse<{ items: T[]; total: number }>> {
    try {
      const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' } = pagination || {};
      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.config.tableName)
        .select(this.config.defaultSelect || '*', { count: 'exact' });

      // Apply base filters
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,organization_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      // Apply partner-specific filters (override in subclass)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = this.applyFilters(query as unknown as any, filters) as typeof query;

      // Apply sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const items = this.config.transformFromDB
        ? ((data || []) as unknown as Record<string, unknown>[]).map(this.config.transformFromDB)
        : ((data || []) as unknown as T[]);

      return {
        data: { items, total: count || 0 },
        error: null,
        success: true,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { data: null, error: message, success: false };
    }
  }

  /**
   * Create a new partner
   */
  async create(partner: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<T>> {
    try {
      const dbData = this.config.transformToDB
        ? this.config.transformToDB(partner as Partial<T>)
        : partner;

      const { data, error } = await supabase
        .from(this.config.tableName)
        .insert(dbData)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const transformed = this.config.transformFromDB
        ? this.config.transformFromDB(data)
        : (data as T);

      return { data: transformed, error: null, success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { data: null, error: message, success: false };
    }
  }

  /**
   * Update an existing partner
   */
  async update(id: string, updates: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const dbData = this.config.transformToDB
        ? this.config.transformToDB(updates)
        : updates;

      const { data, error } = await supabase
        .from(this.config.tableName)
        .update({ ...dbData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const transformed = this.config.transformFromDB
        ? this.config.transformFromDB(data)
        : (data as T);

      return { data: transformed, error: null, success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { data: null, error: message, success: false };
    }
  }

  /**
   * Delete a partner (soft delete by setting status to 'inactive')
   */
  async delete(id: string, hard = false): Promise<ApiResponse<boolean>> {
    try {
      if (hard) {
        const { error } = await supabase
          .from(this.config.tableName)
          .delete()
          .eq('id', id);

        if (error) {
          return { data: false, error: error.message, success: false };
        }
      } else {
        const { error } = await supabase
          .from(this.config.tableName)
          .update({ status: 'inactive', updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          return { data: false, error: error.message, success: false };
        }
      }

      return { data: true, error: null, success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { data: false, error: message, success: false };
    }
  }

  /**
   * Update partner status
   */
  async updateStatus(
    id: string,
    status: 'pending' | 'active' | 'suspended' | 'inactive'
  ): Promise<ApiResponse<T>> {
    return this.update(id, { status } as Partial<T>);
  }

  /**
   * Check if partner exists for user
   */
  async exists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(this.config.tableName)
        .select('id')
        .eq('user_id', userId)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  /**
   * Get partner statistics (override for partner-specific stats)
   */
  async getStats(_partnerId: string): Promise<ApiResponse<Record<string, number>>> {
    // Default implementation - override in subclasses for specific stats
    return {
      data: { total: 0 },
      error: null,
      success: true,
    };
  }

  /**
   * Apply partner-specific filters to query
   * Override this method in subclasses to add partner-specific filtering
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyFilters(
    query: any,
    _filters?: TFilters
  ): any {
    return query;
  }
}

export default BasePartnerApi;
