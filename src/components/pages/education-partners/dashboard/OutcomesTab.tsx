// ===========================================
// Outcomes Tab - Partner Dashboard
// Track graduate placements and outcomes
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  TrendingUp,
  DollarSign,
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  Search,
  Download,
  CheckCircle,
  Clock,
  Building2,
  Loader2,
  X,
  FileText
} from 'lucide-react';
import {
  getGraduateOutcomes,
  createGraduateOutcome,
  updateGraduateOutcome,
  deleteGraduateOutcome,
  type GraduateOutcome
} from '@/services/educationPartnerApi';

// ===========================================
// TYPES
// ===========================================

interface OutcomesTabProps {
  partnerId: string;
  programs: Array<{ id: string; name: string }>;
}

interface OutcomeFormData {
  programId: string;
  graduationYear: number;
  totalGraduates: number;
  employedInField: number;
  continuedEducation: number;
  averageStartingSalary: number;
  topEmployers: string[];
  certificationsPassed: number;
  reportingPeriod: string;
  verificationStatus: string;
  notes: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const INITIAL_FORM_DATA: OutcomeFormData = {
  programId: '',
  graduationYear: CURRENT_YEAR,
  totalGraduates: 0,
  employedInField: 0,
  continuedEducation: 0,
  averageStartingSalary: 0,
  topEmployers: [],
  certificationsPassed: 0,
  reportingPeriod: 'annual',
  verificationStatus: 'pending',
  notes: ''
};

// Helper to transform GraduateOutcome to form data
function outcomeToFormData(outcome: GraduateOutcome): OutcomeFormData {
  return {
    programId: outcome.programId || '',
    graduationYear: outcome.graduationYear,
    totalGraduates: outcome.cohortSize || 0,
    employedInField: outcome.employedInFieldCount,
    continuedEducation: outcome.continuingEducationCount,
    averageStartingSalary: outcome.averageSalary || 0,
    topEmployers: outcome.topEmployers?.map(e => e.name) || [],
    certificationsPassed: 0, // Not in API type
    reportingPeriod: outcome.graduationTerm || 'annual',
    verificationStatus: outcome.dataVerified ? 'verified' : 'pending',
    notes: ''
  };
}

// ===========================================
// MAIN COMPONENT
// ===========================================

const OutcomesTab: React.FC<OutcomesTabProps> = ({ partnerId, programs }) => {
  const [outcomes, setOutcomes] = useState<GraduateOutcome[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<GraduateOutcome | null>(null);
  const [formData, setFormData] = useState<OutcomeFormData>(INITIAL_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [employerInput, setEmployerInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showExportNotification, setShowExportNotification] = useState(false);

  useEffect(() => {
    loadOutcomes();
  }, [partnerId]);

  const loadOutcomes = async () => {
    setLoading(true);
    const data = await getGraduateOutcomes(partnerId);
    setOutcomes(data);
    setLoading(false);
  };

  // Calculate aggregated stats
  const stats = {
    totalGraduates: outcomes.reduce((sum, o) => sum + (o.cohortSize || 0), 0),
    totalEmployed: outcomes.reduce((sum, o) => sum + o.employedInFieldCount, 0),
    avgSalary: outcomes.length > 0
      ? Math.round(outcomes.reduce((sum, o) => sum + (o.averageSalary || 0), 0) / outcomes.length)
      : 0,
    placementRate: outcomes.length > 0 && outcomes.reduce((sum, o) => sum + (o.cohortSize || 0), 0) > 0
      ? Math.round((outcomes.reduce((sum, o) => sum + o.employedInFieldCount, 0) /
          outcomes.reduce((sum, o) => sum + (o.cohortSize || 0), 0)) * 100)
      : 0
  };

  // Filter outcomes
  const filteredOutcomes = outcomes.filter(o => {
    const program = programs.find(p => p.id === o.programId);
    const matchesSearch = !searchQuery ||
      program?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.topEmployers?.some(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesYear = yearFilter === 'all' || o.graduationYear === yearFilter;
    return (matchesSearch ?? false) && matchesYear;
  });

  const handleOpenModal = (outcome?: GraduateOutcome) => {
    if (outcome) {
      setEditingOutcome(outcome);
      setFormData(outcomeToFormData(outcome));
    } else {
      setEditingOutcome(null);
      setFormData({ ...INITIAL_FORM_DATA, programId: programs[0]?.id || '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.programId) return;

    setSaving(true);

    if (editingOutcome) {
      await updateGraduateOutcome(editingOutcome.id, formData);
    } else {
      await createGraduateOutcome(partnerId, formData);
    }

    await loadOutcomes();
    setShowModal(false);
    setEditingOutcome(null);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteGraduateOutcome(id);
    await loadOutcomes();
    setShowDeleteConfirm(null);
  };

  const handleExportReport = () => {
    setShowExportNotification(true);
    setTimeout(() => setShowExportNotification(false), 3000);
  };

  const addEmployer = () => {
    if (employerInput.trim() && !formData.topEmployers.includes(employerInput.trim())) {
      setFormData({
        ...formData,
        topEmployers: [...formData.topEmployers, employerInput.trim()]
      });
      setEmployerInput('');
    }
  };

  const removeEmployer = (employer: string) => {
    setFormData({
      ...formData,
      topEmployers: formData.topEmployers.filter(e => e !== employer)
    });
  };

  const getStatusBadge = (dataVerified: boolean) => {
    if (dataVerified) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" />
          Verified
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Graduate Outcomes</h2>
          <p className="text-gray-400">Track placement rates and employment data for accreditation</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportReport} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Outcome Data
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalGraduates.toLocaleString()}</div>
          </div>
          <div className="text-sm text-gray-400">Total Graduates</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalEmployed.toLocaleString()}</div>
          </div>
          <div className="text-sm text-gray-400">Employed in Field</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.placementRate}%</div>
          </div>
          <div className="text-sm text-gray-400">Placement Rate</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">${stats.avgSalary.toLocaleString()}</div>
          </div>
          <div className="text-sm text-gray-400">Avg Starting Salary</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by program or employer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Years</option>
          {YEARS.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Outcomes Table */}
      {filteredOutcomes.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No outcome data yet</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Start tracking graduate placements and outcomes for your programs.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Outcome
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Program</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Year</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Graduates</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Employed</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Avg Salary</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOutcomes.map((outcome) => {
                const program = programs.find(p => p.id === outcome.programId);
                const placementRate = (outcome.cohortSize || 0) > 0
                  ? Math.round((outcome.employedInFieldCount / (outcome.cohortSize || 1)) * 100)
                  : 0;

                return (
                  <motion.tr
                    key={outcome.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{program?.name || 'Unknown Program'}</div>
                          <div className="text-sm text-gray-400">{outcome.graduationTerm || 'Annual'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{outcome.graduationYear}</td>
                    <td className="px-6 py-4 text-white">{outcome.cohortSize || 0}</td>
                    <td className="px-6 py-4">
                      <div className="text-white">{outcome.employedInFieldCount}</div>
                      <div className="text-xs text-emerald-400">{placementRate}% rate</div>
                    </td>
                    <td className="px-6 py-4 text-white">${(outcome.averageSalary || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(outcome.dataVerified)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(outcome)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(outcome.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Export Notification */}
      {showExportNotification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Export Started</p>
              <p className="text-gray-400 text-xs">Your outcomes report is being prepared for download.</p>
            </div>
            <button onClick={() => setShowExportNotification(false)} className="text-gray-400 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Delete Outcome Record?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone. The outcome data will be permanently removed.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete Record</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">
                {editingOutcome ? 'Edit Outcome Data' : 'Add Outcome Data'}
              </h3>
              <p className="text-gray-400 text-sm">Record graduate placement and employment outcomes</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Program & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Program *</label>
                  <select
                    value={formData.programId}
                    onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select program...</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Graduation Year *</label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    {YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Graduate Numbers */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Total Graduates *</label>
                  <input
                    type="number"
                    value={formData.totalGraduates}
                    onChange={(e) => setFormData({ ...formData, totalGraduates: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Employed in Field</label>
                  <input
                    type="number"
                    value={formData.employedInField}
                    onChange={(e) => setFormData({ ...formData, employedInField: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Continued Education</label>
                  <input
                    type="number"
                    value={formData.continuedEducation}
                    onChange={(e) => setFormData({ ...formData, continuedEducation: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Average Starting Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.averageStartingSalary}
                    onChange={(e) => setFormData({ ...formData, averageStartingSalary: parseInt(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Top Employers */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Top Employers</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={employerInput}
                    onChange={(e) => setEmployerInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmployer())}
                    placeholder="Add employer name..."
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={addEmployer}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.topEmployers.map((employer, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-white rounded-full text-sm"
                    >
                      <Building2 className="w-3 h-3" />
                      {employer}
                      <button
                        onClick={() => removeEmployer(employer)}
                        className="ml-1 text-gray-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Reporting Period */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Reporting Period</label>
                <select
                  value={formData.reportingPeriod}
                  onChange={(e) => setFormData({ ...formData, reportingPeriod: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="annual">Annual</option>
                  <option value="spring">Spring</option>
                  <option value="fall">Fall</option>
                  <option value="summer">Summer</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Additional notes about this reporting period..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingOutcome(null);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.programId}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingOutcome ? 'Update' : 'Save'} Outcome
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OutcomesTab;
