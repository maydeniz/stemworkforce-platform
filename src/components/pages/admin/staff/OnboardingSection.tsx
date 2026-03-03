// ===========================================
// Onboarding Section - Staff Management
// ===========================================
// Pre-boarding documents, Day 1 checklist, 30/60/90 programs
// Mentor assignment and training tracking
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  FileText,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Upload,
  Download,
  User,
  Laptop,
  Key,
  BookOpen,
  Target,
  GraduationCap,
  Building2,
  XCircle
} from 'lucide-react';
import type { StaffOnboarding, OnboardingStatus, DocumentStatus } from '@/types/staffManagement';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_ONBOARDING: StaffOnboarding[] = [
  {
    id: 'onb-1',
    staffId: 'staff-new-1',
    staffName: 'Jordan Lee',
    programId: 'prog-1',
    startDate: '2025-03-01',
    targetCompletionDate: '2025-05-30',
    status: 'preboarding',
    currentPhase: 0,
    progressPercent: 25,
    mentorId: 'staff-2',
    mentorName: 'Sarah Chen',
    documents: [
      { type: 'i9', status: 'pending' },
      { type: 'w4', status: 'uploaded', uploadedAt: '2025-01-22' },
      { type: 'direct_deposit', status: 'pending' },
      { type: 'nda', status: 'verified', uploadedAt: '2025-01-20', verifiedBy: 'HR Admin' },
      { type: 'handbook_ack', status: 'pending' }
    ],
    i9Status: 'pending',
    w4Status: 'uploaded',
    directDepositStatus: 'pending',
    day1Checklist: [
      { id: 'd1-1', item: 'Workstation setup', completed: false },
      { id: 'd1-2', item: 'Badge & building access', completed: false },
      { id: 'd1-3', item: 'Email & system accounts', completed: false },
      { id: 'd1-4', item: 'Meet team members', completed: false },
      { id: 'd1-5', item: 'HR orientation session', completed: false }
    ],
    equipmentIssued: [],
    accessProvisioned: [],
    requiredTrainings: [
      { trainingId: 'tr-1', trainingName: 'Security Awareness', dueDate: '2025-03-15' },
      { trainingId: 'tr-2', trainingName: 'Harassment Prevention', dueDate: '2025-03-15' },
      { trainingId: 'tr-3', trainingName: 'Platform Overview', dueDate: '2025-03-30' }
    ]
  },
  {
    id: 'onb-2',
    staffId: 'staff-new-2',
    staffName: 'Maya Patel',
    programId: 'prog-intern',
    startDate: '2025-06-02',
    targetCompletionDate: '2025-06-16',
    status: 'not_started',
    currentPhase: 0,
    progressPercent: 0,
    mentorId: 'staff-3',
    mentorName: 'Michael Torres',
    documents: [
      { type: 'i9', status: 'pending' },
      { type: 'w4', status: 'pending' },
      { type: 'direct_deposit', status: 'pending' },
      { type: 'nda', status: 'pending' }
    ],
    i9Status: 'pending',
    w4Status: 'pending',
    directDepositStatus: 'pending',
    day1Checklist: [
      { id: 'd1-1', item: 'Workstation setup', completed: false },
      { id: 'd1-2', item: 'Badge & building access', completed: false },
      { id: 'd1-3', item: 'Email & system accounts', completed: false },
      { id: 'd1-4', item: 'Meet team & mentor', completed: false },
      { id: 'd1-5', item: 'Intern orientation', completed: false }
    ],
    equipmentIssued: [],
    accessProvisioned: [],
    requiredTrainings: [
      { trainingId: 'tr-1', trainingName: 'Security Awareness', dueDate: '2025-06-09' },
      { trainingId: 'tr-4', trainingName: 'Intern Program Overview', dueDate: '2025-06-02' }
    ]
  },
  {
    id: 'onb-3',
    staffId: 'staff-new-3',
    staffName: 'Alex Thompson',
    programId: 'prog-1',
    startDate: '2025-01-15',
    targetCompletionDate: '2025-04-15',
    status: 'in_progress',
    currentPhase: 2,
    progressPercent: 65,
    mentorId: 'staff-4',
    mentorName: 'Emily Rodriguez',
    buddyId: 'staff-5',
    buddyName: 'David Kim',
    documents: [
      { type: 'i9', status: 'verified', uploadedAt: '2025-01-10', verifiedBy: 'HR Admin' },
      { type: 'w4', status: 'verified', uploadedAt: '2025-01-10', verifiedBy: 'HR Admin' },
      { type: 'direct_deposit', status: 'verified', uploadedAt: '2025-01-11', verifiedBy: 'Payroll' },
      { type: 'nda', status: 'verified', uploadedAt: '2025-01-08', verifiedBy: 'Legal' },
      { type: 'handbook_ack', status: 'verified', uploadedAt: '2025-01-15' }
    ],
    i9Status: 'verified',
    w4Status: 'verified',
    directDepositStatus: 'verified',
    day1Checklist: [
      { id: 'd1-1', item: 'Workstation setup', completed: true, completedAt: '2025-01-15' },
      { id: 'd1-2', item: 'Badge & building access', completed: true, completedAt: '2025-01-15' },
      { id: 'd1-3', item: 'Email & system accounts', completed: true, completedAt: '2025-01-15' },
      { id: 'd1-4', item: 'Meet team members', completed: true, completedAt: '2025-01-15' },
      { id: 'd1-5', item: 'HR orientation session', completed: true, completedAt: '2025-01-15' }
    ],
    equipmentIssued: [
      { item: 'MacBook Pro 14"', serialNumber: 'MBP-2025-001', issuedAt: '2025-01-15' },
      { item: 'Monitor 27"', serialNumber: 'MON-2025-015', issuedAt: '2025-01-15' }
    ],
    accessProvisioned: [
      { system: 'GitHub', accessLevel: 'Developer', provisionedAt: '2025-01-15' },
      { system: 'AWS Console', accessLevel: 'Developer', provisionedAt: '2025-01-16' },
      { system: 'Slack', accessLevel: 'Member', provisionedAt: '2025-01-15' }
    ],
    requiredTrainings: [
      { trainingId: 'tr-1', trainingName: 'Security Awareness', dueDate: '2025-01-30', completedAt: '2025-01-22', score: 95 },
      { trainingId: 'tr-2', trainingName: 'Harassment Prevention', dueDate: '2025-01-30', completedAt: '2025-01-25', score: 100 },
      { trainingId: 'tr-3', trainingName: 'Platform Overview', dueDate: '2025-02-15' }
    ]
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const OnboardingSection: React.FC = () => {
  const [onboardings] = useState<StaffOnboarding[]>(SAMPLE_ONBOARDING);
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | 'all'>('all');
  const [selectedOnboarding, setSelectedOnboarding] = useState<StaffOnboarding | null>(null);

  const filteredOnboardings = onboardings.filter(o =>
    statusFilter === 'all' || o.status === statusFilter
  );

  // Metrics
  const metrics = {
    total: onboardings.length,
    preboarding: onboardings.filter(o => o.status === 'preboarding' || o.status === 'not_started').length,
    inProgress: onboardings.filter(o => o.status === 'in_progress' || o.status === 'day1').length,
    completed: onboardings.filter(o => o.status === 'completed').length,
    pendingDocs: onboardings.filter(o =>
      o.documents.some(d => d.status === 'pending')
    ).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Onboarding</h2>
          <p className="text-sm text-gray-400">Manage new hire onboarding and documentation</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total New Hires" value={metrics.total} color="emerald" />
        <MetricCard icon={FileText} label="Pre-boarding" value={metrics.preboarding} color="amber" />
        <MetricCard icon={Clock} label="In Progress" value={metrics.inProgress} color="blue" />
        <MetricCard icon={AlertTriangle} label="Pending Docs" value={metrics.pendingDocs} color="red" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OnboardingStatus | 'all')}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
        >
          <option value="all">All Status</option>
          <option value="not_started">Not Started</option>
          <option value="preboarding">Pre-boarding</option>
          <option value="day1">Day 1</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Onboarding List */}
      <div className="space-y-4">
        {filteredOnboardings.map((onboarding) => (
          <OnboardingCard
            key={onboarding.id}
            onboarding={onboarding}
            onSelect={() => setSelectedOnboarding(onboarding)}
          />
        ))}
        {filteredOnboardings.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No onboarding records found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOnboarding && (
        <OnboardingDetailModal
          onboarding={selectedOnboarding}
          onClose={() => setSelectedOnboarding(null)}
        />
      )}
    </div>
  );
};

// ===========================================
// METRIC CARD
// ===========================================

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: 'emerald' | 'blue' | 'amber' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
};

// ===========================================
// ONBOARDING CARD
// ===========================================

interface OnboardingCardProps {
  onboarding: StaffOnboarding;
  onSelect: () => void;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({ onboarding, onSelect }) => {
  const statusConfig: Record<OnboardingStatus, { label: string; bg: string }> = {
    not_started: { label: 'Not Started', bg: 'bg-slate-500/20 text-slate-400' },
    preboarding: { label: 'Pre-boarding', bg: 'bg-amber-500/20 text-amber-400' },
    day1: { label: 'Day 1', bg: 'bg-blue-500/20 text-blue-400' },
    in_progress: { label: 'In Progress', bg: 'bg-purple-500/20 text-purple-400' },
    completed: { label: 'Completed', bg: 'bg-emerald-500/20 text-emerald-400' }
  };

  const cfg = statusConfig[onboarding.status];
  const pendingDocs = onboarding.documents.filter(d => d.status === 'pending').length;
  const completedTrainings = onboarding.requiredTrainings.filter(t => t.completedAt).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
              {onboarding.staffName?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{onboarding.staffName}</h3>
              <p className="text-sm text-gray-400">Start Date: {new Date(onboarding.startDate).toLocaleDateString()}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${cfg.bg}`}>
              {cfg.label}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">{onboarding.progressPercent}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${onboarding.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {onboarding.mentorName && (
              <span className="flex items-center gap-1 text-gray-400">
                <User className="w-4 h-4" />
                Mentor: {onboarding.mentorName}
              </span>
            )}
            <span className="flex items-center gap-1 text-gray-400">
              <FileText className="w-4 h-4" />
              {pendingDocs > 0 ? (
                <span className="text-amber-400">{pendingDocs} docs pending</span>
              ) : (
                <span className="text-emerald-400">All docs complete</span>
              )}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <BookOpen className="w-4 h-4" />
              {completedTrainings}/{onboarding.requiredTrainings.length} trainings
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </motion.div>
  );
};

// ===========================================
// ONBOARDING DETAIL MODAL
// ===========================================

interface OnboardingDetailModalProps {
  onboarding: StaffOnboarding;
  onClose: () => void;
}

const OnboardingDetailModal: React.FC<OnboardingDetailModalProps> = ({ onboarding, onClose }) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'day1' | 'training' | 'equipment'>('documents');
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const handleUploadDocument = (docType: string) => {
    setUploadingDoc(docType);
    // Simulate file upload
    setTimeout(() => {
      setUploadingDoc(null);
      alert(`Document "${docType}" would be uploaded here. File picker would open.`);
    }, 500);
  };

  const handleStartTraining = (trainingName: string) => {
    // In a real app, this would redirect to the training platform
    alert(`Opening training: ${trainingName}\nThis would redirect to the training platform.`);
  };

  const docStatusConfig: Record<DocumentStatus, { label: string; bg: string; icon: React.ElementType }> = {
    pending: { label: 'Pending', bg: 'bg-amber-500/20 text-amber-400', icon: Clock },
    uploaded: { label: 'Uploaded', bg: 'bg-blue-500/20 text-blue-400', icon: Upload },
    verified: { label: 'Verified', bg: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
    rejected: { label: 'Rejected', bg: 'bg-red-500/20 text-red-400', icon: XCircle }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                {onboarding.staffName?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{onboarding.staffName}</h2>
                <p className="text-gray-400">Start Date: {new Date(onboarding.startDate).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-white font-medium">{onboarding.progressPercent}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${onboarding.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            {[
              { key: 'documents', label: 'Documents', icon: FileText },
              { key: 'day1', label: 'Day 1 Checklist', icon: CheckCircle2 },
              { key: 'training', label: 'Training', icon: BookOpen },
              { key: 'equipment', label: 'Equipment & Access', icon: Laptop }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Required Documents</h3>
              {onboarding.documents.map((doc, idx) => {
                const cfg = docStatusConfig[doc.status];
                const Icon = cfg.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-800 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium capitalize">{doc.type.replace('_', ' ')}</p>
                        {doc.uploadedAt && (
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${cfg.bg}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      {doc.status === 'pending' && (
                        <button
                          onClick={() => handleUploadDocument(doc.type)}
                          disabled={uploadingDoc === doc.type}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg disabled:opacity-50"
                        >
                          {uploadingDoc === doc.type ? 'Uploading...' : 'Upload'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'day1' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Day 1 Checklist</h3>
              {onboarding.day1Checklist.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-lg p-4 ${
                    item.completed ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-600 rounded-full" />
                    )}
                    <span className={item.completed ? 'text-emerald-400' : 'text-white'}>
                      {item.item}
                    </span>
                  </div>
                  {item.completedAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(item.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Required Trainings</h3>
              {onboarding.requiredTrainings.map((training) => (
                <div
                  key={training.trainingId}
                  className={`flex items-center justify-between rounded-lg p-4 ${
                    training.completedAt ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className={`w-5 h-5 ${training.completedAt ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <div>
                      <p className={training.completedAt ? 'text-emerald-400' : 'text-white'}>
                        {training.trainingName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(training.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {training.completedAt ? (
                    <div className="text-right">
                      <span className="text-emerald-400 text-sm">Completed</span>
                      {training.score && (
                        <p className="text-xs text-gray-500">Score: {training.score}%</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartTraining(training.trainingName)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg"
                    >
                      Start Training
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-4">Equipment Issued</h3>
                {onboarding.equipmentIssued.length > 0 ? (
                  <div className="space-y-3">
                    {onboarding.equipmentIssued.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Laptop className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-white">{item.item}</p>
                            {item.serialNumber && (
                              <p className="text-xs text-gray-500">S/N: {item.serialNumber}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          Issued: {new Date(item.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No equipment issued yet</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-4">System Access</h3>
                {onboarding.accessProvisioned.length > 0 ? (
                  <div className="space-y-3">
                    {onboarding.accessProvisioned.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-white">{item.system}</p>
                            <p className="text-xs text-gray-500">Level: {item.accessLevel}</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-400">Provisioned</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No system access provisioned yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingSection;
