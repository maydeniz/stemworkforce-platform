// ===========================================
// Professional Development Page - College Students
// Skills, Certifications, Networking
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExpertQASection from '@/components/shared/ExpertQASection';
import {
  Award,
  BookOpen,
  Users,
  Target,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Cloud,
  Shield,
  Database,
  Brain,
  Cpu,
  Zap,
  Star,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Certification {
  id: string;
  name: string;
  provider: string;
  category: 'cloud' | 'security' | 'data' | 'dev' | 'project';
  level: 'entry' | 'associate' | 'professional';
  avgSalary: string;
  studyTime: string;
  cost: string;
  demandLevel: 'high' | 'medium' | 'growing';
  studentDiscount: boolean;
  icon: React.ReactNode;
}

interface Skill {
  name: string;
  category: string;
  demandScore: number;
  growthRate: string;
  avgSalary: string;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const CERTIFICATIONS: Certification[] = [
  {
    id: '1',
    name: 'AWS Certified Cloud Practitioner',
    provider: 'Amazon Web Services',
    category: 'cloud',
    level: 'entry',
    avgSalary: '$95,000',
    studyTime: '4-6 weeks',
    cost: '$100',
    demandLevel: 'high',
    studentDiscount: true,
    icon: <Cloud className="w-6 h-6" />,
  },
  {
    id: '2',
    name: 'CompTIA Security+',
    provider: 'CompTIA',
    category: 'security',
    level: 'entry',
    avgSalary: '$72,000',
    studyTime: '6-8 weeks',
    cost: '$392',
    demandLevel: 'high',
    studentDiscount: true,
    icon: <Shield className="w-6 h-6" />,
  },
  {
    id: '3',
    name: 'Google Professional Data Engineer',
    provider: 'Google Cloud',
    category: 'data',
    level: 'professional',
    avgSalary: '$135,000',
    studyTime: '8-12 weeks',
    cost: '$200',
    demandLevel: 'high',
    studentDiscount: true,
    icon: <Database className="w-6 h-6" />,
  },
  {
    id: '4',
    name: 'Microsoft Azure Fundamentals',
    provider: 'Microsoft',
    category: 'cloud',
    level: 'entry',
    avgSalary: '$89,000',
    studyTime: '2-4 weeks',
    cost: '$99',
    demandLevel: 'high',
    studentDiscount: true,
    icon: <Cloud className="w-6 h-6" />,
  },
  {
    id: '5',
    name: 'Certified Kubernetes Administrator',
    provider: 'CNCF',
    category: 'dev',
    level: 'professional',
    avgSalary: '$145,000',
    studyTime: '8-12 weeks',
    cost: '$395',
    demandLevel: 'growing',
    studentDiscount: false,
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    id: '6',
    name: 'TensorFlow Developer Certificate',
    provider: 'Google',
    category: 'data',
    level: 'associate',
    avgSalary: '$125,000',
    studyTime: '6-10 weeks',
    cost: '$100',
    demandLevel: 'growing',
    studentDiscount: true,
    icon: <Brain className="w-6 h-6" />,
  },
];

const TOP_SKILLS: Skill[] = [
  { name: 'Python', category: 'Programming', demandScore: 98, growthRate: '+15%', avgSalary: '$115,000' },
  { name: 'Machine Learning', category: 'AI/ML', demandScore: 95, growthRate: '+28%', avgSalary: '$135,000' },
  { name: 'Cloud Computing', category: 'Infrastructure', demandScore: 94, growthRate: '+22%', avgSalary: '$125,000' },
  { name: 'Data Analysis', category: 'Data', demandScore: 92, growthRate: '+18%', avgSalary: '$95,000' },
  { name: 'Cybersecurity', category: 'Security', demandScore: 91, growthRate: '+25%', avgSalary: '$105,000' },
  { name: 'DevOps', category: 'Operations', demandScore: 89, growthRate: '+20%', avgSalary: '$120,000' },
];

const NETWORKING_TIPS = [
  {
    title: 'Optimize Your LinkedIn',
    description: 'Use a professional photo, compelling headline, and keyword-rich summary',
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: 'Attend Industry Events',
    description: 'Conferences, meetups, and hackathons are great for making connections',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'Request Informational Interviews',
    description: 'Learn from professionals in roles you\'re interested in',
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: 'Join Professional Associations',
    description: 'IEEE, ACM, and other orgs offer student memberships at reduced rates',
    icon: <Award className="w-6 h-6" />,
  },
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const ProfessionalDevelopmentPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredCerts = CERTIFICATIONS.filter(cert => {
    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || cert.level === selectedLevel;
    return matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              For College Students
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Professional{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Development
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Build in-demand skills, earn industry certifications, and expand your
              professional network while still in school.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/college/skills-assessment"
                className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-xl transition-colors"
              >
                Take Skills Assessment
              </Link>
              <Link
                to="/college/certification-pathways"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                Explore Certifications
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Dashboard */}
      <section className="py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Most In-Demand Skills</h2>
              <p className="text-gray-400 mt-1">Based on 2024-2025 STEM job postings</p>
            </div>
            <Link
              to="/college/skills-assessment"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Assess Your Skills
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOP_SKILLS.map((skill, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    <p className="text-sm text-gray-500">{skill.category}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded">
                    {skill.growthRate} YoY
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Demand Score</span>
                    <span className="text-white font-medium">{skill.demandScore}/100</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${skill.demandScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Avg Salary</span>
                  <span className="text-green-400 font-medium">{skill.avgSalary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Industry Certifications</h2>
              <p className="text-gray-400 mt-1">Validate your skills with credentials employers recognize</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="cloud">Cloud</option>
                <option value="security">Security</option>
                <option value="data">Data</option>
                <option value="dev">Development</option>
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Levels</option>
                <option value="entry">Entry-Level</option>
                <option value="associate">Associate</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${
                    cert.category === 'cloud' ? 'bg-blue-500/20 text-blue-400' :
                    cert.category === 'security' ? 'bg-red-500/20 text-red-400' :
                    cert.category === 'data' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {cert.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-gray-500">{cert.provider}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Avg Salary Boost</span>
                    <span className="text-green-400 font-medium">{cert.avgSalary}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Study Time</span>
                    <span className="text-white">{cert.studyTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Exam Cost</span>
                    <span className="text-white">{cert.cost}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cert.level === 'entry' ? 'bg-blue-500/20 text-blue-400' :
                    cert.level === 'associate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {cert.level}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cert.demandLevel === 'high' ? 'bg-green-500/20 text-green-400' :
                    cert.demandLevel === 'growing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {cert.demandLevel} demand
                  </span>
                  {cert.studentDiscount && (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                      Student Discount
                    </span>
                  )}
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors">
                  View Study Guide
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filteredCerts.length === 0 && (
            <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
              <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No certifications found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Networking Section */}
      <section className="py-12 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Build Your Professional Network
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your network is your net worth. Start building meaningful professional
              relationships while you're still in school.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {NETWORKING_TIPS.map((tip, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-purple-500/50 transition-all"
              >
                <div className="inline-flex p-4 bg-purple-500/10 text-purple-400 rounded-full mb-4">
                  {tip.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-400">{tip.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Find a Mentor in Your Field
                </h3>
                <p className="text-gray-400 mb-6">
                  Connect with industry professionals who can guide your career decisions,
                  review your resume, and help you navigate the job market.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/college/mentorship"
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-xl transition-colors"
                  >
                    Find a Mentor
                  </Link>
                  <Link
                    to="/service-providers?type=career-coach"
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Hire a Coach
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Mentors', value: '500+', icon: <Users className="w-5 h-5" /> },
                  { label: 'Industries', value: '25+', icon: <Target className="w-5 h-5" /> },
                  { label: 'Companies', value: '200+', icon: <Star className="w-5 h-5" /> },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="flex items-center justify-center text-purple-400 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Build Your Technical Portfolio
              </h2>
              <p className="text-gray-400 mb-6">
                Show, don't tell. Create a professional portfolio that showcases your
                projects, contributions, and technical skills to potential employers.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Project showcase with live demos',
                  'GitHub integration and code highlights',
                  'Technical blog and case studies',
                  'Visitor analytics and employer alerts',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/college/portfolio-builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-xl transition-colors"
              >
                Start Building
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-gray-500">// Featured Project</div>
                  <div className="text-purple-400">const portfolio = {'{'}</div>
                  <div className="pl-4 text-gray-300">name: <span className="text-green-400">"STEM Portfolio"</span>,</div>
                  <div className="pl-4 text-gray-300">projects: <span className="text-yellow-400">12</span>,</div>
                  <div className="pl-4 text-gray-300">skills: [<span className="text-green-400">"React"</span>, <span className="text-green-400">"Python"</span>, <span className="text-green-400">"ML"</span>],</div>
                  <div className="pl-4 text-gray-300">views: <span className="text-yellow-400">2,847</span></div>
                  <div className="text-purple-400">{'}'}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last updated 2 days ago</span>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  Portfolio live
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Professional Development Journey
          </h2>
          <p className="text-gray-400 mb-8">
            Take the first step towards a successful STEM career. Assess your skills,
            create a development plan, and start building your professional brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/college/skills-assessment"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-colors"
            >
              Take Skills Assessment
            </Link>
            <Link
              to="/college/career-launch"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Explore Job Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Expert Skill Development Q&A */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExpertQASection
            scenario="skill-development"
            title="Skill Development Advice"
            description="Expert guidance on building skills and advancing your STEM career"
            limit={5}
            showTags
            showScenarios
          />
        </div>
      </section>
    </div>
  );
};

export default ProfessionalDevelopmentPage;
