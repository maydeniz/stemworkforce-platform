// ===========================================
// Employers Tab - Employer Services & Job Orders
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Search,
  Download,
  X,
  Building2,
  Target,
  CheckCircle,
  Handshake
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { Employer, JobOrder, OJTAgreement } from '@/types/stateWorkforce';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_EMPLOYERS: Employer[] = [
  {
    id: 'emp-1', company_name: 'Texas Instruments', naics_code: '334413',
    industry_description: 'Semiconductor Manufacturing', company_size: 'ENTERPRISE', employee_count: 30000,
    address_city: 'Dallas', address_state: 'TX',
    primary_contact_name: 'Sarah Mitchell', primary_contact_title: 'Workforce Dev Manager',
    primary_contact_email: 'smitchell@ti.com', primary_contact_phone: '214-555-0100',
    registered_apprenticeship_sponsor: true, ojt_partner: true, wotc_registered: true,
    status: 'ACTIVE', engagement_level: 'HIGH',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'emp-2', company_name: 'Memorial Hermann Health System', naics_code: '622110',
    industry_description: 'Healthcare', company_size: 'LARGE', employee_count: 28000,
    address_city: 'Houston', address_state: 'TX',
    primary_contact_name: 'John Martinez', primary_contact_title: 'Talent Acquisition Director',
    primary_contact_email: 'jmartinez@memhermann.org', primary_contact_phone: '713-555-0200',
    ojt_partner: true, wotc_registered: true,
    status: 'ACTIVE', engagement_level: 'HIGH',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'emp-3', company_name: 'Austin Energy', naics_code: '221112',
    industry_description: 'Electric Utilities', company_size: 'LARGE', employee_count: 1800,
    address_city: 'Austin', address_state: 'TX',
    primary_contact_name: 'Lisa Park', primary_contact_title: 'HR Manager',
    primary_contact_email: 'lpark@austinenergy.com', primary_contact_phone: '512-555-0300',
    registered_apprenticeship_sponsor: true, ojt_partner: true,
    status: 'ACTIVE', engagement_level: 'MEDIUM',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'emp-4', company_name: 'Lone Star Welding & Fabrication', naics_code: '332312',
    industry_description: 'Fabricated Metal Manufacturing', company_size: 'SMALL', employee_count: 45,
    address_city: 'San Antonio', address_state: 'TX',
    primary_contact_name: 'Mike Torres', primary_contact_title: 'Owner',
    primary_contact_email: 'mtorres@lonestarwelding.com', primary_contact_phone: '210-555-0400',
    ojt_partner: true, wotc_registered: true,
    status: 'ACTIVE', engagement_level: 'MEDIUM',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'emp-5', company_name: 'TechForward Solutions', naics_code: '541511',
    industry_description: 'Custom Computer Programming', company_size: 'MEDIUM', employee_count: 250,
    address_city: 'Austin', address_state: 'TX',
    primary_contact_name: 'Amy Chen', primary_contact_title: 'VP of People',
    primary_contact_email: 'achen@techforward.io', primary_contact_phone: '512-555-0500',
    status: 'ACTIVE', engagement_level: 'LOW',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];

const SAMPLE_JOB_ORDERS: JobOrder[] = [
  {
    id: 'jo-1', employer_id: 'emp-1', employer_name: 'Texas Instruments',
    job_title: 'Process Technician', soc_code: '51-9141',
    job_description: 'Semiconductor wafer fabrication process technician', requirements: 'Associate degree or cert in semiconductor tech',
    wage_min: 22, wage_max: 28, wage_type: 'HOURLY', openings: 15, openings_filled: 8,
    employment_type: 'FULL_TIME', work_location_city: 'Dallas', work_location_state: 'TX',
    date_posted: '2025-02-01', expiration_date: '2025-04-30',
    status: 'OPEN', posted_by_staff_id: 'staff-1',
    referrals_count: 45, interviews_count: 22, placements_count: 8,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'jo-2', employer_id: 'emp-2', employer_name: 'Memorial Hermann Health System',
    job_title: 'Certified Nursing Assistant', soc_code: '31-1131',
    job_description: 'CNA for acute care unit', requirements: 'CNA certification, BLS required',
    wage_min: 16, wage_max: 20, wage_type: 'HOURLY', openings: 25, openings_filled: 12,
    employment_type: 'FULL_TIME', work_location_city: 'Houston', work_location_state: 'TX',
    date_posted: '2025-01-15', expiration_date: '2025-05-15',
    status: 'OPEN', posted_by_staff_id: 'staff-2',
    referrals_count: 78, interviews_count: 35, placements_count: 12,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'jo-3', employer_id: 'emp-3', employer_name: 'Austin Energy',
    job_title: 'Electrical Apprentice', soc_code: '47-2111',
    job_description: 'Registered apprenticeship program for electricians', requirements: 'HS diploma/GED, valid driver license',
    wage_min: 18, wage_max: 22, wage_type: 'HOURLY', openings: 10, openings_filled: 10,
    employment_type: 'FULL_TIME', work_location_city: 'Austin', work_location_state: 'TX',
    date_posted: '2024-12-01', expiration_date: '2025-03-01',
    status: 'FILLED', posted_by_staff_id: 'staff-1',
    referrals_count: 56, interviews_count: 28, placements_count: 10,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'jo-4', employer_id: 'emp-4', employer_name: 'Lone Star Welding & Fabrication',
    job_title: 'Welder/Fabricator', soc_code: '51-4121',
    job_description: 'MIG/TIG welder for custom fabrication shop', requirements: 'AWS D1.1 certification preferred',
    wage_min: 20, wage_max: 30, wage_type: 'HOURLY', openings: 5, openings_filled: 2,
    employment_type: 'FULL_TIME', work_location_city: 'San Antonio', work_location_state: 'TX',
    date_posted: '2025-02-15', expiration_date: '2025-05-30',
    status: 'OPEN', posted_by_staff_id: 'staff-3',
    referrals_count: 18, interviews_count: 8, placements_count: 2,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];

const SAMPLE_OJTS: OJTAgreement[] = [
  {
    id: 'ojt-1', employer_id: 'emp-1', employer_name: 'Texas Instruments',
    participant_id: 'p-002', participant_name: 'James Wilson',
    job_title: 'Equipment Technician', soc_code: '49-9041',
    starting_wage: 20, target_wage: 26,
    training_hours: 480, training_weeks: 12, skills_to_learn: ['Equipment Calibration', 'Preventive Maintenance', 'Troubleshooting'],
    reimbursement_rate: 50, estimated_reimbursement: 4800, actual_reimbursement: 2400,
    start_date: '2025-01-15', expected_end_date: '2025-04-15',
    status: 'ACTIVE', case_manager_id: 'cm-02',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'ojt-2', employer_id: 'emp-4', employer_name: 'Lone Star Welding & Fabrication',
    participant_id: 'p-006', participant_name: 'Carlos Rivera',
    job_title: 'Welder Trainee', soc_code: '51-4121',
    starting_wage: 15, target_wage: 22,
    training_hours: 640, training_weeks: 16, skills_to_learn: ['MIG Welding', 'Blueprint Reading', 'Safety Protocols'],
    reimbursement_rate: 75, estimated_reimbursement: 7200, actual_reimbursement: 7200,
    start_date: '2024-09-01', expected_end_date: '2024-12-20', actual_end_date: '2024-12-18',
    status: 'COMPLETED', completion_status: 'SUCCESSFUL', retained_after_training: true,
    case_manager_id: 'cm-03',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];

// ===========================================
// COMPONENT
// ===========================================

const engagementColors: Record<string, string> = {
  HIGH: 'bg-emerald-500/20 text-emerald-400',
  MEDIUM: 'bg-blue-500/20 text-blue-400',
  LOW: 'bg-amber-500/20 text-amber-400',
  NEW: 'bg-purple-500/20 text-purple-400',
};

export const EmployersTab: React.FC = () => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [ojts, setOjts] = useState<OJTAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [engagementFilter, setEngagementFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'employers' | 'jobs' | 'ojt'>('employers');
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEscapeKey(() => setSelectedEmployer(null), !!selectedEmployer);

  const handleExport = () => {
    const headers = ['Company', 'Industry', 'NAICS', 'Contact', 'Email', 'Status', 'Engagement', 'Employees'];
    const rows = filteredEmployers.map(e => [
      `"${e.company_name}"`, `"${e.industry_description || ''}"`, e.naics_code || '',
      `"${e.primary_contact_name}"`, e.primary_contact_email, e.status, e.engagement_level || '', e.employee_count || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employers-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Employer data exported successfully');
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setEmployers(SAMPLE_EMPLOYERS);
      setJobOrders(SAMPLE_JOB_ORDERS);
      setOjts(SAMPLE_OJTS);
    } catch {
      setEmployers(SAMPLE_EMPLOYERS);
      setJobOrders(SAMPLE_JOB_ORDERS);
      setOjts(SAMPLE_OJTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployers = employers.filter(e => {
    const matchesSearch = searchQuery === '' ||
      e.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.industry_description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEngagement = engagementFilter === 'all' || e.engagement_level === engagementFilter;
    return matchesSearch && matchesEngagement;
  });

  const filteredJobs = jobOrders.filter(j =>
    searchQuery === '' ||
    j.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.employer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openJobs = jobOrders.filter(j => j.status === 'OPEN').length;
  const totalOpenings = jobOrders.filter(j => j.status === 'OPEN').reduce((sum, j) => sum + (j.openings - j.openings_filled), 0);
  const totalPlacements = jobOrders.reduce((sum, j) => sum + j.placements_count, 0);
  const activeOJTs = ojts.filter(o => o.status === 'ACTIVE').length;

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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Active Employers</span>
          </div>
          <p className="text-2xl font-bold text-white">{employers.filter(e => e.status === 'ACTIVE').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Open Job Orders</span>
          </div>
          <p className="text-2xl font-bold text-white">{openJobs}</p>
          <p className="text-xs text-emerald-400">{totalOpenings} open positions</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Total Placements</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalPlacements}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Handshake className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">Active OJT Agreements</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeOJTs}</p>
        </motion.div>
      </div>

      {/* View Toggle & Search */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            {(['employers', 'jobs', 'ojt'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {mode === 'employers' ? 'Employers' : mode === 'jobs' ? 'Job Orders' : 'OJT Agreements'}
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          {viewMode === 'employers' && (
            <select
              value={engagementFilter}
              onChange={e => setEngagementFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Engagement</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="NEW">New</option>
            </select>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Employers View */}
      {viewMode === 'employers' && (
        <div className="space-y-3">
          {filteredEmployers.map((employer, idx) => {
            const empJobs = jobOrders.filter(j => j.employer_id === employer.id);
            const empOjts = ojts.filter(o => o.employer_id === employer.id);
            return (
              <motion.div
                key={employer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedEmployer(employer)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{employer.company_name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${engagementColors[employer.engagement_level]}`}>
                        {employer.engagement_level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {employer.industry_description} &bull; {employer.address_city}, {employer.address_state}
                      {employer.employee_count && ` &bull; ${employer.employee_count.toLocaleString()} employees`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {employer.ojt_partner && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded">OJT</span>}
                    {employer.registered_apprenticeship_sponsor && <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded">RA</span>}
                    {employer.wotc_registered && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded">WOTC</span>}
                  </div>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-800 text-sm">
                  <span className="text-gray-400">{empJobs.length} job orders</span>
                  <span className="text-gray-400">{empJobs.reduce((s, j) => s + j.placements_count, 0)} placements</span>
                  <span className="text-gray-400">{empOjts.length} OJT agreements</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Job Orders View */}
      {viewMode === 'jobs' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-sm text-gray-400 p-4">Job Title</th>
                  <th className="text-left text-sm text-gray-400 p-4">Employer</th>
                  <th className="text-center text-sm text-gray-400 p-4">Openings</th>
                  <th className="text-center text-sm text-gray-400 p-4">Filled</th>
                  <th className="text-center text-sm text-gray-400 p-4">Referrals</th>
                  <th className="text-right text-sm text-gray-400 p-4">Wage</th>
                  <th className="text-right text-sm text-gray-400 p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-white font-medium">{job.job_title}</p>
                      <p className="text-xs text-gray-400">{job.employment_type.replace('_', ' ')}</p>
                    </td>
                    <td className="p-4 text-gray-300">{job.employer_name}</td>
                    <td className="p-4 text-center text-white">{job.openings}</td>
                    <td className="p-4 text-center text-emerald-400">{job.openings_filled}</td>
                    <td className="p-4 text-center text-blue-400">{job.referrals_count}</td>
                    <td className="p-4 text-right text-white">
                      ${job.wage_min}-${job.wage_max}/{job.wage_type === 'HOURLY' ? 'hr' : 'yr'}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        job.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' :
                        job.status === 'FILLED' ? 'bg-blue-500/20 text-blue-400' :
                        job.status === 'EXPIRED' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OJT View */}
      {viewMode === 'ojt' && (
        <div className="space-y-3">
          {ojts.map((ojt, idx) => (
            <motion.div
              key={ojt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{ojt.job_title}</h3>
                  <p className="text-sm text-gray-400">{ojt.employer_name} &bull; {ojt.participant_name}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  ojt.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                  ojt.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400' :
                  ojt.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {ojt.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Starting Wage</p>
                  <p className="text-white font-medium">${ojt.starting_wage}/hr</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Target Wage</p>
                  <p className="text-white font-medium">${ojt.target_wage}/hr</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Training</p>
                  <p className="text-white font-medium">{ojt.training_hours}hrs / {ojt.training_weeks}wks</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Reimbursement Rate</p>
                  <p className="text-white font-medium">{ojt.reimbursement_rate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Est. Reimbursement</p>
                  <p className="text-white font-medium">${ojt.estimated_reimbursement.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap gap-2">
                {ojt.skills_to_learn.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">{skill}</span>
                ))}
              </div>
              {ojt.completion_status && (
                <div className="mt-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">
                    {ojt.completion_status} {ojt.retained_after_training && '- Retained'}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Employer Detail Modal */}
      <AnimatePresence>
        {selectedEmployer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEmployer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedEmployer.company_name}</h2>
                    <p className="text-sm text-gray-400">{selectedEmployer.industry_description}</p>
                  </div>
                  <button onClick={() => setSelectedEmployer(null)} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Primary Contact</p>
                    <p className="text-white">{selectedEmployer.primary_contact_name}</p>
                    <p className="text-sm text-gray-400">{selectedEmployer.primary_contact_title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contact Info</p>
                    <p className="text-white">{selectedEmployer.primary_contact_email}</p>
                    <p className="text-sm text-gray-400">{selectedEmployer.primary_contact_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Company Size</p>
                    <p className="text-white">{selectedEmployer.company_size} ({selectedEmployer.employee_count?.toLocaleString() || 'N/A'} employees)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">NAICS Code</p>
                    <p className="text-white">{selectedEmployer.naics_code || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployer.ojt_partner && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg">OJT Partner</span>}
                    {selectedEmployer.registered_apprenticeship_sponsor && <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-lg">Registered Apprenticeship</span>}
                    {selectedEmployer.wotc_registered && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg">WOTC Registered</span>}
                  </div>
                </div>

                {/* Employer Job Orders */}
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">Job Orders</p>
                  <div className="space-y-2">
                    {jobOrders.filter(j => j.employer_id === selectedEmployer.id).map(job => (
                      <div key={job.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{job.job_title}</p>
                          <p className="text-xs text-gray-400">{job.openings_filled}/{job.openings} filled &bull; {job.referrals_count} referrals</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          job.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>{job.status}</span>
                      </div>
                    ))}
                    {jobOrders.filter(j => j.employer_id === selectedEmployer.id).length === 0 && (
                      <p className="text-sm text-gray-500">No job orders</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
                    View Full Profile
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                    Create Job Order
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
