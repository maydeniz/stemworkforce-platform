// ===========================================
// Sports Physicals Tab
// Manage and create sports physical clearances
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
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
  Eye,
  Loader2,
  Heart,
  Wind,
  Scale,
  Ruler,
  AlertTriangle,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { healthcareProviderApi } from '@/services/healthcareProviderApi';
import {
  generateSportsPhysicalPDF,
  downloadPDF,
  type SportsPhysicalPDFData
} from '@/services/pdfGenerationService';
import type { SportsPhysical, SportsPhysicalFormData } from '@/types/healthcareProvider';

interface SportsPhysicalsTabProps {
  providerId: string;
}

const SportsPhysicalsTab: React.FC<SportsPhysicalsTabProps> = ({ providerId }) => {
  const [physicals, setPhysicals] = useState<SportsPhysical[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPhysical, setSelectedPhysical] = useState<SportsPhysical | null>(null);
  const [renewalPhysical, setRenewalPhysical] = useState<SportsPhysical | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);

  useEffect(() => {
    loadPhysicals();
  }, [providerId]);

  const loadPhysicals = async () => {
    setLoading(true);
    try {
      const data = await healthcareProviderApi.getSportsPhysicals({ providerId });
      setPhysicals(data);
    } catch (error) {
      console.error('Error loading physicals:', error);
    }
    setLoading(false);
  };

  const filteredPhysicals = physicals.filter(physical => {
    const sports = physical.sports || physical.sportsCleared || [];
    const matchesSearch = physical.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sports.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || physical.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'cleared':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
            <CheckCircle2 className="w-3 h-3" />
            Cleared
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'conditional':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
            <AlertTriangle className="w-3 h-3" />
            Conditional
          </span>
        );
      case 'not_cleared':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            <AlertCircle className="w-3 h-3" />
            Not Cleared
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

  const getClearanceBadge = (level: string) => {
    switch (level) {
      case 'full':
        return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">Full Clearance</span>;
      case 'limited':
        return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">Limited</span>;
      case 'none':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">None</span>;
      default:
        return null;
    }
  };

  const isExpiringSoon = (date: string) => {
    const expirationDate = new Date(date);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  const handleCreatePhysical = async (formData: SportsPhysicalFormData) => {
    setSubmitting(true);
    try {
      await healthcareProviderApi.createSportsPhysical(providerId, formData);
      await loadPhysicals();
      setShowCreateModal(false);
      setRenewalPhysical(null);
    } catch (error) {
      console.error('Error creating physical:', error);
    }
    setSubmitting(false);
  };

  const handleDownloadPDF = async (physical: SportsPhysical) => {
    setDownloadingPDF(physical.id);
    try {
      const pdfData: SportsPhysicalPDFData = {
        studentName: physical.studentName,
        studentId: physical.studentId || 'N/A',
        dateOfBirth: physical.studentDateOfBirth,
        schoolName: physical.schoolName || 'School',
        sports: physical.sports || physical.sportsCleared || [],
        examDate: physical.examDate,
        expirationDate: physical.expirationDate,
        clearanceLevel: physical.clearanceLevel ||
          (physical.clearanceType === 'full-clearance' ? 'full' :
           physical.clearanceType === 'conditional-clearance' ? 'limited' : 'none'),
        limitations: physical.restrictions || [],
        conditions: [],
        bloodPressure: physical.bloodPressure,
        heartRate: parseInt(String(physical.pulseRate)) || undefined,
        height: physical.height,
        weight: physical.weight,
        vision: physical.visionLeft && physical.visionRight
          ? { left: physical.visionLeft, right: physical.visionRight }
          : undefined,
        providerName: physical.providerName || 'Healthcare Provider',
        providerCredentials: physical.providerCredentials ? [physical.providerCredentials] : [],
        providerNPI: physical.providerNPI,
      };
      const blob = await generateSportsPhysicalPDF(pdfData);
      downloadPDF(blob, `sports-physical-${physical.studentName.replace(/\s+/g, '-').toLowerCase()}.html`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    setDownloadingPDF(null);
  };

  const handleRenewal = (physical: SportsPhysical) => {
    setRenewalPhysical(physical);
    setShowCreateModal(true);
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
          <h2 className="text-xl font-bold text-white">Sports Physicals</h2>
          <p className="text-gray-400">Pre-participation physical examinations for student athletes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Sports Physical
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
                {physicals.filter(p => p.status === 'cleared').length}
              </p>
              <p className="text-sm text-gray-400">Active Clearances</p>
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
                {physicals.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-400">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {physicals.filter(p => isExpiringSoon(p.expirationDate)).length}
              </p>
              <p className="text-sm text-gray-400">Expiring Soon</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {physicals.filter(p => p.clearanceLevel === 'limited').length}
              </p>
              <p className="text-sm text-gray-400">Limited Clearance</p>
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
            placeholder="Search by student name or sport..."
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
            <option value="cleared">Cleared</option>
            <option value="pending">Pending</option>
            <option value="conditional">Conditional</option>
            <option value="not_cleared">Not Cleared</option>
          </select>
        </div>
      </div>

      {/* Physicals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhysicals.map((physical) => (
          <motion.div
            key={physical.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gray-900 border rounded-xl p-5 ${
              isExpired(physical.expirationDate)
                ? 'border-red-500/50'
                : isExpiringSoon(physical.expirationDate)
                ? 'border-amber-500/50'
                : 'border-gray-800'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-white">{physical.studentName}</p>
                <p className="text-sm text-gray-400">Grade {physical.studentGrade || physical.grade}</p>
              </div>
              {getStatusBadge(physical.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex flex-wrap gap-1">
                {(physical.sports || physical.sportsCleared || []).map((sport: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-xs">
                    {sport}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Clearance:</span>
                {getClearanceBadge(physical.clearanceLevel || (physical.clearanceType === 'full-clearance' ? 'full' : physical.clearanceType === 'conditional-clearance' ? 'limited' : 'none'))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Expires:</span>
                <span className={`${
                  isExpired(physical.expirationDate)
                    ? 'text-red-400'
                    : isExpiringSoon(physical.expirationDate)
                    ? 'text-amber-400'
                    : 'text-gray-300'
                }`}>
                  {new Date(physical.expirationDate).toLocaleDateString()}
                  {isExpired(physical.expirationDate) && ' (Expired)'}
                  {isExpiringSoon(physical.expirationDate) && ' (Soon)'}
                </span>
              </div>
            </div>

            {physical.restrictions && physical.restrictions.length > 0 && (
              <div className="mb-4 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-400 font-medium mb-1">Restrictions:</p>
                <p className="text-xs text-gray-400">{physical.restrictions.join(', ')}</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
              <button
                onClick={() => setSelectedPhysical(physical)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => handleDownloadPDF(physical)}
                disabled={downloadingPDF === physical.id}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {downloadingPDF === physical.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                PDF
              </button>
              {(isExpiringSoon(physical.expirationDate) || isExpired(physical.expirationDate)) && (
                <button
                  onClick={() => handleRenewal(physical)}
                  className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
                  title="Schedule Renewal"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPhysicals.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p>No sports physicals found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-emerald-400 hover:text-emerald-300"
          >
            Create a new sports physical
          </button>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePhysicalModal
            providerId={providerId}
            onClose={() => {
              setShowCreateModal(false);
              setRenewalPhysical(null);
            }}
            onSubmit={handleCreatePhysical}
            submitting={submitting}
            renewalFrom={renewalPhysical}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {selectedPhysical && (
          <ViewPhysicalModal
            physical={selectedPhysical}
            onClose={() => setSelectedPhysical(null)}
            onDownloadPDF={handleDownloadPDF}
            downloadingPDF={downloadingPDF}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// CREATE PHYSICAL MODAL
// ===========================================

interface CreatePhysicalModalProps {
  providerId: string;
  onClose: () => void;
  onSubmit: (data: SportsPhysicalFormData) => Promise<void>;
  submitting: boolean;
  renewalFrom?: SportsPhysical | null;
}

// Local form state that differs from SportsPhysicalFormData
interface LocalPhysicalForm {
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentDob: string;
  schoolId: string;
  schoolName: string;
  sports: string[];
  examDate: string;
  vitals: {
    height: string;
    weight: string;
    bloodPressure: string;
    pulse: number;
    vision: string;
  };
  clearanceLevel: 'full' | 'limited' | 'none';
  restrictions: string[];
  notes: string;
}

const CreatePhysicalModal: React.FC<CreatePhysicalModalProps> = ({
  providerId: _providerId,
  onClose,
  onSubmit,
  submitting,
  renewalFrom
}) => {
  // providerId available for future use
  void _providerId;

  const isRenewal = !!renewalFrom;

  const [formData, setFormData] = useState<LocalPhysicalForm>({
    studentId: renewalFrom?.studentId || '',
    studentName: renewalFrom?.studentName || '',
    studentGrade: renewalFrom?.studentGrade || renewalFrom?.grade || '',
    studentDob: renewalFrom?.studentDateOfBirth || '',
    schoolId: renewalFrom?.schoolId || '',
    schoolName: renewalFrom?.schoolName || '',
    sports: renewalFrom?.sports || renewalFrom?.sportsCleared || [],
    examDate: new Date().toISOString().split('T')[0],
    vitals: {
      height: renewalFrom?.height || '',
      weight: renewalFrom?.weight || '',
      bloodPressure: renewalFrom?.bloodPressure || '',
      pulse: parseInt(String(renewalFrom?.pulseRate || '0')) || 0,
      vision: renewalFrom?.visionLeft || ''
    },
    clearanceLevel: 'full',
    restrictions: [],
    notes: isRenewal ? `Renewal of physical from ${new Date(renewalFrom.examDate).toLocaleDateString()}` : ''
  });

  // Convert local form to SportsPhysicalFormData for submission
  const convertToFormData = (): SportsPhysicalFormData => ({
    studentId: formData.studentId,
    studentName: formData.studentName,
    studentGrade: formData.studentGrade,
    studentDob: formData.studentDob,
    schoolId: formData.schoolId,
    schoolName: formData.schoolName,
    sports: formData.sports,
    examDate: formData.examDate,
    height: formData.vitals.height,
    weight: formData.vitals.weight,
    bloodPressure: formData.vitals.bloodPressure,
    pulseRate: String(formData.vitals.pulse),
    visionLeft: formData.vitals.vision,
    visionRight: formData.vitals.vision,
    medicalHistoryReviewed: true,
    significantFindings: '',
    currentMedications: '',
    cardiacScreeningCompleted: false,
    ekgCompleted: false,
    ekgFindings: '',
    familyHistoryReviewed: false,
    suddenCardiacDeathHistory: false,
    concussionHistory: false,
    numberOfConcussions: '0',
    lastConcussionDate: '',
    clearanceType: formData.clearanceLevel === 'full' ? 'full-clearance' :
                   formData.clearanceLevel === 'limited' ? 'conditional-clearance' : 'no-clearance',
    sportsCleared: formData.sports,
    sportsRestricted: [],
    restrictions: formData.restrictions.join(', '),
    requiresFollowUp: false,
    followUpReason: ''
  });

  const [selectedSport, setSelectedSport] = useState('');

  const availableSports = [
    'Football', 'Basketball', 'Soccer', 'Baseball', 'Softball',
    'Volleyball', 'Tennis', 'Track & Field', 'Cross Country',
    'Swimming', 'Wrestling', 'Golf', 'Lacrosse', 'Hockey',
    'Cheerleading', 'Gymnastics', 'Dance'
  ];

  const addSport = () => {
    if (selectedSport && !formData.sports.includes(selectedSport)) {
      setFormData({ ...formData, sports: [...formData.sports, selectedSport] });
      setSelectedSport('');
    }
  };

  const removeSport = (sport: string) => {
    setFormData({ ...formData, sports: formData.sports.filter(s => s !== sport) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(convertToFormData());
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
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            {isRenewal ? (
              <>
                <RefreshCw className="w-5 h-5 text-amber-400" />
                Renew Sports Physical
              </>
            ) : (
              'New Sports Physical'
            )}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isRenewal && (
          <div className="mx-6 mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-amber-400 font-medium">Renewing Physical</p>
              <p className="text-sm text-gray-400">
                Previous exam: {new Date(renewalFrom!.examDate).toLocaleDateString()} •
                Expired: {new Date(renewalFrom!.expirationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Student Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
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
                  <option value="">Select</option>
                  {['6', '7', '8', '9', '10', '11', '12'].map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.studentDob}
                  onChange={(e) => setFormData({ ...formData, studentDob: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* School Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              School Information
            </h4>
            <input
              type="text"
              required
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              placeholder="Enter school name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sports Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Sports *
            </h4>
            <div className="flex gap-2 mb-3">
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select a sport</option>
                {availableSports.filter(s => !formData.sports.includes(s)).map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addSport}
                disabled={!selectedSport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sports.map(sport => (
                <span key={sport} className="flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                  {sport}
                  <button
                    type="button"
                    onClick={() => removeSport(sport)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {formData.sports.length === 0 && (
                <span className="text-sm text-gray-500">No sports selected</span>
              )}
            </div>
          </div>

          {/* Vitals */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Vital Signs
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  <Ruler className="w-3 h-3 inline mr-1" />
                  Height
                </label>
                <input
                  type="text"
                  value={formData.vitals.height}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitals: { ...formData.vitals, height: e.target.value }
                  })}
                  placeholder="5'10&quot;"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  <Scale className="w-3 h-3 inline mr-1" />
                  Weight
                </label>
                <input
                  type="text"
                  value={formData.vitals.weight}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitals: { ...formData.vitals, weight: e.target.value }
                  })}
                  placeholder="165 lbs"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  <Heart className="w-3 h-3 inline mr-1" />
                  BP
                </label>
                <input
                  type="text"
                  value={formData.vitals.bloodPressure}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitals: { ...formData.vitals, bloodPressure: e.target.value }
                  })}
                  placeholder="120/80"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  <Wind className="w-3 h-3 inline mr-1" />
                  Pulse
                </label>
                <input
                  type="number"
                  value={formData.vitals.pulse || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitals: { ...formData.vitals, pulse: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="72"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  <Eye className="w-3 h-3 inline mr-1" />
                  Vision
                </label>
                <input
                  type="text"
                  value={formData.vitals.vision}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitals: { ...formData.vitals, vision: e.target.value }
                  })}
                  placeholder="20/20"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Clearance Level */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Clearance Decision *</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'full', label: 'Full Clearance', desc: 'Cleared for all activities', color: 'emerald' },
                { value: 'limited', label: 'Limited Clearance', desc: 'Some restrictions apply', color: 'amber' },
                { value: 'none', label: 'Not Cleared', desc: 'Cannot participate', color: 'red' }
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, clearanceLevel: option.value as any })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.clearanceLevel === option.value
                      ? option.color === 'emerald'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : option.color === 'amber'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <p className={`font-medium ${
                    formData.clearanceLevel === option.value
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

          {/* Restrictions */}
          {formData.clearanceLevel === 'limited' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Restrictions</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['No contact sports', 'No high-impact', 'Limited running', 'Monitor heart rate', 'Hydration required'].map(restriction => (
                  <button
                    key={restriction}
                    type="button"
                    onClick={() => {
                      const current = formData.restrictions || [];
                      const updated = current.includes(restriction)
                        ? current.filter(r => r !== restriction)
                        : [...current, restriction];
                      setFormData({ ...formData, restrictions: updated });
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      (formData.restrictions || []).includes(restriction)
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {restriction}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
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
              disabled={submitting || formData.sports.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Physical
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
// VIEW PHYSICAL MODAL
// ===========================================

interface ViewPhysicalModalProps {
  physical: SportsPhysical;
  onClose: () => void;
  onDownloadPDF: (physical: SportsPhysical) => Promise<void>;
  downloadingPDF: string | null;
}

const ViewPhysicalModal: React.FC<ViewPhysicalModalProps> = ({ physical, onClose, onDownloadPDF, downloadingPDF }) => {
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
          <h3 className="text-lg font-semibold text-white">Sports Physical Details</h3>
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
              <p className="text-xl font-semibold text-white">{physical.studentName}</p>
              <p className="text-gray-400">Grade {physical.studentGrade || physical.grade} • DOB: {new Date(physical.studentDateOfBirth).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              (physical.clearanceLevel === 'full' || physical.clearanceType === 'full-clearance')
                ? 'bg-emerald-500/20 text-emerald-400'
                : (physical.clearanceLevel === 'limited' || physical.clearanceType === 'conditional-clearance')
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {(physical.clearanceLevel === 'full' || physical.clearanceType === 'full-clearance') ? 'Full Clearance' :
               (physical.clearanceLevel === 'limited' || physical.clearanceType === 'conditional-clearance') ? 'Limited' : 'Not Cleared'}
            </span>
          </div>

          {/* Sports */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Sports</p>
            <div className="flex flex-wrap gap-2">
              {(physical.sports || physical.sportsCleared || []).map((sport: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Vitals */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400 mb-3">Vital Signs</p>
            <div className="grid grid-cols-5 gap-3 text-center">
              <div>
                <p className="text-lg font-semibold text-white">{physical.height}</p>
                <p className="text-xs text-gray-500">Height</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{physical.weight}</p>
                <p className="text-xs text-gray-500">Weight</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{physical.bloodPressure}</p>
                <p className="text-xs text-gray-500">BP</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{physical.pulseRate}</p>
                <p className="text-xs text-gray-500">Pulse</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{physical.visionLeft}/{physical.visionRight}</p>
                <p className="text-xs text-gray-500">Vision</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400">Exam Date</p>
              <p className="text-white">{new Date(physical.examDate).toLocaleDateString()}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400">Expires</p>
              <p className="text-white">{new Date(physical.expirationDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Restrictions */}
          {physical.restrictions && physical.restrictions.length > 0 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-400 font-medium mb-2">Restrictions</p>
              <ul className="space-y-1">
                {physical.restrictions.map((restriction: string, i: number) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    {restriction}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Notes */}
          {physical.followUpReason && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Notes</p>
              <p className="text-gray-300 p-3 bg-gray-800/50 rounded-lg">{physical.followUpReason}</p>
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
              onClick={() => onDownloadPDF(physical)}
              disabled={downloadingPDF === physical.id}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {downloadingPDF === physical.id ? (
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

export default SportsPhysicalsTab;
