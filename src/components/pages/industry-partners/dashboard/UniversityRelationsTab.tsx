// ===========================================
// University Relations Tab - Industry Partner Dashboard
// Campus recruiting and partnership management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Building2,
  Users,
  Calendar,
  MapPin,
  GraduationCap,
  Clock,
  Loader2,
  Mail,
  Phone,
  ChevronRight
} from 'lucide-react';
import { getUniversityRelationships } from '@/services/industryPartnerApi';
import type { UniversityRelationship, RelationshipStatus, PartnerTier } from '@/types/industryPartner';

// ===========================================
// TYPES
// ===========================================

interface UniversityRelationsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

// ===========================================
// CONSTANTS
// ===========================================

const RELATIONSHIP_STATUSES: { value: RelationshipStatus; label: string; color: string }[] = [
  { value: 'prospect', label: 'Prospect', color: 'bg-gray-500' },
  { value: 'outreach', label: 'Outreach', color: 'bg-blue-500' },
  { value: 'engaged', label: 'Engaged', color: 'bg-purple-500' },
  { value: 'partner', label: 'Partner', color: 'bg-emerald-500' },
  { value: 'inactive', label: 'Inactive', color: 'bg-red-500' }
];

// Sample university data
const SAMPLE_RELATIONSHIPS: UniversityRelationship[] = [
  {
    id: '1',
    partnerId: 'demo',
    institutionName: 'MIT',
    status: 'partner',
    partnershipType: 'recruiting',
    primaryContact: { name: 'Dr. Sarah Chen', title: 'Career Services Director', email: 'schen@mit.edu', phone: '617-555-0123' },
    targetPrograms: ['Computer Science', 'Electrical Engineering'],
    targetMajors: ['CS', 'EECS', 'AI'],
    lastContactDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextFollowUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hiresFromInstitution: 12,
    internsFromInstitution: 8,
    eventsAttended: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: 'demo',
    institutionName: 'Stanford University',
    status: 'engaged',
    partnershipType: 'recruiting',
    primaryContact: { name: 'Mark Johnson', title: 'Industry Relations', email: 'mjohnson@stanford.edu' },
    targetPrograms: ['Computer Science', 'Data Science'],
    targetMajors: ['CS', 'Stats', 'ML'],
    lastContactDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hiresFromInstitution: 5,
    internsFromInstitution: 3,
    eventsAttended: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    partnerId: 'demo',
    institutionName: 'Georgia Tech',
    status: 'outreach',
    partnershipType: 'recruiting',
    targetPrograms: ['Computer Science', 'Cybersecurity'],
    targetMajors: ['CS', 'InfoSec'],
    hiresFromInstitution: 0,
    internsFromInstitution: 0,
    eventsAttended: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Universities available to connect with
const AVAILABLE_UNIVERSITIES = [
  { name: 'Carnegie Mellon University', location: 'Pittsburgh, PA', programs: ['CS', 'AI', 'Robotics'], students: '7,000+' },
  { name: 'UC Berkeley', location: 'Berkeley, CA', programs: ['CS', 'EECS', 'Data Science'], students: '12,000+' },
  { name: 'University of Michigan', location: 'Ann Arbor, MI', programs: ['CS', 'Engineering', 'Data Science'], students: '15,000+' },
  { name: 'Purdue University', location: 'West Lafayette, IN', programs: ['CS', 'Engineering', 'Cybersecurity'], students: '10,000+' },
  { name: 'University of Texas at Austin', location: 'Austin, TX', programs: ['CS', 'ECE', 'AI'], students: '12,000+' },
  { name: 'University of Washington', location: 'Seattle, WA', programs: ['CS', 'AI/ML', 'Data Science'], students: '8,000+' }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const UniversityRelationsTab: React.FC<UniversityRelationsTabProps> = ({ partnerId, tier: _tier }) => {
  const [relationships, setRelationships] = useState<UniversityRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<'relationships' | 'discover'>('relationships');
  const [selectedRelationship, setSelectedRelationship] = useState<UniversityRelationship | null>(null);
  const [requestingIntro, setRequestingIntro] = useState<string | null>(null);
  const [introNotification, setIntroNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadRelationships();
  }, [partnerId]);

  const handleRequestIntroduction = async (universityName: string) => {
    setRequestingIntro(universityName);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRequestingIntro(null);
    setIntroNotification({
      type: 'success',
      message: `Introduction request sent for ${universityName}! Our university relations team will connect you with the career services office within 2-3 business days.`
    });
    setTimeout(() => setIntroNotification(null), 5000);
  };

  const loadRelationships = async () => {
    setLoading(true);
    const data = await getUniversityRelationships(partnerId);
    setRelationships(data.length > 0 ? data : SAMPLE_RELATIONSHIPS);
    setLoading(false);
  };

  // Filter relationships
  const filteredRelationships = relationships.filter(r => {
    const matchesSearch = r.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalHires = relationships.reduce((sum, r) => sum + r.hiresFromInstitution, 0);
  const totalInterns = relationships.reduce((sum, r) => sum + r.internsFromInstitution, 0);
  const activePartners = relationships.filter(r => r.status === 'partner').length;

  const getStatusInfo = (status: RelationshipStatus) =>
    RELATIONSHIP_STATUSES.find(s => s.value === status) || RELATIONSHIP_STATUSES[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {introNotification && (
        <div className={`p-4 rounded-lg text-sm flex items-center justify-between ${
          introNotification.type === 'success'
            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
            : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          <span>{introNotification.message}</span>
          <button onClick={() => setIntroNotification(null)} className="ml-4 hover:opacity-80">
            <span className="text-lg">&times;</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">University Relations</h2>
          <p className="text-gray-400">Manage campus recruiting partnerships</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('relationships')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'relationships'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Relationships
          </button>
          <button
            onClick={() => setActiveView('discover')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'discover'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{relationships.length}</div>
          <div className="text-sm text-gray-400">Universities</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-400">{activePartners}</div>
          <div className="text-sm text-gray-400">Active Partners</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{totalHires}</div>
          <div className="text-sm text-gray-400">Total Hires</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{totalInterns}</div>
          <div className="text-sm text-gray-400">Total Interns</div>
        </div>
      </div>

      {activeView === 'relationships' ? (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              {RELATIONSHIP_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Relationships List */}
          <div className="space-y-4">
            {filteredRelationships.map((rel) => {
              const statusInfo = getStatusInfo(rel.status);
              return (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedRelationship(rel)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{rel.institutionName}</h3>
                        <p className="text-sm text-gray-400 capitalize">{rel.partnershipType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 ${statusInfo.color}/20 rounded text-xs`}
                        style={{ backgroundColor: `${statusInfo.color.replace('bg-', '')}20` }}
                      >
                        {statusInfo.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{rel.hiresFromInstitution}</span>
                      <span className="text-gray-400">hires</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{rel.internsFromInstitution}</span>
                      <span className="text-gray-400">interns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{rel.eventsAttended}</span>
                      <span className="text-gray-400">events</span>
                    </div>
                    {rel.lastContactDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        Last contact: {new Date(rel.lastContactDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {rel.targetMajors && rel.targetMajors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {rel.targetMajors.map((major, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                          {major}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {filteredRelationships.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No university relationships found</p>
                <button
                  onClick={() => setActiveView('discover')}
                  className="mt-4 text-emerald-400 hover:text-emerald-300"
                >
                  Discover universities to connect with
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Discover Universities */
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Universities Available for Partnership</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_UNIVERSITIES.map((uni, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{uni.name}</h4>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {uni.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    {uni.students} STEM students
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {uni.programs.map((prog, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleRequestIntroduction(uni.name)}
                  disabled={requestingIntro === uni.name}
                  className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 disabled:bg-emerald-600/10 text-emerald-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {requestingIntro === uni.name ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    'Request Introduction'
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Relationship Detail Modal */}
      {selectedRelationship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedRelationship(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{selectedRelationship.institutionName}</h3>
              <button
                onClick={() => setSelectedRelationship(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Type */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 ${getStatusInfo(selectedRelationship.status).color}/20 rounded text-sm`}>
                  {getStatusInfo(selectedRelationship.status).label}
                </span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm capitalize">
                  {selectedRelationship.partnershipType}
                </span>
              </div>

              {/* Primary Contact */}
              {selectedRelationship.primaryContact && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Primary Contact</h4>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="font-medium text-white">{selectedRelationship.primaryContact.name}</p>
                    <p className="text-sm text-gray-400">{selectedRelationship.primaryContact.title}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <a
                        href={`mailto:${selectedRelationship.primaryContact.email}`}
                        className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
                      >
                        <Mail className="w-4 h-4" />
                        {selectedRelationship.primaryContact.email}
                      </a>
                      {selectedRelationship.primaryContact.phone && (
                        <a
                          href={`tel:${selectedRelationship.primaryContact.phone}`}
                          className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
                        >
                          <Phone className="w-4 h-4" />
                          {selectedRelationship.primaryContact.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Metrics */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Metrics</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">{selectedRelationship.hiresFromInstitution}</div>
                    <div className="text-xs text-gray-400">Hires</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">{selectedRelationship.internsFromInstitution}</div>
                    <div className="text-xs text-gray-400">Interns</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">{selectedRelationship.eventsAttended}</div>
                    <div className="text-xs text-gray-400">Events</div>
                  </div>
                </div>
              </div>

              {/* Target Programs */}
              {selectedRelationship.targetPrograms && selectedRelationship.targetPrograms.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Target Programs</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRelationship.targetPrograms.map((prog, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                {selectedRelationship.lastContactDate && (
                  <span>Last contact: {new Date(selectedRelationship.lastContactDate).toLocaleDateString()}</span>
                )}
                {selectedRelationship.nextFollowUpDate && (
                  <span className="text-amber-400">
                    Follow up: {new Date(selectedRelationship.nextFollowUpDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Notes */}
              {selectedRelationship.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Notes</h4>
                  <p className="text-gray-400 text-sm">{selectedRelationship.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UniversityRelationsTab;
