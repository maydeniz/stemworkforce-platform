// ===========================================
// Employer Dashboard - Campus Recruiting Tab
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, TrendingUp, Award, MapPin, Calendar, Star, ArrowUpRight, ExternalLink, Eye, Plus, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UNIVERSITY_PARTNERS = [
  { name: 'MIT', location: 'Cambridge, MA', students: 45, hires: 12, interns: 8, rating: 4.9, programs: ['AI/ML', 'Quantum'], tier: 'Platinum' },
  { name: 'Stanford University', location: 'Stanford, CA', students: 38, hires: 10, interns: 6, rating: 4.8, programs: ['Semiconductor', 'AI/ML'], tier: 'Platinum' },
  { name: 'Georgia Tech', location: 'Atlanta, GA', students: 52, hires: 15, interns: 12, rating: 4.7, programs: ['Cybersecurity', 'Aerospace'], tier: 'Gold' },
  { name: 'Caltech', location: 'Pasadena, CA', students: 18, hires: 6, interns: 4, rating: 4.9, programs: ['Quantum', 'Nuclear'], tier: 'Platinum' },
  { name: 'Carnegie Mellon', location: 'Pittsburgh, PA', students: 34, hires: 9, interns: 7, rating: 4.6, programs: ['Robotics', 'AI/ML'], tier: 'Gold' },
  { name: 'UC Berkeley', location: 'Berkeley, CA', students: 41, hires: 11, interns: 9, rating: 4.5, programs: ['Clean Energy', 'AI/ML'], tier: 'Gold' },
  { name: 'Purdue University', location: 'West Lafayette, IN', students: 28, hires: 8, interns: 5, rating: 4.4, programs: ['Aerospace', 'Nuclear'], tier: 'Silver' },
  { name: 'Penn State', location: 'University Park, PA', students: 22, hires: 7, interns: 4, rating: 4.3, programs: ['Nuclear', 'Manufacturing'], tier: 'Silver' },
];

const INTERN_PROGRAMS = [
  { name: 'Summer AI Research Program', duration: '12 weeks', spots: 15, filled: 12, conversion: 83, stipend: '$8,500/month', startDate: 'Jun 2025' },
  { name: 'Cybersecurity Co-op', duration: '6 months', spots: 8, filled: 6, conversion: 75, stipend: '$7,200/month', startDate: 'Jan 2025' },
  { name: 'Quantum Computing Fellowship', duration: '10 weeks', spots: 5, filled: 5, conversion: 100, stipend: '$9,000/month', startDate: 'Jun 2025' },
  { name: 'Defense Tech Internship', duration: '12 weeks', spots: 10, filled: 8, conversion: 70, stipend: '$7,800/month', startDate: 'May 2025' },
];

const CONVERSION_DATA = [
  { program: 'AI Research', rate: 83 },
  { program: 'Cybersecurity', rate: 75 },
  { program: 'Quantum', rate: 100 },
  { program: 'Defense', rate: 70 },
  { program: 'Semiconductor', rate: 65 },
  { program: 'Nuclear', rate: 80 },
];

const CampusRecruitingTab: React.FC = () => {
  const [viewUniversity, setViewUniversity] = useState<typeof UNIVERSITY_PARTNERS[0] | null>(null);
  const [viewProgram, setViewProgram] = useState<typeof INTERN_PROGRAMS[0] | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
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
        {[
          { label: 'University Partners', value: '8', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          { label: 'Active Interns', value: '24', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { label: 'Intern Conversion', value: '78%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20' },
          { label: 'Campus Hires YTD', value: '78', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/20' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* University Partners */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">University Partners</h3>
            <button onClick={() => setShowAddPartner(true)} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3" /> Add Partner
            </button>
          </div>
          <div className="space-y-3">
            {UNIVERSITY_PARTNERS.map((uni) => (
              <div key={uni.name} onClick={() => setViewUniversity(uni)} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{uni.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      uni.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400' :
                      uni.tier === 'Gold' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>{uni.tier}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {uni.location}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right text-xs">
                  <div><span className="text-white font-medium">{uni.hires}</span> <span className="text-gray-500">hires</span></div>
                  <div><span className="text-cyan-400 font-medium">{uni.interns}</span> <span className="text-gray-500">interns</span></div>
                  <div className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> <span className="text-white">{uni.rating}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Chart + Intern Programs */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Intern-to-Hire Conversion</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CONVERSION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="program" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} formatter={(value: number) => [`${value}%`, 'Conversion']} />
                <Bar dataKey="rate" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Intern Programs</h3>
            <div className="space-y-3">
              {INTERN_PROGRAMS.map((prog) => (
                <div key={prog.name} onClick={() => setViewProgram(prog)} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{prog.name}</span>
                    <span className="text-emerald-400 text-xs font-medium">{prog.conversion}% conversion</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{prog.duration}</span>
                    <span>{prog.filled}/{prog.spots} spots filled</span>
                    <span>{prog.stipend}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {prog.startDate}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(prog.filled / prog.spots) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View University Detail Modal */}
      {viewUniversity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewUniversity(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{viewUniversity.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {viewUniversity.location}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    viewUniversity.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400' :
                    viewUniversity.tier === 'Gold' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>{viewUniversity.tier} Partner</span>
                </div>
              </div>
              <button onClick={() => setViewUniversity(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{viewUniversity.students}</div>
                <div className="text-gray-400 text-xs mt-1">Pipeline Students</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">{viewUniversity.hires}</div>
                <div className="text-gray-400 text-xs mt-1">Hires</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">{viewUniversity.interns}</div>
                <div className="text-gray-400 text-xs mt-1">Active Interns</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1"><Star className="w-5 h-5 fill-amber-400" /> {viewUniversity.rating}</div>
                <div className="text-gray-400 text-xs mt-1">Partner Rating</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-xs mb-2">Active Programs</div>
              <div className="flex flex-wrap gap-2">
                {viewUniversity.programs.map(p => (
                  <span key={p} className="text-xs font-medium bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">{p}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setViewUniversity(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              <button onClick={() => { setViewUniversity(null); triggerToast('Scheduled campus visit for ' + viewUniversity.name); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"><Calendar className="w-4 h-4" /> Schedule Visit</button>
            </div>
          </div>
        </div>
      )}

      {/* View Intern Program Detail Modal */}
      {viewProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewProgram(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{viewProgram.name}</h3>
              <button onClick={() => setViewProgram(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Duration</div>
                <div className="text-white font-medium text-sm mt-1">{viewProgram.duration}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Start Date</div>
                <div className="text-white font-medium text-sm mt-1">{viewProgram.startDate}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Stipend</div>
                <div className="text-emerald-400 font-medium text-sm mt-1">{viewProgram.stipend}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Conversion Rate</div>
                <div className="text-emerald-400 font-medium text-sm mt-1">{viewProgram.conversion}%</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-xs mb-2">Spots Filled</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(viewProgram.filled / viewProgram.spots) * 100}%` }} />
                </div>
                <span className="text-white font-medium text-sm">{viewProgram.filled}/{viewProgram.spots}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setViewProgram(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              <button onClick={() => { setViewProgram(null); triggerToast('Program details exported!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Export Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Add University Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddPartner(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6">Add University Partner</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">University Name</label>
                <input type="text" placeholder="e.g. University of Michigan" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Location</label>
                <input type="text" placeholder="e.g. Ann Arbor, MI" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Partnership Tier</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Programs of Interest</label>
                <input type="text" placeholder="e.g. AI/ML, Aerospace" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Contact Person</label>
                <input type="text" placeholder="e.g. Dr. Jane Smith" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddPartner(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowAddPartner(false); triggerToast('University partner added!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Add Partner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusRecruitingTab;
