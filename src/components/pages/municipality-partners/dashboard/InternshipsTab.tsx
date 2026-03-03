// ===========================================
// Internships Tab - Municipality Partner Dashboard
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  GraduationCap,
  Filter,
  Loader2,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight
} from 'lucide-react';
import { getInternshipPrograms } from '@/services/municipalityPartnerApi';
import type { InternshipProgram, MunicipalityPartnerTier, InternshipProgramType, ProgramStatus } from '@/types/municipalityPartner';

// ===========================================
// TYPES
// ===========================================

interface InternshipsTabProps {
  partnerId: string;
  tier: MunicipalityPartnerTier;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const samplePrograms: InternshipProgram[] = [
  {
    id: 'int-001',
    municipalityId: 'muni-001',
    programName: 'Summer Youth Employment Program 2025',
    programType: 'summer_youth',
    description: 'Citywide summer employment program for youth ages 14-24 providing work experience across all city departments.',
    hostDepartments: ['public_works', 'parks_recreation', 'it_technology', 'finance'],
    startDate: '2025-06-02',
    endDate: '2025-08-08',
    hoursPerWeek: 25,
    durationWeeks: 10,
    minAge: 14,
    maxAge: 24,
    educationRequirement: 'none',
    residencyRequired: true,
    residencyArea: 'City limits',
    incomeEligibility: true,
    incomeThreshold: 200,
    isPaid: true,
    hourlyRate: 15.50,
    totalBudget: 850000,
    fundingSource: 'federal_wioa',
    totalSlots: 200,
    filledSlots: 145,
    waitlistCount: 32,
    status: 'recruiting',
    applicationDeadline: '2025-05-01',
    completionRate: 87,
    conversionRate: 15,
    satisfactionScore: 4.2,
    createdAt: '2024-11-01',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'int-002',
    municipalityId: 'muni-001',
    programName: 'Pathways College Internship',
    programType: 'college_pathways',
    description: 'Year-round internship program for college students pursuing degrees in public administration, engineering, IT, and finance.',
    hostDepartments: ['finance', 'it_technology', 'planning_development', 'utilities'],
    startDate: '2025-01-15',
    endDate: '2025-12-15',
    hoursPerWeek: 20,
    durationWeeks: 48,
    minAge: 18,
    maxAge: 26,
    educationRequirement: 'enrolled_college',
    residencyRequired: false,
    isPaid: true,
    hourlyRate: 18.00,
    totalBudget: 320000,
    fundingSource: 'general_fund',
    totalSlots: 50,
    filledSlots: 42,
    waitlistCount: 8,
    status: 'active',
    completionRate: 92,
    conversionRate: 58,
    satisfactionScore: 4.6,
    createdAt: '2024-10-15',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'int-003',
    municipalityId: 'muni-001',
    programName: "Mayor's Summer Fellowship",
    programType: 'mayors_fellowship',
    description: 'Competitive fellowship for graduate students and recent graduates interested in municipal policy and leadership.',
    hostDepartments: ['mayors_office', 'city_council', 'planning_development'],
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    hoursPerWeek: 40,
    durationWeeks: 12,
    minAge: 22,
    maxAge: 35,
    educationRequirement: 'graduate_student',
    residencyRequired: false,
    isPaid: true,
    stipend: 8000,
    totalBudget: 120000,
    fundingSource: 'private_foundation',
    totalSlots: 15,
    filledSlots: 12,
    waitlistCount: 25,
    status: 'recruiting',
    applicationDeadline: '2025-03-15',
    completionRate: 100,
    conversionRate: 40,
    satisfactionScore: 4.8,
    createdAt: '2024-12-01',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'int-004',
    municipalityId: 'muni-001',
    programName: 'High School CTE Partnership',
    programType: 'high_school_cte',
    description: 'Career and Technical Education partnership with local school district providing work-based learning opportunities.',
    hostDepartments: ['public_works', 'utilities', 'it_technology'],
    startDate: '2024-09-01',
    endDate: '2025-05-30',
    hoursPerWeek: 10,
    durationWeeks: 36,
    minAge: 16,
    maxAge: 18,
    educationRequirement: 'high_school',
    residencyRequired: true,
    residencyArea: 'Austin ISD',
    isPaid: true,
    hourlyRate: 12.00,
    totalBudget: 85000,
    fundingSource: 'state_grant',
    totalSlots: 30,
    filledSlots: 28,
    waitlistCount: 0,
    status: 'active',
    completionRate: 85,
    conversionRate: 20,
    satisfactionScore: 4.1,
    createdAt: '2024-08-01',
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// CONFIG
// ===========================================

const programTypeLabels: Record<InternshipProgramType, { label: string; color: string }> = {
  summer_youth: { label: 'Summer Youth', color: 'blue' },
  college_pathways: { label: 'College Pathways', color: 'purple' },
  high_school_cte: { label: 'High School CTE', color: 'cyan' },
  mayors_fellowship: { label: "Mayor's Fellowship", color: 'amber' },
  department_specific: { label: 'Department Specific', color: 'slate' },
  year_round: { label: 'Year Round', color: 'teal' },
  graduate_fellowship: { label: 'Graduate Fellowship', color: 'pink' },
  work_study: { label: 'Work Study', color: 'indigo' }
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
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  gray: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

// ===========================================
// COMPONENT
// ===========================================

export const InternshipsTab: React.FC<InternshipsTabProps> = ({ partnerId, tier: _tier }) => {
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<InternshipProgram | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const data = await getInternshipPrograms(partnerId, {
          status: statusFilter as ProgramStatus || undefined,
          programType: typeFilter as InternshipProgramType || undefined
        });
        setPrograms(data.length > 0 ? data : samplePrograms);
      } catch (error) {
        console.error('Error fetching internship programs:', error);
        setPrograms(samplePrograms);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [partnerId, statusFilter, typeFilter]);

  const filteredPrograms = programs.filter(program =>
    program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalSlots = programs.reduce((sum, p) => sum + p.totalSlots, 0);
  const filledSlots = programs.reduce((sum, p) => sum + p.filledSlots, 0);
  const totalBudget = programs.reduce((sum, p) => sum + p.totalBudget, 0);
  const activePrograms = programs.filter(p => p.status === 'active' || p.status === 'recruiting').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Internship Programs</h2>
          <p className="text-gray-400 text-sm">Manage SYEP, college pathways, and youth employment programs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Programs', value: activePrograms, icon: GraduationCap, color: 'teal' },
          { label: 'Total Slots', value: totalSlots, icon: Users, color: 'blue' },
          { label: 'Filled Slots', value: filledSlots, icon: CheckCircle, color: 'emerald' },
          { label: 'Total Budget', value: `$${(totalBudget / 1000000).toFixed(2)}M`, icon: DollarSign, color: 'amber' }
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
            placeholder="Search programs..."
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
                <label className="block text-sm text-gray-400 mb-2">Program Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">All Types</option>
                  {Object.entries(programTypeLabels).map(([key, { label }]) => (
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

      {/* Programs List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPrograms.map((program, index) => {
            const typeConf = programTypeLabels[program.programType];
            const statusConf = statusConfig[program.status];
            const fillRate = Math.round((program.filledSlots / program.totalSlots) * 100);

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
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-teal-400 transition-colors" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Slots</p>
                    <p className="text-lg font-semibold text-white">{program.filledSlots}/{program.totalSlots}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-lg font-semibold text-white">${(program.totalBudget / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{program.isPaid ? 'Hourly' : 'Stipend'}</p>
                    <p className="text-lg font-semibold text-white">
                      {program.hourlyRate ? `$${program.hourlyRate}` : program.stipend ? `$${program.stipend}` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Fill Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Fill Rate</span>
                    <span className="text-white">{fillRate}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        fillRate >= 90 ? 'bg-emerald-500' :
                        fillRate >= 70 ? 'bg-teal-500' :
                        fillRate >= 50 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${fillRate}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(program.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(program.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  {program.waitlistCount > 0 && (
                    <span className="text-amber-400 text-xs">{program.waitlistCount} on waitlist</span>
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
                      <span className={`px-2 py-0.5 rounded text-xs ${twColor[programTypeLabels[selectedProgram.programType].color]?.bg || 'bg-slate-500/20'} ${twColor[programTypeLabels[selectedProgram.programType].color]?.text || 'text-slate-400'}`}>
                        {programTypeLabels[selectedProgram.programType].label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${twColor[statusConfig[selectedProgram.status].color]?.bg || 'bg-slate-500/20'} ${twColor[statusConfig[selectedProgram.status].color]?.text || 'text-slate-400'}`}>
                        {statusConfig[selectedProgram.status].label}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-white">{selectedProgram.programName}</h2>
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
                    <p className="text-xs text-gray-400">Total Slots</p>
                    <p className="text-xl font-bold text-white">{selectedProgram.totalSlots}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Filled</p>
                    <p className="text-xl font-bold text-teal-400">{selectedProgram.filledSlots}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Waitlist</p>
                    <p className="text-xl font-bold text-amber-400">{selectedProgram.waitlistCount}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Budget</p>
                    <p className="text-xl font-bold text-white">${selectedProgram.totalBudget.toLocaleString()}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Program Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span className="text-white">{selectedProgram.durationWeeks} weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hours/Week</span>
                        <span className="text-white">{selectedProgram.hoursPerWeek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compensation</span>
                        <span className="text-white">
                          {selectedProgram.hourlyRate ? `$${selectedProgram.hourlyRate}/hr` :
                           selectedProgram.stipend ? `$${selectedProgram.stipend} stipend` : 'Unpaid'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Funding</span>
                        <span className="text-white capitalize">{selectedProgram.fundingSource.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Eligibility</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Age Range</span>
                        <span className="text-white">{selectedProgram.minAge} - {selectedProgram.maxAge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Education</span>
                        <span className="text-white capitalize">{selectedProgram.educationRequirement.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Residency</span>
                        <span className="text-white">{selectedProgram.residencyRequired ? selectedProgram.residencyArea : 'Not required'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Income Eligible</span>
                        <span className="text-white">{selectedProgram.incomeEligibility ? `Yes (${selectedProgram.incomeThreshold}% FPL)` : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outcomes */}
                {(selectedProgram.completionRate || selectedProgram.conversionRate) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Outcomes</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedProgram.completionRate && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-emerald-400">{selectedProgram.completionRate}%</p>
                          <p className="text-xs text-gray-400">Completion Rate</p>
                        </div>
                      )}
                      {selectedProgram.conversionRate && (
                        <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-teal-400">{selectedProgram.conversionRate}%</p>
                          <p className="text-xs text-gray-400">Conversion Rate</p>
                        </div>
                      )}
                      {selectedProgram.satisfactionScore && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-amber-400">{selectedProgram.satisfactionScore}</p>
                          <p className="text-xs text-gray-400">Satisfaction (5.0)</p>
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
