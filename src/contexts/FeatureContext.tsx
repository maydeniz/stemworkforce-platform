// ===========================================
// FEATURE FLAGS CONTEXT
// Manages navigation feature flags across the application
// ===========================================

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  NavigationFlags,
  NavMenu,
  FeatureStatus,
  defaultNavigationFlags,
  loadNavigationFlags,
  saveNavigationFlags,
  isPathEnabled,
  getMenuStats,
  // Legacy exports for backwards compatibility
  FeatureFlags,
  FeatureFlag,
  FeatureCategory,
  defaultFeatureFlags,
} from '@/config/featureFlags';
import { useAuth } from './AuthContext';

// Context value interface
interface FeatureContextValue {
  // Navigation flags state
  navigationFlags: NavigationFlags;
  isLoading: boolean;

  // Navigation flag operations
  updateMenuStatus: (menuKey: keyof NavigationFlags, status: FeatureStatus) => void;
  updateSectionStatus: (menuKey: keyof NavigationFlags, sectionId: string, status: FeatureStatus) => void;
  updateItemStatus: (menuKey: keyof NavigationFlags, sectionId: string, itemId: string, status: FeatureStatus) => void;

  // Bulk operations
  enableAll: () => void;
  disableAll: () => void;
  enableMenu: (menuKey: keyof NavigationFlags) => void;
  disableMenu: (menuKey: keyof NavigationFlags) => void;
  enableSection: (menuKey: keyof NavigationFlags, sectionId: string) => void;
  disableSection: (menuKey: keyof NavigationFlags, sectionId: string) => void;

  // Reset
  resetToDefaults: () => void;

  // Path checking
  isPathEnabled: (path: string) => boolean;
  getMenuStats: (menu: NavMenu) => { enabled: number; disabled: number; total: number };

  // Check if item/section/menu is enabled
  isMenuEnabled: (menuKey: keyof NavigationFlags) => boolean;
  isSectionEnabled: (menuKey: keyof NavigationFlags, sectionId: string) => boolean;
  isItemEnabled: (menuKey: keyof NavigationFlags, sectionId: string, itemId: string) => boolean;

  // Legacy compatibility
  features: FeatureFlags;
  isFeatureEnabled: (featureId: string) => boolean;
  canAccessFeature: (featureId: string) => boolean;
  getFeatureStatus: (featureId: string) => FeatureStatus | undefined;
  updateFeatureStatus: (featureId: string, status: FeatureStatus) => void;
  updateFeature: (featureId: string, updates: Partial<FeatureFlag>) => void;
  getFeaturesByCategory: (category: FeatureCategory) => FeatureFlag[];
  getAllFeatures: () => FeatureFlag[];
  getEnabledFeatures: () => FeatureFlag[];
  getDisabledFeatures: () => FeatureFlag[];
  isRouteEnabled: (route: string) => boolean;
  getFeatureByRoute: (route: string) => FeatureFlag | undefined;
}

// Create context
const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

// Provider props
interface FeatureProviderProps {
  children: React.ReactNode;
}

// Feature Provider component
export const FeatureProvider: React.FC<FeatureProviderProps> = ({ children }) => {
  const [navigationFlags, setNavigationFlags] = useState<NavigationFlags>(defaultNavigationFlags);
  const [isLoading, setIsLoading] = useState(true);
  const { user: _user } = useAuth();

  // Load flags on mount
  useEffect(() => {
    const loadedFlags = loadNavigationFlags();
    setNavigationFlags(loadedFlags);
    setIsLoading(false);
  }, []);

  // Save flags when they change (after initial load)
  useEffect(() => {
    if (!isLoading) {
      saveNavigationFlags(navigationFlags);
    }
  }, [navigationFlags, isLoading]);

  // Update menu status
  const updateMenuStatus = useCallback((menuKey: keyof NavigationFlags, status: FeatureStatus) => {
    setNavigationFlags(prev => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        status,
      },
    }));
  }, []);

  // Update section status
  const updateSectionStatus = useCallback((menuKey: keyof NavigationFlags, sectionId: string, status: FeatureStatus) => {
    setNavigationFlags(prev => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        sections: prev[menuKey].sections.map(section =>
          section.id === sectionId ? { ...section, status } : section
        ),
      },
    }));
  }, []);

  // Update item status
  const updateItemStatus = useCallback((menuKey: keyof NavigationFlags, sectionId: string, itemId: string, status: FeatureStatus) => {
    setNavigationFlags(prev => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        sections: prev[menuKey].sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map(item =>
                  item.id === itemId ? { ...item, status } : item
                ),
              }
            : section
        ),
      },
    }));
  }, []);

  // Enable all items
  const enableAll = useCallback(() => {
    setNavigationFlags(prev => {
      const updated = { ...prev };
      (Object.keys(updated) as (keyof NavigationFlags)[]).forEach(menuKey => {
        updated[menuKey] = {
          ...updated[menuKey],
          status: 'enabled',
          sections: updated[menuKey].sections.map(section => ({
            ...section,
            status: 'enabled',
            items: section.items.map(item => ({ ...item, status: 'enabled' })),
          })),
        };
      });
      return updated;
    });
  }, []);

  // Disable all items
  const disableAll = useCallback(() => {
    setNavigationFlags(prev => {
      const updated = { ...prev };
      (Object.keys(updated) as (keyof NavigationFlags)[]).forEach(menuKey => {
        updated[menuKey] = {
          ...updated[menuKey],
          status: 'disabled',
          sections: updated[menuKey].sections.map(section => ({
            ...section,
            status: 'disabled',
            items: section.items.map(item => ({ ...item, status: 'disabled' })),
          })),
        };
      });
      return updated;
    });
  }, []);

  // Enable entire menu
  const enableMenu = useCallback((menuKey: keyof NavigationFlags) => {
    setNavigationFlags(prev => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        status: 'enabled',
        sections: prev[menuKey].sections.map(section => ({
          ...section,
          status: 'enabled',
          items: section.items.map(item => ({ ...item, status: 'enabled' })),
        })),
      },
    }));
  }, []);

  // Disable entire menu
  const disableMenu = useCallback((menuKey: keyof NavigationFlags) => {
    setNavigationFlags(prev => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        status: 'disabled',
        sections: prev[menuKey].sections.map(section => ({
          ...section,
          status: 'disabled',
          items: section.items.map(item => ({ ...item, status: 'disabled' })),
        })),
      },
    }));
  }, []);

  // Enable entire section
  const enableSection = useCallback((menuKey: keyof NavigationFlags, sectionId: string) => {
    setNavigationFlags(prev => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        sections: prev[menuKey].sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                status: 'enabled',
                items: section.items.map(item => ({ ...item, status: 'enabled' })),
              }
            : section
        ),
      },
    }));
  }, []);

  // Disable entire section
  const disableSection = useCallback((menuKey: keyof NavigationFlags, sectionId: string) => {
    setNavigationFlags(prev => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        sections: prev[menuKey].sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                status: 'disabled',
                items: section.items.map(item => ({ ...item, status: 'disabled' })),
              }
            : section
        ),
      },
    }));
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setNavigationFlags(defaultNavigationFlags);
  }, []);

  // Check if path is enabled
  const isPathEnabledCallback = useCallback((path: string): boolean => {
    return isPathEnabled(navigationFlags, path);
  }, [navigationFlags]);

  // Get menu stats
  const getMenuStatsCallback = useCallback((menu: NavMenu) => {
    return getMenuStats(menu);
  }, []);

  // Check if menu is enabled
  const isMenuEnabled = useCallback((menuKey: keyof NavigationFlags): boolean => {
    return navigationFlags[menuKey].status === 'enabled';
  }, [navigationFlags]);

  // Check if section is enabled
  const isSectionEnabled = useCallback((menuKey: keyof NavigationFlags, sectionId: string): boolean => {
    const section = navigationFlags[menuKey].sections.find(s => s.id === sectionId);
    return section?.status === 'enabled' && navigationFlags[menuKey].status === 'enabled';
  }, [navigationFlags]);

  // Check if item is enabled
  const isItemEnabled = useCallback((menuKey: keyof NavigationFlags, sectionId: string, itemId: string): boolean => {
    const section = navigationFlags[menuKey].sections.find(s => s.id === sectionId);
    const item = section?.items.find(i => i.id === itemId);
    return item?.status === 'enabled' && section?.status === 'enabled' && navigationFlags[menuKey].status === 'enabled';
  }, [navigationFlags]);

  // Legacy compatibility methods
  const isFeatureEnabled = useCallback((_featureId: string): boolean => true, []);
  const canAccessFeature = useCallback((_featureId: string): boolean => true, []);
  const getFeatureStatus = useCallback((_featureId: string): FeatureStatus | undefined => 'enabled', []);
  const updateFeatureStatus = useCallback((_featureId: string, _status: FeatureStatus) => {}, []);
  const updateFeature = useCallback((_featureId: string, _updates: Partial<FeatureFlag>) => {}, []);
  const getFeaturesByCategory = useCallback((_category: FeatureCategory): FeatureFlag[] => [], []);
  const getAllFeatures = useCallback((): FeatureFlag[] => [], []);
  const getEnabledFeatures = useCallback((): FeatureFlag[] => [], []);
  const getDisabledFeatures = useCallback((): FeatureFlag[] => [], []);
  const isRouteEnabled = useCallback((route: string): boolean => isPathEnabled(navigationFlags, route), [navigationFlags]);
  const getFeatureByRoute = useCallback((_route: string): FeatureFlag | undefined => undefined, []);

  // Memoize context value
  const value = useMemo<FeatureContextValue>(() => ({
    navigationFlags,
    isLoading,
    updateMenuStatus,
    updateSectionStatus,
    updateItemStatus,
    enableAll,
    disableAll,
    enableMenu,
    disableMenu,
    enableSection,
    disableSection,
    resetToDefaults,
    isPathEnabled: isPathEnabledCallback,
    getMenuStats: getMenuStatsCallback,
    isMenuEnabled,
    isSectionEnabled,
    isItemEnabled,
    // Legacy
    features: defaultFeatureFlags,
    isFeatureEnabled,
    canAccessFeature,
    getFeatureStatus,
    updateFeatureStatus,
    updateFeature,
    getFeaturesByCategory,
    getAllFeatures,
    getEnabledFeatures,
    getDisabledFeatures,
    isRouteEnabled,
    getFeatureByRoute,
  }), [
    navigationFlags,
    isLoading,
    updateMenuStatus,
    updateSectionStatus,
    updateItemStatus,
    enableAll,
    disableAll,
    enableMenu,
    disableMenu,
    enableSection,
    disableSection,
    resetToDefaults,
    isPathEnabledCallback,
    getMenuStatsCallback,
    isMenuEnabled,
    isSectionEnabled,
    isItemEnabled,
    isFeatureEnabled,
    canAccessFeature,
    getFeatureStatus,
    updateFeatureStatus,
    updateFeature,
    getFeaturesByCategory,
    getAllFeatures,
    getEnabledFeatures,
    getDisabledFeatures,
    isRouteEnabled,
    getFeatureByRoute,
  ]);

  return (
    <FeatureContext.Provider value={value}>
      {children}
    </FeatureContext.Provider>
  );
};

// Custom hook to use feature context
export const useFeatures = (): FeatureContextValue => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};

// Convenience hook to check a single feature (legacy compatibility)
export const useFeatureFlag = (featureId: string): {
  isEnabled: boolean;
  canAccess: boolean;
  status: FeatureStatus | undefined;
  feature: FeatureFlag | undefined;
} => {
  const { isFeatureEnabled, canAccessFeature, getFeatureStatus, features } = useFeatures();

  return useMemo(() => ({
    isEnabled: isFeatureEnabled(featureId),
    canAccess: canAccessFeature(featureId),
    status: getFeatureStatus(featureId),
    feature: features[featureId],
  }), [features, featureId, isFeatureEnabled, canAccessFeature, getFeatureStatus]);
};

// HOC to wrap components with feature flag check
export function withFeatureFlag<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureId: string,
  FallbackComponent?: React.ComponentType
): React.FC<P> {
  return function WithFeatureFlagComponent(props: P) {
    const { canAccess } = useFeatureFlag(featureId);

    if (!canAccess) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Component to conditionally render based on feature flag
interface FeatureGateProps {
  featureId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
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

export default FeatureContext;
