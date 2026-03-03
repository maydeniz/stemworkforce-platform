// ===========================================
// Header Component - Redesigned Navigation
// Expert-level UX for multi-sided workforce platform
// ===========================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useFeatures } from '@/contexts';
import { useOnClickOutside } from '@/hooks';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/common';

// ===========================================
// NAVIGATION ARCHITECTURE
// Organized by user intent and platform pillars
// ===========================================

// For Talent - Job seekers and career changers
const TALENT_MENU = {
  title: 'For Talent',
  description: 'Find your next opportunity in emerging tech',
  sections: [
    {
      title: 'Find Opportunities',
      items: [
        { label: 'Browse Jobs', path: '/jobs', icon: '💼', description: 'Full-time positions in emerging fields' },
        { label: 'Solve a Challenge', path: '/challenges/solve', icon: '🏆', description: 'Win prizes, get hired by top companies' },
        { label: 'Internships', path: '/jobs?type=internship', icon: '🎓', description: 'Gain experience at top organizations' },
        { label: 'Research Positions', path: '/jobs?type=research', icon: '🔬', description: 'Academic and lab opportunities' },
        { label: 'Workforce Map', path: '/map', icon: '🗺️', description: 'Explore opportunities by location' },
      ]
    },
    {
      title: 'Grow Your Career',
      items: [
        { label: 'Training Programs', path: '/training', icon: '📚', description: 'Upskill with industry certifications' },
        { label: 'Career Resources', path: '/resources', icon: '📋', description: 'Resume tools, interview prep & more' },
        { label: 'Salary Insights', path: '/salary-insights', icon: '📊', description: 'Compensation data by role & region' },
        { label: 'Industry Insights', path: '/industries', icon: '📈', description: 'Explore emerging tech sectors' },
      ]
    },
    {
      title: 'Get Support',
      items: [
        { label: 'Find a Career Coach', path: '/service-providers?type=career-coach', icon: '🎯', description: 'Expert guidance for your journey' },
        { label: 'Browse All Experts', path: '/service-providers', icon: '⭐', description: 'Recruiters, coaches & consultants' },
        { label: 'Mentorship Programs', path: '/mentorship', icon: '🤝', description: 'Connect with industry leaders' },
        { label: 'Clearance Guide', path: '/clearance-guide', icon: '🔐', description: 'Navigate security clearances' },
      ]
    }
  ],
  cta: { label: 'Create Your Profile', path: '/register?role=jobseeker', variant: 'primary' }
};

// For Employers - Companies, Labs, Agencies
const EMPLOYERS_MENU = {
  title: 'For Employers',
  description: 'Access top STEM talent for your organization',
  sections: [
    {
      title: 'Hire Talent',
      items: [
        { label: 'Post a Job', path: '/dashboard?action=post-job', icon: '📝', description: 'Reach qualified candidates' },
        { label: 'Post a Challenge', path: '/challenges/post', icon: '🏆', description: 'Crowdsource innovation, recruit winners' },
        { label: 'Post Internships', path: '/dashboard?action=post-internship', icon: '🎓', description: 'Build your talent pipeline' },
        { label: 'Browse Candidates', path: '/talent-search', icon: '🔍', description: 'Search our talent database' },
      ]
    },
    {
      title: 'Workforce Solutions',
      items: [
        { label: 'Staffing Services', path: '/services/staffing', icon: '👥', description: 'Contract and temp-to-perm' },
        { label: 'Recruitment Partners', path: '/service-providers?type=recruiter', icon: '🤝', description: 'Work with specialized recruiters' },
        { label: 'Workforce Analytics', path: '/analytics', icon: '📈', description: 'Market insights and trends' },
      ]
    },
    {
      title: 'Partnership Programs',
      items: [
        { label: 'Academic Partnerships', path: '/partnerships/academic', icon: '🏛️', description: 'Connect with universities' },
        { label: 'Apprenticeship Programs', path: '/partnerships/apprenticeship', icon: '🛠️', description: 'Registered apprenticeships' },
        { label: 'Diversity Initiatives', path: '/partnerships/diversity', icon: '🌈', description: 'DEI recruitment programs' },
      ]
    }
  ],
  cta: { label: 'Partner With Us', path: '/register?role=partner', variant: 'primary' }
};

// For Partners - Consolidated mega-menu for all partner organization types
// Following UX best practices: Miller's Law, Progressive Disclosure
// Separate from Service Providers (consultants, recruiters, coaches)
const PARTNERS_MENU = {
  title: 'For Partners',
  description: 'Join our ecosystem connecting education, research, government & industry with STEM talent',
  sections: [
    {
      title: 'Education Partners',
      items: [
        { label: 'Universities & Colleges', path: '/education-partners', icon: '🎓', description: 'Connect students to industry careers' },
        { label: 'Community Colleges', path: '/education-partners?type=community-college', icon: '🏫', description: 'Build direct employer pipelines' },
        { label: 'Bootcamps & Accelerators', path: '/education-partners?type=bootcamp', icon: '💻', description: 'Showcase job placement outcomes' },
        { label: 'Training Providers', path: '/education-partners?type=training', icon: '📚', description: 'List programs to qualified learners' },
      ]
    },
    {
      title: 'National Labs & Research',
      items: [
        { label: 'DOE National Labs', path: '/partners/national-labs', icon: '⚛️', description: 'Recruit from verified talent pools' },
        { label: 'FFRDCs', path: '/partners/national-labs?type=ffrdc', icon: '🔬', description: 'Post research & fellowship openings' },
        { label: 'University Research', path: '/partners/national-labs?type=research', icon: '🔭', description: 'Connect with emerging researchers' },
        { label: 'Industry R&D', path: '/partners/national-labs?type=industry-rd', icon: '🧪', description: 'Access specialized STEM candidates' },
      ]
    },
    {
      title: 'Federal & State Agencies',
      items: [
        { label: 'DOE, DOD, NASA, NSF', path: '/partners/government', icon: '🏛️', description: 'Connect programs to workforce needs' },
        { label: 'CHIPS Act Programs', path: '/partners/government?type=chips-act', icon: '💎', description: 'Access semiconductor talent pipeline' },
        { label: 'State Workforce Boards', path: '/partners/government?type=state', icon: '🗺️', description: 'Regional workforce dev tools' },
        { label: 'Economic Development', path: '/partners/government?type=economic-dev', icon: '📈', description: 'Data-driven talent attraction' },
      ]
    },
    {
      title: 'Industry & Nonprofits',
      items: [
        { label: 'Post an Innovation Challenge', path: '/challenges/post', icon: '🏆', description: 'Crowdsource solutions, recruit talent' },
        { label: 'Talent Pipeline Partners', path: '/partners/industry', icon: '🤝', description: 'Build direct-to-hire pathways' },
        { label: 'Corporate Sponsors', path: '/partners/industry?type=sponsor', icon: '⭐', description: 'Brand visibility to STEM talent' },
        { label: 'Workforce Nonprofits', path: '/partners/nonprofits', icon: '💚', description: 'Amplify program reach & impact' },
        { label: 'STEM Education Orgs', path: '/partners/nonprofits?type=stem-ed', icon: '🌱', description: 'Connect learners to career pathways' },
      ]
    }
  ],
  cta: { label: 'Become a Partner', path: '/register?type=partner', variant: 'primary' }
};

// For Service Providers - Consultants, Recruiters, Career Coaches
// Separate from organizational Partners
const SERVICE_PROVIDERS_MENU = {
  title: 'For Providers',
  description: 'Grow your consulting practice in emerging tech',
  sections: [
    {
      title: 'Industry Consulting',
      items: [
        { label: 'Semiconductor', path: '/services/semiconductor-consulting', icon: '💎', description: 'Fab consulting & supply chain' },
        { label: 'Nuclear Energy', path: '/services/nuclear-consulting', icon: '☢️', description: 'Nuclear strategy & workforce planning' },
        { label: 'AI & Machine Learning', path: '/services/ai-consulting', icon: '🤖', description: 'AI readiness, strategy & implementation' },
        { label: 'Quantum Technologies', path: '/services/quantum-consulting', icon: '⚛️', description: 'Quantum strategy & use case discovery' },
        { label: 'Cybersecurity', path: '/services/cybersecurity-consulting', icon: '🛡️', description: 'Assessments, compliance & strategy' },
        { label: 'Aerospace & Defense', path: '/services/aerospace-consulting', icon: '🚀', description: 'Defense sector consulting & compliance' },
        { label: 'Biotechnology', path: '/services/biotech-consulting', icon: '🧬', description: 'Biotech strategy & lab operations' },
        { label: 'Healthcare & Medical Technology', path: '/services/healthcare-consulting', icon: '🏥', description: 'Healthcare tech & digital health' },
        { label: 'Robotics & Automation', path: '/services/robotics-consulting', icon: '🦾', description: 'Automation strategy & implementation' },
        { label: 'Clean Energy', path: '/services/clean-energy-consulting', icon: '⚡', description: 'Renewable energy & sustainability' },
        { label: 'Advanced Manufacturing', path: '/services/manufacturing-consulting', icon: '🏭', description: 'Smart manufacturing & Industry 4.0' },
      ]
    },
    {
      title: 'Workforce Services',
      items: [
        { label: 'STEM Recruiting', path: '/services/recruiting', icon: '🎯', description: 'Specialized talent acquisition' },
        { label: 'Career Coaching', path: '/services/career-coaching', icon: '🧭', description: 'Help talent navigate transitions' },
        { label: 'Training & Upskilling', path: '/services/training-services', icon: '📚', description: 'Corporate learning programs' },
        { label: 'Clearance Processing', path: '/services/clearance-services', icon: '🔐', description: 'Security clearance support' },
      ]
    },
    {
      title: 'Get Started',
      items: [
        { label: 'Become a Provider', path: '/become-a-provider', icon: '🚀', description: 'Apply to join our expert network' },
        { label: 'Provider Resources', path: '/provider-resources', icon: '📋', description: 'Tools, templates & guides' },
        { label: 'Browse Projects', path: '/projects', icon: '📂', description: 'Find active opportunities' },
        { label: 'Provider Dashboard', path: '/provider-dashboard', icon: '📊', description: 'Manage your practice' },
      ]
    }
  ],
  cta: { label: 'Become a Provider', path: '/become-a-provider', variant: 'primary' }
};

// For High School Students - AI-Enhanced College Prep & STEM Career Discovery
const HIGH_SCHOOL_MENU = {
  title: 'High School Students',
  description: 'AI-powered college prep, admissions support & STEM career discovery',
  sections: [
    {
      title: 'Application Support',
      items: [
        { label: 'AI Essay Coach', path: '/students/essay-coach', icon: '✍️', description: 'Real-time feedback on narrative & authenticity' },
        { label: 'Research Experience Writer', path: '/students/research-writer', icon: '🔬', description: 'Translate technical work into compelling stories' },
        { label: '"Why This School" Generator', path: '/students/why-school', icon: '🎓', description: 'School-specific content with genuine connections' },
        { label: 'Application Tracker', path: '/students/app-tracker', icon: '📋', description: 'Smart scheduler with deadline optimization' },
        { label: 'Interview Prep Simulator', path: '/students/interview-prep', icon: '🎤', description: 'AI mock interviews with STEM-specific Qs' },
        { label: 'Mock Admissions Review', path: '/students/mock-review', icon: '📝', description: 'See your app through admissions eyes' },
      ]
    },
    {
      title: 'College Discovery',
      items: [
        { label: 'AI College Matcher', path: '/students/college-matcher', icon: '🎯', description: 'Find best-fit schools by career outcomes' },
        { label: 'Major Explorer', path: '/students/major-explorer', icon: '🔭', description: 'Explore STEM majors and career paths' },
        { label: 'Campus Culture Finder', path: '/students/campus-culture', icon: '🧬', description: 'Find schools that match your vibe' },
        { label: 'Financial Fit Calculator', path: '/students/financial-fit', icon: '💰', description: 'Understand true costs and aid options' },
        { label: 'Virtual Campus Tours', path: '/students/virtual-tours', icon: '🏫', description: 'Explore campuses from anywhere' },
        { label: 'Compare Schools', path: '/students/compare-schools', icon: '⚖️', description: 'Side-by-side school comparison tool' },
      ]
    },
    {
      title: 'Career Pathways',
      items: [
        { label: 'STEM Internship Finder', path: '/students/internship-finder', icon: '🚀', description: '1,000+ HS internships at NASA, labs & more' },
        { label: 'Work-Based Learning', path: '/students/work-based-learning', icon: '🔧', description: 'Job shadows, co-ops & mentorships' },
        { label: 'Youth Apprenticeships', path: '/students/apprenticeship-pathways', icon: '🏆', description: 'Earn while you learn - paid training' },
        { label: 'AI Scholarship Matcher', path: '/students/scholarship-matcher', icon: '💰', description: '5,000+ STEM scholarships matched to you' },
        { label: 'CHIPS Act & STEM Funding', path: '/students/stem-funding', icon: '⚡', description: 'DOE, NSF, semiconductor programs' },
        { label: 'STEM Career ROI Calculator', path: '/students/career-roi', icon: '📈', description: '15-year projection by career path' },
      ]
    },
    {
      title: 'Financial Planning',
      items: [
        { label: 'True Net Price Calculator', path: '/students/net-price-calculator', icon: '🧮', description: 'Actual award data, not estimates' },
        { label: 'Award Letter Analyzer', path: '/students/award-letter-analyzer', icon: '📊', description: 'Compare offers & find leverage points' },
        { label: 'CSS Profile Optimizer', path: '/students/css-profile', icon: '🎯', description: 'Minimize expected contribution legally' },
        { label: 'Appeal Letter Generator', path: '/students/appeal-letter', icon: '📄', description: 'Professional appeals that get results' },
        { label: 'Loan Payoff Modeler', path: '/students/loan-payoff', icon: '📉', description: 'IDR, PSLF & repayment strategies' },
      ]
    }
  ],
  cta: { label: 'Start Free Trial', path: '/register?role=student&type=highschool', variant: 'primary' }
};

// For College Students - Career Launch, Professional Development & Graduate School
const COLLEGE_MENU = {
  title: 'College Students',
  description: 'Career launch, professional development, research & graduate school prep',
  sections: [
    {
      title: 'Career Launch',
      items: [
        { label: 'Job Search Hub', path: '/college/career-launch', icon: '💼', description: 'AI-matched jobs from 125,000+ STEM positions' },
        { label: 'Resume & Portfolio Builder', path: '/college/resume-builder', icon: '📄', description: 'ATS-optimized resumes with AI feedback' },
        { label: 'Interview Preparation', path: '/college/interview-prep', icon: '🎤', description: 'Technical & behavioral mock interviews' },
        { label: 'Salary Negotiation', path: '/college/salary-negotiation', icon: '💰', description: 'Know your worth with real comp data' },
        { label: 'Internship & Co-op Finder', path: '/college/internships', icon: '🎯', description: 'Find the right experience for your goals' },
        { label: 'Offer Comparison Tool', path: '/college/offer-compare', icon: '⚖️', description: 'Compare total compensation packages' },
      ]
    },
    {
      title: 'Professional Development',
      items: [
        { label: 'Skills Assessment', path: '/college/skills-assessment', icon: '📊', description: 'Identify gaps & get learning paths' },
        { label: 'Certification Pathways', path: '/college/professional-development', icon: '🏆', description: 'AWS, Google, CompTIA & more' },
        { label: 'Technical Portfolio', path: '/college/portfolio-builder', icon: '💻', description: 'Showcase projects that impress employers' },
        { label: 'Professional Networking', path: '/college/networking', icon: '🤝', description: 'LinkedIn optimization & industry connections' },
        { label: 'Mentorship Matching', path: '/college/mentorship', icon: '👥', description: 'Connect with industry professionals' },
        { label: 'Conferences & Events', path: '/college/events', icon: '📅', description: 'STEM conferences with student tracks' },
      ]
    },
    {
      title: 'Graduate & Research',
      items: [
        { label: 'Graduate School Navigator', path: '/college/grad-school-prep', icon: '🎓', description: 'PhD & Masters program search & planning' },
        { label: 'Research Opportunities', path: '/college/research-opportunities', icon: '🔬', description: 'REUs, summer programs & lab positions' },
        { label: 'Fellowship Finder', path: '/college/fellowships', icon: '🏅', description: 'NSF GRFP, Hertz, Ford & 200+ more' },
        { label: 'Statement of Purpose Coach', path: '/college/sop-coach', icon: '✍️', description: 'AI feedback on research statements' },
        { label: 'Faculty Connection', path: '/college/faculty-match', icon: '👨‍🔬', description: 'Find professors aligned with your interests' },
        { label: 'PhD vs Industry Tool', path: '/college/phd-decision', icon: '🤔', description: 'Make this major decision with confidence' },
      ]
    },
    {
      title: 'Government & Finance',
      items: [
        { label: 'Federal STEM Careers', path: '/college/government-careers', icon: '🏛️', description: 'NASA, DOE, NSF & security clearances' },
        { label: 'Security Clearance Guide', path: '/college/clearance-guide', icon: '🔐', description: 'Navigate the clearance process' },
        { label: 'Student Loan Strategy', path: '/college/loan-strategy', icon: '💳', description: 'PSLF, IDR & repayment planning' },
        { label: 'Graduate Funding Search', path: '/college/grad-funding', icon: '💵', description: 'TA/RA positions & external funding' },
        { label: 'Relocation Calculator', path: '/college/relocation', icon: '🗺️', description: 'Cost of living by city comparison' },
        { label: 'Early Career Budget', path: '/college/budget-planner', icon: '📈', description: 'First job financial planning' },
      ]
    }
  ],
  cta: { label: 'Create Free Profile', path: '/register?role=student&type=college', variant: 'primary' }
};

// Events - Career fairs, conferences, workshops & networking
const EVENTS_MENU = {
  title: 'Events',
  description: 'Career fairs, conferences, workshops & networking across STEM industries',
  sections: [
    {
      title: 'Career Events',
      items: [
        { label: 'Virtual Career Fairs', path: '/events/career-fairs', icon: '💼', description: 'Connect with employers hiring now' },
        { label: 'Industry Networking', path: '/events/networking', icon: '🤝', description: 'Build connections in your field' },
        { label: 'Resume & Interview Prep', path: '/events/workshops', icon: '📝', description: 'Sharpen your job search skills' },
        { label: 'Clearance Briefings', path: '/events/clearance', icon: '🔐', description: 'Security clearance guidance sessions' },
      ]
    },
    {
      title: 'Industry Conferences',
      items: [
        { label: 'Semiconductor Events', path: '/events/semiconductor', icon: '💎', description: 'CHIPS Act workforce summits' },
        { label: 'Nuclear & Energy', path: '/events/nuclear-energy', icon: '⚛️', description: 'Clean energy workforce forums' },
        { label: 'AI & Quantum', path: '/events/ai-quantum', icon: '🤖', description: 'Emerging tech conferences' },
        { label: 'Aerospace & Defense', path: '/events/aerospace-defense', icon: '🚀', description: 'Defense industry gatherings' },
      ]
    },
    {
      title: 'Training & Development',
      items: [
        { label: 'Certification Bootcamps', path: '/events/certifications', icon: '🎓', description: 'Intensive skill-building programs' },
        { label: 'Leadership Workshops', path: '/events/leadership', icon: '⭐', description: 'Management & executive training' },
        { label: 'Compliance Training', path: '/events/compliance', icon: '📋', description: 'ITAR, EAR, security requirements' },
      ]
    },
    {
      title: 'Partner & Employer Events',
      items: [
        { label: 'University Recruiting', path: '/events/university', icon: '🏛️', description: 'Campus recruiting & info sessions' },
        { label: 'National Lab Open Days', path: '/events/national-labs', icon: '🔬', description: 'DOE facility recruitment events' },
        { label: 'Government Programs', path: '/events/government', icon: '🏛️', description: 'Federal workforce initiatives' },
        { label: 'Employer Showcases', path: '/events/employers', icon: '🏢', description: 'Company presentations & hiring events' },
      ]
    }
  ],
  cta: { label: 'Browse All Events', path: '/events', variant: 'primary' }
};

// Resources & More
const RESOURCES_MENU = {
  title: 'Resources',
  sections: [
    {
      title: 'Explore',
      items: [
        { label: 'Workforce Map', path: '/map', icon: '🗺️', description: 'Interactive opportunity explorer' },
        { label: 'News & Insights', path: '/blog', icon: '📰', description: 'Industry trends and updates' },
      ]
    },
    {
      title: 'Learn',
      items: [
        { label: 'Career Guides', path: '/guides', icon: '📚', description: 'Industry career roadmaps' },
        { label: 'Salary Data', path: '/salary-insights', icon: '💵', description: 'Compensation by role & region' },
        { label: 'About Us', path: '/about', icon: '🏢', description: 'Our mission & team' },
      ]
    }
  ]
};

// Main Navigation Items
// 8 items: Talent, Employers, Partners (orgs), Providers (individuals), High School, College, Events, Resources
// Items with 'link' property will be clickable links that also have dropdown menus on hover
// featureFlagId maps to feature flags in config for progressive release
const NAV_ITEMS = [
  { id: 'talent', label: 'For Talent', menu: TALENT_MENU, type: 'mega' },
  { id: 'employers', label: 'For Employers', menu: EMPLOYERS_MENU, type: 'mega' },
  { id: 'partners', label: 'For Partners', menu: PARTNERS_MENU, type: 'mega', link: '/partners', featureFlagId: 'page-partners' },
  { id: 'providers', label: 'For Providers', menu: SERVICE_PROVIDERS_MENU, type: 'mega', link: '/become-a-provider', featureFlagId: 'feature-become-provider' },
  { id: 'highschool', label: 'High School', menu: HIGH_SCHOOL_MENU, type: 'mega' },
  { id: 'college', label: 'College', menu: COLLEGE_MENU, type: 'mega' },
  { id: 'events', label: 'Events', menu: EVENTS_MENU, type: 'mega', link: '/events' },
  { id: 'resources', label: 'Resources', menu: RESOURCES_MENU, type: 'dropdown' },
];

// ===========================================
// MEGA MENU COMPONENT
// Supports dynamic column count (3 or 4 columns based on sections)
// ===========================================
const MegaMenu: React.FC<{
  menu: typeof TALENT_MENU;
  onClose: () => void;
}> = ({ menu, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  // Determine grid columns based on number of sections
  const sectionCount = menu.sections.length;
  const gridCols = sectionCount === 4 ? 'grid-cols-2 xl:grid-cols-4' : 'grid-cols-2 xl:grid-cols-3';

  // Clamp menu position so it doesn't overflow the viewport
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement?.getBoundingClientRect();
    // If it overflows on the right, flip to right-aligned
    if (rect.right > window.innerWidth - 8) {
      el.style.left = 'auto';
      el.style.right = `-${window.innerWidth - 8 - (parentRect?.right ?? 0)}px`;
    }
  }, []);

  return (
    <div
      ref={menuRef}
      className="absolute left-0 mt-2 w-[min(800px,calc(100vw-1rem))] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
      style={sectionCount === 4 ? { width: 'min(1000px, calc(100vw - 1rem))' } : undefined}
      onMouseLeave={onClose}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white">{menu.title}</h3>
        <p className="text-sm text-gray-400 mt-0.5">{menu.description}</p>
      </div>

      {/* Content Grid - Dynamic columns */}
      <div className={`grid ${gridCols} gap-0 divide-x divide-gray-700/50`}>
        {menu.sections.map((section, idx) => (
          <div key={idx} className="p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-all group"
                >
                  <span className="text-lg flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-800/50 px-6 py-4 flex items-center justify-between border-t border-gray-700">
        <p className="text-sm text-gray-400">Ready to get started?</p>
        <Link
          to={menu.cta.path}
          onClick={onClose}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-sm font-semibold rounded-lg transition-colors"
        >
          {menu.cta.label} →
        </Link>
      </div>
    </div>
  );
};

// ===========================================
// DROPDOWN MENU COMPONENT
// ===========================================
const DropdownMenu: React.FC<{
  menu: typeof RESOURCES_MENU;
  onClose: () => void;
}> = ({ menu, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement?.getBoundingClientRect();
    if (rect.right > window.innerWidth - 8) {
      el.style.right = `-${window.innerWidth - 8 - (parentRect?.right ?? 0)}px`;
    }
    if (rect.left < 8) {
      el.style.right = 'auto';
      el.style.left = `-${(parentRect?.left ?? 0) - 8}px`;
    }
  }, []);

  return (
  <div
    ref={dropdownRef}
    className="absolute right-0 mt-2 w-[400px] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-scale-in"
    onMouseLeave={onClose}
  >
    <div className="p-4 grid grid-cols-2 gap-4 divide-x divide-gray-700/50">
      {menu.sections.map((section, idx) => (
        <div key={idx} className={idx > 0 ? 'pl-4' : ''}>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {section.title}
          </h4>
          <div className="space-y-1">
            {section.items.map((item, itemIdx) => (
              <Link
                key={itemIdx}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group"
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

// ===========================================
// MOBILE MENU COMPONENT
// ===========================================
interface NavItemType {
  id: string;
  label: string;
  menu: {
    title: string;
    description?: string;
    sections: {
      title: string;
      items: {
        label: string;
        path: string;
        icon: string;
        description: string;
      }[];
    }[];
    cta?: {
      label: string;
      path: string;
      variant: string;
    };
  };
  type: string;
  link?: string;
  featureFlagId?: string;
}

const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: any;
  signOut: () => void;
  navItems: NavItemType[];
}> = ({ isOpen, onClose, isAuthenticated, user, signOut, navItems }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
        <Link to="/" onClick={onClose} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SW</span>
          </div>
          <span className="text-xl font-bold text-white">
            STEM<span className="text-blue-500">Workforce</span>
          </span>
        </Link>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-4rem)] pb-20">
        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-800">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/jobs"
              onClick={onClose}
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30"
            >
              <span className="text-2xl mb-2">💼</span>
              <span className="text-sm font-medium text-white">Browse Jobs</span>
            </Link>
            <Link
              to="/training"
              onClick={onClose}
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30"
            >
              <span className="text-2xl mb-2">📚</span>
              <span className="text-sm font-medium text-white">Training</span>
            </Link>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.id} className="border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(item.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-white font-medium">{item.label}</span>
                <svg
                  className={cn('w-5 h-5 text-gray-400 transition-transform', expandedSection === item.id && 'rotate-180')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedSection === item.id && (
                <div className="px-4 pb-4 space-y-4 animate-slide-down">
                  <div className="space-y-4">
                    {item.menu.sections.map((section, idx) => (
                      <div key={idx}>
                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">{section.title}</h5>
                        <div className="space-y-1">
                          {section.items.map((subItem, subIdx) => (
                            <Link
                              key={subIdx}
                              to={subItem.path}
                              onClick={onClose}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800"
                            >
                              <span>{subItem.icon}</span>
                              <span className="text-sm text-gray-300">{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800 mt-4">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.user_metadata?.first_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{user.user_metadata?.first_name || 'User'}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={onClose}
                className="block w-full py-3 bg-yellow-500 text-gray-900 text-center font-semibold rounded-xl"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => { signOut(); onClose(); }}
                className="block w-full py-3 bg-gray-800 text-white text-center font-medium rounded-xl"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full py-3 bg-gray-800 text-white text-center font-medium rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block w-full py-3 bg-yellow-500 text-gray-900 text-center font-semibold rounded-xl"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN HEADER COMPONENT
// ===========================================
export const Header: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { navigationFlags } = useFeatures();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useOnClickOutside(userMenuRef, () => setUserMenuOpen(false));

  // Map NAV_ITEMS ids to navigationFlags keys
  const navIdToFlagKey: Record<string, keyof typeof navigationFlags> = {
    talent: 'forTalent',
    employers: 'forEmployers',
    partners: 'forPartners',
    providers: 'forProviders',
    highschool: 'forStudents', // High school students
    college: 'forCollegeStudents', // College students - separate feature flag
    events: 'events',
    resources: 'resources',
  };

  // Filter navigation items and their sections/items based on feature flags
  const filteredNavItems = useMemo(() => {
    return NAV_ITEMS
      .filter(item => {
        // Check if the entire menu is enabled
        const flagKey = navIdToFlagKey[item.id];
        if (!flagKey) return true;
        return navigationFlags[flagKey].status === 'enabled';
      })
      .map(item => {
        // Deep filter sections and items within each menu
        const flagKey = navIdToFlagKey[item.id];
        if (!flagKey) return item;

        const flags = navigationFlags[flagKey];
        const originalMenu = item.menu;

        // Filter sections and items based on their status
        const filteredSections = originalMenu.sections
          .map((section, sectionIdx) => {
            const flagSection = flags.sections[sectionIdx];
            if (!flagSection || flagSection.status !== 'enabled') {
              return null;
            }

            const filteredItems = section.items.filter((_, itemIdx) => {
              const flagItem = flagSection.items[itemIdx];
              return flagItem && flagItem.status === 'enabled';
            });

            if (filteredItems.length === 0) return null;

            return {
              ...section,
              items: filteredItems,
            };
          })
          .filter((section): section is NonNullable<typeof section> => section !== null);

        // Return item with filtered menu, preserving all original properties
        return {
          ...item,
          menu: {
            ...originalMenu,
            sections: filteredSections,
          },
        };
      })
      .filter(item => {
        // Remove menus that have no sections left
        return item.menu.sections.length > 0;
      });
  }, [navigationFlags]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle menu hover with delay for better UX
  const handleMenuEnter = (menuId: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(menuId);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  // Get user display info
  const userMetadata = user?.user_metadata || {};
  const firstName = userMetadata.first_name || userMetadata.name?.split(' ')[0] || 'User';
  const lastName = userMetadata.last_name || '';
  const userEmail = user?.email || '';
  const userRole = userMetadata.role || 'member';
  const organizationName = userMetadata.organization_name;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <span className="text-gray-900 font-bold text-sm">SW</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                STEM<span className="text-yellow-400">Workforce</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {filteredNavItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(item.id)}
                  onMouseLeave={handleMenuLeave}
                >
                  {item.link ? (
                    // Nav item with direct link - clicking goes to landing page, hovering shows menu
                    <Link
                      to={item.link}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
                        activeMenu === item.id
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      )}
                      aria-expanded={activeMenu === item.id}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <svg
                        className={cn('w-4 h-4 transition-transform', activeMenu === item.id && 'rotate-180')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                  ) : (
                    // Nav item without link - just opens dropdown on hover/click
                    <button
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
                        activeMenu === item.id
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      )}
                      aria-expanded={activeMenu === item.id}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <svg
                        className={cn('w-4 h-4 transition-transform', activeMenu === item.id && 'rotate-180')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Render appropriate menu type */}
                  {activeMenu === item.id && (
                    item.type === 'mega' ? (
                      <MegaMenu menu={item.menu as typeof TALENT_MENU} onClose={() => setActiveMenu(null)} />
                    ) : (
                      <DropdownMenu menu={item.menu as typeof RESOURCES_MENU} onClose={() => setActiveMenu(null)} />
                    )
                  )}
                </div>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {firstName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-white hidden sm:block max-w-[120px] truncate">
                      {organizationName || firstName}
                    </span>
                    <svg
                      className={cn('w-4 h-4 text-gray-400 transition-transform', userMenuOpen && 'rotate-180')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden animate-scale-in">
                      <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{firstName} {lastName}</p>
                        {organizationName && (
                          <p className="text-xs text-yellow-400 mt-0.5">{organizationName}</p>
                        )}
                        <p className="text-xs text-gray-400">{userEmail}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full capitalize">
                          {userRole.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>📊</span> Dashboard
                        </Link>
                        {['admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN'].includes(userRole) && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <span>⚙️</span> Admin Portal
                          </Link>
                        )}
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>⚡</span> Settings
                        </Link>
                      </div>
                      <div className="py-2 border-t border-gray-700">
                        <button
                          onClick={() => {
                            signOut();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                        >
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        signOut={signOut}
        navItems={filteredNavItems}
      />
    </>
  );
};

export default Header;
