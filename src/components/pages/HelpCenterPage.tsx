import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  BookOpen,
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  Shield,
  CreditCard,
  Settings,
  Zap,
} from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button in the top right corner. You can register as a job seeker, student, employer, or partner organization. Follow the prompts to complete your profile and verify your email address.',
      },
      {
        question: 'What types of accounts are available?',
        answer: 'We offer accounts for: Job Seekers (professionals looking for STEM opportunities), Students (high school and college), Employers (companies posting jobs), Education Partners (schools, bootcamps, training providers), and Government/Nonprofit Partners (workforce agencies, nonprofits).',
      },
      {
        question: 'Is the platform free to use?',
        answer: 'Yes, the platform is free for job seekers and students. Employers and partners have access to free basic features with premium plans available for advanced functionality like enhanced analytics, priority support, and API access.',
      },
    ],
  },
  {
    id: 'job-seekers',
    title: 'For Job Seekers',
    icon: Briefcase,
    faqs: [
      {
        question: 'How do I search for jobs?',
        answer: 'Use the Jobs page to search by keyword, location, industry, or experience level. You can save searches and set up job alerts to be notified when new matching positions are posted.',
      },
      {
        question: 'How do I apply for a position?',
        answer: 'Click on a job listing to view details, then click "Apply Now." You may be directed to complete an application on our platform or redirected to the employer\'s application system, depending on the posting.',
      },
      {
        question: 'Can I upload my resume?',
        answer: 'Yes, you can upload your resume in your profile settings. Our AI-powered resume parser will extract your skills and experience to improve job matching. You can also use our Resume Builder tool to create a new resume.',
      },
      {
        question: 'What is the Workforce Map?',
        answer: 'The Workforce Intelligence Map shows STEM job concentrations, salary data, and industry trends across all 50 states. Use it to explore opportunities by location and see which regions have the strongest demand for your skills.',
      },
    ],
  },
  {
    id: 'students',
    title: 'For Students',
    icon: GraduationCap,
    faqs: [
      {
        question: 'What resources are available for high school students?',
        answer: 'High school students have access to our Essay Coach, College Matcher, Scholarship Finder, Virtual Campus Tours, FAFSA Assistant, and career exploration tools. Visit the High School section to explore all features.',
      },
      {
        question: 'How do I find internships?',
        answer: 'Use the Internship Finder in your student portal. Filter by industry, location, duration, and whether the internship is paid. Many internships are specifically designed for students with no prior experience.',
      },
      {
        question: 'What is the College Matcher?',
        answer: 'Our AI-powered College Matcher analyzes your academic profile, interests, and preferences to recommend colleges and universities that are a good fit. It considers factors like major availability, campus culture, cost, and acceptance likelihood.',
      },
    ],
  },
  {
    id: 'employers',
    title: 'For Employers',
    icon: Building2,
    faqs: [
      {
        question: 'How do I post a job?',
        answer: 'Log into your employer dashboard and click "Post a Job." Fill in the job details including title, description, requirements, salary range, and location. Jobs are reviewed and typically published within 24 hours.',
      },
      {
        question: 'What is the pricing for job postings?',
        answer: 'Visit our Pricing page for current rates. We offer individual job postings, monthly subscriptions with unlimited posts, and enterprise plans for large organizations. Government agencies and nonprofits may qualify for discounted rates.',
      },
      {
        question: 'How do I access candidate applications?',
        answer: 'Applications are available in your employer dashboard under "Candidates." You can review resumes, track application status, schedule interviews, and communicate with candidates directly through the platform.',
      },
    ],
  },
  {
    id: 'partners',
    title: 'For Partners',
    icon: Users,
    faqs: [
      {
        question: 'How do I become a partner?',
        answer: 'Click "Become a Partner" and select your organization type (education, government, nonprofit, or industry). Complete the application form and our partnerships team will review and contact you within 3-5 business days.',
      },
      {
        question: 'What partner dashboards are available?',
        answer: 'Each partner type has a specialized dashboard: Education Partners manage programs and student outcomes, Government Partners track WIOA programs and participants, Nonprofit Partners manage workforce programs and grants, and Industry Partners access talent pipelines and analytics.',
      },
      {
        question: 'Can we integrate with our existing systems?',
        answer: 'Yes, we offer API access and integrations with common ATS, HRIS, and LMS platforms. Enterprise partners can work with our technical team on custom integrations. See our Documentation for API details.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    faqs: [
      {
        question: 'How is my data protected?',
        answer: 'We use industry-standard encryption for all data in transit and at rest. Our platform is SOC 2 Type II certified and FedRAMP authorized. We never sell personal data to third parties.',
      },
      {
        question: 'Can I delete my account and data?',
        answer: 'Yes, you can request account deletion from your profile settings. We will remove your personal data within 30 days in accordance with our privacy policy and applicable regulations (GDPR, CCPA).',
      },
      {
        question: 'Who can see my profile?',
        answer: 'You control your profile visibility. Job seekers can choose to make profiles visible to employers or keep them private. Students can share profiles with counselors and education partners. Review your privacy settings at any time.',
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Subscriptions',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), ACH bank transfers, and purchase orders for enterprise accounts. Government agencies can use P-card or standard procurement processes.',
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel your subscription at any time from your account settings. Your access will continue until the end of the current billing period. Contact support if you need assistance.',
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer a 30-day money-back guarantee for new subscriptions. If you\'re not satisfied, contact support within 30 days of purchase for a full refund. Job posting credits are non-refundable once a job is published.',
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: Settings,
    faqs: [
      {
        question: 'What browsers are supported?',
        answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated. Internet Explorer is not supported.',
      },
      {
        question: 'The site is loading slowly. What can I do?',
        answer: 'Try clearing your browser cache and cookies, disabling browser extensions, or switching to a different browser. If the problem persists, check our status page or contact support.',
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click "Sign In" then "Forgot Password." Enter your email address and we\'ll send you a password reset link. The link expires after 24 hours. If you don\'t receive the email, check your spam folder.',
      },
    ],
  },
];

const CONTACT_OPTIONS = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    availability: 'Mon-Fri, 9am-6pm ET',
    action: 'Start Chat',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'support@stemworkforce.gov',
    availability: 'Response within 24 hours',
    action: 'Send Email',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: '1-800-STEM-WORK',
    availability: 'Mon-Fri, 9am-6pm ET',
    action: 'Call Now',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());

  const toggleFaq = (categoryId: string, faqIndex: number) => {
    const key = `${categoryId}-${faqIndex}`;
    setExpandedFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filteredCategories = FAQ_CATEGORIES.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        !searchQuery ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <HelpCircle size={24} className="text-emerald-400" />
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full">
              Support
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">
            Find answers to common questions, browse our documentation, or contact our support team for assistance.
          </p>

          {/* Search */}
          <div className="max-w-xl">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONTACT_OPTIONS.map((option) => (
            <div
              key={option.title}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <option.icon size={20} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{option.title}</h3>
                  <p className="text-sm text-slate-400 mb-1">{option.description}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={12} />
                    {option.availability}
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors">
                {option.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
          >
            <BookOpen size={16} />
            View Documentation
          </Link>
        </div>

        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-slate-800">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <category.icon size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <span className="text-xs text-slate-500 ml-auto">
                  {category.faqs.length} question{category.faqs.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {category.faqs.map((faq, idx) => {
                  const isExpanded = expandedFaqs.has(`${category.id}-${idx}`);
                  return (
                    <div key={idx} className="group">
                      <button
                        onClick={() => toggleFaq(category.id, idx)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/30 transition-colors"
                      >
                        <span className="font-medium text-slate-200 group-hover:text-white transition-colors pr-4">
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronDown size={18} className="text-slate-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight size={18} className="text-slate-500 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-slate-400 mb-6">
              We couldn't find any FAQs matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Still Need Help */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Our support team is available to assist you with any questions or issues.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:support@stemworkforce.gov"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
              Contact Support
            </a>
            <Link
              to="/docs"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
