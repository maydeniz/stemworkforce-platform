// ===========================================
// FEATURE ROUTE - Route wrapper for feature flags
// Automatically redirects or shows fallback for disabled features
// ===========================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFeatureFlag } from '@/contexts/FeatureContext';
import { AlertTriangle, Lock, Wrench, Beaker } from 'lucide-react';

interface FeatureRouteProps {
  featureId: string;
  children: React.ReactNode;
  fallbackPath?: string;
  showDisabledMessage?: boolean;
}

// Disabled feature page component
const DisabledFeaturePage: React.FC<{
  featureName: string;
  status: string;
}> = ({ featureName, status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'maintenance':
        return {
          icon: Wrench,
          title: 'Under Maintenance',
          message: 'This feature is temporarily unavailable while we perform maintenance.',
          color: 'amber',
        };
      case 'beta':
        return {
          icon: Beaker,
          title: 'Beta Access Required',
          message: 'This feature is currently in beta testing. Contact support for early access.',
          color: 'violet',
        };
      case 'admin-only':
        return {
          icon: Lock,
          title: 'Admin Access Required',
          message: 'This feature is only available to administrators.',
          color: 'blue',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Feature Unavailable',
          message: 'This feature is currently not available.',
          color: 'slate',
        };
    }
  };

  const info = getStatusInfo();
  const Icon = info.icon;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className={`inline-flex p-4 rounded-full bg-${info.color}-500/20 mb-6`}>
          <Icon size={48} className={`text-${info.color}-400`} />
        </div>
        <h1 className="text-2xl font-bold mb-3">{info.title}</h1>
        <p className="text-slate-400 mb-6">{info.message}</p>
        <p className="text-sm text-slate-500">
          Feature: <span className="font-medium text-slate-300">{featureName}</span>
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// Feature Route wrapper component
export const FeatureRoute: React.FC<FeatureRouteProps> = ({
  featureId,
  children,
  fallbackPath = '/',
  showDisabledMessage = true,
}) => {
  const { canAccess, status, feature } = useFeatureFlag(featureId);
  const location = useLocation();

  // If feature is accessible, render children
  if (canAccess) {
    return <>{children}</>;
  }

  // If we should show a disabled message, render it
  if (showDisabledMessage && feature) {
    return (
      <DisabledFeaturePage
        featureName={feature.name}
        status={status || 'disabled'}
      />
    );
  }

  // Otherwise, redirect to fallback path
  return <Navigate to={fallbackPath} state={{ from: location }} replace />;
};

// Simple component to conditionally render content based on feature flag
interface FeatureContentProps {
  featureId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureContent: React.FC<FeatureContentProps> = ({
  featureId,
  children,
  fallback = null,
}) => {
  const { canAccess } = useFeatureFlag(featureId);

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Hook to check multiple features at once
export const useMultipleFeatures = (featureIds: string[]): Record<string, boolean> => {
  const results: Record<string, boolean> = {};

  featureIds.forEach(id => {
    // This is a simplified version - in a real implementation,
    // you'd want to batch these checks
    const { canAccess } = useFeatureFlag(id);
    results[id] = canAccess;
  });

  return results;
};

export default FeatureRoute;
