// ===========================================
// School Counselor Dashboard
// ===========================================
// Main dashboard for school counselors to manage
// student caseloads, applications, and communications
// FERPA Compliant: All student data access is logged
// ===========================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  CheckSquare,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  Search,
  ChevronRight,
  AlertTriangle,
  Clock,
  GraduationCap,
  Calendar,
  Loader2,
  Shield,
  LogOut,
  BookOpen,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CounselorCaseloadTab from './CounselorCaseloadTab';
import CounselorApplicationsTab from './CounselorApplicationsTab';
import CounselorTasksTab from './CounselorTasksTab';
import CounselorReportsTab from './CounselorReportsTab';
import CounselorMessagesTab from './CounselorMessagesTab';
import CounselorResourcesPanel from './components/CounselorResourcesPanel';
import type {
  CounselorProfile,
  CaseloadStudent,
  CaseloadMetrics,
  ApplicationMetrics,
  CounselorTask,
  StudentApplication
} from '@/types/counselor';

// ===========================================
// TYPES
// ===========================================

type TabKey = 'caseload' | 'applications' | 'tasks' | 'reports' | 'messages' | 'resources';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_COUNSELOR: CounselorProfile = {
  id: 'counselor-1',
  userId: 'user-1',
  schoolId: 'school-1',
  schoolName: 'Lincoln High School',
  firstName: 'Sarah',
  lastName: 'Martinez',
  email: 'smartinez@lincolnhs.edu',
  phone: '(555) 123-4567',
  title: 'Senior Counselor',
  assignedGrades: [11, 12],
  studentCount: 145,
  notificationPreferences: {
    emailDigest: true,
    deadlineAlerts: true,
    studentActivityAlerts: true
  },
  createdAt: '2023-08-01',
  updatedAt: '2024-01-15'
};

const SAMPLE_STUDENTS: CaseloadStudent[] = [
  {
    id: 'student-1',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'echen@student.lincolnhs.edu',
    gradeLevel: 12,
    gpa: 3.9,
    status: 'on_track',
    collegeListCount: 8,
    applicationsSubmitted: 3,
    applicationsInProgress: 5,
    essaysDrafted: 6,
    essaysCompleted: 4,
    recLettersRequested: 3,
    recLettersReceived: 2,
    testScoresSubmitted: true,
    transcriptRequested: true,
    fafsaStarted: true,
    fafsaCompleted: false,
    lastActivity: '2024-01-14',
    upcomingDeadline: '2024-01-15',
    daysUntilNextDeadline: 3,
    missedDeadlines: 0,
    tags: ['STEM', 'First-gen'],
    assignedAt: '2023-09-01'
  },
  {
    id: 'student-2',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'mjohnson@student.lincolnhs.edu',
    gradeLevel: 12,
    gpa: 3.4,
    status: 'needs_attention',
    collegeListCount: 5,
    applicationsSubmitted: 1,
    applicationsInProgress: 2,
    essaysDrafted: 3,
    essaysCompleted: 1,
    recLettersRequested: 2,
    recLettersReceived: 1,
    testScoresSubmitted: true,
    transcriptRequested: false,
    fafsaStarted: false,
    fafsaCompleted: false,
    lastActivity: '2024-01-10',
    upcomingDeadline: '2024-01-15',
    daysUntilNextDeadline: 3,
    missedDeadlines: 0,
    counselorNotes: 'Needs help with essays - schedule follow-up',
    tags: ['Athlete'],
    assignedAt: '2023-09-01'
  },
  {
    id: 'student-3',
    firstName: 'Sophia',
    lastName: 'Williams',
    email: 'swilliams@student.lincolnhs.edu',
    gradeLevel: 12,
    gpa: 3.7,
    status: 'critical',
    collegeListCount: 6,
    applicationsSubmitted: 0,
    applicationsInProgress: 3,
    essaysDrafted: 2,
    essaysCompleted: 0,
    recLettersRequested: 1,
    recLettersReceived: 0,
    testScoresSubmitted: false,
    transcriptRequested: false,
    fafsaStarted: false,
    fafsaCompleted: false,
    lastActivity: '2024-01-05',
    upcomingDeadline: '2024-01-15',
    daysUntilNextDeadline: 3,
    missedDeadlines: 1,
    counselorNotes: 'URGENT: EA deadline missed. Need to pivot to RD strategy.',
    tags: ['At-risk'],
    assignedAt: '2023-09-01'
  },
  {
    id: 'student-4',
    firstName: 'Aiden',
    lastName: 'Patel',
    email: 'apatel@student.lincolnhs.edu',
    gradeLevel: 12,
    gpa: 4.0,
    status: 'on_track',
    collegeListCount: 10,
    applicationsSubmitted: 6,
    applicationsInProgress: 4,
    essaysDrafted: 12,
    essaysCompleted: 10,
    recLettersRequested: 3,
    recLettersReceived: 3,
    testScoresSubmitted: true,
    transcriptRequested: true,
    fafsaStarted: true,
    fafsaCompleted: true,
    lastActivity: '2024-01-14',
    upcomingDeadline: '2024-01-15',
    daysUntilNextDeadline: 3,
    missedDeadlines: 0,
    tags: ['STEM', 'Honor Roll'],
    assignedAt: '2023-09-01'
  },
  {
    id: 'student-5',
    firstName: 'Jasmine',
    lastName: 'Rodriguez',
    email: 'jrodriguez@student.lincolnhs.edu',
    gradeLevel: 11,
    gpa: 3.6,
    status: 'on_track',
    collegeListCount: 3,
    applicationsSubmitted: 0,
    applicationsInProgress: 0,
    essaysDrafted: 1,
    essaysCompleted: 0,
    recLettersRequested: 0,
    recLettersReceived: 0,
    testScoresSubmitted: false,
    transcriptRequested: false,
    fafsaStarted: false,
    fafsaCompleted: false,
    lastActivity: '2024-01-12',
    missedDeadlines: 0,
    tags: ['First-gen', 'Junior'],
    assignedAt: '2023-09-01'
  }
];

const SAMPLE_CASELOAD_METRICS: CaseloadMetrics = {
  totalStudents: 145,
  byGrade: {
    grade9: 0,
    grade10: 0,
    grade11: 42,
    grade12: 103
  },
  byStatus: {
    onTrack: 98,
    needsAttention: 35,
    critical: 12
  }
};

const SAMPLE_APP_METRICS: ApplicationMetrics = {
  totalApplications: 824,
  submitted: 312,
  inProgress: 387,
  readyForReview: 45,
  counselorApproved: 80,
  byTier: {
    reach: 289,
    match: 356,
    safety: 179
  },
  byType: {
    EA: 156,
    ED: 87,
    ED2: 23,
    REA: 45,
    RD: 513
  },
  upcomingDeadlines: {
    next7Days: 67,
    next14Days: 134,
    next30Days: 256
  }
};

const SAMPLE_TASKS: CounselorTask[] = [
  {
    id: 'task-1',
    counselorId: 'counselor-1',
    studentId: 'student-3',
    studentName: 'Sophia Williams',
    type: 'follow_up',
    title: 'Follow up on missed EA deadline',
    description: 'Discuss RD strategy and new school list',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2024-01-16',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: 'task-2',
    counselorId: 'counselor-1',
    studentId: 'student-2',
    studentName: 'Marcus Johnson',
    type: 'rec_letter_due',
    title: 'Write recommendation letter - Stanford',
    description: 'Due for Stanford RD application',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-01-20',
    relatedSchoolName: 'Stanford',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-14'
  },
  {
    id: 'task-3',
    counselorId: 'counselor-1',
    type: 'deadline_check',
    title: 'Review Jan 15 deadline applications',
    description: '67 applications due in 3 days',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-14',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  }
];

const SAMPLE_UPCOMING_DEADLINES: StudentApplication[] = [
  {
    id: 'app-1',
    studentId: 'student-1',
    studentName: 'Emily Chen',
    schoolName: 'MIT',
    schoolLocation: 'Cambridge, MA',
    applicationType: 'RD',
    tier: 'reach',
    deadline: '2024-01-15',
    status: 'ready_for_review',
    checklist: [],
    completedItems: 8,
    totalItems: 10,
    completionPercent: 80,
    studentSubmittedForReview: '2024-01-13',
    counselorApproved: false
  },
  {
    id: 'app-2',
    studentId: 'student-2',
    studentName: 'Marcus Johnson',
    schoolName: 'Georgia Tech',
    schoolLocation: 'Atlanta, GA',
    applicationType: 'RD',
    tier: 'match',
    deadline: '2024-01-15',
    status: 'in_progress',
    checklist: [],
    completedItems: 5,
    totalItems: 8,
    completionPercent: 62,
    counselorApproved: false
  },
  {
    id: 'app-3',
    studentId: 'student-4',
    studentName: 'Aiden Patel',
    schoolName: 'Stanford',
    schoolLocation: 'Stanford, CA',
    applicationType: 'RD',
    tier: 'reach',
    deadline: '2024-01-15',
    status: 'counselor_approved',
    checklist: [],
    completedItems: 10,
    totalItems: 10,
    completionPercent: 100,
    studentSubmittedForReview: '2024-01-10',
    counselorReviewedAt: '2024-01-11',
    counselorApproved: true
  }
];

// ===========================================
// FERPA COMPLIANCE UTILITIES
// ===========================================

interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId: string;
  studentId?: string;
  details: string;
}

// Log FERPA-compliant audit entries
// SECURITY: Audit logs are sent server-side only — never stored in browser storage
const logAuditEntry = async (entry: Omit<AuditLogEntry, 'timestamp'>) => {
  const auditEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString()
  };

  // Send to Supabase audit_logs table (server-side, immutable)
  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('audit_logs').insert({
      action: auditEntry.action,
      user_id: auditEntry.userId,
      target_id: auditEntry.studentId || null,
      details: auditEntry.details,
      created_at: auditEntry.timestamp,
      source: 'counselor_dashboard'
    });
  } catch (err) {
    // Log to console as fallback — never to sessionStorage
    console.error('[FERPA AUDIT] Failed to write audit log:', err);
  }
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const CounselorDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('caseload');
  const [isLoading, setIsLoading] = useState(true);
  const [counselor, setCounselor] = useState<CounselorProfile | null>(null);
  const [students, setStudents] = useState<CaseloadStudent[]>([]);
  const [caseloadMetrics, setCaseloadMetrics] = useState<CaseloadMetrics | null>(null);
  const [appMetrics, setAppMetrics] = useState<ApplicationMetrics | null>(null);
  const [tasks, setTasks] = useState<CounselorTask[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<StudentApplication[]>([]);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFerpaNotice, setShowFerpaNotice] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60); // 30 minutes in seconds

  // Session timeout warning
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeout(prev => {
        if (prev <= 300 && prev > 0 && prev % 60 === 0) {
          // Warning at 5, 4, 3, 2, 1 minutes
          console.warn(`Session expires in ${prev / 60} minutes`);
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Log data access on tab change (FERPA compliance)
  useEffect(() => {
    if (counselor && activeTab) {
      logAuditEntry({
        action: 'VIEW_TAB',
        userId: counselor.id,
        details: `Accessed ${activeTab} tab`
      });
    }
  }, [activeTab, counselor]);

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call - in production, fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 800));

      setCounselor(SAMPLE_COUNSELOR);
      setStudents(SAMPLE_STUDENTS);
      setCaseloadMetrics(SAMPLE_CASELOAD_METRICS);
      setAppMetrics(SAMPLE_APP_METRICS);
      setTasks(SAMPLE_TASKS);
      setUpcomingDeadlines(SAMPLE_UPCOMING_DEADLINES);
      setIsLoading(false);

      // Log initial access (FERPA compliance)
      logAuditEntry({
        action: 'LOGIN',
        userId: SAMPLE_COUNSELOR.id,
        details: 'Counselor dashboard accessed'
      });
    };

    loadData();
  }, []);

  // Handler functions
  const handleStudentSelect = useCallback((student: CaseloadStudent) => {
    logAuditEntry({
      action: 'VIEW_STUDENT',
      userId: counselor?.id || '',
      studentId: student.id,
      details: `Viewed student record: ${student.firstName} ${student.lastName}`
    });
  }, [counselor]);

  const handleSendNudge = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    logAuditEntry({
      action: 'SEND_NUDGE',
      userId: counselor?.id || '',
      studentId,
      details: `Sent nudge to student: ${student?.firstName} ${student?.lastName}`
    });
    // TODO: Implement actual nudge sending via API
    alert(`Nudge sent to ${student?.firstName} ${student?.lastName}`);
  }, [counselor, students]);

  const handleApproveApplication = useCallback((appId: string) => {
    const app = upcomingDeadlines.find(a => a.id === appId);
    logAuditEntry({
      action: 'APPROVE_APPLICATION',
      userId: counselor?.id || '',
      studentId: app?.studentId,
      details: `Approved application: ${app?.schoolName} for ${app?.studentName}`
    });

    // Update application status
    setUpcomingDeadlines(prev =>
      prev.map(a => a.id === appId ? { ...a, status: 'counselor_approved' as const, counselorApproved: true } : a)
    );
    alert(`Application to ${app?.schoolName} approved!`);
  }, [counselor, upcomingDeadlines]);

  const handleCompleteTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    logAuditEntry({
      action: 'COMPLETE_TASK',
      userId: counselor?.id || '',
      studentId: task?.studentId,
      details: `Completed task: ${task?.title}`
    });

    // Update task status
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() } : t)
    );
  }, [counselor, tasks]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      logAuditEntry({
        action: 'SEARCH',
        userId: counselor?.id || '',
        details: `Searched for: ${query}`
      });
    }
  }, [counselor]);

  // Filter students based on search
  const filteredStudents = searchQuery.length > 2
    ? students.filter(s =>
        s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  // Tab configuration with badges
  const tabs: TabConfig[] = [
    { key: 'caseload', label: 'Caseload', icon: Users, badge: caseloadMetrics?.byStatus.critical },
    { key: 'applications', label: 'Applications', icon: FileText, badge: appMetrics?.readyForReview },
    { key: 'tasks', label: 'Tasks', icon: CheckSquare, badge: tasks.filter(t => t.status === 'pending').length },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'resources', label: 'Career Resources', icon: BookOpen }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* FERPA Compliance Notice */}
      {showFerpaNotice && (
        <div className="bg-blue-900/50 border-b border-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-blue-200">
                  <strong>FERPA Notice:</strong> All access to student education records is logged and monitored.
                  Only access data for students in your assigned caseload with legitimate educational interest.
                </p>
              </div>
              <button
                onClick={() => setShowFerpaNotice(false)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Timeout Warning */}
      {sessionTimeout <= 300 && sessionTimeout > 0 && (
        <div className="bg-amber-900/50 border-b border-amber-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <p className="text-sm text-amber-200">
                Session expires in {Math.ceil(sessionTimeout / 60)} minute{sessionTimeout > 60 ? 's' : ''}.
                <button className="ml-2 underline hover:text-amber-100">Extend Session</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title & School */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Counselor Portal</h1>
                <p className="text-sm text-gray-400">{counselor?.schoolName}</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {tasks.filter(t => t.priority === 'urgent').length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Settings button clicked');
                  setShowSettings(!showSettings);
                }}
                className="relative z-50 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Settings"
              >
                <Settings className="w-5 h-5 pointer-events-none" />
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Logout button clicked');
                  try {
                    logAuditEntry({
                      action: 'LOGOUT',
                      userId: counselor?.id || '',
                      details: 'User logged out'
                    });
                    console.log('Calling signOut...');
                    await signOut();
                    console.log('signOut complete, navigating...');
                    navigate('/login');
                  } catch (error) {
                    console.error('Logout failed:', error);
                    // Force navigation even if signOut fails
                    navigate('/login');
                  }
                }}
                className="relative z-50 p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5 pointer-events-none" />
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{counselor?.firstName} {counselor?.lastName}</p>
                  <p className="text-xs text-gray-400">{counselor?.title}</p>
                </div>
                <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {counselor?.firstName[0]}{counselor?.lastName[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed right-4 top-20 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-medium text-white">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').map(task => (
                <div key={task.id} className="p-4 border-b border-gray-800 hover:bg-gray-800/50">
                  <p className="text-sm text-white font-medium">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                </div>
              ))}
              {tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length === 0 && (
                <div className="p-4 text-center text-gray-500">No urgent notifications</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Settings Dropdown */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSettings(false)}
          />
          <div className="fixed right-16 top-20 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-medium text-white">Settings</h3>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  alert('Notification preferences coming soon!');
                  setShowSettings(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
              >
                Notification Preferences
              </button>
              <button
                onClick={() => {
                  alert('Email settings coming soon!');
                  setShowSettings(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
              >
                Email Settings
              </button>
              <button
                onClick={() => {
                  logAuditEntry({
                    action: 'VIEW_AUDIT_LOG',
                    userId: counselor?.id || '',
                    details: 'Viewed personal audit log'
                  });
                  alert('Audit log viewer coming soon!');
                  setShowSettings(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                View Audit Log
              </button>
            </div>
          </div>
        </>
      )}

      {/* Overview Section */}
      <section className="border-b border-gray-800 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <QuickStatCard
              label="Total Students"
              value={caseloadMetrics?.totalStudents || 0}
              icon={Users}
              color="purple"
            />
            <QuickStatCard
              label="Critical"
              value={caseloadMetrics?.byStatus.critical || 0}
              icon={AlertTriangle}
              color="red"
              onClick={() => setActiveTab('caseload')}
            />
            <QuickStatCard
              label="Needs Attention"
              value={caseloadMetrics?.byStatus.needsAttention || 0}
              icon={Clock}
              color="amber"
              onClick={() => setActiveTab('caseload')}
            />
            <QuickStatCard
              label="Ready for Review"
              value={appMetrics?.readyForReview || 0}
              icon={FileText}
              color="blue"
              onClick={() => setActiveTab('applications')}
            />
            <QuickStatCard
              label="Due in 7 Days"
              value={appMetrics?.upcomingDeadlines.next7Days || 0}
              icon={Calendar}
              color="emerald"
            />
            <QuickStatCard
              label="Pending Tasks"
              value={tasks.filter(t => t.status === 'pending').length}
              icon={CheckSquare}
              color="pink"
              onClick={() => setActiveTab('tasks')}
            />
          </div>

          {/* Urgent Alerts */}
          {(caseloadMetrics?.byStatus.critical || 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white font-medium">
                    {caseloadMetrics?.byStatus.critical} students need immediate attention
                  </p>
                  <p className="text-sm text-red-300">
                    Students with critical status may miss deadlines without intervention
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('caseload')}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                View Students
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Tab Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/30 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'caseload' && (
          <CounselorCaseloadTab
            students={filteredStudents}
            metrics={caseloadMetrics!}
            onStudentSelect={handleStudentSelect}
            onSendNudge={handleSendNudge}
          />
        )}

        {activeTab === 'applications' && (
          <CounselorApplicationsTab
            applications={upcomingDeadlines}
            metrics={appMetrics!}
            onReviewApplication={(app) => {
              logAuditEntry({
                action: 'REVIEW_APPLICATION',
                userId: counselor?.id || '',
                studentId: app.studentId,
                details: `Reviewing application: ${app.schoolName} for ${app.studentName}`
              });
            }}
            onApproveApplication={handleApproveApplication}
          />
        )}

        {activeTab === 'tasks' && (
          <CounselorTasksTab
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onCreateTask={() => {
              logAuditEntry({
                action: 'CREATE_TASK',
                userId: counselor?.id || '',
                details: 'Opened create task modal'
              });
            }}
            onSendNudge={handleSendNudge}
          />
        )}

        {activeTab === 'reports' && (
          <CounselorReportsTab
            caseloadMetrics={caseloadMetrics!}
            appMetrics={appMetrics!}
          />
        )}

        {activeTab === 'messages' && (
          <CounselorMessagesTab
            counselorId={counselor?.id || ''}
          />
        )}

        {activeTab === 'resources' && (
          <CounselorResourcesPanel />
        )}
      </main>

      {/* FERPA Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/30 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                FERPA Compliant
              </span>
              <span>Session ID: {Math.random().toString(36).substring(7)}</span>
            </div>
            <div>
              All student data access is logged and monitored per FERPA regulations (34 CFR Part 99)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ===========================================
// QUICK STAT CARD
// ===========================================

interface QuickStatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'purple' | 'red' | 'amber' | 'blue' | 'emerald' | 'pink';
  onClick?: () => void;
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ label, value, icon: Icon, color, onClick }) => {
  const colorClasses = {
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`${colorClasses[color]} border rounded-xl p-4 ${
        onClick ? 'hover:bg-opacity-30 cursor-pointer transition-all' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs opacity-80">{label}</p>
        </div>
      </div>
    </Component>
  );
};

export default CounselorDashboard;
