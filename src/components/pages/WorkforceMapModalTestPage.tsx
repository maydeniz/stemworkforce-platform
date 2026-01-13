// ===========================================
// Workforce Map Modal Test Page
// ===========================================
// Test page showcasing redesigned state detail modal concepts
// Based on modern UX best practices from leading design systems
// ===========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, MapPin, TrendingUp, DollarSign, Briefcase,
  GraduationCap, ChevronRight, Building2, Target,
  ArrowRight, Sparkles, BarChart3, Award
} from 'lucide-react';

// Mock data for testing
const mockStateData = {
  name: 'California',
  abbreviation: 'CA',
  industries: {
    'AI & Machine Learning': {
      growth: '+52%',
      totalJobs: 63000,
      technicians: 22050,
      engineers: 15750,
      hubs: ['San Francisco', 'Palo Alto', 'Mountain View', 'Los Angeles'],
      salaries: { engineer: '$250K', technician: '$150K', operator: '$88K' },
      skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'Python/TensorFlow'],
      employers: [
        { name: 'Google AI', positions: 2500, growth: '+18%' },
        { name: 'Meta AI Research', positions: 1800, growth: '+22%' },
        { name: 'OpenAI West', positions: 950, growth: '+45%' },
      ],
      training: [
        { name: 'Stanford AI Program', type: 'University', duration: '4 years', cost: '$65,000', placement: 98 },
        { name: 'UC Berkeley ML Certificate', type: 'University', duration: '1 year', cost: '$25,000', placement: 94 },
      ],
      pathways: [
        { level: 'Entry Level', roles: [
          { title: 'ML Data Annotator', salary: '$69K-$88K', requirement: "Bachelor's" },
          { title: 'AI Research Assistant', salary: '$81K-$106K', requirement: "Bachelor's CS" }
        ]},
        { level: 'Mid Level', roles: [
          { title: 'MLOps Engineer', salary: '$150K-$188K', requirement: "Bachelor's + 2yr" },
          { title: 'Data Engineer', salary: '$163K-$200K', requirement: "Bachelor's + 2yr" }
        ]},
        { level: 'Senior', roles: [
          { title: 'ML Engineer', salary: '$206K-$263K', requirement: "Master's + 2yr" }
        ]},
        { level: 'Principal', roles: [
          { title: 'AI Research Scientist', salary: '$250K-$375K', requirement: "PhD + Publications" }
        ]}
      ]
    }
  }
};

const mockAIMetrics = {
  exposureIndex: 78,
  opportunityIndex: 92,
  recommendedAISkills: ['Prompt Engineering', 'LLM Fine-tuning', 'MLOps', 'AI Ethics']
};

const industryDefinitions: Record<string, { name: string; icon: string; color: string; bgColor: string }> = {
  'Nuclear Energy': { name: 'Nuclear', icon: '⚛️', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  'Semiconductor': { name: 'Semiconductor', icon: '🔬', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  'Healthcare': { name: 'Healthcare', icon: '🏥', color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  'AI & Machine Learning': { name: 'AI & ML', icon: '🤖', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  'Quantum Technologies': { name: 'Quantum', icon: '💎', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  'Aerospace & Defense': { name: 'Aerospace', icon: '🚀', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  'Clean Energy': { name: 'Clean Energy', icon: '🌱', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  'Cybersecurity': { name: 'Cybersecurity', icon: '🔒', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  'Biotechnology': { name: 'Biotech', icon: '🧬', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  'Robotics & Automation': { name: 'Robotics', icon: '🦾', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  'Advanced Manufacturing': { name: 'Manufacturing', icon: '🏭', color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
};

// ===========================================
// DESIGN CONCEPT 1: Card-Based Dashboard
// ===========================================
// Inspiration: Linear, Notion, modern SaaS dashboards
// Key features: Bento grid layout, visual hierarchy, scannable metrics
const DesignConcept1: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('AI & Machine Learning');
  const data = mockStateData.industries['AI & Machine Learning'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-800 shadow-2xl">
        {/* Compact Header with State + Industry Selector */}
        <div className="bg-gradient-to-r from-purple-900/30 via-gray-900 to-gray-900 p-6 border-b border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl font-bold">
                CA
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{mockStateData.name}</h2>
                <p className="text-gray-400 text-sm">STEM Workforce Overview</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Horizontal Industry Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {Object.keys(industryDefinitions).map(industry => {
              const def = industryDefinitions[industry];
              const isSelected = selectedIndustry === industry;
              return (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{def.icon}</span>
                  <span>{def.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-12 gap-4">
            {/* Main Stats - Large Card */}
            <div className="col-span-12 md:col-span-8 bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Market Overview
                </h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                  {data.growth} YoY
                </span>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{data.totalJobs.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Jobs</div>
                  <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-full" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-1">{data.technicians.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Technicians</div>
                  <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[35%]" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400 mb-1">{data.engineers.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Engineers</div>
                  <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[25%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Impact Score - Side Card */}
            <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-sm font-medium text-purple-300 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Impact Score
              </h3>
              <div className="flex items-end gap-4 mb-4">
                <div className="text-5xl font-bold text-white">{mockAIMetrics.opportunityIndex}</div>
                <div className="text-gray-400 text-sm pb-2">/ 100</div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Exposure</span>
                    <span className="text-orange-400">{mockAIMetrics.exposureIndex}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${mockAIMetrics.exposureIndex}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Opportunity</span>
                    <span className="text-emerald-400">{mockAIMetrics.opportunityIndex}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${mockAIMetrics.opportunityIndex}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Range Card */}
            <div className="col-span-12 md:col-span-4 bg-gray-900/50 rounded-2xl p-5 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Salary Ranges
              </h3>
              <div className="space-y-3">
                {[
                  { role: 'Engineer', salary: data.salaries.engineer, color: 'emerald' },
                  { role: 'Technician', salary: data.salaries.technician, color: 'blue' },
                  { role: 'Operator', salary: data.salaries.operator, color: 'purple' },
                ].map(item => (
                  <div key={item.role} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <span className="text-gray-300">{item.role}</span>
                    <span className={`text-${item.color}-400 font-semibold`}>{item.salary}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment Hubs */}
            <div className="col-span-12 md:col-span-4 bg-gray-900/50 rounded-2xl p-5 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" />
                Top Hubs
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.hubs.map(hub => (
                  <span key={hub} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm">
                    {hub}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Employers */}
            <div className="col-span-12 md:col-span-4 bg-gray-900/50 rounded-2xl p-5 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                Top Employers
              </h3>
              <div className="space-y-2">
                {data.employers.slice(0, 3).map(emp => (
                  <div key={emp.name} className="flex items-center justify-between py-2">
                    <span className="text-gray-300 text-sm">{emp.name}</span>
                    <span className="text-green-400 text-xs font-medium">{emp.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Cloud - Full Width */}
            <div className="col-span-12 bg-gray-900/50 rounded-2xl p-5 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-yellow-400" />
                In-Demand Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={skill}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      idx < 3
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Career Pathway - Full Width */}
            <div className="col-span-12 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Career Progression Path
              </h3>
              <div className="flex items-center gap-4 overflow-x-auto pb-4">
                {data.pathways.map((pathway, idx) => (
                  <React.Fragment key={pathway.level}>
                    <div className="flex-shrink-0 w-64 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="text-xs text-gray-400 mb-2">{pathway.level}</div>
                      {pathway.roles.map(role => (
                        <div key={role.title} className="mb-3 last:mb-0">
                          <div className="font-medium text-white text-sm">{role.title}</div>
                          <div className="text-emerald-400 text-sm font-semibold">{role.salary}</div>
                          <div className="text-xs text-gray-500">{role.requirement}</div>
                        </div>
                      ))}
                    </div>
                    {idx < data.pathways.length - 1 && (
                      <ChevronRight className="w-6 h-6 text-gray-600 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-4 mt-6">
            <button className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" />
              Browse {data.totalJobs.toLocaleString()} Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Find Training Programs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// DESIGN CONCEPT 2: Slide-Out Panel
// ===========================================
// Inspiration: Figma, VS Code, modern IDEs
// Key features: Full height, tab navigation, dense information
const DesignConcept2: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'jobs' | 'training' | 'pathways'>('overview');
  const [selectedIndustry, setSelectedIndustry] = useState('AI & Machine Learning');
  const data = mockStateData.industries['AI & Machine Learning'];

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'pathways', label: 'Pathways', icon: TrendingUp },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-out Panel */}
      <div className="w-full max-w-2xl bg-gray-950 border-l border-gray-800 flex flex-col animate-slide-in-right">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b border-gray-800">
          {/* State Info */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                  CA
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{mockStateData.name}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400 font-medium">{data.growth}</span>
                    <span className="text-gray-500">growth</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Industry Dropdown */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            >
              {Object.keys(industryDefinitions).map(industry => (
                <option key={industry} value={industry}>
                  {industryDefinitions[industry].icon} {industry}
                </option>
              ))}
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
                    ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
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
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-white">{data.totalJobs.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">Total Jobs</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-blue-400">{data.technicians.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">Technicians</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-purple-400">{data.engineers.toLocaleString()}</div>
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
                  <div>
                    <div className="text-xs text-gray-400 mb-1">AI Exposure</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                          style={{ width: `${mockAIMetrics.exposureIndex}%` }}
                        />
                      </div>
                      <span className="text-orange-400 font-semibold text-sm">{mockAIMetrics.exposureIndex}%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">High transformation expected</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">AI Opportunity</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                          style={{ width: `${mockAIMetrics.opportunityIndex}%` }}
                        />
                      </div>
                      <span className="text-emerald-400 font-semibold text-sm">{mockAIMetrics.opportunityIndex}%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Exceptional growth potential</div>
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
                    { role: 'Senior Engineer', salary: data.salaries.engineer, level: 100 },
                    { role: 'Technician', salary: data.salaries.technician, level: 60 },
                    { role: 'Entry Level', salary: data.salaries.operator, level: 35 },
                  ].map(item => (
                    <div key={item.role} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">{item.role}</span>
                        <span className="text-emerald-400 font-semibold">{item.salary}</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
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
                  {data.hubs.map((hub, idx) => (
                    <span
                      key={hub}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        idx === 0
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {hub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-yellow-400" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'jobs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Top Employers Hiring</h3>
              {data.employers.map(emp => (
                <div key={emp.name} className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{emp.name}</h4>
                      <p className="text-sm text-gray-400">{emp.positions.toLocaleString()} open positions</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-medium">{emp.growth}</span>
                      <p className="text-xs text-gray-500">growth</p>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                View All Jobs
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeSection === 'training' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Training Programs</h3>
              {data.training.map(prog => (
                <div key={prog.name} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-white">{prog.name}</h4>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {prog.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-semibold">{prog.placement}%</div>
                      <div className="text-xs text-gray-500">placement</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>{prog.duration}</span>
                    <span>{prog.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'pathways' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Career Pathways</h3>
              <div className="space-y-3">
                {data.pathways.map((pathway, idx) => (
                  <div key={pathway.level} className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-blue-500/20 text-blue-400' :
                        idx === 1 ? 'bg-purple-500/20 text-purple-400' :
                        idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-400">{pathway.level}</span>
                    </div>
                    <div className="ml-11 space-y-2">
                      {pathway.roles.map(role => (
                        <div key={role.title} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white">{role.title}</div>
                              <div className="text-xs text-gray-500">{role.requirement}</div>
                            </div>
                            <div className="text-emerald-400 font-semibold text-sm">{role.salary}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {idx < data.pathways.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-800" style={{ height: 'calc(100% - 40px)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Bar */}
        <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-950">
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <Briefcase className="w-4 h-4" />
              Browse Jobs
            </button>
            <button className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Find Training
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// DESIGN CONCEPT 3: Compact Card with Expandable Sections
// ===========================================
// Inspiration: Apple, Stripe, modern mobile apps
// Key features: Minimalist, progressive disclosure, smooth animations
const DesignConcept3: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('stats');
  const [selectedIndustry, setSelectedIndustry] = useState('AI & Machine Learning');
  const data = mockStateData.industries['AI & Machine Learning'];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-800">
        {/* Minimal Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{mockStateData.name}</h2>
              <p className="text-gray-400 text-sm">Workforce Intelligence</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Industry Chips - Scrollable Row */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {Object.entries(industryDefinitions).slice(0, 6).map(([industry, def]) => {
              const isSelected = selectedIndustry === industry;
              return (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <span>{def.icon}</span>
                  <span>{def.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 pb-6">
          {/* Hero Stats */}
          <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-2xl p-5 mb-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-white">{data.totalJobs.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Jobs</div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                  {data.growth}
                </span>
                <div className="text-xs text-gray-500 mt-1">YoY Growth</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 text-center py-2 bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-blue-400">{data.technicians.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Technicians</div>
              </div>
              <div className="flex-1 text-center py-2 bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-purple-400">{data.engineers.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Engineers</div>
              </div>
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-2">
            {/* AI Impact Section */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleSection('ai')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  AI Economy Impact
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold text-sm">{mockAIMetrics.opportunityIndex}/100</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'ai' ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {expandedSection === 'ai' && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Exposure Risk</span>
                      <span className="text-orange-400">{mockAIMetrics.exposureIndex}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${mockAIMetrics.exposureIndex}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Opportunity Score</span>
                      <span className="text-emerald-400">{mockAIMetrics.opportunityIndex}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${mockAIMetrics.opportunityIndex}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Salaries Section */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleSection('salary')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Salary Ranges
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold text-sm">{data.salaries.engineer}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'salary' ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {expandedSection === 'salary' && (
                <div className="px-4 pb-4 space-y-2">
                  {[
                    { role: 'Engineer', salary: data.salaries.engineer },
                    { role: 'Technician', salary: data.salaries.technician },
                    { role: 'Operator', salary: data.salaries.operator },
                  ].map(item => (
                    <div key={item.role} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <span className="text-gray-300 text-sm">{item.role}</span>
                      <span className="text-emerald-400 font-medium">{item.salary}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Locations Section */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleSection('hubs')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  <MapPin className="w-4 h-4 text-red-400" />
                  Employment Hubs
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{data.hubs.length} cities</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'hubs' ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {expandedSection === 'hubs' && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {data.hubs.map(hub => (
                      <span key={hub} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm">
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleSection('skills')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  <Target className="w-4 h-4 text-yellow-400" />
                  Required Skills
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{data.skills.length} skills</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'skills' ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {expandedSection === 'skills' && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Employers Section */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleSection('employers')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  Top Employers
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{data.employers.length} companies</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'employers' ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {expandedSection === 'employers' && (
                <div className="px-4 pb-4 space-y-2">
                  {data.employers.map(emp => (
                    <div key={emp.name} className="flex items-center justify-between py-2">
                      <div>
                        <div className="text-gray-300 text-sm font-medium">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.positions.toLocaleString()} positions</div>
                      </div>
                      <span className="text-green-400 text-sm font-medium">{emp.growth}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
            Explore {data.totalJobs.toLocaleString()} Jobs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Main Test Page Component
// ===========================================
const WorkforceMapModalTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<1 | 2 | 3 | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/workforce-map')}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Workforce Map
          </button>
          <h1 className="text-4xl font-bold text-white mb-4">
            State Modal <span className="text-purple-400">Redesign Concepts</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Three design concepts for the state details modal, each optimized for different use cases and user preferences.
          </p>
        </div>

        {/* Design Concept Cards */}
        <div className="space-y-6">
          {/* Concept 1 */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 hover:border-purple-500/50 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium mb-3">
                  CONCEPT 1
                </span>
                <h2 className="text-2xl font-bold text-white mb-2">Bento Grid Dashboard</h2>
                <p className="text-gray-400 max-w-lg">
                  Inspired by Linear and Notion. Uses a bento grid layout with visual hierarchy,
                  scannable metrics, and a modern card-based approach. Best for users who want
                  to see everything at a glance.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Bento Grid</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">AI Metrics Panel</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Career Path Timeline</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Horizontal Industry Pills</span>
            </div>
            <button
              onClick={() => setActiveModal(1)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              Preview Concept 1
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Concept 2 */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 hover:border-blue-500/50 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium mb-3">
                  CONCEPT 2
                </span>
                <h2 className="text-2xl font-bold text-white mb-2">Slide-Out Panel</h2>
                <p className="text-gray-400 max-w-lg">
                  Inspired by Figma and VS Code. A full-height slide-out panel with tabbed navigation
                  for dense information. Best for users who prefer focused, sequential exploration
                  without losing map context.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Full Height Panel</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Tab Navigation</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Dropdown Industry Selector</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Sticky Action Bar</span>
            </div>
            <button
              onClick={() => setActiveModal(2)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              Preview Concept 2
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Concept 3 */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 hover:border-emerald-500/50 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium mb-3">
                  CONCEPT 3
                </span>
                <h2 className="text-2xl font-bold text-white mb-2">Compact Accordion</h2>
                <p className="text-gray-400 max-w-lg">
                  Inspired by Apple and Stripe. A minimalist, mobile-friendly design with progressive
                  disclosure through expandable sections. Best for mobile users and those who prefer
                  focused, drill-down exploration.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Compact Modal</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Expandable Sections</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Progressive Disclosure</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Mobile Optimized</span>
            </div>
            <button
              onClick={() => setActiveModal(3)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              Preview Concept 3
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Design Principles */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            UX Design Principles Applied
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Visual Hierarchy</h3>
              <p className="text-gray-400 text-sm">Key metrics (jobs, growth, salaries) are prominently displayed with clear typography scales.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Progressive Disclosure</h3>
              <p className="text-gray-400 text-sm">Complex information is layered - overview first, details on demand.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Scannable Content</h3>
              <p className="text-gray-400 text-sm">Cards, badges, and color coding help users quickly find relevant information.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Clear Actions</h3>
              <p className="text-gray-400 text-sm">Primary CTAs (Browse Jobs, Find Training) are always visible and prominent.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 1 && <DesignConcept1 onClose={() => setActiveModal(null)} />}
      {activeModal === 2 && <DesignConcept2 onClose={() => setActiveModal(null)} />}
      {activeModal === 3 && <DesignConcept3 onClose={() => setActiveModal(null)} />}

      {/* CSS for animations */}
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default WorkforceMapModalTestPage;
