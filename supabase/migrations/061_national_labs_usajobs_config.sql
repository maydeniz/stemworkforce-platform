-- ============================================================================
-- Migration 061: Switch National Labs & Federal Agencies to USAJobs API
-- ============================================================================
-- These sources were configured with integration_method='rss' but had
-- rss_config=NULL, causing 0 items synced. This migration switches them
-- to use the USAJobs Search API with organization/keyword filters.
--
-- National labs are contractor-operated (Workday portals, no public API)
-- but their positions are posted on USAJobs under DOE (agency code 'DN').
-- Federal agencies have their own USAJobs agency subelement codes.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. National Labs → USAJobs API with Keyword filter
--    DOE labs don't have their own agency subelement codes, so we search
--    by lab name as keyword under DOE (Organization='DN').
-- --------------------------------------------------------------------------

-- Oak Ridge National Laboratory
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "DN",
      "keyword": "Oak Ridge National Laboratory"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'Oak Ridge National Laboratory' AND status = 'active';

-- Sandia National Laboratories
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "DN",
      "keyword": "Sandia National Laboratories"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'Sandia National Laboratories' AND status = 'active';

-- Lawrence Livermore National Laboratory
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "DN",
      "keyword": "Lawrence Livermore National Laboratory"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'Lawrence Livermore National Laboratory' AND status = 'active';

-- Los Alamos National Laboratory
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "DN",
      "keyword": "Los Alamos National Laboratory"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'Los Alamos National Laboratory' AND status = 'active';

-- Argonne National Laboratory
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "DN",
      "keyword": "Argonne National Laboratory"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'Argonne National Laboratory' AND status = 'active';

-- National Renewable Energy Laboratory
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "DN",
      "keyword": "National Renewable Energy Laboratory"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'National Renewable Energy Laboratory' AND status = 'active';

-- Pacific Northwest National Laboratory
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "DN",
      "keyword": "Pacific Northwest National Laboratory"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'Pacific Northwest National Laboratory' AND status = 'active';

-- --------------------------------------------------------------------------
-- 2. Federal Agencies → USAJobs API with Agency subelement codes
-- --------------------------------------------------------------------------

-- NASA Internships
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "NN"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'NASA Internships' AND status = 'active';

-- National Science Foundation
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "NF00"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'National Science Foundation' AND status = 'active';

-- National Institutes of Health
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "HE38"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'National Institutes of Health' AND status = 'active';

-- Department of Defense STEM
UPDATE federated_sources
SET integration_method = 'api',
    api_config = '{
      "baseUrl": "https://data.usajobs.gov/api",
      "authType": "api_key",
      "authConfig": {
        "apiKeyHeader": "Authorization-Key",
        "apiKeyEnvVar": "USAJOBS_API_KEY"
      },
      "endpoints": { "jobs": "/Search" },
      "rateLimitPerMinute": 25,
      "paginationConfig": {
        "type": "page",
        "pageParam": "Page",
        "limitParam": "ResultsPerPage",
        "maxItemsPerPage": 50,
        "maxPages": 5
      },
      "responseMapping": {
        "id": "MatchedObjectId",
        "title": "MatchedObjectDescriptor.PositionTitle",
        "description": "MatchedObjectDescriptor.UserArea.Details.JobSummary",
        "url": "MatchedObjectDescriptor.PositionURI",
        "organization": "MatchedObjectDescriptor.OrganizationName",
        "location": "MatchedObjectDescriptor.PositionLocationDisplay",
        "postedDate": "MatchedObjectDescriptor.PublicationStartDate",
        "deadline": "MatchedObjectDescriptor.ApplicationCloseDate"
      },
      "organizationFilter": "DD",
      "keyword": "STEM"
    }'::JSONB,
    updated_at = NOW()
WHERE name = 'Department of Defense STEM' AND status = 'active';

-- --------------------------------------------------------------------------
-- 3. Reset last_sync_at so these sources get picked up in the next sync
-- --------------------------------------------------------------------------
UPDATE federated_sources
SET last_sync_at = NULL,
    total_items_synced = 0
WHERE name IN (
  'Oak Ridge National Laboratory',
  'Sandia National Laboratories',
  'Lawrence Livermore National Laboratory',
  'Los Alamos National Laboratory',
  'Argonne National Laboratory',
  'National Renewable Energy Laboratory',
  'Pacific Northwest National Laboratory',
  'NASA Internships',
  'National Science Foundation',
  'National Institutes of Health',
  'Department of Defense STEM'
) AND status = 'active';
