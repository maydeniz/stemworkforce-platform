// ===========================================
// FEDERATED LISTINGS PAGE
// Browse aggregated jobs, internships, challenges from all sources
// ===========================================

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronDown, MapPin, Building2, Briefcase,
  GraduationCap, Trophy, Calendar, Sparkles, Globe, Shield, Zap,
  SlidersHorizontal, Grid3X3, List, RefreshCw, ExternalLink
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { FederatedListingCard } from './FederatedListingCard';
import { federationApi, FederatedListingFilters, FederatedListingsResult } from '@/services/federationApi';
import type { FederatedListing, FederatedSourceType } from '@/types/federation';
import type { IndustryType } from '@/types';

// Theme classes
const getThemeClasses = (isDark: boolean) => ({
  bgPrimary: isDark ? 'bg-slate-950' : 'bg-slate-50',
  bgSecondary: isDark ? 'bg-slate-900' : 'bg-white',
  bgTertiary: isDark ? 'bg-slate-800' : 'bg-slate-100',
  borderPrimary: isDark ? 'border-slate-800' : 'border-slate-200',
  textPrimary: isDark ? 'text-white' : 'text-slate-900',
  textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
  textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
  inputBg: isDark ? 'bg-slate-900' : 'bg-white',
  inputBorder: isDark ? 'border-slate-700' : 'border-slate-300',
});

// Content type options
const CONTENT_TYPES = [
  { value: 'all', label: 'All Types', icon: Grid3X3 },
  { value: 'job', label: 'Jobs', icon: Briefcase },
  { value: 'internship', label: 'Internships', icon: GraduationCap },
  { value: 'challenge', label: 'Challenges', icon: Trophy },
  { value: 'event', label: 'Events', icon: Calendar },
  { value: 'scholarship', label: 'Scholarships', icon: Sparkles },
];

// Source type options
const SOURCE_TYPES = [
  { value: 'all', label: 'All Sources' },
  { value: 'federal_agency', label: 'Federal Agencies' },
  { value: 'national_lab', label: 'National Labs' },
  { value: 'industry_partner', label: 'Industry Partners' },
  { value: 'university', label: 'Universities' },
  { value: 'nonprofit', label: 'Nonprofits' },
];

// Industry options
const INDUSTRIES: { value: IndustryType; label: string }[] = [
  { value: 'ai', label: 'Artificial Intelligence' },
  { value: 'quantum', label: 'Quantum Computing' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'nuclear', label: 'Nuclear Energy' },
  { value: 'clean-energy', label: 'Clean Energy' },
  { value: 'biotech', label: 'Biotechnology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'semiconductor', label: 'Semiconductor' },
  { value: 'manufacturing', label: 'Manufacturing' },
];

// US States
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'Washington DC'
];

// Sort options
const SORT_OPTIONS = [
  { value: 'posted_at-desc', label: 'Newest First' },
  { value: 'posted_at-asc', label: 'Oldest First' },
  { value: 'salary-desc', label: 'Highest Salary' },
  { value: 'deadline-asc', label: 'Deadline Soon' },
  { value: 'relevance-desc', label: 'Most Relevant' },
];

export const FederatedListingsPage = () => {
  const { isDark } = useTheme();
  const tc = getThemeClasses(isDark);

  // State
  const [listings, setListings] = useState<FederatedListing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sourceCounts, setSourceCounts] = useState<{ id: string; name: string; count: number }[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState<string>('all');
  const [sourceType, setSourceType] = useState<string>('all');
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryType[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [isRemote, setIsRemote] = useState<boolean | undefined>(undefined);
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [salaryMax, setSalaryMax] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('posted_at-desc');

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Saved listings tracking
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set());

  // Fetch listings
  const fetchListings = async (resetPage: boolean = false) => {
    setLoading(true);

    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    const [sortField, sortOrder] = sortBy.split('-') as ['posted_at' | 'salary' | 'deadline' | 'relevance', 'asc' | 'desc'];

    const filters: FederatedListingFilters = {
      search: searchQuery || undefined,
      contentType: contentType !== 'all' ? contentType as FederatedListingFilters['contentType'] : undefined,
      sourceType: sourceType !== 'all' ? sourceType as FederatedSourceType : undefined,
      industries: selectedIndustries.length > 0 ? selectedIndustries : undefined,
      states: selectedStates.length > 0 ? selectedStates : undefined,
      isRemote: isRemote,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
    };

    const result = await federationApi.listings.list(filters, currentPage, 20, sortField, sortOrder);

    if (resetPage) {
      setListings(result.listings);
    } else {
      setListings(prev => [...prev, ...result.listings]);
    }

    setTotal(result.total);
    setHasMore(result.hasMore);
    setSourceCounts(result.sources);
    setLoading(false);
  };

  // Initial load and filter changes
  useEffect(() => {
    fetchListings(true);
  }, [searchQuery, contentType, sourceType, selectedIndustries, selectedStates, isRemote, salaryMin, salaryMax, sortBy]);

  // Load more
  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchListings(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setContentType('all');
    setSourceType('all');
    setSelectedIndustries([]);
    setSelectedStates([]);
    setIsRemote(undefined);
    setSalaryMin('');
    setSalaryMax('');
    setSortBy('posted_at-desc');
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (contentType !== 'all') count++;
    if (sourceType !== 'all') count++;
    if (selectedIndustries.length > 0) count++;
    if (selectedStates.length > 0) count++;
    if (isRemote !== undefined) count++;
    if (salaryMin || salaryMax) count++;
    return count;
  }, [contentType, sourceType, selectedIndustries, selectedStates, isRemote, salaryMin, salaryMax]);

  return (
    <div className={`min-h-screen ${tc.bgPrimary}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-900/20 to-transparent pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-3xl md:text-4xl font-bold ${tc.textPrimary} mb-2`}>
            STEM Opportunities
          </h1>
          <p className={`text-lg ${tc.textSecondary} max-w-2xl`}>
            Discover jobs, internships, and challenges from National Labs, Federal Agencies,
            Universities, and Industry Partners - all in one place.
          </p>

          {/* Source Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {SOURCE_TYPES.slice(1).map(source => (
              <button
                key={source.value}
                onClick={() => setSourceType(source.value === sourceType ? 'all' : source.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  source.value === sourceType
                    ? 'bg-emerald-500 text-white'
                    : `${tc.bgSecondary} ${tc.textSecondary} hover:bg-emerald-500/20`
                }`}
              >
                {source.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-4 mb-6`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search size={20} className={`absolute left-3 top-1/2 -translate-y-1/2 ${tc.textMuted}`} />
              <input
                type="text"
                placeholder="Search jobs, internships, challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500 ${tc.textPrimary}`}
              />
            </div>

            {/* Content Type Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {CONTENT_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setContentType(type.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      type.value === contentType
                        ? 'bg-emerald-500 text-white'
                        : `${tc.bgTertiary} ${tc.textSecondary} hover:bg-emerald-500/20`
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${tc.bgTertiary} ${tc.textSecondary} hover:bg-emerald-500/20 transition-colors`}
            >
              <SlidersHorizontal size={18} />
              <span className="text-sm font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t border-slate-700">
                  {/* Industry Filter */}
                  <div>
                    <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                      Industries
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {INDUSTRIES.slice(0, 6).map(ind => (
                        <button
                          key={ind.value}
                          onClick={() => {
                            setSelectedIndustries(prev =>
                              prev.includes(ind.value)
                                ? prev.filter(i => i !== ind.value)
                                : [...prev, ind.value]
                            );
                          }}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            selectedIndustries.includes(ind.value)
                              ? 'bg-emerald-500 text-white'
                              : `${tc.bgTertiary} ${tc.textMuted} hover:text-emerald-400`
                          }`}
                        >
                          {ind.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                      Location
                    </label>
                    <select
                      value={selectedStates[0] || ''}
                      onChange={(e) => setSelectedStates(e.target.value ? [e.target.value] : [])}
                      className={`w-full px-3 py-2 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500 ${tc.textPrimary}`}
                    >
                      <option value="">All Locations</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={isRemote === true}
                        onChange={(e) => setIsRemote(e.target.checked ? true : undefined)}
                        className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className={`text-sm ${tc.textSecondary}`}>Remote opportunities only</span>
                    </label>
                  </div>

                  {/* Salary Filter */}
                  <div>
                    <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                      Salary Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className={`w-full px-3 py-2 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500 ${tc.textPrimary}`}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className={`w-full px-3 py-2 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500 ${tc.textPrimary}`}
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full px-3 py-2 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500 ${tc.textPrimary}`}
                    >
                      {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <X size={14} />
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className={`text-sm ${tc.textSecondary}`}>
              {loading && listings.length === 0 ? (
                'Loading...'
              ) : (
                `${total.toLocaleString()} opportunities found`
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className={`flex ${tc.bgSecondary} rounded-lg p-1`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : tc.textMuted}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-500 text-white' : tc.textMuted}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchListings(true)}
              className={`p-2 rounded-lg ${tc.bgSecondary} ${tc.textSecondary} hover:text-emerald-400 transition-colors`}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Source Summary */}
        {sourceCounts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {sourceCounts.slice(0, 5).map(source => (
              <span
                key={source.id}
                className={`text-xs px-2 py-1 ${tc.bgSecondary} ${tc.textMuted} rounded`}
              >
                {source.name}: {source.count}
              </span>
            ))}
          </div>
        )}

        {/* Listings Grid */}
        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5 animate-pulse`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${tc.bgTertiary}`} />
                  <div className="flex-1">
                    <div className={`h-4 ${tc.bgTertiary} rounded w-3/4 mb-2`} />
                    <div className={`h-3 ${tc.bgTertiary} rounded w-1/2`} />
                  </div>
                </div>
                <div className={`h-12 ${tc.bgTertiary} rounded mt-4`} />
                <div className="flex gap-2 mt-4">
                  <div className={`h-6 ${tc.bgTertiary} rounded w-20`} />
                  <div className={`h-6 ${tc.bgTertiary} rounded w-20`} />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-12 text-center`}>
            <Zap size={48} className={`mx-auto ${tc.textMuted} mb-4`} />
            <h3 className={`text-xl font-semibold ${tc.textPrimary} mb-2`}>No opportunities found</h3>
            <p className={tc.textSecondary}>Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FederatedListingCard
                  listing={listing}
                  variant={viewMode === 'list' ? 'compact' : (listing.isFeatured ? 'featured' : 'default')}
                  isSaved={savedListings.has(listing.id)}
                  onSave={(id) => setSavedListings(prev => new Set(prev).add(id))}
                  onUnsave={(id) => {
                    const newSet = new Set(savedListings);
                    newSet.delete(id);
                    setSavedListings(newSet);
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg transition-colors"
            >
              Load More Opportunities
            </button>
          </div>
        )}

        {/* Attribution Footer */}
        <div className={`mt-12 pt-6 border-t ${tc.borderPrimary}`}>
          <div className={`text-center ${tc.textMuted} text-sm`}>
            <p className="mb-2">
              Opportunities aggregated from trusted sources including
              <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline mx-1">USAJobs</a>,
              <a href="https://www.energy.gov/jobs-national-labs" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline mx-1">DOE National Labs</a>,
              <a href="https://www.challenge.gov" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline mx-1">Challenge.gov</a>,
              and partner institutions.
            </p>
            <p>
              All listings link directly to original sources. Apply at the source website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FederatedListingsPage;
