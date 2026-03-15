import React from 'react';
import type { ExperienceSkill, ExtractedSkill } from '@/types/experienceLedger';

interface SkillBadgeProps {
  skill: ExperienceSkill | ExtractedSkill;
  onRemove?: () => void;
  showConfidence?: boolean;
}

function getConfidenceColor(confidence: number | null): string {
  if (!confidence) return 'text-gray-400 bg-gray-800 border-gray-700';
  if (confidence >= 0.85) return 'text-emerald-400 bg-emerald-900/20 border-emerald-800';
  if (confidence >= 0.65) return 'text-blue-400 bg-blue-900/20 border-blue-800';
  return 'text-gray-400 bg-gray-800/60 border-gray-700';
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, onRemove, showConfidence = false }) => {
  const label = 'esco_label' in skill ? skill.esco_label : skill.label;
  const confidence = skill.confidence;
  const isVerified = 'is_verified' in skill ? skill.is_verified : false;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${getConfidenceColor(confidence)}`}
      title={skill.evidence_span ? `Evidence: "${skill.evidence_span}"` : label}
    >
      {isVerified && <span className="text-emerald-400">✓</span>}
      {label}
      {showConfidence && confidence !== null && (
        <span className="opacity-60">{Math.round(confidence * 100)}%</span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:text-red-400 transition-colors"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
