// ===========================================
// Programs Tab - Nonprofit Partner Dashboard
// Program management and enrollment tracking
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  GraduationCap,
  Users,
  MapPin,
  Clock,
  Edit3,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '@/services/nonprofitPartnerApi';
import type { Program, ProgramStatus, ProgramType, PartnerTier, FundingSource } from '@/types/nonprofitPartner';

// ===========================================
// TYPES
// ===========================================

interface ProgramsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

// ===========================================
// CONSTANTS
// ===========================================

const PROGRAM_TYPES: { value: ProgramType; label: string }[] = [
  { value: 'job_training', label: 'Job Training' },
  { value: 'career_services', label: 'Career Services' },
  { value: 'stem_education', label: 'STEM Education' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'apprenticeship', label: 'Apprenticeship' },
  { value: 'internship', label: 'Internship' },
  { value: 'bootcamp', label: 'Bootcamp' },
  { value: 'other', label: 'Other' }
];

const FUNDING_SOURCES: { value: FundingSource; label: string }[] = [
  { value: 'federal_grant', label: 'Federal Grant' },
  { value: 'state_grant', label: 'State Grant' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'individual_donors', label: 'Individual Donors' },
  { value: 'earned_revenue', label: 'Earned Revenue' },
  { value: 'other', label: 'Other' }
];

const SAMPLE_PROGRAMS: Program[] = [
  {
    id: '1',
    partnerId: '1',
    name: 'Web Development Bootcamp',
    description: '12-week intensive coding bootcamp covering HTML, CSS, JavaScript, React, and Node.js',
    programType: 'bootcamp',
    targetPopulation: ['Unemployed adults', 'Career changers'],
    duration: '12 weeks',
    format: 'hybrid',
    location: 'Downtown Campus',
    capacity: 30,
    enrolledCount: 24,
    waitlistCount: 8,
    startDate: '2025-02-01',
    endDate: '2025-04-25',
    applicationDeadline: '2025-01-15',
    isRollingAdmission: false,
    fundingSources: ['federal_grant', 'foundation'],
    completionRate: 85,
    placementRate: 78,
    averageWageIncrease: 22000,
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    name: 'IT Fundamentals Certificate',
    description: '8-week foundational IT program covering hardware, networking, and basic cybersecurity',
    programType: 'job_training',
    targetPopulation: ['Entry-level job seekers', 'Veterans'],
    duration: '8 weeks',
    format: 'in_person',
    location: 'Main Office',
    capacity: 20,
    enrolledCount: 18,
    waitlistCount: 3,
    isRollingAdmission: true,
    fundingSources: ['state_grant'],
    completionRate: 90,
    placementRate: 82,
    status: 'active',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

export const ProgramsTab: React.FC<ProgramsTabProps> = ({ partnerId, tier }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    programType: 'job_training' as ProgramType,
    duration: '',
    format: 'in_person' as Program['format'],
    location: '',
    capacity: 20,
    fundingSources: [] as FundingSource[],
    isRollingAdmission: false
  });

  useEffect(() => {
    loadPrograms();
  }, [partnerId]);

  const loadPrograms = async () => {
    setLoading(true);
    const data = await getPrograms(partnerId);
    setPrograms(data.length > 0 ? data : SAMPLE_PROGRAMS);
    setLoading(false);
  };

  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const maxPrograms = tier === 'community' ? 3 : -1;
  const canAddProgram = maxPrograms === -1 || programs.length < maxPrograms;

  const handleSaveProgram = async () => {
    setSaving(true);

    if (editingProgram) {
      const success = await updateProgram(editingProgram.id, {
        name: formData.name,
        description: formData.description,
        programType: formData.programType,
        capacity: formData.capacity,
        status: editingProgram.status
      });
      if (success) {
        await loadPrograms();
        closeModal();
      }
    } else {
      const program = await createProgram(partnerId, {
        name: formData.name,
        description: formData.description,
        programType: formData.programType,
        targetPopulation: [],
        duration: formData.duration,
        format: formData.format,
        location: formData.location,
        capacity: formData.capacity,
        enrolledCount: 0,
        waitlistCount: 0,
        isRollingAdmission: formData.isRollingAdmission,
        fundingSources: formData.fundingSources,
        status: 'draft',
        featured: false
      });
      if (program) {
        await loadPrograms();
        closeModal();
      }
    }

    setSaving(false);
  };

  const handleDeleteProgram = async (programId: string) => {
    const success = await deleteProgram(programId);
    if (success) {
      await loadPrograms();
      setDeleteConfirm(null);
    }
  };

  const handleStatusChange = async (programId: string, status: ProgramStatus) => {
    const success = await updateProgram(programId, { status });
    if (success) {
      await loadPrograms();
    }
  };

  const openEditModal = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      programType: program.programType,
      duration: program.duration,
      format: program.format,
      location: program.location || '',
      capacity: program.capacity,
      fundingSources: program.fundingSources,
      isRollingAdmission: program.isRollingAdmission
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData({
      name: '',
      description: '',
      programType: 'job_training',
      duration: '',
      format: 'in_person',
      location: '',
      capacity: 20,
      fundingSources: [],
      isRollingAdmission: false
    });
  };

  const toggleFundingSource = (source: FundingSource) => {
    setFormData(prev => ({
      ...prev,
      fundingSources: prev.fundingSources.includes(source)
        ? prev.fundingSources.filter(s => s !== source)
        : [...prev.fundingSources, source]
    }));
  };

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
          <h2 className="text-xl font-bold text-white">Programs</h2>
          <p className="text-gray-400">Manage training programs and track enrollment</p>
        </div>
        <button
          onClick={() => canAddProgram && setShowModal(true)}
          disabled={!canAddProgram}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Program
          {!canAddProgram && <span className="text-xs">(Upgrade for more)</span>}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Programs Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredPrograms.map(program => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{program.name}</h3>
                    <p className="text-sm text-gray-400">
                      {PROGRAM_TYPES.find(t => t.value === program.programType)?.label}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  program.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  program.status === 'draft' ? 'bg-gray-500/20 text-gray-400' :
                  program.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {program.status}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{program.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {program.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {program.format}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  {program.enrolledCount}/{program.capacity} enrolled
                </div>
                {program.waitlistCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    {program.waitlistCount} waitlisted
                  </div>
                )}
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-gray-400">{Math.round((program.enrolledCount / program.capacity) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${Math.min(100, (program.enrolledCount / program.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Outcomes (if available) */}
              {(program.completionRate || program.placementRate) && (
                <div className="flex gap-4 mb-4 p-3 bg-gray-800/50 rounded-lg">
                  {program.completionRate && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400">{program.completionRate}%</p>
                      <p className="text-xs text-gray-400">Completion</p>
                    </div>
                  )}
                  {program.placementRate && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-400">{program.placementRate}%</p>
                      <p className="text-xs text-gray-400">Placement</p>
                    </div>
                  )}
                  {program.averageWageIncrease && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-pink-400">${(program.averageWageIncrease / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-400">Avg Increase</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                {program.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange(program.id, 'active')}
                    className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Publish
                  </button>
                )}
                {program.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(program.id, 'paused')}
                    className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-500 transition-colors"
                  >
                    Pause
                  </button>
                )}
                {program.status === 'paused' && (
                  <button
                    onClick={() => handleStatusChange(program.id, 'active')}
                    className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-500 transition-colors"
                  >
                    Resume
                  </button>
                )}
                <button
                  onClick={() => openEditModal(program)}
                  className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(program.id)}
                  className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredPrograms.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No programs found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 rounded-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-white mb-2">Delete Program?</h3>
              <p className="text-gray-400 mb-4">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProgram(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingProgram ? 'Edit Program' : 'Create Program'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-800 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Program Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="e.g., Web Development Bootcamp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Program Type</label>
                    <select
                      value={formData.programType}
                      onChange={(e) => setFormData({ ...formData, programType: e.target.value as ProgramType })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      {PROGRAM_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Format</label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value as Program['format'] })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="in_person">In Person</option>
                      <option value="virtual">Virtual</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      placeholder="e.g., 12 weeks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="e.g., Main Campus, Room 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Funding Sources</label>
                  <div className="flex flex-wrap gap-2">
                    {FUNDING_SOURCES.map(source => (
                      <button
                        key={source.value}
                        type="button"
                        onClick={() => toggleFundingSource(source.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          formData.fundingSources.includes(source.value)
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {source.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rolling"
                    checked={formData.isRollingAdmission}
                    onChange={(e) => setFormData({ ...formData, isRollingAdmission: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800"
                  />
                  <label htmlFor="rolling" className="text-sm text-gray-400">Rolling admission</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProgram}
                    disabled={!formData.name || saving}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingProgram ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgramsTab;
