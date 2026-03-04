// ===========================================
// Career Q&A Search Bar Component
// Search + filter for CareerNet Q&A data
// ===========================================

import React, { useState, useCallback } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { SCENARIO_DISPLAY_NAMES } from '@/types/careernet';

interface CareerQASearchBarProps {
  onSearch: (query: string) => void;
  onScenarioChange?: (scenario: string | null) => void;
  selectedScenario?: string | null;
  placeholder?: string;
  showScenarioFilter?: boolean;
  className?: string;
}

const POPULAR_SCENARIOS = [
  'interview-prep',
  'resume-optimization',
  'first-job',
  'skill-development',
  'career-exploration',
  'networking-mentorship',
  'salary-negotiation',
  'education-planning',
];

const CareerQASearchBar: React.FC<CareerQASearchBarProps> = ({
  onSearch,
  onScenarioChange,
  selectedScenario,
  placeholder = 'Search career questions...',
  showScenarioFilter = true,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-800/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {query && (
            <button
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showScenarioFilter && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle scenario filters"
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
              showFilters || selectedScenario
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                : 'bg-gray-800/50 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scenario Filter Pills */}
      {showScenarioFilter && showFilters && (
        <div className="flex flex-wrap gap-2">
          {POPULAR_SCENARIOS.map((scenario) => (
            <button
              key={scenario}
              onClick={() =>
                onScenarioChange?.(selectedScenario === scenario ? null : scenario)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedScenario === scenario
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {SCENARIO_DISPLAY_NAMES[scenario] || scenario}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerQASearchBar;
