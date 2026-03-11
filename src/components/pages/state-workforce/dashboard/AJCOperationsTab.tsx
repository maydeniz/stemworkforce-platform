// ===========================================
// AJC Operations Tab - American Job Center Management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  Download,
  X,
  Users,
  Phone,
  Mail,
  Globe,
  Clock,
  Monitor,
  Building2,
  Activity
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { AmericanJobCenter, AJCDailyTraffic } from '@/types/stateWorkforce';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_AJCS: (AmericanJobCenter & { recentTraffic?: AJCDailyTraffic })[] = [
  {
    id: 'ajc-1', name: 'Capital City Workforce Center', center_type: 'COMPREHENSIVE',
    lwdb_id: 'lwdb-1', lwdb_name: 'Capital Region Workforce Board',
    address_street: '6505 Airport Blvd', address_city: 'Austin', address_state: 'TX', address_zip: '78752', county: 'Travis',
    phone: '512-555-0110', email: 'info@capitalwfc.org', website: 'https://capitalwfc.org',
    hours: { monday: '8:00-5:00', tuesday: '8:00-5:00', wednesday: '8:00-5:00', thursday: '8:00-7:00', friday: '8:00-5:00', saturday: '9:00-1:00', sunday: 'Closed' },
    services_offered: ['ELIGIBILITY_DETERMINATION', 'INITIAL_ASSESSMENT', 'CAREER_COUNSELING', 'JOB_SEARCH_ASSISTANCE', 'OCCUPATIONAL_SKILLS_TRAINING', 'OJT', 'REGISTERED_APPRENTICESHIP'],
    programs_offered: ['TITLE_I_ADULT', 'TITLE_I_DISLOCATED_WORKER', 'TITLE_I_YOUTH', 'TITLE_III_WAGNER_PEYSER', 'VETERAN_SERVICES'],
    partner_agencies: ['Texas Workforce Commission', 'Dept. of Assistive Services', 'Adult Education'],
    wheelchair_accessible: true, hearing_assistance: true, vision_assistance: true,
    languages: ['English', 'Spanish', 'Vietnamese'],
    director_name: 'Patricia Gonzalez', director_email: 'pgonzalez@capitalwfc.org', total_staff: 45,
    resource_room_computers: 30, workshop_room_capacity: 50,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    recentTraffic: {
      id: 't-1', ajc_id: 'ajc-1', date: '2025-03-08',
      walk_ins: 87, appointments: 34, virtual_visits: 23, phone_calls: 56,
      registrations: 12, assessments: 8, job_referrals: 45, workshop_attendees: 28, resource_room_users: 42,
      staff_on_duty: 38, created_at: new Date().toISOString()
    }
  },
  {
    id: 'ajc-2', name: 'North Austin Career Center', center_type: 'AFFILIATE',
    lwdb_id: 'lwdb-1', lwdb_name: 'Capital Region Workforce Board',
    address_street: '1500 Research Blvd', address_city: 'Austin', address_state: 'TX', address_zip: '78759', county: 'Travis',
    phone: '512-555-0120', email: 'info@northaustincc.org',
    hours: { monday: '8:30-5:00', tuesday: '8:30-5:00', wednesday: '8:30-5:00', thursday: '8:30-5:00', friday: '8:30-4:30', saturday: 'Closed', sunday: 'Closed' },
    services_offered: ['ELIGIBILITY_DETERMINATION', 'INITIAL_ASSESSMENT', 'JOB_SEARCH_ASSISTANCE', 'REFERRALS'],
    programs_offered: ['TITLE_I_ADULT', 'TITLE_III_WAGNER_PEYSER'],
    partner_agencies: ['Texas Workforce Commission'],
    wheelchair_accessible: true, hearing_assistance: false, vision_assistance: false,
    languages: ['English', 'Spanish'],
    director_name: 'David Kim', total_staff: 15,
    resource_room_computers: 12, workshop_room_capacity: 25,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    recentTraffic: {
      id: 't-2', ajc_id: 'ajc-2', date: '2025-03-08',
      walk_ins: 34, appointments: 15, virtual_visits: 8, phone_calls: 22,
      registrations: 5, assessments: 3, job_referrals: 18, workshop_attendees: 12, resource_room_users: 20,
      staff_on_duty: 12, created_at: new Date().toISOString()
    }
  },
  {
    id: 'ajc-4', name: 'Gulf Coast Career Center - Central', center_type: 'COMPREHENSIVE',
    lwdb_id: 'lwdb-2', lwdb_name: 'Gulf Coast Workforce Solutions',
    address_street: '9215 North Freeway', address_city: 'Houston', address_state: 'TX', address_zip: '77037', county: 'Harris',
    phone: '713-555-0210', email: 'info@gulfcoastcc.org', website: 'https://gulfcoastcc.org',
    hours: { monday: '8:00-5:00', tuesday: '8:00-5:00', wednesday: '8:00-5:00', thursday: '8:00-7:00', friday: '8:00-5:00', saturday: '9:00-1:00', sunday: 'Closed' },
    services_offered: ['ELIGIBILITY_DETERMINATION', 'INITIAL_ASSESSMENT', 'CAREER_COUNSELING', 'JOB_SEARCH_ASSISTANCE', 'OCCUPATIONAL_SKILLS_TRAINING', 'OJT', 'TRANSPORTATION_ASSISTANCE', 'CHILDCARE_ASSISTANCE'],
    programs_offered: ['TITLE_I_ADULT', 'TITLE_I_DISLOCATED_WORKER', 'TITLE_I_YOUTH', 'TITLE_III_WAGNER_PEYSER', 'SNAP_ET', 'TANF', 'VETERAN_SERVICES'],
    partner_agencies: ['Texas Workforce Commission', 'Harris County', 'Dept. of Assistive Services', 'Adult Education', 'SNAP Office'],
    wheelchair_accessible: true, hearing_assistance: true, vision_assistance: true,
    languages: ['English', 'Spanish', 'Chinese', 'Vietnamese', 'Arabic'],
    director_name: 'Angela Washington', director_email: 'awashington@gulfcoastcc.org', total_staff: 65,
    resource_room_computers: 50, workshop_room_capacity: 75,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    recentTraffic: {
      id: 't-3', ajc_id: 'ajc-4', date: '2025-03-08',
      walk_ins: 145, appointments: 56, virtual_visits: 38, phone_calls: 89,
      registrations: 22, assessments: 15, job_referrals: 67, workshop_attendees: 45, resource_room_users: 58,
      staff_on_duty: 52, created_at: new Date().toISOString()
    }
  },
  {
    id: 'ajc-5', name: 'Southwest Houston Employment Office', center_type: 'AFFILIATE',
    lwdb_id: 'lwdb-2', lwdb_name: 'Gulf Coast Workforce Solutions',
    address_street: '12000 Bissonnet St', address_city: 'Houston', address_state: 'TX', address_zip: '77099', county: 'Harris',
    phone: '713-555-0220', email: 'info@swhoustonwf.org',
    hours: { monday: '8:30-5:00', tuesday: '8:30-5:00', wednesday: '8:30-5:00', thursday: '8:30-5:00', friday: '8:30-4:30', saturday: 'Closed', sunday: 'Closed' },
    services_offered: ['ELIGIBILITY_DETERMINATION', 'INITIAL_ASSESSMENT', 'JOB_SEARCH_ASSISTANCE', 'REFERRALS', 'UI_ASSISTANCE'],
    programs_offered: ['TITLE_I_ADULT', 'TITLE_III_WAGNER_PEYSER', 'RESEA'],
    partner_agencies: ['Texas Workforce Commission'],
    wheelchair_accessible: true, hearing_assistance: false, vision_assistance: false,
    languages: ['English', 'Spanish', 'Hindi'],
    director_name: 'Raj Patel', total_staff: 18,
    resource_room_computers: 15, workshop_room_capacity: 30,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    recentTraffic: {
      id: 't-4', ajc_id: 'ajc-5', date: '2025-03-08',
      walk_ins: 52, appointments: 18, virtual_visits: 11, phone_calls: 34,
      registrations: 7, assessments: 4, job_referrals: 25, workshop_attendees: 0, resource_room_users: 28,
      staff_on_duty: 14, created_at: new Date().toISOString()
    }
  }
];

// ===========================================
// COMPONENT
// ===========================================

type AJCView = 'directory' | 'virtual_services' | 'resource_room';

// ===========================================
// VIRTUAL SERVICES SAMPLE DATA
// ===========================================
const VIRTUAL_SERVICES_DATA = [
  { service: 'Initial Assessment (Virtual)', sessions: 312, avgDuration: 42, completionRate: 87, platform: 'MS Teams' },
  { service: 'Career Counseling', sessions: 245, avgDuration: 55, completionRate: 92, platform: 'Zoom' },
  { service: 'Resume Workshop (Group)', sessions: 48, avgDuration: 90, completionRate: 78, platform: 'MS Teams' },
  { service: 'Job Search Assistance', sessions: 189, avgDuration: 35, completionRate: 95, platform: 'Phone/Web' },
  { service: 'IEP Development', sessions: 134, avgDuration: 65, completionRate: 83, platform: 'Secure Portal' },
  { service: 'Financial Literacy Workshop', sessions: 62, avgDuration: 75, completionRate: 71, platform: 'Zoom' },
  { service: 'Employer Connect Session', sessions: 29, avgDuration: 120, completionRate: 88, platform: 'MS Teams' },
  { service: 'Follow-up Check-in (Q2/Q4)', sessions: 421, avgDuration: 20, completionRate: 96, platform: 'Phone' },
];

// ===========================================
// RESOURCE ROOM SAMPLE DATA
// ===========================================
const RESOURCE_ROOM_DATA = [
  { ajc: 'Capital City Workforce Center', computers: 30, avgDailyUsers: 42, utilization: 84, printers: 4, scanners: 2, topActivity: 'Job applications' },
  { ajc: 'North Austin Career Center', computers: 12, avgDailyUsers: 20, utilization: 83, printers: 2, scanners: 1, topActivity: 'Resume uploads' },
  { ajc: 'Gulf Coast Career Center - Central', computers: 50, avgDailyUsers: 58, utilization: 72, printers: 6, scanners: 3, topActivity: 'Benefits portals' },
  { ajc: 'SW Houston Employment Office', computers: 15, avgDailyUsers: 28, utilization: 93, printers: 2, scanners: 1, topActivity: 'Job applications' },
];

export const AJCOperationsTab: React.FC = () => {
  const [view, setView] = useState<AJCView>('directory');
  const [ajcs, setAjcs] = useState<(AmericanJobCenter & { recentTraffic?: AJCDailyTraffic })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAJC, setSelectedAJC] = useState<(AmericanJobCenter & { recentTraffic?: AJCDailyTraffic }) | null>(null);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEscapeKey(() => setSelectedAJC(null), !!selectedAJC);

  const handleExport = () => {
    const headers = ['Name', 'Type', 'City', 'County', 'Status', 'Staff', 'Walk-ins', 'Appointments', 'Virtual Visits'];
    const rows = filteredAJCs.map(a => [
      `"${a.name}"`, a.center_type, a.address_city, a.county, a.status, a.total_staff || 0,
      a.recentTraffic?.walk_ins || 0, a.recentTraffic?.appointments || 0, a.recentTraffic?.virtual_visits || 0
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ajc-operations-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('AJC data exported successfully');
  };

  useEffect(() => {
    loadAJCs();
  }, []);

  const loadAJCs = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setAjcs(SAMPLE_AJCS);
    } catch {
      setAjcs(SAMPLE_AJCS);
    } finally {
      setLoading(false);
    }
  };

  const filteredAJCs = ajcs.filter(a => {
    const matchesSearch = searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.address_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.county.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || a.center_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalTraffic = ajcs.reduce((sum, a) => {
    const t = a.recentTraffic;
    return sum + (t ? t.walk_ins + t.appointments + t.virtual_visits : 0);
  }, 0);
  const totalStaff = ajcs.reduce((sum, a) => sum + (a.total_staff || 0), 0);
  const comprehensiveCount = ajcs.filter(a => a.center_type === 'COMPREHENSIVE').length;
  const affiliateCount = ajcs.filter(a => a.center_type === 'AFFILIATE').length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
            <div className="h-5 w-48 bg-gray-800 rounded mb-3" />
            <div className="h-4 w-80 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.visible && (
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg shadow-lg">
          <Download className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* View Tabs */}
      <div className="flex gap-2">
        {([
          { id: 'directory', label: 'AJC Directory', icon: Building2 },
          { id: 'virtual_services', label: 'Virtual Services', icon: Monitor },
          { id: 'resource_room', label: 'Resource Room', icon: Activity },
        ] as { id: AJCView; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Virtual Services Panel */}
      {view === 'virtual_services' && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Virtual Sessions (MTD)', value: VIRTUAL_SERVICES_DATA.reduce((s, d) => s + d.sessions, 0).toLocaleString(), color: '#3b82f6' },
              { label: 'Avg Completion Rate', value: `${Math.round(VIRTUAL_SERVICES_DATA.reduce((s, d) => s + d.completionRate, 0) / VIRTUAL_SERVICES_DATA.length)}%`, color: '#22c55e' },
              { label: 'Avg Session Duration', value: `${Math.round(VIRTUAL_SERVICES_DATA.reduce((s, d) => s + d.avgDuration, 0) / VIRTUAL_SERVICES_DATA.length)} min`, color: '#f59e0b' },
              { label: 'Platforms Used', value: [...new Set(VIRTUAL_SERVICES_DATA.map(d => d.platform))].length, color: '#a855f7' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Service breakdown table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Virtual Service Delivery — Month to Date</h3>
              <p className="text-gray-400 text-sm mt-1">All AJC locations combined · Active service channels</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    {['Service', 'Sessions', 'Avg Duration', 'Completion Rate', 'Platform'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VIRTUAL_SERVICES_DATA.map((row, i) => (
                    <tr key={i} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3 text-white font-medium text-sm">{row.service}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{row.sessions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{row.avgDuration} min</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-800 rounded-full">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${row.completionRate}%`,
                                backgroundColor: row.completionRate >= 90 ? '#22c55e' : row.completionRate >= 75 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${row.completionRate >= 90 ? 'text-emerald-400' : row.completionRate >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                            {row.completionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">{row.platform}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best practices notice */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
            <p className="font-semibold mb-1">Virtual Service Standards (DOL TEGL 10-16)</p>
            <p className="text-blue-400/80 text-xs">
              All virtual services must meet accessibility requirements (508 / WCAG 2.1 AA), be documented in the case management system,
              and count toward WIOA performance indicators when they meet the definition of career services or training services.
              Virtual contacts must be participant-initiated or scheduled; unsolicited contacts do not count.
            </p>
          </div>
        </div>
      )}

      {/* Resource Room Management Panel */}
      {view === 'resource_room' && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Computers', value: RESOURCE_ROOM_DATA.reduce((s, d) => s + d.computers, 0), color: '#3b82f6' },
              { label: 'Avg Daily Users', value: RESOURCE_ROOM_DATA.reduce((s, d) => s + d.avgDailyUsers, 0).toLocaleString(), color: '#22c55e' },
              { label: 'Avg Utilization', value: `${Math.round(RESOURCE_ROOM_DATA.reduce((s, d) => s + d.utilization, 0) / RESOURCE_ROOM_DATA.length)}%`, color: '#f59e0b' },
              { label: 'Total Printers', value: RESOURCE_ROOM_DATA.reduce((s, d) => s + d.printers, 0), color: '#a855f7' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Per-AJC breakdown */}
          <div className="space-y-3">
            {RESOURCE_ROOM_DATA.map((rr, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{rr.ajc}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    rr.utilization >= 90 ? 'bg-red-500/20 text-red-400' :
                    rr.utilization >= 75 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {rr.utilization}% Utilized
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-3">
                  {[
                    { label: 'Computers', value: rr.computers },
                    { label: 'Daily Users', value: rr.avgDailyUsers },
                    { label: 'Printers', value: rr.printers },
                    { label: 'Scanners', value: rr.scanners },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-xl font-bold text-white">{s.value}</p>
                      <p className="text-xs text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Utilization</span>
                    <span>{rr.utilization}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${rr.utilization}%`,
                        backgroundColor: rr.utilization >= 90 ? '#ef4444' : rr.utilization >= 75 ? '#f59e0b' : '#22c55e',
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Most common activity: <span className="text-gray-300">{rr.topActivity}</span></p>
              </div>
            ))}
          </div>

          {/* Scheduling note */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm">
            <p className="text-amber-300 font-semibold mb-1">High Utilization Alert</p>
            <p className="text-amber-400/80 text-xs">
              SW Houston Employment Office resource room is at 93% utilization. Consider scheduling additional open computer lab hours
              or implementing a reservation system to reduce wait times for job seekers.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards — only shown in directory view */}
      {view === 'directory' && (
      <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total AJCs</span>
          </div>
          <p className="text-2xl font-bold text-white">{ajcs.length}</p>
          <p className="text-xs text-gray-400">{comprehensiveCount} comprehensive, {affiliateCount} affiliate</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Daily Traffic (Latest)</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalTraffic.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Total Staff</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalStaff}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">Resource Room PCs</span>
          </div>
          <p className="text-2xl font-bold text-white">{ajcs.reduce((sum, a) => sum + (a.resource_room_computers || 0), 0)}</p>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, city, or county..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="COMPREHENSIVE">Comprehensive</option>
            <option value="AFFILIATE">Affiliate</option>
            <option value="SPECIALIZED">Specialized</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* AJC List */}
      <div className="space-y-4">
        {filteredAJCs.map((ajc, idx) => (
          <motion.div
            key={ajc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => setSelectedAJC(ajc)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  ajc.center_type === 'COMPREHENSIVE' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                }`}>
                  <Building2 className={`w-6 h-6 ${ajc.center_type === 'COMPREHENSIVE' ? 'text-blue-400' : 'text-purple-400'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{ajc.name}</h3>
                  <p className="text-sm text-gray-400">
                    {ajc.address_city}, {ajc.address_state} &bull; {ajc.county} County &bull; {ajc.lwdb_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  ajc.center_type === 'COMPREHENSIVE' ? 'bg-blue-500/20 text-blue-400' :
                  ajc.center_type === 'AFFILIATE' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {ajc.center_type}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  ajc.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                  ajc.status === 'TEMPORARILY_CLOSED' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {ajc.status}
                </span>
              </div>
            </div>

            {/* Traffic Stats */}
            {ajc.recentTraffic && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-white">{ajc.recentTraffic.walk_ins}</p>
                  <p className="text-xs text-gray-400">Walk-ins</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-white">{ajc.recentTraffic.appointments}</p>
                  <p className="text-xs text-gray-400">Appointments</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-white">{ajc.recentTraffic.virtual_visits}</p>
                  <p className="text-xs text-gray-400">Virtual</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-white">{ajc.recentTraffic.job_referrals}</p>
                  <p className="text-xs text-gray-400">Referrals</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-white">{ajc.recentTraffic.registrations}</p>
                  <p className="text-xs text-gray-400">Registrations</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-white">{ajc.recentTraffic.staff_on_duty}</p>
                  <p className="text-xs text-gray-400">Staff on Duty</p>
                </div>
              </div>
            )}

            {/* Services & Info */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                {ajc.total_staff || 0} Staff
              </span>
              <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                {ajc.services_offered.length} Services
              </span>
              <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                {ajc.programs_offered.length} Programs
              </span>
              <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                {ajc.languages.join(', ')}
              </span>
              {ajc.wheelchair_accessible && (
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">Accessible</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAJCs.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No job centers match your search</p>
        </div>
      )}

      {/* AJC Detail Modal */}
      <AnimatePresence>
        {selectedAJC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAJC(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedAJC.name}</h2>
                    <p className="text-sm text-gray-400">{selectedAJC.center_type} Center &bull; {selectedAJC.lwdb_name}</p>
                  </div>
                  <button onClick={() => setSelectedAJC(null)} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Contact & Location */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-white text-sm">{selectedAJC.address_street}</p>
                      <p className="text-gray-400 text-sm">{selectedAJC.address_city}, {selectedAJC.address_state} {selectedAJC.address_zip}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">{selectedAJC.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">{selectedAJC.email}</span>
                    </div>
                    {selectedAJC.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-blue-400 text-sm">{selectedAJC.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hours */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Hours of Operation
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(selectedAJC.hours).map(([day, hours]) => (
                      <div key={day} className="bg-gray-800 rounded-lg p-2">
                        <p className="text-xs text-gray-400 capitalize">{day}</p>
                        <p className="text-sm text-white">{hours}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staff & Capacity */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{selectedAJC.total_staff || 0}</p>
                    <p className="text-xs text-gray-400">Total Staff</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{selectedAJC.resource_room_computers || 0}</p>
                    <p className="text-xs text-gray-400">Computers</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{selectedAJC.workshop_room_capacity || 0}</p>
                    <p className="text-xs text-gray-400">Workshop Capacity</p>
                  </div>
                </div>

                {/* Director */}
                {selectedAJC.director_name && (
                  <div className="mb-6 bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Center Director</p>
                    <p className="text-white font-medium">{selectedAJC.director_name}</p>
                    {selectedAJC.director_email && <p className="text-sm text-gray-400">{selectedAJC.director_email}</p>}
                  </div>
                )}

                {/* Accessibility */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Accessibility & Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAJC.wheelchair_accessible && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg">Wheelchair Accessible</span>}
                    {selectedAJC.hearing_assistance && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg">Hearing Assistance</span>}
                    {selectedAJC.vision_assistance && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg">Vision Assistance</span>}
                    {selectedAJC.languages.map((lang, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg">{lang}</span>
                    ))}
                  </div>
                </div>

                {/* Partner Agencies */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Partner Agencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAJC.partner_agencies.map((agency, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg">{agency}</span>
                    ))}
                  </div>
                </div>

                {/* Traffic Stats */}
                {selectedAJC.recentTraffic && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Latest Daily Traffic ({selectedAJC.recentTraffic.date})</h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {[
                        { label: 'Walk-ins', value: selectedAJC.recentTraffic.walk_ins },
                        { label: 'Appointments', value: selectedAJC.recentTraffic.appointments },
                        { label: 'Virtual', value: selectedAJC.recentTraffic.virtual_visits },
                        { label: 'Phone Calls', value: selectedAJC.recentTraffic.phone_calls },
                        { label: 'Referrals', value: selectedAJC.recentTraffic.job_referrals },
                        { label: 'Registrations', value: selectedAJC.recentTraffic.registrations },
                        { label: 'Assessments', value: selectedAJC.recentTraffic.assessments },
                        { label: 'Workshop', value: selectedAJC.recentTraffic.workshop_attendees },
                        { label: 'Resource Room', value: selectedAJC.recentTraffic.resource_room_users },
                        { label: 'Staff on Duty', value: selectedAJC.recentTraffic.staff_on_duty },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-2 text-center">
                          <p className="text-lg font-semibold text-white">{item.value}</p>
                          <p className="text-xs text-gray-400">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => showNotification('Opening full report view...')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                  >
                    View Full Report
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedAJC?.recentTraffic) return;
                      const t = selectedAJC.recentTraffic;
                      const headers = ['Metric', 'Value'];
                      const rows = [
                        ['Center', selectedAJC.name],
                        ['Date', t.date],
                        ['Walk-ins', String(t.walk_ins)],
                        ['Appointments', String(t.appointments)],
                        ['Virtual Visits', String(t.virtual_visits)],
                        ['Phone Calls', String(t.phone_calls)],
                        ['Registrations', String(t.registrations)],
                        ['Assessments', String(t.assessments)],
                        ['Job Referrals', String(t.job_referrals)],
                        ['Workshop Attendees', String(t.workshop_attendees)],
                      ];
                      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const anchor = document.createElement('a');
                      anchor.href = url;
                      anchor.download = `${selectedAJC.name.replace(/\s+/g, '-').toLowerCase()}-traffic.csv`;
                      anchor.click();
                      URL.revokeObjectURL(url);
                      showNotification('Traffic data exported');
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Export Traffic Data
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}
    </div>
  );
};
