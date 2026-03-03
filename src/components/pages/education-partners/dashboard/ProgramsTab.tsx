// ===========================================
// Programs Tab - Partner Dashboard
// CRUD operations for partner programs
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  ExternalLink,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  getPartnerPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  type PartnerProgram
} from '@/services/educationPartnerApi';
import { checkTierLimit, type PartnerSubscription } from '@/services/partnerBillingService';

// ===========================================
// TYPES
// ===========================================

interface ProgramsTabProps {
  partnerId: string;
  subscription: PartnerSubscription;
  onProgramCountChange?: (count: number) => void;
}

interface ProgramFormData {
  name: string;
  programType: string;
  description: string;
  duration: string;
  format: 'in_person' | 'online' | 'hybrid' | 'self_paced' | 'cohort_based';
  accreditation: string;
  enrollmentSize: number | undefined;
  focusAreas: string[];
  industries: string[];
  graduationRate: number | undefined;
  placementRate: number | undefined;
  averageStartingSalary: number | undefined;
  tuitionCost: number | undefined;
  financialAidAvailable: boolean;
  externalUrl: string;
  applicationUrl: string;
}

// ===========================================
// CONSTANTS
// ===========================================

const PROGRAM_TYPES = [
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctoral',
  'Associate Degree',
  'Certificate Program',
  'Bootcamp / Intensive',
  'Professional Development',
  'Apprenticeship',
  'Online Course',
  'Research Fellowship',
  'Internship Program'
];

const FORMATS = [
  { value: 'in_person', label: 'In-Person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'self_paced', label: 'Self-Paced' },
  { value: 'cohort_based', label: 'Cohort-Based' }
];

const FOCUS_AREAS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'Software Engineering',
  'Quantum Computing',
  'Semiconductor',
  'Robotics',
  'Biotechnology'
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Defense',
  'Energy',
  'Manufacturing',
  'Aerospace',
  'Telecommunications'
];

const emptyFormData: ProgramFormData = {
  name: '',
  programType: '',
  description: '',
  duration: '',
  format: 'in_person',
  accreditation: '',
  enrollmentSize: undefined,
  focusAreas: [],
  industries: [],
  graduationRate: undefined,
  placementRate: undefined,
  averageStartingSalary: undefined,
  tuitionCost: undefined,
  financialAidAvailable: false,
  externalUrl: '',
  applicationUrl: ''
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const ProgramsTab: React.FC<ProgramsTabProps> = ({ partnerId, subscription, onProgramCountChange }) => {
  const [programs, setPrograms] = useState<PartnerProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<PartnerProgram | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch programs on mount
  useEffect(() => {
    loadPrograms();
  }, [partnerId]);

  const loadPrograms = async () => {
    setLoading(true);
    const data = await getPartnerPrograms(partnerId);
    setPrograms(data);
    onProgramCountChange?.(data.length);
    setLoading(false);
  };

  // Filter programs
  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.programType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle add new program
  const handleAddProgram = () => {
    const limitCheck = checkTierLimit(subscription, 'addProgram', programs.length);
    if (!limitCheck.allowed) {
      setError(limitCheck.reason || 'Cannot add more programs');
      return;
    }
    setEditingProgram(null);
    setFormData(emptyFormData);
    setShowModal(true);
  };

  // Handle edit program
  const handleEditProgram = (program: PartnerProgram) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      programType: program.programType,
      description: program.description || '',
      duration: program.duration || '',
      format: program.format,
      accreditation: program.accreditation || '',
      enrollmentSize: program.enrollmentSize,
      focusAreas: program.focusAreas,
      industries: program.industries,
      graduationRate: program.graduationRate,
      placementRate: program.placementRate,
      averageStartingSalary: program.averageStartingSalary,
      tuitionCost: program.tuitionCost,
      financialAidAvailable: program.financialAidAvailable,
      externalUrl: program.externalUrl || '',
      applicationUrl: program.applicationUrl || ''
    });
    setShowModal(true);
  };

  // Handle save program
  const handleSave = async (status: 'draft' | 'active') => {
    if (!formData.name || !formData.programType) {
      setError('Program name and type are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingProgram) {
        // Update existing
        const success = await updateProgram(editingProgram.id, {
          ...formData,
          status,
          skills: []
        });
        if (success) {
          await loadPrograms();
          setShowModal(false);
        } else {
          setError('Failed to update program');
        }
      } else {
        // Create new
        const newProgram = await createProgram(partnerId, {
          ...formData,
          status,
          skills: [],
          featured: false
        });
        if (newProgram) {
          await loadPrograms();
          setShowModal(false);
        } else {
          setError('Failed to create program');
        }
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete program
  const handleDelete = async (programId: string) => {
    const success = await deleteProgram(programId, partnerId);
    if (success) {
      await loadPrograms();
      setDeleteConfirm(null);
    }
  };

  // Toggle array field
  const toggleArrayField = (field: 'focusAreas' | 'industries', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Your Programs</h2>
          <p className="text-gray-400">Manage your educational programs and track outcomes</p>
        </div>
        <button
          onClick={handleAddProgram}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Programs Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Programs Yet</h3>
            <p className="text-gray-400 mb-4">Add your first program to start connecting with students and employers.</p>
            <button
              onClick={handleAddProgram}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Program
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Program</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 hidden md:table-cell">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 hidden lg:table-cell">Format</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 hidden lg:table-cell">Enrollment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 hidden md:table-cell">Placement</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPrograms.map((program) => (
                <tr key={program.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{program.name}</p>
                    <p className="text-sm text-gray-400 md:hidden">{program.programType}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">{program.programType}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell capitalize">{program.format?.replace('_', ' ')}</td>
                  <td className="px-6 py-4 text-sm text-white hidden lg:table-cell">{program.enrollmentSize || '-'}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {program.placementRate ? (
                      <span className="text-emerald-400">{program.placementRate}%</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      program.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : program.status === 'draft'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {program.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {program.externalUrl && (
                        <a
                          href={program.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEditProgram(program)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(program.id)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {editingProgram ? 'Edit Program' : 'Add New Program'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Program Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g., Computer Science B.S."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Program Type *</label>
                    <select
                      value={formData.programType}
                      onChange={(e) => setFormData(prev => ({ ...prev, programType: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Select type...</option>
                      {PROGRAM_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Format</label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as ProgramFormData['format'] }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      {FORMATS.map(format => (
                        <option key={format.value} value={format.value}>{format.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g., 4 years, 12 weeks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Accreditation</label>
                    <input
                      type="text"
                      value={formData.accreditation}
                      onChange={(e) => setFormData(prev => ({ ...prev, accreditation: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g., ABET Accredited"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                      placeholder="Brief description of the program..."
                    />
                  </div>
                </div>

                {/* Focus Areas */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Focus Areas</label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_AREAS.map(area => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArrayField('focusAreas', area)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.focusAreas.includes(area)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Target Industries</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(industry => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => toggleArrayField('industries', industry)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.industries.includes(industry)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Enrollment</label>
                    <input
                      type="number"
                      value={formData.enrollmentSize || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, enrollmentSize: e.target.value ? parseInt(e.target.value) : undefined }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Graduation %</label>
                    <input
                      type="number"
                      value={formData.graduationRate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, graduationRate: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="0"
                      max={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Placement %</label>
                    <input
                      type="number"
                      value={formData.placementRate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, placementRate: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="0"
                      max={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Avg Salary ($)</label>
                    <input
                      type="number"
                      value={formData.averageStartingSalary || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, averageStartingSalary: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Program URL</label>
                    <input
                      type="url"
                      value={formData.externalUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Application URL</label>
                    <input
                      type="url"
                      value={formData.applicationUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, applicationUrl: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-gray-900 px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSave('active')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Publish</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-bold text-white mb-2">Delete Program?</h3>
              <p className="text-gray-400 mb-6">
                This action cannot be undone. The program will be permanently removed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgramsTab;
