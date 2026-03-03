// ===========================================
// Employer Dashboard - Analytics Tab
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, DollarSign, Target, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const TIME_TO_FILL = [
  { month: 'Jul', days: 52 }, { month: 'Aug', days: 48 }, { month: 'Sep', days: 45 },
  { month: 'Oct', days: 44 }, { month: 'Nov', days: 43 }, { month: 'Dec', days: 46 },
  { month: 'Jan', days: 41 }, { month: 'Feb', days: 42 }, { month: 'Mar', days: 38 },
];

const SOURCE_EFFECTIVENESS = [
  { source: 'Platform', applicants: 890, hires: 52, cost: 1200, quality: 94 },
  { source: 'Career Fairs', applicants: 456, hires: 34, cost: 3400, quality: 88 },
  { source: 'University', applicants: 534, hires: 28, cost: 2100, quality: 91 },
  { source: 'Referrals', applicants: 312, hires: 24, cost: 800, quality: 96 },
  { source: 'Direct', applicants: 198, hires: 11, cost: 4500, quality: 82 },
];

const DIVERSITY_DATA = [
  { category: 'Women', value: 38, color: '#EC4899' },
  { category: 'URM', value: 24, color: '#8B5CF6' },
  { category: 'Veterans', value: 12, color: '#F59E0B' },
  { category: 'Disability', value: 6, color: '#10B981' },
];

const COST_TREND = [
  { month: 'Jul', cost: 5200 }, { month: 'Aug', cost: 4800 }, { month: 'Sep', cost: 4600 },
  { month: 'Oct', cost: 4400 }, { month: 'Nov', cost: 4500 }, { month: 'Dec', cost: 4700 },
  { month: 'Jan', cost: 4200 }, { month: 'Feb', cost: 4250 }, { month: 'Mar', cost: 3900 },
];

const OFFER_ACCEPTANCE = [
  { month: 'Jul', rate: 82 }, { month: 'Aug', rate: 85 }, { month: 'Sep', rate: 84 },
  { month: 'Oct', rate: 87 }, { month: 'Nov', rate: 86 }, { month: 'Dec', rate: 88 },
  { month: 'Jan', rate: 89 }, { month: 'Feb', rate: 89 }, { month: 'Mar', rate: 91 },
];

const AnalyticsTab: React.FC = () => {
  const [showToast, setShowToast] = useState('');
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '1y'>('90d');

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {showToast}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {([['30d', '30 Days'], ['90d', '90 Days'], ['1y', '1 Year']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setDateRange(key as '30d' | '90d' | '1y')} className={`px-4 py-2 text-sm font-medium transition-colors ${dateRange === key ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => triggerToast('Analytics report download started!')} className="bg-gray-900 border border-gray-800 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Avg Time-to-Fill', value: '42 days', change: '-5 days', trend: 'down', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          { label: 'Cost per Hire', value: '$4,250', change: '-12%', trend: 'down', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          { label: 'Offer Acceptance', value: '89%', change: '+4%', trend: 'up', icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { label: 'Quality of Hire', value: '4.3/5', change: '+0.2', trend: 'up', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <span className="text-gray-400 text-sm">{kpi.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${kpi.color}`}>
              {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.change} vs last quarter
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Time-to-Fill Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={TIME_TO_FILL}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="days" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} name="Days" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Cost per Hire Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={COST_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Cost']} />
              <Area type="monotone" dataKey="cost" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Effectiveness */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Source Effectiveness</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium py-2">Source</th>
                  <th className="text-right text-gray-400 font-medium py-2">Applicants</th>
                  <th className="text-right text-gray-400 font-medium py-2">Hires</th>
                  <th className="text-right text-gray-400 font-medium py-2">Cost/Hire</th>
                  <th className="text-right text-gray-400 font-medium py-2">Quality</th>
                </tr>
              </thead>
              <tbody>
                {SOURCE_EFFECTIVENESS.map((source) => (
                  <tr key={source.source} className="border-b border-gray-800/50">
                    <td className="py-3 text-white font-medium">{source.source}</td>
                    <td className="py-3 text-right text-gray-300">{source.applicants}</td>
                    <td className="py-3 text-right text-white font-medium">{source.hires}</td>
                    <td className="py-3 text-right text-gray-300">${source.cost.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className={`font-medium ${source.quality >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{source.quality}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Diversity Pipeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Diversity Pipeline</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={DIVERSITY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {DIVERSITY_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} formatter={(v: number) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {DIVERSITY_DATA.map((d) => (
              <div key={d.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-400">{d.category}</span>
                </div>
                <span className="text-white font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Offer Acceptance Rate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Offer Acceptance Rate</h3>
          <button onClick={() => triggerToast('Chart data exported!')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"><Download className="w-3 h-3" /> Export</button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={OFFER_ACCEPTANCE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[75, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} formatter={(v: number) => [`${v}%`, 'Rate']} />
            <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;
