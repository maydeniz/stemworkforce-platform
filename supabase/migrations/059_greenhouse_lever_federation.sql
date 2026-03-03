-- ===========================================
-- Migration 059: Greenhouse & Lever Federation Sources
-- Adds 22 verified STEM companies using official public APIs
-- No authentication required — these are public job board endpoints
-- ===========================================

-- 1. Extend integration_method CHECK constraint
-- Drop existing and recreate with new values
ALTER TABLE federated_sources
  DROP CONSTRAINT IF EXISTS federated_sources_integration_method_check;

ALTER TABLE federated_sources
  ADD CONSTRAINT federated_sources_integration_method_check
  CHECK (integration_method IN (
    'api', 'rss', 'sitemap', 'ical', 'manual', 'partner_portal',
    'greenhouse_api', 'lever_api'
  ));

-- 2. Insert verified Greenhouse sources (18 companies)
-- Each uses: GET https://api.greenhouse.io/v1/boards/{token}/jobs?content=true
-- No auth, no pagination needed — returns all jobs in one request

INSERT INTO federated_sources (
  name, short_name, type, website, integration_method, status,
  provides_jobs, provides_internships, provides_challenges, provides_events, provides_scholarships,
  industries, attribution_required, attribution_text, data_usage_permission,
  sync_frequency, api_config
) VALUES

-- AEROSPACE
('SpaceX', 'SpaceX', 'industry_partner', 'https://www.spacex.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Aerospace & Defense', 'Advanced Manufacturing', 'Robotics & Automation'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "spacex", "skipSTEMFilter": true}'::jsonb),

('Anduril Industries', 'Anduril', 'industry_partner', 'https://www.anduril.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Aerospace & Defense', 'AI & Machine Learning', 'Cybersecurity'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "andurilindustries", "skipSTEMFilter": true}'::jsonb),

('Rocket Lab', 'Rocket Lab', 'industry_partner', 'https://www.rocketlabusa.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Aerospace & Defense', 'Advanced Manufacturing'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "rocketlab", "skipSTEMFilter": true}'::jsonb),

('Relativity Space', 'Relativity', 'industry_partner', 'https://www.relativityspace.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Aerospace & Defense', 'Advanced Manufacturing', 'Robotics & Automation'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "relativity", "skipSTEMFilter": true}'::jsonb),

('Zipline', 'Zipline', 'industry_partner', 'https://www.flyzipline.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Robotics & Automation', 'Aerospace & Defense', 'Healthcare & Medical Technology'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "flyzipline", "skipSTEMFilter": true}'::jsonb),

-- AI & MACHINE LEARNING
('Anthropic', 'Anthropic', 'industry_partner', 'https://www.anthropic.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['AI & Machine Learning', 'Cybersecurity'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "anthropic", "skipSTEMFilter": true}'::jsonb),

('Databricks', 'Databricks', 'industry_partner', 'https://www.databricks.com/company/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['AI & Machine Learning'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "databricks", "skipSTEMFilter": true}'::jsonb),

('Aurora Innovation', 'Aurora', 'industry_partner', 'https://aurora.tech/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['AI & Machine Learning', 'Robotics & Automation'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "aurorainnovation", "skipSTEMFilter": true}'::jsonb),

-- QUANTUM COMPUTING
('IonQ', 'IonQ', 'industry_partner', 'https://ionq.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Quantum Computing', 'AI & Machine Learning'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "ionq", "skipSTEMFilter": true}'::jsonb),

('PsiQuantum', 'PsiQuantum', 'industry_partner', 'https://www.psiquantum.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Quantum Computing'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "psiquantum", "skipSTEMFilter": true}'::jsonb),

-- NUCLEAR & CLEAN ENERGY
('Kairos Power', 'Kairos', 'industry_partner', 'https://kairospower.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Nuclear Energy', 'Clean Energy & Sustainability'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "kairospower", "skipSTEMFilter": true}'::jsonb),

('Oklo', 'Oklo', 'industry_partner', 'https://oklo.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Nuclear Energy', 'Clean Energy & Sustainability'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "oklo", "skipSTEMFilter": true}'::jsonb),

-- BIOTECHNOLOGY & HEALTHCARE
('Ginkgo Bioworks', 'Ginkgo', 'industry_partner', 'https://www.ginkgobioworks.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Biotechnology', 'AI & Machine Learning'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "ginkgobioworks", "skipSTEMFilter": true}'::jsonb),

('Twist Bioscience', 'Twist Bio', 'industry_partner', 'https://www.twistbioscience.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Biotechnology', 'Healthcare & Medical Technology'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "twistbioscience", "skipSTEMFilter": true}'::jsonb),

-- ROBOTICS & MANUFACTURING
('Agility Robotics', 'Agility', 'industry_partner', 'https://agilityrobotics.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Robotics & Automation', 'AI & Machine Learning', 'Advanced Manufacturing'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "agilityrobotics", "skipSTEMFilter": true}'::jsonb),

('Apptronik', 'Apptronik', 'industry_partner', 'https://apptronik.com/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Robotics & Automation', 'AI & Machine Learning'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "apptronik", "skipSTEMFilter": true}'::jsonb),

('Nuro', 'Nuro', 'industry_partner', 'https://www.nuro.ai/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Robotics & Automation', 'AI & Machine Learning'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "nuro", "skipSTEMFilter": true}'::jsonb),

('Markforged', 'Markforged', 'industry_partner', 'https://markforged.com/about/careers', 'greenhouse_api', 'active',
  true, true, false, false, false,
  ARRAY['Advanced Manufacturing', 'Robotics & Automation'],
  false, NULL, 'public_data', 'daily',
  '{"boardToken": "markforged", "skipSTEMFilter": true}'::jsonb);

-- 3. Insert verified Lever sources (4 companies)
-- Each uses: GET https://api.lever.co/v0/postings/{slug}?mode=json
-- No auth, single request returns all postings

INSERT INTO federated_sources (
  name, short_name, type, website, integration_method, status,
  provides_jobs, provides_internships, provides_challenges, provides_events, provides_scholarships,
  industries, attribution_required, attribution_text, data_usage_permission,
  sync_frequency, api_config
) VALUES

('Shield AI', 'Shield AI', 'industry_partner', 'https://shield.ai/careers', 'lever_api', 'active',
  true, true, false, false, false,
  ARRAY['Aerospace & Defense', 'AI & Machine Learning', 'Cybersecurity'],
  false, NULL, 'public_data', 'daily',
  '{"companySlug": "shieldai", "skipSTEMFilter": true}'::jsonb),

('Zoox', 'Zoox', 'industry_partner', 'https://zoox.com/careers', 'lever_api', 'active',
  true, true, false, false, false,
  ARRAY['Robotics & Automation', 'AI & Machine Learning'],
  false, NULL, 'public_data', 'daily',
  '{"companySlug": "zoox", "skipSTEMFilter": true}'::jsonb),

('Rigetti Computing', 'Rigetti', 'industry_partner', 'https://www.rigetti.com/careers', 'lever_api', 'active',
  true, true, false, false, false,
  ARRAY['Quantum Computing', 'AI & Machine Learning'],
  false, NULL, 'public_data', 'daily',
  '{"companySlug": "rigetti", "skipSTEMFilter": true}'::jsonb),

('Scale AI', 'Scale AI', 'industry_partner', 'https://scale.com/careers', 'lever_api', 'active',
  true, true, false, false, false,
  ARRAY['AI & Machine Learning'],
  false, NULL, 'public_data', 'daily',
  '{"companySlug": "scaleai", "skipSTEMFilter": true}'::jsonb);

-- Summary:
-- 22 companies across all core industries:
--   Aerospace: SpaceX, Anduril, Rocket Lab, Relativity Space, Zipline, Shield AI
--   AI: Anthropic, Databricks, Aurora, Scale AI
--   Quantum: IonQ, PsiQuantum, Rigetti
--   Nuclear: Kairos Power, Oklo
--   Biotech/Healthcare: Ginkgo Bioworks, Twist Bioscience
--   Robotics: Agility Robotics, Apptronik, Nuro, Zoox
--   Manufacturing: Markforged
-- Total estimated listings: ~6,300
