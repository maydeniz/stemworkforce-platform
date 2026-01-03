// ===========================================
// Service Provider Profile Page
// ===========================================

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Star, MapPin, Clock, CheckCircle2, Calendar,
  Users, Briefcase, GraduationCap, Award, MessageSquare,
  ArrowLeft, Share2, Heart, Globe, Phone,
  CheckCircle, XCircle, Zap,
  ThumbsUp, Video
} from 'lucide-react';

// ===========================================
// SAMPLE DATA (Would come from database)
// ===========================================

interface Service {
  id: string;
  title: string;
  description: string;
  pricingType: 'hourly' | 'fixed' | 'package';
  price: number;
  duration?: number;
  deliverables?: string[];
  popular?: boolean;
}

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  helpful: number;
  response?: string;
  responseDate?: string;
}

interface ProviderProfile {
  id: string;
  name: string;
  title: string;
  category: string;
  categoryLabel: string;
  specialties: string[];
  bio: string;
  fullBio: string;
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
  industries: string[];
  yearsExperience: number;
  education: string[];
  certifications: string[];
  services: Service[];
  reviews: Review[];
  availableSlots: { date: string; times: string[] }[];
}

const SAMPLE_PROVIDER: ProviderProfile = {
  id: 'p1',
  name: 'Dr. Sarah Mitchell',
  title: 'Executive Career Strategist',
  category: 'career_coaching',
  categoryLabel: 'Career Coaching',
  specialties: ['Career Transitions', 'Executive Placement', 'Salary Negotiation', 'Personal Branding', 'C-Suite Coaching'],
  bio: 'Former VP of Talent at Fortune 100 companies. Helped 500+ executives land C-suite positions.',
  fullBio: `I bring over 20 years of experience in executive talent management, having served as VP of Talent Acquisition at three Fortune 100 companies including Microsoft, Deloitte, and Johnson & Johnson.

My approach combines deep industry knowledge with personalized coaching strategies. I understand what hiring committees look for because I've sat on hundreds of them. My clients have secured positions at companies like Google, Amazon, Meta, McKinsey, and Goldman Sachs.

What sets me apart:
• Direct experience hiring C-suite executives
• Deep network across technology, finance, and healthcare sectors
• Data-driven approach to salary negotiations (average 35% increase)
• Proven track record with career changers entering new industries

I'm passionate about helping driven professionals reach their full potential. Whether you're eyeing your first executive role or transitioning industries, I provide the strategic guidance and accountability you need to succeed.`,
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
  industries: ['Technology', 'Finance', 'Healthcare', 'Consulting'],
  yearsExperience: 20,
  education: [
    'PhD in Organizational Psychology - Stanford University',
    'MBA - Wharton School of Business',
    'BS in Business Administration - UCLA',
  ],
  certifications: [
    'Certified Executive Coach (ICF PCC)',
    'Marshall Goldsmith Stakeholder Centered Coaching',
    'Hogan Assessment Certified',
    'SHRM Senior Certified Professional',
  ],
  services: [
    {
      id: 's1',
      title: 'Executive Career Strategy Session',
      description: 'One-on-one strategy session to map out your executive career trajectory and identify key moves.',
      pricingType: 'hourly',
      price: 350,
      duration: 60,
      popular: true,
    },
    {
      id: 's2',
      title: 'Resume & LinkedIn Transformation',
      description: 'Complete overhaul of your executive resume and LinkedIn profile to attract recruiters.',
      pricingType: 'fixed',
      price: 1500,
      deliverables: ['Executive resume rewrite', 'LinkedIn profile optimization', 'Cover letter template', '2 revision rounds'],
    },
    {
      id: 's3',
      title: 'Interview Preparation Intensive',
      description: 'Mock interviews with detailed feedback for executive-level positions.',
      pricingType: 'package',
      price: 2500,
      deliverables: ['4 mock interview sessions', 'Behavioral question preparation', 'Case study coaching', 'Presentation review'],
      popular: true,
    },
    {
      id: 's4',
      title: 'Salary Negotiation Coaching',
      description: 'Strategic coaching to maximize your compensation package.',
      pricingType: 'fixed',
      price: 800,
      deliverables: ['Market rate analysis', 'Negotiation strategy session', 'Offer review & guidance', 'Counter-offer support'],
    },
    {
      id: 's5',
      title: '90-Day Executive Transition Program',
      description: 'Comprehensive program for executives making major career transitions.',
      pricingType: 'package',
      price: 8500,
      deliverables: ['12 coaching sessions', 'Resume & LinkedIn optimization', 'Interview preparation', 'Salary negotiation', 'Onboarding coaching'],
    },
  ],
  reviews: [
    {
      id: 'r1',
      reviewerName: 'Michael R.',
      rating: 5,
      title: 'Landed my dream role at Google',
      text: 'Sarah\'s coaching was transformative. After 6 sessions, I went from a senior director to VP at a FAANG company. Her insights into executive hiring were invaluable.',
      date: '2024-12-15',
      helpful: 24,
      response: 'Thank you Michael! It was wonderful working with you. Your dedication to the process made all the difference.',
      responseDate: '2024-12-16',
    },
    {
      id: 'r2',
      reviewerName: 'Jennifer T.',
      rating: 5,
      title: 'Worth every penny',
      text: 'I was skeptical about paying $350/hour but Sarah delivered. She helped me negotiate a 45% salary increase on my new role. ROI was incredible.',
      date: '2024-11-28',
      helpful: 18,
    },
    {
      id: 'r3',
      reviewerName: 'David K.',
      rating: 5,
      title: 'Expert guidance for career changers',
      text: 'Transitioning from finance to tech seemed impossible until I worked with Sarah. Her network and strategic approach opened doors I didn\'t know existed.',
      date: '2024-11-10',
      helpful: 15,
    },
    {
      id: 'r4',
      reviewerName: 'Lisa M.',
      rating: 4,
      title: 'Great coaching, limited availability',
      text: 'Sarah is exceptional at what she does. The only downside is her limited availability - had to wait 2 weeks to start. But worth the wait.',
      date: '2024-10-22',
      helpful: 8,
    },
    {
      id: 'r5',
      reviewerName: 'Robert S.',
      rating: 5,
      title: 'Best investment in my career',
      text: 'After working with Sarah, I secured a C-suite position 6 months ahead of my timeline. Her understanding of what boards look for is unmatched.',
      date: '2024-10-05',
      helpful: 22,
    },
  ],
  availableSlots: [
    { date: '2025-01-06', times: ['10:00 AM', '2:00 PM', '4:00 PM'] },
    { date: '2025-01-07', times: ['9:00 AM', '11:00 AM', '3:00 PM'] },
    { date: '2025-01-08', times: ['10:00 AM', '1:00 PM'] },
    { date: '2025-01-09', times: ['2:00 PM', '4:00 PM'] },
    { date: '2025-01-10', times: ['9:00 AM', '10:00 AM', '3:00 PM'] },
  ],
};

// ===========================================
// COMPONENTS
// ===========================================

const ServiceProviderProfilePage: React.FC = () => {
  const { providerId: _providerId } = useParams<{ providerId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Auto-open booking modal if ?book=true is in URL
  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      setShowBookingModal(true);
      // Remove the query param to clean up URL
      searchParams.delete('book');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // In a real app, fetch provider by ID
  const provider = SAMPLE_PROVIDER;

  const getAvailabilityStyle = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'limited':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'busy':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    provider.reviews.forEach(r => {
      dist[r.rating as keyof typeof dist]++;
    });
    return dist;
  }, [provider.reviews]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Back navigation */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/service-providers"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Providers
          </Link>
        </div>
      </div>

      {/* Provider Header */}
      <div className="bg-gradient-to-br from-violet-900/30 via-slate-900 to-slate-950 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Avatar and quick info */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg border-4 border-slate-800">
                {getInitials(provider.name)}
              </div>
            </div>

            {/* Center: Main info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{provider.name}</h1>
                    {provider.isVerified && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        <CheckCircle2 size={14} />
                        Verified
                      </span>
                    )}
                    {provider.isFeatured && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                        <Zap size={14} />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-slate-300 mb-3">{provider.title}</p>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {provider.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={16} />
                      {provider.yearsExperience} years experience
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe size={16} />
                      {provider.languages.join(', ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      Responds {provider.responseTime}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-amber-400 fill-amber-400" />
                      <span className="text-xl font-bold text-white">{provider.rating}</span>
                      <span className="text-slate-400">({provider.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users size={18} />
                      <span>{provider.sessionsCompleted} sessions completed</span>
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="hidden lg:flex items-center gap-3">
                  <button className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <Heart size={20} className="text-slate-400" />
                  </button>
                  <button className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <Share2 size={20} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mt-4">
                {provider.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-violet-500/10 text-violet-400 text-sm rounded-lg border border-violet-500/20"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Booking card */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-white">${provider.hourlyRate}</div>
                    <div className="text-sm text-slate-400">per hour</div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getAvailabilityStyle(provider.availability)}`}>
                    {getAvailabilityText(provider.availability)}
                  </span>
                </div>

                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <Calendar size={18} />
                  Book a Session
                </button>

                <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  Send Message
                </button>

                {/* Quick slots */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-3">Next available slots:</p>
                  <div className="space-y-2">
                    {provider.availableSlots.slice(0, 2).map((slot, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{formatDate(slot.date)}</span>
                        <span className="text-violet-400">{slot.times[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'about', label: 'About', icon: Users },
              { id: 'services', label: 'Services', icon: Briefcase, count: provider.services.length },
              { id: 'reviews', label: 'Reviews', icon: Star, count: provider.reviewCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                {/* Bio */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                  <div className="prose prose-invert max-w-none">
                    {provider.fullBio.split('\n\n').map((para, idx) => (
                      <p key={idx} className="text-slate-300 mb-4 whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Education</h2>
                  <div className="space-y-3">
                    {provider.education.map((edu, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <GraduationCap size={18} className="text-violet-400 mt-1 flex-shrink-0" />
                        <span className="text-slate-300">{edu}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Certifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {provider.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-900 border border-slate-800 rounded-lg p-3">
                        <Award size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Industry Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {provider.industries.map((industry, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-sm"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Services Offered</h2>
                {provider.services.map((service) => (
                  <div
                    key={service.id}
                    className={`bg-slate-900 border rounded-xl p-5 transition-all cursor-pointer ${
                      selectedService === service.id
                        ? 'border-violet-500'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                          {service.popular && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{service.description}</p>

                        {selectedService === service.id && service.deliverables && (
                          <div className="mt-4 pt-4 border-t border-slate-800">
                            <p className="text-sm font-medium text-slate-300 mb-2">What's included:</p>
                            <ul className="space-y-2">
                              {service.deliverables.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                                  <CheckCircle size={14} className="text-emerald-400" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-white">${service.price.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">
                          {service.pricingType === 'hourly' && `${service.duration} min session`}
                          {service.pricingType === 'fixed' && 'Fixed price'}
                          {service.pricingType === 'package' && 'Package'}
                        </div>
                      </div>
                    </div>

                    {selectedService === service.id && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBookingModal(true);
                          }}
                          className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors"
                        >
                          Book This Service
                        </button>
                        <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
                          Ask Question
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {/* Rating summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white">{provider.rating}</div>
                      <div className="flex items-center justify-center gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            className={star <= Math.round(provider.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-slate-400">{provider.reviewCount} reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-slate-400 w-12">{rating} star</span>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / provider.reviews.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-500 w-8">
                            {ratingDistribution[rating as keyof typeof ratingDistribution]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review list */}
                <h2 className="text-xl font-semibold text-white mb-4">Client Reviews</h2>
                <div className="space-y-4">
                  {provider.reviews.map((review) => (
                    <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{review.reviewerName}</span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500">{formatDate(review.date)}</p>
                        </div>
                      </div>
                      <h4 className="font-medium text-white mb-2">{review.title}</h4>
                      <p className="text-slate-300 text-sm">{review.text}</p>

                      {review.response && (
                        <div className="mt-4 pl-4 border-l-2 border-violet-500/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-violet-400">Provider Response</span>
                            <span className="text-xs text-slate-500">{formatDate(review.responseDate!)}</span>
                          </div>
                          <p className="text-sm text-slate-400">{review.response}</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                          <ThumbsUp size={14} />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (visible on desktop for about/services tabs) */}
          {activeTab !== 'reviews' && (
            <div className="hidden lg:block">
              <div className="sticky top-32 space-y-6">
                {/* Quick facts */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Response Time</span>
                      <span className="text-white">{provider.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Experience</span>
                      <span className="text-white">{provider.yearsExperience} years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Sessions</span>
                      <span className="text-white">{provider.sessionsCompleted}+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Languages</span>
                      <span className="text-white">{provider.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Session types */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Session Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Video size={18} className="text-violet-400" />
                      <span className="text-slate-300">Video Call (Zoom/Meet)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={18} className="text-violet-400" />
                      <span className="text-slate-300">Phone Call</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MessageSquare size={18} className="text-violet-400" />
                      <span className="text-slate-300">Chat/Messaging</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal Placeholder */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Book a Session</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-300 mb-4">
                Select a date and time to book a session with {provider.name}.
              </p>
              <div className="space-y-3 mb-6">
                {provider.availableSlots.slice(0, 3).map((slot, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-lg p-4">
                    <div className="font-medium text-white mb-2">{formatDate(slot.date)}</div>
                    <div className="flex flex-wrap gap-2">
                      {slot.times.map((time, tidx) => (
                        <button
                          key={tidx}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-violet-600 text-slate-300 hover:text-white rounded-lg text-sm transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors">
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderProfilePage;
