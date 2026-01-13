import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  DollarSign,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Lightbulb,
  Rocket,
  BarChart3,
  Globe,
  FileText,
  Star,
  Cpu,
  Atom,
  ShieldCheck,
  Leaf,
  HeartPulse
} from 'lucide-react';

// Types
interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

interface ChallengeType {
  name: string;
  icon: React.ReactNode;
  description: string;
  examples: string[];
  color: string;
}

interface PricingTier {
  name: string;
  price: string;
  priceNote: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface SuccessStory {
  id: string;
  company: string;
  logo: string;
  industry: string;
  challengeTitle: string;
  quote: string;
  results: {
    submissions: number;
    countries: number;
    winner: string;
    savings: string;
  };
}

// Data
const sponsorBenefits: Benefit[] = [
  {
    icon: <Users className="h-7 w-7" />,
    title: 'Access Top STEM Talent',
    description: 'Tap into our network of 50,000+ verified students, researchers, and professionals across all STEM disciplines.',
    highlight: '50K+ solvers'
  },
  {
    icon: <Lightbulb className="h-7 w-7" />,
    title: 'Source Breakthrough Ideas',
    description: 'Crowdsource innovative solutions from diverse perspectives. Get fresh approaches to your toughest problems.',
    highlight: 'Diverse solutions'
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: 'Recruit Proven Performers',
    description: 'Identify top talent through real-world problem solving. See candidates in action before making hiring decisions.',
    highlight: 'Better hires'
  },
  {
    icon: <DollarSign className="h-7 w-7" />,
    title: 'Cost-Effective R&D',
    description: 'Pay only for results. Challenge-based innovation costs a fraction of traditional R&D or consulting fees.',
    highlight: '90% cost savings'
  },
  {
    icon: <Globe className="h-7 w-7" />,
    title: 'Global Reach',
    description: 'Your challenge reaches solvers across 120+ countries, universities, and research institutions worldwide.',
    highlight: '120+ countries'
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: 'IP Protection',
    description: 'Clear IP assignment terms, NDAs, and secure submission handling protect your proprietary information.',
    highlight: 'Legally secure'
  }
];

const challengeTypes: ChallengeType[] = [
  {
    name: 'Innovation Challenge',
    icon: <Lightbulb className="h-6 w-6" />,
    description: 'Open-ended challenges seeking novel solutions to complex problems',
    examples: ['New product concepts', 'Process improvements', 'Business model innovation'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Technical Challenge',
    icon: <Cpu className="h-6 w-6" />,
    description: 'Specific technical problems requiring engineering or scientific solutions',
    examples: ['Algorithm optimization', 'Hardware design', 'Materials development'],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Data Science Challenge',
    icon: <BarChart3 className="h-6 w-6" />,
    description: 'AI/ML and analytics challenges using your data or synthetic datasets',
    examples: ['Predictive modeling', 'Computer vision', 'NLP applications'],
    color: 'from-purple-500 to-violet-600'
  },
  {
    name: 'Hackathon',
    icon: <Rocket className="h-6 w-6" />,
    description: 'Time-bounded sprints for rapid prototyping and proof-of-concepts',
    examples: ['48-hour builds', 'MVP development', 'Prototype creation'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    name: 'Research Challenge',
    icon: <Atom className="h-6 w-6" />,
    description: 'Academic-style challenges for theoretical or applied research',
    examples: ['Literature reviews', 'Experimental design', 'Proof development'],
    color: 'from-pink-500 to-rose-600'
  },
  {
    name: 'Design Challenge',
    icon: <Star className="h-6 w-6" />,
    description: 'Creative challenges for UX, product design, or visual solutions',
    examples: ['Interface design', 'Product concepts', 'Visualization'],
    color: 'from-cyan-500 to-teal-600'
  }
];

const industryUseCases = [
  { icon: <Cpu className="h-5 w-5" />, name: 'AI & Machine Learning', color: 'bg-violet-100 text-violet-700' },
  { icon: <Atom className="h-5 w-5" />, name: 'Quantum Technologies', color: 'bg-pink-100 text-pink-700' },
  { icon: <ShieldCheck className="h-5 w-5" />, name: 'Cybersecurity', color: 'bg-red-100 text-red-700' },
  { icon: <Leaf className="h-5 w-5" />, name: 'Clean Energy', color: 'bg-green-100 text-green-700' },
  { icon: <HeartPulse className="h-5 w-5" />, name: 'Healthcare Tech', color: 'bg-blue-100 text-blue-700' },
  { icon: <Rocket className="h-5 w-5" />, name: 'Aerospace', color: 'bg-cyan-100 text-cyan-700' },
];

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$2,500',
    priceNote: 'platform fee + prize',
    features: [
      'Up to $10,000 prize pool',
      'Basic challenge page',
      '500 solver reach',
      'Standard submission review',
      'Email support',
      '30-day duration'
    ],
    cta: 'Get Started'
  },
  {
    name: 'Professional',
    price: '$7,500',
    priceNote: 'platform fee + prize',
    features: [
      'Up to $50,000 prize pool',
      'Custom branded page',
      '5,000+ solver reach',
      'AI-powered pre-screening',
      'Dedicated success manager',
      'Judge recruitment assistance',
      'Up to 90-day duration',
      'Analytics dashboard'
    ],
    highlighted: true,
    cta: 'Most Popular'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceNote: 'contact for pricing',
    features: [
      'Unlimited prize pool',
      'Fully custom experience',
      'Full platform promotion',
      'White-glove support',
      'Multi-phase challenges',
      'Virtual events integration',
      'Talent pipeline access',
      'Custom integrations',
      'Extended duration'
    ],
    cta: 'Contact Sales'
  }
];

const successStories: SuccessStory[] = [
  {
    id: '1',
    company: 'TechCorp Inc.',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100',
    industry: 'Semiconductor',
    challengeTitle: 'Next-Gen Chip Cooling Solutions',
    quote: 'The winning solution reduced our thermal management costs by 40%. We hired two of the top finalists.',
    results: {
      submissions: 127,
      countries: 23,
      winner: 'Stanford PhD Team',
      savings: '$2.1M annually'
    }
  },
  {
    id: '2',
    company: 'GreenEnergy Labs',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100',
    industry: 'Clean Energy',
    challengeTitle: 'Battery Efficiency Optimization',
    quote: 'We received approaches we never would have discovered through traditional R&D. Game-changing results.',
    results: {
      submissions: 89,
      countries: 18,
      winner: 'MIT Research Group',
      savings: '$5M in R&D'
    }
  },
  {
    id: '3',
    company: 'SecureDefense Co.',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=100',
    industry: 'Cybersecurity',
    challengeTitle: 'Zero-Day Detection Algorithm',
    quote: 'Found a brilliant security researcher who is now leading our threat intelligence team.',
    results: {
      submissions: 156,
      countries: 31,
      winner: 'Independent Researcher',
      savings: 'Priceless talent'
    }
  }
];

const processSteps = [
  {
    step: 1,
    title: 'Define Your Challenge',
    description: 'Work with our team to scope your problem, set success criteria, and structure awards.',
    icon: <FileText className="h-6 w-6" />
  },
  {
    step: 2,
    title: 'Launch & Promote',
    description: 'We publish your challenge and promote it to our network of 50,000+ solvers.',
    icon: <Rocket className="h-6 w-6" />
  },
  {
    step: 3,
    title: 'Collect Submissions',
    description: 'Solvers submit their solutions. AI pre-screens for quality and fit.',
    icon: <Users className="h-6 w-6" />
  },
  {
    step: 4,
    title: 'Evaluate & Award',
    description: 'Review top submissions with your team or assigned judges. Select and reward winners.',
    icon: <Trophy className="h-6 w-6" />
  }
];

const faqs: FAQ[] = [
  {
    question: 'How long does it take to launch a challenge?',
    answer: 'Most challenges launch within 2-3 weeks from initial consultation. This includes problem definition, page design, and legal review. Rush options are available for time-sensitive needs.'
  },
  {
    question: 'What types of problems work best for challenges?',
    answer: 'Challenges work best for well-defined problems with clear success criteria. Great candidates include optimization problems, design challenges, algorithm development, and open innovation. Our team helps you assess if your problem is challenge-ready.'
  },
  {
    question: 'How do you protect our intellectual property?',
    answer: 'All solvers agree to our IP assignment terms before submitting. You can choose to require NDAs for challenge access. Submissions are handled through our secure platform, and you retain full ownership of winning solutions.'
  },
  {
    question: 'Can we recruit winners for full-time positions?',
    answer: 'Absolutely! Many sponsors use challenges as a recruiting pipeline. Winners have already demonstrated their capabilities. We can facilitate introductions and provide candidate profiles for your hiring process.'
  },
  {
    question: 'What if we don\'t receive quality submissions?',
    answer: 'Our Professional and Enterprise tiers include a satisfaction guarantee. If submission quality doesn\'t meet expectations, we work with you to extend the challenge, increase promotion, or provide partial refunds.'
  },
  {
    question: 'How do you ensure solver quality?',
    answer: 'Solvers complete skill assessments and verification. We can restrict challenges by education level, experience, clearance, or other criteria. AI pre-screening filters low-quality submissions before they reach your review.'
  },
  {
    question: 'Can we run internal challenges for employees?',
    answer: 'Yes! Our Enterprise tier supports private challenges for internal innovation programs. Perfect for hackathons, idea competitions, and R&D initiatives within your organization.'
  },
  {
    question: 'What support do you provide?',
    answer: 'All tiers include onboarding support. Professional and Enterprise tiers get a dedicated success manager, judge recruitment assistance, and ongoing optimization recommendations throughout your challenge.'
  }
];

const trustIndicators = [
  { value: '500+', label: 'Challenges Completed' },
  { value: '$12M+', label: 'Prizes Awarded' },
  { value: '50K+', label: 'Active Solvers' },
  { value: '92%', label: 'Sponsor Satisfaction' }
];

const PostChallengePage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 to-purple-900/95" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Trophy className="h-5 w-5 text-amber-400" />
                <span className="text-amber-200 font-medium">Innovation Challenges Platform</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Turn Your Toughest Problems Into
                <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Winning Solutions
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Launch innovation challenges to 50,000+ STEM professionals.
                Source breakthrough ideas, recruit top talent, and accelerate R&D—all with pay-for-results pricing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/challenges/create">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/25 transition-all"
                  >
                    Post a Challenge
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
                <Link to="/challenges">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                  >
                    Explore Active Challenges
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

      {/* Industry Use Cases Bar */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-gray-500 text-sm font-medium mr-2">Popular Industries:</span>
            {industryUseCases.map((industry, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${industry.color}`}
              >
                {industry.icon}
                {industry.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Challenges Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="text-indigo-700 font-medium">Why Innovation Challenges?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              A Smarter Way to Innovate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading organizations use challenges to source breakthrough ideas, discover hidden talent,
              and solve complex problems at a fraction of traditional R&D costs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsorBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 transition-colors group"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                {benefit.highlight && (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                    <Zap className="h-4 w-4" />
                    {benefit.highlight}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge Types */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Challenge Format
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different problems call for different approaches. Select the format that best fits your goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challengeTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white mb-4`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="space-y-1">
                  {type.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {example}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
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
              From problem definition to winner selection, we guide you through every step.
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
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400" />
                  )}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium text-indigo-300 mb-2">Step {step.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to="/challenges/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors"
              >
                Start Your Challenge
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how leading organizations have transformed their innovation with our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {story.company.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{story.company}</div>
                    <div className="text-sm text-indigo-600">{story.industry}</div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-3">{story.challengeTitle}</h3>
                <blockquote className="text-gray-600 mb-6 italic text-sm">
                  "{story.quote}"
                </blockquote>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">{story.results.submissions}</div>
                    <div className="text-sm text-gray-500">Submissions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">{story.results.countries}</div>
                    <div className="text-sm text-gray-500">Countries</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-500">Result</div>
                    <div className="font-semibold text-green-600">{story.results.savings}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your innovation goals. All plans include platform hosting,
              solver access, and secure submission handling.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  tier.highlighted
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl scale-105'
                    : 'bg-white shadow-lg'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className={`text-2xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <div className={`text-4xl font-bold mb-1 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price}
                </div>
                <p className={`text-sm mb-6 ${tier.highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {tier.priceNote}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        tier.highlighted ? 'text-indigo-300' : 'text-indigo-500'
                      }`} />
                      <span className={tier.highlighted ? 'text-white' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to={tier.name === 'Enterprise' ? '/contact' : '/challenges/create'}>
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                      tier.highlighted
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Need a custom solution? <Link to="/contact" className="text-indigo-600 font-semibold hover:underline">Contact our team</Link> for tailored options.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
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
              Everything you need to know about launching your challenge.
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
                    <ChevronUp className="h-5 w-5 text-indigo-600" />
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
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white relative overflow-hidden">
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
              Ready to Crowdsource
              <span className="block">Your Next Breakthrough?</span>
            </h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Join 500+ organizations who have discovered game-changing solutions
              and world-class talent through our innovation challenges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/challenges/create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:bg-indigo-50 transition-colors"
                >
                  Post Your Challenge
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg transition-colors"
                >
                  Talk to Sales
                </motion.button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-indigo-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>No upfront fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Launch in 2-3 weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>50K+ solver network</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PostChallengePage;
