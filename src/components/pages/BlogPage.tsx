// Static color class maps for Tailwind JIT compatibility
const imageColorBar: Record<string, string> = {
  blue: 'bg-blue-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500',
  red: 'bg-red-500', amber: 'bg-amber-500', teal: 'bg-teal-500',
  cyan: 'bg-cyan-500', indigo: 'bg-indigo-500', orange: 'bg-orange-500',
  slate: 'bg-slate-500', green: 'bg-green-500', rose: 'bg-rose-500',
};

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  TrendingUp,
  Briefcase,
  GraduationCap,
  RefreshCw,
  Zap,
  Globe,
  Mail,
  DollarSign,
  Target,
} from 'lucide-react';

// ===========================================
// Blog/News Data - Updated with 2025-2026 content
// ===========================================

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  sector: string;
  author: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  tags: string[];
  imageColor: string;
}

const SECTORS = [
  { value: 'all', label: 'All Sectors' },
  { value: 'semiconductor', label: 'Semiconductor' },
  { value: 'nuclear', label: 'Nuclear Energy' },
  { value: 'ai-ml', label: 'AI & Machine Learning' },
  { value: 'quantum', label: 'Quantum Technologies' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'aerospace', label: 'Aerospace & Defense' },
  { value: 'biotech', label: 'Biotechnology' },
  { value: 'clean-energy', label: 'Clean Energy' },
  { value: 'robotics', label: 'Robotics & Automation' },
  { value: 'manufacturing', label: 'Advanced Manufacturing' },
  { value: 'national-labs', label: 'National Labs' },
  { value: 'cross-sector', label: 'Cross-Sector' },
];

const CATEGORIES = [
  { value: 'all', label: 'All Topics', icon: Globe },
  { value: 'workforce', label: 'Workforce Trends', icon: TrendingUp },
  { value: 'policy', label: 'Policy & Funding', icon: Briefcase },
  { value: 'education', label: 'Education & Training', icon: GraduationCap },
  { value: 'technology', label: 'Technology', icon: Zap },
  { value: 'salary', label: 'Salary Reports', icon: DollarSign },
  { value: 'hiring', label: 'Hiring Insights', icon: Target },
];

const TRENDING_TAGS = [
  { name: 'CHIPS Act', count: 12 },
  { name: 'AI Jobs', count: 18 },
  { name: 'Security Clearance', count: 9 },
  { name: 'Nuclear SMR', count: 7 },
  { name: 'Quantum Computing', count: 6 },
  { name: 'Clean Energy', count: 11 },
  { name: 'DOE Labs', count: 8 },
  { name: 'Cybersecurity Gap', count: 14 },
];

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'CHIPS Act Reaches $30.9B in Awards: Workforce Gaps Remain at 90K',
    excerpt: 'The Department of Commerce has awarded incentives to 19 companies for 40 projects totaling $30.9B. But with TSMC adding $100B and Intel targeting 2030, the projected 90,000-worker shortfall in semiconductor manufacturing continues to accelerate.',
    category: 'policy',
    sector: 'semiconductor',
    author: 'STEM Workforce Team',
    publishedAt: '2025-07-15',
    readTime: 7,
    featured: true,
    tags: ['CHIPS Act', 'Semiconductor', 'Funding', 'Workforce'],
    imageColor: 'blue',
  },
  {
    id: '2',
    title: 'AI Hiring Surges 163%: Machine Learning Engineers Now Command $204K',
    excerpt: 'AI/ML job postings hit 49,200 in 2025, up 163% from 2024. Senior ML engineers now command median salaries of $204K nationally, with FAANG total comp packages reaching $450K. Seven of ten fastest-growing tech roles are AI-related.',
    category: 'salary',
    sector: 'ai-ml',
    author: 'Salary Insights Team',
    publishedAt: '2025-06-10',
    readTime: 8,
    featured: true,
    tags: ['AI', 'Machine Learning', 'Salary Data', 'Hiring Trends'],
    imageColor: 'purple',
  },
  {
    id: '3',
    title: 'NuScale SMR Approved: Nuclear Workforce Needs to Triple by 2050',
    excerpt: 'NuScale received NRC approval for its uprated 77-MWe module in May 2025, while DOE allocated $800M for SMR deployment. But the nuclear sector faces a critical challenge: 63% of employers report hiring as "very difficult," and IAEA projects 4 million new professionals needed by 2050.',
    category: 'workforce',
    sector: 'nuclear',
    author: 'Energy Workforce Team',
    publishedAt: '2025-06-01',
    readTime: 6,
    featured: false,
    tags: ['Nuclear', 'SMR', 'NuScale', 'Workforce'],
    imageColor: 'emerald',
  },
  {
    id: '4',
    title: 'ISC2 2025 Study: Cybersecurity Shifts from Headcount Gap to Skills Crisis',
    excerpt: 'For the first time, ISC2 declined to publish a workforce gap number, pivoting to skills shortages. 59% of organizations report critical skills gaps (up from 44%). With 457K unfilled U.S. positions and global spending projected at $377B by 2028, the focus is shifting to upskilling.',
    category: 'workforce',
    sector: 'cybersecurity',
    author: 'Cybersecurity Team',
    publishedAt: '2025-05-20',
    readTime: 5,
    featured: false,
    tags: ['Cybersecurity', 'ISC2', 'Skills Gap', 'Certifications'],
    imageColor: 'red',
  },
  {
    id: '5',
    title: 'Trusted Workforce 2.0 Goes Live: What It Means for Clearance Processing',
    excerpt: 'TW 2.0 is now the operational standard across DoD, IC, and civilian agencies with the "clear once, trusted everywhere" model. eApp replaces SF-86, and continuous vetting is rolling out to an additional 1 million federal employees. Actual times: Secret ~60-150 days, TS ~120-240 days.',
    category: 'policy',
    sector: 'aerospace',
    author: 'Security Policy Analyst',
    publishedAt: '2025-05-10',
    readTime: 6,
    featured: false,
    tags: ['Clearance', 'Trusted Workforce 2.0', 'eApp', 'DCSA'],
    imageColor: 'amber',
  },
  {
    id: '6',
    title: 'Clean Energy Workforce Hits 3.56M: Growing 3x Faster Than Economy',
    excerpt: 'DOE reports clean energy employment grew more than three times faster than overall U.S. employment in 2024. Wind turbine service technicians are the fastest-growing STEM occupation at 45% projected growth. The IRA continues driving multibillion-dollar investments.',
    category: 'workforce',
    sector: 'clean-energy',
    author: 'Clean Energy Team',
    publishedAt: '2025-04-15',
    readTime: 5,
    featured: false,
    tags: ['Clean Energy', 'IRA', 'Wind', 'Solar', 'DOE'],
    imageColor: 'teal',
  },
  {
    id: '7',
    title: 'Community Colleges: The Hidden Engine of STEM Workforce Development',
    excerpt: 'Community college enrollment surged 4.7% in 2024, the largest growth of any sector. With 52% of STEM workers lacking a bachelor\'s degree and undergraduate certificate enrollment up 28.3% since 2021, community colleges are proving essential for the semiconductor, nuclear, and manufacturing pipelines.',
    category: 'education',
    sector: 'cross-sector',
    author: 'Education Team',
    publishedAt: '2025-04-01',
    readTime: 6,
    featured: false,
    tags: ['Community College', 'Training', 'Semiconductor', 'Technicians'],
    imageColor: 'cyan',
  },
  {
    id: '8',
    title: 'Quantum Computing: Only 30K Professionals Worldwide for 250K Projected Roles',
    excerpt: 'With only ~30,000 quantum computing professionals globally and 3 open positions for every qualified candidate, quantum skills command premium salaries ($149K median, up to $300K in financial services). Roles with "quantum" in the title surged 180% from 2020-2024.',
    category: 'technology',
    sector: 'quantum',
    author: 'Emerging Tech Team',
    publishedAt: '2025-03-20',
    readTime: 7,
    featured: false,
    tags: ['Quantum', 'Talent Shortage', 'Skills Gap', 'Salary'],
    imageColor: 'indigo',
  },
  {
    id: '9',
    title: 'STEM Premium Holds at 2.16x: Median STEM Wage Reaches $103,580',
    excerpt: 'BLS data confirms the STEM salary premium: median STEM wage of $103,580 vs. $48,000 for non-STEM. With 8.1% projected growth (vs. 2.7% overall) and 36.8 million Americans in STEM occupations, the sector continues to outpace the broader economy across all metrics.',
    category: 'salary',
    sector: 'cross-sector',
    author: 'Labor Market Team',
    publishedAt: '2025-03-10',
    readTime: 4,
    featured: false,
    tags: ['BLS', 'Salary', 'STEM Premium', 'Growth'],
    imageColor: 'orange',
  },
  {
    id: '10',
    title: 'Federal Direct Hire Authority Extended Through 2028 for STEM Roles',
    excerpt: 'OPM extended direct hire authority for STEM personnel through 2028, streamlining federal hiring for critical technology roles. Combined with governmentwide STEM recruitment initiatives and above-average cybersecurity growth, federal careers offer stability amid private-sector layoffs.',
    category: 'hiring',
    sector: 'cross-sector',
    author: 'Federal Careers Team',
    publishedAt: '2025-02-25',
    readTime: 5,
    featured: false,
    tags: ['Federal Jobs', 'OPM', 'Direct Hire', 'Government Careers'],
    imageColor: 'slate',
  },
  {
    id: '11',
    title: 'SpaceX, Lockheed, and Boeing Compete for Cleared Aerospace Engineers',
    excerpt: 'Defense spending increases and commercial space expansion are driving fierce competition for systems engineers with active TS/SCI clearances. Huntsville, AL has the highest concentration of aerospace engineering roles, with salaries up 12% for cleared professionals.',
    category: 'hiring',
    sector: 'aerospace',
    author: 'Aerospace & Defense Team',
    publishedAt: '2025-02-15',
    readTime: 6,
    featured: false,
    tags: ['Aerospace', 'Defense', 'SpaceX', 'Security Clearance', 'Hiring'],
    imageColor: 'amber',
  },
  {
    id: '12',
    title: 'Gene Therapy and mRNA Platforms Drive Biotech Hiring Surge',
    excerpt: 'Biotechnology employers in the Boston-Cambridge and San Diego clusters are expanding rapidly, with research scientist positions up 15% YoY. Gene therapy, mRNA platforms, and bioinformatics roles are seeing the steepest demand, with PhD holders commanding $155K+ at senior levels.',
    category: 'workforce',
    sector: 'biotech',
    author: 'Life Sciences Team',
    publishedAt: '2025-02-05',
    readTime: 5,
    featured: false,
    tags: ['Biotechnology', 'Gene Therapy', 'mRNA', 'Bioinformatics', 'Hiring'],
    imageColor: 'green',
  },
  {
    id: '13',
    title: 'Warehouse Automation and Humanoid Robots Are Reshaping Robotics Careers',
    excerpt: 'Amazon, Tesla, and startup competitors are driving unprecedented demand for robotics engineers, with warehouse automation and humanoid robotics as the two fastest-growing segments. ROS certifications and computer vision skills are now table-stakes for mid-level roles.',
    category: 'technology',
    sector: 'robotics',
    author: 'Automation & Robotics Team',
    publishedAt: '2025-01-28',
    readTime: 6,
    featured: false,
    tags: ['Robotics', 'Automation', 'Computer Vision', 'Humanoid Robots', 'ROS'],
    imageColor: 'indigo',
  },
  {
    id: '14',
    title: 'Industry 4.0: Smart Manufacturing Creates 9K+ New Engineering Roles',
    excerpt: 'Advanced manufacturing driven by semiconductor fab construction, EV battery plants, and smart factory retrofits is creating above-average demand for manufacturing engineers. Six Sigma and CMfgE certifications command 15-20% salary premiums. 50% of new fab roles won\'t require a four-year degree.',
    category: 'workforce',
    sector: 'manufacturing',
    author: 'Manufacturing Team',
    publishedAt: '2025-01-20',
    readTime: 5,
    featured: false,
    tags: ['Manufacturing', 'Industry 4.0', 'EV Battery', 'Six Sigma', 'CHIPS Act'],
    imageColor: 'rose',
  },
  {
    id: '15',
    title: 'DOE National Labs Face Budget Pressure Despite Record Research Output',
    excerpt: 'The 17 DOE National Laboratories employ ~70,000+ researchers but face potential cuts in the FY2026 budget. SULI program slots could drop from 15,300 to 10,200. Meanwhile, SULI alumni outcomes remain strong: 95% earn bachelor\'s degrees, 71% stay in STEM careers.',
    category: 'policy',
    sector: 'national-labs',
    author: 'National Labs Team',
    publishedAt: '2025-01-12',
    readTime: 7,
    featured: false,
    tags: ['DOE', 'National Labs', 'SULI', 'Budget', 'Research'],
    imageColor: 'blue',
  },
];

// ===========================================
// Helpers
// ===========================================

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'workforce': return 'bg-blue-500/20 text-blue-400';
    case 'policy': return 'bg-purple-500/20 text-purple-400';
    case 'education': return 'bg-emerald-500/20 text-emerald-400';
    case 'technology': return 'bg-amber-500/20 text-amber-400';
    case 'salary': return 'bg-green-500/20 text-green-400';
    case 'hiring': return 'bg-cyan-500/20 text-cyan-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

const getCategoryLabel = (category: string): string => {
  return CATEGORIES.find(c => c.value === category)?.label || category;
};

const getSectorLabel = (sector: string): string => {
  return SECTORS.find(s => s.value === sector)?.label || sector;
};

// ===========================================
// Blog Page Component
// ===========================================

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching blog posts:', error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const mapped: BlogPost[] = data.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            sector: post.sector || 'cross-sector',
            author: post.author,
            publishedAt: post.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            readTime: post.read_time || 5,
            featured: post.featured || false,
            tags: post.tags || [],
            imageColor: post.image_color || 'blue',
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.error('Blog fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSector = selectedSector === 'all' || post.sector === selectedSector;
    return matchesSearch && matchesCategory && matchesSector;
  });

  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Globe size={24} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold">News & Insights</h1>
          </div>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Stay informed on STEM workforce trends, policy updates, salary reports, and emerging technology careers.
          </p>

          {/* Search & Filters */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {SECTORS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700'
                  }`}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Trending Topics */}
        {!searchTerm && selectedCategory === 'all' && (
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {TRENDING_TAGS.map(tag => (
                <button
                  key={tag.name}
                  onClick={() => setSearchTerm(tag.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors whitespace-nowrap"
                >
                  <TrendingUp size={12} />
                  {tag.name}
                  <span className="text-slate-600">{tag.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={24} className="animate-spin text-slate-400" />
            <span className="ml-3 text-slate-400">Loading articles...</span>
          </div>
        )}

        {/* Featured Articles */}
        {!loading && featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-slate-300 mb-6">Featured</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group cursor-pointer"
                >
                  <div className={`h-2 ${imageColorBar[post.imageColor] || 'bg-slate-500'}`} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`px-2.5 py-1 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {getCategoryLabel(post.category)}
                      </span>
                      {post.sector !== 'cross-sector' && (
                        <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-300">
                          {getSectorLabel(post.sector)}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime} min read
                        </span>
                      </div>
                      <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        {!loading && (
          <div className="my-12 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border border-slate-800 rounded-2xl p-8">
            <div className="max-w-xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail size={20} className="text-emerald-400" />
                <h3 className="text-xl font-bold">STEM Workforce Weekly</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Get the latest on STEM hiring trends, policy updates, salary reports, and career opportunities delivered to your inbox.
              </p>
              <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-slate-600 mt-2">
                Weekly digest. No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}

        {/* All Articles */}
        {!loading && regularPosts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-300 mb-6">
              {selectedCategory === 'all' ? 'Latest Articles' : getCategoryLabel(selectedCategory)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                    {post.sector !== 'cross-sector' && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700/50 text-slate-300">
                        {getSectorLabel(post.sector)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 flex items-center gap-1">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime} min
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg text-slate-400">No articles found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedSector('all'); }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
