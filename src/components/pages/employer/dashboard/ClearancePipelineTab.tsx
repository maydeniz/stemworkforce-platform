// ===========================================
// Employer Dashboard - Clearance Pipeline Tab
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Clock, CheckCircle, AlertTriangle, FileText, ChevronRight, X, Download, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CLEARANCE_LEVELS = [
  { level: 'Public Trust', active: 12, pending: 5, avgDays: 45, color: '#10B981' },
  { level: 'Secret', active: 18, pending: 8, avgDays: 120, color: '#3B82F6' },
  { level: 'Top Secret', active: 8, pending: 4, avgDays: 240, color: '#8B5CF6' },
  { level: 'TS/SCI', active: 4, pending: 3, avgDays: 365, color: '#EC4899' },
  { level: 'Q Clearance (DOE)', active: 6, pending: 2, avgDays: 180, color: '#F59E0B' },
  { level: 'L Clearance (DOE)', active: 9, pending: 3, avgDays: 90, color: '#06B6D4' },
];

const CANDIDATES_IN_PROCESS = [
  { name: 'James Rodriguez', position: 'Cybersecurity Analyst', clearance: 'Secret', stage: 'Investigation', startDate: '2024-12-10', estCompletion: 'Apr 2025', risk: 'low', email: 'j.rodriguez@nexustech.com', sponsor: 'Marcus Chen', notes: 'All forms submitted on time. Background check in progress.' },
  { name: 'David Washington', position: 'Aerospace Systems Engineer', clearance: 'Top Secret', stage: 'Adjudication', startDate: '2024-08-15', estCompletion: 'Mar 2025', risk: 'low', email: 'd.washington@nexustech.com', sponsor: 'Jennifer Walsh', notes: 'Final adjudication expected within 2 weeks.' },
  { name: 'Michael Okafor', position: 'Nuclear Engineer', clearance: 'L Clearance', stage: 'SF-86 Submitted', startDate: '2025-01-05', estCompletion: 'Jun 2025', risk: 'medium', email: 'm.okafor@nexustech.com', sponsor: 'Sarah Thompson', notes: 'Minor discrepancy in employment history being resolved.' },
  { name: 'Sarah Kim', position: 'AI Research Lead', clearance: 'Secret', stage: 'Background Check', startDate: '2025-01-20', estCompletion: 'May 2025', risk: 'low', email: 's.kim@nexustech.com', sponsor: 'Marcus Chen', notes: 'Standard processing timeline.' },
  { name: 'Carlos Mendez', position: 'Defense Program Manager', clearance: 'TS/SCI', stage: 'Polygraph Scheduled', startDate: '2024-06-01', estCompletion: 'Apr 2025', risk: 'medium', email: 'c.mendez@nexustech.com', sponsor: 'Jennifer Walsh', notes: 'Polygraph scheduled for Mar 18. Extended timeline due to foreign contacts review.' },
];

const TIME_TO_CLEAR_DATA = CLEARANCE_LEVELS.map(c => ({ level: c.level, days: c.avgDays }));

const ClearancePipelineTab: React.FC = () => {
  const totalActive = CLEARANCE_LEVELS.reduce((s, c) => s + c.active, 0);
  const totalPending = CLEARANCE_LEVELS.reduce((s, c) => s + c.pending, 0);
  const [viewCandidate, setViewCandidate] = useState<typeof CANDIDATES_IN_PROCESS[0] | null>(null);
  const [showToast, setShowToast] = useState('');

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {showToast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-emerald-400" /></div><span className="text-gray-400 text-sm">Cleared Personnel</span></div>
          <div className="text-2xl font-bold text-white">{totalActive}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4 text-amber-400" /></div><span className="text-gray-400 text-sm">In Process</span></div>
          <div className="text-2xl font-bold text-amber-400">{totalPending}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"><CheckCircle className="w-4 h-4 text-blue-400" /></div><span className="text-gray-400 text-sm">Cleared This Year</span></div>
          <div className="text-2xl font-bold text-white">18</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-purple-400" /></div><span className="text-gray-400 text-sm">Avg Processing</span></div>
          <div className="text-2xl font-bold text-white">145 <span className="text-sm text-gray-400">days</span></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clearance Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Clearance Distribution</h3>
          <div className="space-y-4">
            {CLEARANCE_LEVELS.map((cl) => (
              <div key={cl.level}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white font-medium">{cl.level}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-emerald-400">{cl.active} active</span>
                    <span className="text-amber-400">{cl.pending} pending</span>
                  </div>
                </div>
                <div className="flex h-2.5 bg-gray-800 rounded-full overflow-hidden gap-0.5">
                  <div className="rounded-full" style={{ width: `${(cl.active / (cl.active + cl.pending)) * 100}%`, backgroundColor: cl.color }} />
                  <div className="rounded-full bg-amber-500/40" style={{ width: `${(cl.pending / (cl.active + cl.pending)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time to Clear */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Avg Time to Clear (Days)</h3>
            <button onClick={() => triggerToast('Clearance report download started!')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"><Download className="w-3 h-3" /> Export</button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={TIME_TO_CLEAR_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis dataKey="level" type="category" tick={{ fill: '#9CA3AF', fontSize: 10 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} formatter={(v: number) => [`${v} days`, 'Avg Time']} />
              <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                {CLEARANCE_LEVELS.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Candidates In Process */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Candidates In Process</h3>
        <div className="space-y-3">
          {CANDIDATES_IN_PROCESS.map((candidate, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setViewCandidate(candidate)}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{candidate.name}</div>
                  <div className="text-gray-400 text-xs">{candidate.position}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{candidate.clearance}</span>
                <span className="text-xs text-gray-400">{candidate.stage}</span>
                <span className="text-xs text-gray-500">Est. {candidate.estCompletion}</span>
                <span className={`w-2 h-2 rounded-full ${candidate.risk === 'low' ? 'bg-emerald-500' : 'bg-amber-500'}`} title={`Risk: ${candidate.risk}`} />
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {viewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewCandidate(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {viewCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{viewCandidate.name}</h3>
                  <p className="text-gray-400 text-sm">{viewCandidate.position}</p>
                </div>
              </div>
              <button onClick={() => setViewCandidate(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Clearance Level</div>
                <div className="text-blue-400 font-medium text-sm mt-1 flex items-center gap-1"><Shield className="w-3 h-3" /> {viewCandidate.clearance}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Current Stage</div>
                <div className="text-white font-medium text-sm mt-1">{viewCandidate.stage}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Process Started</div>
                <div className="text-white font-medium text-sm mt-1">{viewCandidate.startDate}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Est. Completion</div>
                <div className="text-white font-medium text-sm mt-1">{viewCandidate.estCompletion}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Risk Level</div>
                <div className={`font-medium text-sm mt-1 flex items-center gap-1 ${viewCandidate.risk === 'low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${viewCandidate.risk === 'low' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {viewCandidate.risk.charAt(0).toUpperCase() + viewCandidate.risk.slice(1)}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Sponsor</div>
                <div className="text-white font-medium text-sm mt-1">{viewCandidate.sponsor}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-xs mb-2">Notes</div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-gray-300 text-sm">{viewCandidate.notes}</div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setViewCandidate(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              <button onClick={() => { setViewCandidate(null); triggerToast('Reminder sent to ' + viewCandidate.name); }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"><Mail className="w-4 h-4" /> Send Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClearancePipelineTab;
