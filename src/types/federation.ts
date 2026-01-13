// ===========================================
// FEDERATION & DATA AGGREGATION TYPES
// Multi-source job, internship, challenge integration
// ===========================================

import type { IndustryType, ClearanceLevel, JobType } from './index';

// ===========================================
// SOURCE CONFIGURATION
// ===========================================

export type FederatedSourceType =
  | 'national_lab'      // DOE National Labs
  | 'federal_agency'    // USAJobs, NASA, NSF, NIH, DoD
  | 'industry_partner'  // Tech companies, defense contractors
  | 'university'        // College career centers, research labs
  | 'nonprofit'         // Foundations, research organizations
  | 'challenge_platform'; // Challenge.gov, HeroX, etc.

export type IntegrationMethod =
  | 'api'               // Direct API integration (preferred)
  | 'rss'               // RSS/Atom feed
  | 'sitemap'           // Structured sitemap parsing
  | 'ical'              // iCal for events
  | 'manual'            // Manual entry or upload
  | 'partner_portal';   // Direct posting via partner portal

export type SyncFrequency =
  | 'realtime'          // Webhook/push-based
  | 'hourly'
  | 'daily'
  | 'weekly';

export interface FederatedSource {
  id: string;
  name: string;
  shortName: string;
  type: FederatedSourceType;
  description?: string;

  // Organization details
  website: string;
  logoUrl?: string;
  contactEmail?: string;
  contactName?: string;

  // Integration configuration
  integrationMethod: IntegrationMethod;
  syncFrequency: SyncFrequency;
  apiConfig?: APISourceConfig;
  rssConfig?: RSSSourceConfig;

  // Content types this source provides
  providesJobs: boolean;
  providesInternships: boolean;
  providesChallenges: boolean;
  providesEvents: boolean;
  providesScholarships: boolean;

  // Filtering and categorization
  industries: IndustryType[];
  defaultClearanceLevel?: ClearanceLevel;
  geographicFocus?: string[];     // States or regions

  // Partnership status
  status: 'pending' | 'active' | 'paused' | 'inactive';
  partnershipTier: 'basic' | 'verified' | 'premium' | 'strategic';
  isOfficialPartner: boolean;     // Have they signed a partnership agreement?
  canDirectPost: boolean;         // Can they post directly to our platform?

  // Legal & compliance
  termsAccepted: boolean;
  attributionRequired: boolean;
  attributionText?: string;
  dataUsagePermission: 'public_data' | 'explicit_permission' | 'partnership_agreement';

  // Sync metadata
  lastSyncAt?: string;
  lastSuccessfulSyncAt?: string;
  syncErrorCount: number;
  totalItemsSynced: number;

  createdAt: string;
  updatedAt: string;
}

// ===========================================
// API CONFIGURATION
// ===========================================

export interface APISourceConfig {
  baseUrl: string;
  authType: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth2';
  authConfig?: {
    apiKeyHeader?: string;
    apiKeyValue?: string;         // Store securely
    bearerToken?: string;
    basicAuth?: { username: string; password: string };
    oauth2?: {
      clientId: string;
      clientSecret: string;
      tokenUrl: string;
      scopes?: string[];
    };
  };

  endpoints: {
    jobs?: string;
    internships?: string;
    challenges?: string;
    events?: string;
  };

  // Request configuration
  rateLimitPerMinute?: number;
  rateLimitPerDay?: number;
  requestHeaders?: Record<string, string>;

  // Response mapping
  responseMapping: DataFieldMapping;
  paginationConfig?: PaginationConfig;
}

export interface RSSSourceConfig {
  feedUrl: string;
  feedType: 'rss' | 'atom' | 'json_feed';
  itemSelector?: string;          // For custom parsing
  fieldMapping: DataFieldMapping;
  maxItems?: number;
}

export interface DataFieldMapping {
  // Standard field mappings (source field -> our field)
  id: string;
  title: string;
  description: string;
  url: string;
  postedDate?: string;
  deadline?: string;
  location?: string;
  organization?: string;
  salary?: {
    min?: string;
    max?: string;
    currency?: string;
  };
  clearance?: string;
  industry?: string;
  skills?: string;

  // Custom transformers
  transformers?: {
    [field: string]: {
      type: 'map' | 'split' | 'parse_date' | 'extract' | 'default';
      config: Record<string, unknown>;
    };
  };
}

export interface PaginationConfig {
  type: 'offset' | 'page' | 'cursor';
  limitParam: string;
  offsetParam?: string;
  pageParam?: string;
  cursorParam?: string;
  cursorResponsePath?: string;
  maxItemsPerPage: number;
  maxPages?: number;
}

// ===========================================
// FEDERATED CONTENT ITEMS
// ===========================================

export interface FederatedListing {
  id: string;
  sourceId: string;              // Reference to FederatedSource
  externalId: string;            // ID from the original source
  contentType: 'job' | 'internship' | 'challenge' | 'event' | 'scholarship';

  // Core content
  title: string;
  description: string;
  shortDescription?: string;

  // Source attribution
  sourceUrl: string;             // Original URL - users click through to apply
  sourceName: string;
  sourceLogoUrl?: string;
  attributionHtml?: string;      // Required attribution text/HTML

  // Organization
  organizationName: string;
  organizationLogoUrl?: string;
  organizationType?: FederatedSourceType;

  // Location
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  isRemote?: boolean;

  // Categorization
  industries: IndustryType[];
  skills?: string[];
  tags?: string[];
  clearanceRequired?: ClearanceLevel;

  // Job-specific fields
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: 'hourly' | 'monthly' | 'yearly';
  experienceLevel?: string;
  educationRequired?: string;

  // Challenge-specific fields
  prizeAmount?: number;
  registrationDeadline?: string;
  submissionDeadline?: string;
  challengeType?: string;

  // Event-specific fields
  eventDate?: string;
  eventEndDate?: string;
  eventType?: string;
  isVirtual?: boolean;
  registrationUrl?: string;

  // Dates
  postedAt: string;
  expiresAt?: string;

  // Sync metadata
  syncedAt: string;
  lastUpdatedAt: string;
  checksum?: string;             // For detecting changes

  // Platform metadata
  status: 'active' | 'expired' | 'removed' | 'pending_review';
  viewCount: number;
  clickThroughCount: number;
  saveCount: number;
  isFeatured: boolean;
  qualityScore?: number;         // AI-assessed quality score
  relevanceBoost?: number;       // Manual relevance boost

  // Search optimization
  searchableContent?: string;    // Combined text for full-text search
  embeddings?: number[];         // Vector embeddings for semantic search

  createdAt: string;
  updatedAt: string;
}

// ===========================================
// SYNC & PIPELINE TYPES
// ===========================================

export interface SyncJob {
  id: string;
  sourceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

  // Timing
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;

  // Results
  itemsFetched: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsRemoved: number;
  itemsFailed: number;

  // Errors
  errors?: SyncError[];

  // Metadata
  triggeredBy: 'schedule' | 'manual' | 'webhook';
  triggeredByUserId?: string;
}

export interface SyncError {
  timestamp: string;
  type: 'fetch' | 'parse' | 'transform' | 'save' | 'validation';
  message: string;
  itemId?: string;
  details?: Record<string, unknown>;
  retryable: boolean;
}

export interface SyncStats {
  sourceId: string;
  period: 'day' | 'week' | 'month' | 'all_time';

  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;

  totalItemsSynced: number;
  totalItemsActive: number;
  totalItemsExpired: number;

  avgSyncDuration: number;       // In seconds
  lastSyncDuration?: number;

  // Engagement metrics
  totalViews: number;
  totalClickThroughs: number;
  clickThroughRate: number;      // Percentage

  // Quality metrics
  avgQualityScore?: number;
  itemsWithIssues: number;
}

// ===========================================
// PARTNER PORTAL TYPES
// ===========================================

export interface PartnerPortalAccess {
  id: string;
  sourceId: string;
  userId: string;

  // Permissions
  canViewListings: boolean;
  canCreateListings: boolean;
  canEditListings: boolean;
  canDeleteListings: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canInviteUsers: boolean;

  // Limits
  maxActiveListings?: number;
  maxFeaturedListings?: number;

  status: 'active' | 'suspended' | 'pending';

  invitedBy?: string;
  invitedAt?: string;
  acceptedAt?: string;
  lastAccessAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface PartnerAnalytics {
  sourceId: string;
  period: 'day' | 'week' | 'month' | 'year';

  // Listing metrics
  totalListings: number;
  activeListings: number;
  expiredListings: number;

  // Engagement
  totalImpressions: number;
  totalClicks: number;
  totalApplications: number;     // If trackable

  clickThroughRate: number;
  applicationRate: number;

  // Top performers
  topListingsByViews: string[];
  topListingsByClicks: string[];

  // Demographics
  viewerDemographics?: {
    byIndustry: Record<string, number>;
    byLocation: Record<string, number>;
    byEducation: Record<string, number>;
  };
}

// ===========================================
// QUALITY & MODERATION
// ===========================================

export interface ContentQualityCheck {
  listingId: string;
  checkedAt: string;

  // Automated checks
  hasTitle: boolean;
  hasDescription: boolean;
  hasValidUrl: boolean;
  hasClearDeadline: boolean;
  hasLocation: boolean;
  hasOrganization: boolean;

  // Quality scores (0-100)
  descriptionQuality: number;    // Length, clarity, completeness
  relevanceScore: number;        // Match to platform focus
  uniquenessScore: number;       // Duplicate detection

  // Issues found
  issues: {
    type: 'missing_field' | 'low_quality' | 'duplicate' | 'spam' | 'expired' | 'broken_link';
    field?: string;
    message: string;
    severity: 'warning' | 'error';
  }[];

  // Final assessment
  overallScore: number;
  approved: boolean;
  requiresReview: boolean;
  reviewReason?: string;
}

export interface ModerationAction {
  id: string;
  listingId: string;
  action: 'approve' | 'reject' | 'edit' | 'flag' | 'remove' | 'feature';
  reason?: string;
  moderatorId: string;
  createdAt: string;

  // For edits
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

// ===========================================
// PREDEFINED SOURCE CONFIGURATIONS
// ===========================================

export const FEDERAL_API_SOURCES: Partial<FederatedSource>[] = [
  {
    name: 'USAJobs',
    shortName: 'USAJOBS',
    type: 'federal_agency',
    website: 'https://www.usajobs.gov',
    integrationMethod: 'api',
    syncFrequency: 'daily',
    providesJobs: true,
    providesInternships: true,
    providesChallenges: false,
    providesEvents: false,
    providesScholarships: false,
    attributionRequired: true,
    attributionText: 'Jobs data provided by USAJobs.gov',
    dataUsagePermission: 'public_data',
    apiConfig: {
      baseUrl: 'https://data.usajobs.gov/api',
      authType: 'api_key',
      endpoints: {
        jobs: '/Search',
      },
      rateLimitPerMinute: 60,
      responseMapping: {
        id: 'MatchedObjectId',
        title: 'PositionTitle',
        description: 'UserArea.Details.JobSummary',
        url: 'PositionURI',
        postedDate: 'PublicationStartDate',
        deadline: 'ApplicationCloseDate',
        location: 'PositionLocationDisplay',
        organization: 'OrganizationName',
        salary: {
          min: 'PositionRemuneration[0].MinimumRange',
          max: 'PositionRemuneration[0].MaximumRange',
        },
      },
      paginationConfig: {
        type: 'page',
        limitParam: 'ResultsPerPage',
        pageParam: 'Page',
        maxItemsPerPage: 500,
      },
    },
  },
  {
    name: 'Challenge.gov',
    shortName: 'Challenge.gov',
    type: 'federal_agency',
    website: 'https://www.challenge.gov',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    providesJobs: false,
    providesInternships: false,
    providesChallenges: true,
    providesEvents: true,
    providesScholarships: false,
    attributionRequired: true,
    attributionText: 'Federal challenges provided by Challenge.gov, GSA',
    dataUsagePermission: 'public_data',
  },
];

export const NATIONAL_LAB_SOURCES: Partial<FederatedSource>[] = [
  {
    name: 'Oak Ridge National Laboratory',
    shortName: 'ORNL',
    type: 'national_lab',
    website: 'https://jobs.ornl.gov',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['nuclear', 'clean-energy', 'ai', 'quantum'],
  },
  {
    name: 'Sandia National Laboratories',
    shortName: 'Sandia',
    type: 'national_lab',
    website: 'https://www.sandia.gov/careers/',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['nuclear', 'cybersecurity', 'aerospace'],
  },
  {
    name: 'Lawrence Livermore National Laboratory',
    shortName: 'LLNL',
    type: 'national_lab',
    website: 'https://careers.llnl.gov',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['nuclear', 'ai', 'cybersecurity'],
  },
  {
    name: 'Los Alamos National Laboratory',
    shortName: 'LANL',
    type: 'national_lab',
    website: 'https://lanl.jobs',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['nuclear', 'quantum', 'ai'],
  },
  {
    name: 'Argonne National Laboratory',
    shortName: 'ANL',
    type: 'national_lab',
    website: 'https://www.anl.gov/hr/careers',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['clean-energy', 'ai', 'quantum', 'manufacturing'],
  },
  {
    name: 'Brookhaven National Laboratory',
    shortName: 'BNL',
    type: 'national_lab',
    website: 'https://jobs.bnl.gov',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['nuclear', 'quantum', 'clean-energy'],
  },
  {
    name: 'Pacific Northwest National Laboratory',
    shortName: 'PNNL',
    type: 'national_lab',
    website: 'https://careers.pnnl.gov',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['clean-energy', 'cybersecurity', 'ai'],
  },
  {
    name: 'National Renewable Energy Laboratory',
    shortName: 'NREL',
    type: 'national_lab',
    website: 'https://www.nrel.gov/careers/',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['clean-energy', 'manufacturing'],
  },
  {
    name: 'Fermi National Accelerator Laboratory',
    shortName: 'Fermilab',
    type: 'national_lab',
    website: 'https://www.fnal.gov/pub/forphysicists/fellowships/',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['quantum', 'ai'],
  },
  {
    name: 'SLAC National Accelerator Laboratory',
    shortName: 'SLAC',
    type: 'national_lab',
    website: 'https://careers.slac.stanford.edu',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    industries: ['quantum', 'ai'],
  },
];

export const FEDERAL_AGENCY_SOURCES: Partial<FederatedSource>[] = [
  {
    name: 'NASA Internships',
    shortName: 'NASA OSSI',
    type: 'federal_agency',
    website: 'https://intern.nasa.gov',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    providesJobs: false,
    providesInternships: true,
    industries: ['aerospace', 'ai', 'robotics'],
  },
  {
    name: 'National Science Foundation',
    shortName: 'NSF',
    type: 'federal_agency',
    website: 'https://www.nsf.gov/careers/',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    providesJobs: true,
    providesInternships: true,
    providesScholarships: true,
  },
  {
    name: 'National Institutes of Health',
    shortName: 'NIH',
    type: 'federal_agency',
    website: 'https://www.training.nih.gov',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    providesJobs: true,
    providesInternships: true,
    industries: ['biotech', 'healthcare', 'ai'],
  },
  {
    name: 'Department of Defense STEM',
    shortName: 'DoD STEM',
    type: 'federal_agency',
    website: 'https://dodstem.us',
    integrationMethod: 'rss',
    syncFrequency: 'daily',
    providesJobs: true,
    providesInternships: true,
    providesScholarships: true,
    industries: ['cybersecurity', 'aerospace', 'ai'],
  },
];
