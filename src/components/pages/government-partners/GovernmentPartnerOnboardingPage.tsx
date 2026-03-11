// ===========================================
// Government Partner Onboarding Page
// Dynamic multi-step form with horizontal navigation
// ===========================================

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  FileCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Landmark,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Target,
  DollarSign,
  Shield,
  CheckCircle2,
  ClipboardList,
  Edit3
} from 'lucide-react';

// ===========================================
// FORM TYPES
// ===========================================
interface WorkforceProgramInfo {
  name: string;
  type: string;
  fundingSource: string;
  totalBudget: string;
  enrollmentTarget: string;
  placementTarget: string;
  industryFocusAreas: string[];
}

interface FormData {
  // Agency Info
  agencyName: string;
  agencyType: string;
  agencyLevel: string;
  agencyCode: string;
  jurisdiction: string;
  coveredPopulation: string;
  annualBudget: string;
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
  // Programs
  programs: WorkforceProgramInfo[];
  // Partnership Goals
  partnershipGoals: string[];
  additionalInfo: string;
}

// ===========================================
// SECTIONS CONFIGURATION
// ===========================================
const sections = [
  { id: 'agency', label: 'Agency', icon: Landmark },
  { id: 'contact', label: 'Contact', icon: Users },
  { id: 'programs', label: 'Programs', icon: BookOpen },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'review', label: 'Review', icon: ClipboardList }
];

// ===========================================
// DROPDOWN OPTIONS
// ===========================================
const AGENCY_TYPES = [
  { value: 'federal_agency', label: 'Federal Agency' },
  { value: 'state_agency', label: 'State Agency' },
  { value: 'workforce_board', label: 'Workforce Development Board' },
  { value: 'economic_development', label: 'Economic Development Agency' },
  { value: 'education_department', label: 'Education Department' },
  { value: 'defense', label: 'Defense Agency' },
  { value: 'intelligence', label: 'Intelligence Community' },
  { value: 'research_lab', label: 'National Research Laboratory' }
];

const AGENCY_LEVELS = [
  { value: 'federal', label: 'Federal' },
  { value: 'state', label: 'State' },
  { value: 'local', label: 'Local / County / City' },
  { value: 'tribal', label: 'Tribal' }
];

const PROGRAM_TYPES = [
  'WIOA Title I',
  'WIOA Title II',
  'WIOA Title III',
  'WIOA Title IV',
  'CHIPS Act',
  'NSF Program',
  'DOL ETA',
  'State Grant',
  'Federal Grant',
  'Apprenticeship',
  'Regional Workforce',
  'CTE Program',
  'Other'
];

const FUNDING_SOURCES = [
  'Federal',
  'State',
  'Regional',
  'Local',
  'Mixed',
  'Private',
  'CHIPS Act',
  'WIOA Title I',
  'WIOA Title II',
  'WIOA Title III',
  'WIOA Title IV'
];

const INDUSTRY_FOCUS_AREAS = [
  { id: 'semiconductor', label: 'Semiconductor Manufacturing' },
  { id: 'advanced_manufacturing', label: 'Advanced Manufacturing' },
  { id: 'ai_ml', label: 'AI & Machine Learning' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'clean_energy', label: 'Clean Energy & Sustainability' },
  { id: 'healthcare', label: 'Healthcare & Life Sciences' },
  { id: 'aerospace_defense', label: 'Aerospace & Defense' },
  { id: 'quantum', label: 'Quantum Technologies' },
  { id: 'biotech', label: 'Biotechnology' },
  { id: 'nuclear', label: 'Nuclear Technologies' },
  { id: 'robotics', label: 'Robotics & Automation' },
  { id: 'it_services', label: 'IT & Software Services' }
];

const PARTNERSHIP_GOALS = [
  { id: 'talent_pipeline', label: 'Talent Pipeline Development', description: 'Build skilled workforce pipelines for critical industries' },
  { id: 'chips_compliance', label: 'CHIPS Act Compliance', description: 'Meet CHIPS & Science Act workforce requirements and reporting' },
  { id: 'workforce_analytics', label: 'Workforce Data Analytics', description: 'Access real-time labor market intelligence and skills gap analysis' },
  { id: 'employer_engagement', label: 'Employer Engagement', description: 'Connect employers with training programs and participants' },
  { id: 'grant_reporting', label: 'Grant Reporting Automation', description: 'Streamline federal and state compliance reporting workflows' },
  { id: 'economic_impact', label: 'Economic Impact Measurement', description: 'Quantify ROI and economic outcomes of workforce programs' },
  { id: 'veteran_services', label: 'Veteran Services', description: 'Support veteran transitions and OFCCP compliance tracking' }
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================
const getSectionCompletion = (sectionId: string, data: FormData): number => {
  switch (sectionId) {
    case 'agency': {
      const fields = [data.agencyName, data.agencyType, data.agencyLevel, data.jurisdiction];
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
      return hasPrograms ? 100 : 0;
    }
    case 'goals': {
      const hasGoals = data.partnershipGoals.length > 0;
      return hasGoals ? 100 : 0;
    }
    case 'review': {
      // Review is complete when all other sections have some progress
      const otherSections = ['agency', 'contact', 'programs', 'goals'];
      const allStarted = otherSections.every(s => getSectionCompletion(s, data) > 0);
      return allStarted ? 100 : 0;
    }
    default:
      return 0;
  }
};

const getTotalCompletion = (data: FormData): number => {
  const scoreSections = sections.filter(s => s.id !== 'review');
  const sectionScores = scoreSections.map(s => getSectionCompletion(s.id, data));
  return Math.round(sectionScores.reduce((a, b) => a + b, 0) / scoreSections.length);
};

const getAgencyTypeLabel = (value: string): string => {
  return AGENCY_TYPES.find(t => t.value === value)?.label || value;
};

const getAgencyLevelLabel = (value: string): string => {
  return AGENCY_LEVELS.find(l => l.value === value)?.label || value;
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const GovernmentPartnerOnboardingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('agency');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    agencyName: '',
    agencyType: '',
    agencyLevel: '',
    agencyCode: '',
    jurisdiction: '',
    coveredPopulation: '',
    annualBudget: '',
    contactFirstName: '',
    contactLastName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    programs: [],
    partnershipGoals: [],
    additionalInfo: ''
  });

  const [newProgram, setNewProgram] = useState<WorkforceProgramInfo>({
    name: '',
    type: '',
    fundingSource: '',
    totalBudget: '',
    enrollmentTarget: '',
    placementTarget: '',
    industryFocusAreas: []
  });

  const updateField = useCallback((field: keyof FormData, value: string | string[] | WorkforceProgramInfo[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleGoal = useCallback((goalId: string) => {
    setFormData(prev => {
      const arr = prev.partnershipGoals;
      if (arr.includes(goalId)) {
        return { ...prev, partnershipGoals: arr.filter(i => i !== goalId) };
      } else {
        return { ...prev, partnershipGoals: [...arr, goalId] };
      }
    });
  }, []);

  const toggleProgramIndustry = useCallback((industryId: string) => {
    setNewProgram(prev => {
      const arr = prev.industryFocusAreas;
      if (arr.includes(industryId)) {
        return { ...prev, industryFocusAreas: arr.filter(i => i !== industryId) };
      } else {
        return { ...prev, industryFocusAreas: [...arr, industryId] };
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
        fundingSource: '',
        totalBudget: '',
        enrollmentTarget: '',
        placementTarget: '',
        industryFocusAreas: []
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
    try {
      const { createGovernmentPartner } = await import('@/services/governmentPartnerApi');
      const result = await createGovernmentPartner({
        userId: '',
        agencyName: formData.agencyName,
        agencyType: (formData.agencyType || 'other') as 'workforce_board' | 'federal_agency' | 'state_agency' | 'economic_development' | 'education_department' | 'labor_department' | 'chips_designated' | 'other',
        agencyLevel: (formData.agencyLevel || 'state') as 'federal' | 'state' | 'regional' | 'county' | 'city',
        agencyCode: formData.agencyCode || undefined,
        city: formData.city,
        state: formData.state,
        region: formData.jurisdiction,
        tier: 'basic',
        status: 'pending',
        primaryContactName: `${formData.contactFirstName} ${formData.contactLastName}`,
        primaryContactEmail: formData.contactEmail,
        primaryContactPhone: formData.contactPhone || undefined,
        primaryContactTitle: formData.contactTitle || undefined,
        jurisdiction: formData.jurisdiction || undefined,
        coveredPopulation: formData.coveredPopulation ? parseInt(formData.coveredPopulation.replace(/,/g, ''), 10) : undefined,
        annualBudget: formData.annualBudget ? parseInt(formData.annualBudget.replace(/[$,]/g, ''), 10) : undefined,
        subscriptionStatus: 'active',
      });
      if (!result) {
        throw new Error('Failed to create government partner');
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting government partner application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const totalCompletion = getTotalCompletion(formData);
  const currentSectionIndex = sections.findIndex(s => s.id === activeSection);

  // ===========================================
  // SUCCESS SCREEN
  // ===========================================
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto px-4 text-center"
        >
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Application Submitted</h1>
          <p className="text-gray-400 mb-2">
            Thank you for applying to become a Government Partner with STEMWorkforce.
          </p>
          <p className="text-gray-400 mb-8">
            Our government partnerships team will review your application and respond within 3-5 business days. You will receive a confirmation email at <span className="text-indigo-400">{formData.contactEmail}</span>.
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">What Happens Next</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">Application review by our government partnerships team</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">Verification of agency credentials and authorization</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">Onboarding call to configure your dashboard and programs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">Full access to workforce analytics and reporting tools</span>
              </li>
            </ul>
          </div>
          <Link
            to="/government-partners/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/government-partners"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Government Partners
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Government Partner Application</h1>
              <p className="text-gray-400">Join our network to enhance workforce development programs and outcomes</p>
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
                    stroke="#10b981"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${totalCompletion * 1.76} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <Landmark className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/30'
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'
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
              {/* Agency Information Section */}
              {activeSection === 'agency' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Landmark className="w-8 h-8 text-emerald-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Agency Information</h2>
                      <p className="text-gray-400">Tell us about your government agency or organization</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Agency Name *
                      </label>
                      <input
                        type="text"
                        value={formData.agencyName}
                        onChange={(e) => updateField('agencyName', e.target.value)}
                        placeholder="e.g., Ohio Department of Job and Family Services"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Agency Type *
                      </label>
                      <select
                        value={formData.agencyType}
                        onChange={(e) => updateField('agencyType', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      >
                        <option value="">Select agency type...</option>
                        {AGENCY_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Agency Level *
                      </label>
                      <select
                        value={formData.agencyLevel}
                        onChange={(e) => updateField('agencyLevel', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      >
                        <option value="">Select level...</option>
                        {AGENCY_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Agency Code
                      </label>
                      <input
                        type="text"
                        value={formData.agencyCode}
                        onChange={(e) => updateField('agencyCode', e.target.value)}
                        placeholder="e.g., DOE, DOL, NSF"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Jurisdiction *
                      </label>
                      <input
                        type="text"
                        value={formData.jurisdiction}
                        onChange={(e) => updateField('jurisdiction', e.target.value)}
                        placeholder="e.g., State of Ohio, Region 5, Nationwide"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Covered Population
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={formData.coveredPopulation}
                          onChange={(e) => updateField('coveredPopulation', e.target.value)}
                          placeholder="e.g., 11,800,000"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Annual Budget
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={formData.annualBudget}
                          onChange={(e) => updateField('annualBudget', e.target.value)}
                          placeholder="e.g., $50,000,000"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-8 h-8 text-emerald-400" />
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
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                        placeholder="e.g., Director of Workforce Programs"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => updateField('zipCode', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Programs Section */}
              {activeSection === 'programs' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-8 h-8 text-emerald-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Workforce Programs</h2>
                      <p className="text-gray-400">Add the workforce development programs you manage</p>
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
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 transition-colors"
                      />
                      <select
                        value={newProgram.type}
                        onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-emerald-500 transition-colors"
                      >
                        <option value="">Program Type</option>
                        {PROGRAM_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <select
                        value={newProgram.fundingSource}
                        onChange={(e) => setNewProgram({ ...newProgram, fundingSource: e.target.value })}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-emerald-500 transition-colors"
                      >
                        <option value="">Funding Source</option>
                        {FUNDING_SOURCES.map((source) => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={newProgram.totalBudget}
                          onChange={(e) => setNewProgram({ ...newProgram, totalBudget: e.target.value })}
                          placeholder="Total Budget"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <input
                        type="text"
                        value={newProgram.enrollmentTarget}
                        onChange={(e) => setNewProgram({ ...newProgram, enrollmentTarget: e.target.value })}
                        placeholder="Enrollment Target"
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 transition-colors"
                      />
                      <input
                        type="text"
                        value={newProgram.placementTarget}
                        onChange={(e) => setNewProgram({ ...newProgram, placementTarget: e.target.value })}
                        placeholder="Placement Target (%)"
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    {/* Industry Focus Areas for the new program */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Industry Focus Areas
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {INDUSTRY_FOCUS_AREAS.map((industry) => (
                          <button
                            key={industry.id}
                            type="button"
                            onClick={() => toggleProgramIndustry(industry.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              newProgram.industryFocusAreas.includes(industry.id)
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            {industry.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={addProgram}
                      disabled={!newProgram.name || !newProgram.type}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Program
                    </button>
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
                              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <div className="font-medium text-white">{program.name}</div>
                                <div className="text-sm text-gray-400">
                                  {program.type}
                                  {program.fundingSource && ` \u2022 ${program.fundingSource}`}
                                  {program.totalBudget && ` \u2022 $${program.totalBudget}`}
                                </div>
                                {program.industryFocusAreas.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {program.industryFocusAreas.map(id => {
                                      const area = INDUSTRY_FOCUS_AREAS.find(a => a.id === id);
                                      return area ? (
                                        <span key={id} className="text-xs bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded">
                                          {area.label}
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                )}
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
                </div>
              )}

              {/* Goals Section */}
              {activeSection === 'goals' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-emerald-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Partnership Goals</h2>
                      <p className="text-gray-400">What do you hope to achieve through this partnership?</p>
                    </div>
                  </div>

                  {/* Partnership Goals */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Select Your Goals</h3>
                    <p className="text-sm text-gray-400 mb-4">Choose all that align with your agency priorities</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {PARTNERSHIP_GOALS.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
                            formData.partnershipGoals.includes(goal.id)
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            formData.partnershipGoals.includes(goal.id) ? 'text-white' : 'text-gray-500'
                          }`} />
                          <div>
                            <span className="text-sm font-medium block">{goal.label}</span>
                            <span className={`text-xs mt-1 block ${
                              formData.partnershipGoals.includes(goal.id) ? 'text-emerald-100' : 'text-gray-500'
                            }`}>
                              {goal.description}
                            </span>
                          </div>
                        </button>
                      ))}
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
                      placeholder="Any additional context about your agency's workforce development priorities, upcoming initiatives, or specific requirements..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Review Section */}
              {activeSection === 'review' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <ClipboardList className="w-8 h-8 text-emerald-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Review & Submit</h2>
                      <p className="text-gray-400">Review your application before submitting</p>
                    </div>
                  </div>

                  {/* Agency Info Summary */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-emerald-400" />
                        Agency Information
                      </h3>
                      <button
                        onClick={() => setActiveSection('agency')}
                        className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Agency Name:</span>
                        <span className="ml-2 text-white">{formData.agencyName || '---'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Agency Type:</span>
                        <span className="ml-2 text-white">{formData.agencyType ? getAgencyTypeLabel(formData.agencyType) : '---'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Agency Level:</span>
                        <span className="ml-2 text-white">{formData.agencyLevel ? getAgencyLevelLabel(formData.agencyLevel) : '---'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Agency Code:</span>
                        <span className="ml-2 text-white">{formData.agencyCode || '---'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Jurisdiction:</span>
                        <span className="ml-2 text-white">{formData.jurisdiction || '---'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Covered Population:</span>
                        <span className="ml-2 text-white">{formData.coveredPopulation || '---'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Annual Budget:</span>
                        <span className="ml-2 text-white">{formData.annualBudget || '---'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Summary */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-400" />
                        Contact Information
                      </h3>
                      <button
                        onClick={() => setActiveSection('contact')}
                        className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2 text-white">
                          {formData.contactFirstName || formData.contactLastName
                            ? `${formData.contactFirstName} ${formData.contactLastName}`.trim()
                            : '---'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Title:</span>
                        <span className="ml-2 text-white">{formData.contactTitle || '---'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 text-white">{formData.contactEmail || '---'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 text-white">{formData.contactPhone || '---'}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-500">Address:</span>
                        <span className="ml-2 text-white">
                          {formData.address || formData.city || formData.state
                            ? [formData.address, formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')
                            : '---'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Programs Summary */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        Workforce Programs ({formData.programs.length})
                      </h3>
                      <button
                        onClick={() => setActiveSection('programs')}
                        className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                    {formData.programs.length > 0 ? (
                      <div className="space-y-3">
                        {formData.programs.map((program, idx) => (
                          <div key={idx} className="bg-gray-900 rounded-lg p-4">
                            <div className="font-medium text-white">{program.name}</div>
                            <div className="text-sm text-gray-400 mt-1">
                              {program.type}
                              {program.fundingSource && ` \u2022 Funded by: ${program.fundingSource}`}
                              {program.totalBudget && ` \u2022 Budget: $${program.totalBudget}`}
                            </div>
                            <div className="text-sm text-gray-400">
                              {program.enrollmentTarget && `Enrollment Target: ${program.enrollmentTarget}`}
                              {program.placementTarget && ` \u2022 Placement Target: ${program.placementTarget}%`}
                            </div>
                            {program.industryFocusAreas.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {program.industryFocusAreas.map(id => {
                                  const area = INDUSTRY_FOCUS_AREAS.find(a => a.id === id);
                                  return area ? (
                                    <span key={id} className="text-xs bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded">
                                      {area.label}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No programs added yet.</p>
                    )}
                  </div>

                  {/* Goals Summary */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-400" />
                        Partnership Goals
                      </h3>
                      <button
                        onClick={() => setActiveSection('goals')}
                        className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                    {formData.partnershipGoals.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.partnershipGoals.map(goalId => {
                          const goal = PARTNERSHIP_GOALS.find(g => g.id === goalId);
                          return goal ? (
                            <span key={goalId} className="px-3 py-1.5 bg-emerald-900/40 text-emerald-300 rounded-lg text-sm font-medium">
                              {goal.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No goals selected yet.</p>
                    )}
                    {formData.additionalInfo && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <span className="text-gray-500 text-sm">Additional Notes:</span>
                        <p className="text-gray-300 text-sm mt-1">{formData.additionalInfo}</p>
                      </div>
                    )}
                  </div>

                  {/* Completion Warning */}
                  {totalCompletion < 60 && (
                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                          Your application is <span className="text-amber-400 font-semibold">{totalCompletion}%</span> complete.
                          Please fill in the required fields in each section to reach at least 60% before submitting.
                        </div>
                      </div>
                    </div>
                  )}
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
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
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
            Need help with your application? Our government partnerships team is here to assist.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:government@stemworkforce.net"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              government@stemworkforce.net
            </a>
            <a
              href="tel:+18005551234"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
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

export default GovernmentPartnerOnboardingPage;
