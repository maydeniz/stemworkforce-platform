import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Shield,
  DollarSign,
  Briefcase,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
} from 'lucide-react';

// ===========================================
// Workforce Analytics - Employer Intelligence Dashboard
// Data sourced from BLS, NSF/NCSES, CyberSeek, SIA (2025-2026)
// ===========================================

const SECTOR_METRICS = [
  {
    sector: 'Semiconductor',
    openings: '18,200',
    medianSalary: '$103K',
    growth: '+10.2%',
    trend: 'up' as const,
    clearanceReq: '35%',
    timeToFill: '52 days',
    topLocations: ['Phoenix, AZ', 'Austin, TX', 'Portland, OR'],
    color: 'blue',
  },
  {
    sector: 'AI & Machine Learning',
    openings: '49,300',
    medianSalary: '$150K',
    growth: '+17.4%',
    trend: 'up' as const,
    clearanceReq: '18%',
    timeToFill: '38 days',
    topLocations: ['San Francisco, CA', 'Seattle, WA', 'New York, NY'],
    color: 'purple',
  },
  {
    sector: 'Cybersecurity',
    openings: '457,398',
    medianSalary: '$120K',
    growth: '+29.1%',
    trend: 'up' as const,
    clearanceReq: '62%',
    timeToFill: '65 days',
    topLocations: ['Washington, DC', 'San Antonio, TX', 'Colorado Springs, CO'],
    color: 'red',
  },
  {
    sector: 'Nuclear Technologies',
    openings: '3,800',
    medianSalary: '$118K',
    growth: '+5.7%',
    trend: 'up' as const,
    clearanceReq: '78%',
    timeToFill: '74 days',
    topLocations: ['Oak Ridge, TN', 'Idaho Falls, ID', 'Aiken, SC'],
    color: 'emerald',
  },
  {
    sector: 'Quantum Computing',
    openings: '2,100',
    medianSalary: '$149K',
    growth: '+12.3%',
    trend: 'up' as const,
    clearanceReq: '42%',
    timeToFill: '81 days',
    topLocations: ['Boulder, CO', 'College Park, MD', 'Chicago, IL'],
    color: 'cyan',
  },
  {
    sector: 'Aerospace & Defense',
    openings: '8,500',
    medianSalary: '$110K',
    growth: '+5.0%',
    trend: 'up' as const,
    clearanceReq: '71%',
    timeToFill: '68 days',
    topLocations: ['Huntsville, AL', 'El Segundo, CA', 'Houston, TX'],
    color: 'amber',
  },
  {
    sector: 'Clean Energy',
    openings: '11,200',
    medianSalary: '$113K',
    growth: '+9.0%',
    trend: 'up' as const,
    clearanceReq: '12%',
    timeToFill: '42 days',
    topLocations: ['Denver, CO', 'San Jose, CA', 'Austin, TX'],
    color: 'green',
  },
  {
    sector: 'Robotics & Automation',
    openings: '5,400',
    medianSalary: '$130K',
    growth: '+9.2%',
    trend: 'up' as const,
    clearanceReq: '28%',
    timeToFill: '48 days',
    topLocations: ['Pittsburgh, PA', 'Boston, MA', 'Detroit, MI'],
    color: 'indigo',
  },
];

const HEADLINE_STATS = [
  { label: 'Total STEM Openings', value: '1.2M+', change: '+8.1%', trend: 'up', icon: Briefcase },
  { label: 'Median STEM Salary', value: '$103,580', change: '+4.2%', trend: 'up', icon: DollarSign },
  { label: 'Clearance Demand', value: '200K+', change: '+12%', trend: 'up', icon: Shield },
  { label: 'Avg Time to Fill', value: '56 days', change: '-3 days', trend: 'down', icon: TrendingUp },
];

const SUPPLY_DEMAND_GAPS = [
  { role: 'Cybersecurity Analyst', demand: 457, supply: 320, gap: 137, unit: 'K' },
  { role: 'AI/ML Engineer', demand: 49, supply: 15, gap: 34, unit: 'K' },
  { role: 'Semiconductor Technician', demand: 90, supply: 42, gap: 48, unit: 'K (by 2030)' },
  { role: 'Nuclear Engineer', demand: 12, supply: 3, gap: 9, unit: 'K' },
  { role: 'Quantum Researcher', demand: 8, supply: 2.5, gap: 5.5, unit: 'K' },
];

const CLEARANCE_PREMIUMS = [
  { level: 'Secret', premium: '+$8-15K', holders: '~4.2M' },
  { level: 'Top Secret', premium: '+$15-30K', holders: '~1.3M' },
  { level: 'TS/SCI', premium: '+$25-45K', holders: '~500K' },
  { level: 'DOE Q', premium: '+$10-20K', holders: '~125K' },
];

const COLOR_MAP: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  purple: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  red: 'text-red-400 bg-red-500/20 border-red-500/30',
  emerald: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
  cyan: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
  amber: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  green: 'text-green-400 bg-green-500/20 border-green-500/30',
  indigo: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
};

export default function WorkforceAnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <BarChart3 size={24} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold">Workforce Analytics</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Real-time STEM labor market intelligence across 11 sectors. Understand hiring trends, salary benchmarks, supply-demand gaps, and clearance requirements to optimize your talent strategy.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Data from BLS, NSF/NCSES, CyberSeek, SIA, DOE, and industry partners. Updated Q1 2026.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Headline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 mb-10">
          {HEADLINE_STATS.map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <stat.icon size={20} className="mx-auto text-emerald-400 mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              <div className={`flex items-center justify-center gap-1 text-xs mt-2 ${
                stat.trend === 'up' ? 'text-emerald-400' : 'text-blue-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change} YoY
              </div>
            </div>
          ))}
        </div>

        {/* Sector Breakdown */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Zap size={20} className="text-amber-400" />
          Sector-by-Sector Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {SECTOR_METRICS.map((sector) => {
            const colors = COLOR_MAP[sector.color];
            return (
              <div
                key={sector.sector}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{sector.sector}</h3>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${colors}`}>
                    {sector.growth}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-500">Openings</div>
                    <div className="text-sm font-bold text-white">{sector.openings}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-500">Median Salary</div>
                    <div className="text-sm font-bold text-emerald-400">{sector.medianSalary}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-500">Time to Fill</div>
                    <div className="text-sm font-bold text-amber-400">{sector.timeToFill}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Shield size={10} /> {sector.clearanceReq} require clearance
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin size={10} />
                    {sector.topLocations[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Supply-Demand Gap */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-red-400" />
            Supply-Demand Gap Analysis
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Critical workforce shortages across STEM sectors that impact national competitiveness.
          </p>
          <div className="space-y-4">
            {SUPPLY_DEMAND_GAPS.map((item) => {
              const total = item.demand;
              const supplyPct = (item.supply / total) * 100;
              return (
                <div key={item.role}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{item.role}</span>
                    <span className="text-xs text-red-400 font-medium">
                      Gap: {item.gap}{item.unit}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: `${supplyPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Supply: {item.supply}{item.unit}</span>
                    <span>Demand: {item.demand}{item.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clearance Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-blue-400" />
              Security Clearance Salary Premiums
            </h3>
            <div className="space-y-3">
              {CLEARANCE_PREMIUMS.map((c) => (
                <div key={c.level} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{c.level}</div>
                    <div className="text-xs text-slate-500">{c.holders} active holders</div>
                  </div>
                  <div className="text-emerald-400 font-bold text-sm">{c.premium}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Globe size={18} className="text-purple-400" />
              Top STEM Metro Areas (by openings)
            </h3>
            <div className="space-y-3">
              {[
                { metro: 'Washington, DC Metro', openings: '89K+', specialties: 'Cyber, Defense, Federal' },
                { metro: 'San Francisco Bay Area', openings: '72K+', specialties: 'AI, Semiconductor, Biotech' },
                { metro: 'Seattle-Tacoma', openings: '41K+', specialties: 'AI, Cloud, Aerospace' },
                { metro: 'Austin-Round Rock', openings: '28K+', specialties: 'Semiconductor, Clean Energy' },
                { metro: 'Boston-Cambridge', openings: '35K+', specialties: 'Biotech, Quantum, Robotics' },
              ].map((m) => (
                <div key={m.metro} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{m.metro}</div>
                    <div className="text-xs text-slate-500">{m.specialties}</div>
                  </div>
                  <div className="text-purple-400 font-bold text-sm">{m.openings}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Ready to Build Your STEM Team?</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">
            Use these insights to inform your hiring strategy. Post jobs, browse candidates, or connect with STEM recruitment specialists.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/talent-search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
              <Users size={18} /> Browse Candidates
            </Link>
            <Link
              to="/dashboard?action=post-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              <Briefcase size={18} /> Post a Job
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              <MapPin size={18} /> Workforce Map
            </Link>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-600 text-center">
          Data sourced from BLS, NSF/NCSES, CyberSeek, SIA, DOE, IAEA, and industry workforce reports. Updated Q1 2026.
        </div>
      </div>
    </div>
  );
}
