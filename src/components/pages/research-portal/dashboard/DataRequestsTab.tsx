// ===========================================
// Data Requests Tab
// Request and manage access to student data
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Send,
  Eye,
  Loader2,
  Shield,
  Lock
} from 'lucide-react';
import { researchPortalApi } from '@/services/researchPortalApi';

interface DataRequestsTabProps {
  researcherId: string;
}

interface DataRequest {
  id: string;
  title: string;
  applicationId: string;
  dataElements: string[];
  districts: string[];
  status: string;
  deIdentificationMethod: string;
  requestedAt: string;
  approvedAt?: string;
  expiresAt?: string;
}

const DataRequestsTab: React.FC<DataRequestsTabProps> = ({ researcherId }) => {
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [researcherId]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await researchPortalApi.getDataSharingRequests(researcherId);
      setRequests(data.map(r => ({
        id: r.id,
        title: r.applicationId || '',
        applicationId: r.applicationId || '',
        dataElements: r.dataElements?.map(el => el.element) || [],
        districts: r.schoolIds || [],
        status: r.status,
        deIdentificationMethod: r.deIdentificationLevel || 'k-anonymity',
        requestedAt: r.createdAt || new Date().toISOString(),
        approvedAt: r.approvedAt,
        expiresAt: r.destructionDate,
      })));
    } catch (error) {
      console.error('Error loading requests:', error);
    }
    setLoading(false);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
            <CheckCircle2 className="w-3 h-3" />
            {status === 'active' ? 'Active' : 'Approved'}
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'expired':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            <AlertCircle className="w-3 h-3" />
            Expired
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs capitalize">
            {status}
          </span>
        );
    }
  };

  const handleCreateRequest = async (formData: any) => {
    setSubmitting(true);
    try {
      await researchPortalApi.createDataSharingRequest(formData.applicationId || 'app-new', formData);
      await loadRequests();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating request:', error);
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
          <h2 className="text-xl font-bold text-white">Data Access Requests</h2>
          <p className="text-gray-400">Request and manage access to de-identified student data</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Data Request
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-start gap-3">
        <Shield className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-indigo-400 font-medium">FERPA Compliant Data Access</p>
          <p className="text-sm text-gray-400 mt-1">
            All data is de-identified using k-anonymity (k=5) and provided through secure data rooms.
            Access is logged and audited for compliance.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search data requests..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  {request.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Requested {new Date(request.requestedAt).toLocaleDateString()}
                </p>
              </div>
              {getStatusBadge(request.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Data Elements</p>
                <div className="flex flex-wrap gap-1">
                  {request.dataElements.slice(0, 4).map((element, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">
                      {element}
                    </span>
                  ))}
                  {request.dataElements.length > 4 && (
                    <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">
                      +{request.dataElements.length - 4}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Districts</p>
                <div className="flex flex-wrap gap-1">
                  {request.districts.map((district, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-xs">
                      {district}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">De-identification</p>
                <span className="flex items-center gap-1 text-emerald-400 text-sm">
                  <Lock className="w-3 h-3" />
                  {request.deIdentificationMethod}
                </span>
              </div>
            </div>

            {request.status === 'active' && request.expiresAt && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
                <p className="text-sm text-amber-400">
                  Access expires: {new Date(request.expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
              {request.status === 'active' && (
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">
                  <Lock className="w-4 h-4" />
                  Access Data Room
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Database className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p>No data requests found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-indigo-400 hover:text-indigo-300"
          >
            Create a new data request
          </button>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateDataRequestModal
            researcherId={researcherId}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateRequest}
            submitting={submitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// CREATE DATA REQUEST MODAL
// ===========================================

interface CreateDataRequestModalProps {
  researcherId: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
}

const CreateDataRequestModal: React.FC<CreateDataRequestModalProps> = ({
  researcherId,
  onClose,
  onSubmit,
  submitting
}) => {
  const [formData, setFormData] = useState({
    title: '',
    applicationId: '',
    dataElements: [] as string[],
    districts: [] as string[],
    purpose: '',
    deIdentificationMethod: 'k-anonymity',
    retentionPeriod: '12',
  });

  const dataElementOptions = [
    'Demographics', 'Academic Performance', 'Attendance', 'Behavior',
    'STEM Participation', 'Career Readiness', 'Socioeconomic Data',
    'Special Education', 'English Learners', 'College Enrollment'
  ];

  const districtOptions = [
    'San Francisco USD', 'Oakland USD', 'Los Angeles USD',
    'San Jose USD', 'Sacramento City USD'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, researcherId });
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
          <h3 className="text-lg font-semibold text-white">New Data Access Request</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Request Information
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Request Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter request title"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Purpose *</label>
                <textarea
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Describe how this data will be used..."
                />
              </div>
            </div>
          </div>

          {/* Data Elements */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Data Elements *</label>
            <div className="flex flex-wrap gap-2">
              {dataElementOptions.map(element => (
                <button
                  key={element}
                  type="button"
                  onClick={() => {
                    const current = formData.dataElements;
                    const updated = current.includes(element)
                      ? current.filter(e => e !== element)
                      : [...current, element];
                    setFormData({ ...formData, dataElements: updated });
                  }}
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

          {/* Districts */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">School Districts *</label>
            <div className="flex flex-wrap gap-2">
              {districtOptions.map(district => (
                <button
                  key={district}
                  type="button"
                  onClick={() => {
                    const current = formData.districts;
                    const updated = current.includes(district)
                      ? current.filter(d => d !== district)
                      : [...current, district];
                    setFormData({ ...formData, districts: updated });
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    formData.districts.includes(district)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>

          {/* Compliance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">De-identification Method</label>
              <select
                value={formData.deIdentificationMethod}
                onChange={(e) => setFormData({ ...formData, deIdentificationMethod: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="k-anonymity">k-anonymity (k=5)</option>
                <option value="l-diversity">l-diversity</option>
                <option value="differential-privacy">Differential Privacy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data Retention Period</label>
              <select
                value={formData.retentionPeriod}
                onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
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
              type="submit"
              disabled={submitting || formData.dataElements.length === 0 || formData.districts.length === 0}
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
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DataRequestsTab;
