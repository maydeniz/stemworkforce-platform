import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Building2 } from 'lucide-react';
import AuthBrandingPanel from './AuthBrandingPanel';
import { pageTransition, pageTransitionConfig } from './AuthAnimations';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] lg:grid lg:grid-cols-2">
      {/* Skip link for accessibility */}
      <a href="#auth-form" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to form
      </a>

      {/* Left panel: Branding (desktop only) */}
      <AuthBrandingPanel />

      {/* Mobile header (shown only on small screens) */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 bg-[#0a0a0f] border-b border-white/10">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <span className="text-white font-bold text-lg">STEMWorkforce</span>
          </Link>
        </div>
        {/* Mobile trust badges */}
        <div className="flex items-center justify-center gap-4 px-4 py-2 bg-[#0a0a0f] border-b border-white/5">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] text-gray-500">FedRAMP Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] text-gray-500">SOC 2 Type II</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-purple-500" />
            <span className="text-[10px] text-gray-500">50+ Agencies</span>
          </div>
        </div>
      </div>

      {/* Right panel: Form */}
      <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh-89px)] lg:min-h-screen overflow-y-auto">
        <motion.div
          id="auth-form"
          className="w-full max-w-[480px]"
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransitionConfig}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
