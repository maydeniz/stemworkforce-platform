// ===========================================
// Demo Mode Context
// Enables investor demo with instant role-switching
// SECURITY: Passwords are NOT stored in frontend code.
// Authentication is handled server-side via the demo-login edge function.
// ===========================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface DemoContextType {
  isDemoMode: boolean;
  currentDemoRole: string | null;
  enterDemo: (role: string) => Promise<void>;
  switchRole: (role: string) => Promise<void>;
  exitDemo: () => Promise<void>;
  isLoading: boolean;
}

const DemoContext = createContext<DemoContextType>({
  isDemoMode: false,
  currentDemoRole: null,
  enterDemo: async () => {},
  switchRole: async () => {},
  exitDemo: async () => {},
  isLoading: false,
});

export const useDemo = () => useContext(DemoContext);

// Demo account roles and their dashboard routes
const DEMO_ACCOUNTS: Record<string, { label: string; route: string; icon: string; group: string }> = {
  high_school:        { label: 'High School Student', route: '/dashboard', icon: '🎓', group: 'Students' },
  college_student:    { label: 'College Student', route: '/dashboard', icon: '🎯', group: 'Students' },
  jobseeker:          { label: 'Job Seeker', route: '/dashboard', icon: '💼', group: 'Individuals' },
  employer:           { label: 'Employer', route: '/employer', icon: '🏗️', group: 'Organizations' },
  education_partner:  { label: 'Education Partner', route: '/education-partner', icon: '📚', group: 'Partners' },
  federal_agency:     { label: 'Federal Agency', route: '/government-partner', icon: '🏛️', group: 'Partners' },
  state_agency:       { label: 'State & Local Agency', route: '/dashboard', icon: '🗺️', group: 'Partners' },
  national_labs:      { label: 'National Laboratory', route: '/national-labs', icon: '⚛️', group: 'Partners' },
  industry_partner:   { label: 'Industry Partner', route: '/industry-partner', icon: '🏢', group: 'Partners' },
  nonprofit:          { label: 'Nonprofit Organization', route: '/nonprofit-partner', icon: '💚', group: 'Partners' },
  service_provider:   { label: 'Service Provider', route: '/provider', icon: '⭐', group: 'Organizations' },
  admin:              { label: 'Platform Admin', route: '/admin', icon: '🛡️', group: 'Admin' },
};

// Export for DemoBanner, DemoLandingPage, and DemoLoginPage
export const DEMO_ROLES = DEMO_ACCOUNTS;

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentDemoRole, setCurrentDemoRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginAsRole = useCallback(async (role: string): Promise<string> => {
    const account = DEMO_ACCOUNTS[role];
    if (!account) throw new Error(`Unknown demo role: ${role}`);
    const route = account.route;

    // Sign out first to clear any existing session
    await supabase.auth.signOut();

    // Call the demo-login edge function (password stays server-side)
    const { data: fnData, error: fnError } = await supabase.functions.invoke('demo-login', {
      body: { role },
    });

    if (fnError) {
      console.error('Demo login error:', fnError);
      throw new Error(fnError.message || 'Demo login failed');
    }

    if (fnData?.session) {
      // Set the session returned by the edge function
      await supabase.auth.setSession({
        access_token: fnData.session.access_token,
        refresh_token: fnData.session.refresh_token,
      });
    } else {
      throw new Error('No session returned from demo login');
    }

    return route;
  }, []);

  const enterDemo = useCallback(async (role: string) => {
    setIsLoading(true);
    try {
      const route = await loginAsRole(role);
      setIsDemoMode(true);
      setCurrentDemoRole(role);
      return route;
    } finally {
      setIsLoading(false);
    }
  }, [loginAsRole]);

  const switchRole = useCallback(async (role: string) => {
    setIsLoading(true);
    try {
      await loginAsRole(role);
      setCurrentDemoRole(role);
    } finally {
      setIsLoading(false);
    }
  }, [loginAsRole]);

  const exitDemo = useCallback(async () => {
    await supabase.auth.signOut();
    setIsDemoMode(false);
    setCurrentDemoRole(null);
  }, []);

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      currentDemoRole,
      enterDemo: enterDemo as any,
      switchRole,
      exitDemo,
      isLoading,
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export default DemoContext;
