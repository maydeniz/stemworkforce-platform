// ===========================================
// Civil Service Tab - Municipality Partner Dashboard
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  ChevronRight,
  Target,
  Award
} from 'lucide-react';
import type { MunicipalityPartnerTier } from '@/types/municipalityPartner';

interface CivilServiceTabProps {
  partnerId: string;
  tier: MunicipalityPartnerTier;
}

interface ExamData {
  id: string;
  examTitle: string;
  examNumber: string;
  jobClassification: string;
  applicationOpenDate: string;
  applicationCloseDate: string;
  examDate?: string;
  resultsExpectedDate?: string;
  listExpirationDate?: string;
  examType: 'written' | 'performance' | 'oral' | 'education_experience' | 'combined';
  isContinuous: boolean;
  applicantsCount?: number;
  passersCount?: number;
  passingScore: number;
  linkedParticipants: number;
  status: 'upcoming' | 'open' | 'closed' | 'results_pending' | 'list_active' | 'list_expired';
}

const sampleExams: ExamData[] = [
  {
    id: 'exam-001', examTitle: 'Engineering Technician II', examNumber: 'ET-2025-001',
    jobClassification: 'Engineering Series', applicationOpenDate: '2025-01-15', applicationCloseDate: '2025-02-10',
    examDate: '2025-02-15', resultsExpectedDate: '2025-03-01', listExpirationDate: '2027-03-01',
    examType: 'combined', isContinuous: false, applicantsCount: 87, passingScore: 70, linkedParticipants: 12,
    status: 'open'
  },
  {
    id: 'exam-002', examTitle: 'IT Support Specialist I', examNumber: 'IT-2025-001',
    jobClassification: 'Information Technology Series', applicationOpenDate: '2025-02-01', applicationCloseDate: '2025-02-25',
    examDate: '2025-02-28', resultsExpectedDate: '2025-03-15', listExpirationDate: '2027-03-15',
    examType: 'written', isContinuous: false, passingScore: 70, linkedParticipants: 8,
    status: 'upcoming'
  },
  {
    id: 'exam-003', examTitle: 'Water Treatment Plant Operator', examNumber: 'WT-2025-001',
    jobClassification: 'Utilities Operations Series', applicationOpenDate: '2025-02-15', applicationCloseDate: '2025-03-08',
    examDate: '2025-03-10', resultsExpectedDate: '2025-03-25', listExpirationDate: '2027-03-25',
    examType: 'combined', isContinuous: false, passingScore: 70, linkedParticipants: 15,
    status: 'upcoming'
  },
  {
    id: 'exam-004', examTitle: 'Administrative Analyst I', examNumber: 'AA-2024-003',
    jobClassification: 'Administrative Series', applicationOpenDate: '2024-10-01', applicationCloseDate: '2024-10-31',
    examDate: '2024-11-15', resultsExpectedDate: '2024-12-01', listExpirationDate: '2026-12-01',
    examType: 'education_experience', isContinuous: false, applicantsCount: 156, passersCount: 98, passingScore: 70, linkedParticipants: 6,
    status: 'list_active'
  },
  {
    id: 'exam-005', examTitle: 'Maintenance Worker I', examNumber: 'MW-CONT',
    jobClassification: 'Maintenance Series', applicationOpenDate: '2024-01-01', applicationCloseDate: '2025-12-31',
    examType: 'performance', isContinuous: true, applicantsCount: 245, passersCount: 180, passingScore: 70, linkedParticipants: 22,
    status: 'open'
  }
];

const statusConfig = {
  upcoming: { label: 'Upcoming', color: 'blue', icon: Calendar },
  open: { label: 'Open', color: 'emerald', icon: CheckCircle },
  closed: { label: 'Closed', color: 'slate', icon: Clock },
  results_pending: { label: 'Results Pending', color: 'amber', icon: Clock },
  list_active: { label: 'List Active', color: 'purple', icon: Award },
  list_expired: { label: 'List Expired', color: 'gray', icon: AlertTriangle }
};

const examTypeLabels = {
  written: 'Written', performance: 'Performance', oral: 'Oral',
  education_experience: 'Education & Experience', combined: 'Combined'
};

export const CivilServiceTab: React.FC<CivilServiceTabProps> = ({ partnerId: _partnerId, tier: _tier }) => {
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredExams = filterStatus
    ? sampleExams.filter(e => e.status === filterStatus)
    : sampleExams;

  const stats = {
    openExams: sampleExams.filter(e => e.status === 'open' || e.status === 'upcoming').length,
    activeLists: sampleExams.filter(e => e.status === 'list_active').length,
    linkedParticipants: sampleExams.reduce((sum, e) => sum + e.linkedParticipants, 0),
    avgPassRate: sampleExams.filter(e => e.passersCount && e.applicantsCount)
      .reduce((sum, e) => sum + ((e.passersCount || 0) / (e.applicantsCount || 1)) * 100, 0) / 3
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Civil Service Exams</h2>
          <p className="text-gray-400 text-sm">Track exams, eligible lists, and linked program participants</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
          <Plus className="w-4 h-4" />
          Add Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open/Upcoming', value: stats.openExams, icon: Calendar, color: 'blue' },
          { label: 'Active Lists', value: stats.activeLists, icon: FileText, color: 'purple' },
          { label: 'Linked Participants', value: stats.linkedParticipants, icon: Users, color: 'teal' },
          { label: 'Avg Pass Rate', value: `${stats.avgPassRate.toFixed(0)}%`, icon: Target, color: 'emerald' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: '', label: 'All Exams' },
          { key: 'open', label: 'Open' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'list_active', label: 'Active Lists' },
          { key: 'results_pending', label: 'Pending Results' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === tab.key
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {filteredExams.map((exam, index) => {
          const config = statusConfig[exam.status];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedExam(exam)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-teal-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs bg-${config.color}-500/20 text-${config.color}-400 flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                    {exam.isContinuous && (
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">Continuous</span>
                    )}
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-gray-400">{examTypeLabels[exam.examType]}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">{exam.examTitle}</h3>
                  <p className="text-gray-400 text-sm">{exam.jobClassification} | Exam #{exam.examNumber}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800">
                {exam.examDate && (
                  <div>
                    <p className="text-xs text-gray-500">Exam Date</p>
                    <p className="text-white font-medium">{new Date(exam.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                )}
                {exam.applicantsCount && (
                  <div>
                    <p className="text-xs text-gray-500">Applicants</p>
                    <p className="text-white font-medium">{exam.applicantsCount}</p>
                  </div>
                )}
                {exam.passersCount && (
                  <div>
                    <p className="text-xs text-gray-500">Passed</p>
                    <p className="text-emerald-400 font-medium">{exam.passersCount}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Linked Participants</p>
                  <p className="text-teal-400 font-medium">{exam.linkedParticipants}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Exam Detail Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedExam(null)}>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs bg-${statusConfig[selectedExam.status].color}-500/20 text-${statusConfig[selectedExam.status].color}-400`}>
                      {statusConfig[selectedExam.status].label}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">{selectedExam.examTitle}</h2>
                  <p className="text-gray-400">Exam #{selectedExam.examNumber}</p>
                </div>
                <button onClick={() => setSelectedExam(null)} className="p-2 text-gray-400 hover:text-white">×</button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Exam Type</p>
                  <p className="text-white font-medium">{examTypeLabels[selectedExam.examType]}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Passing Score</p>
                  <p className="text-white font-medium">{selectedExam.passingScore}%</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Continuous</p>
                  <p className="text-white font-medium">{selectedExam.isContinuous ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-400">Applications</div>
                    <div className="text-white">
                      {new Date(selectedExam.applicationOpenDate).toLocaleDateString()} - {new Date(selectedExam.applicationCloseDate).toLocaleDateString()}
                    </div>
                  </div>
                  {selectedExam.examDate && (
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-400">Exam Date</div>
                      <div className="text-white">{new Date(selectedExam.examDate).toLocaleDateString()}</div>
                    </div>
                  )}
                  {selectedExam.listExpirationDate && (
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-400">List Expires</div>
                      <div className="text-white">{new Date(selectedExam.listExpirationDate).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Linked Participants */}
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Linked Program Participants</h3>
                    <p className="text-sm text-gray-400">Interns and apprentices eligible for this exam</p>
                  </div>
                  <p className="text-3xl font-bold text-teal-400">{selectedExam.linkedParticipants}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setSelectedExam(null)} className="px-4 py-2 text-gray-400">Close</button>
              <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">Manage Exam</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
