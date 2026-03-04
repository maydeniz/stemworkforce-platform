// ===========================================
// Counselor Resources Panel
// Browse, filter, and share CareerNet Q&A with students
// ===========================================

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  ChevronDown,
  BarChart3,
} from 'lucide-react';
import ExpertQACard from '@/components/shared/ExpertQACard';
import CareerNetAttribution from '@/components/shared/CareerNetAttribution';
import { useCareerQASearch, useCareerQAStats, useCareerQAPopularTags } from '@/hooks/useCareerQA';
import { SCENARIO_DISPLAY_NAMES } from '@/types/careernet';
import type { CareerQAFilters } from '@/types/careernet';

// Student status → scenario mapping for recommendations
const STUDENT_SCENARIO_MAP: Record<string, { label: string; scenarios: string[]; icon: React.ReactNode }> = {
  applying: {
    label: 'Applying for Jobs',
    scenarios: ['resume-optimization', 'interview-prep'],
    icon: <Briefcase className="w-4 h-4" />,
  },
  exploring: {
    label: 'Exploring Options',
    scenarios: ['career-exploration', 'skill-development', 'education-planning'],
    icon: <Search className="w-4 h-4" />,
  },
  'first-gen': {
    label: 'First-Gen Students',
    scenarios: ['first-job', 'networking-mentorship'],
    icon: <GraduationCap className="w-4 h-4" />,
  },
  'job-search': {
    label: 'Job Search',
    scenarios: ['job-search-strategy', 'salary-negotiation'],
    icon: <TrendingUp className="w-4 h-4" />,
  },
};

const SCENARIO_OPTIONS = [
  'interview-prep',
  'resume-optimization',
  'first-job',
  'skill-development',
  'career-exploration',
  'networking-mentorship',
  'salary-negotiation',
  'education-planning',
  'industry-transition',
  'work-life-balance',
];

const CounselorResourcesPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedStudentType, setSelectedStudentType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Derive filters
  const filters = useMemo<CareerQAFilters>(() => {
    const f: CareerQAFilters = {};
    if (searchQuery) f.search = searchQuery;
    if (selectedScenario) {
      f.scenarios = [selectedScenario];
    } else if (selectedStudentType && STUDENT_SCENARIO_MAP[selectedStudentType]) {
      f.scenarios = STUDENT_SCENARIO_MAP[selectedStudentType].scenarios;
    }
    return f;
  }, [searchQuery, selectedScenario, selectedStudentType]);

  const { data: searchResults, isLoading } = useCareerQASearch(filters, 1, 10);
  const { data: stats } = useCareerQAStats();
  const { data: popularTags } = useCareerQAPopularTags(20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Career Q&A Resources
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Browse {stats?.totalPairs?.toLocaleString() || '144,000'}+ expert-annotated career Q&A to share with students
          </p>
        </div>
      </div>

      {/* Quick Recommendations by Student Type */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(STUDENT_SCENARIO_MAP).map(([key, config]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedStudentType(selectedStudentType === key ? null : key);
              setSelectedScenario(null);
            }}
            className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
              selectedStudentType === key
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                : 'bg-gray-800/50 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {config.icon}
              <span className="text-sm font-medium">{config.label}</span>
            </div>
            <p className="text-xs text-gray-500">
              {config.scenarios.map(s => SCENARIO_DISPLAY_NAMES[s] || s).join(', ')}
            </p>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search career Q&A by topic, skill, or industry..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${
            showFilters ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' : 'bg-gray-800/50 border-white/10 text-gray-400'
          }`}
        >
          <Filter className="w-4 h-4" />
          Scenarios
          <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Scenario Filter Chips */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {SCENARIO_OPTIONS.map((scenario) => (
            <button
              key={scenario}
              onClick={() => {
                setSelectedScenario(selectedScenario === scenario ? null : scenario);
                setSelectedStudentType(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedScenario === scenario
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {SCENARIO_DISPLAY_NAMES[scenario] || scenario}
            </button>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-500">Total Q&A Pairs</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.totalPairs.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-500">Avg Quality</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.avgQuality.toFixed(1)}/4.0</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-500">Industries Covered</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.byIndustry.length || 11}</p>
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {popularTags && popularTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Popular Topics</h3>
          <div className="flex flex-wrap gap-1.5">
            {popularTags.slice(0, 15).map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2 py-1 bg-gray-800/50 text-gray-400 rounded text-xs border border-white/5 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
              >
                {tag} <span className="text-gray-600">({count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          {isLoading ? 'Searching...' : `${searchResults?.total || 0} results`}
          {selectedScenario && ` for "${SCENARIO_DISPLAY_NAMES[selectedScenario] || selectedScenario}"`}
          {selectedStudentType && ` for ${STUDENT_SCENARIO_MAP[selectedStudentType]?.label}`}
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : searchResults?.items.length ? (
          <div className="space-y-3">
            {searchResults.items.map((qa) => (
              <ExpertQACard
                key={qa.id}
                qa={qa}
                showTags
                showScenarios
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No results found. Try a different search or filter.</p>
          </div>
        )}
      </div>

      {/* Attribution */}
      <CareerNetAttribution className="mt-6" />
    </div>
  );
};

export default CounselorResourcesPanel;
