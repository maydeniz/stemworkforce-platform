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

// Demo account routes (public info only — NO passwords)
const DEMO_ROUTES: Record<string, string> = {
  employer: '/employer',
  education_partner: '/education-partner',
  national_labs: '/national-labs',
  federal_agency: '/government-partner',
  industry_nonprofit: '/industry-partner',
  high_school: '/student/high-school',
  college_student: '/student/college',
  service_provider: '/provider',
  event_organizer: '/event-organizer',
};

// Export for DemoBanner and DemoLandingPage
export const DEMO_ROLES = Object.fromEntries(
  Object.entries(DEMO_ROUTES).map(([key, route]) => [key, { route }])
);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentDemoRole, setCurrentDemoRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginAsRole = useCallback(async (role: string): Promise<string> => {
    const route = DEMO_ROUTES[role];
    if (!route) throw new Error(`Unknown demo role: ${role}`);

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
