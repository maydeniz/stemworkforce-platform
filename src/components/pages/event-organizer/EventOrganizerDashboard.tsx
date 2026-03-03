// ===========================================
// Event Organizer Dashboard
// TechConnect Events - STEM Career Fairs, Workshops, Hackathons
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Users,
  BarChart3,
  Heart,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Star,
  Clock,
  MapPin,
  Search,
  Filter,
  Download,
  Copy,
  Edit3,
  Archive,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Globe,
  Ticket,
  Mail,
  Eye,
  Send,
  Building2,
  Palette,
  CreditCard,
  FileText,
  Inbox,
  Award,
  Target,
  UserCheck,
  Upload,
  X,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// ===========================================
// TYPES
// ===========================================

type TabKey = 'overview' | 'events' | 'create' | 'attendees' | 'analytics' | 'sponsors' | 'settings';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

// ===========================================
// TAB CONFIGURATION
// ===========================================

const TABS: TabConfig[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'events', label: 'My Events', icon: Calendar },
  { key: 'create', label: 'Create Event', icon: PlusCircle },
  { key: 'attendees', label: 'Attendees', icon: Users },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'sponsors', label: 'Sponsors', icon: Heart, badge: 3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// ===========================================
// COLOR CONSTANTS
// ===========================================

const COPPER = '#E07A3D';
const STEEL = '#7AACB5';
const COPPER_LIGHT = '#F4A574';
const STEEL_LIGHT = '#A3CBD4';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_OVERVIEW_STATS = [
  { label: 'Total Events', value: '24', change: '+6 this quarter', positive: true, icon: Calendar, color: 'orange' },
  { label: 'Total Registrations', value: '4,500', change: '+18.2% vs last year', positive: true, icon: Users, color: 'teal' },
  { label: 'Revenue YTD', value: '$284K', change: '+22.5% growth', positive: true, icon: DollarSign, color: 'orange' },
  { label: 'Avg Satisfaction', value: '4.6/5', change: '+0.3 vs prior year', positive: true, icon: Star, color: 'teal' },
];

const SAMPLE_UPCOMING_EVENTS = [
  {
    id: 'evt-1',
    name: 'National STEM Career Fair 2025',
    date: 'Mar 20, 2025',
    location: 'Washington, DC',
    registered: 450,
    capacity: 500,
    type: 'Career Fair',
    status: 'upcoming' as const,
    daysAway: 18,
  },
  {
    id: 'evt-2',
    name: 'AI & Quantum Workshop Series',
    date: 'Apr 8, 2025',
    location: 'Virtual',
    registered: 120,
    capacity: 150,
    type: 'Workshop',
    status: 'upcoming' as const,
    daysAway: 37,
  },
  {
    id: 'evt-3',
    name: 'DOE Lab Open House',
    date: 'Apr 22, 2025',
    location: 'Oak Ridge, TN',
    registered: 85,
    capacity: 100,
    type: 'Conference',
    status: 'upcoming' as const,
    daysAway: 51,
  },
];

const SAMPLE_REGISTRATION_TREND = [
  { month: 'Jul', registrations: 280, revenue: 18200 },
  { month: 'Aug', registrations: 350, revenue: 22750 },
  { month: 'Sep', registrations: 420, revenue: 27300 },
  { month: 'Oct', registrations: 510, revenue: 33150 },
  { month: 'Nov', registrations: 380, revenue: 24700 },
  { month: 'Dec', registrations: 290, revenue: 18850 },
  { month: 'Jan', registrations: 460, revenue: 29900 },
  { month: 'Feb', registrations: 520, revenue: 33800 },
  { month: 'Mar', registrations: 590, revenue: 38350 },
];

const SAMPLE_ALL_EVENTS = [
  { id: 'e1', name: 'National STEM Career Fair 2025', date: 'Mar 20, 2025', location: 'Washington, DC', registered: 450, capacity: 500, type: 'Career Fair', status: 'upcoming' as const },
  { id: 'e2', name: 'AI & Quantum Workshop Series', date: 'Apr 8, 2025', location: 'Virtual', registered: 120, capacity: 150, type: 'Workshop', status: 'upcoming' as const },
  { id: 'e3', name: 'DOE Lab Open House', date: 'Apr 22, 2025', location: 'Oak Ridge, TN', registered: 85, capacity: 100, type: 'Conference', status: 'upcoming' as const },
  { id: 'e4', name: 'Women in STEM Hackathon', date: 'Mar 2, 2025', location: 'Virtual', registered: 200, capacity: 200, type: 'Hackathon', status: 'live' as const },
  { id: 'e5', name: 'Cybersecurity Career Workshop', date: 'Feb 15, 2025', location: 'Arlington, VA', registered: 175, capacity: 200, type: 'Workshop', status: 'completed' as const },
  { id: 'e6', name: 'Clean Energy Job Fair', date: 'Jan 28, 2025', location: 'Denver, CO', registered: 320, capacity: 350, type: 'Career Fair', status: 'completed' as const },
  { id: 'e7', name: 'Biotech Innovation Conference', date: 'Jan 10, 2025', location: 'Boston, MA', registered: 410, capacity: 450, type: 'Conference', status: 'completed' as const },
  { id: 'e8', name: 'Quantum Computing Bootcamp', date: 'TBD', location: 'San Francisco, CA', registered: 0, capacity: 100, type: 'Workshop', status: 'draft' as const },
];

const SAMPLE_ATTENDEES = [
  { id: 'a1', name: 'Sarah Chen', email: 'sarah.chen@mit.edu', ticket: 'VIP', regDate: 'Feb 28, 2025', checkedIn: true, industry: 'AI / Machine Learning' },
  { id: 'a2', name: 'James Rodriguez', email: 'j.rodriguez@gatech.edu', ticket: 'General', regDate: 'Feb 27, 2025', checkedIn: true, industry: 'Cybersecurity' },
  { id: 'a3', name: 'Emily Parker', email: 'eparker@stanford.edu', ticket: 'Student', regDate: 'Feb 26, 2025', checkedIn: false, industry: 'Quantum Computing' },
  { id: 'a4', name: 'Michael Okafor', email: 'm.okafor@pennstate.edu', ticket: 'General', regDate: 'Feb 25, 2025', checkedIn: true, industry: 'Nuclear Engineering' },
  { id: 'a5', name: 'Priya Patel', email: 'priya.p@caltech.edu', ticket: 'VIP', regDate: 'Feb 24, 2025', checkedIn: false, industry: 'Semiconductor' },
  { id: 'a6', name: 'David Kim', email: 'dkim@uchicago.edu', ticket: 'General', regDate: 'Feb 23, 2025', checkedIn: true, industry: 'Data Science' },
  { id: 'a7', name: 'Amanda Liu', email: 'a.liu@berkeley.edu', ticket: 'Student', regDate: 'Feb 22, 2025', checkedIn: true, industry: 'Biotech' },
  { id: 'a8', name: 'Robert Thompson', email: 'rthompson@vt.edu', ticket: 'General', regDate: 'Feb 21, 2025', checkedIn: false, industry: 'Aerospace' },
  { id: 'a9', name: 'Maria Gonzalez', email: 'mgonzalez@utexas.edu', ticket: 'VIP', regDate: 'Feb 20, 2025', checkedIn: true, industry: 'Clean Energy' },
  { id: 'a10', name: 'Alex Nguyen', email: 'anguyen@umich.edu', ticket: 'Student', regDate: 'Feb 19, 2025', checkedIn: false, industry: 'Robotics' },
];

const SAMPLE_ANALYTICS_REGISTRATION = [
  { week: 'W1', careerFair: 45, workshop: 22, hackathon: 30, conference: 18 },
  { week: 'W2', careerFair: 62, workshop: 35, hackathon: 28, conference: 24 },
  { week: 'W3', careerFair: 78, workshop: 41, hackathon: 52, conference: 31 },
  { week: 'W4', careerFair: 95, workshop: 58, hackathon: 45, conference: 42 },
  { week: 'W5', careerFair: 110, workshop: 64, hackathon: 38, conference: 55 },
  { week: 'W6', careerFair: 128, workshop: 72, hackathon: 60, conference: 48 },
  { week: 'W7', careerFair: 145, workshop: 80, hackathon: 55, conference: 62 },
  { week: 'W8', careerFair: 160, workshop: 88, hackathon: 70, conference: 58 },
];

const SAMPLE_ATTENDANCE_RATE = [
  { event: 'Career Fair Q4', rate: 92 },
  { event: 'Workshop Dec', rate: 85 },
  { event: 'Hackathon Jan', rate: 94 },
  { event: 'Conference Feb', rate: 88 },
  { event: 'Career Fair Q1', rate: 90 },
  { event: 'Workshop Mar', rate: 87 },
];

const SAMPLE_REVENUE_PER_EVENT = [
  { name: 'STEM Fair', revenue: 48500, color: COPPER },
  { name: 'AI Workshop', revenue: 22300, color: STEEL },
  { name: 'Hackathon', revenue: 31200, color: COPPER_LIGHT },
  { name: 'DOE Lab', revenue: 18700, color: STEEL_LIGHT },
  { name: 'Cyber Workshop', revenue: 15800, color: COPPER },
  { name: 'Clean Energy', revenue: 38200, color: STEEL },
];

const SAMPLE_INDUSTRY_DIST = [
  { name: 'AI / ML', value: 28, color: COPPER },
  { name: 'Cybersecurity', value: 22, color: STEEL },
  { name: 'Clean Energy', value: 18, color: '#F4A574' },
  { name: 'Biotech', value: 15, color: '#A3CBD4' },
  { name: 'Quantum', value: 10, color: '#D4956B' },
  { name: 'Other', value: 7, color: '#5E8F98' },
];

const SAMPLE_FEEDBACK_SCORES = [
  { category: 'Content Quality', score: 4.7 },
  { category: 'Networking Opps', score: 4.5 },
  { category: 'Venue / Platform', score: 4.3 },
  { category: 'Speaker Quality', score: 4.8 },
  { category: 'Organization', score: 4.6 },
  { category: 'Value for Price', score: 4.4 },
];

const SAMPLE_SPONSORS_PLATINUM = [
  { id: 's1', name: 'Lockheed Martin', contribution: 25000, booth: 'A1 - Premium', contactName: 'Jessica Wright', since: '2022' },
  { id: 's2', name: 'Northrop Grumman', contribution: 25000, booth: 'A2 - Premium', contactName: 'Mark Davis', since: '2023' },
];

const SAMPLE_SPONSORS_GOLD = [
  { id: 's3', name: 'Battelle', contribution: 15000, booth: 'B1', contactName: 'Laura Chen', since: '2023' },
  { id: 's4', name: 'SAIC', contribution: 15000, booth: 'B2', contactName: 'Tom Harris', since: '2024' },
  { id: 's5', name: 'Booz Allen Hamilton', contribution: 15000, booth: 'B3', contactName: 'Rachel Kim', since: '2022' },
];

const SAMPLE_SPONSORS_SILVER = [
  { id: 's6', name: 'Leidos', contribution: 5000, booth: 'C1', contactName: 'Sam Miller', since: '2024' },
  { id: 's7', name: 'Peraton', contribution: 5000, booth: 'C2', contactName: 'Diana Lopez', since: '2025' },
  { id: 's8', name: 'General Dynamics', contribution: 5000, booth: 'C3', contactName: 'Brian Walsh', since: '2024' },
  { id: 's9', name: 'L3Harris', contribution: 5000, booth: 'C4', contactName: 'Anne Taylor', since: '2023' },
  { id: 's10', name: 'Raytheon', contribution: 5000, booth: 'C5', contactName: 'Kevin Park', since: '2024' },
  { id: 's11', name: 'Honeywell', contribution: 3000, booth: 'C6', contactName: 'Lisa Wang', since: '2025' },
  { id: 's12', name: 'Sandia Corp', contribution: 3000, booth: 'C7', contactName: 'James Foster', since: '2025' },
];

const SAMPLE_SPONSOR_INQUIRIES = [
  { id: 'inq1', company: 'Amazon Web Services', contact: 'Karen Brooks', message: 'Interested in Platinum sponsorship for upcoming STEM Career Fair. Can we schedule a call?', date: 'Mar 1, 2025', status: 'new' },
  { id: 'inq2', company: 'Microsoft Research', contact: 'David Lee', message: 'Would like to discuss workshop co-hosting and Gold sponsorship tier.', date: 'Feb 28, 2025', status: 'new' },
  { id: 'inq3', company: 'IBM Quantum', contact: 'Nina Patel', message: 'Exploring sponsorship for the AI & Quantum Workshop Series. Please share prospectus.', date: 'Feb 27, 2025', status: 'new' },
];

// ===========================================
// TOOLTIP STYLE
// ===========================================

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#111827',
  border: '1px solid #1F2937',
  borderRadius: '8px',
  color: '#F9FAFB',
  fontSize: '13px',
};

// ===========================================
// TAB: OVERVIEW
// ===========================================

const OverviewTab: React.FC<{ onTabChange: (tab: TabKey) => void }> = ({ onTabChange }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLE_OVERVIEW_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.color === 'orange' ? 'bg-orange-500/20' : 'bg-teal-500/20'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'orange' ? 'text-orange-400' : 'text-teal-400'
                }`} />
              </div>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className={`text-sm mt-1 flex items-center gap-1 ${
              stat.positive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Events Timeline + Registration Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
            <button
              onClick={() => onTabChange('events')}
              className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {SAMPLE_UPCOMING_EVENTS.map((evt) => {
              const fillPercent = Math.round((evt.registered / evt.capacity) * 100);
              return (
                <div key={evt.id} className="relative pl-6 border-l-2 border-orange-500/30 pb-4 last:pb-0">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-400 border-2 border-gray-900" />
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white text-sm">{evt.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{evt.date}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.location}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium whitespace-nowrap">
                        {evt.daysAway}d away
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>{evt.registered} / {evt.capacity} registered</span>
                        <span className="text-white font-medium">{fillPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${fillPercent}%`, backgroundColor: fillPercent > 85 ? COPPER : STEEL }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Registration Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-5">Registration Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={SAMPLE_REGISTRATION_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="registrations"
                stroke={COPPER}
                fill={COPPER}
                fillOpacity={0.15}
                strokeWidth={2}
                name="Registrations"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onTabChange('create')}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-center transition-colors group"
          >
            <PlusCircle className="w-6 h-6 mx-auto text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white font-medium">Create Event</span>
            <p className="text-xs text-gray-500 mt-1">Start a new event</p>
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-center transition-colors group"
          >
            <BarChart3 className="w-6 h-6 mx-auto text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white font-medium">View Analytics</span>
            <p className="text-xs text-gray-500 mt-1">Performance data</p>
          </button>
          <button
            onClick={() => onTabChange('attendees')}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-center transition-colors group"
          >
            <Users className="w-6 h-6 mx-auto text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white font-medium">Manage Attendees</span>
            <p className="text-xs text-gray-500 mt-1">Check-in & export</p>
          </button>
          <button
            onClick={() => onTabChange('sponsors')}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-center transition-colors group"
          >
            <Heart className="w-6 h-6 mx-auto text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white font-medium">Sponsor Hub</span>
            <p className="text-xs text-gray-500 mt-1">3 new inquiries</p>
          </button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: '15 new registrations', event: 'National STEM Career Fair 2025', time: '2 hours ago', icon: Users, iconColor: 'text-orange-400' },
            { action: 'Sponsorship payment received', event: 'Lockheed Martin - $25,000', time: '5 hours ago', icon: DollarSign, iconColor: 'text-emerald-400' },
            { action: 'Event published', event: 'AI & Quantum Workshop Series', time: '1 day ago', icon: Globe, iconColor: 'text-teal-400' },
            { action: 'Feedback collected', event: 'Cybersecurity Career Workshop - 4.7 avg', time: '2 days ago', icon: Star, iconColor: 'text-amber-400' },
            { action: 'Venue confirmed', event: 'DOE Lab Open House - Oak Ridge TN', time: '3 days ago', icon: MapPin, iconColor: 'text-orange-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center">
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{item.action}</p>
                <p className="text-xs text-gray-500 truncate">{item.event}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// TAB: MY EVENTS
// ===========================================

const MyEventsTab: React.FC<{ onTabChange: (tab: TabKey) => void }> = ({ onTabChange }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editModal, setEditModal] = useState<{ open: boolean; event: typeof SAMPLE_ALL_EVENTS[0] | null }>({ open: false, event: null });
  const [duplicateModal, setDuplicateModal] = useState<{ open: boolean; event: typeof SAMPLE_ALL_EVENTS[0] | null }>({ open: false, event: null });
  const [archiveModal, setArchiveModal] = useState<{ open: boolean; event: typeof SAMPLE_ALL_EVENTS[0] | null }>({ open: false, event: null });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filteredEvents = statusFilter === 'all'
    ? SAMPLE_ALL_EVENTS
    : SAMPLE_ALL_EVENTS.filter(e => e.status === statusFilter);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      upcoming: 'bg-blue-500/20 text-blue-400',
      live: 'bg-emerald-500/20 text-emerald-400',
      completed: 'bg-gray-600/20 text-gray-400',
      draft: 'bg-amber-500/20 text-amber-400',
    };
    return styles[status] || styles.draft;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Career Fair': 'text-orange-400',
      'Workshop': 'text-teal-400',
      'Hackathon': 'text-purple-400',
      'Conference': 'text-blue-400',
    };
    return colors[type] || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">My Events</h2>
          <p className="text-gray-400 text-sm mt-1">Manage all your events in one place</p>
        </div>
        <button
          onClick={() => onTabChange('create')}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {['all', 'upcoming', 'live', 'completed', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Events' : status}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((evt, i) => {
            const fillPercent = evt.capacity > 0 ? Math.round((evt.registered / evt.capacity) * 100) : 0;
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm truncate">{evt.name}</h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{evt.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.location}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ml-2 ${getStatusBadge(evt.status)}`}>
                    {evt.status === 'live' && <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 animate-pulse" />}
                    {evt.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium ${getTypeColor(evt.type)}`}>{evt.type}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-xs text-gray-400">{evt.registered} / {evt.capacity} registered</span>
                </div>

                {evt.capacity > 0 && (
                  <div className="mb-4">
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${fillPercent}%`, backgroundColor: fillPercent > 85 ? COPPER : STEEL }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                  <button onClick={() => setEditModal({ open: true, event: evt })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setDuplicateModal({ open: true, event: evt })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Copy className="w-3 h-3" /> Duplicate
                  </button>
                  <button onClick={() => setArchiveModal({ open: true, event: evt })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors ml-auto">
                    <Archive className="w-3 h-3" /> Archive
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-white text-sm">{evt.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.location}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{evt.date}</td>
                  <td className="p-4"><span className={`text-sm font-medium ${getTypeColor(evt.type)}`}>{evt.type}</span></td>
                  <td className="p-4 text-sm text-gray-300">{evt.registered} / {evt.capacity}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(evt.status)}`}>
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditModal({ open: true, event: evt })} className="p-1.5 text-gray-500 hover:text-white transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setDuplicateModal({ open: true, event: evt })} className="p-1.5 text-gray-500 hover:text-white transition-colors" title="Duplicate"><Copy className="w-4 h-4" /></button>
                      <button onClick={() => setArchiveModal({ open: true, event: evt })} className="p-1.5 text-gray-500 hover:text-white transition-colors" title="Archive"><Archive className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {toast}
        </div>
      )}

      {/* Edit Event Modal */}
      {editModal.open && editModal.event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditModal({ open: false, event: null })}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Edit Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Event Name</label>
                <input type="text" defaultValue={editModal.event.name} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                  <input type="text" defaultValue={editModal.event.date} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                  <input type="text" defaultValue={editModal.event.location} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <input type="text" defaultValue={editModal.event.type} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                  <input type="number" defaultValue={editModal.event.capacity} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditModal({ open: false, event: null })} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setEditModal({ open: false, event: null }); showToast('Event updated successfully'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Event Modal */}
      {duplicateModal.open && duplicateModal.event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDuplicateModal({ open: false, event: null })}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Duplicate Event</h3>
            <p className="text-gray-300 text-sm mb-2">Create a copy of <span className="text-white font-medium">{duplicateModal.event.name}</span>?</p>
            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">New Event Name</label>
                <input type="text" defaultValue={`${duplicateModal.event.name} (Copy)`} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              </div>
              <p className="text-xs text-gray-500">All settings, ticket types, and branding will be copied. Registrations will not be carried over.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDuplicateModal({ open: false, event: null })} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setDuplicateModal({ open: false, event: null }); showToast('Event duplicated as draft'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Duplicate</button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Event Modal */}
      {archiveModal.open && archiveModal.event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setArchiveModal({ open: false, event: null })}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Archive Event</h3>
            <p className="text-gray-300 text-sm">Are you sure you want to archive <span className="text-white font-medium">{archiveModal.event.name}</span>?</p>
            <p className="text-xs text-gray-500 mt-2">Archived events will be hidden from your main list but can be restored later.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setArchiveModal({ open: false, event: null })} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setArchiveModal({ open: false, event: null }); showToast('Event archived successfully'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: CREATE EVENT
// ===========================================

const CreateEventTab: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [createToast, setCreateToast] = useState<string | null>(null);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(['STEM', 'Career Fair', 'Networking', 'Federal', 'National Labs', 'Early Career']);

  const showCreateToast = (msg: string) => { setCreateToast(msg); setTimeout(() => setCreateToast(null), 2500); };

  const steps = [
    { label: 'Basic Info', icon: FileText },
    { label: 'Schedule', icon: Clock },
    { label: 'Venue / Virtual', icon: MapPin },
    { label: 'Tickets', icon: Ticket },
    { label: 'Publish', icon: Send },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">Create New Event</h2>
        <p className="text-gray-400 text-sm mt-1">Set up your next STEM event in minutes</p>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between relative">
          {/* Progress line behind dots */}
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-800 mx-12" />
          <div
            className="absolute left-0 top-5 h-0.5 mx-12 transition-all duration-500"
            style={{
              width: `${(currentStep / (steps.length - 1)) * (100 - 12)}%`,
              backgroundColor: COPPER,
            }}
          />

          {steps.map((step, i) => (
            <button
              key={step.label}
              onClick={() => setCurrentStep(i)}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                i < currentStep
                  ? 'bg-orange-500 text-white'
                  : i === currentStep
                    ? 'bg-orange-500/20 text-orange-400 border-2 border-orange-500'
                    : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
              }`}>
                {i < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${
                i <= currentStep ? 'text-orange-400' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            <p className="text-sm text-gray-400">Tell us about your event</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
            <input
              type="text"
              placeholder="e.g., National STEM Career Fair 2025"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              defaultValue="National STEM Career Fair 2025"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Type *</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              defaultValue="career-fair"
            >
              <option value="career-fair">Career Fair</option>
              <option value="workshop">Workshop</option>
              <option value="hackathon">Hackathon</option>
              <option value="conference">Conference</option>
              <option value="networking">Networking Event</option>
              <option value="webinar">Webinar</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              defaultValue="multi-discipline"
            >
              <option value="multi-discipline">Multi-Discipline STEM</option>
              <option value="ai-ml">AI / Machine Learning</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="quantum">Quantum Computing</option>
              <option value="clean-energy">Clean Energy</option>
              <option value="biotech">Biotechnology</option>
              <option value="aerospace">Aerospace & Defense</option>
              <option value="semiconductor">Semiconductor</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience *</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              defaultValue="all"
            >
              <option value="all">All Levels</option>
              <option value="students">Students (Undergrad)</option>
              <option value="graduates">Graduate Students</option>
              <option value="early-career">Early Career (0-3 yrs)</option>
              <option value="mid-career">Mid Career (3-10 yrs)</option>
              <option value="senior">Senior / Executive</option>
              <option value="transitioning">Career Transitioning</option>
            </select>
          </div>

          {/* Expected Attendance */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Expected Attendance</label>
            <input
              type="number"
              placeholder="e.g., 500"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              defaultValue="500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea
              rows={4}
              placeholder="Describe your event, goals, and what attendees can expect..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors resize-none"
              defaultValue="Join us for the premier national STEM career fair connecting top employers with emerging talent across AI, cybersecurity, quantum computing, clean energy, and more. Feature 50+ exhibitors, hands-on workshops, resume reviews, and keynote sessions with industry leaders."
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs border border-gray-700 flex items-center gap-1.5">
                  {tag}
                  <XCircle className="w-3 h-3 text-gray-500 hover:text-red-400 cursor-pointer" onClick={() => setTags(prev => prev.filter(t => t !== tag))} />
                </span>
              ))}
              <button onClick={() => setShowAddTagModal(true)} className="px-3 py-1 bg-gray-800 text-gray-500 hover:text-orange-400 rounded-full text-xs border border-dashed border-gray-700 hover:border-orange-500/50 transition-colors">
                + Add tag
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="px-5 py-2.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => showCreateToast('Draft saved successfully')} className="px-5 py-2.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">
              Save Draft
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Toast */}
      {createToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {createToast}
        </div>
      )}

      {/* Add Tag Modal */}
      {showAddTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddTagModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Add Tag</h3>
            <input
              type="text"
              placeholder="Enter tag name..."
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowAddTagModal(false); setNewTag(''); }} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { if (newTag.trim()) { setTags(prev => [...prev, newTag.trim()]); } setNewTag(''); setShowAddTagModal(false); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: ATTENDEES
// ===========================================

const AttendeesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [attendees, setAttendees] = useState(SAMPLE_ATTENDEES);
  const [attendeeToast, setAttendeeToast] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<string>('all');

  const showAttendeeToast = (msg: string) => { setAttendeeToast(msg); setTimeout(() => setAttendeeToast(null), 2500); };

  const filteredAttendees = attendees.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleCheckIn = (id: string) => {
    setAttendees(prev => prev.map(a =>
      a.id === id ? { ...a, checkedIn: !a.checkedIn } : a
    ));
  };

  const checkedInCount = attendees.filter(a => a.checkedIn).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Attendee Management</h2>
          <p className="text-gray-400 text-sm mt-1">
            {attendees.length} registrations | {checkedInCount} checked in ({Math.round((checkedInCount / attendees.length) * 100)}%)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowExportModal(true)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-gray-700">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setShowEmailModal(true)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-gray-700">
            <Mail className="w-4 h-4" /> Email All
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'VIP Tickets', value: '3', icon: Award, color: 'orange' },
          { label: 'General Tickets', value: '4', icon: Ticket, color: 'teal' },
          { label: 'Student Tickets', value: '3', icon: Users, color: 'blue' },
          { label: 'Check-in Rate', value: `${Math.round((checkedInCount / attendees.length) * 100)}%`, icon: UserCheck, color: 'emerald' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
          />
        </div>
        <button onClick={() => setShowFilterModal(true)} className="px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Attendees Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Attendee</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. Date</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium text-orange-400">
                        {attendee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{attendee.name}</p>
                        <p className="text-xs text-gray-500">{attendee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      attendee.ticket === 'VIP'
                        ? 'bg-orange-500/20 text-orange-400'
                        : attendee.ticket === 'Student'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-teal-500/20 text-teal-400'
                    }`}>
                      {attendee.ticket}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{attendee.regDate}</td>
                  <td className="p-4 text-sm text-gray-300">{attendee.industry}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleCheckIn(attendee.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        attendee.checkedIn
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {attendee.checkedIn ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Not Yet
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {filteredAttendees.length} of {attendees.length} attendees
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => showAttendeeToast('Already on first page')} className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-sm hover:text-white transition-colors">Previous</button>
            <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium">1</span>
            <button onClick={() => showAttendeeToast('No more pages')} className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-sm hover:text-white transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {attendeeToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {attendeeToast}
        </div>
      )}

      {/* Export CSV Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowExportModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Export Attendees</h3>
            <p className="text-gray-300 text-sm mb-4">Export {attendees.length} attendee records as CSV.</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                <input type="radio" name="export" defaultChecked className="text-orange-500" />
                <div>
                  <p className="text-sm text-white font-medium">All attendees</p>
                  <p className="text-xs text-gray-500">Export complete list ({attendees.length} records)</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                <input type="radio" name="export" className="text-orange-500" />
                <div>
                  <p className="text-sm text-white font-medium">Checked-in only</p>
                  <p className="text-xs text-gray-500">Export checked-in attendees ({attendees.filter(a => a.checkedIn).length} records)</p>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowExportModal(false); showAttendeeToast('CSV exported successfully'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Export CSV</button>
            </div>
          </div>
        </div>
      )}

      {/* Email All Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEmailModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Email All Attendees</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input type="text" placeholder="Email subject..." defaultValue="Important Update - National STEM Career Fair 2025" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <textarea rows={4} placeholder="Type your message..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none" />
              </div>
              <p className="text-xs text-gray-500">This will send to {attendees.length} attendees.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowEmailModal(false); showAttendeeToast(`Email sent to ${attendees.length} attendees`); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Send Email</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowFilterModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Filter Attendees</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ticket Type</label>
                <div className="space-y-2">
                  {['all', 'VIP', 'General', 'Student'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="ticket" checked={ticketFilter === type} onChange={() => setTicketFilter(type)} className="text-orange-500" />
                      <span className="text-sm text-gray-300 capitalize">{type === 'all' ? 'All Types' : type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Check-in Status</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                  <option>All</option>
                  <option>Checked In</option>
                  <option>Not Checked In</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowFilterModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowFilterModal(false); showAttendeeToast('Filters applied'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: ANALYTICS
// ===========================================

const AnalyticsTab: React.FC = () => {
  const [analyticsToast, setAnalyticsToast] = useState<string | null>(null);
  const [showExportReportModal, setShowExportReportModal] = useState(false);
  const showAnalyticsToast = (msg: string) => { setAnalyticsToast(msg); setTimeout(() => setAnalyticsToast(null), 2500); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Event Analytics</h2>
          <p className="text-gray-400 text-sm mt-1">Comprehensive performance insights across all events</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50">
            <option>Last 90 Days</option>
            <option>Last 30 Days</option>
            <option>Last 12 Months</option>
            <option>Year to Date</option>
          </select>
          <button onClick={() => setShowExportReportModal(true)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 border border-gray-700 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Registrations', value: '4,500', change: '+18.2%', positive: true },
          { label: 'Avg Attendance Rate', value: '89%', change: '+3.1%', positive: true },
          { label: 'Total Revenue', value: '$284K', change: '+22.5%', positive: true },
          { label: 'Net Promoter Score', value: '72', change: '+8pts', positive: true },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
              <TrendingUp className="w-3 h-3" /> {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Registration Over Time + Attendance Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Registration Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={SAMPLE_ANALYTICS_REGISTRATION}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="careerFair" stroke={COPPER} strokeWidth={2} name="Career Fair" dot={{ fill: COPPER, r: 3 }} />
              <Line type="monotone" dataKey="workshop" stroke={STEEL} strokeWidth={2} name="Workshop" dot={{ fill: STEEL, r: 3 }} />
              <Line type="monotone" dataKey="hackathon" stroke="#A78BFA" strokeWidth={2} name="Hackathon" dot={{ fill: '#A78BFA', r: 3 }} />
              <Line type="monotone" dataKey="conference" stroke="#60A5FA" strokeWidth={2} name="Conference" dot={{ fill: '#60A5FA', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-4">
            {[
              { label: 'Career Fair', color: COPPER },
              { label: 'Workshop', color: STEEL },
              { label: 'Hackathon', color: '#A78BFA' },
              { label: 'Conference', color: '#60A5FA' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Attendance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Attendance Rate by Event</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SAMPLE_ATTENDANCE_RATE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="event" tick={{ fill: '#9CA3AF', fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(value: number) => [`${value}%`, 'Attendance']} />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]} name="Rate">
                {SAMPLE_ATTENDANCE_RATE.map((_, index) => (
                  <Cell key={index} fill={index % 2 === 0 ? COPPER : STEEL} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Revenue Per Event + Industry Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Per Event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Per Event</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SAMPLE_REVENUE_PER_EVENT} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} width={100} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                {SAMPLE_REVENUE_PER_EVENT.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Industry Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Attendee Industry Distribution</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={240}>
              <PieChart>
                <Pie
                  data={SAMPLE_INDUSTRY_DIST}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {SAMPLE_INDUSTRY_DIST.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(value: number) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {SAMPLE_INDUSTRY_DIST.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feedback Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Average Feedback Scores</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={SAMPLE_FEEDBACK_SCORES}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 5]} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(value: number) => [`${value} / 5`, 'Score']} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} name="Score">
              {SAMPLE_FEEDBACK_SCORES.map((entry, index) => (
                <Cell key={index} fill={entry.score >= 4.6 ? COPPER : STEEL} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Toast */}
      {analyticsToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {analyticsToast}
        </div>
      )}

      {/* Export Report Modal */}
      {showExportReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowExportReportModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Export Analytics Report</h3>
            <p className="text-gray-300 text-sm mb-4">Generate a comprehensive analytics report for download.</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                <input type="radio" name="format" defaultChecked className="text-orange-500" />
                <div>
                  <p className="text-sm text-white font-medium">PDF Report</p>
                  <p className="text-xs text-gray-500">Formatted report with charts and summary</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                <input type="radio" name="format" className="text-orange-500" />
                <div>
                  <p className="text-sm text-white font-medium">CSV Data Export</p>
                  <p className="text-xs text-gray-500">Raw data for further analysis</p>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowExportReportModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowExportReportModal(false); showAnalyticsToast('Report exported successfully'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Export</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: SPONSORS
// ===========================================

const SponsorsTab: React.FC = () => {
  const [sponsorToast, setSponsorToast] = useState<string | null>(null);
  const [showAddSponsorModal, setShowAddSponsorModal] = useState(false);
  const [showSponsorDetailModal, setShowSponsorDetailModal] = useState<{ open: boolean; sponsor: typeof SAMPLE_SPONSORS_PLATINUM[0] | null; tier: string }>({ open: false, sponsor: null, tier: '' });
  const [showReplyModal, setShowReplyModal] = useState<{ open: boolean; inquiry: typeof SAMPLE_SPONSOR_INQUIRIES[0] | null }>({ open: false, inquiry: null });
  const [showArchiveInquiryModal, setShowArchiveInquiryModal] = useState<{ open: boolean; inquiry: typeof SAMPLE_SPONSOR_INQUIRIES[0] | null }>({ open: false, inquiry: null });

  const showSponsorToast = (msg: string) => { setSponsorToast(msg); setTimeout(() => setSponsorToast(null), 2500); };

  const totalSponsorship = [
    ...SAMPLE_SPONSORS_PLATINUM,
    ...SAMPLE_SPONSORS_GOLD,
    ...SAMPLE_SPONSORS_SILVER,
  ].reduce((acc, s) => acc + s.contribution, 0);

  const renderSponsorCard = (sponsor: typeof SAMPLE_SPONSORS_PLATINUM[0], tier: string) => {
    const tierColors: Record<string, { bg: string; text: string; border: string; logoBg: string }> = {
      Platinum: { bg: 'bg-gray-800/80', text: 'text-white', border: 'border-gray-600', logoBg: 'bg-gradient-to-br from-gray-400 to-gray-600' },
      Gold: { bg: 'bg-gray-800/60', text: 'text-amber-400', border: 'border-amber-700/30', logoBg: 'bg-gradient-to-br from-amber-500 to-amber-700' },
      Silver: { bg: 'bg-gray-800/40', text: 'text-gray-300', border: 'border-gray-700', logoBg: 'bg-gradient-to-br from-gray-500 to-gray-700' },
    };
    const colors = tierColors[tier] || tierColors.Silver;

    return (
      <div key={sponsor.id} onClick={() => setShowSponsorDetailModal({ open: true, sponsor, tier })} className={`${colors.bg} border ${colors.border} rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer`}>
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-lg ${colors.logoBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            {sponsor.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm truncate">{sponsor.name}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{sponsor.contactName}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-emerald-400 font-medium">${sponsor.contribution.toLocaleString()}</span>
              <span className="text-xs text-gray-500">Booth {sponsor.booth}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Partner since {sponsor.since}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Sponsor Management</h2>
          <p className="text-gray-400 text-sm mt-1">Manage sponsors, track contributions, and handle inquiries</p>
        </div>
        <button onClick={() => setShowAddSponsorModal(true)} className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
          <PlusCircle className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">Total Sponsorship</span>
          </div>
          <div className="text-2xl font-bold text-white">${(totalSponsorship / 1000).toFixed(0)}K</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +28% vs last year
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-teal-400" />
            <span className="text-sm text-gray-400">Total Sponsors</span>
          </div>
          <div className="text-2xl font-bold text-white">12</div>
          <div className="text-xs text-gray-400 mt-1">2 Platinum / 3 Gold / 7 Silver</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Renewal Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">85%</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5% improvement
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Inbox className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">New Inquiries</span>
          </div>
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-xs text-amber-400 mt-1">Action required</div>
        </motion.div>
      </div>

      {/* Platinum Tier */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-gray-300" />
          <h3 className="text-lg font-semibold text-white">Platinum Sponsors</h3>
          <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">{SAMPLE_SPONSORS_PLATINUM.length}</span>
          <span className="text-xs text-gray-500 ml-1">$25,000 each</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_SPONSORS_PLATINUM.map(s => renderSponsorCard(s, 'Platinum'))}
        </div>
      </motion.div>

      {/* Gold Tier */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Gold Sponsors</h3>
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">{SAMPLE_SPONSORS_GOLD.length}</span>
          <span className="text-xs text-gray-500 ml-1">$15,000 each</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_SPONSORS_GOLD.map(s => renderSponsorCard(s, 'Gold'))}
        </div>
      </motion.div>

      {/* Silver Tier */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-white">Silver Sponsors</h3>
          <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded-full text-xs font-medium">{SAMPLE_SPONSORS_SILVER.length}</span>
          <span className="text-xs text-gray-500 ml-1">$3,000 - $5,000 each</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_SPONSORS_SILVER.map(s => renderSponsorCard(s, 'Silver'))}
        </div>
      </motion.div>

      {/* Sponsor Inquiries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Sponsor Inquiries</h3>
            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">3 new</span>
          </div>
        </div>
        <div className="space-y-3">
          {SAMPLE_SPONSOR_INQUIRIES.map((inq) => (
            <div key={inq.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white text-sm">{inq.company}</h4>
                    <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded text-[10px] font-medium uppercase">New</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{inq.contact} | {inq.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowReplyModal({ open: true, inquiry: inq })} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-white rounded-lg text-xs font-medium transition-colors">
                    Reply
                  </button>
                  <button onClick={() => setShowArchiveInquiryModal({ open: true, inquiry: inq })} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs font-medium transition-colors">
                    Archive
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-300">{inq.message}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Toast */}
      {sponsorToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {sponsorToast}
        </div>
      )}

      {/* Add Sponsor Modal */}
      {showAddSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddSponsorModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Add New Sponsor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                <input type="text" placeholder="e.g., Amazon Web Services" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contact Name</label>
                  <input type="text" placeholder="Primary contact" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tier</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <option>Platinum - $25,000</option>
                    <option>Gold - $15,000</option>
                    <option>Silver - $5,000</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Booth Assignment</label>
                <input type="text" placeholder="e.g., A1 - Premium" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddSponsorModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowAddSponsorModal(false); showSponsorToast('Sponsor added successfully'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Add Sponsor</button>
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Detail Modal */}
      {showSponsorDetailModal.open && showSponsorDetailModal.sponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSponsorDetailModal({ open: false, sponsor: null, tier: '' })}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Sponsor Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white font-bold">
                  {showSponsorDetailModal.sponsor.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{showSponsorDetailModal.sponsor.name}</h4>
                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">{showSponsorDetailModal.tier}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="text-sm text-white font-medium">{showSponsorDetailModal.sponsor.contactName}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500">Contribution</p>
                  <p className="text-sm text-emerald-400 font-medium">${showSponsorDetailModal.sponsor.contribution.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500">Booth</p>
                  <p className="text-sm text-white font-medium">{showSponsorDetailModal.sponsor.booth}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500">Partner Since</p>
                  <p className="text-sm text-white font-medium">{showSponsorDetailModal.sponsor.since}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowSponsorDetailModal({ open: false, sponsor: null, tier: '' })} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowSponsorDetailModal({ open: false, sponsor: null, tier: '' }); showSponsorToast('Opening sponsor contact...'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Contact Sponsor</button>
            </div>
          </div>
        </div>
      )}

      {/* Reply to Inquiry Modal */}
      {showReplyModal.open && showReplyModal.inquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowReplyModal({ open: false, inquiry: null })}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Reply to {showReplyModal.inquiry.company}</h3>
            <div className="p-3 bg-gray-800/50 rounded-lg mb-4">
              <p className="text-xs text-gray-500 mb-1">Original message from {showReplyModal.inquiry.contact}:</p>
              <p className="text-sm text-gray-300">{showReplyModal.inquiry.message}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Your Reply</label>
                <textarea rows={4} placeholder="Type your reply..." defaultValue={`Hi ${showReplyModal.inquiry.contact.split(' ')[0]},\n\nThank you for your interest in sponsoring our event. I'd love to schedule a call to discuss the details.\n\nBest regards,\nTechConnect Events`} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowReplyModal({ open: false, inquiry: null })} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowReplyModal({ open: false, inquiry: null }); showSponsorToast('Reply sent successfully'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Send Reply</button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Inquiry Modal */}
      {showArchiveInquiryModal.open && showArchiveInquiryModal.inquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowArchiveInquiryModal({ open: false, inquiry: null })}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Archive Inquiry</h3>
            <p className="text-gray-300 text-sm">Archive the inquiry from <span className="text-white font-medium">{showArchiveInquiryModal.inquiry.company}</span>?</p>
            <p className="text-xs text-gray-500 mt-2">Archived inquiries can be found in your inbox archive.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowArchiveInquiryModal({ open: false, inquiry: null })} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowArchiveInquiryModal({ open: false, inquiry: null }); showSponsorToast('Inquiry archived'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: SETTINGS
// ===========================================

const SettingsTab: React.FC = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [waitlist, setWaitlist] = useState(true);
  const [settingsToast, setSettingsToast] = useState<string | null>(null);
  const [showUploadLogoModal, setShowUploadLogoModal] = useState(false);
  const [showEmailTemplateModal, setShowEmailTemplateModal] = useState<{ open: boolean; name: string; subject: string; mode: 'preview' | 'edit' }>({ open: false, name: '', subject: '', mode: 'preview' });
  const [primaryColor, setPrimaryColor] = useState(COPPER);
  const [secondaryColor, setSecondaryColor] = useState(STEEL);

  const showSettingsToast = (msg: string) => { setSettingsToast(msg); setTimeout(() => setSettingsToast(null), 2500); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your organizer profile, payment, and event preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organizer Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Organizer Profile</h3>
          </div>

          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800/50 rounded-lg">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white text-lg font-bold">
              TC
            </div>
            <div>
              <h4 className="font-semibold text-white">TechConnect Events</h4>
              <p className="text-sm text-gray-400">Premium Event Organizer</p>
              <p className="text-xs text-gray-500 mt-0.5">Member since January 2022</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Organization Name</label>
              <input
                type="text"
                defaultValue="TechConnect Events"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="events@techconnect.org"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                defaultValue="+1 (202) 555-0180"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                rows={3}
                defaultValue="TechConnect Events organizes 24+ STEM career fairs, workshops, and hackathons annually, connecting emerging talent with federal agencies, national labs, and leading tech companies."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors resize-none"
              />
            </div>
            <button onClick={() => showSettingsToast('Profile saved successfully')} className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-medium text-sm transition-colors">
              Save Profile
            </button>
          </div>
        </motion.div>

        {/* Payment Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-semibold text-white">Payment Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">Stripe Connect</p>
                    <p className="text-xs text-gray-400">****4242 | Checking</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">Connected</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Payout Schedule</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                <option>Weekly (Every Monday)</option>
                <option>Bi-weekly</option>
                <option>Monthly (1st of month)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tax ID</label>
              <input
                type="text"
                defaultValue="XX-XXXXXXX"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
              />
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-emerald-400 font-medium">Payouts Active</p>
                  <p className="text-xs text-gray-400 mt-0.5">Next payout: Mar 10, 2025 | Estimated: $12,450</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Email Template Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Email Templates</h3>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Registration Confirmation', subject: 'You\'re registered for {{event_name}}!', status: 'active' },
              { name: 'Event Reminder (24h)', subject: '{{event_name}} is tomorrow - Don\'t forget!', status: 'active' },
              { name: 'Post-Event Thank You', subject: 'Thank you for attending {{event_name}}', status: 'active' },
              { name: 'Feedback Request', subject: 'How was {{event_name}}? Share your thoughts', status: 'active' },
              { name: 'Waitlist Notification', subject: 'A spot opened up for {{event_name}}!', status: 'draft' },
            ].map((template, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{template.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{template.subject}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    template.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {template.status}
                  </span>
                  <button onClick={() => setShowEmailTemplateModal({ open: true, name: template.name, subject: template.subject, mode: 'edit' })} className="p-1 text-gray-500 hover:text-white transition-colors" title="Edit template">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setShowEmailTemplateModal({ open: true, name: template.name, subject: template.subject, mode: 'preview' })} className="p-1 text-gray-500 hover:text-white transition-colors" title="Preview template">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Brand Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-semibold text-white">Brand Customization</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <label className="w-10 h-10 rounded-lg border-2 border-gray-600 cursor-pointer overflow-hidden relative" style={{ backgroundColor: primaryColor }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Brand Color</label>
              <div className="flex items-center gap-3">
                <label className="w-10 h-10 rounded-lg border-2 border-gray-600 cursor-pointer overflow-hidden relative" style={{ backgroundColor: secondaryColor }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={e => setSecondaryColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Logo</label>
              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                  TC
                </div>
                <div>
                  <p className="text-sm text-gray-300">TechConnect_Logo.svg</p>
                  <p className="text-xs text-gray-500 mt-0.5">240x240px | SVG</p>
                  <button onClick={() => setShowUploadLogoModal(true)} className="text-xs text-orange-400 hover:text-orange-300 mt-1 transition-colors">
                    Upload new logo
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Event Preferences</h4>
              <div className="space-y-3">
                {[
                  { label: 'Email notifications for new registrations', value: emailNotifs, setter: setEmailNotifs },
                  { label: 'SMS alerts for event day updates', value: smsNotifs, setter: setSmsNotifs },
                  { label: 'Auto-confirm registrations', value: autoConfirm, setter: setAutoConfirm },
                  { label: 'Enable waitlist when at capacity', value: waitlist, setter: setWaitlist },
                ].map((toggle, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{toggle.label}</span>
                    <button
                      onClick={() => toggle.setter(!toggle.value)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        toggle.value ? 'bg-orange-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        toggle.value ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => showSettingsToast('Brand settings saved successfully')} className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-medium text-sm transition-colors mt-2">
              Save Brand Settings
            </button>
          </div>
        </motion.div>
      </div>

      {/* Toast */}
      {settingsToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {settingsToast}
        </div>
      )}

      {/* Upload Logo Modal */}
      {showUploadLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadLogoModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Upload Logo</h3>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors">
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-gray-300 mb-1">Drag and drop your logo here</p>
              <p className="text-xs text-gray-500 mb-4">SVG, PNG, or JPG (max 2MB, recommended 240x240px)</p>
              <label className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
                Browse Files
                <input type="file" accept="image/*" className="hidden" onChange={() => { setShowUploadLogoModal(false); showSettingsToast('Logo uploaded successfully'); }} />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUploadLogoModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Email Template Preview/Edit Modal */}
      {showEmailTemplateModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEmailTemplateModal({ open: false, name: '', subject: '', mode: 'preview' })}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">
              {showEmailTemplateModal.mode === 'preview' ? 'Preview' : 'Edit'}: {showEmailTemplateModal.name}
            </h3>
            {showEmailTemplateModal.mode === 'preview' ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Subject</p>
                  <p className="text-sm text-white font-medium">{showEmailTemplateModal.subject}</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-500 mb-2">Body Preview</p>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>Hi {'{{attendee_name}}'},</p>
                    <p>{showEmailTemplateModal.subject.replace('{{event_name}}', 'National STEM Career Fair 2025')}</p>
                    <p>We look forward to seeing you there.</p>
                    <p className="text-gray-500">-- TechConnect Events Team</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subject Line</label>
                  <input type="text" defaultValue={showEmailTemplateModal.subject} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email Body</label>
                  <textarea rows={6} defaultValue={`Hi {{attendee_name}},\n\n${showEmailTemplateModal.subject.replace('{{event_name}}', '{{event_name}}')}\n\nWe look forward to seeing you there.\n\n-- TechConnect Events Team`} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none font-mono" />
                </div>
                <p className="text-xs text-gray-500">Available variables: {'{{attendee_name}}'}, {'{{event_name}}'}, {'{{event_date}}'}, {'{{event_location}}'}</p>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEmailTemplateModal({ open: false, name: '', subject: '', mode: 'preview' })} className="px-4 py-2 text-gray-400 hover:text-white">
                {showEmailTemplateModal.mode === 'preview' ? 'Close' : 'Cancel'}
              </button>
              {showEmailTemplateModal.mode === 'edit' && (
                <button onClick={() => { setShowEmailTemplateModal({ open: false, name: '', subject: '', mode: 'preview' }); showSettingsToast('Template saved successfully'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Save Template</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const EventOrganizerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/demo');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onTabChange={setActiveTab} />;
      case 'events':
        return <MyEventsTab onTabChange={setActiveTab} />;
      case 'create':
        return <CreateEventTab />;
      case 'attendees':
        return <AttendeesTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'sponsors':
        return <SponsorsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        {/* Logo / Branding */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
              TC
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">TechConnect Events</h1>
              <p className="text-xs text-gray-500">Event Organizer</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent'
                }`}
              >
                <tab.icon className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1 text-left">{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-[10px] font-bold min-w-[20px] text-center">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          {/* Quick Stats */}
          <div className="px-3 py-2 mb-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Events This Quarter</span>
              <span className="text-white font-medium">6 / 8</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-orange-500" style={{ width: '75%' }} />
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {TABS.find(t => t.key === activeTab)?.label || 'Overview'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {activeTab === 'overview' && 'Welcome back, TechConnect Events'}
                {activeTab === 'events' && '8 events across all statuses'}
                {activeTab === 'create' && 'Set up your next STEM event'}
                {activeTab === 'attendees' && 'National STEM Career Fair 2025'}
                {activeTab === 'analytics' && 'Performance across 24 events'}
                {activeTab === 'sponsors' && '12 active sponsors | $156K total'}
                {activeTab === 'settings' && 'Manage your organizer account'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => setShowNotificationsPanel(!showNotificationsPanel)} className="p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-lg transition-colors relative">
                  <Inbox className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                {showNotificationsPanel && (
                  <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                      <button onClick={() => setShowNotificationsPanel(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {[
                        { title: 'New sponsor inquiry', desc: 'Amazon Web Services wants Platinum tier', time: '1h ago', color: 'text-orange-400' },
                        { title: 'Registration milestone', desc: 'STEM Career Fair hit 450 registrations', time: '3h ago', color: 'text-emerald-400' },
                        { title: 'New sponsor inquiry', desc: 'Microsoft Research interested in Gold tier', time: '5h ago', color: 'text-orange-400' },
                      ].map((n, i) => (
                        <div key={i} onClick={() => { setShowNotificationsPanel(false); setActiveTab('sponsors'); }} className="p-3 hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0">
                          <p className={`text-sm font-medium ${n.color}`}>{n.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                          <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-800">
                      <button onClick={() => { setShowNotificationsPanel(false); setActiveTab('sponsors'); }} className="w-full text-center text-xs text-orange-400 hover:text-orange-300 py-1">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                  TC
                </div>
                <span className="text-sm text-gray-300">TechConnect</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EventOrganizerDashboard;
