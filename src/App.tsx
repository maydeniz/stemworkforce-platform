// ===========================================
// Main Application Component
// ===========================================

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, NotificationProvider } from '@/contexts';
import { Layout, MinimalLayout } from '@/components/layout';
import { PageLoader, ErrorBoundary } from '@/components/common';
import { useAuth } from '@/contexts';

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

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
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
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
