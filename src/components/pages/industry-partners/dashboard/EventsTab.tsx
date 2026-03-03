// ===========================================
// Events Tab - Industry Partner Dashboard
// Career fairs and recruiting events
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  Video,
  Building2,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { getRecruitingEvents } from '@/services/industryPartnerApi';
import type { RecruitingEvent, EventType, PartnerTier } from '@/types/industryPartner';

// ===========================================
// TYPES
// ===========================================

interface EventsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

// ===========================================
// CONSTANTS
// ===========================================

const EVENT_TYPES: { value: EventType; label: string; icon: React.ElementType }[] = [
  { value: 'career_fair', label: 'Career Fair', icon: Users },
  { value: 'info_session', label: 'Info Session', icon: Building2 },
  { value: 'workshop', label: 'Workshop', icon: Calendar },
  { value: 'hackathon', label: 'Hackathon', icon: Calendar },
  { value: 'campus_visit', label: 'Campus Visit', icon: MapPin },
  { value: 'webinar', label: 'Webinar', icon: Video }
];

// Sample upcoming events
const SAMPLE_EVENTS: RecruitingEvent[] = [
  {
    id: '1',
    partnerId: 'demo',
    name: 'Spring 2025 Virtual Career Fair',
    eventType: 'career_fair',
    description: 'Connect with 5,000+ STEM students and recent graduates',
    format: 'virtual',
    virtualLink: 'https://platform.stemworkforce.org/events/spring-2025',
    startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    timezone: 'America/New_York',
    maxRegistrations: 100,
    currentRegistrations: 67,
    status: 'upcoming',
    isSponsor: true,
    sponsorshipTier: 'Gold',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: 'demo',
    name: 'MIT Campus Recruiting Day',
    eventType: 'campus_visit',
    format: 'in_person',
    venue: 'MIT Stata Center',
    city: 'Cambridge',
    state: 'MA',
    startDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    timezone: 'America/New_York',
    currentRegistrations: 0,
    status: 'upcoming',
    isSponsor: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    partnerId: 'demo',
    name: 'AI/ML Engineering Info Session',
    eventType: 'webinar',
    description: 'Learn about AI/ML career opportunities at our company',
    format: 'virtual',
    startDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
    timezone: 'America/New_York',
    maxRegistrations: 500,
    currentRegistrations: 234,
    status: 'upcoming',
    isSponsor: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Available platform events to register for
const PLATFORM_EVENTS = [
  {
    id: 'p1',
    name: 'Spring 2025 Virtual Career Fair',
    date: 'March 15, 2025',
    type: 'Virtual',
    attendees: '5,000+',
    sponsorshipLevels: ['Bronze ($2,500)', 'Silver ($5,000)', 'Gold ($10,000)', 'Platinum ($25,000)']
  },
  {
    id: 'p2',
    name: 'CHIPS Act Workforce Summit',
    date: 'April 8-9, 2025',
    type: 'Hybrid',
    attendees: '2,000+',
    sponsorshipLevels: ['Exhibitor ($5,000)', 'Sponsor ($15,000)', 'Title Sponsor ($50,000)']
  },
  {
    id: 'p3',
    name: 'National Labs Recruiting Day',
    date: 'May 20, 2025',
    type: 'Virtual',
    attendees: '3,000+',
    sponsorshipLevels: ['Participant (Free)', 'Featured ($2,500)']
  },
  {
    id: 'p4',
    name: 'AI/ML Hackathon',
    date: 'June 1-3, 2025',
    type: 'Virtual',
    attendees: '1,500+',
    sponsorshipLevels: ['Challenge Sponsor ($10,000)', 'Grand Sponsor ($25,000)']
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const EventsTab: React.FC<EventsTabProps> = ({ partnerId, tier }) => {
  const [events, setEvents] = useState<RecruitingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'registered' | 'discover'>('registered');
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showTierGateModal, setShowTierGateModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [partnerId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRegisterInterest = async (eventId: string, eventName: string) => {
    setRegistrationLoading(eventId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRegistrationLoading(null);
    setNotification(`Interest registered for "${eventName}"! The event organizer will contact you with more details.`);
  };

  const handleCreateEvent = () => {
    if (tier === 'starter') {
      setShowTierGateModal(true);
      return;
    }
    setShowCreateEventModal(true);
  };

  const loadEvents = async () => {
    setLoading(true);
    const data = await getRecruitingEvents(partnerId);
    setEvents(data.length > 0 ? data : SAMPLE_EVENTS);
    setLoading(false);
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e => e.status === 'completed');

  const getEventTypeInfo = (type: EventType) => EVENT_TYPES.find(t => t.value === type) || EVENT_TYPES[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {notification && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-between text-emerald-400">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-4 text-emerald-300 hover:text-white">&times;</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Recruiting Events</h2>
          <p className="text-gray-400">Career fairs, campus visits, and recruiting events</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('registered')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'registered'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => setActiveView('discover')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'discover'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      {activeView === 'registered' ? (
        <>
          {/* Upcoming Events */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events ({upcomingEvents.length})</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const typeInfo = getEventTypeInfo(event.eventType);
                const Icon = typeInfo.icon;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          event.format === 'virtual' ? 'bg-blue-500/20' :
                          event.format === 'hybrid' ? 'bg-purple-500/20' :
                          'bg-emerald-500/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            event.format === 'virtual' ? 'text-blue-400' :
                            event.format === 'hybrid' ? 'text-purple-400' :
                            'text-emerald-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{event.name}</h4>
                            {event.isSponsor && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                                {event.sponsorshipTier} Sponsor
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{typeInfo.label} • {event.format}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                        Registered
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.startDateTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {new Date(event.startDateTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })} - {new Date(event.endDateTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {event.format === 'virtual' ? (
                          <>
                            <Video className="w-4 h-4" />
                            Virtual Event
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            {event.venue || `${event.city}, ${event.state}`}
                          </>
                        )}
                      </div>
                    </div>

                    {event.virtualLink && (
                      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                        <a
                          href={event.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Join Event
                        </a>
                        {event.maxRegistrations && (
                          <span className="text-sm text-gray-400">
                            {event.currentRegistrations}/{event.maxRegistrations} registered
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {upcomingEvents.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming events</p>
                  <button
                    onClick={() => setActiveView('discover')}
                    className="mt-2 text-emerald-400 hover:text-emerald-300"
                  >
                    Discover events to join
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Past Events ({pastEvents.length})</h3>
              <div className="space-y-3">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-white">{event.name}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(event.startDateTime).toLocaleDateString()} • {event.format}
                      </p>
                    </div>
                    <div className="text-right">
                      {event.attendeeCount && (
                        <p className="text-emerald-400">{event.attendeeCount} attendees</p>
                      )}
                      {event.leadsGenerated && (
                        <p className="text-sm text-gray-400">{event.leadsGenerated} leads</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Discover Events */
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Platform Events</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {PLATFORM_EVENTS.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-white">{event.name}</h4>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    {event.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    {event.attendees} expected attendees
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Sponsorship Options:</p>
                  <div className="flex flex-wrap gap-1">
                    {event.sponsorshipLevels.map((level, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleRegisterInterest(event.id, event.name)}
                  disabled={registrationLoading === event.id}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {registrationLoading === event.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register Interest'
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl">
            <h4 className="text-lg font-semibold text-white mb-2">Host Your Own Event</h4>
            <p className="text-gray-400 mb-4">
              Organize company info sessions, tech talks, or recruiting events on the platform.
              {tier === 'starter' && ' Upgrade to Growth or Enterprise to access event hosting.'}
            </p>
            <button
              onClick={handleCreateEvent}
              disabled={tier === 'starter'}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateEventModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Create New Event</h3>
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-400 mb-4">
                Create company info sessions, tech talks, or recruiting events to connect with STEM talent.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Event Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Engineering Info Session"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Event Type</label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                    <option value="info_session">Info Session</option>
                    <option value="webinar">Webinar</option>
                    <option value="workshop">Workshop</option>
                    <option value="campus_visit">Campus Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the event..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateEventModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateEventModal(false);
                    setNotification('Event created successfully! It will appear in your events list shortly.');
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                >
                  Create Event
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tier Gate Modal */}
      {showTierGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowTierGateModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Upgrade Required</h3>
            <p className="text-gray-400 mb-6">Event hosting requires a Growth or Enterprise plan. Upgrade your plan to create and host recruiting events on the platform.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowTierGateModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowTierGateModal(false)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">View Plans</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
