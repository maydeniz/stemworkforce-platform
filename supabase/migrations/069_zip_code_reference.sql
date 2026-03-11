-- ============================================================================
-- Migration 069: US Zip Code Reference + Haversine Radius Function
-- 41K zip codes with lat/lon, CBSA metro assignment, defense/STEM hub flags
-- No PostGIS required — pure SQL Haversine for radius targeting
-- Full 41K rows seeded from Census data separately; ~350 demo rows included here
-- ============================================================================

-- ============================================================================
-- TABLE: zip_code_reference
-- ============================================================================
CREATE TABLE IF NOT EXISTS zip_code_reference (
  zip_code     VARCHAR(5)   PRIMARY KEY,
  city         VARCHAR(100) NOT NULL,
  state        VARCHAR(2)   NOT NULL,
  county       VARCHAR(100),
  latitude     DECIMAL(9,6) NOT NULL,
  longitude    DECIMAL(9,6) NOT NULL,
  cbsa_code    VARCHAR(10),   -- Core-Based Statistical Area
  cbsa_name    VARCHAR(150),
  population   INTEGER,
  is_defense_hub BOOLEAN DEFAULT false,
  -- Northern VA, Colorado Springs, San Diego, Huntsville, DC Metro
  is_stem_hub    BOOLEAN DEFAULT false,
  -- Research Triangle, Silicon Valley, Austin, Boston Route 128
  timezone     VARCHAR(50),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_zip_state
  ON zip_code_reference (state);

CREATE INDEX IF NOT EXISTS idx_zip_cbsa
  ON zip_code_reference (cbsa_code);

CREATE INDEX IF NOT EXISTS idx_zip_latlon
  ON zip_code_reference (latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_zip_defense_hub
  ON zip_code_reference (is_defense_hub)
  WHERE is_defense_hub = true;

CREATE INDEX IF NOT EXISTS idx_zip_stem_hub
  ON zip_code_reference (is_stem_hub)
  WHERE is_stem_hub = true;

-- ============================================================================
-- RLS (public reference data — SELECT for any authenticated user)
-- ============================================================================
ALTER TABLE zip_code_reference ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "zip_code_reference_select_authenticated" ON zip_code_reference;
CREATE POLICY "zip_code_reference_select_authenticated"
  ON zip_code_reference
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- FUNCTION: get_zip_codes_within_radius
-- Returns all zip codes within radius_miles of center_zip using Haversine
-- ============================================================================
CREATE OR REPLACE FUNCTION get_zip_codes_within_radius(
  center_zip  VARCHAR(5),
  radius_miles DECIMAL
)
RETURNS TABLE (zip_code VARCHAR(5), distance_miles DECIMAL)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    z2.zip_code,
    CAST(
      3958.8 * acos(
        LEAST(1.0,
          cos(radians(z1.latitude))
          * cos(radians(z2.latitude))
          * cos(radians(z2.longitude) - radians(z1.longitude))
          + sin(radians(z1.latitude))
          * sin(radians(z2.latitude))
        )
      )
    AS DECIMAL(10,4)) AS distance_miles
  FROM zip_code_reference z1
  CROSS JOIN zip_code_reference z2
  WHERE z1.zip_code = center_zip
    AND (
      3958.8 * acos(
        LEAST(1.0,
          cos(radians(z1.latitude))
          * cos(radians(z2.latitude))
          * cos(radians(z2.longitude) - radians(z1.longitude))
          + sin(radians(z1.latitude))
          * sin(radians(z2.latitude))
        )
      )
    ) <= radius_miles
  ORDER BY distance_miles;
$$;

-- ============================================================================
-- FUNCTION: get_cbsa_zip_codes
-- Returns array of all zip codes in a CBSA
-- ============================================================================
CREATE OR REPLACE FUNCTION get_cbsa_zip_codes(p_cbsa_code VARCHAR(10))
RETURNS VARCHAR(5)[]
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(array_agg(zip_code ORDER BY zip_code), ARRAY[]::VARCHAR(5)[])
  FROM zip_code_reference
  WHERE cbsa_code = p_cbsa_code;
$$;

-- ============================================================================
-- SEED DATA: ~350 representative zip codes across major STEM/defense metros
-- Full 41K Census dataset loaded separately via bulk import
-- CBSA codes: Orlando=36740, DC Metro/N.VA=47900, Austin=12420,
--             Huntsville=26380, Oak Ridge=28700, Research Triangle=39580,
--             San Diego=41740, Houston=26420, Miami=33100
-- ============================================================================

INSERT INTO zip_code_reference
  (zip_code, city, state, county, latitude, longitude, cbsa_code, cbsa_name, population, is_defense_hub, is_stem_hub, timezone)
VALUES

-- -------------------------------------------------------------------------
-- Orlando FL (CBSA 36740) — defense hub (Lockheed, Siemens, military)
-- -------------------------------------------------------------------------
('32801','Orlando','FL','Orange',28.542936,-81.379234,'36740','Orlando-Kissimmee-Sanford, FL',15200,true,false,'America/New_York'),
('32803','Orlando','FL','Orange',28.557389,-81.355614,'36740','Orlando-Kissimmee-Sanford, FL',18700,true,false,'America/New_York'),
('32806','Orlando','FL','Orange',28.510340,-81.368820,'36740','Orlando-Kissimmee-Sanford, FL',22400,true,false,'America/New_York'),
('32807','Orlando','FL','Orange',28.536760,-81.300220,'36740','Orlando-Kissimmee-Sanford, FL',29800,true,false,'America/New_York'),
('32809','Orlando','FL','Orange',28.446780,-81.400730,'36740','Orlando-Kissimmee-Sanford, FL',33100,true,false,'America/New_York'),
('32811','Orlando','FL','Orange',28.504580,-81.432720,'36740','Orlando-Kissimmee-Sanford, FL',27600,true,false,'America/New_York'),
('32819','Orlando','FL','Orange',28.451900,-81.479300,'36740','Orlando-Kissimmee-Sanford, FL',41200,true,false,'America/New_York'),
('32822','Orlando','FL','Orange',28.499310,-81.319700,'36740','Orlando-Kissimmee-Sanford, FL',38900,true,false,'America/New_York'),
('32824','Orlando','FL','Orange',28.388420,-81.350140,'36740','Orlando-Kissimmee-Sanford, FL',44700,true,false,'America/New_York'),
('32826','Orlando','FL','Orange',28.565430,-81.197540,'36740','Orlando-Kissimmee-Sanford, FL',19600,true,false,'America/New_York'),
('32829','Orlando','FL','Orange',28.470320,-81.244550,'36740','Orlando-Kissimmee-Sanford, FL',35400,true,false,'America/New_York'),
('32832','Orlando','FL','Orange',28.387610,-81.197920,'36740','Orlando-Kissimmee-Sanford, FL',52300,true,false,'America/New_York'),
('32837','Orlando','FL','Orange',28.381260,-81.438250,'36740','Orlando-Kissimmee-Sanford, FL',39700,true,false,'America/New_York'),

-- -------------------------------------------------------------------------
-- Northern VA / DC Metro (CBSA 47900) — defense hub
-- -------------------------------------------------------------------------
('22101','McLean','VA','Fairfax',38.934590,-77.181180,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',27800,true,false,'America/New_York'),
('22102','McLean','VA','Fairfax',38.950640,-77.218030,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',23400,true,false,'America/New_York'),
('22201','Arlington','VA','Arlington',38.886440,-77.094360,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',31200,true,false,'America/New_York'),
('22202','Arlington','VA','Arlington',38.856120,-77.050580,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',29400,true,false,'America/New_York'),
('22203','Arlington','VA','Arlington',38.872060,-77.104560,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',28700,true,false,'America/New_York'),
('22204','Arlington','VA','Arlington',38.851270,-77.097690,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',35200,true,false,'America/New_York'),
('22205','Arlington','VA','Arlington',38.868680,-77.132440,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',26800,true,false,'America/New_York'),
('22206','Arlington','VA','Arlington',38.837060,-77.086920,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',24100,true,false,'America/New_York'),
('22207','Arlington','VA','Arlington',38.893320,-77.133420,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',33700,true,false,'America/New_York'),
('22209','Arlington','VA','Arlington',38.897330,-77.069940,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',12400,true,false,'America/New_York'),
('22301','Alexandria','VA','Alexandria City',38.824770,-77.075340,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',19800,true,false,'America/New_York'),
('22302','Alexandria','VA','Alexandria City',38.820850,-77.097780,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',22300,true,false,'America/New_York'),
('22304','Alexandria','VA','Alexandria City',38.812080,-77.113570,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',38600,true,false,'America/New_York'),
('22306','Alexandria','VA','Fairfax',38.762500,-77.097580,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',33400,true,false,'America/New_York'),
('22307','Alexandria','VA','Fairfax',38.769560,-77.067180,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',17900,true,false,'America/New_York'),
('22308','Alexandria','VA','Fairfax',38.730370,-77.065910,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',21600,true,false,'America/New_York'),
('22309','Alexandria','VA','Fairfax',38.715620,-77.092680,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',29300,true,false,'America/New_York'),
('22310','Alexandria','VA','Fairfax',38.772920,-77.124550,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',31700,true,false,'America/New_York'),
('22311','Alexandria','VA','Alexandria City',38.826820,-77.127730,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',24500,true,false,'America/New_York'),
('22312','Alexandria','VA','Fairfax',38.814990,-77.148430,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',36800,true,false,'America/New_York'),
('20109','Manassas','VA','Prince William',38.757280,-77.522140,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',48200,true,false,'America/New_York'),
('20110','Manassas','VA','Manassas City',38.750900,-77.482300,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',19700,true,false,'America/New_York'),
('20111','Manassas','VA','Prince William',38.735760,-77.451920,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',27300,true,false,'America/New_York'),
('20120','Centreville','VA','Fairfax',38.839820,-77.431230,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',34600,true,false,'America/New_York'),
('20121','Centreville','VA','Fairfax',38.818620,-77.403730,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',29800,true,false,'America/New_York'),
('20151','Chantilly','VA','Fairfax',38.900540,-77.421360,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',35700,true,false,'America/New_York'),
('20152','Chantilly','VA','Loudoun',38.877720,-77.441450,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',44200,true,false,'America/New_York'),
('20164','Sterling','VA','Loudoun',39.003340,-77.395730,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',41800,true,false,'America/New_York'),
('20165','Sterling','VA','Loudoun',39.024990,-77.376280,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',38500,true,false,'America/New_York'),
('20166','Sterling','VA','Loudoun',38.981770,-77.440590,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',22700,true,false,'America/New_York'),
('20170','Herndon','VA','Fairfax',38.969660,-77.385950,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',29400,true,false,'America/New_York'),
('20171','Herndon','VA','Fairfax',38.939370,-77.372090,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',35600,true,false,'America/New_York'),
('20190','Reston','VA','Fairfax',38.958680,-77.350430,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',26800,true,false,'America/New_York'),
('20191','Reston','VA','Fairfax',38.937460,-77.340620,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',31200,true,false,'America/New_York'),
('20194','Reston','VA','Fairfax',38.982690,-77.337160,'47900','Washington-Arlington-Alexandria, DC-VA-MD-WV',28900,true,false,'America/New_York'),

-- -------------------------------------------------------------------------
-- Austin TX (CBSA 12420) — STEM hub
-- -------------------------------------------------------------------------
('78701','Austin','TX','Travis',30.270240,-97.740820,'12420','Austin-Round Rock-Georgetown, TX',8200,false,true,'America/Chicago'),
('78702','Austin','TX','Travis',30.262990,-97.714430,'12420','Austin-Round Rock-Georgetown, TX',22400,false,true,'America/Chicago'),
('78703','Austin','TX','Travis',30.286290,-97.762840,'12420','Austin-Round Rock-Georgetown, TX',18700,false,true,'America/Chicago'),
('78704','Austin','TX','Travis',30.240680,-97.760240,'12420','Austin-Round Rock-Georgetown, TX',35800,false,true,'America/Chicago'),
('78705','Austin','TX','Travis',30.290900,-97.740490,'12420','Austin-Round Rock-Georgetown, TX',29300,false,true,'America/Chicago'),
('78712','Austin','TX','Travis',30.286740,-97.736640,'12420','Austin-Round Rock-Georgetown, TX',4100,false,true,'America/Chicago'),
('78717','Austin','TX','Williamson',30.487980,-97.779940,'12420','Austin-Round Rock-Georgetown, TX',43200,false,true,'America/Chicago'),
('78719','Austin','TX','Travis',30.177540,-97.699940,'12420','Austin-Round Rock-Georgetown, TX',9800,false,true,'America/Chicago'),
('78721','Austin','TX','Travis',30.261720,-97.683780,'12420','Austin-Round Rock-Georgetown, TX',19400,false,true,'America/Chicago'),
('78723','Austin','TX','Travis',30.312660,-97.693450,'12420','Austin-Round Rock-Georgetown, TX',31200,false,true,'America/Chicago'),
('78724','Austin','TX','Travis',30.314040,-97.649480,'12420','Austin-Round Rock-Georgetown, TX',27800,false,true,'America/Chicago'),
('78725','Austin','TX','Travis',30.246760,-97.621340,'12420','Austin-Round Rock-Georgetown, TX',18300,false,true,'America/Chicago'),
('78726','Austin','TX','Travis',30.441360,-97.819940,'12420','Austin-Round Rock-Georgetown, TX',29400,false,true,'America/Chicago'),
('78727','Austin','TX','Travis',30.432910,-97.706540,'12420','Austin-Round Rock-Georgetown, TX',36700,false,true,'America/Chicago'),
('78728','Austin','TX','Travis',30.453920,-97.678620,'12420','Austin-Round Rock-Georgetown, TX',32100,false,true,'America/Chicago'),
('78729','Austin','TX','Williamson',30.459640,-97.749160,'12420','Austin-Round Rock-Georgetown, TX',38500,false,true,'America/Chicago'),
('78730','Austin','TX','Travis',30.369720,-97.822480,'12420','Austin-Round Rock-Georgetown, TX',17200,false,true,'America/Chicago'),
('78731','Austin','TX','Travis',30.356820,-97.762380,'12420','Austin-Round Rock-Georgetown, TX',25400,false,true,'America/Chicago'),
('78732','Austin','TX','Travis',30.386790,-97.869650,'12420','Austin-Round Rock-Georgetown, TX',19600,false,true,'America/Chicago'),
('78733','Austin','TX','Travis',30.333590,-97.862110,'12420','Austin-Round Rock-Georgetown, TX',14700,false,true,'America/Chicago'),
('78734','Austin','TX','Travis',30.376390,-97.914820,'12420','Austin-Round Rock-Georgetown, TX',16300,false,true,'America/Chicago'),
('78735','Austin','TX','Travis',30.266450,-97.859220,'12420','Austin-Round Rock-Georgetown, TX',22800,false,true,'America/Chicago'),
('78736','Austin','TX','Travis',30.238620,-97.897430,'12420','Austin-Round Rock-Georgetown, TX',14200,false,true,'America/Chicago'),
('78737','Austin','TX','Hays',30.200760,-97.886520,'12420','Austin-Round Rock-Georgetown, TX',17900,false,true,'America/Chicago'),
('78738','Austin','TX','Travis',30.327550,-97.929990,'12420','Austin-Round Rock-Georgetown, TX',26400,false,true,'America/Chicago'),
('78739','Austin','TX','Travis',30.183840,-97.862670,'12420','Austin-Round Rock-Georgetown, TX',34600,false,true,'America/Chicago'),
('78741','Austin','TX','Travis',30.224790,-97.715060,'12420','Austin-Round Rock-Georgetown, TX',33200,false,true,'America/Chicago'),
('78742','Austin','TX','Travis',30.229290,-97.669490,'12420','Austin-Round Rock-Georgetown, TX',7400,false,true,'America/Chicago'),
('78745','Austin','TX','Travis',30.197260,-97.786290,'12420','Austin-Round Rock-Georgetown, TX',42300,false,true,'America/Chicago'),
('78746','Austin','TX','Travis',30.292640,-97.811950,'12420','Austin-Round Rock-Georgetown, TX',36800,false,true,'America/Chicago'),
('78747','Austin','TX','Travis',30.140870,-97.754220,'12420','Austin-Round Rock-Georgetown, TX',31700,false,true,'America/Chicago'),
('78748','Austin','TX','Travis',30.165530,-97.827320,'12420','Austin-Round Rock-Georgetown, TX',45600,false,true,'America/Chicago'),
('78749','Austin','TX','Travis',30.214650,-97.850230,'12420','Austin-Round Rock-Georgetown, TX',38900,false,true,'America/Chicago'),
('78750','Austin','TX','Travis',30.421360,-97.778260,'12420','Austin-Round Rock-Georgetown, TX',33400,false,true,'America/Chicago'),
('78751','Austin','TX','Travis',30.314860,-97.723360,'12420','Austin-Round Rock-Georgetown, TX',22700,false,true,'America/Chicago'),
('78752','Austin','TX','Travis',30.333440,-97.703350,'12420','Austin-Round Rock-Georgetown, TX',24500,false,true,'America/Chicago'),
('78753','Austin','TX','Travis',30.378480,-97.665940,'12420','Austin-Round Rock-Georgetown, TX',46200,false,true,'America/Chicago'),
('78754','Austin','TX','Travis',30.370820,-97.623950,'12420','Austin-Round Rock-Georgetown, TX',28800,false,true,'America/Chicago'),
('78756','Austin','TX','Travis',30.323680,-97.742120,'12420','Austin-Round Rock-Georgetown, TX',16300,false,true,'America/Chicago'),
('78757','Austin','TX','Travis',30.354470,-97.725340,'12420','Austin-Round Rock-Georgetown, TX',25900,false,true,'America/Chicago'),
('78758','Austin','TX','Travis',30.399710,-97.705340,'12420','Austin-Round Rock-Georgetown, TX',41700,false,true,'America/Chicago'),
('78759','Austin','TX','Travis',30.404700,-97.753660,'12420','Austin-Round Rock-Georgetown, TX',38200,false,true,'America/Chicago'),

-- -------------------------------------------------------------------------
-- Huntsville AL (CBSA 26380) — defense hub (Redstone Arsenal, Boeing, Raytheon)
-- -------------------------------------------------------------------------
('35801','Huntsville','AL','Madison',34.729930,-86.585610,'26380','Huntsville-Decatur-Albertville, AL',31400,true,false,'America/Chicago'),
('35802','Huntsville','AL','Madison',34.693380,-86.562060,'26380','Huntsville-Decatur-Albertville, AL',38700,true,false,'America/Chicago'),
('35803','Huntsville','AL','Madison',34.638260,-86.531090,'26380','Huntsville-Decatur-Albertville, AL',29800,true,false,'America/Chicago'),
('35804','Huntsville','AL','Madison',34.730000,-86.586000,'26380','Huntsville-Decatur-Albertville, AL',500,true,false,'America/Chicago'),
('35805','Huntsville','AL','Madison',34.714320,-86.624510,'26380','Huntsville-Decatur-Albertville, AL',22600,true,false,'America/Chicago'),
('35806','Huntsville','AL','Madison',34.749430,-86.643660,'26380','Huntsville-Decatur-Albertville, AL',26300,true,false,'America/Chicago'),
('35808','Huntsville','AL','Madison',34.656780,-86.659290,'26380','Huntsville-Decatur-Albertville, AL',18900,true,false,'America/Chicago'),
('35810','Huntsville','AL','Madison',34.793070,-86.580490,'26380','Huntsville-Decatur-Albertville, AL',24700,true,false,'America/Chicago'),
('35811','Huntsville','AL','Madison',34.793880,-86.519640,'26380','Huntsville-Decatur-Albertville, AL',27300,true,false,'America/Chicago'),
('35816','Huntsville','AL','Madison',34.754110,-86.565810,'26380','Huntsville-Decatur-Albertville, AL',21800,true,false,'America/Chicago'),
('35824','Huntsville','AL','Madison',34.656090,-86.687040,'26380','Huntsville-Decatur-Albertville, AL',16400,true,false,'America/Chicago'),

-- -------------------------------------------------------------------------
-- Oak Ridge TN (CBSA 28700) — defense + STEM hub (DOE national lab)
-- -------------------------------------------------------------------------
('37830','Oak Ridge','TN','Anderson',36.010380,-84.269420,'28700','Knoxville, TN',29500,true,true,'America/New_York'),
('37831','Oak Ridge','TN','Anderson',36.017760,-84.252590,'28700','Knoxville, TN',1200,true,true,'America/New_York'),

-- -------------------------------------------------------------------------
-- Research Triangle NC (CBSA 39580) — STEM hub
-- -------------------------------------------------------------------------
('27511','Cary','NC','Wake',35.791040,-78.781400,'39580','Raleigh-Cary, NC',68400,false,true,'America/New_York'),
('27513','Cary','NC','Wake',35.820250,-78.839620,'39580','Raleigh-Cary, NC',51300,false,true,'America/New_York'),
('27514','Chapel Hill','NC','Orange',35.926120,-79.073470,'39580','Raleigh-Cary, NC',32600,false,true,'America/New_York'),
('27516','Chapel Hill','NC','Orange',35.874530,-79.087330,'39580','Raleigh-Cary, NC',24800,false,true,'America/New_York'),
('27517','Chapel Hill','NC','Chatham',35.836100,-79.060840,'39580','Raleigh-Cary, NC',19200,false,true,'America/New_York'),
('27519','Cary','NC','Wake',35.813380,-78.871410,'39580','Raleigh-Cary, NC',42700,false,true,'America/New_York'),
('27539','Apex','NC','Wake',35.706970,-78.855110,'39580','Raleigh-Cary, NC',38400,false,true,'America/New_York'),
('27560','Morrisville','NC','Wake',35.830130,-78.824900,'39580','Raleigh-Cary, NC',29600,false,true,'America/New_York'),
('27587','Wake Forest','NC','Wake',35.979310,-78.510050,'39580','Raleigh-Cary, NC',44200,false,true,'America/New_York'),
('27601','Raleigh','NC','Wake',35.779470,-78.640710,'39580','Raleigh-Cary, NC',18700,false,true,'America/New_York'),
('27603','Raleigh','NC','Wake',35.727910,-78.661680,'39580','Raleigh-Cary, NC',33400,false,true,'America/New_York'),
('27604','Raleigh','NC','Wake',35.810680,-78.596010,'39580','Raleigh-Cary, NC',41300,false,true,'America/New_York'),
('27605','Raleigh','NC','Wake',35.792610,-78.662720,'39580','Raleigh-Cary, NC',12900,false,true,'America/New_York'),
('27606','Raleigh','NC','Wake',35.737390,-78.724450,'39580','Raleigh-Cary, NC',37800,false,true,'America/New_York'),
('27607','Raleigh','NC','Wake',35.800440,-78.700940,'39580','Raleigh-Cary, NC',29400,false,true,'America/New_York'),
('27608','Raleigh','NC','Wake',35.817720,-78.661980,'39580','Raleigh-Cary, NC',22100,false,true,'America/New_York'),
('27609','Raleigh','NC','Wake',35.843640,-78.637420,'39580','Raleigh-Cary, NC',33600,false,true,'America/New_York'),
('27610','Raleigh','NC','Wake',35.765390,-78.590650,'39580','Raleigh-Cary, NC',36200,false,true,'America/New_York'),
('27612','Raleigh','NC','Wake',35.856900,-78.700080,'39580','Raleigh-Cary, NC',41700,false,true,'America/New_York'),
('27613','Raleigh','NC','Wake',35.896300,-78.733610,'39580','Raleigh-Cary, NC',28900,false,true,'America/New_York'),
('27614','Raleigh','NC','Wake',35.938940,-78.644210,'39580','Raleigh-Cary, NC',37400,false,true,'America/New_York'),
('27615','Raleigh','NC','Wake',35.885060,-78.668410,'39580','Raleigh-Cary, NC',43200,false,true,'America/New_York'),
('27616','Raleigh','NC','Wake',35.863210,-78.549840,'39580','Raleigh-Cary, NC',39700,false,true,'America/New_York'),
('27617','Raleigh','NC','Wake',35.907810,-78.780990,'39580','Raleigh-Cary, NC',24600,false,true,'America/New_York'),

-- -------------------------------------------------------------------------
-- San Diego CA (CBSA 41740) — defense hub
-- -------------------------------------------------------------------------
('92101','San Diego','CA','San Diego',32.722890,-117.170110,'41740','San Diego-Chula Vista-Carlsbad, CA',32400,true,false,'America/Los_Angeles'),
('92103','San Diego','CA','San Diego',32.748080,-117.167850,'41740','San Diego-Chula Vista-Carlsbad, CA',38700,true,false,'America/Los_Angeles'),
('92106','San Diego','CA','San Diego',32.716660,-117.226240,'41740','San Diego-Chula Vista-Carlsbad, CA',19800,true,false,'America/Los_Angeles'),
('92108','San Diego','CA','San Diego',32.755530,-117.141980,'41740','San Diego-Chula Vista-Carlsbad, CA',28300,true,false,'America/Los_Angeles'),
('92110','San Diego','CA','San Diego',32.753510,-117.204360,'41740','San Diego-Chula Vista-Carlsbad, CA',24600,true,false,'America/Los_Angeles'),
('92111','San Diego','CA','San Diego',32.793840,-117.163850,'41740','San Diego-Chula Vista-Carlsbad, CA',43200,true,false,'America/Los_Angeles'),
('92113','San Diego','CA','San Diego',32.697660,-117.126520,'41740','San Diego-Chula Vista-Carlsbad, CA',36700,true,false,'America/Los_Angeles'),
('92114','San Diego','CA','San Diego',32.699810,-117.063130,'41740','San Diego-Chula Vista-Carlsbad, CA',54300,true,false,'America/Los_Angeles'),
('92115','San Diego','CA','San Diego',32.754510,-117.073370,'41740','San Diego-Chula Vista-Carlsbad, CA',49800,true,false,'America/Los_Angeles'),
('92116','San Diego','CA','San Diego',32.762230,-117.120970,'41740','San Diego-Chula Vista-Carlsbad, CA',34500,true,false,'America/Los_Angeles'),
('92117','San Diego','CA','San Diego',32.803970,-117.198210,'41740','San Diego-Chula Vista-Carlsbad, CA',52100,true,false,'America/Los_Angeles'),
('92119','San Diego','CA','San Diego',32.793000,-117.022860,'41740','San Diego-Chula Vista-Carlsbad, CA',37400,true,false,'America/Los_Angeles'),
('92120','San Diego','CA','San Diego',32.793720,-117.059530,'41740','San Diego-Chula Vista-Carlsbad, CA',29800,true,false,'America/Los_Angeles'),
('92121','San Diego','CA','San Diego',32.898590,-117.215310,'41740','San Diego-Chula Vista-Carlsbad, CA',12300,true,false,'America/Los_Angeles'),
('92123','San Diego','CA','San Diego',32.806660,-117.128640,'41740','San Diego-Chula Vista-Carlsbad, CA',44600,true,false,'America/Los_Angeles'),
('92124','San Diego','CA','San Diego',32.828440,-117.072760,'41740','San Diego-Chula Vista-Carlsbad, CA',38900,true,false,'America/Los_Angeles'),
('92126','San Diego','CA','San Diego',32.897000,-117.138570,'41740','San Diego-Chula Vista-Carlsbad, CA',53200,true,false,'America/Los_Angeles'),
('92127','San Diego','CA','San Diego',33.006190,-117.096920,'41740','San Diego-Chula Vista-Carlsbad, CA',67400,true,false,'America/Los_Angeles'),
('92128','San Diego','CA','San Diego',33.016040,-117.051000,'41740','San Diego-Chula Vista-Carlsbad, CA',58700,true,false,'America/Los_Angeles'),
('92129','San Diego','CA','San Diego',32.960130,-117.119150,'41740','San Diego-Chula Vista-Carlsbad, CA',49300,true,false,'America/Los_Angeles'),
('92130','San Diego','CA','San Diego',32.957870,-117.228660,'41740','San Diego-Chula Vista-Carlsbad, CA',44800,true,false,'America/Los_Angeles'),
('92131','San Diego','CA','San Diego',32.912610,-117.058540,'41740','San Diego-Chula Vista-Carlsbad, CA',41200,true,false,'America/Los_Angeles'),
('92140','San Diego','CA','San Diego',32.732450,-117.197100,'41740','San Diego-Chula Vista-Carlsbad, CA',8600,true,false,'America/Los_Angeles'),

-- -------------------------------------------------------------------------
-- Houston TX (CBSA 26420) — STEM hub (NASA JSC, energy sector)
-- -------------------------------------------------------------------------
('77001','Houston','TX','Harris',29.749070,-95.356350,'26420','Houston-The Woodlands-Sugar Land, TX',3200,false,true,'America/Chicago'),
('77002','Houston','TX','Harris',29.754050,-95.368220,'26420','Houston-The Woodlands-Sugar Land, TX',12800,false,true,'America/Chicago'),
('77003','Houston','TX','Harris',29.745790,-95.345750,'26420','Houston-The Woodlands-Sugar Land, TX',22400,false,true,'America/Chicago'),
('77004','Houston','TX','Harris',29.724810,-95.368360,'26420','Houston-The Woodlands-Sugar Land, TX',31600,false,true,'America/Chicago'),
('77005','Houston','TX','Harris',29.718790,-95.420720,'26420','Houston-The Woodlands-Sugar Land, TX',24800,false,true,'America/Chicago'),
('77006','Houston','TX','Harris',29.741760,-95.392650,'26420','Houston-The Woodlands-Sugar Land, TX',26300,false,true,'America/Chicago'),
('77007','Houston','TX','Harris',29.770100,-95.398620,'26420','Houston-The Woodlands-Sugar Land, TX',33700,false,true,'America/Chicago'),
('77008','Houston','TX','Harris',29.797450,-95.408560,'26420','Houston-The Woodlands-Sugar Land, TX',38400,false,true,'America/Chicago'),
('77009','Houston','TX','Harris',29.793310,-95.365210,'26420','Houston-The Woodlands-Sugar Land, TX',42100,false,true,'America/Chicago'),
('77010','Houston','TX','Harris',29.757890,-95.360780,'26420','Houston-The Woodlands-Sugar Land, TX',4600,false,true,'America/Chicago'),
('77011','Houston','TX','Harris',29.741530,-95.330290,'26420','Houston-The Woodlands-Sugar Land, TX',29300,false,true,'America/Chicago'),
('77012','Houston','TX','Harris',29.720840,-95.325640,'26420','Houston-The Woodlands-Sugar Land, TX',31800,false,true,'America/Chicago'),
('77018','Houston','TX','Harris',29.822720,-95.418910,'26420','Houston-The Woodlands-Sugar Land, TX',34500,false,true,'America/Chicago'),
('77019','Houston','TX','Harris',29.754040,-95.416960,'26420','Houston-The Woodlands-Sugar Land, TX',21700,false,true,'America/Chicago'),
('77020','Houston','TX','Harris',29.766050,-95.326950,'26420','Houston-The Woodlands-Sugar Land, TX',28900,false,true,'America/Chicago'),
('77021','Houston','TX','Harris',29.707410,-95.372630,'26420','Houston-The Woodlands-Sugar Land, TX',33200,false,true,'America/Chicago'),
('77023','Houston','TX','Harris',29.722520,-95.330270,'26420','Houston-The Woodlands-Sugar Land, TX',36700,false,true,'America/Chicago'),
('77025','Houston','TX','Harris',29.679430,-95.430840,'26420','Houston-The Woodlands-Sugar Land, TX',29400,false,true,'America/Chicago'),
('77027','Houston','TX','Harris',29.742040,-95.444530,'26420','Houston-The Woodlands-Sugar Land, TX',18600,false,true,'America/Chicago'),
('77030','Houston','TX','Harris',29.707170,-95.399610,'26420','Houston-The Woodlands-Sugar Land, TX',14200,false,true,'America/Chicago'),
('77036','Houston','TX','Harris',29.699420,-95.534880,'26420','Houston-The Woodlands-Sugar Land, TX',51300,false,true,'America/Chicago'),
('77040','Houston','TX','Harris',29.858070,-95.512750,'26420','Houston-The Woodlands-Sugar Land, TX',43700,false,true,'America/Chicago'),
('77041','Houston','TX','Harris',29.837090,-95.549690,'26420','Houston-The Woodlands-Sugar Land, TX',37200,false,true,'America/Chicago'),
('77042','Houston','TX','Harris',29.733060,-95.544980,'26420','Houston-The Woodlands-Sugar Land, TX',39800,false,true,'America/Chicago'),
('77043','Houston','TX','Harris',29.782130,-95.543940,'26420','Houston-The Woodlands-Sugar Land, TX',28600,false,true,'America/Chicago'),
('77044','Houston','TX','Harris',29.817350,-95.172400,'26420','Houston-The Woodlands-Sugar Land, TX',44200,false,true,'America/Chicago'),
('77045','Houston','TX','Harris',29.644070,-95.435760,'26420','Houston-The Woodlands-Sugar Land, TX',38900,false,true,'America/Chicago'),
('77046','Houston','TX','Harris',29.738560,-95.451470,'26420','Houston-The Woodlands-Sugar Land, TX',9800,false,true,'America/Chicago'),
('77047','Houston','TX','Harris',29.629350,-95.403450,'26420','Houston-The Woodlands-Sugar Land, TX',36400,false,true,'America/Chicago'),
('77048','Houston','TX','Harris',29.621870,-95.358460,'26420','Houston-The Woodlands-Sugar Land, TX',31700,false,true,'America/Chicago'),
('77049','Houston','TX','Harris',29.810630,-95.161040,'26420','Houston-The Woodlands-Sugar Land, TX',42300,false,true,'America/Chicago'),
('77050','Houston','TX','Harris',29.865630,-95.253680,'26420','Houston-The Woodlands-Sugar Land, TX',18600,false,true,'America/Chicago'),
('77054','Houston','TX','Harris',29.678810,-95.396100,'26420','Houston-The Woodlands-Sugar Land, TX',22400,false,true,'America/Chicago'),
('77055','Houston','TX','Harris',29.791980,-95.476090,'26420','Houston-The Woodlands-Sugar Land, TX',34800,false,true,'America/Chicago'),
('77056','Houston','TX','Harris',29.753840,-95.462180,'26420','Houston-The Woodlands-Sugar Land, TX',24300,false,true,'America/Chicago'),
('77057','Houston','TX','Harris',29.745630,-95.480940,'26420','Houston-The Woodlands-Sugar Land, TX',37200,false,true,'America/Chicago'),
('77058','Houston','TX','Harris',29.568920,-95.100380,'26420','Houston-The Woodlands-Sugar Land, TX',28900,false,true,'America/Chicago'),
('77059','Houston','TX','Harris',29.593620,-95.150430,'26420','Houston-The Woodlands-Sugar Land, TX',31400,false,true,'America/Chicago'),
('77062','Houston','TX','Harris',29.574510,-95.124350,'26420','Houston-The Woodlands-Sugar Land, TX',29700,false,true,'America/Chicago'),
('77063','Houston','TX','Harris',29.730090,-95.517060,'26420','Houston-The Woodlands-Sugar Land, TX',39200,false,true,'America/Chicago'),
('77064','Houston','TX','Harris',29.890840,-95.530470,'26420','Houston-The Woodlands-Sugar Land, TX',48700,false,true,'America/Chicago'),
('77065','Houston','TX','Harris',29.905230,-95.567080,'26420','Houston-The Woodlands-Sugar Land, TX',43100,false,true,'America/Chicago'),
('77066','Houston','TX','Harris',29.944710,-95.501330,'26420','Houston-The Woodlands-Sugar Land, TX',38400,false,true,'America/Chicago'),
('77067','Houston','TX','Harris',29.952450,-95.474970,'26420','Houston-The Woodlands-Sugar Land, TX',36200,false,true,'America/Chicago'),
('77070','Houston','TX','Harris',29.935040,-95.570820,'26420','Houston-The Woodlands-Sugar Land, TX',52300,false,true,'America/Chicago'),
('77071','Houston','TX','Harris',29.650420,-95.496450,'26420','Houston-The Woodlands-Sugar Land, TX',41700,false,true,'America/Chicago'),
('77072','Houston','TX','Harris',29.683390,-95.543510,'26420','Houston-The Woodlands-Sugar Land, TX',48900,false,true,'America/Chicago'),
('77073','Houston','TX','Harris',29.954810,-95.415490,'26420','Houston-The Woodlands-Sugar Land, TX',43600,false,true,'America/Chicago'),
('77074','Houston','TX','Harris',29.686310,-95.498120,'26420','Houston-The Woodlands-Sugar Land, TX',45200,false,true,'America/Chicago'),
('77075','Houston','TX','Harris',29.634180,-95.370980,'26420','Houston-The Woodlands-Sugar Land, TX',51800,false,true,'America/Chicago'),
('77076','Houston','TX','Harris',29.836090,-95.394120,'26420','Houston-The Woodlands-Sugar Land, TX',39400,false,true,'America/Chicago'),
('77077','Houston','TX','Harris',29.731130,-95.559060,'26420','Houston-The Woodlands-Sugar Land, TX',43700,false,true,'America/Chicago'),
('77078','Houston','TX','Harris',29.785070,-95.267660,'26420','Houston-The Woodlands-Sugar Land, TX',29300,false,true,'America/Chicago'),
('77079','Houston','TX','Harris',29.770960,-95.566520,'26420','Houston-The Woodlands-Sugar Land, TX',36100,false,true,'America/Chicago'),
('77080','Houston','TX','Harris',29.794110,-95.496270,'26420','Houston-The Woodlands-Sugar Land, TX',42800,false,true,'America/Chicago'),
('77081','Houston','TX','Harris',29.706610,-95.470180,'26420','Houston-The Woodlands-Sugar Land, TX',47300,false,true,'America/Chicago'),
('77082','Houston','TX','Harris',29.703920,-95.581220,'26420','Houston-The Woodlands-Sugar Land, TX',56200,false,true,'America/Chicago'),
('77084','Houston','TX','Harris',29.839120,-95.643880,'26420','Houston-The Woodlands-Sugar Land, TX',67800,false,true,'America/Chicago'),
('77085','Houston','TX','Harris',29.638530,-95.467870,'26420','Houston-The Woodlands-Sugar Land, TX',38400,false,true,'America/Chicago'),
('77086','Houston','TX','Harris',29.898700,-95.451090,'26420','Houston-The Woodlands-Sugar Land, TX',44700,false,true,'America/Chicago'),
('77087','Houston','TX','Harris',29.700200,-95.320830,'26420','Houston-The Woodlands-Sugar Land, TX',46300,false,true,'America/Chicago'),
('77088','Houston','TX','Harris',29.879070,-95.432190,'26420','Houston-The Woodlands-Sugar Land, TX',48200,false,true,'America/Chicago'),
('77089','Houston','TX','Harris',29.603450,-95.223560,'26420','Houston-The Woodlands-Sugar Land, TX',54700,false,true,'America/Chicago'),
('77090','Houston','TX','Harris',29.976890,-95.464460,'26420','Houston-The Woodlands-Sugar Land, TX',47300,false,true,'America/Chicago'),
('77091','Houston','TX','Harris',29.853940,-95.413640,'26420','Houston-The Woodlands-Sugar Land, TX',37600,false,true,'America/Chicago'),
('77092','Houston','TX','Harris',29.833680,-95.449750,'26420','Houston-The Woodlands-Sugar Land, TX',43100,false,true,'America/Chicago'),
('77093','Houston','TX','Harris',29.877820,-95.349190,'26420','Houston-The Woodlands-Sugar Land, TX',51200,false,true,'America/Chicago'),
('77094','Houston','TX','Harris',29.756290,-95.636930,'26420','Houston-The Woodlands-Sugar Land, TX',32400,false,true,'America/Chicago'),
('77095','Houston','TX','Harris',29.859220,-95.617940,'26420','Houston-The Woodlands-Sugar Land, TX',58900,false,true,'America/Chicago'),
('77096','Houston','TX','Harris',29.666230,-95.461750,'26420','Houston-The Woodlands-Sugar Land, TX',41300,false,true,'America/Chicago'),
('77098','Houston','TX','Harris',29.734890,-95.425640,'26420','Houston-The Woodlands-Sugar Land, TX',22100,false,true,'America/Chicago'),
('77099','Houston','TX','Harris',29.679180,-95.587320,'26420','Houston-The Woodlands-Sugar Land, TX',62400,false,true,'America/Chicago'),

-- -------------------------------------------------------------------------
-- Miami FL (CBSA 33100) — metro hub
-- -------------------------------------------------------------------------
('33101','Miami','FL','Miami-Dade',25.774266,-80.193659,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',2100,false,false,'America/New_York'),
('33109','Miami Beach','FL','Miami-Dade',25.763340,-80.152800,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',2800,false,false,'America/New_York'),
('33125','Miami','FL','Miami-Dade',25.774530,-80.233660,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',38700,false,false,'America/New_York'),
('33126','Miami','FL','Miami-Dade',25.769650,-80.280130,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',41200,false,false,'America/New_York'),
('33127','Miami','FL','Miami-Dade',25.810130,-80.198560,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',29400,false,false,'America/New_York'),
('33128','Miami','FL','Miami-Dade',25.773620,-80.204230,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',14700,false,false,'America/New_York'),
('33129','Miami','FL','Miami-Dade',25.748620,-80.198520,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',18300,false,false,'America/New_York'),
('33130','Miami','FL','Miami-Dade',25.761440,-80.206100,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',22100,false,false,'America/New_York'),
('33131','Miami','FL','Miami-Dade',25.758240,-80.188940,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',16800,false,false,'America/New_York'),
('33132','Miami','FL','Miami-Dade',25.777540,-80.188550,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',12400,false,false,'America/New_York'),
('33133','Miami','FL','Miami-Dade',25.726390,-80.236320,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',34600,false,false,'America/New_York'),
('33134','Miami','FL','Miami-Dade',25.752580,-80.262490,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',27800,false,false,'America/New_York'),
('33135','Miami','FL','Miami-Dade',25.765230,-80.241540,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',31200,false,false,'America/New_York'),
('33136','Miami','FL','Miami-Dade',25.786640,-80.209140,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',19600,false,false,'America/New_York'),
('33137','Miami','FL','Miami-Dade',25.818370,-80.185380,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',28700,false,false,'America/New_York'),
('33138','Miami','FL','Miami-Dade',25.852100,-80.185380,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',33400,false,false,'America/New_York'),
('33139','Miami Beach','FL','Miami-Dade',25.783640,-80.139170,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',36200,false,false,'America/New_York'),
('33140','Miami Beach','FL','Miami-Dade',25.808110,-80.133010,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',21800,false,false,'America/New_York'),
('33141','Miami Beach','FL','Miami-Dade',25.831040,-80.130960,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',28400,false,false,'America/New_York'),
('33142','Miami','FL','Miami-Dade',25.812990,-80.226260,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',37900,false,false,'America/New_York'),
('33143','South Miami','FL','Miami-Dade',25.703790,-80.288820,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',29300,false,false,'America/New_York'),
('33144','Miami','FL','Miami-Dade',25.757460,-80.299660,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',41600,false,false,'America/New_York'),
('33145','Miami','FL','Miami-Dade',25.750050,-80.228340,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',34800,false,false,'America/New_York'),
('33146','Coral Gables','FL','Miami-Dade',25.714590,-80.263620,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',19700,false,false,'America/New_York'),
('33147','Miami','FL','Miami-Dade',25.846740,-80.222350,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',44300,false,false,'America/New_York'),
('33149','Key Biscayne','FL','Miami-Dade',25.694310,-80.163420,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',13200,false,false,'America/New_York'),
('33150','Miami','FL','Miami-Dade',25.860370,-80.212870,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',31700,false,false,'America/New_York'),
('33154','Bal Harbour','FL','Miami-Dade',25.892350,-80.122630,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',7800,false,false,'America/New_York'),
('33155','Miami','FL','Miami-Dade',25.723960,-80.311060,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',48200,false,false,'America/New_York'),
('33156','Miami','FL','Miami-Dade',25.669980,-80.299440,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',38700,false,false,'America/New_York'),
('33157','Miami','FL','Miami-Dade',25.618190,-80.341240,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',54300,false,false,'America/New_York'),
('33158','Miami','FL','Miami-Dade',25.629870,-80.291910,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',29400,false,false,'America/New_York'),
('33160','North Miami Beach','FL','Miami-Dade',25.929600,-80.146040,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',34600,false,false,'America/New_York'),
('33161','Miami','FL','Miami-Dade',25.896560,-80.177890,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',41200,false,false,'America/New_York'),
('33162','Miami','FL','Miami-Dade',25.925870,-80.181610,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',38400,false,false,'America/New_York'),
('33165','Miami','FL','Miami-Dade',25.724980,-80.357340,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',52700,false,false,'America/New_York'),
('33166','Miami','FL','Miami-Dade',25.827260,-80.315570,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',29300,false,false,'America/New_York'),
('33167','Miami','FL','Miami-Dade',25.862670,-80.235170,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',37600,false,false,'America/New_York'),
('33168','Miami','FL','Miami-Dade',25.879870,-80.218720,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',43100,false,false,'America/New_York'),
('33169','Miami','FL','Miami-Dade',25.911490,-80.218350,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',48700,false,false,'America/New_York'),
('33170','Miami','FL','Miami-Dade',25.554380,-80.388190,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',36200,false,false,'America/New_York'),
('33172','Miami','FL','Miami-Dade',25.766980,-80.352820,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',58400,false,false,'America/New_York'),
('33174','Miami','FL','Miami-Dade',25.762710,-80.327150,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',51800,false,false,'America/New_York'),
('33175','Miami','FL','Miami-Dade',25.725090,-80.386620,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',56300,false,false,'America/New_York'),
('33176','Miami','FL','Miami-Dade',25.671290,-80.343150,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',47900,false,false,'America/New_York'),
('33177','Miami','FL','Miami-Dade',25.632490,-80.387360,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',52100,false,false,'America/New_York'),
('33178','Miami','FL','Miami-Dade',25.815920,-80.383780,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',49600,false,false,'America/New_York'),
('33179','Miami','FL','Miami-Dade',25.946440,-80.176070,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',44800,false,false,'America/New_York'),
('33180','Aventura','FL','Miami-Dade',25.957250,-80.142350,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',31700,false,false,'America/New_York'),
('33181','North Miami','FL','Miami-Dade',25.891660,-80.162540,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',38200,false,false,'America/New_York'),
('33182','Miami','FL','Miami-Dade',25.762430,-80.368250,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',29400,false,false,'America/New_York'),
('33183','Miami','FL','Miami-Dade',25.697590,-80.380450,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',54700,false,false,'America/New_York'),
('33184','Miami','FL','Miami-Dade',25.748120,-80.374930,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',51300,false,false,'America/New_York'),
('33185','Miami','FL','Miami-Dade',25.721020,-80.407450,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',48600,false,false,'America/New_York'),
('33186','Miami','FL','Miami-Dade',25.659620,-80.379390,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',57200,false,false,'America/New_York'),
('33187','Miami','FL','Miami-Dade',25.620300,-80.414720,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',43800,false,false,'America/New_York'),
('33189','Miami','FL','Miami-Dade',25.570120,-80.360290,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',38400,false,false,'America/New_York'),
('33190','Miami','FL','Miami-Dade',25.545780,-80.319680,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',31200,false,false,'America/New_York'),
('33193','Miami','FL','Miami-Dade',25.696560,-80.412140,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',62400,false,false,'America/New_York'),
('33194','Miami','FL','Miami-Dade',25.754540,-80.401760,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',44700,false,false,'America/New_York'),
('33196','Miami','FL','Miami-Dade',25.665380,-80.414560,'33100','Miami-Fort Lauderdale-Pompano Beach, FL',56900,false,false,'America/New_York')

ON CONFLICT (zip_code) DO UPDATE SET
  city          = EXCLUDED.city,
  state         = EXCLUDED.state,
  county        = EXCLUDED.county,
  latitude      = EXCLUDED.latitude,
  longitude     = EXCLUDED.longitude,
  cbsa_code     = EXCLUDED.cbsa_code,
  cbsa_name     = EXCLUDED.cbsa_name,
  population    = EXCLUDED.population,
  is_defense_hub = EXCLUDED.is_defense_hub,
  is_stem_hub   = EXCLUDED.is_stem_hub,
  timezone      = EXCLUDED.timezone;
