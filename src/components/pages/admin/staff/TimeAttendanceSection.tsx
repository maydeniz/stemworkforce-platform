// ===========================================
// Time & Attendance Section - Staff Management
// ===========================================
// Timesheets, PTO requests, leave balances, attendance calendar
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Sun,
  Heart,
  Briefcase,
  Home
} from 'lucide-react';
import type { Timesheet, LeaveRequest, LeaveBalance, LeaveType, LeaveStatus, TimesheetStatus } from '@/types/staffManagement';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_TIMESHEETS: Timesheet[] = [
  {
    id: 'ts-1',
    staffId: 'staff-1',
    staffName: 'Sarah Chen',
    periodStart: '2025-01-20',
    periodEnd: '2025-01-26',
    weekNumber: 4,
    year: 2025,
    status: 'submitted',
    submittedAt: '2025-01-26T17:00:00Z',
    regularHours: 40,
    overtimeHours: 2,
    entries: []
  },
  {
    id: 'ts-2',
    staffId: 'staff-2',
    staffName: 'Michael Torres',
    periodStart: '2025-01-20',
    periodEnd: '2025-01-26',
    weekNumber: 4,
    year: 2025,
    status: 'approved',
    submittedAt: '2025-01-26T16:30:00Z',
    approvedBy: 'staff-1',
    approvedAt: '2025-01-27T09:00:00Z',
    regularHours: 40,
    overtimeHours: 0,
    entries: []
  },
  {
    id: 'ts-3',
    staffId: 'staff-3',
    staffName: 'Emily Rodriguez',
    periodStart: '2025-01-20',
    periodEnd: '2025-01-26',
    weekNumber: 4,
    year: 2025,
    status: 'draft',
    regularHours: 32,
    overtimeHours: 0,
    entries: []
  }
];

const SAMPLE_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    staffId: 'staff-1',
    staffName: 'Sarah Chen',
    leaveType: 'vacation',
    startDate: '2025-02-10',
    endDate: '2025-02-14',
    hoursRequested: 40,
    status: 'approved',
    approverId: 'staff-mgr',
    approverName: 'Director',
    approvedAt: '2025-01-20',
    notes: 'Family vacation',
    createdAt: '2025-01-15'
  },
  {
    id: 'leave-2',
    staffId: 'staff-2',
    staffName: 'Michael Torres',
    leaveType: 'sick',
    startDate: '2025-01-28',
    endDate: '2025-01-28',
    hoursRequested: 8,
    status: 'pending',
    notes: 'Doctor appointment',
    createdAt: '2025-01-25'
  },
  {
    id: 'leave-3',
    staffId: 'staff-3',
    staffName: 'Emily Rodriguez',
    leaveType: 'personal',
    startDate: '2025-02-03',
    endDate: '2025-02-03',
    hoursRequested: 8,
    status: 'pending',
    createdAt: '2025-01-24'
  }
];

const SAMPLE_LEAVE_BALANCES: LeaveBalance[] = [
  {
    staffId: 'staff-1',
    year: 2025,
    vacationAccrued: 120,
    vacationUsed: 16,
    vacationPending: 40,
    vacationAvailable: 64,
    sickAccrued: 48,
    sickUsed: 8,
    sickAvailable: 40,
    personalAccrued: 24,
    personalUsed: 0,
    personalAvailable: 24,
    carryoverVacation: 16,
    carryoverExpiry: '2025-03-31'
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const TimeAttendanceSection: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>(SAMPLE_TIMESHEETS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(SAMPLE_LEAVE_REQUESTS);
  const [leaveBalances] = useState<LeaveBalance[]>(SAMPLE_LEAVE_BALANCES);
  const [activeView, setActiveView] = useState<'timesheets' | 'pto' | 'calendar'>('timesheets');
  const [selectedWeek, setSelectedWeek] = useState<number>(4);
  const [showNewPTOModal, setShowNewPTOModal] = useState(false);

  const handleApproveTimesheet = (timesheetId: string) => {
    setTimesheets(prev => prev.map(ts =>
      ts.id === timesheetId
        ? { ...ts, status: 'approved' as TimesheetStatus, approvedAt: new Date().toISOString(), approvedBy: 'current-user' }
        : ts
    ));
  };

  const handleRejectTimesheet = (timesheetId: string) => {
    setTimesheets(prev => prev.map(ts =>
      ts.id === timesheetId
        ? { ...ts, status: 'rejected' as TimesheetStatus }
        : ts
    ));
  };

  const handleApproveLeave = (leaveId: string) => {
    setLeaveRequests(prev => prev.map(req =>
      req.id === leaveId
        ? { ...req, status: 'approved' as LeaveStatus, approverId: 'current-user', approvedAt: new Date().toISOString() }
        : req
    ));
  };

  const handleDenyLeave = (leaveId: string) => {
    setLeaveRequests(prev => prev.map(req =>
      req.id === leaveId
        ? { ...req, status: 'denied' as LeaveStatus }
        : req
    ));
  };

  const handleExportReport = () => {
    // Generate CSV data
    const csvContent = [
      ['Staff Name', 'Week', 'Regular Hours', 'Overtime Hours', 'Status'].join(','),
      ...timesheets.map(ts => [ts.staffName, `Week ${ts.weekNumber}`, ts.regularHours, ts.overtimeHours, ts.status].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-attendance-week-${selectedWeek}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Metrics
  const metrics = {
    pendingTimesheets: timesheets.filter(t => t.status === 'submitted').length,
    pendingPTO: leaveRequests.filter(l => l.status === 'pending').length,
    totalOvertime: timesheets.reduce((sum, t) => sum + t.overtimeHours, 0),
    upcomingLeave: leaveRequests.filter(l => l.status === 'approved' && new Date(l.startDate) > new Date()).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Time & Attendance</h2>
          <p className="text-sm text-gray-400">Manage timesheets, PTO, and attendance</p>
        </div>
        <button
          onClick={handleExportReport}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Clock} label="Pending Timesheets" value={metrics.pendingTimesheets} color="amber" />
        <MetricCard icon={Calendar} label="Pending PTO" value={metrics.pendingPTO} color="blue" />
        <MetricCard icon={AlertTriangle} label="Total Overtime (hrs)" value={metrics.totalOvertime} color="red" />
        <MetricCard icon={Sun} label="Upcoming Leave" value={metrics.upcomingLeave} color="emerald" />
      </div>

      {/* View Toggle */}
      <div className="flex bg-slate-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveView('timesheets')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'timesheets' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Timesheets
        </button>
        <button
          onClick={() => setActiveView('pto')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'pto' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          PTO Requests
        </button>
        <button
          onClick={() => setActiveView('calendar')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'calendar' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Calendar
        </button>
      </div>

      {activeView === 'timesheets' && (
        <TimesheetsView
          timesheets={timesheets}
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
          onApprove={handleApproveTimesheet}
          onReject={handleRejectTimesheet}
        />
      )}

      {activeView === 'pto' && (
        <PTOView
          leaveRequests={leaveRequests}
          leaveBalances={leaveBalances}
          onApprove={handleApproveLeave}
          onDeny={handleDenyLeave}
          onNewRequest={() => setShowNewPTOModal(true)}
        />
      )}

      {/* New PTO Request Modal */}
      {showNewPTOModal && (
        <NewPTORequestModal onClose={() => setShowNewPTOModal(false)} />
      )}

      {activeView === 'calendar' && (
        <CalendarView leaveRequests={leaveRequests} />
      )}
    </div>
  );
};

// ===========================================
// METRIC CARD
// ===========================================

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: 'emerald' | 'blue' | 'amber' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
};

// ===========================================
// TIMESHEETS VIEW
// ===========================================

interface TimesheetsViewProps {
  timesheets: Timesheet[];
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const TimesheetsView: React.FC<TimesheetsViewProps> = ({ timesheets, selectedWeek, onWeekChange, onApprove, onReject }) => {
  const statusConfig: Record<TimesheetStatus, { label: string; bg: string }> = {
    draft: { label: 'Draft', bg: 'bg-slate-500/20 text-slate-400' },
    submitted: { label: 'Submitted', bg: 'bg-amber-500/20 text-amber-400' },
    approved: { label: 'Approved', bg: 'bg-emerald-500/20 text-emerald-400' },
    rejected: { label: 'Rejected', bg: 'bg-red-500/20 text-red-400' }
  };

  return (
    <div className="space-y-4">
      {/* Week Selector */}
      <div className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
        <button
          onClick={() => onWeekChange(selectedWeek - 1)}
          className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-white font-medium">Week {selectedWeek}, 2025</p>
          <p className="text-sm text-gray-400">Jan 20 - Jan 26</p>
        </div>
        <button
          onClick={() => onWeekChange(selectedWeek + 1)}
          className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Timesheets List */}
      <div className="space-y-3">
        {timesheets.map((ts) => {
          const cfg = statusConfig[ts.status];
          return (
            <motion.div
              key={ts.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {ts.staffName?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-medium">{ts.staffName}</p>
                    <p className="text-sm text-gray-400">
                      {ts.regularHours}h regular
                      {ts.overtimeHours > 0 && (
                        <span className="text-amber-400"> + {ts.overtimeHours}h OT</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>
                    {cfg.label}
                  </span>
                  {ts.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove(ts.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(ts.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ===========================================
// PTO VIEW
// ===========================================

interface PTOViewProps {
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  onNewRequest: () => void;
}

const PTOView: React.FC<PTOViewProps> = ({ leaveRequests, leaveBalances, onApprove, onDeny, onNewRequest }) => {
  const leaveTypeConfig: Record<LeaveType, { label: string; icon: React.ElementType; color: string }> = {
    vacation: { label: 'Vacation', icon: Sun, color: 'text-amber-400' },
    sick: { label: 'Sick', icon: Heart, color: 'text-red-400' },
    personal: { label: 'Personal', icon: Briefcase, color: 'text-blue-400' },
    bereavement: { label: 'Bereavement', icon: Heart, color: 'text-purple-400' },
    jury_duty: { label: 'Jury Duty', icon: Briefcase, color: 'text-slate-400' },
    parental: { label: 'Parental', icon: Home, color: 'text-pink-400' },
    unpaid: { label: 'Unpaid', icon: Calendar, color: 'text-gray-400' }
  };

  const statusConfig: Record<LeaveStatus, { label: string; bg: string }> = {
    pending: { label: 'Pending', bg: 'bg-amber-500/20 text-amber-400' },
    approved: { label: 'Approved', bg: 'bg-emerald-500/20 text-emerald-400' },
    denied: { label: 'Denied', bg: 'bg-red-500/20 text-red-400' },
    cancelled: { label: 'Cancelled', bg: 'bg-slate-500/20 text-slate-400' }
  };

  const balance = leaveBalances[0];

  return (
    <div className="space-y-6">
      {/* Leave Balances */}
      {balance && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Leave Balances (Sample Employee)</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">Vacation</span>
              </div>
              <div className="text-3xl font-bold text-white">{balance.vacationAvailable}h</div>
              <p className="text-sm text-gray-400">
                {balance.vacationUsed}h used • {balance.vacationPending}h pending
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-white font-medium">Sick</span>
              </div>
              <div className="text-3xl font-bold text-white">{balance.sickAvailable}h</div>
              <p className="text-sm text-gray-400">{balance.sickUsed}h used</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Personal</span>
              </div>
              <div className="text-3xl font-bold text-white">{balance.personalAvailable}h</div>
              <p className="text-sm text-gray-400">{balance.personalUsed}h used</p>
            </div>
          </div>
          {balance.carryoverVacation > 0 && (
            <p className="text-sm text-amber-400 mt-4">
              Note: {balance.carryoverVacation}h carryover vacation expires {new Date(balance.carryoverExpiry!).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* PTO Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">PTO Requests</h3>
          <button
            onClick={onNewRequest}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>

        <div className="space-y-3">
          {leaveRequests.map((req) => {
            const typeCfg = leaveTypeConfig[req.leaveType];
            const statusCfg = statusConfig[req.status];
            const Icon = typeCfg.icon;

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeCfg.color} bg-slate-800`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{req.staffName}</p>
                        <span className="text-sm text-gray-400">• {typeCfg.label}</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(req.startDate).toLocaleDateString()}
                        {req.startDate !== req.endDate && ` - ${new Date(req.endDate).toLocaleDateString()}`}
                        {' '}({req.hoursRequested}h)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusCfg.bg}`}>
                      {statusCfg.label}
                    </span>
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprove(req.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onDeny(req.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg"
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {req.notes && (
                  <p className="text-sm text-gray-500 mt-2 pl-14">{req.notes}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// CALENDAR VIEW
// ===========================================

interface CalendarViewProps {
  leaveRequests: LeaveRequest[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ leaveRequests }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1)); // February 2025

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Generate calendar days
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // Get leave for a specific day
  const getLeaveForDay = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`;
    return leaveRequests.filter(req => {
      if (req.status !== 'approved') return false;
      return dateStr >= req.startDate && dateStr <= req.endDate;
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-white">{monthName}</h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="h-24" />
        ))}
        {days.map(day => {
          const leave = getLeaveForDay(day);
          const isWeekend = (firstDayOfWeek + day - 1) % 7 === 0 || (firstDayOfWeek + day - 1) % 7 === 6;

          return (
            <div
              key={day}
              className={`h-24 rounded-lg p-2 ${
                isWeekend ? 'bg-slate-800/50' : 'bg-slate-800'
              }`}
            >
              <span className={`text-sm ${isWeekend ? 'text-gray-500' : 'text-white'}`}>
                {day}
              </span>
              <div className="mt-1 space-y-1">
                {leave.slice(0, 2).map((l, idx) => (
                  <div
                    key={idx}
                    className="text-xs px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 truncate"
                  >
                    {l.staffName?.split(' ')[0]}
                  </div>
                ))}
                {leave.length > 2 && (
                  <div className="text-xs text-gray-500">+{leave.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/20" />
          <span className="text-sm text-gray-400">Vacation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500/20" />
          <span className="text-sm text-gray-400">Sick</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500/20" />
          <span className="text-sm text-gray-400">Personal</span>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// NEW PTO REQUEST MODAL
// ===========================================

interface NewPTORequestModalProps {
  onClose: () => void;
}

const NewPTORequestModal: React.FC<NewPTORequestModalProps> = ({ onClose }) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      return;
    }
    // In a real app, this would submit to the API
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">New PTO Request</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Day</option>
              <option value="bereavement">Bereavement</option>
              <option value="jury_duty">Jury Duty</option>
              <option value="parental">Parental Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any additional details..."
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Submit Request
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeAttendanceSection;
