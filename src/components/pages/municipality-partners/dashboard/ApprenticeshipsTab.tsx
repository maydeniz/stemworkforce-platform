// ===========================================
// Apprenticeships Tab - Municipality Partner Dashboard
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Wrench,
  Filter,
  Loader2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Award,
  Target,
  ChevronRight
} from 'lucide-react';
import { getApprenticeshipPrograms } from '@/services/municipalityPartnerApi';
import type { ApprenticeshipProgram, MunicipalityPartnerTier, ApprenticeshipType, ProgramStatus } from '@/types/municipalityPartner';

// ===========================================
// TYPES
// ===========================================

interface ApprenticeshipsTabProps {
  partnerId: string;
  tier: MunicipalityPartnerTier;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const samplePrograms: ApprenticeshipProgram[] = [
  {
    id: 'app-001',
    municipalityId: 'muni-001',
    programName: 'Water Treatment Operator Apprenticeship',
    apprenticeshipType: 'registered',
    occupation: 'Water Treatment Plant Operator',
    rapidsCode: '0892CB',
    description: 'DOL-registered apprenticeship program for water treatment plant operators, providing comprehensive training in water quality, treatment processes, and regulatory compliance.',
    sponsorType: 'municipality',
    hostDepartments: ['utilities'],
    durationMonths: 36,
    totalOJTHours: 6000,
    totalRTIHours: 432,
    progressivewageSchedule: true,
    startingWage: 18.50,
    journeyWage: 32.00,
    benefits: true,
    totalSlots: 12,
    activeApprentices: 10,
    graduatedYTD: 3,
    minAge: 18,
    educationRequirement: 'High school diploma or GED',
    physicalRequirements: 'Ability to lift 50 lbs, work outdoors',
    backgroundCheckRequired: true,
    drugTestRequired: true,
    driversLicenseRequired: true,
    credentialAwarded: 'Journeyman Water Treatment Plant Operator',
    industryRecognized: true,
    fundingSource: 'general_fund',
    employerContribution: 180000,
    status: 'active',
    completionRate: 85,
    retentionRate: 95,
    avgCompletionTime: 34,
    createdAt: '2023-01-15',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-002',
    municipalityId: 'muni-001',
    programName: 'Electrical Technician Apprenticeship',
    apprenticeshipType: 'trades',
    occupation: 'Municipal Electrician',
    rapidsCode: '0159CB',
    description: 'Joint apprenticeship program with IBEW Local 520 for municipal electrical technicians, covering building systems, streetlights, and traffic signals.',
    sponsorType: 'joint',
    unionPartner: 'IBEW Local 520',
    hostDepartments: ['public_works', 'transportation'],
    durationMonths: 48,
    totalOJTHours: 8000,
    totalRTIHours: 576,
    progressivewageSchedule: true,
    startingWage: 20.00,
    journeyWage: 42.00,
    benefits: true,
    totalSlots: 8,
    activeApprentices: 6,
    graduatedYTD: 2,
    minAge: 18,
    educationRequirement: 'High school diploma with algebra',
    physicalRequirements: 'Work at heights, in confined spaces',
    backgroundCheckRequired: true,
    drugTestRequired: true,
    driversLicenseRequired: true,
    credentialAwarded: 'Journeyman Electrician',
    industryRecognized: true,
    fundingSource: 'union_partnership',
    employerContribution: 120000,
    grantFunding: 50000,
    status: 'active',
    completionRate: 82,
    retentionRate: 92,
    avgCompletionTime: 46,
    createdAt: '2022-06-01',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-003',
    municipalityId: 'muni-001',
    programName: 'IT Support Specialist Apprenticeship',
    apprenticeshipType: 'it_cyber',
    occupation: 'IT Support Specialist',
    rapidsCode: '2188CB',
    description: 'Technology apprenticeship program providing hands-on experience in help desk support, network administration, and cybersecurity fundamentals.',
    sponsorType: 'municipality',
    hostDepartments: ['it_technology'],
    durationMonths: 24,
    totalOJTHours: 4000,
    totalRTIHours: 288,
    progressivewageSchedule: true,
    startingWage: 17.00,
    journeyWage: 28.00,
    benefits: true,
    totalSlots: 6,
    activeApprentices: 5,
    graduatedYTD: 4,
    minAge: 18,
    educationRequirement: 'High school diploma, basic computer skills',
    backgroundCheckRequired: true,
    drugTestRequired: true,
    driversLicenseRequired: false,
    credentialAwarded: 'CompTIA A+ Certification',
    industryRecognized: true,
    fundingSource: 'federal_wioa',
    grantFunding: 85000,
    status: 'active',
    completionRate: 90,
    retentionRate: 88,
    avgCompletionTime: 22,
    createdAt: '2023-09-01',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-004',
    municipalityId: 'muni-001',
    programName: 'Pre-Apprenticeship Trades Readiness',
    apprenticeshipType: 'pre_apprenticeship',
    occupation: 'Various Trades',
    description: 'Eight-week readiness program preparing participants for registered apprenticeships in construction, electrical, plumbing, and HVAC trades.',
    sponsorType: 'municipality',
    contractorPartners: ['Austin Community College', 'Workforce Solutions'],
    hostDepartments: ['public_works', 'utilities'],
    durationMonths: 2,
    totalOJTHours: 160,
    totalRTIHours: 80,
    progressivewageSchedule: false,
    startingWage: 15.00,
    journeyWage: 15.00,
    benefits: false,
    totalSlots: 20,
    activeApprentices: 18,
    graduatedYTD: 45,
    minAge: 18,
    educationRequirement: 'No minimum, GED support available',
    backgroundCheckRequired: true,
    drugTestRequired: true,
    driversLicenseRequired: false,
    credentialAwarded: 'OSHA 10, NCCER Core',
    industryRecognized: true,
    fundingSource: 'federal_arpa',
    grantFunding: 120000,
    status: 'active',
    completionRate: 78,
    retentionRate: 70,
    avgCompletionTime: 2,
    createdAt: '2024-01-15',
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// CONFIG
// ===========================================

const typeLabels: Record<ApprenticeshipType, { label: string; color: string }> = {
  registered: { label: 'DOL Registered', color: 'emerald' },
  pre_apprenticeship: { label: 'Pre-Apprenticeship', color: 'blue' },
  youth_apprenticeship: { label: 'Youth Apprenticeship', color: 'purple' },
  trades: { label: 'Trades', color: 'amber' },
  utilities: { label: 'Utilities', color: 'cyan' },
  public_safety: { label: 'Public Safety', color: 'red' },
  it_cyber: { label: 'IT/Cyber', color: 'indigo' },
  administrative: { label: 'Administrative', color: 'slate' }
};

const statusConfig: Record<ProgramStatus, { label: string; color: string; icon: React.ElementType }> = {
  planning: { label: 'Planning', color: 'slate', icon: Clock },
  recruiting: { label: 'Recruiting', color: 'blue', icon: Users },
  active: { label: 'Active', color: 'emerald', icon: CheckCircle },
  on_hold: { label: 'On Hold', color: 'amber', icon: AlertCircle },
  completed: { label: 'Completed', color: 'purple', icon: CheckCircle },
  archived: { label: 'Archived', color: 'gray', icon: Clock }
};

// ===========================================
// STATIC TAILWIND COLOR MAP
// ===========================================

const twColor: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  gray: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

// ===========================================
// COMPONENT
// ===========================================

export const ApprenticeshipsTab: React.FC<ApprenticeshipsTabProps> = ({ partnerId, tier: _tier }) => {
  const [programs, setPrograms] = useState<ApprenticeshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<ApprenticeshipProgram | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const data = await getApprenticeshipPrograms(partnerId, {
          status: statusFilter as ProgramStatus || undefined,
          apprenticeshipType: typeFilter as ApprenticeshipType || undefined
        });
        setPrograms(data.length > 0 ? data : samplePrograms);
      } catch (error) {
        console.error('Error fetching apprenticeship programs:', error);
        setPrograms(samplePrograms);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [partnerId, statusFilter, typeFilter]);

  const filteredPrograms = programs.filter(program =>
    program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const activeApprentices = programs.reduce((sum, p) => sum + p.activeApprentices, 0);
  const graduatedYTD = programs.reduce((sum, p) => sum + p.graduatedYTD, 0);
  const totalSlots = programs.reduce((sum, p) => sum + p.totalSlots, 0);
  const activePrograms = programs.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Apprenticeship Programs</h2>
          <p className="text-gray-400 text-sm">Manage registered apprenticeships and pre-apprenticeship programs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Programs', value: activePrograms, icon: Wrench, color: 'teal' },
          { label: 'Active Apprentices', value: activeApprentices, icon: Users, color: 'blue' },
          { label: 'Graduated YTD', value: graduatedYTD, icon: Award, color: 'emerald' },
          { label: 'Total Capacity', value: totalSlots, icon: Target, color: 'amber' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${twColor[stat.color]?.bg || 'bg-slate-500/20'} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${twColor[stat.color]?.text || 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search programs or occupations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showFilters ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' : 'bg-slate-900 border-slate-800 text-gray-400 hover:text-white'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(statusConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">All Types</option>
                  {Object.entries(typeLabels).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setStatusFilter(''); setTypeFilter(''); }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Programs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPrograms.map((program, index) => {
            const typeConf = typeLabels[program.apprenticeshipType];
            const statusConf = statusConfig[program.status];
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedProgram(program)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${twColor[typeConf.color]?.bg || 'bg-slate-500/20'} ${twColor[typeConf.color]?.text || 'text-slate-400'}`}>
                        {typeConf.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${twColor[statusConf.color]?.bg || 'bg-slate-500/20'} ${twColor[statusConf.color]?.text || 'text-slate-400'}`}>
                        {statusConf.label}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold group-hover:text-teal-400 transition-colors">
                      {program.programName}
                    </h3>
                    <p className="text-sm text-gray-400">{program.occupation}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-teal-400 transition-colors" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Active</p>
                    <p className="text-lg font-semibold text-white">{program.activeApprentices}/{program.totalSlots}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-lg font-semibold text-white">{program.durationMonths} mo</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Journey Wage</p>
                    <p className="text-lg font-semibold text-emerald-400">${program.journeyWage}/hr</p>
                  </div>
                </div>

                {/* Wage Progression */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">${program.startingWage}/hr start</span>
                    <span className="text-emerald-400">${program.journeyWage}/hr journey</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                      style={{ width: `${(program.startingWage / program.journeyWage) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    {program.totalOJTHours.toLocaleString()} OJT hrs
                  </div>
                  {program.rapidsCode && (
                    <span className="text-xs text-teal-400">RAPIDS: {program.rapidsCode}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Program Detail Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${twColor[typeLabels[selectedProgram.apprenticeshipType].color]?.bg || 'bg-slate-500/20'} ${twColor[typeLabels[selectedProgram.apprenticeshipType].color]?.text || 'text-slate-400'}`}>
                        {typeLabels[selectedProgram.apprenticeshipType].label}
                      </span>
                      {selectedProgram.rapidsCode && (
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">
                          RAPIDS: {selectedProgram.rapidsCode}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-white">{selectedProgram.programName}</h2>
                    <p className="text-gray-400">{selectedProgram.occupation}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <p className="text-gray-300">{selectedProgram.description}</p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-xl font-bold text-white">{selectedProgram.durationMonths} months</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">OJT Hours</p>
                    <p className="text-xl font-bold text-white">{selectedProgram.totalOJTHours.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">RTI Hours</p>
                    <p className="text-xl font-bold text-white">{selectedProgram.totalRTIHours}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Credential</p>
                    <p className="text-sm font-bold text-teal-400">{selectedProgram.credentialAwarded}</p>
                  </div>
                </div>

                {/* Wage Info */}
                <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white mb-3">Wage Progression</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Starting Wage</p>
                      <p className="text-2xl font-bold text-white">${selectedProgram.startingWage}/hr</p>
                    </div>
                    <div className="flex-1 mx-6">
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full w-full" />
                      </div>
                      <p className="text-xs text-center text-gray-500 mt-1">
                        {Math.round(((selectedProgram.journeyWage - selectedProgram.startingWage) / selectedProgram.startingWage) * 100)}% increase
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Journey Wage</p>
                      <p className="text-2xl font-bold text-emerald-400">${selectedProgram.journeyWage}/hr</p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Program Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sponsor Type</span>
                        <span className="text-white capitalize">{selectedProgram.sponsorType}</span>
                      </div>
                      {selectedProgram.unionPartner && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Union Partner</span>
                          <span className="text-white">{selectedProgram.unionPartner}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Benefits</span>
                        <span className="text-white">{selectedProgram.benefits ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Industry Recognized</span>
                        <span className="text-white">{selectedProgram.industryRecognized ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Requirements</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Age</span>
                        <span className="text-white">{selectedProgram.minAge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Education</span>
                        <span className="text-white">{selectedProgram.educationRequirement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Background Check</span>
                        <span className="text-white">{selectedProgram.backgroundCheckRequired ? 'Required' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Drug Test</span>
                        <span className="text-white">{selectedProgram.drugTestRequired ? 'Required' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outcomes */}
                {(selectedProgram.completionRate || selectedProgram.retentionRate) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Outcomes</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedProgram.completionRate && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-emerald-400">{selectedProgram.completionRate}%</p>
                          <p className="text-xs text-gray-400">Completion Rate</p>
                        </div>
                      )}
                      {selectedProgram.retentionRate && (
                        <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-teal-400">{selectedProgram.retentionRate}%</p>
                          <p className="text-xs text-gray-400">1-Year Retention</p>
                        </div>
                      )}
                      {selectedProgram.avgCompletionTime && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-blue-400">{selectedProgram.avgCompletionTime}</p>
                          <p className="text-xs text-gray-400">Avg Months</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                  Edit Program
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
