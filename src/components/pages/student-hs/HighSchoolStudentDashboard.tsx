// ===========================================
// High School Student Dashboard
// Hub dashboard for high school STEM students
// Links to 23 existing student tool pages
// ===========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  DollarSign,
  Compass,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Brain,
  Briefcase,
  Building2,
  Rocket,
  Shield,
  Heart,
  Sparkles,
  Search,
  Calendar,
  Zap,
  ExternalLink,
  Bell,
  Lock,
  Eye,
  User,
  Mail,
  Globe,
  Pencil,
  Video,
  MessageSquare,
  FileCheck,
  BarChart3,
  Atom,
  Cpu,
  FlaskConical,
  Microscope
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// ===========================================
// TYPES
// ===========================================

type TabKey = 'overview' | 'college-discovery' | 'applications' | 'financial' | 'career' | 'mentorship' | 'settings';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}

// ===========================================
// TABS CONFIG
// ===========================================

const TABS: TabConfig[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'college-discovery', label: 'College Discovery', icon: GraduationCap },
  { key: 'applications', label: 'Applications', icon: FileText },
  { key: 'financial', label: 'Financial Planning', icon: DollarSign },
  { key: 'career', label: 'Career Explorer', icon: Compass },
  { key: 'mentorship', label: 'Mentorship', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// ===========================================
// SAMPLE DATA
// ===========================================

const STUDENT_PROFILE = {
  name: 'Alex Rivera',
  grade: 11,
  gpa: 3.8,
  school: 'Lincoln STEM Academy',
  interests: ['AI & Machine Learning', 'Robotics'],
  profileCompletion: 75,
  avatar: 'AR',
  satScore: 1420,
  apCourses: ['AP Computer Science A', 'AP Physics C', 'AP Calculus BC', 'AP Statistics'],
  extracurriculars: ['Robotics Club (Captain)', 'Science Olympiad', 'Math League', 'FIRST Robotics'],
  communityService: 120,
};

const COLLEGE_LIST = [
  { id: '1', name: 'MIT', location: 'Cambridge, MA', acceptRate: 32, matchScore: 88, type: 'Reach', tuition: '$57,590', appType: 'EA', status: 'In Progress', deadline: 'Nov 1, 2026', essayStatus: 'Draft', recLetters: '2/3' },
  { id: '2', name: 'Stanford University', location: 'Stanford, CA', acceptRate: 28, matchScore: 85, type: 'Reach', tuition: '$56,169', appType: 'REA', status: 'Not Started', deadline: 'Nov 1, 2026', essayStatus: 'Not Started', recLetters: '1/3' },
  { id: '3', name: 'Georgia Tech', location: 'Atlanta, GA', acceptRate: 65, matchScore: 92, type: 'Target', tuition: '$33,794', appType: 'EA', status: 'In Progress', deadline: 'Oct 15, 2026', essayStatus: 'Final', recLetters: '3/3' },
  { id: '4', name: 'Carnegie Mellon', location: 'Pittsburgh, PA', acceptRate: 42, matchScore: 90, type: 'Target', tuition: '$58,924', appType: 'RD', status: 'Not Started', deadline: 'Jan 3, 2027', essayStatus: 'Not Started', recLetters: '0/3' },
  { id: '5', name: 'UC Berkeley', location: 'Berkeley, CA', acceptRate: 55, matchScore: 87, type: 'Target', tuition: '$44,007', appType: 'RD', status: 'Submitted', deadline: 'Nov 30, 2026', essayStatus: 'Submitted', recLetters: '3/3' },
  { id: '6', name: 'Purdue University', location: 'West Lafayette, IN', acceptRate: 78, matchScore: 94, type: 'Safety', tuition: '$28,794', appType: 'EA', status: 'Submitted', deadline: 'Nov 1, 2026', essayStatus: 'Submitted', recLetters: '3/3' },
  { id: '7', name: 'Virginia Tech', location: 'Blacksburg, VA', acceptRate: 72, matchScore: 91, type: 'Safety', tuition: '$31,908', appType: 'EA', status: 'In Progress', deadline: 'Dec 1, 2026', essayStatus: 'Review', recLetters: '2/3' },
  { id: '8', name: 'Caltech', location: 'Pasadena, CA', acceptRate: 25, matchScore: 82, type: 'Reach', tuition: '$60,816', appType: 'REA', status: 'Not Started', deadline: 'Nov 1, 2026', essayStatus: 'Not Started', recLetters: '0/3' },
];

const SCHOLARSHIPS = [
  { id: '1', name: 'National STEM Excellence Award', amount: '$15,000', deadline: 'Mar 15, 2026', match: 95, status: 'Eligible', org: 'National Science Foundation' },
  { id: '2', name: 'Future Innovators Scholarship', amount: '$10,000', deadline: 'Apr 1, 2026', match: 92, status: 'Applied', org: 'Tech Innovation Fund' },
  { id: '3', name: 'Women & Minorities in STEM', amount: '$8,000', deadline: 'May 15, 2026', match: 88, status: 'Eligible', org: 'Diversity in Tech Foundation' },
  { id: '4', name: 'Robotics Achievement Award', amount: '$5,000', deadline: 'Jun 1, 2026', match: 96, status: 'Shortlisted', org: 'FIRST Robotics' },
  { id: '5', name: 'AP Scholar STEM Grant', amount: '$4,000', deadline: 'Jul 30, 2026', match: 90, status: 'Eligible', org: 'College Board' },
];

const AID_BY_SCHOOL = [
  { school: 'MIT', aid: 45000, net: 12590 },
  { school: 'Stanford', aid: 42000, net: 14169 },
  { school: 'GA Tech', aid: 28000, net: 5794 },
  { school: 'CMU', aid: 38000, net: 20924 },
  { school: 'Berkeley', aid: 32000, net: 12007 },
  { school: 'Purdue', aid: 22000, net: 6794 },
  { school: 'VA Tech', aid: 24000, net: 7908 },
  { school: 'Caltech', aid: 48000, net: 12816 },
];

const CAREER_PATHWAYS = [
  { id: '1', title: 'AI & Machine Learning Engineer', salary: '$120K - $200K', growth: '+36%', icon: Brain, color: 'violet', description: 'Design intelligent systems and neural networks', demandLevel: 'Very High' },
  { id: '2', title: 'Cybersecurity Analyst', salary: '$95K - $165K', growth: '+32%', icon: Shield, color: 'orange', description: 'Protect organizations from digital threats', demandLevel: 'Very High' },
  { id: '3', title: 'Quantum Computing Researcher', salary: '$130K - $220K', growth: '+45%', icon: Atom, color: 'blue', description: 'Develop next-gen quantum algorithms', demandLevel: 'High' },
  { id: '4', title: 'Biotech Engineer', salary: '$85K - $155K', growth: '+28%', icon: FlaskConical, color: 'emerald', description: 'Engineer biological solutions for medicine', demandLevel: 'High' },
  { id: '5', title: 'Robotics Engineer', salary: '$100K - $175K', growth: '+25%', icon: Cpu, color: 'amber', description: 'Build autonomous systems and robots', demandLevel: 'High' },
  { id: '6', title: 'Data Scientist', salary: '$110K - $180K', growth: '+30%', icon: BarChart3, color: 'pink', description: 'Extract insights from complex datasets', demandLevel: 'Very High' },
];

const INTERNSHIPS = [
  { id: '1', company: 'NASA Jet Propulsion Laboratory', role: 'Summer STEM Intern', location: 'Pasadena, CA', deadline: 'Feb 28, 2026', type: 'In-Person', stipend: '$6,500', description: 'Work on Mars rover data analysis with JPL engineers' },
  { id: '2', company: 'Microsoft TEALS', role: 'CS Education Intern', location: 'Remote', deadline: 'Mar 15, 2026', type: 'Remote', stipend: '$4,000', description: 'Help teach computer science in underserved high schools' },
  { id: '3', company: 'Argonne National Lab', role: 'Research Apprentice', location: 'Lemont, IL', deadline: 'Apr 1, 2026', type: 'In-Person', stipend: '$5,200', description: 'Join a materials science research team for 8 weeks' },
];

const SKILLS_DATA = [
  { skill: 'Python', level: 85 },
  { skill: 'Math', level: 92 },
  { skill: 'Physics', level: 78 },
  { skill: 'Robotics', level: 88 },
  { skill: 'ML/AI', level: 72 },
  { skill: 'Communication', level: 80 },
];

const RADAR_DATA = [
  { subject: 'STEM GPA', A: 95, fullMark: 100 },
  { subject: 'Test Scores', A: 88, fullMark: 100 },
  { subject: 'Extracurriculars', A: 92, fullMark: 100 },
  { subject: 'Leadership', A: 85, fullMark: 100 },
  { subject: 'Research', A: 70, fullMark: 100 },
  { subject: 'Community', A: 78, fullMark: 100 },
];

const MENTORS = [
  { id: '1', name: 'Dr. Sarah Chen', title: 'AI Research Scientist', org: 'Google DeepMind', avatar: 'SC', specialty: 'Machine Learning', nextSession: 'Mar 5, 2026', sessions: 6, rating: 4.9 },
  { id: '2', name: 'James Okonkwo', title: 'Robotics Engineer', org: 'Boston Dynamics', avatar: 'JO', specialty: 'Robotics & Controls', nextSession: 'Mar 8, 2026', sessions: 4, rating: 4.8 },
  { id: '3', name: 'Prof. Maria Santos', title: 'CS Department Chair', org: 'Georgia Tech', avatar: 'MS', specialty: 'College Admissions', nextSession: 'Mar 12, 2026', sessions: 3, rating: 5.0 },
  { id: '4', name: 'David Park', title: 'Senior Software Engineer', org: 'SpaceX', avatar: 'DP', specialty: 'Aerospace Software', nextSession: 'Mar 15, 2026', sessions: 2, rating: 4.7 },
];

const DEADLINES = [
  { id: '1', title: 'Georgia Tech EA Application', date: 'Oct 15, 2026', type: 'application', urgent: false },
  { id: '2', title: 'STEM Excellence Scholarship', date: 'Mar 15, 2026', type: 'scholarship', urgent: true },
  { id: '3', title: 'NASA JPL Internship Application', date: 'Feb 28, 2026', type: 'internship', urgent: true },
  { id: '4', title: 'MIT Early Action Deadline', date: 'Nov 1, 2026', type: 'application', urgent: false },
  { id: '5', title: 'SAT Registration (Fall)', date: 'Sep 5, 2026', type: 'test', urgent: false },
  { id: '6', title: 'Robotics Competition Regionals', date: 'Apr 12, 2026', type: 'event', urgent: false },
];

const UPCOMING_SESSIONS = [
  { id: '1', mentor: 'Dr. Sarah Chen', topic: 'AI Research Paper Review', date: 'Mar 5, 2026', time: '4:00 PM EST', type: 'Video Call' },
  { id: '2', mentor: 'James Okonkwo', topic: 'Robotics Portfolio Review', date: 'Mar 8, 2026', time: '3:30 PM EST', type: 'Video Call' },
  { id: '3', mentor: 'Prof. Maria Santos', topic: 'Georgia Tech Application Strategy', date: 'Mar 12, 2026', time: '5:00 PM EST', type: 'Video Call' },
];

const RESOURCE_LIBRARY = [
  { id: '1', title: 'College Essay Writing Guide', type: 'PDF', category: 'Applications', downloads: 1240 },
  { id: '2', title: 'STEM Scholarship Database', type: 'Spreadsheet', category: 'Financial Aid', downloads: 890 },
  { id: '3', title: 'Interview Prep Toolkit', type: 'Video Series', category: 'Career Prep', downloads: 2100 },
  { id: '4', title: 'AP Exam Study Plans', type: 'PDF', category: 'Academics', downloads: 3450 },
  { id: '5', title: 'Research Opportunity Guide', type: 'PDF', category: 'Research', downloads: 670 },
];

const QUICK_LINKS = [
  { label: 'College Matcher', path: '/students/college-matcher', icon: Search, description: 'Find your best-fit schools' },
  { label: 'Scholarship Finder', path: '/students/scholarship-matcher', icon: Award, description: 'Discover scholarship opportunities' },
  { label: 'Essay Coach', path: '/students/essay-coach', icon: Pencil, description: 'Get AI-powered essay feedback' },
];

const PROFILE_COMPLETION_ITEMS = [
  { label: 'Basic Information', complete: true },
  { label: 'Academic Records', complete: true },
  { label: 'Test Scores', complete: true },
  { label: 'Extracurriculars', complete: true },
  { label: 'Personal Essay', complete: false },
  { label: 'Recommendation Letters', complete: false },
  { label: 'Financial Information', complete: false },
  { label: 'Career Interests', complete: true },
];

// Pie chart colors
const PIE_COLORS = ['#7C3AED', '#EA580C', '#3B82F6', '#10B981'];

// ===========================================
// OVERVIEW TAB
// ===========================================

const OverviewTab: React.FC<{ onTabChange: (tab: TabKey) => void }> = ({ onTabChange }) => {
  const navigate = useNavigate();
  const completedItems = PROFILE_COMPLETION_ITEMS.filter(i => i.complete).length;
  const totalItems = PROFILE_COMPLETION_ITEMS.length;
  const completionPct = Math.round((completedItems / totalItems) * 100);

  const appStatusData = [
    { name: 'Submitted', value: 2 },
    { name: 'In Progress', value: 3 },
    { name: 'Not Started', value: 3 },
  ];

  const urgentDeadlines = DEADLINES.filter(d => d.urgent);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-violet-900/40 via-gray-900 to-orange-900/30 border border-gray-800 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-500/20">
              {STUDENT_PROFILE.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {STUDENT_PROFILE.name.split(' ')[0]}!</h2>
              <p className="text-gray-400 mt-1">
                Grade {STUDENT_PROFILE.grade} at {STUDENT_PROFILE.school} &middot; GPA {STUDENT_PROFILE.gpa} &middot; SAT {STUDENT_PROFILE.satScore}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {STUDENT_PROFILE.interests.map((interest, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-violet-500/20 text-violet-300 rounded-full text-xs font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Profile Completion Ring */}
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#1F2937" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="url(#progressGradient)" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${completionPct * 2.136} ${213.6 - completionPct * 2.136}`}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">{completionPct}%</span>
                <span className="text-[10px] text-gray-400">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Colleges Saved', value: '8', icon: Building2, color: 'violet', sub: '3 Reach, 3 Target, 2 Safety' },
          { label: 'Applications', value: '3', icon: FileText, color: 'orange', sub: '2 submitted, 1 in progress' },
          { label: 'Scholarships Found', value: '$42K', icon: DollarSign, color: 'emerald', sub: '5 opportunities matched' },
          { label: 'Mentor Sessions', value: '15', icon: Users, color: 'blue', sub: '4 active mentors' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.color === 'violet' ? 'bg-violet-500/20' :
                stat.color === 'orange' ? 'bg-orange-500/20' :
                stat.color === 'emerald' ? 'bg-emerald-500/20' :
                'bg-blue-500/20'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'violet' ? 'text-violet-400' :
                  stat.color === 'orange' ? 'text-orange-400' :
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  'text-blue-400'
                }`} />
              </div>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className={`text-sm mt-1 ${
              stat.color === 'violet' ? 'text-violet-400' :
              stat.color === 'orange' ? 'text-orange-400' :
              stat.color === 'emerald' ? 'text-emerald-400' :
              'text-blue-400'
            }`}>{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Profile Radar */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Action Cards */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {QUICK_LINKS.map((link, idx) => (
              <motion.div
                key={idx}
                onClick={() => navigate(link.path)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + 0.1 * idx }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-violet-500/50 hover:bg-gray-900/80 transition-all group cursor-pointer block"
              >
                <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-violet-500/30 transition-colors">
                  <link.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h4 className="font-semibold text-white mb-1">{link.label}</h4>
                <p className="text-sm text-gray-400">{link.description}</p>
                <div className="flex items-center gap-1 mt-3 text-violet-400 text-sm font-medium">
                  Launch <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* More Tools */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Virtual Tours', path: '/students/virtual-tours', icon: Video },
              { label: 'Interview Prep', path: '/students/interview-prep', icon: MessageSquare },
              { label: 'App Tracker', path: '/students/app-tracker', icon: FileCheck },
              { label: 'Career ROI', path: '/students/career-roi', icon: TrendingUp },
            ].map((tool, idx) => (
              <button
                key={idx}
                onClick={() => navigate(tool.path)}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors flex items-center gap-2.5 group text-left"
              >
                <tool.icon className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Strength Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-2">Profile Strength</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar name="Profile" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="text-center">
            <span className="text-sm text-gray-400">Overall Score: </span>
            <span className="text-sm font-bold text-violet-400">85/100</span>
          </div>
        </motion.div>
      </div>

      {/* Deadlines Timeline + Application Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Deadlines</h3>
            <button
              onClick={() => onTabChange('applications')}
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {DEADLINES.slice(0, 5).map((deadline, idx) => (
              <div key={deadline.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className={`w-1.5 h-10 rounded-full ${
                  deadline.urgent ? 'bg-orange-500' :
                  deadline.type === 'application' ? 'bg-violet-500' :
                  deadline.type === 'scholarship' ? 'bg-emerald-500' :
                  deadline.type === 'internship' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{deadline.title}</p>
                  <p className="text-xs text-gray-400">{deadline.date}</p>
                </div>
                {deadline.urgent && (
                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs font-medium shrink-0">
                    Urgent
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-xs capitalize shrink-0 ${
                  deadline.type === 'application' ? 'bg-violet-500/20 text-violet-400' :
                  deadline.type === 'scholarship' ? 'bg-emerald-500/20 text-emerald-400' :
                  deadline.type === 'internship' ? 'bg-blue-500/20 text-blue-400' :
                  deadline.type === 'test' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {deadline.type}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Application Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Application Status</h3>
            <button
              onClick={() => onTabChange('applications')}
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={appStatusData}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {appStatusData.map((_, idx) => (
                    <Cell key={idx} fill={['#10B981', '#7C3AED', '#374151'][idx]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {[
                { label: 'Submitted', value: 2, color: 'bg-emerald-500' },
                { label: 'In Progress', value: 3, color: 'bg-violet-500' },
                { label: 'Not Started', value: 3, color: 'bg-gray-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-400 flex-1">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Schools</span>
                  <span className="text-lg font-bold text-white">8</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ===========================================
// COLLEGE DISCOVERY TAB
// ===========================================

const CollegeDiscoveryTab: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');
  const filtered = filterType === 'all' ? COLLEGE_LIST : COLLEGE_LIST.filter(c => c.type === filterType);

  return (
    <div className="space-y-6">
      {/* Tool Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'College Matcher', description: 'AI-powered school matching', path: '/students/college-matcher', icon: Search, color: 'violet' },
          { label: 'Campus Culture', description: 'Explore campus vibes', path: '/students/campus-culture', icon: Heart, color: 'orange' },
          { label: 'Compare Schools', description: 'Side-by-side comparison', path: '/students/compare-schools', icon: BarChart3, color: 'blue' },
          { label: 'Virtual Tours', description: '360-degree campus tours', path: '/students/virtual-tours', icon: Video, color: 'emerald' },
        ].map((tool, idx) => (
          <motion.div
            key={idx}
            onClick={() => navigate(tool.path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-violet-500/50 transition-all group cursor-pointer block"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              tool.color === 'violet' ? 'bg-violet-500/20' :
              tool.color === 'orange' ? 'bg-orange-500/20' :
              tool.color === 'blue' ? 'bg-blue-500/20' :
              'bg-emerald-500/20'
            }`}>
              <tool.icon className={`w-5 h-5 ${
                tool.color === 'violet' ? 'text-violet-400' :
                tool.color === 'orange' ? 'text-orange-400' :
                tool.color === 'blue' ? 'text-blue-400' :
                'text-emerald-400'
              }`} />
            </div>
            <h4 className="font-semibold text-white mb-1">{tool.label}</h4>
            <p className="text-sm text-gray-400">{tool.description}</p>
            <div className="flex items-center gap-1 mt-3 text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Discovery Tools */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Major Explorer', path: '/students/major-explorer', icon: Compass },
          { label: 'Why School Essays', path: '/students/why-school', icon: Pencil },
          { label: 'Mock Review', path: '/students/mock-review', icon: FileCheck },
          { label: 'Research Writer', path: '/students/research-writer', icon: BookOpen },
          { label: 'Financial Fit', path: '/students/financial-fit', icon: DollarSign },
        ].map((tool, idx) => (
          <button
            key={idx}
            onClick={() => navigate(tool.path)}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors flex items-center gap-2.5 group text-left"
          >
            <tool.icon className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* College List Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">My College List</h3>
          <div className="flex items-center gap-2">
            {['all', 'Reach', 'Target', 'Safety'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === type
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">School</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Match</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Acceptance</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Tuition</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map((college) => (
                <tr key={college.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{college.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {college.location}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      college.type === 'Reach' ? 'bg-orange-500/20 text-orange-400' :
                      college.type === 'Target' ? 'bg-violet-500/20 text-violet-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {college.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-violet-500 h-1.5 rounded-full"
                          style={{ width: `${college.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-violet-400 font-medium">{college.matchScore}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-sm font-medium ${
                      college.acceptRate >= 60 ? 'text-emerald-400' :
                      college.acceptRate >= 40 ? 'text-amber-400' :
                      'text-orange-400'
                    }`}>
                      {college.acceptRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-300">{college.tuition}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      college.status === 'Submitted' ? 'bg-emerald-500/20 text-emerald-400' :
                      college.status === 'In Progress' ? 'bg-violet-500/20 text-violet-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {college.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// APPLICATIONS TAB
// ===========================================

const ApplicationsTab: React.FC = () => {
  const navigate = useNavigate();
  const submitted = COLLEGE_LIST.filter(c => c.status === 'Submitted');
  const inProgress = COLLEGE_LIST.filter(c => c.status === 'In Progress');
  const notStarted = COLLEGE_LIST.filter(c => c.status === 'Not Started');

  const getProgressPct = (college: typeof COLLEGE_LIST[0]): number => {
    if (college.status === 'Submitted') return 100;
    if (college.status === 'Not Started') return 0;
    const essayPct = college.essayStatus === 'Final' ? 40 : college.essayStatus === 'Review' ? 30 : college.essayStatus === 'Draft' ? 20 : 0;
    const recPct = (() => { const [have, need] = college.recLetters.split('/').map(Number); return (have / need) * 30; })();
    return Math.min(95, 25 + essayPct + recPct);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Submitted', value: submitted.length, color: 'emerald', icon: CheckCircle2 },
          { label: 'In Progress', value: inProgress.length, color: 'violet', icon: Clock },
          { label: 'Not Started', value: notStarted.length, color: 'gray', icon: AlertCircle },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${
                stat.color === 'emerald' ? 'text-emerald-400' :
                stat.color === 'violet' ? 'text-violet-400' :
                'text-gray-400'
              }`} />
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tool Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Application Tracker', path: '/students/app-tracker', icon: FileCheck },
          { label: 'Essay Coach', path: '/students/essay-coach', icon: Pencil },
          { label: 'Interview Prep', path: '/students/interview-prep', icon: MessageSquare },
          { label: 'Mock Review', path: '/students/mock-review', icon: FileText },
        ].map((tool, idx) => (
          <button
            key={idx}
            onClick={() => navigate(tool.path)}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-3.5 hover:border-violet-500/40 transition-colors flex items-center gap-3 group text-left"
          >
            <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
              <tool.icon className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Application Tracker Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Application Tracker</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">School</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Deadline</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Essay</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Rec Letters</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {COLLEGE_LIST.map((college) => {
                const progress = getProgressPct(college);
                return (
                  <tr key={college.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-white">{college.name}</p>
                      <p className="text-xs text-gray-500">{college.location}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        college.appType === 'EA' ? 'bg-blue-500/20 text-blue-400' :
                        college.appType === 'REA' ? 'bg-violet-500/20 text-violet-400' :
                        college.appType === 'ED' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {college.appType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-300">{college.deadline}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-medium ${
                        college.essayStatus === 'Submitted' ? 'text-emerald-400' :
                        college.essayStatus === 'Final' ? 'text-blue-400' :
                        college.essayStatus === 'Review' ? 'text-amber-400' :
                        college.essayStatus === 'Draft' ? 'text-violet-400' :
                        'text-gray-500'
                      }`}>
                        {college.essayStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-300">{college.recLetters}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2 min-w-[80px]">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              progress === 100 ? 'bg-emerald-500' :
                              progress >= 50 ? 'bg-violet-500' :
                              progress > 0 ? 'bg-orange-500' :
                              'bg-gray-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        college.status === 'Submitted' ? 'bg-emerald-500/20 text-emerald-400' :
                        college.status === 'In Progress' ? 'bg-violet-500/20 text-violet-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {college.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// FINANCIAL PLANNING TAB
// ===========================================

const FinancialPlanningTab: React.FC = () => {
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<typeof SCHOLARSHIPS[0] | null>(null);
  const [appliedNotification, setAppliedNotification] = useState(false);

  const handleApply = (scholarship: typeof SCHOLARSHIPS[0]) => {
    setSelectedScholarship(scholarship);
    setShowApplyModal(true);
  };

  const confirmApply = () => {
    setShowApplyModal(false);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Aid Potential', value: '$42,000', icon: DollarSign, color: 'emerald', sub: 'From 5 scholarships' },
          { label: 'FAFSA Status', value: 'Ready', icon: FileCheck, color: 'violet', sub: 'Opens Oct 1, 2026' },
          { label: 'Avg. Net Price', value: '$11,625', icon: TrendingUp, color: 'blue', sub: 'Across 8 schools' },
          { label: 'Scholarships Applied', value: '1 / 5', icon: Award, color: 'orange', sub: '4 still eligible' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.color === 'emerald' ? 'bg-emerald-500/20' :
                stat.color === 'violet' ? 'bg-violet-500/20' :
                stat.color === 'blue' ? 'bg-blue-500/20' :
                'bg-orange-500/20'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'violet' ? 'text-violet-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  'text-orange-400'
                }`} />
              </div>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Tool Links */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Scholarship Matcher', path: '/students/scholarship-matcher', icon: Award },
          { label: 'Net Price Calculator', path: '/students/net-price-calculator', icon: DollarSign },
          { label: 'Award Letter Analyzer', path: '/students/award-letter-analyzer', icon: FileText },
          { label: 'CSS Profile Help', path: '/students/css-profile', icon: FileCheck },
          { label: 'STEM Funding', path: '/students/stem-funding', icon: Sparkles },
        ].map((tool, idx) => (
          <button
            key={idx}
            onClick={() => navigate(tool.path)}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 hover:border-violet-500/40 transition-colors flex items-center gap-2.5 group text-left"
          >
            <tool.icon className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Aid by School Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Estimated Aid by School</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={AID_BY_SCHOOL} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="school" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#374151' }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#374151' }} tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="aid" name="Financial Aid" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              <Bar dataKey="net" name="Net Cost" fill="#EA580C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-violet-500" />
              <span className="text-xs text-gray-400">Financial Aid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500" />
              <span className="text-xs text-gray-400">Net Cost</span>
            </div>
          </div>
        </motion.div>

        {/* Scholarship Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Scholarship Matches</h3>
            <button
              onClick={() => navigate('/students/scholarship-matcher')}
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              Find More <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {SCHOLARSHIPS.map((s) => (
              <div key={s.id} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-medium text-white text-sm">{s.name}</h4>
                  <span className="text-emerald-400 font-semibold text-sm">{s.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{s.org}</span>
                    <span className="text-xs text-gray-500">Due: {s.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      s.match >= 95 ? 'text-emerald-400' : s.match >= 90 ? 'text-violet-400' : 'text-blue-400'
                    }`}>
                      {s.match}% match
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      s.status === 'Shortlisted' ? 'bg-emerald-500/20 text-emerald-400' :
                      s.status === 'Applied' ? 'bg-violet-500/20 text-violet-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {s.status}
                    </span>
                    {s.status !== 'Applied' && (
                      <button
                        onClick={() => handleApply(s)}
                        className="px-2.5 py-0.5 bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 rounded text-xs font-medium transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Financial Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">More Financial Tools</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Loan Payoff Modeler', description: 'Project your loan repayment timeline', path: '/students/loan-payoff', icon: TrendingUp, color: 'violet' },
            { label: 'Career ROI Calculator', description: 'Compare degree value vs. cost', path: '/students/career-roi', icon: Target, color: 'orange' },
            { label: 'Appeal Letter Writer', description: 'Draft financial aid appeal letters', path: '/students/appeal-letter', icon: Pencil, color: 'blue' },
          ].map((tool, idx) => (
            <button
              key={idx}
              onClick={() => navigate(tool.path)}
              className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors group text-left"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                tool.color === 'violet' ? 'bg-violet-500/20' :
                tool.color === 'orange' ? 'bg-orange-500/20' :
                'bg-blue-500/20'
              }`}>
                <tool.icon className={`w-5 h-5 ${
                  tool.color === 'violet' ? 'text-violet-400' :
                  tool.color === 'orange' ? 'text-orange-400' :
                  'text-blue-400'
                }`} />
              </div>
              <h4 className="font-medium text-white mb-1">{tool.label}</h4>
              <p className="text-sm text-gray-400">{tool.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Apply Scholarship Modal */}
      {showApplyModal && selectedScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowApplyModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Apply for Scholarship</h3>
            <p className="text-gray-400 text-sm mb-4">{selectedScholarship.name} &middot; {selectedScholarship.amount}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Why are you a strong candidate?</label>
                <textarea className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 h-24 resize-none focus:outline-none focus:border-violet-500" placeholder="Describe your qualifications and achievements..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Additional Materials</label>
                <div className="px-3 py-3 bg-gray-800 border border-dashed border-gray-700 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Drag and drop files or click to upload</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowApplyModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={confirmApply} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">Submit Application</button>
            </div>
          </div>
        </div>
      )}

      {/* Applied Notification */}
      {appliedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Application submitted successfully!</span>
        </div>
      )}
    </div>
  );
};

// ===========================================
// CAREER EXPLORER TAB
// ===========================================

const CareerExplorerTab: React.FC = () => {
  const navigate = useNavigate();
  const [showInternApplyModal, setShowInternApplyModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<typeof INTERNSHIPS[0] | null>(null);
  const [internAppliedNotification, setInternAppliedNotification] = useState(false);

  const handleInternApply = (intern: typeof INTERNSHIPS[0]) => {
    setSelectedInternship(intern);
    setShowInternApplyModal(true);
  };

  const confirmInternApply = () => {
    setShowInternApplyModal(false);
    setInternAppliedNotification(true);
    setTimeout(() => setInternAppliedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Career Pathways */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">STEM Career Pathways</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAREER_PATHWAYS.map((career, idx) => {
            const IconComp = career.icon;
            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    career.color === 'violet' ? 'bg-violet-500/20' :
                    career.color === 'orange' ? 'bg-orange-500/20' :
                    career.color === 'blue' ? 'bg-blue-500/20' :
                    career.color === 'emerald' ? 'bg-emerald-500/20' :
                    career.color === 'amber' ? 'bg-amber-500/20' :
                    'bg-pink-500/20'
                  }`}>
                    <IconComp className={`w-5 h-5 ${
                      career.color === 'violet' ? 'text-violet-400' :
                      career.color === 'orange' ? 'text-orange-400' :
                      career.color === 'blue' ? 'text-blue-400' :
                      career.color === 'emerald' ? 'text-emerald-400' :
                      career.color === 'amber' ? 'text-amber-400' :
                      'text-pink-400'
                    }`} />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    career.demandLevel === 'Very High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {career.demandLevel}
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-1">{career.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{career.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500">Salary Range</p>
                    <p className="text-sm font-semibold text-emerald-400">{career.salary}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Growth (10yr)</p>
                    <p className="text-sm font-semibold text-violet-400">{career.growth}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Skills Assessment */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Skills Assessment</h3>
          <div className="space-y-4">
            {SKILLS_DATA.map((skill, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-300">{skill.skill}</span>
                  <span className="text-sm font-medium text-violet-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-r from-violet-500 to-orange-500 h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Career Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Career Tools</h3>
          <div className="space-y-3">
            {[
              { label: 'Career ROI Calculator', description: 'Compare career paths by earning potential', path: '/students/career-roi', icon: Target },
              { label: 'Internship Finder', description: 'Browse STEM internships for HS students', path: '/students/internship-finder', icon: Briefcase },
              { label: 'Work-Based Learning', description: 'Find hands-on STEM experiences', path: '/students/work-based-learning', icon: Rocket },
              { label: 'Apprenticeship Pathways', description: 'Explore earn-while-you-learn options', path: '/students/apprenticeship-pathways', icon: GraduationCap },
            ].map((tool, idx) => (
              <button
                key={idx}
                onClick={() => navigate(tool.path)}
                className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors group w-full text-left"
              >
                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                  <tool.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{tool.label}</h4>
                  <p className="text-xs text-gray-400">{tool.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Internship Listings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Featured Internships</h3>
          <button
            onClick={() => navigate('/students/internship-finder')}
            className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            Browse All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {INTERNSHIPS.map((intern) => (
            <div key={intern.id} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  intern.type === 'Remote' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {intern.type}
                </span>
                <span className="text-xs text-gray-500">Due: {intern.deadline}</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">{intern.role}</h4>
              <p className="text-sm text-violet-400 mb-2">{intern.company}</p>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{intern.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {intern.location}
                </span>
                <span className="text-xs font-semibold text-emerald-400">{intern.stipend}</span>
              </div>
              <button
                onClick={() => handleInternApply(intern)}
                className="w-full mt-3 py-2 bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 rounded-lg text-xs font-medium transition-colors"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Apply Internship Modal */}
      {showInternApplyModal && selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowInternApplyModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Apply for Internship</h3>
            <p className="text-gray-400 text-sm mb-1">{selectedInternship.role}</p>
            <p className="text-violet-400 text-sm mb-4">{selectedInternship.company}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Why are you interested in this role?</label>
                <textarea className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 h-24 resize-none focus:outline-none focus:border-violet-500" placeholder="Share your motivation and relevant experience..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Resume / Portfolio Link</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" placeholder="https://..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowInternApplyModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={confirmInternApply} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">Submit Application</button>
            </div>
          </div>
        </div>
      )}

      {/* Applied Notification */}
      {internAppliedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Internship application submitted!</span>
        </div>
      )}
    </div>
  );
};

// ===========================================
// MENTORSHIP TAB
// ===========================================

const MentorshipTab: React.FC = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<typeof MENTORS[0] | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<typeof RESOURCE_LIBRARY[0] | null>(null);
  const [scheduledNotification, setScheduledNotification] = useState(false);
  const [messageSentNotification, setMessageSentNotification] = useState(false);

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    setShowScheduleModal(false);
    setScheduledNotification(true);
    setTimeout(() => setScheduledNotification(false), 3000);
  };

  const handleMessage = (mentor: typeof MENTORS[0]) => {
    setSelectedMentor(mentor);
    setShowMessageModal(true);
  };

  const confirmMessage = () => {
    setShowMessageModal(false);
    setMessageSentNotification(true);
    setTimeout(() => setMessageSentNotification(false), 3000);
  };

  const handleResourceClick = (resource: typeof RESOURCE_LIBRARY[0]) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Mentor Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Mentors', value: '4', icon: Users, color: 'violet' },
          { label: 'Total Sessions', value: '15', icon: Calendar, color: 'orange' },
          { label: 'Avg. Rating', value: '4.85', icon: Star, color: 'amber' },
          { label: 'Next Session', value: 'Mar 5', icon: Clock, color: 'blue' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.color === 'violet' ? 'bg-violet-500/20' :
                stat.color === 'orange' ? 'bg-orange-500/20' :
                stat.color === 'amber' ? 'bg-amber-500/20' :
                'bg-blue-500/20'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'violet' ? 'text-violet-400' :
                  stat.color === 'orange' ? 'text-orange-400' :
                  stat.color === 'amber' ? 'text-amber-400' :
                  'text-blue-400'
                }`} />
              </div>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Matched Mentors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Your Mentors</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {MENTORS.map((mentor) => (
            <div key={mentor.id} className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                  {mentor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">{mentor.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-amber-400">{mentor.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{mentor.title}</p>
                  <p className="text-xs text-violet-400">{mentor.org}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700">
                    <div>
                      <span className="text-xs text-gray-500">Specialty: </span>
                      <span className="text-xs text-gray-300">{mentor.specialty}</span>
                    </div>
                    <span className="text-xs text-gray-500">{mentor.sessions} sessions</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">Next: </span>
                      <span className="text-xs text-emerald-400">{mentor.nextSession}</span>
                    </div>
                    <button
                      onClick={() => handleMessage(mentor)}
                      className="px-3 py-1 bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Sessions + Resource Library */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {UPCOMING_SESSIONS.map((session) => (
              <div key={session.id} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white text-sm">{session.topic}</h4>
                  <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded text-xs">{session.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">with {session.mentor}</span>
                  <span className="text-xs text-gray-500">&middot;</span>
                  <span className="text-xs text-gray-400">{session.date}</span>
                  <span className="text-xs text-gray-500">&middot;</span>
                  <span className="text-xs text-emerald-400">{session.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSchedule} className="w-full mt-4 py-2.5 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
            Schedule New Session
          </button>
        </motion.div>

        {/* Resource Library */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Resource Library</h3>
          <div className="space-y-3">
            {RESOURCE_LIBRARY.map((resource) => (
              <div key={resource.id} onClick={() => handleResourceClick(resource)} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors cursor-pointer">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  resource.type === 'PDF' ? 'bg-orange-500/20' :
                  resource.type === 'Video Series' ? 'bg-violet-500/20' :
                  'bg-blue-500/20'
                }`}>
                  {resource.type === 'PDF' ? <FileText className="w-4 h-4 text-orange-400" /> :
                   resource.type === 'Video Series' ? <Video className="w-4 h-4 text-violet-400" /> :
                   <FileCheck className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{resource.title}</p>
                  <p className="text-xs text-gray-400">{resource.category} &middot; {resource.downloads.toLocaleString()} downloads</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Schedule New Session</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Select Mentor</label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500">
                  {MENTORS.map(m => (
                    <option key={m.id} value={m.id}>{m.name} - {m.specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Session Topic</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" placeholder="e.g., College application review..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Preferred Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Preferred Time</label>
                  <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500">
                    <option>3:00 PM</option>
                    <option>3:30 PM</option>
                    <option>4:00 PM</option>
                    <option>4:30 PM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Notes (optional)</label>
                <textarea className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 h-20 resize-none focus:outline-none focus:border-violet-500" placeholder="Any topics or questions you want to discuss..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={confirmSchedule} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">Schedule Session</button>
            </div>
          </div>
        </div>
      )}

      {/* Message Mentor Modal */}
      {showMessageModal && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowMessageModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-1">Message {selectedMentor.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{selectedMentor.title} at {selectedMentor.org}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Subject</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" placeholder="e.g., Question about research opportunities..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Message</label>
                <textarea className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 h-28 resize-none focus:outline-none focus:border-violet-500" placeholder="Write your message..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={confirmMessage} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">Send Message</button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Viewer Modal */}
      {showResourceModal && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowResourceModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">{selectedResource.title}</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded text-xs">{selectedResource.type}</span>
              <span className="text-xs text-gray-400">{selectedResource.category}</span>
              <span className="text-xs text-gray-500">{selectedResource.downloads.toLocaleString()} downloads</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-8 flex flex-col items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-sm text-gray-400 text-center">Preview available after download</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowResourceModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              <button onClick={() => setShowResourceModal(false)} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">Download {selectedResource.type}</button>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Notification */}
      {scheduledNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Session scheduled successfully!</span>
        </div>
      )}

      {/* Message Sent Notification */}
      {messageSentNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Message sent successfully!</span>
        </div>
      )}
    </div>
  );
};

// ===========================================
// SETTINGS TAB
// ===========================================

const SettingsTabContent: React.FC = () => {
  const [notifications, setNotifications] = useState({
    deadlineReminders: true,
    scholarshipAlerts: true,
    mentorMessages: true,
    weeklyDigest: false,
    smsAlerts: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showGPA: false,
    showTestScores: false,
    allowMentorContact: true,
  });

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddInterestModal, setShowAddInterestModal] = useState(false);
  const [showCompleteItemModal, setShowCompleteItemModal] = useState(false);
  const [selectedCompleteItem, setSelectedCompleteItem] = useState<string>('');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-violet-400" />
          Profile Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              {STUDENT_PROFILE.avatar}
            </div>
            <div>
              <h4 className="font-semibold text-white">{STUDENT_PROFILE.name}</h4>
              <p className="text-sm text-gray-400">Grade {STUDENT_PROFILE.grade} &middot; {STUDENT_PROFILE.school}</p>
            </div>
            <button onClick={() => setShowEditProfileModal(true)} className="ml-auto px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-lg text-sm hover:bg-violet-500/30 transition-colors">
              Edit Profile
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Full Name</label>
              <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                {STUDENT_PROFILE.name}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email</label>
              <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                alex.rivera@lincoln.edu
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Grade</label>
              <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                {STUDENT_PROFILE.grade}th Grade
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">GPA</label>
              <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                {STUDENT_PROFILE.gpa} / 4.0 (Unweighted)
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Interests</label>
            <div className="flex items-center gap-2">
              {STUDENT_PROFILE.interests.map((interest, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                  {interest}
                </span>
              ))}
              <button onClick={() => setShowAddInterestModal(true)} className="px-2.5 py-1 border border-dashed border-gray-600 text-gray-500 rounded-full text-xs hover:text-gray-300 hover:border-gray-400 transition-colors">
                + Add
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-400" />
          Notifications
        </h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => {
            const labels: Record<string, string> = {
              deadlineReminders: 'Deadline Reminders',
              scholarshipAlerts: 'New Scholarship Alerts',
              mentorMessages: 'Mentor Messages',
              weeklyDigest: 'Weekly Progress Digest',
              smsAlerts: 'SMS Alerts',
            };
            const descriptions: Record<string, string> = {
              deadlineReminders: 'Get notified 7, 3, and 1 day before deadlines',
              scholarshipAlerts: 'Receive alerts when new matching scholarships are found',
              mentorMessages: 'Notifications when mentors send messages',
              weeklyDigest: 'Weekly summary of your college prep progress',
              smsAlerts: 'Receive critical deadline alerts via SMS',
            };
            return (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-white">{labels[key]}</p>
                  <p className="text-xs text-gray-400">{descriptions[key]}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    value ? 'bg-violet-500' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    value ? 'left-[22px]' : 'left-0.5'
                  }`} />
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          Privacy
        </h3>
        <div className="space-y-4">
          {Object.entries(privacy).map(([key, value]) => {
            const labels: Record<string, string> = {
              profileVisible: 'Public Profile',
              showGPA: 'Show GPA to Colleges',
              showTestScores: 'Show Test Scores to Mentors',
              allowMentorContact: 'Allow Mentor Contact Requests',
            };
            const descriptions: Record<string, string> = {
              profileVisible: 'Make your profile visible to colleges and mentors',
              showGPA: 'Display your GPA on your college-facing profile',
              showTestScores: 'Allow mentors to see your standardized test scores',
              allowMentorContact: 'Let new mentors request to connect with you',
            };
            return (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-white">{labels[key]}</p>
                  <p className="text-xs text-gray-400">{descriptions[key]}</p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    value ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    value ? 'left-[22px]' : 'left-0.5'
                  }`} />
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-violet-400" />
          Profile Completion
        </h3>
        <div className="space-y-3">
          {PROFILE_COMPLETION_ITEMS.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {item.complete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-600 rounded-full shrink-0" />
              )}
              <span className={`text-sm ${item.complete ? 'text-gray-300' : 'text-gray-500'}`}>
                {item.label}
              </span>
              {!item.complete && (
                <button onClick={() => { setSelectedCompleteItem(item.label); setShowCompleteItemModal(true); }} className="ml-auto text-xs text-violet-400 hover:text-violet-300">
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEditProfileModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">First Name</label>
                  <input defaultValue="Alex" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Last Name</label>
                  <input defaultValue="Rivera" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Email</label>
                <input defaultValue="alex.rivera@lincoln.edu" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">School</label>
                  <input defaultValue="Lincoln STEM Academy" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Grade</label>
                  <select defaultValue="11" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500">
                    <option value="9">9th</option>
                    <option value="10">10th</option>
                    <option value="11">11th</option>
                    <option value="12">12th</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditProfileModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowEditProfileModal(false); handleSave(); }} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Interest Modal */}
      {showAddInterestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddInterestModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Add Interest</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-2">Select from popular STEM interests</label>
                <div className="flex flex-wrap gap-2">
                  {['Cybersecurity', 'Data Science', 'Quantum Computing', 'Biotech', 'Space Exploration', 'Environmental Science', 'Game Development', 'Nanotechnology'].map((interest, idx) => (
                    <button key={idx} onClick={() => { setShowAddInterestModal(false); handleSave(); }} className="px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-violet-500/50 hover:bg-violet-500/10 text-gray-300 rounded-full text-xs transition-colors">
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Or type a custom interest</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" placeholder="e.g., Computational Biology" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddInterestModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowAddInterestModal(false); handleSave(); }} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">Add Interest</button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Profile Item Modal */}
      {showCompleteItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCompleteItemModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Complete: {selectedCompleteItem}</h3>
            <p className="text-gray-400 text-sm mb-4">Fill in the required information to complete this section of your profile.</p>
            <div className="space-y-4">
              {selectedCompleteItem === 'Personal Essay' && (
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Upload your personal essay draft</label>
                  <div className="px-3 py-6 bg-gray-800 border border-dashed border-gray-700 rounded-lg text-center">
                    <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Drag and drop your essay file, or click to browse</p>
                  </div>
                </div>
              )}
              {selectedCompleteItem === 'Recommendation Letters' && (
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Add recommender email addresses</label>
                  <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500 mb-2" placeholder="teacher@school.edu" />
                  <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500 mb-2" placeholder="counselor@school.edu" />
                  <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500" placeholder="mentor@org.com" />
                </div>
              )}
              {selectedCompleteItem === 'Financial Information' && (
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Estimated household income range</label>
                  <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-violet-500">
                    <option>Prefer not to say</option>
                    <option>Under $30,000</option>
                    <option>$30,000 - $60,000</option>
                    <option>$60,000 - $100,000</option>
                    <option>$100,000 - $150,000</option>
                    <option>Over $150,000</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">This helps us match you with need-based scholarships. Your information is kept private.</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCompleteItemModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowCompleteItemModal(false); handleSave(); }} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Notification */}
      {savedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Changes saved successfully!</span>
        </div>
      )}
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const HighSchoolStudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Simulate loading for demo
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowProfileMenu(false);
    };
    if (showNotifications || showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showNotifications, showProfileMenu]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Ignore sign-out errors for demo
    }
    navigate('/demo');
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-orange-500 rounded-2xl animate-pulse" />
          <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 shrink-0`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
              SW
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h1 className="font-bold text-sm text-white truncate">STEMWorkforce</h1>
                <p className="text-xs text-gray-400">Student Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Info */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500/30 to-orange-500/30 rounded-lg flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                {STUDENT_PROFILE.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{STUDENT_PROFILE.name}</p>
                <p className="text-xs text-gray-400">Grade {STUDENT_PROFILE.grade} &middot; GPA {STUDENT_PROFILE.gpa}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title={sidebarCollapsed ? tab.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{tab.label}</span>}
                {!sidebarCollapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {TABS.find(t => t.key === activeTab)?.label || 'Overview'}
              </h2>
              <p className="text-sm text-gray-400">
                {activeTab === 'overview' && 'Your college journey at a glance'}
                {activeTab === 'college-discovery' && 'Find and compare your best-fit schools'}
                {activeTab === 'applications' && 'Track your college applications'}
                {activeTab === 'financial' && 'Scholarships, aid, and cost planning'}
                {activeTab === 'career' && 'Explore STEM career pathways'}
                {activeTab === 'mentorship' && 'Connect with mentors and access resources'}
                {activeTab === 'settings' && 'Manage your profile and preferences'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                  className="relative p-1"
                >
                  <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-gray-950" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-10 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50" onClick={e => e.stopPropagation()}>
                    <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                      <span className="text-xs text-violet-400">3 new</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {[
                        { title: 'STEM Excellence Scholarship deadline approaching', time: '2 hours ago', urgent: true },
                        { title: 'Dr. Sarah Chen confirmed your session on Mar 5', time: '5 hours ago', urgent: false },
                        { title: 'NASA JPL Internship deadline is tomorrow', time: '1 day ago', urgent: true },
                        { title: 'Your Georgia Tech essay was marked as Final', time: '2 days ago', urgent: false },
                        { title: 'New scholarship match: Robotics Achievement Award', time: '3 days ago', urgent: false },
                      ].map((notif, idx) => (
                        <div key={idx} className={`px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/50 cursor-pointer transition-colors ${idx < 3 ? 'bg-gray-800/20' : ''}`}>
                          <div className="flex items-start gap-2">
                            {notif.urgent && <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 shrink-0" />}
                            <div>
                              <p className={`text-sm ${idx < 3 ? 'text-white' : 'text-gray-400'}`}>{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-800">
                      <button onClick={() => { setShowNotifications(false); setActiveTab('applications'); }} className="text-xs text-violet-400 hover:text-violet-300 w-full text-center">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-px h-6 bg-gray-800" />
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-orange-500 rounded-md flex items-center justify-center text-[10px] font-bold">
                    AR
                  </div>
                  <span className="text-sm text-gray-300">{STUDENT_PROFILE.name}</span>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50" onClick={e => e.stopPropagation()}>
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-sm font-medium text-white">{STUDENT_PROFILE.name}</p>
                      <p className="text-xs text-gray-400">alex.rivera@lincoln.edu</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setShowProfileMenu(false); setActiveTab('settings'); }} className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-3 text-left">
                        <User className="w-4 h-4 text-gray-500" /> My Profile
                      </button>
                      <button onClick={() => { setShowProfileMenu(false); setActiveTab('settings'); }} className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-3 text-left">
                        <Settings className="w-4 h-4 text-gray-500" /> Settings
                      </button>
                      <button onClick={() => { setShowProfileMenu(false); navigate('/help'); }} className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-3 text-left">
                        <Globe className="w-4 h-4 text-gray-500" /> Help Center
                      </button>
                    </div>
                    <div className="border-t border-gray-800 py-1">
                      <button onClick={() => { setShowProfileMenu(false); handleSignOut(); }} className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3 text-left">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab onTabChange={setActiveTab} />}
          {activeTab === 'college-discovery' && <CollegeDiscoveryTab />}
          {activeTab === 'applications' && <ApplicationsTab />}
          {activeTab === 'financial' && <FinancialPlanningTab />}
          {activeTab === 'career' && <CareerExplorerTab />}
          {activeTab === 'mentorship' && <MentorshipTab />}
          {activeTab === 'settings' && <SettingsTabContent />}
        </div>
      </main>
    </div>
  );
};

export default HighSchoolStudentDashboard;
