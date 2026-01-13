// ===========================================
// Events Platform API Service Layer
// Complete backend integration for Events pages
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  Event,
  EventType,
  EventCategory,
  EventStatus,
  EventFilters,
  EventsQueryResult,
  EventRegistration,
  EventRegistrationStatus,
  EventFeedback,
  IndustryType,
  ClearanceLevel,
} from '@/types';

// ===========================================
// Database Types (matching schema)
// ===========================================

export interface DBEvent {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  short_description: string | null;
  type: EventType;
  category: EventCategory;
  start_date: string;
  end_date: string | null;
  timezone: string;
  all_day: boolean;
  location_type: 'in-person' | 'virtual' | 'hybrid';
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  venue_state: string | null;
  venue_zip_code: string | null;
  venue_country: string;
  venue_coordinates: { lat: number; lng: number } | null;
  venue_parking_info: string | null;
  venue_accessibility_info: string | null;
  virtual_url: string | null;
  virtual_platform: 'zoom' | 'teams' | 'webex' | 'meet' | 'custom' | null;
  virtual_platform_details: string | null;
  organizer_id: string | null;
  capacity: number | null;
  attendees_count: number;
  waitlist_count: number;
  waitlist_enabled: boolean;
  registration_required: boolean;
  registration_url: string | null;
  registration_deadline: string | null;
  is_free: boolean;
  registration_fee: number;
  early_bird_fee: number | null;
  early_bird_deadline: string | null;
  vip_fee: number | null;
  student_fee: number | null;
  member_fee: number | null;
  industries: IndustryType[];
  clearance_required: ClearanceLevel | null;
  us_citizens_only: boolean;
  image: string | null;
  banner_image: string | null;
  thumbnail_image: string | null;
  tags: string[];
  skills: string[];
  target_audience: string[];
  experience_levels: string[];
  recording_url: string | null;
  slides_url: string | null;
  materials_url: string | null;
  photo_gallery_url: string | null;
  related_job_ids: string[];
  related_training_ids: string[];
  related_event_ids: string[];
  status: EventStatus;
  visibility: 'public' | 'private' | 'invite-only' | 'members-only';
  featured: boolean;
  featured_rank: number | null;
  homepage_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  views: number;
  shares: number;
  saves: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  series_id: string | null;
  series_occurrence: number | null;
}

export interface DBEventOrganizer {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  type: 'company' | 'university' | 'government' | 'nonprofit' | 'national-lab' | 'consortium' | 'professional-org';
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  description: string | null;
  linkedin_url: string | null;
  twitter_handle: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string;
  events_hosted: number;
  total_attendees: number;
  rating_avg: number | null;
  rating_count: number;
  verified: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBEventSponsor {
  id: string;
  event_id: string;
  name: string;
  logo: string | null;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner' | 'media' | 'community';
  website: string | null;
  description: string | null;
  booth_number: string | null;
  booth_location: string | null;
  recruiting_positions: string[] | null;
  contact_name: string | null;
  contact_email: string | null;
  display_order: number;
  created_at: string;
}

export interface DBEventSpeaker {
  id: string;
  event_id: string;
  name: string;
  title: string | null;
  company: string | null;
  photo: string | null;
  bio: string | null;
  linkedin_url: string | null;
  twitter_handle: string | null;
  website: string | null;
  session_title: string | null;
  session_description: string | null;
  session_time: string | null;
  session_end_time: string | null;
  session_track: string | null;
  session_room: string | null;
  speaker_type: 'keynote' | 'speaker' | 'panelist' | 'moderator' | 'host' | 'mc' | 'instructor';
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface DBEventAgendaItem {
  id: string;
  event_id: string;
  start_time: string;
  end_time: string | null;
  day_number: number;
  title: string;
  description: string | null;
  type: 'keynote' | 'session' | 'break' | 'networking' | 'workshop' | 'panel' | 'demo' | 'registration' | 'lunch' | 'reception' | 'other';
  room: string | null;
  track: string | null;
  speaker_id: string | null;
  additional_speakers: string[];
  display_order: number;
  show_in_schedule: boolean;
  created_at: string;
}

export interface DBEventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: EventRegistrationStatus;
  ticket_type: string;
  payment_status: 'pending' | 'completed' | 'refunded' | 'waived' | 'free' | null;
  payment_amount: number | null;
  payment_date: string | null;
  payment_reference: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  check_in_code: string;
  guest_name: string | null;
  guest_email: string | null;
  dietary_requirements: string | null;
  accessibility_needs: string | null;
  t_shirt_size: string | null;
  custom_responses: Record<string, unknown>;
  confirmation_sent: boolean;
  reminder_sent: boolean;
  follow_up_sent: boolean;
  registered_at: string;
  waitlisted_at: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
}

export interface DBEventSave {
  id: string;
  event_id: string;
  user_id: string;
  reminder_set: boolean;
  reminder_time: string | null;
  notes: string | null;
  created_at: string;
}

export interface DBEventFeedback {
  id: string;
  event_id: string;
  user_id: string;
  overall_rating: number | null;
  content_rating: number | null;
  organization_rating: number | null;
  venue_rating: number | null;
  speakers_rating: number | null;
  networking_rating: number | null;
  value_rating: number | null;
  would_recommend: boolean | null;
  net_promoter_score: number | null;
  highlights: string | null;
  improvements: string | null;
  testimonial: string | null;
  testimonial_approved: boolean;
  can_use_publicly: boolean;
  submitted_at: string;
}

// ===========================================
// Transform functions (DB to App types)
// ===========================================

function transformDBEventToEvent(
  dbEvent: DBEvent & { organizer?: DBEventOrganizer | null }
): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    slug: dbEvent.slug || dbEvent.id,
    description: dbEvent.description || '',
    shortDescription: dbEvent.short_description || '',
    type: dbEvent.type,
    category: dbEvent.category,
    date: dbEvent.start_date,
    endDate: dbEvent.end_date || undefined,
    timezone: dbEvent.timezone,
    location: dbEvent.location_type === 'virtual'
      ? 'Virtual Event'
      : dbEvent.venue_city && dbEvent.venue_state
        ? `${dbEvent.venue_city}, ${dbEvent.venue_state}`
        : dbEvent.venue_name || 'TBD',
    venue: dbEvent.venue_name ? {
      name: dbEvent.venue_name,
      address: dbEvent.venue_address || '',
      city: dbEvent.venue_city || '',
      state: dbEvent.venue_state || '',
      zipCode: dbEvent.venue_zip_code || '',
      country: dbEvent.venue_country,
      coordinates: dbEvent.venue_coordinates || undefined,
      parkingInfo: dbEvent.venue_parking_info || undefined,
      accessibilityInfo: dbEvent.venue_accessibility_info || undefined,
    } : undefined,
    virtual: dbEvent.location_type !== 'in-person',
    virtualUrl: dbEvent.virtual_url || undefined,
    virtualPlatform: dbEvent.virtual_platform || undefined,
    capacity: dbEvent.capacity || 0,
    attendeesCount: dbEvent.attendees_count,
    waitlistCount: dbEvent.waitlist_count,
    organizer: dbEvent.organizer ? {
      id: dbEvent.organizer.id,
      name: dbEvent.organizer.name,
      logo: dbEvent.organizer.logo || undefined,
      type: dbEvent.organizer.type,
      website: dbEvent.organizer.website || undefined,
      contactEmail: dbEvent.organizer.contact_email || undefined,
    } : {
      id: '',
      name: 'STEMWORKFORCE',
      type: 'consortium',
    },
    industries: dbEvent.industries,
    clearanceRequired: dbEvent.clearance_required || undefined,
    image: dbEvent.image || undefined,
    bannerImage: dbEvent.banner_image || undefined,
    registrationDeadline: dbEvent.registration_deadline || dbEvent.start_date,
    registrationFee: dbEvent.registration_fee,
    isFree: dbEvent.is_free,
    earlyBirdDeadline: dbEvent.early_bird_deadline || undefined,
    earlyBirdFee: dbEvent.early_bird_fee || undefined,
    status: dbEvent.status,
    tags: dbEvent.tags,
    recordingUrl: dbEvent.recording_url || undefined,
    slidesUrl: dbEvent.slides_url || undefined,
    materialsUrl: dbEvent.materials_url || undefined,
    createdAt: dbEvent.created_at,
    updatedAt: dbEvent.updated_at,
    featuredRank: dbEvent.featured_rank || undefined,
  };
}

function transformDBRegistrationToRegistration(
  dbReg: DBEventRegistration
): EventRegistration {
  return {
    id: dbReg.id,
    eventId: dbReg.event_id,
    userId: dbReg.user_id,
    registeredAt: dbReg.registered_at,
    status: dbReg.status,
    ticketType: dbReg.ticket_type,
    paymentStatus: dbReg.payment_status || undefined,
    paymentAmount: dbReg.payment_amount || undefined,
    checkedInAt: dbReg.checked_in_at || undefined,
    dietaryRequirements: dbReg.dietary_requirements || undefined,
    accessibilityNeeds: dbReg.accessibility_needs || undefined,
    questions: dbReg.custom_responses as Record<string, string>,
    reminderSent: dbReg.reminder_sent,
    feedbackSubmitted: false, // Will be determined separately if needed
  };
}

// ===========================================
// Events API
// ===========================================

export const eventsApi = {
  // List events with filters
  async list(filters?: EventFilters, page = 1, pageSize = 12): Promise<EventsQueryResult> {
    let query = supabase
      .from('events')
      .select('*, organizer:event_organizers(*)', { count: 'exact' })
      .eq('visibility', 'public')
      .neq('status', 'draft');

    // Apply filters
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    if (filters?.types && filters.types.length > 0) {
      query = query.in('type', filters.types);
    }

    if (filters?.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }

    if (filters?.industries && filters.industries.length > 0) {
      query = query.overlaps('industries', filters.industries);
    }

    if (filters?.dateFrom) {
      query = query.gte('start_date', filters.dateFrom);
    } else {
      // Default to upcoming events
      query = query.gte('start_date', new Date().toISOString());
    }

    if (filters?.dateTo) {
      query = query.lte('start_date', filters.dateTo);
    }

    if (filters?.virtual === true) {
      query = query.in('location_type', ['virtual', 'hybrid']);
    }

    if (filters?.inPerson === true) {
      query = query.in('location_type', ['in-person', 'hybrid']);
    }

    if (filters?.free === true) {
      query = query.eq('is_free', true);
    }

    if (filters?.clearanceRequired) {
      query = query.eq('clearance_required', filters.clearanceRequired);
    }

    if (filters?.location) {
      query = query.or(`venue_city.ilike.%${filters.location}%,venue_state.ilike.%${filters.location}%`);
    }

    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('start_date', { ascending: true })
      .range(from, to);

    if (error) throw error;

    const events = (data || []).map((e) =>
      transformDBEventToEvent(e as DBEvent & { organizer?: DBEventOrganizer })
    );

    return {
      events,
      total: count || 0,
      page,
      pageSize,
      hasMore: count ? page * pageSize < count : false,
    };
  },

  // Get single event by ID or slug
  async get(idOrSlug: string): Promise<Event | null> {
    // Try by ID first
    let { data, error } = await supabase
      .from('events')
      .select('*, organizer:event_organizers(*)')
      .eq('id', idOrSlug)
      .single();

    // If not found, try by slug
    if (error && error.code === 'PGRST116') {
      const slugResult = await supabase
        .from('events')
        .select('*, organizer:event_organizers(*)')
        .eq('slug', idOrSlug)
        .single();

      data = slugResult.data;
      error = slugResult.error;
    }

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    // Increment view count
    await supabase
      .from('events')
      .update({ views: (data as DBEvent).views + 1 })
      .eq('id', data.id);

    return transformDBEventToEvent(data as DBEvent & { organizer?: DBEventOrganizer });
  },

  // Get featured events
  async getFeatured(limit = 6): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:event_organizers(*)')
      .eq('featured', true)
      .eq('visibility', 'public')
      .in('status', ['upcoming', 'registration-closed'])
      .gte('start_date', new Date().toISOString())
      .order('featured_rank', { ascending: true, nullsFirst: false })
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((e) =>
      transformDBEventToEvent(e as DBEvent & { organizer?: DBEventOrganizer })
    );
  },

  // Get events by category
  async getByCategory(category: EventCategory, limit = 12): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:event_organizers(*)')
      .eq('category', category)
      .eq('visibility', 'public')
      .neq('status', 'draft')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((e) =>
      transformDBEventToEvent(e as DBEvent & { organizer?: DBEventOrganizer })
    );
  },

  // Get events by type
  async getByType(type: EventType, limit = 12): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:event_organizers(*)')
      .eq('type', type)
      .eq('visibility', 'public')
      .neq('status', 'draft')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((e) =>
      transformDBEventToEvent(e as DBEvent & { organizer?: DBEventOrganizer })
    );
  },

  // Get events by industry
  async getByIndustry(industry: IndustryType, limit = 12): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:event_organizers(*)')
      .contains('industries', [industry])
      .eq('visibility', 'public')
      .neq('status', 'draft')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((e) =>
      transformDBEventToEvent(e as DBEvent & { organizer?: DBEventOrganizer })
    );
  },

  // Get related events
  async getRelated(eventId: string, limit = 4): Promise<Event[]> {
    // First get the current event to find its industries and category
    const { data: currentEvent } = await supabase
      .from('events')
      .select('industries, category, type')
      .eq('id', eventId)
      .single();

    if (!currentEvent) return [];

    // Find related events by industry or category
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:event_organizers(*)')
      .neq('id', eventId)
      .eq('visibility', 'public')
      .neq('status', 'draft')
      .gte('start_date', new Date().toISOString())
      .or(`category.eq.${currentEvent.category},industries.ov.{${(currentEvent.industries || []).join(',')}}`)
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((e) =>
      transformDBEventToEvent(e as DBEvent & { organizer?: DBEventOrganizer })
    );
  },

  // Get event sponsors
  async getSponsors(eventId: string): Promise<DBEventSponsor[]> {
    const { data, error } = await supabase
      .from('event_sponsors')
      .select('*')
      .eq('event_id', eventId)
      .order('tier', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get event speakers
  async getSpeakers(eventId: string): Promise<DBEventSpeaker[]> {
    const { data, error } = await supabase
      .from('event_speakers')
      .select('*')
      .eq('event_id', eventId)
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get event agenda
  async getAgenda(eventId: string): Promise<DBEventAgendaItem[]> {
    const { data, error } = await supabase
      .from('event_agenda_items')
      .select('*')
      .eq('event_id', eventId)
      .eq('show_in_schedule', true)
      .order('day_number', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

// ===========================================
// Event Registration API
// ===========================================

export const eventRegistrationApi = {
  // Register for an event
  async register(
    eventId: string,
    options?: {
      ticketType?: string;
      guestName?: string;
      guestEmail?: string;
      dietaryRequirements?: string;
      accessibilityNeeds?: string;
      tShirtSize?: string;
      customResponses?: Record<string, unknown>;
    }
  ): Promise<EventRegistration> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if already registered
    const { data: existing } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      throw new Error('Already registered for this event');
    }

    // Check capacity
    const { data: event } = await supabase
      .from('events')
      .select('capacity, attendees_count, waitlist_enabled, is_free, registration_fee')
      .eq('id', eventId)
      .single();

    if (!event) throw new Error('Event not found');

    const isFull = event.capacity && event.attendees_count >= event.capacity;
    const status: EventRegistrationStatus = isFull && event.waitlist_enabled ? 'waitlisted' : 'registered';

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status,
        ticket_type: options?.ticketType || 'general',
        payment_status: event.is_free ? 'free' : 'pending',
        payment_amount: event.is_free ? 0 : event.registration_fee,
        guest_name: options?.guestName,
        guest_email: options?.guestEmail,
        dietary_requirements: options?.dietaryRequirements,
        accessibility_needs: options?.accessibilityNeeds,
        t_shirt_size: options?.tShirtSize,
        custom_responses: options?.customResponses || {},
        waitlisted_at: status === 'waitlisted' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return transformDBRegistrationToRegistration(data as DBEventRegistration);
  },

  // Cancel registration
  async cancel(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('event_registrations')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Get user's registration for an event
  async getRegistration(eventId: string): Promise<EventRegistration | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return transformDBRegistrationToRegistration(data as DBEventRegistration);
  },

  // Get all user registrations
  async getUserRegistrations(): Promise<(EventRegistration & { event?: Event })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, event:events(*, organizer:event_organizers(*))')
      .eq('user_id', user.id)
      .order('registered_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((reg) => ({
      ...transformDBRegistrationToRegistration(reg as DBEventRegistration),
      event: reg.event
        ? transformDBEventToEvent(reg.event as DBEvent & { organizer?: DBEventOrganizer })
        : undefined,
    }));
  },

  // Get upcoming registered events
  async getUpcomingRegistrations(): Promise<(EventRegistration & { event: Event })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, event:events(*, organizer:event_organizers(*))')
      .eq('user_id', user.id)
      .in('status', ['registered', 'confirmed'])
      .gte('event.start_date', new Date().toISOString())
      .order('event(start_date)', { ascending: true });

    if (error) throw error;

    return (data || [])
      .filter((reg) => reg.event) // Filter out any without event data
      .map((reg) => ({
        ...transformDBRegistrationToRegistration(reg as DBEventRegistration),
        event: transformDBEventToEvent(reg.event as DBEvent & { organizer?: DBEventOrganizer }),
      }));
  },

  // Check if user is registered for an event
  async isRegistered(eventId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .in('status', ['registered', 'confirmed', 'waitlisted'])
      .single();

    return !!data;
  },
};

// ===========================================
// Event Saves/Bookmarks API
// ===========================================

export const eventSavesApi = {
  // Save an event
  async save(eventId: string, options?: { notes?: string; reminderTime?: string }): Promise<DBEventSave> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('event_saves')
      .upsert({
        event_id: eventId,
        user_id: user.id,
        notes: options?.notes,
        reminder_set: !!options?.reminderTime,
        reminder_time: options?.reminderTime,
      })
      .select()
      .single();

    if (error) throw error;
    return data as DBEventSave;
  },

  // Unsave an event
  async unsave(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('event_saves')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Get saved events
  async getSavedEvents(): Promise<(DBEventSave & { event: Event })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('event_saves')
      .select('*, event:events(*, organizer:event_organizers(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || [])
      .filter((save) => save.event)
      .map((save) => ({
        ...(save as DBEventSave),
        event: transformDBEventToEvent(save.event as DBEvent & { organizer?: DBEventOrganizer }),
      }));
  },

  // Check if event is saved
  async isSaved(eventId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('event_saves')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    return !!data;
  },
};

// ===========================================
// Event Feedback API
// ===========================================

export const eventFeedbackApi = {
  // Submit feedback
  async submit(eventId: string, feedback: Partial<EventFeedback>): Promise<DBEventFeedback> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('event_feedback')
      .upsert({
        event_id: eventId,
        user_id: user.id,
        overall_rating: feedback.rating,
        content_rating: feedback.contentRating,
        organization_rating: feedback.organizationRating,
        venue_rating: feedback.venueRating,
        speakers_rating: feedback.speakersRating,
        networking_rating: feedback.networkingRating,
        would_recommend: feedback.wouldRecommend,
        highlights: feedback.highlights,
        improvements: feedback.improvements,
      })
      .select()
      .single();

    if (error) throw error;
    return data as DBEventFeedback;
  },

  // Get user's feedback for an event
  async getFeedback(eventId: string): Promise<DBEventFeedback | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('event_feedback')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as DBEventFeedback | null;
  },

  // Get event testimonials (public)
  async getTestimonials(eventId: string): Promise<DBEventFeedback[]> {
    const { data, error } = await supabase
      .from('event_feedback')
      .select('*')
      .eq('event_id', eventId)
      .eq('testimonial_approved', true)
      .eq('can_use_publicly', true)
      .not('testimonial', 'is', null)
      .order('overall_rating', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data as DBEventFeedback[];
  },
};

// ===========================================
// Event Organizers API
// ===========================================

export const eventOrganizersApi = {
  // Get all organizers
  async list(): Promise<DBEventOrganizer[]> {
    const { data, error } = await supabase
      .from('event_organizers')
      .select('*')
      .eq('active', true)
      .order('events_hosted', { ascending: false });

    if (error) throw error;
    return data as DBEventOrganizer[];
  },

  // Get single organizer
  async get(id: string): Promise<DBEventOrganizer | null> {
    const { data, error } = await supabase
      .from('event_organizers')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as DBEventOrganizer | null;
  },

  // Get organizer's events
  async getEvents(organizerId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:event_organizers(*)')
      .eq('organizer_id', organizerId)
      .eq('visibility', 'public')
      .neq('status', 'draft')
      .order('start_date', { ascending: true });

    if (error) throw error;

    return (data || []).map((e) =>
      transformDBEventToEvent(e as DBEvent & { organizer?: DBEventOrganizer })
    );
  },
};

// ===========================================
// Export combined API
// ===========================================

export const eventsService = {
  events: eventsApi,
  registrations: eventRegistrationApi,
  saves: eventSavesApi,
  feedback: eventFeedbackApi,
  organizers: eventOrganizersApi,
};
