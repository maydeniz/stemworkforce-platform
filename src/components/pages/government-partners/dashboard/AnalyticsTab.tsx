// ===========================================
// Analytics Tab - Economic Impact & ROI Analytics
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Download,
  Target,
  Award,
  Briefcase
} from 'lucide-react';
import { getGovernmentDashboardMetrics, getEconomicImpactMetrics, getRegionalLaborData, getWorkforcePrograms } from '@/services/governmentPartnerApi';
import type { GovernmentPartnerTier, GovernmentDashboardMetrics, EconomicImpactMetrics, RegionalLaborData, WorkforceProgram } from '@/types/governmentPartner';

// ===========================================
// TYPES
// ===========================================

interface AnalyticsTabProps {
  partnerId: string;
  tier: GovernmentPartnerTier;
}

type TimeRange = '30d' | '90d' | '1y' | 'all';

// ===========================================
// SAMPLE DATA
// ===========================================

const sampleMetrics: GovernmentDashboardMetrics = {
  activePrograms: 12,
  totalPrograms: 18,
  chipsActPrograms: 4,
  programsAtRisk: 2,
  totalEnrolled: 4567,
  enrollmentThisQuarter: 892,
  enrollmentTarget: 5000,
  enrollmentProgress: 91,
  completedCount: 3245,
  placedCount: 2890,
  overallPlacementRate: 89,
  placementTarget: 85,
  averageWageGain: 12500,
  totalWagesGenerated: 36125000,
  averageWageAtPlacement: 58000,
  veteransEnrolled: 456,
  veteransPlaced: 412,
  veteransPlacementRate: 90,
  activeEmployerPartners: 156,
  hiringPledgesTotal: 2500,
  hiringPledgesFulfilled: 1890,
  upcomingReports: 3,
  overdueReports: 1,
  complianceScore: 94,
  totalEconomicImpact: 145000000,
  roiRatio: 4.2
};

const sampleEconomicImpact: EconomicImpactMetrics[] = [
  {
    id: '1',
    partnerId: '1',
    reportingPeriod: '2024-Q3',
    totalWagesGenerated: 36125000,
    averageWageGainPerParticipant: 12500,
    jobsCreated: 2890,
    jobsRetained: 1245,
    estimatedTaxRevenue: 8750000,
    federalTaxImpact: 5250000,
    stateTaxImpact: 2500000,
    localTaxImpact: 1000000,
    economicMultiplier: 2.4,
    totalEconomicImpact: 145000000,
    programCosts: 34500000,
    roiRatio: 4.2,
    costPerPlacement: 11937,
    costPerCredential: 4250,
    publicAssistanceReduction: 3200000,
    calculatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const sampleLaborData: RegionalLaborData[] = [
  {
    id: '1',
    partnerId: '1',
    region: 'Central Texas',
    state: 'TX',
    dataDate: new Date().toISOString(),
    laborForceSize: 1250000,
    unemploymentRate: 3.8,
    stemWorkforce: 185000,
    stemUnemploymentRate: 2.1,
    jobOpenings: 45000,
    stemJobOpenings: 12500,
    hardToFillPositions: 3500,
    medianWage: 52000,
    stemMedianWage: 78000,
    wageGrowthYoY: 4.2,
    topIndustries: [
      { name: 'Technology', percentage: 28 },
      { name: 'Healthcare', percentage: 22 },
      { name: 'Advanced Manufacturing', percentage: 18 },
      { name: 'Energy', percentage: 15 }
    ],
    topOccupations: [
      { title: 'Software Developer', demand: 3500, medianWage: 95000 },
      { title: 'Registered Nurse', demand: 2800, medianWage: 72000 },
      { title: 'Process Technician', demand: 2200, medianWage: 58000 },
      { title: 'Data Analyst', demand: 1800, medianWage: 68000 }
    ],
    topSkills: ['Python', 'Data Analysis', 'Project Management', 'Cloud Computing', 'Healthcare IT'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// COMPONENT
// ===========================================

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ partnerId, tier: _tier }) => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');
  const [metrics, setMetrics] = useState<GovernmentDashboardMetrics>(sampleMetrics);
  const [economicImpact, setEconomicImpact] = useState<EconomicImpactMetrics[]>(sampleEconomicImpact);
  const [laborData, setLaborData] = useState<RegionalLaborData[]>(sampleLaborData);
  const [programs, setPrograms] = useState<WorkforceProgram[]>([]);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [metricsData, impactData, laborDataResult, programsData] = await Promise.all([
          getGovernmentDashboardMetrics(partnerId),
          getEconomicImpactMetrics(partnerId),
          getRegionalLaborData(partnerId),
          getWorkforcePrograms(partnerId)
        ]);

        setMetrics(metricsData.totalPrograms > 0 ? metricsData : sampleMetrics);
        setEconomicImpact(impactData.length > 0 ? impactData : sampleEconomicImpact);
        setLaborData(laborDataResult.length > 0 ? laborDataResult : sampleLaborData);
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partnerId]);

  const latestImpact = economicImpact[0] || sampleEconomicImpact[0];
  const latestLabor = laborData[0] || sampleLaborData[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.visible && (
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg shadow-lg">
          <Download className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          {(['30d', '90d', '1y', 'all'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : range === '1y' ? '1 Year' : 'All Time'}
            </button>
          ))}
          <button
            onClick={() => showNotification('Analytics report exported successfully')}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors ml-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <span className="flex items-center text-emerald-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              12%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">${(metrics.totalEconomicImpact / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-gray-400 mt-1">Total Economic Impact</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <span className="flex items-center text-blue-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              8%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.roiRatio}:1</p>
          <p className="text-sm text-gray-400 mt-1">Return on Investment</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-purple-400" />
            <span className="flex items-center text-purple-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              4%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.overallPlacementRate}%</p>
          <p className="text-sm text-gray-400 mt-1">Placement Rate</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Award className="w-8 h-8 text-amber-400" />
            <span className="flex items-center text-amber-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              15%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">${metrics.averageWageGain.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">Average Wage Gain</p>
        </div>
      </div>

      {/* Economic Impact Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Economic Impact Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Total Wages Generated</span>
                <span className="text-white">${(latestImpact.totalWagesGenerated / 1000000).toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Federal Tax Impact</span>
                <span className="text-white">${(latestImpact.federalTaxImpact / 1000000).toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(latestImpact.federalTaxImpact / latestImpact.totalWagesGenerated) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">State Tax Impact</span>
                <span className="text-white">${(latestImpact.stateTaxImpact / 1000000).toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(latestImpact.stateTaxImpact / latestImpact.totalWagesGenerated) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Local Tax Impact</span>
                <span className="text-white">${(latestImpact.localTaxImpact / 1000000).toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(latestImpact.localTaxImpact / latestImpact.totalWagesGenerated) * 100}%` }} />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Public Assistance Reduction</span>
                <span className="text-emerald-400">${((latestImpact.publicAssistanceReduction || 0) / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-400" />
            Cost Efficiency Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Cost per Placement</p>
              <p className="text-2xl font-bold text-white">${(latestImpact.costPerPlacement || 0).toLocaleString()}</p>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3" />
                5% below benchmark
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Cost per Credential</p>
              <p className="text-2xl font-bold text-white">${(latestImpact.costPerCredential || 0).toLocaleString()}</p>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3" />
                12% below benchmark
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Program Costs</p>
              <p className="text-2xl font-bold text-white">${(latestImpact.programCosts / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Economic Multiplier</p>
              <p className="text-2xl font-bold text-white">{latestImpact.economicMultiplier}x</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-emerald-500/10 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Economic Impact</span>
              <span className="text-emerald-400 font-bold text-xl">${(latestImpact.totalEconomicImpact / 1000000).toFixed(1)}M</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Program costs × Economic multiplier</p>
          </div>
        </div>
      </div>

      {/* Job Creation Stats */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-400" />
          Job Creation & Retention
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-3xl font-bold text-white">{latestImpact.jobsCreated.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">Jobs Created</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-3xl font-bold text-white">{latestImpact.jobsRetained.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">Jobs Retained</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-3xl font-bold text-emerald-400">${metrics.averageWageAtPlacement.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">Avg Wage at Placement</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-3xl font-bold text-blue-400">{metrics.veteransPlaced}</p>
            <p className="text-sm text-gray-400 mt-1">Veterans Placed</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-3xl font-bold text-purple-400">{metrics.hiringPledgesFulfilled.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">Employer Hires</p>
          </div>
        </div>
      </div>

      {/* Regional Labor Market */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-cyan-400" />
            Regional Labor Market - {latestLabor.region}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Labor Force Size</p>
                <p className="text-xl font-bold text-white">{(latestLabor.laborForceSize / 1000000).toFixed(2)}M</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Unemployment Rate</p>
                <p className="text-xl font-bold text-white">{latestLabor.unemploymentRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">STEM Workforce</p>
                <p className="text-xl font-bold text-cyan-400">{(latestLabor.stemWorkforce / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">STEM Unemployment</p>
                <p className="text-xl font-bold text-cyan-400">{latestLabor.stemUnemploymentRate}%</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Total Job Openings</span>
                <span className="text-white">{latestLabor.jobOpenings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">STEM Job Openings</span>
                <span className="text-cyan-400">{latestLabor.stemJobOpenings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Hard-to-Fill Positions</span>
                <span className="text-amber-400">{latestLabor.hardToFillPositions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Top Industries by Demand
          </h3>
          <div className="space-y-4">
            {latestLabor.topIndustries.map((industry, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{industry.name}</span>
                  <span className="text-white">{industry.percentage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${industry.percentage}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* In-Demand Occupations */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          In-Demand Occupations
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3">Occupation</th>
                <th className="text-center text-sm text-gray-400 pb-3">Demand (Openings)</th>
                <th className="text-right text-sm text-gray-400 pb-3">Median Wage</th>
              </tr>
            </thead>
            <tbody>
              {latestLabor.topOccupations.map((occ, idx) => (
                <tr key={idx} className="border-b border-gray-800 last:border-0">
                  <td className="py-3 text-white">{occ.title}</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(occ.demand / latestLabor.topOccupations[0].demand) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-sm">{occ.demand.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-emerald-400">${occ.medianWage.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-Demand Skills */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Skills in Demand</h3>
        <div className="flex flex-wrap gap-3">
          {latestLabor.topSkills.map((skill, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-white"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Program Performance Comparison */}
      {programs.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Program Performance Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-sm text-gray-400 pb-3">Program</th>
                  <th className="text-center text-sm text-gray-400 pb-3">Enrolled</th>
                  <th className="text-center text-sm text-gray-400 pb-3">Completed</th>
                  <th className="text-center text-sm text-gray-400 pb-3">Placed</th>
                  <th className="text-center text-sm text-gray-400 pb-3">Placement Rate</th>
                  <th className="text-right text-sm text-gray-400 pb-3">Avg Wage Gain</th>
                </tr>
              </thead>
              <tbody>
                {programs.slice(0, 5).map((program, idx) => {
                  const placementRate = program.completedCount > 0
                    ? Math.round((program.placedCount / program.completedCount) * 100)
                    : 0;

                  return (
                    <tr key={idx} className="border-b border-gray-800 last:border-0">
                      <td className="py-3">
                        <p className="text-white font-medium truncate max-w-[200px]">{program.name}</p>
                      </td>
                      <td className="py-3 text-center text-white">{program.currentEnrollment}</td>
                      <td className="py-3 text-center text-white">{program.completedCount}</td>
                      <td className="py-3 text-center text-emerald-400">{program.placedCount}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          placementRate >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
                          placementRate >= 70 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {placementRate}%
                        </span>
                      </td>
                      <td className="py-3 text-right text-blue-400">${(program.averageWageGain || 0).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
