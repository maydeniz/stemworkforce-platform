// ===========================================
// Technical Portfolio Page - College Students
// Showcase projects that impress employers
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Github,
  ExternalLink,
  Code,
  Folder,
  Star,
  Eye,
  GitBranch,
  Play,
  ChevronRight,
  Plus,
  Sparkles,
  Tag,
  Image,
  FileText,
  Video,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
  category: 'web' | 'ml' | 'mobile' | 'systems' | 'data';
  featured: boolean;
  metrics?: { label: string; value: string }[];
}

interface ProjectIdea {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  description: string;
  skills: string[];
}

// ===========================================
// SAMPLE DATA
// ===========================================
const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Real-Time Collaborative Code Editor',
    description: 'A VS Code-like editor supporting multiple users editing simultaneously with live cursors and syntax highlighting.',
    technologies: ['React', 'TypeScript', 'WebSocket', 'Monaco Editor', 'Node.js'],
    liveUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/user/project',
    category: 'web',
    featured: true,
    metrics: [
      { label: 'Concurrent Users', value: '50+' },
      { label: 'Latency', value: '<100ms' },
    ],
  },
  {
    id: '2',
    title: 'ML-Powered Resume Parser',
    description: 'NLP model that extracts structured data from resumes with 94% accuracy using BERT embeddings.',
    technologies: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'Docker'],
    githubUrl: 'https://github.com/user/resume-parser',
    category: 'ml',
    featured: true,
    metrics: [
      { label: 'Accuracy', value: '94%' },
      { label: 'Processing Time', value: '2.3s' },
    ],
  },
  {
    id: '3',
    title: 'Distributed Key-Value Store',
    description: 'Implementation of Raft consensus algorithm for a fault-tolerant distributed database.',
    technologies: ['Go', 'gRPC', 'Docker', 'Kubernetes'],
    githubUrl: 'https://github.com/user/raft-kv',
    category: 'systems',
    featured: false,
    metrics: [
      { label: 'Throughput', value: '50K ops/s' },
      { label: 'Nodes', value: '5-node cluster' },
    ],
  },
];

const PROJECT_IDEAS: ProjectIdea[] = [
  {
    id: '1',
    title: 'Personal Finance Tracker',
    difficulty: 'beginner',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    description: 'Build a full-stack app to track expenses, visualize spending patterns, and set budgets.',
    skills: ['Full-stack development', 'Data visualization', 'Authentication'],
  },
  {
    id: '2',
    title: 'AI Chatbot with RAG',
    difficulty: 'intermediate',
    technologies: ['Python', 'LangChain', 'OpenAI API', 'Vector DB'],
    description: 'Create a chatbot that can answer questions about your documents using retrieval augmented generation.',
    skills: ['LLMs', 'Vector databases', 'API integration'],
  },
  {
    id: '3',
    title: 'Custom Linux Shell',
    difficulty: 'intermediate',
    technologies: ['C', 'Linux', 'System Calls'],
    description: 'Implement a Unix shell with piping, redirection, job control, and signal handling.',
    skills: ['Systems programming', 'Process management', 'C programming'],
  },
  {
    id: '4',
    title: 'Kubernetes Operator',
    difficulty: 'advanced',
    technologies: ['Go', 'Kubernetes', 'Docker'],
    description: 'Build a custom Kubernetes operator to automate deployment and scaling of a specific workload.',
    skills: ['Cloud native', 'Go programming', 'DevOps'],
  },
];

const PORTFOLIO_TIPS = [
  { title: 'Quality over Quantity', description: '3-5 impressive projects beats 10 basic ones' },
  { title: 'Show Impact', description: 'Include metrics: users served, performance gains, accuracy' },
  { title: 'Write Good READMEs', description: 'Clear documentation shows professionalism' },
  { title: 'Deploy Everything', description: 'Live demos are 10x more impressive than screenshots' },
  { title: 'Contribute to Open Source', description: 'Shows collaboration and real-world experience' },
];

// ===========================================
// COMPONENT
// ===========================================
const TechnicalPortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'showcase' | 'ideas' | 'tips'>('showcase');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { info } = useNotifications();

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'ml', label: 'ML/AI' },
    { id: 'systems', label: 'Systems' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'data', label: 'Data' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? SAMPLE_PROJECTS
    : SAMPLE_PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-950 to-indigo-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-violet-400 mb-4">
            <Link to="/college/professional-development" className="hover:underline">Professional Development</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Technical Portfolio</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Technical
                <span className="text-violet-400"> Portfolio</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Showcase your best projects to impress employers. Get project ideas,
                templates, and tips to build a portfolio that stands out.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => info('Project editor is coming soon! We\'re building an interactive portfolio builder.')} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-5 h-5" />
                  Add Project
                </button>
                <button onClick={() => info('GitHub import is coming soon!')} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700">
                  <Github className="w-5 h-5" />
                  Import from GitHub
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Folder, label: 'Projects', value: '5', color: 'violet' },
                { icon: Star, label: 'GitHub Stars', value: '234', color: 'yellow' },
                { icon: Eye, label: 'Portfolio Views', value: '1.2K', color: 'blue' },
                { icon: GitBranch, label: 'Contributions', value: '89', color: 'green' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                  <stat.icon className={`w-8 h-8 mb-2 ${stat.color === 'violet' ? 'text-violet-400' : stat.color === 'yellow' ? 'text-yellow-400' : stat.color === 'blue' ? 'text-blue-400' : 'text-green-400'}`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'showcase', label: 'My Portfolio', icon: Folder },
            { id: 'ideas', label: 'Project Ideas', icon: Lightbulb },
            { id: 'tips', label: 'Portfolio Tips', icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-violet-400 border-violet-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Showcase Tab */}
        {activeTab === 'showcase' && (
          <div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors group"
                >
                  {/* Project Image/Preview */}
                  <div className="aspect-video bg-gray-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="w-12 h-12 text-gray-600" />
                    </div>
                    {project.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                          <Github className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-500 rounded">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Metrics */}
                    {project.metrics && (
                      <div className="flex gap-4 pt-4 border-t border-gray-800">
                        {project.metrics.map((metric, i) => (
                          <div key={i}>
                            <div className="text-sm font-semibold text-violet-400">{metric.value}</div>
                            <div className="text-xs text-gray-500">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Project Card */}
              <button onClick={() => info('Project editor is coming soon! We\'re building an interactive portfolio builder.')} className="bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-700 hover:border-violet-500/50 transition-colors p-8 flex flex-col items-center justify-center min-h-[300px] group">
                <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-violet-500/10 flex items-center justify-center mb-4 transition-colors">
                  <Plus className="w-8 h-8 text-gray-500 group-hover:text-violet-400 transition-colors" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors font-medium">
                  Add New Project
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Project Ideas Tab */}
        {activeTab === 'ideas' && (
          <div>
            <div className="bg-gradient-to-r from-violet-900/20 to-indigo-900/20 rounded-xl border border-violet-500/20 p-6 mb-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-violet-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Not Sure What to Build?</h3>
                  <p className="text-gray-300">
                    Here are curated project ideas based on what top companies look for.
                    Each project teaches valuable skills and makes a great portfolio piece.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {PROJECT_IDEAS.map(idea => (
                <div key={idea.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{idea.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      idea.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' :
                      idea.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {idea.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{idea.description}</p>

                  <div className="mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Technologies</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {idea.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-violet-500/10 text-violet-400 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Skills You'll Learn</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {idea.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => info('Project starter kits are coming soon!')} className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Start This Project
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Portfolio Best Practices</h3>

              {PORTFOLIO_TIPS.map((tip, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-white mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-400">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">What to Include</h3>

              {[
                { icon: FileText, title: 'README Files', desc: 'Clear setup instructions, architecture overview, and contribution guide' },
                { icon: Image, title: 'Screenshots/GIFs', desc: 'Visual demos of your project in action' },
                { icon: Video, title: 'Demo Videos', desc: '2-3 minute walkthrough of key features' },
                { icon: Code, title: 'Clean Code', desc: 'Well-organized, commented, and following best practices' },
                { icon: Tag, title: 'Live Deployment', desc: 'Deployed on Vercel, Railway, AWS, etc.' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                  <div className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-violet-900/30 to-indigo-900/30 rounded-2xl border border-violet-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Make Your Portfolio Shine</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get feedback from industry professionals and stand out from other candidates.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => info('AI portfolio review is coming soon!')} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Sparkles className="w-5 h-5" />
              Get AI Feedback
            </button>
            <Link
              to="/college/resume-builder"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Resume Builder
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalPortfolioPage;
