import React, { useState } from 'react';
import {
  Building2,
  Users,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Settings,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Briefcase,
  GraduationCap,
  FileText,
  Activity,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';

// Types for AJC Operations
interface AJCCenter {
  id: string;
  name: string;
  type: 'comprehensive' | 'affiliate' | 'specialized';
  lwdb_id: string;
  lwdb_name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email: string;
  website?: string;
  manager: string;
  staff_count: number;
  status: 'open' | 'closed' | 'limited';
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
  };
  services: string[];
  daily_traffic: {
    date: string;
    visitors: number;
    new_registrations: number;
    services_provided: number;
  }[];
  metrics: {
    avg_daily_visitors: number;
    monthly_registrations: number;
    services_this_month: number;
    satisfaction_rating: number;
    wait_time_avg: number;
  };
}

interface DailyTrafficEntry {
  time: string;
  visitors: number;
  registrations: number;
  services: number;
}

// Sample AJC data
const SAMPLE_AJC_CENTERS: AJCCenter[] = [
  {
    id: 'ajc-001',
    name: 'Springfield Comprehensive Career Center',
    type: 'comprehensive',
    lwdb_id: 'lwdb-001',
    lwdb_name: 'Central Illinois Workforce Board',
    address: {
      street: '100 Employment Way',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
    },
    phone: '(217) 555-0100',
    email: 'springfield@ilworknet.com',
    website: 'www.springfieldajc.com',
    manager: 'Patricia Morrison',
    staff_count: 24,
    status: 'open',
    hours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 7:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 4:00 PM',
    },
    services: [
      'Career Counseling',
      'Job Search Assistance',
      'Resume Writing',
      'Skills Assessment',
      'WIOA Enrollment',
      'Veterans Services',
      'Youth Programs',
      'Business Services',
    ],
    daily_traffic: [
      { date: '2024-02-09', visitors: 87, new_registrations: 12, services_provided: 145 },
      { date: '2024-02-08', visitors: 92, new_registrations: 15, services_provided: 156 },
      { date: '2024-02-07', visitors: 78, new_registrations: 8, services_provided: 132 },
      { date: '2024-02-06', visitors: 85, new_registrations: 11, services_provided: 148 },
      { date: '2024-02-05', visitors: 71, new_registrations: 9, services_provided: 125 },
    ],
    metrics: {
      avg_daily_visitors: 82,
      monthly_registrations: 245,
      services_this_month: 3250,
      satisfaction_rating: 4.6,
      wait_time_avg: 12,
    },
  },
  {
    id: 'ajc-002',
    name: 'Decatur Career Center',
    type: 'affiliate',
    lwdb_id: 'lwdb-001',
    lwdb_name: 'Central Illinois Workforce Board',
    address: {
      street: '250 Job Lane',
      city: 'Decatur',
      state: 'IL',
      zip: '62521',
    },
    phone: '(217) 555-0200',
    email: 'decatur@ilworknet.com',
    manager: 'Robert Jenkins',
    staff_count: 12,
    status: 'open',
    hours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 3:00 PM',
    },
    services: [
      'Career Counseling',
      'Job Search Assistance',
      'Resume Writing',
      'Skills Assessment',
      'WIOA Enrollment',
    ],
    daily_traffic: [
      { date: '2024-02-09', visitors: 42, new_registrations: 6, services_provided: 68 },
      { date: '2024-02-08', visitors: 38, new_registrations: 4, services_provided: 55 },
      { date: '2024-02-07', visitors: 45, new_registrations: 7, services_provided: 72 },
    ],
    metrics: {
      avg_daily_visitors: 41,
      monthly_registrations: 98,
      services_this_month: 1420,
      satisfaction_rating: 4.4,
      wait_time_avg: 8,
    },
  },
  {
    id: 'ajc-003',
    name: 'Champaign Career Center',
    type: 'comprehensive',
    lwdb_id: 'lwdb-002',
    lwdb_name: 'East Central Illinois Workforce Board',
    address: {
      street: '500 University Ave',
      city: 'Champaign',
      state: 'IL',
      zip: '61820',
    },
    phone: '(217) 555-0300',
    email: 'champaign@ilworknet.com',
    website: 'www.champaignajc.com',
    manager: 'Linda Garcia',
    staff_count: 18,
    status: 'open',
    hours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 4:00 PM',
    },
    services: [
      'Career Counseling',
      'Job Search Assistance',
      'Resume Writing',
      'Skills Assessment',
      'WIOA Enrollment',
      'Veterans Services',
      'Youth Programs',
    ],
    daily_traffic: [
      { date: '2024-02-09', visitors: 65, new_registrations: 9, services_provided: 112 },
      { date: '2024-02-08', visitors: 72, new_registrations: 11, services_provided: 128 },
    ],
    metrics: {
      avg_daily_visitors: 68,
      monthly_registrations: 178,
      services_this_month: 2680,
      satisfaction_rating: 4.7,
      wait_time_avg: 10,
    },
  },
  {
    id: 'ajc-004',
    name: 'Peoria Youth Career Center',
    type: 'specialized',
    lwdb_id: 'lwdb-003',
    lwdb_name: 'Greater Peoria Workforce Board',
    address: {
      street: '75 Youth Drive',
      city: 'Peoria',
      state: 'IL',
      zip: '61602',
    },
    phone: '(309) 555-0400',
    email: 'peoria.youth@ilworknet.com',
    manager: 'Marcus Williams',
    staff_count: 10,
    status: 'open',
    hours: {
      monday: '10:00 AM - 6:00 PM',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 6:00 PM',
      friday: '10:00 AM - 4:00 PM',
    },
    services: [
      'Youth Career Counseling',
      'Work Experience',
      'Mentoring',
      'GED/Tutoring',
      'Leadership Development',
      'Internship Placement',
    ],
    daily_traffic: [
      { date: '2024-02-09', visitors: 28, new_registrations: 4, services_provided: 45 },
    ],
    metrics: {
      avg_daily_visitors: 32,
      monthly_registrations: 65,
      services_this_month: 920,
      satisfaction_rating: 4.8,
      wait_time_avg: 5,
    },
  },
  {
    id: 'ajc-005',
    name: 'Rockford Career Center',
    type: 'comprehensive',
    lwdb_id: 'lwdb-004',
    lwdb_name: 'Rockford Area Workforce Board',
    address: {
      street: '300 Industry Blvd',
      city: 'Rockford',
      state: 'IL',
      zip: '61101',
    },
    phone: '(815) 555-0500',
    email: 'rockford@ilworknet.com',
    website: 'www.rockfordajc.com',
    manager: 'Susan Taylor',
    staff_count: 20,
    status: 'limited',
    hours: {
      monday: '8:00 AM - 3:00 PM',
      tuesday: '8:00 AM - 3:00 PM',
      wednesday: '8:00 AM - 3:00 PM',
      thursday: 'Closed - Staff Training',
      friday: '8:00 AM - 3:00 PM',
    },
    services: [
      'Career Counseling',
      'Job Search Assistance',
      'Resume Writing',
      'Skills Assessment',
      'WIOA Enrollment',
      'Veterans Services',
      'Reentry Services',
      'Business Services',
    ],
    daily_traffic: [
      { date: '2024-02-09', visitors: 52, new_registrations: 7, services_provided: 85 },
    ],
    metrics: {
      avg_daily_visitors: 58,
      monthly_registrations: 142,
      services_this_month: 1890,
      satisfaction_rating: 4.3,
      wait_time_avg: 15,
    },
  },
];

const CENTER_TYPE_CONFIG = {
  comprehensive: { label: 'Comprehensive', color: 'bg-emerald-500', description: 'Full WIOA services' },
  affiliate: { label: 'Affiliate', color: 'bg-blue-500', description: 'Partner site' },
  specialized: { label: 'Specialized', color: 'bg-purple-500', description: 'Targeted population' },
};

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-emerald-500', icon: Wifi },
  closed: { label: 'Closed', color: 'bg-red-500', icon: WifiOff },
  limited: { label: 'Limited Hours', color: 'bg-amber-500', icon: Clock },
};

export const AJCOperations: React.FC = () => {
  const [centers] = useState<AJCCenter[]>(SAMPLE_AJC_CENTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedCenter, setSelectedCenter] = useState<AJCCenter | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter centers
  const filteredCenters = centers.filter((c) => {
    const matchesSearch =
      searchTerm === '' ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lwdb_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || c.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Aggregate statistics
  const aggregateStats = {
    totalCenters: centers.length,
    totalStaff: centers.reduce((sum, c) => sum + c.staff_count, 0),
    totalVisitorsToday: centers.reduce((sum, c) => sum + (c.daily_traffic[0]?.visitors || 0), 0),
    totalRegistrationsToday: centers.reduce((sum, c) => sum + (c.daily_traffic[0]?.new_registrations || 0), 0),
    avgSatisfaction: (centers.reduce((sum, c) => sum + c.metrics.satisfaction_rating, 0) / centers.length).toFixed(1),
    avgWaitTime: Math.round(centers.reduce((sum, c) => sum + c.metrics.wait_time_avg, 0) / centers.length),
  };

  const formatPhone = (phone: string) => phone;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AJC Operations</h2>
          <p className="text-slate-400 mt-1">
            Monitor and manage American Job Center operations statewide
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <BarChart3 className="w-4 h-4" />
            Performance Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Add Center
          </button>
        </div>
      </div>

      {/* Statewide Statistics */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Centers</p>
              <p className="text-2xl font-bold text-white mt-1">{aggregateStats.totalCenters}</p>
            </div>
            <Building2 className="w-8 h-8 text-slate-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Staff</p>
              <p className="text-2xl font-bold text-white mt-1">{aggregateStats.totalStaff}</p>
            </div>
            <Users className="w-8 h-8 text-slate-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Today's Visitors</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{aggregateStats.totalVisitorsToday}</p>
            </div>
            <UserCheck className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">New Registrations</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{aggregateStats.totalRegistrationsToday}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Satisfaction</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{aggregateStats.avgSatisfaction}/5</p>
            </div>
            <Activity className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Wait Time</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{aggregateStats.avgWaitTime} min</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by center name, city, or LWDB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            {Object.entries(CENTER_TYPE_CONFIG).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
          <div className="flex items-center border border-slate-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Centers Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredCenters.map((center) => {
            const StatusIcon = STATUS_CONFIG[center.status].icon;
            return (
              <div
                key={center.id}
                className="bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer overflow-hidden"
                onClick={() => setSelectedCenter(center)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${CENTER_TYPE_CONFIG[center.type].color}`}>
                          {CENTER_TYPE_CONFIG[center.type].label}
                        </span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white ${STATUS_CONFIG[center.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {STATUS_CONFIG[center.status].label}
                        </span>
                      </div>
                      <h3 className="font-medium text-white">{center.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{center.address.city}, {center.address.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{center.staff_count} staff members</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{center.lwdb_name}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Metrics */}
                <div className="px-4 py-3 bg-slate-900 border-t border-slate-700">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-emerald-400">{center.daily_traffic[0]?.visitors || 0}</p>
                      <p className="text-xs text-slate-500">Today</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-400">{center.metrics.satisfaction_rating}</p>
                      <p className="text-xs text-slate-500">Rating</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-amber-400">{center.metrics.wait_time_avg}m</p>
                      <p className="text-xs text-slate-500">Wait</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Center</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">LWDB</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-300">Staff</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-300">Today</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-300">Rating</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredCenters.map((center) => {
                const StatusIcon = STATUS_CONFIG[center.status].icon;
                return (
                  <tr key={center.id} className="hover:bg-slate-700/50 cursor-pointer" onClick={() => setSelectedCenter(center)}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{center.name}</p>
                        <p className="text-sm text-slate-400">{center.address.city}, {center.address.state}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${CENTER_TYPE_CONFIG[center.type].color}`}>
                        {CENTER_TYPE_CONFIG[center.type].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white w-fit ${STATUS_CONFIG[center.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_CONFIG[center.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300 text-sm">{center.lwdb_name}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-slate-300">{center.staff_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-emerald-400 font-medium">{center.daily_traffic[0]?.visitors || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-amber-400">{center.metrics.satisfaction_rating}/5</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-slate-600 rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-600 rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-600 rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Settings className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredCenters.length === 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No centers found matching your criteria</p>
        </div>
      )}

      {/* Center Detail Modal */}
      {selectedCenter && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCenter(null)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${CENTER_TYPE_CONFIG[selectedCenter.type].color}`}>
                    {CENTER_TYPE_CONFIG[selectedCenter.type].label}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white ${STATUS_CONFIG[selectedCenter.status].color}`}>
                    {React.createElement(STATUS_CONFIG[selectedCenter.status].icon, { className: 'w-3 h-3' })}
                    {STATUS_CONFIG[selectedCenter.status].label}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedCenter.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCenter(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact & Location */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    Location & Contact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">
                      {selectedCenter.address.street}<br />
                      {selectedCenter.address.city}, {selectedCenter.address.state} {selectedCenter.address.zip}
                    </p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-4 h-4" />
                      <span>{formatPhone(selectedCenter.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-4 h-4" />
                      <span>{selectedCenter.email}</span>
                    </div>
                    {selectedCenter.website && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Globe className="w-4 h-4" />
                        <span>{selectedCenter.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Hours of Operation
                  </h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(selectedCenter.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-slate-400 capitalize">{day}:</span>
                        <span className="text-slate-300">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Performance Metrics
                </h4>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">{selectedCenter.metrics.avg_daily_visitors}</p>
                    <p className="text-sm text-slate-400">Avg Daily Visitors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{selectedCenter.metrics.monthly_registrations}</p>
                    <p className="text-sm text-slate-400">Monthly Registrations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{selectedCenter.metrics.services_this_month.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">Services This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">{selectedCenter.metrics.satisfaction_rating}/5</p>
                    <p className="text-sm text-slate-400">Satisfaction Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{selectedCenter.metrics.wait_time_avg} min</p>
                    <p className="text-sm text-slate-400">Avg Wait Time</p>
                  </div>
                </div>
              </div>

              {/* Daily Traffic History */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Recent Daily Traffic
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-700">
                        <th className="text-left py-2">Date</th>
                        <th className="text-center py-2">Visitors</th>
                        <th className="text-center py-2">New Registrations</th>
                        <th className="text-center py-2">Services Provided</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCenter.daily_traffic.map((day, idx) => (
                        <tr key={day.date} className="border-b border-slate-800">
                          <td className="py-2 text-slate-300">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                          <td className="py-2 text-center text-emerald-400 font-medium">{day.visitors}</td>
                          <td className="py-2 text-center text-blue-400 font-medium">{day.new_registrations}</td>
                          <td className="py-2 text-center text-purple-400 font-medium">{day.services_provided}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Services Offered */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  Services Offered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.services.map((service) => (
                    <span key={service} className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Staff & Management */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Staff & Management
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Center Manager:</span>
                    <span className="text-white ml-2">{selectedCenter.manager}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Staff:</span>
                    <span className="text-white ml-2">{selectedCenter.staff_count} employees</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Local Board:</span>
                    <span className="text-white ml-2">{selectedCenter.lwdb_name}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Center
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  View Reports
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <Users className="w-4 h-4" />
                  Manage Staff
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AJCOperations;
