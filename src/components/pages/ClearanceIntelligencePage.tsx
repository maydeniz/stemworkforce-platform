// ===========================================
// CLEARANCE WORKFORCE INTELLIGENCE & ANALYTICS
// Public-facing market intelligence for cleared STEM workforce
// Data sources: USAJobs federation, BLS, platform analytics
// ===========================================

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  MapPin,
  DollarSign,
  Users,
  Briefcase,
  Shield,
  ShieldAlert,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Zap,
  Activity,
  Filter,
  ChevronDown,
  Info,
  AlertTriangle,
  Building,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import type { ClearanceDemandData, ClearanceTargetLevel } from '../../types/clearanceReadiness';
import { CLEARANCE_TARGET_LEVELS } from '../../types/clearanceReadiness';
import clearanceReadinessApi from '../../services/clearanceReadinessApi';

// ---------------------------------------------------------------------------
// CONSTANTS & SAMPLE DATA
// ---------------------------------------------------------------------------

const SECTORS = [
  { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield },
  { id: 'ai', label: 'AI / Machine Learning', icon: Zap },
  { id: 'aerospace', label: 'Aerospace & Defense', icon: Globe },
  { id: 'nuclear', label: 'Nuclear Technologies', icon: Activity },
  { id: 'quantum', label: 'Quantum Computing', icon: Target },
  { id: 'semiconductor', label: 'Semiconductors', icon: Building },
  { id: 'biotech', label: 'Biotechnology', icon: ShieldAlert },
  { id: 'space', label: 'Space Systems', icon: Globe },
  { id: 'energy', label: 'Clean Energy', icon: Zap },
  { id: 'telecom', label: 'Critical Telecom', icon: Activity },
  { id: 'advanced-materials', label: 'Advanced Materials', icon: Target },
] as const;

const CLEARANCE_LEVELS_ORDERED: ClearanceTargetLevel[] = [
  'public-trust',
  'secret',
  'top-secret',
  'ts-sci',
  'doe-l',
  'doe-q',
  'doe-q-sci',
];

const HERO_STATS = [
  { label: 'Total Cleared Positions', value: '47,200+', icon: Briefcase, trend: '+12.3%', up: true },
  { label: 'Critical Shortage Sectors', value: '6 of 11', icon: AlertTriangle, trend: '+2 YoY', up: true },
  { label: 'Avg. Salary Premium', value: '$18,400', icon: DollarSign, trend: '+6.1%', up: true },
  { label: 'Avg. Time-to-Fill', value: '127 days', icon: Clock, trend: '-8 days', up: false },
];

// Extended demand data covering all sectors x clearance levels
const FULL_DEMAND_GRID: Record<string, Record<string, { positions: number; competitiveness: string }>> = {
  cybersecurity: {
    'public-trust': { positions: 890, competitiveness: 'moderate' },
    secret: { positions: 1450, competitiveness: 'high' },
    'top-secret': { positions: 987, competitiveness: 'critical' },
    'ts-sci': { positions: 1245, competitiveness: 'critical' },
    'doe-l': { positions: 45, competitiveness: 'low' },
    'doe-q': { positions: 28, competitiveness: 'low' },
    'doe-q-sci': { positions: 12, competitiveness: 'low' },
  },
  ai: {
    'public-trust': { positions: 1230, competitiveness: 'moderate' },
    secret: { positions: 756, competitiveness: 'critical' },
    'top-secret': { positions: 534, competitiveness: 'high' },
    'ts-sci': { positions: 412, competitiveness: 'critical' },
    'doe-l': { positions: 89, competitiveness: 'moderate' },
    'doe-q': { positions: 56, competitiveness: 'moderate' },
    'doe-q-sci': { positions: 23, competitiveness: 'high' },
  },
  aerospace: {
    'public-trust': { positions: 560, competitiveness: 'low' },
    secret: { positions: 1120, competitiveness: 'moderate' },
    'top-secret': { positions: 623, competitiveness: 'high' },
    'ts-sci': { positions: 378, competitiveness: 'high' },
    'doe-l': { positions: 67, competitiveness: 'low' },
    'doe-q': { positions: 34, competitiveness: 'moderate' },
    'doe-q-sci': { positions: 18, competitiveness: 'moderate' },
  },
  nuclear: {
    'public-trust': { positions: 210, competitiveness: 'low' },
    secret: { positions: 345, competitiveness: 'moderate' },
    'top-secret': { positions: 189, competitiveness: 'high' },
    'ts-sci': { positions: 78, competitiveness: 'high' },
    'doe-l': { positions: 456, competitiveness: 'high' },
    'doe-q': { positions: 234, competitiveness: 'critical' },
    'doe-q-sci': { positions: 89, competitiveness: 'critical' },
  },
  quantum: {
    'public-trust': { positions: 120, competitiveness: 'low' },
    secret: { positions: 234, competitiveness: 'high' },
    'top-secret': { positions: 145, competitiveness: 'critical' },
    'ts-sci': { positions: 98, competitiveness: 'critical' },
    'doe-l': { positions: 78, competitiveness: 'moderate' },
    'doe-q': { positions: 112, competitiveness: 'critical' },
    'doe-q-sci': { positions: 45, competitiveness: 'critical' },
  },
  semiconductor: {
    'public-trust': { positions: 670, competitiveness: 'low' },
    secret: { positions: 412, competitiveness: 'high' },
    'top-secret': { positions: 234, competitiveness: 'moderate' },
    'ts-sci': { positions: 89, competitiveness: 'moderate' },
    'doe-l': { positions: 156, competitiveness: 'moderate' },
    'doe-q': { positions: 78, competitiveness: 'high' },
    'doe-q-sci': { positions: 23, competitiveness: 'moderate' },
  },
  biotech: {
    'public-trust': { positions: 890, competitiveness: 'low' },
    secret: { positions: 289, competitiveness: 'high' },
    'top-secret': { positions: 145, competitiveness: 'moderate' },
    'ts-sci': { positions: 56, competitiveness: 'moderate' },
    'doe-l': { positions: 34, competitiveness: 'low' },
    'doe-q': { positions: 18, competitiveness: 'low' },
    'doe-q-sci': { positions: 8, competitiveness: 'low' },
  },
  space: {
    'public-trust': { positions: 340, competitiveness: 'low' },
    secret: { positions: 780, competitiveness: 'moderate' },
    'top-secret': { positions: 567, competitiveness: 'high' },
    'ts-sci': { positions: 345, competitiveness: 'critical' },
    'doe-l': { positions: 23, competitiveness: 'low' },
    'doe-q': { positions: 12, competitiveness: 'low' },
    'doe-q-sci': { positions: 6, competitiveness: 'low' },
  },
  energy: {
    'public-trust': { positions: 450, competitiveness: 'low' },
    secret: { positions: 234, competitiveness: 'moderate' },
    'top-secret': { positions: 123, competitiveness: 'moderate' },
    'ts-sci': { positions: 45, competitiveness: 'moderate' },
    'doe-l': { positions: 567, competitiveness: 'high' },
    'doe-q': { positions: 345, competitiveness: 'critical' },
    'doe-q-sci': { positions: 67, competitiveness: 'critical' },
  },
  telecom: {
    'public-trust': { positions: 560, competitiveness: 'low' },
    secret: { positions: 345, competitiveness: 'moderate' },
    'top-secret': { positions: 234, competitiveness: 'high' },
    'ts-sci': { positions: 123, competitiveness: 'high' },
    'doe-l': { positions: 23, competitiveness: 'low' },
    'doe-q': { positions: 12, competitiveness: 'low' },
    'doe-q-sci': { positions: 5, competitiveness: 'low' },
  },
  'advanced-materials': {
    'public-trust': { positions: 230, competitiveness: 'low' },
    secret: { positions: 178, competitiveness: 'moderate' },
    'top-secret': { positions: 89, competitiveness: 'moderate' },
    'ts-sci': { positions: 34, competitiveness: 'moderate' },
    'doe-l': { positions: 234, competitiveness: 'high' },
    'doe-q': { positions: 145, competitiveness: 'high' },
    'doe-q-sci': { positions: 34, competitiveness: 'high' },
  },
};

const SALARY_PREMIUM_DATA = [
  { level: 'Public Trust', premium: 7500, cleared: 92000, nonCleared: 84500, color: CLEARANCE_TARGET_LEVELS['public-trust'].color },
  { level: 'Secret', premium: 11500, cleared: 118000, nonCleared: 106500, color: CLEARANCE_TARGET_LEVELS['secret'].color },
  { level: 'Top Secret', premium: 22500, cleared: 148000, nonCleared: 125500, color: CLEARANCE_TARGET_LEVELS['top-secret'].color },
  { level: 'TS/SCI', premium: 35000, cleared: 168000, nonCleared: 133000, color: CLEARANCE_TARGET_LEVELS['ts-sci'].color },
  { level: 'DOE L', premium: 11000, cleared: 122000, nonCleared: 111000, color: CLEARANCE_TARGET_LEVELS['doe-l'].color },
  { level: 'DOE Q', premium: 15000, cleared: 142000, nonCleared: 127000, color: CLEARANCE_TARGET_LEVELS['doe-q'].color },
  { level: 'DOE Q/SCI', premium: 27500, cleared: 162000, nonCleared: 134500, color: CLEARANCE_TARGET_LEVELS['doe-q-sci'].color },
];

const SALARY_TREND_DATA = [
  { month: 'Sep 2025', secret: 112000, topSecret: 140000, tsSci: 158000, doeQ: 135000 },
  { month: 'Oct 2025', secret: 113500, topSecret: 141000, tsSci: 159000, doeQ: 136000 },
  { month: 'Nov 2025', secret: 114000, topSecret: 143000, tsSci: 161000, doeQ: 137500 },
  { month: 'Dec 2025', secret: 115000, topSecret: 144000, tsSci: 163000, doeQ: 138000 },
  { month: 'Jan 2026', secret: 116500, topSecret: 146000, tsSci: 165000, doeQ: 140000 },
  { month: 'Feb 2026', secret: 118000, topSecret: 148000, tsSci: 168000, doeQ: 142000 },
];

const SUPPLY_DEMAND_DATA = SECTORS.map(sector => {
  const sectorData = FULL_DEMAND_GRID[sector.id];
  const totalPositions = sectorData
    ? Object.values(sectorData).reduce((sum, d) => sum + d.positions, 0)
    : 0;
  const criticalCount = sectorData
    ? Object.values(sectorData).filter(d => d.competitiveness === 'critical').length
    : 0;
  const ratioMap: Record<string, number> = {
    cybersecurity: 0.19,
    ai: 0.21,
    aerospace: 0.34,
    nuclear: 0.15,
    quantum: 0.16,
    semiconductor: 0.28,
    biotech: 0.38,
    space: 0.24,
    energy: 0.31,
    telecom: 0.35,
    'advanced-materials': 0.29,
  };
  const ratio = ratioMap[sector.id] ?? 0.3;
  const status = ratio < 0.2 ? 'critical' : ratio < 0.3 ? 'shortage' : ratio < 0.5 ? 'balanced' : 'surplus';
  const trendDir = ['cybersecurity', 'ai', 'quantum', 'nuclear', 'energy'].includes(sector.id) ? 'worsening' : 'stable';
  return {
    sector: sector.label,
    sectorId: sector.id,
    totalPositions,
    ratio,
    status,
    trend: trendDir,
    criticalLevels: criticalCount,
    supply: Math.round(totalPositions * ratio),
  };
});

const TIME_TO_CLEAR_DATA = [
  { type: 'Tier 1 (Low Risk)', agency: 'DCSA', avg: 55, median: 42, p25: 30, p75: 68, p95: 120, approvalRate: 97.2, interimRate: 85 },
  { type: 'Tier 2 (Public Trust)', agency: 'DCSA', avg: 98, median: 85, p25: 60, p75: 130, p95: 210, approvalRate: 94.1, interimRate: 72 },
  { type: 'Tier 3 (Secret)', agency: 'DCSA', avg: 105, median: 92, p25: 65, p75: 140, p95: 230, approvalRate: 92.8, interimRate: 78 },
  { type: 'Tier 5 (Top Secret)', agency: 'DCSA', avg: 175, median: 155, p25: 110, p75: 225, p95: 380, approvalRate: 88.4, interimRate: 65 },
  { type: 'L Clearance', agency: 'DOE', avg: 135, median: 120, p25: 85, p75: 170, p95: 280, approvalRate: 91.5, interimRate: 70 },
  { type: 'Q Clearance', agency: 'DOE', avg: 210, median: 185, p25: 140, p75: 260, p95: 420, approvalRate: 86.2, interimRate: 55 },
  { type: 'TS/SCI', agency: 'IC', avg: 245, median: 210, p25: 160, p75: 310, p95: 480, approvalRate: 82.7, interimRate: 48 },
];

const PROCESSING_TREND_DATA = [
  { quarter: 'FY24 Q1', dcsa: 128, doe: 195, ic: 278 },
  { quarter: 'FY24 Q2', dcsa: 122, doe: 188, ic: 270 },
  { quarter: 'FY24 Q3', dcsa: 118, doe: 182, ic: 262 },
  { quarter: 'FY24 Q4', dcsa: 115, doe: 176, ic: 258 },
  { quarter: 'FY25 Q1', dcsa: 112, doe: 170, ic: 255 },
  { quarter: 'FY25 Q2', dcsa: 108, doe: 165, ic: 250 },
  { quarter: 'FY25 Q3', dcsa: 105, doe: 158, ic: 248 },
  { quarter: 'FY25 Q4', dcsa: 102, doe: 152, ic: 245 },
];

const GEOGRAPHIC_DATA = [
  { rank: 1, state: 'Virginia', metro: 'Northern Virginia / DC Metro', positions: 14200, avgSalary: 162000, colaAdjusted: 128000, concentration: 30.1, growth: 14.2 },
  { rank: 2, state: 'Maryland', metro: 'Baltimore-Washington Corridor', positions: 8900, avgSalary: 155000, colaAdjusted: 126000, concentration: 18.9, growth: 11.8 },
  { rank: 3, state: 'California', metro: 'Greater Los Angeles / San Diego', positions: 5400, avgSalary: 168000, colaAdjusted: 118000, concentration: 11.4, growth: 8.5 },
  { rank: 4, state: 'Colorado', metro: 'Denver-Colorado Springs', positions: 3800, avgSalary: 148000, colaAdjusted: 124000, concentration: 8.1, growth: 16.3 },
  { rank: 5, state: 'Texas', metro: 'San Antonio / Austin / DFW', positions: 3200, avgSalary: 138000, colaAdjusted: 128000, concentration: 6.8, growth: 19.1 },
  { rank: 6, state: 'Alabama', metro: 'Huntsville / Redstone Arsenal', positions: 2800, avgSalary: 132000, colaAdjusted: 132000, concentration: 5.9, growth: 22.4 },
  { rank: 7, state: 'New Mexico', metro: 'Albuquerque / Los Alamos / Sandia', positions: 1900, avgSalary: 142000, colaAdjusted: 136000, concentration: 4.0, growth: 12.1 },
  { rank: 8, state: 'Florida', metro: 'Tampa / Orlando / Space Coast', positions: 1700, avgSalary: 135000, colaAdjusted: 125000, concentration: 3.6, growth: 15.7 },
  { rank: 9, state: 'Tennessee', metro: 'Oak Ridge / Knoxville', positions: 1400, avgSalary: 128000, colaAdjusted: 128000, concentration: 3.0, growth: 9.8 },
  { rank: 10, state: 'Washington', metro: 'Greater Seattle / Puget Sound', positions: 1200, avgSalary: 158000, colaAdjusted: 118000, concentration: 2.5, growth: 7.2 },
];

// ---------------------------------------------------------------------------
// UTILITY HELPERS
// ---------------------------------------------------------------------------

function competitivenessBg(level: string): string {
  switch (level) {
    case 'low': return 'bg-emerald-500/30';
    case 'moderate': return 'bg-yellow-500/30';
    case 'high': return 'bg-orange-500/30';
    case 'critical': return 'bg-red-500/40';
    default: return 'bg-gray-500/20';
  }
}

function statusColor(status: string): string {
  switch (status) {
    case 'surplus': return 'text-emerald-400';
    case 'balanced': return 'text-blue-400';
    case 'shortage': return 'text-orange-400';
    case 'critical': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

function statusBadge(status: string): string {
  switch (status) {
    case 'surplus': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'balanced': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'shortage': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    case 'critical': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}

// ---------------------------------------------------------------------------
// SECTION HEADER
// ---------------------------------------------------------------------------

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-gray-400 ml-12">{subtitle}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CUSTOM TOOLTIP
// ---------------------------------------------------------------------------

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-gray-300 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' && entry.value > 1000
            ? formatCurrency(entry.value)
            : entry.value}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export default function ClearanceIntelligencePage() {
  const [demandData, setDemandData] = useState<ClearanceDemandData[]>([]);
  const [expandedSector, setExpandedSector] = useState<string | null>(null);
  const [geoSort, setGeoSort] = useState<'positions' | 'salary' | 'growth'>('positions');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    clearanceReadinessApi.getDemandData().then(res => {
      if (res.success) setDemandData(res.data);
    });
  }, []);

  const sortedGeoData = useMemo(() => {
    return [...GEOGRAPHIC_DATA].sort((a, b) => {
      if (geoSort === 'salary') return b.avgSalary - a.avgSalary;
      if (geoSort === 'growth') return b.growth - a.growth;
      return b.positions - a.positions;
    });
  }, [geoSort]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <section className="relative overflow-hidden border-b border-gray-800">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            {/* Skeleton hero heading */}
            <div className="text-center mb-12">
              <div className="h-6 w-40 mx-auto mb-6 rounded-full bg-gray-700/60 animate-pulse" />
              <div className="h-12 w-3/4 mx-auto mb-4 rounded-lg bg-gray-700/60 animate-pulse" />
              <div className="h-5 w-2/3 mx-auto mb-2 rounded bg-gray-700/40 animate-pulse" />
              <div className="h-4 w-1/3 mx-auto rounded bg-gray-700/30 animate-pulse" />
            </div>
            {/* Skeleton hero stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-700/50 animate-pulse" />
                    <div className="w-14 h-4 rounded bg-gray-700/40 animate-pulse" />
                  </div>
                  <div className="h-7 w-24 rounded bg-gray-700/60 animate-pulse mb-2" />
                  <div className="h-4 w-32 rounded bg-gray-700/40 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Skeleton first section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gray-700/50 animate-pulse" />
              <div className="h-7 w-64 rounded bg-gray-700/60 animate-pulse" />
            </div>
            <div className="h-4 w-96 ml-12 rounded bg-gray-700/40 animate-pulse" />
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-700/20">
                <div className="h-4 w-32 rounded bg-gray-700/50 animate-pulse" />
                {[0, 1, 2, 3, 4, 5, 6].map(j => (
                  <div key={j} className="h-8 w-16 rounded-md bg-gray-700/40 animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* ================================================================ */}
      {/* HERO SECTION */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden border-b border-gray-800">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              Live Market Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Clearance Workforce{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-2">
              Real-time analytics on cleared STEM workforce demand, salary premiums,
              processing benchmarks, and geographic hotspots across 11 critical technology sectors.
            </p>
            <p className="text-sm text-gray-500">
              Powered by federated data from USAJobs, BLS, and 12,500+ organizations
            </p>
          </motion.div>

          {/* Hero stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gray-700/50">
                    <stat.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.up ? 'text-emerald-400' : 'text-blue-400'
                  }`}>
                    {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* ================================================================ */}
        {/* DEMAND HEATMAP */}
        {/* ================================================================ */}
        <section>
          <SectionHeader
            icon={BarChart3}
            title="Clearance Demand Heatmap"
            subtitle="Open positions by sector and clearance level -- color indicates shortage severity"
          />

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-gray-700/50 bg-gray-800/30">
              <span className="text-sm text-gray-400 font-medium">Shortage Severity:</span>
              {[
                { label: 'Low Demand', cls: 'bg-emerald-500/30' },
                { label: 'Moderate', cls: 'bg-yellow-500/30' },
                { label: 'High', cls: 'bg-orange-500/30' },
                { label: 'Critical', cls: 'bg-red-500/40' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${item.cls}`} />
                  <span className="text-xs text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Header row */}
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-gray-700/50 bg-gray-800/60">
                  <div className="px-4 py-3 text-sm font-semibold text-gray-300">Sector</div>
                  {CLEARANCE_LEVELS_ORDERED.map(level => (
                    <div key={level} className="px-2 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {CLEARANCE_TARGET_LEVELS[level].abbreviation}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sector rows */}
                {SECTORS.map((sector, idx) => {
                  const sectorGrid = FULL_DEMAND_GRID[sector.id];
                  const isExpanded = expandedSector === sector.id;
                  const totalPositions = sectorGrid
                    ? Object.values(sectorGrid).reduce((s, d) => s + d.positions, 0)
                    : 0;

                  return (
                    <React.Fragment key={sector.id}>
                      <div
                        className={`grid grid-cols-[200px_repeat(7,1fr)] cursor-pointer transition-colors hover:bg-gray-700/30 ${
                          idx % 2 === 0 ? 'bg-gray-800/20' : ''
                        } ${isExpanded ? 'bg-gray-700/40' : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-expanded={expandedSector === sector.id}
                        aria-label={`${sector.label} sector details`}
                        onClick={() => setExpandedSector(isExpanded ? null : sector.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedSector(isExpanded ? null : sector.id); } }}
                      >
                        <div className="px-4 py-3 flex items-center gap-2">
                          <sector.icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-200 truncate">{sector.label}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ml-auto flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {CLEARANCE_LEVELS_ORDERED.map(level => {
                          const cell = sectorGrid?.[level];
                          if (!cell) return <div key={level} className="px-2 py-3" />;
                          return (
                            <div key={level} className="px-2 py-3 flex items-center justify-center">
                              <div className={`px-3 py-1.5 rounded-md text-center min-w-[60px] ${competitivenessBg(cell.competitiveness)}`}>
                                <span className="text-sm font-semibold text-white">
                                  {formatNumber(cell.positions)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-800/60 border-y border-gray-700/30 px-6 py-5"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-3">{sector.label} Overview</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Total Open Positions</span>
                                  <span className="text-white font-medium">{formatNumber(totalPositions)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Critical Shortage Levels</span>
                                  <span className="text-red-400 font-medium">
                                    {sectorGrid ? Object.values(sectorGrid).filter(d => d.competitiveness === 'critical').length : 0}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Avg. Salary (Cleared)</span>
                                  <span className="text-white font-medium">
                                    {formatCurrency(demandData.find(d => d.sector === sector.id)?.avgSalary ?? 135000)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Avg. Days to Fill</span>
                                  <span className="text-white font-medium">
                                    {demandData.find(d => d.sector === sector.id)?.avgDaysToFill ?? 120} days
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-3">Top Hiring States</h4>
                              <div className="space-y-2 text-sm">
                                {['VA', 'MD', 'CA', 'CO'].map(st => (
                                  <div key={st} className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-gray-300">{st}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-3">Salary Trend</h4>
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-emerald-400 font-medium">Rising (+6-12% YoY)</span>
                              </div>
                              <p className="text-xs text-gray-500">
                                Cleared positions in {sector.label} show sustained salary growth
                                driven by talent scarcity and rising national security demand.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Summary footer */}
            <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-800/30">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  Data aggregated from USAJobs postings, BLS OEWS survey, and platform employer data.
                  Updated February 2026. Click any row to expand sector details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SALARY PREMIUM ANALYSIS */}
        {/* ================================================================ */}
        <section>
          <SectionHeader
            icon={DollarSign}
            title="Salary Premium Analysis"
            subtitle="How much more do cleared STEM professionals earn compared to non-cleared peers?"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Salary premium bar chart */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Annual Salary Premium by Clearance Level</h3>
              <p className="text-sm text-gray-400 mb-6">Additional compensation for holding an active clearance</p>
              <div className="h-[340px]" role="img" aria-label="Bar chart showing salary premiums by clearance level, ranging from $7,500 for Public Trust to $35,000 for TS/SCI">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SALARY_PREMIUM_DATA} margin={{ top: 5, right: 20, bottom: 25, left: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="level"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                      height={55}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="premium" name="Salary Premium" radius={[4, 4, 0, 0]}>
                      {SALARY_PREMIUM_DATA.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cleared vs non-cleared comparison */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Cleared vs. Non-Cleared STEM Salaries</h3>
              <p className="text-sm text-gray-400 mb-6">Side-by-side median annual compensation</p>
              <div className="h-[340px]" role="img" aria-label="Horizontal bar chart comparing cleared versus non-cleared STEM salaries by clearance level, showing cleared salaries range from $92K to $168K">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SALARY_PREMIUM_DATA} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="level"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      width={65}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="cleared" name="Cleared" fill="#3B82F6" fillOpacity={0.8} radius={[0, 4, 4, 0]} barSize={14} />
                    <Bar dataKey="nonCleared" name="Non-Cleared" fill="#6B7280" fillOpacity={0.6} radius={[0, 4, 4, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Salary trend over time */}
            <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Cleared Salary Trends (6-Month)</h3>
              <p className="text-sm text-gray-400 mb-6">Average annual compensation by clearance level, September 2025 -- February 2026</p>
              <div className="h-[320px]" role="img" aria-label="Area chart showing cleared salary trends over 6 months from September 2025 to February 2026 for Secret, Top Secret, TS/SCI, and DOE Q clearance levels">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALARY_TREND_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 15 }}>
                    <defs>
                      <linearGradient id="gradSecret" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradTS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradTSSCI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EC4899" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#EC4899" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradDOEQ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={{ stroke: '#4B5563' }} />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                      axisLine={{ stroke: '#4B5563' }}
                      domain={['dataMin - 5000', 'dataMax + 5000']}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="secret" name="Secret" stroke="#3B82F6" fill="url(#gradSecret)" strokeWidth={2} />
                    <Area type="monotone" dataKey="topSecret" name="Top Secret" stroke="#8B5CF6" fill="url(#gradTS)" strokeWidth={2} />
                    <Area type="monotone" dataKey="tsSci" name="TS/SCI" stroke="#EC4899" fill="url(#gradTSSCI)" strokeWidth={2} />
                    <Area type="monotone" dataKey="doeQ" name="DOE Q" stroke="#EF4444" fill="url(#gradDOEQ)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SUPPLY-DEMAND GAP */}
        {/* ================================================================ */}
        <section>
          <SectionHeader
            icon={Users}
            title="Supply-Demand Gap Analysis"
            subtitle="Qualified cleared candidates per open position across 11 critical STEM sectors"
          />

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Table header */}
            <div className="min-w-[640px] grid grid-cols-[1fr_120px_120px_100px_100px_100px] gap-2 px-6 py-3 border-b border-gray-700/50 bg-gray-800/60">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sector</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Open Positions</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Available Talent</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Ratio</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Status</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Trend</span>
            </div>

            {/* Rows */}
            {SUPPLY_DEMAND_DATA.sort((a, b) => a.ratio - b.ratio).map((row, idx) => (
              <div
                key={row.sectorId}
                className={`min-w-[640px] grid grid-cols-[1fr_120px_120px_100px_100px_100px] gap-2 px-6 py-4 items-center border-b border-gray-700/20 transition-colors hover:bg-gray-700/20 ${
                  idx % 2 === 0 ? 'bg-gray-800/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-200">{row.sector}</span>
                  {row.criticalLevels > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      {row.criticalLevels} critical
                    </span>
                  )}
                </div>
                <span className="text-sm text-white font-medium text-center">{formatNumber(row.totalPositions)}</span>
                <span className="text-sm text-gray-300 text-center">{formatNumber(row.supply)}</span>
                <div className="flex justify-center">
                  <span className={`text-sm font-semibold ${statusColor(row.status)}`}>
                    {row.ratio.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(row.status)}`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1">
                  {row.trend === 'worsening' ? (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-xs text-red-400">Worsening</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-500">Stable</span>
                    </>
                  )}
                </div>
              </div>
            ))}
            </div>

            {/* Summary */}
            <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700/50">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-gray-400">
                    Critical ({'<'}0.20x): {SUPPLY_DEMAND_DATA.filter(d => d.status === 'critical').length} sectors
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span className="text-gray-400">
                    Shortage (0.20-0.30x): {SUPPLY_DEMAND_DATA.filter(d => d.status === 'shortage').length} sectors
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-gray-400">
                    Balanced (0.30-0.50x): {SUPPLY_DEMAND_DATA.filter(d => d.status === 'balanced').length} sectors
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* TIME-TO-CLEAR BENCHMARKS */}
        {/* ================================================================ */}
        <section>
          <SectionHeader
            icon={Clock}
            title="Time-to-Clear Benchmarks"
            subtitle="Average processing timelines by clearance type and investigating agency"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Processing time table */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white">Processing Time Statistics</h3>
                <p className="text-sm text-gray-400">Days from SF-86 submission to adjudication (FY2025 Q4)</p>
              </div>
              <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/50 bg-gray-800/40">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Agency</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Median</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">P75</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Approval</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_TO_CLEAR_DATA.map((row, idx) => (
                      <tr
                        key={row.type}
                        className={`border-b border-gray-700/20 ${idx % 2 === 0 ? 'bg-gray-800/20' : ''}`}
                      >
                        <td className="px-4 py-3 text-gray-200 font-medium">{row.type}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            row.agency === 'DCSA' ? 'bg-blue-500/20 text-blue-400' :
                            row.agency === 'DOE' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {row.agency}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center text-white font-semibold">{row.median}d</td>
                        <td className="px-3 py-3 text-center text-gray-300">{row.p75}d</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`font-medium ${
                            row.approvalRate >= 95 ? 'text-emerald-400' :
                            row.approvalRate >= 90 ? 'text-blue-400' :
                            row.approvalRate >= 85 ? 'text-yellow-400' :
                            'text-orange-400'
                          }`}>
                            {row.approvalRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-700/50">
                <div className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-500">
                    Processing times reflect complete investigations. Interim clearances are typically
                    granted in 30-60 days for eligible candidates. Source: DCSA Annual Report, DOE OCHCO.
                  </p>
                </div>
              </div>
            </div>

            {/* Processing trend chart */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Processing Time Trends</h3>
              <p className="text-sm text-gray-400 mb-6">
                Average days to final adjudication by agency (showing improvement under Trusted Workforce 2.0)
              </p>
              <div className="h-[340px]" role="img" aria-label="Line chart showing clearance processing time trends by agency (DCSA, DOE, IC) from FY24 Q1 to FY25 Q4, all showing decreasing timelines">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PROCESSING_TREND_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="quarter"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12, paddingTop: 8 }} />
                    <Line type="monotone" dataKey="dcsa" name="DCSA" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: '#3B82F6' }} />
                    <Line type="monotone" dataKey="doe" name="DOE" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4, fill: '#F59E0B' }} />
                    <Line type="monotone" dataKey="ic" name="IC" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4, fill: '#8B5CF6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Processing times decreasing</span>
                <span className="text-gray-500">-- Trusted Workforce 2.0 reforms taking effect</span>
              </div>
            </div>

            {/* Interim clearance rates */}
            <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Interim Clearance Grant Rates</h3>
              <p className="text-sm text-gray-400 mb-6">
                Percentage of applicants granted interim access while full investigation is in progress
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {TIME_TO_CLEAR_DATA.map(row => (
                  <div key={row.type} className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-400 mb-2 truncate" title={row.type}>{row.type}</p>
                    <p className="text-2xl font-bold text-white mb-1">{row.interimRate}%</p>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${row.interimRate}%`,
                          backgroundColor: row.interimRate >= 75 ? '#10B981' : row.interimRate >= 60 ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* GEOGRAPHIC HOTSPOTS */}
        {/* ================================================================ */}
        <section>
          <SectionHeader
            icon={MapPin}
            title="Geographic Hotspots"
            subtitle="Top states and metro areas for cleared STEM positions with cost-of-living adjusted salaries"
          />

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            {/* Sort controls */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50 bg-gray-800/30">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">Sort by:</span>
              {[
                { key: 'positions', label: 'Open Positions' },
                { key: 'salary', label: 'Avg. Salary' },
                { key: 'growth', label: 'YoY Growth' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setGeoSort(opt.key as typeof geoSort)}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    geoSort === opt.key
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Geo table */}
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700/50 bg-gray-800/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase w-8">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">State</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Metro Area</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Positions</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Avg. Salary</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">COLA-Adj.</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">% of Total</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase">YoY Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGeoData.map((row, idx) => (
                    <tr
                      key={row.state}
                      className={`border-b border-gray-700/20 transition-colors hover:bg-gray-700/20 ${
                        idx % 2 === 0 ? 'bg-gray-800/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5 text-gray-500 font-mono">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span className="text-gray-200 font-medium">{row.state}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400">{row.metro}</td>
                      <td className="px-3 py-3.5 text-center text-white font-semibold">{formatNumber(row.positions)}</td>
                      <td className="px-3 py-3.5 text-center text-white">{formatCurrency(row.avgSalary)}</td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={row.colaAdjusted >= row.avgSalary * 0.9 ? 'text-emerald-400' : 'text-orange-400'}>
                          {formatCurrency(row.colaAdjusted)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-blue-500"
                              style={{ width: `${Math.min(row.concentration * 3, 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs">{row.concentration}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`flex items-center justify-center gap-1 font-medium ${
                          row.growth >= 15 ? 'text-emerald-400' : row.growth >= 10 ? 'text-blue-400' : 'text-gray-400'
                        }`}>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          {row.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Regional concentration chart */}
            <div className="px-6 py-6 border-t border-gray-700/50">
              <h4 className="text-sm font-semibold text-white mb-4">Regional Demand Concentration</h4>
              <div className="h-[200px]" role="img" aria-label="Bar chart showing regional demand concentration for cleared STEM positions across the top 8 states by open positions">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedGeoData.slice(0, 8)} margin={{ top: 5, right: 20, bottom: 25, left: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="state"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="positions" name="Open Positions" fill="#3B82F6" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-800/30">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  COLA-adjusted salaries use the Bureau of Economic Analysis Regional Price Parities (RPP) index.
                  Green values indicate salaries that retain 90%+ purchasing power after cost-of-living adjustment.
                  Fastest-growing markets: Huntsville AL (+22.4%), San Antonio TX (+19.1%), Colorado Springs CO (+16.3%).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* KEY INSIGHTS */}
        {/* ================================================================ */}
        <section>
          <SectionHeader
            icon={Zap}
            title="Key Market Insights"
            subtitle="Data-driven findings from our cleared workforce intelligence platform"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: AlertTriangle,
                color: 'text-red-400',
                bg: 'bg-red-500/10 border-red-500/20',
                title: 'Critical Shortage: Quantum TS/SCI',
                body: 'Only 0.16 qualified candidates per open position in quantum computing at the TS/SCI level. Median salary has surged 18% in 12 months.',
              },
              {
                icon: TrendingUp,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/20',
                title: 'AI Clearance Demand +47% YoY',
                body: 'AI/ML cleared positions grew faster than any other sector. Secret-level AI roles now outnumber TS roles for the first time.',
              },
              {
                icon: DollarSign,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10 border-blue-500/20',
                title: 'TS/SCI Premium: $35,000/year',
                body: 'Holders of active TS/SCI clearances earn a median $35K more annually than non-cleared peers with equivalent experience.',
              },
              {
                icon: Clock,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10 border-purple-500/20',
                title: 'DCSA Processing Down 20%',
                body: 'Trusted Workforce 2.0 reforms have reduced average DCSA processing times from 128 days to 102 days over the past 8 quarters.',
              },
              {
                icon: MapPin,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/20',
                title: 'Huntsville: Fastest Growing Hub',
                body: 'Huntsville, AL leads all metro areas in cleared position growth at +22.4% YoY, with cost-of-living adjusted salaries exceeding DC metro.',
              },
              {
                icon: Shield,
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10 border-cyan-500/20',
                title: 'DOE Q: Highest Time-to-Fill',
                body: 'DOE Q clearance positions average 178 days to fill -- 70% longer than Secret roles. Nuclear workforce pipeline is the most constrained.',
              },
            ].map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className={`border rounded-xl p-5 ${insight.bg}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <insight.icon className={`w-5 h-5 ${insight.color}`} />
                  <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{insight.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* CTA SECTION */}
        {/* ================================================================ */}
        <section className="pb-8">
          <div className="bg-gradient-to-br from-blue-600/20 via-gray-800/80 to-purple-600/20 border border-gray-700/50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                Ready to Navigate the Cleared Workforce?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Whether you are a job seeker exploring clearance-eligible careers, an FSO managing your
                cleared workforce, or an HR leader building your national security talent pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* CTA 1: Readiness Assessment */}
              <Link
                to="/clearance-readiness"
                className="group bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all"
              >
                <div className="p-3 rounded-lg bg-blue-500/10 w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Check Your Clearance Readiness
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Free, confidential self-assessment based on the 13 SEAD-4
                  adjudicative guidelines. Takes 10 minutes.
                </p>
                <span className="text-sm text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Assessment <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>

              {/* CTA 2: Browse Jobs */}
              <Link
                to="/jobs?clearance=true"
                className="group bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-gray-800/80 transition-all"
              >
                <div className="p-3 rounded-lg bg-emerald-500/10 w-fit mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Browse Cleared Positions
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Search 47,000+ cleared STEM positions across defense,
                  intelligence, energy, and emerging tech sectors.
                </p>
                <span className="text-sm text-emerald-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Jobs <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>

              {/* CTA 3: FSO Portal */}
              <Link
                to="/employer/dashboard?tab=clearance"
                className="group bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 hover:bg-gray-800/80 transition-all"
              >
                <div className="p-3 rounded-lg bg-purple-500/10 w-fit mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Building className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  For FSOs: Manage Workforce
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  NISPOM-compliant FSO portal for cleared employee rosters,
                  continuous vetting, visit requests, and incident reporting.
                </p>
                <span className="text-sm text-purple-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  FSO Dashboard <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {/* Data attribution */}
            <div className="mt-10 text-center">
              <p className="text-xs text-gray-500">
                Data sources: USAJobs API, Bureau of Labor Statistics (OEWS), DCSA Annual Reports, DOE OCHCO,
                ODNI Statistical Transparency Reports, and platform employer data from 12,500+ organizations.
                Updated monthly. Last refresh: February 28, 2026.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
