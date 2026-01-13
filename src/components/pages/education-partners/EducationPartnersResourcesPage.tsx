// ===========================================
// Education Partners Resources Page
// Tools, guides, templates, and best practices
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Play,
  Calendar,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Lightbulb,
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  Search,
  Clock,
  Star,
  Zap,
  PieChart
} from 'lucide-react';

// ===========================================
// RESOURCE CATEGORIES
// ===========================================
const CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: BookOpen },
  { id: 'guides', label: 'Guides & Playbooks', icon: FileText },
  { id: 'templates', label: 'Templates', icon: Download },
  { id: 'webinars', label: 'Webinars', icon: Video },
  { id: 'tools', label: 'Tools', icon: Zap },
  { id: 'reports', label: 'Industry Reports', icon: BarChart3 }
];

// ===========================================
// RESOURCES DATA
// ===========================================
const RESOURCES = [
  // Guides
  {
    id: 1,
    category: 'guides',
    title: 'The Complete Guide to Industry-Academic Partnerships',
    description: 'Learn how to build sustainable relationships with employers that benefit both students and industry partners.',
    type: 'PDF Guide',
    duration: '45 min read',
    icon: BookOpen,
    featured: true,
    tags: ['Partnership', 'Best Practices', 'Employer Relations']
  },
  {
    id: 2,
    category: 'guides',
    title: 'Curriculum Alignment Playbook',
    description: 'Step-by-step guide to aligning your curriculum with industry skill demands using labor market data.',
    type: 'PDF Guide',
    duration: '30 min read',
    icon: Target,
    tags: ['Curriculum', 'Skills Gap', 'Labor Market']
  },
  {
    id: 3,
    category: 'guides',
    title: 'Building Successful Apprenticeship Programs',
    description: 'Everything you need to know about creating and scaling registered apprenticeship programs.',
    type: 'PDF Guide',
    duration: '60 min read',
    icon: GraduationCap,
    tags: ['Apprenticeship', 'Work-Based Learning', 'DOL']
  },
  {
    id: 4,
    category: 'guides',
    title: 'Maximizing Placement Rates: A Data-Driven Approach',
    description: 'Use analytics and employer feedback to improve student outcomes and placement rates.',
    type: 'PDF Guide',
    duration: '25 min read',
    icon: TrendingUp,
    tags: ['Placement', 'Analytics', 'Outcomes']
  },
  // Templates
  {
    id: 5,
    category: 'templates',
    title: 'Employer Partnership Agreement Template',
    description: 'Customizable MOU template for formalizing industry partnerships.',
    type: 'Word Document',
    duration: 'Editable',
    icon: FileText,
    tags: ['Legal', 'Partnership', 'Agreement']
  },
  {
    id: 6,
    category: 'templates',
    title: 'Graduate Outcome Survey Template',
    description: 'Comprehensive survey for tracking graduate employment outcomes and satisfaction.',
    type: 'Survey Template',
    duration: 'Customizable',
    icon: BarChart3,
    tags: ['Survey', 'Outcomes', 'Data Collection']
  },
  {
    id: 7,
    category: 'templates',
    title: 'Industry Advisory Board Charter',
    description: 'Framework for establishing and managing an industry advisory board.',
    type: 'Word Document',
    duration: 'Editable',
    icon: Users,
    tags: ['Advisory Board', 'Governance', 'Industry Input']
  },
  {
    id: 8,
    category: 'templates',
    title: 'Virtual Career Fair Run-of-Show',
    description: 'Complete planning template for hosting successful virtual career fairs.',
    type: 'Excel Template',
    duration: 'Editable',
    icon: Calendar,
    tags: ['Career Fair', 'Events', 'Planning']
  },
  // Webinars
  {
    id: 9,
    category: 'webinars',
    title: 'Future of Work: AI\'s Impact on STEM Careers',
    description: 'Industry experts discuss how AI is reshaping STEM job requirements and curriculum needs.',
    type: 'Video',
    duration: '55 min',
    icon: Video,
    featured: true,
    tags: ['AI', 'Future of Work', 'Industry Trends']
  },
  {
    id: 10,
    category: 'webinars',
    title: 'From Classroom to Career: Bridging the Skills Gap',
    description: 'Panel discussion with HR leaders on what employers really want from new graduates.',
    type: 'Video',
    duration: '48 min',
    icon: Video,
    tags: ['Skills Gap', 'Employer Insights', 'Career Readiness']
  },
  {
    id: 11,
    category: 'webinars',
    title: 'Leveraging Federal Funding for STEM Education',
    description: 'Navigate CHIPS Act, NSF grants, and other federal funding opportunities for STEM programs.',
    type: 'Video',
    duration: '62 min',
    icon: Video,
    tags: ['Funding', 'CHIPS Act', 'Grants']
  },
  {
    id: 12,
    category: 'webinars',
    title: 'Data-Driven Decision Making for Career Services',
    description: 'Learn how to use analytics to improve student outcomes and demonstrate program ROI.',
    type: 'Video',
    duration: '45 min',
    icon: Video,
    tags: ['Analytics', 'Career Services', 'ROI']
  },
  // Tools
  {
    id: 13,
    category: 'tools',
    title: 'Skills Gap Analyzer',
    description: 'Compare your curriculum against current job posting requirements in real-time.',
    type: 'Interactive Tool',
    duration: 'Online',
    icon: Target,
    featured: true,
    tags: ['Skills Gap', 'Curriculum', 'Analysis']
  },
  {
    id: 14,
    category: 'tools',
    title: 'Outcome ROI Calculator',
    description: 'Calculate and visualize the return on investment for your STEM programs.',
    type: 'Interactive Tool',
    duration: 'Online',
    icon: PieChart,
    tags: ['ROI', 'Analytics', 'Reporting']
  },
  {
    id: 15,
    category: 'tools',
    title: 'Employer Match Finder',
    description: 'Find employers whose hiring needs align with your program graduates.',
    type: 'Interactive Tool',
    duration: 'Online',
    icon: Briefcase,
    tags: ['Employer Matching', 'Recruiting', 'Partnerships']
  },
  {
    id: 16,
    category: 'tools',
    title: 'Salary Benchmarking Tool',
    description: 'Compare your graduate salaries against industry and regional benchmarks.',
    type: 'Interactive Tool',
    duration: 'Online',
    icon: TrendingUp,
    tags: ['Salary', 'Benchmarking', 'Outcomes']
  },
  // Reports
  {
    id: 17,
    category: 'reports',
    title: 'Q4 2024 STEM Labor Market Report',
    description: 'Comprehensive analysis of STEM job market trends, salary data, and emerging skills.',
    type: 'PDF Report',
    duration: '40 pages',
    icon: BarChart3,
    featured: true,
    tags: ['Labor Market', 'Trends', 'Quarterly']
  },
  {
    id: 18,
    category: 'reports',
    title: 'Semiconductor Workforce Outlook 2025',
    description: 'In-depth analysis of semiconductor industry talent needs driven by CHIPS Act investments.',
    type: 'PDF Report',
    duration: '55 pages',
    icon: BarChart3,
    tags: ['Semiconductor', 'CHIPS Act', 'Industry Analysis']
  },
  {
    id: 19,
    category: 'reports',
    title: 'AI/ML Skills Demand Forecast',
    description: 'Projections for AI and machine learning skill requirements through 2030.',
    type: 'PDF Report',
    duration: '35 pages',
    icon: BarChart3,
    tags: ['AI', 'Machine Learning', 'Forecast']
  },
  {
    id: 20,
    category: 'reports',
    title: 'Education Partner Benchmark Report',
    description: 'Compare your institution\'s outcomes against peer institutions and national averages.',
    type: 'PDF Report',
    duration: '28 pages',
    icon: BarChart3,
    tags: ['Benchmarking', 'Outcomes', 'Comparison']
  }
];

// ===========================================
// UPCOMING EVENTS
// ===========================================
const UPCOMING_EVENTS = [
  {
    title: 'Partner Onboarding Webinar',
    date: 'Every Tuesday',
    time: '2:00 PM ET',
    type: 'Weekly',
    description: 'Learn how to maximize your partnership benefits'
  },
  {
    title: 'Industry Advisory Roundtable',
    date: 'Jan 15, 2025',
    time: '1:00 PM ET',
    type: 'Monthly',
    description: 'Connect with hiring managers from top tech companies'
  },
  {
    title: 'Virtual Career Fair Best Practices',
    date: 'Jan 22, 2025',
    time: '11:00 AM ET',
    type: 'Special',
    description: 'Prepare for the Spring 2025 career fair season'
  },
  {
    title: 'Federal Funding Workshop',
    date: 'Feb 5, 2025',
    time: '3:00 PM ET',
    type: 'Workshop',
    description: 'Navigate NSF, DOE, and CHIPS Act funding opportunities'
  }
];

// ===========================================
// QUICK STATS
// ===========================================
const QUICK_STATS = [
  { label: 'Resources Available', value: '120+', icon: BookOpen },
  { label: 'Partner Institutions', value: '450+', icon: Building2 },
  { label: 'Webinar Hours', value: '500+', icon: Video },
  { label: 'Templates Downloaded', value: '25K+', icon: Download }
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const EducationPartnersResourcesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = RESOURCES.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredResources = RESOURCES.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-gray-950 border-b border-gray-800">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Education Partner Resources
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Tools & Resources to{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Maximize Student Success
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Access guides, templates, webinars, and tools designed specifically for
              educational institutions to improve student outcomes and build stronger industry connections.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, guides, webinars..."
                className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 text-center"
                >
                  <Icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Resources</h2>
              <p className="text-gray-400 mt-1">Our most popular and impactful materials</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-gray-400">Editor's Picks</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors">
                      <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{resource.type}</span>
                    <span>{resource.duration}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              {/* Categories */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Categories
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const count = category.id === 'all'
                      ? RESOURCES.length
                      : RESOURCES.filter(r => r.category === category.id).length;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeCategory === category.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {category.label}
                        </div>
                        <span className={`text-xs ${
                          activeCategory === category.id ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {UPCOMING_EVENTS.slice(0, 3).map((event, idx) => (
                    <div key={idx} className="border-l-2 border-indigo-500 pl-3">
                      <div className="text-sm font-medium text-white">{event.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {event.date} • {event.time}
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/events"
                  className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 mt-4 transition-colors"
                >
                  View all events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Resource Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {activeCategory === 'all' ? 'All Resources' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                  <span className="text-gray-500 font-normal ml-2">({filteredResources.length})</span>
                </h2>
              </div>

              {filteredResources.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No resources found</h3>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredResources.map((resource, idx) => {
                    const Icon = resource.icon;
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/20 transition-colors">
                            <Icon className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                              {resource.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="px-2 py-1 bg-gray-800 rounded-full">{resource.type}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {resource.duration}
                                </span>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
                                {resource.category === 'webinars' ? (
                                  <Play className="w-5 h-5" />
                                ) : resource.category === 'tools' ? (
                                  <ExternalLink className="w-5 h-5" />
                                ) : (
                                  <Download className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-800">
                          {resource.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-3xl p-12 text-center">
            <Lightbulb className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Custom Resources?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our partnership team can create customized reports, training materials,
              and tools tailored to your institution's specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact?type=education-partner"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all"
              >
                Request Custom Resources
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/education-partner-apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducationPartnersResourcesPage;
