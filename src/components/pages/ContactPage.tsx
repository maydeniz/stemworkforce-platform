import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Building2,
  GraduationCap,
  Users,
  Shield,
  CheckCircle,
} from 'lucide-react';

const CONTACT_TYPES = [
  { id: 'general', label: 'General Inquiry', icon: MessageSquare, description: 'Questions about STEMWorkforce platform' },
  { id: 'employer', label: 'Employer Solutions', icon: Building2, description: 'Hiring, staffing, and workforce analytics' },
  { id: 'education', label: 'Education Partners', icon: GraduationCap, description: 'University and training provider partnerships' },
  { id: 'government', label: 'Government & Labs', icon: Shield, description: 'Federal, state, and national lab partnerships' },
  { id: 'nonprofit', label: 'Nonprofit Partners', icon: Users, description: 'Community and workforce development orgs' },
  { id: 'sales', label: 'Sales & Enterprise', icon: Building2, description: 'Custom solutions and enterprise pricing' },
];

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'general';
  const [contactType, setContactType] = useState(typeParam);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Message Sent</h1>
          <p className="text-slate-400 mb-6">
            Thank you for reaching out. Our team will respond within 1-2 business days.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors font-medium"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Have a question about STEMWorkforce? Our team is here to help you connect with the right resources, partnerships, and opportunities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {/* Contact Type Selector */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">What can we help you with?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CONTACT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setContactType(type.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      contactType === type.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <type.icon size={18} className={contactType === type.id ? 'text-emerald-400' : 'text-slate-500'} />
                    <div className="text-sm font-medium mt-2">{type.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="you@organization.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={e => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="Your organization or institution"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                  placeholder="Tell us more about your needs..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-emerald-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-slate-400">support@stemworkforce.gov</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-emerald-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-slate-400">(202) 555-STEM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-emerald-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Office</div>
                    <div className="text-sm text-slate-400">Washington, D.C.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Response Times</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">General Inquiries</span>
                  <span className="text-emerald-400">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Partnership Requests</span>
                  <span className="text-emerald-400">2-3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Technical Support</span>
                  <span className="text-emerald-400">Same day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Enterprise Sales</span>
                  <span className="text-emerald-400">Next business day</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Need Immediate Help?</h3>
              <p className="text-sm text-slate-400 mb-4">
                Check our Help Center for quick answers to common questions.
              </p>
              <a
                href="/help"
                className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Visit Help Center &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
