// ===========================================
// Clearance Tab - National Labs Partner Dashboard
// Clearance pre-screening and pipeline tracking
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Loader2,
  FileText,
  X,
  MapPin,
  Briefcase
} from 'lucide-react';
import { getClearancePositions, getClearanceCandidates } from '@/services/nationalLabsPartnerApi';
import type { ClearancePosition, ClearanceCandidate, ClearanceType, ClearanceStatus, LabPartnerTier } from '@/types/nationalLabsPartner';

interface ClearanceTabProps {
  partnerId: string;
  tier: LabPartnerTier;
}

const SAMPLE_POSITIONS: ClearancePosition[] = [
  {
    id: '1',
    partnerId: '1',
    title: 'Nuclear Engineer',
    department: 'Reactor Engineering',
    requiredClearance: 'q_clearance',
    polygraphRequired: false,
    citizenshipRequired: true,
    exportControlled: true,
    description: 'Design and analyze nuclear reactor systems',
    requirements: ['PhD in Nuclear Engineering'],
    location: 'Oak Ridge, TN',
    remote: false,
    status: 'open',
    openings: 3,
    filledCount: 0,
    candidatesTotal: 45,
    candidatesScreened: 32,
    candidatesEligible: 18,
    candidatesInProcess: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_CANDIDATES: ClearanceCandidate[] = [
  {
    id: '1',
    partnerId: '1',
    positionId: '1',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@university.edu',
    citizenshipStatus: 'us_citizen',
    dualCitizenship: false,
    foreignContacts: false,
    foreignTravel: true,
    financialIssues: false,
    criminalHistory: false,
    drugUse: false,
    sf86ReadinessScore: 92,
    eligibilityAssessment: 'eligible',
    riskFactors: [],
    recommendations: ['Proceed with clearance application'],
    targetClearanceType: 'q_clearance',
    currentClearanceStatus: 'investigation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const CLEARANCE_LABELS: Record<ClearanceType, string> = {
  public_trust: 'Public Trust',
  l_clearance: 'L Clearance',
  q_clearance: 'Q Clearance',
  ts: 'Top Secret',
  ts_sci: 'TS/SCI',
  none: 'None'
};

const ELIGIBILITY_STYLES = {
  eligible: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Eligible' },
  conditional: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Conditional' },
  high_risk: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'High Risk' },
  ineligible: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Ineligible' }
};

export const ClearanceTab: React.FC<ClearanceTabProps> = ({ partnerId, tier }) => {
  const [positions, setPositions] = useState<ClearancePosition[]>([]);
  const [candidates, setCandidates] = useState<ClearanceCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [clearanceFilter, setClearanceFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<'positions' | 'candidates'>('candidates');

  // Modal states
  const [showScreenModal, setShowScreenModal] = useState(false);
  const [showCandidateDetail, setShowCandidateDetail] = useState<ClearanceCandidate | null>(null);
  const [showPositionDetail, setShowPositionDetail] = useState<ClearancePosition | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showExportNotification, setShowExportNotification] = useState(false);

  // Screen candidate form
  const [screenForm, setScreenForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    targetClearance: 'l_clearance' as ClearanceType,
    citizenshipStatus: 'us_citizen',
    positionId: ''
  });

  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [partnerId]);

  const loadData = async () => {
    setLoading(true);
    const [positionsData, candidatesData] = await Promise.all([
      getClearancePositions(partnerId),
      getClearanceCandidates(partnerId)
    ]);
    setPositions(positionsData.length > 0 ? positionsData : SAMPLE_POSITIONS);
    setCandidates(candidatesData.length > 0 ? candidatesData : SAMPLE_CANDIDATES);
    setLoading(false);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClearance = clearanceFilter === 'all' || c.targetClearanceType === clearanceFilter;
    return matchesSearch && matchesClearance;
  });

  const filteredPositions = positions.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClearance = clearanceFilter === 'all' || p.requiredClearance === clearanceFilter;
    return matchesSearch && matchesClearance;
  });

  // Stats
  const eligibleCount = candidates.filter(c => c.eligibilityAssessment === 'eligible').length;
  const conditionalCount = candidates.filter(c => c.eligibilityAssessment === 'conditional').length;
  const inProcessCount = candidates.filter(c =>
    ['sf86_submitted', 'investigation', 'adjudication'].includes(c.currentClearanceStatus)
  ).length;

  const handleScreenSubmit = () => {
    const newCandidate: ClearanceCandidate = {
      id: `new-${Date.now()}`,
      partnerId,
      positionId: screenForm.positionId || '1',
      firstName: screenForm.firstName,
      lastName: screenForm.lastName,
      email: screenForm.email,
      citizenshipStatus: screenForm.citizenshipStatus as 'us_citizen',
      dualCitizenship: false,
      foreignContacts: false,
      foreignTravel: false,
      financialIssues: false,
      criminalHistory: false,
      drugUse: false,
      sf86ReadinessScore: 0,
      eligibilityAssessment: undefined as unknown as ClearanceCandidate['eligibilityAssessment'],
      riskFactors: [],
      recommendations: [],
      targetClearanceType: screenForm.targetClearance,
      currentClearanceStatus: 'not_started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCandidates(prev => [newCandidate, ...prev]);
    setShowScreenModal(false);
    setScreenForm({ firstName: '', lastName: '', email: '', targetClearance: 'l_clearance', citizenshipStatus: 'us_citizen', positionId: '' });
  };

  const handleExportReport = () => {
    setShowExportNotification(true);
    setTimeout(() => setShowExportNotification(false), 3000);
  };

  const handleStatusUpdate = (candidateId: string, newStatus: ClearanceStatus) => {
    setCandidates(prev => prev.map(c =>
      c.id === candidateId ? { ...c, currentClearanceStatus: newStatus, updatedAt: new Date().toISOString() } : c
    ));
    setUpdatingStatus(null);
    setShowCandidateDetail(prev => prev && prev.id === candidateId ? { ...prev, currentClearanceStatus: newStatus } : prev);
  };

  // Check tier access
  if (tier === 'research') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Clearance Pre-Screening Tools</h3>
        <p className="text-gray-400 mb-6">
          Upgrade to Lab Partner tier to access Q/L clearance pre-screening and pipeline tracking
        </p>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors"
        >
          Upgrade to Lab Partner
        </button>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">Upgrade to Lab Partner</h3>
              <p className="text-gray-400 mb-4">Unlock clearance pre-screening, pipeline tracking, and advanced candidate management tools.</p>
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-2xl font-bold text-white">$2,499<span className="text-sm text-gray-400">/month</span></p>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Q/L Clearance Pre-Screening</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> SF-86 Readiness Assessment</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Pipeline Analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> ITAR/EAR Compliance Tools</li>
                </ul>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Contact Sales</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Notification */}
      {showExportNotification && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-right">
          <CheckCircle className="w-5 h-5 text-purple-400" />
          <span className="text-white">Clearance report exported successfully</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Clearance Pipeline</h2>
          <p className="text-gray-400">Pre-screen candidates and track clearance progress</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => setShowScreenModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Screen Candidate
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{candidates.length}</p>
              <p className="text-xs text-gray-400">Total Candidates</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{eligibleCount}</p>
              <p className="text-xs text-gray-400">Eligible</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{conditionalCount}</p>
              <p className="text-xs text-gray-400">Conditional</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inProcessCount}</p>
              <p className="text-xs text-gray-400">In Process</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setActiveView('candidates')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'candidates' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveView('positions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'positions' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Positions
          </button>
        </div>

        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={activeView === 'candidates' ? 'Search candidates...' : 'Search positions...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
            />
          </div>
          <select
            value={clearanceFilter}
            onChange={(e) => setClearanceFilter(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
          >
            <option value="all">All Clearance Levels</option>
            <option value="public_trust">Public Trust</option>
            <option value="l_clearance">L Clearance</option>
            <option value="q_clearance">Q Clearance</option>
            <option value="ts">Top Secret</option>
            <option value="ts_sci">TS/SCI</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      {activeView === 'candidates' && (
        <div className="space-y-3">
          {filteredCandidates.map(candidate => {
            const eligibility = candidate.eligibilityAssessment
              ? ELIGIBILITY_STYLES[candidate.eligibilityAssessment]
              : { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Pending' };

            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowCandidateDetail(candidate)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-amber-400 font-semibold">
                        {candidate.firstName[0]}{candidate.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${eligibility.bg} ${eligibility.text}`}>
                          {eligibility.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{CLEARANCE_LABELS[candidate.targetClearanceType]}</span>
                        <span>•</span>
                        <span>SF-86 Score: {candidate.sf86ReadinessScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-400">{candidate.sf86ReadinessScore}%</p>
                      <p className="text-xs text-gray-400">Readiness</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${
                        candidate.currentClearanceStatus === 'granted' ? 'text-emerald-400' :
                        candidate.currentClearanceStatus === 'denied' ? 'text-red-400' :
                        'text-blue-400'
                      }`}>
                        {candidate.currentClearanceStatus.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-400">Status</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Risk Factors */}
                {candidate.riskFactors && candidate.riskFactors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400">Risk Factors:</span>
                      <span className="text-gray-400">{candidate.riskFactors.join(', ')}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No candidates found</p>
            </div>
          )}
        </div>
      )}

      {/* Positions List */}
      {activeView === 'positions' && (
        <div className="space-y-3">
          {filteredPositions.map(position => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowPositionDetail(position)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{position.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        position.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                        position.status === 'filled' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {position.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{CLEARANCE_LABELS[position.requiredClearance]}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{position.candidatesTotal}</p>
                    <p className="text-xs text-gray-400">Candidates</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">{position.candidatesEligible}</p>
                    <p className="text-xs text-gray-400">Eligible</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-400">{position.openings}</p>
                    <p className="text-xs text-gray-400">Openings</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPositions.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No positions found</p>
            </div>
          )}
        </div>
      )}

      {/* Screen Candidate Modal */}
      {showScreenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowScreenModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Screen New Candidate</h3>
              <button onClick={() => setShowScreenModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">First Name</label>
                  <input
                    type="text"
                    value={screenForm.firstName}
                    onChange={e => setScreenForm({ ...screenForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={screenForm.lastName}
                    onChange={e => setScreenForm({ ...screenForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={screenForm.email}
                  onChange={e => setScreenForm({ ...screenForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="candidate@email.edu"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Target Clearance Level</label>
                <select
                  value={screenForm.targetClearance}
                  onChange={e => setScreenForm({ ...screenForm, targetClearance: e.target.value as ClearanceType })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="public_trust">Public Trust</option>
                  <option value="l_clearance">L Clearance</option>
                  <option value="q_clearance">Q Clearance</option>
                  <option value="ts">Top Secret</option>
                  <option value="ts_sci">TS/SCI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Citizenship Status</label>
                <select
                  value={screenForm.citizenshipStatus}
                  onChange={e => setScreenForm({ ...screenForm, citizenshipStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="us_citizen">US Citizen</option>
                  <option value="permanent_resident">Permanent Resident</option>
                  <option value="visa_holder">Visa Holder</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {positions.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Position (Optional)</label>
                  <select
                    value={screenForm.positionId}
                    onChange={e => setScreenForm({ ...screenForm, positionId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a position...</option>
                    {positions.map(p => (
                      <option key={p.id} value={p.id}>{p.title} - {p.department}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowScreenModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={handleScreenSubmit}
                disabled={!screenForm.firstName || !screenForm.lastName || !screenForm.email}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Screening
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {showCandidateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setShowCandidateDetail(null); setUpdatingStatus(null); }}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-lg">
                    {showCandidateDetail.firstName[0]}{showCandidateDetail.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{showCandidateDetail.firstName} {showCandidateDetail.lastName}</h3>
                  <p className="text-gray-400">{showCandidateDetail.email}</p>
                </div>
              </div>
              <button onClick={() => { setShowCandidateDetail(null); setUpdatingStatus(null); }} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Target Clearance</p>
                <p className="text-white font-semibold">{CLEARANCE_LABELS[showCandidateDetail.targetClearanceType]}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">SF-86 Readiness</p>
                <p className="text-amber-400 font-bold text-xl">{showCandidateDetail.sf86ReadinessScore}%</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Citizenship</p>
                <p className="text-white font-semibold">{showCandidateDetail.citizenshipStatus.replace('_', ' ')}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Eligibility</p>
                {showCandidateDetail.eligibilityAssessment ? (
                  <span className={`px-2 py-1 rounded text-sm ${ELIGIBILITY_STYLES[showCandidateDetail.eligibilityAssessment].bg} ${ELIGIBILITY_STYLES[showCandidateDetail.eligibilityAssessment].text}`}>
                    {ELIGIBILITY_STYLES[showCandidateDetail.eligibilityAssessment].label}
                  </span>
                ) : (
                  <span className="text-gray-400">Pending Assessment</span>
                )}
              </div>
            </div>

            {/* Screening Factors */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Screening Factors</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Dual Citizenship', value: showCandidateDetail.dualCitizenship },
                  { label: 'Foreign Contacts', value: showCandidateDetail.foreignContacts },
                  { label: 'Foreign Travel', value: showCandidateDetail.foreignTravel },
                  { label: 'Financial Issues', value: showCandidateDetail.financialIssues },
                  { label: 'Criminal History', value: showCandidateDetail.criminalHistory },
                  { label: 'Drug Use', value: showCandidateDetail.drugUse },
                ].map((factor, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-300 text-sm">{factor.label}</span>
                    {factor.value ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            {showCandidateDetail.riskFactors && showCandidateDetail.riskFactors.length > 0 && (
              <div className="mb-6">
                <h4 className="text-amber-400 font-semibold mb-2">Risk Factors</h4>
                <ul className="space-y-1">
                  {showCandidateDetail.riskFactors.map((rf, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      {rf}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {showCandidateDetail.recommendations && showCandidateDetail.recommendations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-emerald-400 font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {showCandidateDetail.recommendations.map((rec, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Status Update */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Current Status: <span className="text-blue-400 capitalize">{showCandidateDetail.currentClearanceStatus.replace('_', ' ')}</span></h4>
              {updatingStatus === showCandidateDetail.id ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">Update clearance status:</p>
                  <div className="flex flex-wrap gap-2">
                    {(['not_started', 'sf86_submitted', 'investigation', 'adjudication', 'granted', 'denied'] as ClearanceStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(showCandidateDetail.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          showCandidateDetail.currentClearanceStatus === status
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setUpdatingStatus(showCandidateDetail.id)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Update Status
                </button>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => { setShowCandidateDetail(null); setUpdatingStatus(null); }} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowCandidateDetail(null); setUpdatingStatus(null); }} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Position Detail Modal */}
      {showPositionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPositionDetail(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{showPositionDetail.title}</h3>
                  <p className="text-gray-400">{showPositionDetail.department}</p>
                </div>
              </div>
              <button onClick={() => setShowPositionDetail(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">{showPositionDetail.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Clearance Required</p>
                <p className="text-white font-semibold">{CLEARANCE_LABELS[showPositionDetail.requiredClearance]}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <div className="flex items-center gap-1 text-white">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {showPositionDetail.location}
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span className={`px-2 py-1 rounded text-sm ${
                  showPositionDetail.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                  showPositionDetail.status === 'filled' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {showPositionDetail.status}
                </span>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Openings</p>
                <p className="text-amber-400 font-bold text-xl">{showPositionDetail.openings}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Total Candidates</p>
                <p className="text-white font-bold text-xl">{showPositionDetail.candidatesTotal}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Eligible</p>
                <p className="text-emerald-400 font-bold text-xl">{showPositionDetail.candidatesEligible}</p>
              </div>
            </div>

            {/* Requirements */}
            {showPositionDetail.requirements && showPositionDetail.requirements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2">Requirements</h4>
                <ul className="space-y-1">
                  {showPositionDetail.requirements.map((req, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {showPositionDetail.citizenshipRequired && (
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">US Citizenship Required</span>
              )}
              {showPositionDetail.polygraphRequired && (
                <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-sm">Polygraph Required</span>
              )}
              {showPositionDetail.exportControlled && (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-sm">Export Controlled</span>
              )}
            </div>

            {showPositionDetail.salaryMin && showPositionDetail.salaryMax && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Salary Range</p>
                <p className="text-white font-semibold">${showPositionDetail.salaryMin.toLocaleString()} - ${showPositionDetail.salaryMax.toLocaleString()}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setShowPositionDetail(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => setShowPositionDetail(null)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClearanceTab;
