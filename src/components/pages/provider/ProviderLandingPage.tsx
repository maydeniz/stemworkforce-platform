import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  Calendar,
  Rocket,
  BadgeCheck,
  Wallet,
  UserCheck,
  Cpu,
  Atom,
  Server,
  ShieldCheck,
  Plane,
  Leaf
} from 'lucide-react';

// Types
interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  image: string;
  quote: string;
  earnings: string;
  specialty: string;
}

interface PricingTier {
  name: string;
  commission: string;
  features: string[];
  highlighted?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

interface MarketOpportunity {
  industry: string;
  icon: React.ReactNode;
  growth: string;
  demand: string;
  avgRate: string;
  color: string;
}

// Data
const platformBenefits: Benefit[] = [
  {
    icon: <Users className="h-7 w-7" />,
    title: 'Pre-Qualified Clients',
    description: 'Access enterprise clients actively seeking STEM expertise. No cold outreach—clients come to you.',
    highlight: '500+ active buyers'
  },
  {
    icon: <DollarSign className="h-7 w-7" />,
    title: 'Premium Rates',
    description: 'Set your own rates and earn what you deserve. Our consultants average $200-500/hour.',
    highlight: '3x industry average'
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: 'Secure Payments',
    description: 'Get paid on time, every time. Escrow protection ensures you never chase payments.',
    highlight: '100% payment guarantee'
  },
  {
    icon: <Calendar className="h-7 w-7" />,
    title: 'Flexible Scheduling',
    description: 'Work when you want, where you want. Accept projects that fit your availability.',
    highlight: 'Full control'
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: 'Growth Tools',
    description: 'Analytics, portfolio builder, and client management tools to scale your practice.',
    highlight: 'All-in-one platform'
  },
  {
    icon: <Rocket className="h-7 w-7" />,
    title: 'Career Acceleration',
    description: 'Build your reputation with verified reviews and climb our expert rankings.',
    highlight: 'Visibility boost'
  }
];

const marketOpportunities: MarketOpportunity[] = [
  {
    industry: 'Semiconductor',
    icon: <Server className="h-6 w-6" />,
    growth: '+45%',
    demand: 'High',
    avgRate: '$275/hr',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    industry: 'Nuclear Energy',
    icon: <Atom className="h-6 w-6" />,
    growth: '+15%',
    demand: 'High',
    avgRate: '$300/hr',
    color: 'from-green-500 to-emerald-600'
  },
  {
    industry: 'AI & Machine Learning',
    icon: <Cpu className="h-6 w-6" />,
    growth: '+340%',
    demand: 'Extreme',
    avgRate: '$350/hr',
    color: 'from-violet-500 to-purple-600'
  },
  {
    industry: 'Quantum Technologies',
    icon: <Atom className="h-6 w-6" />,
    growth: '+67%',
    demand: 'Very High',
    avgRate: '$400/hr',
    color: 'from-pink-500 to-rose-600'
  },
  {
    industry: 'Cybersecurity',
    icon: <ShieldCheck className="h-6 w-6" />,
    growth: '+32%',
    demand: 'Critical',
    avgRate: '$300/hr',
    color: 'from-red-500 to-orange-600'
  },
  {
    industry: 'Aerospace & Defense',
    icon: <Plane className="h-6 w-6" />,
    growth: '+18%',
    demand: 'High',
    avgRate: '$325/hr',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    industry: 'Biotechnology',
    icon: <Cpu className="h-6 w-6" />,
    growth: '+28%',
    demand: 'High',
    avgRate: '$285/hr',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    industry: 'Healthcare & Medical Technology',
    icon: <Cpu className="h-6 w-6" />,
    growth: '+31%',
    demand: 'Very High',
    avgRate: '$260/hr',
    color: 'from-teal-500 to-cyan-600'
  },
  {
    industry: 'Robotics & Automation',
    icon: <Cpu className="h-6 w-6" />,
    growth: '+35%',
    demand: 'High',
    avgRate: '$290/hr',
    color: 'from-amber-500 to-orange-600'
  },
  {
    industry: 'Clean Energy',
    icon: <Leaf className="h-6 w-6" />,
    growth: '+42%',
    demand: 'Very High',
    avgRate: '$250/hr',
    color: 'from-lime-500 to-green-600'
  },
  {
    industry: 'Advanced Manufacturing',
    icon: <Server className="h-6 w-6" />,
    growth: '+12%',
    demand: 'Steady',
    avgRate: '$240/hr',
    color: 'from-slate-500 to-gray-600'
  }
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'AI Strategy Consultant',
    company: 'Former Google AI Lead',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    quote: 'I left my FAANG job to consult independently but struggled to find clients. Within 3 months on STEM Workforce, I had more qualified leads than I could handle. Last year I earned $420K working 30 hours a week.',
    earnings: '$420K/year',
    specialty: 'LLM Implementation'
  },
  {
    id: '2',
    name: 'Marcus Williams',
    title: 'Cybersecurity Architect',
    company: 'Ex-NSA, CISSP',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    quote: 'The platform connected me with government contractors I never could have reached on my own. My clearance and expertise finally have the market access they deserve. Zero time spent on business development.',
    earnings: '$380K/year',
    specialty: 'Zero Trust Architecture'
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    title: 'Quantum Technologies Specialist',
    company: 'MIT Researcher',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    quote: 'As a researcher, I wanted to apply my work commercially without leaving academia. STEM Workforce lets me consult part-time with Fortune 500 companies while maintaining my research position.',
    earnings: '$180K part-time',
    specialty: 'Quantum Algorithms'
  }
];

const pricingTiers: PricingTier[] = [
  {
    name: 'Standard',
    commission: '15%',
    features: [
      'Access to all client opportunities',
      'Basic analytics dashboard',
      'Direct messaging with clients',
      'Secure payment processing',
      'Profile in marketplace',
      'Standard support'
    ]
  },
  {
    name: 'Professional',
    commission: '12%',
    features: [
      'Everything in Standard',
      'Featured profile placement',
      'Priority client matching',
      'Advanced analytics',
      'Contract templates library',
      'Priority support',
      'Quarterly business reviews'
    ],
    highlighted: true
  },
  {
    name: 'Enterprise',
    commission: '10%',
    features: [
      'Everything in Professional',
      'Dedicated success manager',
      'Custom branding options',
      'White-label proposals',
      'Team collaboration tools',
      'API access',
      'Annual strategic planning'
    ]
  }
];

const faqs: FAQ[] = [
  {
    question: 'How quickly can I start earning?',
    answer: 'Most providers receive their first client inquiry within 1-2 weeks of completing their profile. Our AI-powered matching system immediately begins connecting you with relevant opportunities. Top performers often book their first engagement within 48 hours of approval.'
  },
  {
    question: 'What are the requirements to join?',
    answer: 'We look for professionals with demonstrable expertise in STEM fields—typically 5+ years of experience, relevant credentials, and a track record of results. We accept consultants, contractors, freelancers, and moonlighting professionals. No business entity required to start.'
  },
  {
    question: 'How does payment work?',
    answer: 'Clients pay upfront into escrow when a project begins. Upon milestone completion or project end, funds are released to you within 2 business days via direct deposit, PayPal, or wire transfer. You never have to chase payments or deal with invoicing.'
  },
  {
    question: 'Can I set my own rates?',
    answer: 'Absolutely. You have full control over your pricing. We provide market rate data and guidance, but ultimately you decide what to charge. Most of our consultants earn 2-3x more than traditional employment or other platforms.'
  },
  {
    question: 'What if I already have clients?',
    answer: 'Great! You can use STEM Workforce alongside your existing client relationships. Many providers use us specifically to fill gaps in their schedule or to find opportunities in new verticals. There\'s no exclusivity requirement.'
  },
  {
    question: 'Is there a minimum time commitment?',
    answer: 'No minimums. Some providers work 5 hours a week, others 50+. You control your availability and only accept projects that fit your schedule. Perfect for full-time consultants or professionals looking for side income.'
  },
  {
    question: 'How does the vetting process work?',
    answer: 'Our streamlined vetting takes 3-5 business days. We verify your identity, credentials, and professional references. For cleared professionals, we can expedite the process. Once approved, you\'re immediately visible to clients.'
  },
  {
    question: 'What support do you provide?',
    answer: 'Beyond the platform tools, you get access to our provider success team, contract templates, rate negotiation guidance, and a community of fellow STEM experts. Professional and Enterprise tiers include dedicated support and business coaching.'
  }
];

const processSteps = [
  {
    step: 1,
    title: 'Apply in 10 Minutes',
    description: 'Complete your profile with your expertise, credentials, and rates. No lengthy applications.',
    icon: <UserCheck className="h-6 w-6" />
  },
  {
    step: 2,
    title: 'Quick Verification',
    description: 'We verify your credentials and references within 3-5 business days.',
    icon: <BadgeCheck className="h-6 w-6" />
  },
  {
    step: 3,
    title: 'Get Matched',
    description: 'Our AI matches you with relevant opportunities based on your expertise and preferences.',
    icon: <Target className="h-6 w-6" />
  },
  {
    step: 4,
    title: 'Start Earning',
    description: 'Accept projects, deliver value, and get paid securely through our platform.',
    icon: <Wallet className="h-6 w-6" />
  }
];

const trustIndicators = [
  { value: '2,500+', label: 'Active Consultants' },
  { value: '$85M+', label: 'Paid to Providers' },
  { value: '98%', label: 'Payment On-Time' },
  { value: '4.9/5', label: 'Provider Satisfaction' }
];

const ProviderLandingPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 to-purple-900/95" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="text-amber-200 font-medium">Now Accepting Top STEM Talent</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Turn Your Expertise Into
                <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Premium Income
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join 2,500+ elite STEM consultants earning $200-500/hour with pre-qualified clients.
                No cold outreach. No payment chasing. Just your expertise, rewarded.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/provider-apply">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/25 transition-all"
                  >
                    Apply Now — It's Free
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                >
                  See How It Works
                  <ChevronDown className="h-5 w-5" />
                </motion.button>
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

      {/* Market Opportunity Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">Record Demand for STEM Expertise</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              The Market Is Hot. Are You In?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise demand for specialized STEM talent is at an all-time high.
              Companies are paying premium rates for experts who can deliver results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketOpportunities.map((opp, index) => (
              <motion.div
                key={opp.industry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${opp.color} flex items-center justify-center text-white mb-4`}>
                  {opp.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{opp.industry}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">YoY Growth</span>
                    <span className="font-bold text-green-600">{opp.growth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Demand Level</span>
                    <span className="font-semibold text-gray-900">{opp.demand}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Avg. Rate</span>
                    <span className="font-bold text-indigo-600">{opp.avgRate}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Data based on Q4 2024 platform analytics and industry reports
            </p>
            <Link to="/provider-apply" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold">
              Claim your spot in these growing markets
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Top Experts Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We handle the business side so you can focus on what you do best—delivering exceptional results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformBenefits.map((benefit, index) => (
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
              Start Earning in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We've streamlined the onboarding process so you can go from application to your first client in days, not weeks.
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
            <Link to="/provider-apply">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors"
              >
                Start Your Application
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
            <p className="mt-4 text-gray-400">
              Average time to complete: 10 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hear From Our Top Earners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from consultants who transformed their careers on our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                    <div className="text-sm text-indigo-600">{testimonial.company}</div>
                  </div>
                </div>

                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500">Earnings</div>
                    <div className="font-bold text-green-600">{testimonial.earnings}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Specialty</div>
                    <div className="font-medium text-gray-900">{testimonial.specialty}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Commission Section */}
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
              No monthly fees. No hidden charges. You only pay when you earn.
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
                <div className={`text-5xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.commission}
                </div>
                <p className={`mb-6 ${tier.highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>
                  commission on earnings
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

                <Link to="/provider-apply">
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                      tier.highlighted
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Get Started
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              All new providers start on Standard. Upgrade anytime based on your volume.
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
              Everything you need to know about joining our platform.
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Expertise Deserves
              <span className="block">Premium Compensation</span>
            </h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Join the platform where top STEM professionals earn what they're worth.
              Apply today and start your journey to $200-500/hour.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/provider-apply">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:bg-indigo-50 transition-colors"
                >
                  Apply Now — Free to Join
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-indigo-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>No monthly fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>10-minute application</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Start earning in days</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProviderLandingPage;
