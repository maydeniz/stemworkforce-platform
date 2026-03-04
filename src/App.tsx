// ===========================================
// Main Application Component
// ===========================================

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, NotificationProvider, BillingProvider, ThemeProvider, FeatureProvider } from '@/contexts';
import { Layout, MinimalLayout, LayoutLight } from '@/components/layout';
import { PageLoader, ErrorBoundary } from '@/components/common';
import { QueryProvider } from '@/lib/queryClient';
import { useAuth } from '@/contexts';
import { supabase } from '@/lib/supabase';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/components/pages/HomePage'));
const JobsPage = lazy(() => import('@/components/pages/JobsPage'));
const JobDetailPage = lazy(() => import('@/components/pages/JobDetailPage'));
const CareerQADetailPage = lazy(() => import('@/components/pages/CareerQADetailPage'));
const EventsPage = lazy(() => import('@/components/pages/EventsPage'));
const EventDetailPage = lazy(() => import('@/components/events/EventDetailPage'));
const EventCategoryPage = lazy(() => import('@/components/events/EventCategoryPage'));
const TrainingPage = lazy(() => import('@/components/pages/TrainingPage'));
const WorkforceMapPage = lazy(() => import('@/components/pages/WorkforceMapPage'));
const AICareerGuidePage = lazy(() => import('@/components/pages/AICareerGuidePage'));
const PartnersPage = lazy(() => import('@/components/pages/PartnersPage'));
const PricingPage = lazy(() => import('@/components/pages/PricingPage'));
const DashboardPage = lazy(() => import('@/components/pages/DashboardPage'));
const LoginPage = lazy(() => import('@/components/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/components/pages/RegisterPage'));
const AuthCallbackPage = lazy(() => import('@/components/pages/AuthCallbackPage'));
const NotFoundPage = lazy(() => import('@/components/pages/NotFoundPage'));
const EducationProviderPortal = lazy(() => import('@/components/pages/EducationProviderPortal'));

// Industries pages - lazy loaded
const IndustriesPage = lazy(() => import('@/components/pages/industries/IndustriesPage'));
const IndustryPage = lazy(() => import('@/components/pages/industries/IndustryPage'));
const IndustryPageLight = lazy(() => import('@/components/pages/industries/IndustryPageLight'));

// Services page - lazy loaded
const ServicesPage = lazy(() => import('@/components/pages/ServicesPage'));

// Service Providers marketplace - lazy loaded
const ServiceProvidersPage = lazy(() => import('@/components/pages/ServiceProvidersPage'));
const ServiceProviderProfilePage = lazy(() => import('@/components/pages/ServiceProviderProfilePage'));

// Test pages - lazy loaded
const ColorPaletteTest = lazy(() => import('@/components/pages/ColorPaletteTest'));
const WorkforceMapModalTestPage = lazy(() => import('@/components/pages/WorkforceMapModalTestPage'));

// Provider Dashboard - lazy loaded
const ProviderDashboard = lazy(() => import('@/components/pages/provider/ProviderDashboard'));
const ProviderOnboardingPage = lazy(() => import('@/components/pages/provider/ProviderOnboardingPage'));
const ProviderLandingPage = lazy(() => import('@/components/pages/provider/ProviderLandingPage'));
const ProviderResourcesPage = lazy(() => import('@/components/pages/provider/ProviderResourcesPage'));

// Education Partners pages - lazy loaded
const EducationPartnersLandingPage = lazy(() => import('@/components/pages/education-partners/EducationPartnersLandingPage'));
const EducationPartnersOnboardingPage = lazy(() => import('@/components/pages/education-partners/EducationPartnersOnboardingPage'));
const EducationPartnersResourcesPage = lazy(() => import('@/components/pages/education-partners/EducationPartnersResourcesPage'));

// Partner Organization pages - lazy loaded
const NationalLabsPartnerPage = lazy(() => import('@/components/pages/partners/NationalLabsPartnerPage'));
const GovernmentPartnersPage = lazy(() => import('@/components/pages/partners/GovernmentPartnersPage'));
const IndustryPartnersPage = lazy(() => import('@/components/pages/partners/IndustryPartnersPage'));
const NonprofitPartnersPage = lazy(() => import('@/components/pages/partners/NonprofitPartnersPage'));

// Partnership Program pages - lazy loaded
const DiversityPartnershipsPage = lazy(() => import('@/components/pages/partnerships/DiversityPartnershipsPage'));
const AcademicPartnershipsPage = lazy(() => import('@/components/pages/partnerships/AcademicPartnershipsPage'));
const ApprenticeshipPartnershipsPage = lazy(() => import('@/components/pages/partnerships/ApprenticeshipPartnershipsPage'));

// Industry Consulting pages - lazy loaded
const AIConsultingPage = lazy(() => import('@/components/pages/consulting/AIConsultingPage'));
const QuantumConsultingPage = lazy(() => import('@/components/pages/consulting/QuantumConsultingPage'));
const SemiconductorConsultingPage = lazy(() => import('@/components/pages/consulting/SemiconductorConsultingPage'));
const NuclearConsultingPage = lazy(() => import('@/components/pages/consulting/NuclearConsultingPage'));
const CybersecurityConsultingPage = lazy(() => import('@/components/pages/consulting/CybersecurityConsultingPage'));
const AerospaceConsultingPage = lazy(() => import('@/components/pages/consulting/AerospaceConsultingPage'));
const BiotechConsultingPage = lazy(() => import('@/components/pages/consulting/BiotechConsultingPage'));
const HealthcareConsultingPage = lazy(() => import('@/components/pages/consulting/HealthcareConsultingPage'));
const RoboticsConsultingPage = lazy(() => import('@/components/pages/consulting/RoboticsConsultingPage'));
const CleanEnergyConsultingPage = lazy(() => import('@/components/pages/consulting/CleanEnergyConsultingPage'));
const ManufacturingConsultingPage = lazy(() => import('@/components/pages/consulting/ManufacturingConsultingPage'));

// Admin dashboards - lazy loaded
const AdminDashboard = lazy(() => import('@/components/pages/admin/AdminDashboard'));
const BillingDashboard = lazy(() => import('@/components/pages/billing/BillingDashboard'));
const AdvertisingDashboard = lazy(() => import('@/components/pages/advertising/AdvertisingDashboard'));
const MarketplaceDashboard = lazy(() => import('@/components/pages/marketplace/MarketplaceDashboard'));

// Workforce Services pages - lazy loaded
const StaffingServicesPage = lazy(() => import('@/components/pages/services/StaffingServicesPage'));
const RecruitingServicesPage = lazy(() => import('@/components/pages/services/RecruitingServicesPage'));
const CareerCoachingPage = lazy(() => import('@/components/pages/services/CareerCoachingPage'));
const TrainingServicesPage = lazy(() => import('@/components/pages/services/TrainingServicesPage'));
const ClearanceServicesPage = lazy(() => import('@/components/pages/services/ClearanceServicesPage'));
const ImmigrationServicesPage = lazy(() => import('@/components/pages/services/ImmigrationServicesPage'));
const OutplacementServicesPage = lazy(() => import('@/components/pages/services/OutplacementServicesPage'));

// Student pages - lazy loaded
const EssayCoachPage = lazy(() => import('@/components/pages/students/EssayCoachPage'));
const ResearchWriterPage = lazy(() => import('@/components/pages/students/ResearchWriterPage'));
const WhySchoolPage = lazy(() => import('@/components/pages/students/WhySchoolPage'));
const ApplicationTrackerPage = lazy(() => import('@/components/pages/students/ApplicationTrackerPage'));
const InterviewPrepPage = lazy(() => import('@/components/pages/students/InterviewPrepPage'));
const MockAdmissionsPage = lazy(() => import('@/components/pages/students/MockAdmissionsPage'));

// College Discovery pages - lazy loaded with error logging
const CollegeMatcherPage = lazy(() =>
  import('@/components/pages/students/CollegeMatcherPage').catch(err => {
    console.error('Failed to load CollegeMatcherPage:', err);
    throw err;
  })
);
const MajorExplorerPage = lazy(() =>
  import('@/components/pages/students/MajorExplorerPage').catch(err => {
    console.error('Failed to load MajorExplorerPage:', err);
    throw err;
  })
);
const CampusCulturePage = lazy(() =>
  import('@/components/pages/students/CampusCulturePage').catch(err => {
    console.error('Failed to load CampusCulturePage:', err);
    throw err;
  })
);
const FinancialFitPage = lazy(() =>
  import('@/components/pages/students/FinancialFitPage').catch(err => {
    console.error('Failed to load FinancialFitPage:', err);
    throw err;
  })
);
const VirtualToursPage = lazy(() =>
  import('@/components/pages/students/VirtualToursPage').catch(err => {
    console.error('Failed to load VirtualToursPage:', err);
    throw err;
  })
);
const CompareSchoolsPage = lazy(() =>
  import('@/components/pages/students/CompareSchoolsPage').catch(err => {
    console.error('Failed to load CompareSchoolsPage:', err);
    throw err;
  })
);

// Financial Planning pages - lazy loaded
const ScholarshipMatcherPage = lazy(() => import('@/components/pages/students/ScholarshipMatcherPage'));
const NetPriceCalculatorPage = lazy(() => import('@/components/pages/students/NetPriceCalculatorPage'));
const AwardLetterAnalyzerPage = lazy(() => import('@/components/pages/students/AwardLetterAnalyzerPage'));
const CSSProfileOptimizerPage = lazy(() => import('@/components/pages/students/CSSProfileOptimizerPage'));
const AppealLetterPage = lazy(() => import('@/components/pages/students/AppealLetterPage'));
const STEMFundingPage = lazy(() => import('@/components/pages/students/STEMFundingPage'));
const LoanPayoffModelerPage = lazy(() => import('@/components/pages/students/LoanPayoffModelerPage'));
const CareerROICalculatorPage = lazy(() => import('@/components/pages/students/CareerROICalculatorPage'));

// Career Pathways Pages (High School)
const InternshipFinderPage = lazy(() => import('@/components/pages/students/InternshipFinderPage'));
const WorkBasedLearningPage = lazy(() => import('@/components/pages/students/WorkBasedLearningPage'));
const ApprenticeshipPathwaysPage = lazy(() => import('@/components/pages/students/ApprenticeshipPathwaysPage'));

// College Student Pages - Hub Pages
const CareerLaunchHubPage = lazy(() => import('@/components/pages/college/CareerLaunchHubPage'));
const ProfessionalDevelopmentPage = lazy(() => import('@/components/pages/college/ProfessionalDevelopmentPage'));
const GraduateSchoolPrepPage = lazy(() => import('@/components/pages/college/GraduateSchoolPrepPage'));
const ResearchOpportunitiesPage = lazy(() => import('@/components/pages/college/ResearchOpportunitiesPage'));
const GovernmentCareersPage = lazy(() => import('@/components/pages/college/GovernmentCareersPage'));

// College Student Pages - Career Launch
const ResumeBuilderPage = lazy(() => import('@/components/pages/college/ResumeBuilderPage'));
const CollegeInterviewPrepPage = lazy(() => import('@/components/pages/college/InterviewPrepPage'));
const SalaryNegotiationPage = lazy(() => import('@/components/pages/college/SalaryNegotiationPage'));
const CollegeInternshipFinderPage = lazy(() => import('@/components/pages/college/InternshipFinderPage'));
const OfferComparisonPage = lazy(() => import('@/components/pages/college/OfferComparisonPage'));

// College Student Pages - Professional Development
const SkillsAssessmentPage = lazy(() => import('@/components/pages/college/SkillsAssessmentPage'));
const TechnicalPortfolioPage = lazy(() => import('@/components/pages/college/TechnicalPortfolioPage'));
const NetworkingPage = lazy(() => import('@/components/pages/college/NetworkingPage'));
const MentorshipPage = lazy(() => import('@/components/pages/college/MentorshipPage'));
const CollegeEventsPage = lazy(() => import('@/components/pages/college/EventsPage'));

// College Student Pages - Graduate & Research
const FellowshipFinderPage = lazy(() => import('@/components/pages/college/FellowshipFinderPage'));
const SOPCoachPage = lazy(() => import('@/components/pages/college/SOPCoachPage'));
const FacultyMatchPage = lazy(() => import('@/components/pages/college/FacultyMatchPage'));
const PhDDecisionPage = lazy(() => import('@/components/pages/college/PhDDecisionPage'));

// College Student Pages - Government & Finance
const ClearanceGuidePage = lazy(() => import('@/components/pages/college/ClearanceGuidePage'));
const LoanStrategyPage = lazy(() => import('@/components/pages/college/LoanStrategyPage'));
const GradFundingPage = lazy(() => import('@/components/pages/college/GradFundingPage'));
const RelocationCalculatorPage = lazy(() => import('@/components/pages/college/RelocationCalculatorPage'));
const BudgetPlannerPage = lazy(() => import('@/components/pages/college/BudgetPlannerPage'));

// Resource & Info pages - lazy loaded
const ResourcesPage = lazy(() => import('@/components/pages/ResourcesPage'));
const DocsPage = lazy(() => import('@/components/pages/DocsPage'));
const BlogPage = lazy(() => import('@/components/pages/BlogPage'));
const GuidesPage = lazy(() => import('@/components/pages/GuidesPage'));
const HelpCenterPage = lazy(() => import('@/components/pages/HelpCenterPage'));
const AboutPage = lazy(() => import('@/components/pages/AboutPage'));
const PressPage = lazy(() => import('@/components/pages/PressPage'));
const CareersPage = lazy(() => import('@/components/pages/CareersPage'));
const SalaryInsightsPage = lazy(() => import('@/components/pages/SalaryInsightsPage'));
const SecurityCompliancePage = lazy(() => import('@/components/pages/SecurityCompliancePage'));
const AccessibilityPage = lazy(() => import('@/components/pages/AccessibilityPage'));
const PrivacyPolicyPage = lazy(() => import('@/components/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/components/pages/TermsOfServicePage'));
const CookiePolicyPage = lazy(() => import('@/components/pages/CookiePolicyPage'));
const WorkforceAnalyticsPage = lazy(() => import('@/components/pages/WorkforceAnalyticsPage'));
const ProjectsPage = lazy(() => import('@/components/pages/ProjectsPage'));
const TalentSearchPage = lazy(() => import('@/components/pages/TalentSearchPage'));
const ForTalentPage = lazy(() => import('@/components/pages/ForTalentPage'));
const HighSchoolLandingPage = lazy(() => import('@/components/pages/HighSchoolLandingPage'));
const CollegeLandingPage = lazy(() => import('@/components/pages/CollegeLandingPage'));
const ClearanceGuideLandingPage = lazy(() => import('@/components/pages/ClearanceGuideLandingPage'));
const MentorshipLandingPage = lazy(() => import('@/components/pages/MentorshipPage'));

// Challenges pages - lazy loaded
const ChallengesPage = lazy(() => import('@/components/pages/challenges/ChallengesPage'));
const ChallengeDetailPage = lazy(() => import('@/components/pages/challenges/ChallengeDetailPage'));
const CreateChallengePage = lazy(() => import('@/components/pages/challenges/CreateChallengePage'));
const PostChallengePage = lazy(() => import('@/components/pages/challenges/PostChallengePage'));
const SolveChallengePage = lazy(() => import('@/components/pages/challenges/SolveChallengePage'));

// Federation pages - lazy loaded
const FederatedListingsPage = lazy(() => import('@/components/federation/FederatedListingsPage'));

// Workforce Services pages - lazy loaded
const WorkforceServicesHubPage = lazy(() => import('@/components/pages/workforce/WorkforceServicesHubPage'));
const CareerCenterFinderPage = lazy(() => import('@/components/pages/workforce/CareerCenterFinderPage'));
const TrainingProviderSearchPage = lazy(() => import('@/components/pages/workforce/TrainingProviderSearchPage'));
const FAFSAAssistantPage = lazy(() => import('@/components/pages/workforce/FAFSAAssistantPage'));
const TrainingFundingPage = lazy(() => import('@/components/pages/workforce/TrainingFundingPage'));
const SupportiveServicesPage = lazy(() => import('@/components/pages/workforce/SupportiveServicesPage'));
const DislocatedWorkerPage = lazy(() => import('@/components/pages/workforce/DislocatedWorkerPage'));
const UnemploymentBenefitsPage = lazy(() => import('@/components/pages/workforce/UnemploymentBenefitsPage'));
const ParticipantPortal = lazy(() => import('@/components/pages/workforce/ParticipantPortal'));
const AIIntakeAssistant = lazy(() => import('@/components/pages/workforce/AIIntakeAssistant'));

// Healthcare Provider pages - lazy loaded
const HealthcareProviderLogin = lazy(() => import('@/components/pages/healthcare-providers/HealthcareProviderLogin'));
const HealthcareProviderDashboard = lazy(() => import('@/components/pages/healthcare-providers/HealthcareProviderDashboard'));

// Research Portal pages - lazy loaded
const ResearchPortalLogin = lazy(() => import('@/components/pages/research-portal/ResearchPortalLogin'));
const ResearchPortalRegister = lazy(() => import('@/components/pages/research-portal/ResearchPortalRegister'));
const ResearchPortalDashboard = lazy(() => import('@/components/pages/research-portal/ResearchPortalDashboard'));

// Counselor pages - lazy loaded
const CounselorDashboard = lazy(() => import('@/components/pages/counselor/CounselorDashboard'));

// Municipality Partner pages - lazy loaded
const MunicipalityPartnerDashboard = lazy(() => import('@/components/pages/municipality-partners/MunicipalityPartnerDashboard'));

// Additional partner pages - lazy loaded
const StateWorkforcePortalPage = lazy(() => import('@/components/pages/partners/StateWorkforcePortalPage'));
const MunicipalityPartnersPage = lazy(() => import('@/components/pages/partners/MunicipalityPartnersPage'));

// Missing pages - lazy loaded
const ContactPage = lazy(() => import('@/components/pages/ContactPage'));
const SettingsPage = lazy(() => import('@/components/pages/SettingsPage'));
const PartnerApplyPage = lazy(() => import('@/components/pages/PartnerApplyPage'));
const ChallengesAnalyticsPage = lazy(() => import('@/components/pages/challenges/ChallengesAnalyticsPage'));
const ChallengesLeaderboardPage = lazy(() => import('@/components/pages/challenges/ChallengesLeaderboardPage'));
const CertificationPathwaysPage = lazy(() => import('@/components/pages/college/CertificationPathwaysPage'));
const MastersProgramsPage = lazy(() => import('@/components/pages/college/MastersProgramsPage'));
const ProgramSearchPage = lazy(() => import('@/components/pages/college/ProgramSearchPage'));
const FacultyEmailGuidePage = lazy(() => import('@/components/pages/college/FacultyEmailGuidePage'));

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // SECURITY FIX: Fetch role from database ONLY - never trust user_metadata
  // user_metadata can be spoofed during signup, so we MUST use server-side data
  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }

      try {
        // SECURITY: Always fetch from database - this is the source of truth
        // NEVER trust user_metadata.role as it can be set by the user during signup

        // First try app_metadata (server-controlled, cannot be spoofed)
        const appMetaRole = (user as any).app_metadata?.role;
        if (appMetaRole) {
          setUserRole(appMetaRole);
          setRoleLoading(false);
          return;
        }

        // Fetch from public.users table - try by ID first, then by email
        let { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        // If not found by ID, try by email
        if (!data && user.email) {
          const emailResult = await supabase
            .from('users')
            .select('role')
            .eq('email', user.email)
            .single();

          data = emailResult.data;
        }

        if (data?.role) {
          setUserRole(data.role);
        } else {
          // Default to most restrictive role if not found
          setUserRole('jobseeker');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        // Default to most restrictive role on error
        setUserRole('jobseeker');
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  // Wait for auth and role to finish loading before redirecting
  if (isLoading || roleLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are required but user has no role or wrong role, redirect to dashboard
  if (roles && roles.length > 0) {
    if (!userRole || !roles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// App routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/jobs"
          element={
            <Suspense fallback={<PageLoader />}>
              <JobsPage />
            </Suspense>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <JobDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/career-qa/:slug"
          element={
            <Suspense fallback={<PageLoader />}>
              <CareerQADetailPage />
            </Suspense>
          }
        />
        <Route
          path="/events"
          element={
            <Suspense fallback={<PageLoader />}>
              <EventsPage />
            </Suspense>
          }
        />
        <Route
          path="/events/category/:category"
          element={
            <Suspense fallback={<PageLoader />}>
              <EventCategoryPage />
            </Suspense>
          }
        />
        {/* Event category shortcuts — must be before /events/:id */}
        <Route path="/events/career-fairs" element={<Navigate to="/events/category/career-fairs" replace />} />
        <Route path="/events/networking" element={<Navigate to="/events/category/networking" replace />} />
        <Route path="/events/workshops" element={<Navigate to="/events/category/workshops" replace />} />
        <Route path="/events/clearance" element={<Navigate to="/events/category/clearance" replace />} />
        <Route path="/events/semiconductor" element={<Navigate to="/events/category/semiconductor" replace />} />
        <Route path="/events/nuclear-energy" element={<Navigate to="/events/category/nuclear-energy" replace />} />
        <Route path="/events/ai-quantum" element={<Navigate to="/events/category/ai-quantum" replace />} />
        <Route path="/events/aerospace-defense" element={<Navigate to="/events/category/aerospace-defense" replace />} />
        <Route path="/events/certifications" element={<Navigate to="/events/category/certifications" replace />} />
        <Route path="/events/leadership" element={<Navigate to="/events/category/leadership" replace />} />
        <Route path="/events/compliance" element={<Navigate to="/events/category/compliance" replace />} />
        <Route path="/events/university" element={<Navigate to="/events/category/university" replace />} />
        <Route path="/events/national-labs" element={<Navigate to="/events/category/national-labs" replace />} />
        <Route path="/events/government" element={<Navigate to="/events/category/government" replace />} />
        <Route path="/events/employers" element={<Navigate to="/events/category/employers" replace />} />
        <Route
          path="/events/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <EventDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/training"
          element={
            <Suspense fallback={<PageLoader />}>
              <TrainingPage />
            </Suspense>
          }
        />
        <Route
          path="/map"
          element={
            <Suspense fallback={<PageLoader />}>
              <WorkforceMapPage />
            </Suspense>
          }
        />
        <Route
          path="/workforce-map"
          element={
            <Suspense fallback={<PageLoader />}>
              <WorkforceMapPage />
            </Suspense>
          }
        />
        <Route
          path="/ai-career-guide"
          element={
            <Suspense fallback={<PageLoader />}>
              <AICareerGuidePage />
            </Suspense>
          }
        />
        <Route
          path="/partners"
          element={
            <Suspense fallback={<PageLoader />}>
              <PartnersPage />
            </Suspense>
          }
        />
        <Route
          path="/pricing"
          element={
            <Suspense fallback={<PageLoader />}>
              <PricingPage />
            </Suspense>
          }
        />
        <Route
          path="/education-provider"
          element={
            <Suspense fallback={<PageLoader />}>
              <EducationProviderPortal />
            </Suspense>
          }
        />
        <Route
          path="/industries"
          element={
            <Suspense fallback={<PageLoader />}>
              <IndustriesPage />
            </Suspense>
          }
        />
        <Route
          path="/industries/:industryId"
          element={
            <Suspense fallback={<PageLoader />}>
              <IndustryPage />
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            <Suspense fallback={<PageLoader />}>
              <ServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/service-providers"
          element={
            <Suspense fallback={<PageLoader />}>
              <ServiceProvidersPage />
            </Suspense>
          }
        />
        <Route
          path="/service-providers/:providerId"
          element={
            <Suspense fallback={<PageLoader />}>
              <ServiceProviderProfilePage />
            </Suspense>
          }
        />
        <Route
          path="/color-test"
          element={
            <Suspense fallback={<PageLoader />}>
              <ColorPaletteTest />
            </Suspense>
          }
        />
        <Route
          path="/workforce-map-test"
          element={
            <Suspense fallback={<PageLoader />}>
              <WorkforceMapModalTestPage />
            </Suspense>
          }
        />

        {/* Industry Consulting Pages */}
        <Route
          path="/services/ai-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <AIConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/quantum-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <QuantumConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/semiconductor-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <SemiconductorConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/nuclear-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <NuclearConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/cybersecurity-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <CybersecurityConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/aerospace-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <AerospaceConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/biotech-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <BiotechConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/healthcare-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <HealthcareConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/robotics-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <RoboticsConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/clean-energy-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <CleanEnergyConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/manufacturing-consulting"
          element={
            <Suspense fallback={<PageLoader />}>
              <ManufacturingConsultingPage />
            </Suspense>
          }
        />

        {/* Workforce Services Pages */}
        <Route
          path="/services/staffing"
          element={
            <Suspense fallback={<PageLoader />}>
              <StaffingServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/services/recruiting"
          element={
            <Suspense fallback={<PageLoader />}>
              <RecruitingServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/services/career-coaching"
          element={
            <Suspense fallback={<PageLoader />}>
              <CareerCoachingPage />
            </Suspense>
          }
        />
        <Route
          path="/services/training-services"
          element={
            <Suspense fallback={<PageLoader />}>
              <TrainingServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/services/clearance-services"
          element={
            <Suspense fallback={<PageLoader />}>
              <ClearanceServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/services/immigration"
          element={
            <Suspense fallback={<PageLoader />}>
              <ImmigrationServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/services/outplacement"
          element={
            <Suspense fallback={<PageLoader />}>
              <OutplacementServicesPage />
            </Suspense>
          }
        />

        {/* Provider Pages */}
        <Route
          path="/become-a-provider"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProviderLandingPage />
            </Suspense>
          }
        />
        <Route
          path="/provider-apply"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProviderOnboardingPage />
            </Suspense>
          }
        />
        <Route
          path="/provider-resources"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProviderResourcesPage />
            </Suspense>
          }
        />

        {/* Education Partners Pages */}
        <Route
          path="/education-partners"
          element={
            <Suspense fallback={<PageLoader />}>
              <EducationPartnersLandingPage />
            </Suspense>
          }
        />
        <Route
          path="/education-partner-apply"
          element={
            <Suspense fallback={<PageLoader />}>
              <EducationPartnersOnboardingPage />
            </Suspense>
          }
        />
        <Route
          path="/education-partner-resources"
          element={
            <Suspense fallback={<PageLoader />}>
              <EducationPartnersResourcesPage />
            </Suspense>
          }
        />

        {/* Partner Organization Pages */}
        <Route
          path="/partners/national-labs"
          element={
            <Suspense fallback={<PageLoader />}>
              <NationalLabsPartnerPage />
            </Suspense>
          }
        />
        <Route
          path="/partners/government"
          element={
            <Suspense fallback={<PageLoader />}>
              <GovernmentPartnersPage />
            </Suspense>
          }
        />
        <Route
          path="/partners/industry"
          element={
            <Suspense fallback={<PageLoader />}>
              <IndustryPartnersPage />
            </Suspense>
          }
        />
        <Route
          path="/partners/nonprofits"
          element={
            <Suspense fallback={<PageLoader />}>
              <NonprofitPartnersPage />
            </Suspense>
          }
        />

        {/* Partnership Program Pages */}
        <Route
          path="/partnerships/diversity"
          element={
            <Suspense fallback={<PageLoader />}>
              <DiversityPartnershipsPage />
            </Suspense>
          }
        />
        <Route
          path="/partnerships/academic"
          element={
            <Suspense fallback={<PageLoader />}>
              <AcademicPartnershipsPage />
            </Suspense>
          }
        />
        <Route
          path="/partnerships/apprenticeship"
          element={
            <Suspense fallback={<PageLoader />}>
              <ApprenticeshipPartnershipsPage />
            </Suspense>
          }
        />

        {/* Student Application Support Pages */}
        <Route
          path="/students/essay-coach"
          element={
            <Suspense fallback={<PageLoader />}>
              <EssayCoachPage />
            </Suspense>
          }
        />
        <Route
          path="/students/research-writer"
          element={
            <Suspense fallback={<PageLoader />}>
              <ResearchWriterPage />
            </Suspense>
          }
        />
        <Route
          path="/students/why-school"
          element={
            <Suspense fallback={<PageLoader />}>
              <WhySchoolPage />
            </Suspense>
          }
        />
        <Route
          path="/students/app-tracker"
          element={
            <Suspense fallback={<PageLoader />}>
              <ApplicationTrackerPage />
            </Suspense>
          }
        />
        <Route
          path="/students/interview-prep"
          element={
            <Suspense fallback={<PageLoader />}>
              <InterviewPrepPage />
            </Suspense>
          }
        />
        <Route
          path="/students/mock-review"
          element={
            <Suspense fallback={<PageLoader />}>
              <MockAdmissionsPage />
            </Suspense>
          }
        />

        {/* Student College Discovery Pages */}
        <Route
          path="/students/college-matcher"
          element={
            <Suspense fallback={<PageLoader />}>
              <CollegeMatcherPage />
            </Suspense>
          }
        />
        <Route
          path="/students/major-explorer"
          element={
            <Suspense fallback={<PageLoader />}>
              <MajorExplorerPage />
            </Suspense>
          }
        />
        <Route
          path="/students/campus-culture"
          element={
            <Suspense fallback={<PageLoader />}>
              <CampusCulturePage />
            </Suspense>
          }
        />
        <Route
          path="/students/financial-fit"
          element={
            <Suspense fallback={<PageLoader />}>
              <FinancialFitPage />
            </Suspense>
          }
        />
        <Route
          path="/students/virtual-tours"
          element={
            <Suspense fallback={<PageLoader />}>
              <VirtualToursPage />
            </Suspense>
          }
        />
        <Route
          path="/students/compare-schools"
          element={
            <Suspense fallback={<PageLoader />}>
              <CompareSchoolsPage />
            </Suspense>
          }
        />

        {/* Student Financial Planning Pages */}
        <Route
          path="/students/scholarship-matcher"
          element={
            <Suspense fallback={<PageLoader />}>
              <ScholarshipMatcherPage />
            </Suspense>
          }
        />
        <Route
          path="/students/net-price-calculator"
          element={
            <Suspense fallback={<PageLoader />}>
              <NetPriceCalculatorPage />
            </Suspense>
          }
        />
        <Route
          path="/students/award-letter-analyzer"
          element={
            <Suspense fallback={<PageLoader />}>
              <AwardLetterAnalyzerPage />
            </Suspense>
          }
        />
        <Route
          path="/students/css-profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <CSSProfileOptimizerPage />
            </Suspense>
          }
        />
        <Route
          path="/students/appeal-letter"
          element={
            <Suspense fallback={<PageLoader />}>
              <AppealLetterPage />
            </Suspense>
          }
        />
        <Route
          path="/students/stem-funding"
          element={
            <Suspense fallback={<PageLoader />}>
              <STEMFundingPage />
            </Suspense>
          }
        />
        <Route
          path="/students/loan-payoff"
          element={
            <Suspense fallback={<PageLoader />}>
              <LoanPayoffModelerPage />
            </Suspense>
          }
        />
        <Route
          path="/students/career-roi"
          element={
            <Suspense fallback={<PageLoader />}>
              <CareerROICalculatorPage />
            </Suspense>
          }
        />

        {/* Career Pathways Pages */}
        <Route
          path="/students/internship-finder"
          element={
            <Suspense fallback={<PageLoader />}>
              <InternshipFinderPage />
            </Suspense>
          }
        />
        <Route
          path="/students/work-based-learning"
          element={
            <Suspense fallback={<PageLoader />}>
              <WorkBasedLearningPage />
            </Suspense>
          }
        />
        <Route
          path="/students/apprenticeship-pathways"
          element={
            <Suspense fallback={<PageLoader />}>
              <ApprenticeshipPathwaysPage />
            </Suspense>
          }
        />

        {/* College Student Pages */}
        <Route
          path="/college/career-launch"
          element={
            <Suspense fallback={<PageLoader />}>
              <CareerLaunchHubPage />
            </Suspense>
          }
        />
        <Route
          path="/college/professional-development"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProfessionalDevelopmentPage />
            </Suspense>
          }
        />
        <Route
          path="/college/grad-school-prep"
          element={
            <Suspense fallback={<PageLoader />}>
              <GraduateSchoolPrepPage />
            </Suspense>
          }
        />
        <Route
          path="/college/research-opportunities"
          element={
            <Suspense fallback={<PageLoader />}>
              <ResearchOpportunitiesPage />
            </Suspense>
          }
        />
        <Route
          path="/college/government-careers"
          element={
            <Suspense fallback={<PageLoader />}>
              <GovernmentCareersPage />
            </Suspense>
          }
        />

        {/* College Career Launch Pages */}
        <Route
          path="/college/resume-builder"
          element={
            <Suspense fallback={<PageLoader />}>
              <ResumeBuilderPage />
            </Suspense>
          }
        />
        <Route
          path="/college/interview-prep"
          element={
            <Suspense fallback={<PageLoader />}>
              <CollegeInterviewPrepPage />
            </Suspense>
          }
        />
        <Route
          path="/college/salary-negotiation"
          element={
            <Suspense fallback={<PageLoader />}>
              <SalaryNegotiationPage />
            </Suspense>
          }
        />
        <Route
          path="/college/internships"
          element={
            <Suspense fallback={<PageLoader />}>
              <CollegeInternshipFinderPage />
            </Suspense>
          }
        />
        <Route
          path="/college/offer-compare"
          element={
            <Suspense fallback={<PageLoader />}>
              <OfferComparisonPage />
            </Suspense>
          }
        />

        {/* College Professional Development Pages */}
        <Route
          path="/college/skills-assessment"
          element={
            <Suspense fallback={<PageLoader />}>
              <SkillsAssessmentPage />
            </Suspense>
          }
        />
        <Route
          path="/college/portfolio-builder"
          element={
            <Suspense fallback={<PageLoader />}>
              <TechnicalPortfolioPage />
            </Suspense>
          }
        />
        <Route
          path="/college/networking"
          element={
            <Suspense fallback={<PageLoader />}>
              <NetworkingPage />
            </Suspense>
          }
        />
        <Route
          path="/college/mentorship"
          element={
            <Suspense fallback={<PageLoader />}>
              <MentorshipPage />
            </Suspense>
          }
        />
        <Route
          path="/college/events"
          element={
            <Suspense fallback={<PageLoader />}>
              <CollegeEventsPage />
            </Suspense>
          }
        />

        {/* College Graduate & Research Pages */}
        <Route
          path="/college/fellowships"
          element={
            <Suspense fallback={<PageLoader />}>
              <FellowshipFinderPage />
            </Suspense>
          }
        />
        <Route
          path="/college/sop-coach"
          element={
            <Suspense fallback={<PageLoader />}>
              <SOPCoachPage />
            </Suspense>
          }
        />
        <Route
          path="/college/faculty-match"
          element={
            <Suspense fallback={<PageLoader />}>
              <FacultyMatchPage />
            </Suspense>
          }
        />
        <Route
          path="/college/phd-decision"
          element={
            <Suspense fallback={<PageLoader />}>
              <PhDDecisionPage />
            </Suspense>
          }
        />

        {/* College Government & Finance Pages */}
        <Route
          path="/college/clearance-guide"
          element={
            <Suspense fallback={<PageLoader />}>
              <ClearanceGuidePage />
            </Suspense>
          }
        />
        <Route
          path="/college/loan-strategy"
          element={
            <Suspense fallback={<PageLoader />}>
              <LoanStrategyPage />
            </Suspense>
          }
        />
        <Route
          path="/college/grad-funding"
          element={
            <Suspense fallback={<PageLoader />}>
              <GradFundingPage />
            </Suspense>
          }
        />
        <Route
          path="/college/relocation"
          element={
            <Suspense fallback={<PageLoader />}>
              <RelocationCalculatorPage />
            </Suspense>
          }
        />
        <Route
          path="/college/budget-planner"
          element={
            <Suspense fallback={<PageLoader />}>
              <BudgetPlannerPage />
            </Suspense>
          }
        />

        {/* Challenges Pages */}
        <Route
          path="/challenges"
          element={
            <Suspense fallback={<PageLoader />}>
              <ChallengesPage />
            </Suspense>
          }
        />
        <Route
          path="/challenges/post"
          element={
            <Suspense fallback={<PageLoader />}>
              <PostChallengePage />
            </Suspense>
          }
        />
        <Route
          path="/challenges/solve"
          element={
            <Suspense fallback={<PageLoader />}>
              <SolveChallengePage />
            </Suspense>
          }
        />
        <Route
          path="/challenges/create"
          element={
            <Suspense fallback={<PageLoader />}>
              <CreateChallengePage />
            </Suspense>
          }
        />
        <Route
          path="/challenges/:slug"
          element={
            <Suspense fallback={<PageLoader />}>
              <ChallengeDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/challenges/:slug/submit"
          element={
            <Suspense fallback={<PageLoader />}>
              <ChallengeDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/challenges/:slug/submission"
          element={
            <Suspense fallback={<PageLoader />}>
              <ChallengeDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/challenges/:slug/teams"
          element={
            <Suspense fallback={<PageLoader />}>
              <ChallengeDetailPage />
            </Suspense>
          }
        />

        {/* Resource & Info Pages */}
        <Route
          path="/resources"
          element={
            <Suspense fallback={<PageLoader />}>
              <ResourcesPage />
            </Suspense>
          }
        />
        <Route
          path="/docs"
          element={
            <Suspense fallback={<PageLoader />}>
              <DocsPage />
            </Suspense>
          }
        />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<PageLoader />}>
              <BlogPage />
            </Suspense>
          }
        />
        <Route
          path="/guides"
          element={
            <Suspense fallback={<PageLoader />}>
              <GuidesPage />
            </Suspense>
          }
        />
        <Route
          path="/help"
          element={
            <Suspense fallback={<PageLoader />}>
              <HelpCenterPage />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoader />}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route
          path="/press"
          element={
            <Suspense fallback={<PageLoader />}>
              <PressPage />
            </Suspense>
          }
        />
        <Route
          path="/careers"
          element={
            <Suspense fallback={<PageLoader />}>
              <CareersPage />
            </Suspense>
          }
        />
        <Route
          path="/salary-insights"
          element={
            <Suspense fallback={<PageLoader />}>
              <SalaryInsightsPage />
            </Suspense>
          }
        />
        <Route
          path="/security-compliance"
          element={
            <Suspense fallback={<PageLoader />}>
              <SecurityCompliancePage />
            </Suspense>
          }
        />
        <Route
          path="/accessibility"
          element={
            <Suspense fallback={<PageLoader />}>
              <AccessibilityPage />
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicyPage />
            </Suspense>
          }
        />
        <Route
          path="/terms"
          element={
            <Suspense fallback={<PageLoader />}>
              <TermsOfServicePage />
            </Suspense>
          }
        />
        <Route
          path="/cookie-policy"
          element={
            <Suspense fallback={<PageLoader />}>
              <CookiePolicyPage />
            </Suspense>
          }
        />
        <Route
          path="/workforce-analytics"
          element={
            <Suspense fallback={<PageLoader />}>
              <WorkforceAnalyticsPage />
            </Suspense>
          }
        />
        <Route
          path="/projects"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectsPage />
            </Suspense>
          }
        />
        <Route
          path="/talent-search"
          element={
            <Suspense fallback={<PageLoader />}>
              <TalentSearchPage />
            </Suspense>
          }
        />
        <Route
          path="/for-talent"
          element={
            <Suspense fallback={<PageLoader />}>
              <ForTalentPage />
            </Suspense>
          }
        />
        <Route
          path="/high-school"
          element={
            <Suspense fallback={<PageLoader />}>
              <HighSchoolLandingPage />
            </Suspense>
          }
        />
        <Route
          path="/college"
          element={
            <Suspense fallback={<PageLoader />}>
              <CollegeLandingPage />
            </Suspense>
          }
        />
        <Route
          path="/clearance-guide"
          element={
            <Suspense fallback={<PageLoader />}>
              <ClearanceGuideLandingPage />
            </Suspense>
          }
        />
        <Route
          path="/mentorship"
          element={
            <Suspense fallback={<PageLoader />}>
              <MentorshipLandingPage />
            </Suspense>
          }
        />

        {/* Students landing redirect */}
        <Route path="/students" element={<Navigate to="/high-school" replace />} />

        {/* Workforce Services Pages */}
        <Route path="/workforce" element={<Suspense fallback={<PageLoader />}><WorkforceServicesHubPage /></Suspense>} />
        <Route path="/workforce/career-centers" element={<Suspense fallback={<PageLoader />}><CareerCenterFinderPage /></Suspense>} />
        <Route path="/workforce/training-providers" element={<Suspense fallback={<PageLoader />}><TrainingProviderSearchPage /></Suspense>} />
        <Route path="/workforce/fafsa-assistant" element={<Suspense fallback={<PageLoader />}><FAFSAAssistantPage /></Suspense>} />
        <Route path="/workforce/training-funding" element={<Suspense fallback={<PageLoader />}><TrainingFundingPage /></Suspense>} />
        <Route path="/workforce/ita-funding" element={<Suspense fallback={<PageLoader />}><TrainingFundingPage /></Suspense>} />
        <Route path="/workforce/supportive-services" element={<Suspense fallback={<PageLoader />}><SupportiveServicesPage /></Suspense>} />
        <Route path="/workforce/dislocated-workers" element={<Suspense fallback={<PageLoader />}><DislocatedWorkerPage /></Suspense>} />
        <Route path="/workforce/rapid-response" element={<Suspense fallback={<PageLoader />}><DislocatedWorkerPage /></Suspense>} />
        <Route path="/workforce/unemployment" element={<Suspense fallback={<PageLoader />}><UnemploymentBenefitsPage /></Suspense>} />
        <Route path="/workforce/participant-portal" element={<Suspense fallback={<PageLoader />}><ParticipantPortal /></Suspense>} />
        <Route path="/workforce/ai-intake" element={<Suspense fallback={<PageLoader />}><AIIntakeAssistant /></Suspense>} />
        <Route path="/workforce/program/:programId" element={<Suspense fallback={<PageLoader />}><TrainingProviderSearchPage /></Suspense>} />
        <Route path="/workforce/provider/:providerId" element={<Suspense fallback={<PageLoader />}><TrainingProviderSearchPage /></Suspense>} />

        {/* Healthcare Provider Pages */}
        <Route path="/healthcare-providers" element={<Suspense fallback={<PageLoader />}><HealthcareProviderLogin /></Suspense>} />
        <Route path="/healthcare-providers/baa" element={<Suspense fallback={<PageLoader />}><HealthcareProviderLogin /></Suspense>} />
        <Route path="/healthcare-providers/support" element={<Suspense fallback={<PageLoader />}><HealthcareProviderLogin /></Suspense>} />
        <Route path="/healthcare-providers/hipaa-notice" element={<Suspense fallback={<PageLoader />}><HealthcareProviderLogin /></Suspense>} />
        <Route path="/healthcare-provider-resources" element={<Suspense fallback={<PageLoader />}><HealthcareProviderDashboard /></Suspense>} />

        {/* Research Portal Pages */}
        <Route path="/research-portal" element={<Suspense fallback={<PageLoader />}><ResearchPortalLogin /></Suspense>} />
        <Route path="/research-portal-login" element={<Suspense fallback={<PageLoader />}><ResearchPortalLogin /></Suspense>} />
        <Route path="/research-portal/register" element={<Suspense fallback={<PageLoader />}><ResearchPortalRegister /></Suspense>} />
        <Route path="/research-portal/data-governance" element={<Suspense fallback={<PageLoader />}><ResearchPortalDashboard /></Suspense>} />
        <Route path="/research-resources" element={<Suspense fallback={<PageLoader />}><ResearchPortalDashboard /></Suspense>} />

        {/* Counselor Portal */}
        <Route path="/counselor" element={<Suspense fallback={<PageLoader />}><CounselorDashboard /></Suspense>} />

        {/* Municipality Partner Pages */}
        <Route path="/municipality-partner-apply" element={<Suspense fallback={<PageLoader />}><MunicipalityPartnersPage /></Suspense>} />
        <Route path="/municipality-partner-dashboard" element={<Suspense fallback={<PageLoader />}><MunicipalityPartnerDashboard /></Suspense>} />
        <Route path="/partners/municipality" element={<Suspense fallback={<PageLoader />}><MunicipalityPartnersPage /></Suspense>} />
        <Route path="/partners/state-workforce" element={<Suspense fallback={<PageLoader />}><StateWorkforcePortalPage /></Suspense>} />

        {/* Contact & Settings Pages */}
        <Route path="/contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
        <Route path="/contact-sales" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
        <Route path="/privacy-request" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
        <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><SettingsPage /></Suspense></ProtectedRoute>} />

        {/* Partner Application */}
        <Route path="/partner-apply" element={<Suspense fallback={<PageLoader />}><PartnerApplyPage /></Suspense>} />

        {/* Additional Challenges Pages */}
        <Route path="/challenges/analytics" element={<Suspense fallback={<PageLoader />}><ChallengesAnalyticsPage /></Suspense>} />
        <Route path="/challenges/leaderboard" element={<Suspense fallback={<PageLoader />}><ChallengesLeaderboardPage /></Suspense>} />

        {/* Additional College Pages */}
        <Route path="/college/certification-pathways" element={<Suspense fallback={<PageLoader />}><CertificationPathwaysPage /></Suspense>} />
        <Route path="/college/masters-programs" element={<Suspense fallback={<PageLoader />}><MastersProgramsPage /></Suspense>} />
        <Route path="/college/program-search" element={<Suspense fallback={<PageLoader />}><ProgramSearchPage /></Suspense>} />
        <Route path="/college/faculty-email-guide" element={<Suspense fallback={<PageLoader />}><FacultyEmailGuidePage /></Suspense>} />

        {/* Federation Pages - Aggregated Listings */}
        <Route
          path="/explore"
          element={
            <Suspense fallback={<PageLoader />}>
              <FederatedListingsPage />
            </Suspense>
          }
        />
        <Route
          path="/explore/:contentType"
          element={
            <Suspense fallback={<PageLoader />}>
              <FederatedListingsPage />
            </Suspense>
          }
        />
      </Route>

      {/* Light mode test routes */}
      <Route element={<LayoutLight />}>
        <Route
          path="/industries-light/:industryId"
          element={
            <Suspense fallback={<PageLoader />}>
              <IndustryPageLight />
            </Suspense>
          }
        />
      </Route>

      {/* Protected dashboard route */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Provider Dashboard - requires service_provider role */}
      <Route
        path="/provider/*"
        element={
          <ProtectedRoute roles={['service_provider', 'admin', 'super_admin', 'SUPER_ADMIN']}>
            <Suspense fallback={<PageLoader />}>
              <ProviderDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Admin routes - requires admin role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN']}>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/billing"
        element={
          <ProtectedRoute roles={['admin', 'super_admin', 'SUPER_ADMIN', 'BILLING_ADMIN']}>
            <Suspense fallback={<PageLoader />}>
              <BillingDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/advertising"
        element={
          <ProtectedRoute roles={['admin', 'super_admin', 'SUPER_ADMIN', 'CONTENT_ADMIN']}>
            <Suspense fallback={<PageLoader />}>
              <AdvertisingDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/marketplace"
        element={
          <ProtectedRoute roles={['admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN']}>
            <Suspense fallback={<PageLoader />}>
              <MarketplaceDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Auth routes with minimal layout */}
      <Route
        path="/login"
        element={
          <MinimalLayout>
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          </MinimalLayout>
        }
      />
      <Route
        path="/register"
        element={
          <MinimalLayout>
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          </MinimalLayout>
        }
      />
      <Route
        path="/auth/callback"
        element={
          <MinimalLayout>
            <Suspense fallback={<PageLoader />}>
              <AuthCallbackPage />
            </Suspense>
          </MinimalLayout>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <MinimalLayout>
            <Suspense fallback={<PageLoader />}>
              <NotFoundPage />
            </Suspense>
          </MinimalLayout>
        }
      />
    </Routes>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <FeatureProvider>
                <BillingProvider>
                  <NotificationProvider>
                    <AppRoutes />
                  </NotificationProvider>
                </BillingProvider>
              </FeatureProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
