// ===========================================
// Expert Q&A Card Component
// Displays a single career Q&A pair with expand/collapse
// ===========================================

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Eye, Tag } from 'lucide-react';
import type { CareerQA } from '@/types/careernet';
import { SCENARIO_DISPLAY_NAMES } from '@/types/careernet';

interface ExpertQACardProps {
  qa: CareerQA;
  defaultExpanded?: boolean;
  showTags?: boolean;
  showScenarios?: boolean;
}

const ExpertQACard: React.FC<ExpertQACardProps> = ({
  qa,
  defaultExpanded = false,
  showTags = true,
  showScenarios = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const qualityBadge = qa.correctness === 4
    ? { label: 'Expert Verified', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' }
    : { label: 'Quality Reviewed', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };

  return (
    <div className="bg-gray-800/50 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-start gap-3 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${qualityBadge.color}`}>
              <Star className="w-3 h-3" />
              {qualityBadge.label}
            </span>
            {qa.questionViews > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                {qa.questionViews.toLocaleString()} views
              </span>
            )}
          </div>
          <h4 className="text-white font-medium text-sm leading-snug">
            {qa.questionTitle}
          </h4>
        </div>
        <div className="flex-shrink-0 mt-1 text-gray-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded answer */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5">
          <div className="pt-3">
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {qa.answerBody}
            </p>

            {/* Tags */}
            {showTags && qa.questionTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {qa.questionTags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-md text-xs"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Scenarios */}
            {showScenarios && qa.scenarioLabels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {qa.scenarioLabels.map((scenario) => (
                  <span
                    key={scenario}
                    className="px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-md text-xs border border-purple-500/20"
                  >
                    {SCENARIO_DISPLAY_NAMES[scenario] || scenario}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertQACard;
