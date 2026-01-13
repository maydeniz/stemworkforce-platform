import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Lightbulb,
  Rocket,
  Star,
  GraduationCap,
  Brain,
  Briefcase,
  Code,
  Clock,
  Medal,
  BookOpen,
  Building2,
  Cpu,
  Atom,
  ShieldCheck,
  Leaf,
  HeartPulse,
  Plane,
  Server
} from 'lucide-react';
import { challengesApi } from '../../../services/challengesApi';
import type { Challenge } from '../../../types';

// Types
interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SkillCategory {
  name: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface WinnerStory {
  id: string;
  name: string;
  title: string;
  university: string;
  image: string;
  challengeWon: string;
  prize: string;
  quote: string;
  outcome: string;
}

// Data
const solverBenefits: Benefit[] = [
  {
    icon: <Trophy className="h-7 w-7" />,
    title: 'Win Cash Prizes',
    description: 'Compete for prize pools ranging from $1,000 to $1,000,000+. Top performers win substantial rewards for their solutions.'
  },
  {
    icon: <Briefcase className="h-7 w-7" />,
    title: 'Get Hired by Top Companies',
    description: 'Challenge sponsors actively recruit winners. Many solvers have landed dream jobs at Fortune 500 companies and innovative startups.'
  },
  {
    icon: <Star className="h-7 w-7" />,
    title: 'Build Your Portfolio',
    description: 'Showcase your winning solutions to future employers. Each challenge adds verified, real-world accomplishments to your profile.'
  },
  {
    icon: <GraduationCap className="h-7 w-7" />,
    title: 'Learn By Doing',
    description: 'Tackle real industry problems you won\'t find in textbooks. Develop practical skills that employers actually want.'
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: 'Join a Global Community',
    description: 'Connect with 50,000+ STEM professionals. Form teams, share knowledge, and build lasting professional relationships.'
  },
  {
    icon: <Medal className="h-7 w-7" />,
    title: 'Earn Recognition',
    description: 'Climb the leaderboards, earn badges, and build your reputation as a top problem solver in your field.'
  }
];

const skillCategories: SkillCategory[] = [
  {
    name: 'AI & Machine Learning',
    icon: <Brain className="h-6 w-6" />,
    skills: ['Deep Learning', 'NLP', 'Computer Vision', 'Reinforcement Learning'],
    color: 'from-violet-500 to-purple-600'
  },
  {
    name: 'Data Science',
    icon: <Cpu className="h-6 w-6" />,
    skills: ['Statistical Analysis', 'Data Visualization', 'Predictive Modeling', 'Big Data'],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Software Engineering',
    icon: <Code className="h-6 w-6" />,
    skills: ['Full-Stack Dev', 'System Design', 'Cloud Architecture', 'DevOps'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    name: 'Hardware & Embedded',
    icon: <Server className="h-6 w-6" />,
    skills: ['Circuit Design', 'FPGA', 'IoT', 'Robotics'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Science & Research',
    icon: <Atom className="h-6 w-6" />,
    skills: ['Physics', 'Chemistry', 'Biology', 'Materials Science'],
    color: 'from-pink-500 to-rose-600'
  },
  {
    name: 'Design & UX',
    icon: <Lightbulb className="h-6 w-6" />,
    skills: ['Product Design', 'UI/UX', 'Prototyping', '3D Modeling'],
    color: 'from-cyan-500 to-teal-600'
  }
];

const winnerStories: WinnerStory[] = [
  {
    id: '1',
    name: 'Alex Chen',
    title: 'ML Engineer at Google',
    university: 'Stanford University',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    challengeWon: 'AI Healthcare Challenge',
    prize: '$50,000',
    quote: 'This challenge opened doors I never knew existed. The solution I developed during the competition became my ticket to my dream job at Google.',
    outcome: 'Hired by challenge sponsor'
  },
  {
    id: '2',
    name: 'Maya Patel',
    title: 'Data Scientist',
    university: 'MIT',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    challengeWon: 'Climate Data Challenge',
    prize: '$25,000',
    quote: 'I was a junior with no industry experience. Winning this challenge gave me the credibility and connections to land multiple offers.',
    outcome: '5 job offers received'
  },
  {
    id: '3',
    name: 'James Wilson',
    title: 'Cybersecurity Analyst',
    university: 'Georgia Tech',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    challengeWon: 'SecureCode Challenge',
    prize: '$15,000',
    quote: 'The challenge pushed me to learn skills I would have never picked up in class. Now I lead security audits for a major defense contractor.',
    outcome: 'Career launched in cybersecurity'
  }
];

const processSteps = [
  {
    step: 1,
    title: 'Browse Challenges',
    description: 'Explore active challenges that match your skills and interests.',
    icon: <Target className="h-6 w-6" />
  },
  {
    step: 2,
    title: 'Register & Access',
    description: 'Sign up, accept the terms, and access challenge resources.',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    step: 3,
    title: 'Build Your Solution',
    description: 'Work solo or form a team to develop your winning approach.',
    icon: <Code className="h-6 w-6" />
  },
  {
    step: 4,
    title: 'Submit & Win',
    description: 'Submit before the deadline and wait for results. Winners get prizes and recognition!',
    icon: <Trophy className="h-6 w-6" />
  }
];

const faqs: FAQ[] = [
  {
    question: 'Who can participate in challenges?',
    answer: 'Most challenges are open to anyone 18+. Some may have specific eligibility requirements (e.g., students only, specific countries, or clearance levels). Each challenge page clearly lists its eligibility criteria.'
  },
  {
    question: 'Do I need to be an expert to participate?',
    answer: 'Not at all! We have challenges for all skill levels—from beginner-friendly hackathons to advanced research competitions. Filter by difficulty level to find challenges that match your experience.'
  },
  {
    question: 'Can I participate as a team?',
    answer: 'Yes! Many challenges allow team participation. You can form a team with friends or use our Team Finder to connect with other solvers looking for teammates. Team size limits vary by challenge.'
  },
  {
    question: 'How do I get paid if I win?',
    answer: 'Winners receive payment through our secure platform within 30 days of results announcement. We support direct deposit, PayPal, and wire transfer. All tax documentation is handled automatically.'
  },
  {
    question: 'What happens to my solution after I submit?',
    answer: 'IP terms vary by challenge and are clearly stated upfront. Some challenges grant sponsors rights to winning solutions, while others let you retain full ownership. Always review the terms before participating.'
  },
  {
    question: 'How are submissions judged?',
    answer: 'Each challenge has specific judging criteria published on the challenge page. Expert judges (industry professionals, researchers, or sponsor representatives) evaluate submissions based on these criteria.'
  },
  {
    question: 'Can challenges help me get a job?',
    answer: 'Absolutely! Many sponsors use challenges as a recruiting pipeline. Your performance, especially winning or placing highly, demonstrates your skills better than any resume. We\'ve helped thousands of solvers land jobs.'
  },
  {
    question: 'Is there a cost to participate?',
    answer: 'Never! Participation in all challenges is completely free. We make money from sponsors, not solvers. Your only investment is your time and talent.'
  }
];

const trustIndicators = [
  { value: '50K+', label: 'Active Solvers' },
  { value: '$12M+', label: 'Prizes Awarded' },
  { value: '500+', label: 'Challenges Completed' },
  { value: '2,500+', label: 'Solvers Hired' }
];

const industryPartners = [
  { icon: <Cpu className="h-6 w-6" />, name: 'Tech Giants', color: 'bg-blue-100 text-blue-700' },
  { icon: <Building2 className="h-6 w-6" />, name: 'Fortune 500', color: 'bg-purple-100 text-purple-700' },
  { icon: <ShieldCheck className="h-6 w-6" />, name: 'Defense', color: 'bg-red-100 text-red-700' },
  { icon: <HeartPulse className="h-6 w-6" />, name: 'Healthcare', color: 'bg-green-100 text-green-700' },
  { icon: <Leaf className="h-6 w-6" />, name: 'CleanTech', color: 'bg-emerald-100 text-emerald-700' },
  { icon: <Plane className="h-6 w-6" />, name: 'Aerospace', color: 'bg-cyan-100 text-cyan-700' },
];

const SolveChallengePage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [featuredChallenges, setFeaturedChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedChallenges = async () => {
      try {
        const result = await challengesApi.challenges.list({
          status: ['active'],
          pageSize: 3
        });
        setFeaturedChallenges(result?.challenges || []);
      } catch (error) {
        console.error('Failed to load featured challenges:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedChallenges();
  }, []);

  const formatPrize = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 to-teal-900/95" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Rocket className="h-5 w-5 text-amber-400" />
                <span className="text-amber-200 font-medium">For Students & Professionals</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Prove Your Skills.
                <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Win Real Prizes.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Compete in innovation challenges from top companies.
                Win up to $1M in prizes, get hired by sponsors, and build a portfolio that stands out.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/challenges">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/25 transition-all"
                  >
                    Browse Challenges
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                  >
                    Create Free Account
                    <ChevronDown className="h-5 w-5" />
                  </motion.button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trustIndicators.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-white">{item.value}</div>
                    <div className="text-gray-400 text-sm">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos Bar */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-gray-500 text-sm font-medium mr-2">Challenges from:</span>
            {industryPartners.map((partner, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${partner.color}`}
              >
                {partner.icon}
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Participate Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Why Solve Challenges?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              More Than Just Competitions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Challenges are your fast-track to career success. Win money, land jobs,
              build your portfolio, and develop real-world skills.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solverBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 transition-colors group"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Challenges
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Jump into these active challenges and start competing today.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : featuredChallenges.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="h-40 bg-gradient-to-br from-emerald-600 to-teal-600 relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center" />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
                        {formatPrize(challenge.totalPrizePool || 0)} Prize
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {challenge.submissionDeadline
                          ? `Ends ${new Date(challenge.submissionDeadline).toLocaleDateString()}`
                          : 'Open'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{challenge.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{challenge.registrationCount || challenge.registeredSolversCount || 0} registered</span>
                      </div>
                      <Link
                        to={`/challenges/${challenge.id}`}
                        className="text-emerald-600 font-semibold hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">New Challenges Coming Soon</h3>
              <p className="text-gray-500 mb-6">Sign up to be notified when new challenges launch.</p>
              <Link to="/register">
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                  Create Free Account
                </button>
              </Link>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/challenges">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors"
              >
                View All Challenges
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Challenges For Every Skill
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're into AI, hardware, design, or science—we have challenges that match your expertise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Getting started is easy. Here's how to go from signup to winner.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
                  )}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium text-emerald-300 mb-2">Step {step.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors"
              >
                Start Solving — It's Free
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Winner Stories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Winner Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real solvers who turned challenges into career breakthroughs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {winnerStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{story.name}</div>
                    <div className="text-sm text-gray-600">{story.title}</div>
                    <div className="text-sm text-emerald-600">{story.university}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Challenge Won</div>
                  <div className="font-semibold text-gray-900">{story.challengeWon}</div>
                </div>

                <blockquote className="text-gray-600 mb-6 italic text-sm">
                  "{story.quote}"
                </blockquote>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500">Prize Won</div>
                    <div className="font-bold text-amber-600">{story.prize}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Outcome</div>
                    <div className="font-medium text-emerald-600">{story.outcome}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about participating in challenges.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Trophy className="h-16 w-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Next Big Win
              <span className="block">Is One Challenge Away</span>
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join 50,000+ STEM professionals competing for prizes, jobs, and recognition.
              Create your free account and start solving today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/challenges">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:bg-emerald-50 transition-colors"
                >
                  Browse Challenges
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg transition-colors"
                >
                  Create Free Account
                </motion.button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>100% Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Win Cash Prizes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Get Hired by Sponsors</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SolveChallengePage;
