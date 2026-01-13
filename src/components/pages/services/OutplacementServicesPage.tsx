import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  TrendingUp,
  FileText,
  Briefcase,
  Award,
  Clock,
  Shield,
  Heart,
  Compass,
  MessageSquare,
  Building2,
  ChevronDown,
  ChevronUp,
  Search,
  PenTool,
  Video,
  Handshake
} from 'lucide-react';

// Types
interface OutplacementPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  features: string[];
  bestFor: string;
  highlighted?: boolean;
}

interface TransitionService {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  deliverables: string[];
}

interface SuccessMetric {
  value: string;
  label: string;
  description: string;
}

interface Testimonial {
  id: string;
  name: string;
  previousRole: string;
  newRole: string;
  company: string;
  image: string;
  quote: string;
  transitionTime: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Data
const outplacementPackages: OutplacementPackage[] = [
  {
    id: 'essential',
    name: 'Essential Transition',
    duration: '30 Days',
    price: '$1,500',
    description: 'Quick-start program for professionals ready to take charge of their job search.',
    features: [
      'Resume review and optimization',
      'LinkedIn profile audit',
      '2 one-on-one coaching sessions',
      'Job search strategy workshop',
      'Access to job board aggregator',
      'Email support for 30 days',
      'Interview preparation guide',
      'Salary negotiation resources'
    ],
    bestFor: 'Individual contributors and early-career professionals'
  },
  {
    id: 'professional',
    name: 'Professional Accelerator',
    duration: '90 Days',
    price: '$4,500',
    description: 'Comprehensive support for mid-career professionals seeking their next opportunity.',
    features: [
      'Complete resume rewrite by certified writer',
      'LinkedIn profile optimization',
      '6 one-on-one coaching sessions',
      'Personal branding strategy',
      'Targeted job search campaign',
      'Mock interview sessions (3)',
      'Networking strategy and introductions',
      'Salary negotiation coaching',
      'Weekly progress check-ins',
      'Access to exclusive job listings'
    ],
    bestFor: 'Mid-level managers and senior individual contributors',
    highlighted: true
  },
  {
    id: 'executive',
    name: 'Executive Transition',
    duration: '6 Months',
    price: '$12,000',
    description: 'White-glove service for senior leaders navigating executive-level transitions.',
    features: [
      'Executive resume and bio creation',
      'Executive presence coaching',
      'Board-ready LinkedIn profile',
      'Unlimited coaching sessions',
      'Executive search firm introductions',
      'Personal brand development',
      'Media training and thought leadership',
      'C-suite interview preparation',
      'Compensation package negotiation',
      'First 90 days planning',
      'Dedicated career concierge',
      '6-month post-placement support'
    ],
    bestFor: 'Directors, VPs, C-suite executives, and board members'
  }
];

const transitionServices: TransitionService[] = [
  {
    id: 'resume',
    icon: <FileText className="h-8 w-8" />,
    title: 'Resume & Profile Services',
    description: 'ATS-optimized resumes and compelling professional profiles that get noticed.',
    deliverables: [
      'ATS-optimized resume',
      'Executive biography',
      'LinkedIn profile overhaul',
      'Cover letter templates',
      'Portfolio development guidance'
    ]
  },
  {
    id: 'coaching',
    icon: <MessageSquare className="h-8 w-8" />,
    title: 'Career Coaching',
    description: 'One-on-one guidance from certified career coaches with industry expertise.',
    deliverables: [
      'Career assessment and planning',
      'Goal setting and accountability',
      'Mindset and confidence building',
      'Work-life balance strategies',
      'Ongoing support and guidance'
    ]
  },
  {
    id: 'interview',
    icon: <Video className="h-8 w-8" />,
    title: 'Interview Preparation',
    description: 'Comprehensive interview training to help you shine in any interview format.',
    deliverables: [
      'Behavioral interview coaching',
      'Technical interview prep',
      'Video interview training',
      'Panel interview strategies',
      'Mock interviews with feedback'
    ]
  },
  {
    id: 'networking',
    icon: <Handshake className="h-8 w-8" />,
    title: 'Networking & Connections',
    description: 'Strategic networking support and introductions to key industry contacts.',
    deliverables: [
      'Networking strategy development',
      'Industry introductions',
      'Professional association guidance',
      'Alumni network activation',
      'Recruiter relationship building'
    ]
  },
  {
    id: 'branding',
    icon: <PenTool className="h-8 w-8" />,
    title: 'Personal Branding',
    description: 'Build a powerful personal brand that positions you as an industry leader.',
    deliverables: [
      'Brand positioning statement',
      'Thought leadership strategy',
      'Social media presence',
      'Speaking engagement prep',
      'Publication opportunities'
    ]
  },
  {
    id: 'search',
    icon: <Search className="h-8 w-8" />,
    title: 'Job Search Strategy',
    description: 'Targeted job search campaigns that uncover hidden opportunities.',
    deliverables: [
      'Target company research',
      'Job market analysis',
      'Application tracking system',
      'Recruiter outreach templates',
      'Follow-up strategies'
    ]
  }
];

const successMetrics: SuccessMetric[] = [
  {
    value: '89%',
    label: 'Placement Rate',
    description: 'of clients land new roles within program duration'
  },
  {
    value: '42',
    label: 'Days Average',
    description: 'from program start to job offer'
  },
  {
    value: '18%',
    label: 'Salary Increase',
    description: 'average compensation improvement'
  },
  {
    value: '94%',
    label: 'Satisfaction',
    description: 'client satisfaction rating'
  }
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Michael Chen',
    previousRole: 'Senior Software Engineer',
    newRole: 'Engineering Manager',
    company: 'Meta',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    quote: 'After being laid off, I felt lost. The outplacement team helped me realize this was an opportunity to level up. Within 6 weeks, I landed a management role with a 25% raise.',
    transitionTime: '6 weeks'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    previousRole: 'VP of Marketing',
    newRole: 'Chief Marketing Officer',
    company: 'Series B Startup',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    quote: 'The executive transition program was exceptional. My coach helped me articulate my value proposition and connected me with opportunities I never would have found on my own.',
    transitionTime: '3 months'
  },
  {
    id: '3',
    name: 'David Park',
    previousRole: 'Data Scientist',
    newRole: 'Principal Data Scientist',
    company: 'Apple',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    quote: 'The interview preparation was game-changing. After struggling with technical interviews, my coach helped me develop a framework that landed me offers from three top tech companies.',
    transitionTime: '5 weeks'
  }
];

const employerBenefits = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Protect Your Brand',
    description: 'Demonstrate commitment to employee welfare and maintain positive employer reputation.'
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Support Your People',
    description: 'Help departing employees land on their feet with professional transition support.'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Boost Morale',
    description: 'Show remaining employees that the company values and supports its people.'
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Reduce Risk',
    description: 'Minimize potential legal issues and unemployment insurance costs.'
  }
];

const faqs: FAQ[] = [
  {
    question: 'How long does outplacement support typically last?',
    answer: 'Our programs range from 30 days to 6 months depending on the package selected. Most mid-career professionals find new roles within 60-90 days with our Professional Accelerator program. We also offer extended support options for those who need more time.'
  },
  {
    question: 'Can companies purchase outplacement services for groups?',
    answer: 'Yes, we offer group outplacement programs for companies conducting layoffs or restructuring. We provide volume discounts and can customize programs based on the size and needs of your workforce. Our team can handle transitions of any size, from small teams to large-scale reductions.'
  },
  {
    question: 'What industries do your career coaches specialize in?',
    answer: 'Our coaches specialize in STEM fields including technology, engineering, healthcare, finance, and scientific research. Each coach has direct industry experience and understands the specific challenges and opportunities in these sectors.'
  },
  {
    question: 'Do you guarantee job placement?',
    answer: 'While we cannot guarantee specific outcomes, our 89% placement rate within program duration speaks to our effectiveness. We commit to providing comprehensive support and will extend services if needed for clients who are actively engaged in the process.'
  },
  {
    question: 'What happens if I find a job before my program ends?',
    answer: 'Congratulations! Any remaining coaching sessions can be used for onboarding support, first 90 days planning, or negotiation assistance. We want to ensure you succeed in your new role, not just land the job.'
  },
  {
    question: 'Can I choose my career coach?',
    answer: 'Yes, we match you with a coach based on your industry, career level, and goals. If the initial match isn\'t ideal, we\'ll reassign you to another coach at no additional cost. Your success depends on a strong coaching relationship.'
  }
];

const OutplacementServicesPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/90" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Compass className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-200 font-medium">Career Transition Services</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Next Chapter
              <span className="block text-emerald-400">Starts Here</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Professional outplacement services that help transitioning employees land
              their next opportunity faster. We turn career setbacks into comebacks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                Employer Solutions
                <Building2 className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Success Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {successMetrics.map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{metric.value}</div>
                <div className="text-lg font-semibold text-white mb-1">{metric.label}</div>
                <div className="text-sm text-gray-400">{metric.description}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Outplacement Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Outplacement Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored support packages designed to accelerate your career transition
              and maximize your landing opportunities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {outplacementPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  pkg.highlighted
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-2xl scale-105'
                    : 'bg-white shadow-lg'
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.name}
                  </h3>
                  <div className={`text-sm font-medium mb-4 ${pkg.highlighted ? 'text-emerald-200' : 'text-emerald-600'}`}>
                    {pkg.duration} Program
                  </div>
                  <div className={`text-4xl font-bold ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.price}
                  </div>
                  <p className={`mt-4 ${pkg.highlighted ? 'text-emerald-100' : 'text-gray-600'}`}>
                    {pkg.description}
                  </p>
                </div>

                <div className={`text-sm font-medium mb-4 ${pkg.highlighted ? 'text-emerald-200' : 'text-gray-500'}`}>
                  Best for: {pkg.bestFor}
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        pkg.highlighted ? 'text-emerald-300' : 'text-emerald-500'
                      }`} />
                      <span className={pkg.highlighted ? 'text-white' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                    pkg.highlighted
                      ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  Select Program
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition Services */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Transition Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every aspect of your career transition is covered with our suite of
              specialized services and expert guidance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transitionServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>

                <div className="space-y-2">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-emerald-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Successful Transitions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real stories from professionals who turned career transitions
              into opportunities for growth.
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
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-emerald-400">
                      {testimonial.previousRole} → {testimonial.newRole}
                    </div>
                    <div className="text-sm text-gray-400">{testimonial.company}</div>
                  </div>
                </div>

                <blockquote className="text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-2 text-emerald-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Landed in {testimonial.transitionTime}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-6">
                <Building2 className="h-5 w-5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">For Employers</span>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Support Your Workforce
                <span className="block text-emerald-600">Through Transitions</span>
              </h2>

              <p className="text-xl text-gray-600 mb-8">
                When restructuring is necessary, demonstrate your commitment to employee
                welfare with comprehensive outplacement support. It's the right thing to
                do—and it protects your employer brand.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {employerBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                Request Employer Consultation
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Group Outplacement Solutions
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">Volume pricing for groups of 10+</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">On-site transition workshops</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">Progress reporting and analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">Customizable program duration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">Employee communication support</span>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-6">
                  <div className="text-sm text-emerald-700 font-medium mb-2">
                    Trusted by leading companies
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <span className="font-semibold">500+</span>
                    <span className="text-sm">organizations have partnered with us for workforce transitions</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Transition Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A structured approach that moves you from transition to triumph.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200 hidden md:block" />

              {[
                {
                  step: 1,
                  title: 'Initial Assessment',
                  description: 'We evaluate your skills, experience, and career goals to create a personalized transition plan.',
                  icon: <Target className="h-6 w-6" />
                },
                {
                  step: 2,
                  title: 'Resume & Profile Update',
                  description: 'Professional resume writers and profile experts optimize your materials for maximum impact.',
                  icon: <FileText className="h-6 w-6" />
                },
                {
                  step: 3,
                  title: 'Strategic Planning',
                  description: 'Develop a targeted job search strategy and identify ideal companies and roles.',
                  icon: <Compass className="h-6 w-6" />
                },
                {
                  step: 4,
                  title: 'Active Job Search',
                  description: 'Execute your search strategy with coaching support, networking, and interview preparation.',
                  icon: <Search className="h-6 w-6" />
                },
                {
                  step: 5,
                  title: 'Interview & Negotiate',
                  description: 'Ace your interviews and negotiate the best possible compensation package.',
                  icon: <Briefcase className="h-6 w-6" />
                },
                {
                  step: 6,
                  title: 'Successful Landing',
                  description: 'Accept your offer and receive support for a successful first 90 days.',
                  icon: <Award className="h-6 w-6" />
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center gap-8 mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`bg-white rounded-2xl p-6 shadow-lg inline-block ${
                      index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                          {item.icon}
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">Step {item.step}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {item.step}
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our outplacement services and programs.
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Write Your Next Chapter?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Whether you're an individual in transition or an employer supporting your team,
              we're here to help. Let's turn this transition into an opportunity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-400 transition-colors"
              >
                Employer Solutions
                <Building2 className="h-5 w-5" />
              </motion.button>
            </div>

            <p className="mt-8 text-emerald-200">
              Free initial consultation • No commitment required
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OutplacementServicesPage;
