// ===========================================
// Training & Upskilling Services Page
// Corporate learning programs for STEM workforce
// ===========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Users,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Building2,
  Zap,
  FileText,
  Phone,
  Calendar,
  Video,
  Laptop,
  Brain,
  Shield,
  Atom,
  Cpu,
  BarChart3,
  PenTool,
  Layers,
  Globe,
  Headphones,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: string;
  format: string[];
  topics: string[];
  outcomes: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  popular?: boolean;
}

interface DeliveryFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  features: string[];
}

interface CorporatePartner {
  name: string;
  industry: string;
  employees: string;
  programs: string[];
  logo: string;
}

interface Instructor {
  name: string;
  title: string;
  expertise: string;
  background: string;
  image: string;
}

// ===========================================
// Data
// ===========================================

const trainingPrograms: TrainingProgram[] = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Comprehensive training from ML fundamentals to production deployment. Hands-on with PyTorch, TensorFlow, and cloud ML platforms.',
    icon: Brain,
    duration: '40-80 hours',
    format: ['Instructor-led', 'Self-paced', 'Bootcamp'],
    topics: [
      'Machine Learning Fundamentals',
      'Deep Learning & Neural Networks',
      'Natural Language Processing',
      'Computer Vision',
      'MLOps & Model Deployment',
      'Generative AI & LLMs',
    ],
    outcomes: [
      'Build production ML models',
      'Deploy models to cloud platforms',
      'Implement MLOps best practices',
      'Apply AI to business problems',
    ],
    level: 'all',
    popular: true,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Zero Trust',
    description: 'Enterprise security training covering threat detection, incident response, compliance frameworks, and zero trust architecture.',
    icon: Shield,
    duration: '32-64 hours',
    format: ['Instructor-led', 'Virtual labs', 'Certification prep'],
    topics: [
      'Security Fundamentals & Frameworks',
      'Threat Detection & Analysis',
      'Incident Response',
      'Zero Trust Architecture',
      'Cloud Security (AWS/Azure/GCP)',
      'Compliance (SOC2, HIPAA, PCI)',
    ],
    outcomes: [
      'Implement security controls',
      'Lead incident response',
      'Design zero trust architecture',
      'Prepare for certifications',
    ],
    level: 'all',
    popular: true,
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Engineering',
    description: 'Master cloud platforms, infrastructure as code, CI/CD pipelines, and containerization for modern application deployment.',
    icon: Globe,
    duration: '40-60 hours',
    format: ['Instructor-led', 'Hands-on labs', 'Projects'],
    topics: [
      'AWS/Azure/GCP Fundamentals',
      'Infrastructure as Code (Terraform)',
      'Kubernetes & Container Orchestration',
      'CI/CD Pipeline Design',
      'Site Reliability Engineering',
      'Cloud Cost Optimization',
    ],
    outcomes: [
      'Design cloud architectures',
      'Automate infrastructure',
      'Build CI/CD pipelines',
      'Optimize cloud costs',
    ],
    level: 'intermediate',
  },
  {
    id: 'quantum',
    title: 'Quantum Technologies Foundations',
    description: 'Introduction to quantum computing concepts, algorithms, and programming with Qiskit, Cirq, and cloud quantum platforms.',
    icon: Atom,
    duration: '24-40 hours',
    format: ['Instructor-led', 'IBM Quantum lab access'],
    topics: [
      'Quantum Mechanics for Computing',
      'Qubits & Quantum Gates',
      'Quantum Algorithms',
      'Qiskit Programming',
      'Quantum Machine Learning',
      'Post-Quantum Cryptography',
    ],
    outcomes: [
      'Understand quantum principles',
      'Write quantum programs',
      'Identify quantum use cases',
      'Prepare for quantum transition',
    ],
    level: 'advanced',
  },
  {
    id: 'semiconductor',
    title: 'Semiconductor Fundamentals',
    description: 'Essential training for semiconductor manufacturing, from device physics to fab operations and process engineering.',
    icon: Cpu,
    duration: '40-80 hours',
    format: ['Instructor-led', 'Virtual fab tours', 'Simulations'],
    topics: [
      'Device Physics & Materials',
      'Photolithography & Patterning',
      'Thin Film Deposition',
      'Etching & Planarization',
      'Metrology & Defect Analysis',
      'Yield Engineering',
    ],
    outcomes: [
      'Understand fab processes',
      'Analyze yield issues',
      'Apply process engineering',
      'Navigate CHIPS programs',
    ],
    level: 'all',
  },
  {
    id: 'leadership',
    title: 'Technical Leadership',
    description: 'Develop leadership skills for managing technical teams, from engineering management to executive leadership.',
    icon: Users,
    duration: '24-40 hours',
    format: ['Instructor-led', 'Cohort-based', 'Executive coaching'],
    topics: [
      'Engineering Management',
      'Technical Decision Making',
      'Team Building & Culture',
      'Stakeholder Communication',
      'Strategic Planning',
      'Executive Presence',
    ],
    outcomes: [
      'Lead high-performing teams',
      'Drive technical strategy',
      'Communicate with executives',
      'Build inclusive cultures',
    ],
    level: 'advanced',
  },
];

const deliveryFormats: DeliveryFormat[] = [
  {
    id: 'instructor-led',
    name: 'Instructor-Led Training',
    description: 'Live sessions with expert instructors, interactive Q&A, and real-time feedback.',
    icon: Video,
    features: [
      'Live virtual or on-site sessions',
      'Direct access to instructors',
      'Interactive exercises',
      'Real-time problem solving',
      'Cohort networking',
    ],
  },
  {
    id: 'self-paced',
    name: 'Self-Paced Learning',
    description: 'Flexible online courses that employees can complete on their own schedule.',
    icon: Laptop,
    features: [
      'Learn anytime, anywhere',
      'Video lectures & exercises',
      'Knowledge checks',
      'Completion certificates',
      'Mobile-friendly platform',
    ],
  },
  {
    id: 'bootcamp',
    name: 'Intensive Bootcamps',
    description: 'Accelerated, immersive programs for rapid skill development.',
    icon: Zap,
    features: [
      '1-4 week intensive format',
      'Full-time immersion',
      'Hands-on projects',
      'Career support included',
      'Guaranteed outcomes',
    ],
  },
  {
    id: 'custom',
    name: 'Custom Programs',
    description: 'Tailored training designed around your specific technologies and use cases.',
    icon: PenTool,
    features: [
      'Needs assessment included',
      'Custom curriculum design',
      'Your technology stack',
      'Your real-world problems',
      'Flexible delivery options',
    ],
  },
];

const corporatePartners: CorporatePartner[] = [
  {
    name: 'Fortune 100 Defense Contractor',
    industry: 'Aerospace & Defense',
    employees: '50,000+',
    programs: ['AI/ML Upskilling', 'Cloud Migration', 'Security Clearance Training'],
    logo: '/images/partners/defense.png',
  },
  {
    name: 'Global Semiconductor Company',
    industry: 'Semiconductor',
    employees: '100,000+',
    programs: ['Fab Operations', 'Process Engineering', 'Leadership Development'],
    logo: '/images/partners/semiconductor.png',
  },
  {
    name: 'National Laboratory',
    industry: 'Government Research',
    employees: '15,000+',
    programs: ['Quantum Technologies', 'Cybersecurity', 'Data Science'],
    logo: '/images/partners/laboratory.png',
  },
];

const instructors: Instructor[] = [
  {
    name: 'Dr. Sarah Chen',
    title: 'AI/ML Instructor',
    expertise: 'Deep Learning, NLP, MLOps',
    background: 'Former Senior ML Engineer at Google; PhD Stanford CS',
    image: '/images/instructors/sarah.jpg',
  },
  {
    name: 'Marcus Williams',
    title: 'Cybersecurity Instructor',
    expertise: 'Zero Trust, Threat Intelligence, Incident Response',
    background: 'Former NSA Analyst; CISSP, GIAC certified',
    image: '/images/instructors/marcus.jpg',
  },
  {
    name: 'Dr. James Park',
    title: 'Quantum Technologies Instructor',
    expertise: 'Quantum Algorithms, Qiskit, Post-Quantum Cryptography',
    background: 'Former IBM Quantum Researcher; PhD Physics MIT',
    image: '/images/instructors/james.jpg',
  },
  {
    name: 'Jennifer Martinez',
    title: 'Cloud & DevOps Instructor',
    expertise: 'AWS, Kubernetes, Terraform, SRE',
    background: 'Former Principal SRE at Netflix; AWS Ambassador',
    image: '/images/instructors/jennifer.jpg',
  },
];

// ===========================================
// Components
// ===========================================

const ProgramCard: React.FC<{ program: TrainingProgram; index: number }> = ({ program, index }) => {
  const Icon = program.icon;
  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
    all: 'bg-blue-100 text-blue-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
        program.popular ? 'ring-2 ring-teal-500' : ''
      }`}
    >
      {program.popular && (
        <div className="bg-teal-500 text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${levelColors[program.level]}`}>
                {program.level === 'all' ? 'All Levels' : program.level.charAt(0).toUpperCase() + program.level.slice(1)}
              </span>
              <span className="text-gray-500 text-sm">{program.duration}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{program.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Topics Covered:</h4>
          <div className="flex flex-wrap gap-1">
            {program.topics.slice(0, 4).map((topic, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {topic}
              </span>
            ))}
            {program.topics.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                +{program.topics.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Formats Available:</h4>
          <div className="flex flex-wrap gap-2">
            {program.format.map((fmt, idx) => (
              <span key={idx} className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium">
                {fmt}
              </span>
            ))}
          </div>
        </div>

        <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
          Learn More
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const FormatCard: React.FC<{ format: DeliveryFormat; index: number }> = ({ format, index }) => {
  const Icon = format.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-teal-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{format.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{format.description}</p>
      <ul className="space-y-2">
        {format.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const InstructorCard: React.FC<{ instructor: Instructor; index: number }> = ({ instructor, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {instructor.name.split(' ').map(n => n[0]).join('')}
      </div>
      <h3 className="font-bold text-gray-900">{instructor.name}</h3>
      <p className="text-teal-600 text-sm font-medium mb-1">{instructor.title}</p>
      <p className="text-gray-600 text-sm mb-2">{instructor.expertise}</p>
      <p className="text-gray-500 text-xs">{instructor.background}</p>
    </motion.div>
  );
};

// ===========================================
// Main Component
// ===========================================

const TrainingServicesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-900 via-cyan-900 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full mb-6">
                <GraduationCap className="w-5 h-5 text-teal-400" />
                <span className="text-teal-300 font-medium">Corporate Training & Upskilling</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Build the Skills Your
                <span className="text-teal-400"> Future Demands</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Transform your workforce with world-class training in AI, cybersecurity,
                cloud, quantum, and emerging technologies. Customized programs delivered
                by industry experts.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/training')}
                  className="px-8 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Explore Programs
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Request Custom Training
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Users className="w-10 h-10 text-teal-400 mb-3" />
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-gray-300">Professionals Trained</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Building2 className="w-10 h-10 text-teal-400 mb-3" />
                <div className="text-3xl font-bold">200+</div>
                <div className="text-gray-300">Enterprise Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-10 h-10 text-teal-400 mb-3" />
                <div className="text-3xl font-bold">4.8/5</div>
                <div className="text-gray-300">Learner Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <TrendingUp className="w-10 h-10 text-teal-400 mb-3" />
                <div className="text-3xl font-bold">92%</div>
                <div className="text-gray-300">Apply Skills at Work</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Programs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Training Programs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive programs in the technologies that matter most
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingPrograms.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>
      </div>

      {/* Delivery Formats */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Flexible Delivery Options
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the learning format that works best for your organization
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryFormats.map((format, index) => (
              <FormatCard key={format.id} format={format} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Meet Our Instructors */}
      <div className="bg-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learn from Industry Experts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our instructors bring real-world experience from leading tech companies
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor, index) => (
              <InstructorCard key={index} instructor={instructor} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Benefits */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Benefits</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Why leading organizations choose STEM Workforce for their training needs
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Target, title: 'Custom Content', desc: 'Training built around your tech stack and use cases' },
              { icon: BarChart3, title: 'Analytics', desc: 'Detailed learning analytics and ROI reporting' },
              { icon: Layers, title: 'LMS Integration', desc: 'Seamless integration with your existing LMS' },
              { icon: Globe, title: 'Global Delivery', desc: 'Multi-timezone, multi-language support' },
              { icon: Shield, title: 'Security', desc: 'SOC 2 compliant, SCORM/xAPI compatible' },
              { icon: Headphones, title: 'Support', desc: 'Dedicated success manager for your program' },
              { icon: Award, title: 'Certifications', desc: 'Industry-recognized certificates and badges' },
              { icon: TrendingUp, title: 'Outcomes', desc: 'Guaranteed skill application at work' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've trained teams at some of the world's most innovative organizations
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {corporatePartners.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{partner.name}</h3>
                  <p className="text-gray-500 text-sm">{partner.industry}</p>
                  <p className="text-gray-400 text-sm">{partner.employees} employees</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {partner.programs.map((program, progIdx) => (
                  <span key={progIdx} className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                    {program}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Upskill Your Team?
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Let's discuss your training needs and design a program that delivers results.
            We offer volume discounts and flexible payment options.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Download Course Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingServicesPage;
