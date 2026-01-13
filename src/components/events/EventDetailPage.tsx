// ===========================================
// Event Detail Page Component
// Full event details with registration functionality
// ===========================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Globe,
  Shield,
  Mic,
  Play,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { eventsService } from '@/services/eventsApi';
import type {
  Event,
  EventType,
  IndustryType,
  EventRegistration,
} from '@/types';
import type { DBEventSpeaker, DBEventSponsor, DBEventAgendaItem } from '@/services/eventsApi';
import { EventCard } from './EventCard';
import { cn } from '@/utils/helpers';
import { getSampleEventByIdOrSlug, getRelatedSampleEvents } from '@/data/sampleEvents';

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
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  if (endDate) {
    const end = new Date(endDate);
    if (startDate.getMonth() === end.getMonth() && startDate.getFullYear() === end.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', options)}`;
  }

  return startDate.toLocaleDateString('en-US', options);
};

const formatEventTime = (date: string, endDate?: string, timezone?: string): string => {
  const startTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (endDate) {
    const endTime = new Date(endDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${startTime} - ${endTime}${timezone ? ` ${timezone}` : ''}`;
  }

  return `${startTime}${timezone ? ` ${timezone}` : ''}`;
};

const getSpotsInfo = (capacity: number, attendees: number): { text: string; percentage: number; isFull: boolean } => {
  if (!capacity) return { text: 'Unlimited spots', percentage: 0, isFull: false };

  const spotsLeft = capacity - attendees;
  const percentage = (attendees / capacity) * 100;

  if (spotsLeft <= 0) return { text: 'Sold Out', percentage: 100, isFull: true };
  if (percentage >= 90) return { text: `Only ${spotsLeft} spots left!`, percentage, isFull: false };
  return { text: `${spotsLeft} spots available`, percentage, isFull: false };
};

// ===========================================
// Registration Modal Component
// ===========================================

interface RegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dietaryRequirements: '',
    accessibilityNeeds: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await eventsService.registrations.register(event.id, {
        dietaryRequirements: formData.dietaryRequirements || undefined,
        accessibilityNeeds: formData.accessibilityNeeds || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-dark-surface border border-dark-border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Register for Event</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-dark-bg rounded-xl">
            <h3 className="font-semibold text-white mb-1">{event.title}</h3>
            <p className="text-sm text-gray-400">
              {formatEventDate(event.date, event.endDate)}
            </p>
            {!event.isFree && (
              <p className="text-sm text-blue-400 mt-2">
                Registration Fee: ${event.registrationFee}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dietary Requirements (optional)
              </label>
              <input
                type="text"
                value={formData.dietaryRequirements}
                onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                placeholder="e.g., Vegetarian, Gluten-free, Halal"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Accessibility Needs (optional)
              </label>
              <textarea
                value={formData.accessibilityNeeds}
                onChange={(e) => setFormData({ ...formData, accessibilityNeeds: e.target.value })}
                placeholder="Please let us know if you have any accessibility requirements"
                rows={3}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-dark-border rounded-lg text-gray-300 hover:bg-dark-bg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {event.isFree ? 'Register Now' : `Pay $${event.registrationFee}`}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ===========================================
// Event Detail Page Component
// ===========================================

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [speakers, setSpeakers] = useState<DBEventSpeaker[]>([]);
  const [sponsors, setSponsors] = useState<DBEventSponsor[]>([]);
  const [agenda, setAgenda] = useState<DBEventAgendaItem[]>([]);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'speakers' | 'sponsors'>('overview');

  useEffect(() => {
    if (id) {
      loadEventData(id);
    }
  }, [id]);

  const loadEventData = async (eventId: string) => {
    setIsLoading(true);
    setError(null);

    // First, check if this matches a sample event (faster, no network)
    const sampleEvent = getSampleEventByIdOrSlug(eventId);

    try {
      // Try to load event from database
      let eventData = await eventsService.events.get(eventId);

      // If not found in database, fall back to sample data
      if (!eventData) {
        eventData = sampleEvent || null;
      }

      if (!eventData) {
        setError('Event not found');
        return;
      }
      setEvent(eventData);

      // Try to load related data from database
      try {
        const [speakersData, sponsorsData, agendaData, relatedData] = await Promise.all([
          eventsService.events.getSpeakers(eventData.id),
          eventsService.events.getSponsors(eventData.id),
          eventsService.events.getAgenda(eventData.id),
          eventsService.events.getRelated(eventData.id),
        ]);

        setSpeakers(speakersData);
        setSponsors(sponsorsData);
        setAgenda(agendaData);

        // If no related events from database, use sample data
        if (relatedData.length === 0) {
          setRelatedEvents(getRelatedSampleEvents(eventData.id));
        } else {
          setRelatedEvents(relatedData);
        }
      } catch {
        // If database queries fail, use sample related events
        setSpeakers([]);
        setSponsors([]);
        setAgenda([]);
        setRelatedEvents(getRelatedSampleEvents(eventData.id));
      }

      // Check user registration and saved status
      if (user) {
        try {
          const [regStatus, savedStatus] = await Promise.all([
            eventsService.registrations.getRegistration(eventData.id),
            eventsService.saves.isSaved(eventData.id),
          ]);
          setRegistration(regStatus);
          setIsSaved(savedStatus);
        } catch {
          // User features not available, ignore
        }
      }
    } catch {
      // Database failed - use sample data if available
      if (sampleEvent) {
        setEvent(sampleEvent);
        setRelatedEvents(getRelatedSampleEvents(sampleEvent.id));
        setSpeakers([]);
        setSponsors([]);
        setAgenda([]);
      } else {
        setError('Event not found');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !event) return;

    try {
      if (isSaved) {
        await eventsService.saves.unsave(event.id);
        setIsSaved(false);
      } else {
        await eventsService.saves.save(event.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const handleShare = async () => {
    if (!event) return;

    const shareData = {
      title: event.title,
      text: event.shortDescription || event.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could show a toast here
    }
  };

  const handleRegister = () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = async () => {
    setShowRegistrationModal(false);
    if (event) {
      const regStatus = await eventsService.registrations.getRegistration(event.id);
      setRegistration(regStatus);
    }
  };

  const handleCancelRegistration = async () => {
    if (!event || !registration) return;

    try {
      await eventsService.registrations.cancel(event.id);
      setRegistration(null);
    } catch (err) {
      console.error('Failed to cancel registration:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-gray-800 rounded" />
            <div className="h-64 bg-gray-800 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-10 w-3/4 bg-gray-800 rounded" />
                <div className="h-6 w-1/2 bg-gray-800 rounded" />
                <div className="h-40 bg-gray-800 rounded" />
              </div>
              <div className="h-80 bg-gray-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The event you're looking for doesn't exist."}</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const spotsInfo = getSpotsInfo(event.capacity, event.attendeesCount);
  const isRegistrationClosed = event.status === 'registration-closed' || spotsInfo.isFull;
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="h-64 md:h-80 overflow-hidden">
          {event.bannerImage || event.image ? (
            <img
              src={event.bannerImage || event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 px-4 py-2 bg-dark-surface/80 backdrop-blur-sm border border-dark-border rounded-lg text-white hover:bg-dark-surface transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-3 bg-dark-surface/80 backdrop-blur-sm border border-dark-border rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-colors"
            aria-label="Share event"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {user && (
            <button
              onClick={handleSave}
              className="p-3 bg-dark-surface/80 backdrop-blur-sm border border-dark-border rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-colors"
              aria-label={isSaved ? 'Unsave event' : 'Save event'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-blue-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 md:p-8">
              {/* Type & Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={cn('px-3 py-1 text-sm font-medium rounded-lg border', getEventTypeColor(event.type))}>
                  {getEventTypeLabel(event.type)}
                </span>
                {event.isFree && (
                  <span className="px-3 py-1 text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg">
                    Free Event
                  </span>
                )}
                {event.virtual && (
                  <span className="px-3 py-1 text-sm font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    Virtual
                  </span>
                )}
                {event.clearanceRequired && (
                  <span className="px-3 py-1 text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    {event.clearanceRequired}
                  </span>
                )}
                {isPastEvent && (
                  <span className="px-3 py-1 text-sm font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg">
                    Past Event
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {event.title}
              </h1>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Date</div>
                    <div className="text-white font-medium">
                      {formatEventDate(event.date, event.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Time</div>
                    <div className="text-white font-medium">
                      {formatEventTime(event.date, event.endDate, event.timezone)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {event.virtual ? (
                    <>
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Video className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Location</div>
                        <div className="text-white font-medium">Virtual Event</div>
                        {event.virtualPlatform && (
                          <div className="text-sm text-gray-500 capitalize">{event.virtualPlatform}</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Location</div>
                        <div className="text-white font-medium">{event.location}</div>
                        {event.venue && (
                          <div className="text-sm text-gray-500">{event.venue.name}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Building2 className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Organizer</div>
                      <div className="text-white font-medium">{event.organizer.name}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Industries */}
              {event.industries && event.industries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.industries.map((industry) => (
                    <Link
                      key={industry}
                      to={`/events?industry=${industry}`}
                      className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {getIndustryLabel(industry)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs Navigation */}
            <div className="bg-dark-surface border border-dark-border rounded-xl">
              <div className="flex border-b border-dark-border overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'agenda', label: 'Agenda', count: agenda.length },
                  { id: 'speakers', label: 'Speakers', count: speakers.length },
                  { id: 'sponsors', label: 'Sponsors', count: sponsors.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      'px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative',
                      activeTab === tab.id
                        ? 'text-blue-400'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-gray-800 rounded-full">
                        {tab.count}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">About This Event</h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Topics</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 text-sm bg-dark-bg border border-dark-border rounded-lg text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post-Event Resources */}
                    {isPastEvent && (event.recordingUrl || event.slidesUrl || event.materialsUrl) && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Event Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {event.recordingUrl && (
                            <a
                              href={event.recordingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 bg-dark-bg border border-dark-border rounded-xl hover:border-blue-500/50 transition-colors"
                            >
                              <div className="p-2 bg-red-500/10 rounded-lg">
                                <Play className="w-5 h-5 text-red-400" />
                              </div>
                              <div>
                                <div className="text-white font-medium">Recording</div>
                                <div className="text-xs text-gray-500">Watch replay</div>
                              </div>
                            </a>
                          )}
                          {event.slidesUrl && (
                            <a
                              href={event.slidesUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 bg-dark-bg border border-dark-border rounded-xl hover:border-blue-500/50 transition-colors"
                            >
                              <div className="p-2 bg-blue-500/10 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <div className="text-white font-medium">Slides</div>
                                <div className="text-xs text-gray-500">Download PDF</div>
                              </div>
                            </a>
                          )}
                          {event.materialsUrl && (
                            <a
                              href={event.materialsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 bg-dark-bg border border-dark-border rounded-xl hover:border-blue-500/50 transition-colors"
                            >
                              <div className="p-2 bg-green-500/10 rounded-lg">
                                <Image className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <div className="text-white font-medium">Materials</div>
                                <div className="text-xs text-gray-500">View resources</div>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Agenda Tab */}
                {activeTab === 'agenda' && (
                  <div>
                    {agenda.length > 0 ? (
                      <div className="space-y-4">
                        {agenda.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-4 bg-dark-bg rounded-xl"
                          >
                            <div className="flex-shrink-0 w-20 text-center">
                              <div className="text-sm font-medium text-blue-400">
                                {new Date(item.start_time).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                              </div>
                              {item.end_time && (
                                <div className="text-xs text-gray-500">
                                  {new Date(item.end_time).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                  })}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                  'px-2 py-0.5 text-xs font-medium rounded',
                                  item.type === 'keynote' ? 'bg-purple-500/20 text-purple-400' :
                                  item.type === 'break' ? 'bg-gray-500/20 text-gray-400' :
                                  item.type === 'networking' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-blue-500/20 text-blue-400'
                                )}>
                                  {item.type}
                                </span>
                                {item.room && (
                                  <span className="text-xs text-gray-500">{item.room}</span>
                                )}
                              </div>
                              <h4 className="text-white font-medium">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        Agenda will be announced soon
                      </div>
                    )}
                  </div>
                )}

                {/* Speakers Tab */}
                {activeTab === 'speakers' && (
                  <div>
                    {speakers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {speakers.map((speaker) => (
                          <div
                            key={speaker.id}
                            className="flex gap-4 p-4 bg-dark-bg rounded-xl"
                          >
                            <div className="flex-shrink-0">
                              {speaker.photo ? (
                                <img
                                  src={speaker.photo}
                                  alt={speaker.name}
                                  className="w-16 h-16 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center">
                                  <Mic className="w-6 h-6 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{speaker.name}</h4>
                              {speaker.title && (
                                <p className="text-sm text-gray-400">{speaker.title}</p>
                              )}
                              {speaker.company && (
                                <p className="text-sm text-gray-500">{speaker.company}</p>
                              )}
                              {speaker.session_title && (
                                <p className="text-xs text-blue-400 mt-2">
                                  {speaker.session_title}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        Speakers will be announced soon
                      </div>
                    )}
                  </div>
                )}

                {/* Sponsors Tab */}
                {activeTab === 'sponsors' && (
                  <div>
                    {sponsors.length > 0 ? (
                      <div className="space-y-6">
                        {['platinum', 'gold', 'silver', 'bronze', 'partner'].map((tier) => {
                          const tierSponsors = sponsors.filter((s) => s.tier === tier);
                          if (tierSponsors.length === 0) return null;
                          return (
                            <div key={tier}>
                              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                                {tier} Sponsors
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {tierSponsors.map((sponsor) => (
                                  <a
                                    key={sponsor.id}
                                    href={sponsor.website || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-4 bg-dark-bg rounded-xl hover:bg-gray-800 transition-colors"
                                  >
                                    {sponsor.logo ? (
                                      <img
                                        src={sponsor.logo}
                                        alt={sponsor.name}
                                        className="h-12 object-contain"
                                      />
                                    ) : (
                                      <div className="text-sm font-medium text-white">
                                        {sponsor.name}
                                      </div>
                                    )}
                                  </a>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No sponsors listed
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 sticky top-6">
              {/* Capacity */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Capacity</span>
                  <span className={cn(
                    'text-sm font-medium',
                    spotsInfo.isFull ? 'text-red-400' : 'text-gray-300'
                  )}>
                    {spotsInfo.text}
                  </span>
                </div>
                {event.capacity > 0 && (
                  <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        spotsInfo.percentage >= 90 ? 'bg-red-500' :
                        spotsInfo.percentage >= 75 ? 'bg-amber-500' :
                        'bg-blue-500'
                      )}
                      style={{ width: `${Math.min(spotsInfo.percentage, 100)}%` }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{event.attendeesCount.toLocaleString()} registered</span>
                </div>
              </div>

              {/* Price */}
              {!event.isFree && (
                <div className="mb-6 p-4 bg-dark-bg rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Registration Fee</span>
                    <span className="text-2xl font-bold text-white">
                      ${event.registrationFee}
                    </span>
                  </div>
                  {event.earlyBirdFee && event.earlyBirdDeadline && new Date(event.earlyBirdDeadline) > new Date() && (
                    <div className="mt-2 text-sm text-green-400">
                      Early Bird: ${event.earlyBirdFee} (until {new Date(event.earlyBirdDeadline).toLocaleDateString()})
                    </div>
                  )}
                </div>
              )}

              {/* Registration Status / Button */}
              {registration ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">You're Registered!</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Status: <span className="text-white capitalize">{registration.status}</span>
                    </p>
                  </div>
                  {!isPastEvent && registration.status !== 'cancelled' && (
                    <button
                      onClick={handleCancelRegistration}
                      className="w-full py-3 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
                    >
                      Cancel Registration
                    </button>
                  )}
                </div>
              ) : isPastEvent ? (
                <div className="p-4 bg-gray-500/10 border border-gray-500/20 rounded-xl text-center">
                  <p className="text-gray-400">This event has ended</p>
                </div>
              ) : isRegistrationClosed ? (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                    <p className="text-amber-400">
                      {spotsInfo.isFull ? 'Event is sold out' : 'Registration is closed'}
                    </p>
                  </div>
                  {event.waitlistCount !== undefined && event.waitlistCount > 0 && (
                    <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors">
                      Join Waitlist
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {event.isFree ? 'Register Now - Free' : `Register - $${event.registrationFee}`}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Registration Deadline */}
              {event.registrationDeadline && !isPastEvent && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  Registration closes {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Organizer Card */}
            {event.organizer && (
              <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Organizer
                </h3>
                <div className="flex items-center gap-4">
                  {event.organizer.logo ? (
                    <img
                      src={event.organizer.logo}
                      alt={event.organizer.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-medium">{event.organizer.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{event.organizer.type}</p>
                  </div>
                </div>
                {event.organizer.website && (
                  <a
                    href={event.organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-4 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Venue Card (for in-person events) */}
            {!event.virtual && event.venue && (
              <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Venue
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">{event.venue.name}</p>
                      <p className="text-sm text-gray-400">
                        {event.venue.address}
                        <br />
                        {event.venue.city}, {event.venue.state} {event.venue.zipCode}
                      </p>
                    </div>
                  </div>
                  {event.venue.parkingInfo && (
                    <div className="text-sm text-gray-500">
                      <strong className="text-gray-400">Parking:</strong> {event.venue.parkingInfo}
                    </div>
                  )}
                  {event.venue.accessibilityInfo && (
                    <div className="text-sm text-gray-500">
                      <strong className="text-gray-400">Accessibility:</strong> {event.venue.accessibilityInfo}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Related Events</h2>
              <Link
                to="/events"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedEvents.map((relEvent) => (
                <EventCard key={relEvent.id} event={relEvent} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        event={event}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default EventDetailPage;
