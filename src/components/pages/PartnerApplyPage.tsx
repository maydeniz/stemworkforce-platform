import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  Shield,
  Beaker,
  Users,
  ArrowRight,
  CheckCircle,
  Send,
} from 'lucide-react';

const PARTNER_TYPES = [
  { id: 'industry', label: 'Industry Partner', icon: Building2, description: 'Semiconductor, AI, quantum, defense, and other STEM employers', color: 'blue' },
  { id: 'education', label: 'Education Partner', icon: GraduationCap, description: 'Universities, HBCUs, HSIs, community colleges, bootcamps', color: 'purple' },
  { id: 'government', label: 'Government Partner', icon: Shield, description: 'Federal agencies, state workforce boards, economic development', color: 'emerald' },
  { id: 'national-lab', label: 'National Lab / FFRDC', icon: Beaker, description: 'DOE national labs, FFRDCs, research institutions', color: 'amber' },
  { id: 'nonprofit', label: 'Nonprofit Partner', icon: Users, description: 'Workforce development, STEM education, community orgs', color: 'rose' },
];

const BENEFITS = [
  'Access to 500K+ STEM professionals and students',
  'AI-powered talent matching and workforce analytics',
  'Co-branded challenges and hackathons',
  'Event sponsorship and career fair access',
  'Real-time labor market insights by sector',
  'Dedicated partner success manager',
];

export default function PartnerApplyPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || '';
  const [selectedType, setSelectedType] = useState(typeParam);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
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
          <h1 className="text-3xl font-bold mb-3">Application Submitted</h1>
          <p className="text-slate-400 mb-6">
            Thank you for your interest in partnering with STEMWorkforce. Our partnerships team will review your application and reach out within 3-5 business days.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold">Become a Partner</h1>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Join the STEMWorkforce ecosystem to connect with talent, expand your reach, and help build America's technology workforce.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Partner Type */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Select Partner Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PARTNER_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedType === type.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <type.icon size={20} className={selectedType === type.id ? 'text-emerald-400' : 'text-slate-500'} />
                    <div className="text-sm font-medium mt-2">{type.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.orgName}
                    onChange={e => setFormData(prev => ({ ...prev, orgName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="Organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={e => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="Primary contact"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="partnerships@org.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="https://yourorg.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tell us about your organization and partnership goals *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                  placeholder="Describe your organization and what you hope to achieve through this partnership..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
              >
                <Send size={16} />
                Submit Application
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Partner Benefits</h3>
              <div className="space-y-3">
                {BENEFITS.map(benefit => (
                  <div key={benefit} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Questions?</h3>
              <p className="text-sm text-slate-400 mb-4">
                Our partnerships team is ready to discuss how STEMWorkforce can support your goals.
              </p>
              <Link
                to="/contact?type=sales"
                className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Contact Partnerships <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
