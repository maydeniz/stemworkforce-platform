// ===========================================
// Main Application Component
// ===========================================

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, NotificationProvider, BillingProvider, ThemeProvider } from '@/contexts';
import { Layout, MinimalLayout, LayoutLight } from '@/components/layout';
import { PageLoader, ErrorBoundary } from '@/components/common';
import { useAuth } from '@/contexts';
import { supabase } from '@/lib/supabase';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/components/pages/HomePage'));
const JobsPage = lazy(() => import('@/components/pages/JobsPage'));
const JobDetailPage = lazy(() => import('@/components/pages/JobDetailPage'));
const EventsPage = lazy(() => import('@/components/pages/EventsPage'));
const TrainingPage = lazy(() => import('@/components/pages/TrainingPage'));
const WorkforceMapPage = lazy(() => import('@/components/pages/WorkforceMapPage'));
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

// Provider Dashboard - lazy loaded
const ProviderDashboard = lazy(() => import('@/components/pages/provider/ProviderDashboard'));

// Admin dashboards - lazy loaded
const AdminDashboard = lazy(() => import('@/components/pages/admin/AdminDashboard'));
const BillingDashboard = lazy(() => import('@/components/pages/billing/BillingDashboard'));
const AdvertisingDashboard = lazy(() => import('@/components/pages/advertising/AdvertisingDashboard'));
const MarketplaceDashboard = lazy(() => import('@/components/pages/marketplace/MarketplaceDashboard'));

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch role from public.users table
  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }

      console.log('[ProtectedRoute] User ID:', user.id);
      console.log('[ProtectedRoute] User metadata:', (user as any).user_metadata);

      try {
        // First check user_metadata (from signup)
        const metaRole = (user as any).user_metadata?.role;
        if (metaRole) {
          console.log('[ProtectedRoute] Found role in metadata:', metaRole);
          setUserRole(metaRole);
          setRoleLoading(false);
          return;
        }

        // Fetch from public.users table - try by ID first, then by email
        console.log('[ProtectedRoute] Fetching role from database for user:', user.id, user.email);

        // Try by ID first
        let { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        console.log('[ProtectedRoute] Database response (by ID):', { data, error });

        // If not found by ID, try by email
        if (!data && user.email) {
          console.log('[ProtectedRoute] Not found by ID, trying by email:', user.email);
          const emailResult = await supabase
            .from('users')
            .select('role')
            .eq('email', user.email)
            .single();

          data = emailResult.data;
          error = emailResult.error;
          console.log('[ProtectedRoute] Database response (by email):', { data, error });
        }

        if (data?.role) {
          console.log('[ProtectedRoute] Found role in database:', data.role);
          setUserRole(data.role);
        } else {
          console.log('[ProtectedRoute] No role found in database');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
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
    console.log('[ProtectedRoute] Checking role access:', { userRole, requiredRoles: roles, hasAccess: userRole && roles.includes(userRole) });
    if (!userRole || !roles.includes(userRole)) {
      console.log('[ProtectedRoute] Access denied - redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
    console.log('[ProtectedRoute] Access granted for role:', userRole);
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
          path="/events"
          element={
            <Suspense fallback={<PageLoader />}>
              <EventsPage />
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
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <BillingProvider>
              <NotificationProvider>
                <AppRoutes />
              </NotificationProvider>
            </BillingProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
