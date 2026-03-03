// ===========================================
// Programs Tab - Industry Partner Dashboard
// Internship & Apprenticeship management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  GraduationCap,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
  Loader2,
  Award
} from 'lucide-react';
import {
  getWorkBasedPrograms,
  createWorkBasedProgram,
  updateWorkBasedProgram,
  deleteWorkBasedProgram
} from '@/services/industryPartnerApi';
import type { WorkBasedProgram, ProgramType, ProgramStatus, PartnerTier } from '@/types/industryPartner';

// ===========================================
// TYPES
// ===========================================

interface ProgramsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

interface ProgramFormData {
  name: string;
  programType: ProgramType;
  description: string;
  department: string;
  location: string;
  isRemote: boolean;
  duration: string;
  hoursPerWeek: string;
  isPaid: boolean;
  compensation: string;
  compensationType: string;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  requiredMajors: string;
  requiredSkills: string;
  minimumGpa: string;
  eligibilityRequirements: string;
  totalPositions: string;
  dolRegistered: boolean;
  dolRegistrationNumber: string;
  relatedTechnicalInstruction: string;
}

// ===========================================
// CONSTANTS
// ===========================================

const PROGRAM_TYPES: { value: ProgramType; label: string; description: string }[] = [
  { value: 'internship', label: 'Internship', description: 'Temporary work experience, typically 10-16 weeks' },
  { value: 'apprenticeship', label: 'Apprenticeship', description: 'DOL registered earn-and-learn program' },
  { value: 'co_op', label: 'Co-op', description: 'Alternating work and academic terms' },
  { value: 'fellowship', label: 'Fellowship', description: 'Research or professional development program' }
];

const PROGRAM_STATUSES: { value: ProgramStatus; label: string; color: string }[] = [
  { value: 'planning', label: 'Planning', color: 'bg-gray-500' },
  { value: 'recruiting', label: 'Recruiting', color: 'bg-blue-500' },
  { value: 'active', label: 'Active', color: 'bg-emerald-500' },
  { value: 'completed', label: 'Completed', color: 'bg-purple-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
];

const EMPTY_FORM: ProgramFormData = {
  name: '',
  programType: 'internship',
  description: '',
  department: '',
  location: '',
  isRemote: false,
  duration: '',
  hoursPerWeek: '40',
  isPaid: true,
  compensation: '',
  compensationType: 'hourly',
  startDate: '',
  endDate: '',
  applicationDeadline: '',
  requiredMajors: '',
  requiredSkills: '',
  minimumGpa: '',
  eligibilityRequirements: '',
  totalPositions: '1',
  dolRegistered: false,
  dolRegistrationNumber: '',
  relatedTechnicalInstruction: ''
};

// ===========================================
// TIER LIMITS
// ===========================================

const TIER_LIMITS = {
  starter: { maxPrograms: 0, hasApprenticeships: false },
  growth: { maxPrograms: 5, hasApprenticeships: false },
  enterprise: { maxPrograms: -1, hasApprenticeships: true }
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const ProgramsTab: React.FC<ProgramsTabProps> = ({ partnerId, tier }) => {
  const [programs, setPrograms] = useState<WorkBasedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkBasedProgram | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const limits = TIER_LIMITS[tier];

  useEffect(() => {
    loadPrograms();
  }, [partnerId]);

  const loadPrograms = async () => {
    setLoading(true);
    const data = await getWorkBasedPrograms(partnerId);
    setPrograms(data);
    setLoading(false);
  };

  // Filter programs
  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || p.programType === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Check tier limits
  const canAddProgram = limits.maxPrograms === -1 || programs.length < limits.maxPrograms;
  const canAddApprenticeships = limits.hasApprenticeships;

  const handleAddProgram = () => {
    if (!canAddProgram) {
      setError(`Your ${tier} plan doesn't include internship program management. Upgrade to Growth or Enterprise.`);
      return;
    }
    setEditingProgram(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleEditProgram = (program: WorkBasedProgram) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      programType: program.programType,
      description: program.description || '',
      department: program.department || '',
      location: program.location || '',
      isRemote: program.isRemote,
      duration: program.duration || '',
      hoursPerWeek: program.hoursPerWeek?.toString() || '40',
      isPaid: program.isPaid,
      compensation: program.compensation?.toString() || '',
      compensationType: program.compensationType || 'hourly',
      startDate: program.startDate?.split('T')[0] || '',
      endDate: program.endDate?.split('T')[0] || '',
      applicationDeadline: program.applicationDeadline?.split('T')[0] || '',
      requiredMajors: program.requiredMajors?.join(', ') || '',
      requiredSkills: program.requiredSkills.join(', '),
      minimumGpa: program.minimumGpa?.toString() || '',
      eligibilityRequirements: program.eligibilityRequirements?.join('\n') || '',
      totalPositions: program.totalPositions.toString(),
      dolRegistered: program.dolRegistered || false,
      dolRegistrationNumber: program.dolRegistrationNumber || '',
      relatedTechnicalInstruction: program.relatedTechnicalInstruction || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.programType) {
      setError('Name and program type are required');
      return;
    }

    if (formData.programType === 'apprenticeship' && !canAddApprenticeships) {
      setError('Apprenticeship management requires an Enterprise plan');
      return;
    }

    setSaving(true);
    setError(null);

    const programData = {
      name: formData.name,
      programType: formData.programType,
      description: formData.description,
      department: formData.department || '',
      location: formData.location || '',
      isRemote: formData.isRemote,
      duration: formData.duration,
      hoursPerWeek: parseInt(formData.hoursPerWeek) || 40,
      isPaid: formData.isPaid,
      compensation: formData.compensation ? parseInt(formData.compensation) : undefined,
      compensationType: formData.compensationType as WorkBasedProgram['compensationType'],
      startDate: formData.startDate,
      endDate: formData.endDate,
      applicationDeadline: formData.applicationDeadline,
      requiredMajors: formData.requiredMajors.split(',').map(m => m.trim()).filter(m => m),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      minimumGpa: formData.minimumGpa ? parseFloat(formData.minimumGpa) : undefined,
      eligibilityRequirements: formData.eligibilityRequirements.split('\n').filter(e => e.trim()),
      totalPositions: parseInt(formData.totalPositions) || 1,
      filledPositions: editingProgram?.filledPositions || 0,
      dolRegistered: formData.dolRegistered,
      dolRegistrationNumber: formData.dolRegistrationNumber || undefined,
      relatedTechnicalInstruction: formData.relatedTechnicalInstruction || undefined,
      status: (editingProgram?.status || 'planning') as ProgramStatus
    };

    if (editingProgram) {
      const success = await updateWorkBasedProgram(editingProgram.id, programData);
      if (success) {
        await loadPrograms();
        setShowModal(false);
      } else {
        setError('Failed to update program');
      }
    } else {
      const created = await createWorkBasedProgram(partnerId, programData);
      if (created) {
        await loadPrograms();
        setShowModal(false);
      } else {
        setError('Failed to create program');
      }
    }

    setSaving(false);
  };

  const handleDelete = async (programId: string) => {
    const success = await deleteWorkBasedProgram(programId);
    if (success) {
      await loadPrograms();
      setDeleteConfirm(null);
    }
  };

  const [upgradeNotification, setUpgradeNotification] = useState<string | null>(null);

  const handleUpgrade = () => {
    setUpgradeNotification('Redirecting to billing page to upgrade your plan...');
    setTimeout(() => {
      setUpgradeNotification(null);
      window.location.href = '/industry-partners/dashboard?tab=billing';
    }, 1500);
  };

  if (tier === 'starter') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Internship & Apprenticeship Programs</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          Create and manage internship, co-op, and apprenticeship programs with DOL compliance support.
          Upgrade to Growth or Enterprise to access this feature.
        </p>
        <button
          onClick={handleUpgrade}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          Upgrade to Access
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Internship & Apprenticeship Programs</h2>
          <p className="text-gray-400">
            {programs.length} program{programs.length !== 1 ? 's' : ''}
            {limits.maxPrograms !== -1 && ` (${limits.maxPrograms - programs.length} remaining)`}
          </p>
        </div>
        <button
          onClick={handleAddProgram}
          disabled={!canAddProgram}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {upgradeNotification && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {upgradeNotification}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          {error}
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
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Types</option>
          {PROGRAM_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Status</option>
          {PROGRAM_STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Programs Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredPrograms.map((program) => {
          const statusInfo = PROGRAM_STATUSES.find(s => s.value === program.status) || PROGRAM_STATUSES[0];
          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    program.programType === 'internship' ? 'bg-blue-500/20' :
                    program.programType === 'apprenticeship' ? 'bg-purple-500/20' :
                    program.programType === 'co_op' ? 'bg-amber-500/20' :
                    'bg-emerald-500/20'
                  }`}>
                    <GraduationCap className={`w-6 h-6 ${
                      program.programType === 'internship' ? 'text-blue-400' :
                      program.programType === 'apprenticeship' ? 'text-purple-400' :
                      program.programType === 'co_op' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{program.name}</h3>
                      {program.dolRegistered && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                          <Award className="w-3 h-3" /> DOL
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 capitalize">{program.programType.replace('_', ' ')} • {program.department}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 ${statusInfo.color}/20 rounded text-xs`}
                  style={{ backgroundColor: `${statusInfo.color.replace('bg-', '')}20` }}
                >
                  {statusInfo.label}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {program.isRemote ? 'Remote' : program.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {program.startDate && new Date(program.startDate).toLocaleDateString()} - {program.endDate && new Date(program.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {program.duration} • {program.hoursPerWeek} hrs/week
                </div>
                {program.isPaid && program.compensation && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                    ${program.compensation}{program.compensationType === 'hourly' ? '/hr' : program.compensationType === 'stipend' ? ' stipend' : '/year'}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{program.filledPositions}/{program.totalPositions} positions filled</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditProgram(program)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(program.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {deleteConfirm === program.id && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400 mb-3">Are you sure you want to delete this program?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredPrograms.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No programs found</p>
            <button
              onClick={handleAddProgram}
              className="mt-4 text-emerald-400 hover:text-emerald-300"
            >
              Create your first program
            </button>
          </div>
        )}
      </div>

      {/* Program Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {editingProgram ? 'Edit Program' : 'Create New Program'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Program Type Selection */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Program Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROGRAM_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, programType: type.value })}
                        disabled={type.value === 'apprenticeship' && !canAddApprenticeships}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          formData.programType === type.value
                            ? 'bg-emerald-500/20 border-2 border-emerald-500'
                            : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                        } ${type.value === 'apprenticeship' && !canAddApprenticeships ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <p className="font-medium text-white">{type.label}</p>
                        <p className="text-xs text-gray-400">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Program Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g., Summer 2025 Software Engineering Internship"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., Engineering"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isRemote}
                      onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-white">Remote position</span>
                  </label>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Describe the program, responsibilities, and learning opportunities..."
                    />
                  </div>
                </div>

                {/* Schedule & Compensation */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Schedule & Compensation</h4>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., 12 weeks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Hours/Week</label>
                      <input
                        type="number"
                        value={formData.hoursPerWeek}
                        onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Positions</label>
                      <input
                        type="number"
                        value={formData.totalPositions}
                        onChange={(e) => setFormData({ ...formData, totalPositions: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Application Deadline</label>
                      <input
                        type="date"
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPaid}
                      onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-white">Paid position</span>
                  </label>

                  {formData.isPaid && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Compensation Amount</label>
                        <input
                          type="number"
                          value={formData.compensation}
                          onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                          placeholder="e.g., 25"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Compensation Type</label>
                        <select
                          value={formData.compensationType}
                          onChange={(e) => setFormData({ ...formData, compensationType: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="stipend">Stipend</option>
                          <option value="salary">Salary</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Requirements</h4>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Required Skills (comma separated)</label>
                    <input
                      type="text"
                      value={formData.requiredSkills}
                      onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g., Python, Java, SQL"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Required Majors (comma separated)</label>
                      <input
                        type="text"
                        value={formData.requiredMajors}
                        onChange={(e) => setFormData({ ...formData, requiredMajors: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., Computer Science, Engineering"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Minimum GPA</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="4"
                        value={formData.minimumGpa}
                        onChange={(e) => setFormData({ ...formData, minimumGpa: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., 3.0"
                      />
                    </div>
                  </div>
                </div>

                {/* DOL Compliance (Apprenticeships only) */}
                {formData.programType === 'apprenticeship' && (
                  <div className="space-y-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">DOL Compliance</h4>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.dolRegistered}
                        onChange={(e) => setFormData({ ...formData, dolRegistered: e.target.checked })}
                        className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-white">DOL Registered Apprenticeship</span>
                    </label>

                    {formData.dolRegistered && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">DOL Registration Number</label>
                          <input
                            type="text"
                            value={formData.dolRegistrationNumber}
                            onChange={(e) => setFormData({ ...formData, dolRegistrationNumber: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Related Technical Instruction</label>
                          <textarea
                            value={formData.relatedTechnicalInstruction}
                            onChange={(e) => setFormData({ ...formData, relatedTechnicalInstruction: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="Describe the related technical instruction component..."
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-900 px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProgram ? 'Save Changes' : 'Create Program'}
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
