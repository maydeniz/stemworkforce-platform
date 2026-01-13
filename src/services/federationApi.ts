// ===========================================
// FEDERATION API SERVICE
// Multi-source data aggregation and partner portal
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  FederatedSource,
  FederatedListing,
  SyncJob,
  PartnerPortalAccess,
  ContentQualityCheck,
  SyncStats,
  PartnerAnalytics,
  FederatedSourceType,
  IntegrationMethod,
} from '@/types/federation';
import type { IndustryType } from '@/types';

// ===========================================
// TYPE DEFINITIONS
// ===========================================

export interface FederatedListingFilters {
  contentType?: 'job' | 'internship' | 'challenge' | 'event' | 'scholarship' | 'all';
  sourceType?: FederatedSourceType;
  sourceIds?: string[];
  industries?: IndustryType[];
  locations?: string[];
  states?: string[];
  clearanceRequired?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  postedAfter?: string;
  postedBefore?: string;
  expiresAfter?: string;
  search?: string;
  isFeatured?: boolean;
  skills?: string[];
  tags?: string[];
}

export interface FederatedListingsResult {
  listings: FederatedListing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  sources: { id: string; name: string; count: number }[];
}

// ===========================================
// FEDERATED LISTINGS API
// ===========================================

export const federatedListingsApi = {
  // List federated listings with comprehensive filters
  async list(
    filters: FederatedListingFilters = {},
    page: number = 1,
    pageSize: number = 20,
    sortBy: 'posted_at' | 'relevance' | 'salary' | 'deadline' = 'posted_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<FederatedListingsResult> {
    try {
      let query = supabase
        .from('federated_listings')
        .select(`
          *,
          source:federated_sources!source_id(
            id, name, short_name, type, logo_url, partnership_tier,
            is_official_partner, attribution_required, attribution_text
          )
        `, { count: 'exact' })
        .eq('status', 'active');

      // Apply filters
      if (filters.contentType && filters.contentType !== 'all') {
        query = query.eq('content_type', filters.contentType);
      }

      if (filters.sourceType) {
        query = query.eq('source.type', filters.sourceType);
      }

      if (filters.sourceIds && filters.sourceIds.length > 0) {
        query = query.in('source_id', filters.sourceIds);
      }

      if (filters.industries && filters.industries.length > 0) {
        query = query.overlaps('industries', filters.industries);
      }

      if (filters.states && filters.states.length > 0) {
        query = query.in('state', filters.states);
      }

      if (filters.clearanceRequired) {
        query = query.eq('clearance_required', filters.clearanceRequired);
      }

      if (filters.isRemote !== undefined) {
        query = query.eq('is_remote', filters.isRemote);
      }

      if (filters.salaryMin !== undefined) {
        query = query.gte('salary_max', filters.salaryMin);
      }

      if (filters.salaryMax !== undefined) {
        query = query.lte('salary_min', filters.salaryMax);
      }

      if (filters.postedAfter) {
        query = query.gte('posted_at', filters.postedAfter);
      }

      if (filters.postedBefore) {
        query = query.lte('posted_at', filters.postedBefore);
      }

      if (filters.expiresAfter) {
        query = query.gte('expires_at', filters.expiresAfter);
      }

      if (filters.isFeatured) {
        query = query.eq('is_featured', true);
      }

      if (filters.skills && filters.skills.length > 0) {
        query = query.overlaps('skills', filters.skills);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Full-text search
      if (filters.search) {
        query = query.textSearch('searchable_content', filters.search, {
          type: 'websearch',
          config: 'english',
        });
      }

      // Sorting
      if (sortBy === 'salary') {
        query = query.order('salary_max', { ascending: sortOrder === 'asc', nullsFirst: false });
      } else if (sortBy === 'deadline') {
        query = query.order('expires_at', { ascending: sortOrder === 'asc', nullsFirst: false });
      } else if (sortBy === 'relevance' && filters.search) {
        // For relevance, we'd ideally use ts_rank, but Supabase handles this internally
        query = query.order('quality_score', { ascending: false, nullsFirst: false });
      } else {
        query = query.order('posted_at', { ascending: sortOrder === 'asc' });
      }

      // Also sort by featured status and quality
      query = query.order('is_featured', { ascending: false });
      query = query.order('relevance_boost', { ascending: false, nullsFirst: false });

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Transform data
      const listings = (data || []).map(transformDBListing);

      // Get source counts
      const sourceCounts = (data || []).reduce((acc, item) => {
        const sourceId = item.source?.id;
        const sourceName = item.source?.name || 'Unknown';
        if (sourceId) {
          if (!acc[sourceId]) {
            acc[sourceId] = { id: sourceId, name: sourceName, count: 0 };
          }
          acc[sourceId].count++;
        }
        return acc;
      }, {} as Record<string, { id: string; name: string; count: number }>);

      return {
        listings,
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > from + (data?.length || 0),
        sources: Object.values(sourceCounts),
      };
    } catch (error) {
      console.error('Error fetching federated listings:', error);
      return {
        listings: [],
        total: 0,
        page,
        pageSize,
        hasMore: false,
        sources: [],
      };
    }
  },

  // Get a single listing by ID
  async get(id: string): Promise<FederatedListing | null> {
    try {
      const { data, error } = await supabase
        .from('federated_listings')
        .select(`
          *,
          source:federated_sources!source_id(
            id, name, short_name, type, logo_url, website,
            partnership_tier, is_official_partner,
            attribution_required, attribution_text
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Increment view count
      await supabase.rpc('increment_listing_views', { listing_uuid: id });

      return transformDBListing(data);
    } catch (error) {
      console.error('Error fetching federated listing:', error);
      return null;
    }
  },

  // Record a click-through (user clicking to apply at source)
  async recordClick(
    listingId: string,
    sessionId?: string,
    referrer?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.rpc('record_listing_click', {
        p_listing_id: listingId,
        p_user_id: user?.id || null,
        p_session_id: sessionId || null,
        p_referrer: referrer || null,
        p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      });
    } catch (error) {
      console.error('Error recording click:', error);
    }
  },

  // Get featured listings
  async getFeatured(limit: number = 10): Promise<FederatedListing[]> {
    const result = await this.list({ isFeatured: true }, 1, limit);
    return result.listings;
  },

  // Get listings by source
  async getBySource(sourceId: string, page: number = 1, pageSize: number = 20): Promise<FederatedListingsResult> {
    return this.list({ sourceIds: [sourceId] }, page, pageSize);
  },

  // Get listings by content type
  async getByType(
    contentType: 'job' | 'internship' | 'challenge' | 'event' | 'scholarship',
    filters: FederatedListingFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<FederatedListingsResult> {
    return this.list({ ...filters, contentType }, page, pageSize);
  },

  // Get related listings
  async getRelated(listingId: string, limit: number = 6): Promise<FederatedListing[]> {
    try {
      // Get the listing first
      const listing = await this.get(listingId);
      if (!listing) return [];

      // Find similar listings
      const { data, error } = await supabase
        .from('federated_listings')
        .select(`
          *,
          source:federated_sources!source_id(id, name, short_name, logo_url)
        `)
        .eq('status', 'active')
        .eq('content_type', listing.contentType)
        .neq('id', listingId)
        .overlaps('industries', listing.industries)
        .order('quality_score', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(transformDBListing);
    } catch (error) {
      console.error('Error fetching related listings:', error);
      return [];
    }
  },
};

// ===========================================
// USER INTERACTIONS API
// ===========================================

export const federatedSavesApi = {
  // Save a listing
  async save(listingId: string, notes?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('federated_listing_saves')
        .insert({
          user_id: user.id,
          listing_id: listingId,
          notes,
        });

      if (error && error.code !== '23505') throw error; // Ignore duplicate key

      // Update save count
      await supabase
        .from('federated_listings')
        .update({ save_count: supabase.sql`save_count + 1` })
        .eq('id', listingId);

      return true;
    } catch (error) {
      console.error('Error saving listing:', error);
      return false;
    }
  },

  // Unsave a listing
  async unsave(listingId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('federated_listing_saves')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) throw error;

      // Update save count
      await supabase
        .from('federated_listings')
        .update({ save_count: supabase.sql`GREATEST(save_count - 1, 0)` })
        .eq('id', listingId);

      return true;
    } catch (error) {
      console.error('Error unsaving listing:', error);
      return false;
    }
  },

  // Check if listing is saved
  async isSaved(listingId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('federated_listing_saves')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  },

  // Get user's saved listings
  async getSaved(): Promise<FederatedListing[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('federated_listing_saves')
        .select(`
          listing:federated_listings(
            *,
            source:federated_sources!source_id(id, name, short_name, logo_url)
          ),
          notes,
          saved_at
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;

      return (data || [])
        .filter(d => d.listing)
        .map(d => transformDBListing(d.listing));
    } catch (error) {
      console.error('Error fetching saved listings:', error);
      return [];
    }
  },
};

// ===========================================
// FEDERATED SOURCES API
// ===========================================

export const federatedSourcesApi = {
  // List all active sources
  async list(filters?: {
    type?: FederatedSourceType;
    integrationMethod?: IntegrationMethod;
    status?: string;
  }): Promise<FederatedSource[]> {
    try {
      let query = supabase
        .from('federated_sources')
        .select('*')
        .order('name');

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.integrationMethod) {
        query = query.eq('integration_method', filters.integrationMethod);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(transformDBSource);
    } catch (error) {
      console.error('Error fetching federated sources:', error);
      return [];
    }
  },

  // Get a single source
  async get(id: string): Promise<FederatedSource | null> {
    try {
      const { data, error } = await supabase
        .from('federated_sources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? transformDBSource(data) : null;
    } catch (error) {
      console.error('Error fetching federated source:', error);
      return null;
    }
  },

  // Get sources by type
  async getByType(type: FederatedSourceType): Promise<FederatedSource[]> {
    return this.list({ type, status: 'active' });
  },

  // Get source statistics
  async getStats(sourceId: string): Promise<SyncStats | null> {
    try {
      const { data, error } = await supabase
        .from('source_analytics')
        .select('*')
        .eq('source_id', sourceId)
        .eq('period', 'all_time')
        .single();

      if (error) throw error;

      return data ? {
        sourceId: data.source_id,
        period: data.period,
        totalSyncs: data.total_syncs,
        successfulSyncs: data.successful_syncs,
        failedSyncs: data.failed_syncs,
        totalItemsSynced: data.total_items_synced,
        totalItemsActive: data.total_items_active,
        totalItemsExpired: data.total_items_expired,
        avgSyncDuration: data.avg_sync_duration_seconds,
        totalViews: data.total_views,
        totalClickThroughs: data.total_click_throughs,
        clickThroughRate: data.click_through_rate,
        avgQualityScore: data.avg_quality_score,
        itemsWithIssues: data.items_with_issues,
      } : null;
    } catch (error) {
      console.error('Error fetching source stats:', error);
      return null;
    }
  },
};

// ===========================================
// PARTNER PORTAL API
// ===========================================

export const partnerPortalApi = {
  // Get current user's partner access
  async getMyAccess(): Promise<PartnerPortalAccess[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('partner_portal_access')
        .select(`
          *,
          source:federated_sources(id, name, short_name, logo_url, type)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      return (data || []).map(d => ({
        id: d.id,
        sourceId: d.source_id,
        userId: d.user_id,
        canViewListings: d.can_view_listings,
        canCreateListings: d.can_create_listings,
        canEditListings: d.can_edit_listings,
        canDeleteListings: d.can_delete_listings,
        canViewAnalytics: d.can_view_analytics,
        canManageSettings: d.can_manage_settings,
        canInviteUsers: d.can_invite_users,
        maxActiveListings: d.max_active_listings,
        maxFeaturedListings: d.max_featured_listings,
        status: d.status,
        invitedBy: d.invited_by,
        invitedAt: d.invited_at,
        acceptedAt: d.accepted_at,
        lastAccessAt: d.last_access_at,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching partner access:', error);
      return [];
    }
  },

  // Get listings for a source (partner view)
  async getSourceListings(sourceId: string): Promise<FederatedListing[]> {
    try {
      const { data, error } = await supabase
        .from('federated_listings')
        .select('*')
        .eq('source_id', sourceId)
        .order('posted_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(transformDBListing);
    } catch (error) {
      console.error('Error fetching source listings:', error);
      return [];
    }
  },

  // Create a listing (for partners with direct post access)
  async createListing(sourceId: string, listing: Partial<FederatedListing>): Promise<FederatedListing | null> {
    try {
      const { data, error } = await supabase
        .from('federated_listings')
        .insert({
          source_id: sourceId,
          external_id: `manual-${Date.now()}`,
          content_type: listing.contentType,
          title: listing.title,
          description: listing.description,
          short_description: listing.shortDescription,
          source_url: listing.sourceUrl,
          source_name: listing.sourceName,
          organization_name: listing.organizationName,
          organization_logo_url: listing.organizationLogoUrl,
          location: listing.location,
          city: listing.city,
          state: listing.state,
          is_remote: listing.isRemote,
          industries: listing.industries,
          skills: listing.skills,
          tags: listing.tags,
          clearance_required: listing.clearanceRequired,
          job_type: listing.jobType,
          salary_min: listing.salaryMin,
          salary_max: listing.salaryMax,
          salary_currency: listing.salaryCurrency,
          salary_period: listing.salaryPeriod,
          prize_amount: listing.prizeAmount,
          registration_deadline: listing.registrationDeadline,
          submission_deadline: listing.submissionDeadline,
          event_date: listing.eventDate,
          event_end_date: listing.eventEndDate,
          posted_at: new Date().toISOString(),
          expires_at: listing.expiresAt,
          status: 'pending_review', // Manual posts need review
        })
        .select()
        .single();

      if (error) throw error;

      return data ? transformDBListing(data) : null;
    } catch (error) {
      console.error('Error creating listing:', error);
      return null;
    }
  },

  // Update a listing
  async updateListing(listingId: string, updates: Partial<FederatedListing>): Promise<boolean> {
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.shortDescription) updateData.short_description = updates.shortDescription;
      if (updates.location) updateData.location = updates.location;
      if (updates.isRemote !== undefined) updateData.is_remote = updates.isRemote;
      if (updates.industries) updateData.industries = updates.industries;
      if (updates.skills) updateData.skills = updates.skills;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.salaryMin !== undefined) updateData.salary_min = updates.salaryMin;
      if (updates.salaryMax !== undefined) updateData.salary_max = updates.salaryMax;
      if (updates.expiresAt) updateData.expires_at = updates.expiresAt;

      const { error } = await supabase
        .from('federated_listings')
        .update(updateData)
        .eq('id', listingId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating listing:', error);
      return false;
    }
  },

  // Get analytics for a source
  async getAnalytics(sourceId: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<PartnerAnalytics | null> {
    try {
      const { data, error } = await supabase
        .from('source_analytics')
        .select('*')
        .eq('source_id', sourceId)
        .eq('period', period)
        .order('period_start', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      return data ? {
        sourceId: data.source_id,
        period: data.period,
        totalListings: data.total_items_synced,
        activeListings: data.total_items_active,
        expiredListings: data.total_items_expired,
        totalImpressions: data.total_views,
        totalClicks: data.total_click_throughs,
        totalApplications: 0, // Not tracked yet
        clickThroughRate: data.click_through_rate,
        applicationRate: 0,
        topListingsByViews: [],
        topListingsByClicks: [],
      } : null;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  },
};

// ===========================================
// ADMIN API
// ===========================================

export const federationAdminApi = {
  // Create a new source
  async createSource(source: Partial<FederatedSource>): Promise<FederatedSource | null> {
    try {
      const { data, error } = await supabase
        .from('federated_sources')
        .insert({
          name: source.name,
          short_name: source.shortName,
          type: source.type,
          description: source.description,
          website: source.website,
          logo_url: source.logoUrl,
          contact_email: source.contactEmail,
          contact_name: source.contactName,
          integration_method: source.integrationMethod,
          sync_frequency: source.syncFrequency,
          api_config: source.apiConfig,
          rss_config: source.rssConfig,
          provides_jobs: source.providesJobs,
          provides_internships: source.providesInternships,
          provides_challenges: source.providesChallenges,
          provides_events: source.providesEvents,
          provides_scholarships: source.providesScholarships,
          industries: source.industries,
          default_clearance_level: source.defaultClearanceLevel,
          geographic_focus: source.geographicFocus,
          status: source.status || 'pending',
          partnership_tier: source.partnershipTier || 'basic',
          is_official_partner: source.isOfficialPartner || false,
          can_direct_post: source.canDirectPost || false,
          terms_accepted: source.termsAccepted || false,
          attribution_required: source.attributionRequired ?? true,
          attribution_text: source.attributionText,
          data_usage_permission: source.dataUsagePermission || 'public_data',
        })
        .select()
        .single();

      if (error) throw error;

      return data ? transformDBSource(data) : null;
    } catch (error) {
      console.error('Error creating source:', error);
      return null;
    }
  },

  // Update a source
  async updateSource(id: string, updates: Partial<FederatedSource>): Promise<boolean> {
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name) updateData.name = updates.name;
      if (updates.shortName) updateData.short_name = updates.shortName;
      if (updates.description) updateData.description = updates.description;
      if (updates.website) updateData.website = updates.website;
      if (updates.logoUrl) updateData.logo_url = updates.logoUrl;
      if (updates.contactEmail) updateData.contact_email = updates.contactEmail;
      if (updates.contactName) updateData.contact_name = updates.contactName;
      if (updates.integrationMethod) updateData.integration_method = updates.integrationMethod;
      if (updates.syncFrequency) updateData.sync_frequency = updates.syncFrequency;
      if (updates.apiConfig) updateData.api_config = updates.apiConfig;
      if (updates.rssConfig) updateData.rss_config = updates.rssConfig;
      if (updates.providesJobs !== undefined) updateData.provides_jobs = updates.providesJobs;
      if (updates.providesInternships !== undefined) updateData.provides_internships = updates.providesInternships;
      if (updates.providesChallenges !== undefined) updateData.provides_challenges = updates.providesChallenges;
      if (updates.providesEvents !== undefined) updateData.provides_events = updates.providesEvents;
      if (updates.providesScholarships !== undefined) updateData.provides_scholarships = updates.providesScholarships;
      if (updates.industries) updateData.industries = updates.industries;
      if (updates.status) updateData.status = updates.status;
      if (updates.partnershipTier) updateData.partnership_tier = updates.partnershipTier;
      if (updates.isOfficialPartner !== undefined) updateData.is_official_partner = updates.isOfficialPartner;
      if (updates.canDirectPost !== undefined) updateData.can_direct_post = updates.canDirectPost;
      if (updates.termsAccepted !== undefined) updateData.terms_accepted = updates.termsAccepted;
      if (updates.attributionRequired !== undefined) updateData.attribution_required = updates.attributionRequired;
      if (updates.attributionText) updateData.attribution_text = updates.attributionText;

      const { error } = await supabase
        .from('federated_sources')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating source:', error);
      return false;
    }
  },

  // Delete a source
  async deleteSource(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('federated_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting source:', error);
      return false;
    }
  },

  // Trigger manual sync
  async triggerSync(sourceId: string): Promise<SyncJob | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('sync_jobs')
        .insert({
          source_id: sourceId,
          status: 'pending',
          triggered_by: 'manual',
          triggered_by_user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // In production, this would trigger an edge function or background job
      // For now, we just create the job record

      return data ? {
        id: data.id,
        sourceId: data.source_id,
        status: data.status,
        scheduledAt: data.scheduled_at,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        itemsFetched: data.items_fetched,
        itemsCreated: data.items_created,
        itemsUpdated: data.items_updated,
        itemsRemoved: data.items_removed,
        itemsFailed: data.items_failed,
        errors: data.errors,
        triggeredBy: data.triggered_by,
        triggeredByUserId: data.triggered_by_user_id,
      } : null;
    } catch (error) {
      console.error('Error triggering sync:', error);
      return null;
    }
  },

  // Get sync jobs for a source
  async getSyncJobs(sourceId: string, limit: number = 20): Promise<SyncJob[]> {
    try {
      const { data, error } = await supabase
        .from('sync_jobs')
        .select('*')
        .eq('source_id', sourceId)
        .order('scheduled_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(d => ({
        id: d.id,
        sourceId: d.source_id,
        status: d.status,
        scheduledAt: d.scheduled_at,
        startedAt: d.started_at,
        completedAt: d.completed_at,
        itemsFetched: d.items_fetched,
        itemsCreated: d.items_created,
        itemsUpdated: d.items_updated,
        itemsRemoved: d.items_removed,
        itemsFailed: d.items_failed,
        errors: d.errors,
        triggeredBy: d.triggered_by,
        triggeredByUserId: d.triggered_by_user_id,
      }));
    } catch (error) {
      console.error('Error fetching sync jobs:', error);
      return [];
    }
  },

  // Approve a listing
  async approveListing(listingId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Update listing status
      const { error: updateError } = await supabase
        .from('federated_listings')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', listingId);

      if (updateError) throw updateError;

      // Log moderation action
      await supabase
        .from('listing_moderation_actions')
        .insert({
          listing_id: listingId,
          action: 'approve',
          moderator_id: user.id,
        });

      return true;
    } catch (error) {
      console.error('Error approving listing:', error);
      return false;
    }
  },

  // Reject a listing
  async rejectListing(listingId: string, reason: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Update listing status
      const { error: updateError } = await supabase
        .from('federated_listings')
        .update({ status: 'removed', updated_at: new Date().toISOString() })
        .eq('id', listingId);

      if (updateError) throw updateError;

      // Log moderation action
      await supabase
        .from('listing_moderation_actions')
        .insert({
          listing_id: listingId,
          action: 'reject',
          reason,
          moderator_id: user.id,
        });

      return true;
    } catch (error) {
      console.error('Error rejecting listing:', error);
      return false;
    }
  },

  // Feature a listing
  async featureListing(listingId: string, featured: boolean): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('federated_listings')
        .update({
          is_featured: featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', listingId);

      if (error) throw error;

      // Log moderation action
      await supabase
        .from('listing_moderation_actions')
        .insert({
          listing_id: listingId,
          action: 'feature',
          moderator_id: user.id,
        });

      return true;
    } catch (error) {
      console.error('Error featuring listing:', error);
      return false;
    }
  },

  // Grant partner portal access
  async grantPartnerAccess(
    sourceId: string,
    userId: string,
    permissions: Partial<PartnerPortalAccess>
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('partner_portal_access')
        .insert({
          source_id: sourceId,
          user_id: userId,
          can_view_listings: permissions.canViewListings ?? true,
          can_create_listings: permissions.canCreateListings ?? false,
          can_edit_listings: permissions.canEditListings ?? false,
          can_delete_listings: permissions.canDeleteListings ?? false,
          can_view_analytics: permissions.canViewAnalytics ?? false,
          can_manage_settings: permissions.canManageSettings ?? false,
          can_invite_users: permissions.canInviteUsers ?? false,
          max_active_listings: permissions.maxActiveListings,
          max_featured_listings: permissions.maxFeaturedListings ?? 0,
          status: 'pending',
          invited_by: user.id,
          invited_at: new Date().toISOString(),
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error granting partner access:', error);
      return false;
    }
  },
};

// ===========================================
// TRANSFORMATION HELPERS
// ===========================================

function transformDBListing(db: Record<string, unknown>): FederatedListing {
  const source = db.source as Record<string, unknown> | null;

  return {
    id: db.id as string,
    sourceId: db.source_id as string,
    externalId: db.external_id as string,
    contentType: db.content_type as FederatedListing['contentType'],

    title: db.title as string,
    description: db.description as string,
    shortDescription: db.short_description as string | undefined,

    sourceUrl: db.source_url as string,
    sourceName: source?.name as string || db.source_name as string,
    sourceLogoUrl: source?.logo_url as string || db.source_logo_url as string | undefined,
    attributionHtml: db.attribution_html as string | undefined,

    organizationName: db.organization_name as string,
    organizationLogoUrl: db.organization_logo_url as string | undefined,
    organizationType: db.organization_type as FederatedSourceType | undefined,

    location: db.location as string | undefined,
    city: db.city as string | undefined,
    state: db.state as string | undefined,
    country: db.country as string | undefined,
    isRemote: db.is_remote as boolean | undefined,

    industries: (db.industries as string[]) || [],
    skills: (db.skills as string[]) || [],
    tags: (db.tags as string[]) || [],
    clearanceRequired: db.clearance_required as string | undefined,

    jobType: db.job_type as string | undefined,
    salaryMin: db.salary_min as number | undefined,
    salaryMax: db.salary_max as number | undefined,
    salaryCurrency: db.salary_currency as string | undefined,
    salaryPeriod: db.salary_period as 'hourly' | 'monthly' | 'yearly' | undefined,
    experienceLevel: db.experience_level as string | undefined,
    educationRequired: db.education_required as string | undefined,

    prizeAmount: db.prize_amount as number | undefined,
    registrationDeadline: db.registration_deadline as string | undefined,
    submissionDeadline: db.submission_deadline as string | undefined,
    challengeType: db.challenge_type as string | undefined,

    eventDate: db.event_date as string | undefined,
    eventEndDate: db.event_end_date as string | undefined,
    eventType: db.event_type as string | undefined,
    isVirtual: db.is_virtual as boolean | undefined,
    registrationUrl: db.event_registration_url as string | undefined,

    postedAt: db.posted_at as string,
    expiresAt: db.expires_at as string | undefined,

    syncedAt: db.synced_at as string,
    lastUpdatedAt: db.last_updated_at as string,
    checksum: db.checksum as string | undefined,

    status: db.status as FederatedListing['status'],
    viewCount: db.view_count as number,
    clickThroughCount: db.click_through_count as number,
    saveCount: db.save_count as number,
    isFeatured: db.is_featured as boolean,
    qualityScore: db.quality_score as number | undefined,
    relevanceBoost: db.relevance_boost as number | undefined,

    createdAt: db.created_at as string,
    updatedAt: db.updated_at as string,
  };
}

function transformDBSource(db: Record<string, unknown>): FederatedSource {
  return {
    id: db.id as string,
    name: db.name as string,
    shortName: db.short_name as string,
    type: db.type as FederatedSourceType,
    description: db.description as string | undefined,

    website: db.website as string,
    logoUrl: db.logo_url as string | undefined,
    contactEmail: db.contact_email as string | undefined,
    contactName: db.contact_name as string | undefined,

    integrationMethod: db.integration_method as IntegrationMethod,
    syncFrequency: db.sync_frequency as FederatedSource['syncFrequency'],
    apiConfig: db.api_config as FederatedSource['apiConfig'],
    rssConfig: db.rss_config as FederatedSource['rssConfig'],

    providesJobs: db.provides_jobs as boolean,
    providesInternships: db.provides_internships as boolean,
    providesChallenges: db.provides_challenges as boolean,
    providesEvents: db.provides_events as boolean,
    providesScholarships: db.provides_scholarships as boolean,

    industries: (db.industries as string[]) || [],
    defaultClearanceLevel: db.default_clearance_level as string | undefined,
    geographicFocus: (db.geographic_focus as string[]) || [],

    status: db.status as FederatedSource['status'],
    partnershipTier: db.partnership_tier as FederatedSource['partnershipTier'],
    isOfficialPartner: db.is_official_partner as boolean,
    canDirectPost: db.can_direct_post as boolean,

    termsAccepted: db.terms_accepted as boolean,
    attributionRequired: db.attribution_required as boolean,
    attributionText: db.attribution_text as string | undefined,
    dataUsagePermission: db.data_usage_permission as FederatedSource['dataUsagePermission'],

    lastSyncAt: db.last_sync_at as string | undefined,
    lastSuccessfulSyncAt: db.last_successful_sync_at as string | undefined,
    syncErrorCount: db.sync_error_count as number,
    totalItemsSynced: db.total_items_synced as number,

    createdAt: db.created_at as string,
    updatedAt: db.updated_at as string,
  };
}

// ===========================================
// EXPORT
// ===========================================

export const federationApi = {
  listings: federatedListingsApi,
  saves: federatedSavesApi,
  sources: federatedSourcesApi,
  partner: partnerPortalApi,
  admin: federationAdminApi,
};

export default federationApi;
