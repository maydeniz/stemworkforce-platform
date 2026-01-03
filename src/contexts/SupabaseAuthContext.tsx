// ===========================================
// Supabase Authentication Context
// ===========================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Simple user profile type
interface UserProfile {
  id: string;
  auth_id: string | null;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  avatar: string | null;
  phone: string | null;
  role: 'intern' | 'jobseeker' | 'educator' | 'partner' | 'admin';
  organization: string | null;
  organization_id: string | null;
  clearance_level: string;
  bio: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  skills: string[] | null;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  hasPermission: (action: 'apply' | 'post' | 'manage_users') => boolean;
  canViewPage: (page: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// RBAC Configuration
const RBAC_CONFIG: Record<string, { canView: string[]; canApply: boolean; canPost: boolean; canManage: boolean }> = {
  intern: { canView: ['home', 'jobs', 'events', 'training', 'dashboard'], canApply: true, canPost: false, canManage: false },
  jobseeker: { canView: ['home', 'jobs', 'map', 'events', 'training', 'dashboard'], canApply: true, canPost: false, canManage: false },
  educator: { canView: ['*'], canApply: false, canPost: true, canManage: true },
  partner: { canView: ['*'], canApply: false, canPost: true, canManage: true },
  admin: { canView: ['*'], canApply: true, canPost: true, canManage: true },
};

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data as UserProfile);
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign up with email/password
  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string }
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // OAuth providers
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('auth_id', user.id);

      if (!error && profile) {
        const updatedProfile = { ...profile };
        Object.assign(updatedProfile, updates);
        setProfile(updatedProfile);
      }

      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Permission helpers
  const hasPermission = useCallback(
    (action: 'apply' | 'post' | 'manage_users'): boolean => {
      const role = profile?.role || 'jobseeker';
      const config = RBAC_CONFIG[role];
      if (!config) return false;

      switch (action) {
        case 'apply':
          return config.canApply;
        case 'post':
          return config.canPost;
        case 'manage_users':
          return config.canManage;
        default:
          return false;
      }
    },
    [profile]
  );

  const canViewPage = useCallback(
    (page: string): boolean => {
      const role = profile?.role || 'jobseeker';
      const config = RBAC_CONFIG[role];
      if (!config) return page === 'home';
      return config.canView.includes('*') || config.canView.includes(page);
    },
    [profile]
  );

  const value: AuthContextType = {
    user,
    session,
    profile,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    updateProfile,
    hasPermission,
    canViewPage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useSupabaseAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export default SupabaseAuthProvider;
