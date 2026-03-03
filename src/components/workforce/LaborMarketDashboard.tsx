// @ts-nocheck
// ===========================================
// Labor Market Intelligence (LMI) Dashboard
// Real-time labor market data for workforce agencies
// ===========================================

import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, MapPin, Briefcase, DollarSign, Users,
  Building2, Factory, GraduationCap, Search, Filter, Download,
  ChevronRight, ArrowUpRight, ArrowDownRight, BarChart3, PieChart,
  Clock, RefreshCw, ExternalLink, Info, Target, Zap
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface OccupationData {
  soc: string;
  title: string;
  employment: number;
  growthRate: number;
  medianWage: number;
  openings: number;
  education: string;
  inDemand: boolean;
}

interface IndustryData {
  naics: string;
  title: string;
  employment: number;
  growthRate: number;
  establishments: number;
  avgWage: number;
}

interface RegionData {
  id: string;
  name: string;
  unemployment: number;
  laborForce: number;
  employment: number;
  medianWage: number;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const TOP_OCCUPATIONS: OccupationData[] = [
  { soc: '15-1256', title: 'Software Developers', employment: 45230, growthRate: 25.2, medianWage: 127260, openings: 8450, education: "Bachelor's", inDemand: true },
  { soc: '29-1141', title: 'Registered Nurses', employment: 38900, growthRate: 9.4, medianWage: 81220, openings: 5200, education: "Bachelor's", inDemand: true },
  { soc: '15-1212', title: 'Information Security Analysts', employment: 12800, growthRate: 35.0, medianWage: 112000, openings: 2100, education: "Bachelor's", inDemand: true },
  { soc: '49-9021', title: 'HVAC Mechanics & Installers', employment: 18500, growthRate: 8.9, medianWage: 51390, openings: 3400, education: 'Postsecondary', inDemand: true },
  { soc: '47-2111', title: 'Electricians', employment: 22100, growthRate: 9.1, medianWage: 60240, openings: 4100, education: 'Apprenticeship', inDemand: true },
  { soc: '53-3032', title: 'Heavy Truck Drivers', employment: 35600, growthRate: 6.4, medianWage: 48310, openings: 6800, education: 'HS Diploma', inDemand: true },
  { soc: '31-1120', title: 'Home Health Aides', employment: 28400, growthRate: 22.3, medianWage: 29430, openings: 7200, education: 'HS Diploma', inDemand: true },
  { soc: '51-4041', title: 'CNC Machine Operators', employment: 15200, growthRate: 7.8, medianWage: 45790, openings: 2800, education: 'HS Diploma + Training', inDemand: true }
];

const TOP_INDUSTRIES: IndustryData[] = [
  { naics: '62', title: 'Healthcare & Social Assistance', employment: 156000, growthRate: 15.2, establishments: 4850, avgWage: 52340 },
  { naics: '54', title: 'Professional & Technical Services', employment: 98500, growthRate: 12.8, establishments: 6200, avgWage: 89420 },
  { naics: '31-33', title: 'Manufacturing', employment: 87200, growthRate: 4.2, establishments: 1850, avgWage: 62150 },
  { naics: '23', title: 'Construction', employment: 78400, growthRate: 7.9, establishments: 3400, avgWage: 58920 },
  { naics: '48-49', title: 'Transportation & Warehousing', employment: 65800, growthRate: 11.5, establishments: 2100, avgWage: 51280 },
  { naics: '44-45', title: 'Retail Trade', employment: 125600, growthRate: -2.1, establishments: 8900, avgWage: 32450 }
];

const REGIONS: RegionData[] = [
  { id: 'capital', name: 'Capital Region', unemployment: 3.8, laborForce: 425000, employment: 408800, medianWage: 58200 },
  { id: 'metro', name: 'Metro Area', unemployment: 4.2, laborForce: 890000, employment: 852600, medianWage: 62400 },
  { id: 'northern', name: 'Northern Counties', unemployment: 5.1, laborForce: 180000, employment: 170800, medianWage: 48500 },
  { id: 'southern', name: 'Southern Region', unemployment: 4.5, laborForce: 320000, employment: 305600, medianWage: 52100 },
  { id: 'coastal', name: 'Coastal Area', unemployment: 3.5, laborForce: 275000, employment: 265400, medianWage: 55800 }
];

const SKILL_GAPS = [
  { skill: 'Cloud Computing (AWS/Azure)', demand: 2450, supply: 1200, gap: -1250 },
  { skill: 'Data Analytics', demand: 1890, supply: 980, gap: -910 },
  { skill: 'Cybersecurity', demand: 1560, supply: 720, gap: -840 },
  { skill: 'Industrial Automation/PLC', demand: 1200, supply: 580, gap: -620 },
  { skill: 'Welding (Certified)', demand: 1800, supply: 1350, gap: -450 },
  { skill: 'Commercial Driver License', demand: 3200, supply: 2100, gap: -1100 }
];

// ===========================================
// MAIN COMPONENT
// ===========================================
interface LaborMarketDashboardProps {
  regionId?: string;
  showFullDetails?: boolean;
}

const LaborMarketDashboard: React.FC<LaborMarketDashboardProps> = ({
  regionId,
  showFullDetails = true
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'occupations' | 'industries' | 'regions' | 'skills'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Statewide summary stats
  const statewideSummary = {
    laborForce: REGIONS.reduce((sum, r) => sum + r.laborForce, 0),
    employed: REGIONS.reduce((sum, r) => sum + r.employment, 0),
    unemploymentRate: 4.1,
    jobPostings: 45230,
    medianWage: 56200,
    jobGrowth: 2.8
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            Labor Market Intelligence
          </h2>
          <p className="text-gray-400 mt-1">
            Real-time workforce supply and demand analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search occupations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Labor Force</div>
          <div className="text-2xl font-bold text-white">{(statewideSummary.laborForce / 1000000).toFixed(2)}M</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            +1.2% YoY
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Unemployment Rate</div>
          <div className="text-2xl font-bold text-white">{statewideSummary.unemploymentRate}%</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            <ArrowDownRight className="w-3 h-3" />
            -0.3 pts
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Job Postings</div>
          <div className="text-2xl font-bold text-white">{statewideSummary.jobPostings.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            +8.5% MoM
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Median Wage</div>
          <div className="text-2xl font-bold text-white">${statewideSummary.medianWage.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            +4.2% YoY
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Job Growth</div>
          <div className="text-2xl font-bold text-emerald-400">+{statewideSummary.jobGrowth}%</div>
          <div className="text-xs text-gray-500 mt-1">Projected 5-year</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Skills Gap</div>
          <div className="text-2xl font-bold text-amber-400">-4,870</div>
          <div className="text-xs text-gray-500 mt-1">Critical shortages</div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'occupations', label: 'In-Demand Occupations', icon: Briefcase },
          { id: 'industries', label: 'Industry Analysis', icon: Factory },
          { id: 'regions', label: 'Regional Data', icon: MapPin },
          { id: 'skills', label: 'Skills Gap Analysis', icon: Target }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as typeof activeView)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === tab.id
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Growing Occupations */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Fastest Growing Occupations</h3>
              <span className="text-xs text-cyan-400">5-Year Projections</span>
            </div>
            <div className="space-y-3">
              {TOP_OCCUPATIONS.slice(0, 5).sort((a, b) => b.growthRate - a.growthRate).map((occ, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{occ.title}</div>
                      <div className="text-xs text-gray-500">SOC {occ.soc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-medium">+{occ.growthRate}%</div>
                    <div className="text-xs text-gray-500">{occ.openings.toLocaleString()} openings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Distribution */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Employment by Industry</h3>
              <span className="text-xs text-gray-400">Current Quarter</span>
            </div>
            <div className="space-y-3">
              {TOP_INDUSTRIES.slice(0, 5).map((ind, i) => {
                const maxEmployment = Math.max(...TOP_INDUSTRIES.map(i => i.employment));
                const percentage = (ind.employment / maxEmployment) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{ind.title}</span>
                      <span className="text-sm text-white font-medium">{ind.employment.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{ind.establishments.toLocaleString()} establishments</span>
                      <span className={`text-xs ${ind.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {ind.growthRate >= 0 ? '+' : ''}{ind.growthRate}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Gap Summary */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Critical Skills Gaps</h3>
              <span className="text-xs text-amber-400">Training Priority</span>
            </div>
            <div className="space-y-3">
              {SKILL_GAPS.slice(0, 5).map((skill, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">{skill.skill}</div>
                    <div className="text-xs text-gray-500">
                      Demand: {skill.demand.toLocaleString()} | Supply: {skill.supply.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-medium">{skill.gap.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">shortage</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Summary */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Regional Overview</h3>
              <span className="text-xs text-gray-400">Unemployment Rates</span>
            </div>
            <div className="space-y-3">
              {REGIONS.map((region, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-white">{region.name}</div>
                      <div className="text-xs text-gray-500">{region.laborForce.toLocaleString()} labor force</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-medium ${region.unemployment <= 4 ? 'text-emerald-400' : region.unemployment <= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                        {region.unemployment}%
                      </div>
                      <div className="text-xs text-gray-500">unemployment</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Occupations Tab */}
      {activeView === 'occupations' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-white">In-Demand Occupations (WIOA Priority)</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Showing high-growth, high-wage occupations</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Occupation</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Employment</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Growth Rate</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Median Wage</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Annual Openings</th>
                  <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Education</th>
                  <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {TOP_OCCUPATIONS.map((occ, i) => (
                  <tr key={i} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{occ.title}</div>
                      <div className="text-xs text-gray-500">SOC {occ.soc}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">{occ.employment.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-emerald-400 font-medium">+{occ.growthRate}%</span>
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">${occ.medianWage.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{occ.openings.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs px-2 py-1 bg-slate-600 text-gray-300 rounded">{occ.education}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {occ.inDemand && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
                          <Zap className="w-3 h-3" />
                          In-Demand
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Industries Tab */}
      {activeView === 'industries' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Industry Sector Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Industry</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Employment</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Growth Rate</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Establishments</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Avg. Wage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {TOP_INDUSTRIES.map((ind, i) => (
                  <tr key={i} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{ind.title}</div>
                      <div className="text-xs text-gray-500">NAICS {ind.naics}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">{ind.employment.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${ind.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {ind.growthRate >= 0 ? '+' : ''}{ind.growthRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">{ind.establishments.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">${ind.avgWage.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Regions Tab */}
      {activeView === 'regions' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REGIONS.map((region, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white">{region.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Unemployment</div>
                  <div className={`text-xl font-bold ${region.unemployment <= 4 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {region.unemployment}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Labor Force</div>
                  <div className="text-xl font-bold text-white">{(region.laborForce / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Employed</div>
                  <div className="text-xl font-bold text-white">{(region.employment / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Median Wage</div>
                  <div className="text-xl font-bold text-white">${(region.medianWage / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Gap Tab */}
      {activeView === 'skills' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Skills Gap Analysis - Training Investment Priorities</h3>
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <Info className="w-4 h-4" />
              Negative values indicate shortage
            </div>
          </div>
          <div className="space-y-4">
            {SKILL_GAPS.map((skill, i) => {
              const gapPercentage = Math.abs(skill.gap) / skill.demand * 100;
              return (
                <div key={i} className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-white">{skill.skill}</div>
                      <div className="text-sm text-gray-400">
                        Demand: {skill.demand.toLocaleString()} workers | Current Supply: {skill.supply.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-400">{skill.gap.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">worker shortage</div>
                    </div>
                  </div>
                  <div className="relative h-4 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 h-full bg-emerald-500"
                      style={{ width: `${(skill.supply / skill.demand) * 100}%` }}
                    />
                    <div
                      className="absolute h-full bg-red-500/50"
                      style={{
                        left: `${(skill.supply / skill.demand) * 100}%`,
                        width: `${100 - (skill.supply / skill.demand) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-emerald-400">Supply: {((skill.supply / skill.demand) * 100).toFixed(0)}%</span>
                    <span className="text-red-400">Gap: {gapPercentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Sources Footer */}
      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>Data Sources: BLS, EMSI/Lightcast, O*NET</span>
            <span>|</span>
            <span>Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Updates: Monthly (employment), Quarterly (projections)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborMarketDashboard;
