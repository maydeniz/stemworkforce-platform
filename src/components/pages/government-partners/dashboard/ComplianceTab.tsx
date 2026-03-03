// ===========================================
// Compliance Tab - Reports & Compliance Management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  FileText,
  Filter,
  Loader2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Send,
  Download,
  Eye,
  Edit,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { getComplianceReports, getWorkforcePrograms } from '@/services/governmentPartnerApi';
import type { ComplianceReport, WorkforceProgram, GovernmentPartnerTier } from '@/types/governmentPartner';

// ===========================================
// TYPES
// ===========================================

interface ComplianceTabProps {
  partnerId: string;
  tier: GovernmentPartnerTier;
}

type ViewMode = 'upcoming' | 'all' | 'overdue';

// ===========================================
// SAMPLE DATA
// ===========================================

const sampleReports: ComplianceReport[] = [
  {
    id: '1',
    partnerId: '1',
    programId: '1',
    reportType: 'quarterly_progress',
    reportingPeriodStart: '2024-07-01',
    reportingPeriodEnd: '2024-09-30',
    dueDate: '2024-10-31',
    status: 'draft',
    enrollmentCount: 189,
    completionCount: 67,
    placementCount: 58,
    placementRate: 86.5,
    averageWageAtPlacement: 58000,
    averageWageGain: 16500,
    expendituresReported: 2150000,
    veteransEnrolled: 23,
    veteransPlaced: 21,
    preparedBy: 'John Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    programId: '1',
    reportType: 'quarterly_progress',
    reportingPeriodStart: '2024-04-01',
    reportingPeriodEnd: '2024-06-30',
    dueDate: '2024-07-31',
    status: 'accepted',
    submittedDate: '2024-07-28',
    acceptedDate: '2024-08-05',
    enrollmentCount: 156,
    completionCount: 45,
    placementCount: 38,
    placementRate: 84.4,
    averageWageAtPlacement: 56000,
    averageWageGain: 15200,
    expendituresReported: 1850000,
    veteransEnrolled: 18,
    veteransPlaced: 16,
    preparedBy: 'John Smith',
    reviewedBy: 'DOL Regional Office',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    partnerId: '1',
    programId: '2',
    reportType: 'annual_performance',
    reportingPeriodStart: '2023-07-01',
    reportingPeriodEnd: '2024-06-30',
    dueDate: '2024-09-30',
    status: 'submitted',
    submittedDate: '2024-09-25',
    enrollmentCount: 312,
    completionCount: 178,
    placementCount: 145,
    placementRate: 81.5,
    averageWageAtPlacement: 48000,
    averageWageGain: 11200,
    expendituresReported: 3200000,
    veteransEnrolled: 34,
    veteransPlaced: 28,
    preparedBy: 'Sarah Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    partnerId: '1',
    programId: '1',
    reportType: 'chips_quarterly',
    reportingPeriodStart: '2024-07-01',
    reportingPeriodEnd: '2024-09-30',
    dueDate: '2024-10-15',
    status: 'rejected',
    submittedDate: '2024-10-12',
    rejectionReason: 'Missing wage verification documentation for 12 placements',
    enrollmentCount: 189,
    completionCount: 67,
    placementCount: 58,
    placementRate: 86.5,
    expendituresReported: 2150000,
    veteransEnrolled: 23,
    veteransPlaced: 21,
    preparedBy: 'John Smith',
    reviewedBy: 'CHIPS Program Office',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// CONFIG
// ===========================================

const reportTypeLabels: Record<string, { label: string; color: string }> = {
  quarterly_progress: { label: 'Quarterly Progress', color: 'blue' },
  annual_performance: { label: 'Annual Performance', color: 'purple' },
  financial_report: { label: 'Financial Report', color: 'emerald' },
  chips_quarterly: { label: 'CHIPS Quarterly', color: 'amber' },
  chips_annual: { label: 'CHIPS Annual', color: 'orange' },
  participant_outcomes: { label: 'Participant Outcomes', color: 'cyan' },
  employer_engagement: { label: 'Employer Engagement', color: 'pink' },
  audit_response: { label: 'Audit Response', color: 'red' }
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', color: 'slate', icon: Edit },
  in_review: { label: 'In Review', color: 'blue', icon: Eye },
  submitted: { label: 'Submitted', color: 'amber', icon: Send },
  accepted: { label: 'Accepted', color: 'emerald', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'red', icon: XCircle },
  revision_requested: { label: 'Revision Requested', color: 'orange', icon: RefreshCw }
};

// ===========================================
// COMPONENT
// ===========================================

export const ComplianceTab: React.FC<ComplianceTabProps> = ({ partnerId, tier: _tier }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('upcoming');
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [programs, setPrograms] = useState<WorkforceProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<ComplianceReport | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submittingReport, setSubmittingReport] = useState<ComplianceReport | null>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [previewReport, setPreviewReport] = useState<ComplianceReport | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Create report form
  const [createForm, setCreateForm] = useState({
    programId: '',
    reportType: 'quarterly_progress',
    reportingPeriodStart: '',
    reportingPeriodEnd: '',
    dueDate: '',
    preparedBy: ''
  });

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsData, programsData] = await Promise.all([
          getComplianceReports(partnerId),
          getWorkforcePrograms(partnerId)
        ]);
        setReports(reportsData.length > 0 ? reportsData : sampleReports);
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching compliance data:', error);
        setReports(sampleReports);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partnerId]);

  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Filter reports by view mode
  const viewFilteredReports = reports.filter(r => {
    if (viewMode === 'overdue') {
      return r.dueDate < today && r.status !== 'submitted' && r.status !== 'accepted';
    }
    if (viewMode === 'upcoming') {
      return r.dueDate >= today && r.dueDate <= thirtyDaysFromNow && r.status !== 'submitted' && r.status !== 'accepted';
    }
    return true;
  });

  // Apply additional filters
  const filteredReports = viewFilteredReports.filter(r => {
    const matchesSearch = searchQuery === '' ||
      reportTypeLabels[r.reportType]?.label.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || r.status === statusFilter;
    const matchesType = typeFilter === '' || r.reportType === typeFilter;
    const matchesProgram = programFilter === '' || r.programId === programFilter;

    return matchesSearch && matchesStatus && matchesType && matchesProgram;
  });

  // Calculate stats
  const stats = {
    total: reports.length,
    overdue: reports.filter(r => r.dueDate < today && r.status !== 'submitted' && r.status !== 'accepted').length,
    upcoming: reports.filter(r => r.dueDate >= today && r.dueDate <= thirtyDaysFromNow && r.status !== 'submitted' && r.status !== 'accepted').length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    accepted: reports.filter(r => r.status === 'accepted').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || 'Unknown Program';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateReport = () => {
    showNotification('Report created successfully');
    setShowCreateModal(false);
    setCreateForm({
      programId: '',
      reportType: 'quarterly_progress',
      reportingPeriodStart: '',
      reportingPeriodEnd: '',
      dueDate: '',
      preparedBy: ''
    });
  };

  const handleExportPDF = (report: ComplianceReport) => {
    showNotification(`Exporting ${reportTypeLabels[report.reportType]?.label || 'report'} as PDF...`, 'info');
  };

  const handleEditReport = (report: ComplianceReport) => {
    setEditingReport(report);
    setSelectedReport(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    showNotification('Report updated successfully');
    setShowEditModal(false);
    setEditingReport(null);
  };

  const handleSubmitReport = (report: ComplianceReport) => {
    setSubmittingReport(report);
    setSelectedReport(null);
    setShowSubmitConfirm(true);
  };

  const confirmSubmitReport = () => {
    showNotification('Report submitted for review');
    setShowSubmitConfirm(false);
    setSubmittingReport(null);
  };

  const handleViewFullReport = (report: ComplianceReport) => {
    setPreviewReport(report);
    setSelectedReport(null);
    setShowReportPreview(true);
  };

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
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total Reports</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div
          onClick={() => setViewMode('overdue')}
          className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition-colors ${viewMode === 'overdue' ? 'border-red-500' : 'border-gray-800 hover:border-gray-700'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
        </div>
        <div
          onClick={() => setViewMode('upcoming')}
          className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition-colors ${viewMode === 'upcoming' ? 'border-amber-500' : 'border-gray-800 hover:border-gray-700'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Due Soon</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{stats.upcoming}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Submitted</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.submitted}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Accepted</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.accepted}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('upcoming')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'upcoming' ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Upcoming ({stats.upcoming})
        </button>
        <button
          onClick={() => setViewMode('overdue')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'overdue' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Overdue ({stats.overdue})
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Reports
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  <option value="submitted">Submitted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Report Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {Object.entries(reportTypeLabels).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Program</label>
                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Programs</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report, index) => {
          const typeConfig = reportTypeLabels[report.reportType] || { label: report.reportType, color: 'slate' };
          const statusConf = statusConfig[report.status];
          const StatusIcon = statusConf.icon;
          const daysUntilDue = getDaysUntilDue(report.dueDate);
          const isOverdue = daysUntilDue < 0 && report.status !== 'submitted' && report.status !== 'accepted';

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedReport(report)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs bg-${typeConfig.color}-500/20 text-${typeConfig.color}-400`}>
                      {typeConfig.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-${statusConf.color}-500/20 text-${statusConf.color}-400`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConf.label}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">
                    {getProgramName(report.programId)} - {typeConfig.label}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Reporting Period: {new Date(report.reportingPeriodStart).toLocaleDateString()} - {new Date(report.reportingPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-400' : daysUntilDue <= 7 ? 'text-amber-400' : 'text-gray-400'}`}>
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {isOverdue
                        ? `${Math.abs(daysUntilDue)} days overdue`
                        : report.status === 'submitted' || report.status === 'accepted'
                          ? `Submitted ${report.submittedDate ? new Date(report.submittedDate).toLocaleDateString() : ''}`
                          : `Due in ${daysUntilDue} days`
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {new Date(report.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Rejection Warning */}
              {report.status === 'rejected' && report.rejectionReason && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-400">Rejection Reason</p>
                      <p className="text-sm text-gray-300">{report.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-800">
                <div>
                  <p className="text-xs text-gray-400">Enrolled</p>
                  <p className="text-white font-medium">{report.enrollmentCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-white font-medium">{report.completionCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Placed</p>
                  <p className="text-emerald-400 font-medium">{report.placementCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Expenditures</p>
                  <p className="text-white font-medium">${(report.expendituresReported / 1000000).toFixed(2)}M</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No reports found</h3>
          <p className="text-gray-500">
            {viewMode === 'overdue'
              ? 'No overdue reports - great job!'
              : viewMode === 'upcoming'
                ? 'No reports due in the next 30 days'
                : 'Try adjusting your search or filters'
            }
          </p>
        </div>
      )}

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs bg-${reportTypeLabels[selectedReport.reportType]?.color || 'slate'}-500/20 text-${reportTypeLabels[selectedReport.reportType]?.color || 'slate'}-400`}>
                        {reportTypeLabels[selectedReport.reportType]?.label || selectedReport.reportType}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-${statusConfig[selectedReport.status]?.color || 'slate'}-500/20 text-${statusConfig[selectedReport.status]?.color || 'slate'}-400`}>
                        {statusConfig[selectedReport.status]?.label || selectedReport.status}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{getProgramName(selectedReport.programId)}</h2>
                    <p className="text-gray-400 mt-1">
                      {new Date(selectedReport.reportingPeriodStart).toLocaleDateString()} - {new Date(selectedReport.reportingPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Rejection Warning */}
                {selectedReport.status === 'rejected' && selectedReport.rejectionReason && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-400">Report Rejected</p>
                        <p className="text-gray-300 mt-1">{selectedReport.rejectionReason}</p>
                        {selectedReport.reviewedBy && (
                          <p className="text-sm text-gray-400 mt-2">Reviewed by: {selectedReport.reviewedBy}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Due Date Info */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Due Date</p>
                      <p className="text-white font-medium">{new Date(selectedReport.dueDate).toLocaleDateString()}</p>
                    </div>
                    {selectedReport.submittedDate && (
                      <div>
                        <p className="text-sm text-gray-400">Submitted</p>
                        <p className="text-white">{new Date(selectedReport.submittedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedReport.acceptedDate && (
                      <div>
                        <p className="text-sm text-gray-400">Accepted</p>
                        <p className="text-emerald-400">{new Date(selectedReport.acceptedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Prepared By</p>
                      <p className="text-white">{selectedReport.preparedBy}</p>
                    </div>
                  </div>
                </div>

                {/* Outcome Metrics */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Outcome Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Enrollment Count</p>
                      <p className="text-xl font-bold text-white">{selectedReport.enrollmentCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Completion Count</p>
                      <p className="text-xl font-bold text-white">{selectedReport.completionCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Placement Count</p>
                      <p className="text-xl font-bold text-emerald-400">{selectedReport.placementCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Placement Rate</p>
                      <p className="text-xl font-bold text-emerald-400">{selectedReport.placementRate?.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* Wage Metrics */}
                {(selectedReport.averageWageAtPlacement || selectedReport.averageWageGain) && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Wage Outcomes</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedReport.averageWageAtPlacement && (
                        <div>
                          <p className="text-sm text-gray-400">Avg Wage at Placement</p>
                          <p className="text-xl font-bold text-white">${selectedReport.averageWageAtPlacement.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedReport.averageWageGain && (
                        <div>
                          <p className="text-sm text-gray-400">Avg Wage Gain</p>
                          <p className="text-xl font-bold text-emerald-400">+${selectedReport.averageWageGain.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Veteran Outcomes */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Veteran Outcomes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Veterans Enrolled</p>
                      <p className="text-xl font-bold text-white">{selectedReport.veteransEnrolled}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Veterans Placed</p>
                      <p className="text-xl font-bold text-emerald-400">{selectedReport.veteransPlaced}</p>
                    </div>
                  </div>
                </div>

                {/* Financial */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Financial Report</h3>
                  <div>
                    <p className="text-sm text-gray-400">Expenditures Reported</p>
                    <p className="text-2xl font-bold text-white">${selectedReport.expendituresReported.toLocaleString()}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedReport.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Notes</h3>
                    <p className="text-gray-300 bg-gray-800 rounded-lg p-3">{selectedReport.notes}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-800 flex justify-between">
                <button
                  onClick={() => handleExportPDF(selectedReport)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                  {selectedReport.status === 'draft' || selectedReport.status === 'rejected' ? (
                    <>
                      <button
                        onClick={() => handleEditReport(selectedReport)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Edit Report
                      </button>
                      <button
                        onClick={() => handleSubmitReport(selectedReport)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Submit
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleViewFullReport(selectedReport)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View Full Report
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Create New Report</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Program</label>
                  <select
                    value={createForm.programId}
                    onChange={e => setCreateForm({ ...createForm, programId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select program</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Report Type</label>
                  <select
                    value={createForm.reportType}
                    onChange={e => setCreateForm({ ...createForm, reportType: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {Object.entries(reportTypeLabels).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Period Start</label>
                    <input
                      type="date"
                      value={createForm.reportingPeriodStart}
                      onChange={e => setCreateForm({ ...createForm, reportingPeriodStart: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Period End</label>
                    <input
                      type="date"
                      value={createForm.reportingPeriodEnd}
                      onChange={e => setCreateForm({ ...createForm, reportingPeriodEnd: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={createForm.dueDate}
                      onChange={e => setCreateForm({ ...createForm, dueDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Prepared By</label>
                    <input
                      type="text"
                      value={createForm.preparedBy}
                      onChange={e => setCreateForm({ ...createForm, preparedBy: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleCreateReport} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Create Report</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Report Modal */}
      <AnimatePresence>
        {showEditModal && editingReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowEditModal(false); setEditingReport(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Report</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Enrollment Count</label>
                    <input type="number" defaultValue={editingReport.enrollmentCount} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Completion Count</label>
                    <input type="number" defaultValue={editingReport.completionCount} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Placement Count</label>
                    <input type="number" defaultValue={editingReport.placementCount} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Expenditures ($)</label>
                    <input type="number" defaultValue={editingReport.expendituresReported} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Veterans Enrolled</label>
                    <input type="number" defaultValue={editingReport.veteransEnrolled} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Veterans Placed</label>
                    <input type="number" defaultValue={editingReport.veteransPlaced} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notes</label>
                  <textarea
                    defaultValue={editingReport.notes || ''}
                    rows={3}
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setShowEditModal(false); setEditingReport(null); }} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && submittingReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowSubmitConfirm(false); setSubmittingReport(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-2">Submit Report for Review</h3>
              <p className="text-gray-400 mb-4">
                You are about to submit the {reportTypeLabels[submittingReport.reportType]?.label || 'report'} for {getProgramName(submittingReport.programId)}. This action cannot be undone.
              </p>
              <div className="bg-gray-800 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Enrolled:</span> <span className="text-white">{submittingReport.enrollmentCount}</span></div>
                  <div><span className="text-gray-400">Completed:</span> <span className="text-white">{submittingReport.completionCount}</span></div>
                  <div><span className="text-gray-400">Placed:</span> <span className="text-emerald-400">{submittingReport.placementCount}</span></div>
                  <div><span className="text-gray-400">Expenditures:</span> <span className="text-white">${(submittingReport.expendituresReported / 1000000).toFixed(2)}M</span></div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => { setShowSubmitConfirm(false); setSubmittingReport(null); }} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={confirmSubmitReport} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <Send className="w-4 h-4" />
                  Confirm Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {showReportPreview && previewReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowReportPreview(false); setPreviewReport(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Full Report Preview</h3>
                <button onClick={() => { setShowReportPreview(false); setPreviewReport(null); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-4 border border-gray-800 rounded-lg p-6 bg-gray-800/50">
                <div className="text-center pb-4 border-b border-gray-700">
                  <h2 className="text-lg font-bold text-white">{reportTypeLabels[previewReport.reportType]?.label || previewReport.reportType}</h2>
                  <p className="text-gray-400">{getProgramName(previewReport.programId)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(previewReport.reportingPeriodStart).toLocaleDateString()} - {new Date(previewReport.reportingPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-400">Enrollment:</span> <span className="text-white ml-2">{previewReport.enrollmentCount}</span></div>
                  <div><span className="text-gray-400">Completions:</span> <span className="text-white ml-2">{previewReport.completionCount}</span></div>
                  <div><span className="text-gray-400">Placements:</span> <span className="text-emerald-400 ml-2">{previewReport.placementCount}</span></div>
                  <div><span className="text-gray-400">Placement Rate:</span> <span className="text-emerald-400 ml-2">{previewReport.placementRate?.toFixed(1)}%</span></div>
                  <div><span className="text-gray-400">Avg Wage at Placement:</span> <span className="text-white ml-2">${(previewReport.averageWageAtPlacement || 0).toLocaleString()}</span></div>
                  <div><span className="text-gray-400">Avg Wage Gain:</span> <span className="text-emerald-400 ml-2">+${(previewReport.averageWageGain || 0).toLocaleString()}</span></div>
                  <div><span className="text-gray-400">Veterans Enrolled:</span> <span className="text-white ml-2">{previewReport.veteransEnrolled}</span></div>
                  <div><span className="text-gray-400">Veterans Placed:</span> <span className="text-emerald-400 ml-2">{previewReport.veteransPlaced}</span></div>
                  <div className="col-span-2"><span className="text-gray-400">Expenditures:</span> <span className="text-white ml-2">${previewReport.expendituresReported.toLocaleString()}</span></div>
                  <div><span className="text-gray-400">Prepared By:</span> <span className="text-white ml-2">{previewReport.preparedBy}</span></div>
                  {previewReport.reviewedBy && <div><span className="text-gray-400">Reviewed By:</span> <span className="text-white ml-2">{previewReport.reviewedBy}</span></div>}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => { handleExportPDF(previewReport); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button onClick={() => { setShowReportPreview(false); setPreviewReport(null); }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Done</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
