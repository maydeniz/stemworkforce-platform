// ===========================================
// Participants Tab - Nonprofit Partner Dashboard
// Participant intake, tracking, and case management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Users,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  X,
  TrendingUp
} from 'lucide-react';
import {
  getParticipants,
  createParticipant,
  updateParticipantStatus
} from '@/services/nonprofitPartnerApi';
import type { Participant, ParticipantStatus, PartnerTier, BarrierType } from '@/types/nonprofitPartner';

// ===========================================
// TYPES
// ===========================================

interface ParticipantsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

// ===========================================
// CONSTANTS
// ===========================================

const STATUSES: { value: ParticipantStatus; label: string; color: string }[] = [
  { value: 'intake', label: 'Intake', color: 'bg-gray-500' },
  { value: 'enrolled', label: 'Enrolled', color: 'bg-blue-500' },
  { value: 'active', label: 'Active', color: 'bg-purple-500' },
  { value: 'completed', label: 'Completed', color: 'bg-indigo-500' },
  { value: 'placed', label: 'Placed', color: 'bg-emerald-500' },
  { value: 'retained', label: 'Retained', color: 'bg-green-500' },
  { value: 'exited', label: 'Exited', color: 'bg-amber-500' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-red-500' }
];

const BARRIERS: { value: BarrierType; label: string }[] = [
  { value: 'transportation', label: 'Transportation' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'housing', label: 'Housing Instability' },
  { value: 'digital_access', label: 'Digital Access' },
  { value: 'language', label: 'Language' },
  { value: 'disability', label: 'Disability' },
  { value: 'criminal_record', label: 'Criminal Record' },
  { value: 'education', label: 'Education Gap' },
  { value: 'other', label: 'Other' }
];

const SAMPLE_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    partnerId: '1',
    programId: '1',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@email.com',
    phone: '(555) 123-4567',
    educationLevel: 'High School',
    priorWageHourly: 12.50,
    employmentStatusAtIntake: 'Unemployed',
    barriers: ['transportation', 'childcare'],
    status: 'active',
    intakeDate: '2024-10-15',
    enrollmentDate: '2024-10-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    programId: '1',
    firstName: 'James',
    lastName: 'Williams',
    email: 'james.w@email.com',
    phone: '(555) 234-5678',
    educationLevel: 'Some College',
    priorWageHourly: 15.00,
    employmentStatusAtIntake: 'Underemployed',
    barriers: ['digital_access'],
    status: 'placed',
    intakeDate: '2024-08-01',
    enrollmentDate: '2024-08-10',
    completionDate: '2024-11-15',
    placementDate: '2024-12-01',
    placedEmployerName: 'TechCorp Inc.',
    placedJobTitle: 'Junior Developer',
    placedWageHourly: 28.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

export const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ partnerId, tier: _tier }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // New participant form state
  const [newParticipant, setNewParticipant] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    educationLevel: '',
    priorWageHourly: '',
    employmentStatusAtIntake: '',
    barriers: [] as BarrierType[]
  });

  useEffect(() => {
    loadParticipants();
  }, [partnerId]);

  const loadParticipants = async () => {
    setLoading(true);
    const data = await getParticipants(partnerId);
    setParticipants(data.length > 0 ? data : SAMPLE_PARTICIPANTS);
    setLoading(false);
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch =
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = STATUSES.map(s => ({
    ...s,
    count: participants.filter(p => p.status === s.value).length
  }));

  const handleStatusChange = async (participantId: string, newStatus: ParticipantStatus) => {
    const success = await updateParticipantStatus(participantId, newStatus);
    if (success) {
      await loadParticipants();
      setSelectedParticipant(null);
    }
  };

  const handleAddParticipant = async () => {
    setSaving(true);
    const participant = await createParticipant(partnerId, {
      firstName: newParticipant.firstName,
      lastName: newParticipant.lastName,
      email: newParticipant.email,
      phone: newParticipant.phone,
      educationLevel: newParticipant.educationLevel,
      priorWageHourly: parseFloat(newParticipant.priorWageHourly) || undefined,
      employmentStatusAtIntake: newParticipant.employmentStatusAtIntake,
      barriers: newParticipant.barriers,
      status: 'intake',
      intakeDate: new Date().toISOString().split('T')[0]
    });

    if (participant) {
      await loadParticipants();
      setShowAddModal(false);
      setNewParticipant({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        educationLevel: '',
        priorWageHourly: '',
        employmentStatusAtIntake: '',
        barriers: []
      });
    }
    setSaving(false);
  };

  const toggleBarrier = (barrier: BarrierType) => {
    setNewParticipant(prev => ({
      ...prev,
      barriers: prev.barriers.includes(barrier)
        ? prev.barriers.filter(b => b !== barrier)
        : [...prev.barriers, barrier]
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
          <h2 className="text-xl font-bold text-white">Participants</h2>
          <p className="text-gray-400">Track participant journeys from intake to retention</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Intake
        </button>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All ({participants.length})
        </button>
        {statusCounts.map(status => (
          <button
            key={status.value}
            onClick={() => setStatusFilter(status.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              statusFilter === status.value
                ? 'bg-pink-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${status.color}`} />
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
        />
      </div>

      {/* Participants List */}
      <div className="space-y-3">
        {filteredParticipants.map(participant => {
          const statusInfo = STATUSES.find(s => s.value === participant.status);

          return (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedParticipant(participant)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-pink-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <span className="text-pink-400 font-semibold">
                      {participant.firstName[0]}{participant.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {participant.firstName} {participant.lastName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {participant.email}
                      </span>
                      {participant.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {participant.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {participant.barriers.length > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-amber-400">{participant.barriers.length} barriers</span>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo?.color} text-white`}>
                    {statusInfo?.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Progress indicators */}
              {participant.status === 'placed' && participant.placedWageHourly && participant.priorWageHourly && (
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-300">{participant.placedEmployerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">
                      +${((participant.placedWageHourly - participant.priorWageHourly) * 2080).toLocaleString()}/yr
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredParticipants.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No participants found</p>
          </div>
        )}
      </div>

      {/* Participant Detail Modal */}
      <AnimatePresence>
        {selectedParticipant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedParticipant(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-pink-500/20 rounded-full flex items-center justify-center">
                      <span className="text-pink-400 font-bold text-lg">
                        {selectedParticipant.firstName[0]}{selectedParticipant.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedParticipant.firstName} {selectedParticipant.lastName}
                      </h2>
                      <p className="text-gray-400">{selectedParticipant.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedParticipant(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Update */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(status => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(selectedParticipant.id, status.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedParticipant.status === status.value
                            ? `${status.color} text-white`
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-400">Contact & Background</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {selectedParticipant.phone || 'No phone'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        {selectedParticipant.educationLevel || 'Not specified'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        {selectedParticipant.employmentStatusAtIntake || 'Not specified'}
                      </div>
                      {selectedParticipant.priorWageHourly && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4 text-gray-500" />
                          ${selectedParticipant.priorWageHourly}/hr prior wage
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-400">Journey Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Intake: {new Date(selectedParticipant.intakeDate).toLocaleDateString()}
                      </div>
                      {selectedParticipant.enrollmentDate && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          Enrolled: {new Date(selectedParticipant.enrollmentDate).toLocaleDateString()}
                        </div>
                      )}
                      {selectedParticipant.completionDate && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                          Completed: {new Date(selectedParticipant.completionDate).toLocaleDateString()}
                        </div>
                      )}
                      {selectedParticipant.placementDate && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Placed: {new Date(selectedParticipant.placementDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barriers */}
                {selectedParticipant.barriers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Barriers to Employment</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.barriers.map(barrier => (
                        <span
                          key={barrier}
                          className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
                        >
                          {BARRIERS.find(b => b.value === barrier)?.label || barrier}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placement Info */}
                {selectedParticipant.placedEmployerName && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <h3 className="text-sm font-semibold text-emerald-400 mb-3">Placement Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs">Employer</p>
                        <p className="text-white font-medium">{selectedParticipant.placedEmployerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Position</p>
                        <p className="text-white font-medium">{selectedParticipant.placedJobTitle}</p>
                      </div>
                      {selectedParticipant.placedWageHourly && (
                        <div>
                          <p className="text-gray-400 text-xs">New Wage</p>
                          <p className="text-emerald-400 font-medium">${selectedParticipant.placedWageHourly}/hr</p>
                        </div>
                      )}
                      {selectedParticipant.placedWageHourly && selectedParticipant.priorWageHourly && (
                        <div>
                          <p className="text-gray-400 text-xs">Annual Increase</p>
                          <p className="text-emerald-400 font-medium">
                            +${((selectedParticipant.placedWageHourly - selectedParticipant.priorWageHourly) * 2080).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Participant Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">New Participant Intake</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={newParticipant.firstName}
                      onChange={(e) => setNewParticipant({ ...newParticipant, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={newParticipant.lastName}
                      onChange={(e) => setNewParticipant({ ...newParticipant, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={newParticipant.email}
                    onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newParticipant.phone}
                    onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Education Level</label>
                    <select
                      value={newParticipant.educationLevel}
                      onChange={(e) => setNewParticipant({ ...newParticipant, educationLevel: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="">Select...</option>
                      <option value="Less than HS">Less than High School</option>
                      <option value="High School">High School/GED</option>
                      <option value="Some College">Some College</option>
                      <option value="Associates">Associate's Degree</option>
                      <option value="Bachelors">Bachelor's Degree</option>
                      <option value="Masters+">Master's or Higher</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Prior Hourly Wage</label>
                    <input
                      type="number"
                      value={newParticipant.priorWageHourly}
                      onChange={(e) => setNewParticipant({ ...newParticipant, priorWageHourly: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Employment Status at Intake</label>
                  <select
                    value={newParticipant.employmentStatusAtIntake}
                    onChange={(e) => setNewParticipant({ ...newParticipant, employmentStatusAtIntake: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="">Select...</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Underemployed">Underemployed</option>
                    <option value="Employed">Employed (seeking better)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Barriers to Employment</label>
                  <div className="flex flex-wrap gap-2">
                    {BARRIERS.map(barrier => (
                      <button
                        key={barrier.value}
                        type="button"
                        onClick={() => toggleBarrier(barrier.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          newParticipant.barriers.includes(barrier.value)
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {barrier.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddParticipant}
                    disabled={!newParticipant.firstName || !newParticipant.lastName || saving}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Intake
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

export default ParticipantsTab;
