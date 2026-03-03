// ===========================================
// Workforce Map Widget - Embeddable Component
// For Industry Partners and Talent Pages
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  TrendingUp,
  Building2,
  GraduationCap,
  ChevronRight,
  ExternalLink,
  Filter
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

export interface StateData {
  name: string;
  abbreviation: string;
  talentPool: number;
  avgSalary: number;
  topSkills: string[];
  growthRate: number;
  universities: number;
  employers: number;
}

export interface WorkforceMapWidgetProps {
  variant?: 'full' | 'compact' | 'mini';
  industryFilter?: string;
  showFilters?: boolean;
  onStateSelect?: (state: StateData) => void;
  className?: string;
}

// ===========================================
// SAMPLE STATE DATA
// ===========================================

const STATE_DATA: StateData[] = [
  { name: 'California', abbreviation: 'CA', talentPool: 45230, avgSalary: 145000, topSkills: ['AI/ML', 'Semiconductor', 'Quantum'], growthRate: 12.5, universities: 234, employers: 1890 },
  { name: 'Texas', abbreviation: 'TX', talentPool: 38450, avgSalary: 115000, topSkills: ['Semiconductor', 'Aerospace', 'Clean Energy'], growthRate: 18.2, universities: 189, employers: 1456 },
  { name: 'Arizona', abbreviation: 'AZ', talentPool: 28900, avgSalary: 110000, topSkills: ['Semiconductor', 'Aerospace', 'Manufacturing'], growthRate: 24.5, universities: 45, employers: 567 },
  { name: 'New York', abbreviation: 'NY', talentPool: 35670, avgSalary: 130000, topSkills: ['AI/ML', 'Quantum', 'Biotech'], growthRate: 8.9, universities: 245, employers: 2134 },
  { name: 'Washington', abbreviation: 'WA', talentPool: 28900, avgSalary: 140000, topSkills: ['AI/ML', 'Quantum', 'Cybersecurity'], growthRate: 15.4, universities: 89, employers: 892 },
  { name: 'Massachusetts', abbreviation: 'MA', talentPool: 24560, avgSalary: 135000, topSkills: ['Biotech', 'Quantum', 'Robotics'], growthRate: 11.2, universities: 156, employers: 678 },
  { name: 'Florida', abbreviation: 'FL', talentPool: 22340, avgSalary: 105000, topSkills: ['Aerospace', 'Cybersecurity', 'Healthcare'], growthRate: 22.1, universities: 134, employers: 945 },
  { name: 'Tennessee', abbreviation: 'TN', talentPool: 18500, avgSalary: 95000, topSkills: ['Nuclear', 'Manufacturing', 'Healthcare'], growthRate: 19.3, universities: 78, employers: 445 },
  { name: 'New Mexico', abbreviation: 'NM', talentPool: 12450, avgSalary: 105000, topSkills: ['Nuclear', 'Aerospace', 'Quantum'], growthRate: 16.8, universities: 34, employers: 234 },
  { name: 'Colorado', abbreviation: 'CO', talentPool: 18450, avgSalary: 120000, topSkills: ['Aerospace', 'Cybersecurity', 'AI/ML'], growthRate: 14.3, universities: 67, employers: 456 },
  { name: 'Virginia', abbreviation: 'VA', talentPool: 16780, avgSalary: 125000, topSkills: ['Cybersecurity', 'Aerospace', 'AI/ML'], growthRate: 13.6, universities: 112, employers: 634 },
  { name: 'Maryland', abbreviation: 'MD', talentPool: 15890, avgSalary: 128000, topSkills: ['Cybersecurity', 'Biotech', 'Quantum'], growthRate: 11.5, universities: 89, employers: 523 },
  { name: 'Idaho', abbreviation: 'ID', talentPool: 8450, avgSalary: 92000, topSkills: ['Nuclear', 'Semiconductor', 'Clean Energy'], growthRate: 21.4, universities: 23, employers: 178 },
  { name: 'Oregon', abbreviation: 'OR', talentPool: 14230, avgSalary: 115000, topSkills: ['Semiconductor', 'Clean Energy', 'Robotics'], growthRate: 13.8, universities: 45, employers: 345 },
  { name: 'North Carolina', abbreviation: 'NC', talentPool: 17890, avgSalary: 108000, topSkills: ['Biotech', 'Manufacturing', 'Healthcare'], growthRate: 15.2, universities: 134, employers: 567 },
];

const INDUSTRY_FILTERS = [
  { id: 'all', label: 'All Industries', icon: '🌐' },
  { id: 'semiconductor', label: 'Semiconductor', icon: '💎' },
  { id: 'nuclear', label: 'Nuclear Energy', icon: '☢️' },
  { id: 'ai', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'quantum', label: 'Quantum Technologies', icon: '⚛️' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: '🛡️' },
  { id: 'aerospace', label: 'Aerospace & Defense', icon: '🚀' },
  { id: 'biotech', label: 'Biotechnology', icon: '🧬' },
  { id: 'healthcare', label: 'Healthcare & Medical Tech', icon: '🏥' },
  { id: 'robotics', label: 'Robotics & Automation', icon: '🦾' },
  { id: 'clean_energy', label: 'Clean Energy', icon: '⚡' },
  { id: 'manufacturing', label: 'Advanced Manufacturing', icon: '🏭' },
];

// ===========================================
// MINI WIDGET (For embedding in cards/tabs)
// ===========================================

const MiniWidget: React.FC<WorkforceMapWidgetProps> = ({ onStateSelect, className }) => {
  const topStates = STATE_DATA.slice(0, 5);
  const totalTalent = STATE_DATA.reduce((sum, s) => sum + s.talentPool, 0);

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white">Talent Distribution</h3>
        </div>
        <Link to="/workforce-map" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
          Full Map <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="text-2xl font-bold text-white mb-1">
        {totalTalent.toLocaleString()}+
      </div>
      <p className="text-sm text-gray-400 mb-4">STEM professionals across 50 states</p>

      <div className="space-y-2">
        {topStates.map((state, idx) => (
          <button
            key={state.abbreviation}
            onClick={() => onStateSelect?.(state)}
            className="w-full flex items-center justify-between p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-400 text-xs font-bold">
                {idx + 1}
              </span>
              <span className="text-white font-medium">{state.abbreviation}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{state.talentPool.toLocaleString()}</span>
              <span className="text-xs text-emerald-400">+{state.growthRate}%</span>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ===========================================
// COMPACT WIDGET (For sidebar/overview)
// ===========================================

const CompactWidget: React.FC<WorkforceMapWidgetProps> = ({ industryFilter, onStateSelect, className }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(industryFilter || 'all');
  const topStates = STATE_DATA.slice(0, 6);

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden ${className || ''}`}>
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">STEM Talent Map</h3>
              <p className="text-sm text-gray-400">Talent by region</p>
            </div>
          </div>
          <Link to="/workforce-map">
            <button className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1">
              Explore <ExternalLink className="w-3 h-3" />
            </button>
          </Link>
        </div>

        {/* Industry Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {INDUSTRY_FILTERS.slice(0, 4).map((industry) => (
            <button
              key={industry.id}
              onClick={() => setSelectedIndustry(industry.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedIndustry === industry.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {industry.label}
            </button>
          ))}
        </div>
      </div>

      {/* State Grid */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {topStates.map((state) => (
            <motion.button
              key={state.abbreviation}
              whileHover={{ scale: 1.02 }}
              onClick={() => onStateSelect?.(state)}
              className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">{state.abbreviation}</span>
                <span className="text-xs text-emerald-400">+{state.growthRate}%</span>
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {(state.talentPool / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-500">{state.topSkills[0]}</div>
            </motion.button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-800">
          <div className="text-center">
            <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">268K+</div>
            <div className="text-xs text-gray-500">Professionals</div>
          </div>
          <div className="text-center">
            <Building2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">1,400+</div>
            <div className="text-xs text-gray-500">Employers</div>
          </div>
          <div className="text-center">
            <GraduationCap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">1,200+</div>
            <div className="text-xs text-gray-500">Universities</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// FULL WIDGET (For dedicated tab/section)
// ===========================================

const FullWidget: React.FC<WorkforceMapWidgetProps> = ({ showFilters = true, onStateSelect, className }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [sortBy, setSortBy] = useState<'talent' | 'growth' | 'salary'>('talent');

  const sortedStates = [...STATE_DATA].sort((a, b) => {
    if (sortBy === 'growth') return b.growthRate - a.growthRate;
    if (sortBy === 'salary') return b.avgSalary - a.avgSalary;
    return b.talentPool - a.talentPool;
  });

  const totalTalent = STATE_DATA.reduce((sum, s) => sum + s.talentPool, 0);
  const avgGrowth = (STATE_DATA.reduce((sum, s) => sum + s.growthRate, 0) / STATE_DATA.length).toFixed(1);

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-gray-400 text-sm">Total Talent Pool</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalTalent.toLocaleString()}</div>
          <div className="text-sm text-emerald-400 mt-1">Across 50 states</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Avg Growth Rate</span>
          </div>
          <div className="text-3xl font-bold text-white">{avgGrowth}%</div>
          <div className="text-sm text-blue-400 mt-1">Year over year</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">Partner Universities</span>
          </div>
          <div className="text-3xl font-bold text-white">1,200+</div>
          <div className="text-sm text-purple-400 mt-1">Nationwide</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-gray-400 text-sm">Employer Partners</span>
          </div>
          <div className="text-3xl font-bold text-white">1,400+</div>
          <div className="text-sm text-amber-400 mt-1">Active hiring</div>
        </motion.div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_FILTERS.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  selectedIndustry === industry.id
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span>{industry.icon}</span> {industry.label}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'talent' | 'growth' | 'salary')}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="talent">Talent Pool</option>
              <option value="growth">Growth Rate</option>
              <option value="salary">Avg Salary</option>
            </select>
          </div>
        </div>
      )}

      {/* Map & List Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* State List */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold text-white">Talent by State</h3>
          </div>
          <div className="divide-y divide-gray-800 max-h-[500px] overflow-y-auto">
            {sortedStates.map((state, idx) => (
              <motion.button
                key={state.abbreviation}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setSelectedState(state);
                  onStateSelect?.(state);
                }}
                className={`w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors ${
                  selectedState?.abbreviation === state.abbreviation ? 'bg-emerald-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </span>
                  <div className="text-left">
                    <div className="font-medium text-white">{state.name}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      {state.topSkills.slice(0, 2).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-lg font-bold text-white">{state.talentPool.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">professionals</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-400">+{state.growthRate}%</div>
                    <div className="text-xs text-gray-500">growth</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">${(state.avgSalary / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">avg salary</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* State Detail Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          {selectedState ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-lg">{selectedState.abbreviation}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedState.name}</h3>
                  <p className="text-sm text-gray-400">{selectedState.talentPool.toLocaleString()} professionals</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">${(selectedState.avgSalary / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-400">Avg Salary</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400">+{selectedState.growthRate}%</div>
                  <div className="text-xs text-gray-400">YoY Growth</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{selectedState.universities}</div>
                  <div className="text-xs text-gray-400">Universities</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{selectedState.employers}</div>
                  <div className="text-xs text-gray-400">Employers</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedState.topSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <Link to={`/workforce-map?state=${selectedState.abbreviation}`}>
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                  Explore {selectedState.name} Talent
                  <ExternalLink className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MapPin className="w-12 h-12 text-gray-700 mb-4" />
              <h4 className="font-medium text-white mb-2">Select a State</h4>
              <p className="text-sm text-gray-400">
                Click on a state to see detailed talent information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN EXPORT
// ===========================================

const WorkforceMapWidget: React.FC<WorkforceMapWidgetProps> = (props) => {
  const { variant = 'compact' } = props;

  switch (variant) {
    case 'mini':
      return <MiniWidget {...props} />;
    case 'full':
      return <FullWidget {...props} />;
    case 'compact':
    default:
      return <CompactWidget {...props} />;
  }
};

export default WorkforceMapWidget;
