-- ===========================================
-- Events Platform Database Schema
-- Migration: 032_events_platform_schema.sql
-- Comprehensive backend for Events pages
-- ===========================================

-- ===========================================
-- EVENT ORGANIZERS
-- ===========================================

CREATE TABLE IF NOT EXISTS event_organizers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    logo TEXT,
    type TEXT CHECK (type IN ('company', 'university', 'government', 'nonprofit', 'national-lab', 'consortium', 'professional-org')),
    website TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    description TEXT,

    -- Social
    linkedin_url TEXT,
    twitter_handle TEXT,

    -- Address
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',

    -- Stats
    events_hosted INTEGER DEFAULT 0,
    total_attendees INTEGER DEFAULT 0,
    rating_avg DECIMAL(3,2),
    rating_count INTEGER DEFAULT 0,

    -- Metadata
    verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_organizers_name_trgm ON event_organizers USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_event_organizers_type ON event_organizers(type);

-- ===========================================
-- EVENTS
-- ===========================================

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    short_description TEXT,

    -- Type & Category
    type TEXT CHECK (type IN ('career-fair', 'conference', 'networking', 'workshop', 'webinar', 'hackathon', 'bootcamp', 'info-session', 'recruiting', 'training', 'panel', 'meetup')),
    category TEXT CHECK (category IN ('career-events', 'industry-conferences', 'training-development', 'partner-employer', 'student-events', 'clearance-events')),

    -- Date & Time
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    timezone TEXT DEFAULT 'America/New_York',
    all_day BOOLEAN DEFAULT FALSE,

    -- Location (Physical)
    location_type TEXT CHECK (location_type IN ('in-person', 'virtual', 'hybrid')) DEFAULT 'in-person',
    venue_name TEXT,
    venue_address TEXT,
    venue_city TEXT,
    venue_state TEXT,
    venue_zip_code TEXT,
    venue_country TEXT DEFAULT 'USA',
    venue_coordinates JSONB, -- {lat: number, lng: number}
    venue_parking_info TEXT,
    venue_accessibility_info TEXT,

    -- Location (Virtual)
    virtual_url TEXT,
    virtual_platform TEXT CHECK (virtual_platform IN ('zoom', 'teams', 'webex', 'meet', 'custom', NULL)),
    virtual_platform_details TEXT,

    -- Organizer
    organizer_id UUID REFERENCES event_organizers(id),

    -- Capacity & Registration
    capacity INTEGER,
    attendees_count INTEGER DEFAULT 0,
    waitlist_count INTEGER DEFAULT 0,
    waitlist_enabled BOOLEAN DEFAULT TRUE,
    registration_required BOOLEAN DEFAULT TRUE,
    registration_url TEXT,
    registration_deadline TIMESTAMPTZ,

    -- Pricing
    is_free BOOLEAN DEFAULT TRUE,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    early_bird_fee DECIMAL(10,2),
    early_bird_deadline TIMESTAMPTZ,
    vip_fee DECIMAL(10,2),
    student_fee DECIMAL(10,2),
    member_fee DECIMAL(10,2),

    -- STEM Industry Tags
    industries TEXT[] DEFAULT '{}',

    -- Security Clearance
    clearance_required TEXT CHECK (clearance_required IN ('none', 'public-trust', 'secret', 'top-secret', 'top-secret-sci', NULL)),
    us_citizens_only BOOLEAN DEFAULT FALSE,

    -- Images
    image TEXT,
    banner_image TEXT,
    thumbnail_image TEXT,

    -- Content
    tags TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    target_audience TEXT[] DEFAULT '{}', -- ['students', 'professionals', 'executives', 'educators']
    experience_levels TEXT[] DEFAULT '{}', -- ['entry', 'mid', 'senior', 'all']

    -- Post-Event Resources
    recording_url TEXT,
    slides_url TEXT,
    materials_url TEXT,
    photo_gallery_url TEXT,

    -- Related Content
    related_job_ids UUID[] DEFAULT '{}',
    related_training_ids UUID[] DEFAULT '{}',
    related_event_ids UUID[] DEFAULT '{}',

    -- Status & Visibility
    status TEXT CHECK (status IN ('draft', 'upcoming', 'registration-closed', 'ongoing', 'completed', 'cancelled', 'postponed')) DEFAULT 'draft',
    visibility TEXT CHECK (visibility IN ('public', 'private', 'invite-only', 'members-only')) DEFAULT 'public',

    -- Feature & Ranking
    featured BOOLEAN DEFAULT FALSE,
    featured_rank INTEGER,
    homepage_featured BOOLEAN DEFAULT FALSE,

    -- SEO
    meta_title TEXT,
    meta_description TEXT,

    -- Engagement Stats
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,

    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for event search and filtering
CREATE INDEX IF NOT EXISTS idx_events_title_trgm ON events USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(venue_city, venue_state);
CREATE INDEX IF NOT EXISTS idx_events_industries ON events USING gin(industries);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_clearance ON events(clearance_required);

-- ===========================================
-- EVENT SPONSORS
-- ===========================================

CREATE TABLE IF NOT EXISTS event_sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,

    -- Sponsor Info
    name TEXT NOT NULL,
    logo TEXT,
    tier TEXT CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze', 'partner', 'media', 'community')),
    website TEXT,
    description TEXT,

    -- Booth Info (for career fairs)
    booth_number TEXT,
    booth_location TEXT,
    recruiting_positions TEXT[],

    -- Contact
    contact_name TEXT,
    contact_email TEXT,

    -- Display Order
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_sponsors_event ON event_sponsors(event_id);
CREATE INDEX IF NOT EXISTS idx_event_sponsors_tier ON event_sponsors(tier);

-- ===========================================
-- EVENT SPEAKERS
-- ===========================================

CREATE TABLE IF NOT EXISTS event_speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,

    -- Speaker Info
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    photo TEXT,
    bio TEXT,

    -- Social Links
    linkedin_url TEXT,
    twitter_handle TEXT,
    website TEXT,

    -- Session Info
    session_title TEXT,
    session_description TEXT,
    session_time TIMESTAMPTZ,
    session_end_time TIMESTAMPTZ,
    session_track TEXT,
    session_room TEXT,

    -- Role
    speaker_type TEXT CHECK (speaker_type IN ('keynote', 'speaker', 'panelist', 'moderator', 'host', 'mc', 'instructor')),
    is_featured BOOLEAN DEFAULT FALSE,

    -- Display Order
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_speakers_event ON event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_speakers_type ON event_speakers(speaker_type);

-- ===========================================
-- EVENT AGENDA ITEMS
-- ===========================================

CREATE TABLE IF NOT EXISTS event_agenda_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,

    -- Timing
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    day_number INTEGER DEFAULT 1, -- For multi-day events

    -- Content
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('keynote', 'session', 'break', 'networking', 'workshop', 'panel', 'demo', 'registration', 'lunch', 'reception', 'other')),

    -- Location
    room TEXT,
    track TEXT,

    -- Speaker
    speaker_id UUID REFERENCES event_speakers(id),
    additional_speakers UUID[] DEFAULT '{}', -- For panels

    -- Display
    display_order INTEGER DEFAULT 0,
    show_in_schedule BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_agenda_event ON event_agenda_items(event_id);
CREATE INDEX IF NOT EXISTS idx_event_agenda_time ON event_agenda_items(start_time);

-- ===========================================
-- EVENT REGISTRATIONS
-- ===========================================

CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Registration Info
    status TEXT CHECK (status IN ('registered', 'waitlisted', 'confirmed', 'attended', 'cancelled', 'no-show')) DEFAULT 'registered',
    ticket_type TEXT DEFAULT 'general', -- general, vip, student, member, etc.

    -- Payment
    payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'refunded', 'waived', 'free', NULL)),
    payment_amount DECIMAL(10,2),
    payment_date TIMESTAMPTZ,
    payment_reference TEXT,

    -- Check-in
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    check_in_code TEXT UNIQUE,

    -- Guest Info (for +1 registrations)
    guest_name TEXT,
    guest_email TEXT,

    -- Preferences
    dietary_requirements TEXT,
    accessibility_needs TEXT,
    t_shirt_size TEXT,

    -- Custom Questions (event-specific)
    custom_responses JSONB DEFAULT '{}',

    -- Communications
    confirmation_sent BOOLEAN DEFAULT FALSE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    follow_up_sent BOOLEAN DEFAULT FALSE,

    -- Timestamps
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    waitlisted_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,

    UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_checkin_code ON event_registrations(check_in_code);

-- ===========================================
-- EVENT SAVED/BOOKMARKED
-- ===========================================

CREATE TABLE IF NOT EXISTS event_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Reminder
    reminder_set BOOLEAN DEFAULT FALSE,
    reminder_time TIMESTAMPTZ,

    -- Notes
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_saves_user ON event_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_event_saves_event ON event_saves(event_id);

-- ===========================================
-- EVENT FEEDBACK/REVIEWS
-- ===========================================

CREATE TABLE IF NOT EXISTS event_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Ratings (1-5)
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    content_rating INTEGER CHECK (content_rating BETWEEN 1 AND 5),
    organization_rating INTEGER CHECK (organization_rating BETWEEN 1 AND 5),
    venue_rating INTEGER CHECK (venue_rating BETWEEN 1 AND 5),
    speakers_rating INTEGER CHECK (speakers_rating BETWEEN 1 AND 5),
    networking_rating INTEGER CHECK (networking_rating BETWEEN 1 AND 5),
    value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),

    -- Would Recommend
    would_recommend BOOLEAN,
    net_promoter_score INTEGER CHECK (net_promoter_score BETWEEN 0 AND 10),

    -- Text Feedback
    highlights TEXT,
    improvements TEXT,
    testimonial TEXT,

    -- Permissions
    testimonial_approved BOOLEAN DEFAULT FALSE,
    can_use_publicly BOOLEAN DEFAULT FALSE,

    -- Metadata
    submitted_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_feedback_event ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_event_feedback_rating ON event_feedback(overall_rating);

-- ===========================================
-- EVENT CUSTOM QUESTIONS
-- ===========================================

CREATE TABLE IF NOT EXISTS event_custom_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,

    -- Question
    question_text TEXT NOT NULL,
    question_type TEXT CHECK (question_type IN ('text', 'textarea', 'select', 'multi-select', 'checkbox', 'radio')),
    options JSONB, -- For select/radio/checkbox types

    -- Validation
    required BOOLEAN DEFAULT FALSE,
    max_length INTEGER,

    -- Display
    display_order INTEGER DEFAULT 0,
    help_text TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_questions_event ON event_custom_questions(event_id);

-- ===========================================
-- EVENT SERIES (Recurring Events)
-- ===========================================

CREATE TABLE IF NOT EXISTS event_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Series Info
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    image TEXT,

    -- Organizer
    organizer_id UUID REFERENCES event_organizers(id),

    -- Recurrence Pattern
    recurrence_type TEXT CHECK (recurrence_type IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annual', 'custom')),
    recurrence_day_of_week INTEGER, -- 0-6 for Sunday-Saturday
    recurrence_day_of_month INTEGER,
    recurrence_month INTEGER,

    -- Status
    active BOOLEAN DEFAULT TRUE,

    -- Stats
    total_events INTEGER DEFAULT 0,
    total_attendees INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add series reference to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES event_series(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS series_occurrence INTEGER; -- Which occurrence in the series

CREATE INDEX IF NOT EXISTS idx_events_series ON events(series_id);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS
ALTER TABLE event_organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_custom_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_series ENABLE ROW LEVEL SECURITY;

-- Public read access for events and related public data
CREATE POLICY "Anyone can view public events" ON events
    FOR SELECT TO authenticated, anon
    USING (visibility = 'public' AND status != 'draft');

CREATE POLICY "Anyone can view event organizers" ON event_organizers
    FOR SELECT TO authenticated, anon
    USING (active = true);

CREATE POLICY "Anyone can view event sponsors" ON event_sponsors
    FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Anyone can view event speakers" ON event_speakers
    FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Anyone can view event agenda" ON event_agenda_items
    FOR SELECT TO authenticated, anon
    USING (show_in_schedule = true);

CREATE POLICY "Anyone can view event series" ON event_series
    FOR SELECT TO authenticated, anon
    USING (active = true);

CREATE POLICY "Anyone can view event questions" ON event_custom_questions
    FOR SELECT TO authenticated, anon
    USING (true);

-- User-specific policies for registrations
CREATE POLICY "Users can view own registrations" ON event_registrations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON event_registrations
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel own registrations" ON event_registrations
    FOR DELETE USING (auth.uid() = user_id);

-- User-specific policies for saves
CREATE POLICY "Users can view own saves" ON event_saves
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save events" ON event_saves
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saves" ON event_saves
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can unsave events" ON event_saves
    FOR DELETE USING (auth.uid() = user_id);

-- User-specific policies for feedback
CREATE POLICY "Users can view own feedback" ON event_feedback
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit feedback" ON event_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feedback" ON event_feedback
    FOR UPDATE USING (auth.uid() = user_id);

-- Public view for approved testimonials
CREATE POLICY "Anyone can view public testimonials" ON event_feedback
    FOR SELECT TO authenticated, anon
    USING (can_use_publicly = true AND testimonial_approved = true);

-- Admin policies
CREATE POLICY "Admins can manage all events" ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

CREATE POLICY "Admins can manage event organizers" ON event_organizers FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

CREATE POLICY "Admins can manage event sponsors" ON event_sponsors FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

CREATE POLICY "Admins can manage event speakers" ON event_speakers FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

CREATE POLICY "Admins can manage event agenda" ON event_agenda_items FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

CREATE POLICY "Admins can manage event registrations" ON event_registrations FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

CREATE POLICY "Admins can manage event feedback" ON event_feedback FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

CREATE POLICY "Admins can manage event series" ON event_series FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

CREATE POLICY "Admins can manage event questions" ON event_custom_questions FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

-- Partner/Organizer policies (partners can manage their own events)
CREATE POLICY "Partners can view own organization events" ON events
    FOR SELECT USING (
        organizer_id IN (
            SELECT eo.id FROM event_organizers eo
            JOIN users u ON u.organization = eo.name
            WHERE u.id = auth.uid()
        )
    );

CREATE POLICY "Partners can manage own organization events" ON events
    FOR ALL USING (
        created_by = auth.uid() OR
        organizer_id IN (
            SELECT eo.id FROM event_organizers eo
            JOIN users u ON u.organization = eo.name
            WHERE u.id = auth.uid() AND u.role IN ('partner', 'educator')
        )
    );

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status = 'registered' OR NEW.status = 'confirmed' THEN
            UPDATE events SET attendees_count = attendees_count + 1 WHERE id = NEW.event_id;
        ELSIF NEW.status = 'waitlisted' THEN
            UPDATE events SET waitlist_count = waitlist_count + 1 WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status != NEW.status THEN
            -- Decrease old count
            IF OLD.status IN ('registered', 'confirmed', 'attended') THEN
                UPDATE events SET attendees_count = GREATEST(attendees_count - 1, 0) WHERE id = OLD.event_id;
            ELSIF OLD.status = 'waitlisted' THEN
                UPDATE events SET waitlist_count = GREATEST(waitlist_count - 1, 0) WHERE id = OLD.event_id;
            END IF;
            -- Increase new count
            IF NEW.status IN ('registered', 'confirmed', 'attended') THEN
                UPDATE events SET attendees_count = attendees_count + 1 WHERE id = NEW.event_id;
            ELSIF NEW.status = 'waitlisted' THEN
                UPDATE events SET waitlist_count = waitlist_count + 1 WHERE id = NEW.event_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.status IN ('registered', 'confirmed', 'attended') THEN
            UPDATE events SET attendees_count = GREATEST(attendees_count - 1, 0) WHERE id = OLD.event_id;
        ELSIF OLD.status = 'waitlisted' THEN
            UPDATE events SET waitlist_count = GREATEST(waitlist_count - 1, 0) WHERE id = OLD.event_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_attendee_count
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendee_count();

-- Update event saves count
CREATE OR REPLACE FUNCTION update_event_saves_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET saves = saves + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET saves = GREATEST(saves - 1, 0) WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_saves_count
    AFTER INSERT OR DELETE ON event_saves
    FOR EACH ROW
    EXECUTE FUNCTION update_event_saves_count();

-- Generate unique check-in code
CREATE OR REPLACE FUNCTION generate_checkin_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_in_code IS NULL THEN
        NEW.check_in_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_checkin_code
    BEFORE INSERT ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION generate_checkin_code();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_event_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_timestamp
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_event_timestamp();

CREATE TRIGGER trigger_update_organizer_timestamp
    BEFORE UPDATE ON event_organizers
    FOR EACH ROW
    EXECUTE FUNCTION update_event_timestamp();

CREATE TRIGGER trigger_update_series_timestamp
    BEFORE UPDATE ON event_series
    FOR EACH ROW
    EXECUTE FUNCTION update_event_timestamp();

-- ===========================================
-- VIEWS FOR COMMON QUERIES
-- ===========================================

-- Upcoming events view
CREATE OR REPLACE VIEW upcoming_events AS
SELECT
    e.*,
    eo.name as organizer_name,
    eo.logo as organizer_logo,
    eo.type as organizer_type,
    (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id AND er.status IN ('registered', 'confirmed')) as registered_count,
    (e.capacity - COALESCE(e.attendees_count, 0)) as spots_available,
    CASE
        WHEN e.capacity IS NOT NULL AND e.attendees_count >= e.capacity THEN TRUE
        ELSE FALSE
    END as is_full,
    CASE
        WHEN e.registration_deadline IS NOT NULL AND NOW() > e.registration_deadline THEN TRUE
        ELSE FALSE
    END as registration_closed
FROM events e
LEFT JOIN event_organizers eo ON e.organizer_id = eo.id
WHERE e.status IN ('upcoming', 'registration-closed')
    AND e.start_date >= NOW()
    AND e.visibility = 'public'
ORDER BY e.start_date ASC;

-- Featured events view
CREATE OR REPLACE VIEW featured_events AS
SELECT
    e.*,
    eo.name as organizer_name,
    eo.logo as organizer_logo
FROM events e
LEFT JOIN event_organizers eo ON e.organizer_id = eo.id
WHERE e.featured = TRUE
    AND e.status IN ('upcoming', 'registration-closed')
    AND e.start_date >= NOW()
    AND e.visibility = 'public'
ORDER BY e.featured_rank ASC, e.start_date ASC
LIMIT 10;

-- User registered events view (requires user context)
CREATE OR REPLACE VIEW user_event_registrations AS
SELECT
    er.*,
    e.title as event_title,
    e.slug as event_slug,
    e.start_date,
    e.end_date,
    e.location_type,
    e.venue_name,
    e.venue_city,
    e.venue_state,
    e.virtual_url,
    e.image,
    e.status as event_status,
    eo.name as organizer_name
FROM event_registrations er
JOIN events e ON er.event_id = e.id
LEFT JOIN event_organizers eo ON e.organizer_id = eo.id
WHERE er.user_id = auth.uid()
ORDER BY e.start_date ASC;
