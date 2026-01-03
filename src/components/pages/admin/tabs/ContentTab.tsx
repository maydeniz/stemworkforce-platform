// @ts-nocheck
// ===========================================
// Content Management Tab Component
// Platform content pages and banners
// ===========================================

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  FileText,
  Flag,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Check,
  Clock,
  Calendar,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  ExternalLink,
  History,
  ArrowUpRight,
  Megaphone,
  Monitor,
  Building2,
  Users,
  LayoutDashboard,
  Lock,
  Scale,
  HelpCircle,
  Tag,
  Layers,
  Filter,
  Power,
  Wrench,
  RotateCcw,
  ArrowRight,
  MessageSquare,
  Timer,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

interface PlatformContent {
  id: string;
  page_key: string;
  title: string;
  content: string;
  meta_description: string;
  status: string;
  published_at: string;
  published_by: string;
  version: number;
  last_modified_at: string;
  last_modified_by: string;
  created_at: string;
  category?: string;
  ad_slots?: string[];
  // Enhanced status tracking
  status_reason?: string;
  status_changed_at?: string;
  status_changed_by?: string;
  maintenance_message?: string;
  redirect_url?: string;
  scheduled_publish_at?: string;
  scheduled_unpublish_at?: string;
}

// Status change reasons
const STATUS_CHANGE_REASONS = [
  { id: 'content_update', label: 'Content Update Required', icon: Edit },
  { id: 'review_needed', label: 'Review/Approval Needed', icon: AlertCircle },
  { id: 'maintenance', label: 'Scheduled Maintenance', icon: Wrench },
  { id: 'security_review', label: 'Security Review', icon: ShieldAlert },
  { id: 'compliance', label: 'Compliance Check', icon: Scale },
  { id: 'redesign', label: 'Page Redesign', icon: LayoutDashboard },
  { id: 'seasonal', label: 'Seasonal/Time-Limited', icon: Calendar },
  { id: 'other', label: 'Other (Specify)', icon: MessageSquare },
];

// Page status options with details
const PAGE_STATUS_OPTIONS = [
  {
    id: 'published',
    label: 'Published',
    description: 'Page is live and accessible to all users',
    icon: Globe,
    color: 'emerald',
  },
  {
    id: 'draft',
    label: 'Draft',
    description: 'Page is hidden from public, only visible to admins',
    icon: Edit,
    color: 'amber',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    description: 'Page shows maintenance message with optional redirect',
    icon: Wrench,
    color: 'orange',
  },
  {
    id: 'archived',
    label: 'Archived',
    description: 'Page is permanently hidden and may be deleted',
    icon: EyeOff,
    color: 'slate',
  },
];

// Page categories for filtering
const PAGE_CATEGORIES = [
  { id: 'all', label: 'All Categories', count: 0 },
  { id: 'public', label: 'Public Pages', icon: Globe, color: 'blue' },
  { id: 'industry', label: 'Industry Pages', icon: Building2, color: 'purple' },
  { id: 'portal', label: 'Portal Pages', icon: Users, color: 'cyan' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'amber' },
  { id: 'auth', label: 'Auth Pages', icon: Lock, color: 'slate' },
  { id: 'legal', label: 'Legal Pages', icon: Scale, color: 'emerald' },
  { id: 'support', label: 'Support Pages', icon: HelpCircle, color: 'orange' },
];

// Available ad slot types
const AD_SLOT_TYPES = [
  { id: 'hero-banner', label: 'Hero Banner', description: 'Full-width banner at top of page' },
  { id: 'top-banner', label: 'Top Banner', description: 'Banner below navigation' },
  { id: 'sidebar', label: 'Sidebar', description: 'Side column advertisement' },
  { id: 'in-feed', label: 'In-Feed', description: 'Native ad within content feed' },
  { id: 'bottom-banner', label: 'Bottom Banner', description: 'Banner at page bottom' },
  { id: 'footer-banner', label: 'Footer Banner', description: 'Above footer section' },
  { id: 'featured-section', label: 'Featured Section', description: 'Highlighted content area' },
  { id: 'job-listings', label: 'Job Listings Sponsor', description: 'Sponsored job listings' },
  { id: 'event-sponsor', label: 'Event Sponsor', description: 'Event sponsorship slot' },
  { id: 'course-sponsor', label: 'Course Sponsor', description: 'Training course sponsor' },
  { id: 'partner-spotlight', label: 'Partner Spotlight', description: 'Featured partner placement' },
  { id: 'map-overlay', label: 'Map Overlay', description: 'Overlay on interactive map' },
  { id: 'location-sponsor', label: 'Location Sponsor', description: 'Location-based ad' },
  { id: 'industry-sponsor', label: 'Industry Sponsor', description: 'Industry page sponsor' },
  { id: 'hero-sponsor', label: 'Hero Sponsor', description: 'Hero section sponsor' },
  { id: 'research-sponsor', label: 'Research Sponsor', description: 'Research content sponsor' },
  { id: 'training-sponsor', label: 'Training Sponsor', description: 'Training content sponsor' },
  { id: 'related-jobs', label: 'Related Jobs', description: 'Related jobs section' },
  { id: 'cta-banner', label: 'CTA Banner', description: 'Call-to-action banner' },
  { id: 'comparison-banner', label: 'Comparison Banner', description: 'Pricing comparison section' },
  { id: 'healthcare-partner', label: 'Healthcare Partner', description: 'Healthcare partner spotlight' },
  { id: 'certification-sponsor', label: 'Certification Sponsor', description: 'Certification program sponsor' },
  { id: 'chips-act-banner', label: 'CHIPS Act Banner', description: 'CHIPS Act related content' },
  { id: 'green-jobs-banner', label: 'Green Jobs Banner', description: 'Clean energy jobs highlight' },
  { id: 'clearance-jobs', label: 'Clearance Jobs', description: 'Security clearance jobs' },
  { id: 'sidebar-promotion', label: 'Sidebar Promotion', description: 'Dashboard sidebar promo' },
  { id: 'featured-opportunity', label: 'Featured Opportunity', description: 'Featured job opportunity' },
];

interface SiteBanner {
  id: string;
  banner_type: string;
  message: string;
  action_text: string;
  action_url: string;
  background_color: string;
  text_color: string;
  position: string;
  is_dismissible: boolean;
  start_at: string;
  end_at: string;
  target_pages: string[];
  is_active: boolean;
  view_count: number;
  click_count: number;
  dismiss_count: number;
  created_by: string;
  created_at: string;
}

const ContentTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('pages');
  const [pages, setPages] = useState<PlatformContent[]>([]);
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPageModal, setShowPageModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showAdSlotsModal, setShowAdSlotsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Status Change Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusPage, setStatusPage] = useState<PlatformContent | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [maintenanceMessage, setMaintenanceMessage] = useState('This page is currently under maintenance. Please check back soon.');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [enableSchedule, setEnableSchedule] = useState(false);
  const [scheduledPublishAt, setScheduledPublishAt] = useState('');
  const [scheduledUnpublishAt, setScheduledUnpublishAt] = useState('');
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);

  // Comprehensive list of all platform pages organized by category
  const samplePages: PlatformContent[] = [
    // ========== PUBLIC PAGES ==========
    {
      id: '1',
      page_key: 'home',
      title: 'Home Page',
      content: '<h1>Welcome to STEM Workforce</h1><p>The DOE CTO Challenge Initiative connecting talent with emerging technology opportunities...</p>',
      meta_description: 'STEM Workforce - Connecting talent with opportunities in emerging technology sectors including AI, quantum computing, and clean energy.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 12,
      last_modified_at: '2025-01-18T10:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'public',
      ad_slots: ['hero-banner', 'sidebar', 'featured-section', 'footer-banner'],
    },
    {
      id: '2',
      page_key: 'jobs',
      title: 'Jobs Listing Page',
      content: '<h1>Browse Jobs</h1><p>Search thousands of STEM opportunities...</p>',
      meta_description: 'Find STEM jobs in AI, quantum computing, clean energy, semiconductors, and more.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 8,
      last_modified_at: '2025-01-15T14:30:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'public',
      ad_slots: ['top-banner', 'sidebar', 'in-feed', 'bottom-banner'],
    },
    {
      id: '3',
      page_key: 'jobs/:id',
      title: 'Job Detail Page',
      content: '<h1>Job Details</h1><p>View complete job information...</p>',
      meta_description: 'View job details, requirements, and apply for STEM positions.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 5,
      last_modified_at: '2025-01-10T09:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'public',
      ad_slots: ['sidebar', 'related-jobs', 'bottom-banner'],
    },
    {
      id: '4',
      page_key: 'events',
      title: 'Events Page',
      content: '<h1>STEM Events</h1><p>Career fairs, workshops, and networking events...</p>',
      meta_description: 'Discover STEM career fairs, workshops, webinars, and networking events.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 6,
      last_modified_at: '2025-01-12T11:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'public',
      ad_slots: ['top-banner', 'sidebar', 'event-sponsor', 'bottom-banner'],
    },
    {
      id: '5',
      page_key: 'training',
      title: 'Training & Certifications',
      content: '<h1>Training Programs</h1><p>Upskill with industry certifications...</p>',
      meta_description: 'Access STEM training programs, certifications, and professional development courses.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 7,
      last_modified_at: '2025-01-14T16:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'public',
      ad_slots: ['hero-banner', 'course-sponsor', 'sidebar', 'bottom-banner'],
    },
    {
      id: '6',
      page_key: 'map',
      title: 'Workforce Map',
      content: '<h1>Interactive Workforce Map</h1><p>Explore STEM opportunities by location...</p>',
      meta_description: 'Interactive map showing STEM job opportunities, employers, and training centers across the nation.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 4,
      last_modified_at: '2025-01-08T10:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-03-01T00:00:00Z',
      category: 'public',
      ad_slots: ['map-overlay', 'sidebar', 'location-sponsor'],
    },
    {
      id: '7',
      page_key: 'partners',
      title: 'Partners Page',
      content: '<h1>Our Partners</h1><p>Federal agencies, national labs, and industry leaders...</p>',
      meta_description: 'Meet our partners: Federal agencies, national laboratories, and industry leaders in STEM.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 5,
      last_modified_at: '2025-01-10T14:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'public',
      ad_slots: ['partner-spotlight', 'sidebar', 'bottom-banner'],
    },
    {
      id: '8',
      page_key: 'pricing',
      title: 'Pricing Page',
      content: '<h1>Pricing Plans</h1><p>Choose the plan that fits your needs...</p>',
      meta_description: 'STEM Workforce pricing plans for employers, educators, and partners.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 6,
      last_modified_at: '2025-01-15T09:00:00Z',
      last_modified_by: 'billing@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'public',
      ad_slots: ['comparison-banner', 'sidebar'],
    },
    {
      id: '9',
      page_key: 'services',
      title: 'Services Page',
      content: '<h1>Our Services</h1><p>Workforce development, training, and placement services...</p>',
      meta_description: 'STEM Workforce services including talent acquisition, training programs, and workforce development.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 4,
      last_modified_at: '2025-01-11T15:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-02-01T00:00:00Z',
      category: 'public',
      ad_slots: ['service-spotlight', 'sidebar', 'cta-banner'],
    },
    // ========== INDUSTRY PAGES ==========
    {
      id: '10',
      page_key: 'industries',
      title: 'Industries Overview',
      content: '<h1>Industries We Serve</h1><p>From AI to clean energy...</p>',
      meta_description: 'Explore STEM career opportunities across AI, quantum computing, semiconductors, clean energy, and more.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 5,
      last_modified_at: '2025-01-13T10:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['industry-sponsor', 'sidebar', 'bottom-banner'],
    },
    {
      id: '11',
      page_key: 'industries/ai',
      title: 'AI & Machine Learning Industry',
      content: '<h1>AI & Machine Learning</h1><p>Careers in artificial intelligence...</p>',
      meta_description: 'AI and Machine Learning career opportunities, training, and industry insights.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 8,
      last_modified_at: '2025-01-17T11:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['hero-sponsor', 'job-listings', 'training-sponsor', 'sidebar'],
    },
    {
      id: '12',
      page_key: 'industries/quantum',
      title: 'Quantum Computing Industry',
      content: '<h1>Quantum Computing</h1><p>The future of computing...</p>',
      meta_description: 'Quantum computing careers, research opportunities, and industry developments.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 6,
      last_modified_at: '2025-01-16T14:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['hero-sponsor', 'job-listings', 'research-sponsor', 'sidebar'],
    },
    {
      id: '13',
      page_key: 'industries/semiconductors',
      title: 'Semiconductors Industry',
      content: '<h1>Semiconductors</h1><p>CHIPS Act opportunities...</p>',
      meta_description: 'Semiconductor industry careers, CHIPS Act funding, and manufacturing opportunities.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 7,
      last_modified_at: '2025-01-15T10:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['hero-sponsor', 'job-listings', 'chips-act-banner', 'sidebar'],
    },
    {
      id: '14',
      page_key: 'industries/clean-energy',
      title: 'Clean Energy Industry',
      content: '<h1>Clean Energy</h1><p>Sustainable energy careers...</p>',
      meta_description: 'Clean energy careers in solar, wind, nuclear, and sustainable technology.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 6,
      last_modified_at: '2025-01-14T09:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['hero-sponsor', 'job-listings', 'green-jobs-banner', 'sidebar'],
    },
    {
      id: '15',
      page_key: 'industries/cybersecurity',
      title: 'Cybersecurity Industry',
      content: '<h1>Cybersecurity</h1><p>Protect critical infrastructure...</p>',
      meta_description: 'Cybersecurity careers, certifications, and opportunities in federal and private sectors.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 5,
      last_modified_at: '2025-01-12T16:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['hero-sponsor', 'job-listings', 'certification-sponsor', 'sidebar'],
    },
    {
      id: '16',
      page_key: 'industries/healthcare',
      title: 'Healthcare Technology Industry',
      content: '<h1>Healthcare IT</h1><p>Digital health innovations...</p>',
      meta_description: 'Healthcare IT careers, health informatics, and medical technology opportunities.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 4,
      last_modified_at: '2025-01-11T11:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-02-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['hero-sponsor', 'job-listings', 'healthcare-partner', 'sidebar'],
    },
    {
      id: '17',
      page_key: 'industries/biotech',
      title: 'Biotechnology Industry',
      content: '<h1>Biotechnology</h1><p>Life sciences careers...</p>',
      meta_description: 'Biotechnology careers, research opportunities, and life sciences industry insights.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 3,
      last_modified_at: '2025-01-10T10:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-03-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['hero-sponsor', 'job-listings', 'research-sponsor', 'sidebar'],
    },
    {
      id: '18',
      page_key: 'industries/aerospace',
      title: 'Aerospace & Defense Industry',
      content: '<h1>Aerospace & Defense</h1><p>Space and defense careers...</p>',
      meta_description: 'Aerospace and defense careers, clearance jobs, and space technology opportunities.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 4,
      last_modified_at: '2025-01-09T14:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-02-01T00:00:00Z',
      category: 'industry',
      ad_slots: ['hero-sponsor', 'job-listings', 'clearance-jobs', 'sidebar'],
    },
    // ========== PORTAL PAGES ==========
    {
      id: '19',
      page_key: 'education-provider',
      title: 'Education Provider Portal',
      content: '<h1>Education Provider Portal</h1><p>Partner with us to connect students with opportunities...</p>',
      meta_description: 'Education provider portal for universities and training institutions.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 5,
      last_modified_at: '2025-01-13T15:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'portal',
      ad_slots: ['partner-spotlight', 'sidebar'],
    },
    // ========== AUTH PAGES ==========
    {
      id: '20',
      page_key: 'login',
      title: 'Login Page',
      content: '<h1>Sign In</h1><p>Access your account...</p>',
      meta_description: 'Sign in to your STEM Workforce account.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 3,
      last_modified_at: '2025-01-05T10:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'auth',
      ad_slots: [],
    },
    {
      id: '21',
      page_key: 'register',
      title: 'Registration Page',
      content: '<h1>Create Account</h1><p>Join STEM Workforce...</p>',
      meta_description: 'Create your STEM Workforce account to find jobs and opportunities.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 4,
      last_modified_at: '2025-01-06T11:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'auth',
      ad_slots: [],
    },
    // ========== DASHBOARD PAGES ==========
    {
      id: '22',
      page_key: 'dashboard',
      title: 'User Dashboard',
      content: '<h1>Dashboard</h1><p>Manage your profile and applications...</p>',
      meta_description: 'Your STEM Workforce dashboard - manage applications, profile, and settings.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 10,
      last_modified_at: '2025-01-17T09:00:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'dashboard',
      ad_slots: ['sidebar-promotion', 'featured-opportunity'],
    },
    // ========== LEGAL PAGES ==========
    {
      id: '23',
      page_key: 'about-us',
      title: 'About STEM Workforce',
      content: '<h1>About Us</h1><p>STEM Workforce is the leading platform connecting talent with opportunities in emerging technology sectors...</p>',
      meta_description: 'Learn about STEM Workforce, the DOE CTO Challenge Initiative platform connecting talent with emerging technology opportunities.',
      status: 'published',
      published_at: '2025-01-10T10:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 3,
      last_modified_at: '2025-01-15T14:30:00Z',
      last_modified_by: 'editor@stemworkforce.gov',
      created_at: '2024-06-15T08:00:00Z',
      category: 'legal',
      ad_slots: ['sidebar'],
    },
    {
      id: '24',
      page_key: 'privacy-policy',
      title: 'Privacy Policy',
      content: '<h1>Privacy Policy</h1><p>This privacy policy explains how we collect, use, and protect your personal information...</p>',
      meta_description: 'STEM Workforce privacy policy - how we protect your data and respect your privacy.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'legal@stemworkforce.gov',
      version: 5,
      last_modified_at: '2025-01-01T00:00:00Z',
      last_modified_by: 'legal@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'legal',
      ad_slots: [],
    },
    {
      id: '25',
      page_key: 'terms-of-service',
      title: 'Terms of Service',
      content: '<h1>Terms of Service</h1><p>By using STEM Workforce, you agree to these terms and conditions...</p>',
      meta_description: 'STEM Workforce terms of service and user agreement.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'legal@stemworkforce.gov',
      version: 4,
      last_modified_at: '2025-01-01T00:00:00Z',
      last_modified_by: 'legal@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'legal',
      ad_slots: [],
    },
    {
      id: '26',
      page_key: 'hipaa-notice',
      title: 'HIPAA Notice',
      content: '<h1>HIPAA Notice of Privacy Practices</h1><p>This notice describes how health information about you may be used...</p>',
      meta_description: 'HIPAA Notice of Privacy Practices for healthcare-related services.',
      status: 'published',
      published_at: '2025-01-15T00:00:00Z',
      published_by: 'compliance@stemworkforce.gov',
      version: 1,
      last_modified_at: '2025-01-15T00:00:00Z',
      last_modified_by: 'compliance@stemworkforce.gov',
      created_at: '2025-01-15T00:00:00Z',
      category: 'legal',
      ad_slots: [],
    },
    {
      id: '27',
      page_key: 'accessibility',
      title: 'Accessibility Statement',
      content: '<h1>Accessibility</h1><p>STEM Workforce is committed to ensuring digital accessibility...</p>',
      meta_description: 'STEM Workforce accessibility statement and commitment to WCAG compliance.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'legal@stemworkforce.gov',
      version: 2,
      last_modified_at: '2025-01-01T00:00:00Z',
      last_modified_by: 'legal@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'legal',
      ad_slots: [],
    },
    // ========== SUPPORT PAGES ==========
    {
      id: '28',
      page_key: 'faq',
      title: 'Frequently Asked Questions',
      content: '<h1>FAQ</h1><h2>How do I create an account?</h2><p>Click the Sign Up button...</p>',
      meta_description: 'Common questions about using STEM Workforce platform.',
      status: 'draft',
      published_at: '',
      published_by: '',
      version: 2,
      last_modified_at: '2025-01-18T16:00:00Z',
      last_modified_by: 'support@stemworkforce.gov',
      created_at: '2024-09-01T00:00:00Z',
      category: 'support',
      ad_slots: ['sidebar'],
    },
    {
      id: '29',
      page_key: 'contact',
      title: 'Contact Us',
      content: '<h1>Contact Us</h1><p>Get in touch with our team...</p>',
      meta_description: 'Contact STEM Workforce for support, partnerships, or general inquiries.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'content@stemworkforce.gov',
      version: 3,
      last_modified_at: '2025-01-08T10:00:00Z',
      last_modified_by: 'support@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
      category: 'support',
      ad_slots: [],
    },
    {
      id: '30',
      page_key: 'help-center',
      title: 'Help Center',
      content: '<h1>Help Center</h1><p>Find answers and tutorials...</p>',
      meta_description: 'STEM Workforce help center with guides, tutorials, and support resources.',
      status: 'published',
      published_at: '2025-01-01T00:00:00Z',
      published_by: 'support@stemworkforce.gov',
      version: 5,
      last_modified_at: '2025-01-12T11:00:00Z',
      last_modified_by: 'support@stemworkforce.gov',
      created_at: '2024-03-01T00:00:00Z',
      category: 'support',
      ad_slots: ['sidebar'],
    },
  ];

  const sampleBanners: SiteBanner[] = [
    {
      id: '1',
      banner_type: 'announcement',
      message: '🚀 New: CHIPS Act Funding Applications Now Open - Apply by March 15, 2025',
      action_text: 'Learn More',
      action_url: '/funding/chips-act',
      background_color: '#3B82F6',
      text_color: '#FFFFFF',
      position: 'top',
      is_dismissible: true,
      start_at: '2025-01-15T00:00:00Z',
      end_at: '2025-03-15T23:59:59Z',
      target_pages: ['home', 'jobs', 'funding'],
      is_active: true,
      view_count: 45230,
      click_count: 3240,
      dismiss_count: 8920,
      created_by: 'marketing@stemworkforce.gov',
      created_at: '2025-01-10T10:00:00Z',
    },
    {
      id: '2',
      banner_type: 'maintenance',
      message: '⚠️ Scheduled Maintenance: January 25th, 2:00 AM - 6:00 AM EST',
      action_text: '',
      action_url: '',
      background_color: '#F59E0B',
      text_color: '#000000',
      position: 'top',
      is_dismissible: false,
      start_at: '2025-01-20T00:00:00Z',
      end_at: '2025-01-26T00:00:00Z',
      target_pages: ['all'],
      is_active: false,
      view_count: 0,
      click_count: 0,
      dismiss_count: 0,
      created_by: 'engineering@stemworkforce.gov',
      created_at: '2025-01-18T08:00:00Z',
    },
    {
      id: '3',
      banner_type: 'promo',
      message: '🎓 Free Healthcare IT Certification Prep - Limited Time Offer',
      action_text: 'Enroll Now',
      action_url: '/training/healthcare-it',
      background_color: '#10B981',
      text_color: '#FFFFFF',
      position: 'bottom',
      is_dismissible: true,
      start_at: '2025-01-12T00:00:00Z',
      end_at: '2025-02-12T23:59:59Z',
      target_pages: ['training', 'healthcare'],
      is_active: true,
      view_count: 12450,
      click_count: 1890,
      dismiss_count: 2340,
      created_by: 'marketing@stemworkforce.gov',
      created_at: '2025-01-11T09:00:00Z',
    },
    {
      id: '4',
      banner_type: 'cookie',
      message: 'We use cookies to enhance your experience. By continuing, you agree to our cookie policy.',
      action_text: 'Accept',
      action_url: '',
      background_color: '#1E293B',
      text_color: '#FFFFFF',
      position: 'bottom',
      is_dismissible: true,
      start_at: '2024-01-01T00:00:00Z',
      end_at: '2026-12-31T23:59:59Z',
      target_pages: ['all'],
      is_active: true,
      view_count: 890450,
      click_count: 456230,
      dismiss_count: 234120,
      created_by: 'legal@stemworkforce.gov',
      created_at: '2024-01-01T00:00:00Z',
    },
  ];

  useEffect(() => {
    loadData();
  }, [activeSubTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // In production, fetch from Supabase
      setPages(samplePages);
      setBanners(sampleBanners);
    } catch (error) {
      console.error('Error loading content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'draft':
        return 'bg-amber-500/20 text-amber-400';
      case 'archived':
        return 'bg-slate-500/20 text-slate-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-500/20 text-blue-400';
      case 'maintenance':
        return 'bg-amber-500/20 text-amber-400';
      case 'promo':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'cookie':
        return 'bg-slate-500/20 text-slate-400';
      case 'alert':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Open status change modal
  const openStatusModal = (page: PlatformContent) => {
    setStatusPage(page);
    setNewStatus(page.status);
    setStatusReason('');
    setCustomReason('');
    setMaintenanceMessage(page.maintenance_message || 'This page is currently under maintenance. Please check back soon.');
    setRedirectUrl(page.redirect_url || '');
    setEnableSchedule(false);
    setScheduledPublishAt(page.scheduled_publish_at || '');
    setScheduledUnpublishAt(page.scheduled_unpublish_at || '');
    setShowStatusModal(true);
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (!statusPage) return;

    setStatusChangeLoading(true);
    try {
      // Update the page status in the local state (in production, this would be a Supabase call)
      const updatedPages = pages.map(p => {
        if (p.id === statusPage.id) {
          return {
            ...p,
            status: newStatus,
            status_reason: statusReason === 'other' ? customReason : statusReason,
            status_changed_at: new Date().toISOString(),
            status_changed_by: 'admin@stemworkforce.gov',
            maintenance_message: newStatus === 'maintenance' ? maintenanceMessage : undefined,
            redirect_url: newStatus === 'maintenance' ? redirectUrl : undefined,
            scheduled_publish_at: enableSchedule ? scheduledPublishAt : undefined,
            scheduled_unpublish_at: enableSchedule ? scheduledUnpublishAt : undefined,
            last_modified_at: new Date().toISOString(),
          };
        }
        return p;
      });

      setPages(updatedPages);
      setShowStatusModal(false);

      // In production, you would call Supabase here:
      // await supabase.from('platform_content').update({ status: newStatus, ... }).eq('id', statusPage.id);
    } catch (error) {
      console.error('Error updating page status:', error);
    } finally {
      setStatusChangeLoading(false);
    }
  };

  // Quick status toggle (for simple publish/unpublish)
  const quickStatusToggle = (page: PlatformContent) => {
    if (page.status === 'published') {
      setStatusPage(page);
      setNewStatus('draft');
      setStatusReason('');
      setShowStatusModal(true);
    } else {
      // Quick publish
      const updatedPages = pages.map(p => {
        if (p.id === page.id) {
          return {
            ...p,
            status: 'published',
            published_at: new Date().toISOString(),
            last_modified_at: new Date().toISOString(),
          };
        }
        return p;
      });
      setPages(updatedPages);
    }
  };

  // Get status icon component
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return Globe;
      case 'draft': return Edit;
      case 'maintenance': return Wrench;
      case 'archived': return EyeOff;
      default: return Globe;
    }
  };

  const filteredPages = pages.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.page_key.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'public': return 'bg-blue-500/20 text-blue-400';
      case 'industry': return 'bg-purple-500/20 text-purple-400';
      case 'portal': return 'bg-cyan-500/20 text-cyan-400';
      case 'dashboard': return 'bg-amber-500/20 text-amber-400';
      case 'auth': return 'bg-slate-500/20 text-slate-400';
      case 'legal': return 'bg-emerald-500/20 text-emerald-400';
      case 'support': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  // Count pages by category
  const categoryCounts = pages.reduce((acc, p) => {
    if (p.category) {
      acc[p.category] = (acc[p.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const filteredBanners = banners.filter((b) => {
    if (filterStatus !== 'all') {
      if (filterStatus === 'active' && !b.is_active) return false;
      if (filterStatus === 'inactive' && b.is_active) return false;
    }
    if (searchQuery && !b.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Stats
  const publishedPages = pages.filter((p) => p.status === 'published').length;
  const draftPages = pages.filter((p) => p.status === 'draft').length;
  const maintenancePages = pages.filter((p) => p.status === 'maintenance').length;
  const scheduledPages = pages.filter((p) => p.scheduled_publish_at || p.scheduled_unpublish_at).length;
  const activeBanners = banners.filter((b) => b.is_active).length;
  const totalBannerViews = banners.reduce((sum, b) => sum + b.view_count, 0);
  const totalBannerClicks = banners.reduce((sum, b) => sum + b.click_count, 0);
  const bannerCTR = totalBannerViews > 0 ? ((totalBannerClicks / totalBannerViews) * 100).toFixed(1) : 0;

  const subTabs = [
    { id: 'pages', label: 'Content Pages', icon: FileText },
    { id: 'banners', label: 'Site Banners', icon: Flag },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setFilterStatus('all');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSubTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Pages Sub-tab */}
      {activeSubTab === 'pages' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Pages</p>
                  <p className="text-2xl font-bold text-white">{pages.length}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Published</p>
                  <p className="text-2xl font-bold text-white">{publishedPages}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Drafts</p>
                  <p className="text-2xl font-bold text-white">{draftPages}</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Edit className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Maintenance</p>
                  <p className="text-2xl font-bold text-white">{maintenancePages}</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Wrench className="w-5 h-5 text-orange-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Scheduled</p>
                  <p className="text-2xl font-bold text-white">{scheduledPages}</p>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Timer className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Ad Slots</p>
                  <p className="text-2xl font-bold text-white">
                    {pages.reduce((sum, p) => sum + (p.ad_slots?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Megaphone className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              All ({pages.length})
            </button>
            {PAGE_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  filterCategory === cat.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                {cat.label} ({categoryCounts[cat.id] || 0})
              </button>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pages by name or URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="maintenance">Maintenance</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedItem(null);
                setShowPageModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Page
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-slate-400">
            Showing {filteredPages.length} of {pages.length} pages
            {filterCategory !== 'all' && ` in ${PAGE_CATEGORIES.find(c => c.id === filterCategory)?.label}`}
          </div>

          {/* Pages Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Ad Slots
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Loading pages...
                    </td>
                  </tr>
                ) : filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No pages found
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-white font-medium">{page.title}</p>
                          <code className="text-xs text-blue-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            /{page.page_key}
                          </code>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(
                            page.category || 'public'
                          )}`}
                        >
                          {page.category || 'public'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => openStatusModal(page)}
                          className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:ring-2 hover:ring-offset-1 hover:ring-offset-slate-900 ${
                            page.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:ring-emerald-500/50'
                              : page.status === 'maintenance'
                              ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 hover:ring-orange-500/50'
                              : page.status === 'draft'
                              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:ring-amber-500/50'
                              : 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 hover:ring-slate-500/50'
                          }`}
                          title="Click to change status"
                        >
                          {page.status === 'published' && <Globe className="w-3 h-3" />}
                          {page.status === 'maintenance' && <Wrench className="w-3 h-3" />}
                          {page.status === 'draft' && <Edit className="w-3 h-3" />}
                          {page.status === 'archived' && <EyeOff className="w-3 h-3" />}
                          <span className="capitalize">{page.status}</span>
                          <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        {page.scheduled_publish_at && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-cyan-400">
                            <Timer className="w-3 h-3" />
                            <span>Scheduled</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {page.ad_slots && page.ad_slots.length > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedItem(page);
                              setShowAdSlotsModal(true);
                            }}
                            className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300"
                          >
                            <Megaphone className="w-3.5 h-3.5" />
                            {page.ad_slots.length} slot{page.ad_slots.length !== 1 ? 's' : ''}
                          </button>
                        ) : (
                          <span className="text-slate-500 text-sm">No ads</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-slate-300">{formatDate(page.last_modified_at)}</p>
                          <p className="text-slate-500 text-xs">v{page.version}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {/* Quick Publish/Unpublish Toggle */}
                          <button
                            onClick={() => quickStatusToggle(page)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              page.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-emerald-400'
                            }`}
                            title={page.status === 'published' ? 'Unpublish Page' : 'Publish Page'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(page);
                              setShowPageModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Edit Content"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(page);
                              setShowAdSlotsModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-cyan-400"
                            title="Manage Ad Slots"
                          >
                            <Megaphone className="w-4 h-4" />
                          </button>
                          <a
                            href={`/${page.page_key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-blue-400"
                            title="View Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button className="p-1 text-slate-400 hover:text-purple-400" title="Version History">
                            <History className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Site Banners Sub-tab */}
      {activeSubTab === 'banners' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Banners</p>
                  <p className="text-2xl font-bold text-white">{banners.length}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Flag className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active</p>
                  <p className="text-2xl font-bold text-white">{activeBanners}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Views</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(totalBannerViews)}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Clicks</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(totalBannerClicks)}</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Click Rate</p>
                  <p className="text-2xl font-bold text-white">{bannerCTR}%</p>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search banners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedItem(null);
                setShowBannerModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Banner
            </button>
          </div>

          {/* Banners Grid */}
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading banners...</div>
            ) : filteredBanners.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No banners found</div>
            ) : (
              filteredBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                >
                  {/* Banner Preview */}
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                      backgroundColor: banner.background_color,
                      color: banner.text_color,
                    }}
                  >
                    <span className="text-sm font-medium">{banner.message}</span>
                    {banner.action_text && (
                      <span className="text-sm underline">{banner.action_text}</span>
                    )}
                  </div>

                  {/* Banner Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBannerTypeColor(
                                banner.banner_type
                              )}`}
                            >
                              {banner.banner_type}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                banner.is_active
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-500/20 text-slate-400'
                              }`}
                            >
                              {banner.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-slate-400 capitalize">
                              Position: {banner.position}
                            </span>
                            {banner.is_dismissible && (
                              <span className="text-xs text-slate-500">Dismissible</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Start: {formatDate(banner.start_at)}</span>
                            <span>End: {formatDate(banner.end_at)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-400">
                              Pages: {banner.target_pages.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-slate-400">Views</p>
                            <p className="text-white font-medium">
                              {formatNumber(banner.view_count)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-400">Clicks</p>
                            <p className="text-white font-medium">
                              {formatNumber(banner.click_count)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-400">Dismissed</p>
                            <p className="text-white font-medium">
                              {formatNumber(banner.dismiss_count)}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Toggle active status
                            }}
                            className={`p-2 rounded-lg ${
                              banner.is_active
                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            }`}
                            title={banner.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {banner.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(banner);
                              setShowBannerModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Page Editor Modal */}
      {showPageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {selectedItem ? 'Edit Page' : 'New Page'}
              </h2>
              <button
                onClick={() => setShowPageModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Page Title</label>
                  <input
                    type="text"
                    defaultValue={selectedItem?.title || ''}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Page title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">URL Key</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-slate-700 border border-r-0 border-slate-600 rounded-l-lg text-slate-400">
                      /
                    </span>
                    <input
                      type="text"
                      defaultValue={selectedItem?.page_key || ''}
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="page-url"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Meta Description
                </label>
                <input
                  type="text"
                  defaultValue={selectedItem?.meta_description || ''}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="SEO description for search engines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                <textarea
                  defaultValue={selectedItem?.content || ''}
                  rows={12}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Page content (HTML supported)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  defaultValue={selectedItem?.status || 'draft'}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                {selectedItem && `Version ${selectedItem.version}`}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPageModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  Save Draft
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                  <Globe className="w-4 h-4" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Editor Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {selectedItem ? 'Edit Banner' : 'New Banner'}
              </h2>
              <button
                onClick={() => setShowBannerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Banner Message
                </label>
                <input
                  type="text"
                  defaultValue={selectedItem?.message || ''}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Banner message text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Banner Type
                  </label>
                  <select
                    defaultValue={selectedItem?.banner_type || 'announcement'}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="promo">Promo</option>
                    <option value="cookie">Cookie</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
                  <select
                    defaultValue={selectedItem?.position || 'top'}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Action Text
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedItem?.action_text || ''}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Button text (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Action URL</label>
                  <input
                    type="text"
                    defaultValue={selectedItem?.action_url || ''}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="/path or https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      defaultValue={selectedItem?.background_color || '#3B82F6'}
                      className="w-12 h-10 bg-slate-800 border border-slate-700 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      defaultValue={selectedItem?.background_color || '#3B82F6'}
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      defaultValue={selectedItem?.text_color || '#FFFFFF'}
                      className="w-12 h-10 bg-slate-800 border border-slate-700 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      defaultValue={selectedItem?.text_color || '#FFFFFF'}
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    defaultValue={
                      selectedItem?.start_at ? selectedItem.start_at.slice(0, 16) : ''
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    defaultValue={selectedItem?.end_at ? selectedItem.end_at.slice(0, 16) : ''}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={selectedItem?.is_dismissible ?? true}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-300">Dismissible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={selectedItem?.is_active ?? false}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-300">Active</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowBannerModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ad Slots Management Modal */}
      {showAdSlotsModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Manage Ad Slots</h2>
                <p className="text-sm text-slate-400 mt-1">{selectedItem.title}</p>
              </div>
              <button
                onClick={() => setShowAdSlotsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Current Ad Slots */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Active Ad Slots on This Page</h3>
                {selectedItem.ad_slots && selectedItem.ad_slots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedItem.ad_slots.map((slot: string) => {
                      const slotInfo = AD_SLOT_TYPES.find(s => s.id === slot);
                      return (
                        <div
                          key={slot}
                          className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                              <Megaphone className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{slotInfo?.label || slot}</p>
                              <p className="text-xs text-slate-400">{slotInfo?.description || 'Custom ad slot'}</p>
                            </div>
                          </div>
                          <button className="p-1 text-slate-400 hover:text-red-400" title="Remove slot">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-800/50 border border-dashed border-slate-700 rounded-lg text-center">
                    <p className="text-slate-400">No ad slots configured for this page</p>
                  </div>
                )}
              </div>

              {/* Available Ad Slots */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Available Ad Slot Types</h3>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {AD_SLOT_TYPES.filter(slot => !selectedItem.ad_slots?.includes(slot.id)).map((slot) => (
                    <button
                      key={slot.id}
                      className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-colors text-left"
                    >
                      <div className="p-2 bg-slate-700 rounded-lg">
                        <Plus className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{slot.label}</p>
                        <p className="text-xs text-slate-400">{slot.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ad Slot Settings */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Page Ad Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-sm text-white">Enable ads on this page</span>
                      <p className="text-xs text-slate-400">Allow advertisements to be displayed</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-sm text-white">Premium placement only</span>
                      <p className="text-xs text-slate-400">Only show ads from premium advertisers</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-sm text-white">Track ad impressions</span>
                      <p className="text-xs text-slate-400">Collect analytics data for ad performance</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                {selectedItem.ad_slots?.length || 0} active slot{(selectedItem.ad_slots?.length || 0) !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAdSlotsModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Status Change Modal */}
      {showStatusModal && statusPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Change Page Status</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {statusPage.title} <code className="text-xs text-blue-400 bg-slate-800 px-1 py-0.5 rounded ml-1">/{statusPage.page_key}</code>
                  </p>
                </div>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Current Status */}
              <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-400">Current Status:</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(statusPage.status)}`}>
                  {statusPage.status === 'published' && <Globe className="w-3 h-3" />}
                  {statusPage.status === 'maintenance' && <Wrench className="w-3 h-3" />}
                  {statusPage.status === 'draft' && <Edit className="w-3 h-3" />}
                  {statusPage.status === 'archived' && <EyeOff className="w-3 h-3" />}
                  <span className="capitalize">{statusPage.status}</span>
                </span>
              </div>

              {/* New Status Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Select New Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {PAGE_STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setNewStatus(option.id)}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        newStatus === option.id
                          ? option.color === 'emerald'
                            ? 'bg-emerald-500/20 border-emerald-500 text-white'
                            : option.color === 'amber'
                            ? 'bg-amber-500/20 border-amber-500 text-white'
                            : option.color === 'orange'
                            ? 'bg-orange-500/20 border-orange-500 text-white'
                            : 'bg-slate-500/20 border-slate-500 text-white'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        option.color === 'emerald' ? 'bg-emerald-500/20' :
                        option.color === 'amber' ? 'bg-amber-500/20' :
                        option.color === 'orange' ? 'bg-orange-500/20' : 'bg-slate-700'
                      }`}>
                        <option.icon className={`w-5 h-5 ${
                          option.color === 'emerald' ? 'text-emerald-400' :
                          option.color === 'amber' ? 'text-amber-400' :
                          option.color === 'orange' ? 'text-orange-400' : 'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason Selection (for non-publish statuses) */}
              {newStatus !== 'published' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Reason for Status Change</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_CHANGE_REASONS.map((reason) => (
                      <button
                        key={reason.id}
                        onClick={() => setStatusReason(reason.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                          statusReason === reason.id
                            ? 'bg-blue-500/20 border-blue-500 text-white'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        <reason.icon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{reason.label}</span>
                      </button>
                    ))}
                  </div>
                  {statusReason === 'other' && (
                    <div className="mt-3">
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Please specify the reason..."
                        rows={2}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Maintenance Mode Options */}
              {newStatus === 'maintenance' && (
                <div className="space-y-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Wrench className="w-5 h-5" />
                    <span className="font-medium">Maintenance Mode Settings</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Message shown to visitors..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Redirect URL (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={redirectUrl}
                        onChange={(e) => setRedirectUrl(e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="/alternative-page or https://..."
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      If set, visitors will be automatically redirected to this URL.
                    </p>
                  </div>
                </div>
              )}

              {/* Schedule Options */}
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableSchedule}
                    onChange={(e) => setEnableSchedule(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-white font-medium">Schedule Status Change</span>
                  </div>
                </label>

                {enableSchedule && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">
                        Auto-Publish At
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledPublishAt}
                        onChange={(e) => setScheduledPublishAt(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">Page will go live automatically</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">
                        Auto-Unpublish At
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledUnpublishAt}
                        onChange={(e) => setScheduledUnpublishAt(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">Page will be taken down automatically</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Warning for unpublishing */}
              {statusPage.status === 'published' && newStatus !== 'published' && (
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-200 font-medium">Page Will Be Taken Offline</p>
                    <p className="text-xs text-amber-300/80 mt-1">
                      Visitors will no longer be able to access this page. Make sure you have notified stakeholders before proceeding.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                {statusPage.status !== newStatus ? (
                  <span className="flex items-center gap-2">
                    <span className="capitalize">{statusPage.status}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="capitalize text-white">{newStatus}</span>
                  </span>
                ) : (
                  'No changes'
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={statusChangeLoading || (statusPage.status !== 'published' && newStatus !== 'published' && !statusReason)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    newStatus === 'published'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : newStatus === 'maintenance'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {statusChangeLoading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {newStatus === 'published' ? <Globe className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      {newStatus === 'published' ? 'Publish Page' : 'Update Status'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTab;
