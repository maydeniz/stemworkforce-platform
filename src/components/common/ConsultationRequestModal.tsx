// ===========================================
// Consultation Request Modal
// ===========================================
// Multi-step modal for collecting consultation request details
// after user authentication
// ===========================================

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  MessageSquare,
  Target,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Users,
  Clock,
  DollarSign,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts';
import { useFocusTrap, useKeyPress } from '@/hooks';
import type {
  ConsultationRequestFormData,
  OrganizationType,
  BudgetRange,
  ConsultationTimeline,
  EngagementType,
  IndustryType
} from '@/types';

// ===========================================
// TYPES
// ===========================================

interface ConsultationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  industry?: IndustryType;
  serviceType?: string;
  serviceName?: string;
  onSuccess?: () => void;
}

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

// ===========================================
// CONSTANTS
// ===========================================

const STEPS: Step[] = [
  { id: 1, label: 'Organization', icon: <Building2 className="w-4 h-4" /> },
  { id: 2, label: 'Details', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 3, label: 'Scope', icon: <Target className="w-4 h-4" /> },
  { id: 4, label: 'Review', icon: <CheckCircle2 className="w-4 h-4" /> },
];

const ORGANIZATION_TYPES: { value: OrganizationType; label: string }[] = [
  { value: 'startup', label: 'Startup (< 50 employees)' },
  { value: 'smb', label: 'Small/Medium Business (50-500)' },
  { value: 'enterprise', label: 'Enterprise (500+)' },
  { value: 'government', label: 'Government Agency' },
  { value: 'nonprofit', label: 'Nonprofit Organization' },
  { value: 'academic', label: 'Academic Institution' },
];

const ORGANIZATION_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
];

const BUDGET_RANGES: { value: BudgetRange; label: string }[] = [
  { value: 'under-50k', label: 'Under $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: '100k-250k', label: '$100,000 - $250,000' },
  { value: '250k-500k', label: '$250,000 - $500,000' },
  { value: 'over-500k', label: 'Over $500,000' },
];

const TIMELINES: { value: ConsultationTimeline; label: string }[] = [
  { value: 'asap', label: 'ASAP - Urgent need' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-12-months', label: '6-12 months' },
  { value: 'flexible', label: 'Flexible timeline' },
];

const ENGAGEMENT_TYPES: { value: EngagementType; label: string; description: string }[] = [
  { value: 'advisory', label: 'Strategic Advisory', description: 'Expert guidance and recommendations' },
  { value: 'implementation', label: 'Implementation', description: 'Hands-on project execution' },
  { value: 'training', label: 'Training & Workshops', description: 'Team education and upskilling' },
  { value: 'audit', label: 'Assessment & Audit', description: 'Evaluate current state and gaps' },
  { value: 'custom', label: 'Custom Engagement', description: 'Tailored to specific needs' },
];

const COMMON_CHALLENGES = [
  'Talent acquisition & retention',
  'Technology selection & evaluation',
  'Strategy development',
  'Process optimization',
  'Regulatory compliance',
  'Digital transformation',
  'Scaling operations',
  'Cost reduction',
  'Skills gap analysis',
  'Vendor/partner selection',
];

const COMMON_OUTCOMES = [
  'Clear strategic roadmap',
  'Improved operational efficiency',
  'Reduced costs',
  'Faster time-to-market',
  'Better talent pipeline',
  'Technology implementation',
  'Risk mitigation',
  'Competitive advantage',
  'Team upskilling',
  'Process documentation',
];

const INDUSTRIES: { value: IndustryType; label: string; icon: string }[] = [
  { value: 'semiconductor', label: 'Semiconductor', icon: '💎' },
  { value: 'nuclear', label: 'Nuclear Energy', icon: '☢️' },
  { value: 'ai', label: 'AI & Machine Learning', icon: '🤖' },
  { value: 'quantum', label: 'Quantum Technologies', icon: '⚛️' },
  { value: 'cybersecurity', label: 'Cybersecurity', icon: '🛡️' },
  { value: 'aerospace', label: 'Aerospace & Defense', icon: '🚀' },
  { value: 'biotech', label: 'Biotechnology', icon: '🧬' },
  { value: 'healthcare', label: 'Healthcare & Medical Technology', icon: '🏥' },
  { value: 'robotics', label: 'Robotics & Automation', icon: '🦾' },
  { value: 'clean-energy', label: 'Clean Energy', icon: '⚡' },
  { value: 'manufacturing', label: 'Advanced Manufacturing', icon: '🏭' },
];

// ===========================================
// INITIAL STATE
// ===========================================

const getInitialFormData = (industry?: IndustryType, serviceType?: string): ConsultationRequestFormData => ({
  organizationName: '',
  organizationType: '',
  organizationSize: '',
  industry: industry || '',
  serviceType: serviceType || '',
  needsDescription: '',
  challenges: [],
  desiredOutcomes: [],
  budgetRange: '',
  timeline: '',
  teamSize: '',
  engagementType: '',
  additionalNotes: '',
});

// ===========================================
// COMPONENT
// ===========================================

export const ConsultationRequestModal: React.FC<ConsultationRequestModalProps> = ({
  isOpen,
  onClose,
  industry,
  serviceType,
  serviceName,
  onSuccess,
}) => {
  const { user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ConsultationRequestFormData>(
    getInitialFormData(industry, serviceType)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Focus trap and escape key
  useFocusTrap(modalRef, isOpen);
  useKeyPress('Escape', () => {
    if (isOpen && !isSubmitting) onClose();
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(industry, serviceType));
      setCurrentStep(1);
      setIsSuccess(false);
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, industry, serviceType]);

  // Pre-fill organization name from user profile
  useEffect(() => {
    if (user?.user_metadata?.organization_name && !formData.organizationName) {
      setFormData(prev => ({
        ...prev,
        organizationName: user.user_metadata.organization_name,
      }));
    }
  }, [user, formData.organizationName]);

  // ===========================================
  // HANDLERS
  // ===========================================

  const updateField = useCallback((field: keyof ConsultationRequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const toggleArrayItem = useCallback((field: 'challenges' | 'desiredOutcomes', item: string) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...arr, item] };
    });
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.organizationName.trim()) {
          newErrors.organizationName = 'Organization name is required';
        }
        if (!formData.organizationType) {
          newErrors.organizationType = 'Organization type is required';
        }
        if (!formData.industry) {
          newErrors.industry = 'Industry is required';
        }
        break;
      case 2:
        if (!formData.needsDescription.trim()) {
          newErrors.needsDescription = 'Please describe your needs';
        } else if (formData.needsDescription.length < 50) {
          newErrors.needsDescription = 'Please provide more detail (at least 50 characters)';
        }
        break;
      case 3:
        if (!formData.budgetRange) {
          newErrors.budgetRange = 'Budget range is required';
        }
        if (!formData.timeline) {
          newErrors.timeline = 'Timeline is required';
        }
        if (!formData.engagementType) {
          newErrors.engagementType = 'Engagement type is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      // TODO: Submit to Supabase
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Consultation Request Submitted:', {
        ...formData,
        userId: user?.id,
        status: 'submitted',
        createdAt: new Date().toISOString(),
      });

      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit consultation request:', error);
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, user, validateStep, onSuccess]);

  // ===========================================
  // RENDER
  // ===========================================

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Success State */}
        {isSuccess ? (
          <SuccessState onClose={onClose} />
        ) : (
          <>
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Request Consultation</h2>
                  {serviceName && (
                    <p className="text-sm text-gray-400 mt-1">{serviceName}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2">
                {STEPS.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                      disabled={step.id > currentStep}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                        step.id === currentStep
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : step.id < currentStep
                          ? 'bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        step.icon
                      )}
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                    {idx < STEPS.length - 1 && (
                      <div className={`w-8 h-0.5 ${
                        step.id < currentStep ? 'bg-green-500/50' : 'bg-gray-700'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && (
                    <Step1Organization
                      formData={formData}
                      updateField={updateField}
                      errors={errors}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2Details
                      formData={formData}
                      updateField={updateField}
                      toggleArrayItem={toggleArrayItem}
                      errors={errors}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3Scope
                      formData={formData}
                      updateField={updateField}
                      errors={errors}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4Review
                      formData={formData}
                      updateField={updateField}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-800 bg-gray-900/50">
              {errors.submit && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Submit Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );

  return createPortal(
    <AnimatePresence>{modalContent}</AnimatePresence>,
    document.body
  );
};

// ===========================================
// STEP COMPONENTS
// ===========================================

interface StepProps {
  formData: ConsultationRequestFormData;
  updateField: (field: keyof ConsultationRequestFormData, value: any) => void;
  errors: Record<string, string>;
}

const Step1Organization: React.FC<StepProps> = ({ formData, updateField, errors }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">Tell us about your organization</h3>
      <p className="text-sm text-gray-400">This helps us match you with the right consultants</p>
    </div>

    {/* Organization Name */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Organization Name <span className="text-red-400">*</span>
      </label>
      <input
        type="text"
        value={formData.organizationName}
        onChange={(e) => updateField('organizationName', e.target.value)}
        placeholder="Enter your organization name"
        className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-colors ${
          errors.organizationName ? 'border-red-500' : 'border-gray-700'
        }`}
      />
      {errors.organizationName && (
        <p className="mt-1 text-sm text-red-400">{errors.organizationName}</p>
      )}
    </div>

    {/* Organization Type */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Organization Type <span className="text-red-400">*</span>
      </label>
      <select
        value={formData.organizationType}
        onChange={(e) => updateField('organizationType', e.target.value)}
        className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-colors ${
          errors.organizationType ? 'border-red-500' : 'border-gray-700'
        }`}
      >
        <option value="">Select organization type</option>
        {ORGANIZATION_TYPES.map((type) => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
      {errors.organizationType && (
        <p className="mt-1 text-sm text-red-400">{errors.organizationType}</p>
      )}
    </div>

    {/* Organization Size */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Organization Size
      </label>
      <select
        value={formData.organizationSize}
        onChange={(e) => updateField('organizationSize', e.target.value)}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <option value="">Select size</option>
        {ORGANIZATION_SIZES.map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>

    {/* Industry */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Industry <span className="text-red-400">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind.value}
            type="button"
            onClick={() => updateField('industry', ind.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              formData.industry === ind.value
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            <span>{ind.icon}</span>
            <span className="truncate">{ind.label}</span>
          </button>
        ))}
      </div>
      {errors.industry && (
        <p className="mt-1 text-sm text-red-400">{errors.industry}</p>
      )}
    </div>
  </div>
);

const Step2Details: React.FC<StepProps & { toggleArrayItem: (field: 'challenges' | 'desiredOutcomes', item: string) => void }> = ({
  formData,
  updateField,
  toggleArrayItem,
  errors,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">What do you need help with?</h3>
      <p className="text-sm text-gray-400">Tell us about your challenges and goals</p>
    </div>

    {/* Needs Description */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Describe Your Needs <span className="text-red-400">*</span>
      </label>
      <textarea
        value={formData.needsDescription}
        onChange={(e) => updateField('needsDescription', e.target.value)}
        placeholder="Tell us about your project, challenges, and what you're hoping to achieve..."
        rows={4}
        className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
          errors.needsDescription ? 'border-red-500' : 'border-gray-700'
        }`}
      />
      <div className="flex justify-between mt-1">
        {errors.needsDescription ? (
          <p className="text-sm text-red-400">{errors.needsDescription}</p>
        ) : (
          <span />
        )}
        <span className={`text-xs ${formData.needsDescription.length < 50 ? 'text-gray-500' : 'text-green-400'}`}>
          {formData.needsDescription.length}/50 min
        </span>
      </div>
    </div>

    {/* Current Challenges */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Current Challenges <span className="text-gray-500">(select all that apply)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {COMMON_CHALLENGES.map((challenge) => (
          <button
            key={challenge}
            type="button"
            onClick={() => toggleArrayItem('challenges', challenge)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              formData.challenges.includes(challenge)
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            {challenge}
          </button>
        ))}
      </div>
    </div>

    {/* Desired Outcomes */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Desired Outcomes <span className="text-gray-500">(select all that apply)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {COMMON_OUTCOMES.map((outcome) => (
          <button
            key={outcome}
            type="button"
            onClick={() => toggleArrayItem('desiredOutcomes', outcome)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              formData.desiredOutcomes.includes(outcome)
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            {outcome}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Step3Scope: React.FC<StepProps> = ({ formData, updateField, errors }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">Project Scope</h3>
      <p className="text-sm text-gray-400">Help us understand your budget, timeline, and engagement preferences</p>
    </div>

    {/* Budget Range */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <DollarSign className="w-4 h-4 inline mr-1" />
        Budget Range <span className="text-red-400">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {BUDGET_RANGES.map((budget) => (
          <button
            key={budget.value}
            type="button"
            onClick={() => updateField('budgetRange', budget.value)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
              formData.budgetRange === budget.value
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            {budget.label}
          </button>
        ))}
      </div>
      {errors.budgetRange && (
        <p className="mt-1 text-sm text-red-400">{errors.budgetRange}</p>
      )}
    </div>

    {/* Timeline */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <Clock className="w-4 h-4 inline mr-1" />
        Timeline <span className="text-red-400">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {TIMELINES.map((timeline) => (
          <button
            key={timeline.value}
            type="button"
            onClick={() => updateField('timeline', timeline.value)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
              formData.timeline === timeline.value
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            {timeline.label}
          </button>
        ))}
      </div>
      {errors.timeline && (
        <p className="mt-1 text-sm text-red-400">{errors.timeline}</p>
      )}
    </div>

    {/* Team Size */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <Users className="w-4 h-4 inline mr-1" />
        Team Size to Involve
      </label>
      <input
        type="text"
        value={formData.teamSize}
        onChange={(e) => updateField('teamSize', e.target.value)}
        placeholder="e.g., 5-10 people, entire department, leadership team"
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-colors"
      />
    </div>

    {/* Engagement Type */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <Briefcase className="w-4 h-4 inline mr-1" />
        Engagement Type <span className="text-red-400">*</span>
      </label>
      <div className="space-y-2">
        {ENGAGEMENT_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => updateField('engagementType', type.value)}
            className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
              formData.engagementType === type.value
                ? 'bg-blue-500/20 border border-blue-500/50'
                : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className={`font-medium ${formData.engagementType === type.value ? 'text-blue-400' : 'text-white'}`}>
              {type.label}
            </div>
            <div className="text-sm text-gray-400">{type.description}</div>
          </button>
        ))}
      </div>
      {errors.engagementType && (
        <p className="mt-1 text-sm text-red-400">{errors.engagementType}</p>
      )}
    </div>
  </div>
);

const Step4Review: React.FC<Omit<StepProps, 'errors'>> = ({ formData, updateField }) => {
  const selectedIndustry = INDUSTRIES.find(i => i.value === formData.industry);
  const selectedOrgType = ORGANIZATION_TYPES.find(t => t.value === formData.organizationType);
  const selectedBudget = BUDGET_RANGES.find(b => b.value === formData.budgetRange);
  const selectedTimeline = TIMELINES.find(t => t.value === formData.timeline);
  const selectedEngagement = ENGAGEMENT_TYPES.find(e => e.value === formData.engagementType);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Review Your Request</h3>
        <p className="text-sm text-gray-400">Please review and submit your consultation request</p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Organization */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Building2 className="w-4 h-4" />
            Organization
          </div>
          <div className="text-white font-medium">{formData.organizationName}</div>
          <div className="text-sm text-gray-400">
            {selectedOrgType?.label} {formData.organizationSize && `• ${formData.organizationSize}`}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span>{selectedIndustry?.icon}</span>
            <span className="text-sm text-gray-300">{selectedIndustry?.label}</span>
          </div>
        </div>

        {/* Needs */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <MessageSquare className="w-4 h-4" />
            Your Needs
          </div>
          <p className="text-white text-sm">{formData.needsDescription}</p>
          {formData.challenges.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1">Challenges:</div>
              <div className="flex flex-wrap gap-1">
                {formData.challenges.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          {formData.desiredOutcomes.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Desired Outcomes:</div>
              <div className="flex flex-wrap gap-1">
                {formData.desiredOutcomes.map(o => (
                  <span key={o} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scope */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Target className="w-4 h-4" />
            Project Scope
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Budget</div>
              <div className="text-white">{selectedBudget?.label}</div>
            </div>
            <div>
              <div className="text-gray-500">Timeline</div>
              <div className="text-white">{selectedTimeline?.label}</div>
            </div>
            <div>
              <div className="text-gray-500">Engagement</div>
              <div className="text-white">{selectedEngagement?.label}</div>
            </div>
            {formData.teamSize && (
              <div>
                <div className="text-gray-500">Team Size</div>
                <div className="text-white">{formData.teamSize}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Additional Notes <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          value={formData.additionalNotes}
          onChange={(e) => updateField('additionalNotes', e.target.value)}
          placeholder="Any other information you'd like us to know..."
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
        />
      </div>
    </div>
  );
};

// ===========================================
// SUCCESS STATE
// ===========================================

const SuccessState: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="p-8 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
    >
      <CheckCircle2 className="w-10 h-10 text-green-400" />
    </motion.div>

    <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
    <p className="text-gray-400 mb-6 max-w-sm mx-auto">
      Thank you for your consultation request. Our team will review it and match you with the right experts within 24-48 hours.
    </p>

    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6 text-left">
      <h4 className="font-medium text-white mb-2">What happens next?</h4>
      <ul className="space-y-2 text-sm text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-0.5">1.</span>
          Our team reviews your request and identifies matching consultants
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-0.5">2.</span>
          You'll receive consultant profiles and availability within 48 hours
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-0.5">3.</span>
          Schedule intro calls with consultants of your choice
        </li>
      </ul>
    </div>

    <div className="flex gap-3 justify-center">
      <button
        onClick={onClose}
        className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
      >
        Close
      </button>
      <button
        onClick={() => window.location.href = '/dashboard'}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

export default ConsultationRequestModal;
