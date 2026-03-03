// ===========================================
// Principal Dashboard
// ===========================================
// Main dashboard for school principals to manage
// school operations, staff, and student affairs
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Bell,
  Settings,
  TrendingUp,
  Building2,
  Clock,
  AlertTriangle,
  Megaphone,
  DollarSign,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PrincipalCalendarTab from './PrincipalCalendarTab';
import type {
  PrincipalProfile,
  SchoolMetrics,
  CalendarEvent,
  Announcement,
  TeacherSummary,
  BudgetSummary
} from '@/types/principal';
import { EVENT_CATEGORY_CONFIG } from '@/types/principal';

// ===========================================
// TYPES
// ===========================================

type TabKey = 'overview' | 'calendar' | 'staff' | 'students' | 'reports' | 'announcements' | 'settings';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_PRINCIPAL: PrincipalProfile = {
  id: 'principal-1',
  userId: 'user-1',
  schoolId: 'school-1',
  schoolName: 'Lincoln High School',
  firstName: 'Dr. James',
  lastName: 'Anderson',
  email: 'janderson@lincolnhs.edu',
  phone: '(555) 123-4567',
  title: 'Principal',
  yearsAtSchool: 8,
  createdAt: '2016-08-01',
  updatedAt: '2024-01-15'
};

const SAMPLE_METRICS: SchoolMetrics = {
  totalStudents: 1247,
  totalTeachers: 78,
  totalStaff: 124,
  averageAttendance: 94.2,
  graduationRate: 92.5,
  collegeEnrollmentRate: 78.3,
  averageGpa: 3.24,
  disciplineIncidents: 12
};

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Faculty Meeting',
    description: 'Monthly faculty meeting to discuss curriculum updates',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '15:30',
    endTime: '17:00',
    allDay: false,
    category: 'meeting',
    location: 'Main Conference Room',
    createdBy: 'principal-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'event-2',
    title: 'Winter Sports Assembly',
    description: 'Recognition ceremony for winter sports teams',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    allDay: false,
    category: 'assembly',
    location: 'Gymnasium',
    createdBy: 'principal-1',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    id: 'event-3',
    title: 'PTA Meeting',
    description: 'Parent-Teacher Association monthly meeting',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '19:30',
    allDay: false,
    category: 'pta',
    location: 'Auditorium',
    createdBy: 'principal-1',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    id: 'event-4',
    title: 'Professional Development Day',
    description: 'Staff professional development - no students',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    allDay: true,
    category: 'professional_development',
    createdBy: 'principal-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'event-5',
    title: 'Spring Musical Auditions',
    description: 'Auditions for the spring musical production',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '18:00',
    allDay: false,
    category: 'arts',
    location: 'Theater',
    createdBy: 'principal-1',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: 'event-6',
    title: 'Quarterly Report Deadline',
    description: 'Deadline for submitting quarterly academic reports',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    allDay: true,
    category: 'deadline',
    createdBy: 'principal-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'event-7',
    title: "President's Day",
    description: 'School closed for holiday',
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    allDay: true,
    category: 'holiday',
    createdBy: 'principal-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'event-8',
    title: 'Basketball Game vs. Roosevelt',
    description: 'Varsity basketball home game',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '19:00',
    endTime: '21:00',
    allDay: false,
    category: 'sports',
    location: 'Gymnasium',
    createdBy: 'principal-1',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Snow Day Protocol Reminder',
    content: 'Please review the updated snow day procedures for this winter season.',
    priority: 'high',
    audience: ['teachers', 'staff', 'parents'],
    publishDate: new Date().toISOString(),
    createdBy: 'principal-1',
    createdAt: '2024-01-15'
  },
  {
    id: 'ann-2',
    title: 'Spring Registration Open',
    content: 'Course registration for the spring semester is now open.',
    priority: 'normal',
    audience: ['students', 'parents'],
    publishDate: new Date().toISOString(),
    createdBy: 'principal-1',
    createdAt: '2024-01-12'
  }
];

const SAMPLE_TEACHERS: TeacherSummary[] = [
  {
    id: 'teacher-1',
    firstName: 'Emily',
    lastName: 'Thompson',
    email: 'ethompson@lincolnhs.edu',
    department: 'Mathematics',
    subjects: ['Algebra II', 'Calculus'],
    classCount: 5,
    studentCount: 125,
    averageClassSize: 25,
    evaluationScore: 4.5,
    status: 'active'
  },
  {
    id: 'teacher-2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@lincolnhs.edu',
    department: 'Science',
    subjects: ['Biology', 'AP Biology'],
    classCount: 6,
    studentCount: 140,
    averageClassSize: 23,
    evaluationScore: 4.8,
    status: 'active'
  },
  {
    id: 'teacher-3',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'swilliams@lincolnhs.edu',
    department: 'English',
    subjects: ['English 11', 'AP Literature'],
    classCount: 5,
    studentCount: 118,
    averageClassSize: 24,
    status: 'on_leave'
  }
];

const SAMPLE_BUDGET: BudgetSummary = {
  totalBudget: 2500000,
  allocated: 2350000,
  spent: 1875000,
  remaining: 625000,
  categories: [
    { name: 'Salaries', allocated: 1500000, spent: 1250000, percentage: 60 },
    { name: 'Supplies', allocated: 300000, spent: 225000, percentage: 12 },
    { name: 'Technology', allocated: 250000, spent: 200000, percentage: 10 },
    { name: 'Facilities', allocated: 200000, spent: 150000, percentage: 8 },
    { name: 'Programs', allocated: 100000, spent: 50000, percentage: 4 }
  ]
};

// ===========================================
// TAB CONFIG
// ===========================================

const TABS: TabConfig[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'staff', label: 'Staff', icon: Users },
  { key: 'students', label: 'Students', icon: GraduationCap },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'settings', label: 'Settings', icon: Settings }
];

// ===========================================
// OVERVIEW TAB COMPONENT
// ===========================================

const OverviewTab: React.FC<{
  metrics: SchoolMetrics;
  events: CalendarEvent[];
  announcements: Announcement[];
  teachers: TeacherSummary[];
  budget: BudgetSummary;
}> = ({ metrics, events, announcements, teachers: _teachers, budget }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const upcomingEvents = events
    .filter(e => new Date(e.startDate) >= new Date())
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-500/20 rounded-lg">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-slate-400 text-sm">Students</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.totalStudents.toLocaleString()}</p>
          <p className="text-sm text-slate-400 mt-1">
            {metrics.averageAttendance}% attendance
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-lg">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm">Teachers</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.totalTeachers}</p>
          <p className="text-sm text-slate-400 mt-1">
            {metrics.totalStaff} total staff
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400 text-sm">Graduation Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.graduationRate}%</p>
          <div className="flex items-center gap-1 text-sm text-emerald-400 mt-1">
            <TrendingUp className="w-3 h-3" />
            +2.3% vs last year
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-500/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-slate-400 text-sm">Average GPA</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.averageGpa}</p>
          <p className="text-sm text-slate-400 mt-1">
            School-wide average
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Upcoming Events</h3>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.map(event => {
              const config = EVENT_CATEGORY_CONFIG[event.category];
              return (
                <div key={event.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${config.bgColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{event.title}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                      {event.startTime && !event.allDay && ` at ${event.startTime}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Announcements</h3>
            <Megaphone className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(announcement => (
              <div key={announcement.id} className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {announcement.priority === 'high' && (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <p className="text-sm font-medium text-white">{announcement.title}</p>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Today's Overview</h3>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Student Attendance</span>
              </div>
              <span className="text-sm font-medium text-white">{metrics.averageAttendance}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Teacher Absences</span>
              </div>
              <span className="text-sm font-medium text-white">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-300">Discipline Reports</span>
              </div>
              <span className="text-sm font-medium text-white">{metrics.disciplineIncidents}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-300">Pending Approvals</span>
              </div>
              <span className="text-sm font-medium text-white">7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Budget Overview</h3>
          <DollarSign className="w-5 h-5 text-slate-400" />
        </div>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Total Budget</p>
            <p className="text-lg font-bold text-white">{formatCurrency(budget.totalBudget)}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Allocated</p>
            <p className="text-lg font-bold text-blue-400">{formatCurrency(budget.allocated)}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Spent</p>
            <p className="text-lg font-bold text-amber-400">{formatCurrency(budget.spent)}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Remaining</p>
            <p className="text-lg font-bold text-emerald-400">{formatCurrency(budget.remaining)}</p>
          </div>
        </div>
        <div className="space-y-3">
          {budget.categories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-300">{category.name}</span>
                <span className="text-slate-400">
                  {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(category.spent / category.allocated) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// STAFF TAB PLACEHOLDER
// ===========================================

const StaffTab: React.FC<{ teachers: TeacherSummary[] }> = ({ teachers }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">Staff Management</h2>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
        Add Staff Member
      </button>
    </div>
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Department</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Classes</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Students</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {teachers.map(teacher => (
            <tr key={teacher.id} className="hover:bg-slate-800/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium">
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {teacher.firstName} {teacher.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{teacher.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-300">{teacher.department}</td>
              <td className="px-4 py-3 text-sm text-slate-300">{teacher.classCount}</td>
              <td className="px-4 py-3 text-sm text-slate-300">{teacher.studentCount}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                  teacher.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {teacher.status === 'active' ? 'Active' : 'On Leave'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ===========================================
// PLACEHOLDER TABS
// ===========================================

const PlaceholderTab: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
    <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
    <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-400 max-w-md mx-auto">{description}</p>
  </div>
);

// ===========================================
// LOADING SKELETON
// ===========================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-950 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-800 rounded-xl animate-pulse" />
          <div>
            <div className="h-7 w-48 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-5 w-32 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="h-8 w-20 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ===========================================
// MAIN COMPONENT
// ===========================================

const PrincipalDashboard: React.FC = () => {
  useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [principal] = useState<PrincipalProfile>(SAMPLE_PRINCIPAL);
  const [metrics] = useState<SchoolMetrics>(SAMPLE_METRICS);
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS);
  const [announcements] = useState<Announcement[]>(SAMPLE_ANNOUNCEMENTS);
  const [teachers] = useState<TeacherSummary[]>(SAMPLE_TEACHERS);
  const [budget] = useState<BudgetSummary>(SAMPLE_BUDGET);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddEvent = (eventData: Partial<CalendarEvent>) => {
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || 'New Event',
      description: eventData.description,
      startDate: eventData.startDate || new Date().toISOString().split('T')[0],
      endDate: eventData.endDate || eventData.startDate || new Date().toISOString().split('T')[0],
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      allDay: eventData.allDay || false,
      category: eventData.category || 'other',
      location: eventData.location,
      createdBy: principal.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            metrics={metrics}
            events={events}
            announcements={announcements}
            teachers={teachers}
            budget={budget}
          />
        );
      case 'calendar':
        return (
          <PrincipalCalendarTab
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case 'staff':
        return <StaffTab teachers={teachers} />;
      case 'students':
        return (
          <PlaceholderTab
            title="Student Management"
            description="View student records, discipline reports, and academic performance. Coming soon."
          />
        );
      case 'reports':
        return (
          <PlaceholderTab
            title="Reports & Analytics"
            description="Generate and view school performance reports, attendance analytics, and more. Coming soon."
          />
        );
      case 'announcements':
        return (
          <PlaceholderTab
            title="Announcements"
            description="Create and manage school-wide announcements for students, staff, and parents. Coming soon."
          />
        );
      case 'settings':
        return (
          <PlaceholderTab
            title="Settings"
            description="Configure school settings, user preferences, and system options. Coming soon."
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {principal.schoolName}
                </h1>
                <p className="text-slate-400">
                  Welcome back, {principal.firstName} {principal.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
