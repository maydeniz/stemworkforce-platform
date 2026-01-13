// ===========================================
// Training Programs Data
// ===========================================
// Unified data source for training programs
// Used by TrainingPage and WorkforceMapPage
// ===========================================

import { industryAIMetrics } from './aiMetrics';

export interface TrainingProgram {
  id: string;
  name: string;
  provider: string;
  type: 'University' | 'Community College' | 'Employer Training' | 'Medical School' | 'Bootcamp' | 'Certification';
  duration: string;
  cost: string;
  costNumeric: number; // For filtering (0 = free)
  placement: number; // Placement rate percentage
  industry: string;
  industries: string[]; // For multi-industry filtering
  state: string;
  stateCode: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  format: 'online' | 'in_person' | 'hybrid' | 'self_paced';
  skills: string[];
  description: string;
  featured: boolean;
  rating: number;
  reviewsCount: number;
}

// Extended interface with AI metrics (computed at runtime)
export interface TrainingProgramWithAI extends TrainingProgram {
  aiExposureIndex: number; // 0-100: How much AI impacts this field
  aiOpportunityIndex: number; // 0-100: Career growth potential in AI economy
  aiReadinessScore: number; // How well this program prepares for AI economy
  recommendedAISkills: string[];
}

// Generate unique ID
let idCounter = 1;
const generateId = (): string => `tp-${String(idCounter++).padStart(4, '0')}`;

// ===========================================
// Training Programs by State and Industry
// ===========================================

export const trainingPrograms: TrainingProgram[] = [
  // =====================
  // NUCLEAR ENERGY STATES
  // =====================

  // Ohio - Nuclear Energy
  {
    id: generateId(),
    name: 'Ohio State Nuclear Engineering',
    provider: 'Ohio State University',
    type: 'University',
    duration: '4 years',
    cost: '$45,000',
    costNumeric: 45000,
    placement: 94,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'Ohio',
    stateCode: 'OH',
    level: 'advanced',
    format: 'in_person',
    skills: ['Reactor Operations', 'Nuclear Safety', 'Health Physics', 'Instrumentation'],
    description: 'Comprehensive nuclear engineering program with hands-on reactor experience and industry partnerships with Davis-Besse and Perry Nuclear plants.',
    featured: true,
    rating: 4.7,
    reviewsCount: 234,
  },
  {
    id: generateId(),
    name: 'Nuclear Technology Program',
    provider: 'Lakeland Community College',
    type: 'Community College',
    duration: '2 years',
    cost: '$8,000',
    costNumeric: 8000,
    placement: 89,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'Ohio',
    stateCode: 'OH',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Radiation Protection', 'I&C Systems', 'Nuclear Safety', 'Quality Assurance'],
    description: 'Associate degree program preparing students for technician roles in nuclear power plants with focus on instrumentation and control.',
    featured: false,
    rating: 4.4,
    reviewsCount: 156,
  },

  // Idaho - Nuclear Energy
  {
    id: generateId(),
    name: 'Nuclear Engineering Program',
    provider: 'Idaho State University',
    type: 'University',
    duration: '4 years',
    cost: '$28,000',
    costNumeric: 28000,
    placement: 95,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'Idaho',
    stateCode: 'ID',
    level: 'advanced',
    format: 'in_person',
    skills: ['Reactor Operations', 'Nuclear Safety', 'Health Physics', 'Research Methods'],
    description: 'Strong partnership with Idaho National Laboratory providing unique research opportunities and direct pathways to national lab employment.',
    featured: true,
    rating: 4.8,
    reviewsCount: 189,
  },
  {
    id: generateId(),
    name: 'INL Workforce Development Program',
    provider: 'Idaho National Laboratory',
    type: 'Employer Training',
    duration: '12 weeks',
    cost: 'FREE',
    costNumeric: 0,
    placement: 98,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'Idaho',
    stateCode: 'ID',
    level: 'beginner',
    format: 'in_person',
    skills: ['Lab Safety', 'Radiation Monitoring', 'Research Techniques', 'Quality Control'],
    description: 'Paid training program with guaranteed job placement at Idaho National Laboratory. Perfect for career changers.',
    featured: true,
    rating: 4.9,
    reviewsCount: 312,
  },

  // New Mexico - Nuclear Energy
  {
    id: generateId(),
    name: 'Nuclear Engineering',
    provider: 'University of New Mexico',
    type: 'University',
    duration: '4 years',
    cost: '$32,000',
    costNumeric: 32000,
    placement: 96,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'New Mexico',
    stateCode: 'NM',
    level: 'advanced',
    format: 'in_person',
    skills: ['Nuclear Physics', 'Weapons Systems', 'Radiation Safety', 'Research'],
    description: 'Top-ranked program with close ties to Los Alamos and Sandia National Laboratories. Security clearance pathways available.',
    featured: true,
    rating: 4.8,
    reviewsCount: 267,
  },
  {
    id: generateId(),
    name: 'LANL Technician Training Program',
    provider: 'Los Alamos National Laboratory',
    type: 'Employer Training',
    duration: '16 weeks',
    cost: 'FREE',
    costNumeric: 0,
    placement: 97,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'New Mexico',
    stateCode: 'NM',
    level: 'beginner',
    format: 'in_person',
    skills: ['Lab Techniques', 'Security Protocols', 'Nuclear Safety', 'Quality Assurance'],
    description: 'Intensive training program for aspiring technicians at one of the world\'s premier research laboratories. Q clearance support provided.',
    featured: true,
    rating: 4.9,
    reviewsCount: 198,
  },

  // Tennessee - Nuclear Energy
  {
    id: generateId(),
    name: 'Nuclear Engineering',
    provider: 'UT Knoxville',
    type: 'University',
    duration: '4 years',
    cost: '$35,000',
    costNumeric: 35000,
    placement: 93,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'Tennessee',
    stateCode: 'TN',
    level: 'advanced',
    format: 'in_person',
    skills: ['Reactor Operations', 'Nuclear Safety', 'Research', 'Enrichment'],
    description: 'Strong connections to Oak Ridge National Laboratory and TVA Nuclear facilities for internships and employment.',
    featured: true,
    rating: 4.6,
    reviewsCount: 245,
  },
  {
    id: generateId(),
    name: 'Nuclear Technology',
    provider: 'Roane State Community College',
    type: 'Community College',
    duration: '2 years',
    cost: '$9,500',
    costNumeric: 9500,
    placement: 88,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'Tennessee',
    stateCode: 'TN',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['I&C Systems', 'Chemistry', 'Radiation Protection', 'Maintenance'],
    description: 'Affordable pathway to nuclear technician careers with connections to regional power plants and national labs.',
    featured: false,
    rating: 4.3,
    reviewsCount: 134,
  },
  {
    id: generateId(),
    name: 'TVA Nuclear Training Program',
    provider: 'Tennessee Valley Authority',
    type: 'Employer Training',
    duration: '24 weeks',
    cost: 'FREE',
    costNumeric: 0,
    placement: 96,
    industry: 'Nuclear Energy',
    industries: ['nuclear'],
    state: 'Tennessee',
    stateCode: 'TN',
    level: 'beginner',
    format: 'in_person',
    skills: ['Plant Operations', 'Safety Protocols', 'Equipment Maintenance', 'NRC Requirements'],
    description: 'Comprehensive paid training program leading to operator positions at TVA nuclear facilities.',
    featured: true,
    rating: 4.8,
    reviewsCount: 276,
  },

  // =====================
  // SEMICONDUCTOR STATES
  // =====================

  // California - Semiconductor
  {
    id: generateId(),
    name: 'Electrical Engineering',
    provider: 'Stanford University',
    type: 'University',
    duration: '4 years',
    cost: '$58,000',
    costNumeric: 58000,
    placement: 98,
    industry: 'Semiconductor',
    industries: ['semiconductor', 'ai'],
    state: 'California',
    stateCode: 'CA',
    level: 'expert',
    format: 'in_person',
    skills: ['Semiconductor Fab', 'AI/ML', 'Chip Design', 'VLSI'],
    description: 'World-renowned engineering program in the heart of Silicon Valley with unparalleled industry connections.',
    featured: true,
    rating: 4.9,
    reviewsCount: 567,
  },
  {
    id: generateId(),
    name: 'EECS Program',
    provider: 'UC Berkeley',
    type: 'University',
    duration: '4 years',
    cost: '$45,000',
    costNumeric: 45000,
    placement: 97,
    industry: 'Semiconductor',
    industries: ['semiconductor', 'ai'],
    state: 'California',
    stateCode: 'CA',
    level: 'advanced',
    format: 'in_person',
    skills: ['Semiconductor Fab', 'Computer Architecture', 'VLSI Design', 'Robotics'],
    description: 'Top-tier electrical engineering and computer science program with cutting-edge research facilities.',
    featured: true,
    rating: 4.9,
    reviewsCount: 489,
  },
  {
    id: generateId(),
    name: 'Semiconductor Manufacturing',
    provider: 'San Jose State University',
    type: 'University',
    duration: '4 years',
    cost: '$28,000',
    costNumeric: 28000,
    placement: 92,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'California',
    stateCode: 'CA',
    level: 'advanced',
    format: 'in_person',
    skills: ['Clean Room Operations', 'Process Engineering', 'Quality Control', 'Equipment Maintenance'],
    description: 'Industry-focused program with strong ties to local semiconductor companies and affordable tuition.',
    featured: false,
    rating: 4.5,
    reviewsCount: 312,
  },

  // Texas - Semiconductor
  {
    id: generateId(),
    name: 'Electrical and Computer Engineering',
    provider: 'UT Austin',
    type: 'University',
    duration: '4 years',
    cost: '$42,000',
    costNumeric: 42000,
    placement: 95,
    industry: 'Semiconductor',
    industries: ['semiconductor', 'ai'],
    state: 'Texas',
    stateCode: 'TX',
    level: 'advanced',
    format: 'in_person',
    skills: ['Semiconductor Fab', 'Chip Design', 'Embedded Systems', 'Signal Processing'],
    description: 'Top-ranked engineering program with strong industry partnerships including Samsung and Texas Instruments.',
    featured: true,
    rating: 4.8,
    reviewsCount: 423,
  },
  {
    id: generateId(),
    name: 'Engineering Program',
    provider: 'Texas A&M University',
    type: 'University',
    duration: '4 years',
    cost: '$38,000',
    costNumeric: 38000,
    placement: 94,
    industry: 'Semiconductor',
    industries: ['semiconductor', 'aerospace'],
    state: 'Texas',
    stateCode: 'TX',
    level: 'advanced',
    format: 'in_person',
    skills: ['Manufacturing', 'Process Engineering', 'Quality Systems', 'Project Management'],
    description: 'Comprehensive engineering program with extensive co-op opportunities and industry connections.',
    featured: true,
    rating: 4.7,
    reviewsCount: 398,
  },
  {
    id: generateId(),
    name: 'Semiconductor Technology',
    provider: 'Austin Community College',
    type: 'Community College',
    duration: '2 years',
    cost: '$8,500',
    costNumeric: 8500,
    placement: 88,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'Texas',
    stateCode: 'TX',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Clean Room Operations', 'Process Control', 'Equipment Maintenance', 'Safety Protocols'],
    description: 'Affordable pathway to semiconductor manufacturing careers with local industry partnerships.',
    featured: false,
    rating: 4.4,
    reviewsCount: 187,
  },

  // Arizona - Semiconductor
  {
    id: generateId(),
    name: 'Electrical Engineering',
    provider: 'Arizona State University',
    type: 'University',
    duration: '4 years',
    cost: '$32,000',
    costNumeric: 32000,
    placement: 94,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'Arizona',
    stateCode: 'AZ',
    level: 'advanced',
    format: 'in_person',
    skills: ['Semiconductor Fab', 'Clean Room', 'Quality Control', 'Process Integration'],
    description: 'Growing program with strong connections to TSMC Arizona and Intel Chandler facilities.',
    featured: true,
    rating: 4.6,
    reviewsCount: 345,
  },
  {
    id: generateId(),
    name: 'Semiconductor Manufacturing Technology',
    provider: 'Maricopa Community Colleges',
    type: 'Community College',
    duration: '18 months',
    cost: '$6,500',
    costNumeric: 6500,
    placement: 91,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'Arizona',
    stateCode: 'AZ',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Fab Operations', 'Process Control', 'Equipment Handling', 'Quality Assurance'],
    description: 'Fast-track program designed in partnership with local semiconductor manufacturers.',
    featured: true,
    rating: 4.5,
    reviewsCount: 234,
  },
  {
    id: generateId(),
    name: 'TSMC Training Academy',
    provider: 'TSMC Arizona',
    type: 'Employer Training',
    duration: '12 weeks',
    cost: 'FREE',
    costNumeric: 0,
    placement: 99,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'Arizona',
    stateCode: 'AZ',
    level: 'beginner',
    format: 'in_person',
    skills: ['Advanced Node Manufacturing', 'Clean Room Protocols', 'Process Control', 'Safety'],
    description: 'World-class training at TSMC\'s new Arizona fab. Paid training with guaranteed employment.',
    featured: true,
    rating: 5.0,
    reviewsCount: 156,
  },

  // Oregon - Semiconductor
  {
    id: generateId(),
    name: 'Engineering Program',
    provider: 'Oregon State University',
    type: 'University',
    duration: '4 years',
    cost: '$35,000',
    costNumeric: 35000,
    placement: 93,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'Oregon',
    stateCode: 'OR',
    level: 'advanced',
    format: 'in_person',
    skills: ['Chip Design', 'Testing', 'Manufacturing', 'R&D'],
    description: 'Strong engineering program with connections to Intel Hillsboro and other Portland-area semiconductor companies.',
    featured: true,
    rating: 4.6,
    reviewsCount: 278,
  },
  {
    id: generateId(),
    name: 'Semiconductor Technology',
    provider: 'Portland Community College',
    type: 'Community College',
    duration: '2 years',
    cost: '$7,500',
    costNumeric: 7500,
    placement: 89,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'Oregon',
    stateCode: 'OR',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Process Operations', 'Testing', 'Equipment Maintenance', 'Quality Control'],
    description: 'Affordable pathway to semiconductor careers in the Portland metro area.',
    featured: false,
    rating: 4.3,
    reviewsCount: 145,
  },

  // New York - Semiconductor
  {
    id: generateId(),
    name: 'Nanotechnology Engineering',
    provider: 'Rensselaer Polytechnic Institute',
    type: 'University',
    duration: '4 years',
    cost: '$58,000',
    costNumeric: 58000,
    placement: 96,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'New York',
    stateCode: 'NY',
    level: 'expert',
    format: 'in_person',
    skills: ['Nanofabrication', 'Lithography', 'Process Integration', 'Yield Analysis'],
    description: 'Premier nanotechnology program with cutting-edge research facilities and industry partnerships.',
    featured: true,
    rating: 4.8,
    reviewsCount: 312,
  },
  {
    id: generateId(),
    name: 'Nanoscale Engineering',
    provider: 'SUNY Polytechnic Institute',
    type: 'University',
    duration: '4 years',
    cost: '$28,000',
    costNumeric: 28000,
    placement: 94,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'New York',
    stateCode: 'NY',
    level: 'advanced',
    format: 'in_person',
    skills: ['Advanced Lithography', 'EUV Technology', 'Process Integration', 'Metrology'],
    description: 'State-of-the-art facilities including access to Albany NanoTech Complex. Strong Micron and GlobalFoundries connections.',
    featured: true,
    rating: 4.7,
    reviewsCount: 267,
  },
  {
    id: generateId(),
    name: 'Semiconductor Technology',
    provider: 'Hudson Valley Community College',
    type: 'Community College',
    duration: '2 years',
    cost: '$8,000',
    costNumeric: 8000,
    placement: 90,
    industry: 'Semiconductor',
    industries: ['semiconductor'],
    state: 'New York',
    stateCode: 'NY',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Clean Room Operations', 'Equipment Maintenance', 'Process Control', 'Safety'],
    description: 'Affordable program with direct pathways to GlobalFoundries and Micron employment.',
    featured: false,
    rating: 4.4,
    reviewsCount: 178,
  },

  // =====================
  // HEALTHCARE IT STATES
  // =====================

  // Massachusetts - Healthcare
  {
    id: generateId(),
    name: 'Health Sciences and Technology',
    provider: 'MIT',
    type: 'University',
    duration: '4 years',
    cost: '$58,000',
    costNumeric: 58000,
    placement: 98,
    industry: 'Healthcare',
    industries: ['healthcare', 'biotech', 'ai'],
    state: 'Massachusetts',
    stateCode: 'MA',
    level: 'expert',
    format: 'in_person',
    skills: ['Health Informatics', 'Medical Devices', 'Clinical Research', 'Healthcare AI', 'HIPAA Compliance'],
    description: 'World-leading interdisciplinary program combining engineering, medicine, and computer science.',
    featured: true,
    rating: 5.0,
    reviewsCount: 423,
  },
  {
    id: generateId(),
    name: 'Biomedical Informatics',
    provider: 'Harvard Medical School',
    type: 'Medical School',
    duration: '2 years',
    cost: '$62,000',
    costNumeric: 62000,
    placement: 97,
    industry: 'Healthcare',
    industries: ['healthcare', 'biotech'],
    state: 'Massachusetts',
    stateCode: 'MA',
    level: 'expert',
    format: 'in_person',
    skills: ['Clinical Informatics', 'Data Science', 'EHR Systems', 'Healthcare Analytics'],
    description: 'Premier graduate program in medical informatics with access to world-class healthcare institutions.',
    featured: true,
    rating: 4.9,
    reviewsCount: 287,
  },
  {
    id: generateId(),
    name: 'Health Information Technology',
    provider: 'Bunker Hill Community College',
    type: 'Community College',
    duration: '2 years',
    cost: '$8,500',
    costNumeric: 8500,
    placement: 89,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'Massachusetts',
    stateCode: 'MA',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Medical Coding', 'EHR Systems', 'HIPAA Compliance', 'Healthcare Administration'],
    description: 'Affordable pathway to healthcare IT careers with connections to Boston-area hospitals.',
    featured: false,
    rating: 4.3,
    reviewsCount: 156,
  },

  // Minnesota - Healthcare
  {
    id: generateId(),
    name: 'Health Informatics',
    provider: 'University of Minnesota',
    type: 'University',
    duration: '4 years',
    cost: '$38,000',
    costNumeric: 38000,
    placement: 95,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'Minnesota',
    stateCode: 'MN',
    level: 'advanced',
    format: 'in_person',
    skills: ['Medical Devices', 'Health Insurance Tech', 'Clinical Trials', 'Population Health', 'Telemedicine'],
    description: 'Strong program with connections to Mayo Clinic, UnitedHealth Group, and Medtronic.',
    featured: true,
    rating: 4.7,
    reviewsCount: 312,
  },
  {
    id: generateId(),
    name: 'Health Sciences',
    provider: 'Mayo Clinic School of Health Sciences',
    type: 'Medical School',
    duration: '2-4 years',
    cost: '$45,000',
    costNumeric: 45000,
    placement: 98,
    industry: 'Healthcare',
    industries: ['healthcare', 'biotech'],
    state: 'Minnesota',
    stateCode: 'MN',
    level: 'expert',
    format: 'in_person',
    skills: ['Clinical Research', 'Medical Technology', 'Patient Care', 'Healthcare Innovation'],
    description: 'Train at one of the world\'s most prestigious medical institutions with guaranteed career pathways.',
    featured: true,
    rating: 5.0,
    reviewsCount: 456,
  },
  {
    id: generateId(),
    name: 'Health Information Technology',
    provider: 'Normandale Community College',
    type: 'Community College',
    duration: '2 years',
    cost: '$7,200',
    costNumeric: 7200,
    placement: 88,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'Minnesota',
    stateCode: 'MN',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Medical Coding', 'EHR Systems', 'Revenue Cycle', 'Healthcare IT Support'],
    description: 'Affordable entry point to healthcare IT careers in the Twin Cities area.',
    featured: false,
    rating: 4.2,
    reviewsCount: 134,
  },

  // Pennsylvania - Healthcare
  {
    id: generateId(),
    name: 'Health Informatics',
    provider: 'University of Pennsylvania',
    type: 'University',
    duration: '4 years',
    cost: '$52,000',
    costNumeric: 52000,
    placement: 96,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'Pennsylvania',
    stateCode: 'PA',
    level: 'advanced',
    format: 'in_person',
    skills: ['Hospital Systems', 'Pharmaceutical Tech', 'Clinical Informatics', 'Healthcare Analytics', 'Telehealth'],
    description: 'Ivy League program with connections to Penn Medicine and top Philadelphia healthcare systems.',
    featured: true,
    rating: 4.8,
    reviewsCount: 345,
  },
  {
    id: generateId(),
    name: 'Healthcare AI',
    provider: 'Carnegie Mellon University',
    type: 'University',
    duration: '2 years',
    cost: '$48,000',
    costNumeric: 48000,
    placement: 97,
    industry: 'Healthcare',
    industries: ['healthcare', 'ai'],
    state: 'Pennsylvania',
    stateCode: 'PA',
    level: 'expert',
    format: 'in_person',
    skills: ['Machine Learning', 'Healthcare Data', 'Clinical Decision Support', 'AI Ethics'],
    description: 'Cutting-edge program at the intersection of AI and healthcare from a world leader in computer science.',
    featured: true,
    rating: 4.9,
    reviewsCount: 234,
  },
  {
    id: generateId(),
    name: 'Health Information Technology',
    provider: 'Community College of Allegheny County',
    type: 'Community College',
    duration: '2 years',
    cost: '$6,800',
    costNumeric: 6800,
    placement: 87,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'Pennsylvania',
    stateCode: 'PA',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Medical Records', 'Billing Systems', 'IT Support', 'HIPAA Compliance'],
    description: 'Affordable pathway to healthcare IT careers with connections to UPMC and regional hospitals.',
    featured: false,
    rating: 4.1,
    reviewsCount: 112,
  },

  // North Carolina - Healthcare
  {
    id: generateId(),
    name: 'Health Informatics',
    provider: 'Duke University',
    type: 'University',
    duration: '2 years',
    cost: '$45,000',
    costNumeric: 45000,
    placement: 96,
    industry: 'Healthcare',
    industries: ['healthcare', 'biotech'],
    state: 'North Carolina',
    stateCode: 'NC',
    level: 'expert',
    format: 'in_person',
    skills: ['Biotech', 'Clinical Trials', 'Medical Research', 'Health IT', 'Genomics'],
    description: 'Graduate program with strong connections to Duke Health and Research Triangle biotech companies.',
    featured: true,
    rating: 4.9,
    reviewsCount: 298,
  },
  {
    id: generateId(),
    name: 'Biomedical Engineering',
    provider: 'UNC Chapel Hill',
    type: 'University',
    duration: '4 years',
    cost: '$32,000',
    costNumeric: 32000,
    placement: 94,
    industry: 'Healthcare',
    industries: ['healthcare', 'biotech'],
    state: 'North Carolina',
    stateCode: 'NC',
    level: 'advanced',
    format: 'in_person',
    skills: ['Medical Devices', 'Bioinformatics', 'Clinical Engineering', 'Research'],
    description: 'Strong undergraduate program with access to Research Triangle Park companies and UNC Health.',
    featured: true,
    rating: 4.7,
    reviewsCount: 267,
  },
  {
    id: generateId(),
    name: 'Health Information Technology',
    provider: 'Wake Technical Community College',
    type: 'Community College',
    duration: '2 years',
    cost: '$5,800',
    costNumeric: 5800,
    placement: 90,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'North Carolina',
    stateCode: 'NC',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['EHR Systems', 'Medical Coding', 'Healthcare IT', 'Data Management'],
    description: 'Excellent value program with connections to Research Triangle healthcare employers.',
    featured: false,
    rating: 4.4,
    reviewsCount: 189,
  },

  // Florida - Healthcare
  {
    id: generateId(),
    name: 'Health Informatics',
    provider: 'University of Florida',
    type: 'University',
    duration: '4 years',
    cost: '$28,000',
    costNumeric: 28000,
    placement: 93,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'Florida',
    stateCode: 'FL',
    level: 'advanced',
    format: 'in_person',
    skills: ['Geriatric Care Tech', 'Telemedicine', 'Healthcare Admin', 'Medical Tourism', 'Home Health Tech'],
    description: 'Growing program addressing Florida\'s unique healthcare needs with strong hospital partnerships.',
    featured: true,
    rating: 4.5,
    reviewsCount: 234,
  },
  {
    id: generateId(),
    name: 'Health Management',
    provider: 'University of South Florida',
    type: 'University',
    duration: '4 years',
    cost: '$25,000',
    costNumeric: 25000,
    placement: 91,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'Florida',
    stateCode: 'FL',
    level: 'advanced',
    format: 'in_person',
    skills: ['Healthcare Administration', 'Population Health', 'Telehealth', 'Quality Improvement'],
    description: 'Comprehensive health management program with Tampa Bay area healthcare connections.',
    featured: false,
    rating: 4.4,
    reviewsCount: 198,
  },
  {
    id: generateId(),
    name: 'Health Information Technology',
    provider: 'Miami Dade College',
    type: 'Community College',
    duration: '2 years',
    cost: '$5,200',
    costNumeric: 5200,
    placement: 88,
    industry: 'Healthcare',
    industries: ['healthcare'],
    state: 'Florida',
    stateCode: 'FL',
    level: 'intermediate',
    format: 'hybrid',
    skills: ['Medical Records', 'Telehealth Support', 'Billing Systems', 'Patient Services'],
    description: 'Most affordable pathway to healthcare IT careers in South Florida.',
    featured: false,
    rating: 4.2,
    reviewsCount: 156,
  },
];

// ===========================================
// Helper Functions
// ===========================================

/**
 * Get all training programs
 */
export const getAllTrainingPrograms = (): TrainingProgram[] => {
  return trainingPrograms;
};

/**
 * Get training programs by state code
 */
export const getTrainingProgramsByState = (stateCode: string): TrainingProgram[] => {
  return trainingPrograms.filter(p => p.stateCode === stateCode);
};

/**
 * Get training programs by industry
 */
export const getTrainingProgramsByIndustry = (industry: string): TrainingProgram[] => {
  return trainingPrograms.filter(p =>
    p.industries.includes(industry) || p.industry.toLowerCase().includes(industry.toLowerCase())
  );
};

/**
 * Get featured training programs
 */
export const getFeaturedTrainingPrograms = (): TrainingProgram[] => {
  return trainingPrograms.filter(p => p.featured);
};

/**
 * Get free training programs
 */
export const getFreeTrainingPrograms = (): TrainingProgram[] => {
  return trainingPrograms.filter(p => p.costNumeric === 0);
};

/**
 * Convert training program to format expected by WorkforceMapPage
 */
export const toWorkforceMapFormat = (program: TrainingProgram) => ({
  name: program.name,
  type: program.type,
  duration: program.duration,
  cost: program.cost,
  placement: program.placement,
});

/**
 * Get training programs for WorkforceMapPage by state
 */
export const getWorkforceMapTraining = (stateCode: string) => {
  return getTrainingProgramsByState(stateCode).map(toWorkforceMapFormat);
};

// ===========================================
// AI Metrics Enhancement
// ===========================================

// Industry code mapping for AI metrics lookup
const industryCodeMap: Record<string, string> = {
  'Nuclear Energy': 'nuclear',
  'Semiconductor': 'semiconductor',
  'Healthcare': 'healthcare',
  'AI & Machine Learning': 'ai',
  'Quantum Technologies': 'quantum',
  'Cybersecurity': 'cybersecurity',
  'Aerospace & Defense': 'aerospace',
  'Biotechnology': 'biotech',
  'Robotics & Automation': 'robotics',
  'Clean Energy': 'clean-energy',
  'Advanced Manufacturing': 'manufacturing',
};

/**
 * Calculate AI readiness score based on program attributes
 */
const calculateAIReadiness = (
  program: TrainingProgram,
  baseExposure: number,
  baseOpportunity: number
): number => {
  let score = (baseExposure + baseOpportunity) / 2;

  // Adjust based on program type
  switch (program.type) {
    case 'University':
      score *= 1.1;
      break;
    case 'Medical School':
      score *= 1.15;
      break;
    case 'Employer Training':
      score *= 1.05;
      break;
    case 'Community College':
      score *= 0.95;
      break;
  }

  // Bonus for AI-related skills in curriculum
  const aiKeywords = ['AI', 'ML', 'Machine Learning', 'Analytics', 'Data', 'Automation', 'Digital'];
  const hasAISkills = program.skills.some(skill =>
    aiKeywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))
  );
  if (hasAISkills) {
    score *= 1.1;
  }

  return Math.min(100, Math.round(score));
};

/**
 * Enrich a training program with AI metrics
 */
export const enrichWithAIMetrics = (program: TrainingProgram): TrainingProgramWithAI => {
  // Get the primary industry code
  const industryCode = program.industries[0] || industryCodeMap[program.industry] || 'manufacturing';
  const metrics = industryAIMetrics[industryCode] || industryAIMetrics['manufacturing'];

  const aiReadinessScore = calculateAIReadiness(
    program,
    metrics.exposureIndex,
    metrics.opportunityIndex
  );

  return {
    ...program,
    aiExposureIndex: metrics.exposureIndex,
    aiOpportunityIndex: metrics.opportunityIndex,
    aiReadinessScore,
    recommendedAISkills: metrics.recommendedAISkills,
  };
};

/**
 * Get all training programs with AI metrics
 */
export const getTrainingProgramsWithAI = (): TrainingProgramWithAI[] => {
  return trainingPrograms.map(enrichWithAIMetrics);
};

/**
 * Get training programs by industry with AI metrics
 */
export const getTrainingProgramsByIndustryWithAI = (industry: string): TrainingProgramWithAI[] => {
  return getTrainingProgramsByIndustry(industry).map(enrichWithAIMetrics);
};

/**
 * Get featured training programs with AI metrics
 */
export const getFeaturedProgramsWithAI = (): TrainingProgramWithAI[] => {
  return getFeaturedTrainingPrograms().map(enrichWithAIMetrics);
};
