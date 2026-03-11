// ===========================================
// Conferences & Events Page - College Students
// STEM conferences with student tracks
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Star,
  DollarSign,
  Ticket,
  Award,
  GraduationCap,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Event {
  id: string;
  title: string;
  type: 'conference' | 'career-fair' | 'workshop' | 'hackathon';
  format: 'virtual' | 'in-person' | 'hybrid';
  date: string;
  location: string;
  attendees: number;
  studentDiscount: boolean;
  price: string;
  topics: string[];
  companies: string[];
  featured: boolean;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Grace Hopper Celebration 2026',
    type: 'conference',
    format: 'hybrid',
    date: 'Oct 8-11, 2026',
    location: 'Orlando, FL',
    attendees: 30000,
    studentDiscount: true,
    price: '$75 (student)',
    topics: ['Women in Tech', 'Career Development', 'Technical Talks'],
    companies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
    featured: true,
  },
  {
    id: '2',
    title: 'NeurIPS 2026',
    type: 'conference',
    format: 'in-person',
    date: 'Dec 6-12, 2026',
    location: 'Vancouver, BC',
    attendees: 15000,
    studentDiscount: true,
    price: '$150 (student)',
    topics: ['Machine Learning', 'AI Research', 'Deep Learning'],
    companies: ['OpenAI', 'DeepMind', 'Anthropic', 'NVIDIA'],
    featured: true,
  },
  {
    id: '3',
    title: 'Google Cloud Next',
    type: 'conference',
    format: 'hybrid',
    date: 'Apr 15-17, 2026',
    location: 'San Francisco, CA',
    attendees: 25000,
    studentDiscount: false,
    price: 'Free (virtual)',
    topics: ['Cloud Computing', 'AI/ML', 'DevOps'],
    companies: ['Google Cloud'],
    featured: false,
  },
  {
    id: '4',
    title: 'NSBE Annual Convention',
    type: 'career-fair',
    format: 'in-person',
    date: 'Mar 25-29, 2026',
    location: 'Atlanta, GA',
    attendees: 12000,
    studentDiscount: true,
    price: '$50 (student)',
    topics: ['Engineering', 'Career Development', 'Networking'],
    companies: ['Boeing', 'Lockheed Martin', 'NASA', 'Tesla'],
    featured: false,
  },
  {
    id: '5',
    title: 'MIT Hacking Medicine',
    type: 'hackathon',
    format: 'in-person',
    date: 'Feb 20-22, 2026',
    location: 'Cambridge, MA',
    attendees: 500,
    studentDiscount: true,
    price: 'Free',
    topics: ['Healthcare', 'Biotech', 'AI in Medicine'],
    companies: ['Johnson & Johnson', 'Pfizer', 'Genentech'],
    featured: false,
  },
  {
    id: '6',
    title: 'AWS re:Invent',
    type: 'conference',
    format: 'hybrid',
    date: 'Nov 30 - Dec 4, 2026',
    location: 'Las Vegas, NV',
    attendees: 50000,
    studentDiscount: true,
    price: '$200 (student)',
    topics: ['Cloud', 'Serverless', 'AI/ML', 'Security'],
    companies: ['Amazon', 'AWS Partners'],
    featured: true,
  },
];

const EVENT_TYPES = [
  { id: 'all', label: 'All Events' },
  { id: 'conference', label: 'Conferences' },
  { id: 'career-fair', label: 'Career Fairs' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'hackathon', label: 'Hackathons' },
];

// ===========================================
// COMPONENT
// ===========================================
const EventsPage: React.FC = () => {
  const { info } = useNotifications();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showStudentOnly, setShowStudentOnly] = useState(false);

  const filteredEvents = EVENTS.filter(event => {
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesStudent = !showStudentOnly || event.studentDiscount;
    return matchesType && matchesStudent;
  });

  const featuredEvents = filteredEvents.filter(e => e.featured);
  const upcomingEvents = filteredEvents.filter(e => !e.featured);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-gray-950 to-orange-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-amber-400 mb-4">
            <Link to="/college/professional-development" className="hover:underline">Professional Development</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Events</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Conferences &
              <span className="text-amber-400"> Events</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover STEM conferences, career fairs, hackathons, and workshops with student-friendly
              pricing. Connect with top companies and expand your network.
            </p>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {EVENT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedType === type.id
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={showStudentOnly}
                  onChange={(e) => setShowStudentOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-gray-300 text-sm">Student Discounts Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400" />
              Featured Events
            </h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/20 p-6 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      event.format === 'virtual' ? 'bg-blue-500/10 text-blue-400' :
                      event.format === 'in-person' ? 'bg-green-500/10 text-green-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {event.format}
                    </span>
                    {event.studentDiscount && (
                      <span className="px-2 py-1 text-xs bg-amber-500/10 text-amber-400 rounded flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Student Discount
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>

                  <div className="space-y-2 mb-4 text-sm">
                    <p className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.attendees.toLocaleString()} attendees
                    </p>
                    <p className="text-amber-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {event.price}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.topics.slice(0, 3).map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <span className="text-xs text-gray-500 block mb-2">Companies Attending</span>
                    <div className="flex flex-wrap gap-1">
                      {event.companies.slice(0, 4).map((company, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => info('Event registration is coming soon! We\'re integrating with event platforms.')} className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Ticket className="w-4 h-4" />
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedType === 'all' ? 'All Events' : EVENT_TYPES.find(t => t.id === selectedType)?.label}
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Date Box */}
                  <div className="w-20 text-center flex-shrink-0">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">{event.date.split(' ')[1]?.replace(',', '')}</div>
                      <div className="text-sm text-gray-400">{event.date.split(' ')[0]}</div>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            event.type === 'conference' ? 'bg-blue-500/10 text-blue-400' :
                            event.type === 'career-fair' ? 'bg-green-500/10 text-green-400' :
                            event.type === 'workshop' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-orange-500/10 text-orange-400'
                          }`}>
                            {event.type.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            event.format === 'virtual' ? 'bg-sky-500/10 text-sky-400' :
                            event.format === 'in-person' ? 'bg-emerald-500/10 text-emerald-400' :
                            'bg-violet-500/10 text-violet-400'
                          }`}>
                            {event.format}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.attendees.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-amber-400">
                            <DollarSign className="w-4 h-4" />
                            {event.price}
                          </span>
                          {event.studentDiscount && (
                            <span className="flex items-center gap-1 text-green-400">
                              <GraduationCap className="w-4 h-4" />
                              Student Discount
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => info('Event registration is coming soon!')} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        Register
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {event.topics.map((topic, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Grant Section */}
        <div className="mt-16 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl border border-amber-500/20 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-12 h-12 text-amber-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-semibold text-white mb-2">Need Help Attending?</h3>
              <p className="text-gray-300 mb-4">
                Many conferences offer travel grants, diversity scholarships, and volunteer opportunities
                for students. We can help you find funding to attend these events.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button onClick={() => info('Travel grant finder is coming soon!')} className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors">
                  Find Travel Grants
                </button>
                <button onClick={() => info('Volunteer opportunity listings are coming soon!')} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700">
                  Volunteer Opportunities
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Calendar */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">Never miss an application deadline</p>
          <button onClick={() => info('Calendar sync is coming soon!')} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 flex items-center gap-2 mx-auto">
            <Calendar className="w-5 h-5" />
            Sync to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
