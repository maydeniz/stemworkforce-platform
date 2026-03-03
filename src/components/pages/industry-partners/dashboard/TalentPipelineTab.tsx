// ===========================================
// Talent Pipeline Tab - Industry Partner Dashboard
// Candidate tracking and pipeline management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  ChevronRight,
  Mail,
  Phone,
  Linkedin,
  FileText,
  Star,
  Clock,
  Building2,
  GraduationCap,
  Loader2,
  MessageSquare
} from 'lucide-react';
import {
  getCandidates,
  updateCandidateStage,
  addCandidateNote
} from '@/services/industryPartnerApi';
import type { Candidate, CandidateStage, CandidateSource, PartnerTier } from '@/types/industryPartner';
import WorkforceMapWidget from '@/components/shared/WorkforceMapWidget';

// ===========================================
// TYPES
// ===========================================

interface TalentPipelineTabProps {
  partnerId: string;
  tier: PartnerTier;
}

// ===========================================
// CONSTANTS
// ===========================================

const STAGES: { value: CandidateStage; label: string; color: string; badgeClass: string }[] = [
  { value: 'new', label: 'New', color: 'bg-gray-500', badgeClass: 'bg-gray-500/20 text-gray-400' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-blue-500', badgeClass: 'bg-blue-500/20 text-blue-400' },
  { value: 'screened', label: 'Screened', color: 'bg-cyan-500', badgeClass: 'bg-cyan-500/20 text-cyan-400' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-purple-500', badgeClass: 'bg-purple-500/20 text-purple-400' },
  { value: 'offered', label: 'Offered', color: 'bg-amber-500', badgeClass: 'bg-amber-500/20 text-amber-400' },
  { value: 'hired', label: 'Hired', color: 'bg-emerald-500', badgeClass: 'bg-emerald-500/20 text-emerald-400' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500', badgeClass: 'bg-red-500/20 text-red-400' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-600', badgeClass: 'bg-gray-600/20 text-gray-400' }
];

const SOURCES: { value: CandidateSource; label: string }[] = [
  { value: 'platform', label: 'Platform' },
  { value: 'career_fair', label: 'Career Fair' },
  { value: 'university', label: 'University' },
  { value: 'referral', label: 'Referral' },
  { value: 'direct', label: 'Direct' },
  { value: 'other', label: 'Other' }
];

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_CANDIDATES: Candidate[] = [
  {
    id: '1',
    partnerId: 'demo',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@email.com',
    phone: '555-123-4567',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    education: [{ institution: 'MIT', degree: 'MS', fieldOfStudy: 'Computer Science', graduationYear: 2024 }],
    currentTitle: 'Software Engineer',
    currentCompany: 'TechCorp',
    yearsOfExperience: 3,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'AWS'],
    stage: 'interviewing',
    source: 'platform',
    fitScore: 92,
    tags: ['AI/ML', 'High Priority'],
    appliedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: 'demo',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@email.com',
    education: [{ institution: 'Stanford', degree: 'BS', fieldOfStudy: 'Electrical Engineering', graduationYear: 2023 }],
    yearsOfExperience: 1,
    skills: ['FPGA', 'Verilog', 'SystemVerilog', 'Chip Design'],
    stage: 'screened',
    source: 'career_fair',
    fitScore: 87,
    tags: ['Hardware'],
    appliedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    partnerId: 'demo',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.r@email.com',
    education: [{ institution: 'Georgia Tech', degree: 'MS', fieldOfStudy: 'Cybersecurity', graduationYear: 2024 }],
    yearsOfExperience: 5,
    skills: ['Penetration Testing', 'SOC', 'SIEM', 'Compliance'],
    stage: 'offered',
    source: 'referral',
    fitScore: 95,
    tags: ['Security', 'Clearance Eligible'],
    appliedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const TalentPipelineTab: React.FC<TalentPipelineTabProps> = ({ partnerId, tier: _tier }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, [partnerId]);

  const loadCandidates = async () => {
    setLoading(true);
    const data = await getCandidates(partnerId);
    setCandidates(data.length > 0 ? data : SAMPLE_CANDIDATES);
    setLoading(false);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch =
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = stageFilter === 'all' || c.stage === stageFilter;
    const matchesSource = sourceFilter === 'all' || c.source === sourceFilter;
    return matchesSearch && matchesStage && matchesSource;
  });

  // Stage counts
  const stageCounts = STAGES.map(s => ({
    ...s,
    count: candidates.filter(c => c.stage === s.value).length
  }));

  const handleStageChange = async (candidateId: string, newStage: CandidateStage) => {
    const success = await updateCandidateStage(candidateId, newStage, 'current-user');
    if (success) {
      setCandidates(prev =>
        prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c)
      );
    }
  };

  const handleAddNote = async () => {
    if (!selectedCandidate || !noteText.trim()) return;

    setSavingNote(true);
    const success = await addCandidateNote(selectedCandidate.id, noteText, 'current-user');
    if (success) {
      setNoteText('');
      await loadCandidates();
    }
    setSavingNote(false);
  };

  const getStageInfo = (stage: CandidateStage) => STAGES.find(s => s.value === stage) || STAGES[0];
  const getSourceLabel = (source: CandidateSource) => SOURCES.find(s => s.value === source)?.label || source;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Talent Pipeline</h2>
          <p className="text-gray-400">{candidates.length} candidates in your pipeline</p>
        </div>
      </div>

      {/* Stage Summary */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {stageCounts.filter(s => !['rejected', 'withdrawn'].includes(s.value)).map((stage) => (
          <button
            key={stage.value}
            onClick={() => setStageFilter(stageFilter === stage.value ? 'all' : stage.value)}
            className={`p-3 rounded-lg text-center transition-colors ${
              stageFilter === stage.value
                ? 'bg-emerald-500/20 border border-emerald-500'
                : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className={`w-3 h-3 ${stage.color} rounded-full mx-auto mb-1`} />
            <div className="text-lg font-bold text-white">{stage.count}</div>
            <div className="text-xs text-gray-400">{stage.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates by name, email, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Stages</option>
          {STAGES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Sources</option>
          {SOURCES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Two Column Layout: Candidates + Map Widget */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Candidate List */}
        <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => {
          const stageInfo = getStageInfo(candidate.stage);
          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-medium">
                    {candidate.firstName[0]}{candidate.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{candidate.firstName} {candidate.lastName}</h3>
                    <p className="text-sm text-gray-400">{candidate.currentTitle || 'Candidate'}</p>
                  </div>
                </div>
                {candidate.fitScore && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded text-emerald-400 text-sm">
                    <Star className="w-3 h-3" />
                    {candidate.fitScore}%
                  </div>
                )}
              </div>

              {candidate.education[0] && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <GraduationCap className="w-4 h-4" />
                  {candidate.education[0].institution} • {candidate.education[0].degree} {candidate.education[0].fieldOfStudy}
                </div>
              )}

              {candidate.currentCompany && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Building2 className="w-4 h-4" />
                  {candidate.currentCompany}
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                {candidate.skills.slice(0, 4).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                    +{candidate.skills.length - 4}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 ${stageInfo.badgeClass} rounded text-xs`}
                  >
                    {stageInfo.label}
                  </span>
                  <span className="text-xs text-gray-500">{getSourceLabel(candidate.source)}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
          );
        })}

          {filteredCandidates.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No candidates found matching your filters</p>
            </div>
          )}
        </div>

        {/* Talent Map Sidebar */}
        <div className="lg:col-span-1">
          <WorkforceMapWidget
            variant="mini"
            onStateSelect={(state) => console.log('Filter by state:', state.abbreviation)}
          />
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-medium text-lg">
                  {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </h3>
                  <p className="text-gray-400">{selectedCandidate.currentTitle || 'Candidate'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedCandidate.email}`}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {selectedCandidate.email}
                </a>
                {selectedCandidate.phone && (
                  <a
                    href={`tel:${selectedCandidate.phone}`}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {selectedCandidate.phone}
                  </a>
                )}
                {selectedCandidate.linkedinUrl && (
                  <a
                    href={selectedCandidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {selectedCandidate.resumeUrl && (
                  <a
                    href={selectedCandidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume
                  </a>
                )}
              </div>

              {/* Stage Actions */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Pipeline Stage</h4>
                <div className="flex flex-wrap gap-2">
                  {STAGES.filter(s => !['rejected', 'withdrawn'].includes(s.value)).map((stage) => (
                    <button
                      key={stage.value}
                      onClick={() => handleStageChange(selectedCandidate.id, stage.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedCandidate.stage === stage.value
                          ? `${stage.color} text-white`
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              {selectedCandidate.education.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Education</h4>
                  <div className="space-y-2">
                    {selectedCandidate.education.map((edu, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="text-white">{edu.institution}</p>
                          <p className="text-sm text-gray-400">{edu.degree} in {edu.fieldOfStudy} • {edu.graduationYear}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedCandidate.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Notes</h4>
                {selectedCandidate.notes && (
                  <div className="p-3 bg-gray-800/50 rounded-lg text-gray-300 text-sm mb-3 whitespace-pre-wrap">
                    {selectedCandidate.notes}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={savingNote || !noteText.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-800">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Applied {new Date(selectedCandidate.appliedAt).toLocaleDateString()}
                </span>
                <span>Source: {getSourceLabel(selectedCandidate.source)}</span>
                {selectedCandidate.fitScore && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Star className="w-4 h-4" />
                    {selectedCandidate.fitScore}% match
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TalentPipelineTab;
