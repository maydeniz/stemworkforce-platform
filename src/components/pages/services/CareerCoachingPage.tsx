// ===========================================
// Career Coaching Services Page
// Professional career coaching and guidance
// for STEM professionals
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Calendar,
  Phone,
  Mail,
  Rocket,
  Heart,
  DollarSign,
  BadgeCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface CoachingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  sessions: number;
  features: string[];
  popular?: boolean;
}

interface Coach {
  id: string;
  name: string;
  title: string;
  specialty: string;
  background: string;
  certifications: string[];
  rating: number;
  reviews: number;
  clients: number;
  hourlyRate: number;
  availability: 'available' | 'limited' | 'waitlist';
  image: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  outcome: string;
  image: string;
}

interface CoachingFocus {
  title: string;
  description: string;
  icon: React.ElementType;
  topics: string[];
}

// ===========================================
// Data
// ===========================================

const coachingPackages: CoachingPackage[] = [
  {
    id: 'starter',
    name: 'Career Clarity',
    description: 'Perfect for professionals seeking direction or exploring new paths in STEM.',
    price: 997,
    duration: '4 weeks',
    sessions: 4,
    features: [
      '4 x 60-min coaching sessions',
      'Career assessment battery',
      'Skills inventory analysis',
      'Career path mapping',
      'Industry insights report',
      'Email support between sessions',
    ],
  },
  {
    id: 'professional',
    name: 'Career Accelerator',
    description: 'Comprehensive coaching for professionals ready to level up their careers.',
    price: 2497,
    duration: '8 weeks',
    sessions: 8,
    features: [
      '8 x 60-min coaching sessions',
      'Everything in Career Clarity',
      'Resume & LinkedIn optimization',
      'Interview preparation',
      'Salary negotiation coaching',
      'Networking strategy development',
      'Personal brand development',
      '30-day post-program support',
    ],
    popular: true,
  },
  {
    id: 'executive',
    name: 'Executive Transition',
    description: 'High-touch coaching for senior leaders navigating complex career decisions.',
    price: 4997,
    duration: '12 weeks',
    sessions: 12,
    features: [
      '12 x 60-min coaching sessions',
      'Everything in Career Accelerator',
      'Executive presence coaching',
      'Board-ready materials development',
      'Executive recruiter introductions',
      'Leadership assessment (360)',
      'Strategic networking plan',
      'Ongoing advisory relationship',
      '90-day post-program support',
    ],
  },
];

const coaches: Coach[] = [
  {
    id: 'coach-1',
    name: 'Dr. Michelle Anderson',
    title: 'Executive Career Coach',
    specialty: 'C-Suite & Leadership Transitions',
    background: 'Former VP Engineering at Google; Executive coach for 10+ years',
    certifications: ['ICF PCC', 'Marshall Goldsmith Certified', 'Hogan Assessment'],
    rating: 4.98,
    reviews: 156,
    clients: 400,
    hourlyRate: 450,
    availability: 'limited',
    image: '/images/coaches/michelle.jpg',
  },
  {
    id: 'coach-2',
    name: 'James Wilson',
    title: 'Career Transition Specialist',
    specialty: 'Defense-to-Commercial Transitions',
    background: 'Former defense program manager; Helped 500+ cleared professionals transition',
    certifications: ['ICF ACC', 'Career Development Facilitator', 'MBTI Certified'],
    rating: 4.95,
    reviews: 234,
    clients: 520,
    hourlyRate: 350,
    availability: 'available',
    image: '/images/coaches/james.jpg',
  },
  {
    id: 'coach-3',
    name: 'Dr. Sarah Chen',
    title: 'Tech Career Strategist',
    specialty: 'AI/ML Career Development',
    background: 'Former ML researcher at Meta; PhD in Computer Science from MIT',
    certifications: ['ICF PCC', 'Stanford GSB Executive Coach', 'StrengthsFinder'],
    rating: 4.97,
    reviews: 189,
    clients: 350,
    hourlyRate: 400,
    availability: 'available',
    image: '/images/coaches/sarah.jpg',
  },
  {
    id: 'coach-4',
    name: 'Robert Martinez',
    title: 'STEM Career Coach',
    specialty: 'Early & Mid-Career Development',
    background: 'Former semiconductor engineer; Career coach for 8 years',
    certifications: ['ICF ACC', 'CliftonStrengths Coach', 'EQ-i 2.0'],
    rating: 4.93,
    reviews: 312,
    clients: 680,
    hourlyRate: 275,
    availability: 'available',
    image: '/images/coaches/robert.jpg',
  },
];

const testimonials: Testimonial[] = [
  {
    quote: "After 15 years in defense, I was terrified to transition to commercial tech. My coach helped me reframe my experience and land a VP role at a unicorn startup.",
    author: 'Michael Thompson',
    role: 'VP of Engineering',
    company: 'Series D Startup',
    outcome: '40% salary increase',
    image: '/images/testimonials/michael.jpg',
  },
  {
    quote: "I was stuck as a senior engineer for 5 years. Career Accelerator helped me identify my path to engineering management and negotiate my first director role.",
    author: 'Jennifer Park',
    role: 'Director of Engineering',
    company: 'Fortune 500 Tech',
    outcome: 'Promoted to Director',
    image: '/images/testimonials/jennifer.jpg',
  },
  {
    quote: "The executive coaching was transformative. I went from considering leaving tech to becoming CTO of a quantum computing company.",
    author: 'Dr. David Chen',
    role: 'Chief Technology Officer',
    company: 'Quantum Startup',
    outcome: 'CTO within 6 months',
    image: '/images/testimonials/david.jpg',
  },
];

const coachingFocusAreas: CoachingFocus[] = [
  {
    title: 'Career Transitions',
    description: 'Navigate major career changes with confidence',
    icon: Compass,
    topics: ['Industry pivots', 'Role changes', 'Defense to commercial', 'IC to management'],
  },
  {
    title: 'Leadership Development',
    description: 'Develop the skills to lead teams and organizations',
    icon: Users,
    topics: ['Executive presence', 'Team leadership', 'Strategic thinking', 'Influence & communication'],
  },
  {
    title: 'Job Search Strategy',
    description: 'Land your next role faster with proven strategies',
    icon: Target,
    topics: ['Resume optimization', 'Interview mastery', 'Networking tactics', 'Offer negotiation'],
  },
  {
    title: 'Personal Branding',
    description: 'Build a reputation that opens doors',
    icon: Sparkles,
    topics: ['LinkedIn optimization', 'Thought leadership', 'Public speaking', 'Content strategy'],
  },
  {
    title: 'Work-Life Integration',
    description: 'Build a sustainable, fulfilling career',
    icon: Heart,
    topics: ['Burnout prevention', 'Boundary setting', 'Values alignment', 'Purpose discovery'],
  },
  {
    title: 'Compensation Strategy',
    description: 'Maximize your earning potential',
    icon: DollarSign,
    topics: ['Salary negotiation', 'Equity packages', 'Benchmarking', 'Total rewards optimization'],
  },
];

// ===========================================
// Components
// ===========================================

const PackageCard: React.FC<{ pkg: CoachingPackage; index: number }> = ({ pkg, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        pkg.popular ? 'ring-2 ring-purple-500' : ''
      }`}
    >
      {pkg.popular && (
        <div className="bg-purple-500 text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900">
            ${pkg.price.toLocaleString()}
          </div>
          <div className="text-gray-500 text-sm">
            {pkg.sessions} sessions over {pkg.duration}
          </div>
        </div>

        <ul className="space-y-2 mb-6">
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          pkg.popular
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}>
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const CoachCard: React.FC<{ coach: Coach; index: number }> = ({ coach, index }) => {
  const availabilityStyles = {
    available: 'bg-green-100 text-green-700',
    limited: 'bg-yellow-100 text-yellow-700',
    waitlist: 'bg-red-100 text-red-700',
  };

  const availabilityText = {
    available: 'Available',
    limited: 'Limited Spots',
    waitlist: 'Waitlist',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {coach.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">{coach.name}</h3>
              <BadgeCheck className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-purple-600 text-sm font-medium">{coach.title}</p>
            <p className="text-gray-500 text-sm">{coach.specialty}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${availabilityStyles[coach.availability]}`}>
            {availabilityText[coach.availability]}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{coach.background}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {coach.certifications.map((cert, idx) => (
            <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
              {cert}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-semibold">{coach.rating}</span>
            <span className="text-gray-500 text-sm">({coach.reviews} reviews)</span>
          </div>
          <div className="text-gray-600 text-sm">
            {coach.clients}+ clients
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">${coach.hourlyRate}/hr</div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Book Session
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-gray-700 mb-4 italic">"{testimonial.quote}"</blockquote>
      <div className="mb-4 px-3 py-2 bg-green-50 rounded-lg inline-block">
        <span className="text-green-700 font-semibold text-sm">{testimonial.outcome}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
          {testimonial.author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{testimonial.author}</div>
          <div className="text-gray-500 text-sm">{testimonial.role}</div>
          <div className="text-gray-400 text-sm">{testimonial.company}</div>
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================
// Main Component
// ===========================================

const CareerCoachingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-6">
                <Compass className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Career Coaching for STEM</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Navigate Your Career
                <span className="text-purple-400"> With Confidence</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Work with coaches who've walked your path. Our certified coaches are former
                engineers, scientists, and tech leaders who understand the unique challenges
                of STEM careers.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Free Discovery Call
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  View Coaching Packages
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Users className="w-10 h-10 text-purple-400 mb-3" />
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-gray-300">Clients Coached</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <TrendingUp className="w-10 h-10 text-purple-400 mb-3" />
                <div className="text-3xl font-bold">35%</div>
                <div className="text-gray-300">Avg. Salary Increase</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-10 h-10 text-purple-400 mb-3" />
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-gray-300">Client Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Rocket className="w-10 h-10 text-purple-400 mb-3" />
                <div className="text-3xl font-bold">89%</div>
                <div className="text-gray-300">Achieved Goals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Focus Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What We Help With
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our coaching programs address the most common career challenges facing STEM professionals
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachingFocusAreas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{area.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{area.description}</p>
                <div className="flex flex-wrap gap-2">
                  {area.topics.map((topic, topicIdx) => (
                    <span key={topicIdx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Coaching Packages */}
      <div className="bg-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coaching Packages
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the program that matches your goals and timeline
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {coachingPackages.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Meet Our Coaches */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Coaches
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ICF-certified coaches with real STEM industry experience
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {coaches.map((coach, index) => (
            <CoachCard key={coach.id} coach={coach} index={index} />
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real results from professionals who invested in their careers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get started with coaching in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: Phone, title: 'Free Discovery Call', desc: 'Tell us about your goals and challenges. We\'ll recommend the right coach and program for you.' },
              { step: 2, icon: Users, title: 'Match with a Coach', desc: 'Get paired with an ICF-certified coach who has relevant industry experience and expertise.' },
              { step: 3, icon: Rocket, title: 'Transform Your Career', desc: 'Work through a personalized program designed to achieve your specific career objectives.' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Control of Your Career?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Book a free 30-minute discovery call to discuss your goals and explore
            how coaching can help you achieve them.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Free Discovery Call
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Ask a Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCoachingPage;
