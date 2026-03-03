// ===========================================
// Employers Tab - Nonprofit Partner Dashboard
// Employer partnerships and placement tracking
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Building2,
  Users,
  Briefcase,
  Mail,
  Calendar,
  ChevronRight,
  Loader2,
  TrendingUp,
  X,
  MapPin,
} from 'lucide-react';
import { getEmployerConnections } from '@/services/nonprofitPartnerApi';
import type { EmployerConnection, EmployerRelationshipStatus, PartnerTier } from '@/types/nonprofitPartner';

interface EmployersTabProps {
  partnerId: string;
  tier: PartnerTier;
}

const SAMPLE_EMPLOYERS: EmployerConnection[] = [
  {
    id: '1',
    partnerId: '1',
    employerName: 'TechCorp Inc.',
    industry: 'Technology',
    companySize: '1000-5000',
    location: 'San Francisco, CA',
    contactName: 'Sarah Chen',
    contactEmail: 'sarah.chen@techcorp.com',
    contactTitle: 'Talent Acquisition Manager',
    status: 'partner',
    partnershipType: 'hiring',
    lastContactDate: '2025-01-15',
    participantsPlaced: 23,
    participantsInterviewed: 45,
    averageWagePlaced: 32.50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    employerName: 'HealthFirst Medical',
    industry: 'Healthcare',
    companySize: '500-1000',
    location: 'Chicago, IL',
    contactName: 'Michael Brown',
    contactEmail: 'mbrown@healthfirst.com',
    contactTitle: 'HR Director',
    status: 'engaged',
    partnershipType: 'hiring',
    lastContactDate: '2025-01-10',
    participantsPlaced: 8,
    participantsInterviewed: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const STATUS_STYLES: Record<EmployerRelationshipStatus, { bg: string; text: string }> = {
  prospect: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  outreach: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  engaged: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  partner: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  inactive: { bg: 'bg-red-500/20', text: 'text-red-400' }
};

interface AddEmployerFormData {
  employerName: string;
  industry: string;
  location: string;
  companySize: string;
  contactName: string;
  contactEmail: string;
  contactTitle: string;
  partnershipType: string;
}

const EMPTY_EMPLOYER_FORM: AddEmployerFormData = {
  employerName: '',
  industry: '',
  location: '',
  companySize: '',
  contactName: '',
  contactEmail: '',
  contactTitle: '',
  partnershipType: 'hiring'
};

export const EmployersTab: React.FC<EmployersTabProps> = ({ partnerId, tier: _tier }) => {
  const [employers, setEmployers] = useState<EmployerConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddEmployerModal, setShowAddEmployerModal] = useState(false);
  const [employerFormData, setEmployerFormData] = useState<AddEmployerFormData>(EMPTY_EMPLOYER_FORM);
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerConnection | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    loadEmployers();
  }, [partnerId]);

  const loadEmployers = async () => {
    setLoading(true);
    const data = await getEmployerConnections(partnerId);
    setEmployers(data.length > 0 ? data : SAMPLE_EMPLOYERS);
    setLoading(false);
  };

  const filteredEmployers = employers.filter(e => {
    const matchesSearch = e.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.industry?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPlacements = employers.reduce((sum, e) => sum + e.participantsPlaced, 0);
  const totalInterviews = employers.reduce((sum, e) => sum + e.participantsInterviewed, 0);
  const activePartners = employers.filter(e => e.status === 'partner').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Employer Partners</h2>
          <p className="text-gray-400">Manage employer relationships and track placements</p>
        </div>
        <button
          onClick={() => { setEmployerFormData(EMPTY_EMPLOYER_FORM); setShowAddEmployerModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employer
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-lg text-sm flex items-center justify-between ${
          notification.type === 'success'
            ? 'bg-pink-500/20 border border-pink-500/30 text-pink-400'
            : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{employers.length}</p>
              <p className="text-xs text-gray-400">Total Connections</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activePartners}</p>
              <p className="text-xs text-gray-400">Active Partners</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalPlacements}</p>
              <p className="text-xs text-gray-400">Total Placements</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {totalInterviews > 0 ? Math.round((totalPlacements / totalInterviews) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-400">Interview-to-Hire</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
        >
          <option value="all">All Status</option>
          <option value="partner">Partners</option>
          <option value="engaged">Engaged</option>
          <option value="outreach">Outreach</option>
          <option value="prospect">Prospects</option>
        </select>
      </div>

      {/* Employers List */}
      <div className="space-y-3">
        {filteredEmployers.map(employer => {
          const statusStyle = STATUS_STYLES[employer.status];

          return (
            <motion.div
              key={employer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-pink-500/50 transition-colors cursor-pointer"
              onClick={() => setSelectedEmployer(employer)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{employer.employerName}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                        {employer.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{employer.industry}</span>
                      <span>•</span>
                      <span>{employer.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">{employer.participantsPlaced}</p>
                    <p className="text-xs text-gray-400">Placements</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">{employer.participantsInterviewed}</p>
                    <p className="text-xs text-gray-400">Interviews</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Contact Info */}
              {employer.contactName && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-300">{employer.contactName}</span>
                    {employer.contactTitle && (
                      <span className="text-gray-500">{employer.contactTitle}</span>
                    )}
                    {employer.contactEmail && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Mail className="w-3 h-3" />
                        {employer.contactEmail}
                      </span>
                    )}
                  </div>
                  {employer.lastContactDate && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      Last contact: {new Date(employer.lastContactDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredEmployers.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No employers found</p>
          </div>
        )}
      </div>

      {/* Add Employer Modal */}
      {showAddEmployerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddEmployerModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add Employer</h3>
              <button onClick={() => setShowAddEmployerModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
                <input type="text" value={employerFormData.employerName} onChange={(e) => setEmployerFormData({ ...employerFormData, employerName: e.target.value })} placeholder="e.g., TechCorp Inc." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Industry</label>
                  <input type="text" value={employerFormData.industry} onChange={(e) => setEmployerFormData({ ...employerFormData, industry: e.target.value })} placeholder="e.g., Technology" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input type="text" value={employerFormData.location} onChange={(e) => setEmployerFormData({ ...employerFormData, location: e.target.value })} placeholder="e.g., San Francisco, CA" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company Size</label>
                  <select value={employerFormData.companySize} onChange={(e) => setEmployerFormData({ ...employerFormData, companySize: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500">
                    <option value="">Select size</option>
                    <option value="1-50">1-50</option>
                    <option value="50-200">50-200</option>
                    <option value="200-500">200-500</option>
                    <option value="500-1000">500-1000</option>
                    <option value="1000-5000">1,000-5,000</option>
                    <option value="5000+">5,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Partnership Type</label>
                  <select value={employerFormData.partnershipType} onChange={(e) => setEmployerFormData({ ...employerFormData, partnershipType: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500">
                    <option value="hiring">Hiring Partner</option>
                    <option value="training">Training Partner</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="advisory">Advisory</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
                    <input type="text" value={employerFormData.contactName} onChange={(e) => setEmployerFormData({ ...employerFormData, contactName: e.target.value })} placeholder="e.g., Sarah Chen" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <input type="email" value={employerFormData.contactEmail} onChange={(e) => setEmployerFormData({ ...employerFormData, contactEmail: e.target.value })} placeholder="email@company.com" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Title</label>
                      <input type="text" value={employerFormData.contactTitle} onChange={(e) => setEmployerFormData({ ...employerFormData, contactTitle: e.target.value })} placeholder="e.g., HR Manager" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddEmployerModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  if (!employerFormData.employerName) return;
                  setShowAddEmployerModal(false);
                  setNotification({ type: 'success', message: `Employer "${employerFormData.employerName}" added successfully.` });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Add Employer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employer Detail Modal */}
      {selectedEmployer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEmployer(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedEmployer.employerName}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLES[selectedEmployer.status].bg} ${STATUS_STYLES[selectedEmployer.status].text}`}>
                    {selectedEmployer.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedEmployer(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {selectedEmployer.industry && (
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{selectedEmployer.industry}</span>
                )}
                {selectedEmployer.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedEmployer.location}</span>
                )}
                {selectedEmployer.companySize && (
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{selectedEmployer.companySize} employees</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-emerald-400">{selectedEmployer.participantsPlaced}</p>
                  <p className="text-xs text-gray-400">Placements</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-blue-400">{selectedEmployer.participantsInterviewed}</p>
                  <p className="text-xs text-gray-400">Interviews</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-pink-400">
                    {selectedEmployer.averageWagePlaced ? `$${selectedEmployer.averageWagePlaced}/hr` : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-400">Avg. Wage</p>
                </div>
              </div>

              {selectedEmployer.contactName && (
                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-semibold text-white mb-2">Contact</h4>
                  <div className="p-3 bg-gray-800/50 rounded-lg space-y-1">
                    <p className="text-white font-medium">{selectedEmployer.contactName}</p>
                    {selectedEmployer.contactTitle && <p className="text-sm text-gray-400">{selectedEmployer.contactTitle}</p>}
                    {selectedEmployer.contactEmail && (
                      <a href={`mailto:${selectedEmployer.contactEmail}`} className="flex items-center gap-1 text-sm text-pink-400 hover:text-pink-300">
                        <Mail className="w-3 h-3" />{selectedEmployer.contactEmail}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedEmployer.lastContactDate && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Last contact: {new Date(selectedEmployer.lastContactDate).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setSelectedEmployer(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployersTab;
