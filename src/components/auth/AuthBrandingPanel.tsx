import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './AuthAnimations';

const AuthBrandingPanel: React.FC = () => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between bg-[#0F0F1A] p-8 overflow-hidden min-h-screen">
      {/* Animated gradient orbs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-80 h-80 rounded-full bg-indigo-500/20 blur-[80px] animate-[float_20s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-cyan-500/15 blur-[80px] animate-[float_25s_ease-in-out_infinite_reverse]"
        aria-hidden="true"
      />
      <div
        className="absolute top-[40%] left-[30%] w-64 h-64 rounded-full bg-purple-500/10 blur-[80px] animate-[float_18s_ease-in-out_5s_infinite]"
        aria-hidden="true"
      />

      {/* Logo */}
      <Link to="/" className="relative z-10 inline-flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
          <span className="text-white font-bold text-lg">SW</span>
        </div>
        <span className="text-white font-bold text-2xl">
          STEM<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Workforce</span>
        </span>
      </Link>

      {/* Hero text */}
      <div className="relative z-10 max-w-md">
        <h2 className="text-4xl font-bold text-white leading-tight">
          Building America's Technology Future
        </h2>
        <p className="text-lg text-gray-400 mt-4 leading-relaxed">
          Connect with opportunities across 10+ emerging technology sectors driving national security and economic growth.
        </p>
      </div>

      {/* Trust signals */}
      <motion.div
        className="relative z-10 flex flex-wrap gap-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={staggerItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          FedRAMP Ready
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          SOC 2 Type II
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400"
        >
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          50+ Federal Agencies
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthBrandingPanel;
