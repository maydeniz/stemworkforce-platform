// ===========================================
// Authentication Context - Supabase Integration
// ===========================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: string, organizationName?: string) => Promise<{ success: boolean; error?: string; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithGithub: () => Promise<{ success: boolean; error?: string }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  hasPermission: (action: 'apply' | 'post' | 'manage_users') => boolean;
  canViewPage: (page: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - auth will not work');
      setIsLoading(false);
      return;
    }

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
        }

        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (import.meta.env.DEV) console.log('Auth state change:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign up with email/password
  const signUp = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string = 'jobseeker',
    organizationName?: string
  ) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
            organization_name: organizationName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message, needsEmailConfirmation: false };
      }

      // Check if email confirmation is required (user exists but no session)
      if (data.user && !data.session) {
        return { success: true, needsEmailConfirmation: true };
      }

      // Session created - user is signed in
      return { success: true, needsEmailConfirmation: false };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred', needsEmailConfirmation: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  // OAuth: Google
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to sign in with Google' };
    }
  }, []);

  // OAuth: GitHub
  const signInWithGithub = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to sign in with GitHub' };
    }
  }, []);

  // OAuth: Apple
  const signInWithApple = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to sign in with Apple' };
    }
  }, []);

  // Permission helpers - SECURITY: Proper role-based access control
  const hasPermission = useCallback((action: 'apply' | 'post' | 'manage_users'): boolean => {
    if (!user) return false;

    // Get user role from database (NOT from user_metadata - that's spoofable)
    // For now, we check the app_metadata which is server-controlled
    const userRole = (user as any).app_metadata?.role || 'jobseeker';

    switch (action) {
      case 'apply':
        // All authenticated users can apply for jobs
        return true;
      case 'post':
        // Only employers, partners, and admins can post jobs
        return ['employer', 'partner', 'admin', 'super_admin'].includes(userRole);
      case 'manage_users':
        // Only admins can manage users
        return ['admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN'].includes(userRole);
      default:
        return false;
    }
  }, [user]);

  const canViewPage = useCallback((page: string): boolean => {
    if (!user) return false;

    // Get user role from app_metadata (server-controlled, not spoofable)
    const userRole = (user as any).app_metadata?.role || 'jobseeker';

    // Define page access by role
    const adminPages = ['/admin', '/admin/billing', '/admin/users', '/admin/settings'];
    const providerPages = ['/provider'];
    const employerPages = ['/employer', '/post-job'];

    // Check admin pages
    if (adminPages.some(p => page.startsWith(p))) {
      return ['admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'BILLING_ADMIN', 'CONTENT_ADMIN'].includes(userRole);
    }

    // Check provider pages
    if (providerPages.some(p => page.startsWith(p))) {
      return ['service_provider', 'admin', 'super_admin'].includes(userRole);
    }

    // Check employer pages
    if (employerPages.some(p => page.startsWith(p))) {
      return ['employer', 'partner', 'admin', 'super_admin'].includes(userRole);
    }

    // Public pages accessible to all authenticated users
    return true;
  }, [user]);

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
    signInWithGithub,
    signInWithApple,
    hasPermission,
    canViewPage,
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

export default AuthProvider;
