// ===========================================
// Employer Dashboard - Talent Pipeline Tab
// Kanban-style candidate tracking
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Star, Shield, Mail, Calendar, MapPin, GraduationCap, Briefcase, ChevronRight, Eye, ChevronDown, X, Phone, FileText } from 'lucide-react';

const PIPELINE_STAGES = [
  { key: 'new', label: 'New', count: 456, color: 'bg-gray-500' },
  { key: 'screening', label: 'Screening', count: 234, color: 'bg-blue-500' },
  { key: 'interview', label: 'Interview', count: 156, color: 'bg-purple-500' },
  { key: 'offered', label: 'Offered', count: 45, color: 'bg-amber-500' },
  { key: 'hired', label: 'Hired', count: 89, color: 'bg-emerald-500' },
];

const CANDIDATES = [
  { id: 1, name: 'Dr. Sarah Kim', role: 'Senior AI/ML Engineer', university: 'MIT', degree: 'PhD Computer Science', gpa: 3.9, experience: '5 years', skills: ['PyTorch', 'LLMs', 'Computer Vision', 'MLOps'], stage: 'interview', match: 97, clearance: 'None', location: 'San Francisco, CA', appliedDate: '2025-02-18', email: 's.kim@mit.edu', phone: '(415) 555-0142' },
  { id: 2, name: 'James Rodriguez', role: 'Cybersecurity Analyst', university: 'Georgia Tech', degree: 'MS Cybersecurity', gpa: 3.7, experience: '3 years', skills: ['SIEM', 'Penetration Testing', 'Zero Trust', 'IR'], stage: 'offered', match: 94, clearance: 'Secret', location: 'Arlington, VA', appliedDate: '2025-02-10', email: 'j.rodriguez@gatech.edu', phone: '(703) 555-0198' },
  { id: 3, name: 'Emily Chen', role: 'Quantum Researcher', university: 'Caltech', degree: 'PhD Physics', gpa: 3.95, experience: '2 years', skills: ['Qiskit', 'Error Correction', 'Python', 'Cryogenics'], stage: 'screening', match: 92, clearance: 'None', location: 'Boulder, CO', appliedDate: '2025-02-22', email: 'e.chen@caltech.edu', phone: '(303) 555-0167' },
  { id: 4, name: 'Michael Okafor', role: 'Nuclear Engineer', university: 'Penn State', degree: 'MS Nuclear Engineering', gpa: 3.8, experience: '7 years', skills: ['Reactor Design', 'MCNP', 'Safety Analysis', 'NRC Regs'], stage: 'interview', match: 91, clearance: 'L Clearance', location: 'Idaho Falls, ID', appliedDate: '2025-02-05', email: 'm.okafor@psu.edu', phone: '(208) 555-0134' },
  { id: 5, name: 'Priya Patel', role: 'Semiconductor Engineer', university: 'Stanford', degree: 'MS EE', gpa: 3.85, experience: '4 years', skills: ['VLSI', 'Process Dev', 'Cleanroom', 'Photolithography'], stage: 'new', match: 89, clearance: 'None', location: 'Austin, TX', appliedDate: '2025-02-25', email: 'p.patel@stanford.edu', phone: '(512) 555-0156' },
  { id: 6, name: 'David Washington', role: 'Aerospace Systems Engineer', university: 'Purdue', degree: 'MS Aerospace', gpa: 3.6, experience: '6 years', skills: ['Systems Engineering', 'MBSE', 'Flight Dynamics'], stage: 'interview', match: 88, clearance: 'Top Secret', location: 'Huntsville, AL', appliedDate: '2025-02-12', email: 'd.washington@purdue.edu', phone: '(256) 555-0123' },
  { id: 7, name: 'Ana Martinez', role: 'Data Scientist', university: 'UC Berkeley', degree: 'MS Data Science', gpa: 3.75, experience: '2 years', skills: ['Python', 'TensorFlow', 'SQL', 'Spark'], stage: 'screening', match: 86, clearance: 'None', location: 'Remote', appliedDate: '2025-02-20', email: 'a.martinez@berkeley.edu', phone: '(510) 555-0189' },
  { id: 8, name: 'Robert Thompson', role: 'Robotics Engineer', university: 'CMU', degree: 'MS Robotics', gpa: 3.7, experience: '4 years', skills: ['ROS', 'C++', 'Computer Vision', 'Motion Planning'], stage: 'hired', match: 93, clearance: 'None', location: 'Pittsburgh, PA', appliedDate: '2025-01-15', email: 'r.thompson@cmu.edu', phone: '(412) 555-0145' },
];

const NEXT_STAGE: Record<string, string> = {
  new: 'screening',
  screening: 'interview',
  interview: 'offered',
  offered: 'hired',
};

const TalentPipelineTab: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewCandidate, setViewCandidate] = useState<typeof CANDIDATES[0] | null>(null);
  const [advanceCandidate, setAdvanceCandidate] = useState<typeof CANDIDATES[0] | null>(null);
  const [showToast, setShowToast] = useState('');
  const [filterClearance, setFilterClearance] = useState('all');
  const [filterMinMatch, setFilterMinMatch] = useState(0);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2500);
  };

  const filtered = CANDIDATES.filter(c => {
    if (selectedStage !== 'all' && c.stage !== selectedStage) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.role.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterClearance !== 'all' && c.clearance === 'None' && filterClearance === 'cleared') return false;
    if (filterClearance !== 'all' && c.clearance !== 'None' && filterClearance === 'uncleared') return false;
    if (filterMinMatch > 0 && c.match < filterMinMatch) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {showToast}
        </div>
      )}

      {/* Pipeline Stage Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Pipeline Overview</h3>
        <div className="flex items-center gap-1 mb-3">
          {PIPELINE_STAGES.map((stage) => {
            const total = PIPELINE_STAGES.reduce((s, st) => s + st.count, 0);
            const width = Math.max((stage.count / total) * 100, 5);
            return (
              <div
                key={stage.key}
                className={`${stage.color} h-3 rounded-full transition-all cursor-pointer hover:opacity-80`}
                style={{ width: `${width}%` }}
                onClick={() => setSelectedStage(stage.key === selectedStage ? 'all' : stage.key)}
                title={`${stage.label}: ${stage.count}`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedStage('all')}
            className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${selectedStage === 'all' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            All ({PIPELINE_STAGES.reduce((s, st) => s + st.count, 0)})
          </button>
          {PIPELINE_STAGES.map((stage) => (
            <button
              key={stage.key}
              onClick={() => setSelectedStage(stage.key === selectedStage ? 'all' : stage.key)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5 ${
                selectedStage === stage.key ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${stage.color}`} />
              {stage.label} ({stage.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search candidates by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`bg-gray-900 border rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${showFilters ? 'border-emerald-500/50 text-emerald-400' : 'border-gray-800 text-gray-400 hover:text-white'}`}>
          <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-6">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Clearance Status</label>
              <select value={filterClearance} onChange={e => setFilterClearance(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                <option value="all">All</option>
                <option value="cleared">Has Clearance</option>
                <option value="uncleared">No Clearance</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Min Match Score</label>
              <select value={filterMinMatch} onChange={e => setFilterMinMatch(Number(e.target.value))} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                <option value={0}>Any</option>
                <option value={85}>85%+</option>
                <option value={90}>90%+</option>
                <option value={95}>95%+</option>
              </select>
            </div>
            <button onClick={() => { setFilterClearance('all'); setFilterMinMatch(0); }} className="text-xs text-gray-400 hover:text-white mt-4 transition-colors">Reset Filters</button>
          </div>
        </motion.div>
      )}

      {/* Candidate Cards */}
      <div className="space-y-3">
        {filtered.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => setViewCandidate(candidate)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold">{candidate.name}</h4>
                    <div className="text-emerald-400 text-sm font-bold">{candidate.match}% match</div>
                    {candidate.clearance !== 'None' && (
                      <span className="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" /> {candidate.clearance}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm mt-0.5">{candidate.role}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {candidate.university} &middot; {candidate.degree}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {candidate.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {candidate.experience}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {candidate.skills.map((skill) => (
                      <span key={skill} className="text-[10px] font-medium bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  candidate.stage === 'hired' ? 'bg-emerald-500/20 text-emerald-400' :
                  candidate.stage === 'offered' ? 'bg-amber-500/20 text-amber-400' :
                  candidate.stage === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                  candidate.stage === 'screening' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                </span>
                <button onClick={() => setViewCandidate(candidate)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="View Profile">
                  <Eye className="w-4 h-4" />
                </button>
                {candidate.stage !== 'hired' && (
                  <button onClick={() => setAdvanceCandidate(candidate)} className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Advance to next stage">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Candidate Detail Modal */}
      {viewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewCandidate(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {viewCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{viewCandidate.name}</h3>
                  <p className="text-gray-400">{viewCandidate.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-emerald-400 font-bold text-lg">{viewCandidate.match}%</span>
                    <span className="text-gray-500 text-sm">match score</span>
                    {viewCandidate.clearance !== 'None' && (
                      <span className="text-xs font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" /> {viewCandidate.clearance}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewCandidate(null)} className="text-gray-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Education</div>
                <div className="text-white font-medium text-sm mt-1">{viewCandidate.degree}</div>
                <div className="text-gray-400 text-xs">{viewCandidate.university} &middot; GPA: {viewCandidate.gpa}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs flex items-center gap-1"><Briefcase className="w-3 h-3" /> Experience</div>
                <div className="text-white font-medium text-sm mt-1">{viewCandidate.experience}</div>
                <div className="text-gray-400 text-xs">{viewCandidate.location}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> Email</div>
                <div className="text-white font-medium text-sm mt-1">{viewCandidate.email}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</div>
                <div className="text-white font-medium text-sm mt-1">{viewCandidate.phone}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-xs mb-2">Skills</div>
              <div className="flex flex-wrap gap-2">
                {viewCandidate.skills.map(skill => (
                  <span key={skill} className="text-xs font-medium bg-gray-800 text-gray-300 px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-xs mb-2">Pipeline Stage</div>
              <div className="flex items-center gap-2">
                {PIPELINE_STAGES.map((stage, i) => {
                  const isCurrentOrBefore = PIPELINE_STAGES.findIndex(s => s.key === viewCandidate.stage) >= i;
                  return (
                    <React.Fragment key={stage.key}>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${isCurrentOrBefore ? `${stage.color} text-white` : 'bg-gray-800 text-gray-500'}`}>
                        {stage.label}
                      </div>
                      {i < PIPELINE_STAGES.length - 1 && <ChevronRight className={`w-3 h-3 ${isCurrentOrBefore ? 'text-gray-300' : 'text-gray-700'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
              <Calendar className="w-3 h-3" /> Applied: {viewCandidate.appliedDate}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setViewCandidate(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              <button onClick={() => { triggerToast('Email sent to ' + viewCandidate.name); setViewCandidate(null); }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"><Mail className="w-4 h-4" /> Send Email</button>
              {viewCandidate.stage !== 'hired' && (
                <button onClick={() => { setViewCandidate(null); setAdvanceCandidate(viewCandidate); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Advance Stage</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advance Candidate Confirmation Modal */}
      {advanceCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setAdvanceCandidate(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Advance Candidate?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Move <span className="text-white font-medium">{advanceCandidate.name}</span> from{' '}
              <span className="text-blue-400">{advanceCandidate.stage.charAt(0).toUpperCase() + advanceCandidate.stage.slice(1)}</span> to{' '}
              <span className="text-emerald-400">{NEXT_STAGE[advanceCandidate.stage] ? NEXT_STAGE[advanceCandidate.stage].charAt(0).toUpperCase() + NEXT_STAGE[advanceCandidate.stage].slice(1) : 'Next Stage'}</span>?
            </p>
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
              <div className="text-white font-medium text-sm">{advanceCandidate.name}</div>
              <div className="text-gray-400 text-xs mt-1">{advanceCandidate.role} &middot; {advanceCandidate.university} &middot; {advanceCandidate.match}% match</div>
            </div>
            {NEXT_STAGE[advanceCandidate.stage] === 'offered' && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                <div className="text-amber-400 text-xs font-medium">This will trigger an offer letter workflow</div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={() => setAdvanceCandidate(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setAdvanceCandidate(null); triggerToast(`${advanceCandidate.name} advanced to ${NEXT_STAGE[advanceCandidate.stage] || 'next stage'}!`); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Confirm Advance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentPipelineTab;
