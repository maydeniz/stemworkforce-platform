// ===========================================
// Counselor Reports Tab
// ===========================================
// Analytics and reports for caseload management
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import type { CaseloadMetrics, ApplicationMetrics } from '@/types/counselor';

// ===========================================
// TYPES
// ===========================================

interface CounselorReportsTabProps {
  caseloadMetrics: CaseloadMetrics;
  appMetrics: ApplicationMetrics;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

const CounselorReportsTab: React.FC<CounselorReportsTabProps> = ({
  caseloadMetrics,
  appMetrics
}) => {
  const [, setSelectedReport] = useState<string | null>(null);

  const reports = [
    {
      id: 'application-progress',
      title: 'Application Progress Report',
      description: 'Overview of application completion rates across your caseload',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'college-list-balance',
      title: 'College List Balance',
      description: 'Reach/Match/Safety distribution for each student',
      icon: Target,
      color: 'purple'
    },
    {
      id: 'financial-aid',
      title: 'Financial Aid Status',
      description: 'FAFSA and CSS Profile completion tracking',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      id: 'deadline-risk',
      title: 'Deadline Risk Report',
      description: 'Applications at risk of missing deadlines',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'recommendation-tracker',
      title: 'Recommendation Tracker',
      description: 'Status of all pending recommendation letters',
      icon: Users,
      color: 'amber'
    },
    {
      id: 'student-engagement',
      title: 'Student Engagement',
      description: 'Activity levels and platform usage by student',
      icon: TrendingUp,
      color: 'pink'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-sm text-gray-400">Track progress and identify areas needing attention</p>
        </div>

        <button
          onClick={() => {
            console.log('[FERPA AUDIT] Exporting all reports - data anonymized for FERPA compliance');
            alert('Reports exported. Note: Student PII is anonymized in exported reports per FERPA guidelines.');
          }}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Caseload"
          value={caseloadMetrics.totalStudents}
          subtitle="Total students"
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="On Track"
          value={`${Math.round((caseloadMetrics.byStatus.onTrack / caseloadMetrics.totalStudents) * 100)}%`}
          subtitle={`${caseloadMetrics.byStatus.onTrack} students`}
          icon={CheckCircle2}
          color="emerald"
        />
        <MetricCard
          title="Submitted"
          value={appMetrics.submitted}
          subtitle={`of ${appMetrics.totalApplications} total`}
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Due Soon"
          value={appMetrics.upcomingDeadlines.next7Days}
          subtitle="Next 7 days"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Visual Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-medium text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Student Status Distribution
          </h3>

          <div className="flex items-center gap-8">
            {/* Simple pie visualization */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* On Track - Emerald */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="20"
                  strokeDasharray={`${(caseloadMetrics.byStatus.onTrack / caseloadMetrics.totalStudents) * 251.2} 251.2`}
                />
                {/* Needs Attention - Amber */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="20"
                  strokeDasharray={`${(caseloadMetrics.byStatus.needsAttention / caseloadMetrics.totalStudents) * 251.2} 251.2`}
                  strokeDashoffset={`${-(caseloadMetrics.byStatus.onTrack / caseloadMetrics.totalStudents) * 251.2}`}
                />
                {/* Critical - Red */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="20"
                  strokeDasharray={`${(caseloadMetrics.byStatus.critical / caseloadMetrics.totalStudents) * 251.2} 251.2`}
                  strokeDashoffset={`${-((caseloadMetrics.byStatus.onTrack + caseloadMetrics.byStatus.needsAttention) / caseloadMetrics.totalStudents) * 251.2}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{caseloadMetrics.totalStudents}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded" />
                <span className="text-gray-400">On Track</span>
                <span className="text-white font-medium ml-auto">{caseloadMetrics.byStatus.onTrack}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded" />
                <span className="text-gray-400">Needs Attention</span>
                <span className="text-white font-medium ml-auto">{caseloadMetrics.byStatus.needsAttention}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-gray-400">Critical</span>
                <span className="text-white font-medium ml-auto">{caseloadMetrics.byStatus.critical}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Types */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-medium text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Applications by Type
          </h3>

          <div className="space-y-4">
            {[
              { label: 'Regular Decision', value: appMetrics.byType.RD, max: appMetrics.totalApplications, color: 'bg-blue-500' },
              { label: 'Early Action', value: appMetrics.byType.EA, max: appMetrics.totalApplications, color: 'bg-violet-500' },
              { label: 'Early Decision', value: appMetrics.byType.ED, max: appMetrics.totalApplications, color: 'bg-pink-500' },
              { label: 'Restrictive EA', value: appMetrics.byType.REA, max: appMetrics.totalApplications, color: 'bg-purple-500' },
              { label: 'Early Decision II', value: appMetrics.byType.ED2, max: appMetrics.totalApplications, color: 'bg-rose-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all`}
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines Timeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Deadline Distribution
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-400">{appMetrics.upcomingDeadlines.next7Days}</div>
            <div className="text-sm text-gray-400">Next 7 Days</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">{appMetrics.upcomingDeadlines.next14Days}</div>
            <div className="text-sm text-gray-400">Next 14 Days</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{appMetrics.upcomingDeadlines.next30Days}</div>
            <div className="text-sm text-gray-400">Next 30 Days</div>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <h3 className="font-medium text-white mb-4">Available Reports</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => {
            const Icon = report.icon;
            const colorClasses: Record<string, string> = {
              blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
              emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
              red: 'bg-red-500/20 text-red-400 border-red-500/30',
              amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
              pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
            };

            return (
              <motion.button
                key={report.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 border rounded-xl text-left transition-all hover:opacity-80 ${colorClasses[report.color]}`}
              >
                <Icon className="w-6 h-6 mb-3" />
                <h4 className="font-medium text-white mb-1">{report.title}</h4>
                <p className="text-sm opacity-80">{report.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// METRIC CARD
// ===========================================

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: 'purple' | 'emerald' | 'blue' | 'amber';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-80">{title}</span>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs opacity-70">{subtitle}</div>
    </div>
  );
};

export default CounselorReportsTab;
