// ============================================================
// Experience Ledger Page — Student Portfolio View
// Phase 1: STEM Verified Experience & Talent System
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, BookOpen, RefreshCw, Settings, Eye,
  Github, Linkedin, Globe, MapPin, CheckCircle, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { VerifiedExperience, PortfolioProfile, UpdatePortfolioInput } from '@/types/experienceLedger';
import {
  getMyExperiences, getMyPortfolio, updatePortfolio,
  deleteExperience,
} from '@/services/experienceLedgerApi';
import ExperienceCard from '@/components/portfolio/ExperienceCard';
import DiscoverabilityMeter from '@/components/portfolio/DiscoverabilityMeter';
import AddExperienceModal from '@/components/portfolio/AddExperienceModal';
import SubmitVerificationModal from '@/components/portfolio/SubmitVerificationModal';

// ── Inline Profile Editor ─────────────────────────────────────
const ProfileEditor: React.FC<{
  profile: PortfolioProfile;
  onSave: (p: UpdatePortfolioInput) => Promise<void>;
}> = ({ profile, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    headline: profile.headline ?? '',
    bio: profile.bio ?? '',
    target_role: profile.target_role ?? '',
    target_industries: (profile.target_industries ?? []).join(', '),
    github_url: profile.github_url ?? '',
    linkedin_url: profile.linkedin_url ?? '',
    portfolio_url: profile.portfolio_url ?? '',
    location: profile.location ?? '',
    is_open_to_opportunities: profile.is_open_to_opportunities,
  });

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      ...form,
      target_industries: form.target_industries
        .split(',').map(s => s.trim()).filter(Boolean),
    });
    setSaving(false);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-white text-base">
              {profile.headline || <span className="text-gray-500 italic">Add a headline...</span>}
            </p>
            {profile.target_role && (
              <p className="text-sm text-indigo-400 mt-0.5">Target: {profile.target_role}</p>
            )}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        {profile.bio && <p className="text-sm text-gray-400 leading-relaxed mb-3">{profile.bio}</p>}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>}
          {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors"><Github className="w-3.5 h-3.5" />GitHub</a>}
          {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors"><Linkedin className="w-3.5 h-3.5" />LinkedIn</a>}
          {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors"><Globe className="w-3.5 h-3.5" />Portfolio</a>}
          {profile.is_open_to_opportunities && (
            <span className="flex items-center gap-1 text-emerald-500"><CheckCircle className="w-3.5 h-3.5" />Open to opportunities</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 border border-indigo-800/50 rounded-xl p-5 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Headline</label>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="STEM student specializing in AI/ML at MIT" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Target Role</label>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value={form.target_role} onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))} placeholder="ML Engineer, Research Scientist..." />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Location</label>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Cambridge, MA" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Bio</label>
          <textarea className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Brief professional bio..." />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">GitHub URL</label>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">LinkedIn URL</label>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Portfolio / Website</label>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value={form.portfolio_url} onChange={e => setForm(f => ({ ...f, portfolio_url: e.target.value }))} placeholder="https://..." />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Target Industries (comma separated)</label>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value={form.target_industries} onChange={e => setForm(f => ({ ...f, target_industries: e.target.value }))} placeholder="Defense, AI, Energy, Biotech" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.is_open_to_opportunities} onChange={e => setForm(f => ({ ...f, is_open_to_opportunities: e.target.checked }))} />
        <span className="text-sm text-gray-400">Open to internship/job opportunities</span>
      </label>
      <div className="flex gap-2 pt-1">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 px-4 py-2 rounded-lg transition-all">
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Save Profile
        </button>
        <button onClick={() => setEditing(false)} className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all">Cancel</button>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const ExperienceLedgerPage: React.FC = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<VerifiedExperience[]>([]);
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<VerifiedExperience | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const [exps, prof] = await Promise.all([getMyExperiences(), getMyPortfolio()]);
    setExperiences(exps);
    setProfile(prof);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await deleteExperience(id);
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  const handleSaveProfile = async (updates: UpdatePortfolioInput) => {
    const updated = await updatePortfolio(updates);
    setProfile(updated);
  };

  const filteredExps = experiences.filter(e => {
    if (filter === 'verified') return e.verification_status === 'verified';
    if (filter === 'pending') return e.verification_status !== 'verified' && e.verification_status !== 'draft';
    return true;
  });

  const verifiedCount = experiences.filter(e => e.verification_status === 'verified' && e.trust_level >= 3).length;
  const allSkills = Array.from(
    new Map(
      experiences.flatMap(e => (e.skills ?? []).map(s => [s.esco_label, s]))
    ).values()
  ).sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0)).slice(0, 20);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">My Portfolio</h1>
            <p className="text-sm text-gray-400 mt-0.5">Verified experience ledger · CLR 2.0</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar */}
            <div className="space-y-4">
              {/* Profile editor */}
              {profile && (
                <ProfileEditor profile={profile} onSave={handleSaveProfile} />
              )}

              {/* Discoverability meter */}
              {profile && (
                <DiscoverabilityMeter
                  score={profile.discoverability_score}
                  isDiscoverable={profile.is_discoverable}
                  verifiedCount={verifiedCount}
                />
              )}

              {/* Skill cloud */}
              {allSkills.length > 0 && (
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">Verified Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {allSkills.map(s => (
                      <span
                        key={s.esco_label}
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300"
                      >
                        {s.esco_label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total', value: experiences.length, color: 'text-white' },
                  { label: 'Verified', value: verifiedCount, color: 'text-emerald-400' },
                  { label: 'In Review', value: experiences.filter(e => ['submitted','notified','under_review'].includes(e.verification_status)).length, color: 'text-yellow-400' },
                  { label: 'Drafts', value: experiences.filter(e => e.verification_status === 'draft').length, color: 'text-gray-500' },
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Employer view link */}
              <button
                onClick={() => navigate('/talent-discovery')}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white bg-gray-900/60 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 transition-all"
              >
                <Eye className="w-4 h-4" /> View employer perspective
              </button>
            </div>

            {/* Main content: experience list */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filter tabs */}
              <div className="flex gap-1 bg-gray-900/60 border border-gray-800 p-1 rounded-lg">
                {(['all', 'verified', 'pending'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                      filter === f ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? `All (${experiences.length})` :
                     f === 'verified' ? `Verified (${verifiedCount})` :
                     `Pending (${experiences.filter(e => ['submitted','notified','under_review'].includes(e.verification_status)).length})`}
                  </button>
                ))}
              </div>

              {filteredExps.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <BookOpen className="w-12 h-12 text-gray-700 mb-4" />
                  <p className="text-gray-400 font-medium">
                    {filter === 'all' ? "No experiences yet" : `No ${filter} experiences`}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 mb-4">
                    {filter === 'all' ? "Add your first internship, research project, or certification." : ""}
                  </p>
                  {filter === 'all' && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Experience
                    </button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {filteredExps.map(exp => (
                    <ExperienceCard
                      key={exp.id}
                      experience={exp}
                      onDelete={handleDelete}
                      onSubmitForVerification={e => setVerifyTarget(e)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddExperienceModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={load}
      />

      {verifyTarget && (
        <SubmitVerificationModal
          experience={verifyTarget}
          onClose={() => setVerifyTarget(null)}
          onSuccess={() => { setVerifyTarget(null); load(); }}
        />
      )}
    </div>
  );
};

export default ExperienceLedgerPage;
