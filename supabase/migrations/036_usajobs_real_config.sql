-- ===========================================
-- USAJOBS API REAL CONFIGURATION
-- Configure USAJobs source for fetching real federal STEM internships
-- ===========================================

-- Update the USAJobs source with proper API configuration
UPDATE federated_sources
SET
  status = 'active',
  provides_jobs = true,
  provides_internships = true,
  sync_frequency = 'daily',
  api_config = '{
    "baseUrl": "https://data.usajobs.gov/api",
    "authType": "api_key",
    "authConfig": {
      "apiKeyHeader": "Authorization-Key",
      "apiKeyEnvVar": "USAJOBS_API_KEY"
    },
    "endpoints": {
      "jobs": "/Search",
      "internships": "/Search"
    },
    "rateLimitPerMinute": 25,
    "paginationConfig": {
      "type": "page",
      "pageParam": "Page",
      "limitParam": "ResultsPerPage",
      "maxItemsPerPage": 100,
      "maxPages": 10
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
    "stemFilters": {
      "occupationSeriesCodes": [
        "0801", "0802", "0803", "0804", "0806", "0808", "0810", "0819",
        "0830", "0840", "0850", "0854", "0855", "0856", "0858", "0861",
        "0871", "0880", "0881", "0890", "0893", "0894", "0895", "0896",
        "1301", "1306", "1310", "1311", "1313", "1315", "1316", "1320",
        "1321", "1330", "1340", "1341", "1350", "1360", "1370", "1372",
        "1501", "1510", "1515", "1520", "1521", "1529", "1530", "1531",
        "1540", "1541", "1550", "1560",
        "2210",
        "0401", "0403", "0404", "0405", "0408", "0410", "0413", "0414",
        "0601", "0602", "0644", "0645", "0685", "0690",
        "0132", "0080", "1811",
        "2181", "2183", "2185"
      ],
      "titleKeywords": {
        "required": [
          "engineer", "scientist", "developer", "analyst", "researcher",
          "technician", "physicist", "chemist", "biologist", "mathematician",
          "data", "software", "cyber", "nuclear", "quantum", "aerospace"
        ],
        "exclude": [
          "administrative assistant", "secretary", "receptionist", "clerk",
          "custodian", "janitor", "food service", "cashier", "retail"
        ]
      }
    }
  }'::JSONB,
  updated_at = NOW()
WHERE short_name = 'USAJOBS';

-- Verify the update
SELECT
  name,
  short_name,
  status,
  provides_jobs,
  provides_internships,
  api_config->>'baseUrl' as api_base_url
FROM federated_sources
WHERE short_name = 'USAJOBS';
