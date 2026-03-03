// ===========================================
// Employer Network Tab - Partner Dashboard
// Browse and connect with employer partners
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  MapPin,
  Users,
  Briefcase,
  Plus,
  CheckCircle,
  Mail,
  ChevronRight,
  Loader2
} from 'lucide-react';
import {
  getEmployerConnections,
  createEmployerConnection,
  type EmployerConnection
} from '@/services/educationPartnerApi';

// ===========================================
// TYPES
// ===========================================

interface EmployerNetworkTabProps {
  partnerId: string;
  canAccessNetwork: boolean;
}

interface Employer {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  size: string;
  hiringIn: string[];
  openPositions: number;
  avgSalary: string;
  connected: boolean;
}

// ===========================================
// SAMPLE EMPLOYER DATA (Would come from API)
// ===========================================

const SAMPLE_EMPLOYERS: Employer[] = [
  {
    id: '1',
    name: 'Intel Corporation',
    industry: 'Semiconductor',
    location: 'Santa Clara, CA',
    size: '100,000+ employees',
    hiringIn: ['AI/ML', 'Hardware Engineering', 'Software Development'],
    openPositions: 156,
    avgSalary: '$125K',
    connected: true
  },
  {
    id: '2',
    name: 'Google',
    industry: 'Technology',
    location: 'Mountain View, CA',
    size: '150,000+ employees',
    hiringIn: ['AI/ML', 'Cloud Computing', 'Software Engineering'],
    openPositions: 342,
    avgSalary: '$145K',
    connected: false
  },
  {
    id: '3',
    name: 'Lockheed Martin',
    industry: 'Aerospace & Defense',
    location: 'Bethesda, MD',
    size: '110,000+ employees',
    hiringIn: ['Cybersecurity', 'Systems Engineering', 'Software Development'],
    openPositions: 89,
    avgSalary: '$115K',
    connected: true
  },
  {
    id: '4',
    name: 'Nvidia',
    industry: 'Semiconductor',
    location: 'Santa Clara, CA',
    size: '25,000+ employees',
    hiringIn: ['AI/ML', 'GPU Architecture', 'Deep Learning'],
    openPositions: 234,
    avgSalary: '$155K',
    connected: false
  },
  {
    id: '5',
    name: 'Amazon Web Services',
    industry: 'Cloud Computing',
    location: 'Seattle, WA',
    size: '100,000+ employees',
    hiringIn: ['Cloud Infrastructure', 'DevOps', 'Solutions Architecture'],
    openPositions: 456,
    avgSalary: '$135K',
    connected: false
  },
  {
    id: '6',
    name: 'Sandia National Laboratories',
    industry: 'National Security R&D',
    location: 'Albuquerque, NM',
    size: '15,000+ employees',
    hiringIn: ['Nuclear Engineering', 'Cybersecurity', 'AI Research'],
    openPositions: 67,
    avgSalary: '$105K',
    connected: true
  }
];

const INDUSTRIES = [
  'All Industries',
  'Technology',
  'Semiconductor',
  'Aerospace & Defense',
  'Cloud Computing',
  'Healthcare',
  'Finance',
  'National Security R&D'
];

const CONNECTION_TYPES = [
  { value: 'hiring_partner', label: 'Hiring Partner', description: 'Direct hiring relationship for graduates' },
  { value: 'internship_provider', label: 'Internship Provider', description: 'Provides internship opportunities' },
  { value: 'advisory_board', label: 'Advisory Board', description: 'Curriculum and program guidance' },
  { value: 'sponsor', label: 'Sponsor', description: 'Financial or equipment sponsor' },
  { value: 'guest_speaker', label: 'Guest Speaker', description: 'Guest lectures and workshops' }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const EmployerNetworkTab: React.FC<EmployerNetworkTabProps> = ({ partnerId, canAccessNetwork }) => {
  const [connections, setConnections] = useState<EmployerConnection[]>([]);
  const [employers, setEmployers] = useState<Employer[]>(SAMPLE_EMPLOYERS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [showConnected, setShowConnected] = useState(false);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [connectionType, setConnectionType] = useState('hiring_partner');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailEmployer, setDetailEmployer] = useState<Employer | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadConnections();
  }, [partnerId]);

  const loadConnections = async () => {
    setLoading(true);
    const data = await getEmployerConnections(partnerId);
    setConnections(data);
    setLoading(false);
  };

  // Filter employers
  const filteredEmployers = employers.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.hiringIn.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = industryFilter === 'All Industries' || e.industry === industryFilter;
    const matchesConnected = !showConnected || e.connected;
    return matchesSearch && matchesIndustry && matchesConnected;
  });

  // Handle connection request
  const handleConnect = async () => {
    if (!selectedEmployer) return;

    setConnectingTo(selectedEmployer.id);

    const connection = await createEmployerConnection(partnerId, {
      employerName: selectedEmployer.name,
      connectionType: connectionType as EmployerConnection['connectionType'],
      status: 'pending',
      studentsPlaced: 0,
      internshipsProvided: 0,
      eventsHosted: 0
    });

    if (connection) {
      await loadConnections();
      setShowConnectionModal(false);
      setSelectedEmployer(null);
    }

    setConnectingTo(null);
  };

  if (!canAccessNetwork) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Employer Network Access</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          Connect with 500+ employers actively hiring in AI, quantum, semiconductor, and other emerging tech sectors.
          Upgrade to Growth or Enterprise to access the full employer network.
        </p>
        <button onClick={() => setShowUpgradeModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
          Upgrade to Access
          <ChevronRight className="w-4 h-4" />
        </button>

        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">Upgrade Your Plan</h3>
              <p className="text-gray-400 mb-4">
                Access the full employer network with 500+ companies actively hiring in STEM fields.
                Upgrade to Growth or Enterprise to unlock this feature.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  Browse and connect with 500+ employers
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  Direct hiring partnerships
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  Internship placement tracking
                </li>
              </ul>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Upgrade Now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Employer Network</h2>
        <p className="text-gray-400">Browse and connect with 500+ employers in emerging tech sectors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{connections.filter(c => c.status === 'active').length}</div>
          <div className="text-sm text-gray-400">Active Connections</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{connections.filter(c => c.status === 'pending').length}</div>
          <div className="text-sm text-gray-400">Pending Requests</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{connections.reduce((sum, c) => sum + c.studentsPlaced, 0)}</div>
          <div className="text-sm text-gray-400">Students Placed</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">500+</div>
          <div className="text-sm text-gray-400">Available Employers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employers, industries, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          {INDUSTRIES.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={showConnected}
            onChange={(e) => setShowConnected(e.target.checked)}
            className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-white text-sm">Connected only</span>
        </label>
      </div>

      {/* Employer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployers.map((employer) => (
          <motion.div
            key={employer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{employer.name}</h3>
                  <p className="text-sm text-gray-400">{employer.industry}</p>
                </div>
              </div>
              {employer.connected && (
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Connected
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                {employer.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                {employer.size}
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <Briefcase className="w-4 h-4" />
                {employer.openPositions} open positions
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Hiring in:</p>
              <div className="flex flex-wrap gap-1">
                {employer.hiringIn.slice(0, 3).map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <span className="text-sm text-gray-400">Avg: {employer.avgSalary}</span>
              {employer.connected ? (
                <button onClick={() => { setDetailEmployer(employer); setShowDetailsModal(true); }} className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedEmployer(employer);
                    setShowConnectionModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Employer Details Modal */}
      {showDetailsModal && detailEmployer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setShowDetailsModal(false); setDetailEmployer(null); }}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{detailEmployer.name}</h3>
                <p className="text-sm text-gray-400">{detailEmployer.industry}</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-gray-400" /> {detailEmployer.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-4 h-4 text-gray-400" /> {detailEmployer.size}
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <Briefcase className="w-4 h-4" /> {detailEmployer.openPositions} open positions
              </div>
              <div className="text-sm text-gray-300">Average Salary: <span className="text-white font-medium">{detailEmployer.avgSalary}</span></div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Hiring in:</p>
              <div className="flex flex-wrap gap-1">
                {detailEmployer.hiringIn.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">{skill}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowDetailsModal(false); setDetailEmployer(null); }} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowDetailsModal(false); setDetailEmployer(null); }} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Message Partner</button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Request Modal */}
      {showConnectionModal && selectedEmployer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-white mb-2">Connect with {selectedEmployer.name}</h3>
            <p className="text-gray-400 mb-6">
              Send a partnership request to establish a connection with this employer.
            </p>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Partnership Type</label>
              <div className="space-y-2">
                {CONNECTION_TYPES.map(type => (
                  <label
                    key={type.value}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      connectionType === type.value
                        ? 'bg-indigo-600/20 border border-indigo-500'
                        : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="connectionType"
                      value={type.value}
                      checked={connectionType === type.value}
                      onChange={(e) => setConnectionType(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-white">{type.label}</p>
                      <p className="text-sm text-gray-400">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConnectionModal(false);
                  setSelectedEmployer(null);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={connectingTo === selectedEmployer.id}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {connectingTo === selectedEmployer.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                Send Request
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmployerNetworkTab;
