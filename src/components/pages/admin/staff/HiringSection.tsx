// ===========================================
// Hiring Section - Staff Management
// ===========================================
// Job requisitions, candidate pipeline, offers, background checks
// Supports full-time, part-time, contract, and intern positions
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Search,
  Users,
  XCircle,
  Edit2,
  Eye,
  Send,
  GraduationCap,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Building2,
  Sparkles,
  Loader2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import type {
  JobRequisition,
  Candidate,
  RequisitionStatus,
  CandidateStage
} from '@/types/staffManagement';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_REQUISITIONS: JobRequisition[] = [
  {
    id: 'req-1',
    title: 'Senior Full Stack Engineer',
    departmentId: 'dept-eng',
    departmentName: 'Engineering',
    hiringManagerId: 'staff-1',
    hiringManagerName: 'Sarah Chen',
    description: 'We are looking for an experienced Full Stack Engineer to join our platform team. You will be responsible for building and maintaining core platform features.',
    requirements: '5+ years experience with React, Node.js, PostgreSQL. Experience with cloud platforms (AWS/GCP). Strong problem-solving skills.',
    responsibilities: 'Design and implement new features. Code reviews. Mentor junior developers. Participate in architecture decisions.',
    benefits: 'Competitive salary, health insurance, 401k matching, remote work options, professional development budget.',
    salaryMin: 140000,
    salaryMax: 180000,
    employmentType: 'full-time',
    location: 'Washington, DC',
    remoteAllowed: true,
    status: 'open',
    approvalChain: [{ approverId: 'staff-1', approverName: 'Sarah Chen', status: 'approved', approvedAt: '2025-01-10' }],
    positionsToFill: 2,
    positionsFilled: 0,
    targetStartDate: '2025-03-01',
    applicationDeadline: '2025-02-15',
    priority: 'high',
    isPublished: true,
    publishedAt: '2025-01-12',
    tags: ['engineering', 'senior', 'remote-friendly'],
    createdAt: '2025-01-08'
  },
  {
    id: 'req-2',
    title: 'Summer Engineering Intern',
    departmentId: 'dept-eng',
    departmentName: 'Engineering',
    hiringManagerId: 'staff-2',
    hiringManagerName: 'Michael Torres',
    description: 'Join our engineering team for a 12-week summer internship program. Work on real projects that impact millions of users.',
    requirements: 'Currently pursuing CS degree. Familiar with web technologies. Strong communication skills. Graduating 2026 or later.',
    responsibilities: 'Contribute to feature development. Participate in code reviews. Present project at end of internship.',
    benefits: 'Competitive stipend, housing assistance, mentorship program, potential full-time offer.',
    salaryMin: 35,
    salaryMax: 45,
    employmentType: 'intern',
    location: 'Washington, DC',
    remoteAllowed: false,
    status: 'open',
    approvalChain: [{ approverId: 'staff-1', approverName: 'Sarah Chen', status: 'approved', approvedAt: '2025-01-05' }],
    positionsToFill: 5,
    positionsFilled: 2,
    targetStartDate: '2025-06-02',
    applicationDeadline: '2025-03-15',
    priority: 'normal',
    isPublished: true,
    publishedAt: '2025-01-06',
    internDetails: {
      programDuration: '12 weeks',
      schoolPartner: 'Various universities',
      stipendAmount: 7500,
      academicCredit: true,
      projectDescription: 'Build a feature for the STEMWorkforce platform'
    },
    tags: ['internship', 'summer-2025', 'engineering'],
    createdAt: '2025-01-02'
  },
  {
    id: 'req-3',
    title: 'Product Manager',
    departmentId: 'dept-product',
    departmentName: 'Product',
    hiringManagerId: 'staff-3',
    hiringManagerName: 'Emily Rodriguez',
    description: 'Lead product strategy for our workforce development platform. Partner with engineering and design to deliver impactful features.',
    requirements: '3+ years product management experience. EdTech or workforce development background preferred. Strong analytical skills.',
    salaryMin: 120000,
    salaryMax: 150000,
    employmentType: 'full-time',
    location: 'Remote',
    remoteAllowed: true,
    status: 'pending_approval',
    approvalChain: [
      { approverId: 'staff-3', approverName: 'Emily Rodriguez', status: 'approved', approvedAt: '2025-01-18' },
      { approverId: 'staff-1', approverName: 'Sarah Chen', status: 'pending' }
    ],
    positionsToFill: 1,
    positionsFilled: 0,
    targetStartDate: '2025-04-01',
    priority: 'normal',
    isPublished: false,
    tags: ['product', 'leadership'],
    createdAt: '2025-01-15'
  },
  {
    id: 'req-4',
    title: 'Data Science Intern - Fall 2025',
    departmentId: 'dept-data',
    departmentName: 'Data Science',
    hiringManagerId: 'staff-4',
    hiringManagerName: 'David Kim',
    description: 'Work on ML models to improve job matching and career recommendations. Learn from experienced data scientists.',
    requirements: 'Graduate student in Data Science, ML, or related field. Python, SQL proficiency. Familiar with ML frameworks.',
    salaryMin: 40,
    salaryMax: 50,
    employmentType: 'intern',
    location: 'Washington, DC',
    remoteAllowed: true,
    status: 'draft',
    approvalChain: [],
    positionsToFill: 2,
    positionsFilled: 0,
    targetStartDate: '2025-09-01',
    priority: 'low',
    isPublished: false,
    internDetails: {
      programDuration: '16 weeks',
      academicCredit: true,
      projectDescription: 'Improve career recommendation algorithms'
    },
    tags: ['internship', 'fall-2025', 'data-science', 'ml'],
    createdAt: '2025-01-20'
  }
];

const SAMPLE_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    requisitionId: 'req-1',
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'alex.thompson@email.com',
    phone: '(555) 123-4567',
    source: 'LinkedIn',
    appliedAt: '2025-01-14',
    stage: 'interview',
    interviews: [
      { id: 'int-1', date: '2025-01-18', type: 'phone', interviewers: ['Sarah Chen'], status: 'completed', rating: 4 },
      { id: 'int-2', date: '2025-01-22', type: 'video', interviewers: ['Michael Torres', 'David Kim'], status: 'scheduled' }
    ],
    backgroundCheckStatus: 'not_started'
  },
  {
    id: 'cand-2',
    requisitionId: 'req-1',
    firstName: 'Jordan',
    lastName: 'Lee',
    email: 'jordan.lee@email.com',
    source: 'Referral',
    referrerId: 'staff-2',
    appliedAt: '2025-01-12',
    stage: 'offer',
    interviews: [
      { id: 'int-3', date: '2025-01-15', type: 'phone', interviewers: ['Sarah Chen'], status: 'completed', rating: 5 },
      { id: 'int-4', date: '2025-01-18', type: 'onsite', interviewers: ['Team'], status: 'completed', rating: 5 }
    ],
    offerStatus: 'extended',
    offerDetails: {
      salary: 165000,
      startDate: '2025-03-01',
      signOnBonus: 15000,
      expiresAt: '2025-01-30'
    },
    backgroundCheckStatus: 'in_progress'
  },
  {
    id: 'cand-3',
    requisitionId: 'req-2',
    firstName: 'Maya',
    lastName: 'Patel',
    email: 'maya.patel@university.edu',
    source: 'Career Fair',
    appliedAt: '2025-01-08',
    stage: 'hired',
    interviews: [
      { id: 'int-5', date: '2025-01-12', type: 'video', interviewers: ['Michael Torres'], status: 'completed', rating: 4 }
    ],
    offerStatus: 'accepted',
    offerDetails: {
      salary: 7500,
      startDate: '2025-06-02',
      expiresAt: '2025-01-20'
    },
    backgroundCheckStatus: 'passed'
  },
  {
    id: 'cand-4',
    requisitionId: 'req-2',
    firstName: 'Chris',
    lastName: 'Johnson',
    email: 'c.johnson@college.edu',
    source: 'University Partnership',
    appliedAt: '2025-01-10',
    stage: 'screening',
    interviews: [],
    backgroundCheckStatus: 'not_started'
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const HiringSection: React.FC = () => {
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(SAMPLE_REQUISITIONS);
  const [candidates] = useState<Candidate[]>(SAMPLE_CANDIDATES);
  const [activeView, setActiveView] = useState<'requisitions' | 'pipeline'>('requisitions');
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequisition, setSelectedRequisition] = useState<JobRequisition | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRequisition, setEditingRequisition] = useState<JobRequisition | null>(null);

  // Filter requisitions
  const filteredRequisitions = requisitions.filter(req => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (typeFilter !== 'all' && req.employmentType !== typeFilter) return false;
    if (searchQuery && !req.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Get candidates for selected requisition
  const requisitionCandidates = selectedRequisition
    ? candidates.filter(c => c.requisitionId === selectedRequisition.id)
    : [];

  // Metrics
  const metrics = {
    openPositions: requisitions.filter(r => r.status === 'open').length,
    totalCandidates: candidates.length,
    interviewsThisWeek: candidates.filter(c => c.stage === 'interview').length,
    offersExtended: candidates.filter(c => c.offerStatus === 'extended').length,
    internPositions: requisitions.filter(r => r.employmentType === 'intern' && r.status === 'open').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Hiring & Recruitment</h2>
          <p className="text-sm text-gray-400">Manage job requisitions and candidate pipeline</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Requisition
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard icon={Briefcase} label="Open Positions" value={metrics.openPositions} color="emerald" />
        <MetricCard icon={Users} label="Total Candidates" value={metrics.totalCandidates} color="blue" />
        <MetricCard icon={Calendar} label="Interviews This Week" value={metrics.interviewsThisWeek} color="purple" />
        <MetricCard icon={Send} label="Offers Extended" value={metrics.offersExtended} color="amber" />
        <MetricCard icon={GraduationCap} label="Intern Openings" value={metrics.internPositions} color="pink" />
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveView('requisitions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'requisitions' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Job Requisitions
          </button>
          <button
            onClick={() => setActiveView('pipeline')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'pipeline' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Candidate Pipeline
          </button>
        </div>
      </div>

      {activeView === 'requisitions' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequisitionStatus | 'all')}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="open">Open</option>
              <option value="filled">Filled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>

          {/* Requisitions List */}
          <div className="space-y-4">
            {filteredRequisitions.map((req) => (
              <RequisitionCard
                key={req.id}
                requisition={req}
                candidateCount={candidates.filter(c => c.requisitionId === req.id).length}
                onSelect={() => setSelectedRequisition(req)}
                onEdit={() => setEditingRequisition(req)}
                onPublishToggle={() => {
                  // Toggle publish status
                  setRequisitions(prev => prev.map(r =>
                    r.id === req.id ? { ...r, isPublished: !r.isPublished, publishedAt: !r.isPublished ? new Date().toISOString() : undefined } : r
                  ));
                }}
              />
            ))}
            {filteredRequisitions.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No requisitions found</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Candidate Pipeline View */
        <CandidatePipeline candidates={candidates} requisitions={requisitions} />
      )}

      {/* Requisition Detail Modal */}
      {selectedRequisition && (
        <RequisitionDetailModal
          requisition={selectedRequisition}
          candidates={requisitionCandidates}
          onClose={() => setSelectedRequisition(null)}
        />
      )}

      {/* Create Requisition Modal */}
      {showCreateModal && (
        <CreateRequisitionModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Edit Requisition Modal */}
      {editingRequisition && (
        <EditRequisitionModal
          requisition={editingRequisition}
          onClose={() => setEditingRequisition(null)}
          onSave={(updated) => {
            setRequisitions(prev => prev.map(r => r.id === updated.id ? updated : r));
            setEditingRequisition(null);
          }}
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
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'pink';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
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
// REQUISITION CARD
// ===========================================

interface RequisitionCardProps {
  requisition: JobRequisition;
  candidateCount: number;
  onSelect: () => void;
  onEdit: () => void;
  onPublishToggle: () => void;
}

const RequisitionCard: React.FC<RequisitionCardProps> = ({
  requisition,
  candidateCount,
  onSelect,
  onEdit,
  onPublishToggle
}) => {
  const statusConfig: Record<RequisitionStatus, { label: string; bg: string }> = {
    draft: { label: 'Draft', bg: 'bg-slate-500/20 text-slate-400' },
    pending_approval: { label: 'Pending Approval', bg: 'bg-amber-500/20 text-amber-400' },
    approved: { label: 'Approved', bg: 'bg-blue-500/20 text-blue-400' },
    open: { label: 'Open', bg: 'bg-emerald-500/20 text-emerald-400' },
    filled: { label: 'Filled', bg: 'bg-purple-500/20 text-purple-400' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-500/20 text-red-400' }
  };

  const cfg = statusConfig[requisition.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{requisition.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${cfg.bg}`}>
              {cfg.label}
            </span>
            {requisition.employmentType === 'intern' && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-pink-500/20 text-pink-400">
                Internship
              </span>
            )}
            {requisition.isPublished && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Published
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {requisition.departmentName}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {requisition.location}
              {requisition.remoteAllowed && ' (Remote OK)'}
            </span>
            {requisition.employmentType === 'intern' ? (
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                ${requisition.salaryMin}-${requisition.salaryMax}/hr
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                ${(requisition.salaryMin / 1000).toFixed(0)}k-${(requisition.salaryMax / 1000).toFixed(0)}k
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {candidateCount} candidates
            </span>
          </div>

          {requisition.internDetails && (
            <div className="text-sm text-pink-400 mb-3">
              <GraduationCap className="w-4 h-4 inline mr-1" />
              {requisition.internDetails.programDuration} •
              {requisition.internDetails.academicCredit && ' Academic Credit Available'}
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">
              {requisition.positionsFilled}/{requisition.positionsToFill} filled
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">
              Target: {new Date(requisition.targetStartDate).toLocaleDateString()}
            </span>
            {requisition.applicationDeadline && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-amber-400">
                  Deadline: {new Date(requisition.applicationDeadline).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {requisition.status === 'open' && (
            <button
              onClick={(e) => { e.stopPropagation(); onPublishToggle(); }}
              className={`p-2 rounded-lg transition-colors ${
                requisition.isPublished
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title={requisition.isPublished ? 'Unpublish from careers page' : 'Publish to careers page'}
            >
              <Globe className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onSelect}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white rounded-lg transition-colors"
            title="Edit requisition"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================
// CANDIDATE PIPELINE
// ===========================================

interface CandidatePipelineProps {
  candidates: Candidate[];
  requisitions: JobRequisition[];
}

const CandidatePipeline: React.FC<CandidatePipelineProps> = ({ candidates, requisitions }) => {
  const stages: { key: CandidateStage; label: string; color: string }[] = [
    { key: 'applied', label: 'Applied', color: 'bg-slate-500' },
    { key: 'screening', label: 'Screening', color: 'bg-blue-500' },
    { key: 'phone_screen', label: 'Phone Screen', color: 'bg-cyan-500' },
    { key: 'interview', label: 'Interview', color: 'bg-purple-500' },
    { key: 'final_interview', label: 'Final', color: 'bg-amber-500' },
    { key: 'offer', label: 'Offer', color: 'bg-emerald-500' },
    { key: 'hired', label: 'Hired', color: 'bg-green-500' }
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter(c => c.stage === stage.key);
          return (
            <div key={stage.key} className="w-72 flex-shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="text-sm font-medium text-white">{stage.label}</span>
                <span className="text-xs text-gray-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {stageCandidates.length}
                </span>
              </div>
              <div className="space-y-3">
                {stageCandidates.map((candidate) => {
                  const req = requisitions.find(r => r.id === candidate.requisitionId);
                  return (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-4"
                    >
                      <div className="font-medium text-white mb-1">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">{req?.title || 'Unknown Position'}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{candidate.source}</span>
                        <span className="text-gray-500">
                          {new Date(candidate.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {candidate.offerStatus === 'extended' && (
                        <div className="mt-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                          Offer Extended
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===========================================
// REQUISITION DETAIL MODAL
// ===========================================

interface RequisitionDetailModalProps {
  requisition: JobRequisition;
  candidates: Candidate[];
  onClose: () => void;
}

const RequisitionDetailModal: React.FC<RequisitionDetailModalProps> = ({
  requisition,
  candidates,
  onClose
}) => {
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
            <div>
              <h2 className="text-xl font-bold text-white">{requisition.title}</h2>
              <p className="text-gray-400">{requisition.departmentName} • {requisition.location}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-white text-sm">{requisition.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Requirements</h3>
                <p className="text-white text-sm">{requisition.requirements}</p>
              </div>
              {requisition.responsibilities && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Responsibilities</h3>
                  <p className="text-white text-sm">{requisition.responsibilities}</p>
                </div>
              )}
              {requisition.internDetails && (
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-pink-400 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Internship Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-white">Duration: {requisition.internDetails.programDuration}</p>
                    {requisition.internDetails.stipendAmount && (
                      <p className="text-white">Stipend: ${requisition.internDetails.stipendAmount.toLocaleString()}</p>
                    )}
                    <p className="text-white">Academic Credit: {requisition.internDetails.academicCredit ? 'Yes' : 'No'}</p>
                    {requisition.internDetails.projectDescription && (
                      <p className="text-gray-400">{requisition.internDetails.projectDescription}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Candidates */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-4">
                Candidates ({candidates.length})
              </h3>
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-slate-800 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">
                        {candidate.firstName} {candidate.lastName}
                      </span>
                      <span className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded">
                        {candidate.stage.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {candidate.email} • {candidate.source}
                    </div>
                    {candidate.offerStatus && (
                      <div className="mt-2 text-xs text-emerald-400">
                        Offer: {candidate.offerStatus}
                      </div>
                    )}
                  </div>
                ))}
                {candidates.length === 0 && (
                  <p className="text-gray-500 text-sm">No candidates yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// AI WRITING ASSISTANT COMPONENT
// ===========================================

interface AIWritingAssistantProps {
  fieldName: string;
  currentValue: string;
  onApply: (text: string) => void;
  context: {
    jobTitle?: string;
    department?: string;
    employmentType?: string;
    location?: string;
  };
  placeholder?: string;
}

const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  fieldName,
  currentValue,
  onApply,
  context,
  placeholder: _placeholder
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulated AI generation (would connect to actual AI API in production)
  const generateContent = async () => {
    setIsGenerating(true);
    setShowSuggestion(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate contextual content based on field type and context
    let generated = '';
    const { jobTitle, department, employmentType } = context;

    if (fieldName === 'description') {
      if (employmentType === 'intern') {
        generated = `Join our ${department || 'team'} as a ${jobTitle || 'Summer Intern'} and gain hands-on experience in a dynamic, innovative environment. This internship offers the opportunity to work alongside industry experts, contribute to meaningful projects, and develop skills that will launch your STEM career.

You'll be immersed in real-world challenges, collaborating with cross-functional teams to deliver impactful solutions. Our structured program includes mentorship, professional development workshops, and networking opportunities with senior leaders.

This is an excellent opportunity for students passionate about ${department?.toLowerCase() || 'technology'} who want to make a difference while building a foundation for their future careers in STEM.`;
      } else {
        generated = `We're seeking a talented ${jobTitle || 'professional'} to join our ${department || 'team'}. In this role, you'll have the opportunity to make a significant impact on our organization while working with cutting-edge technologies and methodologies.

As a key member of our team, you'll collaborate with cross-functional stakeholders to deliver innovative solutions that drive business outcomes. You'll have the autonomy to shape technical decisions while being supported by a culture of continuous learning and professional growth.

We offer competitive compensation, comprehensive benefits, and a flexible work environment that supports work-life balance. Join us in our mission to advance STEM workforce development and make a meaningful difference.`;
      }
    } else if (fieldName === 'requirements') {
      if (employmentType === 'intern') {
        generated = `• Currently pursuing a Bachelor's or Master's degree in ${department === 'Engineering' ? 'Computer Science, Engineering, or related STEM field' : department || 'a relevant field'}
• Strong academic record with a minimum GPA of 3.0
• Demonstrated interest in ${department?.toLowerCase() || 'the field'} through coursework, projects, or extracurricular activities
• Excellent problem-solving and analytical skills
• Strong written and verbal communication abilities
• Ability to work collaboratively in a team environment
• Self-motivated with a desire to learn and grow
• Authorization to work in the United States for the duration of the internship`;
      } else {
        generated = `• ${employmentType === 'contract' ? '5+' : '3+'} years of experience in ${department?.toLowerCase() || 'a relevant field'}
• Bachelor's degree in ${department === 'Engineering' ? 'Computer Science, Engineering, or related field' : department || 'a relevant discipline'}; Master's preferred
• Proven track record of delivering high-quality results in a fast-paced environment
• Strong analytical and problem-solving skills
• Excellent communication and collaboration abilities
• Experience with Agile methodologies and cross-functional team collaboration
• Ability to mentor and guide junior team members
• Strong attention to detail and commitment to quality`;
      }
    } else if (fieldName === 'responsibilities') {
      if (employmentType === 'intern') {
        generated = `• Contribute to real projects under the guidance of experienced mentors
• Participate in team meetings, code reviews, and design discussions
• Research and prototype new solutions to technical challenges
• Collaborate with cross-functional teams on key initiatives
• Present project outcomes to stakeholders and leadership
• Attend professional development sessions and learning workshops
• Network with professionals across the organization
• Complete a capstone project demonstrating skills gained during the internship`;
      } else {
        generated = `• Lead the design and implementation of innovative solutions in ${department?.toLowerCase() || 'your area of expertise'}
• Collaborate with cross-functional teams to define requirements and deliver results
• Mentor junior team members and contribute to their professional growth
• Drive continuous improvement in processes and methodologies
• Communicate effectively with stakeholders at all levels
• Stay current with industry trends and emerging technologies
• Contribute to strategic planning and roadmap development
• Ensure compliance with quality standards and best practices`;
      }
    } else if (fieldName === 'benefits') {
      if (employmentType === 'intern') {
        generated = `• Competitive hourly compensation
• Structured mentorship program with senior professionals
• Professional development workshops and training sessions
• Networking opportunities with leadership and across departments
• Housing assistance or stipend (for qualifying candidates)
• Access to company amenities and employee resource groups
• Potential for full-time conversion based on performance
• Academic credit eligibility (where applicable)`;
      } else {
        generated = `• Competitive salary with annual performance bonuses
• Comprehensive health, dental, and vision insurance
• 401(k) retirement plan with company matching
• Generous PTO and paid holidays
• Flexible work arrangements including remote options
• Professional development budget and learning opportunities
• Tuition reimbursement program
• Employee wellness programs and gym membership
• Paid parental leave
• Life insurance and disability coverage`;
      }
    }

    setGeneratedText(generated);
    setIsGenerating(false);
  };

  const handleApply = () => {
    onApply(generatedText);
    setShowSuggestion(false);
    setGeneratedText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-400">{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</label>
        <button
          type="button"
          onClick={generateContent}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30 border border-violet-500/30 text-violet-300 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              AI Assist
            </>
          )}
        </button>
      </div>

      {showSuggestion && generatedText && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-violet-300">
              <Sparkles className="w-4 h-4" />
              AI Suggestion
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={generateContent}
                className="p-1.5 hover:bg-violet-500/20 rounded-lg text-violet-400 transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 hover:bg-violet-500/20 rounded-lg text-violet-400 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setShowSuggestion(false)}
                className="p-1.5 hover:bg-violet-500/20 rounded-lg text-violet-400 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
            {generatedText}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Apply Suggestion
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(currentValue ? `${currentValue}\n\n${generatedText}` : generatedText);
                setShowSuggestion(false);
              }}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Append
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ===========================================
// CREATE REQUISITION MODAL
// ===========================================

interface CreateRequisitionModalProps {
  onClose: () => void;
}

const CreateRequisitionModal: React.FC<CreateRequisitionModalProps> = ({ onClose }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [employmentType, setEmploymentType] = useState<'full-time' | 'part-time' | 'contract' | 'intern'>('full-time');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [benefits, setBenefits] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [remoteAllowed, setRemoteAllowed] = useState(false);
  const [publishImmediately, setPublishImmediately] = useState(false);

  // Internship-specific fields
  const [programDuration, setProgramDuration] = useState('');
  const [stipendAmount, setStipendAmount] = useState('');
  const [academicCredit, setAcademicCredit] = useState(true);

  const aiContext = { jobTitle, department, employmentType, location };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Create Job Requisition</h2>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                AI writing assistance available for text fields
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option>Engineering</option>
                <option>Product</option>
                <option>Design</option>
                <option>Data Science</option>
                <option>Operations</option>
                <option>Marketing</option>
                <option>Human Resources</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as typeof employmentType)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Internship</option>
              </select>
            </div>
          </div>

          {/* Description with AI Assist */}
          <AIWritingAssistant
            fieldName="description"
            currentValue={description}
            onApply={setDescription}
            context={aiContext}
          />
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role, team, and what makes this opportunity exciting..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
          />

          {/* Requirements with AI Assist */}
          <AIWritingAssistant
            fieldName="requirements"
            currentValue={requirements}
            onApply={setRequirements}
            context={aiContext}
          />
          <textarea
            rows={4}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Required qualifications, skills, and experience..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
          />

          {/* Responsibilities with AI Assist */}
          <AIWritingAssistant
            fieldName="responsibilities"
            currentValue={responsibilities}
            onApply={setResponsibilities}
            context={aiContext}
          />
          <textarea
            rows={4}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            placeholder="Key responsibilities and day-to-day activities..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
          />

          {/* Benefits with AI Assist */}
          <AIWritingAssistant
            fieldName="benefits"
            currentValue={benefits}
            onApply={setBenefits}
            context={aiContext}
          />
          <textarea
            rows={3}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Benefits, perks, and what you offer..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {employmentType === 'intern' ? 'Min Hourly Rate ($)' : 'Min Salary ($)'}
              </label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder={employmentType === 'intern' ? '35' : '100000'}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {employmentType === 'intern' ? 'Max Hourly Rate ($)' : 'Max Salary ($)'}
              </label>
              <input
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder={employmentType === 'intern' ? '50' : '150000'}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          {employmentType === 'intern' && (
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-medium text-pink-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Internship Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Program Duration</label>
                  <input
                    type="text"
                    value={programDuration}
                    onChange={(e) => setProgramDuration(e.target.value)}
                    placeholder="e.g., 12 weeks"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Stipend Amount ($)</label>
                  <input
                    type="number"
                    value={stipendAmount}
                    onChange={(e) => setStipendAmount(e.target.value)}
                    placeholder="e.g., 7500"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={academicCredit}
                    onChange={(e) => setAcademicCredit(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700"
                  />
                  Academic Credit Available
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Washington, DC"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={remoteAllowed}
                  onChange={(e) => setRemoteAllowed(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700"
                />
                Remote Work Allowed
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700"
              />
              Publish to Careers Page immediately
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert('Requisition created! (Demo mode)');
              onClose();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Create Requisition
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// EDIT REQUISITION MODAL
// ===========================================

interface EditRequisitionModalProps {
  requisition: JobRequisition;
  onClose: () => void;
  onSave: (updated: JobRequisition) => void;
}

const EditRequisitionModal: React.FC<EditRequisitionModalProps> = ({ requisition, onClose, onSave }) => {
  const [title, setTitle] = useState(requisition.title);
  const [description, setDescription] = useState(requisition.description || '');
  const [requirements, setRequirements] = useState(requisition.requirements || '');
  const [responsibilities, setResponsibilities] = useState(requisition.responsibilities || '');
  const [benefits, setBenefits] = useState(requisition.benefits || '');
  const [location, setLocation] = useState(requisition.location || '');
  const [salaryMin, setSalaryMin] = useState(requisition.salaryMin);
  const [salaryMax, setSalaryMax] = useState(requisition.salaryMax);
  const [remoteAllowed, setRemoteAllowed] = useState(requisition.remoteAllowed);
  const [employmentType, setEmploymentType] = useState(requisition.employmentType);
  const [status, setStatus] = useState(requisition.status);

  const aiContext = {
    jobTitle: title,
    department: requisition.departmentName,
    employmentType,
    location
  };

  const handleSave = () => {
    const updated: JobRequisition = {
      ...requisition,
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      location,
      salaryMin,
      salaryMax,
      remoteAllowed,
      employmentType,
      status
    };
    onSave(updated);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Edit Requisition</h2>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                AI writing assistance available
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as typeof employmentType)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RequisitionStatus)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="draft">Draft</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="open">Open</option>
                <option value="filled">Filled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Description with AI Assist */}
          <AIWritingAssistant
            fieldName="description"
            currentValue={description}
            onApply={setDescription}
            context={aiContext}
          />
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Job description..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
          />

          {/* Requirements with AI Assist */}
          <AIWritingAssistant
            fieldName="requirements"
            currentValue={requirements}
            onApply={setRequirements}
            context={aiContext}
          />
          <textarea
            rows={4}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Required qualifications..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
          />

          {/* Responsibilities with AI Assist */}
          <AIWritingAssistant
            fieldName="responsibilities"
            currentValue={responsibilities}
            onApply={setResponsibilities}
            context={aiContext}
          />
          <textarea
            rows={4}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            placeholder="Key responsibilities..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
          />

          {/* Benefits with AI Assist */}
          <AIWritingAssistant
            fieldName="benefits"
            currentValue={benefits}
            onApply={setBenefits}
            context={aiContext}
          />
          <textarea
            rows={3}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Benefits and perks..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {employmentType === 'intern' ? 'Min Hourly Rate ($)' : 'Min Salary ($)'}
              </label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {employmentType === 'intern' ? 'Max Hourly Rate ($)' : 'Max Salary ($)'}
              </label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={remoteAllowed}
                  onChange={(e) => setRemoteAllowed(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700"
                />
                Remote Work Allowed
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HiringSection;
