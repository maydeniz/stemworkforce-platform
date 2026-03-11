// ===========================================
// Departments Tab - Municipality Partner Dashboard
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  Briefcase,
  ChevronRight,
  Wrench,
  Zap
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { MunicipalityPartnerTier, DepartmentType } from '@/types/municipalityPartner';

interface DepartmentsTabProps {
  partnerId: string;
  tier: MunicipalityPartnerTier;
}

interface DepartmentData {
  department: DepartmentType;
  name: string;
  authorizedPositions: number;
  filledPositions: number;
  vacancyRate: number;
  retirementEligible5Years: number;
  avgTimeToFill: number;
  internSlots: number;
  apprenticeSlots: number;
  hardToFill: string[];
  skillGaps: string[];
}

const sampleDepartments: DepartmentData[] = [
  {
    department: 'public_works', name: 'Public Works', authorizedPositions: 450, filledPositions: 385,
    vacancyRate: 14.4, retirementEligible5Years: 78, avgTimeToFill: 85, internSlots: 25, apprenticeSlots: 8,
    hardToFill: ['Civil Engineer', 'Equipment Operator', 'Project Manager'],
    skillGaps: ['AutoCAD', 'GIS', 'Project Management']
  },
  {
    department: 'utilities', name: 'Utilities', authorizedPositions: 320, filledPositions: 268,
    vacancyRate: 16.3, retirementEligible5Years: 92, avgTimeToFill: 95, internSlots: 12, apprenticeSlots: 15,
    hardToFill: ['Water Treatment Operator', 'Electrical Technician', 'SCADA Specialist'],
    skillGaps: ['Water Quality', 'Electrical Systems', 'PLC Programming']
  },
  {
    department: 'it_technology', name: 'IT/Technology', authorizedPositions: 180, filledPositions: 142,
    vacancyRate: 21.1, retirementEligible5Years: 28, avgTimeToFill: 120, internSlots: 15, apprenticeSlots: 6,
    hardToFill: ['Cybersecurity Analyst', 'Network Engineer', 'Data Analyst'],
    skillGaps: ['Cybersecurity', 'Cloud Services', 'Data Analytics']
  },
  {
    department: 'parks_recreation', name: 'Parks & Recreation', authorizedPositions: 280, filledPositions: 252,
    vacancyRate: 10.0, retirementEligible5Years: 45, avgTimeToFill: 45, internSlots: 35, apprenticeSlots: 0,
    hardToFill: ['Recreation Program Coordinator', 'Park Ranger'],
    skillGaps: ['Program Management', 'Youth Development']
  },
  {
    department: 'finance', name: 'Finance', authorizedPositions: 120, filledPositions: 105,
    vacancyRate: 12.5, retirementEligible5Years: 32, avgTimeToFill: 75, internSlots: 10, apprenticeSlots: 0,
    hardToFill: ['Senior Accountant', 'Budget Analyst', 'Internal Auditor'],
    skillGaps: ['ERP Systems', 'Financial Analysis', 'Grant Management']
  },
  {
    department: 'public_safety', name: 'Public Safety Admin', authorizedPositions: 85, filledPositions: 78,
    vacancyRate: 8.2, retirementEligible5Years: 18, avgTimeToFill: 60, internSlots: 8, apprenticeSlots: 0,
    hardToFill: ['911 Dispatcher', 'Crime Analyst'],
    skillGaps: ['Emergency Communications', 'Data Analysis']
  }
];

// Static Tailwind color map
const twColor: Record<string, { bg: string; text: string }> = {
  red: { bg: 'bg-red-500/20', text: 'text-red-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

export const DepartmentsTab: React.FC<DepartmentsTabProps> = ({ partnerId: _partnerId, tier: _tier }) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentData | null>(null);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEscapeKey(() => setSelectedDept(null), !!selectedDept);

  const totalVacancies = sampleDepartments.reduce((sum, d) => sum + (d.authorizedPositions - d.filledPositions), 0);
  const totalRetiring = sampleDepartments.reduce((sum, d) => sum + d.retirementEligible5Years, 0);
  const avgVacancyRate = sampleDepartments.reduce((sum, d) => sum + d.vacancyRate, 0) / sampleDepartments.length;

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.visible && (
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-lg shadow-lg">
          <Target className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Department Workforce Needs</h2>
          <p className="text-gray-400 text-sm">Track vacancies, skill gaps, and intern/apprentice requests by department</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vacancies', value: totalVacancies, icon: Users, color: 'red' },
          { label: 'Avg Vacancy Rate', value: `${avgVacancyRate.toFixed(1)}%`, icon: TrendingUp, color: 'amber' },
          { label: 'Retiring in 5 Years', value: totalRetiring, icon: Clock, color: 'purple' },
          { label: 'Intern/Apprentice Slots', value: sampleDepartments.reduce((s, d) => s + d.internSlots + d.apprenticeSlots, 0), icon: Target, color: 'teal' }
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

      {/* Departments Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleDepartments.map((dept, index) => (
          <motion.div
            key={dept.department}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedDept(dept)}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-teal-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{dept.name}</h3>
                  <p className="text-sm text-gray-400">{dept.filledPositions}/{dept.authorizedPositions} filled</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-teal-400" />
            </div>

            {/* Vacancy Rate Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Vacancy Rate</span>
                <span className={dept.vacancyRate > 15 ? 'text-red-400' : dept.vacancyRate > 10 ? 'text-amber-400' : 'text-emerald-400'}>
                  {dept.vacancyRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    dept.vacancyRate > 15 ? 'bg-red-500' : dept.vacancyRate > 10 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, dept.vacancyRate * 3)}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-800/50 rounded p-2">
                <p className="text-lg font-bold text-purple-400">{dept.retirementEligible5Years}</p>
                <p className="text-xs text-gray-500">Retiring</p>
              </div>
              <div className="bg-slate-800/50 rounded p-2">
                <p className="text-lg font-bold text-blue-400">{dept.internSlots}</p>
                <p className="text-xs text-gray-500">Interns</p>
              </div>
              <div className="bg-slate-800/50 rounded p-2">
                <p className="text-lg font-bold text-amber-400">{dept.apprenticeSlots}</p>
                <p className="text-xs text-gray-500">Apprentices</p>
              </div>
            </div>

            {/* Hard to Fill */}
            {dept.hardToFill.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1 text-xs text-amber-400 mb-2">
                  <AlertTriangle className="w-3 h-3" />
                  Hard to Fill
                </div>
                <div className="flex flex-wrap gap-1">
                  {dept.hardToFill.slice(0, 2).map((pos, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 bg-slate-800 text-gray-300 rounded">
                      {pos}
                    </span>
                  ))}
                  {dept.hardToFill.length > 2 && (
                    <span className="text-xs text-gray-500">+{dept.hardToFill.length - 2} more</span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Department Detail Modal */}
      {selectedDept && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDept(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedDept.name}</h2>
                    <p className="text-gray-400">{selectedDept.authorizedPositions} authorized positions</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDept(null)} className="p-2 text-gray-400 hover:text-white">×</button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-white">{selectedDept.filledPositions}</p>
                  <p className="text-xs text-gray-400">Filled</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-400">{selectedDept.authorizedPositions - selectedDept.filledPositions}</p>
                  <p className="text-xs text-gray-400">Vacant</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-400">{selectedDept.retirementEligible5Years}</p>
                  <p className="text-xs text-gray-400">Retiring 5yr</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-amber-400">{selectedDept.avgTimeToFill}</p>
                  <p className="text-xs text-gray-400">Avg Days to Fill</p>
                </div>
              </div>

              {/* Hard to Fill */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Hard to Fill Positions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDept.hardToFill.map((pos, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-sm">
                      {pos}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Critical Skill Gaps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDept.skillGaps.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pipeline Slots */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    <h4 className="text-white font-medium">Intern Slots</h4>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">{selectedDept.internSlots}</p>
                  <p className="text-sm text-gray-400">approved for FY25</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-5 h-5 text-amber-400" />
                    <h4 className="text-white font-medium">Apprentice Slots</h4>
                  </div>
                  <p className="text-3xl font-bold text-amber-400">{selectedDept.apprenticeSlots}</p>
                  <p className="text-sm text-gray-400">approved for FY25</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setSelectedDept(null)} className="px-4 py-2 text-gray-400">Close</button>
              <button onClick={() => showNotification('Opening department needs editor...')} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">Edit Needs</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
