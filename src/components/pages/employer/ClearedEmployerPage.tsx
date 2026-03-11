// ===========================================
// Cleared Employer Landing Page
// /employers/cleared
// The only hiring platform with FSO portal + NISPOM compliance built in
// ===========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  FileCheck,
  Search,
  Users,
  BarChart3,
  Globe,
  Zap,
  AlertTriangle,
  Lock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/common';
import { useDocumentTitle } from '@/hooks';

// ===========================================
// DATA
// ===========================================

const PAIN_POINTS = [
  {
    icon: AlertTriangle,
    title: 'Clearance Lag Costs Missions',
    body: 'The average time-to-fill for a cleared position is 4× longer than uncleared roles. Every unfilled slot is a program risk.',
    color: '#ef4444',
  },
  {
    icon: Lock,
    title: 'Compliance Burden Is Crushing FSOs',
    body: 'NISPOM, DISS, e-QIP, visit requests — managing cleared employee compliance manually consumes 40% of an FSO\'s week.',
    color: '#f97316',
  },
  {
    icon: Search,
    title: 'Cleared Talent Is Invisible on Generic Boards',
    body: 'LinkedIn and Indeed don\'t understand clearance levels, facility clearances, or polygraph requirements. You\'re searching blind.',
    color: '#eab308',
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'FSO Portal',
    body: 'Manage your cleared employee roster, process visit requests, file incident reports, and maintain DISS submissions — all from one dashboard.',
    color: '#6366f1',
  },
  {
    icon: FileCheck,
    title: 'NISPOM Compliance Assistant',
    body: 'AI-guided compliance workflows for initial clearance requests, periodic reinvestigations, and adverse information reporting. Reduce manual tracking by 60%.',
    color: '#3b82f6',
  },
  {
    icon: Zap,
    title: 'Clearance Intelligence',
    body: 'Real-time clearance eligibility screening on candidates before you invest in interviews. Filter by level (Secret → TS/SCI), polygraph type, and facility clearance.',
    color: '#eab308',
  },
  {
    icon: Users,
    title: 'Cleared Talent Pipeline',
    body: 'Access pre-screened candidates with active clearances across 11 STEM sectors. Filter by clearance level, sector, location, and availability.',
    color: '#22c55e',
  },
  {
    icon: BarChart3,
    title: 'Clearance Pipeline Analytics',
    body: 'Track your cleared workforce metrics: renewal timelines, attrition risk, and pipeline health. Get alerts before a clearance expires.',
    color: '#a855f7',
  },
  {
    icon: Globe,
    title: 'Continuous Vetting Integration',
    body: 'Automated alerts for adverse information, financial changes, and foreign contact disclosures. Stay ahead of CAF submissions.',
    color: '#06b6d4',
  },
];

const STATS = [
  { value: '40%', label: 'Reduction in FSO administrative time reported by customers' },
  { value: '2M+', label: 'Cleared and clearance-eligible STEM professionals in network' },
  { value: '11', label: 'STEM sectors with active clearance-required postings' },
  { value: '50', label: 'States covered with active cleared talent pipeline' },
];

const TALENT_ENGINE_FEATURES = [
  'Up to 25 job postings',
  'Unlimited candidate search',
  'Full FSO Portal (basic + advanced)',
  'NISPOM Compliance Assistant',
  'Clearance Intelligence screening',
  'AI Talent Matching',
  'Up to 50 cleared employees managed',
  '10 team members',
];

const ENTERPRISE_FEATURES = [
  'Everything in Talent Engine, plus:',
  'Unlimited job postings',
  'Unlimited cleared employees',
  'Custom API integrations',
  'White-label option',
  'Dedicated account manager',
  'Custom reporting & SLA',
];

// ===========================================
// COMPONENT
// ===========================================

const ClearedEmployerPage: React.FC = () => {
  useDocumentTitle('Cleared Employer Hiring Platform | STEMWorkforce');
  const navigate = useNavigate();

  return (
    <div className="relative bg-[#0a0a0f]">

      {/* ===========================
          HERO
      =========================== */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-gray-400 tracking-[0.15em] uppercase">
              Trusted by defense contractors in all 50 states
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.0] mb-6">
            <span className="gradient-text">The Only Hiring Platform</span>
            <br />
            <span className="text-white">Built for Cleared</span>
            <br />
            <span className="text-white">STEM Organizations</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Manage your entire cleared workforce lifecycle — from sourcing candidates with active clearances
            to NISPOM-compliant FSO operations — in one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button size="lg" className="text-base px-8 py-4" onClick={() => navigate('/register?persona=employer&plan=professional')}>
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-4" onClick={() => navigate('/contact?subject=cleared-employer-demo')}>
              Schedule a Demo
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['FedRAMP Ready', 'SOC 2 Type II', 'NISPOM Compliant', 'ITAR Aware'].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-gray-400 font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================
          PAIN POINTS
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0d0d14] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-red-500/40" />
              <span className="text-[11px] font-semibold text-red-400/70 uppercase tracking-[0.2em]">The Challenge</span>
              <div className="w-8 h-px bg-red-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              Cleared hiring is unlike any other recruiting
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((pt) => {
              const Icon = pt.icon;
              return (
                <div
                  key={pt.title}
                  className="relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${pt.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: pt.color }} aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{pt.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{pt.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          PLATFORM FEATURES
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-indigo-500/40" />
              <span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Platform</span>
              <div className="w-8 h-px bg-indigo-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Everything cleared employers need.
              <br />
              <span className="gradient-text">Nothing they don't.</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
              Purpose-built for organizations with NISP obligations — not retrofitted from a generic ATS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feat.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: feat.color }} aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          PRICING
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0d0d14] border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-indigo-500/40" />
              <span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Pricing</span>
              <div className="w-8 h-px bg-indigo-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
              Transparent pricing. No government contractor markup.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base">
              Both plans include FSO portal access. Start free, scale as you hire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Talent Engine */}
            <div className="relative p-8 rounded-2xl border-2 border-indigo-500/40 bg-indigo-500/[0.05]">
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-semibold uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <h3 className="text-white text-xl font-bold mb-1">Talent Engine</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$499</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {TALENT_ENGINE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate('/register?persona=employer&plan=professional')}>
                Start Free Trial
              </Button>
            </div>

            {/* Enterprise Command */}
            <div className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-white text-xl font-bold mb-1">Enterprise Command</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold text-gray-300">Contact Sales</span>
              </div>
              <ul className="space-y-3 mb-8">
                {ENTERPRISE_FEATURES.map((f, i) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${i === 0 ? 'text-gray-400 font-medium' : 'text-gray-300'}`}>
                    {i !== 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />}
                    {i === 0 && <span className="w-4" />}
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate('/contact?subject=enterprise-employer')}>
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
          STATS
      =========================== */}
      <section className="py-20 md:py-24 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-emerald-500/40" />
              <span className="text-[11px] font-semibold text-emerald-400/70 uppercase tracking-[0.2em]">Impact</span>
              <div className="w-8 h-px bg-emerald-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              The numbers cleared organizations trust
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <p className="text-gray-400 text-xs leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================
          FINAL CTA
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0d0d14] border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-3xl border border-indigo-500/20 bg-indigo-500/[0.04]">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your cleared hiring?
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Join defense contractors, national labs, and intelligence community organizations
              already using STEMWorkforce to build their cleared talent pipelines.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8 py-4" onClick={() => navigate('/register?persona=employer&plan=professional')}>
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 py-4" onClick={() => navigate('/contact?subject=cleared-employer-demo')}>
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ClearedEmployerPage;
