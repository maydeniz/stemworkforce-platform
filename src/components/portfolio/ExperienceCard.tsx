import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, ExternalLink, Github,
  FileText, Send, Trash2, Edit2,
} from 'lucide-react';
import type { VerifiedExperience } from '@/types/experienceLedger';
import {
  EXPERIENCE_TYPE_ICONS,
  EXPERIENCE_TYPE_LABELS,
  TRUST_LEVEL_LABELS,
  TRUST_LEVEL_COLORS,
} from '@/types/experienceLedger';
import VerificationStatusBadge from './VerificationStatusBadge';
import SkillBadge from './SkillBadge';

interface ExperienceCardProps {
  experience: VerifiedExperience;
  onEdit?: (exp: VerifiedExperience) => void;
  onDelete?: (id: string) => void;
  onSubmitForVerification?: (exp: VerifiedExperience) => void;
  employerView?: boolean;
}

function formatDateRange(start: string | null, end: string | null, isCurrent: boolean): string {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (!start) return '';
  return `${fmt(start)} – ${isCurrent ? 'Present' : end ? fmt(end) : ''}`;
}

const EVIDENCE_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="w-3.5 h-3.5" />,
  url: <ExternalLink className="w-3.5 h-3.5" />,
  paper: <FileText className="w-3.5 h-3.5" />,
  file: <FileText className="w-3.5 h-3.5" />,
  default: <ExternalLink className="w-3.5 h-3.5" />,
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience: exp,
  onEdit,
  onDelete,
  onSubmitForVerification,
  employerView = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isVerified = exp.verification_status === 'verified';
  const canSubmit = exp.verification_status === 'draft' || exp.verification_status === 'revision_requested';

  return (
    <motion.div
      layout
      className={`rounded-xl border transition-all duration-200 ${
        isVerified
          ? 'bg-gray-900/80 border-emerald-900/50'
          : 'bg-gray-900/50 border-gray-800'
      }`}
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">
            {EXPERIENCE_TYPE_ICONS[exp.experience_type]}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-white text-sm leading-snug">{exp.title}</p>
                {exp.organization_name && (
                  <p className="text-xs text-gray-400 mt-0.5">{exp.organization_name}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!employerView && onEdit && (
                  <button
                    onClick={e => { e.stopPropagation(); onEdit(exp); }}
                    className="p-1 text-gray-500 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <VerificationStatusBadge
                status={exp.verification_status}
                trustLevel={exp.trust_level}
                showTrust={isVerified}
              />
              {exp.start_date && (
                <span className="text-xs text-gray-500">
                  {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                </span>
              )}
              <span className="text-xs text-gray-600">
                {EXPERIENCE_TYPE_LABELS[exp.experience_type]}
              </span>
            </div>

            {/* Top skills preview */}
            {exp.skills && exp.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {exp.skills.slice(0, 4).map(s => (
                  <SkillBadge key={s.id} skill={s} />
                ))}
                {exp.skills.length > 4 && (
                  <span className="text-xs text-gray-500 self-center">+{exp.skills.length - 4} more</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-800 pt-4 space-y-4">

              {/* Description */}
              {exp.description && (
                <p className="text-sm text-gray-400 leading-relaxed">{exp.description}</p>
              )}

              {/* Trust level detail */}
              {isVerified && (
                <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${TRUST_LEVEL_COLORS[exp.trust_level]}`}>
                  <span className="font-medium">{TRUST_LEVEL_LABELS[exp.trust_level]}</span>
                  {exp.verifier_name && (
                    <span className="opacity-70">— verified by {exp.verifier_name}{exp.verifier_title ? `, ${exp.verifier_title}` : ''}</span>
                  )}
                  {exp.verified_at && (
                    <span className="opacity-60 ml-auto">
                      {new Date(exp.verified_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}

              {/* Evidence links */}
              {exp.evidence && exp.evidence.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Evidence</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.evidence.map(ev => (
                      <a
                        key={ev.id}
                        href={ev.url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 border border-blue-900/40 px-2.5 py-1 rounded-full transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        {EVIDENCE_ICONS[ev.evidence_type] ?? EVIDENCE_ICONS.default}
                        {ev.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* All skills */}
              {exp.skills && exp.skills.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Skills & Competencies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.skills.map(s => (
                      <SkillBadge key={s.id} skill={s} showConfidence />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {!employerView && (
                <div className="flex items-center gap-2 pt-1">
                  {canSubmit && onSubmitForVerification && (
                    <button
                      onClick={() => onSubmitForVerification(exp)}
                      className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 hover:bg-indigo-900/30 border border-indigo-800 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Send className="w-3 h-3" />
                      Request Verification
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(exp.id)}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-red-900/20 transition-all ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExperienceCard;
