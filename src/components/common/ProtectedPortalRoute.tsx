// ===========================================
// Protected Portal Route Component
// Role-based access control for sensitive portals
// ===========================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

type PortalRole =
  | 'healthcare_provider'
  | 'researcher'
  | 'school_nurse'
  | 'district_admin'
  | 'admin'
  | 'super_admin';

interface ProtectedPortalRouteProps {
  children: React.ReactNode;
  allowedRoles: PortalRole[];
  portalType: 'healthcare' | 'research';
  loginPath: string;
}

// Session timeout in milliseconds (30 minutes for HIPAA compliance)
const SESSION_TIMEOUT = 30 * 60 * 1000;

const ProtectedPortalRoute: React.FC<ProtectedPortalRouteProps> = ({
  children,
  allowedRoles,
  portalType,
  loginPath,
}) => {
  const { user, isLoading, isAuthenticated, session } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to portal login
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={loginPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check session validity and timeout
  if (session) {
    // Use expires_at to calculate session age (Supabase Session type uses expires_at, not created_at)
    // Since we can't get created_at directly, we calculate based on token expiry minus standard expiry time
    const expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now();
    // Supabase tokens typically expire in 3600 seconds (1 hour), so session started ~ (expires_at - 3600000)
    const sessionCreatedAt = expiresAt - (60 * 60 * 1000); // Approximate session start
    const now = Date.now();

    // Check if session has exceeded timeout (for HIPAA/FERPA compliance)
    if (now - sessionCreatedAt > SESSION_TIMEOUT) {
      // Session expired - redirect to login with timeout message
      return (
        <Navigate
          to={loginPath}
          state={{
            from: location.pathname,
            sessionExpired: true,
            message: 'Your session has expired for security. Please log in again.'
          }}
          replace
        />
      );
    }
  }

  // Get user role from app_metadata ONLY (server-controlled, secure)
  // SECURITY: Never fall back to user_metadata - it's user-controllable and spoofable
  const userRole = (user as any).app_metadata?.role || 'jobseeker';

  // Check if user has required role
  const hasRequiredRole = allowedRoles.includes(userRole as PortalRole) ||
                          userRole === 'admin' ||
                          userRole === 'super_admin' ||
                          userRole === 'SUPER_ADMIN' ||
                          userRole === 'PLATFORM_ADMIN';

  if (!hasRequiredRole) {
    // User authenticated but doesn't have required role
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-red-500/30 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            {portalType === 'healthcare' ? (
              <>
                You do not have access to the Healthcare Provider Portal.
                <br /><br />
                This portal is restricted to verified healthcare providers with valid NPI credentials.
              </>
            ) : (
              <>
                You do not have access to the Research Portal.
                <br /><br />
                This portal is restricted to verified researchers with institutional affiliation and IRB approval.
              </>
            )}
          </p>

          <div className="space-y-3">
            <a
              href={loginPath}
              className={`block w-full py-3 rounded-lg font-medium transition-colors ${
                portalType === 'healthcare'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {portalType === 'healthcare' ? 'Register as Provider' : 'Register as Researcher'}
            </a>
            <a
              href="/"
              className="block w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Return to Home
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Shield className="w-4 h-4" />
              <span>
                {portalType === 'healthcare' ? 'HIPAA' : 'FERPA'} Protected Portal
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check for additional compliance requirements
  // SECURITY: Use app_metadata (server-controlled, tamper-proof) — NOT user_metadata
  // user_metadata can be modified client-side via supabase.auth.updateUser()
  const appData = (user as any).app_metadata || {};

  if (portalType === 'healthcare') {
    // Healthcare providers need NPI verification and BAA acknowledgment
    const npiVerified = appData.npi_verified === true;
    const baaAcknowledged = appData.baa_acknowledged === true;

    if (!npiVerified || !baaAcknowledged) {
      return (
        <Navigate
          to={loginPath}
          state={{
            from: location.pathname,
            complianceRequired: true,
            message: 'Please complete NPI verification and BAA acknowledgment.'
          }}
          replace
        />
      );
    }
  }

  if (portalType === 'research') {
    // Researchers need FERPA training and DUA acknowledgment
    const ferpaTrainingComplete = appData.ferpa_training_complete === true;
    const duaAcknowledged = appData.dua_acknowledged === true;

    if (!ferpaTrainingComplete || !duaAcknowledged) {
      return (
        <Navigate
          to={loginPath}
          state={{
            from: location.pathname,
            complianceRequired: true,
            message: 'Please complete FERPA training and Data Use Agreement acknowledgment.'
          }}
          replace
        />
      );
    }
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

// Higher-order component for healthcare portal routes
export const withHealthcareAuth = (Component: React.ComponentType) => {
  return function ProtectedHealthcareComponent(props: any) {
    return (
      <ProtectedPortalRoute
        allowedRoles={['healthcare_provider', 'school_nurse', 'district_admin']}
        portalType="healthcare"
        loginPath="/healthcare-provider-login"
      >
        <Component {...props} />
      </ProtectedPortalRoute>
    );
  };
};

// Higher-order component for research portal routes
export const withResearchAuth = (Component: React.ComponentType) => {
  return function ProtectedResearchComponent(props: any) {
    return (
      <ProtectedPortalRoute
        allowedRoles={['researcher', 'district_admin']}
        portalType="research"
        loginPath="/research-portal-login"
      >
        <Component {...props} />
      </ProtectedPortalRoute>
    );
  };
};

export default ProtectedPortalRoute;
