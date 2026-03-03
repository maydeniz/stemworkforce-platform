import { Link } from 'react-router-dom';
import {
  Newspaper,
  Download,
  Mail,
  Calendar,
  ExternalLink,
  FileText,
  Image,
  Video,
  Award,
  TrendingUp,
  Users,
  Building2,
} from 'lucide-react';

// Sample press releases - would come from CMS/database in production
const PRESS_RELEASES = [
  {
    id: '1',
    title: 'STEM Workforce Platform Launches National Initiative to Connect 1 Million Students with STEM Careers',
    date: '2026-02-01',
    category: 'Company News',
    excerpt: 'New platform aims to bridge the gap between STEM education and workforce needs through AI-powered matching and comprehensive career resources.',
    featured: true,
  },
  {
    id: '2',
    title: 'Partnership with National Labs Expands Research Opportunities for Undergraduates',
    date: '2026-01-15',
    category: 'Partnerships',
    excerpt: 'Strategic alliance with Department of Energy national laboratories creates 5,000 new research positions for college students.',
  },
  {
    id: '3',
    title: 'STEM Workforce Secures $50M Series B to Accelerate Platform Growth',
    date: '2025-12-10',
    category: 'Funding',
    excerpt: 'Investment will fund expansion into all 50 states and development of new AI-powered career guidance tools.',
  },
  {
    id: '4',
    title: 'Platform Achieves FedRAMP Authorization for Government Agency Use',
    date: '2025-11-20',
    category: 'Compliance',
    excerpt: 'Milestone enables federal workforce development agencies to leverage platform capabilities for WIOA programs.',
  },
  {
    id: '5',
    title: 'New Semiconductor Workforce Development Program Launches in Arizona',
    date: '2025-10-05',
    category: 'Programs',
    excerpt: 'Partnership with CHIPS Act-funded initiatives creates training pathways for 10,000 semiconductor technicians.',
  },
];

const MEDIA_COVERAGE = [
  {
    outlet: 'TechCrunch',
    title: 'How AI is Revolutionizing STEM Career Matching',
    date: '2026-01-28',
    url: '#',
  },
  {
    outlet: 'Forbes',
    title: 'The Future of Workforce Development: A Platform Approach',
    date: '2026-01-15',
    url: '#',
  },
  {
    outlet: 'Education Week',
    title: 'Connecting High School Students to STEM Pathways',
    date: '2025-12-20',
    url: '#',
  },
  {
    outlet: 'Government Technology',
    title: 'Modernizing WIOA Programs with Technology',
    date: '2025-11-30',
    url: '#',
  },
];

const MEDIA_KIT_ITEMS = [
  { label: 'Logo Pack (PNG, SVG, EPS)', icon: Image, size: '2.4 MB' },
  { label: 'Brand Guidelines', icon: FileText, size: '1.8 MB' },
  { label: 'Executive Bios', icon: Users, size: '450 KB' },
  { label: 'Platform Overview Video', icon: Video, size: '45 MB' },
  { label: 'Fact Sheet', icon: FileText, size: '320 KB' },
  { label: 'High-Res Screenshots', icon: Image, size: '12 MB' },
];

const COMPANY_STATS = [
  { label: 'Students Connected', value: '500K+', icon: Users },
  { label: 'Partner Organizations', value: '2,500+', icon: Building2 },
  { label: 'Jobs Posted', value: '150K+', icon: TrendingUp },
  { label: 'Industry Awards', value: '12', icon: Award },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PressPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Newspaper size={24} className="text-blue-400" />
            </div>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full">
              Press & Media
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Press Center</h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            The latest news, announcements, and media resources from STEM Workforce.
            For press inquiries, contact our media relations team.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="mailto:press@stemworkforce.gov"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              <Mail size={18} />
              Media Inquiries
            </a>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
              <Download size={18} />
              Download Media Kit
            </button>
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMPANY_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center"
            >
              <stat.icon size={24} className="mx-auto text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Press Releases */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Press Releases</h2>

            {/* Featured Release */}
            {PRESS_RELEASES.filter((pr) => pr.featured).map((release) => (
              <div
                key={release.id}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-slate-800 rounded-xl p-6 mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">
                    Featured
                  </span>
                  <span className="text-sm text-slate-500">{release.category}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 hover:text-blue-400 cursor-pointer transition-colors">
                  {release.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{release.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={14} />
                    {formatDate(release.date)}
                  </div>
                  <button className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                    Read More <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* Other Releases */}
            <div className="space-y-4">
              {PRESS_RELEASES.filter((pr) => !pr.featured).map((release) => (
                <div
                  key={release.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs font-medium rounded">
                      {release.category}
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(release.date)}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-400 cursor-pointer transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{release.excerpt}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
                View All Press Releases
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Media Coverage */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-lg font-bold mb-4">Media Coverage</h3>
              <div className="space-y-4">
                {MEDIA_COVERAGE.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    className="block group"
                  >
                    <div className="text-xs text-slate-500 mb-1">
                      {item.outlet} - {formatDate(item.date)}
                    </div>
                    <div className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Media Kit */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-lg font-bold mb-4">Media Kit</h3>
              <div className="space-y-3">
                {MEDIA_KIT_ITEMS.map((item, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors text-left"
                  >
                    <item.icon size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <div className="text-sm text-slate-300">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.size}</div>
                    </div>
                    <Download size={16} className="text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-slate-800 rounded-xl p-5">
              <h3 className="text-lg font-bold mb-3">Media Contact</h3>
              <p className="text-sm text-slate-400 mb-4">
                For press inquiries, interview requests, or media partnerships:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail size={14} className="text-blue-400" />
                  press@stemworkforce.gov
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Stay Updated</h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Subscribe to receive press releases and company announcements directly in your inbox.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/about"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/careers"
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
