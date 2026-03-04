// ===========================================
// CareerNet Data Types
// Expert-annotated career Q&A from CareerVillage.org (CC BY 4.0)
// ===========================================

import type { IndustryType } from './index';

export interface CareerQA {
  id: string;
  answerId: number;
  questionId: number;
  sourceDataset: CareerNetDataset;
  questionTitle: string;
  questionBody: string;
  questionScore: number;
  questionViews: number;
  questionAddedAt?: string;
  answerBody: string;
  answerScore: number;
  answerAddedAt?: string;
  correctness: number;
  completeness: number;
  coherency: number;
  qualityScore: number;
  scenarioLabels: string[];
  questionTags: string[];
  industries: IndustryType[];
  askerLocation?: string;
  answererLocation?: string;
  exploreOptions: boolean;
  takeAction: boolean;
  understandingPurpose: boolean;
  validationSupport: boolean;
  findResources: boolean;
  navigateConstraints: boolean;
  compareOptions: boolean;
  unclearGoal: boolean;
}

export type CareerNetDataset = 'general' | 'technology' | 'health';

export type CareerNetScenario =
  | 'skill-development'
  | 'career-advancement'
  | 'interview-prep'
  | 'first-job'
  | 'resume-optimization'
  | 'networking-mentorship'
  | 'industry-transition'
  | 'work-life-balance'
  | 'salary-negotiation'
  | 'education-planning'
  | 'entrepreneurship'
  | 'workplace-challenges'
  | 'job-search-strategy'
  | 'career-exploration'
  | 'professional-identity'
  | 'remote-work'
  | 'leadership-development'
  | 'technical-skills';

export type CareerNetSortBy = 'quality' | 'relevance' | 'views' | 'recent';

export interface CareerQAFilters {
  search?: string;
  industries?: IndustryType[];
  scenarios?: string[];
  tags?: string[];
  sourceDataset?: CareerNetDataset;
  minCorrectness?: number;
  functionLabels?: CareerNetFunctionLabel[];
}

export type CareerNetFunctionLabel =
  | 'exploreOptions'
  | 'takeAction'
  | 'understandingPurpose'
  | 'validationSupport'
  | 'findResources'
  | 'navigateConstraints'
  | 'compareOptions'
  | 'unclearGoal';

export interface CareerQAResult {
  items: CareerQA[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CareerQAStats {
  totalPairs: number;
  uniqueQuestions: number;
  avgQuality: number;
  byDataset: {
    dataset: CareerNetDataset;
    count: number;
    avgQuality: number;
  }[];
  byIndustry: {
    industry: string;
    count: number;
  }[];
  byScenario: {
    scenario: string;
    count: number;
  }[];
  topTags: {
    tag: string;
    count: number;
  }[];
}

// Scenario label mapping from raw CSV values to normalized slugs
export const SCENARIO_LABEL_MAP: Record<string, CareerNetScenario> = {
  'Skill Development': 'skill-development',
  'Career Advancement': 'career-advancement',
  'Interview Preparation': 'interview-prep',
  'First Job Navigation': 'first-job',
  'Resume/CV/LinkedIn Optimization': 'resume-optimization',
  'Networking and Mentorship': 'networking-mentorship',
  'Industry Transition': 'industry-transition',
  'Work-Life Balance': 'work-life-balance',
  'Salary and Benefits Negotiation': 'salary-negotiation',
  'Education and Certification Planning': 'education-planning',
  'Entrepreneurship': 'entrepreneurship',
  'Workplace Challenges': 'workplace-challenges',
  'Job Search Strategy': 'job-search-strategy',
  'Career Exploration': 'career-exploration',
  'Professional Identity': 'professional-identity',
  'Remote Work': 'remote-work',
  'Leadership Development': 'leadership-development',
  'Technical Skills': 'technical-skills',
};

// Reverse map for display
export const SCENARIO_DISPLAY_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(SCENARIO_LABEL_MAP).map(([display, slug]) => [slug, display])
);

// Tag-to-industry mapping for classifying CareerNet Q&A
export const TAG_INDUSTRY_MAP: Record<string, IndustryType[]> = {
  // AI & Machine Learning
  'ai': ['ai'],
  'artificial-intelligence': ['ai'],
  'machine-learning': ['ai'],
  'deep-learning': ['ai'],
  'data-science': ['ai'],
  'nlp': ['ai'],
  'computer-vision': ['ai'],
  'neural-networks': ['ai'],
  'natural-language-processing': ['ai'],

  // Cybersecurity
  'cybersecurity': ['cybersecurity'],
  'information-security': ['cybersecurity'],
  'network-security': ['cybersecurity'],
  'ethical-hacking': ['cybersecurity'],
  'penetration-testing': ['cybersecurity'],
  'cyber-security': ['cybersecurity'],

  // Clean Energy
  'renewable-energy': ['clean-energy'],
  'solar-energy': ['clean-energy'],
  'wind-energy': ['clean-energy'],
  'clean-energy': ['clean-energy'],
  'sustainability': ['clean-energy'],
  'environmental-engineering': ['clean-energy'],
  'environmental-science': ['clean-energy'],
  'green-energy': ['clean-energy'],

  // Biotech & Pharma
  'biotechnology': ['biotech'],
  'biology': ['biotech'],
  'genetics': ['biotech'],
  'pharmaceutical': ['biotech'],
  'molecular-biology': ['biotech'],
  'biochemistry': ['biotech'],
  'bioinformatics': ['biotech'],
  'microbiology': ['biotech'],
  'biomedical': ['biotech'],

  // Aerospace
  'aerospace': ['aerospace'],
  'aviation': ['aerospace'],
  'space': ['aerospace'],
  'astronautics': ['aerospace'],
  'rocket-science': ['aerospace'],
  'aerospace-engineering': ['aerospace'],
  'astronaut': ['aerospace'],

  // Semiconductor
  'semiconductor': ['semiconductor'],
  'microelectronics': ['semiconductor'],
  'vlsi': ['semiconductor'],
  'chip-design': ['semiconductor'],
  'electrical-engineering': ['semiconductor'],
  'electronics': ['semiconductor'],
  'integrated-circuits': ['semiconductor'],

  // Quantum Computing
  'quantum-computing': ['quantum'],
  'quantum-physics': ['quantum'],
  'quantum-mechanics': ['quantum'],
  'quantum': ['quantum'],

  // Advanced Manufacturing
  'manufacturing': ['manufacturing'],
  'industrial-engineering': ['manufacturing'],
  'mechanical-engineering': ['manufacturing'],
  'materials-science': ['manufacturing'],
  'robotics': ['robotics'],
  '3d-printing': ['manufacturing'],
  'additive-manufacturing': ['manufacturing'],

  // Nuclear
  'nuclear-engineering': ['nuclear'],
  'nuclear-physics': ['nuclear'],
  'nuclear-energy': ['nuclear'],
  'nuclear': ['nuclear'],

  // Healthcare Technology
  'healthcare': ['healthcare'],
  'medical-devices': ['healthcare'],
  'biomedical-engineering': ['healthcare'],
  'health-informatics': ['healthcare'],
  'telemedicine': ['healthcare'],
  'nursing': ['healthcare'],
  'medicine': ['healthcare'],
  'public-health': ['healthcare'],
  'health': ['healthcare'],
  'medical': ['healthcare'],
  'pharmacy': ['healthcare'],

  // Multi-industry tags
  'computer-science': ['ai', 'cybersecurity'],
  'engineering': ['manufacturing', 'aerospace'],
  'technology': ['ai', 'cybersecurity'],
  'science': ['biotech', 'nuclear'],
  'mathematics': ['ai', 'quantum'],
  'math': ['ai', 'quantum'],
  'physics': ['quantum', 'nuclear', 'aerospace'],
  'chemistry': ['biotech', 'clean-energy'],
  'programming': ['ai', 'cybersecurity'],
  'software-engineering': ['ai'],
  'software-development': ['ai'],
  'coding': ['ai'],
  'data-analytics': ['ai'],
  'statistics': ['ai'],
  'big-data': ['ai'],
};
