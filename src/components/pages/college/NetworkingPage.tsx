// ===========================================
// Professional Networking Page - College Students
// LinkedIn optimization & industry connections
// ===========================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import ExpertQASection from '@/components/shared/ExpertQASection';
import {
  Linkedin,
  Users,
  MessageSquare,
  Calendar,
  Mail,
  ChevronRight,
  CheckCircle,
  Target,
  Sparkles,
  Coffee,
  Lightbulb,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface NetworkingEvent {
  id: string;
  title: string;
  type: 'virtual' | 'in-person';
  date: string;
  attendees: number;
  companies: string[];
}

interface ConnectionTip {
  id: string;
  title: string;
  description: string;
  example?: string;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const UPCOMING_EVENTS: NetworkingEvent[] = [
  {
    id: '1',
    title: 'Tech Career Virtual Mixer',
    type: 'virtual',
    date: 'Jan 15, 2026 • 6:00 PM EST',
    attendees: 150,
    companies: ['Google', 'Meta', 'Microsoft'],
  },
  {
    id: '2',
    title: 'AI/ML Professionals Meetup',
    type: 'in-person',
    date: 'Jan 22, 2026 • 7:00 PM PST',
    attendees: 75,
    companies: ['OpenAI', 'Anthropic', 'DeepMind'],
  },
  {
    id: '3',
    title: 'Women in STEM Networking Night',
    type: 'virtual',
    date: 'Jan 28, 2026 • 5:00 PM EST',
    attendees: 200,
    companies: ['Apple', 'Netflix', 'Stripe'],
  },
];

const LINKEDIN_CHECKLIST = [
  { id: '1', label: 'Professional headshot', completed: true },
  { id: '2', label: 'Compelling headline (not just "Student")', completed: false },
  { id: '3', label: 'About section with career goals', completed: true },
  { id: '4', label: 'All experiences with bullet points', completed: false },
  { id: '5', label: 'Projects section with links', completed: false },
  { id: '6', label: 'Skills endorsed by connections', completed: true },
  { id: '7', label: 'Custom profile URL', completed: true },
  { id: '8', label: '500+ connections', completed: false },
];

const OUTREACH_TEMPLATES = [
  {
    id: '1',
    title: 'Cold Connection Request',
    template: "Hi [Name], I'm a [Year] [Major] student at [University] interested in [field]. I came across your profile and was impressed by your work at [Company]. I'd love to connect and learn from your experience.",
  },
  {
    id: '2',
    title: 'Informational Interview Request',
    template: "Hi [Name], I hope this message finds you well. I'm exploring careers in [industry] and would love to learn about your journey at [Company]. Would you have 20 minutes for a virtual coffee chat in the next few weeks? I promise to be respectful of your time.",
  },
  {
    id: '3',
    title: 'Follow-Up After Event',
    template: "Hi [Name], it was great meeting you at [Event] yesterday! I really enjoyed our conversation about [topic]. I'd love to stay connected and continue learning from your experience. Thanks again for sharing your insights!",
  },
  {
    id: '4',
    title: 'Referral Request',
    template: "Hi [Name], I hope you're doing well! I noticed [Company] has an opening for [Role] that aligns perfectly with my background in [skills]. Given your experience there, I was wondering if you might be open to referring me? I'd be happy to share my resume and chat about the role first.",
  },
];

const NETWORKING_TIPS: ConnectionTip[] = [
  {
    id: '1',
    title: "Give Before You Ask",
    description: "Share valuable content, congratulate people on achievements, and engage genuinely before requesting anything.",
  },
  {
    id: '2',
    title: "Be Specific in Requests",
    description: "Instead of 'Can I pick your brain?', ask specific questions like 'Could you share how you transitioned from X to Y?'",
  },
  {
    id: '3',
    title: "Follow Up Consistently",
    description: "After meeting someone, follow up within 24-48 hours. Set calendar reminders to check in quarterly.",
  },
  {
    id: '4',
    title: "Attend Industry Events",
    description: "Virtual or in-person events are the fastest way to build genuine connections with professionals.",
  },
];

// ===========================================
// COMPONENT
// ===========================================
const NetworkingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'outreach' | 'events'>('linkedin');
  const { info, success } = useNotifications();
  const navigate = useNavigate();

  const completedCount = LINKEDIN_CHECKLIST.filter(item => item.completed).length;
  const profileScore = Math.round((completedCount / LINKEDIN_CHECKLIST.length) * 100);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-sky-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-sky-400 mb-4">
            <Link to="/college/professional-development" className="hover:underline">Professional Development</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Professional Networking</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Professional
                <span className="text-sky-400"> Networking</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Build meaningful connections that accelerate your career. Learn to optimize your
                LinkedIn, write effective outreach messages, and make the most of networking events.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => setActiveTab('linkedin')} className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Linkedin className="w-5 h-5" />
                  Optimize LinkedIn
                </button>
                <button onClick={() => navigate('/college/mentorship')} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700">
                  <Users className="w-5 h-5" />
                  Find Mentors
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">LinkedIn Profile Score</h3>
                <span className={`text-3xl font-bold ${
                  profileScore >= 80 ? 'text-green-400' : profileScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {profileScore}%
                </span>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-3 mb-6">
                <div
                  className={`h-3 rounded-full ${
                    profileScore >= 80 ? 'bg-green-500' : profileScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${profileScore}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">247</div>
                  <div className="text-sm text-gray-400">Connections</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">This Week</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">85%</div>
                  <div className="text-sm text-gray-400">Response Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'linkedin', label: 'LinkedIn Optimization', icon: Linkedin },
            { id: 'outreach', label: 'Outreach Templates', icon: Mail },
            { id: 'events', label: 'Networking Events', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-sky-400 border-sky-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* LinkedIn Tab */}
        {activeTab === 'linkedin' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Optimization Checklist</h2>

              <div className="space-y-3">
                {LINKEDIN_CHECKLIST.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                      item.completed
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-gray-900/50 border-gray-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-green-500' : 'bg-gray-700'
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-500" />
                      )}
                    </div>
                    <span className={item.completed ? 'text-green-400' : 'text-gray-300'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Headline Examples */}
              <div className="mt-8 bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  Strong Headline Examples
                </h3>
                <div className="space-y-3">
                  {[
                    "CS @ Stanford | AI/ML Research | Ex-Google Intern | Building tools for developers",
                    "Aspiring PM | Data Analytics @ Amazon | Helping teams ship 10x faster",
                    "Hardware Engineer | Stanford PhD Candidate | Quantum Computing Enthusiast",
                  ].map((headline, i) => (
                    <div key={i} className="p-3 bg-gray-800/50 rounded-lg text-gray-300 text-sm border-l-2 border-sky-500">
                      {headline}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips Sidebar */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-sky-900/20 to-blue-900/20 rounded-xl border border-sky-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Pro Tips</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    Post weekly to boost visibility
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    Comment thoughtfully on industry posts
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    Turn on "Open to Work" (recruiters only)
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    Get recommendations from professors/managers
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Connection Strategy</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium text-sky-400 mb-1">Alumni Network</div>
                    <p className="text-gray-400">Connect with alumni from your school - highest response rate</p>
                  </div>
                  <div>
                    <div className="font-medium text-sky-400 mb-1">Second Degree</div>
                    <p className="text-gray-400">Mutual connections increase acceptance by 3x</p>
                  </div>
                  <div>
                    <div className="font-medium text-sky-400 mb-1">Engage First</div>
                    <p className="text-gray-400">Comment on someone's post before connecting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Outreach Tab */}
        {activeTab === 'outreach' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-sky-900/20 to-blue-900/20 rounded-xl border border-sky-500/20 p-6 mb-8">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-sky-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Outreach Best Practices</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Keep messages under 100 words for cold outreach</li>
                    <li>• Personalize every message - mention something specific</li>
                    <li>• Have a clear ask (connect, chat, advice)</li>
                    <li>• Send during business hours for better response rates</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {OUTREACH_TEMPLATES.map(template => (
                <div key={template.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{template.title}</h3>
                  <div className="p-4 bg-gray-800/50 rounded-lg text-gray-300 text-sm mb-4 whitespace-pre-wrap">
                    {template.template}
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(template.template); success('Template copied to clipboard!'); }} className="text-sky-400 hover:text-sky-300 text-sm font-medium flex items-center gap-1">
                    Copy Template <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Networking Tips */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Networking Tips</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {NETWORKING_TIPS.map(tip => (
                  <div key={tip.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-white mb-2">{tip.title}</h4>
                        <p className="text-sm text-gray-400">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Upcoming Networking Events</h2>
                <p className="text-gray-400 mt-1">Connect with professionals and expand your network</p>
              </div>
              <button onClick={() => info('Full events directory is coming soon!')} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors">
                Browse All Events
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPCOMING_EVENTS.map(event => (
                <div key={event.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      event.type === 'virtual' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {event.type === 'virtual' ? 'Virtual' : 'In-Person'}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.attendees}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </p>

                  <div className="mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Companies Attending</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.companies.map((company, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => info('Event registration is coming soon! Check back for updates.')} className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium transition-colors">
                    Register Now
                  </button>
                </div>
              ))}
            </div>

            {/* Virtual Coffee Chat */}
            <div className="mt-12 bg-gradient-to-r from-sky-900/30 to-blue-900/30 rounded-2xl border border-sky-500/20 p-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center">
                  <Coffee className="w-10 h-10 text-sky-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Virtual Coffee Chats</h3>
                  <p className="text-gray-300 mb-4">
                    Get matched with industry professionals for 1-on-1 informational interviews.
                    15-30 minute conversations scheduled at your convenience.
                  </p>
                  <button onClick={() => info('Virtual coffee chat matching is coming soon!')} className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors">
                    Request a Coffee Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-sky-900/30 to-blue-900/30 rounded-2xl border border-sky-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Your Network is Your Net Worth</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            80% of jobs are filled through networking. Start building relationships that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/mentorship"
              className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Users className="w-5 h-5" />
              Find a Mentor
            </Link>
            <Link
              to="/college/events"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Browse Events
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expert Networking Q&A */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ExpertQASection
          scenario="networking-mentorship"
          title="Networking & Career Advice"
          description="Expert tips on building professional connections and growing your network"
          limit={5}
          showTags
        />
      </div>
    </div>
  );
};

export default NetworkingPage;
