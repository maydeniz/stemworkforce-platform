// ===========================================
// PROGRAM TYPES - Education Provider Programs
// ===========================================

// Credential Types
export type CredentialType =
  | 'microcredential'
  | 'certificate'
  | 'associate'
  | 'bachelor'
  | 'master'
  | 'doctoral'
  | 'professional_doctorate'
  | 'postdoctoral';

export const CREDENTIAL_TYPES: { value: CredentialType; label: string; description: string }[] = [
  { value: 'microcredential', label: 'Microcredential / Digital Badge', description: 'Short competency-based recognition (< 6 credits)' },
  { value: 'certificate', label: 'Certificate', description: '12-30 credits, focused skill training' },
  { value: 'associate', label: 'Associate Degree', description: '2-year degree (AA, AS, AAS)' },
  { value: 'bachelor', label: "Bachelor's Degree", description: '4-year undergraduate degree' },
  { value: 'master', label: "Master's Degree", description: 'Graduate-level degree' },
  { value: 'doctoral', label: 'Doctoral / PhD', description: 'Research doctorate' },
  { value: 'professional_doctorate', label: 'Professional Doctorate', description: 'JD, MD, PharmD, EdD, etc.' },
  { value: 'postdoctoral', label: 'Post-Doctoral', description: 'Research position after PhD' },
];

// Delivery Mode
export type DeliveryMode = 'in_person' | 'online' | 'hybrid';

export const DELIVERY_MODES: { value: DeliveryMode; label: string }[] = [
  { value: 'in_person', label: 'In-Person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

// Duration Unit
export type DurationUnit = 'weeks' | 'months' | 'years';

// AI Competency Level
export type CompetencyLevel = 'none' | 'introductory' | 'intermediate' | 'advanced';

export const COMPETENCY_LEVELS: { value: CompetencyLevel; label: string }[] = [
  { value: 'none', label: 'Not Covered' },
  { value: 'introductory', label: 'Introductory' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

// AI Competencies based on UNESCO Framework
export interface AICompetencies {
  aiFoundations: CompetencyLevel;
  aiEthics: CompetencyLevel;
  aiSystemDesign: CompetencyLevel;
  machineLearning: CompetencyLevel;
  dataScience: CompetencyLevel;
  aiToolsIntegration: CompetencyLevel;
}

export const AI_COMPETENCY_FIELDS: { key: keyof AICompetencies; label: string; description: string }[] = [
  { key: 'aiFoundations', label: 'AI Foundations & Applications', description: 'Understanding AI concepts, capabilities, and limitations' },
  { key: 'aiEthics', label: 'AI Ethics & Responsible Use', description: 'Ethical considerations, bias, privacy, and responsible AI' },
  { key: 'aiSystemDesign', label: 'AI System Design', description: 'Designing and architecting AI-powered systems' },
  { key: 'machineLearning', label: 'Machine Learning', description: 'ML algorithms, training, and model development' },
  { key: 'dataScience', label: 'Data Science & Analytics', description: 'Data analysis, visualization, and statistical methods' },
  { key: 'aiToolsIntegration', label: 'AI Tools Integration', description: 'Using AI tools like ChatGPT, Copilot in workflows' },
];

// Work-Based Learning Components
export interface WorkBasedLearning {
  hasInternship: boolean;
  internshipRequired: boolean;
  internshipDurationWeeks?: number;
  hasCoOp: boolean;
  hasApprenticeship: boolean;
  apprenticeshipRegistered: boolean; // DOL-registered
  hasCapstone: boolean;
  capstoneIndustrySponsored: boolean;
  hasClinical: boolean;
  hasPracticum: boolean;
  industryPartners: string[];
}

// Career Readiness Competencies (NACE Framework)
export interface CareerCompetencies {
  criticalThinking: number; // 1-5 scale
  teamwork: number;
  communication: number;
  leadership: number;
  technology: number;
  professionalism: number;
  careerManagement: number;
  equityInclusion: number;
}

export const CAREER_COMPETENCY_FIELDS: { key: keyof CareerCompetencies; label: string }[] = [
  { key: 'criticalThinking', label: 'Critical Thinking / Problem Solving' },
  { key: 'teamwork', label: 'Teamwork / Collaboration' },
  { key: 'communication', label: 'Communication (Written/Oral)' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'technology', label: 'Technology / Digital Literacy' },
  { key: 'professionalism', label: 'Professionalism / Work Ethic' },
  { key: 'careerManagement', label: 'Career Management' },
  { key: 'equityInclusion', label: 'Equity & Inclusion' },
];

// Target Industries
export const TARGET_INDUSTRIES = [
  'Energy & Utilities',
  'Nuclear Energy',
  'Renewable Energy',
  'Defense & National Security',
  'Aerospace',
  'Cybersecurity',
  'Biotechnology',
  'Healthcare',
  'Environmental Science',
  'Advanced Manufacturing',
  'Semiconductors',
  'Quantum Computing',
  'Artificial Intelligence',
  'Data Science',
  'Software Engineering',
  'Research & Development',
  'Federal Government',
  'National Laboratories',
];

// Professional Certifications
export const PROFESSIONAL_CERTIFICATIONS = [
  // Computing & IT
  'AWS Certified',
  'Azure Certified',
  'Google Cloud Certified',
  'CompTIA A+',
  'CompTIA Security+',
  'CompTIA Network+',
  'CISSP',
  'CEH (Certified Ethical Hacker)',
  'PMP (Project Management Professional)',
  // Engineering
  'PE (Professional Engineer)',
  'FE (Fundamentals of Engineering)',
  // Nuclear
  'NRC Reactor Operator License',
  'Health Physics Certification',
  // Data & Analytics
  'Certified Data Professional',
  'SAS Certified',
  'Tableau Certified',
  // Other
  'Six Sigma Green Belt',
  'Six Sigma Black Belt',
  'Lean Certification',
];

// Accreditations
export const ACCREDITATIONS = [
  'ABET (Engineering)',
  'AACSB (Business)',
  'AACP (Pharmacy)',
  'ACPE (Pharmacy)',
  'ACS (Chemistry)',
  'CSAB (Computing)',
  'CAHME (Healthcare Management)',
  'CEPH (Public Health)',
  'NAACLS (Clinical Laboratory)',
  'ACEN (Nursing)',
  'CCNE (Nursing)',
];

// Program Status
export type ProgramStatus = 'draft' | 'active' | 'suspended' | 'discontinued';

// Full Program Interface
export interface Program {
  id: string;
  organizationId: string;

  // Basic Information
  name: string;
  description: string;
  cipCode: string;
  cipTitle?: string;
  programUrl?: string;

  // Credential Type
  credentialType: CredentialType;

  // Program Structure
  deliveryModes: DeliveryMode[];
  durationValue: number;
  durationUnit: DurationUnit;
  creditHours?: number;
  isStackable: boolean;
  stacksIntoId?: string; // Reference to parent credential

  // Work-Based Learning
  workBasedLearning: WorkBasedLearning;

  // AI Competencies
  aiCompetencies: AICompetencies;

  // Career Competencies
  careerCompetencies: CareerCompetencies;

  // Industry Alignment
  targetIndustries: string[];
  clearancePathway: boolean;
  professionalCertifications: string[];
  accreditations: string[];

  // Outcomes (optional, for transparency)
  outcomes?: {
    graduationRate?: number;
    jobPlacementRate?: number;
    medianSalary?: number;
    employerSatisfaction?: number;
  };

  // Metadata
  status: ProgramStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Form state for creating/editing programs
export interface ProgramFormData {
  // Basic Information
  name: string;
  description: string;
  cipCode: string;
  programUrl: string;

  // Credential Type
  credentialType: CredentialType | '';

  // Program Structure
  deliveryModes: DeliveryMode[];
  durationValue: number;
  durationUnit: DurationUnit;
  creditHours: number;
  isStackable: boolean;
  stacksIntoId: string;

  // Work-Based Learning
  workBasedLearning: WorkBasedLearning;

  // AI Competencies
  aiCompetencies: AICompetencies;

  // Career Competencies
  careerCompetencies: CareerCompetencies;

  // Industry Alignment
  targetIndustries: string[];
  clearancePathway: boolean;
  professionalCertifications: string[];
  accreditations: string[];

  // Outcomes
  graduationRate: string;
  jobPlacementRate: string;
  medianSalary: string;
  employerSatisfaction: string;
}

// Default form values
export const getDefaultProgramFormData = (): ProgramFormData => ({
  name: '',
  description: '',
  cipCode: '',
  programUrl: '',
  credentialType: '',
  deliveryModes: [],
  durationValue: 0,
  durationUnit: 'months',
  creditHours: 0,
  isStackable: false,
  stacksIntoId: '',
  workBasedLearning: {
    hasInternship: false,
    internshipRequired: false,
    internshipDurationWeeks: undefined,
    hasCoOp: false,
    hasApprenticeship: false,
    apprenticeshipRegistered: false,
    hasCapstone: false,
    capstoneIndustrySponsored: false,
    hasClinical: false,
    hasPracticum: false,
    industryPartners: [],
  },
  aiCompetencies: {
    aiFoundations: 'none',
    aiEthics: 'none',
    aiSystemDesign: 'none',
    machineLearning: 'none',
    dataScience: 'none',
    aiToolsIntegration: 'none',
  },
  careerCompetencies: {
    criticalThinking: 3,
    teamwork: 3,
    communication: 3,
    leadership: 3,
    technology: 3,
    professionalism: 3,
    careerManagement: 3,
    equityInclusion: 3,
  },
  targetIndustries: [],
  clearancePathway: false,
  professionalCertifications: [],
  accreditations: [],
  graduationRate: '',
  jobPlacementRate: '',
  medianSalary: '',
  employerSatisfaction: '',
});
