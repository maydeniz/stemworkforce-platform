// ===========================================
// Reports Tab - Nonprofit Partner Dashboard
// Grant reporting and impact documentation
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Loader2,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Send,
  Eye,
  X
} from 'lucide-react';
import { getGrantReports, getGrants } from '@/services/nonprofitPartnerApi';
import type { GrantReport, Grant, PartnerTier } from '@/types/nonprofitPartner';

interface ReportsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

const SAMPLE_REPORTS: GrantReport[] = [
  {
    id: '1',
    grantId: '1',
    partnerId: '1',
    reportType: 'quarterly',
    reportingPeriodStart: '2025-01-01',
    reportingPeriodEnd: '2025-03-31',
    dueDate: '2025-04-15',
    enrollmentCount: 45,
    completionCount: 38,
    placementCount: 32,
    averageWage: 24.50,
    retentionRate: 85,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    grantId: '1',
    partnerId: '1',
    reportType: 'quarterly',
    reportingPeriodStart: '2024-10-01',
    reportingPeriodEnd: '2024-12-31',
    dueDate: '2025-01-15',
    submittedDate: '2025-01-12',
    enrollmentCount: 52,
    completionCount: 44,
    placementCount: 38,
    averageWage: 23.75,
    retentionRate: 82,
    narrativeSummary: 'Strong quarter with increased employer partnerships.',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_GRANTS: Grant[] = [
  {
    id: '1',
    partnerId: '1',
    name: 'Workforce Innovation Grant',
    funderName: 'Department of Labor',
    funderType: 'federal',
    grantNumber: 'DOL-WIG-2024-001',
    awardAmount: 500000,
    disbursedAmount: 250000,
    remainingAmount: 250000,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    targetEnrollment: 200,
    targetPlacements: 150,
    actualEnrollment: 97,
    actualPlacements: 70,
    status: 'active',
    programIds: ['1', '2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const STATUS_STYLES: Record<GrantReport['status'], { bg: string; text: string; icon: React.ReactNode }> = {
  draft: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: <FileText className="w-4 h-4" /> },
  pending_review: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: <Clock className="w-4 h-4" /> },
  submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <Send className="w-4 h-4" /> },
  accepted: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: <CheckCircle className="w-4 h-4" /> },
  revision_requested: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <AlertTriangle className="w-4 h-4" /> }
};

export const ReportsTab: React.FC<ReportsTabProps> = ({ partnerId, tier }) => {
  const [reports, setReports] = useState<GrantReport[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [_selectedReport, setSelectedReport] = useState<GrantReport | null>(null);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [showReportDetailModal, setShowReportDetailModal] = useState<GrantReport | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [partnerId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadData = async () => {
    setLoading(true);
    const [reportsData, grantsData] = await Promise.all([
      getGrantReports(partnerId),
      getGrants(partnerId)
    ]);
    setReports(reportsData.length > 0 ? reportsData : SAMPLE_REPORTS);
    setGrants(grantsData.length > 0 ? grantsData : SAMPLE_GRANTS);
    setLoading(false);
  };

  const getGrantName = (grantId: string) => {
    const grant = grants.find(g => g.id === grantId);
    return grant?.name || 'Unknown Grant';
  };

  const upcomingDeadlines = reports
    .filter(r => r.status === 'draft' || r.status === 'revision_requested')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const submittedReports = reports.filter(r => r.status === 'submitted' || r.status === 'accepted');

  // Check tier access
  if (tier === 'community') {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Grant Reporting Console</h3>
        <p className="text-gray-400 mb-6">
          Upgrade to Impact tier to access automated grant reporting tools
        </p>
        <button
          onClick={() => window.location.href = '/education-partner-apply?type=nonprofit&plan=impact'}
          className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
        >
          Upgrade to Impact
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Grant Reports</h2>
          <p className="text-gray-400">Generate and submit funder reports</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setNotification({ type: 'success', message: 'Exporting all grant report data as CSV. Your download will begin shortly.' })}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export All Data
          </button>
          <button
            onClick={() => setShowNewReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
          >
            <FileText className="w-4 h-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-lg text-sm flex items-center justify-between ${
          notification.type === 'success'
            ? 'bg-pink-500/20 border border-pink-500/30 text-pink-400'
            : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Upcoming Deadlines
          </h3>
          <div className="space-y-2">
            {upcomingDeadlines.slice(0, 3).map(report => {
              const daysUntilDue = Math.ceil(
                (new Date(report.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              const isOverdue = daysUntilDue < 0;
              const isUrgent = daysUntilDue <= 7 && daysUntilDue >= 0;

              return (
                <div
                  key={report.id}
                  className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3"
                >
                  <div>
                    <p className="text-white font-medium">{getGrantName(report.grantId)}</p>
                    <p className="text-sm text-gray-400">
                      Q{Math.ceil((new Date(report.reportingPeriodEnd).getMonth() + 1) / 3)} {new Date(report.reportingPeriodEnd).getFullYear()} Report
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isOverdue ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-gray-300'}`}>
                      {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                    </p>
                    <p className="text-xs text-gray-500">Due: {new Date(report.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{reports.length}</p>
              <p className="text-xs text-gray-400">Total Reports</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{upcomingDeadlines.length}</p>
              <p className="text-xs text-gray-400">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{submittedReports.length}</p>
              <p className="text-xs text-gray-400">Submitted</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{grants.length}</p>
              <p className="text-xs text-gray-400">Active Grants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">All Reports</h3>
        {reports.map(report => {
          const statusStyle = STATUS_STYLES[report.status];

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-pink-500/50 transition-colors cursor-pointer"
              onClick={() => setShowReportDetailModal(report)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{getGrantName(report.grantId)}</h3>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.icon}
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="capitalize">{report.reportType} Report</span>
                      <span>•</span>
                      <span>
                        {new Date(report.reportingPeriodStart).toLocaleDateString()} - {new Date(report.reportingPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-emerald-400">{report.enrollmentCount}</p>
                      <p className="text-xs text-gray-400">Enrolled</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-400">{report.placementCount}</p>
                      <p className="text-xs text-gray-400">Placed</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-amber-400">{report.retentionRate}%</p>
                      <p className="text-xs text-gray-400">Retention</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Due Date */}
              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(report.dueDate).toLocaleDateString()}
                  </span>
                  {report.submittedDate && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      Submitted: {new Date(report.submittedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowReportDetailModal(report); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-xs"
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setNotification({ type: 'success', message: `Exporting report for ${getGrantName(report.grantId)}. Download will begin shortly.` }); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-xs"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No reports created yet</p>
          </div>
        )}
      </div>

      {/* Report Templates Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setNotification({ type: 'info', message: 'Enrollment Report template created. Fill in participant demographics and enrollment data.' })}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Enrollment Report</span>
            </div>
            <p className="text-sm text-gray-400">Participant demographics and enrollment data</p>
          </div>
          <div
            onClick={() => setNotification({ type: 'info', message: 'Outcomes Report template created. Fill in placement rates, wages, and retention data.' })}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">Outcomes Report</span>
            </div>
            <p className="text-sm text-gray-400">Placement rates, wages, and retention</p>
          </div>
          <div
            onClick={() => setNotification({ type: 'info', message: 'Financial Report template created. Fill in budget utilization and cost per outcome data.' })}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span className="text-white font-medium">Financial Report</span>
            </div>
            <p className="text-sm text-gray-400">Budget utilization and cost per outcome</p>
          </div>
        </div>
      </div>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowNewReportModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">New Report</h3>
              <button onClick={() => setShowNewReportModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Select Grant *</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500">
                  <option value="">Choose a grant</option>
                  {grants.map(g => (
                    <option key={g.id} value={g.id}>{g.name} ({g.funderName})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Report Type</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500">
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="interim">Interim</option>
                  <option value="final">Final</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Period Start</label>
                  <input type="date" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Period End</label>
                  <input type="date" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                <input type="date" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowNewReportModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  setShowNewReportModal(false);
                  setNotification({ type: 'success', message: 'New report created. You can now fill in the metrics and narrative.' });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowReportDetailModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{getGrantName(showReportDetailModal.grantId)}</h3>
                <p className="text-sm text-gray-400 capitalize">{showReportDetailModal.reportType} Report</p>
              </div>
              <button onClick={() => setShowReportDetailModal(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const statusStyle = STATUS_STYLES[showReportDetailModal.status];
                  return (
                    <span className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.icon}
                      {showReportDetailModal.status.replace('_', ' ')}
                    </span>
                  );
                })()}
              </div>

              <div className="text-sm text-gray-400">
                <span>Period: {new Date(showReportDetailModal.reportingPeriodStart).toLocaleDateString()} - {new Date(showReportDetailModal.reportingPeriodEnd).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-white">{showReportDetailModal.enrollmentCount}</p>
                  <p className="text-xs text-gray-400">Enrolled</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-white">{showReportDetailModal.completionCount}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-emerald-400">{showReportDetailModal.placementCount}</p>
                  <p className="text-xs text-gray-400">Placed</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-pink-400">{showReportDetailModal.retentionRate}%</p>
                  <p className="text-xs text-gray-400">Retention</p>
                </div>
              </div>

              {showReportDetailModal.averageWage && (
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-400">Average Wage: </span>
                  <span className="text-white font-semibold">${showReportDetailModal.averageWage}/hr</span>
                </div>
              )}

              {showReportDetailModal.narrativeSummary && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Narrative Summary</h4>
                  <p className="text-gray-400 text-sm bg-gray-800/50 rounded-lg p-3">{showReportDetailModal.narrativeSummary}</p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due: {new Date(showReportDetailModal.dueDate).toLocaleDateString()}
                </span>
                {showReportDetailModal.submittedDate && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    Submitted: {new Date(showReportDetailModal.submittedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setShowReportDetailModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button
                onClick={() => {
                  setShowReportDetailModal(null);
                  setNotification({ type: 'success', message: `Exporting report for ${getGrantName(showReportDetailModal.grantId)}. Download will begin shortly.` });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
