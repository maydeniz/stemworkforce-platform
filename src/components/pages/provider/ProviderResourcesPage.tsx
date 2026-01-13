import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  FileText,
  Video,
  BookOpen,
  Lightbulb,
  Target,
  DollarSign,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  Shield,
  Play,
  Clock,
  CheckCircle,
  Star,
  PenTool,
  Search,
  Settings,
  HelpCircle,
  Bookmark,
  ChevronRight
} from 'lucide-react';

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'template' | 'guide' | 'video' | 'tool' | 'webinar';
  category: string;
  downloadUrl?: string;
  externalUrl?: string;
  duration?: string;
  downloads?: number;
  featured?: boolean;
  new?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  speaker: string;
  speakerTitle: string;
  speakerImage: string;
  registered: number;
  upcoming: boolean;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  badge?: string;
}

// Data
const categories: Category[] = [
  { id: 'all', name: 'All Resources', icon: <BookOpen className="h-5 w-5" />, count: 45 },
  { id: 'templates', name: 'Templates', icon: <FileText className="h-5 w-5" />, count: 12 },
  { id: 'guides', name: 'Guides & Tutorials', icon: <Lightbulb className="h-5 w-5" />, count: 18 },
  { id: 'videos', name: 'Video Training', icon: <Video className="h-5 w-5" />, count: 10 },
  { id: 'tools', name: 'Tools & Calculators', icon: <Settings className="h-5 w-5" />, count: 5 }
];

const resources: Resource[] = [
  // Templates
  {
    id: '1',
    title: 'Consulting Services Agreement Template',
    description: 'Legally reviewed contract template for consulting engagements. Customizable for any project type.',
    type: 'template',
    category: 'templates',
    downloadUrl: '#',
    downloads: 2847,
    featured: true
  },
  {
    id: '2',
    title: 'Statement of Work (SOW) Template',
    description: 'Professional SOW template with milestone tracking, deliverables, and payment terms.',
    type: 'template',
    category: 'templates',
    downloadUrl: '#',
    downloads: 2134
  },
  {
    id: '3',
    title: 'Proposal Template Pack',
    description: 'Three proposal templates for different project sizes. Includes pricing table and case study sections.',
    type: 'template',
    category: 'templates',
    downloadUrl: '#',
    downloads: 3251,
    featured: true
  },
  {
    id: '4',
    title: 'Invoice Template',
    description: 'Professional invoice template with time tracking integration and payment terms.',
    type: 'template',
    category: 'templates',
    downloadUrl: '#',
    downloads: 1892
  },
  {
    id: '5',
    title: 'NDA Template (Mutual)',
    description: 'Standard mutual non-disclosure agreement for client conversations.',
    type: 'template',
    category: 'templates',
    downloadUrl: '#',
    downloads: 1567
  },
  {
    id: '6',
    title: 'Project Kickoff Deck Template',
    description: 'PowerPoint template for client kickoff meetings. Includes agenda, timeline, and stakeholder sections.',
    type: 'template',
    category: 'templates',
    downloadUrl: '#',
    downloads: 987,
    new: true
  },
  // Guides
  {
    id: '7',
    title: 'The Complete Guide to Setting Your Rates',
    description: 'Data-driven framework for pricing your services. Includes market rate benchmarks and negotiation scripts.',
    type: 'guide',
    category: 'guides',
    downloadUrl: '#',
    downloads: 4521,
    featured: true
  },
  {
    id: '8',
    title: 'Winning Proposals: A Step-by-Step Guide',
    description: 'Learn how top consultants write proposals that convert. Real examples and templates included.',
    type: 'guide',
    category: 'guides',
    downloadUrl: '#',
    downloads: 3876
  },
  {
    id: '9',
    title: 'Building Your Personal Brand on STEM Workforce',
    description: 'Optimize your profile, gather reviews, and stand out in the marketplace.',
    type: 'guide',
    category: 'guides',
    downloadUrl: '#',
    downloads: 2943
  },
  {
    id: '10',
    title: 'Client Communication Best Practices',
    description: 'Templates and scripts for every client touchpoint from initial contact to project completion.',
    type: 'guide',
    category: 'guides',
    downloadUrl: '#',
    downloads: 2156
  },
  {
    id: '11',
    title: 'Scope Creep Prevention Playbook',
    description: 'Protect your time and profits with proven strategies for managing project scope.',
    type: 'guide',
    category: 'guides',
    downloadUrl: '#',
    downloads: 1834,
    new: true
  },
  {
    id: '12',
    title: 'Tax Guide for Independent Consultants',
    description: '2025 tax strategies, deductions, and quarterly planning for freelance professionals.',
    type: 'guide',
    category: 'guides',
    downloadUrl: '#',
    downloads: 3102
  },
  // Videos
  {
    id: '13',
    title: 'Platform Masterclass: Getting Started',
    description: 'Complete walkthrough of the STEM Workforce platform. Set up your profile for success.',
    type: 'video',
    category: 'videos',
    externalUrl: '#',
    duration: '45 min',
    featured: true
  },
  {
    id: '14',
    title: 'Rate Negotiation Workshop',
    description: 'Live workshop recording: Negotiation tactics from consultants earning $400+/hour.',
    type: 'video',
    category: 'videos',
    externalUrl: '#',
    duration: '1 hr 20 min'
  },
  {
    id: '15',
    title: 'Discovery Call Framework',
    description: 'How to run discovery calls that qualify clients and set expectations.',
    type: 'video',
    category: 'videos',
    externalUrl: '#',
    duration: '32 min'
  },
  {
    id: '16',
    title: 'Building Long-Term Client Relationships',
    description: 'Turn one-time projects into ongoing retainer relationships.',
    type: 'video',
    category: 'videos',
    externalUrl: '#',
    duration: '28 min',
    new: true
  }
];

const webinars: Webinar[] = [
  {
    id: '1',
    title: 'AI Consulting in 2025: Opportunities & Pricing',
    description: 'Market analysis and pricing strategies for AI/ML consultants in the current landscape.',
    date: 'January 15, 2025',
    time: '2:00 PM EST',
    speaker: 'Dr. Sarah Chen',
    speakerTitle: 'Top AI Consultant, $420K/year',
    speakerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    registered: 847,
    upcoming: true
  },
  {
    id: '2',
    title: 'Federal Contracting for STEM Consultants',
    description: 'Navigate GSA schedules, security clearances, and government contracting opportunities.',
    date: 'January 22, 2025',
    time: '1:00 PM EST',
    speaker: 'Marcus Williams',
    speakerTitle: 'Cybersecurity Consultant, Ex-NSA',
    speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    registered: 623,
    upcoming: true
  },
  {
    id: '3',
    title: 'From Employee to $300K Consultant',
    description: 'Recorded: How to transition from full-time employment to premium consulting.',
    date: 'December 12, 2024',
    time: 'On-Demand',
    speaker: 'Jennifer Park',
    speakerTitle: 'Former Google Staff Engineer',
    speakerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    registered: 2341,
    upcoming: false
  }
];

const platformTools: Tool[] = [
  {
    id: '1',
    name: 'Rate Calculator',
    description: 'Calculate your ideal hourly rate based on your target income and work preferences.',
    icon: <DollarSign className="h-6 w-6" />,
    url: '#',
    badge: 'Popular'
  },
  {
    id: '2',
    name: 'Proposal Builder',
    description: 'AI-powered proposal generator. Input project details, get a professional proposal.',
    icon: <PenTool className="h-6 w-6" />,
    url: '#',
    badge: 'New'
  },
  {
    id: '3',
    name: 'Profile Optimizer',
    description: 'Get AI suggestions to improve your profile visibility and conversion rate.',
    icon: <Target className="h-6 w-6" />,
    url: '#'
  },
  {
    id: '4',
    name: 'Earnings Tracker',
    description: 'Track your projects, hours, and earnings. Export for tax preparation.',
    icon: <BarChart3 className="h-6 w-6" />,
    url: '#'
  },
  {
    id: '5',
    name: 'Contract Analyzer',
    description: 'Upload client contracts to identify risky clauses and missing protections.',
    icon: <Shield className="h-6 w-6" />,
    url: '#',
    badge: 'Beta'
  }
];

const successTips = [
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Complete Your Profile 100%',
    description: 'Providers with complete profiles get 3x more inquiries.'
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Respond Within 4 Hours',
    description: 'Quick responses lead to 2x higher win rates.'
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: 'Request Reviews',
    description: 'Providers with 5+ reviews earn 40% higher rates.'
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Add Case Studies',
    description: 'Show your work—case studies convert browsers to buyers.'
  }
];

const ProviderResourcesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template': return <FileText className="h-5 w-5" />;
      case 'guide': return <BookOpen className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'tool': return <Settings className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'template': return 'bg-blue-100 text-blue-600';
      case 'guide': return 'bg-green-100 text-green-600';
      case 'video': return 'bg-purple-100 text-purple-600';
      case 'tool': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="h-5 w-5 text-amber-400" />
              <span className="text-amber-200 font-medium">Provider Resource Center</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tools & Resources to
              <span className="block text-amber-400">Grow Your Practice</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Templates, guides, training, and tools to help you win more clients,
              set higher rates, and deliver exceptional results.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates, guides, videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Success Tips */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Tips for Success</h2>
            <Link to="/provider-apply" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              Not a provider yet? <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {successTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {category.icon}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className={`text-sm ${
                      activeCategory === category.id ? 'text-indigo-500' : 'text-gray-400'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Tools */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Platform Tools</h3>
              <div className="space-y-3">
                {platformTools.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{tool.name}</span>
                        {tool.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            tool.badge === 'New' ? 'bg-green-100 text-green-600' :
                            tool.badge === 'Beta' ? 'bg-amber-100 text-amber-600' :
                            'bg-indigo-100 text-indigo-600'
                          }`}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{tool.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Featured Resources */}
            {activeCategory === 'all' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Resources</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {resources.filter(r => r.featured).map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm mb-4`}>
                        {getTypeIcon(resource.type)}
                        <span className="capitalize">{resource.type}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                      <p className="text-indigo-100 mb-4 text-sm">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-200 text-sm">
                          {resource.downloads?.toLocaleString()} downloads
                        </span>
                        <a
                          href={resource.downloadUrl || resource.externalUrl}
                          className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors"
                        >
                          {resource.type === 'video' ? 'Watch' : 'Download'}
                          {resource.type === 'video' ? <Play className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Resources Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeCategory === 'all' ? 'All Resources' : categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <span className="text-gray-500">{filteredResources.length} resources</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                        <span className="capitalize">{resource.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {resource.new && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">
                            New
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-indigo-600">
                          <Bookmark className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {resource.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {resource.duration}
                          </span>
                        )}
                        {resource.downloads && (
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {resource.downloads.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <a
                        href={resource.downloadUrl || resource.externalUrl}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        {resource.type === 'video' ? 'Watch' : 'Download'}
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Webinars Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Live & On-Demand Webinars
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from top-earning consultants and industry experts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {webinars.map((webinar, index) => (
              <motion.div
                key={webinar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl overflow-hidden"
              >
                <div className={`px-6 py-4 ${webinar.upcoming ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span className="font-medium">{webinar.date}</span>
                    </div>
                    {webinar.upcoming ? (
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Upcoming</span>
                    ) : (
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">On-Demand</span>
                    )}
                  </div>
                  <div className="text-indigo-200 text-sm mt-1">{webinar.time}</div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{webinar.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{webinar.description}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={webinar.speakerImage}
                      alt={webinar.speaker}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{webinar.speaker}</div>
                      <div className="text-sm text-gray-500">{webinar.speakerTitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {webinar.registered.toLocaleString()} registered
                    </span>
                    <button className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      webinar.upcoming
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}>
                      {webinar.upcoming ? 'Register Free' : 'Watch Now'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Need Personalized Help?
                </h2>
                <p className="text-gray-600 mb-6">
                  Our provider success team is here to help you grow your consulting practice.
                  Book a free strategy session to discuss your goals.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Profile optimization review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Rate benchmarking and strategy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Client acquisition tactics</span>
                  </div>
                </div>
                <button className="mt-8 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                  Book Free Strategy Call
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-xl p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
                  <p className="text-sm text-gray-600">Available 9am-6pm EST</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <HelpCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">Help Center</h4>
                  <p className="text-sm text-gray-600">100+ articles & guides</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">Community</h4>
                  <p className="text-sm text-gray-600">Join 2,500+ providers</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 text-center">
                  <Video className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">Video Tutorials</h4>
                  <p className="text-sm text-gray-600">Step-by-step guides</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Apply now and get access to all these resources plus our marketplace of pre-qualified clients.
            </p>
            <Link to="/provider-apply">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors"
              >
                Apply to Become a Provider
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProviderResourcesPage;
