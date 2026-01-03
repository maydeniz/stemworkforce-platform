// ===========================================
// ADD PROGRAM MODAL - Education Provider Program Entry
// Multi-step form with progressive disclosure
// ===========================================

import React, { useState, useEffect, useRef } from 'react';
import {
  CREDENTIAL_TYPES,
  DELIVERY_MODES,
  AI_COMPETENCY_FIELDS,
  CAREER_COMPETENCY_FIELDS,
  TARGET_INDUSTRIES,
  PROFESSIONAL_CERTIFICATIONS,
  ACCREDITATIONS,
  COMPETENCY_LEVELS,
  getDefaultProgramFormData,
  type ProgramFormData,
  type CredentialType,
  type DeliveryMode,
  type DurationUnit,
  type CompetencyLevel,
} from '@/types/program';
import { searchCIPCodes, type CIPCode } from '@/data/cipCodes';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProgramFormData) => void;
  existingPrograms?: { id: string; name: string; credentialType: CredentialType }[];
}

type Step = 'basic' | 'structure' | 'workbased' | 'competencies' | 'industry' | 'outcomes';

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'basic', label: 'Basic Info', icon: '📋' },
  { id: 'structure', label: 'Structure', icon: '🏗️' },
  { id: 'workbased', label: 'Work-Based Learning', icon: '💼' },
  { id: 'competencies', label: 'Competencies', icon: '🎯' },
  { id: 'industry', label: 'Industry', icon: '🏭' },
  { id: 'outcomes', label: 'Outcomes', icon: '📊' },
];

export const AddProgramModal: React.FC<AddProgramModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingPrograms = [],
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [formData, setFormData] = useState<ProgramFormData>(getDefaultProgramFormData());
  const [cipSearchQuery, setCipSearchQuery] = useState('');
  const [cipResults, setCipResults] = useState<CIPCode[]>([]);
  const [showCipDropdown, setShowCipDropdown] = useState(false);
  const [selectedCip, setSelectedCip] = useState<CIPCode | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cipDropdownRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(getDefaultProgramFormData());
      setCurrentStep('basic');
      setErrors({});
      setCipSearchQuery('');
      setSelectedCip(null);
    }
  }, [isOpen]);

  // CIP code search
  useEffect(() => {
    if (cipSearchQuery.length >= 2) {
      const results = searchCIPCodes(cipSearchQuery);
      setCipResults(results);
      setShowCipDropdown(true);
    } else {
      setCipResults([]);
      setShowCipDropdown(false);
    }
  }, [cipSearchQuery]);

  // Close CIP dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cipDropdownRef.current && !cipDropdownRef.current.contains(event.target as Node)) {
        setShowCipDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCipSelect = (cip: CIPCode) => {
    setSelectedCip(cip);
    setFormData({ ...formData, cipCode: cip.code });
    setCipSearchQuery(cip.title);
    setShowCipDropdown(false);
  };

  const updateFormData = <K extends keyof ProgramFormData>(
    field: K,
    value: ProgramFormData[K]
  ) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const updateWorkBasedLearning = (field: string, value: boolean | number | string[]) => {
    setFormData({
      ...formData,
      workBasedLearning: { ...formData.workBasedLearning, [field]: value },
    });
  };

  const updateAICompetency = (field: string, value: CompetencyLevel) => {
    setFormData({
      ...formData,
      aiCompetencies: { ...formData.aiCompetencies, [field]: value },
    });
  };

  const updateCareerCompetency = (field: string, value: number) => {
    setFormData({
      ...formData,
      careerCompetencies: { ...formData.careerCompetencies, [field]: value },
    });
  };

  const toggleArrayItem = (field: keyof ProgramFormData, item: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateFormData(field, newArray as ProgramFormData[typeof field]);
  };

  const toggleDeliveryMode = (mode: DeliveryMode) => {
    const newModes = formData.deliveryModes.includes(mode)
      ? formData.deliveryModes.filter((m) => m !== mode)
      : [...formData.deliveryModes, mode];
    updateFormData('deliveryModes', newModes);
  };

  const handleNext = () => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    }
  };

  const handleBack = () => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  };

  // Validate all required fields before final submission
  const validateAllSteps = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic info validation
    if (!formData.name.trim()) newErrors.name = 'Program name is required';
    if (!formData.credentialType) newErrors.credentialType = 'Credential type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateAllSteps()) {
      // Go to first step with errors
      if (errors.name || errors.credentialType) {
        setCurrentStep('basic');
      }
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Add New Program</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Step {stepIndex + 1} of {STEPS.length}: {STEPS[stepIndex].label}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Steps - Clickable to navigate freely */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all cursor-pointer hover:opacity-80 ${
                    step.id === currentStep
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Basic Info Step */}
            {currentStep === 'basic' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Program Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Program Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.name ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* CIP Code */}
                  <div className="relative" ref={cipDropdownRef}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CIP Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={cipSearchQuery}
                      onChange={(e) => setCipSearchQuery(e.target.value)}
                      placeholder="Search by code or title..."
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.cipCode ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {selectedCip && (
                      <p className="text-sm text-gray-400 mt-1">
                        Selected: {selectedCip.code} - {selectedCip.category}
                      </p>
                    )}
                    {errors.cipCode && <p className="text-red-400 text-sm mt-1">{errors.cipCode}</p>}

                    {showCipDropdown && cipResults.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto">
                        {cipResults.map((cip) => (
                          <button
                            key={cip.code}
                            type="button"
                            onClick={() => handleCipSelect(cip)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-blue-400 font-mono text-sm">{cip.code}</span>
                              <div>
                                <p className="text-white text-sm">{cip.title}</p>
                                <p className="text-gray-500 text-xs">{cip.category}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Credential Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Credential Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.credentialType}
                      onChange={(e) => updateFormData('credentialType', e.target.value as CredentialType | '')}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.credentialType ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select credential type</option>
                      {CREDENTIAL_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {formData.credentialType && (
                      <p className="text-sm text-gray-500 mt-1">
                        {CREDENTIAL_TYPES.find((t) => t.value === formData.credentialType)?.description}
                      </p>
                    )}
                    {errors.credentialType && <p className="text-red-400 text-sm mt-1">{errors.credentialType}</p>}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Program Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      rows={4}
                      placeholder="Describe the program, its objectives, and what students will learn..."
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.description ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                    />
                    {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                  </div>

                  {/* Program URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Program URL <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.programUrl}
                      onChange={(e) => updateFormData('programUrl', e.target.value)}
                      placeholder="https://university.edu/programs/computer-science"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Structure Step */}
            {currentStep === 'structure' && (
              <div className="space-y-6 animate-fade-in">
                {/* Delivery Modes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Delivery Mode <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {DELIVERY_MODES.map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => toggleDeliveryMode(mode.value)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          formData.deliveryModes.includes(mode.value)
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  {errors.deliveryModes && <p className="text-red-400 text-sm mt-1">{errors.deliveryModes}</p>}
                </div>

                {/* Duration */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min="0"
                        value={formData.durationValue || ''}
                        onChange={(e) => updateFormData('durationValue', parseInt(e.target.value) || 0)}
                        className={`flex-1 px-4 py-3 bg-gray-800 border ${
                          errors.durationValue ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="e.g., 4"
                      />
                      <select
                        value={formData.durationUnit}
                        onChange={(e) => updateFormData('durationUnit', e.target.value as DurationUnit)}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                    {errors.durationValue && <p className="text-red-400 text-sm mt-1">{errors.durationValue}</p>}
                  </div>

                  {/* Credit Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Credit Hours <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.creditHours || ''}
                      onChange={(e) => updateFormData('creditHours', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 120"
                    />
                  </div>
                </div>

                {/* Stackable */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Stackable Credential</h4>
                      <p className="text-sm text-gray-400">Can this credential be stacked into a larger credential?</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateFormData('isStackable', !formData.isStackable)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.isStackable ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          formData.isStackable ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {formData.isStackable && existingPrograms.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm text-gray-400 mb-2">Stacks into:</label>
                      <select
                        value={formData.stacksIntoId}
                        onChange={(e) => updateFormData('stacksIntoId', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select parent credential</option>
                        {existingPrograms.map((prog) => (
                          <option key={prog.id} value={prog.id}>
                            {prog.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work-Based Learning Step */}
            {currentStep === 'workbased' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-gray-400 mb-6">
                  Work-based learning opportunities are highly valued by employers. Select all that apply.
                </p>

                {/* Internship */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💼</span>
                      <div>
                        <h4 className="text-white font-medium">Internship</h4>
                        <p className="text-sm text-gray-400">Program includes internship opportunities</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateWorkBasedLearning('hasInternship', !formData.workBasedLearning.hasInternship)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.workBasedLearning.hasInternship ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          formData.workBasedLearning.hasInternship ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {formData.workBasedLearning.hasInternship && (
                    <div className="mt-4 pl-11 space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.workBasedLearning.internshipRequired}
                          onChange={(e) => updateWorkBasedLearning('internshipRequired', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-300">Required for graduation</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-400">Typical duration:</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.workBasedLearning.internshipDurationWeeks || ''}
                          onChange={(e) => updateWorkBasedLearning('internshipDurationWeeks', parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                          placeholder="12"
                        />
                        <span className="text-sm text-gray-400">weeks</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Co-op */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <h4 className="text-white font-medium">Co-op Program</h4>
                        <p className="text-sm text-gray-400">Alternating work/study semesters</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateWorkBasedLearning('hasCoOp', !formData.workBasedLearning.hasCoOp)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.workBasedLearning.hasCoOp ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          formData.workBasedLearning.hasCoOp ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Apprenticeship */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🛠️</span>
                      <div>
                        <h4 className="text-white font-medium">Apprenticeship</h4>
                        <p className="text-sm text-gray-400">Structured on-the-job training</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateWorkBasedLearning('hasApprenticeship', !formData.workBasedLearning.hasApprenticeship)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.workBasedLearning.hasApprenticeship ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          formData.workBasedLearning.hasApprenticeship ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {formData.workBasedLearning.hasApprenticeship && (
                    <div className="mt-4 pl-11">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.workBasedLearning.apprenticeshipRegistered}
                          onChange={(e) => updateWorkBasedLearning('apprenticeshipRegistered', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-300">DOL Registered Apprenticeship</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Capstone */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <h4 className="text-white font-medium">Capstone Project</h4>
                        <p className="text-sm text-gray-400">Culminating project or thesis</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateWorkBasedLearning('hasCapstone', !formData.workBasedLearning.hasCapstone)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.workBasedLearning.hasCapstone ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          formData.workBasedLearning.hasCapstone ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {formData.workBasedLearning.hasCapstone && (
                    <div className="mt-4 pl-11">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.workBasedLearning.capstoneIndustrySponsored}
                          onChange={(e) => updateWorkBasedLearning('capstoneIndustrySponsored', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-300">Industry-sponsored capstone projects</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Clinical/Practicum */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏥</span>
                        <div>
                          <h4 className="text-white font-medium">Clinical Experience</h4>
                          <p className="text-sm text-gray-400">Healthcare settings</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateWorkBasedLearning('hasClinical', !formData.workBasedLearning.hasClinical)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          formData.workBasedLearning.hasClinical ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                            formData.workBasedLearning.hasClinical ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📚</span>
                        <div>
                          <h4 className="text-white font-medium">Practicum</h4>
                          <p className="text-sm text-gray-400">Supervised practice</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateWorkBasedLearning('hasPracticum', !formData.workBasedLearning.hasPracticum)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          formData.workBasedLearning.hasPracticum ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                            formData.workBasedLearning.hasPracticum ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Competencies Step */}
            {currentStep === 'competencies' && (
              <div className="space-y-8 animate-fade-in">
                {/* AI Competencies */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🤖</span>
                    <h3 className="text-lg font-semibold text-white">AI Competencies</h3>
                    <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">UNESCO Framework</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Rate the level of AI competencies developed in this program.
                  </p>
                  <div className="space-y-3">
                    {AI_COMPETENCY_FIELDS.map((field) => (
                      <div key={field.key} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-white text-sm font-medium">{field.label}</h4>
                            <p className="text-xs text-gray-500">{field.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {COMPETENCY_LEVELS.map((level) => (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => updateAICompetency(field.key, level.value)}
                              className={`flex-1 px-2 py-1.5 rounded text-xs transition-all ${
                                formData.aiCompetencies[field.key] === level.value
                                  ? level.value === 'none'
                                    ? 'bg-gray-600 text-white'
                                    : level.value === 'introductory'
                                    ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                                    : level.value === 'intermediate'
                                    ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                                    : 'bg-purple-500/30 text-purple-400 border border-purple-500/50'
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Competencies */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🎯</span>
                    <h3 className="text-lg font-semibold text-white">Career Readiness Competencies</h3>
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">NACE Framework</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Rate how strongly each competency is developed (1 = minimal, 5 = extensive).
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {CAREER_COMPETENCY_FIELDS.map((field) => (
                      <div key={field.key} className="p-3 bg-gray-800/50 rounded-lg">
                        <h4 className="text-white text-sm font-medium mb-2">{field.label}</h4>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => updateCareerCompetency(field.key, val)}
                              className={`flex-1 h-8 rounded transition-all ${
                                formData.careerCompetencies[field.key] >= val
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Minimal</span>
                          <span className="text-xs text-gray-500">Extensive</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Industry Step */}
            {currentStep === 'industry' && (
              <div className="space-y-6 animate-fade-in">
                {/* Target Industries */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Target Industries
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TARGET_INDUSTRIES.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => toggleArrayItem('targetIndustries', industry)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          formData.targetIndustries.includes(industry)
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clearance Pathway */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <h4 className="text-white font-medium">Security Clearance Pathway</h4>
                        <p className="text-sm text-gray-400">Program prepares students for security clearance eligibility</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateFormData('clearancePathway', !formData.clearancePathway)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.clearancePathway ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          formData.clearancePathway ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Professional Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Professional Certifications
                    <span className="text-gray-500 font-normal ml-2">(included or prepares for)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-gray-800/30 rounded-lg">
                    {PROFESSIONAL_CERTIFICATIONS.map((cert) => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleArrayItem('professionalCertifications', cert)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          formData.professionalCertifications.includes(cert)
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accreditations */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Program Accreditations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ACCREDITATIONS.map((accred) => (
                      <button
                        key={accred}
                        type="button"
                        onClick={() => toggleArrayItem('accreditations', accred)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          formData.accreditations.includes(accred)
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {accred}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Outcomes Step */}
            {currentStep === 'outcomes' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <h4 className="text-blue-400 font-medium">Transparency Matters</h4>
                      <p className="text-sm text-gray-400">
                        Sharing outcomes data helps employers and students make informed decisions.
                        This information is optional but highly encouraged.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Graduation Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Graduation Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.graduationRate}
                        onChange={(e) => updateFormData('graduationRate', e.target.value)}
                        className="w-full px-4 py-3 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 85"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>

                  {/* Job Placement Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Placement Rate (within 6 months)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.jobPlacementRate}
                        onChange={(e) => updateFormData('jobPlacementRate', e.target.value)}
                        className="w-full px-4 py-3 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 92"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>

                  {/* Median Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Median Salary (1 year post-graduation)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.medianSalary}
                        onChange={(e) => updateFormData('medianSalary', e.target.value)}
                        className="w-full px-4 py-3 pl-8 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 75000"
                      />
                    </div>
                  </div>

                  {/* Employer Satisfaction */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Employer Satisfaction Score
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.employerSatisfaction}
                        onChange={(e) => updateFormData('employerSatisfaction', e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 4.5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">/ 5</span>
                    </div>
                  </div>
                </div>

                {/* Summary Preview */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 mt-6">
                  <h4 className="text-white font-medium mb-3">Program Summary</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="text-white ml-2">{formData.name || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="text-white ml-2">
                        {CREDENTIAL_TYPES.find((t) => t.value === formData.credentialType)?.label || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-white ml-2">
                        {formData.durationValue ? `${formData.durationValue} ${formData.durationUnit}` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Delivery:</span>
                      <span className="text-white ml-2">
                        {formData.deliveryModes.map((m) => DELIVERY_MODES.find((d) => d.value === m)?.label).join(', ') || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={stepIndex === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  stepIndex === 0
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                ← Back
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                {stepIndex < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Add Program ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProgramModal;
