// ===========================================
// State Detail Slide-Out Panel Component
// ===========================================
// Inspired by Figma, VS Code - Full-height panel with tabbed navigation
// Features: Dense information display, smooth animations, responsive
// ===========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  BarChart3,
  Briefcase,
  GraduationCap,
  TrendingUp,
  MapPin,
  DollarSign,
  Target,
  Sparkles,
  ArrowRight,
  Building2,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-react';
import { AIMetricsTooltip } from './AIMetricsTooltip';
import {
  industryAIMetrics,
  getExposureLabel,
  getOpportunityLabel,
  getExposureColor,
  getOpportunityColor,
  getExposureBgColor,
  getOpportunityBgColor,
} from '@/data/aiMetrics';

// Types
interface IndustryData {
  growth: string;
  totalJobs: number;
  technicians: number;
  engineers: number;
  hubs: string[];
  salaries: { engineer: string; technician: string; operator: string };
  skills: string[];
  employers: { name: string; positions: number; growth: string }[];
  training: { name: string; type: string; duration: string; cost: string; placement: number }[];
  pathways: {
    level: string;
    roles: { title: string; salary: string; requirement: string }[];
  }[];
}

interface StateData {
  name: string;
  industries: Record<string, IndustryData>;
}

interface StateDetailPanelProps {
  stateCode: string;
  stateData: StateData;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  onClose: () => void;
  industryDefinitions: Record<string, { name: string; icon: string; color: string; bgColor: string }>;
}

// Map industry names to AI metrics codes
const industryToMetricsCode: Record<string, string> = {
  'Nuclear Energy': 'nuclear',
  'Semiconductor': 'semiconductor',
  'Healthcare': 'healthcare',
  'AI & Machine Learning': 'ai',
  'Quantum Technologies': 'quantum',
  'Cybersecurity': 'cybersecurity',
  'Aerospace & Defense': 'aerospace',
  'Biotechnology': 'biotech',
  'Robotics & Automation': 'robotics',
  'Clean Energy': 'clean-energy',
  'Advanced Manufacturing': 'manufacturing',
};

const getIndustryAIMetrics = (industry: string) => {
  const code = industryToMetricsCode[industry] || 'manufacturing';
  return industryAIMetrics[code] || industryAIMetrics['manufacturing'];
};

export const StateDetailPanel: React.FC<StateDetailPanelProps> = ({
  stateCode,
  stateData,
  selectedIndustry,
  onIndustryChange,
  onClose,
  industryDefinitions,
}) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'jobs' | 'training' | 'pathways'>('overview');
  const [isClosing, setIsClosing] = useState(false);

  const industryData = stateData.industries[selectedIndustry];
  const aiMetrics = getIndustryAIMetrics(selectedIndustry);
  const availableIndustries = Object.keys(stateData.industries);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Navigation handlers
  const handleFindJobs = (jobTitle?: string) => {
    const baseUrl = `/jobs?industry=${encodeURIComponent(selectedIndustry)}&state=${encodeURIComponent(stateData.name)}`;
    navigate(jobTitle ? `${baseUrl}&search=${encodeURIComponent(jobTitle)}` : baseUrl);
  };

  const handleViewEmployerJobs = (employer: string) => {
    navigate(`/jobs?company=${encodeURIComponent(employer)}`);
  };

  const handleFindTraining = () => {
    navigate(`/training?state=${stateCode}&industry=${encodeURIComponent(selectedIndustry.toLowerCase().replace(/\s+/g, '-').replace(/&/g, ''))}`);
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'pathways', label: 'Pathways', icon: TrendingUp },
  ] as const;

  if (!industryData) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className={`flex-1 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Slide-out Panel */}
      <div
        className={`w-full max-w-2xl bg-gray-950 border-l border-gray-800 flex flex-col transition-transform duration-300 ease-out ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ animation: isClosing ? undefined : 'slideInRight 0.3s ease-out' }}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b border-gray-800">
          {/* State Info */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-lg font-bold text-gray-900">
                  {stateCode}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{stateData.name}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400 font-medium">{industryData.growth}</span>
                    <span className="text-gray-500">growth</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Industry Selector Dropdown */}
            <select
              value={selectedIndustry}
              onChange={(e) => onIndustryChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-yellow-500 focus:outline-none cursor-pointer"
            >
              {availableIndustries.map(industry => {
                const def = industryDefinitions[industry] || { icon: '📊', name: industry };
                return (
                  <option key={industry} value={industry}>
                    {def.icon} {industry}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-t border-gray-800">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeSection === section.id
                    ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-500/5'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* OVERVIEW TAB */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-white">{industryData.totalJobs.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">Total Jobs</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-blue-400">{industryData.technicians.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">Technicians</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-purple-400">{industryData.engineers.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">Engineers</div>
                </div>
              </div>

              {/* AI Metrics Panel */}
              <div className="bg-gradient-to-br from-purple-900/20 to-transparent rounded-xl p-5 border border-purple-500/20">
                <h3 className="text-sm font-semibold text-purple-300 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Economy Impact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* AI Exposure */}
                  <div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <span>AI Exposure</span>
                      <AIMetricsTooltip type="exposure" value={aiMetrics.exposureIndex} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            aiMetrics.exposureIndex >= 70 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                            aiMetrics.exposureIndex >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            aiMetrics.exposureIndex >= 30 ? 'bg-gradient-to-r from-green-500 to-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${aiMetrics.exposureIndex}%` }}
                        />
                      </div>
                      <span className={`font-semibold text-sm ${getExposureColor(aiMetrics.exposureIndex)}`}>
                        {aiMetrics.exposureIndex}%
                      </span>
                    </div>
                    <div className={`text-xs mt-1 ${getExposureBgColor(aiMetrics.exposureIndex)} ${getExposureColor(aiMetrics.exposureIndex)} inline-block px-2 py-0.5 rounded`}>
                      {getExposureLabel(aiMetrics.exposureIndex)}
                    </div>
                  </div>

                  {/* AI Opportunity */}
                  <div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <span>AI Opportunity</span>
                      <AIMetricsTooltip type="opportunity" value={aiMetrics.opportunityIndex} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            aiMetrics.opportunityIndex >= 75 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' :
                            aiMetrics.opportunityIndex >= 55 ? 'bg-gradient-to-r from-blue-500 to-emerald-500' :
                            aiMetrics.opportunityIndex >= 35 ? 'bg-gradient-to-r from-yellow-500 to-blue-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${aiMetrics.opportunityIndex}%` }}
                        />
                      </div>
                      <span className={`font-semibold text-sm ${getOpportunityColor(aiMetrics.opportunityIndex)}`}>
                        {aiMetrics.opportunityIndex}%
                      </span>
                    </div>
                    <div className={`text-xs mt-1 ${getOpportunityBgColor(aiMetrics.opportunityIndex)} ${getOpportunityColor(aiMetrics.opportunityIndex)} inline-block px-2 py-0.5 rounded`}>
                      {getOpportunityLabel(aiMetrics.opportunityIndex)}
                    </div>
                  </div>
                </div>

                {/* Recommended AI Skills */}
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <span className="text-xs text-gray-400">Recommended AI Skills:</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {aiMetrics.recommendedAISkills.slice(0, 5).map((skill: string) => (
                      <span key={skill} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Salary by Role
                </h3>
                <div className="space-y-2">
                  {[
                    { role: 'Engineer', salary: industryData.salaries.engineer, level: 100, color: 'from-emerald-500 to-green-400' },
                    { role: 'Technician', salary: industryData.salaries.technician, level: 65, color: 'from-blue-500 to-cyan-400' },
                    { role: 'Entry Level', salary: industryData.salaries.operator, level: 40, color: 'from-purple-500 to-pink-400' },
                  ].map(item => (
                    <div key={item.role} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">{item.role}</span>
                        <span className="text-emerald-400 font-semibold">{item.salary}</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                          style={{ width: `${item.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employment Hubs */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  Employment Hubs
                </h3>
                <div className="flex flex-wrap gap-2">
                  {industryData.hubs.map((hub, idx) => (
                    <span
                      key={hub}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        idx === 0
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {hub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-yellow-400" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {industryData.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* JOBS TAB */}
          {activeSection === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Top Employers Hiring</h3>
                <span className="text-sm text-gray-400">{industryData.employers.length} companies</span>
              </div>

              {industryData.employers.map(emp => (
                <div
                  key={emp.name}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{emp.name}</h4>
                        <p className="text-sm text-gray-400">{emp.positions.toLocaleString()} open positions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-medium">{emp.growth}</span>
                      <p className="text-xs text-gray-500">growth</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewEmployerJobs(emp.name)}
                    className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-orange-500 group-hover:text-white"
                  >
                    View Jobs at {emp.name.split(' ')[0]}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TRAINING TAB */}
          {activeSection === 'training' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Training Programs</h3>
                <span className="text-sm text-gray-400">{industryData.training.length} programs</span>
              </div>

              {industryData.training.map(prog => (
                <div key={prog.name} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-white">{prog.name}</h4>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {prog.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">{prog.placement}%</span>
                      </div>
                      <div className="text-xs text-gray-500">placement</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {prog.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {prog.cost}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/training')}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PATHWAYS TAB */}
          {activeSection === 'pathways' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Career Pathways</h3>
              <div className="relative">
                {industryData.pathways.map((pathway, idx) => (
                  <div key={pathway.level} className="relative pb-6">
                    {/* Connector line */}
                    {idx < industryData.pathways.length - 1 && (
                      <div className="absolute left-4 top-10 w-0.5 h-full bg-gradient-to-b from-yellow-500/50 to-transparent" />
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/30' :
                        idx === 1 ? 'bg-purple-500/20 text-purple-400 ring-2 ring-purple-500/30' :
                        idx === 2 ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/30' :
                        'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-sm font-semibold text-yellow-400">{pathway.level}</span>
                    </div>

                    <div className="ml-11 space-y-2">
                      {pathway.roles.map(role => (
                        <div
                          key={role.title}
                          className="bg-gray-900 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                          onClick={() => handleFindJobs(role.title)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white">{role.title}</div>
                              <div className="text-xs text-gray-500">{role.requirement}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400 font-semibold text-sm">{role.salary}</span>
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Bar */}
        <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-950">
          <div className="flex gap-3">
            <button
              onClick={() => handleFindJobs()}
              className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Browse {industryData.totalJobs.toLocaleString()} Jobs
            </button>
            <button
              onClick={handleFindTraining}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Find Training
            </button>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StateDetailPanel;
