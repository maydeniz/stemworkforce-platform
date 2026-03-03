// ===========================================
// Fellowships Tab - National Labs Partner Dashboard
// Fellowship program management and tracking
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  GraduationCap,
  Users,
  TrendingUp,
  ChevronRight,
  Loader2,
  Star,
  Award,
  UserCheck,
  X,
  CheckCircle
} from 'lucide-react';
import { getFellowshipPrograms, getFellows } from '@/services/nationalLabsPartnerApi';
import type { FellowshipProgram, Fellow, LabPartnerTier, FellowshipType } from '@/types/nationalLabsPartner';

interface FellowshipsTabProps {
  partnerId: string;
  tier: LabPartnerTier;
}

const SAMPLE_PROGRAMS: FellowshipProgram[] = [
  {
    id: '1',
    partnerId: '1',
    name: 'SULI - Science Undergraduate Laboratory Internship',
    programType: 'suli',
    description: 'DOE program for undergraduate research experience at national laboratories',
    duration: '10 weeks',
    isPaid: true,
    stipendAmount: 6500,
    housingProvided: true,
    relocationAssistance: true,
    citizenshipRequired: true,
    educationLevels: ['undergraduate'],
    majorsPreferred: ['Physics', 'Chemistry', 'Engineering', 'Materials Science'],
    totalSlots: 25,
    filledSlots: 18,
    waitlistCount: 12,
    conversionTarget: 30,
    historicalConversionRate: 34,
    status: 'accepting',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    name: 'SCGSR - Office of Science Graduate Student Research',
    programType: 'scgsr',
    description: 'Graduate students conduct part of their thesis research at DOE labs',
    duration: '3-12 months',
    isPaid: true,
    stipendAmount: 3000,
    housingProvided: false,
    relocationAssistance: true,
    citizenshipRequired: true,
    educationLevels: ['graduate'],
    majorsPreferred: ['Physics', 'Nuclear Engineering', 'Computational Science'],
    totalSlots: 15,
    filledSlots: 12,
    waitlistCount: 8,
    conversionTarget: 50,
    historicalConversionRate: 52,
    status: 'active',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_FELLOWS: Fellow[] = [
  {
    id: '1',
    partnerId: '1',
    programId: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sjohnson@university.edu',
    university: 'MIT',
    major: 'Physics',
    degree: 'BS',
    gpa: 3.89,
    mentorName: 'Dr. Robert Chen',
    department: 'Nuclear Science',
    projectTitle: 'Neutron Scattering Analysis',
    status: 'active',
    receivedOffer: false,
    acceptedOffer: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    programId: '1',
    firstName: 'James',
    lastName: 'Williams',
    email: 'jwilliams@stanford.edu',
    university: 'Stanford',
    major: 'Materials Science',
    degree: 'BS',
    gpa: 3.72,
    mentorName: 'Dr. Lisa Park',
    department: 'Materials Division',
    projectTitle: 'Advanced Battery Materials',
    status: 'completed',
    receivedOffer: true,
    acceptedOffer: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const PROGRAM_TYPE_LABELS: Record<FellowshipType, string> = {
  suli: 'SULI',
  scgsr: 'SCGSR',
  cci: 'CCI',
  nsf_grfp: 'NSF GRFP',
  doe_nnsa: 'DOE NNSA',
  postdoc: 'Postdoc',
  internship: 'Internship',
  lab_specific: 'Lab Program',
  other: 'Other'
};

const STATUS_STYLES = {
  applied: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  accepted: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  completed: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  converted: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  withdrawn: { bg: 'bg-red-500/20', text: 'text-red-400' },
  terminated: { bg: 'bg-red-500/20', text: 'text-red-400' }
};

export const FellowshipsTab: React.FC<FellowshipsTabProps> = ({ partnerId, tier: _tier }) => {
  const [programs, setPrograms] = useState<FellowshipProgram[]>([]);
  const [fellows, setFellows] = useState<Fellow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'programs' | 'fellows'>('programs');

  // Modal states
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [showProgramDetail, setShowProgramDetail] = useState<FellowshipProgram | null>(null);
  const [showFellowDetail, setShowFellowDetail] = useState<Fellow | null>(null);
  const [showOfferModal, setShowOfferModal] = useState<Fellow | null>(null);

  // Add program form
  const [programForm, setProgramForm] = useState({
    name: '',
    programType: 'internship' as FellowshipType,
    description: '',
    duration: '',
    isPaid: true,
    stipendAmount: 0,
    housingProvided: false,
    citizenshipRequired: true,
    totalSlots: 10,
    educationLevels: ['undergraduate'] as string[],
  });

  useEffect(() => {
    loadData();
  }, [partnerId]);

  const loadData = async () => {
    setLoading(true);
    const [programsData, fellowsData] = await Promise.all([
      getFellowshipPrograms(partnerId),
      getFellows(partnerId)
    ]);
    setPrograms(programsData.length > 0 ? programsData : SAMPLE_PROGRAMS);
    setFellows(fellowsData.length > 0 ? fellowsData : SAMPLE_FELLOWS);
    setLoading(false);
  };

  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFellows = fellows.filter(f =>
    `${f.firstName} ${f.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const activeFellows = fellows.filter(f => f.status === 'active').length;
  const completedFellows = fellows.filter(f => f.status === 'completed' || f.status === 'converted').length;
  const convertedFellows = fellows.filter(f => f.status === 'converted' || f.acceptedOffer).length;
  const conversionRate = completedFellows > 0 ? Math.round((convertedFellows / completedFellows) * 100) : 0;

  const handleAddProgram = () => {
    const newProgram: FellowshipProgram = {
      id: `new-${Date.now()}`,
      partnerId,
      name: programForm.name,
      programType: programForm.programType,
      description: programForm.description,
      duration: programForm.duration,
      isPaid: programForm.isPaid,
      stipendAmount: programForm.stipendAmount,
      housingProvided: programForm.housingProvided,
      relocationAssistance: false,
      citizenshipRequired: programForm.citizenshipRequired,
      educationLevels: programForm.educationLevels,
      majorsPreferred: [],
      totalSlots: programForm.totalSlots,
      filledSlots: 0,
      waitlistCount: 0,
      conversionTarget: 0,
      historicalConversionRate: 0,
      status: 'accepting',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPrograms(prev => [newProgram, ...prev]);
    setShowAddProgramModal(false);
    setProgramForm({ name: '', programType: 'internship', description: '', duration: '', isPaid: true, stipendAmount: 0, housingProvided: false, citizenshipRequired: true, totalSlots: 10, educationLevels: ['undergraduate'] });
  };

  const handleExtendOffer = (fellow: Fellow) => {
    setFellows(prev => prev.map(f =>
      f.id === fellow.id ? { ...f, receivedOffer: true, updatedAt: new Date().toISOString() } : f
    ));
    setShowOfferModal(null);
    setShowFellowDetail(prev => prev && prev.id === fellow.id ? { ...prev, receivedOffer: true } : prev);
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || 'Unknown Program';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Fellowship Programs</h2>
          <p className="text-gray-400">Manage programs and track intern-to-hire conversions</p>
        </div>
        <button
          onClick={() => setShowAddProgramModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{programs.length}</p>
              <p className="text-xs text-gray-400">Programs</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeFellows}</p>
              <p className="text-xs text-gray-400">Active Fellows</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{convertedFellows}</p>
              <p className="text-xs text-gray-400">Converted</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{conversionRate}%</p>
              <p className="text-xs text-gray-400">Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setActiveView('programs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'programs' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Programs
          </button>
          <button
            onClick={() => setActiveView('fellows')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'fellows' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Fellows
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={activeView === 'programs' ? 'Search programs...' : 'Search fellows...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
          />
        </div>
      </div>

      {/* Programs List */}
      {activeView === 'programs' && (
        <div className="space-y-4">
          {filteredPrograms.map(program => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowProgramDetail(program)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-amber-500/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-lg">{program.name}</h3>
                      {program.featured && <Star className="w-4 h-4 text-amber-400 fill-current" />}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {PROGRAM_TYPE_LABELS[program.programType]}
                      </span>
                      <span>{program.duration}</span>
                      <span>•</span>
                      <span>{program.isPaid ? `$${program.stipendAmount?.toLocaleString()} stipend` : 'Unpaid'}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  program.status === 'accepting' ? 'bg-emerald-500/20 text-emerald-400' :
                  program.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                  program.status === 'closed' ? 'bg-gray-500/20 text-gray-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {program.status}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">{program.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold text-white">{program.totalSlots}</p>
                  <p className="text-xs text-gray-400">Total Slots</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold text-emerald-400">{program.filledSlots}</p>
                  <p className="text-xs text-gray-400">Filled</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold text-amber-400">{program.waitlistCount}</p>
                  <p className="text-xs text-gray-400">Waitlist</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold text-purple-400">{program.historicalConversionRate || 0}%</p>
                  <p className="text-xs text-gray-400">Conversion</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-white">{program.filledSlots} / {program.totalSlots}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${(program.filledSlots / program.totalSlots) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {program.citizenshipRequired && (
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">US Citizen Required</span>
                )}
                {program.housingProvided && (
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">Housing Provided</span>
                )}
                {program.educationLevels.map((level, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                    {level}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}

          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No programs found</p>
            </div>
          )}
        </div>
      )}

      {/* Fellows List */}
      {activeView === 'fellows' && (
        <div className="space-y-3">
          {filteredFellows.map(fellow => {
            const statusStyle = STATUS_STYLES[fellow.status];

            return (
              <motion.div
                key={fellow.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowFellowDetail(fellow)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-purple-400 font-semibold">
                        {fellow.firstName[0]}{fellow.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">
                          {fellow.firstName} {fellow.lastName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                          {fellow.status}
                        </span>
                        {fellow.acceptedOffer && (
                          <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Converted
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{fellow.university}</span>
                        <span>•</span>
                        <span>{fellow.major}</span>
                        <span>•</span>
                        <span>{fellow.degree}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">{fellow.mentorName || 'Unassigned'}</p>
                      <p className="text-xs text-gray-400">Mentor</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">{fellow.department || 'TBD'}</p>
                      <p className="text-xs text-gray-400">Department</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {fellow.projectTitle && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Project:</span>{' '}
                      <span className="text-white">{fellow.projectTitle}</span>
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}

          {filteredFellows.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No fellows found</p>
            </div>
          )}
        </div>
      )}

      {/* Add Program Modal */}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddProgramModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add Fellowship Program</h3>
              <button onClick={() => setShowAddProgramModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Program Name</label>
                <input
                  type="text"
                  value={programForm.name}
                  onChange={e => setProgramForm({ ...programForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Summer Research Internship"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Program Type</label>
                  <select
                    value={programForm.programType}
                    onChange={e => setProgramForm({ ...programForm, programType: e.target.value as FellowshipType })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(PROGRAM_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={programForm.duration}
                    onChange={e => setProgramForm({ ...programForm, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 10 weeks"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={programForm.description}
                  onChange={e => setProgramForm({ ...programForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
                  placeholder="Describe the program..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Total Slots</label>
                  <input
                    type="number"
                    value={programForm.totalSlots}
                    onChange={e => setProgramForm({ ...programForm, totalSlots: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Stipend Amount ($)</label>
                  <input
                    type="number"
                    value={programForm.stipendAmount}
                    onChange={e => setProgramForm({ ...programForm, stipendAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={programForm.isPaid}
                    onChange={e => setProgramForm({ ...programForm, isPaid: e.target.checked })}
                    className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">Paid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={programForm.housingProvided}
                    onChange={e => setProgramForm({ ...programForm, housingProvided: e.target.checked })}
                    className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">Housing Provided</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={programForm.citizenshipRequired}
                    onChange={e => setProgramForm({ ...programForm, citizenshipRequired: e.target.checked })}
                    className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">Citizenship Required</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddProgramModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={handleAddProgram}
                disabled={!programForm.name || !programForm.duration}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Detail Modal */}
      {showProgramDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowProgramDetail(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{showProgramDetail.name}</h3>
                    {showProgramDetail.featured && <Star className="w-5 h-5 text-amber-400 fill-current" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {PROGRAM_TYPE_LABELS[showProgramDetail.programType]}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      showProgramDetail.status === 'accepting' ? 'bg-emerald-500/20 text-emerald-400' :
                      showProgramDetail.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {showProgramDetail.status}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowProgramDetail(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">{showProgramDetail.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-white">{showProgramDetail.totalSlots}</p>
                <p className="text-xs text-gray-400">Total Slots</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-emerald-400">{showProgramDetail.filledSlots}</p>
                <p className="text-xs text-gray-400">Filled</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-amber-400">{showProgramDetail.waitlistCount}</p>
                <p className="text-xs text-gray-400">Waitlist</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-purple-400">{showProgramDetail.historicalConversionRate || 0}%</p>
                <p className="text-xs text-gray-400">Conversion Rate</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Duration</p>
                <p className="text-white">{showProgramDetail.duration}</p>
              </div>
              {showProgramDetail.isPaid && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Stipend</p>
                  <p className="text-white">${showProgramDetail.stipendAmount?.toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {showProgramDetail.citizenshipRequired && (
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">US Citizen Required</span>
              )}
              {showProgramDetail.housingProvided && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm">Housing Provided</span>
              )}
              {showProgramDetail.relocationAssistance && (
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm">Relocation Assistance</span>
              )}
              {showProgramDetail.educationLevels.map((level, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm capitalize">{level}</span>
              ))}
            </div>

            {showProgramDetail.majorsPreferred && showProgramDetail.majorsPreferred.length > 0 && (
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2">Preferred Majors</h4>
                <div className="flex flex-wrap gap-2">
                  {showProgramDetail.majorsPreferred.map((major, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">{major}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Program Fellows */}
            {(() => {
              const programFellows = fellows.filter(f => f.programId === showProgramDetail.id);
              if (programFellows.length > 0) {
                return (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Fellows in Program ({programFellows.length})</h4>
                    <div className="space-y-2">
                      {programFellows.map(f => (
                        <div key={f.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-purple-400 text-xs font-semibold">{f.firstName[0]}{f.lastName[0]}</span>
                            </div>
                            <div>
                              <p className="text-white text-sm">{f.firstName} {f.lastName}</p>
                              <p className="text-gray-400 text-xs">{f.university} - {f.major}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLES[f.status].bg} ${STATUS_STYLES[f.status].text}`}>
                            {f.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setShowProgramDetail(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => setShowProgramDetail(null)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Fellow Detail Modal */}
      {showFellowDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowFellowDetail(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-lg">
                    {showFellowDetail.firstName[0]}{showFellowDetail.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{showFellowDetail.firstName} {showFellowDetail.lastName}</h3>
                  <p className="text-gray-400">{showFellowDetail.email}</p>
                </div>
              </div>
              <button onClick={() => setShowFellowDetail(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">University</p>
                <p className="text-white font-semibold">{showFellowDetail.university}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Major</p>
                <p className="text-white font-semibold">{showFellowDetail.major}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Degree</p>
                <p className="text-white font-semibold">{showFellowDetail.degree}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">GPA</p>
                <p className="text-amber-400 font-bold text-xl">{showFellowDetail.gpa?.toFixed(2) || 'N/A'}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span className={`px-2 py-1 rounded text-sm ${STATUS_STYLES[showFellowDetail.status].bg} ${STATUS_STYLES[showFellowDetail.status].text}`}>
                  {showFellowDetail.status}
                </span>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Program</p>
                <p className="text-white text-sm">{getProgramName(showFellowDetail.programId)}</p>
              </div>
            </div>

            {showFellowDetail.mentorName && (
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-400 mb-1">Mentor</p>
                <p className="text-white">{showFellowDetail.mentorName}</p>
                {showFellowDetail.department && (
                  <p className="text-gray-400 text-sm">{showFellowDetail.department}</p>
                )}
              </div>
            )}

            {showFellowDetail.projectTitle && (
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-400 mb-1">Research Project</p>
                <p className="text-white">{showFellowDetail.projectTitle}</p>
              </div>
            )}

            {/* Conversion Status */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <h4 className="text-white font-semibold mb-3">Conversion Status</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {showFellowDetail.receivedOffer ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  )}
                  <span className={showFellowDetail.receivedOffer ? 'text-emerald-400' : 'text-gray-400'}>Offer Extended</span>
                </div>
                <div className="flex items-center gap-2">
                  {showFellowDetail.acceptedOffer ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  )}
                  <span className={showFellowDetail.acceptedOffer ? 'text-emerald-400' : 'text-gray-400'}>Offer Accepted</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setShowFellowDetail(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              {!showFellowDetail.receivedOffer && (showFellowDetail.status === 'active' || showFellowDetail.status === 'completed') && (
                <button
                  onClick={() => setShowOfferModal(showFellowDetail)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                >
                  Extend Offer
                </button>
              )}
              <button onClick={() => setShowFellowDetail(null)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowOfferModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Extend Employment Offer</h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to extend a full-time employment offer to <span className="text-white font-semibold">{showOfferModal.firstName} {showOfferModal.lastName}</span>?
            </p>
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400">University:</span> <span className="text-white">{showOfferModal.university}</span></div>
                <div><span className="text-gray-400">Major:</span> <span className="text-white">{showOfferModal.major}</span></div>
                <div><span className="text-gray-400">GPA:</span> <span className="text-white">{showOfferModal.gpa?.toFixed(2)}</span></div>
                <div><span className="text-gray-400">Program:</span> <span className="text-white">{getProgramName(showOfferModal.programId)}</span></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowOfferModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => handleExtendOffer(showOfferModal)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Confirm Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FellowshipsTab;
