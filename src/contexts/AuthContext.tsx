// ===========================================
// Authentication Context
// ===========================================

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { ENV_CONFIG, PermissionChecker } from '@/config';
import { secureStore, generateSessionId } from '@/utils/security';
import { AuditLogger } from '@/utils/audit';
import type { User, UserRole, DataAccessLevel } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithRole: (role: UserRole) => void; // For demo purposes
  signOut: () => void;
  hasPermission: (action: 'apply' | 'post' | 'manage_users') => boolean;
  canViewPage: (page: string) => boolean;
  hasDataAccess: (dataType: DataAccessLevel) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => secureStore.get<User>('user'));
  const [isLoading, setIsLoading] = useState(false);
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activityEventsRef = useRef<string[]>(['mousedown', 'keydown', 'touchstart', 'scroll']);

  // Session timeout handler
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    if (user) {
      sessionTimeoutRef.current = setTimeout(() => {
        AuditLogger.sessionTimeout(user.id);
        signOut();
      }, ENV_CONFIG.SESSION_TIMEOUT);
    }
  }, [user]);

  // Activity tracking
  useEffect(() => {
    if (!user) return;

    const handleActivity = () => resetSessionTimeout();

    activityEventsRef.current.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetSessionTimeout();

    return () => {
      activityEventsRef.current.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [user, resetSessionTimeout]);

  // Sign in with credentials (real auth)
  const signIn = async (email: string, _password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // In production, this would call the auth API
      // const response = await authApi.login({ email, password });
      // setUser(response.user);
      
      AuditLogger.loginAttempt(email, true, 'password');
      
      // For now, simulate login
      const mockUser: User = {
        id: generateSessionId(),
        email,
        firstName: 'Demo',
        lastName: 'User',
        role: 'jobseeker',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          emailDigest: 'weekly',
          theme: 'dark',
          industries: [],
          locations: [],
        },
      };

      setUser(mockUser);
      secureStore.set('user', mockUser);
      sessionStorage.setItem('sessionId', generateSessionId());
    } catch (error) {
      AuditLogger.loginAttempt(email, false, 'password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with role (demo mode)
  const signInWithRole = (role: UserRole): void => {
    const mockUser: User = {
      id: generateSessionId(),
      email: `${role}@stemworkforce.gov`,
      firstName: role.charAt(0).toUpperCase() + role.slice(1),
      lastName: 'User',
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        emailDigest: 'weekly',
        theme: 'dark',
        industries: [],
        locations: [],
      },
    };

    setUser(mockUser);
    secureStore.set('user', mockUser);
    sessionStorage.setItem('sessionId', generateSessionId());
    AuditLogger.loginAttempt(mockUser.email, true, 'demo');
  };

  // Sign out
  const signOut = useCallback((): void => {
    if (user) {
      AuditLogger.logout(user.id, 'user_initiated');
    }

    setUser(null);
    secureStore.remove('user');
    sessionStorage.removeItem('sessionId');
    AuditLogger.resetSession();

    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
  }, [user]);

  // Permission helpers
  const hasPermission = useCallback(
    (action: 'apply' | 'post' | 'manage_users'): boolean => {
      return PermissionChecker.canPerformAction(user?.role ?? null, action);
    },
    [user]
  );

  const canViewPage = useCallback(
    (page: string): boolean => {
      return PermissionChecker.canViewPage(user?.role ?? null, page);
    },
    [user]
  );

  const hasDataAccess = useCallback(
    (dataType: DataAccessLevel): boolean => {
      return PermissionChecker.hasDataAccess(user?.role ?? null, dataType);
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signInWithRole,
    signOut,
    hasPermission,
    canViewPage,
    hasDataAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
): React.FC<P> => {
  return function ProtectedComponent(props: P) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-400">Please sign in to access this page.</p>
          </div>
        </div>
      );
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-400">You don't have permission to view this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
