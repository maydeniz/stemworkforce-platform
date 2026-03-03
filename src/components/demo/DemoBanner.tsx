// ===========================================
// Demo Mode Floating Banner
// Sticky bottom bar for role-switching during investor demos
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Atom,
  Building2,
  HandHeart,
  BookOpen,
  Rocket,
  Star,
  Calendar,
  X,
  ChevronUp,
  ChevronDown,
  Monitor,
} from 'lucide-react';
import { useDemo, DEMO_ROLES } from '@/contexts/DemoContext';

const ROLE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  employer: { icon: Briefcase, label: 'Employer', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  education_partner: { icon: GraduationCap, label: 'Education', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  national_labs: { icon: Atom, label: 'Nat\'l Labs', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  federal_agency: { icon: Building2, label: 'Federal', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  industry_nonprofit: { icon: HandHeart, label: 'Industry', color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  high_school: { icon: BookOpen, label: 'HS Student', color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  college_student: { icon: Rocket, label: 'College', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  service_provider: { icon: Star, label: 'Provider', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  event_organizer: { icon: Calendar, label: 'Events', color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
};

const DemoBanner: React.FC = () => {
  const { isDemoMode, currentDemoRole, switchRole, exitDemo, isLoading } = useDemo();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  if (!isDemoMode) return null;

  const currentConfig = currentDemoRole ? ROLE_CONFIG[currentDemoRole] : null;

  const handleSwitchRole = async (role: string) => {
    if (role === currentDemoRole || isLoading) return;
    try {
      await switchRole(role);
      const route = DEMO_ROLES[role]?.route;
      if (route) navigate(route);
      setExpanded(false);
    } catch (err) {
      console.error('Failed to switch role:', err);
    }
  };

  const handleExit = async () => {
    await exitDemo();
    navigate('/demo');
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Expanded role switcher */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700 px-4 py-3"
          >
            <div className="max-w-6xl mx-auto">
              <p className="text-gray-400 text-xs mb-2 font-medium uppercase tracking-wider">Switch Dashboard</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {Object.entries(ROLE_CONFIG).map(([role, config]) => {
                  const Icon = config.icon;
                  const isActive = role === currentDemoRole;
                  return (
                    <button
                      key={role}
                      onClick={() => handleSwitchRole(role)}
                      disabled={isLoading}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all ${
                        isActive
                          ? `${config.bgColor} ring-1 ring-white/20`
                          : 'hover:bg-gray-800'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {config.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main banner bar */}
      <div className="bg-gray-950/95 backdrop-blur-xl border-t border-gray-800 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left: Demo badge + current role */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-500/20 px-2.5 py-1 rounded-full">
              <Monitor className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Demo</span>
            </div>
            {currentConfig && (
              <div className="flex items-center gap-1.5">
                <currentConfig.icon className={`w-3.5 h-3.5 ${currentConfig.color}`} />
                <span className="text-white text-sm font-medium">{currentConfig.label} Dashboard</span>
              </div>
            )}
          </div>

          {/* Right: Expand/Collapse + Exit */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors text-sm text-gray-300"
            >
              Switch Role
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleExit}
              className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-colors text-sm text-red-400"
            >
              <X className="w-3.5 h-3.5" />
              Exit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DemoBanner;
