// ===========================================
// FEATURE FLAGS CONFIGURATION
// Mirrors Navigation Structure for Easy Management
// ===========================================

// Feature status
export type FeatureStatus =
  | 'enabled'         // Fully available
  | 'disabled'        // Completely hidden
  | 'beta'            // Available to beta users
  | 'coming-soon';    // Show as coming soon

// Navigation section structure
export interface NavSection {
  id: string;
  title: string;
  status: FeatureStatus;
  items: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description: string;
  status: FeatureStatus;
}

export interface NavMenu {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  sections: NavSection[];
}

// Complete navigation feature flags structure
export interface NavigationFlags {
  forTalent: NavMenu;
  forEmployers: NavMenu;
  forPartners: NavMenu;
  forProviders: NavMenu;
  forStudents: NavMenu;
  forCollegeStudents: NavMenu;
  challenges: NavMenu;
  events: NavMenu;
  resources: NavMenu;
}

// Default navigation feature flags - mirrors Header.tsx exactly
export const defaultNavigationFlags: NavigationFlags = {
  // ===========================================
  // FOR TALENT
  // ===========================================
  forTalent: {
    id: 'for-talent',
    title: 'For Talent',
    description: 'Find your next opportunity in emerging tech',
    status: 'enabled',
    sections: [
      {
        id: 'find-opportunities',
        title: 'Find Opportunities',
        status: 'enabled',
        items: [
          { id: 'browse-jobs', label: 'Browse Jobs', path: '/jobs', icon: '💼', description: 'Full-time positions in emerging fields', status: 'enabled' },
          { id: 'internships', label: 'Internships', path: '/jobs?type=internship', icon: '🎓', description: 'Gain experience at top organizations', status: 'enabled' },
          { id: 'research-positions', label: 'Research Positions', path: '/jobs?type=research', icon: '🔬', description: 'Academic and lab opportunities', status: 'enabled' },
          { id: 'workforce-map', label: 'Workforce Map', path: '/map', icon: '🗺️', description: 'Explore opportunities by location', status: 'enabled' },
        ]
      },
      {
        id: 'grow-career',
        title: 'Grow Your Career',
        status: 'enabled',
        items: [
          { id: 'training-programs', label: 'Training Programs', path: '/training', icon: '📚', description: 'Upskill with industry certifications', status: 'enabled' },
          { id: 'career-resources', label: 'Career Resources', path: '/resources', icon: '📋', description: 'Resume tools, interview prep & more', status: 'enabled' },
          { id: 'salary-insights', label: 'Salary Insights', path: '/salary-insights', icon: '📊', description: 'Compensation data by role & region', status: 'enabled' },
          { id: 'industry-insights', label: 'Industry Insights', path: '/industries', icon: '📈', description: 'Explore emerging tech sectors', status: 'enabled' },
        ]
      },
      {
        id: 'get-support',
        title: 'Get Support',
        status: 'enabled',
        items: [
          { id: 'find-career-coach', label: 'Find a Career Coach', path: '/service-providers?type=career-coach', icon: '🎯', description: 'Expert guidance for your journey', status: 'enabled' },
          { id: 'browse-experts', label: 'Browse All Experts', path: '/service-providers', icon: '⭐', description: 'Recruiters, coaches & consultants', status: 'enabled' },
          { id: 'mentorship', label: 'Mentorship Programs', path: '/mentorship', icon: '🤝', description: 'Connect with industry leaders', status: 'enabled' },
          { id: 'clearance-guide', label: 'Clearance Guide', path: '/clearance-guide', icon: '🔐', description: 'Navigate security clearances', status: 'enabled' },
        ]
      }
    ]
  },

  // ===========================================
  // FOR EMPLOYERS
  // ===========================================
  forEmployers: {
    id: 'for-employers',
    title: 'For Employers',
    description: 'Access top STEM talent for your organization',
    status: 'enabled',
    sections: [
      {
        id: 'hire-talent',
        title: 'Hire Talent',
        status: 'enabled',
        items: [
          { id: 'post-job', label: 'Post a Job', path: '/dashboard?action=post-job', icon: '📝', description: 'Reach qualified candidates', status: 'enabled' },
          { id: 'post-internships', label: 'Post Internships', path: '/dashboard?action=post-internship', icon: '🎓', description: 'Build your talent pipeline', status: 'enabled' },
          { id: 'browse-candidates', label: 'Browse Candidates', path: '/talent-search', icon: '🔍', description: 'Search our talent database', status: 'enabled' },
        ]
      },
      {
        id: 'workforce-solutions',
        title: 'Workforce Solutions',
        status: 'enabled',
        items: [
          { id: 'staffing-services', label: 'Staffing Services', path: '/services/staffing', icon: '👥', description: 'Contract and temp-to-perm', status: 'enabled' },
          { id: 'recruitment-partners', label: 'Recruitment Partners', path: '/service-providers?type=recruiter', icon: '🤝', description: 'Work with specialized recruiters', status: 'enabled' },
          { id: 'workforce-analytics', label: 'Workforce Analytics', path: '/analytics', icon: '📈', description: 'Market insights and trends', status: 'enabled' },
        ]
      },
      {
        id: 'partnership-programs',
        title: 'Partnership Programs',
        status: 'enabled',
        items: [
          { id: 'academic-partnerships', label: 'Academic Partnerships', path: '/partnerships/academic', icon: '🏛️', description: 'Connect with universities', status: 'enabled' },
          { id: 'apprenticeship-programs', label: 'Apprenticeship Programs', path: '/partnerships/apprenticeship', icon: '🛠️', description: 'Registered apprenticeships', status: 'enabled' },
          { id: 'diversity-initiatives', label: 'Diversity Initiatives', path: '/partnerships/diversity', icon: '👩🏽‍🔬👨🏿‍💻👩🏻‍🔧', description: 'DEI recruitment programs', status: 'enabled' },
        ]
      },
      {
        id: 'innovation-challenges',
        title: 'Innovation Challenges',
        status: 'enabled',
        items: [
          { id: 'browse-challenges', label: 'Browse Challenges', path: '/challenges', icon: '🏆', description: 'Explore active innovation challenges', status: 'enabled' },
          { id: 'create-challenge', label: 'Create a Challenge', path: '/challenges/create', icon: '✨', description: 'Post challenges to recruit solvers', status: 'enabled' },
          { id: 'manage-challenges', label: 'Manage Challenges', path: '/dashboard?tab=challenges', icon: '📊', description: 'Track submissions & winners', status: 'enabled' },
        ]
      }
    ]
  },

  // ===========================================
  // FOR PARTNERS
  // ===========================================
  forPartners: {
    id: 'for-partners',
    title: 'For Partners',
    description: 'Join our ecosystem connecting education, research, government & industry with STEM talent',
    status: 'enabled',
    sections: [
      {
        id: 'education-partners',
        title: 'Education Partners',
        status: 'enabled',
        items: [
          { id: 'universities', label: 'Universities & Colleges', path: '/education-partners', icon: '🎓', description: 'Connect students to industry careers', status: 'enabled' },
          { id: 'community-colleges', label: 'Community Colleges', path: '/education-partners?type=community-college', icon: '🏫', description: 'Build direct employer pipelines', status: 'enabled' },
          { id: 'bootcamps', label: 'Bootcamps & Accelerators', path: '/education-partners?type=bootcamp', icon: '💻', description: 'Showcase job placement outcomes', status: 'enabled' },
          { id: 'training-providers', label: 'Training Providers', path: '/education-partners?type=training', icon: '📚', description: 'List programs to qualified learners', status: 'enabled' },
        ]
      },
      {
        id: 'national-labs-research',
        title: 'National Labs & Research',
        status: 'enabled',
        items: [
          { id: 'doe-national-labs', label: 'DOE National Labs', path: '/partners/national-labs', icon: '⚛️', description: 'Recruit from verified talent pools', status: 'enabled' },
          { id: 'ffrdcs', label: 'FFRDCs', path: '/partners/national-labs?type=ffrdc', icon: '🔬', description: 'Post research & fellowship openings', status: 'enabled' },
          { id: 'university-research', label: 'University Research', path: '/partners/national-labs?type=research', icon: '🔭', description: 'Connect with emerging researchers', status: 'enabled' },
          { id: 'industry-rd', label: 'Industry R&D', path: '/partners/national-labs?type=industry-rd', icon: '🧪', description: 'Access specialized STEM candidates', status: 'enabled' },
        ]
      },
      {
        id: 'federal-state-agencies',
        title: 'Federal & State Agencies',
        status: 'enabled',
        items: [
          { id: 'federal-agencies', label: 'DOE, DOD, NASA, NSF', path: '/partners/government', icon: '🏛️', description: 'Connect programs to workforce needs', status: 'enabled' },
          { id: 'chips-act', label: 'CHIPS Act Programs', path: '/partners/government?type=chips-act', icon: '💎', description: 'Access semiconductor talent pipeline', status: 'enabled' },
          { id: 'state-workforce', label: 'State Workforce Boards', path: '/partners/government?type=state', icon: '🗺️', description: 'Regional workforce dev tools', status: 'enabled' },
          { id: 'economic-dev', label: 'Economic Development', path: '/partners/government?type=economic-dev', icon: '📈', description: 'Data-driven talent attraction', status: 'enabled' },
        ]
      },
      {
        id: 'industry-nonprofits',
        title: 'Industry & Nonprofits',
        status: 'enabled',
        items: [
          { id: 'pipeline-partners', label: 'Talent Pipeline Partners', path: '/partners/industry', icon: '🤝', description: 'Build direct-to-hire pathways', status: 'enabled' },
          { id: 'corporate-sponsors', label: 'Corporate Sponsors', path: '/partners/industry?type=sponsor', icon: '🏆', description: 'Brand visibility to STEM talent', status: 'enabled' },
          { id: 'workforce-nonprofits', label: 'Workforce Nonprofits', path: '/partners/nonprofits', icon: '💚', description: 'Amplify program reach & impact', status: 'enabled' },
          { id: 'stem-education-orgs', label: 'STEM Education Orgs', path: '/partners/nonprofits?type=stem-ed', icon: '🌱', description: 'Connect learners to career pathways', status: 'enabled' },
        ]
      },
      {
        id: 'innovation-challenges-partners',
        title: 'Innovation Challenges',
        status: 'enabled',
        items: [
          { id: 'sponsor-challenge', label: 'Sponsor a Challenge', path: '/challenges/create', icon: '🏆', description: 'Host innovation competitions', status: 'enabled' },
          { id: 'browse-challenges-partners', label: 'Browse Challenges', path: '/challenges', icon: '🔍', description: 'View active challenges', status: 'enabled' },
          { id: 'co-sponsor', label: 'Co-Sponsor Opportunities', path: '/challenges?co-sponsor=true', icon: '🤝', description: 'Partner on existing challenges', status: 'enabled' },
        ]
      }
    ]
  },

  // ===========================================
  // FOR PROVIDERS (Service Providers)
  // ===========================================
  forProviders: {
    id: 'for-providers',
    title: 'For Providers',
    description: 'Grow your consulting practice in emerging tech',
    status: 'enabled',
    sections: [
      {
        id: 'industry-consulting',
        title: 'Industry Consulting',
        status: 'enabled',
        items: [
          { id: 'semiconductor-consulting', label: 'Semiconductor', path: '/services/semiconductor-consulting', icon: '💎', description: 'Fab consulting & supply chain', status: 'enabled' },
          { id: 'nuclear-consulting', label: 'Nuclear Technologies', path: '/services/nuclear-consulting', icon: '☢️', description: 'Nuclear strategy & workforce planning', status: 'enabled' },
          { id: 'ai-consulting', label: 'AI & Machine Learning', path: '/services/ai-consulting', icon: '🤖', description: 'AI readiness, strategy & implementation', status: 'enabled' },
          { id: 'quantum-consulting', label: 'Quantum Technologies', path: '/services/quantum-consulting', icon: '⚛️', description: 'Quantum strategy & use case discovery', status: 'enabled' },
          { id: 'cybersecurity-consulting', label: 'Cybersecurity', path: '/services/cybersecurity-consulting', icon: '🛡️', description: 'Assessments, compliance & strategy', status: 'enabled' },
          { id: 'aerospace-consulting', label: 'Aerospace & Defense', path: '/services/aerospace-consulting', icon: '🚀', description: 'Defense sector consulting & compliance', status: 'enabled' },
          { id: 'biotech-consulting', label: 'Biotechnology', path: '/services/biotech-consulting', icon: '🧬', description: 'Biotech strategy & lab operations', status: 'enabled' },
          { id: 'healthcare-consulting', label: 'Healthcare & Medical Tech', path: '/services/healthcare-consulting', icon: '🏥', description: 'Healthcare tech & digital health', status: 'enabled' },
          { id: 'robotics-consulting', label: 'Robotics & Automation', path: '/services/robotics-consulting', icon: '🦾', description: 'Automation strategy & implementation', status: 'enabled' },
          { id: 'clean-energy-consulting', label: 'Clean Energy', path: '/services/clean-energy-consulting', icon: '⚡', description: 'Renewable energy & sustainability', status: 'enabled' },
          { id: 'manufacturing-consulting', label: 'Advanced Manufacturing', path: '/services/manufacturing-consulting', icon: '🏭', description: 'Smart manufacturing & Industry 4.0', status: 'enabled' },
        ]
      },
      {
        id: 'workforce-services',
        title: 'Workforce Services',
        status: 'enabled',
        items: [
          { id: 'stem-recruiting', label: 'STEM Recruiting', path: '/services/recruiting', icon: '🎯', description: 'Specialized talent acquisition', status: 'enabled' },
          { id: 'career-coaching', label: 'Career Coaching', path: '/services/career-coaching', icon: '🧭', description: 'Help talent navigate transitions', status: 'enabled' },
          { id: 'training-upskilling', label: 'Training & Upskilling', path: '/services/training-services', icon: '📚', description: 'Corporate learning programs', status: 'enabled' },
          { id: 'clearance-processing', label: 'Clearance Processing', path: '/services/clearance-services', icon: '🔐', description: 'Security clearance support', status: 'enabled' },
        ]
      },
      {
        id: 'provider-get-started',
        title: 'Get Started',
        status: 'enabled',
        items: [
          { id: 'become-provider', label: 'Become a Provider', path: '/become-a-provider', icon: '🚀', description: 'Apply to join our expert network', status: 'enabled' },
          { id: 'provider-resources', label: 'Provider Resources', path: '/provider-resources', icon: '📋', description: 'Tools, templates & guides', status: 'enabled' },
          { id: 'browse-projects', label: 'Browse Projects', path: '/projects', icon: '📂', description: 'Find active opportunities', status: 'enabled' },
          { id: 'provider-dashboard', label: 'Provider Dashboard', path: '/provider-dashboard', icon: '📊', description: 'Manage your practice', status: 'enabled' },
        ]
      }
    ]
  },

  // ===========================================
  // FOR STUDENTS
  // ===========================================
  forStudents: {
    id: 'for-students',
    title: 'For Students',
    description: 'AI-powered college prep, admissions support & STEM career discovery',
    status: 'enabled',
    sections: [
      {
        id: 'application-support',
        title: 'Application Support',
        status: 'enabled',
        items: [
          { id: 'essay-coach', label: 'AI Essay Coach', path: '/students/essay-coach', icon: '✍️', description: 'Real-time feedback on narrative & authenticity', status: 'enabled' },
          { id: 'research-writer', label: 'Research Experience Writer', path: '/students/research-writer', icon: '🔬', description: 'Translate technical work into compelling stories', status: 'enabled' },
          { id: 'why-school', label: '"Why This School" Generator', path: '/students/why-school', icon: '🎓', description: 'School-specific content with genuine connections', status: 'enabled' },
          { id: 'app-tracker', label: 'Application Tracker', path: '/students/app-tracker', icon: '📋', description: 'Smart scheduler with deadline optimization', status: 'enabled' },
          { id: 'interview-prep', label: 'Interview Prep Simulator', path: '/students/interview-prep', icon: '🎤', description: 'AI mock interviews with STEM-specific Qs', status: 'enabled' },
          { id: 'mock-review', label: 'Mock Admissions Review', path: '/students/mock-review', icon: '📝', description: 'See your app through admissions eyes', status: 'enabled' },
        ]
      },
      {
        id: 'college-discovery',
        title: 'College Discovery',
        status: 'enabled',
        items: [
          { id: 'college-matcher', label: 'AI College Matcher', path: '/students/college-matcher', icon: '🎯', description: 'Find best-fit schools by career outcomes', status: 'enabled' },
          { id: 'major-explorer', label: 'Major Explorer', path: '/students/major-explorer', icon: '🔭', description: 'Explore STEM majors and career paths', status: 'enabled' },
          { id: 'campus-culture', label: 'Campus Culture Finder', path: '/students/campus-culture', icon: '🧬', description: 'Find schools that match your vibe', status: 'enabled' },
          { id: 'financial-fit', label: 'Financial Fit Calculator', path: '/students/financial-fit', icon: '💰', description: 'Understand true costs and aid options', status: 'enabled' },
          { id: 'virtual-tours', label: 'Virtual Campus Tours', path: '/students/virtual-tours', icon: '🏫', description: 'Explore campuses from anywhere', status: 'enabled' },
          { id: 'compare-schools', label: 'Compare Schools', path: '/students/compare-schools', icon: '⚖️', description: 'Side-by-side school comparison tool', status: 'enabled' },
        ]
      },
      {
        id: 'financial-planning',
        title: 'Financial Planning',
        status: 'enabled',
        items: [
          { id: 'scholarship-matcher', label: 'AI Scholarship Matcher', path: '/students/scholarship-matcher', icon: '💰', description: '5,000+ STEM scholarships matched to you', status: 'enabled' },
          { id: 'net-price-calc', label: 'True Net Price Calculator', path: '/students/net-price-calculator', icon: '🧮', description: 'Actual award data, not estimates', status: 'enabled' },
          { id: 'award-letter', label: 'Award Letter Analyzer', path: '/students/award-letter-analyzer', icon: '📊', description: 'Compare offers & find leverage points', status: 'enabled' },
          { id: 'css-profile', label: 'CSS Profile Optimizer', path: '/students/css-profile', icon: '🎯', description: 'Minimize expected contribution legally', status: 'enabled' },
          { id: 'appeal-letter', label: 'Appeal Letter Generator', path: '/students/appeal-letter', icon: '📄', description: 'Professional appeals that get results', status: 'enabled' },
          { id: 'stem-funding', label: 'CHIPS Act & STEM Funding', path: '/students/stem-funding', icon: '⚡', description: 'DOE, NSF, semiconductor programs', status: 'enabled' },
          { id: 'loan-payoff', label: 'Loan Payoff Modeler', path: '/students/loan-payoff', icon: '📉', description: 'IDR, PSLF & repayment strategies', status: 'enabled' },
          { id: 'career-roi', label: 'STEM Career ROI Calculator', path: '/students/career-roi', icon: '📈', description: '15-year projection by career path', status: 'enabled' },
        ]
      }
    ]
  },

  // ===========================================
  // FOR COLLEGE STUDENTS
  // ===========================================
  forCollegeStudents: {
    id: 'for-college-students',
    title: 'For College Students',
    description: 'Career launch tools, graduate school prep & professional development for college students',
    status: 'enabled',
    sections: [
      {
        id: 'career-launch',
        title: 'Career Launch',
        status: 'enabled',
        items: [
          { id: 'career-launch-hub', label: 'Career Launch Hub', path: '/college/career-launch', icon: '🚀', description: 'Your career launchpad dashboard', status: 'enabled' },
          { id: 'internship-finder', label: 'Internship Finder', path: '/college/internships', icon: '💼', description: 'Find STEM internships', status: 'enabled' },
          { id: 'resume-builder', label: 'Resume Builder', path: '/college/resume-builder', icon: '📄', description: 'AI-powered resume creation', status: 'enabled' },
          { id: 'interview-prep', label: 'Interview Prep', path: '/college/interview-prep', icon: '🎤', description: 'Practice with AI mock interviews', status: 'enabled' },
          { id: 'technical-portfolio', label: 'Technical Portfolio', path: '/college/portfolio', icon: '💻', description: 'Showcase your projects', status: 'enabled' },
          { id: 'networking', label: 'Networking Hub', path: '/college/networking', icon: '🤝', description: 'Connect with professionals', status: 'enabled' },
        ]
      },
      {
        id: 'graduate-school',
        title: 'Graduate School Prep',
        status: 'enabled',
        items: [
          { id: 'grad-school-prep', label: 'Graduate School Prep', path: '/college/grad-school', icon: '🎓', description: 'Complete grad school guide', status: 'enabled' },
          { id: 'phd-decision', label: 'PhD Decision Guide', path: '/college/phd-decision', icon: '🔬', description: 'Should you pursue a PhD?', status: 'enabled' },
          { id: 'sop-coach', label: 'SOP Coach', path: '/college/sop-coach', icon: '✍️', description: 'Statement of purpose assistance', status: 'enabled' },
          { id: 'faculty-match', label: 'Faculty Match', path: '/college/faculty-match', icon: '👨‍🏫', description: 'Find research advisors', status: 'enabled' },
          { id: 'fellowship-finder', label: 'Fellowship Finder', path: '/college/fellowships', icon: '🏆', description: 'Graduate fellowships & grants', status: 'enabled' },
          { id: 'grad-funding', label: 'Grad Funding Guide', path: '/college/grad-funding', icon: '💰', description: 'Fund your graduate education', status: 'enabled' },
          { id: 'research-opportunities', label: 'Research Opportunities', path: '/college/research', icon: '🔭', description: 'Find research positions', status: 'enabled' },
        ]
      },
      {
        id: 'professional-development',
        title: 'Professional Development',
        status: 'enabled',
        items: [
          { id: 'professional-dev', label: 'Professional Development', path: '/college/professional-development', icon: '📈', description: 'Build professional skills', status: 'enabled' },
          { id: 'skills-assessment', label: 'Skills Assessment', path: '/college/skills-assessment', icon: '📊', description: 'Assess your technical skills', status: 'enabled' },
          { id: 'mentorship', label: 'Mentorship Program', path: '/college/mentorship', icon: '🧭', description: 'Connect with industry mentors', status: 'enabled' },
          { id: 'government-careers', label: 'Government Careers', path: '/college/government-careers', icon: '🏛️', description: 'Federal & state STEM jobs', status: 'enabled' },
          { id: 'clearance-guide', label: 'Clearance Guide', path: '/college/clearance-guide', icon: '🔐', description: 'Security clearance basics', status: 'enabled' },
          { id: 'college-events', label: 'Student Events', path: '/college/events', icon: '📅', description: 'Career fairs & workshops', status: 'enabled' },
        ]
      },
      {
        id: 'financial-tools',
        title: 'Financial Tools',
        status: 'enabled',
        items: [
          { id: 'salary-negotiation', label: 'Salary Negotiation', path: '/college/salary-negotiation', icon: '💵', description: 'Negotiate your first offer', status: 'enabled' },
          { id: 'offer-comparison', label: 'Offer Comparison', path: '/college/offer-comparison', icon: '⚖️', description: 'Compare job offers', status: 'enabled' },
          { id: 'budget-planner', label: 'Budget Planner', path: '/college/budget-planner', icon: '📒', description: 'Plan your finances', status: 'enabled' },
          { id: 'loan-strategy', label: 'Loan Strategy', path: '/college/loan-strategy', icon: '📉', description: 'Student loan repayment plans', status: 'enabled' },
          { id: 'relocation-calculator', label: 'Relocation Calculator', path: '/college/relocation-calculator', icon: '🏠', description: 'Cost of living comparison', status: 'enabled' },
        ]
      }
    ]
  },

  // ===========================================
  // CHALLENGES
  // ===========================================
  challenges: {
    id: 'challenges',
    title: 'Challenges',
    description: 'Innovation challenges with prizes - compete to solve real-world problems',
    status: 'enabled',
    sections: [
      {
        id: 'for-solvers',
        title: 'For Solvers',
        status: 'enabled',
        items: [
          { id: 'browse-all-challenges', label: 'Browse Challenges', path: '/challenges', icon: '🏆', description: 'Find challenges to compete in', status: 'enabled' },
          { id: 'my-challenges', label: 'My Challenges', path: '/dashboard?tab=challenges', icon: '📋', description: 'Track your submissions', status: 'enabled' },
          { id: 'find-team', label: 'Find a Team', path: '/challenges?teams=recruiting', icon: '👥', description: 'Join or form a team', status: 'enabled' },
        ]
      },
      {
        id: 'for-sponsors',
        title: 'For Sponsors',
        status: 'enabled',
        items: [
          { id: 'host-challenge', label: 'Host a Challenge', path: '/challenges/create', icon: '✨', description: 'Create your own challenge', status: 'enabled' },
          { id: 'manage-challenges-sponsor', label: 'Manage Challenges', path: '/dashboard?tab=hosted-challenges', icon: '📊', description: 'Review submissions & winners', status: 'enabled' },
          { id: 'challenge-pricing', label: 'Pricing & Plans', path: '/pricing?type=challenges', icon: '💰', description: 'Challenge hosting options', status: 'enabled' },
        ]
      },
      {
        id: 'challenge-types',
        title: 'By Type',
        status: 'enabled',
        items: [
          { id: 'ideation-challenges', label: 'Ideation', path: '/challenges?type=ideation', icon: '💡', description: 'Share innovative ideas', status: 'enabled' },
          { id: 'prototype-challenges', label: 'Prototype', path: '/challenges?type=prototype', icon: '🚀', description: 'Build working prototypes', status: 'enabled' },
          { id: 'hackathons', label: 'Hackathons', path: '/challenges?type=hackathon', icon: '⚡', description: 'Time-limited competitions', status: 'enabled' },
          { id: 'grand-challenges', label: 'Grand Challenges', path: '/challenges?type=grand-challenge', icon: '🎯', description: 'Major multi-phase competitions', status: 'enabled' },
        ]
      }
    ]
  },

  // ===========================================
  // EVENTS
  // ===========================================
  events: {
    id: 'events',
    title: 'Events',
    description: 'Career fairs, conferences, workshops & networking across STEM industries',
    status: 'enabled',
    sections: [
      {
        id: 'career-events',
        title: 'Career Events',
        status: 'enabled',
        items: [
          { id: 'virtual-career-fairs', label: 'Virtual Career Fairs', path: '/events/career-fairs', icon: '💼', description: 'Connect with employers hiring now', status: 'enabled' },
          { id: 'industry-networking', label: 'Industry Networking', path: '/events/networking', icon: '🤝', description: 'Build connections in your field', status: 'enabled' },
          { id: 'resume-interview-prep', label: 'Resume & Interview Prep', path: '/events/workshops', icon: '📝', description: 'Sharpen your job search skills', status: 'enabled' },
          { id: 'clearance-briefings', label: 'Clearance Briefings', path: '/events/clearance', icon: '🔐', description: 'Security clearance guidance sessions', status: 'enabled' },
        ]
      },
      {
        id: 'industry-conferences',
        title: 'Industry Conferences',
        status: 'enabled',
        items: [
          { id: 'semiconductor-events', label: 'Semiconductor Events', path: '/events/semiconductor', icon: '💎', description: 'CHIPS Act workforce summits', status: 'enabled' },
          { id: 'nuclear-energy-events', label: 'Nuclear & Energy', path: '/events/nuclear-energy', icon: '⚛️', description: 'Clean energy workforce forums', status: 'enabled' },
          { id: 'ai-quantum-events', label: 'AI & Quantum', path: '/events/ai-quantum', icon: '🤖', description: 'Emerging tech conferences', status: 'enabled' },
          { id: 'aerospace-defense-events', label: 'Aerospace & Defense', path: '/events/aerospace-defense', icon: '🚀', description: 'Defense industry gatherings', status: 'enabled' },
        ]
      },
      {
        id: 'training-development',
        title: 'Training & Development',
        status: 'enabled',
        items: [
          { id: 'certification-bootcamps', label: 'Certification Bootcamps', path: '/events/certifications', icon: '🎓', description: 'Intensive skill-building programs', status: 'enabled' },
          { id: 'leadership-workshops', label: 'Leadership Workshops', path: '/events/leadership', icon: '⭐', description: 'Management & executive training', status: 'enabled' },
          { id: 'compliance-training', label: 'Compliance Training', path: '/events/compliance', icon: '📋', description: 'ITAR, EAR, security requirements', status: 'enabled' },
        ]
      },
      {
        id: 'partner-employer-events',
        title: 'Partner & Employer Events',
        status: 'enabled',
        items: [
          { id: 'university-recruiting', label: 'University Recruiting', path: '/events/university', icon: '🏛️', description: 'Campus recruiting & info sessions', status: 'enabled' },
          { id: 'national-lab-open-days', label: 'National Lab Open Days', path: '/events/national-labs', icon: '🔬', description: 'DOE facility recruitment events', status: 'enabled' },
          { id: 'government-programs', label: 'Government Programs', path: '/events/government', icon: '🏛️', description: 'Federal workforce initiatives', status: 'enabled' },
          { id: 'employer-showcases', label: 'Employer Showcases', path: '/events/employers', icon: '🏢', description: 'Company presentations & hiring events', status: 'enabled' },
        ]
      }
    ]
  },

  // ===========================================
  // RESOURCES
  // ===========================================
  resources: {
    id: 'resources',
    title: 'Resources',
    description: 'Explore and learn',
    status: 'enabled',
    sections: [
      {
        id: 'explore',
        title: 'Explore',
        status: 'enabled',
        items: [
          { id: 'workforce-map-resource', label: 'Workforce Map', path: '/map', icon: '🗺️', description: 'Interactive opportunity explorer', status: 'enabled' },
          { id: 'blog', label: 'News & Insights', path: '/blog', icon: '📰', description: 'Industry trends and updates', status: 'enabled' },
        ]
      },
      {
        id: 'learn',
        title: 'Learn',
        status: 'enabled',
        items: [
          { id: 'career-guides', label: 'Career Guides', path: '/guides', icon: '📚', description: 'Industry career roadmaps', status: 'enabled' },
          { id: 'salary-data', label: 'Salary Data', path: '/salary-insights', icon: '💵', description: 'Compensation by role & region', status: 'enabled' },
          { id: 'about-us', label: 'About Us', path: '/about', icon: '🏢', description: 'Our mission & team', status: 'enabled' },
        ]
      }
    ]
  }
};

// Local storage key
export const NAV_FLAGS_STORAGE_KEY = 'stemworkforce_nav_flags';

// Load navigation flags from localStorage
export const loadNavigationFlags = (): NavigationFlags => {
  if (typeof window === 'undefined') return defaultNavigationFlags;

  try {
    const stored = localStorage.getItem(NAV_FLAGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Deep merge with defaults to handle new menu keys added after user's localStorage was set
      const merged: NavigationFlags = { ...defaultNavigationFlags };
      (Object.keys(defaultNavigationFlags) as (keyof NavigationFlags)[]).forEach(menuKey => {
        if (parsed[menuKey]) {
          merged[menuKey] = {
            ...defaultNavigationFlags[menuKey],
            ...parsed[menuKey],
            // Merge sections array, preferring stored sections but falling back to defaults for new sections
            sections: defaultNavigationFlags[menuKey].sections.map(defaultSection => {
              const storedSection = parsed[menuKey].sections?.find(
                (s: NavSection) => s.id === defaultSection.id
              );
              if (storedSection) {
                return {
                  ...defaultSection,
                  ...storedSection,
                  // Merge items, preferring stored but falling back to defaults for new items
                  items: defaultSection.items.map(defaultItem => {
                    const storedItem = storedSection.items?.find(
                      (i: NavItem) => i.id === defaultItem.id
                    );
                    return storedItem ? { ...defaultItem, ...storedItem } : defaultItem;
                  })
                };
              }
              return defaultSection;
            })
          };
        }
        // If menuKey doesn't exist in stored, merged already has the default
      });
      return merged;
    }
  } catch (error) {
    console.error('Error loading navigation flags:', error);
  }

  return defaultNavigationFlags;
};

// Save navigation flags to localStorage
export const saveNavigationFlags = (flags: NavigationFlags): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(NAV_FLAGS_STORAGE_KEY, JSON.stringify(flags));
  } catch (error) {
    console.error('Error saving navigation flags:', error);
  }
};

// Helper to check if a path is enabled
export const isPathEnabled = (flags: NavigationFlags, path: string): boolean => {
  // Check all menus
  const menus = [flags.forTalent, flags.forEmployers, flags.forPartners, flags.forProviders, flags.forStudents, flags.forCollegeStudents, flags.events, flags.resources];

  for (const menu of menus) {
    if (menu.status === 'disabled') continue;

    for (const section of menu.sections) {
      if (section.status === 'disabled') continue;

      for (const item of section.items) {
        if (item.path === path || path.startsWith(item.path.split('?')[0])) {
          return item.status === 'enabled';
        }
      }
    }
  }

  return true; // Default to enabled if not found
};

// Helper to get count of enabled/disabled items in a menu
export const getMenuStats = (menu: NavMenu): { enabled: number; disabled: number; total: number } => {
  let enabled = 0;
  let disabled = 0;

  for (const section of menu.sections) {
    for (const item of section.items) {
      if (item.status === 'enabled') enabled++;
      else disabled++;
    }
  }

  return { enabled, disabled, total: enabled + disabled };
};

// ===========================================
// LEGACY EXPORTS (for backwards compatibility)
// ===========================================

export type FeatureCategory = 'pages' | 'services' | 'features' | 'integrations' | 'experimental';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  route?: string;
  dependencies?: string[];
  enabledRoles?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlags {
  [key: string]: FeatureFlag;
}

export const defaultFeatureFlags: FeatureFlags = {};

export const FEATURE_FLAGS_STORAGE_KEY = 'stemworkforce_feature_flags';

export const loadFeatureFlags = (): FeatureFlags => defaultFeatureFlags;
export const saveFeatureFlags = (_flags: FeatureFlags): void => {};
export const isFeatureAccessible = (_flags: FeatureFlags, _featureId: string, _userRole?: string): boolean => true;
export const getFeaturesByCategory = (_flags: FeatureFlags, _category: FeatureCategory): FeatureFlag[] => [];
