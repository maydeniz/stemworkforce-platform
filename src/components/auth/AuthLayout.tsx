import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthBrandingPanel from './AuthBrandingPanel';
import { pageTransition, pageTransitionConfig } from './AuthAnimations';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] lg:grid lg:grid-cols-2">
      {/* Left panel: Branding (desktop only) */}
      <AuthBrandingPanel />

      {/* Mobile header (shown only on small screens) */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-4 bg-[#0a0a0f] border-b border-white/5">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SW</span>
          </div>
          <span className="text-white font-bold text-lg">STEMWorkforce</span>
        </Link>
      </div>

      {/* Right panel: Form */}
      <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh-57px)] lg:min-h-screen overflow-y-auto">
        <motion.div
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
