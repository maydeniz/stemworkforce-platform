// ===========================================
// Career Q&A Insights Widget
// Tag cloud, industry distribution, scenario charts
// Uses recharts (already installed)
// ===========================================

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Tag, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useCareerQAStats, useCareerQAPopularTags } from '@/hooks/useCareerQA';
import { SCENARIO_DISPLAY_NAMES } from '@/types/careernet';
import CareerNetAttribution from './CareerNetAttribution';

const INDUSTRY_COLORS: Record<string, string> = {
  ai: '#3B82F6',
  cybersecurity: '#EF4444',
  'clean-energy': '#10B981',
  biotech: '#8B5CF6',
  aerospace: '#F59E0B',
  semiconductor: '#EC4899',
  quantum: '#6366F1',
  manufacturing: '#14B8A6',
  nuclear: '#F97316',
  healthcare: '#06B6D4',
  robotics: '#84CC16',
};

const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6'];

interface CareerQAInsightsProps {
  className?: string;
  compact?: boolean;
}

const CareerQAInsights: React.FC<CareerQAInsightsProps> = ({ className = '', compact = false }) => {
  const { data: stats, isLoading } = useCareerQAStats();
  const { data: popularTags } = useCareerQAPopularTags(30);

  // Format industry data for bar chart
  const industryChartData = useMemo(() => {
    if (!stats?.byIndustry.length) return [];
    return stats.byIndustry.slice(0, 8).map((item) => ({
      name: item.industry.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      count: item.count,
      fill: INDUSTRY_COLORS[item.industry] || '#6B7280',
    }));
  }, [stats]);

  // Format scenario data for pie chart
  const scenarioChartData = useMemo(() => {
    if (!stats?.byScenario.length) return [];
    return stats.byScenario.slice(0, 8).map((item, idx) => ({
      name: SCENARIO_DISPLAY_NAMES[item.scenario] || item.scenario,
      value: item.count,
      fill: PIE_COLORS[idx % PIE_COLORS.length],
    }));
  }, [stats]);

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="bg-gray-800/50 rounded-xl h-48" />
        <div className="bg-gray-800/50 rounded-xl h-48" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500">Total Q&A</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalPairs.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500">Avg Quality</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgQuality.toFixed(1)}<span className="text-sm text-gray-500">/4.0</span></p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <PieChartIcon className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500">Industries</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.byIndustry.length || 11}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-500">Scenarios</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.byScenario.length || 18}</p>
        </div>
      </div>

      {!compact && (
        <>
          {/* Industry Distribution Chart */}
          {industryChartData.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-medium text-white mb-4">Q&A by Industry</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={industryChartData} layout="vertical" margin={{ left: 100 }}>
                  <XAxis type="number" stroke="#6B7280" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#6B7280" fontSize={11} width={95} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {industryChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Scenario Distribution Donut */}
          {scenarioChartData.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-medium text-white mb-4">Q&A by Career Scenario</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={scenarioChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {scenarioChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  {scenarioChartData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                      <span className="text-xs text-gray-400 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tag Cloud */}
          {popularTags && popularTags.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-medium text-white mb-4">Popular Career Topics</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(({ tag, count }) => {
                  const maxCount = popularTags[0].count;
                  const scale = 0.7 + (count / maxCount) * 0.6;
                  return (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md border border-white/5"
                      style={{ fontSize: `${scale}rem` }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <CareerNetAttribution compact className="mt-4" />
    </div>
  );
};

export default CareerQAInsights;
