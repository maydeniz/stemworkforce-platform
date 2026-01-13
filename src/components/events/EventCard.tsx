// ===========================================
// Event Card Component
// Reusable card for displaying event information
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  DollarSign,
  Shield,
  ChevronRight,
} from 'lucide-react';
import type { Event, EventType, IndustryType } from '@/types';
import { cn } from '@/utils/helpers';

// ===========================================
// Type Definitions
// ===========================================

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'featured' | 'horizontal';
  showSaveButton?: boolean;
  isSaved?: boolean;
  onSave?: (eventId: string) => void;
  onUnsave?: (eventId: string) => void;
  isRegistered?: boolean;
  className?: string;
}

// ===========================================
// Helper Functions
// ===========================================

const getEventTypeLabel = (type: EventType): string => {
  const labels: Record<EventType, string> = {
    'career-fair': 'Career Fair',
    'conference': 'Conference',
    'networking': 'Networking',
    'workshop': 'Workshop',
    'webinar': 'Webinar',
    'hackathon': 'Hackathon',
    'bootcamp': 'Bootcamp',
    'info-session': 'Info Session',
    'recruiting': 'Recruiting',
    'training': 'Training',
    'panel': 'Panel',
    'meetup': 'Meetup',
  };
  return labels[type] || type;
};

const getEventTypeColor = (type: EventType): string => {
  const colors: Record<EventType, string> = {
    'career-fair': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'conference': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'networking': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'workshop': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'webinar': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'hackathon': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'bootcamp': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'info-session': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'recruiting': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'training': 'bg-green-500/20 text-green-400 border-green-500/30',
    'panel': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    'meetup': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

const getIndustryLabel = (industry: IndustryType): string => {
  const labels: Record<IndustryType, string> = {
    'semiconductor': 'Semiconductor',
    'nuclear': 'Nuclear',
    'ai': 'AI & ML',
    'quantum': 'Quantum',
    'cybersecurity': 'Cybersecurity',
    'aerospace': 'Aerospace',
    'biotech': 'Biotech',
    'robotics': 'Robotics',
    'clean-energy': 'Clean Energy',
    'manufacturing': 'Manufacturing',
    'healthcare': 'Healthcare',
  };
  return labels[industry] || industry;
};

const formatEventDate = (date: string, endDate?: string): string => {
  const startDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  if (endDate) {
    const end = new Date(endDate);
    if (startDate.getMonth() === end.getMonth()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${startDate.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }

  return startDate.toLocaleDateString('en-US', { ...options, year: 'numeric' });
};

const formatEventTime = (date: string): string => {
  const eventDate = new Date(date);
  return eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getDaysUntilEvent = (date: string): { label: string; urgent: boolean } => {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Past', urgent: false };
  if (diffDays === 0) return { label: 'Today!', urgent: true };
  if (diffDays === 1) return { label: 'Tomorrow', urgent: true };
  if (diffDays <= 7) return { label: `${diffDays} days left`, urgent: true };
  if (diffDays <= 30) return { label: `${diffDays} days`, urgent: false };
  return { label: formatEventDate(date), urgent: false };
};

const getSpotsInfo = (capacity: number, attendees: number): { text: string; percentage: number; urgent: boolean } => {
  if (!capacity) return { text: 'Unlimited', percentage: 0, urgent: false };

  const spotsLeft = capacity - attendees;
  const percentage = (attendees / capacity) * 100;

  if (spotsLeft <= 0) return { text: 'Sold Out', percentage: 100, urgent: true };
  if (percentage >= 90) return { text: `${spotsLeft} spots left!`, percentage, urgent: true };
  if (percentage >= 75) return { text: `${spotsLeft} spots left`, percentage, urgent: false };
  return { text: `${spotsLeft} spots available`, percentage, urgent: false };
};

// ===========================================
// Event Card Component
// ===========================================

export const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = 'default',
  showSaveButton = true,
  isSaved = false,
  onSave,
  onUnsave,
  isRegistered = false,
  className,
}) => {
  const daysUntil = getDaysUntilEvent(event.date);
  const spotsInfo = getSpotsInfo(event.capacity, event.attendeesCount);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved && onUnsave) {
      onUnsave(event.id);
    } else if (!isSaved && onSave) {
      onSave(event.id);
    }
  };

  // Featured variant
  if (variant === 'featured') {
    return (
      <Link to={`/events/${event.slug || event.id}`}>
        <motion.article
          className={cn(
            'group relative bg-gradient-to-br from-dark-surface to-dark-bg border border-dark-border rounded-2xl overflow-hidden',
            'hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300',
            className
          )}
          whileHover={{ y: -4 }}
        >
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-blue-400/50" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />

            {/* Featured badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-semibold bg-amber-500 text-black rounded-full">
                Featured
              </span>
            </div>

            {/* Days until badge */}
            <div className="absolute top-4 right-4">
              <span className={cn(
                'px-3 py-1 text-xs font-semibold rounded-full',
                daysUntil.urgent ? 'bg-red-500/90 text-white' : 'bg-dark-surface/90 text-gray-300'
              )}>
                {daysUntil.label}
              </span>
            </div>

            {/* Save button */}
            {showSaveButton && (
              <button
                onClick={handleSaveClick}
                className="absolute bottom-4 right-4 p-2 rounded-full bg-dark-surface/80 hover:bg-dark-surface transition-colors"
                aria-label={isSaved ? 'Remove from saved' : 'Save event'}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-blue-400" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                )}
              </button>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Event Type & Category */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={cn('px-2.5 py-1 text-xs font-medium rounded-md border', getEventTypeColor(event.type))}>
                {getEventTypeLabel(event.type)}
              </span>
              {event.isFree && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-green-500/20 text-green-400 border border-green-500/30">
                  Free
                </span>
              )}
              {event.virtual && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Virtual
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {event.shortDescription || event.description}
            </p>

            {/* Event Details */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>{formatEventDate(event.date, event.endDate)}</span>
                <span className="text-gray-600">|</span>
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{formatEventTime(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                {event.virtual ? (
                  <>
                    <Video className="w-4 h-4 text-indigo-400" />
                    <span>Virtual Event</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{event.location}</span>
                  </>
                )}
              </div>
              {event.organizer && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span>{event.organizer.name}</span>
                </div>
              )}
            </div>

            {/* Industries */}
            {event.industries && event.industries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {event.industries.slice(0, 3).map((industry) => (
                  <span
                    key={industry}
                    className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded"
                  >
                    {getIndustryLabel(industry)}
                  </span>
                ))}
                {event.industries.length > 3 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-500 rounded">
                    +{event.industries.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-dark-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{event.attendeesCount.toLocaleString()}</span>
                </div>
                {spotsInfo.percentage > 0 && (
                  <div className={cn(
                    'text-xs font-medium',
                    spotsInfo.urgent ? 'text-red-400' : 'text-gray-500'
                  )}>
                    {spotsInfo.text}
                  </div>
                )}
              </div>
              {isRegistered ? (
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                  Registered
                </span>
              ) : (
                <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                  View Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </div>
          </div>
        </motion.article>
      </Link>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link to={`/events/${event.slug || event.id}`}>
        <motion.article
          className={cn(
            'group bg-dark-surface border border-dark-border rounded-xl p-4',
            'hover:border-blue-500/50 hover:bg-dark-surface/80 transition-all duration-200',
            className
          )}
          whileHover={{ x: 4 }}
        >
          <div className="flex items-start gap-4">
            {/* Date Badge */}
            <div className="flex-shrink-0 w-14 h-14 bg-blue-500/10 rounded-xl flex flex-col items-center justify-center border border-blue-500/20">
              <span className="text-xs font-medium text-blue-400">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="text-xl font-bold text-white">
                {new Date(event.date).getDate()}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', getEventTypeColor(event.type))}>
                  {getEventTypeLabel(event.type)}
                </span>
                {event.isFree && (
                  <span className="text-xs text-green-400">Free</span>
                )}
              </div>
              <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                {event.title}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  {event.virtual ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                  {event.virtual ? 'Virtual' : event.location}
                </span>
                <span>{formatEventTime(event.date)}</span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
        </motion.article>
      </Link>
    );
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <Link to={`/events/${event.slug || event.id}`}>
        <motion.article
          className={cn(
            'group bg-dark-surface border border-dark-border rounded-xl overflow-hidden',
            'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300',
            className
          )}
          whileHover={{ y: -2 }}
        >
          <div className="flex">
            {/* Image */}
            <div className="relative w-48 flex-shrink-0">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-blue-400/50" />
                </div>
              )}
              {daysUntil.urgent && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-red-500/90 text-white rounded">
                    {daysUntil.label}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', getEventTypeColor(event.type))}>
                  {getEventTypeLabel(event.type)}
                </span>
                {event.isFree && (
                  <span className="text-xs font-medium text-green-400">Free</span>
                )}
                {event.clearanceRequired && (
                  <span className="flex items-center gap-1 text-xs text-amber-400">
                    <Shield className="w-3 h-3" />
                    {event.clearanceRequired}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                {event.title}
              </h3>

              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {event.shortDescription || event.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  {formatEventDate(event.date, event.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  {event.virtual ? (
                    <>
                      <Video className="w-4 h-4 text-indigo-400" />
                      Virtual
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {event.location}
                    </>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {event.attendeesCount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Save Button */}
            {showSaveButton && (
              <div className="flex items-start p-4">
                <button
                  onClick={handleSaveClick}
                  className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
                  aria-label={isSaved ? 'Remove from saved' : 'Save event'}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-500 hover:text-blue-400" />
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/events/${event.slug || event.id}`}>
      <motion.article
        className={cn(
          'group bg-dark-surface border border-dark-border rounded-xl overflow-hidden',
          'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300',
          className
        )}
        whileHover={{ y: -4 }}
      >
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-blue-400/50" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className={cn('px-2.5 py-1 text-xs font-medium rounded-md border', getEventTypeColor(event.type))}>
              {getEventTypeLabel(event.type)}
            </span>
            {daysUntil.urgent && (
              <span className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md',
                daysUntil.label === 'Today!' || daysUntil.label === 'Tomorrow'
                  ? 'bg-red-500 text-white'
                  : 'bg-amber-500/90 text-black'
              )}>
                {daysUntil.label}
              </span>
            )}
          </div>

          {/* Save button */}
          {showSaveButton && (
            <button
              onClick={handleSaveClick}
              className="absolute bottom-3 right-3 p-2 rounded-lg bg-dark-surface/80 hover:bg-dark-surface transition-colors"
              aria-label={isSaved ? 'Remove from saved' : 'Save event'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-blue-400" />
              ) : (
                <Bookmark className="w-4 h-4 text-gray-400 hover:text-blue-400" />
              )}
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Event Details */}
          <div className="space-y-1.5 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="truncate">{formatEventDate(event.date, event.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              {event.virtual ? (
                <>
                  <Video className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Virtual Event</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {event.isFree && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded">
                Free
              </span>
            )}
            {event.clearanceRequired && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded">
                <Shield className="w-3 h-3" />
                Clearance
              </span>
            )}
            {event.industries && event.industries.slice(0, 2).map((industry) => (
              <span
                key={industry}
                className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded"
              >
                {getIndustryLabel(industry)}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{event.attendeesCount.toLocaleString()}</span>
              {spotsInfo.urgent && (
                <span className="text-xs text-red-400 ml-1">
                  {spotsInfo.text}
                </span>
              )}
            </div>
            {isRegistered ? (
              <span className="text-xs font-medium text-emerald-400">
                Registered
              </span>
            ) : !event.isFree && (
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <DollarSign className="w-3.5 h-3.5" />
                ${event.registrationFee}
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

// ===========================================
// Event Card Skeleton
// ===========================================

export const EventCardSkeleton: React.FC<{ variant?: 'default' | 'compact' | 'featured' }> = ({
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gray-800 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="w-20 h-5 bg-gray-800 rounded" />
            <div className="w-3/4 h-5 bg-gray-800 rounded" />
            <div className="w-1/2 h-4 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden animate-pulse">
      <div className={cn('bg-gray-800', variant === 'featured' ? 'h-48' : 'h-40')} />
      <div className="p-5 space-y-3">
        <div className="w-24 h-6 bg-gray-800 rounded" />
        <div className="w-full h-6 bg-gray-800 rounded" />
        <div className="w-3/4 h-6 bg-gray-800 rounded" />
        <div className="space-y-2">
          <div className="w-1/2 h-4 bg-gray-800 rounded" />
          <div className="w-2/3 h-4 bg-gray-800 rounded" />
        </div>
        <div className="flex gap-2 pt-4 border-t border-dark-border">
          <div className="w-16 h-5 bg-gray-800 rounded" />
          <div className="w-20 h-5 bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
