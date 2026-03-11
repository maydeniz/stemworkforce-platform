-- ============================================================================
-- Migration 070: Geo Zones — Named Reusable Geographic Targeting Zones
-- Advertisers create custom zones; platform pre-defines common metro zones.
-- Resolved zip code arrays populated async by Edge Function (not trigger)
-- per Uber-style panel advice: avoid slow set-resolution on every save.
-- ============================================================================

-- ============================================================================
-- TABLE: geo_zones
-- ============================================================================
CREATE TABLE IF NOT EXISTS geo_zones (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id        UUID         REFERENCES advertisers(id) ON DELETE CASCADE,
  -- NULL = platform-defined zone (visible to all authenticated users)
  name                 VARCHAR(255) NOT NULL,
  description          TEXT,
  zone_type            VARCHAR(50)  NOT NULL
    CHECK (zone_type IN ('zip_code','zip_radius','zip_list','cbsa','state','county','national')),
  center_zip_code      VARCHAR(5)   REFERENCES zip_code_reference(zip_code),
  radius_miles         DECIMAL(6,2),
  zip_codes            VARCHAR(5)[],   -- for zone_type='zip_list'
  cbsa_code            VARCHAR(10),
  state_codes          VARCHAR(2)[],
  resolved_zip_codes   VARCHAR(5)[],   -- denormalized; populated async by Edge Function
  resolution_status    VARCHAR(20)  DEFAULT 'pending'
    CHECK (resolution_status IN ('pending','resolved','error')),
  estimated_reach      INTEGER,        -- populated after resolution
  is_active            BOOLEAN      DEFAULT true,
  created_by           UUID         REFERENCES auth.users(id),
  created_at           TIMESTAMPTZ  DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_geo_zones_advertiser_id
  ON geo_zones (advertiser_id);

CREATE INDEX IF NOT EXISTS idx_geo_zones_zone_type
  ON geo_zones (zone_type);

CREATE INDEX IF NOT EXISTS idx_geo_zones_cbsa_code
  ON geo_zones (cbsa_code);

CREATE INDEX IF NOT EXISTS idx_geo_zones_state_codes
  ON geo_zones USING GIN (state_codes);

CREATE INDEX IF NOT EXISTS idx_geo_zones_resolved_zip_codes
  ON geo_zones USING GIN (resolved_zip_codes);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_geo_zones_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_geo_zones_updated_at ON geo_zones;
CREATE TRIGGER trg_geo_zones_updated_at
  BEFORE UPDATE ON geo_zones
  FOR EACH ROW EXECUTE FUNCTION set_geo_zones_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE geo_zones ENABLE ROW LEVEL SECURITY;

-- Platform-defined zones (advertiser_id IS NULL) are readable by all authenticated users.
-- Advertiser-owned zones are readable only by users belonging to that advertiser's org.
DROP POLICY IF EXISTS "geo_zones_select" ON geo_zones;
CREATE POLICY "geo_zones_select"
  ON geo_zones
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      advertiser_id IS NULL
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

DROP POLICY IF EXISTS "geo_zones_insert" ON geo_zones;
CREATE POLICY "geo_zones_insert"
  ON geo_zones
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      -- Admins can insert platform zones (advertiser_id IS NULL) or any zone
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
      )
      -- Advertisers can insert their own zones
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

DROP POLICY IF EXISTS "geo_zones_update" ON geo_zones;
CREATE POLICY "geo_zones_update"
  ON geo_zones
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
      )
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

DROP POLICY IF EXISTS "geo_zones_delete" ON geo_zones;
CREATE POLICY "geo_zones_delete"
  ON geo_zones
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
      )
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

-- ============================================================================
-- SEED: 10 Platform-Defined Geo Zones (advertiser_id = NULL)
-- ============================================================================
INSERT INTO geo_zones
  (advertiser_id, name, description, zone_type, cbsa_code, state_codes, resolution_status, is_active)
VALUES

(NULL,
 'United States (National)',
 'Targets all users across the United States with no geographic restriction.',
 'national',
 NULL, NULL,
 'resolved', true),

(NULL,
 'DC Metro / Northern Virginia',
 'Washington DC metro area including Northern Virginia — highest concentration of cleared defense and federal IT professionals in the country.',
 'cbsa',
 '47900', NULL,
 'pending', true),

(NULL,
 'Orlando Metro',
 'Orlando-Kissimmee-Sanford MSA — major defense simulation, modeling, and aerospace hub (Lockheed Martin, Siemens, UCF Research Park).',
 'cbsa',
 '36740', NULL,
 'pending', true),

(NULL,
 'Austin Metro',
 'Austin-Round Rock-Georgetown MSA — top STEM talent hub for semiconductor, AI, and clean energy industries.',
 'cbsa',
 '12420', NULL,
 'pending', true),

(NULL,
 'Huntsville Defense Corridor',
 'Huntsville-Decatur-Albertville MSA — Redstone Arsenal, Boeing, Raytheon, NASA Marshall Space Flight Center.',
 'cbsa',
 '26380', NULL,
 'pending', true),

(NULL,
 'Research Triangle',
 'Raleigh-Cary MSA — Research Triangle Park, NC State, Duke, UNC; biotech, pharma, and advanced manufacturing.',
 'cbsa',
 '39580', NULL,
 'pending', true),

(NULL,
 'San Diego Defense Metro',
 'San Diego-Chula Vista-Carlsbad MSA — Navy, DARPA, General Atomics, Northrop Grumman, Qualcomm.',
 'cbsa',
 '41740', NULL,
 'pending', true),

(NULL,
 'Houston Energy & Space',
 'Houston-The Woodlands-Sugar Land MSA — NASA Johnson Space Center, energy sector (oil & gas, clean energy), biomedical.',
 'cbsa',
 '26420', NULL,
 'pending', true),

(NULL,
 'Miami Metro',
 'Miami-Fort Lauderdale-Pompano Beach MSA — international trade, fintech, and emerging tech hub.',
 'cbsa',
 '33100', NULL,
 'pending', true),

(NULL,
 'Texas Statewide',
 'Statewide Texas targeting covering all major metros: Dallas-Fort Worth, Houston, Austin, San Antonio.',
 'state',
 NULL, ARRAY['TX']::VARCHAR(2)[],
 'pending', true)

ON CONFLICT DO NOTHING;
