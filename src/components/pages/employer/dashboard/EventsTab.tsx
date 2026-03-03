// ===========================================
// Employer Dashboard - Events Tab
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, TrendingUp, Plus, Globe, Building2, DollarSign, X, Download } from 'lucide-react';

const EVENTS = [
  { id: 1, name: 'MIT Fall STEM Career Fair', date: 'Mar 15, 2025', time: '10:00 AM - 4:00 PM', location: 'Cambridge, MA', type: 'Career Fair', status: 'upcoming', registrations: 450, expectedAttendees: 380, cost: 5000, leadsGenerated: 0, booth: 'Premium (A-12)', description: 'Annual STEM career fair at MIT featuring top employers in AI/ML, quantum computing, and defense tech sectors.' },
  { id: 2, name: 'Cybersecurity Hiring Day', date: 'Mar 22, 2025', time: '9:00 AM - 3:00 PM', location: 'Virtual', type: 'Hiring Event', status: 'upcoming', registrations: 120, expectedAttendees: 100, cost: 1500, leadsGenerated: 0, booth: 'Virtual Room 3', description: 'Virtual hiring event focused on cybersecurity professionals with active clearances.' },
  { id: 3, name: 'DOE National Lab Recruiting Summit', date: 'Apr 5, 2025', time: '8:00 AM - 5:00 PM', location: 'Oak Ridge, TN', type: 'Partner Event', status: 'upcoming', registrations: 85, expectedAttendees: 70, cost: 3000, leadsGenerated: 0, booth: 'Booth B-7', description: 'DOE-sponsored recruiting summit connecting national lab talent with industry employers.' },
  { id: 4, name: 'Stanford AI/ML Workshop', date: 'Feb 28, 2025', time: '1:00 PM - 5:00 PM', location: 'Stanford, CA', type: 'Workshop', status: 'completed', registrations: 75, expectedAttendees: 68, cost: 2000, leadsGenerated: 42, booth: 'Hosted', description: 'Hands-on AI/ML workshop hosted by Nexus Technologies at Stanford campus.' },
  { id: 5, name: 'NSBE National Conference', date: 'Feb 15, 2025', time: '9:00 AM - 6:00 PM', location: 'Atlanta, GA', type: 'Conference', status: 'completed', registrations: 320, expectedAttendees: 280, cost: 8000, leadsGenerated: 156, booth: 'Gold Sponsor', description: 'National Society of Black Engineers annual conference. Key diversity recruiting event.' },
  { id: 6, name: 'Georgia Tech Hackathon', date: 'Feb 8, 2025', time: '9:00 AM - 9:00 PM', location: 'Atlanta, GA', type: 'Hackathon', status: 'completed', registrations: 200, expectedAttendees: 180, cost: 4000, leadsGenerated: 89, booth: 'Challenge Sponsor', description: 'Campus hackathon with cybersecurity and aerospace challenge tracks.' },
  { id: 7, name: 'Quantum Tech Career Night', date: 'Jan 25, 2025', time: '6:00 PM - 9:00 PM', location: 'Boulder, CO', type: 'Networking', status: 'completed', registrations: 60, expectedAttendees: 52, cost: 1200, leadsGenerated: 28, booth: 'Host', description: 'Intimate networking event for quantum computing professionals and researchers.' },
];

const EventsTab: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [viewEvent, setViewEvent] = useState<typeof EVENTS[0] | null>(null);
  const [showToast, setShowToast] = useState('');

  const filtered = EVENTS.filter(e => filter === 'all' || e.status === filter);

  const totalLeads = EVENTS.filter(e => e.status === 'completed').reduce((s, e) => s + e.leadsGenerated, 0);
  const totalSpend = EVENTS.reduce((s, e) => s + e.cost, 0);
  const avgROI = 3.2;

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
          { label: 'Upcoming Events', value: EVENTS.filter(e => e.status === 'upcoming').length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { label: 'Leads Generated', value: totalLeads, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          { label: 'Total Spend', value: `$${(totalSpend/1000).toFixed(1)}k`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/20' },
          { label: 'Avg Event ROI', value: `${avgROI}x`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}><stat.icon className={`w-4 h-4 ${stat.color}`} /></div><span className="text-gray-400 text-sm">{stat.label}</span></div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {(['all', 'upcoming', 'completed'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium transition-colors ${filter === f ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => setShowRegisterModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Register for Event
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => setViewEvent(event)}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">{event.name}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>{event.status}</span>
                  <span className="text-[10px] font-medium bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{event.type}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                  <span className="flex items-center gap-1">{event.location === 'Virtual' ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />} {event.location}</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {event.booth}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{event.registrations}</div>
                <div className="text-gray-500 text-xs">registrations</div>
              </div>
            </div>
            {event.status === 'completed' && (
              <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-800/50 text-sm">
                <div><span className="text-emerald-400 font-medium">{event.leadsGenerated}</span> <span className="text-gray-500">leads</span></div>
                <div><span className="text-white font-medium">${event.cost.toLocaleString()}</span> <span className="text-gray-500">cost</span></div>
                <div><span className="text-emerald-400 font-medium">${(event.cost / Math.max(event.leadsGenerated, 1)).toFixed(0)}</span> <span className="text-gray-500">per lead</span></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* View Event Detail Modal */}
      {viewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewEvent(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{viewEvent.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${viewEvent.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{viewEvent.status}</span>
                  <span className="text-xs font-medium bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{viewEvent.type}</span>
                </div>
              </div>
              <button onClick={() => setViewEvent(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-gray-400 text-sm mb-4">{viewEvent.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> Date & Time</div>
                <div className="text-white font-medium text-sm mt-1">{viewEvent.date}</div>
                <div className="text-gray-400 text-xs">{viewEvent.time}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</div>
                <div className="text-white font-medium text-sm mt-1">{viewEvent.location}</div>
                <div className="text-gray-400 text-xs">Booth: {viewEvent.booth}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs flex items-center gap-1"><Users className="w-3 h-3" /> Registrations</div>
                <div className="text-white font-medium text-sm mt-1">{viewEvent.registrations}</div>
                <div className="text-gray-400 text-xs">Expected: {viewEvent.expectedAttendees}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs flex items-center gap-1"><DollarSign className="w-3 h-3" /> Cost</div>
                <div className="text-white font-medium text-sm mt-1">${viewEvent.cost.toLocaleString()}</div>
                {viewEvent.status === 'completed' && <div className="text-emerald-400 text-xs">{viewEvent.leadsGenerated} leads generated</div>}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setViewEvent(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              {viewEvent.status === 'completed' ? (
                <button onClick={() => { setViewEvent(null); triggerToast('Event report download started!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"><Download className="w-4 h-4" /> Export Report</button>
              ) : (
                <button onClick={() => { setViewEvent(null); triggerToast('Event details updated!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Update Registration</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Register for Event Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRegisterModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6">Register for Event</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Event Name</label>
                <input type="text" placeholder="e.g. MIT Spring Career Fair" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Date</label>
                  <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Location</label>
                  <input type="text" placeholder="e.g. Cambridge, MA" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Event Type</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                  <option>Career Fair</option>
                  <option>Hiring Event</option>
                  <option>Workshop</option>
                  <option>Conference</option>
                  <option>Hackathon</option>
                  <option>Networking</option>
                  <option>Partner Event</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Booth/Sponsorship Level</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                  <option>Standard Booth</option>
                  <option>Premium Booth</option>
                  <option>Gold Sponsor</option>
                  <option>Platinum Sponsor</option>
                  <option>Challenge Sponsor</option>
                  <option>Host</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Budget</label>
                <input type="text" placeholder="e.g. $5,000" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Team Members Attending</label>
                <input type="text" placeholder="e.g. Marcus Chen, Sarah Thompson" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRegisterModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowRegisterModal(false); triggerToast('Event registration submitted!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
