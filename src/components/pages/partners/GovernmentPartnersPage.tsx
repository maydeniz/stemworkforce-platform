// ===========================================
// Government Partners Landing Page
// Federal Agencies · FedRAMP · GSA Schedule · FISMA
// ===========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  FileCheck,
  Lock,
  FileText,
  BarChart3,
  TrendingUp,
  Globe,
  Target,
  Users,
  Map,
  Landmark,
  MapPin,
  Atom,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/common';
import { useDocumentTitle } from '@/hooks';

// ===========================================
// DATA
// ===========================================

const COMPLIANCE_CARDS = [
  {
    icon: Shield,
    title: 'FedRAMP Moderate Authorization',
    body: 'Our platform holds FedRAMP Moderate ATO, meeting the cloud security baseline required for federal SaaS procurement. No additional security review required for agencies on the FedRAMP Marketplace.',
    badge: 'FedRAMP Authorized',
    color: '#6366f1',
  },
  {
    icon: FileCheck,
    title: 'GSA Schedule Available',
    body: 'Available on GSA Multiple Award Schedule (MAS), simplifying procurement for civilian agencies. No sole-source justification required for contracts under the simplified acquisition threshold.',
    badge: 'GSA MAS Schedule',
    color: '#3b82f6',
  },
  {
    icon: Lock,
    title: 'FISMA Moderate Compliant',
    body: 'Full FISMA Moderate compliance documentation available, including System Security Plan (SSP), Security Assessment Report (SAR), and Plan of Action & Milestones (POA&M).',
    badge: 'FISMA Moderate',
    color: '#22c55e',
  },
  {
    icon: FileText,
    title: 'Section 508 Accessible',
    body: 'All platform interfaces meet Section 508 accessibility requirements, with WCAG 2.1 AA conformance verified by independent third-party auditors.',
    badge: '508 Compliant',
    color: '#f59e0b',
  },
];

const CAPABILITIES = [
  {
    icon: BarChart3,
    title: 'Nationwide STEM Workforce Intelligence',
    body: 'Real-time labor market data across all 50 states. Track talent supply/demand gaps by occupation, clearance level, and critical technology sector. Updated daily.',
    color: '#3b82f6',
  },
  {
    icon: TrendingUp,
    title: 'Policy Impact Modeling',
    body: 'Model the workforce impact of proposed legislation before implementation. Quantify talent requirements for CHIPS Act, Infrastructure Law, and IIJA programs.',
    color: '#6366f1',
  },
  {
    icon: Globe,
    title: 'Cross-Agency Data Sharing',
    body: 'Federated architecture enables inter-agency STEM workforce collaboration with full data sovereignty. Share pipeline data with interagency working groups without exposing PII.',
    color: '#22c55e',
  },
  {
    icon: Target,
    title: 'Grant & Program Outcome Tracking',
    body: 'End-to-end tracking from grant award through 12-month employment retention. Automated reporting for OMB Uniform Guidance, NSF, DOE, and ETA requirements.',
    color: '#eab308',
  },
  {
    icon: Users,
    title: 'Clearance Pipeline Management',
    body: 'Track cleared and clearance-eligible candidates across agency hiring pipelines. Coordinate with OPM and DCSA for investigation status updates.',
    color: '#a855f7',
  },
  {
    icon: Map,
    title: 'Regional Workforce Board Integration',
    body: 'Connect directly with State Workforce Boards and American Job Centers. Coordinate federal investments with local labor market conditions.',
    color: '#06b6d4',
  },
];

const AGENCY_TYPES = [
  {
    icon: Landmark,
    title: 'Federal Agencies',
    body: 'DOE, DOD, DHS, HHS, NSF, NASA, and civilian agencies managing STEM workforce programs',
    color: '#6366f1',
  },
  {
    icon: MapPin,
    title: 'State Workforce Agencies',
    body: 'State workforce boards, departments of labor, and WIOA Title I administrators',
    color: '#3b82f6',
  },
  {
    icon: Atom,
    title: 'National Laboratories',
    body: 'DOE national labs with researcher recruitment, fellowship programs, and clearance pipelines',
    color: '#22c55e',
  },
  {
    icon: Building2,
    title: 'Workforce Development Boards',
    body: 'Local WDBs, regional planning units, and American Job Centers administering federal workforce programs',
    color: '#f59e0b',
  },
];

const PILOT_FEATURES = [
  '1 region tracked',
  'Up to 3 agency users',
  'Basic workforce analytics',
  'Monthly data refresh',
  'STEM pipeline data',
];

const REGIONAL_FEATURES = [
  '1 region tracked',
  'Up to 10 agency users',
  'Full compliance reporting',
  'Weekly data refresh',
  'Grant outcome tracking',
  '5 custom reports/month',
];

const NATIONAL_FEATURES = [
  'All 50 states',
  'Unlimited users',
  'FedRAMP compliance documentation',
  'Daily data refresh',
  'Cross-agency data sharing',
  'Policy impact modeling',
  'Dedicated federal account manager',
];

// ===========================================
// COMPONENT
// ===========================================

const GovernmentPartnersPage: React.FC = () => {
  useDocumentTitle('Federal Agency STEM Workforce Platform | STEMWorkforce');
  const navigate = useNavigate();

  return (
    <div className="relative bg-[#0a0a0f]">

      {/* ===========================
          HERO
      =========================== */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-500/[0.06] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Compliance badge row */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
            <Shield className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span className="text-[11px] font-medium text-gray-400 tracking-[0.12em] uppercase">
              FedRAMP Authorized · GSA Schedule · FISMA Moderate
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.0] mb-6">
            <span className="gradient-text">Nationwide STEM</span>
            <br />
            <span className="text-white">Workforce Intelligence</span>
            <br />
            <span className="text-white">for Federal Agencies</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            The only FedRAMP-authorized STEM workforce platform. Real-time talent pipeline data,
            cross-agency collaboration tools, and policy impact modeling — built for federal procurement cycles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button size="lg" className="text-base px-8 py-4" onClick={() => navigate('/contact?subject=government-demo')}>
              Request Agency Demo
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-4" onClick={() => navigate('/contact?subject=government-pilot')}>
              Start Free Pilot
            </Button>
          </div>

          {/* Compliance pill badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { label: 'FedRAMP Moderate ATO', color: '#6366f1' },
              { label: 'FISMA Compliant', color: '#3b82f6' },
              { label: 'Section 508 Accessible', color: '#22c55e' },
              { label: 'NIST 800-53 Aligned', color: '#f59e0b' },
            ].map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-gray-400 font-medium"
              >
                <CheckCircle2 className="w-3 h-3" style={{ color: badge.color }} aria-hidden="true" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================
          COMPLIANCE & PROCUREMENT
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0d0d14] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-blue-500/40" />
              <span className="text-[11px] font-semibold text-blue-400/70 uppercase tracking-[0.2em]">Procurement</span>
              <div className="w-8 h-px bg-blue-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              Procurement-ready. Agency-approved.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {COMPLIANCE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${card.color}18` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.color }} aria-hidden="true" />
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full border"
                      style={{ color: card.color, borderColor: `${card.color}30`, backgroundColor: `${card.color}10` }}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          CAPABILITIES
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-indigo-500/40" />
              <span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Capabilities</span>
              <div className="w-8 h-px bg-indigo-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Everything an agency needs to
              <br />
              <span className="gradient-text">manage its STEM workforce</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${cap.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cap.color }} aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{cap.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{cap.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          WHO WE SERVE
      =========================== */}
      <section className="py-20 md:py-24 bg-[#0d0d14] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-blue-500/40" />
              <span className="text-[11px] font-semibold text-blue-400/70 uppercase tracking-[0.2em]">Who We Serve</span>
              <div className="w-8 h-px bg-blue-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Designed for every federal stakeholder
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AGENCY_TYPES.map((agency) => {
              const Icon = agency.icon;
              return (
                <div
                  key={agency.title}
                  className="text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${agency.color}18` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: agency.color }} aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">{agency.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{agency.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          PRICING
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-indigo-500/40" />
              <span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Pricing</span>
              <div className="w-8 h-px bg-indigo-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Transparent pricing for every agency budget
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">
              All tiers available on GSA MAS Schedule. IDV contract vehicles available for DOD and Intelligence Community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilot */}
            <div className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-white text-xl font-bold mb-1">Pilot</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">Free</span>
              </div>
              <p className="text-gray-400 text-xs mb-5">90-day evaluation. No procurement paperwork under SAT.</p>
              <ul className="space-y-3 mb-8">
                {PILOT_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate('/register?persona=government')}>
                Start Pilot
              </Button>
            </div>

            {/* Regional */}
            <div className="relative p-8 rounded-2xl border-2 border-blue-500/40 bg-blue-500/[0.05]">
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 rounded-full bg-blue-700 text-white text-[11px] font-semibold uppercase tracking-wider">
                  Most Common
                </span>
              </div>
              <h3 className="text-white text-xl font-bold mb-1">Regional</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$2,500</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {REGIONAL_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate('/contact?subject=government-regional')}>
                Request Demo
              </Button>
            </div>

            {/* National */}
            <div className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-white text-xl font-bold mb-1">National</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$7,500</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {NATIONAL_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate('/contact?subject=government-national')}>
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
          FINAL CTA
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0d0d14] border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-3xl border border-blue-500/20 bg-blue-500/[0.04]">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Start with a free pilot. Scale with your mission.
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Most agencies begin with our free 90-day pilot. No procurement paperwork required
              under the simplified acquisition threshold.
            </p>
            <Button size="lg" className="text-base px-8 py-4" onClick={() => navigate('/contact?subject=government-pilot')}>
              Request Your Agency Pilot
            </Button>
            <p className="text-gray-500 text-xs mt-4">
              Questions about procurement or FedRAMP documentation?{' '}
              <a href="mailto:federal@stemworkforce.net" className="text-blue-400 hover:text-blue-300 transition-colors">
                federal@stemworkforce.net
              </a>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GovernmentPartnersPage;
