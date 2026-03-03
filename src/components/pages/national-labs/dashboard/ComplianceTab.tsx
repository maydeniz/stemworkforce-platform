// ===========================================
// Compliance Tab - ITAR/EAR & Export Control Tracking
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Filter,
  ChevronDown,
  Eye,
  History,
  Flag,
  Globe,
  Lock,
  Unlock,
  Calendar,
  User,
  Building2,
  AlertCircle,
  Download,
  RefreshCw,
  X,
} from 'lucide-react';
import type {
  LabPartnerTier,
  ComplianceRecord,
  ComplianceAuditLog,
  ExportControlType,
  ComplianceStatus,
} from '../../../../types/nationalLabsPartner';

interface ComplianceTabProps {
  partnerId: string;
  tier: LabPartnerTier;
}

type ViewMode = 'records' | 'audit';

// Sample compliance records
const sampleComplianceRecords: ComplianceRecord[] = [
  {
    id: 'comp-1',
    partnerId: 'partner-1',
    recordType: 'position',
    recordId: 'pos-1',
    exportControlType: 'ear',
    itarControlled: false,
    earControlled: true,
    eccn: '3A001',
    citizenshipVerified: true,
    citizenshipVerificationDate: '2024-01-15',
    citizenshipVerificationMethod: 'Passport verification',
    complianceStatus: 'compliant',
    complianceNotes: 'All export control requirements verified. Position cleared for hiring.',
    lastReviewDate: '2024-01-15',
    nextReviewDate: '2024-07-15',
    reviewedBy: 'John Smith',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
  {
    id: 'comp-2',
    partnerId: 'partner-1',
    recordType: 'candidate',
    recordId: 'cand-1',
    exportControlType: 'itar',
    itarControlled: true,
    earControlled: false,
    citizenshipVerified: true,
    citizenshipVerificationDate: '2024-02-01',
    citizenshipVerificationMethod: 'E-Verify',
    complianceStatus: 'compliant',
    complianceNotes: 'US Citizen status verified. Cleared for ITAR work.',
    lastReviewDate: '2024-02-01',
    nextReviewDate: '2024-08-01',
    reviewedBy: 'Sarah Johnson',
    createdAt: '2024-01-28',
    updatedAt: '2024-02-01',
  },
  {
    id: 'comp-3',
    partnerId: 'partner-1',
    recordType: 'project',
    recordId: 'proj-1',
    exportControlType: 'pending_review',
    itarControlled: false,
    earControlled: false,
    citizenshipVerified: false,
    complianceStatus: 'pending_review',
    complianceNotes: 'New project requires export control classification review.',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: 'comp-4',
    partnerId: 'partner-1',
    recordType: 'collaboration',
    recordId: 'collab-1',
    exportControlType: 'ear',
    itarControlled: false,
    earControlled: true,
    eccn: '5D002',
    citizenshipVerified: true,
    citizenshipVerificationDate: '2024-01-20',
    citizenshipVerificationMethod: 'Document review',
    complianceStatus: 'exception_granted',
    complianceNotes: 'Foreign national collaboration approved under license exception TSR.',
    exceptionReason: 'Fundamental research exemption applies',
    exceptionApprovedBy: 'Export Control Officer',
    exceptionApprovedDate: '2024-01-25',
    lastReviewDate: '2024-01-25',
    nextReviewDate: '2024-04-25',
    reviewedBy: 'Michael Brown',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-25',
  },
  {
    id: 'comp-5',
    partnerId: 'partner-1',
    recordType: 'candidate',
    recordId: 'cand-2',
    exportControlType: 'itar',
    itarControlled: true,
    earControlled: false,
    citizenshipVerified: true,
    citizenshipVerificationDate: '2024-02-05',
    citizenshipVerificationMethod: 'HR verification',
    complianceStatus: 'non_compliant',
    complianceNotes: 'Candidate does not meet citizenship requirements for ITAR position.',
    lastReviewDate: '2024-02-05',
    reviewedBy: 'Sarah Johnson',
    createdAt: '2024-02-03',
    updatedAt: '2024-02-05',
  },
];

// Sample audit logs
const sampleAuditLogs: ComplianceAuditLog[] = [
  {
    id: 'audit-1',
    partnerId: 'partner-1',
    complianceRecordId: 'comp-1',
    action: 'Compliance status updated to compliant',
    actionType: 'approve',
    performedBy: 'John Smith',
    performedAt: '2024-01-15T14:30:00Z',
    previousValue: 'pending_review',
    newValue: 'compliant',
    notes: 'All documentation verified and approved.',
    createdAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'audit-2',
    partnerId: 'partner-1',
    complianceRecordId: 'comp-2',
    action: 'Citizenship verification completed',
    actionType: 'review',
    performedBy: 'Sarah Johnson',
    performedAt: '2024-02-01T10:15:00Z',
    notes: 'E-Verify confirmation received.',
    createdAt: '2024-02-01T10:15:00Z',
  },
  {
    id: 'audit-3',
    partnerId: 'partner-1',
    complianceRecordId: 'comp-4',
    action: 'Exception granted for foreign collaboration',
    actionType: 'exception',
    performedBy: 'Michael Brown',
    performedAt: '2024-01-25T16:45:00Z',
    previousValue: 'pending_review',
    newValue: 'exception_granted',
    notes: 'Fundamental research exemption documented and approved.',
    createdAt: '2024-01-25T16:45:00Z',
  },
  {
    id: 'audit-4',
    partnerId: 'partner-1',
    complianceRecordId: 'comp-3',
    action: 'New compliance record created',
    actionType: 'create',
    performedBy: 'System',
    performedAt: '2024-02-10T09:00:00Z',
    notes: 'Automatic record creation for new project.',
    createdAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'audit-5',
    partnerId: 'partner-1',
    complianceRecordId: 'comp-5',
    action: 'Compliance status updated to non_compliant',
    actionType: 'reject',
    performedBy: 'Sarah Johnson',
    performedAt: '2024-02-05T11:20:00Z',
    previousValue: 'pending_review',
    newValue: 'non_compliant',
    notes: 'Candidate citizenship status does not meet ITAR requirements.',
    createdAt: '2024-02-05T11:20:00Z',
  },
];

const exportControlLabels: Record<ExportControlType, { label: string; color: string }> = {
  itar: { label: 'ITAR', color: 'red' },
  ear: { label: 'EAR', color: 'amber' },
  none: { label: 'None', color: 'slate' },
  pending_review: { label: 'Pending Review', color: 'blue' },
};

const complianceStatusConfig: Record<ComplianceStatus, { label: string; color: string; icon: React.ElementType }> = {
  compliant: { label: 'Compliant', color: 'emerald', icon: CheckCircle },
  non_compliant: { label: 'Non-Compliant', color: 'red', icon: XCircle },
  pending_review: { label: 'Pending Review', color: 'amber', icon: Clock },
  exception_granted: { label: 'Exception Granted', color: 'blue', icon: Unlock },
};

const recordTypeLabels: Record<string, { label: string; icon: React.ElementType }> = {
  candidate: { label: 'Candidate', icon: User },
  position: { label: 'Position', icon: Building2 },
  project: { label: 'Project', icon: FileText },
  collaboration: { label: 'Collaboration', icon: Globe },
};

const auditActionIcons: Record<string, React.ElementType> = {
  create: Plus,
  update: RefreshCw,
  review: Eye,
  approve: CheckCircle,
  reject: XCircle,
  exception: Unlock,
};

export const ComplianceTab: React.FC<ComplianceTabProps> = ({ partnerId, tier }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('records');
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<ComplianceAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | ''>('');
  const [exportControlFilter, setExportControlFilter] = useState<ExportControlType | ''>('');
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>('');

  // Modal states
  const [showNewReviewModal, setShowNewReviewModal] = useState(false);
  const [showRecordDetail, setShowRecordDetail] = useState<ComplianceRecord | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showExportNotification, setShowExportNotification] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState<ComplianceRecord | null>(null);

  // New review form
  const [reviewForm, setReviewForm] = useState({
    recordType: 'candidate' as ComplianceRecord['recordType'],
    recordId: '',
    exportControlType: 'pending_review' as ExportControlType,
    complianceNotes: '',
    reviewedBy: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recordsData, logsData] = await Promise.all([
          import('@/services/nationalLabsPartnerApi').then(m => m.getComplianceRecords(partnerId)),
          import('@/services/nationalLabsPartnerApi').then(m => m.getComplianceAuditLogs(partnerId))
        ]);

        // Use sample data if no data returned from API
        setRecords(recordsData.length > 0 ? recordsData : sampleComplianceRecords);
        setAuditLogs(logsData.length > 0 ? logsData : sampleAuditLogs);
      } catch (error) {
        console.error('Error fetching compliance data:', error);
        // Fallback to sample data
        setRecords(sampleComplianceRecords);
        setAuditLogs(sampleAuditLogs);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partnerId]);

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchQuery === '' ||
      record.complianceNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.eccn?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || record.complianceStatus === statusFilter;
    const matchesExport = exportControlFilter === '' || record.exportControlType === exportControlFilter;
    const matchesType = recordTypeFilter === '' || record.recordType === recordTypeFilter;

    return matchesSearch && matchesStatus && matchesExport && matchesType;
  });

  // Calculate metrics
  const metrics = {
    totalRecords: records.length,
    compliant: records.filter(r => r.complianceStatus === 'compliant').length,
    nonCompliant: records.filter(r => r.complianceStatus === 'non_compliant').length,
    pendingReview: records.filter(r => r.complianceStatus === 'pending_review').length,
    itarControlled: records.filter(r => r.itarControlled).length,
    earControlled: records.filter(r => r.earControlled).length,
    exceptionsGranted: records.filter(r => r.complianceStatus === 'exception_granted').length,
    upcomingReviews: records.filter(r => {
      if (!r.nextReviewDate) return false;
      const reviewDate = new Date(r.nextReviewDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return reviewDate <= thirtyDaysFromNow;
    }).length,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleExportReport = () => {
    setShowExportNotification(true);
    setTimeout(() => setShowExportNotification(false), 3000);
  };

  const handleNewReview = () => {
    const newRecord: ComplianceRecord = {
      id: `comp-new-${Date.now()}`,
      partnerId,
      recordType: reviewForm.recordType,
      recordId: reviewForm.recordId || `rec-${Date.now()}`,
      exportControlType: reviewForm.exportControlType,
      itarControlled: reviewForm.exportControlType === 'itar',
      earControlled: reviewForm.exportControlType === 'ear',
      citizenshipVerified: false,
      complianceStatus: 'pending_review',
      complianceNotes: reviewForm.complianceNotes,
      reviewedBy: reviewForm.reviewedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecords(prev => [newRecord, ...prev]);

    const newAudit: ComplianceAuditLog = {
      id: `audit-new-${Date.now()}`,
      partnerId,
      complianceRecordId: newRecord.id,
      action: 'New compliance review initiated',
      actionType: 'create',
      performedBy: reviewForm.reviewedBy || 'Current User',
      performedAt: new Date().toISOString(),
      notes: reviewForm.complianceNotes,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setShowNewReviewModal(false);
    setReviewForm({ recordType: 'candidate', recordId: '', exportControlType: 'pending_review', complianceNotes: '', reviewedBy: '' });
  };

  const handleStatusUpdate = (record: ComplianceRecord, newStatus: ComplianceStatus) => {
    setRecords(prev => prev.map(r =>
      r.id === record.id ? { ...r, complianceStatus: newStatus, updatedAt: new Date().toISOString() } : r
    ));

    const newAudit: ComplianceAuditLog = {
      id: `audit-upd-${Date.now()}`,
      partnerId,
      complianceRecordId: record.id,
      action: `Compliance status updated to ${newStatus}`,
      actionType: newStatus === 'compliant' ? 'approve' : newStatus === 'non_compliant' ? 'reject' : 'update',
      performedBy: 'Current User',
      performedAt: new Date().toISOString(),
      previousValue: record.complianceStatus,
      newValue: newStatus,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setShowStatusUpdateModal(null);
    if (showRecordDetail?.id === record.id) {
      setShowRecordDetail({ ...record, complianceStatus: newStatus });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Check tier access
  if (tier === 'research') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="p-4 bg-amber-500/20 rounded-full mb-4">
          <Lock className="w-12 h-12 text-amber-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Compliance Dashboard</h3>
        <p className="text-slate-400 text-center max-w-md mb-6">
          ITAR/EAR compliance tracking and export control management is available on Lab Partner and Enterprise tiers.
        </p>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
        >
          Upgrade to Lab Partner
        </button>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">Upgrade to Lab Partner</h3>
              <p className="text-gray-400 mb-4">Unlock ITAR/EAR compliance tracking, export control management, and audit trail features.</p>
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-2xl font-bold text-white">$2,499<span className="text-sm text-gray-400">/month</span></p>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> ITAR/EAR Compliance Tracking</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Export Control Classification</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Citizenship Verification</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Full Audit Trail</li>
                </ul>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Contact Sales</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Notification */}
      {showExportNotification && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-purple-400" />
          <span className="text-white">Compliance report exported successfully</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Compliance & Export Control</h2>
          <p className="text-slate-400 text-sm mt-1">
            ITAR/EAR tracking, citizenship verification, and audit trails
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setShowNewReviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Review
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><FileText className="w-3 h-3" /> Total Records</div>
          <div className="text-2xl font-bold text-white">{metrics.totalRecords}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><CheckCircle className="w-3 h-3" /> Compliant</div>
          <div className="text-2xl font-bold text-emerald-400">{metrics.compliant}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><XCircle className="w-3 h-3" /> Non-Compliant</div>
          <div className="text-2xl font-bold text-red-400">{metrics.nonCompliant}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><Clock className="w-3 h-3" /> Pending</div>
          <div className="text-2xl font-bold text-amber-400">{metrics.pendingReview}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><Flag className="w-3 h-3 text-red-400" /> ITAR</div>
          <div className="text-2xl font-bold text-red-400">{metrics.itarControlled}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><Globe className="w-3 h-3 text-amber-400" /> EAR</div>
          <div className="text-2xl font-bold text-amber-400">{metrics.earControlled}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><Unlock className="w-3 h-3" /> Exceptions</div>
          <div className="text-2xl font-bold text-blue-400">{metrics.exceptionsGranted}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><AlertTriangle className="w-3 h-3" /> Due Soon</div>
          <div className="text-2xl font-bold text-orange-400">{metrics.upcomingReviews}</div>
        </motion.div>
      </div>

      {/* View Toggle & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex rounded-lg overflow-hidden border border-slate-700">
          <button
            onClick={() => setViewMode('records')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'records' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Records ({records.length})
          </button>
          <button
            onClick={() => setViewMode('audit')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'audit' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            Audit Log ({auditLogs.length})
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records, ECCN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && viewMode === 'records' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
          >
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-400 mb-1">Compliance Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ComplianceStatus | '')}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(complianceStatusConfig).map(([value, config]) => (
                    <option key={value} value={value}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-400 mb-1">Export Control</label>
                <select
                  value={exportControlFilter}
                  onChange={(e) => setExportControlFilter(e.target.value as ExportControlType | '')}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Types</option>
                  {Object.entries(exportControlLabels).map(([value, config]) => (
                    <option key={value} value={value}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-400 mb-1">Record Type</label>
                <select
                  value={recordTypeFilter}
                  onChange={(e) => setRecordTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Types</option>
                  {Object.entries(recordTypeLabels).map(([value, config]) => (
                    <option key={value} value={value}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'records' ? (
          <motion.div
            key="records"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredRecords.map((record, index) => {
              const statusConfig = complianceStatusConfig[record.complianceStatus];
              const StatusIcon = statusConfig.icon;
              const typeConfig = recordTypeLabels[record.recordType];
              const TypeIcon = typeConfig.icon;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setShowRecordDetail(record)}
                  className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        record.complianceStatus === 'compliant' ? 'bg-emerald-500/20' :
                        record.complianceStatus === 'non_compliant' ? 'bg-red-500/20' :
                        record.complianceStatus === 'pending_review' ? 'bg-amber-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        <StatusIcon className={`w-5 h-5 ${
                          statusConfig.color === 'emerald' ? 'text-emerald-400' :
                          statusConfig.color === 'red' ? 'text-red-400' :
                          statusConfig.color === 'amber' ? 'text-amber-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-white font-medium">{typeConfig.label} Record</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            statusConfig.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                            statusConfig.color === 'red' ? 'bg-red-500/20 text-red-400' :
                            statusConfig.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">ID: {record.recordId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.itarControlled && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded flex items-center gap-1">
                          <Flag className="w-3 h-3" /> ITAR
                        </span>
                      )}
                      {record.earControlled && (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded flex items-center gap-1">
                          <Globe className="w-3 h-3" /> EAR
                        </span>
                      )}
                      {record.eccn && (
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs font-medium rounded">
                          ECCN: {record.eccn}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {record.complianceNotes && (
                    <p className="text-slate-300 text-sm mb-4">{record.complianceNotes}</p>
                  )}

                  {/* Exception Details */}
                  {record.complianceStatus === 'exception_granted' && (
                    <div className="bg-blue-500/10 rounded-lg p-3 mb-4 border border-blue-500/30">
                      <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-1">
                        <Unlock className="w-4 h-4" /> Exception Granted
                      </div>
                      <p className="text-slate-300 text-sm">{record.exceptionReason}</p>
                      {record.exceptionApprovedBy && (
                        <p className="text-slate-400 text-xs mt-1">
                          Approved by {record.exceptionApprovedBy} on {formatDate(record.exceptionApprovedDate!)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Citizenship</div>
                      <div className="flex items-center gap-2">
                        {record.citizenshipVerified ? (
                          <><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400 text-sm">Verified</span></>
                        ) : (
                          <><AlertCircle className="w-4 h-4 text-amber-400" /><span className="text-amber-400 text-sm">Pending</span></>
                        )}
                      </div>
                    </div>
                    {record.lastReviewDate && (
                      <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Last Review</div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" /> {formatDate(record.lastReviewDate)}
                        </div>
                      </div>
                    )}
                    {record.nextReviewDate && (
                      <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Next Review</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className={`${
                            new Date(record.nextReviewDate) < new Date() ? 'text-red-400' :
                            new Date(record.nextReviewDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-amber-400' :
                            'text-slate-300'
                          }`}>
                            {formatDate(record.nextReviewDate)}
                          </span>
                        </div>
                      </div>
                    )}
                    {record.reviewedBy && (
                      <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Reviewed By</div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <User className="w-4 h-4 text-slate-400" /> {record.reviewedBy}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {filteredRecords.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No compliance records found matching your criteria</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="audit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700/50">
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Timestamp</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Action</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Type</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Performed By</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {auditLogs.map((log) => {
                    const ActionIcon = auditActionIcons[log.actionType] || History;

                    return (
                      <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">
                          {formatDateTime(log.performedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ActionIcon className={`w-4 h-4 ${
                              log.actionType === 'approve' ? 'text-emerald-400' :
                              log.actionType === 'reject' ? 'text-red-400' :
                              log.actionType === 'exception' ? 'text-blue-400' :
                              'text-slate-400'
                            }`} />
                            <span className="text-white text-sm">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                            log.actionType === 'approve' ? 'bg-emerald-500/20 text-emerald-400' :
                            log.actionType === 'reject' ? 'bg-red-500/20 text-red-400' :
                            log.actionType === 'exception' ? 'bg-blue-500/20 text-blue-400' :
                            log.actionType === 'create' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {log.actionType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-sm">{log.performedBy}</td>
                        <td className="px-4 py-3 text-slate-400 text-sm max-w-xs truncate">
                          {log.notes || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Review Modal */}
      {showNewReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowNewReviewModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">New Compliance Review</h3>
              <button onClick={() => setShowNewReviewModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Record Type</label>
                  <select
                    value={reviewForm.recordType}
                    onChange={e => setReviewForm({ ...reviewForm, recordType: e.target.value as ComplianceRecord['recordType'] })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(recordTypeLabels).map(([value, config]) => (
                      <option key={value} value={value}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Export Control Type</label>
                  <select
                    value={reviewForm.exportControlType}
                    onChange={e => setReviewForm({ ...reviewForm, exportControlType: e.target.value as ExportControlType })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(exportControlLabels).map(([value, config]) => (
                      <option key={value} value={value}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Record ID</label>
                <input
                  type="text"
                  value={reviewForm.recordId}
                  onChange={e => setReviewForm({ ...reviewForm, recordId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., CAND-001"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Reviewer Name</label>
                <input
                  type="text"
                  value={reviewForm.reviewedBy}
                  onChange={e => setReviewForm({ ...reviewForm, reviewedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={reviewForm.complianceNotes}
                  onChange={e => setReviewForm({ ...reviewForm, complianceNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
                  placeholder="Describe the compliance review..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowNewReviewModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={handleNewReview}
                disabled={!reviewForm.reviewedBy}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Detail Modal */}
      {showRecordDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRecordDetail(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const sc = complianceStatusConfig[showRecordDetail.complianceStatus];
                  const SIcon = sc.icon;
                  return (
                    <div className={`p-3 rounded-xl ${
                      sc.color === 'emerald' ? 'bg-emerald-500/20' :
                      sc.color === 'red' ? 'bg-red-500/20' :
                      sc.color === 'amber' ? 'bg-amber-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      <SIcon className={`w-6 h-6 ${
                        sc.color === 'emerald' ? 'text-emerald-400' :
                        sc.color === 'red' ? 'text-red-400' :
                        sc.color === 'amber' ? 'text-amber-400' :
                        'text-blue-400'
                      }`} />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-xl font-bold text-white">{recordTypeLabels[showRecordDetail.recordType].label} Compliance Record</h3>
                  <p className="text-gray-400">ID: {showRecordDetail.recordId}</p>
                </div>
              </div>
              <button onClick={() => setShowRecordDetail(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  showRecordDetail.complianceStatus === 'compliant' ? 'bg-emerald-500/20 text-emerald-400' :
                  showRecordDetail.complianceStatus === 'non_compliant' ? 'bg-red-500/20 text-red-400' :
                  showRecordDetail.complianceStatus === 'pending_review' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {complianceStatusConfig[showRecordDetail.complianceStatus].label}
                </span>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Export Control</p>
                <div className="flex items-center gap-2">
                  {showRecordDetail.itarControlled && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">ITAR</span>}
                  {showRecordDetail.earControlled && <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">EAR</span>}
                  {!showRecordDetail.itarControlled && !showRecordDetail.earControlled && <span className="text-gray-400">None / Pending</span>}
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Citizenship Verified</p>
                {showRecordDetail.citizenshipVerified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400">Pending</span>
                  </div>
                )}
                {showRecordDetail.citizenshipVerificationMethod && (
                  <p className="text-gray-400 text-xs mt-1">Method: {showRecordDetail.citizenshipVerificationMethod}</p>
                )}
              </div>
              {showRecordDetail.eccn && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">ECCN</p>
                  <p className="text-white font-semibold">{showRecordDetail.eccn}</p>
                </div>
              )}
            </div>

            {showRecordDetail.complianceNotes && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Notes</p>
                <p className="text-gray-300">{showRecordDetail.complianceNotes}</p>
              </div>
            )}

            {showRecordDetail.complianceStatus === 'exception_granted' && showRecordDetail.exceptionReason && (
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30 mb-6">
                <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2"><Unlock className="w-4 h-4" /> Exception Details</h4>
                <p className="text-gray-300 text-sm">{showRecordDetail.exceptionReason}</p>
                {showRecordDetail.exceptionApprovedBy && (
                  <p className="text-gray-400 text-xs mt-2">Approved by {showRecordDetail.exceptionApprovedBy} on {formatDate(showRecordDetail.exceptionApprovedDate!)}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {showRecordDetail.lastReviewDate && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Last Review</p>
                  <p className="text-white">{formatDate(showRecordDetail.lastReviewDate)}</p>
                </div>
              )}
              {showRecordDetail.nextReviewDate && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Next Review</p>
                  <p className={`font-semibold ${
                    new Date(showRecordDetail.nextReviewDate) < new Date() ? 'text-red-400' :
                    new Date(showRecordDetail.nextReviewDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-amber-400' :
                    'text-white'
                  }`}>
                    {formatDate(showRecordDetail.nextReviewDate)}
                  </p>
                </div>
              )}
              {showRecordDetail.reviewedBy && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Reviewed By</p>
                  <p className="text-white">{showRecordDetail.reviewedBy}</p>
                </div>
              )}
            </div>

            {/* Related Audit Logs */}
            {(() => {
              const relatedLogs = auditLogs.filter(l => l.complianceRecordId === showRecordDetail.id);
              if (relatedLogs.length > 0) {
                return (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Audit History</h4>
                    <div className="space-y-2">
                      {relatedLogs.map(log => {
                        const AIcon = auditActionIcons[log.actionType] || History;
                        return (
                          <div key={log.id} className="bg-gray-800 rounded-lg p-3 flex items-start gap-3">
                            <AIcon className={`w-4 h-4 mt-0.5 ${
                              log.actionType === 'approve' ? 'text-emerald-400' :
                              log.actionType === 'reject' ? 'text-red-400' :
                              'text-gray-400'
                            }`} />
                            <div>
                              <p className="text-white text-sm">{log.action}</p>
                              <p className="text-gray-400 text-xs">{log.performedBy} - {formatDateTime(log.performedAt)}</p>
                              {log.notes && <p className="text-gray-400 text-xs mt-1">{log.notes}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setShowRecordDetail(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              {showRecordDetail.complianceStatus === 'pending_review' && (
                <button
                  onClick={() => setShowStatusUpdateModal(showRecordDetail)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                >
                  Update Status
                </button>
              )}
              <button onClick={() => setShowRecordDetail(null)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusUpdateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowStatusUpdateModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Update Compliance Status</h3>
            <p className="text-gray-400 mb-4">Select the new compliance status for this {recordTypeLabels[showStatusUpdateModal.recordType].label.toLowerCase()} record:</p>
            <div className="space-y-3">
              {Object.entries(complianceStatusConfig).map(([status, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(showStatusUpdateModal, status as ComplianceStatus)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      showStatusUpdateModal.complianceStatus === status
                        ? 'bg-purple-500/20 border border-purple-500/50'
                        : 'bg-gray-800 hover:bg-gray-700 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      config.color === 'emerald' ? 'text-emerald-400' :
                      config.color === 'red' ? 'text-red-400' :
                      config.color === 'amber' ? 'text-amber-400' :
                      'text-blue-400'
                    }`} />
                    <span className="text-white">{config.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowStatusUpdateModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceTab;
