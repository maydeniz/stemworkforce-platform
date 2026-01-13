// ===========================================
// STEM Recruiting Services Page
// Specialized talent acquisition for emerging
// technology and scientific roles
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Search,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Award,
  FileText,
  Phone,
  Calendar,
  UserCheck,
  Cpu,
  Rocket,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface RecruitingService {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  metrics: { label: string; value: string }[];
  priceModel: string;
}

interface SuccessStory {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  hiresCount: number;
  timeframe: string;
}

interface Recruiter {
  name: string;
  title: string;
  specialty: string;
  experience: string;
  placements: number;
  image: string;
}

// ===========================================
// Data
// ===========================================

const recruitingServices: RecruitingService[] = [
  {
    id: 'executive-search',
    title: 'Executive Search',
    description: 'C-suite and VP-level searches for technology leaders who can drive transformation and innovation in emerging fields.',
    icon: Award,
    features: [
      'Retained executive search',
      'Board-level advisory',
      'Confidential searches',
      'Leadership assessment',
      'Compensation benchmarking',
      '12-month guarantee',
    ],
    metrics: [
      { label: 'Avg. Search Time', value: '45 days' },
      { label: 'Offer Acceptance', value: '94%' },
      { label: 'Retention at 2yr', value: '91%' },
    ],
    priceModel: 'Retained: 30-33% of first-year compensation',
  },
  {
    id: 'technical-recruiting',
    title: 'Technical Recruiting',
    description: 'Deep technical recruiting for engineers, scientists, and specialists across AI, quantum, semiconductor, and defense sectors.',
    icon: Cpu,
    features: [
      'Technical skills assessment',
      'Coding/design challenges',
      'Clearance-ready candidates',
      'Passive candidate outreach',
      'Employer branding support',
      '90-day guarantee',
    ],
    metrics: [
      { label: 'Avg. Fill Time', value: '21 days' },
      { label: 'Quality of Hire', value: '4.7/5' },
      { label: 'Candidate Satisfaction', value: '96%' },
    ],
    priceModel: 'Contingent: 20-25% of first-year salary',
  },
  {
    id: 'rpo',
    title: 'Recruitment Process Outsourcing',
    description: 'End-to-end recruitment operations for high-volume or specialized hiring programs with embedded recruiters.',
    icon: Users,
    features: [
      'Dedicated recruiting team',
      'ATS management',
      'Employer brand development',
      'Hiring manager training',
      'Analytics & reporting',
      'Scalable capacity',
    ],
    metrics: [
      { label: 'Cost Reduction', value: '30-50%' },
      { label: 'Time-to-Fill Improvement', value: '40%' },
      { label: 'Quality Improvement', value: '35%' },
    ],
    priceModel: 'Monthly retainer + per-hire fee',
  },
  {
    id: 'project-recruiting',
    title: 'Project-Based Recruiting',
    description: 'Surge capacity for large-scale hiring initiatives, new facility launches, or rapid growth phases.',
    icon: Rocket,
    features: [
      'Rapid team deployment',
      'Hiring event management',
      'Campus recruiting',
      'Diversity initiatives',
      'Offer management',
      'Flexible engagement',
    ],
    metrics: [
      { label: 'Ramp-up Time', value: '2 weeks' },
      { label: 'Avg. Hires/Month', value: '25-50' },
      { label: 'Project Success', value: '98%' },
    ],
    priceModel: 'Project fee or per-hire basis',
  },
];

const successStories: SuccessStory[] = [
  {
    company: 'Quantum Technologies Startup',
    industry: 'Quantum Technology',
    challenge: 'Series B-funded startup needed to build entire engineering team from scratch, requiring rare quantum physics and cryogenic engineering expertise.',
    solution: 'Deployed dedicated 3-person recruiting team with PhD-level sourcing capability. Created quantum talent pipeline through academic partnerships and conference recruiting.',
    results: [
      'Built 40-person engineering team in 6 months',
      '12 PhDs recruited from top programs',
      '85% offer acceptance rate',
      'Established ongoing talent pipeline',
    ],
    hiresCount: 40,
    timeframe: '6 months',
  },
  {
    company: 'Defense Prime Contractor',
    industry: 'Aerospace & Defense',
    challenge: 'Major contract win required 200+ cleared engineers and program managers within 12 months for classified space program.',
    solution: 'RPO engagement with dedicated team of 8 recruiters specializing in cleared talent. Implemented security clearance sponsorship program for high-potential candidates.',
    results: [
      '215 cleared professionals placed',
      'Achieved 100% program staffing',
      '45% reduction in cost-per-hire',
      'Created cleared talent community',
    ],
    hiresCount: 215,
    timeframe: '12 months',
  },
  {
    company: 'AI Research Lab',
    industry: 'AI & Machine Learning',
    challenge: 'Competing with FAANG for top ML researchers and engineers. Needed to attract world-class talent to non-coastal location.',
    solution: 'Executive search for research leadership combined with employer branding campaign. Highlighted unique research opportunities and competitive compensation.',
    results: [
      'Recruited Chief AI Scientist from Google',
      '35 ML researchers hired',
      'Built #1 NLP team in region',
      'Increased research publication 3x',
    ],
    hiresCount: 36,
    timeframe: '9 months',
  },
];

const specialtyRecruiters: Recruiter[] = [
  {
    name: 'Dr. Amanda Chen',
    title: 'Principal Recruiter, AI/ML',
    specialty: 'Machine Learning, Data Science, AI Research',
    experience: 'Former ML Engineer at Google; PhD Stanford CS',
    placements: 250,
    image: '/images/recruiters/amanda.jpg',
  },
  {
    name: 'Marcus Williams',
    title: 'Director, Defense & Cleared Recruiting',
    specialty: 'Cleared Professionals, Defense Programs',
    experience: 'Former Army Officer; 15 years defense recruiting',
    placements: 500,
    image: '/images/recruiters/marcus.jpg',
  },
  {
    name: 'Dr. Sarah Park',
    title: 'Principal Recruiter, Semiconductor',
    specialty: 'Process Engineering, Fab Operations, Equipment',
    experience: 'Former Process Engineer at Intel; PhD Materials Science',
    placements: 180,
    image: '/images/recruiters/sarah.jpg',
  },
  {
    name: 'James Thompson',
    title: 'Senior Recruiter, Quantum & Physics',
    specialty: 'Quantum Technologies, Physics Research, Cryogenics',
    experience: 'Former physicist; MS Physics MIT',
    placements: 120,
    image: '/images/recruiters/james.jpg',
  },
];

const techStacks = [
  { category: 'AI/ML', skills: ['PyTorch', 'TensorFlow', 'JAX', 'Transformers', 'MLflow', 'Kubeflow'] },
  { category: 'Cloud', skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Docker'] },
  { category: 'Languages', skills: ['Python', 'Rust', 'Go', 'C++', 'Julia', 'CUDA'] },
  { category: 'Data', skills: ['Spark', 'Databricks', 'Snowflake', 'dbt', 'Airflow', 'Kafka'] },
  { category: 'Security', skills: ['SIEM', 'EDR', 'Zero Trust', 'Cloud Security', 'AppSec', 'Threat Intel'] },
  { category: 'Hardware', skills: ['VHDL', 'Verilog', 'FPGA', 'ASIC', 'RF Design', 'Embedded'] },
];

// ===========================================
// Components
// ===========================================

const ServiceCard: React.FC<{ service: RecruitingService; index: number }> = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{service.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-indigo-50 rounded-lg">
          {service.metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <div className="text-lg font-bold text-indigo-600">{metric.value}</div>
              <div className="text-xs text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">What's Included:</h4>
          <ul className="space-y-1">
            {service.features.slice(0, 4).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Pricing: </span>
          <span className="text-sm font-medium text-gray-900">{service.priceModel}</span>
        </div>

        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          Learn More
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const SuccessStoryCard: React.FC<{ story: SuccessStory; index: number }> = ({ story, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{story.company}</h3>
            <p className="text-indigo-100 text-sm">{story.industry}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{story.hiresCount}</div>
            <div className="text-indigo-100 text-sm">hires in {story.timeframe}</div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Challenge</h4>
          <p className="text-gray-600 text-sm">{story.challenge}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Solution</h4>
          <p className="text-gray-600 text-sm">{story.solution}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Results</h4>
          <ul className="space-y-1">
            {story.results.map((result, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const RecruiterCard: React.FC<{ recruiter: Recruiter; index: number }> = ({ recruiter, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {recruiter.name.split(' ').map(n => n[0]).join('')}
      </div>
      <h3 className="font-bold text-gray-900">{recruiter.name}</h3>
      <p className="text-indigo-600 text-sm font-medium mb-2">{recruiter.title}</p>
      <p className="text-gray-600 text-sm mb-2">{recruiter.specialty}</p>
      <p className="text-gray-500 text-xs mb-3">{recruiter.experience}</p>
      <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
        <UserCheck className="w-4 h-4" />
        {recruiter.placements}+ placements
      </div>
    </motion.div>
  );
};

// ===========================================
// Main Component
// ===========================================

const RecruitingServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full mb-6">
                <Target className="w-5 h-5 text-indigo-400" />
                <span className="text-indigo-300 font-medium">STEM Recruiting Excellence</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Find the Talent That
                <span className="text-indigo-400"> Transforms</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Specialized recruiting for AI, quantum, semiconductor, defense, and emerging
                technology sectors. Our recruiters have walked in your candidates' shoes -
                because many of them are former engineers and scientists.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Start a Search
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Talk to a Recruiter
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Target className="w-10 h-10 text-indigo-400 mb-3" />
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-gray-300">Placements Made</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Clock className="w-10 h-10 text-indigo-400 mb-3" />
                <div className="text-3xl font-bold">21</div>
                <div className="text-gray-300">Avg. Days to Fill</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-10 h-10 text-indigo-400 mb-3" />
                <div className="text-3xl font-bold">94%</div>
                <div className="text-gray-300">Offer Accept Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Users className="w-10 h-10 text-indigo-400 mb-3" />
                <div className="text-3xl font-bold">50+</div>
                <div className="text-gray-300">Specialist Recruiters</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiting Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recruiting Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From executive search to high-volume recruiting, we have the model that fits your needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recruitingServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* Technical Expertise */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              We Speak Your Technical Language
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our recruiters have deep technical backgrounds and understand the skills
              that matter for your roles
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStacks.map((stack, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="font-bold text-gray-900 mb-3">{stack.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {stack.skills.map((skill, skillIdx) => (
                    <span
                      key={skillIdx}
                      className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet Our Recruiters */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Specialist Recruiters
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Former engineers, scientists, and industry experts who understand your world
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialtyRecruiters.map((recruiter, index) => (
              <RecruiterCard key={index} recruiter={recruiter} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how we've helped organizations build world-class technical teams
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <SuccessStoryCard key={index} story={story} index={index} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Exceptional Talent?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Let's discuss your hiring needs. Whether it's a single critical role or building
            an entire team, we have the expertise to deliver.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Strategy Session
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Submit Job Requirements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitingServicesPage;
