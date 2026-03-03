// ===========================================
// Applications Tab
// Manage research applications and IRB submissions
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Send,
  Eye,
  Edit3,
  Loader2,
  Database
} from 'lucide-react';
import { researchPortalApi } from '@/services/researchPortalApi';

interface ApplicationsTabProps {
  researcherId: string;
}

interface Application {
  id: string;
  title: string;
  description: string;
  researchType: string;
  status: string;
  submittedAt?: string;
  reviewProgress?: number;
  dataTypes: string[];
  targetPopulation: string;
  estimatedDuration: string;
  irbProtocolNumber?: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ researcherId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [researcherId]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const result = await researchPortalApi.getApplications({ researcherId });
      setApplications(result.applications.map(a => ({
        id: a.id,
        title: a.title,
        description: a.shortDescription || '',
        researchType: a.researchType || 'quantitative',
        status: a.status,
        submittedAt: a.submittedAt,
        reviewProgress: undefined,
        dataTypes: a.dataCollection?.dataTypes || [],
        targetPopulation: a.participantInfo?.targetPopulation || '',
        estimatedDuration: a.timeline?.totalDuration || '',
        irbProtocolNumber: a.irbInfo?.irbProtocolNumber,
      })));
    } catch (error) {
      console.error('Error loading applications:', error);
    }
    setLoading(false);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'under_review':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case 'submitted':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
            <Send className="w-3 h-3" />
            Submitted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            <AlertCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs capitalize">
            {status.replace('_', ' ')}
          </span>
        );
    }
  };

  const handleCreateApplication = async (formData: any) => {
    setSubmitting(true);
    try {
      await researchPortalApi.createApplication(researcherId, formData);
      await loadApplications();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating application:', error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Research Applications</h2>
          <p className="text-gray-400">Submit and manage your research applications</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApplications.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{app.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{app.description}</p>
              </div>
              {getStatusBadge(app.status)}
            </div>

            {app.reviewProgress !== undefined && app.status === 'under_review' && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Review Progress</span>
                  <span>{app.reviewProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${app.reviewProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1 mb-4">
              {app.dataTypes.slice(0, 3).map((type, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">
                  {type}
                </span>
              ))}
              {app.dataTypes.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">
                  +{app.dataTypes.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                {app.submittedAt && (
                  <span>Submitted {new Date(app.submittedAt).toLocaleDateString()}</span>
                )}
                {app.status === 'draft' && <span>Not yet submitted</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {app.status === 'draft' && (
                  <button
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p>No applications found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-indigo-400 hover:text-indigo-300"
          >
            Create your first application
          </button>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateApplicationModal
            researcherId={researcherId}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateApplication}
            submitting={submitting}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {selectedApp && (
          <ViewApplicationModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// CREATE APPLICATION MODAL
// ===========================================

interface CreateApplicationModalProps {
  researcherId: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
}

const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({
  researcherId,
  onClose,
  onSubmit,
  submitting
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    researchType: 'quantitative',
    targetPopulation: '',
    estimatedDuration: '',
    dataElements: [] as string[],
    districts: [] as string[],
    irbProtocolNumber: '',
    fundingSource: '',
  });

  const dataElementOptions = [
    'Demographics', 'Academic Performance', 'Attendance', 'Behavior',
    'STEM Participation', 'Career Readiness', 'Socioeconomic Data',
    'Special Education', 'English Learners', 'College Enrollment'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, researcherId });
  };

  const toggleDataElement = (element: string) => {
    const current = formData.dataElements;
    const updated = current.includes(element)
      ? current.filter(e => e !== element)
      : [...current, element];
    setFormData({ ...formData, dataElements: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">New Research Application</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Research Information
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Research Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter research title"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Describe your research objectives..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Research Type</label>
                  <select
                    value={formData.researchType}
                    onChange={(e) => setFormData({ ...formData, researchType: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="quantitative">Quantitative</option>
                    <option value="qualitative">Qualitative</option>
                    <option value="mixed">Mixed Methods</option>
                    <option value="longitudinal">Longitudinal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    placeholder="e.g., 12 months"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data Elements */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Elements Requested
            </h4>
            <div className="flex flex-wrap gap-2">
              {dataElementOptions.map(element => (
                <button
                  key={element}
                  type="button"
                  onClick={() => toggleDataElement(element)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    formData.dataElements.includes(element)
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>

          {/* IRB & Compliance */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              IRB & Compliance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">IRB Protocol Number</label>
                <input
                  type="text"
                  value={formData.irbProtocolNumber}
                  onChange={(e) => setFormData({ ...formData, irbProtocolNumber: e.target.value })}
                  placeholder="e.g., IRB-2024-0123"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Funding Source</label>
                <input
                  type="text"
                  value={formData.fundingSource}
                  onChange={(e) => setFormData({ ...formData, fundingSource: e.target.value })}
                  placeholder="e.g., NSF Grant"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// VIEW APPLICATION MODAL
// ===========================================

interface ViewApplicationModalProps {
  application: Application;
  onClose: () => void;
}

const ViewApplicationModal: React.FC<ViewApplicationModalProps> = ({ application, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Application Details</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-xl font-semibold text-white">{application.title}</h4>
            <p className="text-gray-400 mt-2">{application.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400">Research Type</p>
              <p className="text-white capitalize">{application.researchType}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400">Duration</p>
              <p className="text-white">{application.estimatedDuration || 'Not specified'}</p>
            </div>
          </div>

          {application.dataTypes.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Data Elements</p>
              <div className="flex flex-wrap gap-2">
                {application.dataTypes.map((type, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {application.irbProtocolNumber && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-sm text-emerald-400 font-medium">IRB Protocol</p>
              <p className="text-white">{application.irbProtocolNumber}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApplicationsTab;
