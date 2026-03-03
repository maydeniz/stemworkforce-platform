// ===========================================
// CHALLENGES PAGE
// Browse and filter innovation challenges
// ===========================================

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Clock,
  Sparkles,
  Target,
  GraduationCap,
  Rocket,
  ArrowRight,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { challengesApi } from '@/services/challengesApi';
import { Challenge, ChallengeType, ChallengeStatus, IndustryType } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ===========================================
// CONSTANTS
// ===========================================

const CHALLENGE_TYPES: { value: ChallengeType; label: string; icon: React.ElementType }[] = [
  { value: 'ideation', label: 'Ideation', icon: Sparkles },
  { value: 'prototype', label: 'Prototype', icon: Rocket },
  { value: 'solution', label: 'Solution', icon: Target },
  { value: 'research', label: 'Research', icon: GraduationCap },
  { value: 'hackathon', label: 'Hackathon', icon: Clock },
  { value: 'grand-challenge', label: 'Grand Challenge', icon: Trophy },
];

const INDUSTRIES: { value: IndustryType; label: string }[] = [
  { value: 'semiconductor', label: 'Semiconductor' },
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'quantum', label: 'Quantum Computing' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'nuclear', label: 'Nuclear Energy' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'biotech', label: 'Biotechnology' },
  { value: 'clean-energy', label: 'Clean Energy' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'manufacturing', label: 'Advanced Manufacturing' },
];

const STATUS_OPTIONS: { value: ChallengeStatus | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Challenges', color: 'gray' },
  { value: 'open', label: 'Open Now', color: 'green' },
  { value: 'upcoming', label: 'Coming Soon', color: 'blue' },
  { value: 'evaluating', label: 'In Evaluation', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'purple' },
];

const statusDotColors: Record<string, string> = {
  gray: 'bg-gray-500', green: 'bg-green-500', blue: 'bg-blue-500',
  yellow: 'bg-yellow-500', purple: 'bg-purple-500',
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function formatPrize(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatusColor(status: ChallengeStatus): string {
  const colors: Partial<Record<ChallengeStatus, string>> = {
    draft: 'bg-gray-500/20 text-gray-400',
    upcoming: 'bg-blue-500/20 text-blue-400',
    open: 'bg-green-500/20 text-green-400',
    evaluating: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-purple-500/20 text-purple-400',
    cancelled: 'bg-red-500/20 text-red-400',
    'registration-open': 'bg-green-500/20 text-green-400',
    active: 'bg-green-500/20 text-green-400',
    'submission-closed': 'bg-yellow-500/20 text-yellow-400',
    judging: 'bg-yellow-500/20 text-yellow-400',
    'winners-announced': 'bg-purple-500/20 text-purple-400',
    'pending-approval': 'bg-gray-500/20 text-gray-400',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400';
}

function getChallengeTypeIcon(type: ChallengeType): React.ElementType {
  const typeConfig = CHALLENGE_TYPES.find(t => t.value === type);
  return typeConfig?.icon || Trophy;
}

// ===========================================
// CHALLENGE CARD COMPONENT
// ===========================================

interface ChallengeCardProps {
  challenge: Challenge;
  featured?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, featured }) => {
  const daysRemaining = getDaysRemaining(challenge.endDate || challenge.submissionDeadline);
  const TypeIcon = getChallengeTypeIcon(challenge.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative bg-gray-900/50 border rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 ${
        featured ? 'border-yellow-500/50' : 'border-gray-800'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        </div>
      )}

      {/* Header with Image/Gradient */}
      <div className={`h-32 bg-gradient-to-br ${
        challenge.industry === 'ai' ? 'from-purple-600/30 to-blue-600/30' :
        challenge.industry === 'semiconductor' ? 'from-blue-600/30 to-cyan-600/30' :
        challenge.industry === 'quantum' ? 'from-indigo-600/30 to-purple-600/30' :
        challenge.industry === 'aerospace' ? 'from-slate-600/30 to-blue-600/30' :
        challenge.industry === 'nuclear' ? 'from-green-600/30 to-yellow-600/30' :
        'from-gray-600/30 to-gray-500/30'
      } relative`}>
        {/* Sponsor Logo Placeholder */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <span className="text-sm text-gray-300">{challenge.sponsor?.name || 'Sponsor'}</span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(challenge.status)}`}>
            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Type & Industry Tags */}
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
            <TypeIcon className="w-3 h-3" />
            {CHALLENGE_TYPES.find(t => t.value === challenge.type)?.label || challenge.type}
          </span>
          <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
            {INDUSTRIES.find(i => i.value === challenge.industry)?.label || challenge.industry}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {challenge.title}
        </h3>

        {/* Short Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {challenge.shortDescription}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
            <DollarSign className="w-4 h-4 mx-auto text-green-400 mb-1" />
            <div className="text-sm font-semibold text-white">{formatPrize(challenge.totalPrizePool)}</div>
            <div className="text-xs text-gray-500">Prize Pool</div>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
            <Users className="w-4 h-4 mx-auto text-blue-400 mb-1" />
            <div className="text-sm font-semibold text-white">{challenge.registrationCount ?? challenge.registeredSolversCount}</div>
            <div className="text-xs text-gray-500">Registered</div>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
            <Calendar className="w-4 h-4 mx-auto text-purple-400 mb-1" />
            <div className="text-sm font-semibold text-white">
              {daysRemaining > 0 ? `${daysRemaining}d` : 'Closed'}
            </div>
            <div className="text-xs text-gray-500">
              {daysRemaining > 0 ? 'Remaining' : ''}
            </div>
          </div>
        </div>

        {/* Deadline */}
        {challenge.status === 'open' && daysRemaining > 0 && daysRemaining <= 7 && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">
              {daysRemaining === 1 ? 'Last day to submit!' : `Only ${daysRemaining} days left!`}
            </span>
          </div>
        )}

        {/* CTA Button */}
        <Link
          to={`/challenges/${challenge.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          View Challenge
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

// ===========================================
// FEATURED CHALLENGES SECTION
// ===========================================

interface FeaturedSectionProps {
  challenges: Challenge[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ challenges }) => {
  if (challenges.length === 0) return null;

  const mainFeatured = challenges[0];
  const otherFeatured = challenges.slice(1, 3);

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Featured Challenges</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Featured Challenge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:row-span-2 relative bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl overflow-hidden"
        >
          <div className={`h-48 bg-gradient-to-br ${
            mainFeatured.industry === 'ai' ? 'from-purple-600/40 to-blue-600/40' :
            mainFeatured.industry === 'semiconductor' ? 'from-blue-600/40 to-cyan-600/40' :
            'from-gray-600/40 to-gray-500/40'
          }`}>
            <div className="absolute top-4 left-4">
              <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-black text-sm font-bold rounded-full">
                <Sparkles className="w-4 h-4" />
                Featured
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mainFeatured.status)}`}>
                {mainFeatured.status.charAt(0).toUpperCase() + mainFeatured.status.slice(1)}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400 text-sm">
                {INDUSTRIES.find(i => i.value === mainFeatured.industry)?.label}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">{mainFeatured.title}</h3>
            <p className="text-gray-300 mb-6">{mainFeatured.shortDescription}</p>

            <div className="flex items-center gap-6 mb-6">
              <div>
                <div className="text-2xl font-bold text-green-400">{formatPrize(mainFeatured.totalPrizePool)}</div>
                <div className="text-sm text-gray-500">Total Prize Pool</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{mainFeatured.registrationCount || mainFeatured.registeredSolversCount}</div>
                <div className="text-sm text-gray-500">Registered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{getDaysRemaining(mainFeatured.endDate || mainFeatured.submissionDeadline)}d</div>
                <div className="text-sm text-gray-500">Remaining</div>
              </div>
            </div>

            <Link
              to={`/challenges/${mainFeatured.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
            >
              View Challenge
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Other Featured */}
        {otherFeatured.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ChallengeCard challenge={challenge} featured />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ===========================================
// FILTERS SIDEBAR
// ===========================================

interface FiltersProps {
  selectedTypes: ChallengeType[];
  selectedIndustries: IndustryType[];
  selectedStatus: ChallengeStatus | 'all';
  onTypeChange: (types: ChallengeType[]) => void;
  onIndustryChange: (industries: IndustryType[]) => void;
  onStatusChange: (status: ChallengeStatus | 'all') => void;
  onClearAll: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedTypes,
  selectedIndustries,
  selectedStatus,
  onTypeChange,
  onIndustryChange,
  onStatusChange,
  onClearAll,
  isMobile,
  onClose,
}) => {
  const hasFilters = selectedTypes.length > 0 || selectedIndustries.length > 0 || selectedStatus !== 'all';

  return (
    <div className={`${isMobile ? 'p-4' : ''}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}

      {/* Clear All */}
      {hasFilters && (
        <button
          onClick={onClearAll}
          className="w-full mb-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Status</h4>
        <div className="space-y-2">
          {STATUS_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedStatus === option.value
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${statusDotColors[option.color] || 'bg-slate-500'}`} />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Type */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Challenge Type</h4>
        <div className="space-y-2">
          {CHALLENGE_TYPES.map(type => {
            const Icon = type.icon;
            const isSelected = selectedTypes.includes(type.value);
            return (
              <button
                key={type.value}
                onClick={() => {
                  if (isSelected) {
                    onTypeChange(selectedTypes.filter(t => t !== type.value));
                  } else {
                    onTypeChange([...selectedTypes, type.value]);
                  }
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Industry */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Industry</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {INDUSTRIES.map(industry => {
            const isSelected = selectedIndustries.includes(industry.value);
            return (
              <button
                key={industry.value}
                onClick={() => {
                  if (isSelected) {
                    onIndustryChange(selectedIndustries.filter(i => i !== industry.value));
                  } else {
                    onIndustryChange([...selectedIndustries, industry.value]);
                  }
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                {industry.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};

// ===========================================
// MAIN CHALLENGES PAGE
// ===========================================

const ChallengesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [featuredChallenges, setFeaturedChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<ChallengeType[]>(() => {
    const types = searchParams.get('types');
    return types ? (types.split(',') as ChallengeType[]) : [];
  });
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryType[]>(() => {
    const industries = searchParams.get('industries');
    return industries ? (industries.split(',') as IndustryType[]) : [];
  });
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus | 'all'>(() => {
    const status = searchParams.get('status');
    return (status as ChallengeStatus) || 'all';
  });

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch featured challenges
        const featuredData = await challengesApi.challenges.getFeatured(3);
        setFeaturedChallenges(featuredData);

        // Fetch all challenges with filters
        const filters: Record<string, unknown> = {};
        if (selectedTypes.length > 0) filters.types = selectedTypes;
        if (selectedIndustries.length > 0) filters.industries = selectedIndustries;
        if (selectedStatus !== 'all') filters.status = [selectedStatus];
        if (searchQuery) filters.search = searchQuery;

        const result = await challengesApi.challenges.list(filters);
        setChallenges(result.challenges);
      } catch (err) {
        setError('An error occurred while loading challenges');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, [selectedTypes, selectedIndustries, selectedStatus, searchQuery]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
    if (selectedIndustries.length > 0) params.set('industries', selectedIndustries.join(','));
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTypes, selectedIndustries, selectedStatus, setSearchParams]);

  // Filter challenges displayed (exclude featured from main grid if shown separately)
  const displayedChallenges = useMemo(() => {
    const featuredIds = new Set(featuredChallenges.map(c => c.id));
    return challenges.filter(c => !featuredIds.has(c.id));
  }, [challenges, featuredChallenges]);

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedIndustries([]);
    setSelectedStatus('all');
    setSearchQuery('');
  };

  const activeFilterCount = selectedTypes.length + selectedIndustries.length + (selectedStatus !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Innovation Challenges</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Solve Real-World Problems
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join innovation challenges from leading companies and organizations.
              Compete for prizes, gain recognition, and make an impact.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges by title, sponsor, or keyword..."
                className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{challenges.length}</div>
              <div className="text-sm text-gray-400">Active Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                ${(challenges.reduce((sum, c) => sum + c.totalPrizePool, 0) / 1000000).toFixed(1)}M+
              </div>
              <div className="text-sm text-gray-400">Total Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {challenges.reduce((sum, c) => sum + (c.registrationCount ?? c.registeredSolversCount ?? 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Registered Solvers</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-white">Filters</h3>
              </div>
              <Filters
                selectedTypes={selectedTypes}
                selectedIndustries={selectedIndustries}
                selectedStatus={selectedStatus}
                onTypeChange={setSelectedTypes}
                onIndustryChange={setSelectedIndustries}
                onStatusChange={setSelectedStatus}
                onClearAll={clearAllFilters}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="text-red-400 mb-4">{error}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Content */}
            {!isLoading && !error && (
              <>
                {/* Featured Challenges */}
                {featuredChallenges.length > 0 && selectedStatus === 'all' && !searchQuery && (
                  <FeaturedSection challenges={featuredChallenges} />
                )}

                {/* All Challenges Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : selectedStatus !== 'all'
                      ? `${STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label}`
                      : 'All Challenges'}
                    <span className="ml-2 text-gray-500 font-normal">
                      ({displayedChallenges.length})
                    </span>
                  </h2>
                </div>

                {/* Challenge Grid */}
                {displayedChallenges.length > 0 ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {displayedChallenges.map((challenge, index) => (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ChallengeCard challenge={challenge} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-gray-800">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Challenges Found</h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery
                        ? `No challenges match your search "${searchQuery}"`
                        : 'No challenges match your current filters'}
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-gray-900 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Filters
                selectedTypes={selectedTypes}
                selectedIndustries={selectedIndustries}
                selectedStatus={selectedStatus}
                onTypeChange={setSelectedTypes}
                onIndustryChange={setSelectedIndustries}
                onStatusChange={setSelectedStatus}
                onClearAll={clearAllFilters}
                isMobile
                onClose={() => setShowMobileFilters(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ChallengesPage;
