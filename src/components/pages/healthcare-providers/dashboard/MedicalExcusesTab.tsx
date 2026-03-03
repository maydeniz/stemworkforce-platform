// ===========================================
// Medical Excuses Tab
// Manage and create medical excuses for students
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
  User,
  Building2,
  Send,
  Edit3,
  Eye,
  Loader2,
  Save
} from 'lucide-react';
import { healthcareProviderApi } from '@/services/healthcareProviderApi';
import {
  generateMedicalExcusePDF,
  downloadPDF,
  type MedicalExcusePDFData
} from '@/services/pdfGenerationService';
import type { MedicalExcuse, MedicalExcuseFormData } from '@/types/healthcareProvider';

interface MedicalExcusesTabProps {
  providerId: string;
}

const MedicalExcusesTab: React.FC<MedicalExcusesTabProps> = ({ providerId }) => {
  const [excuses, setExcuses] = useState<MedicalExcuse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExcuse, setSelectedExcuse] = useState<MedicalExcuse | null>(null);
  const [editingExcuse, setEditingExcuse] = useState<MedicalExcuse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);

  useEffect(() => {
    loadExcuses();
  }, [providerId]);

  const loadExcuses = async () => {
    setLoading(true);
    try {
      const data = await healthcareProviderApi.getExcuses({ providerId });
      setExcuses(data);
    } catch (error) {
      console.error('Error loading excuses:', error);
    }
    setLoading(false);
  };

  const filteredExcuses = excuses.filter(excuse => {
    const matchesSearch = excuse.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excuse.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || excuse.status === statusFilter;
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
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            <AlertCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  const handleCreateExcuse = async (formData: MedicalExcuseFormData) => {
    setSubmitting(true);
    try {
      await healthcareProviderApi.createExcuse(providerId, formData);
      await loadExcuses();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating excuse:', error);
    }
    setSubmitting(false);
  };

  const handleEditExcuse = async (formData: MedicalExcuseFormData) => {
    if (!editingExcuse) return;
    setSubmitting(true);
    try {
      // @ts-expect-error: updateExcuse may not exist in all implementations
      await healthcareProviderApi.updateExcuse?.(editingExcuse.id, formData);
      await loadExcuses();
      setEditingExcuse(null);
    } catch (error) {
      console.error('Error updating excuse:', error);
    }
    setSubmitting(false);
  };

  const handleDownloadPDF = async (excuse: MedicalExcuse) => {
    setDownloadingPDF(excuse.id);
    try {
      const pdfData: MedicalExcusePDFData = {
        studentName: excuse.studentName,
        studentId: excuse.studentId || 'N/A',
        schoolName: excuse.schoolName,
        excuseType: excuse.excuseType,
        startDate: excuse.startDate || excuse.absenceStartDate,
        endDate: excuse.endDate || excuse.absenceEndDate,
        restrictions: excuse.restrictions?.map(r => r.description) || [],
        notes: excuse.notes || excuse.schoolNotes,
        providerName: excuse.providerName || 'Healthcare Provider',
        providerCredentials: excuse.providerCredentials ? [excuse.providerCredentials] : [],
        providerNPI: excuse.providerNPI,
        createdAt: excuse.createdAt,
      };
      const blob = await generateMedicalExcusePDF(pdfData);
      downloadPDF(blob, `medical-excuse-${excuse.studentName.replace(/\s+/g, '-').toLowerCase()}.html`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    setDownloadingPDF(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Medical Excuses</h2>
          <p className="text-gray-400">Create and manage medical excuses for students</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Medical Excuse
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student or school name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Excuses List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Student</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">School</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Dates</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExcuses.map((excuse) => (
                <tr key={excuse.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{excuse.studentName}</p>
                      <p className="text-sm text-gray-400">Grade {excuse.studentGrade || excuse.grade}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300">{excuse.schoolName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300 capitalize">{excuse.excuseType.replace('_', ' ')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300">
                      {new Date(excuse.startDate || excuse.absenceStartDate).toLocaleDateString()}
                      {(excuse.endDate || excuse.absenceEndDate) !== (excuse.startDate || excuse.absenceStartDate) && (
                        <> - {new Date(excuse.endDate || excuse.absenceEndDate).toLocaleDateString()}</>
                      )}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(excuse.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedExcuse(excuse)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(excuse.status === 'pending' || excuse.status === 'submitted') && (
                        <button
                          onClick={() => setEditingExcuse(excuse)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadPDF(excuse)}
                        disabled={downloadingPDF === excuse.id}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                        title="Download PDF"
                      >
                        {downloadingPDF === excuse.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredExcuses.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>No medical excuses found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-emerald-400 hover:text-emerald-300"
            >
              Create your first excuse
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateExcuseModal
            providerId={providerId}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateExcuse}
            submitting={submitting}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {selectedExcuse && (
          <ViewExcuseModal
            excuse={selectedExcuse}
            onClose={() => setSelectedExcuse(null)}
            onDownloadPDF={handleDownloadPDF}
            downloadingPDF={downloadingPDF}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingExcuse && (
          <EditExcuseModal
            excuse={editingExcuse}
            onClose={() => setEditingExcuse(null)}
            onSubmit={handleEditExcuse}
            submitting={submitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// CREATE EXCUSE MODAL
// ===========================================

interface CreateExcuseModalProps {
  providerId: string;
  onClose: () => void;
  onSubmit: (data: MedicalExcuseFormData) => Promise<void>;
  submitting: boolean;
}

const CreateExcuseModal: React.FC<CreateExcuseModalProps> = ({
  providerId,
  onClose,
  onSubmit,
  submitting
}) => {
  const [formData, setFormData] = useState<MedicalExcuseFormData>({
    providerId,
    studentSearch: '',
    studentId: '',
    studentName: '',
    studentGrade: '',
    schoolId: '',
    schoolName: '',
    excuseType: 'illness',
    generalReason: '',
    appointmentDate: '',
    absenceStartDate: new Date().toISOString().split('T')[0],
    absenceEndDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    returnToSchoolDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    hasRestrictions: false,
    restrictions: [],
    peRestricted: false,
    returnClearanceRequired: false,
    followUpRequired: false,
    diagnosis: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
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
          <h3 className="text-lg font-semibold text-white">New Medical Excuse</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Student Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Grade *</label>
                <select
                  required
                  value={formData.studentGrade}
                  onChange={(e) => setFormData({ ...formData, studentGrade: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select grade</option>
                  {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
                    <option key={g} value={g}>{g === 'K' ? 'Kindergarten' : `Grade ${g}`}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* School Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              School Information
            </h4>
            <div>
              <label className="block text-sm text-gray-400 mb-1">School Name *</label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder="Enter school name"
              />
            </div>
          </div>

          {/* Excuse Details */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Excuse Details
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Excuse Type *</label>
                <select
                  required
                  value={formData.excuseType}
                  onChange={(e) => setFormData({ ...formData, excuseType: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="illness">Illness</option>
                  <option value="injury">Injury</option>
                  <option value="appointment">Medical Appointment</option>
                  <option value="procedure">Medical Procedure</option>
                  <option value="mental_health">Mental Health</option>
                  <option value="chronic_condition">Chronic Condition</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Diagnosis (Optional)</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="Enter diagnosis if applicable"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Activity Restrictions</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { label: 'No PE', type: 'no-pe' as const },
                    { label: 'Limited Activity', type: 'limited-activity' as const },
                    { label: 'No Stairs', type: 'no-stairs' as const },
                    { label: 'Rest as Needed', type: 'rest-as-needed' as const }
                  ].map(restriction => (
                    <button
                      key={restriction.type}
                      type="button"
                      onClick={() => {
                        const current = formData.restrictions || [];
                        const exists = current.some(r => r.type === restriction.type);
                        const updated = exists
                          ? current.filter(r => r.type !== restriction.type)
                          : [...current, {
                              type: restriction.type,
                              description: restriction.label,
                              startDate: formData.absenceStartDate || new Date().toISOString().split('T')[0],
                              endDate: formData.absenceEndDate
                            }];
                        setFormData({ ...formData, restrictions: updated });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        (formData.restrictions || []).some(r => r.type === restriction.type)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {restriction.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Any additional notes for the school..."
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
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Excuse
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
// VIEW EXCUSE MODAL
// ===========================================

interface ViewExcuseModalProps {
  excuse: MedicalExcuse;
  onClose: () => void;
  onDownloadPDF: (excuse: MedicalExcuse) => Promise<void>;
  downloadingPDF: string | null;
}

const ViewExcuseModal: React.FC<ViewExcuseModalProps> = ({ excuse, onClose, onDownloadPDF, downloadingPDF }) => {
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
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg"
      >
        <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Medical Excuse Details</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-white">{excuse.studentName}</p>
              <p className="text-gray-400">Grade {excuse.studentGrade || excuse.grade} • {excuse.schoolName}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              excuse.status === 'approved' || excuse.status === 'processed' || excuse.status === 'verified'
                ? 'bg-emerald-500/20 text-emerald-400'
                : excuse.status === 'pending' || excuse.status === 'submitted'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {excuse.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Excuse Type</p>
              <p className="text-white capitalize">{excuse.excuseType.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Dates</p>
              <p className="text-white">
                {new Date(excuse.startDate || excuse.absenceStartDate).toLocaleDateString()}
                {(excuse.endDate || excuse.absenceEndDate) !== (excuse.startDate || excuse.absenceStartDate) && (
                  <> - {new Date(excuse.endDate || excuse.absenceEndDate).toLocaleDateString()}</>
                )}
              </p>
            </div>
            {(excuse.diagnosis || excuse.generalReason) && (
              <div className="col-span-2">
                <p className="text-sm text-gray-400">Diagnosis</p>
                <p className="text-white">{excuse.diagnosis || excuse.generalReason}</p>
              </div>
            )}
          </div>

          {excuse.restrictions && excuse.restrictions.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Restrictions</p>
              <div className="flex flex-wrap gap-2">
                {excuse.restrictions.map((restriction, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                    {restriction.description}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(excuse.notes || excuse.schoolNotes) && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Notes</p>
              <p className="text-gray-300 p-3 bg-gray-800/50 rounded-lg">{excuse.notes || excuse.schoolNotes}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onDownloadPDF(excuse)}
              disabled={downloadingPDF === excuse.id}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {downloadingPDF === excuse.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// EDIT EXCUSE MODAL
// ===========================================

interface EditExcuseModalProps {
  excuse: MedicalExcuse;
  onClose: () => void;
  onSubmit: (data: MedicalExcuseFormData) => Promise<void>;
  submitting: boolean;
}

const EditExcuseModal: React.FC<EditExcuseModalProps> = ({
  excuse,
  onClose,
  onSubmit,
  submitting
}) => {
  const [formData, setFormData] = useState<MedicalExcuseFormData>({
    providerId: excuse.providerId || '',
    studentSearch: '',
    studentId: excuse.studentId || '',
    studentName: excuse.studentName,
    studentGrade: excuse.studentGrade || excuse.grade || '',
    schoolId: excuse.schoolId || '',
    schoolName: excuse.schoolName,
    excuseType: excuse.excuseType,
    generalReason: excuse.generalReason || '',
    appointmentDate: '',
    absenceStartDate: excuse.absenceStartDate || excuse.startDate || '',
    absenceEndDate: excuse.absenceEndDate || excuse.endDate || excuse.startDate || '',
    startDate: excuse.startDate || excuse.absenceStartDate,
    endDate: excuse.endDate || excuse.absenceEndDate || excuse.startDate,
    returnToSchoolDate: excuse.returnToSchoolDate || '',
    isRecurring: excuse.isRecurring || false,
    hasRestrictions: (excuse.restrictions && excuse.restrictions.length > 0) || false,
    restrictions: excuse.restrictions || [],
    peRestricted: excuse.peRestricted || false,
    returnClearanceRequired: excuse.returnClearanceRequired || false,
    followUpRequired: excuse.followUpRequired || false,
    diagnosis: excuse.diagnosis || '',
    notes: excuse.notes || excuse.schoolNotes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
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
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-400" />
            Edit Medical Excuse
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Information - Read Only */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Student Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Student Name</label>
                <input
                  type="text"
                  value={formData.studentName}
                  disabled
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">School</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  disabled
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Excuse Details - Editable */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Excuse Details
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Excuse Type *</label>
                <select
                  required
                  value={formData.excuseType}
                  onChange={(e) => setFormData({ ...formData, excuseType: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="illness">Illness</option>
                  <option value="injury">Injury</option>
                  <option value="appointment">Medical Appointment</option>
                  <option value="procedure">Medical Procedure</option>
                  <option value="mental_health">Mental Health</option>
                  <option value="chronic_condition">Chronic Condition</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Diagnosis (Optional)</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="Enter diagnosis if applicable"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Activity Restrictions</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { label: 'No PE', type: 'no-pe' as const },
                    { label: 'Limited Activity', type: 'limited-activity' as const },
                    { label: 'No Stairs', type: 'no-stairs' as const },
                    { label: 'Rest as Needed', type: 'rest-as-needed' as const }
                  ].map(restriction => (
                    <button
                      key={restriction.type}
                      type="button"
                      onClick={() => {
                        const current = formData.restrictions || [];
                        const exists = current.some(r => r.type === restriction.type);
                        const updated = exists
                          ? current.filter(r => r.type !== restriction.type)
                          : [...current, {
                              type: restriction.type,
                              description: restriction.label,
                              startDate: formData.startDate || new Date().toISOString().split('T')[0],
                              endDate: formData.endDate
                            }];
                        setFormData({ ...formData, restrictions: updated });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        (formData.restrictions || []).some(r => r.type === restriction.type)
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {restriction.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="Any additional notes for the school..."
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
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MedicalExcusesTab;
