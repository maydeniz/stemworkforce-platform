// ===========================================
// Principal Portal Types
// ===========================================

export interface PrincipalProfile {
  id: string;
  userId: string;
  schoolId: string;
  schoolName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  yearsAtSchool: number;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  averageAttendance: number;
  graduationRate: number;
  collegeEnrollmentRate: number;
  averageGpa: number;
  disciplineIncidents: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  category: EventCategory;
  location?: string;
  attendees?: string[];
  recurrence?: EventRecurrence;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | 'meeting'
  | 'academic'
  | 'sports'
  | 'arts'
  | 'pta'
  | 'professional_development'
  | 'holiday'
  | 'deadline'
  | 'assembly'
  | 'other';

export interface EventRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
}

export interface TeacherSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  subjects: string[];
  classCount: number;
  studentCount: number;
  averageClassSize: number;
  evaluationScore?: number;
  status: 'active' | 'on_leave' | 'pending';
}

export interface StudentDisciplineRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeLevel: number;
  incidentDate: string;
  incidentType: DisciplineIncidentType;
  description: string;
  actionTaken: string;
  reportedBy: string;
  status: 'pending' | 'resolved' | 'appealed';
  followUpDate?: string;
}

export type DisciplineIncidentType =
  | 'tardiness'
  | 'absence'
  | 'behavioral'
  | 'academic_integrity'
  | 'bullying'
  | 'other';

export interface BudgetSummary {
  totalBudget: number;
  allocated: number;
  spent: number;
  remaining: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  percentage: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  audience: ('students' | 'teachers' | 'parents' | 'staff')[];
  publishDate: string;
  expiryDate?: string;
  createdBy: string;
  createdAt: string;
}

export interface PrincipalDashboardMetrics {
  schoolMetrics: SchoolMetrics;
  upcomingEvents: CalendarEvent[];
  recentAnnouncements: Announcement[];
  pendingApprovals: number;
  teacherAbsences: number;
  studentAbsences: number;
  disciplineIncidentsThisWeek: number;
}

export const EVENT_CATEGORY_CONFIG: Record<EventCategory, { label: string; color: string; bgColor: string }> = {
  meeting: { label: 'Meeting', color: 'text-blue-400', bgColor: 'bg-blue-500' },
  academic: { label: 'Academic', color: 'text-emerald-400', bgColor: 'bg-emerald-500' },
  sports: { label: 'Sports', color: 'text-orange-400', bgColor: 'bg-orange-500' },
  arts: { label: 'Arts', color: 'text-purple-400', bgColor: 'bg-purple-500' },
  pta: { label: 'PTA', color: 'text-pink-400', bgColor: 'bg-pink-500' },
  professional_development: { label: 'PD', color: 'text-cyan-400', bgColor: 'bg-cyan-500' },
  holiday: { label: 'Holiday', color: 'text-amber-400', bgColor: 'bg-amber-500' },
  deadline: { label: 'Deadline', color: 'text-red-400', bgColor: 'bg-red-500' },
  assembly: { label: 'Assembly', color: 'text-indigo-400', bgColor: 'bg-indigo-500' },
  other: { label: 'Other', color: 'text-slate-400', bgColor: 'bg-slate-500' }
};
