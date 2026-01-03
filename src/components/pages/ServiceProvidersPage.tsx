// ===========================================
// Service Providers Marketplace Page
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Star, MapPin, Clock, DollarSign, CheckCircle2,
  Users, Briefcase, GraduationCap, Award, Cpu, Factory, Shield,
  Compass, FileText, MessageSquare, ArrowRight, Sparkles
} from 'lucide-react';

// ===========================================
// PROVIDER CATEGORIES
// ===========================================

const PROVIDER_CATEGORIES = [
  { id: 'all', name: 'All Providers', icon: Users, color: 'slate', count: 0 },
  { id: 'career_coaching', name: 'Career Coaching', icon: Compass, color: 'violet', count: 0 },
  { id: 'resume_services', name: 'Resume Services', icon: FileText, color: 'blue', count: 0 },
  { id: 'interview_prep', name: 'Interview Prep', icon: MessageSquare, color: 'emerald', count: 0 },
  { id: 'executive_coaching', name: 'Executive Coaching', icon: Award, color: 'amber', count: 0 },
  { id: 'ai_transformation', name: 'AI Transformation', icon: Cpu, color: 'cyan', count: 0 },
  { id: 'manufacturing', name: 'Manufacturing Automation', icon: Factory, color: 'orange', count: 0 },
  { id: 'leadership', name: 'Leadership Development', icon: Users, color: 'pink', count: 0 },
  { id: 'federal', name: 'Federal/Government', icon: Shield, color: 'slate', count: 0 },
  { id: 'stem_education', name: 'STEM Education', icon: GraduationCap, color: 'indigo', count: 0 },
];

// ===========================================
// SAMPLE PROVIDERS
// ===========================================

interface Provider {
  id: string;
  name: string;
  title: string;
  category: string;
  specialties: string[];
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  location: string;
  availability: 'available' | 'busy' | 'limited';
  isVerified: boolean;
  isFeatured: boolean;
  responseTime: string;
  languages: string[];
  imageUrl?: string;
  industries: string[];
}

const SAMPLE_PROVIDERS: Provider[] = [
  // Career Coaching
  {
    id: 'p1',
    name: 'Dr. Sarah Mitchell',
    title: 'Executive Career Strategist',
    category: 'career_coaching',
    specialties: ['Career Transitions', 'Executive Placement', 'Salary Negotiation'],
    bio: 'Former VP of Talent at Fortune 100 companies. Helped 500+ executives land C-suite positions.',
    hourlyRate: 350,
    rating: 4.9,
    reviewCount: 156,
    sessionsCompleted: 423,
    location: 'San Francisco, CA',
    availability: 'limited',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 2 hours',
    languages: ['English', 'Spanish'],
    industries: ['Technology', 'Finance', 'Healthcare'],
  },
  {
    id: 'p2',
    name: 'Michael Chen',
    title: 'Tech Career Coach',
    category: 'career_coaching',
    specialties: ['FAANG Preparation', 'Career Pivots', 'Tech Leadership'],
    bio: 'Ex-Google Engineering Manager. Specialized in helping engineers break into top tech companies.',
    hourlyRate: 275,
    rating: 4.8,
    reviewCount: 234,
    sessionsCompleted: 567,
    location: 'Seattle, WA',
    availability: 'available',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 1 hour',
    languages: ['English', 'Mandarin'],
    industries: ['Technology', 'Startups'],
  },
  {
    id: 'p3',
    name: 'Jennifer Adams',
    title: 'Federal Career Specialist',
    category: 'career_coaching',
    specialties: ['Federal Resume Writing', 'GS Level Advancement', 'Security Clearance Jobs'],
    bio: '20+ years in federal HR. Expert in USAJobs optimization and federal hiring processes.',
    hourlyRate: 195,
    rating: 4.9,
    reviewCount: 89,
    sessionsCompleted: 312,
    location: 'Washington, DC',
    availability: 'available',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 4 hours',
    languages: ['English'],
    industries: ['Government', 'Defense', 'Intelligence'],
  },

  // Resume Services
  {
    id: 'p4',
    name: 'Emily Rodriguez',
    title: 'Certified Professional Resume Writer',
    category: 'resume_services',
    specialties: ['Executive Resumes', 'LinkedIn Optimization', 'Cover Letters'],
    bio: 'CPRW certified with 12 years experience. Clients have landed at Apple, Microsoft, and Amazon.',
    hourlyRate: 150,
    rating: 4.9,
    reviewCount: 412,
    sessionsCompleted: 1250,
    location: 'Austin, TX',
    availability: 'available',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 3 hours',
    languages: ['English', 'Portuguese'],
    industries: ['Technology', 'Finance', 'Healthcare'],
  },
  {
    id: 'p5',
    name: 'David Park',
    title: 'Technical Resume Specialist',
    category: 'resume_services',
    specialties: ['Software Engineering Resumes', 'Data Science CVs', 'Technical Portfolios'],
    bio: 'Former tech recruiter at Stripe and Airbnb. I know exactly what hiring managers want to see.',
    hourlyRate: 175,
    rating: 4.7,
    reviewCount: 189,
    sessionsCompleted: 456,
    location: 'New York, NY',
    availability: 'busy',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 6 hours',
    languages: ['English', 'Korean'],
    industries: ['Technology', 'Fintech'],
  },

  // Interview Prep
  {
    id: 'p6',
    name: 'James Wilson',
    title: 'Technical Interview Coach',
    category: 'interview_prep',
    specialties: ['System Design', 'Coding Interviews', 'Behavioral Questions'],
    bio: 'Staff Engineer at Meta. Conducted 300+ interviews. 85% of my clients receive offers.',
    hourlyRate: 225,
    rating: 4.9,
    reviewCount: 167,
    sessionsCompleted: 389,
    location: 'Menlo Park, CA',
    availability: 'limited',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 2 hours',
    languages: ['English'],
    industries: ['Technology', 'AI/ML'],
  },
  {
    id: 'p7',
    name: 'Aisha Patel',
    title: 'Product Management Interview Expert',
    category: 'interview_prep',
    specialties: ['PM Case Studies', 'Product Sense', 'Leadership Principles'],
    bio: 'Director of Product at Uber. Expert in preparing candidates for PM roles at FAANG companies.',
    hourlyRate: 250,
    rating: 4.8,
    reviewCount: 98,
    sessionsCompleted: 234,
    location: 'San Francisco, CA',
    availability: 'available',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 4 hours',
    languages: ['English', 'Hindi'],
    industries: ['Technology', 'E-commerce'],
  },

  // Executive Coaching
  {
    id: 'p8',
    name: 'Robert Thompson',
    title: 'CEO & Board Advisor',
    category: 'executive_coaching',
    specialties: ['C-Suite Transitions', 'Board Readiness', 'Strategic Leadership'],
    bio: 'Former Fortune 500 CEO. Executive coach to 50+ current C-level executives.',
    hourlyRate: 500,
    rating: 5.0,
    reviewCount: 45,
    sessionsCompleted: 178,
    location: 'New York, NY',
    availability: 'limited',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 24 hours',
    languages: ['English'],
    industries: ['Finance', 'Manufacturing', 'Healthcare'],
  },
  {
    id: 'p9',
    name: 'Dr. Linda Washington',
    title: 'Leadership Psychologist',
    category: 'executive_coaching',
    specialties: ['Executive Presence', 'Emotional Intelligence', 'Conflict Resolution'],
    bio: 'PhD in Organizational Psychology. Marshall Goldsmith certified coach.',
    hourlyRate: 375,
    rating: 4.9,
    reviewCount: 67,
    sessionsCompleted: 289,
    location: 'Chicago, IL',
    availability: 'available',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 6 hours',
    languages: ['English', 'French'],
    industries: ['Healthcare', 'Education', 'Non-profit'],
  },

  // AI Transformation
  {
    id: 'p10',
    name: 'Dr. Alex Kumar',
    title: 'AI Strategy Consultant',
    category: 'ai_transformation',
    specialties: ['AI Implementation', 'ML Strategy', 'Digital Transformation'],
    bio: 'Former Head of AI at IBM. Helped 100+ enterprises deploy AI solutions.',
    hourlyRate: 400,
    rating: 4.8,
    reviewCount: 78,
    sessionsCompleted: 156,
    location: 'Boston, MA',
    availability: 'available',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 4 hours',
    languages: ['English', 'Hindi'],
    industries: ['Technology', 'Finance', 'Healthcare'],
  },
  {
    id: 'p11',
    name: 'Rachel Sterling',
    title: 'Generative AI Consultant',
    category: 'ai_transformation',
    specialties: ['LLM Integration', 'Prompt Engineering', 'AI Ethics'],
    bio: 'OpenAI research alumna. Specializing in enterprise GPT implementations.',
    hourlyRate: 350,
    rating: 4.9,
    reviewCount: 56,
    sessionsCompleted: 123,
    location: 'San Francisco, CA',
    availability: 'busy',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 2 hours',
    languages: ['English'],
    industries: ['Technology', 'Media', 'Legal'],
  },

  // Manufacturing Automation
  {
    id: 'p12',
    name: 'Hans Mueller',
    title: 'Industry 4.0 Specialist',
    category: 'manufacturing',
    specialties: ['Smart Factory', 'IoT Integration', 'Process Automation'],
    bio: 'Former Siemens automation director. 25 years in advanced manufacturing.',
    hourlyRate: 325,
    rating: 4.7,
    reviewCount: 45,
    sessionsCompleted: 89,
    location: 'Detroit, MI',
    availability: 'available',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 6 hours',
    languages: ['English', 'German'],
    industries: ['Automotive', 'Aerospace', 'Electronics'],
  },
  {
    id: 'p13',
    name: 'Maria Santos',
    title: 'Robotics Implementation Expert',
    category: 'manufacturing',
    specialties: ['Collaborative Robots', 'Quality Automation', 'Lean Manufacturing'],
    bio: 'Led automation projects for Toyota and Boeing. Six Sigma Black Belt.',
    hourlyRate: 295,
    rating: 4.8,
    reviewCount: 34,
    sessionsCompleted: 67,
    location: 'Phoenix, AZ',
    availability: 'available',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 4 hours',
    languages: ['English', 'Spanish'],
    industries: ['Automotive', 'Consumer Goods', 'Medical Devices'],
  },

  // Leadership Development
  {
    id: 'p14',
    name: 'Marcus Johnson',
    title: 'Leadership Development Coach',
    category: 'leadership',
    specialties: ['First-Time Managers', 'Team Building', 'Performance Management'],
    bio: 'Trained 5000+ managers at Google, Meta, and Netflix.',
    hourlyRate: 225,
    rating: 4.9,
    reviewCount: 234,
    sessionsCompleted: 678,
    location: 'Los Angeles, CA',
    availability: 'available',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 2 hours',
    languages: ['English'],
    industries: ['Technology', 'Entertainment', 'Retail'],
  },
  {
    id: 'p15',
    name: 'Dr. Patricia Lee',
    title: 'Organizational Development Consultant',
    category: 'leadership',
    specialties: ['Change Management', 'Culture Transformation', 'DEI Strategy'],
    bio: 'Harvard Business School researcher. Expert in building high-performing teams.',
    hourlyRate: 300,
    rating: 4.8,
    reviewCount: 89,
    sessionsCompleted: 234,
    location: 'Boston, MA',
    availability: 'limited',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 8 hours',
    languages: ['English', 'Korean'],
    industries: ['Healthcare', 'Education', 'Technology'],
  },

  // Federal/Government
  {
    id: 'p16',
    name: 'Col. (Ret.) Thomas Wright',
    title: 'Defense Industry Transition Coach',
    category: 'federal',
    specialties: ['Military to Civilian', 'Clearance Jobs', 'Defense Contractors'],
    bio: '30 years in DoD. Now helping veterans transition to civilian careers.',
    hourlyRate: 175,
    rating: 4.9,
    reviewCount: 156,
    sessionsCompleted: 456,
    location: 'Virginia Beach, VA',
    availability: 'available',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 3 hours',
    languages: ['English'],
    industries: ['Defense', 'Intelligence', 'Aerospace'],
  },
  {
    id: 'p17',
    name: 'Sandra Collins',
    title: 'Government Consulting Expert',
    category: 'federal',
    specialties: ['SES Applications', 'Federal Contracting', 'Proposal Writing'],
    bio: 'Former SES at DHS. Expert in federal career advancement and government consulting.',
    hourlyRate: 225,
    rating: 4.8,
    reviewCount: 67,
    sessionsCompleted: 189,
    location: 'Washington, DC',
    availability: 'available',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 4 hours',
    languages: ['English'],
    industries: ['Government', 'Consulting'],
  },

  // STEM Education
  {
    id: 'p18',
    name: 'Dr. Kevin Zhang',
    title: 'STEM Education Consultant',
    category: 'stem_education',
    specialties: ['Curriculum Development', 'EdTech Implementation', 'Teacher Training'],
    bio: 'MIT PhD in Education Technology. Built STEM programs for 100+ schools.',
    hourlyRate: 200,
    rating: 4.9,
    reviewCount: 78,
    sessionsCompleted: 234,
    location: 'Cambridge, MA',
    availability: 'available',
    isVerified: true,
    isFeatured: true,
    responseTime: '< 4 hours',
    languages: ['English', 'Mandarin'],
    industries: ['Education', 'EdTech', 'Non-profit'],
  },
  {
    id: 'p19',
    name: 'Amanda Foster',
    title: 'K-12 STEM Program Designer',
    category: 'stem_education',
    specialties: ['Hands-on Learning', 'Project-Based Curriculum', 'Competition Prep'],
    bio: 'Former FIRST Robotics mentor. National Science Teaching Association fellow.',
    hourlyRate: 150,
    rating: 4.7,
    reviewCount: 45,
    sessionsCompleted: 123,
    location: 'Denver, CO',
    availability: 'available',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 6 hours',
    languages: ['English', 'Spanish'],
    industries: ['Education', 'Non-profit'],
  },

  // More diverse providers
  {
    id: 'p20',
    name: 'Yuki Tanaka',
    title: 'Quantum Computing Career Advisor',
    category: 'career_coaching',
    specialties: ['Quantum Industry', 'Research to Industry', 'PhD Careers'],
    bio: 'Former IBM Quantum researcher. Helping scientists transition to industry roles.',
    hourlyRate: 275,
    rating: 4.8,
    reviewCount: 34,
    sessionsCompleted: 78,
    location: 'Boulder, CO',
    availability: 'available',
    isVerified: true,
    isFeatured: false,
    responseTime: '< 4 hours',
    languages: ['English', 'Japanese'],
    industries: ['Technology', 'Research', 'Quantum Computing'],
  },
];

// ===========================================
// PROVIDER CARD COMPONENT
// ===========================================

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const categoryData = PROVIDER_CATEGORIES.find(c => c.id === provider.category);
  const categoryColor = categoryData?.color || 'slate';

  const getAvailabilityStyle = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'limited':
        return 'bg-amber-500/20 text-amber-400';
      case 'busy':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Available Now';
      case 'limited':
        return 'Limited Availability';
      case 'busy':
        return 'Fully Booked';
      default:
        return 'Unknown';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group">
      {/* Header with gradient */}
      <div className={`h-24 bg-gradient-to-br from-${categoryColor}-500/30 to-${categoryColor}-600/10 relative`}>
        {provider.isFeatured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
            <Sparkles size={12} />
            Featured
          </div>
        )}

        {/* Avatar */}
        <div className="absolute -bottom-10 left-5">
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br from-${categoryColor}-500 to-${categoryColor}-600 flex items-center justify-center text-white font-bold text-xl border-4 border-slate-900 shadow-lg`}>
            {getInitials(provider.name)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 px-5 pb-5">
        {/* Name and verification */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
              {provider.isVerified && (
                <CheckCircle2 size={16} className="text-blue-400" />
              )}
            </div>
            <p className="text-sm text-slate-400">{provider.title}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="font-semibold text-white">{provider.rating}</span>
            <span className="text-slate-500 text-sm">({provider.reviewCount})</span>
          </div>
        </div>

        {/* Location and response time */}
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {provider.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {provider.responseTime}
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-300 mb-4 line-clamp-2">{provider.bio}</p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {provider.specialties.slice(0, 3).map((specialty, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 bg-${categoryColor}-500/10 text-${categoryColor}-400 text-xs rounded-md`}
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between py-3 border-t border-slate-800">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-slate-400">
              <Briefcase size={14} />
              {provider.sessionsCompleted} sessions
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAvailabilityStyle(provider.availability)}`}>
              {getAvailabilityText(provider.availability)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-white font-semibold">
            <DollarSign size={16} />
            {provider.hourlyRate}/hr
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <Link
            to={`/service-providers/${provider.id}`}
            className="flex-1 text-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            View Profile
          </Link>
          <Link
            to={`/service-providers/${provider.id}?book=true`}
            className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            Book Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN PAGE COMPONENT
// ===========================================

const ServiceProvidersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'reviews'>('rating');

  // Calculate category counts
  const categoriesWithCounts = useMemo(() => {
    return PROVIDER_CATEGORIES.map(cat => ({
      ...cat,
      count: cat.id === 'all'
        ? SAMPLE_PROVIDERS.length
        : SAMPLE_PROVIDERS.filter(p => p.category === cat.id).length
    }));
  }, []);

  // Filter and sort providers
  const filteredProviders = useMemo(() => {
    let filtered = SAMPLE_PROVIDERS;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.specialties.some(s => s.toLowerCase().includes(query)) ||
        p.industries.some(i => i.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  // Stats
  const stats = useMemo(() => ({
    totalProviders: SAMPLE_PROVIDERS.length,
    avgRating: (SAMPLE_PROVIDERS.reduce((sum, p) => sum + p.rating, 0) / SAMPLE_PROVIDERS.length).toFixed(1),
    totalSessions: SAMPLE_PROVIDERS.reduce((sum, p) => sum + p.sessionsCompleted, 0),
    availableNow: SAMPLE_PROVIDERS.filter(p => p.availability === 'available').length,
  }), []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-violet-900/40 via-slate-900 to-slate-950 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Expert <span className="text-violet-400">Service Providers</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Connect with career coaches, consultants, and industry experts to accelerate your career
              and help your organization thrive in the STEM workforce.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">{stats.totalProviders}+</div>
              <div className="text-sm text-slate-400">Expert Providers</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white flex items-center justify-center gap-1">
                {stats.avgRating}
                <Star size={20} className="text-amber-400 fill-amber-400" />
              </div>
              <div className="text-sm text-slate-400">Average Rating</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">{stats.totalSessions.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Sessions Completed</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">{stats.availableNow}</div>
              <div className="text-sm text-slate-400">Available Now</div>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, specialty, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {categoriesWithCounts.map((category) => {
              const CategoryIcon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                    isSelected
                      ? `bg-${category.color}-500/20 text-${category.color}-400 border border-${category.color}-500/30`
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <CategoryIcon size={18} />
                  <span className="font-medium">{category.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected ? `bg-${category.color}-500/30` : 'bg-slate-800'
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort and Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <p className="text-slate-400">
            Showing <span className="text-white font-medium">{filteredProviders.length}</span> providers
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Provider Grid */}
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No providers found</h3>
            <p className="text-slate-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Become a Provider CTA */}
        <div className="mt-16 bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 border border-violet-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Are you an expert in your field?
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Join our marketplace as a service provider and connect with thousands of
            job seekers and organizations looking for your expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=service_provider"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              Become a Provider
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProvidersPage;
