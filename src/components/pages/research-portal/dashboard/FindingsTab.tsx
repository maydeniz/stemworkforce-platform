// ===========================================
// Findings Tab
// Submit and manage research findings
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Clock,
  X,
  Send,
  Eye,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { researchPortalApi } from '@/services/researchPortalApi';

interface FindingsTabProps {
  researcherId: string;
}

interface Finding {
  id: string;
  title: string;
  studyTitle: string;
  summary: string;
  status: string;
  submittedAt?: string;
  publicationUrl?: string;
  keyFindings: string[];
  recommendations: string[];
  dataElements: string[];
}

const FindingsTab: React.FC<FindingsTabProps> = ({ researcherId }) => {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFindings();
  }, [researcherId]);

  const loadFindings = async () => {
    setLoading(true);
    try {
      // getResearchFindings expects an applicationId, but we need to show all findings
      // For now, we'll use an empty array since the API returns single findings
      // In a real implementation, there would be a getResearcherFindings method
      setFindings([]);
    } catch (error) {
      console.error('Error loading findings:', error);
    }
    setLoading(false);
  };

  const filteredFindings = findings.filter(f =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
            <CheckCircle2 className="w-3 h-3" />
            Published
          </span>
        );
      case 'under_review':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Under Review
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
            {status}
          </span>
        );
    }
  };

  const handleCreateFinding = async (formData: any) => {
    setSubmitting(true);
    try {
      await researchPortalApi.submitResearchFindings(formData.applicationId || 'app-new', formData);
      await loadFindings();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating finding:', error);
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
          <h2 className="text-xl font-bold text-white">Research Findings</h2>
          <p className="text-gray-400">Submit and share your research findings with stakeholders</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Findings
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search findings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFindings.map((finding) => (
          <motion.div
            key={finding.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{finding.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{finding.studyTitle}</p>
              </div>
              {getStatusBadge(finding.status)}
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{finding.summary}</p>

            {finding.keyFindings.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Key Findings</p>
                <ul className="space-y-1">
                  {finding.keyFindings.slice(0, 2).map((kf, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                      {kf}
                    </li>
                  ))}
                  {finding.keyFindings.length > 2 && (
                    <li className="text-sm text-gray-500">
                      +{finding.keyFindings.length - 2} more findings
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                {finding.submittedAt && (
                  <span>Submitted {new Date(finding.submittedAt).toLocaleDateString()}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFinding(finding)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {finding.publicationUrl && (
                  <a
                    href={finding.publicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    title="View Publication"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
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

      {filteredFindings.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p>No research findings found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-indigo-400 hover:text-indigo-300"
          >
            Submit your first finding
          </button>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateFindingModal
            researcherId={researcherId}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateFinding}
            submitting={submitting}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {selectedFinding && (
          <ViewFindingModal
            finding={selectedFinding}
            onClose={() => setSelectedFinding(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// CREATE FINDING MODAL
// ===========================================

interface CreateFindingModalProps {
  researcherId: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
}

const CreateFindingModal: React.FC<CreateFindingModalProps> = ({
  researcherId,
  onClose,
  onSubmit,
  submitting
}) => {
  const [formData, setFormData] = useState({
    title: '',
    studyTitle: '',
    summary: '',
    keyFindings: [''],
    recommendations: [''],
    publicationUrl: '',
    dataElements: [] as string[],
  });

  const addFinding = () => {
    setFormData({ ...formData, keyFindings: [...formData.keyFindings, ''] });
  };

  const updateFinding = (index: number, value: string) => {
    const updated = [...formData.keyFindings];
    updated[index] = value;
    setFormData({ ...formData, keyFindings: updated });
  };

  const removeFinding = (index: number) => {
    const updated = formData.keyFindings.filter((_, i) => i !== index);
    setFormData({ ...formData, keyFindings: updated });
  };

  const addRecommendation = () => {
    setFormData({ ...formData, recommendations: [...formData.recommendations, ''] });
  };

  const updateRecommendation = (index: number, value: string) => {
    const updated = [...formData.recommendations];
    updated[index] = value;
    setFormData({ ...formData, recommendations: updated });
  };

  const removeRecommendation = (index: number) => {
    const updated = formData.recommendations.filter((_, i) => i !== index);
    setFormData({ ...formData, recommendations: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      researcherId,
      keyFindings: formData.keyFindings.filter(f => f.trim()),
      recommendations: formData.recommendations.filter(r => r.trim()),
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
          <h3 className="text-lg font-semibold text-white">Submit Research Findings</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Finding Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                placeholder="Enter finding title"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Study Title</label>
              <input
                type="text"
                value={formData.studyTitle}
                onChange={(e) => setFormData({ ...formData, studyTitle: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                placeholder="Related study title"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Summary *</label>
              <textarea
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Brief summary of findings..."
              />
            </div>
          </div>

          {/* Key Findings */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Key Findings *</label>
            <div className="space-y-2">
              {formData.keyFindings.map((finding, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={finding}
                    onChange={(e) => updateFinding(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    placeholder={`Finding ${index + 1}`}
                  />
                  {formData.keyFindings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFinding(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFinding}
              className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add another finding
            </button>
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recommendations</label>
            <div className="space-y-2">
              {formData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rec}
                    onChange={(e) => updateRecommendation(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    placeholder={`Recommendation ${index + 1}`}
                  />
                  {formData.recommendations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRecommendation(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRecommendation}
              className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add another recommendation
            </button>
          </div>

          {/* Publication URL */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Publication URL (if published)</label>
            <input
              type="url"
              value={formData.publicationUrl}
              onChange={(e) => setFormData({ ...formData, publicationUrl: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              placeholder="https://..."
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
                  Submit Findings
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
// VIEW FINDING MODAL
// ===========================================

interface ViewFindingModalProps {
  finding: Finding;
  onClose: () => void;
}

const ViewFindingModal: React.FC<ViewFindingModalProps> = ({ finding, onClose }) => {
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
          <h3 className="text-lg font-semibold text-white">Research Finding Details</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-xl font-semibold text-white">{finding.title}</h4>
            <p className="text-gray-400 mt-1">{finding.studyTitle}</p>
          </div>

          <p className="text-gray-300">{finding.summary}</p>

          {finding.keyFindings.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Key Findings</h5>
              <ul className="space-y-2">
                {finding.keyFindings.map((kf, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{kf}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {finding.recommendations.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Recommendations</h5>
              <ul className="space-y-2">
                {finding.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {finding.publicationUrl && (
            <a
              href={finding.publicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
            >
              <ExternalLink className="w-4 h-4" />
              View Publication
            </a>
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
              Download Report
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FindingsTab;
