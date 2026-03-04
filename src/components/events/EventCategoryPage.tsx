// ===========================================
// Event Category Page Component
// Reusable page for displaying filtered events by category/type
// ===========================================

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Grid,
  List,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Video,
  X,
} from 'lucide-react';
import { eventsService } from '@/services/eventsApi';
import { sampleEvents } from '@/data/sampleEvents';
import { EventCard, EventCardSkeleton } from './EventCard';
import type { Event, EventFilters } from '@/types';
import { cn } from '@/utils/helpers';

// ===========================================
// Category Configuration
// ===========================================

interface CategoryConfig {
  title: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  filters: Partial<EventFilters>;
  relatedCategories?: { label: string; path: string }[];
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  // Career Events
  'career-fairs': {
    title: 'Virtual Career Fairs',
    description: 'Connect with top STEM employers hiring now. Browse opportunities, upload your resume, and interview virtually.',
    icon: '💼',
    color: 'blue',
    bgGradient: 'from-blue-600/30 to-indigo-600/30',
    filters: { types: ['career-fair'] },
    relatedCategories: [
      { label: 'Networking', path: '/events/networking' },
      { label: 'Employer Showcases', path: '/events/employers' },
    ],
  },
  'networking': {
    title: 'Industry Networking Events',
    description: 'Build meaningful connections with professionals in your field. From casual meetups to structured networking sessions.',
    icon: '🤝',
    color: 'amber',
    bgGradient: 'from-amber-600/30 to-orange-600/30',
    filters: { types: ['networking', 'meetup'] },
    relatedCategories: [
      { label: 'Career Fairs', path: '/events/career-fairs' },
      { label: 'Panel Discussions', path: '/events?type=panel' },
    ],
  },
  'workshops': {
    title: 'Resume & Interview Workshops',
    description: 'Sharpen your job search skills with expert-led workshops covering resume optimization, interview techniques, and more.',
    icon: '📝',
    color: 'emerald',
    bgGradient: 'from-emerald-600/30 to-teal-600/30',
    filters: { types: ['workshop', 'training'] },
    relatedCategories: [
      { label: 'Career Fairs', path: '/events/career-fairs' },
      { label: 'Certifications', path: '/events/certifications' },
    ],
  },
  'clearance': {
    title: 'Security Clearance Briefings',
    description: 'Information sessions about security clearance requirements, processes, and career opportunities requiring clearances.',
    icon: '🔐',
    color: 'purple',
    bgGradient: 'from-purple-600/30 to-violet-600/30',
    filters: { clearanceRequired: 'public-trust' },
    relatedCategories: [
      { label: 'Government Programs', path: '/events/government' },
      { label: 'Aerospace & Defense', path: '/events/aerospace-defense' },
    ],
  },

  // Industry Conferences
  'semiconductor': {
    title: 'Semiconductor Industry Events',
    description: 'CHIPS Act workforce summits, fab tours, and career opportunities in the semiconductor industry.',
    icon: '💎',
    color: 'cyan',
    bgGradient: 'from-cyan-600/30 to-blue-600/30',
    filters: { industries: ['semiconductor'] },
    relatedCategories: [
      { label: 'Manufacturing', path: '/events?industry=manufacturing' },
      { label: 'Clean Energy', path: '/events?industry=clean-energy' },
    ],
  },
  'nuclear-energy': {
    title: 'Nuclear & Clean Energy Events',
    description: 'Nuclear workforce development, clean energy transitions, and opportunities at DOE facilities and utilities.',
    icon: '⚛️',
    color: 'green',
    bgGradient: 'from-green-600/30 to-emerald-600/30',
    filters: { industries: ['nuclear', 'clean-energy'] },
    relatedCategories: [
      { label: 'National Labs', path: '/events/national-labs' },
      { label: 'Government Programs', path: '/events/government' },
    ],
  },
  'ai-quantum': {
    title: 'AI & Quantum Technology Events',
    description: 'Cutting-edge conferences and workshops on artificial intelligence, machine learning, and quantum computing careers.',
    icon: '🤖',
    color: 'indigo',
    bgGradient: 'from-indigo-600/30 to-purple-600/30',
    filters: { industries: ['ai', 'quantum'] },
    relatedCategories: [
      { label: 'Cybersecurity', path: '/events?industry=cybersecurity' },
      { label: 'Tech Workshops', path: '/events/workshops' },
    ],
  },
  'aerospace-defense': {
    title: 'Aerospace & Defense Events',
    description: 'Defense industry conferences, space sector workforce development, and opportunities requiring security clearances.',
    icon: '🚀',
    color: 'slate',
    bgGradient: 'from-slate-600/30 to-gray-600/30',
    filters: { industries: ['aerospace'] },
    relatedCategories: [
      { label: 'Clearance Briefings', path: '/events/clearance' },
      { label: 'Government Programs', path: '/events/government' },
    ],
  },

  // Training & Development
  'certifications': {
    title: 'Certification Bootcamps',
    description: 'Intensive programs to earn industry certifications. AWS, Azure, security clearances, and technical credentials.',
    icon: '🎓',
    color: 'orange',
    bgGradient: 'from-orange-600/30 to-red-600/30',
    filters: { types: ['bootcamp', 'training'] },
    relatedCategories: [
      { label: 'Workshops', path: '/events/workshops' },
      { label: 'Leadership Training', path: '/events/leadership' },
    ],
  },
  'leadership': {
    title: 'Leadership & Management Workshops',
    description: 'Executive development, management training, and leadership skills for STEM professionals.',
    icon: '⭐',
    color: 'yellow',
    bgGradient: 'from-yellow-600/30 to-amber-600/30',
    filters: { types: ['workshop', 'training'] },
    relatedCategories: [
      { label: 'Certifications', path: '/events/certifications' },
      { label: 'Networking', path: '/events/networking' },
    ],
  },
  'compliance': {
    title: 'Compliance & Regulatory Training',
    description: 'ITAR, EAR, export controls, and security compliance training for defense and technology sectors.',
    icon: '📋',
    color: 'red',
    bgGradient: 'from-red-600/30 to-pink-600/30',
    filters: { types: ['training', 'workshop'] },
    relatedCategories: [
      { label: 'Clearance Briefings', path: '/events/clearance' },
      { label: 'Aerospace & Defense', path: '/events/aerospace-defense' },
    ],
  },

  // Partner & Employer Events
  'university': {
    title: 'University Recruiting Events',
    description: 'Campus recruiting, info sessions, and student-focused hiring events at top universities.',
    icon: '🏛️',
    color: 'blue',
    bgGradient: 'from-blue-600/30 to-cyan-600/30',
    filters: { types: ['info-session', 'recruiting', 'career-fair'] },
    relatedCategories: [
      { label: 'Career Fairs', path: '/events/career-fairs' },
      { label: 'Employer Showcases', path: '/events/employers' },
    ],
  },
  'national-labs': {
    title: 'National Lab Open Days',
    description: 'DOE facility tours, recruitment events, and research opportunities at national laboratories.',
    icon: '🔬',
    color: 'teal',
    bgGradient: 'from-teal-600/30 to-green-600/30',
    filters: { types: ['info-session', 'recruiting'] },
    relatedCategories: [
      { label: 'Nuclear & Energy', path: '/events/nuclear-energy' },
      { label: 'Government Programs', path: '/events/government' },
    ],
  },
  'government': {
    title: 'Government Workforce Programs',
    description: 'Federal workforce initiatives, agency hiring events, and public sector career opportunities.',
    icon: '🏛️',
    color: 'violet',
    bgGradient: 'from-violet-600/30 to-purple-600/30',
    filters: { types: ['info-session', 'recruiting', 'career-fair'] },
    relatedCategories: [
      { label: 'National Labs', path: '/events/national-labs' },
      { label: 'Clearance Briefings', path: '/events/clearance' },
    ],
  },
  'employers': {
    title: 'Employer Showcases',
    description: 'Company presentations, tech talks, and hiring events from leading STEM employers.',
    icon: '🏢',
    color: 'pink',
    bgGradient: 'from-pink-600/30 to-rose-600/30',
    filters: { types: ['info-session', 'recruiting'] },
    relatedCategories: [
      { label: 'Career Fairs', path: '/events/career-fairs' },
      { label: 'Networking', path: '/events/networking' },
    ],
  },
};

// ===========================================
// Event Category Page Component
// ===========================================

const EventCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter state
  const [filters, setFilters] = useState({
    virtual: searchParams.get('virtual') === 'true',
    inPerson: searchParams.get('inPerson') === 'true',
    free: searchParams.get('free') === 'true',
    search: searchParams.get('search') || '',
  });

  const pageSize = 12;
  const config = category ? CATEGORY_CONFIG[category] : null;

  useEffect(() => {
    if (category && config) {
      loadEvents();
    }
  }, [category, currentPage, filters]);

  const loadEvents = async () => {
    if (!config) return;

    setIsLoading(true);
    setError(null);

    try {
      const eventFilters: EventFilters = {
        ...config.filters,
        virtual: filters.virtual || undefined,
        inPerson: filters.inPerson || undefined,
        free: filters.free || undefined,
        search: filters.search || undefined,
      };

      const result = await eventsService.events.list(eventFilters, currentPage, pageSize);
      setEvents(result.events);
      setTotalEvents(result.total);
    } catch {
      // Fallback to sample events filtered by category config
      let filtered = [...sampleEvents];

      // Filter by industries if specified
      if (config.filters.industries && config.filters.industries.length > 0) {
        filtered = filtered.filter((e) =>
          e.industries?.some((ind) => config.filters.industries!.includes(ind))
        );
      }

      // Filter by search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter((e) =>
          e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)
        );
      }

      // Filter by virtual/in-person
      if (filters.virtual) {
        filtered = filtered.filter((e) => e.virtual);
      }
      if (filters.inPerson) {
        filtered = filtered.filter((e) => !e.virtual);
      }

      // Filter by free
      if (filters.free) {
        filtered = filtered.filter((e) => e.isFree);
      }

      // Paginate
      const start = (currentPage - 1) * pageSize;
      setEvents(filtered.slice(start, start + pageSize));
      setTotalEvents(filtered.length);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: boolean | string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, String(value));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({ virtual: false, inPerson: false, free: false, search: '' });
    setSearchParams({});
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalEvents / pageSize);
  const hasActiveFilters = filters.virtual || filters.inPerson || filters.free || filters.search;

  if (!category || !config) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Category Not Found</h1>
          <p className="text-gray-400 mb-6">This event category doesn't exist.</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div className={cn('relative py-16 px-4', `bg-gradient-to-br ${config.bgGradient}`)}>
        <div className="max-w-7xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            All Events
          </Link>

          <div className="flex items-start gap-4">
            <div className="text-5xl">{config.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {config.title}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                {config.description}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">{totalEvents}</span>
              <span className="text-gray-400">Upcoming Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-20 bg-dark-surface border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFilterChange('virtual', !filters.virtual)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  filters.virtual
                    ? 'bg-indigo-600 text-white'
                    : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-gray-600'
                )}
              >
                <Video className="w-4 h-4" />
                Virtual
              </button>
              <button
                onClick={() => handleFilterChange('inPerson', !filters.inPerson)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  filters.inPerson
                    ? 'bg-emerald-600 text-white'
                    : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-gray-600'
                )}
              >
                <MapPin className="w-4 h-4" />
                In-Person
              </button>
              <button
                onClick={() => handleFilterChange('free', !filters.free)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  filters.free
                    ? 'bg-green-600 text-white'
                    : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-gray-600'
                )}
              >
                Free
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2.5 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                )}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2.5 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                )}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadEvents}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}>
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} variant={viewMode === 'grid' ? 'default' : 'compact'} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Events Found</h2>
            <p className="text-gray-400 mb-6">
              {hasActiveFilters
                ? 'Try adjusting your filters to find more events.'
                : 'Check back soon for upcoming events in this category.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                Showing <span className="text-white font-medium">{events.length}</span> of{' '}
                <span className="text-white font-medium">{totalEvents}</span> events
              </p>
            </div>

            {/* Events Grid/List */}
            <motion.div
              className={cn(
                'grid gap-6',
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              )}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <EventCard
                    event={event}
                    variant={viewMode === 'grid' ? 'default' : 'horizontal'}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-dark-border text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        'w-10 h-10 rounded-lg font-medium transition-colors',
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-dark-border text-gray-400 hover:text-white hover:border-gray-600'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-dark-border text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Related Categories */}
        {config.relatedCategories && config.relatedCategories.length > 0 && (
          <div className="mt-16 pt-8 border-t border-dark-border">
            <h3 className="text-lg font-semibold text-white mb-4">Related Event Categories</h3>
            <div className="flex flex-wrap gap-3">
              {config.relatedCategories.map((rel) => (
                <Link
                  key={rel.path}
                  to={rel.path}
                  className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:text-white hover:border-blue-500/50 transition-colors"
                >
                  {rel.label}
                </Link>
              ))}
              <Link
                to="/events"
                className="px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/20 transition-colors"
              >
                Browse All Events →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCategoryPage;
