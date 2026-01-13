// ===========================================
// Industries Data - Comprehensive Industry Definitions
// Each industry has its own value proposition, services, and content
// ===========================================

export interface IndustryService {
  tier: 1 | 2 | 3;
  name: string;
  bestFor: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface IndustryData {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  gradient: string;

  // Hero section
  tagline: string;
  heroDescription: string;

  // Problem section
  problemTitle: string;
  problemDescription: string;
  challenges: string[];

  // Solution section
  solutionTitle: string;
  solutionDescription: string;
  approachPoints: {
    title: string;
    description: string;
    icon: string;
  }[];

  // Trust section
  trustedByDescription: string;

  // Services
  services: IndustryService[];

  // Stats
  stats: {
    label: string;
    value: string;
    icon: string;
  }[];

  // Key skills
  keySkills: string[];

  // Top employers
  topEmployers: string[];

  // Related industries
  relatedIndustries: string[];
}

export const INDUSTRIES_DATA: Record<string, IndustryData> = {
  'artificial-intelligence': {
    id: 'artificial-intelligence',
    name: 'AI & Machine Learning',
    shortName: 'AI',
    icon: '🤖',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-500',

    tagline: 'Building the AI-Ready Workforce of Tomorrow',
    heroDescription: 'Navigate the complexities of AI adoption with research-based diagnostics and strategic advisory services designed to prepare your organization for sustainable transformation.',

    problemTitle: 'Why AI Investments Often Fail to Deliver Workforce Impact',
    problemDescription: 'Despite substantial investments in AI technologies, many organizations struggle to translate these investments into meaningful workforce outcomes. The challenge is rarely the technology itself. Instead, AI initiatives falter because organizations lack a clear understanding of whether their culture, leadership systems, and workforce capabilities are prepared to absorb and sustain change.',
    challenges: [
      'Misalignment between AI strategy and workforce strategy',
      'Limited visibility into task-level workforce disruption',
      'Cultural resistance to experimentation and learning',
      'Underinvestment in human–AI collaboration capabilities',
      'Lack of clear metrics for AI workforce readiness',
      'Skills gaps between current workforce and AI requirements',
    ],

    solutionTitle: 'How We Prepare Your Organization for AI Success',
    solutionDescription: 'We offer research-based diagnostics and strategic advisory services to assess culture, AI readiness, and workforce capabilities—and to design pathways for sustainable transformation. Our work bridges research, practice, and workforce foresight to support leaders navigating technological change.',
    approachPoints: [
      {
        title: 'Culture Before Technology',
        description: 'We assess learning climates, psychological safety, leadership behaviors, and change readiness before implementing AI solutions.',
        icon: '🎯',
      },
      {
        title: 'Workforce Readiness at the Task Level',
        description: 'We examine how AI reshapes work—not just jobs—across roles and functions to identify specific upskilling needs.',
        icon: '📊',
      },
      {
        title: 'Evidence-Based Strategy & Design',
        description: 'Our work is grounded in empirical research, not generic maturity models. We provide actionable insights tailored to your context.',
        icon: '🔬',
      },
    ],

    trustedByDescription: 'Trusted by educators, researchers, and workforce leaders working at the intersection of AI, skills, and organizational change.',

    services: [
      {
        tier: 1,
        name: 'Workforce & AI Readiness Snapshot',
        bestFor: 'Organizations seeking clarity',
        features: [
          'Rapid, research-based diagnostics',
          'Culture, AI, and workforce readiness scorecards',
          'Gap identification and risk mapping',
          'Executive summary with key findings',
        ],
        cta: 'Start with a Readiness Snapshot',
      },
      {
        tier: 2,
        name: 'Strategic Workforce & AI Alignment',
        bestFor: 'Organizations preparing to act',
        features: [
          'Deep role and task analysis',
          'Upskilling and transition strategy',
          '12–24 month workforce roadmap',
          'Stakeholder alignment workshops',
          'Change management framework',
        ],
        cta: 'Design a Strategic Roadmap',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'AI-Enabled Workforce Transformation Partnership',
        bestFor: 'Organizations committed to change',
        features: [
          'Full implementation support',
          'Leadership development programs',
          'Thought leadership collaboration',
          'Ongoing advisory and coaching',
          'Measurement and optimization',
        ],
        cta: 'Partner for Transformation',
      },
    ],

    stats: [
      { label: 'AI Jobs Available', value: '300K+', icon: '💼' },
      { label: 'Annual Growth Rate', value: '40%+', icon: '📈' },
      { label: 'Avg Salary Premium', value: '+30%', icon: '💰' },
      { label: 'Skills Gap', value: 'Millions', icon: '🎯' },
    ],

    keySkills: [
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'MLOps',
      'Data Engineering',
      'Python',
      'TensorFlow',
      'PyTorch',
      'Responsible AI',
    ],

    topEmployers: ['Google', 'OpenAI', 'Anthropic', 'Microsoft', 'Meta', 'NVIDIA', 'Amazon', 'IBM'],

    relatedIndustries: ['quantum-technologies', 'cybersecurity', 'robotics', 'healthcare'],
  },

  'quantum-technologies': {
    id: 'quantum-technologies',
    name: 'Quantum Technologies',
    shortName: 'Quantum',
    icon: '🔬',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-500',

    tagline: 'Preparing the Workforce for the Quantum Era',
    heroDescription: 'Quantum computing is poised to revolutionize industries from drug discovery to cryptography. We help organizations build the specialized workforce needed to lead in this emerging field.',

    problemTitle: 'The Quantum Talent Challenge',
    problemDescription: 'The quantum computing industry faces a unique workforce challenge: the technology requires an unprecedented combination of physics, mathematics, computer science, and engineering skills. Traditional hiring approaches cannot address this interdisciplinary talent gap.',
    challenges: [
      'Extremely limited pool of quantum-trained professionals',
      'Rapid technology evolution outpacing curriculum development',
      'High competition for PhD-level quantum researchers',
      'Difficulty translating quantum concepts into practical applications',
      'Lack of standardized quantum computing certifications',
      'Integration challenges between quantum and classical computing teams',
    ],

    solutionTitle: 'Building Your Quantum-Ready Team',
    solutionDescription: 'We partner with national laboratories, universities, and industry leaders to create comprehensive quantum workforce development programs that bridge the gap between academic research and commercial applications.',
    approachPoints: [
      {
        title: 'Interdisciplinary Talent Mapping',
        description: 'We identify candidates with transferable skills from physics, applied mathematics, and software engineering who can transition into quantum roles.',
        icon: '🎯',
      },
      {
        title: 'Custom Training Pathways',
        description: 'We design role-specific learning journeys that accelerate quantum literacy across your organization, from executives to engineers.',
        icon: '📚',
      },
      {
        title: 'Research Partnership Networks',
        description: 'We connect you with leading quantum research institutions for talent pipelines, internships, and collaborative development programs.',
        icon: '🤝',
      },
    ],

    trustedByDescription: 'Partnering with DOE national laboratories, leading universities, and pioneering quantum computing companies.',

    services: [
      {
        tier: 1,
        name: 'Quantum Workforce Assessment',
        bestFor: 'Organizations exploring quantum',
        features: [
          'Current capability baseline analysis',
          'Quantum use case identification',
          'Talent gap assessment',
          'Competitor benchmarking',
        ],
        cta: 'Assess Your Quantum Readiness',
      },
      {
        tier: 2,
        name: 'Quantum Talent Strategy',
        bestFor: 'Organizations building quantum teams',
        features: [
          'Role definition and competency frameworks',
          'University partnership strategy',
          'Internal upskilling program design',
          'Recruitment and retention planning',
          'Lab partnership facilitation',
        ],
        cta: 'Build Your Quantum Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Quantum Center of Excellence',
        bestFor: 'Organizations leading in quantum',
        features: [
          'Full quantum team buildout support',
          'Ongoing talent pipeline management',
          'Research collaboration facilitation',
          'Technology roadmap alignment',
          'Thought leadership development',
        ],
        cta: 'Launch Your Quantum CoE',
      },
    ],

    stats: [
      { label: 'Quantum Jobs', value: '12K+', icon: '💼' },
      { label: 'Growth Rate', value: '67%', icon: '📈' },
      { label: 'Median Salary', value: '$145K', icon: '💰' },
      { label: 'PhD Preferred', value: '60%', icon: '🎓' },
    ],

    keySkills: [
      'Quantum Mechanics',
      'Linear Algebra',
      'Quantum Algorithms',
      'Error Correction',
      'Qiskit',
      'Cirq',
      'Python',
      'Cryogenics',
      'Photonics',
      'Superconducting Systems',
    ],

    topEmployers: ['IBM', 'Google Quantum AI', 'IonQ', 'Rigetti', 'QuEra', 'Honeywell', 'D-Wave', 'AWS Braket'],

    relatedIndustries: ['artificial-intelligence', 'cybersecurity', 'semiconductor'],
  },

  'nuclear-energy': {
    id: 'nuclear-energy',
    name: 'Nuclear Energy',
    shortName: 'Nuclear',
    icon: '⚛️',
    color: '#22c55e',
    gradient: 'from-green-500 to-emerald-500',

    tagline: 'Powering the Clean Energy Transition',
    heroDescription: 'As nuclear energy experiences a renaissance driven by climate goals and energy security, we help organizations build the specialized workforce needed for next-generation nuclear technologies.',

    problemTitle: 'The Nuclear Workforce Crisis',
    problemDescription: 'The nuclear industry faces a dual challenge: an aging workforce approaching retirement and the need for new skills to support advanced reactor technologies. Without strategic intervention, critical knowledge and capabilities will be lost.',
    challenges: [
      'Aging workforce with 35% eligible for retirement within 5 years',
      'Lengthy security clearance and training requirements',
      'Public perception challenges affecting talent attraction',
      'Competition with other clean energy sectors for talent',
      'Limited pipeline from nuclear engineering programs',
      'New skill requirements for SMRs and advanced reactors',
    ],

    solutionTitle: 'Securing the Nuclear Workforce Pipeline',
    solutionDescription: 'We work with nuclear utilities, national laboratories, and regulatory bodies to develop comprehensive workforce strategies that ensure knowledge transfer, attract new talent, and prepare organizations for advanced nuclear technologies.',
    approachPoints: [
      {
        title: 'Knowledge Transfer Programs',
        description: 'We design structured mentorship and documentation programs to capture critical institutional knowledge before retirements.',
        icon: '📖',
      },
      {
        title: 'Security Clearance Pathways',
        description: 'We streamline Q and L clearance processes with pre-screening, pipeline development, and clearance tracking systems.',
        icon: '🔐',
      },
      {
        title: 'Next-Gen Reactor Readiness',
        description: 'We help organizations identify skill gaps and develop training programs for SMRs, molten salt, and fusion technologies.',
        icon: '⚡',
      },
    ],

    trustedByDescription: 'Working with DOE laboratories, nuclear utilities, and advanced reactor developers to build the workforce of tomorrow.',

    services: [
      {
        tier: 1,
        name: 'Nuclear Workforce Assessment',
        bestFor: 'Utilities and labs assessing gaps',
        features: [
          'Retirement risk analysis',
          'Skills inventory and gap assessment',
          'Clearance pipeline evaluation',
          'Workforce demographic analysis',
        ],
        cta: 'Assess Your Workforce Risk',
      },
      {
        tier: 2,
        name: 'Strategic Workforce Planning',
        bestFor: 'Organizations building pipelines',
        features: [
          'Multi-year workforce roadmap',
          'University partnership development',
          'Apprenticeship program design',
          'Knowledge transfer frameworks',
          'Diversity recruitment strategies',
        ],
        cta: 'Plan Your Workforce Future',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Nuclear Workforce Transformation',
        bestFor: 'Organizations deploying new tech',
        features: [
          'Advanced reactor workforce planning',
          'Full program implementation',
          'Regulatory compliance support',
          'Continuous optimization',
          'Industry collaboration facilitation',
        ],
        cta: 'Transform Your Workforce',
      },
    ],

    stats: [
      { label: 'Nuclear Jobs', value: '89K+', icon: '💼' },
      { label: 'Growth Rate', value: '15%', icon: '📈' },
      { label: 'Median Salary', value: '$105K', icon: '💰' },
      { label: 'Clearance Required', value: '80%', icon: '🔐' },
    ],

    keySkills: [
      'Nuclear Engineering',
      'Reactor Operations',
      'Radiation Protection',
      'NRC Regulations',
      'Quality Assurance',
      'Mechanical Engineering',
      'Instrumentation & Control',
      'Decommissioning',
      'Fusion Technology',
      'SMR Technology',
    ],

    topEmployers: ['DOE National Labs', 'Westinghouse', 'GE Hitachi', 'NuScale', 'TerraPower', 'X-energy', 'Constellation', 'Duke Energy'],

    relatedIndustries: ['clean-energy', 'advanced-manufacturing', 'aerospace'],
  },

  'biotechnology': {
    id: 'biotechnology',
    name: 'Biotechnology',
    shortName: 'Biotech',
    icon: '🧬',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-500',

    tagline: 'Advancing Life Sciences Through Talent',
    heroDescription: 'From gene therapy to personalized medicine, biotechnology is transforming healthcare. We help organizations build the interdisciplinary teams needed to drive breakthrough innovations.',

    problemTitle: 'The Biotech Talent Bottleneck',
    problemDescription: 'The biotechnology sector is experiencing explosive growth, but talent supply cannot keep pace with demand. Organizations struggle to find candidates who combine deep scientific expertise with the practical skills needed for commercialization.',
    challenges: [
      'Intense competition for PhD-level scientists',
      'Regulatory expertise shortages (FDA, EMA)',
      'Manufacturing scale-up talent gaps',
      'Data science integration with biology',
      'Clinical trial management expertise',
      'Cross-functional collaboration challenges',
    ],

    solutionTitle: 'Building World-Class Biotech Teams',
    solutionDescription: 'We partner with pharmaceutical companies, research institutions, and biotech startups to create talent strategies that span the full drug development lifecycle—from discovery to manufacturing to commercialization.',
    approachPoints: [
      {
        title: 'Scientific Talent Networks',
        description: 'We leverage deep connections in academia and industry to identify and attract top scientific talent with the right specializations.',
        icon: '🔬',
      },
      {
        title: 'Regulatory & Quality Pathways',
        description: 'We develop specialized training programs for GMP, FDA compliance, and quality systems that are critical for successful commercialization.',
        icon: '📋',
      },
      {
        title: 'Bioinformatics Integration',
        description: 'We help organizations build hybrid teams that combine computational biology, data science, and wet lab expertise.',
        icon: '💻',
      },
    ],

    trustedByDescription: 'Partnering with leading pharmaceutical companies, biotech startups, and research institutions to build the future of medicine.',

    services: [
      {
        tier: 1,
        name: 'Biotech Talent Assessment',
        bestFor: 'Growing biotech organizations',
        features: [
          'Current team capability mapping',
          'Competitive talent landscape analysis',
          'Skills gap identification',
          'Compensation benchmarking',
        ],
        cta: 'Assess Your Talent Needs',
      },
      {
        tier: 2,
        name: 'Strategic Talent Development',
        bestFor: 'Scaling biotech companies',
        features: [
          'Multi-year hiring roadmap',
          'University research partnerships',
          'Internal development programs',
          'Retention strategy design',
          'Diversity & inclusion initiatives',
        ],
        cta: 'Build Your Talent Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Biotech Workforce Excellence',
        bestFor: 'Enterprise biotech organizations',
        features: [
          'Full talent function optimization',
          'Leadership development programs',
          'Culture transformation support',
          'M&A integration expertise',
          'Global workforce planning',
        ],
        cta: 'Achieve Workforce Excellence',
      },
    ],

    stats: [
      { label: 'Biotech Jobs', value: '234K+', icon: '💼' },
      { label: 'Growth Rate', value: '28%', icon: '📈' },
      { label: 'Median Salary', value: '$95K', icon: '💰' },
      { label: 'PhD Roles', value: '35%', icon: '🎓' },
    ],

    keySkills: [
      'Molecular Biology',
      'CRISPR/Gene Editing',
      'Bioinformatics',
      'Cell Culture',
      'GMP Manufacturing',
      'FDA Regulations',
      'Clinical Trials',
      'Protein Engineering',
      'Immunology',
      'Biostatistics',
    ],

    topEmployers: ['Moderna', 'Genentech', 'Illumina', 'NIH', 'Amgen', 'Regeneron', 'Gilead', 'BioNTech'],

    relatedIndustries: ['healthcare', 'artificial-intelligence', 'advanced-manufacturing'],
  },

  'advanced-manufacturing': {
    id: 'advanced-manufacturing',
    name: 'Advanced Manufacturing',
    shortName: 'Manufacturing',
    icon: '🏭',
    color: '#64748b',
    gradient: 'from-slate-500 to-gray-600',

    tagline: 'Reshoring American Manufacturing Excellence',
    heroDescription: 'Advanced manufacturing is driving the reshoring revolution. We help organizations build the skilled workforce needed for smart factories, additive manufacturing, and Industry 4.0.',

    problemTitle: 'The Manufacturing Skills Crisis',
    problemDescription: 'American manufacturing is experiencing a renaissance, but a critical skills gap threatens growth. The sector faces a dual challenge: attracting young workers to manufacturing careers while rapidly upskilling existing workers for digital transformation.',
    challenges: [
      'Millions of manufacturing positions projected unfilled this decade',
      'Perception gap making it hard to attract young talent',
      'Rapid automation requiring constant upskilling',
      'Integration of IT and OT (operational technology) skills',
      'Supply chain disruption requiring new competencies',
      'Aging workforce with critical knowledge to transfer',
    ],

    solutionTitle: 'Building the Factory of the Future Workforce',
    solutionDescription: 'We partner with manufacturers, community colleges, and workforce boards to create comprehensive talent strategies that attract new workers, upskill existing teams, and prepare organizations for Industry 4.0.',
    approachPoints: [
      {
        title: 'Smart Manufacturing Training',
        description: 'We design training programs that blend traditional manufacturing skills with digital technologies like IoT, robotics, and data analytics.',
        icon: '🤖',
      },
      {
        title: 'Apprenticeship Development',
        description: 'We help organizations create registered apprenticeship programs that combine on-the-job training with classroom instruction.',
        icon: '🛠️',
      },
      {
        title: 'Industry 4.0 Readiness',
        description: 'We assess organizational readiness for smart manufacturing and develop workforce transformation roadmaps.',
        icon: '📊',
      },
    ],

    trustedByDescription: 'Working with manufacturers, trade associations, and workforce development organizations to rebuild American manufacturing.',

    services: [
      {
        tier: 1,
        name: 'Manufacturing Workforce Audit',
        bestFor: 'Manufacturers assessing gaps',
        features: [
          'Skills inventory analysis',
          'Automation impact assessment',
          'Retirement risk mapping',
          'Training needs identification',
        ],
        cta: 'Audit Your Workforce',
      },
      {
        tier: 2,
        name: 'Workforce Development Strategy',
        bestFor: 'Manufacturers ready to invest',
        features: [
          'Apprenticeship program design',
          'Community college partnerships',
          'Internal training academies',
          'Career pathway development',
          'Recruitment marketing strategy',
        ],
        cta: 'Develop Your Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Smart Factory Workforce Transformation',
        bestFor: 'Leaders in Industry 4.0',
        features: [
          'Full digital skills transformation',
          'Change management support',
          'Continuous improvement culture',
          'Technology vendor training integration',
          'Multi-site program rollout',
        ],
        cta: 'Transform Your Workforce',
      },
    ],

    stats: [
      { label: 'Mfg Jobs', value: '400K+', icon: '💼' },
      { label: 'Growth Rate', value: '10%+', icon: '📈' },
      { label: 'Median Salary', value: '$70K+', icon: '💰' },
      { label: 'Unfilled Roles', value: 'Millions', icon: '⚠️' },
    ],

    keySkills: [
      'CNC Machining',
      '3D Printing',
      'Robotics',
      'PLC Programming',
      'Lean Manufacturing',
      'Six Sigma',
      'Quality Control',
      'CAD/CAM',
      'Industrial IoT',
      'Supply Chain',
    ],

    topEmployers: ['GE', 'Siemens', 'Caterpillar', 'Honeywell', '3M', 'Tesla', 'Boeing', 'Intel'],

    relatedIndustries: ['robotics', 'semiconductor', 'aerospace'],
  },

  'cybersecurity': {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    shortName: 'Cyber',
    icon: '🛡️',
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-500',

    tagline: 'Defending the Digital Frontier',
    heroDescription: 'As cyber threats grow in sophistication, organizations need skilled defenders. We help build comprehensive cybersecurity teams that can protect critical infrastructure and sensitive data.',

    problemTitle: 'The Cybersecurity Talent Shortage',
    problemDescription: 'The cybersecurity industry faces a significant global talent shortage. Organizations struggle to find qualified candidates while threats continue to evolve at an unprecedented pace.',
    challenges: [
      'Millions of unfilled cybersecurity positions globally',
      'Rapid evolution of threat landscape',
      'Security clearance bottlenecks for government roles',
      'Burnout and retention challenges',
      'Difficulty measuring candidate capabilities',
      'Competition between public and private sectors',
    ],

    solutionTitle: 'Building Your Cyber Defense Team',
    solutionDescription: 'We partner with government agencies, critical infrastructure operators, and enterprises to develop comprehensive cybersecurity workforce strategies that attract, develop, and retain top security talent.',
    approachPoints: [
      {
        title: 'Skills-Based Assessment',
        description: 'We use practical, hands-on assessments that measure actual security capabilities rather than relying solely on certifications.',
        icon: '🎯',
      },
      {
        title: 'Clearance Pipeline Development',
        description: 'We help organizations build sustainable pipelines of clearance-eligible candidates for national security positions.',
        icon: '🔐',
      },
      {
        title: 'Retention & Career Growth',
        description: 'We design career progression frameworks and team structures that reduce burnout and improve retention.',
        icon: '📈',
      },
    ],

    trustedByDescription: 'Trusted by federal agencies, financial institutions, and critical infrastructure operators to build their security teams.',

    services: [
      {
        tier: 1,
        name: 'Cybersecurity Team Assessment',
        bestFor: 'Organizations evaluating gaps',
        features: [
          'Current capability assessment',
          'Threat-informed skill mapping',
          'Certification gap analysis',
          'Team structure review',
        ],
        cta: 'Assess Your Security Team',
      },
      {
        tier: 2,
        name: 'Cyber Workforce Strategy',
        bestFor: 'Organizations building teams',
        features: [
          'Role-specific hiring roadmaps',
          'Apprenticeship program design',
          'Retention strategy development',
          'Diversity recruitment initiatives',
          'University partnership development',
        ],
        cta: 'Build Your Cyber Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Security Operations Excellence',
        bestFor: 'Mature security organizations',
        features: [
          'SOC optimization and staffing',
          'Red/Blue team development',
          'Leadership development programs',
          '24/7 operations workforce planning',
          'Cross-training and succession planning',
        ],
        cta: 'Achieve Security Excellence',
      },
    ],

    stats: [
      { label: 'Cyber Jobs', value: '500K+', icon: '💼' },
      { label: 'Growth Rate', value: '30%+', icon: '📈' },
      { label: 'Median Salary', value: '$110K+', icon: '💰' },
      { label: 'Global Shortage', value: 'Millions', icon: '⚠️' },
    ],

    keySkills: [
      'Threat Detection',
      'Incident Response',
      'Penetration Testing',
      'SIEM/SOAR',
      'Cloud Security',
      'Network Security',
      'Cryptography',
      'Malware Analysis',
      'Zero Trust',
      'GRC',
    ],

    topEmployers: ['CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'NSA', 'CISA', 'Microsoft', 'Google', 'Amazon'],

    relatedIndustries: ['artificial-intelligence', 'quantum-technologies', 'aerospace'],
  },

  'aerospace': {
    id: 'aerospace',
    name: 'Aerospace & Defense',
    shortName: 'Aerospace',
    icon: '🚀',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-500',

    tagline: 'Reaching for the Stars',
    heroDescription: 'The new space race is driving unprecedented demand for aerospace talent. We help organizations build the workforce needed for next-generation aircraft, spacecraft, and defense systems.',

    problemTitle: 'The Aerospace Talent Challenge',
    problemDescription: 'The aerospace industry faces a perfect storm: an aging workforce, intense competition from the commercial space sector, and complex security requirements that limit the talent pool.',
    challenges: [
      'Competition between traditional aerospace and NewSpace companies',
      'Complex security clearance requirements',
      'Lengthy development cycles requiring specialized expertise',
      'Integration of software and hardware engineering',
      'Manufacturing workforce shortages',
      'ITAR compliance limiting international hiring',
    ],

    solutionTitle: 'Building Your Aerospace Dream Team',
    solutionDescription: 'We partner with aerospace primes, space startups, and defense contractors to develop workforce strategies that attract top talent while meeting stringent security and compliance requirements.',
    approachPoints: [
      {
        title: 'Clearance-Ready Pipelines',
        description: 'We develop sustainable pipelines of candidates pre-screened for security clearance eligibility, reducing time-to-productivity.',
        icon: '🔐',
      },
      {
        title: 'Software-Hardware Integration',
        description: 'We identify and develop talent that can bridge the gap between traditional aerospace engineering and modern software development.',
        icon: '💻',
      },
      {
        title: 'Manufacturing Excellence',
        description: 'We help build skilled manufacturing teams for advanced composites, precision machining, and spacecraft assembly.',
        icon: '🛠️',
      },
    ],

    trustedByDescription: 'Working with aerospace primes, commercial space companies, and the Department of Defense to build the future of flight.',

    services: [
      {
        tier: 1,
        name: 'Aerospace Workforce Assessment',
        bestFor: 'Organizations evaluating needs',
        features: [
          'Skills and clearance inventory',
          'Competitive talent analysis',
          'Retirement risk assessment',
          'ITAR compliance review',
        ],
        cta: 'Assess Your Workforce',
      },
      {
        tier: 2,
        name: 'Strategic Talent Development',
        bestFor: 'Organizations building capabilities',
        features: [
          'Clearance pipeline development',
          'University partnership strategy',
          'Internship program design',
          'Cross-training frameworks',
          'Retention strategy development',
        ],
        cta: 'Build Your Talent Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Aerospace Workforce Transformation',
        bestFor: 'Organizations scaling rapidly',
        features: [
          'Full talent acquisition support',
          'Manufacturing workforce buildout',
          'Leadership development',
          'M&A integration expertise',
          'Multi-site coordination',
        ],
        cta: 'Transform Your Workforce',
      },
    ],

    stats: [
      { label: 'Aerospace Jobs', value: '198K+', icon: '💼' },
      { label: 'Growth Rate', value: '18%', icon: '📈' },
      { label: 'Median Salary', value: '$98K', icon: '💰' },
      { label: 'Clearance Jobs', value: '65%', icon: '🔐' },
    ],

    keySkills: [
      'Systems Engineering',
      'Propulsion',
      'Avionics',
      'Composites',
      'Flight Software',
      'GNC',
      'Aerodynamics',
      'Mission Planning',
      'Space Systems',
      'RF Engineering',
    ],

    topEmployers: ['SpaceX', 'Boeing', 'Lockheed Martin', 'NASA', 'Blue Origin', 'Northrop Grumman', 'Raytheon', 'Rocket Lab'],

    relatedIndustries: ['advanced-manufacturing', 'cybersecurity', 'robotics'],
  },

  'robotics': {
    id: 'robotics',
    name: 'Robotics & Automation',
    shortName: 'Robotics',
    icon: '🦾',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-500',

    tagline: 'Automating the Future',
    heroDescription: 'Robotics is transforming industries from manufacturing to healthcare. We help organizations build the multidisciplinary teams needed to design, deploy, and maintain autonomous systems.',

    problemTitle: 'The Robotics Integration Challenge',
    problemDescription: 'Robotics requires a unique combination of mechanical engineering, electrical engineering, and software development skills. Finding candidates who can work across these domains—and integrate robots into existing operations—is exceptionally difficult.',
    challenges: [
      'Multidisciplinary skill requirements',
      'Rapid technology evolution',
      'Integration with existing workforce',
      'Safety and compliance expertise gaps',
      'AI/ML integration for autonomous systems',
      'Maintenance and operations workforce needs',
    ],

    solutionTitle: 'Building Your Robotics Team',
    solutionDescription: 'We help organizations build complete robotics capabilities—from R&D to deployment to maintenance—with workforce strategies tailored to their specific automation goals.',
    approachPoints: [
      {
        title: 'Cross-Functional Teams',
        description: 'We identify and develop talent that can bridge mechanical, electrical, and software disciplines for effective robot development.',
        icon: '🔧',
      },
      {
        title: 'Deployment & Integration',
        description: 'We build teams skilled in robot deployment, safety compliance, and integration with human workers.',
        icon: '⚙️',
      },
      {
        title: 'Maintenance Excellence',
        description: 'We develop training programs for robotics technicians who can maintain and troubleshoot complex automated systems.',
        icon: '🛠️',
      },
    ],

    trustedByDescription: 'Partnering with robotics companies, manufacturers, and logistics providers to build the automation workforce.',

    services: [
      {
        tier: 1,
        name: 'Robotics Workforce Assessment',
        bestFor: 'Organizations starting automation',
        features: [
          'Current skills inventory',
          'Automation readiness assessment',
          'Training needs analysis',
          'Vendor partnership review',
        ],
        cta: 'Assess Your Readiness',
      },
      {
        tier: 2,
        name: 'Automation Workforce Strategy',
        bestFor: 'Organizations scaling automation',
        features: [
          'Role design for automated operations',
          'Reskilling program development',
          'Technician training pathways',
          'Change management support',
          'University and vendor partnerships',
        ],
        cta: 'Build Your Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Robotics Excellence Program',
        bestFor: 'Automation leaders',
        features: [
          'End-to-end workforce transformation',
          'Center of excellence development',
          'Advanced training programs',
          'Innovation culture building',
          'Global program coordination',
        ],
        cta: 'Achieve Excellence',
      },
    ],

    stats: [
      { label: 'Robotics Jobs', value: '156K+', icon: '💼' },
      { label: 'Growth Rate', value: '35%', icon: '📈' },
      { label: 'Median Salary', value: '$95K', icon: '💰' },
      { label: 'Cross-Functional', value: '85%', icon: '🔄' },
    ],

    keySkills: [
      'ROS',
      'Motion Planning',
      'Computer Vision',
      'Sensor Fusion',
      'Control Systems',
      'Mechanical Design',
      'PLC Programming',
      'Embedded Systems',
      'Safety Standards',
      'System Integration',
    ],

    topEmployers: ['Boston Dynamics', 'ABB', 'FANUC', 'Tesla', 'Amazon Robotics', 'Intuitive Surgical', 'KUKA', 'Universal Robots'],

    relatedIndustries: ['advanced-manufacturing', 'artificial-intelligence', 'aerospace'],
  },

  'clean-energy': {
    id: 'clean-energy',
    name: 'Clean Energy',
    shortName: 'Clean Energy',
    icon: '🌱',
    color: '#84cc16',
    gradient: 'from-lime-500 to-green-500',

    tagline: 'Powering a Sustainable Future',
    heroDescription: 'The clean energy transition requires millions of new workers. We help organizations build the workforce needed for solar, wind, battery storage, hydrogen, and grid modernization.',

    problemTitle: 'The Clean Energy Workforce Gap',
    problemDescription: 'The Inflation Reduction Act and climate commitments have accelerated clean energy deployment, but the workforce cannot keep pace. The industry must scale from hundreds of thousands to millions of workers in less than a decade.',
    challenges: [
      'Rapid scaling requiring massive workforce growth',
      'Competition for electricians and skilled trades',
      'New technologies requiring new skills',
      'Geographic distribution challenges',
      'Diversity and inclusion gaps',
      'Safety and certification requirements',
    ],

    solutionTitle: 'Building the Clean Energy Workforce',
    solutionDescription: 'We partner with clean energy developers, utilities, and workforce boards to create scalable talent strategies that support the energy transition while ensuring good jobs for workers.',
    approachPoints: [
      {
        title: 'Skilled Trades Development',
        description: 'We help develop apprenticeship and training programs for electricians, wind technicians, solar installers, and battery technicians.',
        icon: '⚡',
      },
      {
        title: 'Regional Workforce Planning',
        description: 'We work with communities to align clean energy development with local workforce capacity and economic development goals.',
        icon: '🗺️',
      },
      {
        title: 'Transition Support',
        description: 'We design programs to help workers from fossil fuel industries transition to clean energy careers.',
        icon: '🔄',
      },
    ],

    trustedByDescription: 'Working with clean energy developers, utilities, and workforce development organizations to power the energy transition.',

    services: [
      {
        tier: 1,
        name: 'Clean Energy Workforce Assessment',
        bestFor: 'Developers and utilities',
        features: [
          'Project workforce requirements',
          'Local labor market analysis',
          'Training provider mapping',
          'Union engagement strategy',
        ],
        cta: 'Assess Your Needs',
      },
      {
        tier: 2,
        name: 'Regional Workforce Strategy',
        bestFor: 'Large-scale deployments',
        features: [
          'Multi-project workforce planning',
          'Training program development',
          'Community engagement strategy',
          'Diversity and inclusion programs',
          'Transition pathway design',
        ],
        cta: 'Build Your Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Energy Transition Partnership',
        bestFor: 'Industry leaders',
        features: [
          'Portfolio-wide workforce strategy',
          'Training center development',
          'Policy engagement support',
          'Research and thought leadership',
          'Industry coalition building',
        ],
        cta: 'Partner for Transition',
      },
    ],

    stats: [
      { label: 'Clean Energy Jobs', value: '178K+', icon: '💼' },
      { label: 'Growth Rate', value: '42%', icon: '📈' },
      { label: 'Median Salary', value: '$62K', icon: '💰' },
      { label: 'IRA Investment', value: '$370B', icon: '💵' },
    ],

    keySkills: [
      'Solar Installation',
      'Wind Turbine Tech',
      'Battery Storage',
      'Grid Integration',
      'Electrical Work',
      'Project Management',
      'NABCEP Certification',
      'Hydrogen Systems',
      'EV Infrastructure',
      'Energy Efficiency',
    ],

    topEmployers: ['Tesla Energy', 'NextEra', 'First Solar', 'Orsted', 'DOE', 'Sunrun', 'Vestas', 'Enphase'],

    relatedIndustries: ['nuclear-energy', 'advanced-manufacturing', 'semiconductor'],
  },

  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare & Medical Technology',
    shortName: 'Healthcare',
    icon: '🏥',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-cyan-500',

    tagline: 'Transforming Patient Care Through Technology & Innovation',
    heroDescription: 'From AI-powered diagnostics to life-saving medical devices, healthcare technology is revolutionizing how we prevent, diagnose, and treat disease. We help organizations build the specialized workforce needed to lead the digital health revolution.',

    problemTitle: 'The Healthcare Technology Talent Crisis',
    problemDescription: 'The healthcare industry is undergoing a digital transformation, but finding professionals who can bridge clinical expertise with technical innovation is exceptionally challenging. Organizations face mounting pressure to modernize while maintaining the highest standards of patient safety and regulatory compliance.',
    challenges: [
      'Severe shortage of professionals with both clinical and technical expertise',
      'Complex regulatory landscape (HIPAA, FDA 21 CFR Part 11, HITECH)',
      'EHR system specialists (Epic, Cerner) in extremely high demand',
      'Interoperability and data integration expertise gaps',
      'Medical device cybersecurity talent shortage',
      'Burnout and retention challenges in clinical informatics',
      'AI/ML implementation requiring healthcare domain knowledge',
      'Telehealth infrastructure and support scaling rapidly',
    ],

    solutionTitle: 'Building World-Class Healthcare Technology Teams',
    solutionDescription: 'We partner with health systems, medical device manufacturers, digital health startups, and pharmaceutical companies to develop workforce strategies that bridge clinical practice with cutting-edge technology innovation—while ensuring patient safety and regulatory compliance.',
    approachPoints: [
      {
        title: 'Clinical-Technical Integration',
        description: 'We identify and develop professionals who can translate between clinical and technical teams, ensuring technology truly serves patient outcomes and clinical workflows.',
        icon: '🏥',
      },
      {
        title: 'Regulatory & Compliance Excellence',
        description: 'We build teams with deep expertise in HIPAA, FDA regulations, clinical trial requirements, and healthcare data governance frameworks.',
        icon: '📋',
      },
      {
        title: 'Medical Device & Innovation',
        description: 'We develop capabilities in medical device engineering, AI diagnostics, precision medicine, and next-generation treatment technologies.',
        icon: '🔬',
      },
    ],

    trustedByDescription: 'Partnering with leading health systems, medical device companies, digital health innovators, and pharmaceutical organizations to transform patient care.',

    services: [
      {
        tier: 1,
        name: 'Healthcare Workforce Assessment',
        bestFor: 'Organizations evaluating their digital health readiness',
        features: [
          'Current clinical-technical capability mapping',
          'Technology roadmap workforce alignment',
          'Regulatory compliance workforce review',
          'Skills gap and risk analysis',
          'Competitive talent landscape assessment',
        ],
        cta: 'Assess Your Workforce',
      },
      {
        tier: 2,
        name: 'Healthcare Technology Talent Strategy',
        bestFor: 'Organizations building or scaling health tech teams',
        features: [
          'Role design and competency frameworks',
          'EHR and clinical systems training programs',
          'Medical device talent pipeline development',
          'Certification and credentialing pathways',
          'Retention and career progression strategies',
          'Regulatory compliance training programs',
        ],
        cta: 'Build Your Talent Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'Healthcare Digital Transformation Partnership',
        bestFor: 'Health systems and enterprises leading industry change',
        features: [
          'Enterprise-wide workforce transformation',
          'Clinical informatics center of excellence',
          'Innovation culture and capability building',
          'M&A and system integration workforce planning',
          'Thought leadership and industry collaboration',
          'Research partnership facilitation',
        ],
        cta: 'Partner for Transformation',
      },
    ],

    stats: [
      { label: 'Healthcare Tech Jobs', value: '892K+', icon: '💼' },
      { label: 'Annual Growth', value: '31%', icon: '📈' },
      { label: 'Median Salary', value: '$92K', icon: '💰' },
      { label: 'HIPAA Compliance Required', value: '90%', icon: '🔒' },
    ],

    keySkills: [
      'Clinical Informatics',
      'Epic Systems',
      'Cerner/Oracle Health',
      'HL7/FHIR Standards',
      'HIPAA Compliance',
      'Healthcare AI/ML',
      'Telemedicine Platforms',
      'Medical Device Engineering',
      'Population Health Analytics',
      'Revenue Cycle Management',
      'Clinical Data Management',
      'Biomedical Engineering',
    ],

    topEmployers: ['Mayo Clinic', 'Cleveland Clinic', 'Kaiser Permanente', 'Epic Systems', 'Cerner/Oracle Health', 'Philips Healthcare', 'Medtronic', 'Johnson & Johnson', 'Teladoc Health', 'UnitedHealth Group'],

    relatedIndustries: ['artificial-intelligence', 'biotechnology', 'cybersecurity', 'robotics'],
  },

  'semiconductor': {
    id: 'semiconductor',
    name: 'Semiconductor',
    shortName: 'Semiconductor',
    icon: '💻',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-500',

    tagline: 'Powering the CHIPS Revolution',
    heroDescription: 'The CHIPS Act is driving unprecedented investment in domestic semiconductor manufacturing. We help organizations build the workforce needed to design and manufacture the chips that power everything.',

    problemTitle: 'The Semiconductor Workforce Crisis',
    problemDescription: 'The semiconductor industry is racing to build new fabs in the US, but faces a severe talent shortage. The industry needs hundreds of thousands of new workers—from PhDs in semiconductor physics to technicians operating fab equipment—in a matter of years.',
    challenges: [
      'Need for tens of thousands of new workers this decade',
      'Limited domestic semiconductor manufacturing experience',
      'Competition with established Asian manufacturing hubs',
      'Cleanroom certification and training requirements',
      'PhD-level R&D talent in high demand',
      'Equipment maintenance expertise shortage',
    ],

    solutionTitle: 'Building the Chips Workforce',
    solutionDescription: 'We partner with semiconductor manufacturers, equipment suppliers, and workforce organizations to develop comprehensive talent strategies that support the reshoring of chip manufacturing.',
    approachPoints: [
      {
        title: 'Fab Workforce Development',
        description: 'We design training programs for fab operators, technicians, and engineers in partnership with community colleges and equipment vendors.',
        icon: '🏭',
      },
      {
        title: 'R&D Talent Pipelines',
        description: 'We connect companies with top PhD programs and help develop pathways for process engineering and device physics talent.',
        icon: '🔬',
      },
      {
        title: 'Regional Ecosystem Building',
        description: 'We work with communities hosting new fabs to align workforce development with industry needs and community goals.',
        icon: '🗺️',
      },
    ],

    trustedByDescription: 'Working with leading semiconductor manufacturers and the CHIPS for America initiative to build the domestic workforce.',

    services: [
      {
        tier: 1,
        name: 'Semiconductor Workforce Assessment',
        bestFor: 'New fab developments',
        features: [
          'Local labor market analysis',
          'Training infrastructure assessment',
          'Competitor workforce analysis',
          'Community readiness evaluation',
        ],
        cta: 'Assess Your Needs',
      },
      {
        tier: 2,
        name: 'Fab Workforce Strategy',
        bestFor: 'Active fab buildouts',
        features: [
          'Multi-year hiring roadmap',
          'Training program development',
          'Community college partnerships',
          'International talent strategy',
          'Retention program design',
        ],
        cta: 'Build Your Strategy',
        highlighted: true,
      },
      {
        tier: 3,
        name: 'CHIPS Workforce Excellence',
        bestFor: 'Multi-fab operations',
        features: [
          'Enterprise workforce strategy',
          'Training center of excellence',
          'Industry coalition participation',
          'Policy engagement support',
          'Global talent coordination',
        ],
        cta: 'Achieve Excellence',
      },
    ],

    stats: [
      { label: 'Semiconductor Jobs', value: '245K+', icon: '💼' },
      { label: 'Growth Rate', value: '23%', icon: '📈' },
      { label: 'Median Salary', value: '$105K', icon: '💰' },
      { label: 'CHIPS Investment', value: '$52B', icon: '💵' },
    ],

    keySkills: [
      'Semiconductor Physics',
      'Process Engineering',
      'Fab Operations',
      'Equipment Maintenance',
      'Cleanroom Protocol',
      'Lithography',
      'Etching',
      'Metrology',
      'Yield Engineering',
      'EDA Tools',
    ],

    topEmployers: ['Intel', 'AMD', 'NVIDIA', 'Texas Instruments', 'Micron', 'GlobalFoundries', 'TSMC', 'Samsung'],

    relatedIndustries: ['advanced-manufacturing', 'artificial-intelligence', 'quantum-technologies'],
  },
};

// Helper function to get all industries as an array
export const getIndustriesList = () => Object.values(INDUSTRIES_DATA);

// Helper function to get an industry by ID
export const getIndustryById = (id: string) => INDUSTRIES_DATA[id];
