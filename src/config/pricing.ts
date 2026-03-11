// ===========================================
// STEMWORKFORCE PLATFORM - Unified Pricing Configuration
// ===========================================
// Single source of truth for ALL subscription tiers across all 9 persona types.
// Every billing service, pricing page, and feature gate imports from this file.
// ===========================================

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

/**
 * All persona types that have pricing tiers on the platform.
 */
export type PersonaType =
  | 'jobseeker'
  | 'employer'
  | 'industry_partner'
  | 'education_partner'
  | 'service_provider'
  | 'student'
  | 'government'
  | 'national_labs'
  | 'nonprofit';

/**
 * A single pricing tier. Every persona has 2-3 of these.
 *
 * Conventions:
 *   price_monthly  0  = free tier
 *   price_monthly -1  = custom / contact-sales pricing
 *   limits value  -1  = unlimited
 */
export interface PricingTier {
  /** Globally unique id, e.g. "employer_professional_monthly" */
  id: string;
  /** Which persona this tier belongs to */
  persona: PersonaType;
  /** Machine-readable key within the persona, e.g. "free", "pro", "enterprise" */
  tierKey: string;
  /** Human-readable tier name */
  name: string;
  /** Monthly price in USD. 0 = free, -1 = custom/contact sales */
  price_monthly: number;
  /** Annual price in USD (full year). 0 = free, -1 = custom */
  price_annual: number;
  /** Annual billing discount percentage */
  discount_annual_pct: number;
  /** Boolean feature flags for this tier */
  features: Record<string, boolean>;
  /** Numeric limits for this tier. -1 = unlimited */
  limits: Record<string, number>;
  /** If true, the UI should display a "Popular" or "Recommended" badge */
  highlighted?: boolean;
  /** Call-to-action button text */
  cta_text: string;
  /** Call-to-action link / route */
  cta_link: string;
  /** Stripe Price ID for monthly billing (undefined for free / custom tiers) */
  stripe_price_id_monthly?: string;
  /** Stripe Price ID for annual billing (undefined for free / custom tiers) */
  stripe_price_id_annual?: string;
  /** Short marketing description of the tier */
  description: string;
}

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

/** Platform-wide annual billing discount (17 %) */
export const ANNUAL_DISCOUNT_PCT = 17;

/** Human-readable labels for each persona type */
export const PERSONA_LABELS: Record<PersonaType, string> = {
  jobseeker: 'Job Seeker',
  employer: 'Employer',
  industry_partner: 'Industry Partner',
  education_partner: 'Education Partner',
  service_provider: 'Service Provider',
  student: 'Student',
  government: 'Government / Federal',
  national_labs: 'National Labs',
  nonprofit: 'Nonprofit',
};

/**
 * Persona categories for the pricing page.
 * Groups the 9 personas into 3 navigable categories.
 */
export interface PersonaCategory {
  key: string;
  label: string;
  personas: PersonaType[];
}

export const PERSONA_CATEGORIES: PersonaCategory[] = [
  {
    key: 'individuals',
    label: 'Individuals',
    personas: ['jobseeker', 'student'],
  },
  {
    key: 'organizations',
    label: 'Organizations',
    personas: ['employer', 'industry_partner', 'education_partner', 'service_provider'],
  },
  {
    key: 'public_sector',
    label: 'Public Sector',
    personas: ['government', 'national_labs', 'nonprofit'],
  },
];

// ---------------------------------------------------------------------------
// HELPER: compute annual price from monthly with discount
// ---------------------------------------------------------------------------

/**
 * Given a monthly price, return the discounted annual total.
 * Returns 0 for free tiers and -1 for custom-priced tiers.
 */
function annualFromMonthly(monthly: number): number {
  if (monthly === 0) return 0;
  if (monthly < 0) return -1;
  return Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT_PCT / 100) * 100) / 100;
}

// ---------------------------------------------------------------------------
// TIER DEFINITIONS
// ---------------------------------------------------------------------------

// =====================
// 1. JOB SEEKER
// =====================

const jobseekerTiers: PricingTier[] = [
  {
    id: 'jobseeker_free',
    persona: 'jobseeker',
    tierKey: 'free',
    name: 'Free',
    price_monthly: 0,
    price_annual: 0,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Get started with your STEM job search at no cost.',
    highlighted: false,
    cta_text: 'Get Started',
    cta_link: '/register?persona=jobseeker',
    features: {
      browseJobs: true,
      applyToJobs: true,
      basicProfile: true,
      emailAlerts: true,
      savedJobs: true,
      aiResumeOptimization: false,
      priorityApplicationReview: false,
      clearanceEligibilityCheck: false,
      profileInsights: false,
      interviewPrepTools: false,
      directRecruiterMessaging: false,
      salaryNegotiationCoach: false,
      executiveNetworking: false,
      careerConcierge: false,
      confidentialSearch: false,
      executivePlacement: false,
    },
    limits: {
      applicationsPerMonth: 10,
      savedJobs: 25,
      profileViews: 50,
      aiUsesPerMonth: 0,
    },
  },
  {
    id: 'jobseeker_career_pro',
    persona: 'jobseeker',
    tierKey: 'career_pro',
    name: 'Career Pro',
    price_monthly: 12.99,
    price_annual: annualFromMonthly(12.99),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Accelerate your STEM career search with AI tools and priority access.',
    highlighted: true,
    cta_text: 'Start Free Trial',
    cta_link: '/register?persona=jobseeker&plan=career_pro',
    stripe_price_id_monthly: 'price_jobseeker_career_pro_monthly',
    stripe_price_id_annual: 'price_jobseeker_career_pro_annual',
    features: {
      browseJobs: true,
      applyToJobs: true,
      basicProfile: true,
      emailAlerts: true,
      savedJobs: true,
      aiResumeOptimization: true,
      priorityApplicationReview: true,
      clearanceEligibilityCheck: true,
      profileInsights: true,
      interviewPrepTools: true,
      directRecruiterMessaging: true,
      salaryNegotiationCoach: false,
      executiveNetworking: false,
      careerConcierge: false,
      confidentialSearch: false,
      executivePlacement: false,
    },
    limits: {
      applicationsPerMonth: -1,
      savedJobs: -1,
      profileViews: -1,
      aiUsesPerMonth: 50,
    },
  },
  {
    id: 'jobseeker_executive',
    persona: 'jobseeker',
    tierKey: 'executive',
    name: 'Executive',
    price_monthly: 49.99,
    price_annual: annualFromMonthly(49.99),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'White-glove career services for senior STEM professionals and executives.',
    highlighted: false,
    cta_text: 'Start Free Trial',
    cta_link: '/register?persona=jobseeker&plan=executive',
    stripe_price_id_monthly: 'price_jobseeker_executive_monthly',
    stripe_price_id_annual: 'price_jobseeker_executive_annual',
    features: {
      browseJobs: true,
      applyToJobs: true,
      basicProfile: true,
      emailAlerts: true,
      savedJobs: true,
      aiResumeOptimization: true,
      priorityApplicationReview: true,
      clearanceEligibilityCheck: true,
      profileInsights: true,
      interviewPrepTools: true,
      directRecruiterMessaging: true,
      salaryNegotiationCoach: true,
      executiveNetworking: true,
      careerConcierge: true,
      confidentialSearch: true,
      executivePlacement: true,
    },
    limits: {
      applicationsPerMonth: -1,
      savedJobs: -1,
      profileViews: -1,
      aiUsesPerMonth: -1,
    },
  },
];

// =====================
// 2. EMPLOYER
// =====================

const employerTiers: PricingTier[] = [
  {
    id: 'employer_starter',
    persona: 'employer',
    tierKey: 'starter',
    name: 'Launchpad',
    price_monthly: 0,
    price_annual: 0,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Start posting STEM jobs and exploring the talent pipeline for free.',
    highlighted: false,
    cta_text: 'Get Started Free',
    cta_link: '/register?persona=employer',
    features: {
      jobPostings: true,
      basicCandidateSearch: true,
      emailSupport: true,
      standardJobListing: true,
      basicAnalytics: true,
      advancedAnalytics: false,
      candidateSearch: false,
      advancedFilters: false,
      eventSponsorship: false,
      employerBranding: false,
      prioritySupport: false,
      customIntegrations: false,
      apiAccess: false,
      whiteLabel: false,
      dedicatedManager: false,
      clearancePipelineManagement: false,
      fsoPortalBasic: false,
      fsoPortalAdvanced: false,
      fsoRosterManagement: false,
      fsoVisitRequests: false,
      fsoIncidentReporting: false,
      fsoContinuousVetting: false,
      fsoAuditLog: false,
      nispomComplianceAssistant: false,
      clearanceIntelligence: false,
      aiTalentMatching: false,
      bulkJobImport: false,
      teamCollaboration: false,
    },
    limits: {
      maxJobPostings: 3,
      candidateSearchResults: 25,
      eventSponsorsPerQuarter: 0,
      teamMembers: 1,
      resumeDownloadsPerMonth: 10,
      featuredListingsPerMonth: 0,
      maxClearedEmployees: 0,
    },
  },
  {
    id: 'employer_teams',
    persona: 'employer',
    tierKey: 'teams',
    name: 'Teams',
    price_monthly: 149,
    price_annual: annualFromMonthly(149),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Essential recruiting tools for small STEM teams and startups.',
    highlighted: false,
    cta_text: 'Start Free Trial',
    cta_link: '/register?persona=employer&plan=teams',
    stripe_price_id_monthly: 'price_employer_teams_monthly',
    stripe_price_id_annual: 'price_employer_teams_annual',
    features: {
      jobPostings: true,
      basicCandidateSearch: true,
      emailSupport: true,
      standardJobListing: true,
      basicAnalytics: true,
      advancedAnalytics: false,
      candidateSearch: true,
      advancedFilters: true,
      eventSponsorship: false,
      employerBranding: false,
      prioritySupport: false,
      customIntegrations: false,
      apiAccess: false,
      whiteLabel: false,
      dedicatedManager: false,
      clearancePipelineManagement: false,
      fsoPortalBasic: false,
      fsoPortalAdvanced: false,
      fsoRosterManagement: false,
      fsoVisitRequests: false,
      fsoIncidentReporting: false,
      fsoContinuousVetting: false,
      fsoAuditLog: false,
      nispomComplianceAssistant: false,
      clearanceIntelligence: false,
      aiTalentMatching: false,
      bulkJobImport: false,
      teamCollaboration: true,
    },
    limits: {
      maxJobPostings: 10,
      candidateSearchResults: 100,
      eventSponsorsPerQuarter: 0,
      teamMembers: 5,
      resumeDownloadsPerMonth: 50,
      featuredListingsPerMonth: 1,
      maxClearedEmployees: 0,
    },
  },
  {
    id: 'employer_professional',
    persona: 'employer',
    tierKey: 'professional',
    name: 'Talent Engine',
    price_monthly: 499,
    price_annual: annualFromMonthly(499),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Full-featured recruiting tools for growing STEM organizations.',
    highlighted: true,
    cta_text: 'Start Free Trial',
    cta_link: '/register?persona=employer&plan=professional',
    stripe_price_id_monthly: 'price_employer_professional_monthly',
    stripe_price_id_annual: 'price_employer_professional_annual',
    features: {
      jobPostings: true,
      basicCandidateSearch: true,
      emailSupport: true,
      standardJobListing: true,
      basicAnalytics: true,
      advancedAnalytics: true,
      candidateSearch: true,
      advancedFilters: true,
      eventSponsorship: true,
      employerBranding: true,
      prioritySupport: true,
      customIntegrations: false,
      apiAccess: false,
      whiteLabel: false,
      dedicatedManager: false,
      clearancePipelineManagement: true,
      fsoPortalBasic: true,
      fsoPortalAdvanced: true,
      fsoRosterManagement: true,
      fsoVisitRequests: true,
      fsoIncidentReporting: true,
      fsoContinuousVetting: true,
      fsoAuditLog: true,
      nispomComplianceAssistant: true,
      clearanceIntelligence: true,
      aiTalentMatching: true,
      bulkJobImport: true,
      teamCollaboration: true,
    },
    limits: {
      maxJobPostings: 25,
      candidateSearchResults: -1,
      eventSponsorsPerQuarter: 2,
      teamMembers: 10,
      resumeDownloadsPerMonth: 200,
      featuredListingsPerMonth: 5,
      maxClearedEmployees: 50,
    },
  },
  {
    id: 'employer_enterprise',
    persona: 'employer',
    tierKey: 'enterprise',
    name: 'Enterprise Command',
    price_monthly: 1999,
    price_annual: annualFromMonthly(1999),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Unlimited access with dedicated support for large-scale STEM hiring.',
    highlighted: false,
    cta_text: 'Contact Sales',
    cta_link: '/contact?subject=enterprise-employer',
    stripe_price_id_monthly: 'price_employer_enterprise_monthly',
    stripe_price_id_annual: 'price_employer_enterprise_annual',
    features: {
      jobPostings: true,
      basicCandidateSearch: true,
      emailSupport: true,
      standardJobListing: true,
      basicAnalytics: true,
      advancedAnalytics: true,
      candidateSearch: true,
      advancedFilters: true,
      eventSponsorship: true,
      employerBranding: true,
      prioritySupport: true,
      customIntegrations: true,
      apiAccess: true,
      whiteLabel: true,
      dedicatedManager: true,
      clearancePipelineManagement: true,
      fsoPortalBasic: true,
      fsoPortalAdvanced: true,
      fsoRosterManagement: true,
      fsoVisitRequests: true,
      fsoIncidentReporting: true,
      fsoContinuousVetting: true,
      fsoAuditLog: true,
      nispomComplianceAssistant: true,
      clearanceIntelligence: true,
      aiTalentMatching: true,
      bulkJobImport: true,
      teamCollaboration: true,
    },
    limits: {
      maxJobPostings: -1,
      candidateSearchResults: -1,
      eventSponsorsPerQuarter: -1,
      teamMembers: -1,
      maxClearedEmployees: -1,
      resumeDownloadsPerMonth: -1,
      featuredListingsPerMonth: -1,
    },
  },
];

// =====================
// 3. INDUSTRY PARTNER
// =====================

const industryPartnerTiers: PricingTier[] = [
  {
    id: 'industry_partner_starter',
    persona: 'industry_partner',
    tierKey: 'starter',
    name: 'Starter',
    price_monthly: 0,
    price_annual: 0,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Explore the STEMWorkforce partner ecosystem at no cost.',
    highlighted: false,
    cta_text: 'Get Started Free',
    cta_link: '/register?persona=industry_partner',
    features: {
      jobPostings: true,
      partnerProfile: true,
      basicAnalytics: true,
      emailSupport: true,
      talentPipelineAccess: false,
      advancedAnalytics: false,
      apprenticeshipPrograms: false,
      coHostEvents: false,
      prioritySupport: false,
      challengeSponsorship: false,
      customIntegrations: false,
      apiAccess: false,
      dedicatedManager: false,
      whiteLabel: false,
      workforcePlanningTools: false,
      multiSiteManagement: false,
    },
    limits: {
      maxJobPostings: 5,
      maxPrograms: 1,
      maxEventsPerYear: 0,
      maxChallengesPerYear: 0,
      teamMembers: 2,
    },
  },
  {
    id: 'industry_partner_growth',
    persona: 'industry_partner',
    tierKey: 'growth',
    name: 'Growth',
    price_monthly: 1499,
    price_annual: annualFromMonthly(1499),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Build and manage your STEM talent pipeline with advanced tools.',
    highlighted: true,
    cta_text: 'Start Free Trial',
    cta_link: '/register?persona=industry_partner&plan=growth',
    stripe_price_id_monthly: 'price_industry_partner_growth_monthly',
    stripe_price_id_annual: 'price_industry_partner_growth_annual',
    features: {
      jobPostings: true,
      partnerProfile: true,
      basicAnalytics: true,
      emailSupport: true,
      talentPipelineAccess: true,
      advancedAnalytics: true,
      apprenticeshipPrograms: true,
      coHostEvents: true,
      prioritySupport: true,
      challengeSponsorship: true,
      customIntegrations: false,
      apiAccess: false,
      dedicatedManager: false,
      whiteLabel: false,
      workforcePlanningTools: true,
      multiSiteManagement: false,
    },
    limits: {
      maxJobPostings: 50,
      maxPrograms: 10,
      maxEventsPerYear: 12,
      maxChallengesPerYear: 4,
      teamMembers: 25,
    },
  },
  {
    id: 'industry_partner_enterprise',
    persona: 'industry_partner',
    tierKey: 'enterprise',
    name: 'Enterprise',
    price_monthly: -1,
    price_annual: -1,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Custom enterprise solution for large-scale STEM workforce development.',
    highlighted: false,
    cta_text: 'Contact Sales',
    cta_link: '/contact?subject=enterprise-industry-partner',
    features: {
      jobPostings: true,
      partnerProfile: true,
      basicAnalytics: true,
      emailSupport: true,
      talentPipelineAccess: true,
      advancedAnalytics: true,
      apprenticeshipPrograms: true,
      coHostEvents: true,
      prioritySupport: true,
      challengeSponsorship: true,
      customIntegrations: true,
      apiAccess: true,
      dedicatedManager: true,
      whiteLabel: true,
      workforcePlanningTools: true,
      multiSiteManagement: true,
    },
    limits: {
      maxJobPostings: -1,
      maxPrograms: -1,
      maxEventsPerYear: -1,
      maxChallengesPerYear: -1,
      teamMembers: -1,
    },
  },
];

// =====================
// 4. EDUCATION PARTNER
// =====================

const educationPartnerTiers: PricingTier[] = [
  {
    id: 'education_partner_starter',
    persona: 'education_partner',
    tierKey: 'starter',
    name: 'Starter',
    price_monthly: 0,
    price_annual: 0,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'List your STEM programs and connect with employers for free.',
    highlighted: false,
    cta_text: 'Get Started Free',
    cta_link: '/register?persona=education_partner',
    features: {
      programListings: true,
      basicProfile: true,
      emailSupport: true,
      basicAnalytics: true,
      studentOutcomeTracking: false,
      employerNetworkAccess: false,
      advancedAnalytics: false,
      coHostEvents: false,
      prioritySupport: false,
      curriculumAlignment: false,
      apiAccess: false,
      dedicatedManager: false,
      whiteLabel: false,
      grantReporting: false,
      multiCampusManagement: false,
    },
    limits: {
      maxPrograms: 5,
      maxStudentProfiles: 50,
      maxEmployerConnections: 5,
      maxEventsPerYear: 1,
      teamMembers: 2,
    },
  },
  {
    id: 'education_partner_growth',
    persona: 'education_partner',
    tierKey: 'growth',
    name: 'Growth',
    price_monthly: 499,
    price_annual: annualFromMonthly(499),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Expand your STEM program reach and track student outcomes.',
    highlighted: true,
    cta_text: 'Start Free Trial',
    cta_link: '/register?persona=education_partner&plan=growth',
    stripe_price_id_monthly: 'price_education_partner_growth_monthly',
    stripe_price_id_annual: 'price_education_partner_growth_annual',
    features: {
      programListings: true,
      basicProfile: true,
      emailSupport: true,
      basicAnalytics: true,
      studentOutcomeTracking: true,
      employerNetworkAccess: true,
      advancedAnalytics: true,
      coHostEvents: true,
      prioritySupport: true,
      curriculumAlignment: true,
      apiAccess: false,
      dedicatedManager: false,
      whiteLabel: false,
      grantReporting: true,
      multiCampusManagement: false,
    },
    limits: {
      maxPrograms: 25,
      maxStudentProfiles: 500,
      maxEmployerConnections: 50,
      maxEventsPerYear: 12,
      teamMembers: 10,
    },
  },
  {
    id: 'education_partner_enterprise',
    persona: 'education_partner',
    tierKey: 'enterprise',
    name: 'Enterprise',
    price_monthly: 999,
    price_annual: annualFromMonthly(999),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Full-scale STEM education partnership with enterprise-grade features.',
    highlighted: false,
    cta_text: 'Contact Sales',
    cta_link: '/contact?subject=enterprise-education-partner',
    stripe_price_id_monthly: 'price_education_partner_enterprise_monthly',
    stripe_price_id_annual: 'price_education_partner_enterprise_annual',
    features: {
      programListings: true,
      basicProfile: true,
      emailSupport: true,
      basicAnalytics: true,
      studentOutcomeTracking: true,
      employerNetworkAccess: true,
      advancedAnalytics: true,
      coHostEvents: true,
      prioritySupport: true,
      curriculumAlignment: true,
      apiAccess: true,
      dedicatedManager: true,
      whiteLabel: true,
      grantReporting: true,
      multiCampusManagement: true,
    },
    limits: {
      maxPrograms: -1,
      maxStudentProfiles: -1,
      maxEmployerConnections: -1,
      maxEventsPerYear: -1,
      teamMembers: -1,
    },
  },
];

// =====================
// 5. SERVICE PROVIDER
// =====================

const serviceProviderTiers: PricingTier[] = [
  {
    id: 'service_provider_free',
    persona: 'service_provider',
    tierKey: 'free',
    name: 'Free',
    price_monthly: 0,
    price_annual: 0,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'List your services on the marketplace with standard commission.',
    highlighted: false,
    cta_text: 'Get Started Free',
    cta_link: '/register?persona=service_provider',
    features: {
      marketplaceListing: true,
      basicProfile: true,
      emailSupport: true,
      basicAnalytics: true,
      reducedCommission: false,
      featuredListing: false,
      prioritySupport: false,
      advancedAnalytics: false,
      clientCRM: false,
      proposalTemplates: false,
      verifiedBadge: false,
      apiAccess: false,
    },
    limits: {
      commissionPercent: 15,
      activeListings: 3,
      proposalsPerMonth: 10,
      portfolioItems: 5,
      teamMembers: 1,
    },
  },
  {
    id: 'service_provider_pro',
    persona: 'service_provider',
    tierKey: 'pro',
    name: 'Pro',
    price_monthly: 99,
    price_annual: annualFromMonthly(99),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Lower commission, featured listings, and advanced tools for growing providers.',
    highlighted: true,
    cta_text: 'Upgrade to Pro',
    cta_link: '/register?persona=service_provider&plan=pro',
    stripe_price_id_monthly: 'price_service_provider_pro_monthly',
    stripe_price_id_annual: 'price_service_provider_pro_annual',
    features: {
      marketplaceListing: true,
      basicProfile: true,
      emailSupport: true,
      basicAnalytics: true,
      reducedCommission: true,
      featuredListing: true,
      prioritySupport: true,
      advancedAnalytics: true,
      clientCRM: true,
      proposalTemplates: true,
      verifiedBadge: true,
      apiAccess: false,
    },
    limits: {
      commissionPercent: 10,
      activeListings: -1,
      proposalsPerMonth: -1,
      portfolioItems: -1,
      teamMembers: 5,
    },
  },
];

// =====================
// 6. STUDENT
// =====================

const studentTiers: PricingTier[] = [
  {
    id: 'student_free',
    persona: 'student',
    tierKey: 'free',
    name: 'Free',
    price_monthly: 0,
    price_annual: 0,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Access essential STEM education tools and AI-powered assistance.',
    highlighted: false,
    cta_text: 'Get Started',
    cta_link: '/register?persona=student',
    features: {
      collegeMatcherBasic: true,
      resumeBuilderBasic: true,
      careerExplorer: true,
      internshipSearch: true,
      savedItems: true,
      aiCollegeMatcher: true,
      aiResumeBuilder: true,
      aiInterviewPrep: true,
      unlimitedAI: false,
      priorityMatching: false,
      mentorshipAccess: false,
      campusVisitPlanner: false,
      scholarshipMatcher: false,
      portfolioBuilder: false,
      earlyAccessPrograms: false,
    },
    limits: {
      aiUsesPerTool: 3,
      savedItems: 10,
      savedColleges: 5,
      savedInternships: 10,
      portfolioProjects: 1,
    },
  },
  {
    id: 'student_discovery',
    persona: 'student',
    tierKey: 'discovery',
    name: 'Discovery',
    price_monthly: 9.99,
    price_annual: annualFromMonthly(9.99),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Unlimited AI tools, priority matching, and mentorship for aspiring STEM students.',
    highlighted: true,
    cta_text: 'Start Free Trial',
    cta_link: '/register?persona=student&plan=discovery',
    stripe_price_id_monthly: 'price_student_discovery_monthly',
    stripe_price_id_annual: 'price_student_discovery_annual',
    features: {
      collegeMatcherBasic: true,
      resumeBuilderBasic: true,
      careerExplorer: true,
      internshipSearch: true,
      savedItems: true,
      aiCollegeMatcher: true,
      aiResumeBuilder: true,
      aiInterviewPrep: true,
      unlimitedAI: true,
      priorityMatching: true,
      mentorshipAccess: true,
      campusVisitPlanner: true,
      scholarshipMatcher: true,
      portfolioBuilder: true,
      earlyAccessPrograms: true,
    },
    limits: {
      aiUsesPerTool: -1,
      savedItems: -1,
      savedColleges: -1,
      savedInternships: -1,
      portfolioProjects: -1,
    },
  },
];

// =====================
// 7. GOVERNMENT / FEDERAL
// =====================

const governmentTiers: PricingTier[] = [
  {
    id: 'government_pilot',
    persona: 'government',
    tierKey: 'pilot',
    name: 'Pilot',
    price_monthly: 0,
    price_annual: 0,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Free evaluation tier for government agencies exploring STEM workforce tools.',
    highlighted: false,
    cta_text: 'Start Pilot',
    cta_link: '/register?persona=government',
    features: {
      workforceAnalytics: true,
      stemPipelineData: true,
      grantTracking: false,
      basicReporting: true,
      complianceReporting: false,
      emailSupport: true,
      prioritySupport: false,
      advancedAnalytics: false,
      crossAgencyDataSharing: false,
      customDashboards: false,
      apiAccess: false,
      dedicatedManager: false,
      fedRAMPCompliance: false,
      nationwideBenchmarks: false,
      policyImpactModeling: false,
      multiAgencyManagement: false,
    },
    limits: {
      regionsTracked: 1,
      usersPerAgency: 3,
      reportExportsPerMonth: 5,
      dataRefreshFrequency: 30, // monthly
      customReports: 0,
    },
  },
  {
    id: 'government_regional',
    persona: 'government',
    tierKey: 'regional',
    name: 'Regional',
    price_monthly: 2500,
    price_annual: annualFromMonthly(2500),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Regional workforce analytics and STEM pipeline management tools.',
    highlighted: true,
    cta_text: 'Request Demo',
    cta_link: '/contact?subject=government-regional',
    stripe_price_id_monthly: 'price_government_regional_monthly',
    stripe_price_id_annual: 'price_government_regional_annual',
    features: {
      workforceAnalytics: true,
      stemPipelineData: true,
      grantTracking: true,
      basicReporting: true,
      complianceReporting: true,
      emailSupport: true,
      prioritySupport: false,
      advancedAnalytics: false,
      crossAgencyDataSharing: false,
      customDashboards: false,
      apiAccess: false,
      dedicatedManager: false,
      fedRAMPCompliance: false,
      nationwideBenchmarks: false,
      policyImpactModeling: false,
      multiAgencyManagement: false,
    },
    limits: {
      regionsTracked: 1,
      usersPerAgency: 10,
      reportExportsPerMonth: 25,
      dataRefreshFrequency: 7, // days
      customReports: 5,
    },
  },
  {
    id: 'government_national',
    persona: 'government',
    tierKey: 'national',
    name: 'National',
    price_monthly: 7500,
    price_annual: annualFromMonthly(7500),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Nationwide STEM workforce intelligence for federal agencies.',
    highlighted: false,
    cta_text: 'Contact Sales',
    cta_link: '/contact?subject=government-national',
    stripe_price_id_monthly: 'price_government_national_monthly',
    stripe_price_id_annual: 'price_government_national_annual',
    features: {
      workforceAnalytics: true,
      stemPipelineData: true,
      grantTracking: true,
      basicReporting: true,
      complianceReporting: true,
      emailSupport: true,
      prioritySupport: true,
      advancedAnalytics: true,
      crossAgencyDataSharing: true,
      customDashboards: true,
      apiAccess: true,
      dedicatedManager: true,
      fedRAMPCompliance: true,
      nationwideBenchmarks: true,
      policyImpactModeling: true,
      multiAgencyManagement: true,
    },
    limits: {
      regionsTracked: -1,
      usersPerAgency: -1,
      reportExportsPerMonth: -1,
      dataRefreshFrequency: 1, // daily
      customReports: -1,
    },
  },
];

// =====================
// 8. NATIONAL LABS
// =====================

const nationalLabsTiers: PricingTier[] = [
  {
    id: 'national_labs_lab',
    persona: 'national_labs',
    tierKey: 'lab',
    name: 'Lab',
    price_monthly: 2500,
    price_annual: annualFromMonthly(2500),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'STEM workforce tools tailored for national laboratory operations.',
    highlighted: true,
    cta_text: 'Request Demo',
    cta_link: '/contact?subject=national-labs',
    stripe_price_id_monthly: 'price_national_labs_lab_monthly',
    stripe_price_id_annual: 'price_national_labs_lab_annual',
    features: {
      researcherRecruitment: true,
      internshipProgramManagement: true,
      fellowshipManagement: true,
      clearancePipeline: true,
      basicAnalytics: true,
      emailSupport: true,
      prioritySupport: true,
      advancedAnalytics: false,
      crossLabCollaboration: false,
      publicationTracking: false,
      grantIntegration: false,
      apiAccess: false,
      dedicatedManager: false,
      technologyTransfer: false,
      multiLabManagement: false,
      exportControlCompliance: false,
    },
    limits: {
      activePostings: 25,
      internshipSlots: 50,
      fellowshipSlots: 10,
      teamMembers: 15,
      storageGB: 10,
    },
  },
  {
    id: 'national_labs_enterprise',
    persona: 'national_labs',
    tierKey: 'enterprise',
    name: 'Enterprise',
    price_monthly: -1,
    price_annual: -1,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Custom multi-lab solution with full compliance and collaboration features.',
    highlighted: false,
    cta_text: 'Contact Sales',
    cta_link: '/contact?subject=enterprise-national-labs',
    features: {
      researcherRecruitment: true,
      internshipProgramManagement: true,
      fellowshipManagement: true,
      clearancePipeline: true,
      basicAnalytics: true,
      emailSupport: true,
      prioritySupport: true,
      advancedAnalytics: true,
      crossLabCollaboration: true,
      publicationTracking: true,
      grantIntegration: true,
      apiAccess: true,
      dedicatedManager: true,
      technologyTransfer: true,
      multiLabManagement: true,
      exportControlCompliance: true,
    },
    limits: {
      activePostings: -1,
      internshipSlots: -1,
      fellowshipSlots: -1,
      teamMembers: -1,
      storageGB: -1,
    },
  },
];

// =====================
// 9. NONPROFIT
// =====================

const nonprofitTiers: PricingTier[] = [
  {
    id: 'nonprofit_community',
    persona: 'nonprofit',
    tierKey: 'community',
    name: 'Community',
    price_monthly: 0,
    price_annual: 0,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Free tools for community-based STEM nonprofits to list programs and connect.',
    highlighted: false,
    cta_text: 'Get Started Free',
    cta_link: '/register?persona=nonprofit',
    features: {
      programListings: true,
      volunteerRecruitment: true,
      basicProfile: true,
      emailSupport: true,
      basicAnalytics: true,
      impactReporting: false,
      advancedAnalytics: false,
      grantTracking: false,
      donorManagement: false,
      coalitionTools: false,
      prioritySupport: false,
      apiAccess: false,
      dedicatedManager: false,
      whiteLabel: false,
      multiChapterManagement: false,
      advocacyTools: false,
    },
    limits: {
      maxPrograms: 3,
      maxVolunteerPostings: 5,
      maxEvents: 2,
      teamMembers: 2,
      storageGB: 1,
    },
  },
  {
    id: 'nonprofit_impact',
    persona: 'nonprofit',
    tierKey: 'impact',
    name: 'Impact',
    price_monthly: 249,
    price_annual: annualFromMonthly(249),
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Comprehensive impact measurement and program management for growing nonprofits.',
    highlighted: true,
    cta_text: 'Start Free Trial',
    cta_link: '/register?persona=nonprofit&plan=impact',
    stripe_price_id_monthly: 'price_nonprofit_impact_monthly',
    stripe_price_id_annual: 'price_nonprofit_impact_annual',
    features: {
      programListings: true,
      volunteerRecruitment: true,
      basicProfile: true,
      emailSupport: true,
      basicAnalytics: true,
      impactReporting: true,
      advancedAnalytics: true,
      grantTracking: true,
      donorManagement: true,
      coalitionTools: false,
      prioritySupport: true,
      apiAccess: false,
      dedicatedManager: false,
      whiteLabel: false,
      multiChapterManagement: false,
      advocacyTools: true,
    },
    limits: {
      maxPrograms: 25,
      maxVolunteerPostings: -1,
      maxEvents: 24,
      teamMembers: 15,
      storageGB: 25,
    },
  },
  {
    id: 'nonprofit_coalition',
    persona: 'nonprofit',
    tierKey: 'coalition',
    name: 'Coalition',
    price_monthly: -1,
    price_annual: -1,
    discount_annual_pct: ANNUAL_DISCOUNT_PCT,
    description: 'Custom solution for large coalitions and multi-chapter STEM nonprofit networks.',
    highlighted: false,
    cta_text: 'Contact Sales',
    cta_link: '/contact?subject=coalition-nonprofit',
    features: {
      programListings: true,
      volunteerRecruitment: true,
      basicProfile: true,
      emailSupport: true,
      basicAnalytics: true,
      impactReporting: true,
      advancedAnalytics: true,
      grantTracking: true,
      donorManagement: true,
      coalitionTools: true,
      prioritySupport: true,
      apiAccess: true,
      dedicatedManager: true,
      whiteLabel: true,
      multiChapterManagement: true,
      advocacyTools: true,
    },
    limits: {
      maxPrograms: -1,
      maxVolunteerPostings: -1,
      maxEvents: -1,
      teamMembers: -1,
      storageGB: -1,
    },
  },
];

// ---------------------------------------------------------------------------
// MASTER TIER REGISTRY
// ---------------------------------------------------------------------------

/**
 * Complete flat list of every pricing tier on the platform.
 * Grouped by persona for readability but stored as a single array
 * so that lookup helpers are O(n) at worst.
 */
export const ALL_PRICING_TIERS: PricingTier[] = [
  ...jobseekerTiers,
  ...employerTiers,
  ...industryPartnerTiers,
  ...educationPartnerTiers,
  ...serviceProviderTiers,
  ...studentTiers,
  ...governmentTiers,
  ...nationalLabsTiers,
  ...nonprofitTiers,
];

/**
 * Pre-built index by persona for fast lookups.
 * Maps each persona type to its ordered list of tiers (cheapest first).
 */
export const TIERS_BY_PERSONA: Record<PersonaType, PricingTier[]> = {
  jobseeker: jobseekerTiers,
  employer: employerTiers,
  industry_partner: industryPartnerTiers,
  education_partner: educationPartnerTiers,
  service_provider: serviceProviderTiers,
  student: studentTiers,
  government: governmentTiers,
  national_labs: nationalLabsTiers,
  nonprofit: nonprofitTiers,
};

/** Pre-built index by tier id for O(1) lookups */
const TIER_BY_ID: Record<string, PricingTier> = {};
for (const tier of ALL_PRICING_TIERS) {
  TIER_BY_ID[tier.id] = tier;
}

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Return the ordered list of pricing tiers for a given persona.
 */
export function getPersonaTiers(persona: PersonaType): PricingTier[] {
  return TIERS_BY_PERSONA[persona] ?? [];
}

/**
 * Look up a single tier by its globally unique id.
 */
export function getTierById(id: string): PricingTier | undefined {
  return TIER_BY_ID[id];
}

/**
 * Format a price number for display.
 *   0  -> "Free"
 *  -1  -> "Custom"
 *  else -> "$X.XX/mo"  (or "$X/mo" when there are no cents)
 */
export function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  if (price < 0) return 'Custom';
  // Use Intl for proper USD formatting, then append "/mo"
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${formatted}/mo`;
}

/**
 * Format an annual price for display.
 *   0  -> "Free"
 *  -1  -> "Custom"
 *  else -> "$X.XX/yr"
 */
export function formatAnnualPrice(price: number): string {
  if (price === 0) return 'Free';
  if (price < 0) return 'Custom';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${formatted}/yr`;
}

/**
 * Given a tier, return its effective monthly price under annual billing.
 * Useful for "as low as $X/mo billed annually" copy.
 */
export function effectiveMonthlyPrice(tier: PricingTier): number {
  if (tier.price_annual <= 0) return tier.price_monthly;
  return Math.round((tier.price_annual / 12) * 100) / 100;
}

/**
 * Check whether a specific boolean feature is enabled on a tier.
 */
export function tierHasFeature(tier: PricingTier, featureKey: string): boolean {
  return tier.features[featureKey] === true;
}

/**
 * Get a numeric limit from a tier. Returns the limit value, or 0 if not found.
 * A return value of -1 means "unlimited".
 */
export function getTierLimit(tier: PricingTier, limitKey: string): number {
  return tier.limits[limitKey] ?? 0;
}

/**
 * Check if a tier's limit is "unlimited" (-1).
 */
export function isUnlimited(tier: PricingTier, limitKey: string): boolean {
  return tier.limits[limitKey] === -1;
}

/**
 * Given a persona and a tier key (e.g. "professional"), find the matching tier.
 */
export function getTierByPersonaAndKey(
  persona: PersonaType,
  tierKey: string,
): PricingTier | undefined {
  return TIERS_BY_PERSONA[persona]?.find((t) => t.tierKey === tierKey);
}

/**
 * Return all persona types that have at least one free tier.
 */
export function getPersonasWithFreeTier(): PersonaType[] {
  return (Object.keys(TIERS_BY_PERSONA) as PersonaType[]).filter((persona) =>
    TIERS_BY_PERSONA[persona].some((t) => t.price_monthly === 0),
  );
}

/**
 * Return the highlighted / "popular" tier for a given persona, or undefined.
 */
export function getHighlightedTier(persona: PersonaType): PricingTier | undefined {
  return TIERS_BY_PERSONA[persona]?.find((t) => t.highlighted);
}
