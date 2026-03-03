// ===========================================
// Employer Dashboard - Job Postings Tab
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Plus, Search, Eye, Edit2, Pause, Star, Shield, TrendingUp, Play } from 'lucide-react';

const SAMPLE_JOBS = [
  { id: 1, title: 'Senior AI/ML Engineer', department: 'Research & Development', location: 'San Francisco, CA', type: 'Full-time', salary: '$180,000 - $220,000', applicants: 234, newApplicants: 18, views: 3456, daysOpen: 12, clearance: 'None', status: 'active', featured: true, matchRate: 94 },
  { id: 2, title: 'Cybersecurity Analyst II', department: 'Security Operations', location: 'Arlington, VA', type: 'Full-time', salary: '$120,000 - $155,000', applicants: 189, newApplicants: 24, views: 2891, daysOpen: 8, clearance: 'Secret', status: 'active', featured: true, matchRate: 91 },
  { id: 3, title: 'Nuclear Engineer', department: 'Energy Division', location: 'Idaho Falls, ID', type: 'Full-time', salary: '$130,000 - $170,000', applicants: 67, newApplicants: 5, views: 1234, daysOpen: 23, clearance: 'Q Clearance', status: 'active', featured: false, matchRate: 88 },
  { id: 4, title: 'Quantum Computing Researcher', department: 'Advanced Computing', location: 'Boulder, CO', type: 'Full-time', salary: '$160,000 - $210,000', applicants: 45, newApplicants: 12, views: 2100, daysOpen: 5, clearance: 'Top Secret', status: 'active', featured: true, matchRate: 96 },
  { id: 5, title: 'Semiconductor Process Engineer', department: 'Manufacturing', location: 'Austin, TX', type: 'Full-time', salary: '$125,000 - $160,000', applicants: 156, newApplicants: 8, views: 2567, daysOpen: 15, clearance: 'None', status: 'active', featured: false, matchRate: 87 },
  { id: 6, title: 'Aerospace Systems Architect', department: 'Defense Programs', location: 'Huntsville, AL', type: 'Full-time', salary: '$145,000 - $185,000', applicants: 78, newApplicants: 6, views: 1890, daysOpen: 18, clearance: 'Top Secret/SCI', status: 'active', featured: false, matchRate: 85 },
  { id: 7, title: 'Data Science Intern', department: 'Analytics', location: 'Remote', type: 'Internship', salary: '$35/hr', applicants: 412, newApplicants: 45, views: 5678, daysOpen: 3, clearance: 'None', status: 'active', featured: true, matchRate: 82 },
  { id: 8, title: 'Robotics Software Engineer', department: 'Automation', location: 'Pittsburgh, PA', type: 'Full-time', salary: '$140,000 - $175,000', applicants: 98, newApplicants: 11, views: 1567, daysOpen: 20, clearance: 'None', status: 'paused', featured: false, matchRate: 90 },
];

const JobPostingsTab: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [viewJob, setViewJob] = useState<typeof SAMPLE_JOBS[0] | null>(null);
  const [editJob, setEditJob] = useState<typeof SAMPLE_JOBS[0] | null>(null);
  const [pauseJob, setPauseJob] = useState<typeof SAMPLE_JOBS[0] | null>(null);
  const [showToast, setShowToast] = useState('');

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2500);
  };

  const filteredJobs = SAMPLE_JOBS.filter(job => {
    if (filter !== 'all' && job.status !== filter) return false;
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    active: SAMPLE_JOBS.filter(j => j.status === 'active').length,
    paused: SAMPLE_JOBS.filter(j => j.status === 'paused').length,
    totalApplicants: SAMPLE_JOBS.reduce((sum, j) => sum + j.applicants, 0),
    avgMatchRate: Math.round(SAMPLE_JOBS.reduce((sum, j) => sum + j.matchRate, 0) / SAMPLE_JOBS.length),
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {showToast}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Active</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.active}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Paused</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{stats.paused}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Total Applicants</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.totalApplicants.toLocaleString()}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Avg AI Match</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.avgMatchRate}%</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 w-64"
            />
          </div>
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            {(['all', 'active', 'paused', 'closed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  filter === f ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowPostModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      {/* Job Listings */}
      <div className="space-y-3">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">{job.title}</h3>
                  {job.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  {job.clearance !== 'None' && (
                    <span className="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {job.clearance}
                    </span>
                  )}
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    job.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{job.department}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  <span>{job.type}</span>
                  <span className="text-emerald-400 font-medium">{job.salary}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewJob(job)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                <button onClick={() => setEditJob(job)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Edit Job"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setPauseJob(job)} className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors" title={job.status === 'paused' ? 'Resume Job' : 'Pause Job'}>
                  {job.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-800/50">
              <div className="flex items-center gap-1.5 text-sm">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-white font-medium">{job.applicants}</span>
                <span className="text-gray-500">applicants</span>
                {job.newApplicants > 0 && <span className="text-emerald-400 text-xs">(+{job.newApplicants} new)</span>}
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-white font-medium">{job.views.toLocaleString()}</span>
                <span className="text-gray-500">views</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-400">{job.daysOpen} days open</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm ml-auto">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">{job.matchRate}%</span>
                <span className="text-gray-500">AI match rate</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post New Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPostModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6">Post New Job</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Job Title</label>
                <input type="text" placeholder="e.g. Senior AI/ML Engineer" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Department</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                    <option>Research & Development</option>
                    <option>Security Operations</option>
                    <option>Energy Division</option>
                    <option>Advanced Computing</option>
                    <option>Manufacturing</option>
                    <option>Defense Programs</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Employment Type</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Location</label>
                  <input type="text" placeholder="e.g. San Francisco, CA" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Salary Range</label>
                  <input type="text" placeholder="e.g. $150,000 - $200,000" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Clearance Required</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                  <option>None</option>
                  <option>Public Trust</option>
                  <option>Secret</option>
                  <option>Top Secret</option>
                  <option>Top Secret/SCI</option>
                  <option>Q Clearance (DOE)</option>
                  <option>L Clearance (DOE)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Job Description</label>
                <textarea rows={4} placeholder="Describe the role, responsibilities, and requirements..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Required Skills</label>
                <input type="text" placeholder="e.g. Python, PyTorch, Machine Learning" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="post-featured" className="rounded border-gray-700 bg-gray-800 text-emerald-500" />
                <label htmlFor="post-featured" className="text-sm text-gray-300">Feature this job posting</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowPostModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowPostModal(false); triggerToast('Job posted successfully!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Publish Job</button>
            </div>
          </div>
        </div>
      )}

      {/* View Job Detail Modal */}
      {viewJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewJob(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-white">{viewJob.title}</h3>
              {viewJob.featured && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${viewJob.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{viewJob.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Department</div>
                <div className="text-white font-medium text-sm mt-1">{viewJob.department}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Location</div>
                <div className="text-white font-medium text-sm mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {viewJob.location}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Salary Range</div>
                <div className="text-emerald-400 font-medium text-sm mt-1">{viewJob.salary}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Employment Type</div>
                <div className="text-white font-medium text-sm mt-1">{viewJob.type}</div>
              </div>
              {viewJob.clearance !== 'None' && (
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-gray-400 text-xs">Clearance Required</div>
                  <div className="text-amber-400 font-medium text-sm mt-1 flex items-center gap-1"><Shield className="w-3 h-3" /> {viewJob.clearance}</div>
                </div>
              )}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">Days Open</div>
                <div className="text-white font-medium text-sm mt-1">{viewJob.daysOpen} days</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{viewJob.applicants}</div>
                <div className="text-gray-400 text-xs mt-1">Total Applicants</div>
                {viewJob.newApplicants > 0 && <div className="text-emerald-400 text-xs mt-0.5">+{viewJob.newApplicants} new</div>}
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{viewJob.views.toLocaleString()}</div>
                <div className="text-gray-400 text-xs mt-1">Total Views</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{viewJob.matchRate}%</div>
                <div className="text-gray-400 text-xs mt-1">AI Match Rate</div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setViewJob(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              <button onClick={() => { setViewJob(null); setEditJob(viewJob); }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit Job</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditJob(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6">Edit Job: {editJob.title}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Job Title</label>
                <input type="text" defaultValue={editJob.title} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Department</label>
                  <input type="text" defaultValue={editJob.department} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Employment Type</label>
                  <input type="text" defaultValue={editJob.type} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Location</label>
                  <input type="text" defaultValue={editJob.location} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Salary Range</label>
                  <input type="text" defaultValue={editJob.salary} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Clearance Required</label>
                <select defaultValue={editJob.clearance} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                  <option>None</option>
                  <option>Public Trust</option>
                  <option>Secret</option>
                  <option>Top Secret</option>
                  <option>Top Secret/SCI</option>
                  <option>Q Clearance</option>
                  <option>L Clearance</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Job Description</label>
                <textarea rows={4} defaultValue={`Key responsibilities for the ${editJob.title} role at Nexus Technologies. This position involves working with cutting-edge technologies in the ${editJob.department} department.`} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="edit-featured" defaultChecked={editJob.featured} className="rounded border-gray-700 bg-gray-800 text-emerald-500" />
                <label htmlFor="edit-featured" className="text-sm text-gray-300">Feature this job posting</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditJob(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setEditJob(null); triggerToast('Job updated successfully!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Pause/Resume Confirmation Modal */}
      {pauseJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setPauseJob(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">
              {pauseJob.status === 'paused' ? 'Resume' : 'Pause'} Job Posting?
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              {pauseJob.status === 'paused'
                ? `Are you sure you want to resume "${pauseJob.title}"? It will become visible to candidates again.`
                : `Are you sure you want to pause "${pauseJob.title}"? It will be hidden from candidates until resumed.`
              }
            </p>
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
              <div className="text-white font-medium text-sm">{pauseJob.title}</div>
              <div className="text-gray-400 text-xs mt-1">{pauseJob.department} &middot; {pauseJob.location} &middot; {pauseJob.applicants} applicants</div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setPauseJob(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setPauseJob(null); triggerToast(pauseJob.status === 'paused' ? 'Job resumed!' : 'Job paused!'); }} className={`px-4 py-2 rounded-lg font-medium transition-colors ${pauseJob.status === 'paused' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}>
                {pauseJob.status === 'paused' ? 'Resume' : 'Pause'} Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostingsTab;
