// ===========================================
// Demo Login Page
// Quick-access demo accounts for all user groups
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { DEMO_ROLES, useDemo } from '@/contexts/DemoContext';

const DemoLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { enterDemo, isLoading: demoLoading } = useDemo();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Group roles by category
  const groups: Record<string, Array<[string, typeof DEMO_ROLES[string]]>> = {};
  Object.entries(DEMO_ROLES).forEach(([key, val]) => {
    if (!groups[val.group]) groups[val.group] = [];
    groups[val.group].push([key, val]);
  });

  const handleDemoLogin = async (roleKey: string) => {
    setLoadingRole(roleKey);
    setError(null);
    try {
      await enterDemo(roleKey);
      const targetRoute = DEMO_ROLES[roleKey]?.route || '/dashboard';
      navigate(targetRoute);
    } catch (err) {
      setError(`Demo login failed. Please ensure demo accounts are configured. ${err instanceof Error ? err.message : ''}`);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Demo Accounts</h1>
              <p className="text-sm text-gray-400">Explore the platform as any user type</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            Demo Mode
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {Object.entries(groups).map(([groupName, roles]) => (
            <div key={groupName}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                {groupName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map(([key, role]) => {
                  const isCurrentLoading = loadingRole === key;
                  const isDisabled = demoLoading || loadingRole !== null;

                  return (
                    <motion.button
                      key={key}
                      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                      onClick={() => handleDemoLogin(key)}
                      disabled={isDisabled}
                      className={`
                        relative text-left p-4 rounded-xl border transition-all duration-200
                        ${isCurrentLoading
                          ? 'bg-indigo-500/10 border-indigo-500'
                          : 'bg-gray-900/50 border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900'
                        }
                        ${isDisabled && !isCurrentLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl" aria-hidden="true">{role.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{role.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {key === 'admin' ? 'Full platform access' :
                             key === 'employer' ? 'Post jobs, review applicants' :
                             key === 'high_school' ? 'College prep, career discovery' :
                             key === 'college_student' ? 'Internships, research, career launch' :
                             key === 'jobseeker' ? 'Job search, applications, AI tools' :
                             key === 'education_partner' ? 'Programs, analytics, outcomes' :
                             key === 'federal_agency' ? 'Workforce data, cleared talent' :
                             key === 'state_agency' ? 'Regional workforce analytics' :
                             key === 'national_labs' ? 'Research positions, Q clearance' :
                             key === 'industry_partner' ? 'Talent pipeline, job postings' :
                             key === 'nonprofit' ? 'Grants, community programs' :
                             key === 'service_provider' ? 'Coaching, resume services' :
                             'Explore this dashboard'}
                          </p>
                        </div>
                        {isCurrentLoading && (
                          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div className="mt-10 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">
            Demo accounts have pre-populated data and are read-only for real platform data.
            Sessions reset periodically. No real credentials are used.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoLoginPage;
