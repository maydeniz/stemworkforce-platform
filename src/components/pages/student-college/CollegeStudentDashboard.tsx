// ===========================================
// College Student Dashboard
// Career Launch Hub for college students
// Links to 24 existing college tool pages
// ===========================================

// Static Tailwind color map
const collegeDashColors: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400' },
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Rocket,
  Briefcase,
  Code2,
  GraduationCap,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  Target,
  FileText,
  Star,
  MapPin,
  Building2,
  Zap,
  Eye,
  ArrowUpRight,
  BookOpen,
  Award,
  Shield,
  CheckCircle,
  Circle,
  AlertCircle,
  ExternalLink,
  Calendar,
  Search,
  Sparkles,
  DollarSign,
  BarChart3,
  Mic,
  Globe,
  Link2,
  Lock,
  Bell,
  User,
  Mail,
  Phone,
  Linkedin,
  Github,
  FlaskConical,
  PenTool,
  Brain,
  Layers,
  MessageSquare,
  Heart,
  Send,
  Upload,
  Download,
  BadgeCheck,
  Flame,
} from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { useNavigate, type NavigateFunction } from 'react-router-dom';

// ===========================================
// TYPES
// ===========================================

type TabKey = 'overview' | 'career' | 'internships' | 'skills' | 'research' | 'networking' | 'settings';

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
  { key: 'career', label: 'Career Launch', icon: Rocket },
  { key: 'internships', label: 'Internships & Jobs', icon: Briefcase, badge: 5 },
  { key: 'skills', label: 'Skills & Portfolio', icon: Code2 },
  { key: 'research', label: 'Research & Grad School', icon: GraduationCap },
  { key: 'networking', label: 'Networking', icon: Users, badge: 3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// ===========================================
// SAMPLE DATA
// ===========================================

const STUDENT = {
  name: 'Maya Chen',
  firstName: 'Maya',
  year: 'Junior',
  major: 'Computer Science',
  university: 'MIT',
  gpa: 3.7,
  interests: ['AI/ML', 'Distributed Systems'],
  avatar: 'MC',
  careerReadiness: 82,
  profileCompleteness: 91,
};

// Overview Tab Data
const CAREER_READINESS_DATA = [
  { subject: 'Technical Skills', score: 88, fullMark: 100 },
  { subject: 'Communication', score: 75, fullMark: 100 },
  { subject: 'Leadership', score: 70, fullMark: 100 },
  { subject: 'Networking', score: 65, fullMark: 100 },
  { subject: 'Domain Knowledge', score: 92, fullMark: 100 },
  { subject: 'Experience', score: 78, fullMark: 100 },
];

const UPCOMING_DEADLINES = [
  { title: 'Google STEP Internship', date: 'Mar 15, 2026', type: 'Application', urgent: true },
  { title: 'NSF GRFP Fellowship', date: 'Mar 22, 2026', type: 'Fellowship', urgent: true },
  { title: 'MIT Career Fair', date: 'Apr 3, 2026', type: 'Event', urgent: false },
  { title: 'AWS Certified ML Exam', date: 'Apr 18, 2026', type: 'Certification', urgent: false },
  { title: 'Summer Research Application', date: 'May 1, 2026', type: 'Research', urgent: false },
];

const JOB_MATCHES = [
  { title: 'ML Engineer Intern', company: 'Google DeepMind', location: 'Mountain View, CA', match: 96, salary: '$9,500/mo', logo: 'G' },
  { title: 'AI Research Intern', company: 'OpenAI', location: 'San Francisco, CA', match: 93, salary: '$10,000/mo', logo: 'O' },
  { title: 'Software Engineer Intern', company: 'Meta', location: 'Menlo Park, CA', match: 91, salary: '$9,200/mo', logo: 'M' },
];

// Career Launch Tab Data
const RESUME_SECTIONS = [
  { name: 'Contact Info', status: 'complete' as const, score: 100 },
  { name: 'Summary', status: 'complete' as const, score: 95 },
  { name: 'Experience', status: 'complete' as const, score: 90 },
  { name: 'Education', status: 'complete' as const, score: 100 },
  { name: 'Skills', status: 'needs_work' as const, score: 78 },
  { name: 'Projects', status: 'complete' as const, score: 88 },
];

const INTERVIEW_SESSIONS = [
  { type: 'Behavioral', completed: true, score: 88, date: 'Feb 15' },
  { type: 'System Design', completed: true, score: 72, date: 'Feb 22' },
  { type: 'Coding (Arrays)', completed: true, score: 95, date: 'Mar 1' },
  { type: 'ML Concepts', completed: false, score: null, date: 'Scheduled Mar 8' },
  { type: 'Final Mock', completed: false, score: null, date: 'Not scheduled' },
];

const SALARY_DATA = [
  { role: 'ML Engineer', entry: 145, mid: 195, senior: 280 },
  { role: 'SWE', entry: 130, mid: 175, senior: 250 },
  { role: 'Data Scientist', entry: 120, mid: 165, senior: 235 },
  { role: 'Research Eng', entry: 135, mid: 185, senior: 265 },
];

const OFFER_COMPARISONS = [
  { company: 'Google', base: 155000, bonus: 25000, stock: 80000, total: 260000, location: 'Mountain View, CA', wlb: 4.2 },
  { company: 'Meta', base: 148000, bonus: 20000, stock: 95000, total: 263000, location: 'Menlo Park, CA', wlb: 3.8 },
  { company: 'Apple', base: 160000, bonus: 30000, stock: 60000, total: 250000, location: 'Cupertino, CA', wlb: 4.0 },
];

const CAREER_ACTIVITY = [
  { action: 'Updated resume with ML project', time: '2 hours ago', icon: FileText },
  { action: 'Completed behavioral interview prep', time: '1 day ago', icon: Mic },
  { action: 'Received offer from Google', time: '3 days ago', icon: Star },
  { action: 'Applied to OpenAI Research Intern', time: '5 days ago', icon: Send },
  { action: 'Salary research for ML roles', time: '1 week ago', icon: DollarSign },
];

// Internships & Jobs Tab Data
const ACTIVE_APPLICATIONS = [
  { id: 1, title: 'ML Engineer Intern', company: 'Google DeepMind', status: 'Interview' as const, appliedDate: 'Feb 10', lastUpdate: 'Mar 1', stage: 4, totalStages: 5 },
  { id: 2, title: 'AI Research Intern', company: 'OpenAI', status: 'Assessment' as const, appliedDate: 'Feb 15', lastUpdate: 'Feb 28', stage: 3, totalStages: 5 },
  { id: 3, title: 'SWE Intern', company: 'Apple', status: 'Applied' as const, appliedDate: 'Feb 20', lastUpdate: 'Feb 20', stage: 1, totalStages: 5 },
  { id: 4, title: 'Data Science Intern', company: 'Netflix', status: 'Screening' as const, appliedDate: 'Feb 22', lastUpdate: 'Feb 27', stage: 2, totalStages: 5 },
  { id: 5, title: 'Quantum Computing Intern', company: 'IBM Research', status: 'Offered' as const, appliedDate: 'Jan 30', lastUpdate: 'Mar 2', stage: 5, totalStages: 5 },
];

const SAVED_OPPORTUNITIES = [
  { title: 'ML Infrastructure Engineer', company: 'Anthropic', location: 'San Francisco, CA', salary: '$10,500/mo', deadline: 'Mar 20' },
  { title: 'Research Scientist Intern', company: 'DeepMind', location: 'London, UK', salary: '$9,800/mo', deadline: 'Apr 1' },
  { title: 'Systems Engineer Intern', company: 'SpaceX', location: 'Hawthorne, CA', salary: '$8,500/mo', deadline: 'Mar 30' },
];

const AI_MATCHED_LISTINGS = [
  { title: 'ML Platform Engineer Intern', company: 'Databricks', match: 97, salary: '$9,800/mo', location: 'San Francisco, CA' },
  { title: 'Applied AI Researcher', company: 'Microsoft Research', match: 94, salary: '$10,200/mo', location: 'Redmond, WA' },
  { title: 'Deep Learning Intern', company: 'NVIDIA', match: 92, salary: '$9,000/mo', location: 'Santa Clara, CA' },
  { title: 'AI/ML Engineer Intern', company: 'Amazon (AGI)', match: 89, salary: '$9,600/mo', location: 'Seattle, WA' },
  { title: 'Distributed Systems Intern', company: 'Cloudflare', match: 86, salary: '$8,800/mo', location: 'Austin, TX' },
];

// Skills & Portfolio Tab Data
const SKILLS_RADAR_DATA = [
  { skill: 'Python', level: 92, fullMark: 100 },
  { skill: 'ML/Deep Learning', level: 78, fullMark: 100 },
  { skill: 'Cloud (AWS)', level: 55, fullMark: 100 },
  { skill: 'System Design', level: 65, fullMark: 100 },
  { skill: 'Data Structures', level: 90, fullMark: 100 },
  { skill: 'React/TypeScript', level: 70, fullMark: 100 },
  { skill: 'Docker/K8s', level: 48, fullMark: 100 },
  { skill: 'SQL/NoSQL', level: 72, fullMark: 100 },
];

const PORTFOLIO_PROJECTS = [
  {
    title: 'DistributedLLM - Federated Training Framework',
    description: 'Built a distributed training system for large language models across heterogeneous GPU clusters. Achieved 2.3x speedup over baseline.',
    tech: ['Python', 'PyTorch', 'NCCL', 'Ray'],
    stars: 234,
    link: 'github.com/mayachen/distributed-llm',
    status: 'Featured',
  },
  {
    title: 'Neural Architecture Search Engine',
    description: 'Automated NAS tool that discovers optimal architectures for edge deployment. Published at MIT CSAIL Undergrad Research Symposium.',
    tech: ['Python', 'TensorFlow', 'ONNX'],
    stars: 156,
    link: 'github.com/mayachen/nas-engine',
    status: 'Published',
  },
  {
    title: 'Real-time Anomaly Detection Pipeline',
    description: 'Stream processing pipeline for detecting anomalies in financial time series data using transformer-based models.',
    tech: ['Python', 'Kafka', 'Apache Flink', 'PostgreSQL'],
    stars: 89,
    link: 'github.com/mayachen/anomaly-detect',
    status: 'Active',
  },
];

const CERTIFICATIONS = [
  { name: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', status: 'In Progress' as const, progress: 68, targetDate: 'Apr 2026' },
  { name: 'Google Professional ML Engineer', issuer: 'Google Cloud', status: 'Completed' as const, progress: 100, earnedDate: 'Jan 2026' },
  { name: 'TensorFlow Developer Certificate', issuer: 'Google', status: 'Completed' as const, progress: 100, earnedDate: 'Nov 2025' },
  { name: 'Kubernetes Application Developer', issuer: 'CNCF', status: 'Planned' as const, progress: 0, targetDate: 'Jun 2026' },
];

const LEARNING_PATHS = [
  { name: 'Advanced Machine Learning', progress: 78, modules: 12, completed: 9, provider: 'Coursera' },
  { name: 'Distributed Systems Design', progress: 45, modules: 10, completed: 4, provider: 'MIT OCW' },
  { name: 'Cloud Architecture (AWS)', progress: 62, modules: 8, completed: 5, provider: 'AWS Training' },
  { name: 'MLOps & Production ML', progress: 30, modules: 15, completed: 4, provider: 'Google Cloud' },
];

// Research & Grad School Tab Data
const FELLOWSHIPS = [
  { name: 'NSF Graduate Research Fellowship', deadline: 'Mar 22, 2026', amount: '$37,000/yr + tuition', status: 'Drafting', match: 94 },
  { name: 'Hertz Fellowship', deadline: 'Apr 15, 2026', amount: '$38,000/yr + tuition', status: 'Not Started', match: 88 },
  { name: 'Microsoft Research PhD Fellowship', deadline: 'May 1, 2026', amount: '$42,000/yr', status: 'Not Started', match: 91 },
];

const FACULTY_MATCHES = [
  { name: 'Prof. Yann LeCun', university: 'NYU / Meta AI', research: 'Self-supervised Learning, Energy-based Models', match: 96 },
  { name: 'Prof. Percy Liang', university: 'Stanford', research: 'Foundation Models, NLP, Robustness', match: 93 },
  { name: 'Prof. Sasha Rush', university: 'Cornell', research: 'Efficient ML, NLP, Structured Prediction', match: 90 },
  { name: 'Prof. Chelsea Finn', university: 'Stanford', research: 'Meta-learning, Robotics, Few-shot Learning', match: 88 },
];

const SOP_PROGRESS = [
  { school: 'Stanford CS PhD', progress: 75, wordCount: 820, status: 'Drafting' },
  { school: 'MIT CSAIL PhD', progress: 90, wordCount: 950, status: 'Review' },
  { school: 'CMU ML PhD', progress: 40, wordCount: 450, status: 'Outline' },
];

const GRE_STATUS = {
  verbal: 165,
  quant: 170,
  writing: 5.0,
  testDate: 'Jan 15, 2026',
  percentileVerbal: 96,
  percentileQuant: 97,
};

// Networking Tab Data
const MENTOR_CONNECTIONS = [
  { name: 'Dr. Sarah Kim', title: 'Staff ML Engineer', company: 'Google DeepMind', status: 'Active', lastMeeting: 'Feb 28', nextMeeting: 'Mar 14', avatar: 'SK' },
  { name: 'James Rodriguez', title: 'Principal Engineer', company: 'Meta AI', status: 'Active', lastMeeting: 'Feb 20', nextMeeting: 'Mar 7', avatar: 'JR' },
  { name: 'Prof. Elena Voronova', title: 'Associate Professor', company: 'MIT CSAIL', status: 'Active', lastMeeting: 'Mar 1', nextMeeting: 'Mar 15', avatar: 'EV' },
];

const UPCOMING_EVENTS = [
  { name: 'MIT AI Research Symposium', date: 'Mar 12, 2026', type: 'Conference', location: 'Cambridge, MA', registered: true },
  { name: 'Google Developer Summit', date: 'Mar 22, 2026', type: 'Tech Talk', location: 'Virtual', registered: true },
  { name: 'Women in STEM Career Fair', date: 'Apr 5, 2026', type: 'Career Fair', location: 'Boston, MA', registered: false },
];

const NETWORK_GROWTH = [
  { month: 'Sep', connections: 42 },
  { month: 'Oct', connections: 58 },
  { month: 'Nov', connections: 73 },
  { month: 'Dec', connections: 89 },
  { month: 'Jan', connections: 112 },
  { month: 'Feb', connections: 134 },
  { month: 'Mar', connections: 156 },
];

const ALUMNI_CONNECTIONS = [
  { name: 'Alex Park', graduationYear: 2023, company: 'Google', role: 'ML Engineer', connected: true },
  { name: 'Priya Nair', graduationYear: 2022, company: 'OpenAI', role: 'Research Scientist', connected: true },
  { name: 'Marcus Johnson', graduationYear: 2024, company: 'Apple', role: 'SWE', connected: false },
  { name: 'Wei Zhang', graduationYear: 2021, company: 'Meta', role: 'Tech Lead', connected: true },
  { name: 'Rachel Torres', graduationYear: 2023, company: 'Anthropic', role: 'AI Safety Researcher', connected: false },
];

// Color palette
const COLORS = {
  indigo: '#6366F1',
  cyan: '#22D3EE',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  violet: '#8B5CF6',
  blue: '#3B82F6',
  pink: '#EC4899',
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#1F2937',
  border: '1px solid #374151',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '12px',
};

// ===========================================
// QUICK LINKS TO 24 COLLEGE PAGES
// ===========================================

const COLLEGE_QUICK_LINKS = [
  { label: 'Career Launch Hub', path: '/college/career-launch', icon: Rocket },
  { label: 'Internship Finder', path: '/college/internships', icon: Briefcase },
  { label: 'Resume Builder', path: '/college/resume-builder', icon: FileText },
  { label: 'Interview Prep', path: '/college/interview-prep', icon: Mic },
  { label: 'Salary Negotiation', path: '/college/salary-negotiation', icon: DollarSign },
  { label: 'Offer Comparison', path: '/college/offer-comparison', icon: BarChart3 },
  { label: 'Skills Assessment', path: '/college/skills-assessment', icon: Target },
  { label: 'Technical Portfolio', path: '/college/portfolio', icon: Code2 },
  { label: 'Networking Hub', path: '/college/networking', icon: Globe },
  { label: 'Mentorship', path: '/college/mentorship', icon: Users },
  { label: 'Events Calendar', path: '/college/events', icon: Calendar },
  { label: 'Professional Dev', path: '/college/professional-development', icon: TrendingUp },
  { label: 'Research Opportunities', path: '/college/research', icon: FlaskConical },
  { label: 'Graduate School Prep', path: '/college/grad-school', icon: GraduationCap },
  { label: 'Fellowship Finder', path: '/college/fellowships', icon: Award },
  { label: 'Faculty Match', path: '/college/faculty-match', icon: BookOpen },
  { label: 'SOP Coach', path: '/college/sop-coach', icon: PenTool },
  { label: 'PhD Decision Tool', path: '/college/phd-decision', icon: Brain },
  { label: 'Clearance Guide', path: '/college/clearance-guide', icon: Shield },
  { label: 'Government Careers', path: '/college/government-careers', icon: Building2 },
  { label: 'Budget Planner', path: '/college/budget-planner', icon: DollarSign },
  { label: 'Loan Strategy', path: '/college/loan-strategy', icon: Layers },
  { label: 'Grad Funding', path: '/college/grad-funding', icon: Award },
  { label: 'Relocation Calc', path: '/college/relocation-calculator', icon: MapPin },
];

// ===========================================
// HELPER COMPONENTS
// ===========================================

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Interview: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    Assessment: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Screening: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Offered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Rejected: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    Active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'In Progress': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    Planned: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    Drafting: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Review: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Outline: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    'Not Started': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    Featured: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    Published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {status}
    </span>
  );
};

const ProgressBar: React.FC<{ value: number; color?: string; height?: string }> = ({ value, color = 'bg-indigo-500', height = 'h-2' }) => (
  <div className={`w-full bg-gray-800 rounded-full ${height} overflow-hidden`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(value, 100)}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`${color} ${height} rounded-full`}
    />
  </div>
);

const CardWrapper: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`bg-gray-900 border border-gray-800 rounded-xl ${className}`}
  >
    {children}
  </motion.div>
);

// ===========================================
// TAB: OVERVIEW
// ===========================================

const OverviewTab: React.FC<{ onTabChange: (tab: TabKey) => void; navigate: NavigateFunction }> = ({ onTabChange, navigate }) => {
  const [showDeadlineModal, setShowDeadlineModal] = useState<typeof UPCOMING_DEADLINES[0] | null>(null);
  const [showMatchModal, setShowMatchModal] = useState<typeof JOB_MATCHES[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <CardWrapper delay={0}>
        <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-cyan-500/5 to-transparent rounded-xl border border-indigo-500/20">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {STUDENT.firstName}!</h1>
              <p className="text-gray-400 mb-3">
                {STUDENT.year}, {STUDENT.major} @ {STUDENT.university} &middot; GPA {STUDENT.gpa}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-indigo-400 flex items-center gap-1"><Sparkles className="w-4 h-4" /> Interests: {STUDENT.interests.join(', ')}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Career Readiness</div>
              <div className="text-4xl font-bold text-indigo-400">{STUDENT.careerReadiness}<span className="text-lg text-gray-500">/100</span></div>
              <div className="text-xs text-emerald-400 flex items-center gap-1 justify-end mt-1">
                <TrendingUp className="w-3 h-3" /> +7 this month
              </div>
            </div>
          </div>
        </div>
      </CardWrapper>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Applications', value: '5', icon: Briefcase, color: 'indigo', subtext: '2 interviews this week' },
          { label: 'Profile Views', value: '248', icon: Eye, color: 'cyan', subtext: '+32% this month' },
          { label: 'Skills Assessed', value: '8', icon: Target, color: 'emerald', subtext: '3 advanced level' },
          { label: 'Network', value: '156', icon: Users, color: 'violet', subtext: '12 mentor sessions' },
        ].map((stat, i) => (
          <CardWrapper key={i} delay={0.1 + i * 0.05} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${collegeDashColors[stat.color]?.bg || 'bg-slate-500/20'} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${collegeDashColors[stat.color]?.text || 'text-slate-400'}`} />
              </div>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className={`text-xs ${collegeDashColors[stat.color]?.text || 'text-slate-400'} mt-1`}>{stat.subtext}</div>
          </CardWrapper>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <CardWrapper delay={0.3} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Upcoming Deadlines
            </h3>
            <span className="text-xs text-gray-500">{UPCOMING_DEADLINES.length} items</span>
          </div>
          <div className="space-y-3">
            {UPCOMING_DEADLINES.map((item, i) => (
              <div key={i} onClick={() => setShowDeadlineModal(item)} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  {item.urgent ? (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.type}</div>
                  </div>
                </div>
                <span className={`text-xs font-medium ${item.urgent ? 'text-amber-400' : 'text-gray-400'}`}>{item.date}</span>
              </div>
            ))}
          </div>
        </CardWrapper>

        {/* Job/Internship Matches */}
        <CardWrapper delay={0.35} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" /> Top Matches
            </h3>
            <button onClick={() => onTabChange('internships')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {JOB_MATCHES.map((job, i) => (
              <div key={i} onClick={() => setShowMatchModal(job)} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {job.logo}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.company} &middot; {job.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">{job.match}%</div>
                  <div className="text-xs text-gray-500">{job.salary}</div>
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* Skill Gap Radar + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Analysis Radar */}
        <CardWrapper delay={0.4} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" /> Skill Gap Analysis
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={CAREER_READINESS_DATA}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke={COLORS.indigo} fill={COLORS.indigo} fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </CardWrapper>

        {/* Quick Links Grid */}
        <CardWrapper delay={0.45} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-400" /> Quick Links
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {COLLEGE_QUICK_LINKS.slice(0, 12).map((link, i) => (
              <button
                key={i}
                onClick={() => navigate(link.path)}
                className="flex flex-col items-center gap-1.5 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
              >
                <link.icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-white text-center leading-tight transition-colors">{link.label}</span>
              </button>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* Deadline Detail Modal */}
      {showDeadlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeadlineModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {showDeadlineModal.urgent && <AlertCircle className="w-5 h-5 text-amber-400" />}
              {showDeadlineModal.title}
            </h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Type</span>
                <span className="text-sm text-white font-medium">{showDeadlineModal.type}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Deadline</span>
                <span className={`text-sm font-medium ${showDeadlineModal.urgent ? 'text-amber-400' : 'text-white'}`}>{showDeadlineModal.date}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Status</span>
                <span className="text-sm text-cyan-400 font-medium">{showDeadlineModal.urgent ? 'Urgent - Action Required' : 'Upcoming'}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeadlineModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowDeadlineModal(null); onTabChange('internships'); }} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">View Application</button>
            </div>
          </div>
        </div>
      )}

      {/* Job Match Detail Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowMatchModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-lg">
                {showMatchModal.logo}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{showMatchModal.title}</h3>
                <p className="text-sm text-gray-400">{showMatchModal.company}</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Location</span>
                <span className="text-sm text-white">{showMatchModal.location}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Compensation</span>
                <span className="text-sm text-emerald-400 font-medium">{showMatchModal.salary}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Match Score</span>
                <span className="text-sm text-indigo-400 font-bold">{showMatchModal.match}%</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowMatchModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowMatchModal(null); onTabChange('internships'); }} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Apply Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: CAREER LAUNCH
// ===========================================

const CareerLaunchTab: React.FC<{ navigate: NavigateFunction }> = ({ navigate }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [_showOfferDetail, _setShowOfferDetail] = useState<typeof OFFER_COMPARISONS[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Career Launch</h2>
          <p className="text-sm text-gray-400 mt-1">Resume, interviews, salary data, and offer comparison tools</p>
        </div>
        <button onClick={() => navigate('/college/career-launch')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
          <ExternalLink className="w-4 h-4" /> Open Career Launch Hub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Builder Preview */}
        <CardWrapper delay={0.1} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Resume Builder
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">ATS Score:</span>
              <span className="text-lg font-bold text-emerald-400">88<span className="text-sm text-gray-500">/100</span></span>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {RESUME_SECTIONS.map((section, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {section.status === 'complete' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-sm text-gray-300">{section.name}</span>
                </div>
                <div className="flex items-center gap-3 w-32">
                  <ProgressBar value={section.score} color={section.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'} height="h-1.5" />
                  <span className="text-xs text-gray-500 w-8 text-right">{section.score}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/college/resume-builder')} className="flex-1 px-3 py-2 bg-indigo-600/20 text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-600/30 transition-colors">
              Edit Resume
            </button>
            <button onClick={() => setShowExportModal(true)} className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 inline mr-1" /> Export PDF
            </button>
          </div>
        </CardWrapper>

        {/* Interview Prep Status */}
        <CardWrapper delay={0.15} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyan-400" /> Interview Prep
            </h3>
            <span className="text-sm text-gray-400">3/5 completed</span>
          </div>
          <div className="space-y-3">
            {INTERVIEW_SESSIONS.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {session.completed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-white">{session.type}</div>
                    <div className="text-xs text-gray-500">{session.date}</div>
                  </div>
                </div>
                {session.score !== null ? (
                  <span className={`text-sm font-bold ${session.score >= 85 ? 'text-emerald-400' : session.score >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {session.score}/100
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">Pending</span>
                )}
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* Salary Negotiation Data */}
      <CardWrapper delay={0.2} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Salary Data by Role ($K)
          </h3>
          <span className="text-xs text-gray-500">Source: BLS + employer data</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={SALARY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="role" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(value: number) => [`$${value}K`, '']} />
            <Bar dataKey="entry" name="Entry-Level" fill={COLORS.indigo} radius={[4, 4, 0, 0]} />
            <Bar dataKey="mid" name="Mid-Level" fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
            <Bar dataKey="senior" name="Senior" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offer Comparison Tool */}
        <CardWrapper delay={0.25} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" /> Offer Comparison
            </h3>
            <button onClick={() => navigate('/college/offer-comparison')} className="text-xs text-indigo-400 hover:text-indigo-300">Full Comparison Tool</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs">
                  <th className="text-left pb-3 font-medium">Company</th>
                  <th className="text-right pb-3 font-medium">Base</th>
                  <th className="text-right pb-3 font-medium">Stock</th>
                  <th className="text-right pb-3 font-medium">Total Comp</th>
                  <th className="text-right pb-3 font-medium">WLB</th>
                </tr>
              </thead>
              <tbody>
                {OFFER_COMPARISONS.map((offer, i) => (
                  <tr key={i} className="border-t border-gray-800">
                    <td className="py-3">
                      <div className="font-medium text-white">{offer.company}</div>
                      <div className="text-xs text-gray-500">{offer.location}</div>
                    </td>
                    <td className="text-right text-gray-300">${(offer.base / 1000).toFixed(0)}K</td>
                    <td className="text-right text-gray-300">${(offer.stock / 1000).toFixed(0)}K</td>
                    <td className="text-right font-bold text-indigo-400">${(offer.total / 1000).toFixed(0)}K</td>
                    <td className="text-right">
                      <span className="text-amber-400">{offer.wlb}</span>
                      <span className="text-gray-600">/5</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardWrapper>

        {/* Recent Activity */}
        <CardWrapper delay={0.3} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {CAREER_ACTIVITY.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <activity.icon className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">{activity.action}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* Export PDF Confirmation Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowExportModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-400" /> Export Resume
            </h3>
            <p className="text-gray-400 text-sm mb-4">Your resume will be exported as a professionally formatted PDF document.</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Format</span>
                <span className="text-sm text-white">PDF (ATS-Optimized)</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">ATS Score</span>
                <span className="text-sm text-emerald-400 font-medium">88/100</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">File Size</span>
                <span className="text-sm text-white">~142 KB</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: INTERNSHIPS & JOBS
// ===========================================

const InternshipsTab: React.FC<{ navigate: NavigateFunction }> = ({ navigate }) => {
  const [appFilter, setAppFilter] = useState<string>('all');
  const [showApplyModal, setShowApplyModal] = useState<typeof AI_MATCHED_LISTINGS[0] | null>(null);
  const [showAppDetail, setShowAppDetail] = useState<typeof ACTIVE_APPLICATIONS[0] | null>(null);
  const [showOppDetail, setShowOppDetail] = useState<typeof SAVED_OPPORTUNITIES[0] | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const filteredApps = appFilter === 'all'
    ? ACTIVE_APPLICATIONS
    : ACTIVE_APPLICATIONS.filter(a => a.status.toLowerCase() === appFilter);

  const statusColors: Record<string, string> = {
    Interview: '#6366F1',
    Assessment: '#F59E0B',
    Applied: '#3B82F6',
    Screening: '#22D3EE',
    Offered: '#10B981',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Internships & Jobs</h2>
          <p className="text-sm text-gray-400 mt-1">Track applications, discover opportunities, and check clearance eligibility</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Clearance Eligible</span>
          </div>
        </div>
      </div>

      {/* Active Applications */}
      <CardWrapper delay={0.1} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" /> Active Applications
          </h3>
          <div className="flex gap-2">
            {['all', 'interview', 'offered'].map((filter) => (
              <button
                key={filter}
                onClick={() => setAppFilter(filter)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  appFilter === filter
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div key={app.id} onClick={() => setShowAppDetail(app)} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: statusColors[app.status] || '#6B7280' }}
                />
                <div>
                  <div className="text-sm font-medium text-white">{app.title}</div>
                  <div className="text-xs text-gray-500">{app.company} &middot; Applied {app.appliedDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Stage Progress */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: app.totalStages }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-1.5 rounded-full ${i < app.stage ? 'bg-indigo-500' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      </CardWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Opportunities */}
        <CardWrapper delay={0.2} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" /> Saved Opportunities
            </h3>
            <span className="text-xs text-gray-500">{SAVED_OPPORTUNITIES.length} saved</span>
          </div>
          <div className="space-y-3">
            {SAVED_OPPORTUNITIES.map((opp, i) => (
              <div key={i} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{opp.title}</div>
                    <div className="text-xs text-gray-500">{opp.company} &middot; {opp.location}</div>
                  </div>
                  <button onClick={() => setShowOppDetail(opp)} className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-emerald-400">{opp.salary}</span>
                  <span className="text-xs text-amber-400">Deadline: {opp.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>

        {/* AI-Matched Listings */}
        <CardWrapper delay={0.25} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> AI-Matched Listings
            </h3>
            <span className="text-xs text-gray-500">Based on your profile</span>
          </div>
          <div className="space-y-3">
            {AI_MATCHED_LISTINGS.map((listing, i) => (
              <div key={i} onClick={() => setShowApplyModal(listing)} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-white">{listing.title}</div>
                  <div className="text-xs text-gray-500">{listing.company} &middot; {listing.location}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    listing.match >= 95 ? 'text-emerald-400' : listing.match >= 90 ? 'text-indigo-400' : 'text-cyan-400'
                  }`}>
                    {listing.match}%
                  </div>
                  <div className="text-xs text-gray-500">{listing.salary}</div>
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* Application Detail Modal */}
      {showAppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAppDetail(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">{showAppDetail.title}</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Company</span>
                <span className="text-sm text-white font-medium">{showAppDetail.company}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Status</span>
                <StatusBadge status={showAppDetail.status} />
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Applied</span>
                <span className="text-sm text-white">{showAppDetail.appliedDate}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Last Update</span>
                <span className="text-sm text-white">{showAppDetail.lastUpdate}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-indigo-400 font-medium">Stage {showAppDetail.stage} of {showAppDetail.totalStages}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAppDetail(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowAppDetail(null); navigate('/college/internships'); }} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Track in Finder</button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setShowApplyModal(null); setApplySuccess(false); }}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            {!applySuccess ? (
              <>
                <h3 className="text-xl font-bold text-white mb-4">Apply to {showApplyModal.company}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-400">Position</span>
                    <span className="text-sm text-white font-medium">{showApplyModal.title}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-400">Location</span>
                    <span className="text-sm text-white">{showApplyModal.location}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-400">Salary</span>
                    <span className="text-sm text-emerald-400">{showApplyModal.salary}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-400">Match Score</span>
                    <span className="text-sm text-indigo-400 font-bold">{showApplyModal.match}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">Your resume and profile will be submitted with this application.</p>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => { setShowApplyModal(null); setApplySuccess(false); }} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button onClick={() => setApplySuccess(true)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2">
                    <Send className="w-4 h-4" /> Submit Application
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-sm text-gray-400 mb-6">Your application to {showApplyModal.company} has been submitted successfully. You can track it in your applications.</p>
                <button onClick={() => { setShowApplyModal(null); setApplySuccess(false); }} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Opportunity Detail Modal */}
      {showOppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowOppDetail(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">{showOppDetail.title}</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Company</span>
                <span className="text-sm text-white font-medium">{showOppDetail.company}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Location</span>
                <span className="text-sm text-white">{showOppDetail.location}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Compensation</span>
                <span className="text-sm text-emerald-400 font-medium">{showOppDetail.salary}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Deadline</span>
                <span className="text-sm text-amber-400 font-medium">{showOppDetail.deadline}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowOppDetail(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => setShowOppDetail(null)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2">
                <Send className="w-4 h-4" /> Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: SKILLS & PORTFOLIO
// ===========================================

const SkillsTab: React.FC<{ navigate: NavigateFunction }> = ({ navigate }) => {
  const [showProjectModal, setShowProjectModal] = useState<typeof PORTFOLIO_PROJECTS[0] | null>(null);

  const skillLevelLabel = (level: number) => {
    if (level >= 85) return { text: 'Advanced', color: 'text-emerald-400' };
    if (level >= 65) return { text: 'Intermediate', color: 'text-cyan-400' };
    if (level >= 45) return { text: 'Beginner', color: 'text-amber-400' };
    return { text: 'Novice', color: 'text-gray-400' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Skills & Portfolio</h2>
        <p className="text-sm text-gray-400 mt-1">Track your technical growth, projects, and certifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Assessment Radar */}
        <CardWrapper delay={0.1} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" /> Skills Assessment
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={SKILLS_RADAR_DATA}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Radar name="Level" dataKey="level" stroke={COLORS.cyan} fill={COLORS.cyan} fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {SKILLS_RADAR_DATA.map((skill, i) => {
              const label = skillLevelLabel(skill.level);
              return (
                <div key={i} className="flex items-center justify-between text-xs px-2 py-1.5 bg-gray-800/50 rounded">
                  <span className="text-gray-400">{skill.skill}</span>
                  <span className={`font-medium ${label.color}`}>{label.text}</span>
                </div>
              );
            })}
          </div>
        </CardWrapper>

        {/* Technical Portfolio */}
        <CardWrapper delay={0.15} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" /> Technical Portfolio
            </h3>
            <span className="text-xs text-gray-500">{PORTFOLIO_PROJECTS.length} projects</span>
          </div>
          <div className="space-y-4">
            {PORTFOLIO_PROJECTS.map((project, i) => (
              <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">{project.title}</h4>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3 h-3 fill-amber-400" /> {project.stars}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((t, j) => (
                      <span key={j} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">{t}</span>
                    ))}
                  </div>
                  <button onClick={() => setShowProjectModal(project)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <Github className="w-3 h-3" /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certifications Tracker */}
        <CardWrapper delay={0.2} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Certifications
          </h3>
          <div className="space-y-4">
            {CERTIFICATIONS.map((cert, i) => (
              <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-white">{cert.name}</div>
                    <div className="text-xs text-gray-500">{cert.issuer}</div>
                  </div>
                  <StatusBadge status={cert.status} />
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar
                    value={cert.progress}
                    color={cert.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}
                    height="h-1.5"
                  />
                  <span className="text-xs text-gray-500 w-10 text-right">{cert.progress}%</span>
                </div>
                {cert.status === 'Completed' && (
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Earned {cert.earnedDate}
                  </div>
                )}
                {cert.status !== 'Completed' && cert.targetDate && (
                  <div className="text-xs text-gray-500 mt-2">Target: {cert.targetDate}</div>
                )}
              </div>
            ))}
          </div>
        </CardWrapper>

        {/* Learning Paths */}
        <CardWrapper delay={0.25} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" /> Learning Paths
          </h3>
          <div className="space-y-4">
            {LEARNING_PATHS.map((path, i) => (
              <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-white">{path.name}</div>
                    <div className="text-xs text-gray-500">{path.provider} &middot; {path.completed}/{path.modules} modules</div>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">{path.progress}%</span>
                </div>
                <ProgressBar
                  value={path.progress}
                  color={path.progress >= 75 ? 'bg-emerald-500' : path.progress >= 50 ? 'bg-cyan-500' : 'bg-indigo-500'}
                  height="h-2"
                />
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* Project Detail Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowProjectModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-white">{showProjectModal.title}</h3>
              <StatusBadge status={showProjectModal.status} />
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-sm mb-4">
              <Star className="w-4 h-4 fill-amber-400" /> {showProjectModal.stars} stars
            </div>
            <p className="text-sm text-gray-400 mb-4">{showProjectModal.description}</p>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Technologies</div>
              <div className="flex flex-wrap gap-2">
                {showProjectModal.tech.map((t, j) => (
                  <span key={j} className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg mb-4">
              <span className="text-sm text-gray-400">Repository</span>
              <span className="text-sm text-indigo-400">{showProjectModal.link}</span>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowProjectModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowProjectModal(null); navigate('/college/portfolio'); }} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Edit in Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: RESEARCH & GRAD SCHOOL
// ===========================================

const ResearchTab: React.FC<{ navigate: NavigateFunction }> = ({ navigate }) => {
  const [showFellowshipModal, setShowFellowshipModal] = useState<typeof FELLOWSHIPS[0] | null>(null);
  const [showFacultyModal, setShowFacultyModal] = useState<typeof FACULTY_MATCHES[0] | null>(null);

  const phdFactors = [
    { factor: 'Research Interest', score: 95, weight: 'High' },
    { factor: 'Financial Readiness', score: 72, weight: 'Medium' },
    { factor: 'Career Alignment', score: 88, weight: 'High' },
    { factor: 'Personal Readiness', score: 80, weight: 'Medium' },
    { factor: 'Program Fit', score: 91, weight: 'High' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Research & Grad School</h2>
        <p className="text-sm text-gray-400 mt-1">Fellowships, faculty matching, SOP writing, and PhD prep tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fellowship Finder */}
        <CardWrapper delay={0.1} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Fellowship Finder
            </h3>
            <button onClick={() => navigate('/college/fellowships')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Browse All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {FELLOWSHIPS.map((fellowship, i) => (
              <div key={i} onClick={() => setShowFellowshipModal(fellowship)} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-white">{fellowship.name}</div>
                    <div className="text-xs text-emerald-400 mt-0.5">{fellowship.amount}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-indigo-400">{fellowship.match}%</div>
                    <div className="text-xs text-gray-500">match</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <StatusBadge status={fellowship.status} />
                  <span className="text-xs text-amber-400">Due: {fellowship.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>

        {/* Faculty Match Suggestions */}
        <CardWrapper delay={0.15} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> Faculty Matches
            </h3>
            <button onClick={() => navigate('/college/faculty-match')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Full Search <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {FACULTY_MATCHES.map((faculty, i) => (
              <div key={i} onClick={() => setShowFacultyModal(faculty)} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-xs">
                    {faculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{faculty.name}</div>
                    <div className="text-xs text-gray-500">{faculty.university}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{faculty.research}</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-400">{faculty.match}%</span>
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOP Writing Progress */}
        <CardWrapper delay={0.2} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <PenTool className="w-4 h-4 text-cyan-400" /> Statement of Purpose
          </h3>
          <div className="space-y-4">
            {SOP_PROGRESS.map((sop, i) => (
              <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{sop.school}</span>
                    <StatusBadge status={sop.status} />
                  </div>
                  <span className="text-xs text-gray-500">{sop.wordCount} words</span>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar
                    value={sop.progress}
                    color={sop.progress >= 80 ? 'bg-emerald-500' : sop.progress >= 50 ? 'bg-cyan-500' : 'bg-amber-500'}
                    height="h-2"
                  />
                  <span className="text-xs text-gray-500 w-10 text-right">{sop.progress}%</span>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/college/sop-coach')} className="w-full px-3 py-2 bg-indigo-600/20 text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-600/30 transition-colors flex items-center justify-center gap-2">
              <PenTool className="w-4 h-4" /> Open SOP Coach
            </button>
          </div>
        </CardWrapper>

        {/* PhD Decision + GRE */}
        <div className="space-y-6">
          {/* PhD Decision Summary */}
          <CardWrapper delay={0.25} className="p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" /> PhD Decision Summary
            </h3>
            <div className="space-y-3">
              {phdFactors.map((factor, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{factor.factor}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      factor.weight === 'High' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-400'
                    }`}>{factor.weight}</span>
                  </div>
                  <div className="flex items-center gap-3 w-32">
                    <ProgressBar
                      value={factor.score}
                      color={factor.score >= 85 ? 'bg-emerald-500' : factor.score >= 70 ? 'bg-cyan-500' : 'bg-amber-500'}
                      height="h-1.5"
                    />
                    <span className="text-xs text-gray-400 w-8 text-right">{factor.score}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">PhD Recommended: Strong alignment with career goals</span>
              </div>
            </div>
          </CardWrapper>

          {/* GRE Prep Status */}
          <CardWrapper delay={0.3} className="p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" /> GRE Scores
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-400">{GRE_STATUS.verbal}</div>
                <div className="text-xs text-gray-500">Verbal</div>
                <div className="text-xs text-emerald-400">{GRE_STATUS.percentileVerbal}th %ile</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">{GRE_STATUS.quant}</div>
                <div className="text-xs text-gray-500">Quant</div>
                <div className="text-xs text-emerald-400">{GRE_STATUS.percentileQuant}th %ile</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-amber-400">{GRE_STATUS.writing}</div>
                <div className="text-xs text-gray-500">Writing</div>
                <div className="text-xs text-emerald-400">93rd %ile</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-3 text-center">Test Date: {GRE_STATUS.testDate}</div>
          </CardWrapper>
        </div>
      </div>

      {/* Fellowship Detail / Apply Modal */}
      {showFellowshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowFellowshipModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">{showFellowshipModal.name}</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Award Amount</span>
                <span className="text-sm text-emerald-400 font-medium">{showFellowshipModal.amount}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Deadline</span>
                <span className="text-sm text-amber-400 font-medium">{showFellowshipModal.deadline}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Match Score</span>
                <span className="text-sm text-indigo-400 font-bold">{showFellowshipModal.match}%</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Status</span>
                <StatusBadge status={showFellowshipModal.status} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowFellowshipModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowFellowshipModal(null); navigate('/college/fellowships'); }} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Start Application</button>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Detail Modal */}
      {showFacultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowFacultyModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">
                {showFacultyModal.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{showFacultyModal.name}</h3>
                <p className="text-sm text-gray-400">{showFacultyModal.university}</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Research Areas</div>
                <div className="text-sm text-gray-300">{showFacultyModal.research}</div>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Match Score</span>
                <span className="text-sm text-emerald-400 font-bold">{showFacultyModal.match}%</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowFacultyModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button onClick={() => { setShowFacultyModal(null); navigate('/college/faculty-match'); }} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2">
                <Mail className="w-4 h-4" /> Draft Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// TAB: NETWORKING
// ===========================================

const NetworkingTab: React.FC<{ navigate: NavigateFunction }> = ({ navigate }) => {
  const [showMessageModal, setShowMessageModal] = useState<typeof MENTOR_CONNECTIONS[0] | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState<typeof UPCOMING_EVENTS[0] | null>(null);
  const [showConnectModal, setShowConnectModal] = useState<typeof ALUMNI_CONNECTIONS[0] | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [connectSent, setConnectSent] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Networking</h2>
        <p className="text-sm text-gray-400 mt-1">Mentors, events, and professional connections</p>
      </div>

      {/* Mentor Connections */}
      <CardWrapper delay={0.1} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" /> Mentor Connections
          </h3>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-medium">
            {MENTOR_CONNECTIONS.length} Active
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {MENTOR_CONNECTIONS.map((mentor, i) => (
            <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                  {mentor.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{mentor.name}</div>
                  <div className="text-xs text-gray-400">{mentor.title}</div>
                  <div className="text-xs text-gray-500">{mentor.company}</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Last meeting</span>
                  <span className="text-gray-300">{mentor.lastMeeting}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Next meeting</span>
                  <span className="text-cyan-400">{mentor.nextMeeting}</span>
                </div>
              </div>
              <button onClick={() => { setShowMessageModal(mentor); setMessageSent(false); }} className="w-full mt-3 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 text-xs font-medium rounded-lg hover:bg-indigo-600/30 transition-colors flex items-center justify-center gap-1">
                <MessageSquare className="w-3 h-3" /> Message
              </button>
            </div>
          ))}
        </div>
      </CardWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Calendar */}
        <CardWrapper delay={0.15} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" /> Upcoming Events
            </h3>
            <button onClick={() => navigate('/college/events')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              All Events <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map((event, i) => (
              <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-white">{event.name}</div>
                    <div className="text-xs text-gray-500">{event.date} &middot; {event.location}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    event.type === 'Conference' ? 'bg-indigo-500/20 text-indigo-400' :
                    event.type === 'Tech Talk' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  {event.registered ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Registered
                    </span>
                  ) : (
                    <button onClick={() => { setShowRegisterModal(event); setRegistered(false); }} className="text-xs text-indigo-400 hover:text-indigo-300">Register Now</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>

        {/* Network Growth Chart */}
        <CardWrapper delay={0.2} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Network Growth
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={NETWORK_GROWTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="connections"
                stroke={COLORS.indigo}
                strokeWidth={2.5}
                dot={{ fill: COLORS.indigo, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: COLORS.cyan }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-xs text-gray-500">Total Connections</div>
            </div>
            <div className="w-px h-10 bg-gray-800" />
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">+44</div>
              <div className="text-xs text-gray-500">This Quarter</div>
            </div>
            <div className="w-px h-10 bg-gray-800" />
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400">3</div>
              <div className="text-xs text-gray-500">Active Mentors</div>
            </div>
          </div>
        </CardWrapper>
      </div>

      {/* Alumni Connections */}
      <CardWrapper delay={0.25} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-violet-400" /> MIT Alumni Network
          </h3>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{ALUMNI_CONNECTIONS.length} connections</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {ALUMNI_CONNECTIONS.map((alumni, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold text-xs">
                  {alumni.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{alumni.name}</div>
                  <div className="text-xs text-gray-500">{alumni.role} @ {alumni.company} &middot; Class of {alumni.graduationYear}</div>
                </div>
              </div>
              {alumni.connected ? (
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">Connected</span>
              ) : (
                <button onClick={() => { setShowConnectModal(alumni); setConnectSent(false); }} className="px-2.5 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-xs hover:bg-indigo-600/30 transition-colors">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </CardWrapper>

      {/* Message Mentor Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setShowMessageModal(null); setMessageSent(false); }}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            {!messageSent ? (
              <>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" /> Message {showMessageModal.name}
                </h3>
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {showMessageModal.avatar}
                  </div>
                  <div>
                    <div className="text-sm text-white">{showMessageModal.title}</div>
                    <div className="text-xs text-gray-500">{showMessageModal.company}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Subject</div>
                  <div className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">Follow-up from our last session</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Message</div>
                  <div className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 min-h-[80px]">Hi {showMessageModal.name.split(' ')[0]}, thank you for our last meeting on {showMessageModal.lastMeeting}. I wanted to follow up on the topics we discussed...</div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => { setShowMessageModal(null); setMessageSent(false); }} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button onClick={() => setMessageSent(true)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-400 mb-6">Your message to {showMessageModal.name} has been sent. Next meeting: {showMessageModal.nextMeeting}.</p>
                <button onClick={() => { setShowMessageModal(null); setMessageSent(false); }} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setShowRegisterModal(null); setRegistered(false); }}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            {!registered ? (
              <>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" /> Register for Event
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-400">Event</span>
                    <span className="text-sm text-white font-medium">{showRegisterModal.name}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-400">Date</span>
                    <span className="text-sm text-white">{showRegisterModal.date}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-400">Location</span>
                    <span className="text-sm text-white">{showRegisterModal.location}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-400">Type</span>
                    <span className="text-sm text-cyan-400">{showRegisterModal.type}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => { setShowRegisterModal(null); setRegistered(false); }} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button onClick={() => setRegistered(true)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Confirm Registration</button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Registered!</h3>
                <p className="text-sm text-gray-400 mb-6">You are registered for {showRegisterModal.name} on {showRegisterModal.date}. A confirmation has been sent to your email.</p>
                <button onClick={() => { setShowRegisterModal(null); setRegistered(false); }} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alumni Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setShowConnectModal(null); setConnectSent(false); }}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            {!connectSent ? (
              <>
                <h3 className="text-xl font-bold text-white mb-4">Connect with {showConnectModal.name}</h3>
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-bold text-xs">
                    {showConnectModal.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm text-white">{showConnectModal.role} @ {showConnectModal.company}</div>
                    <div className="text-xs text-gray-500">Class of {showConnectModal.graduationYear}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Personal Note (optional)</div>
                  <div className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 min-h-[60px]">Hi {showConnectModal.name.split(' ')[0]}, I am a {STUDENT.year} at {STUDENT.university} studying {STUDENT.major}. I would love to connect and learn about your experience at {showConnectModal.company}.</div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => { setShowConnectModal(null); setConnectSent(false); }} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button onClick={() => setConnectSent(true)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2">
                    <Users className="w-4 h-4" /> Send Connection
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Connection Request Sent!</h3>
                <p className="text-sm text-gray-400 mb-6">Your connection request to {showConnectModal.name} at {showConnectModal.company} has been sent.</p>
                <button onClick={() => { setShowConnectModal(null); setConnectSent(false); }} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Done</button>
              </div>
            )}
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
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    deadlines: true,
    matches: true,
    mentors: false,
  });
  const [privacySettings, setPrivacySettings] = useState([
    { label: 'Profile visible to employers', status: true },
    { label: 'Show on leaderboards', status: true },
    { label: 'Allow mentor matching', status: true },
    { label: 'Share data with partners', status: false },
    { label: 'Analytics & usage data', status: true },
  ]);
  const [showEditModal, setShowEditModal] = useState<{ label: string; value: string } | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const handleSave = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your profile, preferences, and privacy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <CardWrapper delay={0.1} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Profile
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-xl">
              {STUDENT.avatar}
            </div>
            <div>
              <div className="font-medium text-white">{STUDENT.name}</div>
              <div className="text-sm text-gray-400">{STUDENT.year}, {STUDENT.major}</div>
              <div className="text-sm text-gray-500">{STUDENT.university}</div>
            </div>
            <button onClick={() => setShowPhotoModal(true)} className="ml-auto px-3 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition-colors">
              <Upload className="w-3 h-3 inline mr-1" /> Update Photo
            </button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: STUDENT.name, icon: User },
              { label: 'Email', value: 'maya.chen@mit.edu', icon: Mail },
              { label: 'Phone', value: '+1 (617) 555-0142', icon: Phone },
              { label: 'LinkedIn', value: 'linkedin.com/in/mayachen', icon: Linkedin },
              { label: 'GitHub', value: 'github.com/mayachen', icon: Github },
            ].map((field, i) => (
              <div key={i} className="flex items-center gap-3">
                <field.icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">{field.label}</div>
                  <div className="text-sm text-gray-300">{field.value}</div>
                </div>
                <button onClick={() => setShowEditModal({ label: field.label, value: field.value })} className="text-xs text-indigo-400 hover:text-indigo-300">Edit</button>
              </div>
            ))}
          </div>
        </CardWrapper>

        {/* Career Preferences */}
        <CardWrapper delay={0.15} className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" /> Career Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Target Roles</div>
              <div className="flex flex-wrap gap-2">
                {['ML Engineer', 'Research Scientist', 'AI/ML Intern'].map((role, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Preferred Locations</div>
              <div className="flex flex-wrap gap-2">
                {['San Francisco, CA', 'Seattle, WA', 'New York, NY', 'Remote'].map((loc, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 border border-gray-700 rounded-full text-xs">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Salary Expectation</div>
              <div className="text-sm text-gray-300">$140,000 - $180,000 / year (New Grad)</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Open to Clearance Roles</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-emerald-500 rounded-full flex items-center justify-end px-0.5">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <span className="text-sm text-emerald-400">Yes</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Start Date</div>
              <div className="text-sm text-gray-300">June 2026 (post-graduation)</div>
            </div>
          </div>
        </CardWrapper>
      </div>

      {/* Privacy & Notifications */}
      <CardWrapper delay={0.2} className="p-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" /> Notifications & Privacy
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Notification Preferences</h4>
            <div className="space-y-3">
              {[
                { key: 'email', label: 'Email notifications' },
                { key: 'push', label: 'Push notifications' },
                { key: 'deadlines', label: 'Deadline reminders' },
                { key: 'matches', label: 'New job matches' },
                { key: 'mentors', label: 'Mentor messages' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <button
                    onClick={() => { setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] })); handleSave(); }}
                    className={`w-8 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-indigo-500 justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Privacy Settings</h4>
            <div className="space-y-3">
              {privacySettings.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <button
                    onClick={() => {
                      setPrivacySettings(prev => prev.map((p, idx) => idx === i ? { ...p, status: !p.status } : p));
                      handleSave();
                    }}
                    className={`w-8 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                      item.status ? 'bg-indigo-500 justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardWrapper>

      {/* Danger Zone */}
      <CardWrapper delay={0.25} className="p-5 border-rose-500/20">
        <h3 className="font-semibold text-rose-400 mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-300">Delete Account</div>
            <div className="text-xs text-gray-500">This will permanently delete your profile, applications, and all data.</div>
          </div>
          <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-sm rounded-lg hover:bg-rose-500/30 transition-colors">
            Delete Account
          </button>
        </div>
      </CardWrapper>

      {/* Save Notification Toast */}
      {showSaveNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Settings saved successfully!</span>
        </div>
      )}

      {/* Edit Profile Field Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Edit {showEditModal.label}</h3>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">{showEditModal.label}</div>
              <div className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">{showEditModal.value}</div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowEditModal(null); handleSave(); }} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPhotoModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" /> Update Profile Photo
            </h3>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center mb-4">
              <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400 mb-1">Drag and drop your photo here</p>
              <p className="text-xs text-gray-600">PNG, JPG up to 5MB</p>
              <button onClick={() => { setShowPhotoModal(false); handleSave(); }} className="mt-3 px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition-colors">Browse Files</button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowPhotoModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => { setShowPhotoModal(false); handleSave(); }} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Upload Photo</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-rose-400 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Delete Account
            </h3>
            <p className="text-sm text-gray-400 mb-4">Are you sure you want to delete your account? This action is <span className="text-rose-400 font-medium">permanent and cannot be undone</span>.</p>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg mb-4">
              <div className="text-sm text-rose-400">This will permanently delete:</div>
              <ul className="text-xs text-gray-400 mt-2 space-y-1">
                <li>- Your profile and personal data</li>
                <li>- All application history</li>
                <li>- Portfolio projects and certifications</li>
                <li>- Network connections and messages</li>
              </ul>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg">Confirm Delete</button>
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

const NOTIFICATIONS = [
  { id: 1, title: 'Google DeepMind Interview', message: 'Your interview is scheduled for Mar 10 at 2:00 PM PST', time: '1 hour ago', unread: true },
  { id: 2, title: 'New Job Match: Anthropic', message: 'ML Infrastructure Engineer - 97% match with your profile', time: '3 hours ago', unread: true },
  { id: 3, title: 'Mentor Session Reminder', message: 'Session with Dr. Sarah Kim tomorrow at 3:00 PM', time: '5 hours ago', unread: true },
  { id: 4, title: 'Resume Score Updated', message: 'Your ATS score improved to 88/100', time: '1 day ago', unread: false },
  { id: 5, title: 'NSF GRFP Deadline', message: 'Application deadline is in 20 days', time: '2 days ago', unread: false },
];

const CollegeStudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/demo');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onTabChange={setActiveTab} navigate={navigate} />;
      case 'career':
        return <CareerLaunchTab navigate={navigate} />;
      case 'internships':
        return <InternshipsTab navigate={navigate} />;
      case 'skills':
        return <SkillsTab navigate={navigate} />;
      case 'research':
        return <ResearchTab navigate={navigate} />;
      case 'networking':
        return <NetworkingTab navigate={navigate} />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab onTabChange={setActiveTab} navigate={navigate} />;
    }
  };

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
        {/* Student Profile Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-sm">
              {STUDENT.avatar}
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{STUDENT.name}</div>
              <div className="text-xs text-gray-400">{STUDENT.year} &middot; {STUDENT.major}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Career Readiness</span>
                <span className="text-indigo-400 font-medium">{STUDENT.careerReadiness}%</span>
              </div>
              <ProgressBar value={STUDENT.careerReadiness} color="bg-indigo-500" height="h-1.5" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg mb-1 text-left text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 bg-indigo-500 text-white rounded-full text-xs font-semibold min-w-[20px] text-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Links Section */}
        <div className="px-3 pb-2">
          <div className="text-xs text-gray-600 uppercase tracking-wider font-medium px-3 mb-2">Quick Tools</div>
          <div className="space-y-0.5">
            {[
              { label: 'Resume Builder', icon: FileText, path: '/college/resume-builder' },
              { label: 'Interview Prep', icon: Mic, path: '/college/interview-prep' },
              { label: 'Internship Finder', icon: Search, path: '/college/internships' },
            ].map((link, i) => (
              <button
                key={i}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors group"
              >
                <link.icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full p-3 text-gray-400 hover:text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar with Notification Bell */}
        <div className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800/50">
          <div className="flex items-center justify-end px-8 py-3 max-w-[1400px] mx-auto">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Notifications</h4>
                    <span className="text-xs text-indigo-400">{NOTIFICATIONS.filter(n => n.unread).length} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {NOTIFICATIONS.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors cursor-pointer ${notif.unread ? 'bg-indigo-500/5' : ''}`}
                        onClick={() => setShowNotifications(false)}
                      >
                        <div className="flex items-start gap-2">
                          {notif.unread && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
                          <div className={notif.unread ? '' : 'ml-3.5'}>
                            <div className="text-sm font-medium text-white">{notif.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{notif.message}</div>
                            <div className="text-xs text-gray-600 mt-1">{notif.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-800">
                    <button onClick={() => setShowNotifications(false)} className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 py-1.5">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 max-w-[1400px] mx-auto">
          {renderTab()}
        </div>
      </main>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default CollegeStudentDashboard;
