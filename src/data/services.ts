// ===========================================
// Services Data - Original Service Definitions
// All content is original and not derived from external sources
// ===========================================

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  benefits: string[];
  deliverables: string[];
  idealFor: string[];
  relatedIndustries: string[];
}

// Service Categories with Original Naming
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'talent-solutions',
    name: 'Talent Solutions',
    description: 'End-to-end workforce acquisition and development services to build high-performing teams.',
    icon: '👥',
    color: '#3b82f6',
    services: [
      {
        id: 'talent-acquisition',
        name: 'Talent Acquisition & Recruitment',
        shortDescription: 'Strategic hiring solutions for specialized technical roles.',
        fullDescription: 'We partner with organizations to identify, attract, and secure top talent in competitive technical fields. Our approach combines deep industry networks with rigorous assessment methodologies to match candidates with roles where they will thrive.',
        icon: '🎯',
        benefits: [
          'Access to specialized talent networks',
          'Reduced time-to-hire for technical roles',
          'Improved candidate quality and retention',
          'Diversity-focused sourcing strategies',
        ],
        deliverables: [
          'Role requirements analysis',
          'Candidate sourcing and screening',
          'Technical assessment design',
          'Offer negotiation support',
        ],
        idealFor: [
          'Organizations hiring for hard-to-fill roles',
          'Companies entering new technical domains',
          'Rapid scaling initiatives',
        ],
        relatedIndustries: ['artificial-intelligence', 'quantum-computing', 'semiconductor', 'cybersecurity'],
      },
      {
        id: 'upskilling-programs',
        name: 'Upskilling & Reskilling Programs',
        shortDescription: 'Custom learning pathways to develop workforce capabilities.',
        fullDescription: 'We design and deliver tailored training programs that help organizations develop their existing workforce to meet evolving skill demands. Our programs combine instructor-led learning, hands-on projects, and ongoing mentorship to drive lasting capability development.',
        icon: '📚',
        benefits: [
          'Accelerated skill development',
          'Improved employee engagement and retention',
          'Reduced external hiring costs',
          'Knowledge transfer across teams',
        ],
        deliverables: [
          'Skills gap analysis',
          'Custom curriculum development',
          'Training delivery and facilitation',
          'Progress tracking and certification',
        ],
        idealFor: [
          'Organizations facing skills gaps',
          'Companies adopting new technologies',
          'Teams preparing for digital transformation',
        ],
        relatedIndustries: ['advanced-manufacturing', 'clean-energy', 'healthcare', 'robotics'],
      },
      {
        id: 'apprenticeship-development',
        name: 'Apprenticeship Program Development',
        shortDescription: 'Structured earn-and-learn programs for workforce pipeline building.',
        fullDescription: 'We help organizations design and implement registered apprenticeship programs that combine on-the-job training with related instruction. These programs create sustainable talent pipelines while providing meaningful career pathways for participants.',
        icon: '🛠️',
        benefits: [
          'Sustainable talent pipeline creation',
          'Reduced hiring and training costs',
          'Improved workforce diversity',
          'Eligible for federal and state incentives',
        ],
        deliverables: [
          'Program design and registration',
          'Curriculum and competency framework',
          'Employer partnership development',
          'Participant recruitment and support',
        ],
        idealFor: [
          'Manufacturers building skilled trades pipelines',
          'Organizations seeking CHIPS Act compliance',
          'Companies committed to workforce development',
        ],
        relatedIndustries: ['semiconductor', 'advanced-manufacturing', 'nuclear-energy', 'clean-energy'],
      },
    ],
  },
  {
    id: 'ai-workforce-services',
    name: 'AI & Workforce Transformation',
    description: 'Prepare your organization and workforce for the age of artificial intelligence.',
    icon: '🤖',
    color: '#8b5cf6',
    services: [
      {
        id: 'ai-readiness-diagnostic',
        name: 'AI Readiness Diagnostic',
        shortDescription: 'Assess organizational preparedness for AI adoption.',
        fullDescription: 'Our diagnostic evaluates your organization\'s readiness to adopt and benefit from AI technologies. We examine technology infrastructure, data capabilities, workforce skills, and organizational culture to identify opportunities and barriers to successful AI integration.',
        icon: '🔍',
        benefits: [
          'Clear understanding of current AI maturity',
          'Identification of capability gaps',
          'Prioritized roadmap for AI adoption',
          'Risk mitigation strategies',
        ],
        deliverables: [
          'Technology and data readiness assessment',
          'Workforce skills inventory',
          'Culture and change readiness evaluation',
          'Executive summary with recommendations',
        ],
        idealFor: [
          'Organizations exploring AI investments',
          'Leaders seeking clarity before major initiatives',
          'Companies with stalled AI projects',
        ],
        relatedIndustries: ['artificial-intelligence', 'healthcare', 'biotechnology', 'advanced-manufacturing'],
      },
      {
        id: 'ai-workforce-impact',
        name: 'AI Workforce Impact Analysis',
        shortDescription: 'Understand how AI will reshape roles and responsibilities.',
        fullDescription: 'We analyze how AI technologies will affect work at the task level across your organization. This goes beyond job-level predictions to understand which specific activities will be augmented, automated, or remain human-driven, enabling targeted workforce planning.',
        icon: '📊',
        benefits: [
          'Task-level understanding of AI impact',
          'Proactive workforce transition planning',
          'Reduced anxiety and resistance',
          'Targeted upskilling investments',
        ],
        deliverables: [
          'Role and task analysis',
          'Impact heat maps by function',
          'Transition timeline projections',
          'Skill development priorities',
        ],
        idealFor: [
          'Organizations implementing AI at scale',
          'HR leaders planning workforce transitions',
          'Companies concerned about displacement',
        ],
        relatedIndustries: ['artificial-intelligence', 'robotics', 'healthcare', 'cybersecurity'],
      },
      {
        id: 'ai-culture-assessment',
        name: 'AI Culture & Adoption Assessment',
        shortDescription: 'Evaluate cultural readiness for AI-driven change.',
        fullDescription: 'Successful AI adoption requires more than technology—it demands a culture that embraces experimentation, learning from failure, and continuous adaptation. We assess your organization\'s cultural DNA to identify enablers and barriers to AI adoption.',
        icon: '🧠',
        benefits: [
          'Understanding of cultural barriers to AI',
          'Identification of change champions',
          'Targeted culture development initiatives',
          'Improved AI project success rates',
        ],
        deliverables: [
          'Culture survey and analysis',
          'Leadership behavior assessment',
          'Psychological safety evaluation',
          'Culture development roadmap',
        ],
        idealFor: [
          'Organizations with failed technology initiatives',
          'Leaders sensing cultural resistance',
          'Companies prioritizing human-AI collaboration',
        ],
        relatedIndustries: ['artificial-intelligence', 'advanced-manufacturing', 'healthcare', 'biotechnology'],
      },
      {
        id: 'ai-strategy-alignment',
        name: 'AI Strategy & Workforce Alignment',
        shortDescription: 'Connect AI strategy with workforce development.',
        fullDescription: 'We help organizations align their AI technology investments with comprehensive workforce strategies. This ensures that people capabilities develop in lockstep with technology adoption, maximizing ROI and minimizing disruption.',
        icon: '🎯',
        benefits: [
          'Integrated technology and talent roadmaps',
          'Maximized return on AI investments',
          'Reduced implementation risk',
          'Sustained competitive advantage',
        ],
        deliverables: [
          'AI strategy review and alignment',
          'Workforce capability roadmap',
          'Investment prioritization framework',
          'Implementation governance model',
        ],
        idealFor: [
          'C-suite leaders planning AI investments',
          'Organizations with siloed AI initiatives',
          'Companies seeking competitive advantage',
        ],
        relatedIndustries: ['artificial-intelligence', 'quantum-computing', 'healthcare', 'cybersecurity'],
      },
    ],
  },
  {
    id: 'strategic-planning',
    name: 'Strategic Workforce Planning',
    description: 'Long-term workforce strategies aligned with business objectives and market dynamics.',
    icon: '📈',
    color: '#10b981',
    services: [
      {
        id: 'workforce-planning',
        name: 'Strategic Workforce Planning',
        shortDescription: 'Multi-year workforce strategies aligned with business goals.',
        fullDescription: 'We help organizations develop comprehensive workforce plans that anticipate future talent needs, identify capability gaps, and create actionable strategies to build the workforce required for long-term success. Our approach integrates labor market analysis, skills forecasting, and scenario planning.',
        icon: '🗺️',
        benefits: [
          'Proactive talent pipeline development',
          'Reduced reactive hiring costs',
          'Improved workforce agility',
          'Better alignment with business strategy',
        ],
        deliverables: [
          'Current state workforce analysis',
          'Future state workforce requirements',
          'Gap analysis and prioritization',
          'Multi-year workforce roadmap',
        ],
        idealFor: [
          'Organizations planning major growth',
          'Companies facing workforce transitions',
          'Leaders concerned about talent risks',
        ],
        relatedIndustries: ['semiconductor', 'nuclear-energy', 'aerospace', 'clean-energy'],
      },
      {
        id: 'skills-mapping',
        name: 'Skills Taxonomy & Mapping',
        shortDescription: 'Build a comprehensive understanding of workforce capabilities.',
        fullDescription: 'We help organizations develop skills taxonomies that provide a common language for describing workforce capabilities. This foundational work enables skills-based hiring, targeted development, and strategic workforce planning based on actual capabilities rather than job titles.',
        icon: '🏗️',
        benefits: [
          'Common language for skills discussions',
          'Foundation for skills-based talent practices',
          'Improved internal mobility',
          'Data-driven workforce decisions',
        ],
        deliverables: [
          'Custom skills taxonomy',
          'Current workforce skills inventory',
          'Skills gap analysis',
          'Skills-based role definitions',
        ],
        idealFor: [
          'Organizations transitioning to skills-based practices',
          'Companies with unclear workforce capabilities',
          'HR leaders modernizing talent systems',
        ],
        relatedIndustries: ['artificial-intelligence', 'biotechnology', 'healthcare', 'cybersecurity'],
      },
      {
        id: 'leadership-development',
        name: 'Leadership & Manager Development',
        shortDescription: 'Build leaders who can navigate technological change.',
        fullDescription: 'We develop leadership programs tailored to the unique challenges of managing in technology-intensive environments. Our programs build capabilities in leading through change, fostering innovation cultures, and developing technical talent.',
        icon: '👔',
        benefits: [
          'Improved change leadership capability',
          'Better talent retention and development',
          'Stronger innovation culture',
          'Enhanced organizational agility',
        ],
        deliverables: [
          'Leadership capability assessment',
          'Custom development curriculum',
          'Coaching and mentorship programs',
          'Progress measurement and feedback',
        ],
        idealFor: [
          'Organizations undergoing transformation',
          'Companies with new leadership teams',
          'Rapid-growth technology companies',
        ],
        relatedIndustries: ['artificial-intelligence', 'quantum-computing', 'biotechnology', 'aerospace'],
      },
    ],
  },
  {
    id: 'industry-consulting',
    name: 'Industry-Specific Consulting',
    description: 'Deep expertise in workforce challenges unique to critical technology sectors.',
    icon: '🔬',
    color: '#f59e0b',
    services: [
      {
        id: 'quantum-workforce',
        name: 'Quantum Workforce Consulting',
        shortDescription: 'Build teams for the quantum computing era.',
        fullDescription: 'We help organizations navigate the unique talent challenges of quantum computing. From identifying transferable skills in physics and mathematics to designing quantum literacy programs for executives, we prepare organizations to compete in the quantum era.',
        icon: '⚛️',
        benefits: [
          'Access to quantum talent networks',
          'Practical quantum literacy for leaders',
          'University and lab partnership facilitation',
          'Competitive positioning for quantum era',
        ],
        deliverables: [
          'Quantum opportunity assessment',
          'Talent pipeline strategy',
          'Executive education programs',
          'Research partnership facilitation',
        ],
        idealFor: [
          'Organizations exploring quantum applications',
          'Companies building quantum capabilities',
          'Leaders seeking quantum literacy',
        ],
        relatedIndustries: ['quantum-computing', 'artificial-intelligence', 'cybersecurity', 'aerospace'],
      },
      {
        id: 'manufacturing-transition',
        name: 'Manufacturing Workforce Transition',
        shortDescription: 'Navigate the shift to smart manufacturing.',
        fullDescription: 'We help manufacturers transform their workforce for Industry 4.0. This includes assessing automation impact, designing reskilling programs, building digital capabilities, and creating career pathways that help workers thrive in smart factory environments.',
        icon: '🏭',
        benefits: [
          'Smooth transition to automation',
          'Preserved institutional knowledge',
          'Improved worker engagement',
          'Competitive manufacturing operations',
        ],
        deliverables: [
          'Automation impact assessment',
          'Reskilling program design',
          'Digital skills curriculum',
          'Change management support',
        ],
        idealFor: [
          'Manufacturers implementing automation',
          'Companies building smart factories',
          'Organizations reshoring production',
        ],
        relatedIndustries: ['advanced-manufacturing', 'robotics', 'semiconductor', 'aerospace'],
      },
      {
        id: 'nuclear-workforce',
        name: 'Nuclear Workforce Development',
        shortDescription: 'Build and sustain nuclear industry talent.',
        fullDescription: 'We support nuclear utilities, national laboratories, and advanced reactor developers in addressing workforce challenges. From knowledge transfer programs for retiring workers to talent pipelines for next-generation technologies, we ensure continuity and capability.',
        icon: '⚡',
        benefits: [
          'Preserved critical knowledge',
          'Sustainable talent pipelines',
          'Clearance-ready candidate pools',
          'Next-gen reactor readiness',
        ],
        deliverables: [
          'Retirement risk analysis',
          'Knowledge transfer programs',
          'University partnership development',
          'Training program design',
        ],
        idealFor: [
          'Nuclear utilities facing retirements',
          'Advanced reactor developers',
          'DOE laboratories and contractors',
        ],
        relatedIndustries: ['nuclear-energy', 'clean-energy', 'aerospace', 'advanced-manufacturing'],
      },
      {
        id: 'chips-workforce',
        name: 'Semiconductor Workforce Solutions',
        shortDescription: 'Support CHIPS Act workforce requirements.',
        fullDescription: 'We help semiconductor manufacturers and their partners meet CHIPS Act workforce development requirements. This includes workforce planning for new fabs, training program design, community partnership development, and compliance documentation.',
        icon: '💻',
        benefits: [
          'CHIPS Act compliance support',
          'Accelerated workforce buildout',
          'Community partnership facilitation',
          'Sustainable talent pipelines',
        ],
        deliverables: [
          'Workforce development plans',
          'Training program partnerships',
          'Diversity and equity strategies',
          'Compliance documentation',
        ],
        idealFor: [
          'Semiconductor manufacturers',
          'CHIPS Act funding applicants',
          'Fab workforce development partners',
        ],
        relatedIndustries: ['semiconductor', 'advanced-manufacturing', 'clean-energy', 'aerospace'],
      },
      {
        id: 'automation-consulting',
        name: 'Automation & Robotics Workforce',
        shortDescription: 'Prepare teams for automated operations.',
        fullDescription: 'We help organizations prepare their workforce for increased automation. This includes assessing which roles will change, designing new job architectures that combine human and machine capabilities, and building the technical skills needed to work alongside robots.',
        icon: '🦾',
        benefits: [
          'Smooth automation implementation',
          'Engaged and skilled workforce',
          'Optimized human-machine collaboration',
          'Reduced resistance to change',
        ],
        deliverables: [
          'Automation readiness assessment',
          'Job redesign frameworks',
          'Technical training programs',
          'Change management support',
        ],
        idealFor: [
          'Organizations implementing robotics',
          'Warehouse and logistics operations',
          'Manufacturing automation projects',
        ],
        relatedIndustries: ['robotics', 'advanced-manufacturing', 'aerospace', 'healthcare'],
      },
    ],
  },
  {
    id: 'compliance-support',
    name: 'Compliance & Support Services',
    description: 'Navigate regulatory requirements and support workforce success.',
    icon: '📋',
    color: '#ef4444',
    services: [
      {
        id: 'clearance-pipeline',
        name: 'Security Clearance Pipeline Development',
        shortDescription: 'Build sustainable pipelines of clearance-eligible talent.',
        fullDescription: 'We help organizations in cleared industries develop sustainable pipelines of candidates who are eligible and prepared for security clearances. This reduces time-to-productivity and ensures continuity for critical national security work.',
        icon: '🔐',
        benefits: [
          'Reduced clearance timeline risk',
          'Pre-screened candidate pools',
          'Improved retention in cleared roles',
          'Sustainable pipeline development',
        ],
        deliverables: [
          'Clearance eligibility screening',
          'Pipeline partner development',
          'Candidate preparation programs',
          'Process optimization consulting',
        ],
        idealFor: [
          'Defense contractors',
          'National laboratories',
          'Government technology providers',
        ],
        relatedIndustries: ['aerospace', 'cybersecurity', 'nuclear-energy', 'semiconductor'],
      },
      {
        id: 'veteran-transition',
        name: 'Military-to-Civilian Transition Programs',
        shortDescription: 'Connect veterans with technical career opportunities.',
        fullDescription: 'We help organizations tap into the exceptional talent pool of transitioning military personnel. Our programs connect veterans with employers, translate military experience to civilian roles, and provide transition support that ensures success.',
        icon: '🎖️',
        benefits: [
          'Access to disciplined, trained talent',
          'Pre-existing security clearances',
          'Strong technical and leadership skills',
          'High retention rates',
        ],
        deliverables: [
          'Military skills translation',
          'Employer matching programs',
          'Transition support services',
          'Onboarding and integration',
        ],
        idealFor: [
          'Organizations with clearance requirements',
          'Technical employers seeking reliability',
          'Companies committed to veteran hiring',
        ],
        relatedIndustries: ['nuclear-energy', 'aerospace', 'cybersecurity', 'advanced-manufacturing'],
      },
      {
        id: 'dei-workforce',
        name: 'Workforce Diversity & Inclusion Strategy',
        shortDescription: 'Build inclusive practices that expand talent access.',
        fullDescription: 'We help organizations develop diversity and inclusion strategies that expand access to talent while creating equitable and inclusive workplaces. Our approach focuses on practical actions that deliver measurable results.',
        icon: '🌍',
        benefits: [
          'Expanded talent pool access',
          'Improved innovation and performance',
          'Compliance with funding requirements',
          'Enhanced employer brand',
        ],
        deliverables: [
          'Current state assessment',
          'Strategy development',
          'Implementation support',
          'Progress measurement',
        ],
        idealFor: [
          'CHIPS Act funding recipients',
          'Federal contractors',
          'Organizations seeking to expand talent access',
        ],
        relatedIndustries: ['semiconductor', 'clean-energy', 'advanced-manufacturing', 'biotechnology'],
      },
    ],
  },
];

// Helper functions
export const getAllServices = (): Service[] => {
  return SERVICE_CATEGORIES.flatMap(category => category.services);
};

export const getServiceById = (id: string): Service | undefined => {
  return getAllServices().find(service => service.id === id);
};

export const getServicesByIndustry = (industryId: string): Service[] => {
  return getAllServices().filter(service =>
    service.relatedIndustries.includes(industryId)
  );
};

export const getCategoryById = (id: string): ServiceCategory | undefined => {
  return SERVICE_CATEGORIES.find(category => category.id === id);
};
