// ===========================================
// FEDERATION SYNC EDGE FUNCTION
// Synchronizes data from external sources
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ===========================================
// TYPES
// ===========================================

interface FederatedSource {
  id: string;
  name: string;
  short_name: string;
  type: string;
  website: string;
  integration_method: string;
  api_config: APIConfig | null;
  rss_config: RSSConfig | null;
  provides_jobs: boolean;
  provides_internships: boolean;
  provides_challenges: boolean;
  provides_events: boolean;
  provides_scholarships: boolean;
  industries: string[];
  attribution_required: boolean;
  attribution_text: string | null;
}

interface STEMFilterConfig {
  occupationSeriesCodes?: string[];
  titleKeywords?: {
    required?: string[];
    mustContainAll?: string[];
    exclude?: string[];
  };
  descriptionKeywords?: {
    required?: string[];
    mustContainAll?: string[];
    exclude?: string[];
  };
  allowedIndustries?: string[];
  minSalary?: number;
  requireClearance?: boolean;
  educationLevels?: string[];
}

interface APIConfig {
  baseUrl: string;
  authType: string;
  authConfig?: {
    apiKeyHeader?: string;
    apiKeyValue?: string;
  };
  endpoints: Record<string, string>;
  rateLimitPerMinute?: number;
  responseMapping: Record<string, unknown>;
  paginationConfig?: {
    type: string;
    limitParam: string;
    pageParam?: string;
    maxItemsPerPage: number;
    maxPages?: number;
  };
  stemFilters?: STEMFilterConfig;
}

interface RSSConfig {
  feedUrl: string;
  feedType: string;
  fieldMapping: Record<string, string>;
  maxItems?: number;
  stemFilters?: STEMFilterConfig;
}

interface SyncResult {
  itemsFetched: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsRemoved: number;
  itemsFailed: number;
  errors: Array<{
    timestamp: string;
    type: string;
    message: string;
    itemId?: string;
  }>;
}

interface FetchedItem {
  externalId: string;
  title: string;
  description?: string;
  shortDescription?: string;
  sourceUrl: string;
  organizationName: string;
  organizationLogoUrl?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  isRemote?: boolean;
  industries?: string[];
  skills?: string[];
  tags?: string[];
  clearanceRequired?: string;
  contentType: 'job' | 'internship' | 'challenge' | 'event' | 'scholarship';
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  prizeAmount?: number;
  registrationDeadline?: string;
  submissionDeadline?: string;
  eventDate?: string;
  eventEndDate?: string;
  postedAt: string;
  expiresAt?: string;
  occupationCode?: string; // For USAJobs - used for STEM filtering
}

// ===========================================
// STEM OCCUPATION CODES (OPM/USAJobs)
// Only jobs in these series will be fetched
// ===========================================

const STEM_OCCUPATION_CODES = [
  // ENGINEERING (0800 Series)
  '0801', '0802', '0803', '0804', '0806', '0808', '0810', '0819',
  '0830', '0840', '0850', '0854', '0855', '0856', '0858', '0861',
  '0871', '0880', '0881', '0890', '0893', '0894', '0895', '0896',

  // PHYSICAL SCIENCES (1300 Series)
  '1301', '1306', '1310', '1311', '1313', '1315', '1316', '1320',
  '1321', '1330', '1340', '1341', '1350', '1360', '1370', '1372',
  '1373', '1380', '1382', '1384',

  // MATHEMATICS & STATISTICS (1500 Series)
  '1501', '1510', '1515', '1520', '1521', '1529', '1530', '1531',
  '1540', '1541', '1550', '1560',

  // INFORMATION TECHNOLOGY (2200 Series)
  '2210',

  // BIOLOGICAL SCIENCES (0400 Series)
  '0401', '0403', '0404', '0405', '0408', '0410', '0413', '0414',
  '0415', '0420', '0430', '0434', '0435', '0436', '0437', '0440',
  '0454', '0455', '0457', '0458', '0459', '0460', '0462', '0470',
  '0471', '0480', '0482', '0485', '0486', '0487',

  // MEDICAL STEM (0600 Series - select)
  '0601', '0602', '0630', '0633', '0640', '0642', '0644', '0645',
  '0646', '0647', '0648', '0649', '0650', '0651', '0660', '0665',
  '0685', '0688', '0690', '0696',

  // CYBERSECURITY / INTEL
  '0132', '0080', '1811',

  // AEROSPACE
  '2181', '2183', '2185',
];

// STEM Keywords for title matching
const STEM_TITLE_KEYWORDS = [
  'engineer', 'scientist', 'developer', 'analyst', 'researcher',
  'technician', 'architect', 'physicist', 'chemist', 'biologist',
  'mathematician', 'statistician', 'data', 'software', 'hardware',
  'cyber', 'security', 'nuclear', 'quantum', 'machine learning',
  'robotics', 'aerospace', 'semiconductor', 'biotech', 'computational',
  'laboratory', 'research', 'science', 'technology', 'programming',
  'cloud', 'devops', 'network', 'systems', 'database', 'electrical',
  'mechanical', 'chemical', 'materials', 'manufacturing', 'automation',
  'cryptograph', 'intelligence', 'physics', 'biology', 'chemistry',
];

// Keywords to EXCLUDE (non-STEM roles)
const EXCLUDE_TITLE_KEYWORDS = [
  'administrative assistant', 'secretary', 'receptionist', 'clerk',
  'custodian', 'janitor', 'food service', 'cook', 'cashier',
  'retail', 'sales representative', 'customer service representative',
  'human resources specialist', 'recruiter', 'paralegal',
  'legal assistant', 'accounting clerk', 'budget analyst',
  'contract specialist', 'procurement clerk', 'supply technician',
  'mail clerk', 'file clerk', 'office automation clerk',
  'transportation assistant', 'motor vehicle operator',
];

// ===========================================
// STEM FILTERING FUNCTIONS
// ===========================================

function isSTEMOccupationCode(code: string | undefined): boolean {
  if (!code) return false;
  // Extract first 4 digits of occupation code
  const seriesCode = code.substring(0, 4);
  return STEM_OCCUPATION_CODES.includes(seriesCode);
}

function passesSTEMTitleFilter(title: string): boolean {
  const lowerTitle = title.toLowerCase();

  // Check for excluded keywords first
  for (const exclude of EXCLUDE_TITLE_KEYWORDS) {
    if (lowerTitle.includes(exclude.toLowerCase())) {
      console.log(`STEM Filter: Rejected "${title}" - contains excluded keyword "${exclude}"`);
      return false;
    }
  }

  // Check for required STEM keywords
  for (const keyword of STEM_TITLE_KEYWORDS) {
    if (lowerTitle.includes(keyword.toLowerCase())) {
      return true;
    }
  }

  // If no STEM keyword found, reject
  console.log(`STEM Filter: Rejected "${title}" - no STEM keywords found`);
  return false;
}

function passesSTEMFilter(item: FetchedItem, stemFilters?: STEMFilterConfig): boolean {
  // If no filters configured, use default STEM filtering
  if (!stemFilters) {
    // Default: must pass title keyword filter
    return passesSTEMTitleFilter(item.title);
  }

  // Check occupation code filter (for USAJobs)
  if (stemFilters.occupationSeriesCodes && stemFilters.occupationSeriesCodes.length > 0) {
    if (!item.occupationCode) {
      // No occupation code available, fall back to title filter
      if (!passesSTEMTitleFilter(item.title)) return false;
    } else {
      const seriesCode = item.occupationCode.substring(0, 4);
      if (!stemFilters.occupationSeriesCodes.includes(seriesCode)) {
        console.log(`STEM Filter: Rejected "${item.title}" - occupation code ${seriesCode} not in allowed list`);
        return false;
      }
    }
  }

  // Check title keywords
  if (stemFilters.titleKeywords) {
    const lowerTitle = item.title.toLowerCase();

    // Check excluded keywords
    if (stemFilters.titleKeywords.exclude) {
      for (const exclude of stemFilters.titleKeywords.exclude) {
        if (lowerTitle.includes(exclude.toLowerCase())) {
          console.log(`STEM Filter: Rejected "${item.title}" - contains excluded keyword "${exclude}"`);
          return false;
        }
      }
    }

    // Check required keywords (OR logic - must have at least one)
    if (stemFilters.titleKeywords.required && stemFilters.titleKeywords.required.length > 0) {
      const hasRequired = stemFilters.titleKeywords.required.some(
        keyword => lowerTitle.includes(keyword.toLowerCase())
      );
      if (!hasRequired) {
        console.log(`STEM Filter: Rejected "${item.title}" - missing required keywords`);
        return false;
      }
    }

    // Check mustContainAll keywords (AND logic)
    if (stemFilters.titleKeywords.mustContainAll) {
      for (const keyword of stemFilters.titleKeywords.mustContainAll) {
        if (!lowerTitle.includes(keyword.toLowerCase())) {
          console.log(`STEM Filter: Rejected "${item.title}" - missing required keyword "${keyword}"`);
          return false;
        }
      }
    }
  }

  // Check description keywords if configured
  if (stemFilters.descriptionKeywords && item.description) {
    const lowerDesc = item.description.toLowerCase();

    if (stemFilters.descriptionKeywords.exclude) {
      for (const exclude of stemFilters.descriptionKeywords.exclude) {
        if (lowerDesc.includes(exclude.toLowerCase())) {
          return false;
        }
      }
    }
  }

  // Check minimum salary if configured
  if (stemFilters.minSalary && item.salaryMin) {
    if (item.salaryMin < stemFilters.minSalary) {
      return false;
    }
  }

  // Check clearance requirement if configured
  if (stemFilters.requireClearance && !item.clearanceRequired) {
    return false;
  }

  return true;
}

// ===========================================
// MAIN HANDLER
// ===========================================

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { source_id, sync_job_id, action } = await req.json();

    if (action === 'sync_all') {
      // Sync all active sources
      const { data: sources, error } = await supabase
        .from('federated_sources')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      const results = [];
      for (const source of sources || []) {
        try {
          const result = await syncSource(supabase, source);
          results.push({ sourceId: source.id, sourceName: source.name, ...result });
        } catch (err) {
          results.push({
            sourceId: source.id,
            sourceName: source.name,
            error: err.message,
          });
        }
      }

      return new Response(
        JSON.stringify({ success: true, results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!source_id) {
      throw new Error('source_id is required');
    }

    // Get source configuration
    const { data: source, error: sourceError } = await supabase
      .from('federated_sources')
      .select('*')
      .eq('id', source_id)
      .single();

    if (sourceError) throw sourceError;
    if (!source) throw new Error('Source not found');

    // Update sync job status
    if (sync_job_id) {
      await supabase
        .from('sync_jobs')
        .update({ status: 'running', started_at: new Date().toISOString() })
        .eq('id', sync_job_id);
    }

    // Perform sync
    const result = await syncSource(supabase, source);

    // Update sync job with results
    if (sync_job_id) {
      await supabase
        .from('sync_jobs')
        .update({
          status: result.errors.length > 0 ? 'completed' : 'completed',
          completed_at: new Date().toISOString(),
          items_fetched: result.itemsFetched,
          items_created: result.itemsCreated,
          items_updated: result.itemsUpdated,
          items_removed: result.itemsRemoved,
          items_failed: result.itemsFailed,
          errors: result.errors,
        })
        .eq('id', sync_job_id);
    }

    // Update source metadata
    await supabase
      .from('federated_sources')
      .update({
        last_sync_at: new Date().toISOString(),
        last_successful_sync_at: result.errors.length === 0 ? new Date().toISOString() : undefined,
        sync_error_count: result.errors.length > 0 ? supabase.sql`sync_error_count + 1` : 0,
        total_items_synced: result.itemsFetched,
        updated_at: new Date().toISOString(),
      })
      .eq('id', source_id);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync error:', error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

// ===========================================
// SYNC SOURCE
// ===========================================

async function syncSource(supabase: ReturnType<typeof createClient>, source: FederatedSource): Promise<SyncResult> {
  const result: SyncResult = {
    itemsFetched: 0,
    itemsCreated: 0,
    itemsUpdated: 0,
    itemsRemoved: 0,
    itemsFailed: 0,
    errors: [],
  };

  let items: FetchedItem[] = [];

  try {
    switch (source.integration_method) {
      case 'api':
        items = await fetchFromAPI(source);
        break;
      case 'rss':
        items = await fetchFromRSS(source);
        break;
      default:
        throw new Error(`Unsupported integration method: ${source.integration_method}`);
    }

    result.itemsFetched = items.length;
    console.log(`Fetched ${items.length} items from ${source.name}`);

    // ===========================================
    // STEM FILTERING - Critical step to prevent non-STEM jobs
    // ===========================================
    const stemFilters = source.api_config?.stemFilters || source.rss_config?.stemFilters;
    const filteredItems = items.filter(item => {
      const passes = passesSTEMFilter(item, stemFilters);
      if (!passes) {
        result.itemsFailed++; // Count filtered items as "failed" for stats
      }
      return passes;
    });

    const rejectedCount = items.length - filteredItems.length;
    if (rejectedCount > 0) {
      console.log(`STEM Filter: Rejected ${rejectedCount} non-STEM items from ${source.name}`);
      result.errors.push({
        timestamp: new Date().toISOString(),
        type: 'filter',
        message: `Filtered out ${rejectedCount} non-STEM items`,
      });
    }
    console.log(`Processing ${filteredItems.length} STEM-relevant items from ${source.name}`);

    // Process each STEM-filtered item
    for (const item of filteredItems) {
      try {
        const existingItem = await checkExistingItem(supabase, source.id, item.externalId);

        if (existingItem) {
          // Update existing
          await updateListing(supabase, existingItem.id, item, source);
          result.itemsUpdated++;
        } else {
          // Create new
          await createListing(supabase, item, source);
          result.itemsCreated++;
        }
      } catch (err) {
        result.itemsFailed++;
        result.errors.push({
          timestamp: new Date().toISOString(),
          type: 'save',
          message: err.message,
          itemId: item.externalId,
        });
      }
    }

    // Mark expired items
    const fetchedIds = items.map(i => i.externalId);
    if (fetchedIds.length > 0) {
      const { count } = await supabase
        .from('federated_listings')
        .update({ status: 'removed' })
        .eq('source_id', source.id)
        .eq('status', 'active')
        .not('external_id', 'in', `(${fetchedIds.join(',')})`)
        .select('*', { count: 'exact', head: true });

      result.itemsRemoved = count || 0;
    }
  } catch (err) {
    result.errors.push({
      timestamp: new Date().toISOString(),
      type: 'fetch',
      message: err.message,
    });
  }

  return result;
}

// ===========================================
// API FETCHER
// ===========================================

async function fetchFromAPI(source: FederatedSource): Promise<FetchedItem[]> {
  if (!source.api_config) {
    throw new Error('API config not found');
  }

  const config = source.api_config;
  const items: FetchedItem[] = [];

  // Build request headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'STEMWorkforce/1.0 (Data Aggregation)',
  };

  if (config.authType === 'api_key' && config.authConfig?.apiKeyHeader && config.authConfig?.apiKeyValue) {
    headers[config.authConfig.apiKeyHeader] = config.authConfig.apiKeyValue;
  }

  // Determine which endpoints to fetch
  const endpoints: { type: string; url: string }[] = [];
  if (source.provides_jobs && config.endpoints.jobs) {
    endpoints.push({ type: 'job', url: config.endpoints.jobs });
  }
  if (source.provides_internships && config.endpoints.internships) {
    endpoints.push({ type: 'internship', url: config.endpoints.internships });
  }
  if (source.provides_challenges && config.endpoints.challenges) {
    endpoints.push({ type: 'challenge', url: config.endpoints.challenges });
  }
  if (source.provides_events && config.endpoints.events) {
    endpoints.push({ type: 'event', url: config.endpoints.events });
  }

  // Fetch from each endpoint
  for (const endpoint of endpoints) {
    try {
      let page = 1;
      let hasMore = true;
      const maxPages = config.paginationConfig?.maxPages || 10;

      while (hasMore && page <= maxPages) {
        // Build URL with STEM occupation filters for USAJobs
        const url = buildAPIUrl(
          config.baseUrl,
          endpoint.url,
          config.paginationConfig,
          page,
          config.stemFilters
        );
        console.log(`Fetching: ${url}`);

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const results = extractResults(data, config.responseMapping);

        for (const result of results) {
          const item = transformAPIResult(result, source, endpoint.type as FetchedItem['contentType'], config.responseMapping);
          items.push(item);
        }

        // Check if more pages
        hasMore = results.length >= (config.paginationConfig?.maxItemsPerPage || 50);
        page++;

        // Rate limiting
        if (config.rateLimitPerMinute) {
          const delay = 60000 / config.rateLimitPerMinute;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (err) {
      console.error(`Error fetching from ${endpoint.url}:`, err);
    }
  }

  return items;
}

function buildAPIUrl(
  baseUrl: string,
  endpoint: string,
  pagination: APIConfig['paginationConfig'],
  page: number,
  stemFilters?: STEMFilterConfig
): string {
  const url = new URL(endpoint, baseUrl);

  if (pagination) {
    if (pagination.type === 'page' && pagination.pageParam) {
      url.searchParams.set(pagination.pageParam, String(page));
      url.searchParams.set(pagination.limitParam, String(pagination.maxItemsPerPage));
    } else if (pagination.type === 'offset') {
      const offset = (page - 1) * pagination.maxItemsPerPage;
      url.searchParams.set(pagination.limitParam, String(pagination.maxItemsPerPage));
    }
  }

  // ===========================================
  // USAJobs-specific STEM filters
  // Add occupation series codes to filter at API level
  // This dramatically reduces data transfer and processing
  // ===========================================
  if (baseUrl.includes('usajobs.gov') && stemFilters?.occupationSeriesCodes) {
    // USAJobs uses JobCategoryCode parameter for occupation series
    // Multiple codes separated by semicolon
    const codes = stemFilters.occupationSeriesCodes.join(';');
    url.searchParams.set('JobCategoryCode', codes);
    console.log(`USAJobs: Filtering by ${stemFilters.occupationSeriesCodes.length} occupation codes`);
  }

  // For USAJobs, we can also use keyword filtering at API level
  if (baseUrl.includes('usajobs.gov') && stemFilters?.titleKeywords?.required) {
    // Use the first few keywords as API-level filter
    // Secondary filtering happens after fetch
    const keywords = stemFilters.titleKeywords.required.slice(0, 5).join(' OR ');
    if (keywords) {
      url.searchParams.set('Keyword', keywords);
    }
  }

  return url.toString();
}

function extractResults(data: unknown, mapping: Record<string, unknown>): unknown[] {
  // For USAJobs-style responses
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if (obj.SearchResult && Array.isArray((obj.SearchResult as Record<string, unknown>).SearchResultItems)) {
      return (obj.SearchResult as Record<string, unknown>).SearchResultItems as unknown[];
    }
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(data)) return data;
  }
  return [];
}

function transformAPIResult(
  result: unknown,
  source: FederatedSource,
  contentType: FetchedItem['contentType'],
  mapping: Record<string, unknown>
): FetchedItem {
  const obj = result as Record<string, unknown>;

  // Helper to extract nested values
  const getValue = (path: string): unknown => {
    return path.split('.').reduce((acc, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  // Extract occupation code for USAJobs (used in STEM filtering)
  let occupationCode: string | undefined;
  if (source.website.includes('usajobs.gov')) {
    // USAJobs stores job category in MatchedObjectDescriptor.JobCategory
    const jobCategory = getValue('MatchedObjectDescriptor.JobCategory') as Array<{ Code: string }> | undefined;
    if (jobCategory && jobCategory.length > 0) {
      occupationCode = jobCategory[0].Code;
    }
  }

  return {
    externalId: String(getValue(mapping.id as string) || Math.random()),
    title: String(getValue(mapping.title as string) || 'Untitled'),
    description: getValue(mapping.description as string) as string | undefined,
    sourceUrl: String(getValue(mapping.url as string) || source.website),
    organizationName: String(getValue(mapping.organization as string) || source.name),
    location: getValue(mapping.location as string) as string | undefined,
    postedAt: String(getValue(mapping.postedDate as string) || new Date().toISOString()),
    expiresAt: getValue(mapping.deadline as string) as string | undefined,
    contentType,
    industries: source.industries || [],
    occupationCode, // For STEM filtering verification
  };
}

// ===========================================
// RSS FETCHER
// ===========================================

async function fetchFromRSS(source: FederatedSource): Promise<FetchedItem[]> {
  if (!source.rss_config) {
    throw new Error('RSS config not found');
  }

  const config = source.rss_config;
  const items: FetchedItem[] = [];

  try {
    const response = await fetch(config.feedUrl, {
      headers: {
        'User-Agent': 'STEMWorkforce/1.0 (Data Aggregation)',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    if (!doc) {
      throw new Error('Failed to parse RSS feed');
    }

    // Handle different feed types
    const feedItems = doc.querySelectorAll('item') || doc.querySelectorAll('entry');

    for (let i = 0; i < Math.min(feedItems.length, config.maxItems || 100); i++) {
      const feedItem = feedItems[i];
      const item = transformRSSItem(feedItem, source, config);
      items.push(item);
    }
  } catch (err) {
    console.error(`Error fetching RSS from ${config.feedUrl}:`, err);
    throw err;
  }

  return items;
}

function transformRSSItem(
  feedItem: Element,
  source: FederatedSource,
  config: RSSConfig
): FetchedItem {
  const getElementText = (selector: string): string | undefined => {
    const el = feedItem.querySelector(selector);
    return el?.textContent?.trim() || undefined;
  };

  // Determine content type based on source configuration
  let contentType: FetchedItem['contentType'] = 'job';
  if (source.provides_challenges && !source.provides_jobs) {
    contentType = 'challenge';
  } else if (source.provides_internships && !source.provides_jobs) {
    contentType = 'internship';
  } else if (source.provides_events && !source.provides_jobs) {
    contentType = 'event';
  }

  // Extract guid/id
  const guid = getElementText('guid') || getElementText('id') || Math.random().toString();

  // Extract link
  let link = getElementText('link');
  if (!link) {
    const linkEl = feedItem.querySelector('link');
    link = linkEl?.getAttribute('href') || source.website;
  }

  // Extract date
  const pubDate = getElementText('pubDate') || getElementText('published') || getElementText('dc:date');

  return {
    externalId: guid,
    title: getElementText('title') || 'Untitled',
    description: getElementText('description') || getElementText('content') || getElementText('summary'),
    sourceUrl: link || source.website,
    organizationName: source.name,
    location: getElementText('location'),
    postedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    contentType,
    industries: source.industries || [],
  };
}

// ===========================================
// DATABASE OPERATIONS
// ===========================================

async function checkExistingItem(
  supabase: ReturnType<typeof createClient>,
  sourceId: string,
  externalId: string
): Promise<{ id: string } | null> {
  const { data } = await supabase
    .from('federated_listings')
    .select('id')
    .eq('source_id', sourceId)
    .eq('external_id', externalId)
    .single();

  return data;
}

async function createListing(
  supabase: ReturnType<typeof createClient>,
  item: FetchedItem,
  source: FederatedSource
): Promise<void> {
  const { error } = await supabase
    .from('federated_listings')
    .insert({
      source_id: source.id,
      external_id: item.externalId,
      content_type: item.contentType,
      title: item.title,
      description: item.description,
      short_description: item.shortDescription || (item.description ? item.description.substring(0, 200) : null),
      source_url: item.sourceUrl,
      source_name: source.name,
      source_logo_url: null, // Would need to be added to source config
      attribution_html: source.attribution_required ? source.attribution_text : null,
      organization_name: item.organizationName,
      organization_logo_url: item.organizationLogoUrl,
      organization_type: source.type,
      location: item.location,
      city: item.city,
      state: item.state,
      country: item.country || 'USA',
      is_remote: item.isRemote || false,
      industries: item.industries || source.industries || [],
      skills: item.skills || [],
      tags: item.tags || [],
      clearance_required: item.clearanceRequired,
      job_type: item.jobType,
      salary_min: item.salaryMin,
      salary_max: item.salaryMax,
      salary_currency: item.salaryCurrency || 'USD',
      salary_period: item.salaryPeriod,
      prize_amount: item.prizeAmount,
      registration_deadline: item.registrationDeadline,
      submission_deadline: item.submissionDeadline,
      event_date: item.eventDate,
      event_end_date: item.eventEndDate,
      posted_at: item.postedAt,
      expires_at: item.expiresAt,
      status: 'active',
    });

  if (error) throw error;
}

async function updateListing(
  supabase: ReturnType<typeof createClient>,
  id: string,
  item: FetchedItem,
  source: FederatedSource
): Promise<void> {
  const { error } = await supabase
    .from('federated_listings')
    .update({
      title: item.title,
      description: item.description,
      short_description: item.shortDescription || (item.description ? item.description.substring(0, 200) : null),
      source_url: item.sourceUrl,
      location: item.location,
      city: item.city,
      state: item.state,
      is_remote: item.isRemote,
      industries: item.industries || source.industries,
      skills: item.skills,
      tags: item.tags,
      clearance_required: item.clearanceRequired,
      salary_min: item.salaryMin,
      salary_max: item.salaryMax,
      expires_at: item.expiresAt,
      last_updated_at: new Date().toISOString(),
      status: 'active',
    })
    .eq('id', id);

  if (error) throw error;
}
