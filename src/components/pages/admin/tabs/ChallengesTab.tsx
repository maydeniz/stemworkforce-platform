import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Trophy, Plus, Search, Edit2, Trash2,
  DollarSign, X, Save, Zap,
  Layers, Settings
} from 'lucide-react';
import type { IndustryType, ChallengeType, ChallengeStatus } from '@/types';

// ===========================================
// CHALLENGES ADMIN TAB
// ===========================================

// Theme classes helper (same pattern as other admin tabs)
const getThemeClasses = (isDark: boolean) => ({
  bgPrimary: isDark ? 'bg-slate-950' : 'bg-slate-50',
  bgSecondary: isDark ? 'bg-slate-900' : 'bg-white',
  bgTertiary: isDark ? 'bg-slate-800' : 'bg-slate-100',
  borderPrimary: isDark ? 'border-slate-800' : 'border-slate-200',
  borderSecondary: isDark ? 'border-slate-700' : 'border-slate-300',
  textPrimary: isDark ? 'text-white' : 'text-slate-900',
  textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
  textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
  inputBg: isDark ? 'bg-slate-900' : 'bg-white',
  inputBorder: isDark ? 'border-slate-700' : 'border-slate-300',
  cardBg: isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm',
  cardHover: isDark ? 'hover:border-slate-700' : 'hover:border-slate-300 hover:shadow-md',
  buttonPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  buttonSecondary: isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900',
});

// Challenge type options
const CHALLENGE_TYPES: { value: ChallengeType; label: string; description: string }[] = [
  { value: 'ideation', label: 'Ideation', description: 'Brainstorm innovative concepts and ideas' },
  { value: 'prototype', label: 'Prototype', description: 'Build working prototypes or MVPs' },
  { value: 'solution', label: 'Solution', description: 'Complete solution delivery' },
  { value: 'research', label: 'Research', description: 'Scientific or technical research projects' },
  { value: 'hackathon', label: 'Hackathon', description: 'Time-limited intensive coding events' },
  { value: 'grand-challenge', label: 'Grand Challenge', description: 'Multi-phase, large prize competitions' },
];

// Industry options
const INDUSTRY_OPTIONS: { value: IndustryType; label: string; icon: string; color: string }[] = [
  { value: 'semiconductor', label: 'Semiconductor', icon: '💎', color: 'blue' },
  { value: 'nuclear', label: 'Nuclear Energy', icon: '⚛️', color: 'yellow' },
  { value: 'ai', label: 'Artificial Intelligence', icon: '🤖', color: 'violet' },
  { value: 'quantum', label: 'Quantum Computing', icon: '🔮', color: 'purple' },
  { value: 'cybersecurity', label: 'Cybersecurity', icon: '🔒', color: 'red' },
  { value: 'aerospace', label: 'Aerospace', icon: '🚀', color: 'sky' },
  { value: 'biotech', label: 'Biotechnology', icon: '🧬', color: 'green' },
  { value: 'robotics', label: 'Robotics', icon: '🤖', color: 'orange' },
  { value: 'clean-energy', label: 'Clean Energy', icon: '🌱', color: 'emerald' },
  { value: 'manufacturing', label: 'Advanced Manufacturing', icon: '🏭', color: 'slate' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥', color: 'pink' },
];

// Status options
const STATUS_OPTIONS: { value: ChallengeStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'slate' },
  { value: 'upcoming', label: 'Upcoming', color: 'blue' },
  { value: 'registration-open', label: 'Registration Open', color: 'emerald' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'judging', label: 'Judging', color: 'amber' },
  { value: 'completed', label: 'Completed', color: 'violet' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
];

// Tab types
type TabType = 'challenges' | 'industries' | 'settings';

// Challenge form interface
interface ChallengeFormData {
  title: string;
  shortDescription: string;
  description: string;
  problemStatement: string;
  type: ChallengeType;
  industry: IndustryType;
  industries: IndustryType[];
  status: ChallengeStatus;
  totalPrizePool: number;
  registrationDeadline: string;
  submissionDeadline: string;
  judgingStartDate: string;
  judgingEndDate: string;
  winnersAnnouncedDate: string;
  maxSubmissionsPerSolver: number;
  teamSizeMin: number;
  teamSizeMax: number;
  skills: string[];
  tags: string[];
  sponsorName: string;
  sponsorLogo: string;
  isFeatured: boolean;
  isPublic: boolean;
}

// Industry form interface
interface IndustryFormData {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  gradient: string;
  tagline: string;
  description: string;
  isActive: boolean;
}

const ChallengesTab = () => {
  const { isDark } = useTheme();
  const tc = getThemeClasses(isDark);

  // State
  const [activeSubTab, setActiveSubTab] = useState<TabType>('challenges');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [industries, setIndustries] = useState<IndustryFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  // Modal state
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<any | null>(null);
  const [editingIndustry, setEditingIndustry] = useState<IndustryFormData | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeChallenges: 0,
    totalPrizeValue: 0,
    totalParticipants: 0,
  });

  useEffect(() => {
    fetchChallenges();
    fetchIndustries();
  }, [statusFilter, industryFilter]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (industryFilter !== 'all') {
        query = query.contains('industries', [industryFilter]);
      }

      const { data, error } = await query;
      if (error) throw error;

      setChallenges(data || []);

      // Calculate stats
      const active = data?.filter(c => c.status === 'active' || c.status === 'registration-open').length || 0;
      const totalPrize = data?.reduce((sum, c) => sum + (c.total_prize_pool || 0), 0) || 0;

      setStats({
        totalChallenges: data?.length || 0,
        activeChallenges: active,
        totalPrizeValue: totalPrize,
        totalParticipants: 0, // Would need a separate query
      });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      // Initialize with empty data on error
      setChallenges([]);
    }
    setLoading(false);
  };

  const fetchIndustries = async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_industries')
        .select('*')
        .order('name');

      if (error) {
        // Table might not exist yet, use default industries
        setIndustries(INDUSTRY_OPTIONS.map(i => ({
          id: i.value,
          name: i.label,
          shortName: i.value,
          icon: i.icon,
          color: i.color,
          gradient: `from-${i.color}-500 to-${i.color}-600`,
          tagline: '',
          description: '',
          isActive: true,
        })));
      } else {
        setIndustries(data || []);
      }
    } catch {
      // Use defaults
      setIndustries(INDUSTRY_OPTIONS.map(i => ({
        id: i.value,
        name: i.label,
        shortName: i.value,
        icon: i.icon,
        color: i.color,
        gradient: `from-${i.color}-500 to-${i.color}-600`,
        tagline: '',
        description: '',
        isActive: true,
      })));
    }
  };

  const handleSaveChallenge = async (formData: ChallengeFormData) => {
    try {
      const challengeData = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        short_description: formData.shortDescription,
        description: formData.description,
        problem_statement: formData.problemStatement,
        type: formData.type,
        industry: formData.industry,
        industries: formData.industries,
        status: formData.status,
        total_prize_pool: formData.totalPrizePool,
        registration_deadline: formData.registrationDeadline,
        submission_deadline: formData.submissionDeadline,
        judging_period: {
          start: formData.judgingStartDate,
          end: formData.judgingEndDate,
        },
        winners_announced_date: formData.winnersAnnouncedDate,
        max_submissions_per_solver: formData.maxSubmissionsPerSolver,
        team_size_range: {
          min: formData.teamSizeMin,
          max: formData.teamSizeMax,
        },
        skills: formData.skills,
        tags: formData.tags,
        sponsor: {
          name: formData.sponsorName,
          logo: formData.sponsorLogo,
        },
        is_featured: formData.isFeatured,
        visibility: formData.isPublic ? 'public' : 'private',
        updated_at: new Date().toISOString(),
      };

      if (editingChallenge) {
        // Update existing
        const { error } = await supabase
          .from('challenges')
          .update(challengeData)
          .eq('id', editingChallenge.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('challenges')
          .insert({
            ...challengeData,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      setShowChallengeModal(false);
      setEditingChallenge(null);
      fetchChallenges();
    } catch (error) {
      console.error('Error saving challenge:', error);
      alert('Error saving challenge. Please try again.');
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      alert('Error deleting challenge. Please try again.');
    }
  };

  const handleSaveIndustry = async (formData: IndustryFormData) => {
    try {
      if (editingIndustry) {
        // Update existing
        const { error } = await supabase
          .from('challenge_industries')
          .update(formData)
          .eq('id', editingIndustry.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('challenge_industries')
          .insert(formData);

        if (error) throw error;
      }

      setShowIndustryModal(false);
      setEditingIndustry(null);
      fetchIndustries();
    } catch (error) {
      console.error('Error saving industry:', error);
      alert('Error saving industry. Please try again.');
    }
  };

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sub-navigation tabs
  const subTabs = [
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'industries', label: 'Challenge Types/Industries', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className={`flex gap-2 p-1 ${tc.bgTertiary} rounded-lg w-fit`}>
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSubTab === tab.id
                ? 'bg-emerald-600 text-white'
                : `${tc.textSecondary} hover:${tc.textPrimary}`
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {activeSubTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Challenges"
            value={stats.totalChallenges}
            icon={Trophy}
            color="emerald"
            tc={tc}
          />
          <StatCard
            label="Active Challenges"
            value={stats.activeChallenges}
            icon={Zap}
            color="blue"
            tc={tc}
          />
          <StatCard
            label="Total Prize Pool"
            value={`$${stats.totalPrizeValue.toLocaleString()}`}
            icon={DollarSign}
            color="amber"
            tc={tc}
          />
          <StatCard
            label="Industries"
            value={industries.length}
            icon={Layers}
            color="violet"
            tc={tc}
          />
        </div>
      )}

      {/* Challenges Tab Content */}
      {activeSubTab === 'challenges' && (
        <>
          {/* Header with Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${tc.textMuted}`} />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64`}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className={`px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
              >
                <option value="all">All Industries</option>
                {INDUSTRY_OPTIONS.map(i => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setEditingChallenge(null);
                setShowChallengeModal(true);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 ${tc.buttonPrimary} rounded-lg transition-colors text-sm font-medium`}
            >
              <Plus size={18} />
              Create Challenge
            </button>
          </div>

          {/* Challenges Table */}
          <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={tc.bgTertiary}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase tracking-wider`}>Challenge</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase tracking-wider`}>Type</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase tracking-wider`}>Industry</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase tracking-wider`}>Status</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase tracking-wider`}>Prize Pool</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase tracking-wider`}>Deadline</th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${tc.textSecondary} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tc.borderPrimary}`}>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className={`px-4 py-8 text-center ${tc.textSecondary}`}>Loading challenges...</td>
                    </tr>
                  ) : filteredChallenges.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`px-4 py-8 text-center ${tc.textSecondary}`}>
                        <div className="flex flex-col items-center gap-2">
                          <Trophy size={32} className={tc.textMuted} />
                          <p>No challenges found</p>
                          <button
                            onClick={() => setShowChallengeModal(true)}
                            className="text-emerald-500 hover:underline text-sm"
                          >
                            Create your first challenge
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredChallenges.map((challenge) => (
                      <tr key={challenge.id} className={`${tc.cardHover} transition-colors`}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                              <Trophy size={18} className="text-white" />
                            </div>
                            <div>
                              <p className={`font-medium ${tc.textPrimary}`}>{challenge.title}</p>
                              <p className={`text-sm ${tc.textSecondary} line-clamp-1`}>{challenge.short_description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400`}>
                            {challenge.type}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-sm ${tc.textPrimary}`}>
                            {INDUSTRY_OPTIONS.find(i => i.value === challenge.industry)?.label || challenge.industry}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={challenge.status} />
                        </td>
                        <td className={`px-4 py-4 ${tc.textPrimary} font-medium`}>
                          ${(challenge.total_prize_pool || 0).toLocaleString()}
                        </td>
                        <td className={`px-4 py-4 text-sm ${tc.textSecondary}`}>
                          {challenge.submission_deadline ? new Date(challenge.submission_deadline).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingChallenge(challenge);
                                setShowChallengeModal(true);
                              }}
                              className={`p-2 rounded-lg ${tc.buttonSecondary} transition-colors`}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteChallenge(challenge.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Industries Tab Content */}
      {activeSubTab === 'industries' && (
        <IndustriesSection
          industries={industries}
          tc={tc}
          onAdd={() => {
            setEditingIndustry(null);
            setShowIndustryModal(true);
          }}
          onEdit={(industry) => {
            setEditingIndustry(industry);
            setShowIndustryModal(true);
          }}
        />
      )}

      {/* Settings Tab Content */}
      {activeSubTab === 'settings' && (
        <ChallengeSettingsSection tc={tc} />
      )}

      {/* Challenge Modal */}
      <AnimatePresence>
        {showChallengeModal && (
          <ChallengeFormModal
            challenge={editingChallenge}
            onSave={handleSaveChallenge}
            onClose={() => {
              setShowChallengeModal(false);
              setEditingChallenge(null);
            }}
            tc={tc}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Industry Modal */}
      <AnimatePresence>
        {showIndustryModal && (
          <IndustryFormModal
            industry={editingIndustry}
            onSave={handleSaveIndustry}
            onClose={() => {
              setShowIndustryModal(false);
              setEditingIndustry(null);
            }}
            tc={tc}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// STAT CARD COMPONENT
// ===========================================

const StatCard = ({ label, value, icon: Icon, color, tc }: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  tc: ReturnType<typeof getThemeClasses>;
}) => (
  <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
    <div className="flex items-start justify-between">
      <div className={`p-2.5 rounded-lg bg-${color}-500/20`}>
        <Icon size={22} className={`text-${color}-400`} />
      </div>
    </div>
    <div className="mt-4">
      <p className={`text-2xl font-bold ${tc.textPrimary}`}>{value}</p>
      <p className={`text-sm ${tc.textSecondary} mt-1`}>{label}</p>
    </div>
  </div>
);

// ===========================================
// STATUS BADGE COMPONENT
// ===========================================

const StatusBadge = ({ status }: { status: ChallengeStatus }) => {
  const statusConfig = STATUS_OPTIONS.find(s => s.value === status) || { label: status, color: 'slate' };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-${statusConfig.color}-500/20 text-${statusConfig.color}-400`}>
      {statusConfig.label}
    </span>
  );
};

// ===========================================
// INDUSTRIES SECTION
// ===========================================

const IndustriesSection = ({ industries, tc, onAdd, onEdit }: {
  industries: IndustryFormData[];
  tc: ReturnType<typeof getThemeClasses>;
  onAdd: () => void;
  onEdit: (industry: IndustryFormData) => void;
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className={`text-lg font-semibold ${tc.textPrimary}`}>Challenge Types & Industries</h3>
        <p className={`text-sm ${tc.textSecondary}`}>Manage the industries and challenge categories available on the platform</p>
      </div>
      <button
        onClick={onAdd}
        className={`flex items-center gap-2 px-4 py-2.5 ${tc.buttonPrimary} rounded-lg transition-colors text-sm font-medium`}
      >
        <Plus size={18} />
        Add Industry
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {industries.map(industry => (
        <div
          key={industry.id}
          className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5 ${tc.cardHover} transition-colors`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{industry.icon}</span>
              <div>
                <h4 className={`font-semibold ${tc.textPrimary}`}>{industry.name}</h4>
                <p className={`text-sm ${tc.textSecondary}`}>{industry.shortName}</p>
              </div>
            </div>
            <button
              onClick={() => onEdit(industry)}
              className={`p-2 rounded-lg ${tc.buttonSecondary} transition-colors`}
            >
              <Edit2 size={16} />
            </button>
          </div>
          {industry.tagline && (
            <p className={`mt-3 text-sm ${tc.textSecondary} line-clamp-2`}>{industry.tagline}</p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full bg-${industry.color}-500`} />
            <span className={`text-xs ${tc.textMuted}`}>{industry.color}</span>
            {industry.isActive ? (
              <span className="ml-auto text-xs text-emerald-400">Active</span>
            ) : (
              <span className="ml-auto text-xs text-red-400">Inactive</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ===========================================
// CHALLENGE SETTINGS SECTION
// ===========================================

const ChallengeSettingsSection = ({ tc }: { tc: ReturnType<typeof getThemeClasses> }) => (
  <div className="space-y-6">
    <div>
      <h3 className={`text-lg font-semibold ${tc.textPrimary}`}>Challenge Platform Settings</h3>
      <p className={`text-sm ${tc.textSecondary}`}>Configure global settings for the challenges system</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Default Settings */}
      <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
        <h4 className={`font-semibold ${tc.textPrimary} mb-4`}>Default Challenge Settings</h4>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Default Max Submissions per Solver
            </label>
            <input
              type="number"
              defaultValue={5}
              className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Default Team Size Range
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                defaultValue={1}
                placeholder="Min"
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
              />
              <span className={tc.textMuted}>to</span>
              <input
                type="number"
                defaultValue={5}
                placeholder="Max"
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
        <h4 className={`font-semibold ${tc.textPrimary} mb-4`}>Notification Settings</h4>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Email sponsors when new submissions arrive</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Email solvers when challenge status changes</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Send deadline reminders (7 days, 3 days, 1 day)</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Slack notifications for new challenges</span>
          </label>
        </div>
      </div>

      {/* Approval Settings */}
      <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
        <h4 className={`font-semibold ${tc.textPrimary} mb-4`}>Approval Workflow</h4>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Require admin approval for new challenges</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Auto-approve challenges from verified sponsors</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Require sponsor verification for prize &gt;$10,000</span>
          </label>
        </div>
      </div>

      {/* Leaderboard Settings */}
      <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
        <h4 className={`font-semibold ${tc.textPrimary} mb-4`}>Leaderboard Settings</h4>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Default Leaderboard Visibility
            </label>
            <select className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}>
              <option value="public">Public (all scores visible)</option>
              <option value="participants">Participants only</option>
              <option value="private">Private (hidden until judging)</option>
            </select>
          </div>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Show real-time leaderboard updates</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Enable private leaderboard shaking</span>
          </label>
        </div>
      </div>
    </div>

    <div className="flex justify-end">
      <button className={`flex items-center gap-2 px-6 py-2.5 ${tc.buttonPrimary} rounded-lg transition-colors text-sm font-medium`}>
        <Save size={18} />
        Save Settings
      </button>
    </div>
  </div>
);

// ===========================================
// CHALLENGE FORM MODAL
// ===========================================

const ChallengeFormModal = ({ challenge, onSave, onClose, tc, isDark: _isDark }: {
  challenge: any | null;
  onSave: (data: ChallengeFormData) => void;
  onClose: () => void;
  tc: ReturnType<typeof getThemeClasses>;
  isDark: boolean;
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: challenge?.title || '',
    shortDescription: challenge?.short_description || '',
    description: challenge?.description || '',
    problemStatement: challenge?.problem_statement || '',
    type: challenge?.type || 'ideation',
    industry: challenge?.industry || 'ai',
    industries: challenge?.industries || ['ai'],
    status: challenge?.status || 'draft',
    totalPrizePool: challenge?.total_prize_pool || 0,
    registrationDeadline: challenge?.registration_deadline?.split('T')[0] || '',
    submissionDeadline: challenge?.submission_deadline?.split('T')[0] || '',
    judgingStartDate: challenge?.judging_period?.start?.split('T')[0] || '',
    judgingEndDate: challenge?.judging_period?.end?.split('T')[0] || '',
    winnersAnnouncedDate: challenge?.winners_announced_date?.split('T')[0] || '',
    maxSubmissionsPerSolver: challenge?.max_submissions_per_solver || 5,
    teamSizeMin: challenge?.team_size_range?.min || 1,
    teamSizeMax: challenge?.team_size_range?.max || 5,
    skills: challenge?.skills || [],
    tags: challenge?.tags || [],
    sponsorName: challenge?.sponsor?.name || '',
    sponsorLogo: challenge?.sponsor?.logo || '',
    isFeatured: challenge?.is_featured || false,
    isPublic: challenge?.visibility === 'public',
  });

  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const updateField = (field: keyof ChallengeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      updateField('skills', [...formData.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    updateField('skills', formData.skills.filter(s => s !== skill));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateField('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateField('tags', formData.tags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter a challenge title');
      setStep(1);
      return;
    }
    onSave(formData);
  };

  const totalSteps = 4;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-3xl max-h-[90vh] ${tc.bgSecondary} rounded-2xl shadow-xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${tc.borderPrimary} flex items-center justify-between`}>
          <div>
            <h2 className={`text-xl font-bold ${tc.textPrimary}`}>
              {challenge ? 'Edit Challenge' : 'Create New Challenge'}
            </h2>
            <p className={`text-sm ${tc.textSecondary}`}>Step {step} of {totalSteps}</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${tc.buttonSecondary}`}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className={`h-1 ${tc.bgTertiary}`}>
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className={`font-semibold ${tc.textPrimary}`}>Basic Information</h3>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Challenge Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., AI Climate Prediction Challenge"
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Short Description *
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => updateField('shortDescription', e.target.value)}
                  placeholder="A brief one-line description"
                  maxLength={150}
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                />
                <p className={`text-xs ${tc.textMuted} mt-1`}>{formData.shortDescription.length}/150 characters</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Challenge Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => updateField('type', e.target.value)}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  >
                    {CHALLENGE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Primary Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                >
                  {INDUSTRY_OPTIONS.map(i => (
                    <option key={i.value} value={i.value}>{i.icon} {i.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Description & Problem */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className={`font-semibold ${tc.textPrimary}`}>Challenge Details</h3>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Full Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Provide a comprehensive description of the challenge..."
                  rows={5}
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500 resize-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Problem Statement
                </label>
                <textarea
                  value={formData.problemStatement}
                  onChange={(e) => updateField('problemStatement', e.target.value)}
                  placeholder="What problem are solvers trying to solve?"
                  rows={4}
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500 resize-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Required Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill and press Enter"
                    className={`flex-1 px-4 py-2 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                  <button onClick={addSkill} className={tc.buttonPrimary + ' px-4 py-2 rounded-lg'}>
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className={`px-3 py-1 ${tc.bgTertiary} rounded-full text-sm flex items-center gap-2`}
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-400">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag and press Enter"
                    className={`flex-1 px-4 py-2 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                  <button onClick={addTag} className={tc.buttonPrimary + ' px-4 py-2 rounded-lg'}>
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Timeline & Prize */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className={`font-semibold ${tc.textPrimary}`}>Timeline & Prizes</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Registration Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => updateField('registrationDeadline', e.target.value)}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Submission Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.submissionDeadline}
                    onChange={(e) => updateField('submissionDeadline', e.target.value)}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Judging Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.judgingStartDate}
                    onChange={(e) => updateField('judgingStartDate', e.target.value)}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Judging End Date
                  </label>
                  <input
                    type="date"
                    value={formData.judgingEndDate}
                    onChange={(e) => updateField('judgingEndDate', e.target.value)}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Winners Announced Date
                </label>
                <input
                  type="date"
                  value={formData.winnersAnnouncedDate}
                  onChange={(e) => updateField('winnersAnnouncedDate', e.target.value)}
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Total Prize Pool ($)
                </label>
                <input
                  type="number"
                  value={formData.totalPrizePool}
                  onChange={(e) => updateField('totalPrizePool', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 50000"
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Max Submissions
                  </label>
                  <input
                    type="number"
                    value={formData.maxSubmissionsPerSolver}
                    onChange={(e) => updateField('maxSubmissionsPerSolver', parseInt(e.target.value) || 1)}
                    min={1}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Min Team Size
                  </label>
                  <input
                    type="number"
                    value={formData.teamSizeMin}
                    onChange={(e) => updateField('teamSizeMin', parseInt(e.target.value) || 1)}
                    min={1}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    value={formData.teamSizeMax}
                    onChange={(e) => updateField('teamSizeMax', parseInt(e.target.value) || 5)}
                    min={1}
                    className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Sponsor & Settings */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className={`font-semibold ${tc.textPrimary}`}>Sponsor & Visibility</h3>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Sponsor Name
                </label>
                <input
                  type="text"
                  value={formData.sponsorName}
                  onChange={(e) => updateField('sponsorName', e.target.value)}
                  placeholder="e.g., TechCorp Inc."
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Sponsor Logo URL
                </label>
                <input
                  type="url"
                  value={formData.sponsorLogo}
                  onChange={(e) => updateField('sponsorLogo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
                />
              </div>

              <div className={`p-4 ${tc.bgTertiary} rounded-lg space-y-4`}>
                <h4 className={`font-medium ${tc.textPrimary}`}>Visibility Settings</h4>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => updateField('isPublic', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <span className={`text-sm font-medium ${tc.textPrimary}`}>Public Challenge</span>
                    <p className={`text-xs ${tc.textSecondary}`}>Visible to all users on the platform</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => updateField('isFeatured', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <span className={`text-sm font-medium ${tc.textPrimary}`}>Featured Challenge</span>
                    <p className={`text-xs ${tc.textSecondary}`}>Prominently displayed on homepage and listings</p>
                  </div>
                </label>
              </div>

              {/* Summary */}
              <div className={`p-4 border ${tc.borderPrimary} rounded-lg`}>
                <h4 className={`font-medium ${tc.textPrimary} mb-3`}>Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className={tc.textSecondary}>Title:</span>
                    <span className={`ml-2 ${tc.textPrimary}`}>{formData.title || '-'}</span>
                  </div>
                  <div>
                    <span className={tc.textSecondary}>Type:</span>
                    <span className={`ml-2 ${tc.textPrimary}`}>{formData.type}</span>
                  </div>
                  <div>
                    <span className={tc.textSecondary}>Industry:</span>
                    <span className={`ml-2 ${tc.textPrimary}`}>{formData.industry}</span>
                  </div>
                  <div>
                    <span className={tc.textSecondary}>Prize Pool:</span>
                    <span className={`ml-2 ${tc.textPrimary}`}>${formData.totalPrizePool.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className={tc.textSecondary}>Status:</span>
                    <span className={`ml-2 ${tc.textPrimary}`}>{formData.status}</span>
                  </div>
                  <div>
                    <span className={tc.textSecondary}>Deadline:</span>
                    <span className={`ml-2 ${tc.textPrimary}`}>{formData.submissionDeadline || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${tc.borderPrimary} flex justify-between`}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className={`px-4 py-2 ${tc.buttonSecondary} rounded-lg transition-colors`}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={() => step < totalSteps ? setStep(step + 1) : handleSubmit()}
            className={`px-6 py-2 ${tc.buttonPrimary} rounded-lg transition-colors flex items-center gap-2`}
          >
            {step < totalSteps ? 'Next' : (
              <>
                <Save size={18} />
                {challenge ? 'Update Challenge' : 'Create Challenge'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// INDUSTRY FORM MODAL
// ===========================================

const IndustryFormModal = ({ industry, onSave, onClose, tc, isDark: _isDark }: {
  industry: IndustryFormData | null;
  onSave: (data: IndustryFormData) => void;
  onClose: () => void;
  tc: ReturnType<typeof getThemeClasses>;
  isDark: boolean;
}) => {
  const [formData, setFormData] = useState<IndustryFormData>({
    id: industry?.id || '',
    name: industry?.name || '',
    shortName: industry?.shortName || '',
    icon: industry?.icon || '🎯',
    color: industry?.color || 'emerald',
    gradient: industry?.gradient || 'from-emerald-500 to-emerald-600',
    tagline: industry?.tagline || '',
    description: industry?.description || '',
    isActive: industry?.isActive ?? true,
  });

  const updateField = (field: keyof IndustryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.id.trim() || !formData.name.trim()) {
      alert('Please fill in required fields');
      return;
    }
    onSave(formData);
  };

  const colorOptions = [
    'emerald', 'blue', 'violet', 'purple', 'red', 'amber',
    'cyan', 'green', 'orange', 'pink', 'sky', 'slate'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-lg ${tc.bgSecondary} rounded-2xl shadow-xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${tc.borderPrimary} flex items-center justify-between`}>
          <h2 className={`text-xl font-bold ${tc.textPrimary}`}>
            {industry ? 'Edit Industry' : 'Add New Industry'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-lg ${tc.buttonSecondary}`}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Industry ID *
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => updateField('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="e.g., space-tech"
                disabled={!!industry}
                className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500 ${industry ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Icon (emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => updateField('icon', e.target.value)}
                placeholder="e.g., 🚀"
                maxLength={4}
                className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500 text-2xl text-center`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Industry Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Space Technology"
              className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Short Name
            </label>
            <input
              type="text"
              value={formData.shortName}
              onChange={(e) => updateField('shortName', e.target.value)}
              placeholder="e.g., Space Tech"
              className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Theme Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    updateField('color', color);
                    updateField('gradient', `from-${color}-500 to-${color}-600`);
                  }}
                  className={`w-8 h-8 rounded-full bg-${color}-500 border-2 transition-transform ${
                    formData.color === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="e.g., Pushing the boundaries of exploration"
              className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe this industry category..."
              rows={3}
              className={`w-full px-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500 resize-none`}
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => updateField('isActive', e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
            />
            <span className={`text-sm ${tc.textPrimary}`}>Active (visible in challenge creation)</span>
          </label>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${tc.borderPrimary} flex justify-end gap-3`}>
          <button onClick={onClose} className={`px-4 py-2 ${tc.buttonSecondary} rounded-lg transition-colors`}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 ${tc.buttonPrimary} rounded-lg transition-colors flex items-center gap-2`}
          >
            <Save size={18} />
            {industry ? 'Update Industry' : 'Add Industry'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChallengesTab;
