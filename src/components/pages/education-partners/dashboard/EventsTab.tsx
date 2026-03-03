// ===========================================
// Events Tab - Partner Dashboard
// Manage career fairs, info sessions, workshops
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Search,
  MapPin,
  Users,
  Clock,
  Video,
  Building2,
  Loader2,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  ExternalLink
} from 'lucide-react';
import {
  getPartnerEvents,
  createPartnerEvent,
  updatePartnerEvent,
  deletePartnerEvent,
  type PartnerEvent
} from '@/services/educationPartnerApi';

// ===========================================
// TYPES
// ===========================================

interface EventsTabProps {
  partnerId: string;
  canHostEvents: boolean;
}

interface EventFormData {
  title: string;
  description: string;
  eventType: PartnerEvent['eventType'];
  format: PartnerEvent['format'];
  startTime: string;
  endTime: string;
  timezone: string;
  venueName: string;
  address: string;
  city: string;
  state: string;
  virtualPlatform: string;
  virtualLink: string;
  registrationRequired: boolean;
  maxAttendees: number;
  registrationDeadline: string;
  status: PartnerEvent['status'];
}

const EVENT_TYPES: { value: PartnerEvent['eventType']; label: string; icon: typeof Calendar }[] = [
  { value: 'career_fair', label: 'Career Fair', icon: Building2 },
  { value: 'info_session', label: 'Info Session', icon: Users },
  { value: 'workshop', label: 'Workshop', icon: Calendar },
  { value: 'networking', label: 'Networking', icon: Users },
  { value: 'panel', label: 'Panel Discussion', icon: Building2 }
];

const INITIAL_FORM_DATA: EventFormData = {
  title: '',
  description: '',
  eventType: 'career_fair',
  format: 'in_person',
  startTime: '',
  endTime: '',
  timezone: 'America/New_York',
  venueName: '',
  address: '',
  city: '',
  state: '',
  virtualPlatform: '',
  virtualLink: '',
  registrationRequired: true,
  maxAttendees: 100,
  registrationDeadline: '',
  status: 'draft'
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const EventsTab: React.FC<EventsTabProps> = ({ partnerId, canHostEvents }) => {
  const [events, setEvents] = useState<PartnerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PartnerEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailEvent, setDetailEvent] = useState<PartnerEvent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [partnerId]);

  const loadEvents = async () => {
    setLoading(true);
    const data = await getPartnerEvents(partnerId);
    setEvents(data);
    setLoading(false);
  };

  // Stats
  const stats = {
    upcoming: events.filter(e => e.status === 'published' && new Date(e.startTime) > new Date()).length,
    totalRegistrations: events.reduce((sum, e) => sum + e.currentRegistrations, 0),
    completed: events.filter(e => e.status === 'completed').length,
    draft: events.filter(e => e.status === 'draft').length
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || e.eventType === typeFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenModal = (event?: PartnerEvent) => {
    if (event) {
      setEditingEvent(event);
      // Parse the datetime for the form
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);
      setFormData({
        title: event.title,
        description: event.description || '',
        eventType: event.eventType,
        format: event.format,
        startTime: startDate.toISOString().slice(0, 16), // datetime-local format
        endTime: endDate.toISOString().slice(0, 16),
        timezone: event.timezone,
        venueName: event.venueName || '',
        address: event.address || '',
        city: event.city || '',
        state: event.state || '',
        virtualPlatform: event.virtualPlatform || '',
        virtualLink: event.virtualLink || '',
        registrationRequired: event.registrationRequired,
        maxAttendees: event.maxAttendees || 100,
        registrationDeadline: event.registrationDeadline?.slice(0, 16) || '',
        status: event.status
      });
    } else {
      setEditingEvent(null);
      setFormData(INITIAL_FORM_DATA);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.startTime || !formData.endTime) return;

    setSaving(true);

    const eventData = {
      title: formData.title,
      description: formData.description || undefined,
      eventType: formData.eventType,
      format: formData.format,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      timezone: formData.timezone,
      venueName: formData.format !== 'virtual' ? formData.venueName : undefined,
      address: formData.format !== 'virtual' ? formData.address : undefined,
      city: formData.format !== 'virtual' ? formData.city : undefined,
      state: formData.format !== 'virtual' ? formData.state : undefined,
      virtualPlatform: formData.format !== 'in_person' ? formData.virtualPlatform : undefined,
      virtualLink: formData.format !== 'in_person' ? formData.virtualLink : undefined,
      registrationRequired: formData.registrationRequired,
      maxAttendees: formData.maxAttendees,
      registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : undefined,
      status: formData.status,
      participatingEmployers: []
    };

    if (editingEvent) {
      await updatePartnerEvent(editingEvent.id, eventData);
    } else {
      await createPartnerEvent(partnerId, eventData);
    }

    await loadEvents();
    setShowModal(false);
    setEditingEvent(null);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deletePartnerEvent(id);
    await loadEvents();
    setShowDeleteConfirm(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Published
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Draft
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (!canHostEvents) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Event Hosting Unavailable</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          Upgrade to Growth or Enterprise tier to host career fairs, info sessions, and networking events.
        </p>
        <button onClick={() => setShowUpgradeModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
          Upgrade Plan
        </button>

        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">Upgrade Your Plan</h3>
              <p className="text-gray-400 mb-4">
                Upgrade to Growth or Enterprise tier to host career fairs, info sessions, workshops, and networking events for your students and employer partners.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  Host unlimited career fairs and info sessions
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  Virtual, in-person, and hybrid event support
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  Registration management and tracking
                </li>
              </ul>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Upgrade Now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Events</h2>
          <p className="text-gray-400">Host career fairs, info sessions, and workshops</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{stats.upcoming}</div>
          <div className="text-sm text-gray-400">Upcoming Events</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{stats.totalRegistrations}</div>
          <div className="text-sm text-gray-400">Total Registrations</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{stats.completed}</div>
          <div className="text-sm text-gray-400">Completed Events</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{stats.draft}</div>
          <div className="text-sm text-gray-400">Draft Events</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Types</option>
          {EVENT_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No events yet</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Create your first event to connect with students and employers.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => {
            const EventIcon = EVENT_TYPES.find(t => t.value === event.eventType)?.icon || Calendar;
            const isPast = new Date(event.startTime) < new Date();

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gray-900 border border-gray-800 rounded-xl p-5 ${isPast ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <EventIcon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{event.title}</h3>
                      <p className="text-sm text-gray-400">
                        {EVENT_TYPES.find(t => t.value === event.eventType)?.label}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(event.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CalendarDays className="w-4 h-4" />
                    {formatDate(event.startTime)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                  {event.format === 'virtual' ? (
                    <div className="flex items-center gap-2 text-sm text-blue-400">
                      <Video className="w-4 h-4" />
                      Virtual Event
                      {event.virtualLink && (
                        <a href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : event.format === 'hybrid' ? (
                    <div className="flex items-center gap-2 text-sm text-purple-400">
                      <Video className="w-4 h-4" />
                      Hybrid Event
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {event.venueName || event.city || 'Location TBD'}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    {event.currentRegistrations} / {event.maxAttendees || '∞'} registered
                  </div>
                </div>

                {/* Progress bar for registrations */}
                {event.maxAttendees && (
                  <div className="mb-4">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all"
                        style={{ width: `${Math.min((event.currentRegistrations / event.maxAttendees) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(event)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(event.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => { setDetailEvent(event); setShowDetailsModal(true); }} className="text-sm text-indigo-400 hover:text-indigo-300">
                    View Details →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {showDetailsModal && detailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setShowDetailsModal(false); setDetailEvent(null); }}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{detailEvent.title}</h3>
              {getStatusBadge(detailEvent.status)}
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                {formatDate(detailEvent.startTime)} - {formatDate(detailEvent.endTime)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-gray-400" />
                {formatTime(detailEvent.startTime)} - {formatTime(detailEvent.endTime)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-4 h-4 text-gray-400" />
                {detailEvent.currentRegistrations} / {detailEvent.maxAttendees || 'Unlimited'} registered
              </div>
              {detailEvent.format === 'virtual' && detailEvent.virtualLink && (
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <Video className="w-4 h-4" />
                  <a href={detailEvent.virtualLink} target="_blank" rel="noopener noreferrer" className="hover:underline">Virtual Link</a>
                </div>
              )}
              {detailEvent.venueName && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {detailEvent.venueName}{detailEvent.city ? `, ${detailEvent.city}` : ''}
                </div>
              )}
              {detailEvent.description && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-300">{detailEvent.description}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowDetailsModal(false); setDetailEvent(null); }} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowDetailsModal(false); setDetailEvent(null); handleOpenModal(detailEvent); }} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Edit Event</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Delete Event?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone. The event and all its registration data will be permanently removed.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete Event</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">
                {editingEvent ? 'Edit Event' : 'Create Event'}
              </h3>
              <p className="text-gray-400 text-sm">Set up your event details</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Spring Career Fair 2025"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Event Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EVENT_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, eventType: type.value })}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                        formData.eventType === type.value
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe your event..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Format</label>
                <div className="flex gap-2">
                  {(['in_person', 'virtual', 'hybrid'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => setFormData({ ...formData, format })}
                      className={`flex-1 p-3 rounded-lg border transition-colors ${
                        formData.format === format
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {format === 'in_person' ? 'In-Person' : format === 'virtual' ? 'Virtual' : 'Hybrid'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location / Virtual Link */}
              {formData.format !== 'virtual' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Venue Name</label>
                    <input
                      type="text"
                      value={formData.venueName}
                      onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                      placeholder="e.g., Student Union Building"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Phoenix"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {formData.format !== 'in_person' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Virtual Platform</label>
                    <input
                      type="text"
                      value={formData.virtualPlatform}
                      onChange={(e) => setFormData({ ...formData, virtualPlatform: e.target.value })}
                      placeholder="e.g., Zoom, Teams"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Virtual Link</label>
                    <input
                      type="url"
                      value={formData.virtualLink}
                      onChange={(e) => setFormData({ ...formData, virtualLink: e.target.value })}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Max Attendees & Registration Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Max Attendees</label>
                  <input
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PartnerEvent['status'] })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingEvent(null);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.startTime || !formData.endTime}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingEvent ? 'Update' : 'Create'} Event
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
