// ============================================================
// Talent Discovery Page — Employer View
// Phase 1: STEM Verified Experience & Talent System
//
// LEGAL NOTE: AI scores presented as "match %" (informational),
// NOT as rankings (decisional). EEOC 2023 + NYC Local Law 144.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Bookmark, BookmarkCheck, MapPin,
  CheckCircle, Github, Linkedin, Globe, Loader2,
  ChevronDown, Users, Star,
} from 'lucide-react';
import type { TalentProfile, PipelineStatus, TrustLevel } from '@/types/experienceLedger';
import {
  TRUST_LEVEL_LABELS, TRUST_LEVEL_COLORS,
  EXPERIENCE_TYPE_ICONS,
} from '@/types/experienceLedger';
import {
  discoverTalent, saveTalent, updateTalentPipelineStatus,
} from '@/services/experienceLedgerApi';

// ── Verified Project Card (employer-facing) ────────────────────

const VerifiedProjectCard: React.FC<{ profile: TalentProfile; onSave: (id: string) => void; onStatusChange: (id: string, status: PipelineStatus) => void }> = ({
  profile, onSave, onStatusChange,
}) => {
  const [showPipeline, setShowPipeline] = useState(false);
  const { portfolio, top_experiences, top_skills, highest_trust_level, save } = profile;
  const isSaved = !!save;

  const PIPELINE_STATUSES: PipelineStatus[] = ['saved', 'contacted', 'interviewing', 'offered', 'hired', 'archived'];
  const STATUS_COLORS: Record<PipelineStatus, string> = {
    saved:       'text-gray-400',
    contacted:   'text-blue-400',
    interviewing:'text-yellow-400',
    offered:     'text-violet-400',
    hired:       'text-emerald-400',
    archived:    'text-gray-600',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/60 border rounded-xl overflow-hidden transition-all ${
        isSaved ? 'border-indigo-800/60' : 'border-gray-800'
      }`}
    >
      {/* Top: Profile + match + CRM */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Headline */}
            <p className="font-semibold text-white text-sm leading-snug truncate">
              {portfolio.headline || 'STEM Student'}
            </p>
            {portfolio.target_role && (
              <p className="text-xs text-indigo-400 mt-0.5">Targeting: {portfolio.target_role}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
              {portfolio.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{portfolio.location}</span>}
              {portfolio.is_open_to_opportunities && <span className="flex items-center gap-1 text-emerald-500"><CheckCircle className="w-3 h-3" />Open to roles</span>}
              <span className={`flex items-center gap-1 ${TRUST_LEVEL_COLORS[highest_trust_level]} px-2 py-0.5 rounded-full border text-xs`}>
                {'★'.repeat(highest_trust_level)} {TRUST_LEVEL_LABELS[highest_trust_level]}
              </span>
            </div>

            {/* Links */}
            <div className="flex gap-3 mt-2 text-xs text-gray-600">
              {portfolio.github_url && <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors"><Github className="w-3 h-3" />GitHub</a>}
              {portfolio.linkedin_url && <a href={portfolio.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors"><Linkedin className="w-3 h-3" />LinkedIn</a>}
              {portfolio.portfolio_url && <a href={portfolio.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors"><Globe className="w-3 h-3" />Portfolio</a>}
            </div>
          </div>

          {/* Save / CRM */}
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => onSave(profile.user_id)}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                isSaved
                  ? 'text-indigo-300 border-indigo-700 bg-indigo-900/20'
                  : 'text-gray-400 border-gray-700 hover:border-indigo-700 hover:text-indigo-300'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {isSaved ? 'Saved' : 'Save'}
            </button>

            {isSaved && (
              <div className="relative">
                <button
                  onClick={() => setShowPipeline(p => !p)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600 transition-all ${STATUS_COLORS[save!.pipeline_status]}`}
                >
                  {save!.pipeline_status} <ChevronDown className="w-3 h-3" />
                </button>
                {showPipeline && (
                  <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 py-1 min-w-[130px]">
                    {PIPELINE_STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => { onStatusChange(profile.user_id, s); setShowPipeline(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-800 transition-colors ${STATUS_COLORS[s]} ${save!.pipeline_status === s ? 'bg-gray-800' : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Discoverability score as match % — informational only (EEOC-safe) */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full"
              style={{ width: `${portfolio.discoverability_score}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {portfolio.discoverability_score}% profile match
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-0.5">
          ℹ️ Match % is informational only and does not constitute a hiring recommendation.
        </p>
      </div>

      {/* Verified experiences */}
      {top_experiences.length > 0 && (
        <div className="border-t border-gray-800 px-5 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
            Verified Experiences ({profile.verified_count})
          </p>
          <div className="space-y-3">
            {top_experiences.map(exp => (
              <div key={exp.id} className="flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0">{EXPERIENCE_TYPE_ICONS[exp.experience_type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white leading-snug">{exp.title}</p>
                      {exp.organization_name && (
                        <p className="text-xs text-gray-500">{exp.organization_name}</p>
                      )}
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${TRUST_LEVEL_COLORS[exp.trust_level as TrustLevel]}`}>
                      {TRUST_LEVEL_LABELS[exp.trust_level as TrustLevel]}
                    </span>
                  </div>

                  {/* Evidence links */}
                  {exp.evidence && exp.evidence.filter(ev => ev.is_public && ev.url).length > 0 && (
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {exp.evidence.filter(ev => ev.is_public && ev.url).slice(0, 2).map(ev => (
                        <a
                          key={ev.id}
                          href={ev.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                          {ev.title}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Skills for this experience */}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {exp.skills.slice(0, 5).map(s => (
                        <span key={s.id} className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                          {s.esco_label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top skills aggregate */}
      {top_skills.length > 0 && (
        <div className="border-t border-gray-800 px-5 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Top Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {top_skills.slice(0, 8).map(s => (
              <span key={s.esco_label} className="text-xs px-2 py-0.5 rounded-full border border-gray-700 bg-gray-900 text-gray-300">
                {s.esco_label}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const TalentDiscoveryPage: React.FC = () => {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [minTrust, setMinTrust] = useState<TrustLevel>(3);
  const [openOnly, setOpenOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const results = await discoverTalent({
      skills: skillFilter ? [skillFilter] : undefined,
      min_trust_level: minTrust,
      is_open: openOnly || undefined,
      limit: 30,
    });
    setTalents(results);
    setLoading(false);
  }, [skillFilter, minTrust, openOnly]);

  useEffect(() => { load(); }, [load]);

  const filtered = talents.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.portfolio.headline?.toLowerCase().includes(q) ||
      t.portfolio.target_role?.toLowerCase().includes(q) ||
      t.top_skills.some(s => s.esco_label.toLowerCase().includes(q))
    );
  });

  const handleSave = async (studentId: string) => {
    await saveTalent(studentId);
    await load();
  };

  const handleStatusChange = async (studentId: string, status: PipelineStatus) => {
    await updateTalentPipelineStatus(studentId, status);
    await load();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Talent Discovery</h1>
            <p className="text-sm text-gray-400 mt-0.5">Verified STEM talent — CLR 2.0 credentials</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-lg">
            <Users className="w-4 h-4" />
            {filtered.length} discoverable profiles
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
              placeholder="Search by name, role, or skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <input
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 w-48"
            placeholder="Filter by skill (e.g. Python)"
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
          />
          <select
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            value={minTrust}
            onChange={e => setMinTrust(Number(e.target.value) as TrustLevel)}
          >
            <option value={1}>Any verification</option>
            <option value={3}>Institutional+</option>
            <option value={4}>Employer verified</option>
            <option value={5}>Accredited only</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
            <input type="checkbox" checked={openOnly} onChange={e => setOpenOnly(e.target.checked)} />
            Open to roles only
          </label>
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all"
          >
            <Filter className="w-4 h-4" /> Apply
          </button>
        </div>

        {/* EEOC disclaimer */}
        <div className="mb-6 p-3 bg-amber-900/10 border border-amber-900/30 rounded-lg">
          <p className="text-xs text-amber-500/80">
            <strong>Legal Notice:</strong> Profile match percentages are informational only and do not constitute AI-based candidate ranking or any hiring recommendation. All hiring decisions must comply with applicable employment law including EEOC guidelines. STEMWorkforce does not make hiring recommendations.
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Star className="w-12 h-12 text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">No discoverable talent found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or lowering the minimum verification level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(talent => (
              <VerifiedProjectCard
                key={talent.user_id}
                profile={talent}
                onSave={handleSave}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentDiscoveryPage;
