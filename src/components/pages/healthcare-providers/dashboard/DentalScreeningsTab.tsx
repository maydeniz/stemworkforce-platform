// ===========================================
// Dental Screenings Tab
// Manage and create dental screening records
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Eye,
  Loader2,
  AlertTriangle,
  Smile,
  Calendar
} from 'lucide-react';
import { healthcareProviderApi } from '@/services/healthcareProviderApi';
import {
  generateDentalScreeningPDF,
  downloadPDF,
  type DentalScreeningPDFData
} from '@/services/pdfGenerationService';
import type { DentalScreening, DentalScreeningFormData } from '@/types/healthcareProvider';

interface DentalScreeningsTabProps {
  providerId: string;
}

const DentalScreeningsTab: React.FC<DentalScreeningsTabProps> = ({ providerId }) => {
  const [screenings, setScreenings] = useState<DentalScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedScreening, setSelectedScreening] = useState<DentalScreening | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);

  useEffect(() => {
    loadScreenings();
  }, [providerId]);

  const loadScreenings = async () => {
    setLoading(true);
    try {
      const data = await healthcareProviderApi.getDentalScreenings({ providerId });
      setScreenings(data);
    } catch (error) {
      console.error('Error loading screenings:', error);
    }
    setLoading(false);
  };

  const filteredScreenings = screenings.filter(screening => {
    const matchesSearch = screening.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (screening.schoolName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || screening.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'follow_up_needed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            <AlertCircle className="w-3 h-3" />
            Follow-up Needed
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

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Urgent</span>;
      case 'non_urgent':
        return <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">Non-Urgent</span>;
      case 'none':
        return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">No Treatment</span>;
      default:
        return null;
    }
  };

  const handleCreateScreening = async (formData: DentalScreeningFormData) => {
    setSubmitting(true);
    try {
      await healthcareProviderApi.createDentalScreening(formData);
      await loadScreenings();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating screening:', error);
    }
    setSubmitting(false);
  };

  const handleDownloadPDF = async (screening: DentalScreening) => {
    setDownloadingPDF(screening.id);
    try {
      // Build findings list
      const findings: string[] = [];
      const cavities = screening.findings?.cavities ?? screening.cavitiesCount ?? 0;
      if (cavities > 0) findings.push(`${cavities} cavities detected`);
      if (screening.findings?.gumDisease || screening.gingivitisPresent) findings.push('Gum disease present');
      if (screening.findings?.orthodonticNeeds || screening.orthodonticIssues) findings.push('Orthodontic needs identified');
      if (screening.findings?.otherFindings) {
        findings.push(...screening.findings.otherFindings);
      }

      // Build recommendations
      const recommendations: string[] = [];
      if (screening.referralNeeded) recommendations.push('Referral to dental provider recommended');
      if (screening.treatmentUrgency === 'urgent') recommendations.push('Urgent dental care needed');
      else if (screening.treatmentUrgency === 'non_urgent') recommendations.push('Schedule routine dental care');

      const pdfData: DentalScreeningPDFData = {
        studentName: screening.studentName,
        studentId: screening.studentId || 'N/A',
        dateOfBirth: screening.studentDateOfBirth || '',
        schoolName: screening.schoolName || '',
        screeningDate: screening.screeningDate,
        overallAssessment: screening.treatmentUrgency === 'none' ? 'healthy' :
                          screening.treatmentUrgency === 'urgent' ? 'urgent' : 'needs_attention',
        findings,
        recommendations,
        urgentCareNeeded: screening.treatmentUrgency === 'urgent',
        followUpRequired: screening.referralNeeded || false,
        providerName: screening.providerName || 'Healthcare Provider',
        providerCredentials: screening.providerCredentials ? [screening.providerCredentials] : [],
        providerNPI: screening.providerNPI,
      };
      const blob = await generateDentalScreeningPDF(pdfData);
      downloadPDF(blob, `dental-screening-${screening.studentName.replace(/\s+/g, '-').toLowerCase()}.html`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    setDownloadingPDF(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Dental Screenings</h2>
          <p className="text-gray-400">School-based dental screening records and referrals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Dental Screening
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {screenings.filter(s => s.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {screenings.filter(s => s.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-400">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {screenings.filter(s => s.treatmentUrgency === 'urgent').length}
              </p>
              <p className="text-sm text-gray-400">Urgent Follow-up</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Smile className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {screenings.filter(s => s.treatmentUrgency === 'none').length}
              </p>
              <p className="text-sm text-gray-400">Healthy</p>
            </div>
          </div>
        </div>
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
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="follow_up_needed">Follow-up Needed</option>
          </select>
        </div>
      </div>

      {/* Screenings List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Student</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">School</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Screening Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Treatment</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredScreenings.map((screening) => (
                <tr key={screening.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{screening.studentName}</p>
                      <p className="text-sm text-gray-400">Grade {screening.studentGrade}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300">{screening.schoolName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300">{new Date(screening.screeningDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    {getUrgencyBadge(screening.treatmentUrgency || 'none')}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(screening.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedScreening(screening)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(screening)}
                        disabled={downloadingPDF === screening.id}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                        title="Download PDF"
                      >
                        {downloadingPDF === screening.id ? (
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
        {filteredScreenings.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Smile className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>No dental screenings found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Create a new screening
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateScreeningModal
            providerId={providerId}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateScreening}
            submitting={submitting}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {selectedScreening && (
          <ViewScreeningModal
            screening={selectedScreening}
            onClose={() => setSelectedScreening(null)}
            onDownloadPDF={handleDownloadPDF}
            downloadingPDF={downloadingPDF}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// CREATE SCREENING MODAL
// ===========================================

interface CreateScreeningModalProps {
  providerId: string;
  onClose: () => void;
  onSubmit: (data: DentalScreeningFormData) => Promise<void>;
  submitting: boolean;
}

const CreateScreeningModal: React.FC<CreateScreeningModalProps> = ({
  providerId,
  onClose,
  onSubmit,
  submitting
}) => {
  const [formData, setFormData] = useState<DentalScreeningFormData>({
    providerId,
    studentId: '',
    studentName: '',
    studentGrade: '',
    schoolId: '',
    schoolName: '',
    screeningDate: new Date().toISOString().split('T')[0],
    findings: {
      cavities: 0,
      gumDisease: false,
      orthodonticNeeds: false,
      otherFindings: []
    },
    treatmentUrgency: 'none',
    referralNeeded: false,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const toggleFinding = (finding: string) => {
    const current = formData.findings.otherFindings || [];
    const updated = current.includes(finding)
      ? current.filter(f => f !== finding)
      : [...current, finding];
    setFormData({
      ...formData,
      findings: { ...formData.findings, otherFindings: updated }
    });
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
          <h3 className="text-lg font-semibold text-white">New Dental Screening</h3>
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
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Grade *</label>
                <select
                  required
                  value={formData.studentGrade}
                  onChange={(e) => setFormData({ ...formData, studentGrade: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">School Name *</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Enter school name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Screening Date *</label>
                <input
                  type="date"
                  required
                  value={formData.screeningDate}
                  onChange={(e) => setFormData({ ...formData, screeningDate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dental Findings */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Dental Findings
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Number of Cavities</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.findings.cavities}
                    onChange={(e) => setFormData({
                      ...formData,
                      findings: { ...formData.findings, cavities: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="gumDisease"
                    checked={formData.findings.gumDisease}
                    onChange={(e) => setFormData({
                      ...formData,
                      findings: { ...formData.findings, gumDisease: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-500 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                  />
                  <label htmlFor="gumDisease" className="text-sm text-gray-300">Gum Disease Present</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="orthodontic"
                    checked={formData.findings.orthodonticNeeds}
                    onChange={(e) => setFormData({
                      ...formData,
                      findings: { ...formData.findings, orthodonticNeeds: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-500 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                  />
                  <label htmlFor="orthodontic" className="text-sm text-gray-300">Orthodontic Needs</label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Additional Findings</label>
                <div className="flex flex-wrap gap-2">
                  {['Tooth decay', 'Missing teeth', 'Plaque buildup', 'Enamel erosion', 'Tooth abscess', 'Broken tooth'].map(finding => (
                    <button
                      key={finding}
                      type="button"
                      onClick={() => toggleFinding(finding)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        (formData.findings.otherFindings || []).includes(finding)
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {finding}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Urgency */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Treatment Urgency *</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'none', label: 'No Treatment Needed', desc: 'Healthy dental status', color: 'emerald' },
                { value: 'non_urgent', label: 'Non-Urgent', desc: 'Schedule routine care', color: 'amber' },
                { value: 'urgent', label: 'Urgent', desc: 'Immediate attention needed', color: 'red' }
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, treatmentUrgency: option.value as any })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.treatmentUrgency === option.value
                      ? option.color === 'emerald'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : option.color === 'amber'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <p className={`font-medium ${
                    formData.treatmentUrgency === option.value
                      ? option.color === 'emerald'
                        ? 'text-emerald-400'
                        : option.color === 'amber'
                        ? 'text-amber-400'
                        : 'text-red-400'
                      : 'text-white'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-sm text-gray-400">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Referral */}
          <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
            <input
              type="checkbox"
              id="referral"
              checked={formData.referralNeeded}
              onChange={(e) => setFormData({ ...formData, referralNeeded: e.target.checked })}
              className="w-5 h-5 text-blue-500 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
            />
            <label htmlFor="referral" className="text-white">
              Referral to dental provider recommended
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Additional notes or recommendations..."
            />
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
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Screening
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
// VIEW SCREENING MODAL
// ===========================================

interface ViewScreeningModalProps {
  screening: DentalScreening;
  onClose: () => void;
  onDownloadPDF: (screening: DentalScreening) => Promise<void>;
  downloadingPDF: string | null;
}

const ViewScreeningModal: React.FC<ViewScreeningModalProps> = ({ screening, onClose, onDownloadPDF, downloadingPDF }) => {
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
          <h3 className="text-lg font-semibold text-white">Dental Screening Details</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Student Info */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-semibold text-white">{screening.studentName}</p>
              <p className="text-gray-400">Grade {screening.studentGrade} • {screening.schoolName}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              screening.treatmentUrgency === 'none'
                ? 'bg-emerald-500/20 text-emerald-400'
                : screening.treatmentUrgency === 'non_urgent'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {screening.treatmentUrgency === 'none' ? 'No Treatment' :
               screening.treatmentUrgency === 'non_urgent' ? 'Non-Urgent' : 'Urgent'}
            </span>
          </div>

          {/* Screening Date */}
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Screening Date: {new Date(screening.screeningDate).toLocaleDateString()}</span>
          </div>

          {/* Findings */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400 mb-3">Findings</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Cavities:</span>
                <span className={`font-medium ${(screening.findings?.cavities || screening.cavitiesCount || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {screening.findings?.cavities ?? screening.cavitiesCount ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Gum Disease:</span>
                <span className={`font-medium ${(screening.findings?.gumDisease || screening.gingivitisPresent) ? 'text-red-400' : 'text-emerald-400'}`}>
                  {(screening.findings?.gumDisease || screening.gingivitisPresent) ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Orthodontic Needs:</span>
                <span className={`font-medium ${(screening.findings?.orthodonticNeeds || screening.orthodonticIssues) ? 'text-amber-400' : 'text-gray-400'}`}>
                  {(screening.findings?.orthodonticNeeds || screening.orthodonticIssues) ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            {screening.findings?.otherFindings && screening.findings.otherFindings.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Other Findings:</p>
                <div className="flex flex-wrap gap-2">
                  {screening.findings.otherFindings.map((finding: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                      {finding}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Referral Status */}
          {screening.referralNeeded && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-400 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Referral Recommended
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Student should be referred to a dental provider for follow-up care.
              </p>
            </div>
          )}

          {/* Notes */}
          {screening.notes && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Notes</p>
              <p className="text-gray-300 p-3 bg-gray-800/50 rounded-lg">{screening.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onDownloadPDF(screening)}
              disabled={downloadingPDF === screening.id}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {downloadingPDF === screening.id ? (
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

export default DentalScreeningsTab;
