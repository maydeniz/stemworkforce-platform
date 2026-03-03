import React, { useState } from 'react';
import {
  Building,
  Users,
  Briefcase,
  Search,
  Plus,
  Filter,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  FileText,
  Handshake,
  TrendingUp,
  Award,
  UserPlus,
  Target,
  X,
  Save,
  Send,
  ChevronRight,
} from 'lucide-react';

// Types
interface Employer {
  id: string;
  company_name: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  contact: {
    name: string;
    title: string;
    phone: string;
    email: string;
  };
  status: 'active' | 'prospect' | 'inactive';
  partnership_level: 'basic' | 'preferred' | 'strategic';
  services_used: string[];
  metrics: {
    jobs_posted: number;
    hires_made: number;
    ojt_agreements: number;
    events_participated: number;
  };
  last_contact: string;
  notes?: string;
}

interface JobOrder {
  id: string;
  employer_id: string;
  employer_name: string;
  title: string;
  positions: number;
  filled: number;
  salary_min: number;
  salary_max: number;
  location: string;
  status: 'active' | 'filled' | 'closed' | 'on_hold';
  posted_date: string;
  close_date?: string;
  requirements: string[];
  referrals: number;
}

interface OJTAgreement {
  id: string;
  employer_id: string;
  employer_name: string;
  participant_name: string;
  occupation: string;
  start_date: string;
  end_date: string;
  hourly_wage: number;
  training_hours: number;
  reimbursement_rate: number;
  total_reimbursement: number;
  status: 'active' | 'completed' | 'terminated';
}

// Sample data
const SAMPLE_EMPLOYERS: Employer[] = [
  {
    id: 'emp-001',
    company_name: 'Memorial Health System',
    industry: 'Healthcare',
    size: 'large',
    address: { street: '701 N First St', city: 'Springfield', state: 'IL', zip: '62781' },
    contact: { name: 'Sarah Mitchell', title: 'HR Director', phone: '(217) 555-1234', email: 'smitchell@memorial.org' },
    status: 'active',
    partnership_level: 'strategic',
    services_used: ['Job Postings', 'OJT', 'Hiring Events', 'Custom Training'],
    metrics: { jobs_posted: 45, hires_made: 32, ojt_agreements: 8, events_participated: 12 },
    last_contact: '2024-02-08',
  },
  {
    id: 'emp-002',
    company_name: 'Caterpillar Inc.',
    industry: 'Manufacturing',
    size: 'enterprise',
    address: { street: '100 NE Adams St', city: 'Peoria', state: 'IL', zip: '61629' },
    contact: { name: 'Michael Roberts', title: 'Talent Acquisition Manager', phone: '(309) 555-2345', email: 'mroberts@cat.com' },
    status: 'active',
    partnership_level: 'strategic',
    services_used: ['Job Postings', 'OJT', 'Apprenticeships', 'Hiring Events', 'Veterans Hiring'],
    metrics: { jobs_posted: 78, hires_made: 56, ojt_agreements: 15, events_participated: 8 },
    last_contact: '2024-02-05',
  },
  {
    id: 'emp-003',
    company_name: 'State Farm Insurance',
    industry: 'Financial Services',
    size: 'enterprise',
    address: { street: '1 State Farm Plaza', city: 'Bloomington', state: 'IL', zip: '61710' },
    contact: { name: 'Jennifer Adams', title: 'Workforce Development Lead', phone: '(309) 555-3456', email: 'jadams@statefarm.com' },
    status: 'active',
    partnership_level: 'preferred',
    services_used: ['Job Postings', 'Hiring Events', 'Internships'],
    metrics: { jobs_posted: 34, hires_made: 28, ojt_agreements: 3, events_participated: 6 },
    last_contact: '2024-02-01',
  },
  {
    id: 'emp-004',
    company_name: 'ABC Manufacturing',
    industry: 'Manufacturing',
    size: 'medium',
    address: { street: '500 Industrial Blvd', city: 'Decatur', state: 'IL', zip: '62521' },
    contact: { name: 'Robert Chen', title: 'Plant Manager', phone: '(217) 555-4567', email: 'rchen@abcmfg.com' },
    status: 'active',
    partnership_level: 'basic',
    services_used: ['Job Postings', 'OJT'],
    metrics: { jobs_posted: 12, hires_made: 8, ojt_agreements: 4, events_participated: 2 },
    last_contact: '2024-01-28',
  },
  {
    id: 'emp-005',
    company_name: 'Tech Solutions LLC',
    industry: 'Technology',
    size: 'small',
    address: { street: '200 Tech Park Dr', city: 'Champaign', state: 'IL', zip: '61820' },
    contact: { name: 'Amanda Wilson', title: 'CEO', phone: '(217) 555-5678', email: 'awilson@techsolutions.com' },
    status: 'prospect',
    partnership_level: 'basic',
    services_used: [],
    metrics: { jobs_posted: 0, hires_made: 0, ojt_agreements: 0, events_participated: 0 },
    last_contact: '2024-02-06',
    notes: 'Initial meeting scheduled. Interested in apprenticeship program.',
  },
];

const SAMPLE_JOB_ORDERS: JobOrder[] = [
  {
    id: 'job-001',
    employer_id: 'emp-001',
    employer_name: 'Memorial Health System',
    title: 'Registered Nurse - ICU',
    positions: 5,
    filled: 2,
    salary_min: 65000,
    salary_max: 85000,
    location: 'Springfield, IL',
    status: 'active',
    posted_date: '2024-01-15',
    requirements: ['RN License', 'BSN Preferred', '2+ years ICU experience'],
    referrals: 12,
  },
  {
    id: 'job-002',
    employer_id: 'emp-001',
    employer_name: 'Memorial Health System',
    title: 'Medical Assistant',
    positions: 3,
    filled: 3,
    salary_min: 35000,
    salary_max: 42000,
    location: 'Springfield, IL',
    status: 'filled',
    posted_date: '2024-01-10',
    close_date: '2024-02-05',
    requirements: ['MA Certification', 'BLS Certification'],
    referrals: 18,
  },
  {
    id: 'job-003',
    employer_id: 'emp-002',
    employer_name: 'Caterpillar Inc.',
    title: 'CNC Machinist',
    positions: 8,
    filled: 5,
    salary_min: 45000,
    salary_max: 62000,
    location: 'Peoria, IL',
    status: 'active',
    posted_date: '2024-01-20',
    requirements: ['CNC experience', 'Blueprint reading', 'GD&T knowledge'],
    referrals: 24,
  },
  {
    id: 'job-004',
    employer_id: 'emp-002',
    employer_name: 'Caterpillar Inc.',
    title: 'Industrial Electrician',
    positions: 4,
    filled: 1,
    salary_min: 55000,
    salary_max: 72000,
    location: 'Peoria, IL',
    status: 'active',
    posted_date: '2024-02-01',
    requirements: ['Journeyman License', 'PLC experience', 'Industrial maintenance'],
    referrals: 8,
  },
  {
    id: 'job-005',
    employer_id: 'emp-003',
    employer_name: 'State Farm Insurance',
    title: 'Claims Representative',
    positions: 10,
    filled: 0,
    salary_min: 42000,
    salary_max: 52000,
    location: 'Bloomington, IL',
    status: 'active',
    posted_date: '2024-02-05',
    requirements: ['Bachelor\'s degree preferred', 'Customer service experience', 'Insurance knowledge a plus'],
    referrals: 15,
  },
];

const SAMPLE_OJT_AGREEMENTS: OJTAgreement[] = [
  {
    id: 'ojt-001',
    employer_id: 'emp-001',
    employer_name: 'Memorial Health System',
    participant_name: 'Maria Rodriguez',
    occupation: 'Medical Assistant',
    start_date: '2024-02-05',
    end_date: '2024-05-05',
    hourly_wage: 18.50,
    training_hours: 480,
    reimbursement_rate: 50,
    total_reimbursement: 4440,
    status: 'active',
  },
  {
    id: 'ojt-002',
    employer_id: 'emp-002',
    employer_name: 'Caterpillar Inc.',
    participant_name: 'James Thompson',
    occupation: 'CNC Operator',
    start_date: '2024-01-15',
    end_date: '2024-04-15',
    hourly_wage: 22.00,
    training_hours: 520,
    reimbursement_rate: 50,
    total_reimbursement: 5720,
    status: 'active',
  },
  {
    id: 'ojt-003',
    employer_id: 'emp-004',
    employer_name: 'ABC Manufacturing',
    participant_name: 'Robert Williams',
    occupation: 'Production Technician',
    start_date: '2023-10-01',
    end_date: '2024-01-01',
    hourly_wage: 17.00,
    training_hours: 480,
    reimbursement_rate: 50,
    total_reimbursement: 4080,
    status: 'completed',
  },
];

const SIZE_CONFIG = {
  small: { label: '1-49 employees', color: 'bg-slate-500' },
  medium: { label: '50-249 employees', color: 'bg-blue-500' },
  large: { label: '250-999 employees', color: 'bg-purple-500' },
  enterprise: { label: '1000+ employees', color: 'bg-emerald-500' },
};

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-emerald-500' },
  prospect: { label: 'Prospect', color: 'bg-amber-500' },
  inactive: { label: 'Inactive', color: 'bg-slate-500' },
};

const PARTNERSHIP_CONFIG = {
  basic: { label: 'Basic', color: 'bg-slate-500', icon: Building },
  preferred: { label: 'Preferred', color: 'bg-blue-500', icon: Award },
  strategic: { label: 'Strategic', color: 'bg-emerald-500', icon: Handshake },
};

const JOB_STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-emerald-500' },
  filled: { label: 'Filled', color: 'bg-blue-500' },
  closed: { label: 'Closed', color: 'bg-slate-500' },
  on_hold: { label: 'On Hold', color: 'bg-amber-500' },
};

export const EmployerServices: React.FC = () => {
  const [employers] = useState<Employer[]>(SAMPLE_EMPLOYERS);
  const [jobOrders] = useState<JobOrder[]>(SAMPLE_JOB_ORDERS);
  const [ojtAgreements] = useState<OJTAgreement[]>(SAMPLE_OJT_AGREEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'employers' | 'jobs' | 'ojt'>('employers');
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [showAddEmployerModal, setShowAddEmployerModal] = useState(false);

  // Filter employers
  const filteredEmployers = employers.filter((e) =>
    searchTerm === '' ||
    e.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Aggregate statistics
  const stats = {
    totalEmployers: employers.filter((e) => e.status === 'active').length,
    strategicPartners: employers.filter((e) => e.partnership_level === 'strategic').length,
    activeJobs: jobOrders.filter((j) => j.status === 'active').length,
    openPositions: jobOrders.filter((j) => j.status === 'active').reduce((sum, j) => sum + (j.positions - j.filled), 0),
    activeOJT: ojtAgreements.filter((o) => o.status === 'active').length,
    totalHires: employers.reduce((sum, e) => sum + e.metrics.hires_made, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const daysSince = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Employer Services</h2>
          <p className="text-slate-400 mt-1">
            Manage employer partnerships, job orders, and OJT agreements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <Calendar className="w-4 h-4" />
            Schedule Event
          </button>
          <button
            onClick={() => setShowAddEmployerModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Employer
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Employers</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalEmployers}</p>
            </div>
            <Building className="w-8 h-8 text-slate-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Strategic Partners</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.strategicPartners}</p>
            </div>
            <Handshake className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Job Orders</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{stats.activeJobs}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Open Positions</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{stats.openPositions}</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active OJT</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{stats.activeOJT}</p>
            </div>
            <UserPlus className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Hires</p>
              <p className="text-2xl font-bold text-teal-400 mt-1">{stats.totalHires}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="border-b border-slate-700 px-4">
          <div className="flex gap-6">
            {[
              { key: 'employers', label: 'Employers', count: employers.length },
              { key: 'jobs', label: 'Job Orders', count: jobOrders.filter((j) => j.status === 'active').length },
              { key: 'ojt', label: 'OJT Agreements', count: ojtAgreements.filter((o) => o.status === 'active').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
                <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'employers' ? 'employers' : activeTab === 'jobs' ? 'job orders' : 'OJT agreements'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'employers' && (
            <div className="space-y-3">
              {filteredEmployers.map((employer) => {
                const PartnerIcon = PARTNERSHIP_CONFIG[employer.partnership_level].icon;
                return (
                  <div
                    key={employer.id}
                    className="bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer p-4"
                    onClick={() => setSelectedEmployer(employer)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                          <Building className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white">{employer.company_name}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${STATUS_CONFIG[employer.status].color}`}>
                              {STATUS_CONFIG[employer.status].label}
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white ${PARTNERSHIP_CONFIG[employer.partnership_level].color}`}>
                              <PartnerIcon className="w-3 h-3" />
                              {PARTNERSHIP_CONFIG[employer.partnership_level].label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{employer.industry}</span>
                            <span>•</span>
                            <span>{SIZE_CONFIG[employer.size].label}</span>
                            <span>•</span>
                            <span>{employer.address.city}, {employer.address.state}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <span className="text-slate-500">Contact:</span>
                            <span className="text-slate-300">{employer.contact.name}</span>
                            <span className="text-slate-500">({employer.contact.title})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-400">{employer.metrics.jobs_posted}</p>
                          <p className="text-xs text-slate-500">Jobs Posted</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-400">{employer.metrics.hires_made}</p>
                          <p className="text-xs text-slate-500">Hires Made</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-amber-400">{employer.metrics.ojt_agreements}</p>
                          <p className="text-xs text-slate-500">OJT</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${daysSince(employer.last_contact) > 30 ? 'text-red-400' : 'text-slate-400'}`}>
                            Last contact: {daysSince(employer.last_contact)} days ago
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                    <th className="pb-3 font-medium">Job Title</th>
                    <th className="pb-3 font-medium">Employer</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium text-center">Positions</th>
                    <th className="pb-3 font-medium">Salary Range</th>
                    <th className="pb-3 font-medium text-center">Referrals</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Posted</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {jobOrders.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/50">
                      <td className="py-3">
                        <span className="font-medium text-white">{job.title}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-300">{job.employer_name}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-400">{job.location}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-emerald-400 font-medium">{job.filled}</span>
                        <span className="text-slate-500">/{job.positions}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-300">{formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-blue-400">{job.referrals}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${JOB_STATUS_CONFIG[job.status].color}`}>
                          {JOB_STATUS_CONFIG[job.status].label}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-400">{formatDate(job.posted_date)}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Send className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Edit className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'ojt' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                    <th className="pb-3 font-medium">Participant</th>
                    <th className="pb-3 font-medium">Employer</th>
                    <th className="pb-3 font-medium">Occupation</th>
                    <th className="pb-3 font-medium">Hourly Wage</th>
                    <th className="pb-3 font-medium text-center">Training Hours</th>
                    <th className="pb-3 font-medium">Reimbursement</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {ojtAgreements.map((ojt) => (
                    <tr key={ojt.id} className="hover:bg-slate-800/50">
                      <td className="py-3">
                        <span className="font-medium text-white">{ojt.participant_name}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-300">{ojt.employer_name}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-400">{ojt.occupation}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-emerald-400">${ojt.hourly_wage.toFixed(2)}/hr</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-slate-300">{ojt.training_hours}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-blue-400">{formatCurrency(ojt.total_reimbursement)}</span>
                        <span className="text-slate-500 text-xs ml-1">({ojt.reimbursement_rate}%)</span>
                      </td>
                      <td className="py-3">
                        <div className="text-sm">
                          <p className="text-slate-300">{formatDate(ojt.start_date)}</p>
                          <p className="text-slate-500">to {formatDate(ojt.end_date)}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                          ojt.status === 'active' ? 'bg-emerald-500' :
                          ojt.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                        }`}>
                          {ojt.status.charAt(0).toUpperCase() + ojt.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <FileText className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Edit className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Employer Detail Modal */}
      {selectedEmployer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEmployer(null)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <Building className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedEmployer.company_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${STATUS_CONFIG[selectedEmployer.status].color}`}>
                      {STATUS_CONFIG[selectedEmployer.status].label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${PARTNERSHIP_CONFIG[selectedEmployer.partnership_level].color}`}>
                      {PARTNERSHIP_CONFIG[selectedEmployer.partnership_level].label} Partner
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployer(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact & Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-medium text-white mb-3">Company Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Building className="w-4 h-4" />
                      <span>{selectedEmployer.industry} • {SIZE_CONFIG[selectedEmployer.size].label}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-400">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>
                        {selectedEmployer.address.street}<br />
                        {selectedEmployer.address.city}, {selectedEmployer.address.state} {selectedEmployer.address.zip}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-medium text-white mb-3">Primary Contact</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-white font-medium">{selectedEmployer.contact.name}</p>
                    <p className="text-slate-400">{selectedEmployer.contact.title}</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-4 h-4" />
                      <span>{selectedEmployer.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-4 h-4" />
                      <span>{selectedEmployer.contact.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-4">Partnership Metrics</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <p className="text-3xl font-bold text-emerald-400">{selectedEmployer.metrics.jobs_posted}</p>
                    <p className="text-sm text-slate-400 mt-1">Jobs Posted</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <p className="text-3xl font-bold text-blue-400">{selectedEmployer.metrics.hires_made}</p>
                    <p className="text-sm text-slate-400 mt-1">Hires Made</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <p className="text-3xl font-bold text-amber-400">{selectedEmployer.metrics.ojt_agreements}</p>
                    <p className="text-sm text-slate-400 mt-1">OJT Agreements</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <p className="text-3xl font-bold text-purple-400">{selectedEmployer.metrics.events_participated}</p>
                    <p className="text-sm text-slate-400 mt-1">Events</p>
                  </div>
                </div>
              </div>

              {/* Services Used */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-3">Services Utilized</h4>
                {selectedEmployer.services_used.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployer.services_used.map((service) => (
                      <span key={service} className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No services utilized yet</p>
                )}
              </div>

              {/* Notes */}
              {selectedEmployer.notes && (
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-medium text-white mb-2">Notes</h4>
                  <p className="text-slate-300">{selectedEmployer.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                  <Briefcase className="w-4 h-4" />
                  Create Job Order
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" />
                  New OJT Agreement
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <Calendar className="w-4 h-4" />
                  Log Contact
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Employer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employer Modal */}
      {showAddEmployerModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddEmployerModal(false)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add New Employer</h3>
              <button
                onClick={() => setShowAddEmployerModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Info */}
              <div>
                <h4 className="font-medium text-white mb-3">Company Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Company Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Industry *</label>
                    <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select industry</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Financial Services</option>
                      <option value="retail">Retail</option>
                      <option value="construction">Construction</option>
                      <option value="logistics">Logistics & Transportation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Company Size *</label>
                    <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select size</option>
                      {Object.entries(SIZE_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-medium text-white mb-3">Primary Contact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Job title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Phone *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Email *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="email@company.com"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-medium text-white mb-3">Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Street Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="City"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">State</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="IL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">ZIP</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="62701"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowAddEmployerModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                  Add Employer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerServices;
