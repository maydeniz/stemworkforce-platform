// ===========================================
// Mentorship Matching Page - College Students
// Connect with industry professionals
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Filter,
  Clock,
  Award,
  Heart,
  Target,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  expertise: string[];
  yearsExp: number;
  rating: number;
  reviews: number;
  bio: string;
  availability: 'open' | 'limited' | 'waitlist';
  responseTime: string;
  mentees: number;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    expertise: ['Backend Development', 'System Design', 'Career Growth'],
    yearsExp: 8,
    rating: 4.9,
    reviews: 47,
    bio: 'Passionate about helping early-career engineers navigate the tech industry. Previously at Amazon and Microsoft.',
    availability: 'open',
    responseTime: '<24 hours',
    mentees: 12,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'ML Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    expertise: ['Machine Learning', 'AI Research', 'PhD Applications'],
    yearsExp: 6,
    rating: 4.8,
    reviews: 32,
    bio: 'Stanford PhD helping students break into AI/ML. Love discussing research ideas and career paths.',
    availability: 'limited',
    responseTime: '2-3 days',
    mentees: 8,
  },
  {
    id: '3',
    name: 'Priya Patel',
    title: 'Engineering Manager',
    company: 'Meta',
    location: 'New York, NY',
    expertise: ['Leadership', 'Product Engineering', 'Women in Tech'],
    yearsExp: 10,
    rating: 5.0,
    reviews: 28,
    bio: 'Transitioned from IC to manager. Happy to chat about career paths, leadership, and navigating tech as a woman.',
    availability: 'open',
    responseTime: '<24 hours',
    mentees: 15,
  },
  {
    id: '4',
    name: 'James Wilson',
    title: 'Quantum Computing Researcher',
    company: 'IBM Quantum',
    location: 'Yorktown Heights, NY',
    expertise: ['Quantum Computing', 'Physics', 'Research Careers'],
    yearsExp: 12,
    rating: 4.7,
    reviews: 19,
    bio: 'PhD physicist exploring the frontiers of quantum computing. Mentor for students interested in research careers.',
    availability: 'waitlist',
    responseTime: '1 week',
    mentees: 5,
  },
];

const EXPERTISE_AREAS = [
  'Software Engineering',
  'Machine Learning',
  'Data Science',
  'Product Management',
  'Hardware Engineering',
  'Research',
  'Leadership',
  'Career Transition',
  'Startup',
  'PhD/Academia',
];

const MENTORSHIP_BENEFITS = [
  { title: 'Career Guidance', description: 'Get personalized advice on career paths and growth opportunities', icon: Target },
  { title: 'Industry Insights', description: "Learn what it's really like to work at top companies", icon: Briefcase },
  { title: 'Network Expansion', description: "Tap into your mentor's professional network", icon: Users },
  { title: 'Skill Development', description: 'Identify and work on skills that matter most', icon: Award },
];

// ===========================================
// COMPONENT
// ===========================================
const MentorshipPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredMentors = MENTORS.filter(mentor => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesExpertise =
      selectedExpertise.length === 0 ||
      mentor.expertise.some(e => selectedExpertise.includes(e));
    return matchesSearch && matchesExpertise;
  });

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise(prev =>
      prev.includes(expertise)
        ? prev.filter(e => e !== expertise)
        : [...prev, expertise]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-gray-950 to-pink-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-rose-400 mb-4">
            <Link to="/college/professional-development" className="hover:underline">Professional Development</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Mentorship</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your
              <span className="text-rose-400"> Mentor</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Connect with experienced professionals who can guide your career journey.
              Get personalized advice, expand your network, and accelerate your growth.
            </p>

            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, company, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/80 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors border border-gray-700"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Expertise Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-900/80 rounded-xl border border-gray-700">
                <span className="text-sm text-gray-400 block mb-3">Filter by Expertise</span>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_AREAS.map(expertise => (
                    <button
                      key={expertise}
                      onClick={() => toggleExpertise(expertise)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedExpertise.includes(expertise)
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {expertise}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {MENTORSHIP_BENEFITS.map((benefit, i) => (
            <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
              <benefit.icon className="w-8 h-8 text-rose-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Mentor Listings */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {filteredMentors.length} Mentors Available
          </h2>
          <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
            <option>Sort by: Rating</option>
            <option>Sort by: Experience</option>
            <option>Sort by: Availability</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredMentors.map(mentor => (
            <div
              key={mentor.id}
              className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{mentor.name}</h3>
                      <p className="text-gray-400">{mentor.title}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {mentor.company}
                        <span className="mx-1">•</span>
                        <MapPin className="w-3 h-3" />
                        {mentor.location}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      mentor.availability === 'open' ? 'bg-green-500/10 text-green-400' :
                      mentor.availability === 'limited' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {mentor.availability === 'open' ? 'Open' :
                       mentor.availability === 'limited' ? 'Limited' : 'Waitlist'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mt-3 line-clamp-2">{mentor.bio}</p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {mentor.expertise.map((exp, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                        {exp}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800 text-sm">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      {mentor.rating} ({mentor.reviews})
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mentor.responseTime}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {mentor.mentees} mentees
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {mentor.yearsExp} years
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors">
                  Request Mentorship
                </button>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors border border-gray-700">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How Mentorship Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Browse Mentors', desc: 'Find mentors that match your goals and interests' },
              { step: 2, title: 'Request Match', desc: 'Send a personalized request explaining your goals' },
              { step: 3, title: 'Get Matched', desc: 'Once accepted, schedule your first session' },
              { step: 4, title: 'Grow Together', desc: 'Meet regularly and track your progress' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Mentor CTA */}
        <div className="mt-16 bg-gradient-to-r from-rose-900/30 to-pink-900/30 rounded-2xl border border-rose-500/20 p-12 text-center">
          <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Want to Give Back?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Share your experience and help the next generation of STEM professionals.
            Mentoring is rewarding and looks great on your profile.
          </p>
          <button className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors">
            Become a Mentor
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorshipPage;
