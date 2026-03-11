// ===========================================
// Students Hub Landing Page
// /students
// Entry point routing HS and college students to their paths
// ===========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Rocket,
  Atom,
  Zap,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  FileText,
  DollarSign,
  Briefcase,
  Target,
} from 'lucide-react';
import { Button } from '@/components/common';
import { useDocumentTitle } from '@/hooks';

// ===========================================
// DATA
// ===========================================

const HS_FEATURES = [
  'AI College Matcher — find schools by career outcomes',
  'Scholarship & Financial Aid Finder',
  'STEM Internship & Summer Programs',
  'AI Essay Coach & Application Tracker',
  'STEM Career Exploration across 11 sectors',
];

const COLLEGE_FEATURES = [
  'Career Launch Hub — resume, interview, offers',
  'Internship & Research Opportunity Finder',
  'Fellowship & Graduate School Prep',
  'Salary Negotiation & Offer Comparison',
  'Security Clearance Career Guide',
];

const DIFFERENTIATORS = [
  {
    icon: Atom,
    title: '11 Critical STEM Sectors',
    body: 'We focus exclusively on the sectors that power America\'s future: AI, Quantum, Aerospace, Biotech, Cybersecurity, Clean Energy, and more.',
    color: '#06b6d4',
  },
  {
    icon: Zap,
    title: 'AI-Powered, Not Just A List',
    body: 'Our tools learn from your profile and goals to give personalized college matches, internship recommendations, and career roadmaps.',
    color: '#6366f1',
  },
  {
    icon: Shield,
    title: 'Security Clearance Pathways',
    body: 'Only platform that shows students which careers require clearances, how to stay clearance-eligible, and how to land your first cleared internship.',
    color: '#22c55e',
  },
  {
    icon: Users,
    title: 'Connected to Real Employers',
    body: 'Every tool connects to our live network of 2M+ job postings, 50+ national labs, and 500+ universities. Your next opportunity is one click away.',
    color: '#a855f7',
  },
];

const POPULAR_TOOLS = [
  { icon: GraduationCap, title: 'AI College Matcher', desc: 'Match schools by STEM outcomes, not just rankings', path: '/students/college-matcher', color: '#06b6d4' },
  { icon: FileText, title: 'AI Essay Coach', desc: 'Draft, refine, and perfect your college essays', path: '/students/essay-coach', color: '#6366f1' },
  { icon: DollarSign, title: 'Scholarship Finder', desc: 'Find STEM scholarships you actually qualify for', path: '/students/scholarships', color: '#22c55e' },
  { icon: Briefcase, title: 'Internship Finder', desc: 'Land your first STEM internship or summer program', path: '/college/internships', color: '#f59e0b' },
  { icon: Target, title: 'Interview Prep', desc: 'Practice with AI-generated questions for your field', path: '/students/interview-prep', color: '#ec4899' },
  { icon: BarChart3, title: 'Salary Insights', desc: 'Know what STEM graduates actually earn before you choose a major', path: '/salary-insights', color: '#a855f7' },
];

const FREE_FEATURES = [
  'Browse jobs & internships',
  'AI College Matcher (3 uses)',
  'AI Resume Builder (3 uses)',
  'AI Interview Prep (3 uses)',
  'Save up to 10 items',
];

const DISCOVERY_FEATURES = [
  'Everything in Free, plus:',
  'Unlimited AI tools across all features',
  'Priority college & internship matching',
  'Mentorship program access',
  'Scholarship Matcher',
  'Campus Visit Planner',
  'Early access to new programs',
];

// ===========================================
// COMPONENT
// ===========================================

const StudentsLandingPage: React.FC = () => {
  useDocumentTitle('Students — STEM Career Platform | STEMWorkforce');
  const navigate = useNavigate();

  return (
    <div className="relative bg-[#0a0a0f]">

      {/* ===========================
          HERO
      =========================== */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.06] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.06] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-gray-400 tracking-[0.15em] uppercase">
              Free for all students · AI-powered · 11 STEM sectors
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.0] mb-6">
            <span className="gradient-text">Your STEM Career</span>
            <br />
            <span className="text-white">Starts Here</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Whether you're exploring colleges or launching your first career, STEMWorkforce has the
            tools to get you there — AI-powered, personalized, and free to start.
          </p>

          {/* Two-path CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
            <button
              onClick={() => navigate('/high-school')}
              className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.06] hover:bg-cyan-500/[0.12] hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <GraduationCap className="w-7 h-7 text-cyan-400" aria-hidden="true" />
              </div>
              <div>
                <div className="text-white font-semibold text-lg">High School Student</div>
                <div className="text-gray-400 text-sm mt-0.5">College prep & career exploration</div>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            </button>

            <button
              onClick={() => navigate('/college')}
              className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.06] hover:bg-indigo-500/[0.12] hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Rocket className="w-7 h-7 text-indigo-400" aria-hidden="true" />
              </div>
              <div>
                <div className="text-white font-semibold text-lg">College Student</div>
                <div className="text-gray-400 text-sm mt-0.5">Internships, research & career launch</div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Already know your path?{' '}
            <button onClick={() => navigate('/register')} className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
              Sign up free →
            </button>
          </p>
        </div>
      </section>

      {/* ===========================
          TWO PATH CARDS
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0d0d14] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-indigo-500/40" />
              <span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Your Journey</span>
              <div className="w-8 h-px bg-indigo-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Choose your path. We'll handle the rest.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High School */}
            <div className="p-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03] hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">High School Student</h3>
                  <p className="text-cyan-400/70 text-xs">Grades 9–12 · College prep · Career exploration</p>
                </div>
              </div>
              <ul className="space-y-2.5 mt-6 mb-8">
                {HS_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate('/high-school')} className="w-full">
                Explore High School Tools →
              </Button>
            </div>

            {/* College */}
            <div className="p-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.03] hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">College Student</h3>
                  <p className="text-indigo-400/70 text-xs">Undergrad & grad · Internships · Career launch</p>
                </div>
              </div>
              <ul className="space-y-2.5 mt-6 mb-8">
                {COLLEGE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate('/college')} className="w-full">
                Explore College Tools →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
          DIFFERENTIATORS
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-indigo-500/40" />
              <span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Why STEMWorkforce</span>
              <div className="w-8 h-px bg-indigo-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              Built for STEM students.{' '}
              <span className="gradient-text">Not just any student.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {DIFFERENTIATORS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${d.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: d.color }} aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{d.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{d.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          POPULAR TOOLS
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0d0d14] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-indigo-500/40" />
              <span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Tools</span>
              <div className="w-8 h-px bg-indigo-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              The tools students use most
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.title}
                  onClick={() => navigate(tool.path)}
                  className="group flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] text-left transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${tool.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tool.color }} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-semibold text-sm">{tool.title}</span>
                      <ArrowRight className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" aria-hidden="true" />
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{tool.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          PRICING
      =========================== */}
      <section className="py-20 md:py-28 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-indigo-500/40" />
              <span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Pricing</span>
              <div className="w-8 h-px bg-indigo-500/40" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Start free. Upgrade when you're ready.
            </h2>
            <p className="text-gray-400">No credit card required to get started.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-white text-xl font-bold mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 text-sm">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate('/register?persona=student')}>
                Get Started Free
              </Button>
            </div>

            {/* Discovery */}
            <div className="relative p-8 rounded-2xl border-2 border-indigo-500/40 bg-indigo-500/[0.05]">
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-semibold uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <h3 className="text-white text-xl font-bold mb-1">Discovery</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <p className="text-xs text-indigo-400 mb-5">or $99/yr — save 17%</p>
              <ul className="space-y-3 mb-8">
                {DISCOVERY_FEATURES.map((f, i) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${i === 0 ? 'text-gray-400 font-medium' : 'text-gray-300'}`}>
                    {i !== 0 && <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />}
                    {i === 0 && <span className="w-4 flex-shrink-0" />}
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate('/register?persona=student&plan=discovery')}>
                Start Free Trial
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
          <div className="p-10 rounded-3xl border border-indigo-500/20 bg-indigo-500/[0.04]">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Every STEM career starts with one step.
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Join thousands of students using STEMWorkforce to find their path in the industries
              shaping America's future.
            </p>
            <Button size="lg" className="text-base px-8 py-4" onClick={() => navigate('/register?persona=student')}>
              Create Your Free Account
            </Button>
            <p className="text-gray-500 text-xs mt-4">No credit card required. Free to start.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StudentsLandingPage;
