// ===========================================
// Staffing Services Page
// Contract, temp-to-perm, and direct hire staffing
// for STEM and emerging technology sectors
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  ArrowRight,
  Target,
  Shield,
  Award,
  Star,
  Zap,
  FileText,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  Search,
  Globe,
  DollarSign,
  RefreshCw,
  HeartHandshake,
  Gauge,
  ClipboardCheck,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface StaffingModel {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  idealFor: string[];
  timeframe: string;
  popular?: boolean;
}

interface IndustrySpecialization {
  name: string;
  roles: string[];
  icon: string;
}

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  image: string;
  metric?: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

// ===========================================
// Data
// ===========================================

const staffingModels: StaffingModel[] = [
  {
    id: 'contract',
    title: 'Contract Staffing',
    description: 'Flexible technical talent for project-based work, seasonal demands, or specialized initiatives with defined timelines.',
    icon: Clock,
    features: [
      'Rapid deployment (48-72 hours)',
      'W-2 employees on our payroll',
      'Full benefits available',
      'Flexible contract terms',
      'Easy extension or conversion',
      'Dedicated account management',
    ],
    idealFor: [
      'Project-based initiatives',
      'Seasonal workload spikes',
      'Specialized skill gaps',
      'Budget flexibility needs',
    ],
    timeframe: '48-72 hours to first candidates',
    popular: true,
  },
  {
    id: 'temp-to-perm',
    title: 'Temp-to-Hire',
    description: 'Evaluate talent in your environment before making a permanent commitment. Reduce hiring risk while ensuring cultural fit.',
    icon: RefreshCw,
    features: [
      'Try before you buy',
      'Reduced hiring risk',
      'Cultural fit assessment',
      'Performance evaluation period',
      'Seamless conversion process',
      'Prorated conversion fees',
    ],
    idealFor: [
      'Risk-averse hiring',
      'Culture-critical roles',
      'New team formation',
      'Uncertain headcount needs',
    ],
    timeframe: '1-2 weeks to placement',
    popular: true,
  },
  {
    id: 'direct-hire',
    title: 'Direct Placement',
    description: 'Full-cycle recruitment for permanent positions. We find, vet, and present top candidates ready to join your team.',
    icon: UserCheck,
    features: [
      'Comprehensive candidate vetting',
      'Skills and culture assessment',
      'Background verification',
      'Offer negotiation support',
      '90-day replacement guarantee',
      'Onboarding assistance',
    ],
    idealFor: [
      'Critical permanent roles',
      'Leadership positions',
      'Hard-to-fill specialties',
      'Strategic team building',
    ],
    timeframe: '2-4 weeks average',
  },
  {
    id: 'managed-teams',
    title: 'Managed Teams',
    description: 'Complete project teams with management oversight. We handle recruiting, HR, and day-to-day operations.',
    icon: Users,
    features: [
      'Turnkey team delivery',
      'On-site or remote options',
      'Project management included',
      'Scalable team size',
      'Single point of contact',
      'Performance accountability',
    ],
    idealFor: [
      'Large-scale projects',
      'Rapid team scaling',
      'Specialized initiatives',
      'Operational outsourcing',
    ],
    timeframe: '2-4 weeks to team deployment',
  },
];

const industrySpecializations: IndustrySpecialization[] = [
  {
    name: 'Semiconductor',
    roles: ['Process Engineers', 'Design Engineers', 'Test Engineers', 'Fab Technicians', 'Equipment Engineers'],
    icon: '💎',
  },
  {
    name: 'Nuclear Energy',
    roles: ['Nuclear Engineers', 'Reactor Operators', 'Health Physicists', 'Licensing Specialists', 'Decommissioning Experts'],
    icon: '☢️',
  },
  {
    name: 'AI & Machine Learning',
    roles: ['ML Engineers', 'Data Scientists', 'AI Researchers', 'MLOps Engineers', 'NLP Specialists'],
    icon: '🤖',
  },
  {
    name: 'Quantum Technologies',
    roles: ['Quantum Physicists', 'Quantum Software Engineers', 'Cryogenic Engineers', 'Algorithm Researchers', 'Hardware Engineers'],
    icon: '⚛️',
  },
  {
    name: 'Cybersecurity',
    roles: ['Security Engineers', 'Penetration Testers', 'SOC Analysts', 'Security Architects', 'GRC Specialists'],
    icon: '🛡️',
  },
  {
    name: 'Aerospace & Defense',
    roles: ['Systems Engineers', 'Avionics Engineers', 'Program Managers', 'Quality Engineers', 'Test Pilots'],
    icon: '🚀',
  },
  {
    name: 'Biotechnology',
    roles: ['Biotech Engineers', 'Research Scientists', 'Bioinformatics Specialists', 'Quality Control Analysts', 'Regulatory Affairs'],
    icon: '🧬',
  },
  {
    name: 'Healthcare & Medical Technology',
    roles: ['Health IT Specialists', 'Clinical Informatics', 'Medical Device Engineers', 'Healthcare Data Analysts', 'Telehealth Coordinators'],
    icon: '🏥',
  },
  {
    name: 'Robotics & Automation',
    roles: ['Robotics Engineers', 'Automation Specialists', 'Controls Engineers', 'Computer Vision Engineers', 'Integration Technicians'],
    icon: '🦾',
  },
  {
    name: 'Clean Energy',
    roles: ['Solar Engineers', 'Wind Technicians', 'Battery Engineers', 'Grid Specialists', 'Sustainability Analysts'],
    icon: '⚡',
  },
  {
    name: 'Advanced Manufacturing',
    roles: ['Manufacturing Engineers', 'Quality Engineers', 'Supply Chain Specialists', 'Automation Engineers', 'Production Managers'],
    icon: '🏭',
  },
];

const testimonials: Testimonial[] = [
  {
    quote: "STEM Workforce delivered 15 cleared engineers in under 3 weeks for our classified program. Their speed and quality transformed our project timeline.",
    author: 'Jennifer Martinez',
    title: 'VP of Engineering',
    company: 'Defense Prime Contractor',
    image: '/images/testimonials/jennifer.jpg',
    metric: '15 engineers in 3 weeks',
  },
  {
    quote: "The temp-to-hire model let us evaluate candidates in our unique environment. 90% converted to permanent - that's unprecedented in our experience.",
    author: 'David Chen',
    title: 'CTO',
    company: 'AI Startup (Series C)',
    image: '/images/testimonials/david.jpg',
    metric: '90% conversion rate',
  },
  {
    quote: "They understand semiconductor talent like no other agency. We've filled 50+ positions across our fabs with zero quality compromises.",
    author: 'Sarah Thompson',
    title: 'Director of HR',
    company: 'Leading Foundry',
    image: '/images/testimonials/sarah.jpg',
    metric: '50+ placements',
  },
];

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Discovery',
    description: 'We learn your technical requirements, team culture, and business objectives through a detailed intake session.',
    icon: Search,
  },
  {
    step: 2,
    title: 'Sourcing',
    description: 'Our recruiters tap into our 500K+ candidate database, industry networks, and AI-powered matching technology.',
    icon: Target,
  },
  {
    step: 3,
    title: 'Screening',
    description: 'Rigorous technical assessments, behavioral interviews, and reference checks ensure quality candidates.',
    icon: ClipboardCheck,
  },
  {
    step: 4,
    title: 'Presentation',
    description: 'You receive a curated shortlist with detailed candidate profiles, assessment results, and our recommendations.',
    icon: FileText,
  },
  {
    step: 5,
    title: 'Placement',
    description: 'We coordinate interviews, manage offers, and ensure smooth onboarding for a successful start.',
    icon: UserCheck,
  },
  {
    step: 6,
    title: 'Support',
    description: 'Ongoing check-ins, performance monitoring, and dedicated account management throughout the engagement.',
    icon: HeartHandshake,
  },
];

// ===========================================
// Components
// ===========================================

const StaffingModelCard: React.FC<{ model: StaffingModel; index: number }> = ({ model, index }) => {
  const Icon = model.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
        model.popular ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {model.popular && (
        <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{model.title}</h3>
            <p className="text-blue-600 text-sm font-medium">{model.timeframe}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{model.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
          <ul className="grid grid-cols-2 gap-2">
            {model.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Ideal For:</h4>
          <div className="flex flex-wrap gap-2">
            {model.idealFor.map((item, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                {item}
              </span>
            ))}
          </div>
        </div>

        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
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
      {testimonial.metric && (
        <div className="mb-4 px-3 py-2 bg-blue-50 rounded-lg">
          <span className="text-blue-700 font-semibold">{testimonial.metric}</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
          {testimonial.author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{testimonial.author}</div>
          <div className="text-gray-500 text-sm">{testimonial.title}</div>
          <div className="text-gray-400 text-sm">{testimonial.company}</div>
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================
// Main Component
// ===========================================

const StaffingServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-6">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">STEM Staffing Solutions</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Technical Talent,
                <span className="text-blue-400"> On Demand</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                From contract engineers to full managed teams, we deliver pre-vetted STEM talent
                with the speed, quality, and flexibility your projects demand. 500K+ candidates
                across every emerging technology sector.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Request Talent
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Talk to an Expert
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Users className="w-10 h-10 text-blue-400 mb-3" />
                <div className="text-3xl font-bold">500K+</div>
                <div className="text-gray-300">Candidate Database</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Clock className="w-10 h-10 text-blue-400 mb-3" />
                <div className="text-3xl font-bold">48hr</div>
                <div className="text-gray-300">Average Time to Present</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-10 h-10 text-blue-400 mb-3" />
                <div className="text-3xl font-bold">94%</div>
                <div className="text-gray-300">Client Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Shield className="w-10 h-10 text-blue-400 mb-3" />
                <div className="text-3xl font-bold">15K+</div>
                <div className="text-gray-300">Cleared Professionals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staffing Models */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Flexible Staffing Models
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the engagement model that fits your needs - from rapid contract staffing
            to fully managed teams
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {staffingModels.map((model, index) => (
            <StaffingModelCard key={model.id} model={model} index={index} />
          ))}
        </div>
      </div>

      {/* Industry Specializations */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Deep Industry Expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our recruiters specialize in emerging technology sectors, understanding the
              unique skills and clearances each industry requires
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industrySpecializations.map((industry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{industry.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900">{industry.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {industry.roles.map((role, roleIdx) => (
                    <span
                      key={roleIdx}
                      className="px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded-md text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A proven methodology that delivers quality candidates quickly
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See why Fortune 500 companies and high-growth startups choose STEM Workforce
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The STEM Workforce Advantage
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Speed', desc: 'Candidates in 48 hours, not weeks' },
              { icon: Award, title: 'Quality', desc: 'Pre-vetted, assessed talent only' },
              { icon: Shield, title: 'Compliance', desc: 'Clearances, visas, W-2 handled' },
              { icon: Globe, title: 'Scale', desc: '500K+ candidates nationwide' },
              { icon: Target, title: 'Specialization', desc: 'STEM-only focus since 2018' },
              { icon: HeartHandshake, title: 'Partnership', desc: 'Dedicated account management' },
              { icon: DollarSign, title: 'Value', desc: 'Competitive, transparent pricing' },
              { icon: Gauge, title: 'Guarantees', desc: '90-day replacement guarantee' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Team?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Tell us about your staffing needs and get matched with pre-vetted STEM talent
            within 48 hours. No commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Submit Requirements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffingServicesPage;
