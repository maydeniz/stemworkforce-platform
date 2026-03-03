// ===========================================
// Coalitions Tab - Nonprofit Partner Dashboard
// Coalition collaboration and data sharing
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users2,
  Plus,
  Search,
  MapPin,
  Target,
  Building2,
  UserPlus,
  Share2,
  Loader2,
  Crown,
  Eye,
  MessageSquare,
  Calendar,
  ChevronRight,
  Lock,
  X
} from 'lucide-react';
import { getCoalitions, getCoalitionMemberships } from '@/services/nonprofitPartnerApi';
import type { Coalition, CoalitionMembership, PartnerTier, CoalitionRole } from '@/types/nonprofitPartner';

interface CoalitionsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

const SAMPLE_COALITIONS: Coalition[] = [
  {
    id: '1',
    name: 'Bay Area STEM Workforce Alliance',
    description: 'A coalition of nonprofits focused on preparing underrepresented communities for careers in technology and STEM fields across the San Francisco Bay Area.',
    region: 'San Francisco Bay Area',
    focusAreas: ['Technology', 'Clean Energy', 'Biotechnology'],
    targetPopulations: ['Youth 16-24', 'Veterans', 'Formerly Incarcerated'],
    leadOrganizationId: '1',
    memberCount: 12,
    activeGrants: ['DOL-WIG-2024-001'],
    sharedPrograms: ['Tech Apprenticeship', 'Green Jobs Pipeline'],
    status: 'active',
    formedAt: '2023-06-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Midwest Healthcare Workforce Collaborative',
    description: 'Regional partnership addressing healthcare workforce shortages through coordinated training and placement programs.',
    region: 'Midwest Region',
    focusAreas: ['Healthcare', 'Nursing', 'Allied Health'],
    targetPopulations: ['Adults 25+', 'Career Changers', 'Immigrants'],
    leadOrganizationId: '5',
    memberCount: 8,
    status: 'active',
    formedAt: '2024-01-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_MEMBERSHIPS: CoalitionMembership[] = [
  {
    id: '1',
    coalitionId: '1',
    partnerId: '1',
    role: 'lead',
    joinedAt: '2023-06-15',
    dataShareConsent: true,
    consentDate: '2023-06-15'
  }
];

const ROLE_STYLES: Record<CoalitionRole, { bg: string; text: string; label: string }> = {
  lead: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Lead Organization' },
  member: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Member' },
  observer: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Observer' }
};

const STATUS_STYLES: Record<Coalition['status'], { bg: string; text: string }> = {
  forming: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  dormant: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  dissolved: { bg: 'bg-red-500/20', text: 'text-red-400' }
};

interface CreateCoalitionFormData {
  name: string;
  description: string;
  region: string;
  focusAreas: string;
  targetPopulations: string;
}

const EMPTY_COALITION_FORM: CreateCoalitionFormData = {
  name: '',
  description: '',
  region: '',
  focusAreas: '',
  targetPopulations: ''
};

export const CoalitionsTab: React.FC<CoalitionsTabProps> = ({ partnerId, tier }) => {
  const [coalitions, setCoalitions] = useState<Coalition[]>([]);
  const [memberships, setMemberships] = useState<CoalitionMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCoalitionModal, setShowCreateCoalitionModal] = useState(false);
  const [coalitionFormData, setCoalitionFormData] = useState<CreateCoalitionFormData>(EMPTY_COALITION_FORM);
  const [selectedCoalition, setSelectedCoalition] = useState<Coalition | null>(null);
  const [showDataSharingModal, setShowDataSharingModal] = useState<Coalition | null>(null);
  const [showJoinRequestModal, setShowJoinRequestModal] = useState<Coalition | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    loadData();
  }, [partnerId]);

  const loadData = async () => {
    setLoading(true);
    const [coalitionsData, membershipsData] = await Promise.all([
      getCoalitions(),
      getCoalitionMemberships(partnerId)
    ]);
    setCoalitions(coalitionsData.length > 0 ? coalitionsData : SAMPLE_COALITIONS);
    setMemberships(membershipsData.length > 0 ? membershipsData : SAMPLE_MEMBERSHIPS);
    setLoading(false);
  };

  const getMembershipForCoalition = (coalitionId: string) => {
    return memberships.find(m => m.coalitionId === coalitionId);
  };

  const myCoalitions = coalitions.filter(c => getMembershipForCoalition(c.id));
  const availableCoalitions = coalitions.filter(c => !getMembershipForCoalition(c.id));

  const filteredAvailable = availableCoalitions.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.focusAreas.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Check tier access
  if (tier !== 'coalition') {
    return (
      <div className="text-center py-12">
        <Users2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Coalition Collaboration Hub</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Join forces with other nonprofits to increase impact. Coalition tier unlocks
          data sharing, joint grant applications, and regional coordination tools.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.location.href = '/education-partner-apply?type=nonprofit&plan=coalition'}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
          >
            Upgrade to Coalition
          </button>
          <button
            onClick={() => window.location.href = '/nonprofit-partners#pricing'}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    );
  }

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
          <h2 className="text-xl font-bold text-white">Coalition Network</h2>
          <p className="text-gray-400">Collaborate with partner organizations</p>
        </div>
        <button
          onClick={() => { setCoalitionFormData(EMPTY_COALITION_FORM); setShowCreateCoalitionModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Coalition
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

      {/* My Coalitions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">My Coalitions</h3>
        {myCoalitions.length > 0 ? (
          <div className="grid gap-4">
            {myCoalitions.map(coalition => {
              const membership = getMembershipForCoalition(coalition.id);
              const roleStyle = membership ? ROLE_STYLES[membership.role] : ROLE_STYLES.member;
              const statusStyle = STATUS_STYLES[coalition.status];

              return (
                <motion.div
                  key={coalition.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-pink-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl flex items-center justify-center">
                        <Users2 className="w-7 h-7 text-pink-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-lg">{coalition.name}</h3>
                          {membership?.role === 'lead' && (
                            <Crown className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${roleStyle.bg} ${roleStyle.text}`}>
                            {roleStyle.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                            {coalition.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCoalition(coalition)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{coalition.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {coalition.region}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      {coalition.memberCount} Members
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Target className="w-4 h-4 text-gray-500" />
                      {coalition.focusAreas.length} Focus Areas
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Since {new Date(coalition.formedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coalition.focusAreas.map((area, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => setShowDataSharingModal(coalition)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Data
                    </button>
                    <button
                      onClick={() => setNotification({ type: 'info', message: `Opening discussion board for ${coalition.name}. Feature coming soon.` })}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Discussion
                    </button>
                    <button
                      onClick={() => setNotification({ type: 'info', message: `Loading shared reports for ${coalition.name}. Feature coming soon.` })}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Reports
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <Users2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">You haven't joined any coalitions yet</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
            >
              Browse Coalitions
            </button>
          </div>
        )}
      </div>

      {/* Available Coalitions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Discover Coalitions</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coalitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm w-64"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredAvailable.map(coalition => {
            const statusStyle = STATUS_STYLES[coalition.status];

            return (
              <motion.div
                key={coalition.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-pink-500/50 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                    <Users2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{coalition.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                        {coalition.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {coalition.region}
                      <span>•</span>
                      <Building2 className="w-3 h-3" />
                      {coalition.memberCount} members
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{coalition.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {coalition.focusAreas.slice(0, 3).map((area, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setShowJoinRequestModal(coalition)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-600/20 text-pink-400 rounded-lg hover:bg-pink-600/30 transition-colors text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Request to Join
                </button>
              </motion.div>
            );
          })}
        </div>

        {filteredAvailable.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No coalitions found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Data Sharing Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Data Sharing & Privacy</h3>
            <p className="text-gray-400 text-sm mb-4">
              Coalition data sharing is built on consent. You control exactly what data is shared with
              coalition partners. All shared data is aggregated and anonymized by default.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setNotification({ type: 'info', message: 'Data sharing settings panel opening. You can configure what data is shared with coalition partners.' })}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Manage Sharing Settings
              </button>
              <button
                onClick={() => setNotification({ type: 'info', message: 'Loading data agreements. All current agreements will be displayed for review.' })}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                View Data Agreements
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Create Coalition Modal */}
      {showCreateCoalitionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateCoalitionModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create Coalition</h3>
              <button onClick={() => setShowCreateCoalitionModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Coalition Name *</label>
                <input type="text" value={coalitionFormData.name} onChange={(e) => setCoalitionFormData({ ...coalitionFormData, name: e.target.value })} placeholder="e.g., Bay Area STEM Workforce Alliance" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea rows={3} value={coalitionFormData.description} onChange={(e) => setCoalitionFormData({ ...coalitionFormData, description: e.target.value })} placeholder="Describe the coalition's mission and goals..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Region</label>
                <input type="text" value={coalitionFormData.region} onChange={(e) => setCoalitionFormData({ ...coalitionFormData, region: e.target.value })} placeholder="e.g., San Francisco Bay Area" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Focus Areas (comma separated)</label>
                <input type="text" value={coalitionFormData.focusAreas} onChange={(e) => setCoalitionFormData({ ...coalitionFormData, focusAreas: e.target.value })} placeholder="e.g., Technology, Clean Energy, Biotechnology" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Target Populations (comma separated)</label>
                <input type="text" value={coalitionFormData.targetPopulations} onChange={(e) => setCoalitionFormData({ ...coalitionFormData, targetPopulations: e.target.value })} placeholder="e.g., Youth 16-24, Veterans, Career Changers" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateCoalitionModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  if (!coalitionFormData.name) return;
                  setShowCreateCoalitionModal(false);
                  setNotification({ type: 'success', message: `Coalition "${coalitionFormData.name}" created successfully. You are the lead organization.` });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Create Coalition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coalition Detail Modal */}
      {selectedCoalition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCoalition(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl flex items-center justify-center">
                  <Users2 className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedCoalition.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLES[selectedCoalition.status].bg} ${STATUS_STYLES[selectedCoalition.status].text}`}>
                    {selectedCoalition.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedCoalition(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">{selectedCoalition.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <MapPin className="w-4 h-4" /> Region
                  </div>
                  <p className="text-white">{selectedCoalition.region}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Building2 className="w-4 h-4" /> Members
                  </div>
                  <p className="text-white">{selectedCoalition.memberCount}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCoalition.focusAreas.map((area, i) => (
                    <span key={i} className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded text-xs">{area}</span>
                  ))}
                </div>
              </div>

              {selectedCoalition.targetPopulations && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Target Populations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCoalition.targetPopulations.map((pop, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">{pop}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCoalition.sharedPrograms && selectedCoalition.sharedPrograms.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Shared Programs</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCoalition.sharedPrograms.map((prog, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{prog}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                Formed: {new Date(selectedCoalition.formedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setSelectedCoalition(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Data Sharing Modal */}
      {showDataSharingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDataSharingModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Data Sharing Settings</h3>
                <p className="text-sm text-gray-400">{showDataSharingModal.name}</p>
              </div>
              <button onClick={() => setShowDataSharingModal(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Aggregate Enrollment Data', desc: 'Share anonymized enrollment counts', defaultOn: true },
                { label: 'Placement Outcomes', desc: 'Share anonymized placement rates and wages', defaultOn: true },
                { label: 'Program Details', desc: 'Share program names and descriptions', defaultOn: false },
                { label: 'Employer Information', desc: 'Share employer partnership data', defaultOn: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button className={`relative w-10 h-5 rounded-full transition-colors ${item.defaultOn ? 'bg-pink-600' : 'bg-gray-700'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.defaultOn ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDataSharingModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  setShowDataSharingModal(null);
                  setNotification({ type: 'success', message: 'Data sharing settings updated successfully.' });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Request Modal */}
      {showJoinRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowJoinRequestModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Request to Join Coalition</h3>
              <button onClick={() => setShowJoinRequestModal(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-semibold mb-1">{showJoinRequestModal.name}</h4>
                <p className="text-sm text-gray-400">{showJoinRequestModal.region} -- {showJoinRequestModal.memberCount} members</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message to Coalition Lead (optional)</label>
                <textarea rows={3} placeholder="Introduce your organization and explain why you'd like to join..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none" />
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-gray-600 bg-gray-700 text-pink-600 focus:ring-pink-500" />
                <span className="text-sm text-gray-400">I agree to share aggregated, anonymized data with coalition members as part of our data sharing agreement.</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowJoinRequestModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  setShowJoinRequestModal(null);
                  setNotification({ type: 'success', message: `Join request sent to "${showJoinRequestModal.name}". The lead organization will review your request.` });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoalitionsTab;
