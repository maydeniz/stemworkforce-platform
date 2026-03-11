// ===========================================
// Education Partners Onboarding Page
// Dynamic multi-step form with horizontal navigation
// ===========================================

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  BookOpen,
  FileCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  GraduationCap,
  Globe,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Target,
  BarChart3,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle2,
  Atom,
  Microscope,
  Lock,
  Heart,
  Sparkles
} from 'lucide-react';

// ===========================================
// FORM TYPES
// ===========================================
interface ProgramInfo {
  name: string;
  type: string;
  duration: string;
  format: string;
  accreditation: string;
  enrollmentSize: string;
}

interface FormData {
  // Institution Info
  institutionName: string;
  institutionType: string;
  website: string;
  yearEstablished: string;
  accreditationBody: string;
  taxId: string;
  // Contact Info
  contactFirstName: string;
  contactLastName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // Programs
  programs: ProgramInfo[];
  focusAreas: string[];
  industries: string[];
  // Outcomes
  totalEnrollment: string;
  graduationRate: string;
  placementRate: string;
  averageSalary: string;
  employerPartners: string;
  // Goals
  partnershipGoals: string[];
  desiredServices: string[];
  timeline: string;
  additionalInfo: string;
  // National Labs / Research Specific
  clearanceLevels: string[];
  researchAreas: string[];
  fundingAgencies: string[];
  internshipsPerYear: string;
  // Informal Education Specific
  ageGroups: string[];
  participantsPerYear: string;
  parentEngagement: boolean;
  grantFunded: boolean;
  stemEcosystem: boolean;
}

// ===========================================
// SECTIONS CONFIGURATION
// ===========================================
const sections = [
  { id: 'institution', label: 'Institution', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Users },
  { id: 'programs', label: 'Programs', icon: BookOpen },
  { id: 'outcomes', label: 'Outcomes', icon: BarChart3 },
  { id: 'goals', label: 'Goals', icon: Target }
];

// ===========================================
// DROPDOWN OPTIONS
// ===========================================
const INSTITUTION_TYPES = [
  { value: 'university', label: 'University (4-year)', category: 'higher-ed' },
  { value: 'college', label: 'College (4-year)', category: 'higher-ed' },
  { value: 'community_college', label: 'Community College (2-year)', category: 'higher-ed' },
  { value: 'bootcamp', label: 'Coding Bootcamp / Accelerator', category: 'training' },
  { value: 'vocational', label: 'Vocational / Trade School', category: 'training' },
  { value: 'corporate_training', label: 'Corporate Training Provider', category: 'training' },
  { value: 'online', label: 'Online Learning Platform', category: 'training' },
  { value: 'national_lab', label: 'National Laboratory / Research Facility', category: 'research' },
  { value: 'ffrdc', label: 'FFRDC (Federally Funded Research Center)', category: 'research' },
  { value: 'science_museum', label: 'Science Museum / Center', category: 'informal' },
  { value: 'stem_camp', label: 'STEM Camp / Summer Program', category: 'informal' },
  { value: 'afterschool', label: 'After-School STEM Program', category: 'informal' },
  { value: 'makerspace', label: 'Makerspace / Fab Lab', category: 'informal' },
  { value: 'nonprofit', label: 'Nonprofit Training Organization', category: 'nonprofit' },
  { value: 'government', label: 'Government Training Program', category: 'government' },
  { value: 'other', label: 'Other', category: 'other' }
];

const PROGRAM_TYPES = [
  // Higher Ed
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctoral',
  'Associate Degree',
  // Training
  'Certificate Program',
  'Bootcamp / Intensive',
  'Professional Development',
  'Apprenticeship',
  'Online Course',
  'Executive Education',
  // National Labs / Research
  'Research Fellowship',
  'Internship Program',
  'Postdoctoral Program',
  'Clearance Pipeline Program',
  // Informal Education
  'Summer Camp',
  'After-School Program',
  'Workshop Series',
  'Youth Mentorship',
  'Family STEM Program',
  'Maker Program',
  'Science Competition'
];

const PROGRAM_FORMATS = [
  'In-Person',
  'Online',
  'Hybrid',
  'Self-Paced',
  'Cohort-Based'
];

const FOCUS_AREAS = [
  'Artificial Intelligence & Machine Learning',
  'Data Science & Analytics',
  'Software Engineering',
  'Cybersecurity',
  'Cloud Computing',
  'Quantum Technologies',
  'Semiconductor Technology',
  'Robotics & Automation',
  'Biotechnology',
  'Health Informatics',
  'Clean Energy & Sustainability',
  'Aerospace Engineering',
  'Nuclear Engineering',
  'FinTech & Blockchain',
  'Product Management',
  'UX/UI Design',
  'DevOps & SRE',
  'Embedded Systems'
];

const INDUSTRIES = [
  { id: 'semiconductor', label: 'Semiconductor', icon: '💎' },
  { id: 'nuclear', label: 'Nuclear Technologies', icon: '☢️' },
  { id: 'ai_ml', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'quantum', label: 'Quantum Technologies', icon: '⚛️' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: '🛡️' },
  { id: 'aerospace', label: 'Aerospace & Defense', icon: '🚀' },
  { id: 'biotech', label: 'Biotechnology', icon: '🧬' },
  { id: 'healthcare', label: 'Healthcare & Medical Technology', icon: '🏥' },
  { id: 'robotics', label: 'Robotics & Automation', icon: '🦾' },
  { id: 'clean_energy', label: 'Clean Energy', icon: '⚡' },
  { id: 'manufacturing', label: 'Advanced Manufacturing', icon: '🏭' }
];

const PARTNERSHIP_GOALS = [
  // Higher Ed & Training
  'Increase student placement rates',
  'Connect with more employers',
  'Access industry insights for curriculum',
  'Host virtual career fairs',
  'Track graduate outcomes',
  'Build apprenticeship programs',
  'Develop industry partnerships',
  'Access skills gap analytics',
  'Offer students job board access',
  // Research / National Labs
  'Build clearance-ready talent pipeline',
  'Recruit postdoctoral researchers',
  'Find research collaborators',
  'Access emerging tech workforce',
  'Facilitate research collaborations',
  // Informal Education
  'Connect parents with STEM pathways',
  'Demonstrate program impact to funders',
  'Track participant outcomes',
  'Build K-12 to career pathways',
  'Access grant-ready metrics'
];

const DESIRED_SERVICES = [
  // Core Services
  'Employer matching & introductions',
  'Virtual career fair hosting',
  'Outcome tracking dashboard',
  'Skills gap analysis',
  'Curriculum advisory support',
  'Industry speaker series',
  'Apprenticeship program development',
  'White-label job board',
  'Research collaboration matching',
  'Quarterly industry reports',
  // National Labs / Research
  'Clearance pipeline management',
  'Security-cleared talent pool access',
  'Research partnership matching',
  'Lab-to-industry transition support',
  // Informal Education
  'Parent & family engagement tools',
  'Grant reporting & metrics',
  'STEM pathway visualization',
  'Youth outcome tracking',
  'NSF ecosystem partnership'
];

// National Labs / Research Specific Options
const CLEARANCE_LEVELS = [
  { value: 'q_clearance', label: 'DOE Q Clearance' },
  { value: 'l_clearance', label: 'DOE L Clearance' },
  { value: 'ts_sci', label: 'TS/SCI' },
  { value: 'top_secret', label: 'Top Secret' },
  { value: 'secret', label: 'Secret' },
  { value: 'public_trust', label: 'Public Trust' },
  { value: 'none', label: 'No Clearance Required' }
];

const RESEARCH_AREAS = [
  'Nuclear Physics',
  'Materials Science',
  'High-Performance Computing',
  'Cybersecurity Research',
  'Energy Storage',
  'Particle Physics',
  'Climate Science',
  'Biotechnology',
  'Artificial Intelligence',
  'Quantum Information Science',
  'Fusion Energy',
  'Astrophysics'
];

const FUNDING_AGENCIES = [
  'DOE (Department of Energy)',
  'NSF (National Science Foundation)',
  'NIH (National Institutes of Health)',
  'DARPA',
  'NASA',
  'DOD (Department of Defense)',
  'NNSA',
  'ARPA-E',
  'Other Federal',
  'Private Foundation'
];

// Informal Education Specific Options
const AGE_GROUPS = [
  { value: 'k2', label: 'K-2 (Ages 5-7)' },
  { value: '35', label: 'Grades 3-5 (Ages 8-10)' },
  { value: '68', label: 'Middle School (Ages 11-13)' },
  { value: '912', label: 'High School (Ages 14-18)' },
  { value: 'families', label: 'Families / Multi-generational' },
  { value: 'adults', label: 'Adult Learners' }
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================
const getSectionCompletion = (sectionId: string, data: FormData): number => {
  switch (sectionId) {
    case 'institution': {
      const fields = [data.institutionName, data.institutionType, data.website, data.accreditationBody];
      const filled = fields.filter(f => f && f.trim() !== '').length;
      return Math.round((filled / fields.length) * 100);
    }
    case 'contact': {
      const fields = [data.contactFirstName, data.contactLastName, data.contactEmail, data.contactPhone, data.city, data.state];
      const filled = fields.filter(f => f && f.trim() !== '').length;
      return Math.round((filled / fields.length) * 100);
    }
    case 'programs': {
      const hasPrograms = data.programs.length > 0;
      const hasFocusAreas = data.focusAreas.length > 0;
      const hasIndustries = data.industries.length > 0;
      const score = (hasPrograms ? 40 : 0) + (hasFocusAreas ? 30 : 0) + (hasIndustries ? 30 : 0);
      return score;
    }
    case 'outcomes': {
      const fields = [data.totalEnrollment, data.graduationRate, data.placementRate];
      const filled = fields.filter(f => f && f.trim() !== '').length;
      return Math.round((filled / fields.length) * 100);
    }
    case 'goals': {
      const hasGoals = data.partnershipGoals.length > 0;
      const hasServices = data.desiredServices.length > 0;
      const hasTimeline = data.timeline.trim() !== '';
      const score = (hasGoals ? 40 : 0) + (hasServices ? 40 : 0) + (hasTimeline ? 20 : 0);
      return score;
    }
    default:
      return 0;
  }
};

const getTotalCompletion = (data: FormData): number => {
  const sectionScores = sections.map(s => getSectionCompletion(s.id, data));
  return Math.round(sectionScores.reduce((a, b) => a + b, 0) / sections.length);
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const EducationPartnersOnboardingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('institution');
  const [formData, setFormData] = useState<FormData>({
    institutionName: '',
    institutionType: '',
    website: '',
    yearEstablished: '',
    accreditationBody: '',
    taxId: '',
    contactFirstName: '',
    contactLastName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    programs: [],
    focusAreas: [],
    industries: [],
    totalEnrollment: '',
    graduationRate: '',
    placementRate: '',
    averageSalary: '',
    employerPartners: '',
    partnershipGoals: [],
    desiredServices: [],
    timeline: '',
    additionalInfo: '',
    // National Labs / Research Specific
    clearanceLevels: [],
    researchAreas: [],
    fundingAgencies: [],
    internshipsPerYear: '',
    // Informal Education Specific
    ageGroups: [],
    participantsPerYear: '',
    parentEngagement: false,
    grantFunded: false,
    stemEcosystem: false
  });

  const [newProgram, setNewProgram] = useState<ProgramInfo>({
    name: '',
    type: '',
    duration: '',
    format: '',
    accreditation: '',
    enrollmentSize: ''
  });

  const updateField = useCallback((field: keyof FormData, value: string | string[] | ProgramInfo[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleArrayItem = useCallback((field: 'focusAreas' | 'industries' | 'partnershipGoals' | 'desiredServices' | 'clearanceLevels' | 'researchAreas' | 'fundingAgencies' | 'ageGroups', item: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  }, []);

  const addProgram = useCallback(() => {
    if (newProgram.name && newProgram.type) {
      setFormData(prev => ({
        ...prev,
        programs: [...prev.programs, { ...newProgram }]
      }));
      setNewProgram({
        name: '',
        type: '',
        duration: '',
        format: '',
        accreditation: '',
        enrollmentSize: ''
      });
    }
  }, [newProgram]);

  const removeProgram = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index)
    }));
  }, []);

  const navigateSection = (direction: 'prev' | 'next') => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (direction === 'prev' && currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const handleSubmit = async () => {
    // TODO: Submit to backend
    console.log('Submitting form data:', formData);
    alert('Application submitted successfully! We will review your application and get back to you within 48 hours.');
  };

  const totalCompletion = getTotalCompletion(formData);
  const currentSectionIndex = sections.findIndex(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/education-partners"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Education Partners
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Education Partner Application</h1>
              <p className="text-gray-400">Join our network and connect your students with industry opportunities</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-gray-900/50 px-4 py-3 rounded-xl border border-gray-800">
              <div className="text-right">
                <div className="text-sm text-gray-400">Application Progress</div>
                <div className="text-2xl font-bold text-white">{totalCompletion}%</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#1f2937"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#6366f1"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${totalCompletion * 1.76} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <GraduationCap className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Horizontal Step Navigation */}
        <div className="mb-8 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
          <div className="flex items-center justify-between">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              const completion = getSectionCompletion(section.id, formData);
              const isActive = activeSection === section.id;
              const isCompleted = completion === 100;

              return (
                <React.Fragment key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className="flex flex-col items-center group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30'
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                    >
                      {section.label}
                    </span>
                    {completion > 0 && completion < 100 && (
                      <span className="text-xs text-gray-500">{completion}%</span>
                    )}
                  </button>

                  {idx < sections.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded transition-colors ${
                        getSectionCompletion(sections[idx].id, formData) === 100
                          ? 'bg-green-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* Institution Section */}
              {activeSection === 'institution' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Institution Information</h2>
                      <p className="text-gray-400">Tell us about your educational institution</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Institution Name *
                      </label>
                      <input
                        type="text"
                        value={formData.institutionName}
                        onChange={(e) => updateField('institutionName', e.target.value)}
                        placeholder="e.g., Stanford University"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Institution Type *
                      </label>
                      <select
                        value={formData.institutionType}
                        onChange={(e) => updateField('institutionType', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      >
                        <option value="">Select type...</option>
                        {INSTITUTION_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Website *
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => updateField('website', e.target.value)}
                          placeholder="https://www.example.edu"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Year Established
                      </label>
                      <input
                        type="text"
                        value={formData.yearEstablished}
                        onChange={(e) => updateField('yearEstablished', e.target.value)}
                        placeholder="e.g., 1891"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Accreditation Body *
                      </label>
                      <input
                        type="text"
                        value={formData.accreditationBody}
                        onChange={(e) => updateField('accreditationBody', e.target.value)}
                        placeholder="e.g., ABET, AACSB, regional accreditor"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tax ID / EIN (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.taxId}
                        onChange={(e) => updateField('taxId', e.target.value)}
                        placeholder="XX-XXXXXXX"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* National Labs / Research Specific Fields */}
                  {(formData.institutionType === 'national_lab' || formData.institutionType === 'ffrdc') && (
                    <div className="mt-8 p-6 bg-amber-900/20 border border-amber-500/30 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Atom className="w-6 h-6 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">Research Facility Details</h3>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            <Lock className="inline w-4 h-4 mr-2" />
                            Security Clearance Levels Available
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {CLEARANCE_LEVELS.map((level) => (
                              <button
                                key={level.value}
                                type="button"
                                onClick={() => toggleArrayItem('clearanceLevels', level.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.clearanceLevels.includes(level.value)
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                              >
                                {level.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            Primary Research Areas
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {RESEARCH_AREAS.map((area) => (
                              <button
                                key={area}
                                type="button"
                                onClick={() => toggleArrayItem('researchAreas', area)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.researchAreas.includes(area)
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                              >
                                {area}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Primary Funding Agencies
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {FUNDING_AGENCIES.map((agency) => (
                                <button
                                  key={agency}
                                  type="button"
                                  onClick={() => toggleArrayItem('fundingAgencies', agency)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    formData.fundingAgencies.includes(agency)
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                  }`}
                                >
                                  {agency}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Internships / Fellowships per Year
                            </label>
                            <input
                              type="text"
                              value={formData.internshipsPerYear}
                              onChange={(e) => updateField('internshipsPerYear', e.target.value)}
                              placeholder="e.g., 150"
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informal Education Specific Fields */}
                  {(formData.institutionType === 'science_museum' ||
                    formData.institutionType === 'stem_camp' ||
                    formData.institutionType === 'afterschool' ||
                    formData.institutionType === 'makerspace') && (
                    <div className="mt-8 p-6 bg-pink-900/20 border border-pink-500/30 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Microscope className="w-6 h-6 text-pink-400" />
                        <h3 className="text-lg font-semibold text-white">Informal Education Details</h3>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            Age Groups Served
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {AGE_GROUPS.map((group) => (
                              <button
                                key={group.value}
                                type="button"
                                onClick={() => toggleArrayItem('ageGroups', group.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.ageGroups.includes(group.value)
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                              >
                                {group.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Participants per Year
                            </label>
                            <input
                              type="text"
                              value={formData.participantsPerYear}
                              onChange={(e) => updateField('participantsPerYear', e.target.value)}
                              placeholder="e.g., 10,000"
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Program Features
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.parentEngagement}
                              onChange={(e) => updateField('parentEngagement', e.target.checked)}
                              className="w-5 h-5 rounded border-gray-600 text-pink-600 focus:ring-pink-500"
                            />
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-pink-400" />
                              <span className="text-white">Parent & Family Engagement Programs</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.grantFunded}
                              onChange={(e) => updateField('grantFunded', e.target.checked)}
                              className="w-5 h-5 rounded border-gray-600 text-pink-600 focus:ring-pink-500"
                            />
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-pink-400" />
                              <span className="text-white">Grant-Funded Programs (NSF, DOE, etc.)</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.stemEcosystem}
                              onChange={(e) => updateField('stemEcosystem', e.target.checked)}
                              className="w-5 h-5 rounded border-gray-600 text-pink-600 focus:ring-pink-500"
                            />
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-pink-400" />
                              <span className="text-white">Part of STEM Learning Ecosystem</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Contact Information</h2>
                      <p className="text-gray-400">Primary contact for partnership communications</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.contactFirstName}
                        onChange={(e) => updateField('contactFirstName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.contactLastName}
                        onChange={(e) => updateField('contactLastName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        value={formData.contactTitle}
                        onChange={(e) => updateField('contactTitle', e.target.value)}
                        placeholder="e.g., Director of Career Services"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => updateField('contactEmail', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => updateField('contactPhone', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Street Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => updateField('address', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => updateField('zipCode', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Programs Section */}
              {activeSection === 'programs' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Programs & Focus Areas</h2>
                      <p className="text-gray-400">List your STEM programs and areas of expertise</p>
                    </div>
                  </div>

                  {/* Add Program Form */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Add a Program</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        value={newProgram.name}
                        onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                        placeholder="Program Name"
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 transition-colors"
                      />
                      <select
                        value={newProgram.type}
                        onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Program Type</option>
                        {PROGRAM_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newProgram.duration}
                        onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
                        placeholder="Duration (e.g., 4 years)"
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 transition-colors"
                      />
                      <select
                        value={newProgram.format}
                        onChange={(e) => setNewProgram({ ...newProgram, format: e.target.value })}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Format</option>
                        {PROGRAM_FORMATS.map((format) => (
                          <option key={format} value={format}>{format}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newProgram.enrollmentSize}
                        onChange={(e) => setNewProgram({ ...newProgram, enrollmentSize: e.target.value })}
                        placeholder="Annual Enrollment"
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 transition-colors"
                      />
                      <button
                        onClick={addProgram}
                        disabled={!newProgram.name || !newProgram.type}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Add Program
                      </button>
                    </div>
                  </div>

                  {/* Added Programs */}
                  {formData.programs.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Your Programs ({formData.programs.length})</h3>
                      <div className="grid gap-3">
                        {formData.programs.map((program, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl p-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-indigo-400" />
                              </div>
                              <div>
                                <div className="font-medium text-white">{program.name}</div>
                                <div className="text-sm text-gray-400">
                                  {program.type} • {program.duration} • {program.format}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeProgram(idx)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Focus Areas */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Focus Areas</h3>
                    <p className="text-sm text-gray-400 mb-4">Select the areas your programs cover</p>
                    <div className="flex flex-wrap gap-2">
                      {FOCUS_AREAS.map((area) => (
                        <button
                          key={area}
                          onClick={() => toggleArrayItem('focusAreas', area)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.focusAreas.includes(area)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Industries */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Target Industries</h3>
                    <p className="text-sm text-gray-400 mb-4">Which industries do your graduates typically enter?</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {INDUSTRIES.map((industry) => (
                        <button
                          key={industry.id}
                          onClick={() => toggleArrayItem('industries', industry.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                            formData.industries.includes(industry.id)
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-2xl">{industry.icon}</span>
                          <span className="text-sm font-medium">{industry.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Outcomes Section */}
              {activeSection === 'outcomes' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Student Outcomes</h2>
                      <p className="text-gray-400">Share your current outcome metrics</p>
                    </div>
                  </div>

                  <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        This data helps us match your institution with appropriate employers and provide
                        benchmarking insights. All data is kept confidential and used only for partnership optimization.
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Total STEM Enrollment *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={formData.totalEnrollment}
                          onChange={(e) => updateField('totalEnrollment', e.target.value)}
                          placeholder="e.g., 5,000"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Graduation Rate *
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={formData.graduationRate}
                          onChange={(e) => updateField('graduationRate', e.target.value)}
                          placeholder="e.g., 92%"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Placement Rate *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={formData.placementRate}
                          onChange={(e) => updateField('placementRate', e.target.value)}
                          placeholder="e.g., 94%"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Average Starting Salary
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={formData.averageSalary}
                          onChange={(e) => updateField('averageSalary', e.target.value)}
                          placeholder="e.g., $85,000"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Employer Partners
                      </label>
                      <input
                        type="text"
                        value={formData.employerPartners}
                        onChange={(e) => updateField('employerPartners', e.target.value)}
                        placeholder="e.g., Google, Microsoft, Intel, Boeing..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                      <p className="mt-2 text-sm text-gray-500">List some of your top recruiting partners (comma separated)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Goals Section */}
              {activeSection === 'goals' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Partnership Goals</h2>
                      <p className="text-gray-400">What do you hope to achieve through this partnership?</p>
                    </div>
                  </div>

                  {/* Partnership Goals */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Primary Goals</h3>
                    <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {PARTNERSHIP_GOALS.map((goal) => (
                        <button
                          key={goal}
                          onClick={() => toggleArrayItem('partnershipGoals', goal)}
                          className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                            formData.partnershipGoals.includes(goal)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${
                            formData.partnershipGoals.includes(goal) ? 'text-white' : 'text-gray-500'
                          }`} />
                          <span className="text-sm font-medium">{goal}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Desired Services */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Desired Services</h3>
                    <p className="text-sm text-gray-400 mb-4">Which services are most important to you?</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {DESIRED_SERVICES.map((service) => (
                        <button
                          key={service}
                          onClick={() => toggleArrayItem('desiredServices', service)}
                          className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                            formData.desiredServices.includes(service)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${
                            formData.desiredServices.includes(service) ? 'text-white' : 'text-gray-500'
                          }`} />
                          <span className="text-sm font-medium">{service}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Desired Partnership Start
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <select
                        value={formData.timeline}
                        onChange={(e) => updateField('timeline', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      >
                        <option value="">Select timeline...</option>
                        <option value="immediately">Immediately</option>
                        <option value="this_month">This Month</option>
                        <option value="next_quarter">Next Quarter</option>
                        <option value="next_semester">Next Semester</option>
                        <option value="next_year">Next Academic Year</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => updateField('additionalInfo', e.target.value)}
                      placeholder="Any other information you'd like to share about your institution or partnership goals..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Footer */}
          <div className="px-8 py-6 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={() => navigateSection('prev')}
              disabled={currentSectionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-medium rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-4">
              {currentSectionIndex < sections.length - 1 ? (
                <button
                  onClick={() => navigateSection('next')}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={totalCompletion < 60}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
                >
                  <FileCheck className="w-5 h-5" />
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400 mb-4">
            Need help with your application? Our partnership team is here to assist.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:partners@stemworkforce.net"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              partners@stemworkforce.net
            </a>
            <a
              href="tel:+18005551234"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Phone className="w-4 h-4" />
              (800) 555-1234
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPartnersOnboardingPage;
