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
  | 'partner_portal'    // Direct posting via partner portal
  | 'greenhouse_api'    // Greenhouse Job Board API (public, no auth)
  | 'lever_api';        // Lever Postings API (public, no auth)

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
// STEM FILTERING CONFIGURATION
// Critical: Ensures only STEM-relevant content is synced
// ===========================================

export interface STEMFilterConfig {
  // USAJobs-specific: Federal occupation series codes (OPM codes)
  // Only jobs in these series will be fetched
  occupationSeriesCodes?: string[];

  // Keyword-based filtering
  titleKeywords?: {
    required?: string[];       // Must contain at least one (OR)
    mustContainAll?: string[]; // Must contain all (AND)
    exclude?: string[];        // Reject if contains any
  };

  descriptionKeywords?: {
    required?: string[];       // Must contain at least one (OR)
    mustContainAll?: string[]; // Must contain all (AND)
    exclude?: string[];        // Reject if contains any
  };

  // Industry-based filtering
  allowedIndustries?: string[];  // Only sync if matches these industries

  // Additional filters
  minSalary?: number;           // Minimum salary threshold
  requireClearance?: boolean;   // Only jobs requiring clearance
  educationLevels?: string[];   // Required education levels
}

// ===========================================
// STEM OCCUPATION CODES (OPM/USAJobs)
// Comprehensive list of STEM-related federal job series
// ===========================================

export const STEM_OCCUPATION_CODES = {
  // ENGINEERING (0800 Series)
  engineering: [
    '0801', // General Engineering
    '0802', // Engineering Technician
    '0803', // Safety Engineering
    '0804', // Fire Protection Engineering
    '0806', // Materials Engineering
    '0807', // Landscape Architecture
    '0808', // Architecture
    '0809', // Construction Control
    '0810', // Civil Engineering
    '0819', // Environmental Engineering
    '0830', // Mechanical Engineering
    '0840', // Nuclear Engineering
    '0850', // Electrical Engineering
    '0854', // Computer Engineering
    '0855', // Electronics Engineering
    '0856', // Electronics Technician
    '0858', // Biomedical Engineering
    '0861', // Aerospace Engineering
    '0871', // Naval Architecture
    '0880', // Mining Engineering
    '0881', // Petroleum Engineering
    '0890', // Agricultural Engineering
    '0893', // Chemical Engineering
    '0894', // Welding Engineering
    '0895', // Industrial Engineering
    '0896', // Quality Assurance
  ],

  // PHYSICAL SCIENCES (1300 Series)
  physicalSciences: [
    '1301', // General Physical Science
    '1306', // Health Physics
    '1310', // Physics
    '1311', // Physical Science Technician
    '1313', // Geophysics
    '1315', // Hydrology
    '1316', // Hydrologic Technician
    '1320', // Chemistry
    '1321', // Metallurgy
    '1330', // Astronomy and Space Science
    '1340', // Meteorology
    '1341', // Meteorological Technician
    '1350', // Geology
    '1360', // Oceanography
    '1370', // Cartography
    '1372', // Geodesy
    '1373', // Land Surveying
    '1380', // Forest Products Technology
    '1382', // Food Technology
    '1384', // Textile Technology
  ],

  // MATHEMATICS & STATISTICS (1500 Series)
  mathematics: [
    '1501', // General Mathematics and Statistics
    '1510', // Actuarial Science
    '1515', // Operations Research
    '1520', // Mathematics
    '1521', // Mathematics Technician
    '1529', // Mathematical Statistician
    '1530', // Statistics
    '1531', // Statistical Assistant
    '1540', // Cryptography
    '1541', // Cryptanalysis
    '1550', // Computer Science
    '1560', // Data Science
  ],

  // INFORMATION TECHNOLOGY (2200 Series)
  informationTechnology: [
    '2210', // IT Management
    '2220', // IT Project Management (DEPRECATED - merged into 2210)
  ],

  // BIOLOGICAL SCIENCES (0400 Series)
  biologicalSciences: [
    '0401', // General Biological Science
    '0403', // Microbiology
    '0404', // Biological Science Technician
    '0405', // Pharmacology
    '0408', // Ecology
    '0410', // Zoology
    '0413', // Physiology
    '0414', // Entomology
    '0415', // Toxicology
    '0420', // Wildlife Biology
    '0430', // Botany
    '0434', // Plant Pathology
    '0435', // Plant Physiology
    '0436', // Plant Protection and Quarantine
    '0437', // Horticulture
    '0440', // Genetics
    '0454', // Range Conservation
    '0455', // Range Technician
    '0457', // Soil Conservation
    '0458', // Soil Conservation Technician
    '0459', // Irrigation System Operation
    '0460', // Forestry
    '0462', // Forestry Technician
    '0470', // Soil Science
    '0471', // Agronomy
    '0480', // General Fish and Wildlife Administration
    '0482', // Fish Biology
    '0485', // Wildlife Refuge Management
    '0486', // Wildlife Biology
    '0487', // Animal Science
    '0493', // Home Economics
  ],

  // MEDICAL & HEALTH (0600 Series - select STEM roles)
  medicalSTEM: [
    '0601', // General Health Science
    '0602', // Medical Officer
    '0610', // Nurse
    '0620', // Practical Nurse
    '0630', // Dietitian and Nutritionist
    '0633', // Physical Therapist
    '0635', // Corrective Therapist
    '0636', // Rehabilitation Therapy Assistant
    '0637', // Manual Arts Therapist
    '0638', // Recreation/Creative Arts Therapist
    '0639', // Educational Therapist
    '0640', // Health Aid and Technician
    '0642', // Nuclear Medicine Technician
    '0644', // Medical Technologist
    '0645', // Medical Technician
    '0646', // Pathology Technician
    '0647', // Diagnostic Radiologic Technologist
    '0648', // Therapeutic Radiologic Technologist
    '0649', // Medical Instrument Technician
    '0650', // Medical Technical Assistant
    '0651', // Respiratory Therapist
    '0660', // Pharmacist
    '0661', // Pharmacy Technician
    '0662', // Optometrist
    '0664', // Restoration Technician
    '0665', // Speech Pathology and Audiology
    '0667', // Orthotist and Prosthetist
    '0668', // Podiatrist
    '0669', // Medical Records Administration
    '0670', // Health System Administration
    '0671', // Health System Specialist
    '0672', // Prosthetic Representative
    '0679', // Medical Support Assistance
    '0680', // Dental Officer
    '0681', // Dental Assistant
    '0682', // Dental Hygiene
    '0683', // Dental Laboratory Aid and Technician
    '0685', // Public Health Program Specialist
    '0688', // Sanitarian
    '0690', // Industrial Hygiene
    '0696', // Consumer Safety
  ],

  // CYBERSECURITY (subset of 2200 + specialized)
  cybersecurity: [
    '2210', // IT Management (includes Cybersecurity)
    '0132', // Intelligence
    '0080', // Security Administration
    '0083', // Police
    '0085', // Security Guard
    '0086', // Security Clerical and Assistance
    '1811', // Criminal Investigation
  ],

  // AEROSPACE & AVIATION
  aerospace: [
    '0861', // Aerospace Engineering
    '1330', // Astronomy and Space Science
    '2181', // Aircraft Operation
    '2183', // Air Navigation
    '2185', // Aircrew Technician
  ],
} as const;

// Flatten all STEM codes for easy use
export const ALL_STEM_OCCUPATION_CODES = [
  ...STEM_OCCUPATION_CODES.engineering,
  ...STEM_OCCUPATION_CODES.physicalSciences,
  ...STEM_OCCUPATION_CODES.mathematics,
  ...STEM_OCCUPATION_CODES.informationTechnology,
  ...STEM_OCCUPATION_CODES.biologicalSciences,
  ...STEM_OCCUPATION_CODES.medicalSTEM,
  ...STEM_OCCUPATION_CODES.cybersecurity,
  ...STEM_OCCUPATION_CODES.aerospace,
];

// STEM Keywords for title/description matching
export const STEM_KEYWORDS = {
  // Must contain at least one of these in title
  titleRequired: [
    'engineer', 'scientist', 'developer', 'analyst', 'researcher',
    'technician', 'architect', 'physicist', 'chemist', 'biologist',
    'mathematician', 'statistician', 'data', 'software', 'hardware',
    'cyber', 'security', 'nuclear', 'quantum', 'AI', 'machine learning',
    'robotics', 'aerospace', 'semiconductor', 'biotech', 'computational',
    'laboratory', 'research', 'STEM', 'science', 'technology',
    'programming', 'coding', 'cloud', 'devops', 'network', 'systems',
    'database', 'electrical', 'mechanical', 'chemical', 'materials',
    'manufacturing', 'automation', 'instrumentation', 'cryptograph',
  ],

  // Exclude jobs with these in title (non-STEM roles)
  titleExclude: [
    'administrative assistant', 'secretary', 'receptionist', 'clerk',
    'custodian', 'janitor', 'food service', 'cook', 'cashier',
    'retail', 'sales representative', 'customer service',
    'human resources specialist', 'recruiter', 'paralegal',
    'legal assistant', 'accounting clerk', 'budget analyst',
    'contract specialist', 'procurement', 'supply technician',
    'mail clerk', 'file clerk', 'office automation',
  ],
} as const;

// ===========================================
// API CONFIGURATION
// ===========================================

export interface APISourceConfig {
  baseUrl: string;
  authType: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth2';

  // Greenhouse/Lever specific
  boardToken?: string;       // Greenhouse board token (e.g. "spacex")
  companySlug?: string;      // Lever company slug (e.g. "rigetti")
  skipSTEMFilter?: boolean;  // Skip STEM title filter for core-industry companies
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

  // STEM-specific filtering configuration
  stemFilters?: STEMFilterConfig;

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
