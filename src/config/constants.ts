// ===========================================
// Application Constants
// ===========================================

import type { Industry, IndustryType } from '@/types';

// Industry definitions
export const INDUSTRIES: Record<IndustryType, Industry> = {
  semiconductor: {
    id: 'semiconductor',
    name: 'Semiconductor',
    icon: '💻',
    color: '#3b82f6',
    jobsCount: 245000,
    growth: 23,
    description: 'Design, manufacture, and testing of integrated circuits and microchips',
    topEmployers: ['Intel', 'AMD', 'NVIDIA', 'Texas Instruments', 'Micron'],
  },
  nuclear: {
    id: 'nuclear',
    name: 'Nuclear Technologies',
    icon: '⚛️',
    color: '#22c55e',
    jobsCount: 89000,
    growth: 15,
    description: 'Nuclear power generation, research reactors, and fusion technology',
    topEmployers: ['DOE National Labs', 'Westinghouse', 'GE Hitachi', 'NuScale'],
  },
  ai: {
    id: 'ai',
    name: 'AI & Machine Learning',
    icon: '🤖',
    color: '#8b5cf6',
    jobsCount: 312000,
    growth: 45,
    description: 'Machine learning, deep learning, NLP, and AI systems development',
    topEmployers: ['Google', 'OpenAI', 'Anthropic', 'Microsoft', 'Meta'],
  },
  quantum: {
    id: 'quantum',
    name: 'Quantum Technologies',
    icon: '🔬',
    color: '#ec4899',
    jobsCount: 12000,
    growth: 67,
    description: 'Quantum hardware, algorithms, error correction, and applications',
    topEmployers: ['IBM', 'Google', 'IonQ', 'Rigetti', 'QuEra'],
  },
  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🛡️',
    color: '#ef4444',
    jobsCount: 567000,
    growth: 32,
    description: 'Network security, threat detection, cryptography, and incident response',
    topEmployers: ['CrowdStrike', 'Palo Alto', 'Fortinet', 'NSA', 'CISA'],
  },
  aerospace: {
    id: 'aerospace',
    name: 'Aerospace & Defense',
    icon: '🚀',
    color: '#06b6d4',
    jobsCount: 198000,
    growth: 18,
    description: 'Aircraft, spacecraft, satellites, and defense systems',
    topEmployers: ['SpaceX', 'Boeing', 'Lockheed Martin', 'NASA', 'Blue Origin'],
  },
  biotech: {
    id: 'biotech',
    name: 'Biotechnology',
    icon: '🧬',
    color: '#10b981',
    jobsCount: 234000,
    growth: 28,
    description: 'Pharmaceuticals, gene therapy, medical devices, and bioinformatics',
    topEmployers: ['Moderna', 'Genentech', 'Illumina', 'NIH', 'Amgen'],
  },
  robotics: {
    id: 'robotics',
    name: 'Robotics & Automation',
    icon: '🦾',
    color: '#f59e0b',
    jobsCount: 156000,
    growth: 35,
    description: 'Industrial robotics, autonomous systems, drones, and automation',
    topEmployers: ['Boston Dynamics', 'ABB', 'FANUC', 'Tesla', 'Amazon Robotics'],
  },
  'clean-energy': {
    id: 'clean-energy',
    name: 'Clean Energy',
    icon: '🌱',
    color: '#84cc16',
    jobsCount: 178000,
    growth: 42,
    description: 'Solar, wind, battery storage, hydrogen, and grid modernization',
    topEmployers: ['Tesla Energy', 'NextEra', 'First Solar', 'Ørsted', 'DOE'],
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Advanced Manufacturing',
    icon: '🏭',
    color: '#64748b',
    jobsCount: 423000,
    growth: 12,
    description: '3D printing, smart factories, advanced materials, and supply chain',
    topEmployers: ['GE', 'Siemens', 'Caterpillar', 'Honeywell', '3M'],
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Medical Technology',
    icon: '🏥',
    color: '#14b8a6',
    jobsCount: 892000,
    growth: 31,
    description: 'Medical devices, health informatics, telemedicine, clinical research, and healthcare AI',
    topEmployers: ['Mayo Clinic', 'Cleveland Clinic', 'Kaiser Permanente', 'UnitedHealth', 'Epic Systems'],
  },
};

export const INDUSTRY_LIST = Object.values(INDUSTRIES);

// US States with workforce data - All 50 states
export const STATES = [
  { id: 'AL', name: 'Alabama', abbreviation: 'AL' },
  { id: 'AK', name: 'Alaska', abbreviation: 'AK' },
  { id: 'AZ', name: 'Arizona', abbreviation: 'AZ' },
  { id: 'AR', name: 'Arkansas', abbreviation: 'AR' },
  { id: 'CA', name: 'California', abbreviation: 'CA' },
  { id: 'CO', name: 'Colorado', abbreviation: 'CO' },
  { id: 'CT', name: 'Connecticut', abbreviation: 'CT' },
  { id: 'DE', name: 'Delaware', abbreviation: 'DE' },
  { id: 'FL', name: 'Florida', abbreviation: 'FL' },
  { id: 'GA', name: 'Georgia', abbreviation: 'GA' },
  { id: 'HI', name: 'Hawaii', abbreviation: 'HI' },
  { id: 'ID', name: 'Idaho', abbreviation: 'ID' },
  { id: 'IL', name: 'Illinois', abbreviation: 'IL' },
  { id: 'IN', name: 'Indiana', abbreviation: 'IN' },
  { id: 'IA', name: 'Iowa', abbreviation: 'IA' },
  { id: 'KS', name: 'Kansas', abbreviation: 'KS' },
  { id: 'KY', name: 'Kentucky', abbreviation: 'KY' },
  { id: 'LA', name: 'Louisiana', abbreviation: 'LA' },
  { id: 'ME', name: 'Maine', abbreviation: 'ME' },
  { id: 'MD', name: 'Maryland', abbreviation: 'MD' },
  { id: 'MA', name: 'Massachusetts', abbreviation: 'MA' },
  { id: 'MI', name: 'Michigan', abbreviation: 'MI' },
  { id: 'MN', name: 'Minnesota', abbreviation: 'MN' },
  { id: 'MS', name: 'Mississippi', abbreviation: 'MS' },
  { id: 'MO', name: 'Missouri', abbreviation: 'MO' },
  { id: 'MT', name: 'Montana', abbreviation: 'MT' },
  { id: 'NE', name: 'Nebraska', abbreviation: 'NE' },
  { id: 'NV', name: 'Nevada', abbreviation: 'NV' },
  { id: 'NH', name: 'New Hampshire', abbreviation: 'NH' },
  { id: 'NJ', name: 'New Jersey', abbreviation: 'NJ' },
  { id: 'NM', name: 'New Mexico', abbreviation: 'NM' },
  { id: 'NY', name: 'New York', abbreviation: 'NY' },
  { id: 'NC', name: 'North Carolina', abbreviation: 'NC' },
  { id: 'ND', name: 'North Dakota', abbreviation: 'ND' },
  { id: 'OH', name: 'Ohio', abbreviation: 'OH' },
  { id: 'OK', name: 'Oklahoma', abbreviation: 'OK' },
  { id: 'OR', name: 'Oregon', abbreviation: 'OR' },
  { id: 'PA', name: 'Pennsylvania', abbreviation: 'PA' },
  { id: 'RI', name: 'Rhode Island', abbreviation: 'RI' },
  { id: 'SC', name: 'South Carolina', abbreviation: 'SC' },
  { id: 'SD', name: 'South Dakota', abbreviation: 'SD' },
  { id: 'TN', name: 'Tennessee', abbreviation: 'TN' },
  { id: 'TX', name: 'Texas', abbreviation: 'TX' },
  { id: 'UT', name: 'Utah', abbreviation: 'UT' },
  { id: 'VT', name: 'Vermont', abbreviation: 'VT' },
  { id: 'VA', name: 'Virginia', abbreviation: 'VA' },
  { id: 'WA', name: 'Washington', abbreviation: 'WA' },
  { id: 'WV', name: 'West Virginia', abbreviation: 'WV' },
  { id: 'WI', name: 'Wisconsin', abbreviation: 'WI' },
  { id: 'WY', name: 'Wyoming', abbreviation: 'WY' },
] as const;

// Clearance levels
export const CLEARANCE_LEVELS = [
  { id: 'none', name: 'No Clearance Required', color: '#6b7280' },
  { id: 'public-trust', name: 'Public Trust', color: '#10B981' },
  { id: 'secret', name: 'Secret', color: '#3B82F6' },
  { id: 'top-secret', name: 'Top Secret', color: '#8B5CF6' },
  { id: 'top-secret-sci', name: 'TS/SCI', color: '#EC4899' },
  { id: 'doe-l', name: 'DOE L Clearance', color: '#F59E0B' },
  { id: 'doe-q', name: 'DOE Q Clearance', color: '#EF4444' },
  { id: 'doe-q-sci', name: 'DOE Q/SCI', color: '#DC2626' },
] as const;

// Clearance Readiness Navigation
export const CLEARANCE_READINESS_ROUTES = {
  assessment: '/clearance-readiness',
  intelligence: '/clearance-intelligence',
  guide: '/clearance-guide',
  nispom: '/nispom-compliance',
  services: '/services/clearance',
} as const;

// Healthcare Compliance Levels
export const HEALTHCARE_COMPLIANCE_LEVELS = [
  { id: 'none', name: 'No Compliance Required', color: '#6b7280' },
  { id: 'hipaa-basic', name: 'HIPAA Basic Training', color: '#14b8a6' },
  { id: 'hipaa-certified', name: 'HIPAA Certified', color: '#22c55e' },
  { id: 'phi-access', name: 'PHI Access Authorized', color: '#3b82f6' },
  { id: 'clinical-privileged', name: 'Clinical Privileges Required', color: '#f59e0b' },
  { id: 'dea-registered', name: 'DEA Registration Required', color: '#ef4444' },
] as const;

// Healthcare Certifications
export const HEALTHCARE_CERTIFICATIONS = [
  { id: 'rhit', name: 'RHIT - Registered Health Information Technician', category: 'HIM' },
  { id: 'rhia', name: 'RHIA - Registered Health Information Administrator', category: 'HIM' },
  { id: 'cpc', name: 'CPC - Certified Professional Coder', category: 'Coding' },
  { id: 'ccs', name: 'CCS - Certified Coding Specialist', category: 'Coding' },
  { id: 'chda', name: 'CHDA - Certified Health Data Analyst', category: 'Analytics' },
  { id: 'cahims', name: 'CAHIMS - Certified Associate in Healthcare Information', category: 'IT' },
  { id: 'cphims', name: 'CPHIMS - Certified Professional in Healthcare Information', category: 'IT' },
  { id: 'epic-certified', name: 'Epic Certification', category: 'EHR' },
  { id: 'cerner-certified', name: 'Cerner Certification', category: 'EHR' },
  { id: 'pmp-healthcare', name: 'PMP - Healthcare Focus', category: 'Management' },
  { id: 'six-sigma-healthcare', name: 'Six Sigma Healthcare', category: 'Quality' },
  { id: 'ccrc', name: 'CCRC - Certified Clinical Research Coordinator', category: 'Research' },
  { id: 'ccrp', name: 'CCRP - Certified Clinical Research Professional', category: 'Research' },
] as const;

// Job types
export const JOB_TYPES = [
  { id: 'internship', name: 'Internship', color: '#22c55e' },
  { id: 'full-time', name: 'Full-Time', color: '#3b82f6' },
  { id: 'part-time', name: 'Part-Time', color: '#8b5cf6' },
  { id: 'contract', name: 'Contract', color: '#f59e0b' },
  { id: 'fellowship', name: 'Fellowship', color: '#ec4899' },
  { id: 'residency', name: 'Residency/Clinical Rotation', color: '#14b8a6' },
  { id: 'travel', name: 'Travel/Locum', color: '#06b6d4' },
] as const;

// Healthcare Job Categories
export const HEALTHCARE_JOB_CATEGORIES = [
  { id: 'health-it', name: 'Health Information Technology', icon: '💻' },
  { id: 'clinical-informatics', name: 'Clinical Informatics', icon: '📊' },
  { id: 'medical-devices', name: 'Medical Devices', icon: '🔬' },
  { id: 'healthcare-analytics', name: 'Healthcare Analytics', icon: '📈' },
  { id: 'telemedicine', name: 'Telemedicine/Telehealth', icon: '📱' },
  { id: 'clinical-research', name: 'Clinical Research', icon: '🧪' },
  { id: 'revenue-cycle', name: 'Revenue Cycle Management', icon: '💰' },
  { id: 'population-health', name: 'Population Health', icon: '👥' },
  { id: 'healthcare-ai', name: 'Healthcare AI/ML', icon: '🤖' },
  { id: 'biomedical-engineering', name: 'Biomedical Engineering', icon: '⚙️' },
  { id: 'health-administration', name: 'Healthcare Administration', icon: '🏥' },
  { id: 'pharmacy-tech', name: 'Pharmacy Technology', icon: '💊' },
] as const;

// Event types
export const EVENT_TYPES = [
  { id: 'conference', name: 'Conference', icon: '🎤' },
  { id: 'job-fair', name: 'Job Fair', icon: '💼' },
  { id: 'networking', name: 'Networking', icon: '🤝' },
  { id: 'workshop', name: 'Workshop', icon: '🛠️' },
  { id: 'webinar', name: 'Webinar', icon: '💻' },
  { id: 'hackathon', name: 'Hackathon', icon: '🏆' },
] as const;

// Training formats
export const TRAINING_FORMATS = [
  { id: 'online', name: 'Online', icon: '🌐' },
  { id: 'in-person', name: 'In-Person', icon: '🏫' },
  { id: 'hybrid', name: 'Hybrid', icon: '🔀' },
  { id: 'self-paced', name: 'Self-Paced', icon: '⏱️' },
] as const;

// Skill levels
export const SKILL_LEVELS = [
  { id: 'beginner', name: 'Beginner', color: '#22c55e' },
  { id: 'intermediate', name: 'Intermediate', color: '#3b82f6' },
  { id: 'advanced', name: 'Advanced', color: '#f59e0b' },
  { id: 'expert', name: 'Expert', color: '#ef4444' },
] as const;

// Partner types
export const PARTNER_TYPES = [
  { id: 'industry', name: 'Private Industry', icon: '🏢', color: '#3b82f6' },
  { id: 'government', name: 'Federal Government', icon: '🏛️', color: '#22c55e' },
  { id: 'national-lab', name: 'National Laboratory', icon: '🔬', color: '#8b5cf6' },
  { id: 'academia', name: 'Academia', icon: '🎓', color: '#f59e0b' },
  { id: 'nonprofit', name: 'Nonprofit', icon: '💚', color: '#10b981' },
  { id: 'healthcare', name: 'Healthcare System', icon: '🏥', color: '#14b8a6' },
] as const;

// Platform statistics
export const PLATFORM_STATS = {
  totalJobs: 2137000,
  activeEmployers: 12500,
  trainedProfessionals: 185000,
  placementRate: 87,
  statesCovered: 50,
  industryPartners: 650,
  healthcareJobs: 892000,
  healthcarePartners: 180,
} as const;

// Navigation items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'intern-hub', label: 'Jobs & Internships', path: '/jobs' },
  { id: 'workforce-map', label: 'Workforce Map', path: '/map' },
  { id: 'events', label: 'Events', path: '/events' },
  { id: 'training-portal', label: 'Training', path: '/training' },
  { id: 'partners', label: 'For Partners', path: '/partners' },
] as const;

// Footer links
export const FOOTER_LINKS = {
  platform: [
    { label: 'About Us', path: '/about' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'Contact', path: '/contact' },
  ],
  resources: [
    { label: 'Documentation', path: '/docs' },
    { label: 'API Reference', path: '/api' },
    { label: 'Help Center', path: '/help' },
    { label: 'Blog', path: '/blog' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'Accessibility', path: '/accessibility' },
  ],
} as const;
