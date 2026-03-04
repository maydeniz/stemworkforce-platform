// ===========================================
// Expert Q&A Section — Reusable Widget
// Fetches and displays CareerNet Q&A filtered by scenario/industry
// Used across consumer pages (interview prep, career launch, etc.)
// ===========================================

import React, { useState } from 'react';
import { MessageCircle, ChevronRight } from 'lucide-react';
import ExpertQACard from './ExpertQACard';
import CareerNetAttribution from './CareerNetAttribution';
import { useCareerQAByScenario, useCareerQAByIndustry } from '@/hooks/useCareerQA';

interface ExpertQASectionProps {
  /** Scenario filter (e.g., 'interview-prep', 'resume-optimization') */
  scenario?: string;
  /** Industry filter (e.g., 'ai', 'cybersecurity') */
  industry?: string;
  /** Maximum items to display */
  limit?: number;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Show compact attribution */
  compactAttribution?: boolean;
  /** Show tags on cards */
  showTags?: boolean;
  /** Show scenario labels on cards */
  showScenarios?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const ExpertQASection: React.FC<ExpertQASectionProps> = ({
  scenario,
  industry,
  limit = 5,
  title = 'Expert Career Q&A',
  description,
  compactAttribution = true,
  showTags = true,
  showScenarios = false,
  className = '',
}) => {
  const [showAll, setShowAll] = useState(false);

  // Use scenario-based or industry-based hook
  const scenarioQuery = useCareerQAByScenario(scenario || '', limit);
  const industryQuery = useCareerQAByIndustry(industry || '', limit);

  // Prefer scenario if provided, otherwise use industry
  const { data: items, isLoading } = scenario ? scenarioQuery : industryQuery;

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!items?.length) return null;

  const displayItems = showAll ? items : items.slice(0, 3);
  const hasMore = items.length > 3 && !showAll;

  return (
    <section className={`${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <MessageCircle className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>

      {/* Q&A Cards */}
      <div className="space-y-3">
        {displayItems.map((qa) => (
          <ExpertQACard
            key={qa.id}
            qa={qa}
            showTags={showTags}
            showScenarios={showScenarios}
          />
        ))}
      </div>

      {/* Show More */}
      {hasMore && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          View all {items.length} expert answers
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Attribution */}
      <CareerNetAttribution compact={compactAttribution} className="mt-4" />
    </section>
  );
};

export default ExpertQASection;
