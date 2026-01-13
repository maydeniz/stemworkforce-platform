-- ===========================================
-- Seed Sample Events Data
-- Migration: 033_seed_sample_events.sql
-- Sample events for development/testing
-- Can be deleted manually from table later
-- ===========================================

-- First, insert sample organizers
INSERT INTO event_organizers (id, name, slug, type, website, description, verified, active)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'STEMWORKFORCE', 'stemworkforce', 'consortium', 'https://stemworkforce.org', 'National consortium for STEM workforce development', TRUE, TRUE),
    ('22222222-2222-2222-2222-222222222222', 'Arizona Commerce Authority', 'arizona-commerce', 'government', 'https://azcommerce.com', 'Arizona state economic development agency', TRUE, TRUE),
    ('33333333-3333-3333-3333-333333333333', 'Intel Corporation', 'intel', 'company', 'https://intel.com', 'Leading semiconductor manufacturing company', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (
    id, title, slug, description, short_description,
    type, category,
    start_date, end_date, timezone,
    location_type, venue_name, venue_address, venue_city, venue_state, venue_zip_code,
    organizer_id, capacity, attendees_count,
    is_free, registration_fee, early_bird_fee, early_bird_deadline, registration_deadline,
    industries, tags,
    status, visibility, featured, featured_rank
)
VALUES
    -- Event 1: National Conference
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '2025 National Workforce Development Conference',
        'national-workforce-development-conference-2025',
        'Join 2,000+ workforce development leaders for three days of keynotes, panels, and networking. Featuring sessions on CHIPS Act implementation, apprenticeship innovations, and emerging tech talent pipelines.',
        'Bridging Industry, Academia & Government for Emerging Tech Workforce',
        'conference', 'industry-conferences',
        '2025-03-15 08:00:00-05:00', '2025-03-17 17:00:00-05:00', 'America/New_York',
        'in-person', 'Walter E. Washington Convention Center', '801 Mt Vernon Pl NW', 'Washington', 'DC', '20001',
        '11111111-1111-1111-1111-111111111111', 2000, 1850,
        FALSE, 449.00, 299.00, '2025-02-15', '2025-03-10',
        ARRAY['semiconductor', 'nuclear', 'aerospace', 'ai', 'cybersecurity', 'manufacturing'],
        ARRAY['workforce', 'CHIPS Act', 'apprenticeship', 'emerging tech'],
        'upcoming', 'public', TRUE, 1
    ),

    -- Event 2: Career Fair
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Semiconductor Career Fair - Arizona',
        'semiconductor-career-fair-arizona-2025',
        'Over 30 semiconductor employers with 5,000+ open positions. On-site interviews, resume reviews, and career coaching available. All experience levels welcome - from entry-level operators to senior engineers.',
        'Meet Top Employers: Intel, TSMC, Microchip & More',
        'career-fair', 'career-events',
        '2025-02-22 10:00:00-07:00', '2025-02-22 16:00:00-07:00', 'America/Phoenix',
        'in-person', 'Phoenix Convention Center', '100 N 3rd St', 'Phoenix', 'AZ', '85004',
        '22222222-2222-2222-2222-222222222222', 3000, 2400,
        TRUE, 0, NULL, NULL, '2025-02-20',
        ARRAY['semiconductor'],
        ARRAY['career fair', 'semiconductor', 'Intel', 'TSMC', 'hiring'],
        'upcoming', 'public', TRUE, 2
    ),

    -- Event 3: Virtual Career Fair
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'AI/ML Engineering Virtual Career Fair',
        'ai-ml-virtual-career-fair-2025',
        'Virtual career fair featuring 50+ AI/ML employers. Video chat with recruiters, attend tech talks, and apply directly. Roles range from ML Engineers to AI Research Scientists.',
        'Connect with Leading AI Companies from Anywhere',
        'career-fair', 'career-events',
        '2025-02-28 11:00:00-05:00', '2025-02-28 18:00:00-05:00', 'America/New_York',
        'virtual', NULL, NULL, NULL, NULL, NULL,
        '11111111-1111-1111-1111-111111111111', 10000, 5200,
        TRUE, 0, NULL, NULL, '2025-02-27',
        ARRAY['ai'],
        ARRAY['AI', 'machine learning', 'virtual', 'career fair'],
        'upcoming', 'public', TRUE, 3
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Add RLS policy for public read access if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'events'
        AND policyname = 'Public read access for events'
    ) THEN
        CREATE POLICY "Public read access for events"
        ON events FOR SELECT
        TO public
        USING (visibility = 'public' AND status != 'draft');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'event_organizers'
        AND policyname = 'Public read access for event organizers'
    ) THEN
        CREATE POLICY "Public read access for event organizers"
        ON event_organizers FOR SELECT
        TO public
        USING (active = TRUE);
    END IF;
END
$$;

-- Enable RLS on tables if not already enabled
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_organizers ENABLE ROW LEVEL SECURITY;
