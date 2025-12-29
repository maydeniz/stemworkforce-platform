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
    name: 'Nuclear Energy',
    icon: '⚛️',
    color: '#22c55e',
    jobsCount: 89000,
    growth: 15,
    description: 'Nuclear power generation, research reactors, and fusion technology',
    topEmployers: ['DOE National Labs', 'Westinghouse', 'GE Hitachi', 'NuScale'],
  },
  ai: {
    id: 'ai',
    name: 'Artificial Intelligence',
    icon: '🤖',
    color: '#8b5cf6',
    jobsCount: 312000,
    growth: 45,
    description: 'Machine learning, deep learning, NLP, and AI systems development',
    topEmployers: ['Google', 'OpenAI', 'Anthropic', 'Microsoft', 'Meta'],
  },
  quantum: {
    id: 'quantum',
    name: 'Quantum Computing',
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
    name: 'Aerospace & Space',
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
    name: 'Robotics',
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
};

export const INDUSTRY_LIST = Object.values(INDUSTRIES);

// US States with workforce data
export const STATES = [
  { id: 'CA', name: 'California', abbreviation: 'CA' },
  { id: 'TX', name: 'Texas', abbreviation: 'TX' },
  { id: 'NY', name: 'New York', abbreviation: 'NY' },
  { id: 'FL', name: 'Florida', abbreviation: 'FL' },
  { id: 'WA', name: 'Washington', abbreviation: 'WA' },
  { id: 'MA', name: 'Massachusetts', abbreviation: 'MA' },
  { id: 'VA', name: 'Virginia', abbreviation: 'VA' },
  { id: 'CO', name: 'Colorado', abbreviation: 'CO' },
  { id: 'GA', name: 'Georgia', abbreviation: 'GA' },
  { id: 'NC', name: 'North Carolina', abbreviation: 'NC' },
  { id: 'AZ', name: 'Arizona', abbreviation: 'AZ' },
  { id: 'PA', name: 'Pennsylvania', abbreviation: 'PA' },
  { id: 'IL', name: 'Illinois', abbreviation: 'IL' },
  { id: 'OH', name: 'Ohio', abbreviation: 'OH' },
  { id: 'MI', name: 'Michigan', abbreviation: 'MI' },
  { id: 'NM', name: 'New Mexico', abbreviation: 'NM' },
  { id: 'TN', name: 'Tennessee', abbreviation: 'TN' },
  { id: 'NV', name: 'Nevada', abbreviation: 'NV' },
] as const;

// Clearance levels
export const CLEARANCE_LEVELS = [
  { id: 'none', name: 'No Clearance Required', color: '#6b7280' },
  { id: 'public-trust', name: 'Public Trust', color: '#3b82f6' },
  { id: 'secret', name: 'Secret', color: '#f59e0b' },
  { id: 'top-secret', name: 'Top Secret', color: '#ef4444' },
  { id: 'top-secret-sci', name: 'TS/SCI', color: '#7c3aed' },
] as const;

// Job types
export const JOB_TYPES = [
  { id: 'internship', name: 'Internship', color: '#22c55e' },
  { id: 'full-time', name: 'Full-Time', color: '#3b82f6' },
  { id: 'part-time', name: 'Part-Time', color: '#8b5cf6' },
  { id: 'contract', name: 'Contract', color: '#f59e0b' },
  { id: 'fellowship', name: 'Fellowship', color: '#ec4899' },
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
] as const;

// Platform statistics
export const PLATFORM_STATS = {
  totalJobs: 1245000,
  activeEmployers: 8500,
  trainedProfessionals: 125000,
  placementRate: 87,
  statesCovered: 18,
  industryPartners: 450,
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
