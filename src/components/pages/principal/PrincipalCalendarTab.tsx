// ===========================================
// Principal Calendar Tab
// ===========================================
// Visual calendar for school events, meetings,
// and important dates
// ===========================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  MapPin,
  Users,
  Calendar,
  CalendarDays,
  List,
  Filter,
  Search
} from 'lucide-react';
import type { CalendarEvent, EventCategory } from '@/types/principal';
import { EVENT_CATEGORY_CONFIG } from '@/types/principal';

// ===========================================
// TYPES
// ===========================================

interface PrincipalCalendarTabProps {
  events: CalendarEvent[];
  onAddEvent?: (event: Partial<CalendarEvent>) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

type ViewMode = 'month' | 'week' | 'day' | 'list';

// ===========================================
// HELPER FUNCTIONS
// ===========================================

const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add days from previous month to fill first week
  const startDayOfWeek = firstDay.getDay();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Add all days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add days from next month to complete last week
  const endDayOfWeek = lastDay.getDay();
  for (let i = 1; i <= 6 - endDayOfWeek; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

const formatTime = (time?: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ===========================================
// COMPONENTS
// ===========================================

interface DayCellProps {
  date: Date;
  currentMonth: number;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonth,
  events,
  isToday,
  isSelected,
  onSelect,
  onEventClick
}) => {
  const isCurrentMonth = date.getMonth() === currentMonth;
  const dayEvents = events.slice(0, 3);
  const moreCount = events.length - 3;

  return (
    <div
      onClick={onSelect}
      className={`
        min-h-[100px] p-1 border border-slate-700/50 cursor-pointer
        transition-colors hover:bg-slate-800/50
        ${isCurrentMonth ? 'bg-slate-900/50' : 'bg-slate-900/20'}
        ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`
            w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
            ${isToday ? 'bg-blue-600 text-white' : ''}
            ${!isCurrentMonth ? 'text-slate-500' : isToday ? '' : 'text-slate-300'}
          `}
        >
          {date.getDate()}
        </span>
      </div>
      <div className="space-y-0.5">
        {dayEvents.map((event) => {
          const config = EVENT_CATEGORY_CONFIG[event.category];
          return (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
              }}
              className={`
                px-1.5 py-0.5 rounded text-xs truncate cursor-pointer
                ${config.bgColor}/20 ${config.color} hover:${config.bgColor}/30
              `}
              title={event.title}
            >
              {!event.allDay && event.startTime && (
                <span className="opacity-70 mr-1">{formatTime(event.startTime).split(' ')[0]}</span>
              )}
              {event.title}
            </div>
          );
        })}
        {moreCount > 0 && (
          <div className="text-xs text-slate-400 px-1.5">
            +{moreCount} more
          </div>
        )}
      </div>
    </div>
  );
};

interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onEdit,
  onDelete
}) => {
  const config = EVENT_CATEGORY_CONFIG[event.category];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-medium ${config.bgColor}/20 ${config.color}`}>
                {config.label}
              </span>
              <h3 className="text-xl font-bold text-white mt-2">{event.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {event.description && (
            <p className="text-slate-300">{event.description}</p>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-400">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(event.startDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
                {event.endDate !== event.startDate && (
                  <> - {new Date(event.endDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</>
                )}
              </span>
            </div>

            {!event.allDay && event.startTime && (
              <div className="flex items-center gap-3 text-slate-400">
                <Clock className="w-5 h-5" />
                <span>
                  {formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-3 text-slate-400">
                <Users className="w-5 h-5" />
                <span>{event.attendees.length} attendees</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(event)}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              Edit Event
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this event?')) {
                  onDelete(event.id);
                  onClose();
                }
              }}
              className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface AddEventModalProps {
  selectedDate: Date;
  onClose: () => void;
  onAdd: (event: Partial<CalendarEvent>) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  selectedDate,
  onClose,
  onAdd
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('meeting');
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    onAdd({
      title,
      description,
      category,
      startDate: dateStr,
      endDate: dateStr,
      allDay,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      location: location || undefined
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add Event</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {Object.entries(EVENT_CATEGORY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="allDay"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="allDay" className="text-sm text-slate-300">
                All day event
              </label>
            </div>

            {!allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location (optional)"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-6 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              Add Event
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const PrincipalCalendarTab: React.FC<PrincipalCalendarTabProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (categoryFilter !== 'all' && event.category !== categoryFilter) return false;
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [events, categoryFilter, searchQuery]);

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= start && checkDate <= end;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = (eventData: Partial<CalendarEvent>) => {
    onAddEvent?.(eventData);
    setShowAddModal(false);
  };

  // Upcoming events for sidebar
  const upcomingEvents = useMemo(() => {
    const todayStr = today.toISOString().split('T')[0];
    return filteredEvents
      .filter(event => event.startDate >= todayStr)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 5);
  }, [filteredEvents, today]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">School Calendar</h2>
          <p className="text-slate-400">Manage school events, meetings, and important dates</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as EventCategory | 'all')}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">All Categories</option>
              {Object.entries(EVENT_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Event Button */}
          {onAddEvent && (
            <button
              onClick={() => {
                setSelectedDate(selectedDate || new Date());
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {viewMode === 'month' ? (
            <>
              {/* Calendar Navigation */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    {MONTHS[currentMonth]} {currentYear}
                  </h3>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium transition-colors"
                  >
                    Today
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-slate-800/50">
                {WEEKDAYS.map(day => (
                  <div key={day} className="py-3 text-center text-sm font-medium text-slate-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {days.map((date, index) => (
                  <DayCell
                    key={index}
                    date={date}
                    currentMonth={currentMonth}
                    events={getEventsForDate(date)}
                    isToday={isSameDay(date, today)}
                    isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
                    onSelect={() => handleDayClick(date)}
                    onEventClick={setSelectedEvent}
                  />
                ))}
              </div>
            </>
          ) : (
            /* List View */
            <div className="divide-y divide-slate-800">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">All Events</h3>
              </div>
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No events found</p>
                </div>
              ) : (
                filteredEvents
                  .sort((a, b) => a.startDate.localeCompare(b.startDate))
                  .map(event => {
                    const config = EVENT_CATEGORY_CONFIG[event.category];
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-1 h-12 rounded-full ${config.bgColor}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${config.color}`}>
                                {config.label}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(event.startDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                                {event.startTime && !event.allDay && ` at ${formatTime(event.startTime)}`}
                              </span>
                            </div>
                            <h4 className="font-medium text-white">{event.title}</h4>
                            {event.location && (
                              <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mini Calendar / Selected Date Info */}
          {selectedDate && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h4 className="font-semibold text-white mb-3">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h4>
              <div className="space-y-2">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-slate-400">No events scheduled</p>
                ) : (
                  getEventsForDate(selectedDate).map(event => {
                    const config = EVENT_CATEGORY_CONFIG[event.category];
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${config.bgColor}/10 hover:${config.bgColor}/20`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white">{event.title}</p>
                        {event.startTime && !event.allDay && (
                          <p className="text-xs text-slate-400 mt-1">
                            {formatTime(event.startTime)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {onAddEvent && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </button>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-4">Upcoming Events</h4>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-400">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => {
                  const config = EVENT_CATEGORY_CONFIG[event.category];
                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${config.bgColor}/20 flex items-center justify-center flex-shrink-0`}>
                        <Calendar className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                          {event.startTime && !event.allDay && ` at ${formatTime(event.startTime)}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Legend */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <div className="space-y-2">
              {Object.entries(EVENT_CATEGORY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(categoryFilter === key ? 'all' : key as EventCategory)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${
                    categoryFilter === key ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded ${config.bgColor}`} />
                  <span className="text-sm text-slate-300">{config.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
          />
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && selectedDate && (
          <AddEventModal
            selectedDate={selectedDate}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrincipalCalendarTab;
