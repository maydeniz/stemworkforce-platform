-- ===========================================
-- FIX FEDERATION SOURCES
-- Switch national labs and federal agencies from broken RSS
-- to USAJobs API with organization name filters
-- ===========================================

-- 1. Fix USAJobs source: ensure status is active
UPDATE federated_sources
SET status = 'active'
WHERE short_name = 'USAJOBS';

-- 2. National Labs → Use USAJobs API with OrganizationName filter
-- These labs all post positions on USAJobs

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'Oak Ridge'
  )
WHERE short_name = 'ORNL';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'Sandia National'
  )
WHERE short_name = 'Sandia';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'Lawrence Livermore'
  )
WHERE short_name = 'LLNL';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'Los Alamos'
  )
WHERE short_name = 'LANL';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'Argonne'
  )
WHERE short_name = 'ANL';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'National Renewable Energy'
  )
WHERE short_name = 'NREL';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'Pacific Northwest'
  )
WHERE short_name = 'PNNL';

-- 3. Federal agencies that post on USAJobs → use API with org filter

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'National Aeronautics and Space'
  )
WHERE short_name = 'NASA OSSI';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'National Science Foundation'
  )
WHERE short_name = 'NSF';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'National Institutes of Health'
  )
WHERE short_name = 'NIH';

UPDATE federated_sources
SET
  integration_method = 'api',
  status = 'active',
  api_config = jsonb_build_object(
    'baseUrl', 'https://data.usajobs.gov/api',
    'authType', 'api_key',
    'authConfig', jsonb_build_object(
      'apiKeyHeader', 'Authorization-Key',
      'apiKeyEnvVar', 'USAJOBS_API_KEY'
    ),
    'endpoints', jsonb_build_object('jobs', '/Search', 'internships', '/Search'),
    'rateLimitPerMinute', 25,
    'paginationConfig', jsonb_build_object(
      'type', 'page',
      'pageParam', 'Page',
      'limitParam', 'ResultsPerPage',
      'maxItemsPerPage', 100,
      'maxPages', 5
    ),
    'responseMapping', jsonb_build_object(
      'id', 'MatchedObjectId',
      'title', 'MatchedObjectDescriptor.PositionTitle',
      'description', 'MatchedObjectDescriptor.UserArea.Details.JobSummary',
      'url', 'MatchedObjectDescriptor.PositionURI',
      'organization', 'MatchedObjectDescriptor.OrganizationName',
      'location', 'MatchedObjectDescriptor.PositionLocationDisplay',
      'postedDate', 'MatchedObjectDescriptor.PublicationStartDate',
      'deadline', 'MatchedObjectDescriptor.ApplicationCloseDate'
    ),
    'organizationFilter', 'Department of Defense'
  )
WHERE short_name = 'DoD STEM';

-- 4. Deactivate Challenge.gov (RSS-only, no API) until we add scraping
UPDATE federated_sources
SET status = 'inactive'
WHERE short_name = 'Challenge.gov';

-- 5. Deactivate any university sources with no config
UPDATE federated_sources
SET status = 'inactive'
WHERE type = 'university'
  AND integration_method = 'rss'
  AND rss_config IS NULL;

-- 6. Verify the changes
SELECT short_name, status, integration_method,
       api_config->>'organizationFilter' as org_filter,
       api_config->>'baseUrl' as api_url
FROM federated_sources
WHERE status = 'active'
ORDER BY short_name;
