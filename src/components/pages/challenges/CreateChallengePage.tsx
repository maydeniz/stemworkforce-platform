// ===========================================
// CREATE CHALLENGE PAGE
// Multi-step wizard for sponsors to create challenges
// ===========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Award,
  Sparkles,
  Target,
  Clock,
  GraduationCap,
  Rocket,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  Wand2,
  Loader2,
} from 'lucide-react';
import { challengesApi } from '@/services/challengesApi';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChallengeType,
  SolverType,
  IndustryType,
  IPAssignment,
  ChallengeFormData,
} from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ===========================================
// CONSTANTS
// ===========================================

const STEPS = [
  { id: 1, name: 'Basics', icon: FileText, description: 'Title, type, and industry' },
  { id: 2, name: 'Details', icon: Target, description: 'Description and goals' },
  { id: 3, name: 'Eligibility', icon: Users, description: 'Who can participate' },
  { id: 4, name: 'Timeline', icon: Calendar, description: 'Phases and deadlines' },
  { id: 5, name: 'Awards', icon: Award, description: 'Prizes and recognition' },
  { id: 6, name: 'Resources', icon: Upload, description: 'Files and links' },
  { id: 7, name: 'Review', icon: Check, description: 'Review and publish' },
];

const CHALLENGE_TYPES: { value: ChallengeType; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'ideation', label: 'Ideation Challenge', description: 'Collect innovative ideas and concepts', icon: Sparkles },
  { value: 'prototype', label: 'Prototype Challenge', description: 'Build working prototypes or MVPs', icon: Rocket },
  { value: 'solution', label: 'Solution Challenge', description: 'Develop full solutions to problems', icon: Target },
  { value: 'research', label: 'Research Challenge', description: 'Conduct research or analysis', icon: GraduationCap },
  { value: 'hackathon', label: 'Hackathon', description: 'Time-limited coding/building event', icon: Clock },
  { value: 'grand-challenge', label: 'Grand Challenge', description: 'Large-scale, multi-phase competition', icon: Trophy },
];

const SOLVER_TYPES: { value: SolverType; label: string; description: string }[] = [
  { value: 'individual', label: 'Individuals', description: 'Solo participants' },
  { value: 'team', label: 'Teams', description: 'Groups of collaborators' },
  { value: 'small-business', label: 'Small Businesses', description: 'Companies < 500 employees' },
  { value: 'academic', label: 'Academic', description: 'Students and researchers' },
  { value: 'open', label: 'Open to All', description: 'No restrictions' },
];

const INDUSTRIES: { value: IndustryType; label: string }[] = [
  { value: 'semiconductor', label: 'Semiconductor' },
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'quantum', label: 'Quantum Computing' },
  { value: 'aerospace', label: 'Aerospace & Defense' },
  { value: 'nuclear', label: 'Nuclear Technologies' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'biotech', label: 'Biotechnology' },
  { value: 'clean-energy', label: 'Clean Energy' },
  { value: 'robotics', label: 'Robotics & Automation' },
  { value: 'manufacturing', label: 'Advanced Manufacturing' },
  { value: 'healthcare', label: 'Healthcare Technology' },
];

const IP_OPTIONS: { value: IPAssignment; label: string; description: string }[] = [
  { value: 'solver-retains', label: 'Solver Retains IP', description: 'Participants keep ownership of their work' },
  { value: 'sponsor-owns', label: 'Sponsor Owns IP', description: 'IP transfers to sponsor upon winning' },
  { value: 'shared', label: 'Shared License', description: 'Both parties have rights to use' },
  { value: 'licensed', label: 'Licensed to Sponsor', description: 'Sponsor receives usage license' },
];

// ===========================================
// INITIAL FORM STATE
// ===========================================

const initialFormData: ChallengeFormData = {
  // Basics
  title: '',
  shortDescription: '',
  type: 'solution',
  industry: 'ai',
  industries: ['ai'],
  skills: [],
  tags: [],

  // Details
  description: '',
  problemStatement: '',
  goals: [''],

  // Eligibility
  solverTypes: ['individual', 'team'],
  eligibility: {
    geographic: [],
    experience: undefined,
    certifications: [],
    custom: [],
  },
  maxTeamSize: 5,
  teamSizeMin: 1,
  teamSizeMax: 5,
  maxSubmissionsPerSolver: 1,

  // Timeline
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  submissionDeadline: '',
  judgingStart: '',
  judgingEnd: '',
  winnersAnnouncedDate: '',
  phases: [
    {
      name: 'Registration & Ideation',
      description: 'Register and develop your initial concept',
      startDate: '',
      endDate: '',
      order: 1,
      status: 'upcoming' as const,
    },
    {
      name: 'Submission',
      description: 'Submit your solution',
      startDate: '',
      endDate: '',
      order: 2,
      status: 'upcoming' as const,
    },
    {
      name: 'Evaluation',
      description: 'Judges review submissions',
      startDate: '',
      endDate: '',
      order: 3,
      status: 'upcoming' as const,
    },
  ],

  // Awards
  totalPrizePool: 50000,
  awards: [
    { rank: 1, title: '1st Place', prizeAmount: 25000, winnersCount: 1, place: 1, name: '1st Place', cashAmount: 25000, description: '', nonCashBenefits: [], additionalBenefits: [] },
    { rank: 2, title: '2nd Place', prizeAmount: 15000, winnersCount: 1, place: 2, name: '2nd Place', cashAmount: 15000, description: '', nonCashBenefits: [], additionalBenefits: [] },
    { rank: 3, title: '3rd Place', prizeAmount: 10000, winnersCount: 1, place: 3, name: '3rd Place', cashAmount: 10000, description: '', nonCashBenefits: [], additionalBenefits: [] },
  ],
  nonMonetaryBenefits: [],

  // Requirements
  requirements: {
    technical: [''],
  },
  deliverables: [],
  documentationRequired: true,
  videoRequired: false,
  videoDurationMax: 180,
  repositoryRequired: false,
  openSourceRequired: false,
  techStack: [],
  judgingCriteria: [
    { name: 'Innovation', description: 'Novelty and creativity of the solution', weight: 25, maxScore: 100 },
    { name: 'Technical Merit', description: 'Quality of implementation', weight: 25, maxScore: 100 },
    { name: 'Impact', description: 'Potential real-world impact', weight: 25, maxScore: 100 },
    { name: 'Feasibility', description: 'Practicality and scalability', weight: 25, maxScore: 100 },
  ],

  // Resources
  resources: [],

  // Settings
  ipAssignment: 'solver-retains',
  visibility: 'public',
  discussionEnabled: true,
  teamFormationEnabled: true,
  createSlackChannel: false,
  featured: false,
};

// ===========================================
// STEP COMPONENTS
// ===========================================

// Step 1: Basics
interface BasicsStepProps {
  formData: ChallengeFormData;
  onChange: (updates: Partial<ChallengeFormData>) => void;
}

const BasicsStep: React.FC<BasicsStepProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Challenge Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., AI-Powered Climate Prediction Challenge"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">A clear, compelling title that describes the challenge</p>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Short Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          placeholder="A brief tagline or summary (max 200 characters)"
          rows={2}
          maxLength={200}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        />
        <p className="mt-1 text-sm text-gray-500">{formData.shortDescription.length}/200 characters</p>
      </div>

      {/* Challenge Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Challenge Type <span className="text-red-400">*</span>
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {CHALLENGE_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange({ type: type.value })}
                className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                <div>
                  <div className={`font-medium ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                    {type.label}
                  </div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Industry <span className="text-red-400">*</span>
        </label>
        <select
          value={formData.industry}
          onChange={(e) => onChange({ industry: e.target.value as IndustryType })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          {INDUSTRIES.map((industry) => (
            <option key={industry.value} value={industry.value}>
              {industry.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Step 2: Details
interface DetailsStepProps {
  formData: ChallengeFormData;
  onChange: (updates: Partial<ChallengeFormData>) => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({ formData, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBrief = async () => {
    if (!formData.title || !formData.problemStatement) {
      alert('Please enter a title and problem statement first');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiService.generateChallengeBrief({
        title: formData.title,
        industry: formData.industry || 'ai',
        problemStatement: formData.problemStatement,
        goals: (formData.goals || []).filter(Boolean),
      });

      if (result.success && result.brief) {
        onChange({ description: result.brief.fullMarkdown });
      }
    } catch (err) {
      console.error('Failed to generate brief:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const goals = formData.goals || [''];

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    onChange({ goals: newGoals });
  };

  const addGoal = () => {
    onChange({ goals: [...goals, ''] });
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      onChange({ goals: goals.filter((_: string, i: number) => i !== index) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Problem Statement */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Problem Statement <span className="text-red-400">*</span>
        </label>
        <textarea
          value={formData.problemStatement}
          onChange={(e) => onChange({ problemStatement: e.target.value })}
          placeholder="What problem are you trying to solve? Why does it matter?"
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      {/* Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Challenge Goals
        </label>
        <div className="space-y-2">
          {goals.map((goal, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                placeholder={`Goal ${index + 1}`}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              {goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addGoal}
          className="mt-2 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Full Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Full Description <span className="text-red-400">*</span>
          </label>
          <button
            type="button"
            onClick={handleGenerateBrief}
            disabled={isGenerating || !formData.title || !formData.problemStatement}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                AI Generate Brief
              </>
            )}
          </button>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Detailed challenge description. Supports Markdown formatting."
          rows={12}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
        />
        <p className="mt-1 text-sm text-gray-500">
          Supports Markdown formatting. Use the AI generate button to create a draft based on your title and problem statement.
        </p>
      </div>
    </div>
  );
};

// Step 3: Eligibility
interface EligibilityStepProps {
  formData: ChallengeFormData;
  onChange: (updates: Partial<ChallengeFormData>) => void;
}

const EligibilityStep: React.FC<EligibilityStepProps> = ({ formData, onChange }) => {
  const toggleSolverType = (type: SolverType) => {
    const current = formData.solverTypes;
    if (current.includes(type)) {
      if (current.length > 1) {
        onChange({ solverTypes: current.filter(t => t !== type) });
      }
    } else {
      onChange({ solverTypes: [...current, type] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Who Can Participate */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Who Can Participate? <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {SOLVER_TYPES.map((type) => {
            const isSelected = formData.solverTypes.includes(type.value);
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleSolverType(type.value)}
                className={`flex items-center gap-3 w-full p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-600'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                    {type.label}
                  </div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Team Size */}
      {formData.solverTypes.includes('team') && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Maximum Team Size
          </label>
          <select
            value={formData.maxTeamSize}
            onChange={(e) => onChange({ maxTeamSize: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {[2, 3, 4, 5, 6, 8, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size} members
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Geographic Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Geographic Restrictions (optional)
        </label>
        <input
          type="text"
          value={formData.eligibility?.geographic?.join(', ') || ''}
          onChange={(e) =>
            onChange({
              eligibility: {
                ...formData.eligibility,
                geographic: e.target.value ? e.target.value.split(',').map(s => s.trim()) : [],
              },
            })
          }
          placeholder="e.g., United States, Canada, European Union"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">Leave blank for open to all countries. Separate multiple regions with commas.</p>
      </div>

      {/* IP Assignment */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Intellectual Property <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {IP_OPTIONS.map((option) => {
            const isSelected = formData.ipAssignment === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ipAssignment: option.value })}
                className={`flex items-center gap-3 w-full p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500' : 'border-gray-600'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Step 4: Timeline
interface TimelineStepProps {
  formData: ChallengeFormData;
  onChange: (updates: Partial<ChallengeFormData>) => void;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ formData, onChange }) => {
  const handlePhaseChange = (index: number, field: string, value: string) => {
    const newPhases = [...formData.phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    onChange({ phases: newPhases });
  };

  const addPhase = () => {
    onChange({
      phases: [
        ...formData.phases,
        {
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          order: formData.phases.length + 1,
          status: 'upcoming' as const,
        },
      ],
    });
  };

  const removePhase = (index: number) => {
    if (formData.phases.length > 1) {
      const newPhases = formData.phases.filter((_, i) => i !== index);
      onChange({ phases: newPhases.map((p, i) => ({ ...p, order: i + 1 })) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Challenge Start Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Challenge End Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Registration Deadline
        </label>
        <input
          type="date"
          value={formData.registrationDeadline}
          onChange={(e) => onChange({ registrationDeadline: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">Leave blank to allow registration until challenge end</p>
      </div>

      {/* Phases */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-300">
            Challenge Phases
          </label>
          <button
            type="button"
            onClick={addPhase}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />
            Add Phase
          </button>
        </div>
        <div className="space-y-4">
          {formData.phases.map((phase, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                  Phase {index + 1}
                </span>
                {formData.phases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhase(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={phase.name}
                  onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                  placeholder="Phase name"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <textarea
                  value={phase.description}
                  onChange={(e) => handlePhaseChange(index, 'description', e.target.value)}
                  placeholder="Phase description"
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={phase.startDate}
                      onChange={(e) => handlePhaseChange(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={phase.endDate}
                      onChange={(e) => handlePhaseChange(index, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 5: Awards
interface AwardsStepProps {
  formData: ChallengeFormData;
  onChange: (updates: Partial<ChallengeFormData>) => void;
}

const AwardsStep: React.FC<AwardsStepProps> = ({ formData, onChange }) => {
  const handleAwardChange = (index: number, field: string, value: string | number) => {
    const newAwards = [...formData.awards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    onChange({ awards: newAwards });

    // Update total prize pool
    const total = newAwards.reduce((sum, a) => sum + (a.cashAmount || 0), 0);
    onChange({ totalPrizePool: total });
  };

  const addAward = () => {
    const newPlace = formData.awards.length + 1;
    const title = `${newPlace}${getOrdinalSuffix(newPlace)} Place`;
    onChange({
      awards: [
        ...formData.awards,
        {
          rank: newPlace,
          title: title,
          prizeAmount: 0,
          winnersCount: 1,
          place: newPlace,
          name: title,
          cashAmount: 0,
          description: '',
          nonCashBenefits: [],
          additionalBenefits: [],
        },
      ],
    });
  };

  const removeAward = (index: number) => {
    if (formData.awards.length > 1) {
      const newAwards = formData.awards.filter((_, i) => i !== index);
      onChange({
        awards: newAwards.map((a, i) => ({
          ...a,
          place: i + 1,
          name: `${i + 1}${getOrdinalSuffix(i + 1)} Place`,
        })),
      });
    }
  };

  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return (
    <div className="space-y-6">
      {/* Total Prize Pool Display */}
      <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="w-8 h-8 text-green-400" />
          <div>
            <div className="text-sm text-green-400">Total Prize Pool</div>
            <div className="text-3xl font-bold text-white">
              ${(formData.totalPrizePool || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Awards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-300">
            Awards & Prizes
          </label>
          <button
            type="button"
            onClick={addAward}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />
            Add Award
          </button>
        </div>
        <div className="space-y-4">
          {formData.awards.map((award, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                index === 0
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : index === 1
                  ? 'bg-gray-500/10 border-gray-500/30'
                  : index === 2
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy
                    className={`w-5 h-5 ${
                      index === 0
                        ? 'text-yellow-400'
                        : index === 1
                        ? 'text-gray-300'
                        : index === 2
                        ? 'text-amber-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className="font-medium text-white">{award.name}</span>
                </div>
                {formData.awards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAward(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Cash Prize ($)</label>
                  <input
                    type="number"
                    value={award.cashAmount}
                    onChange={(e) => handleAwardChange(index, 'cashAmount', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Description (optional)</label>
                  <input
                    type="text"
                    value={award.description}
                    onChange={(e) => handleAwardChange(index, 'description', e.target.value)}
                    placeholder="e.g., Grand Prize Winner"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Cash Benefits Info */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p className="font-medium mb-1">Additional Benefits</p>
          <p className="text-blue-400/80">
            You can add non-cash benefits like mentorship, incubator access, or media exposure
            after the challenge is created.
          </p>
        </div>
      </div>
    </div>
  );
};

// Step 6: Resources
interface ResourcesStepProps {
  formData: ChallengeFormData;
  onChange: (updates: Partial<ChallengeFormData>) => void;
}

const ResourcesStep: React.FC<ResourcesStepProps> = ({ formData, onChange }) => {
  const handleRequirementChange = (index: number, value: string) => {
    const newReqs = [...(formData.requirements?.technical || [])];
    newReqs[index] = value;
    onChange({
      requirements: {
        ...formData.requirements,
        technical: newReqs,
      },
    });
  };

  const addRequirement = () => {
    onChange({
      requirements: {
        ...formData.requirements,
        technical: [...(formData.requirements?.technical || []), ''],
      },
    });
  };

  const removeRequirement = (index: number) => {
    const reqs = formData.requirements?.technical || [];
    if (reqs.length > 1) {
      onChange({
        requirements: {
          ...formData.requirements,
          technical: reqs.filter((_, i) => i !== index),
        },
      });
    }
  };

  const handleCriteriaChange = (index: number, field: string, value: string | number) => {
    const newCriteria = [...formData.judgingCriteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    onChange({ judgingCriteria: newCriteria });
  };

  return (
    <div className="space-y-8">
      {/* Technical Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Technical Requirements
        </label>
        <div className="space-y-2">
          {(formData.requirements?.technical || ['']).map((req, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                placeholder={`Requirement ${index + 1}`}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              {(formData.requirements?.technical?.length || 1) > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRequirement}
          className="mt-2 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          <Plus className="w-4 h-4" />
          Add Requirement
        </button>
      </div>

      {/* Judging Criteria */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Judging Criteria
        </label>
        <div className="space-y-3">
          {formData.judgingCriteria.map((criteria, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
            >
              <div className="grid md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Criterion Name</label>
                  <input
                    type="text"
                    value={criteria.name}
                    onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    value={criteria.weight}
                    onChange={(e) => handleCriteriaChange(index, 'weight', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={criteria.maxScore}
                    onChange={(e) => handleCriteriaChange(index, 'maxScore', parseInt(e.target.value) || 100)}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <input
                  type="text"
                  value={criteria.description}
                  onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                  placeholder="What does this criterion measure?"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="w-4 h-4" />
          Total weight should add up to 100%
          (Current: {formData.judgingCriteria.reduce((sum, c) => sum + c.weight, 0)}%)
        </div>
      </div>

      {/* Resource Links Info */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p className="font-medium mb-1">Resource Files & Links</p>
          <p className="text-blue-400/80">
            You can upload datasets, documentation, and add resource links after
            the challenge is created from the challenge management page.
          </p>
        </div>
      </div>
    </div>
  );
};

// Step 7: Review
interface ReviewStepProps {
  formData: ChallengeFormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <Check className="w-5 h-5" />
          <span className="font-medium">Ready to Publish</span>
        </div>
        <p className="text-sm text-green-400/80">
          Review your challenge details below. You can edit any section after publishing.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Challenge Type</h4>
          <p className="text-white">{CHALLENGE_TYPES.find(t => t.value === formData.type)?.label}</p>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Industry</h4>
          <p className="text-white">{INDUSTRIES.find(i => i.value === formData.industry)?.label}</p>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Total Prize Pool</h4>
          <p className="text-2xl font-bold text-green-400">${(formData.totalPrizePool || 0).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Duration</h4>
          <p className="text-white">
            {formData.startDate && formData.endDate
              ? `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`
              : 'Not set'}
          </p>
        </div>
      </div>

      {/* Title and Description Preview */}
      <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-2">{formData.title || 'Untitled Challenge'}</h3>
        <p className="text-gray-400 mb-4">{formData.shortDescription || 'No description'}</p>
        <div className="flex flex-wrap gap-2">
          {formData.solverTypes.map((type) => (
            <span key={type} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded">
              {SOLVER_TYPES.find(t => t.value === type)?.label}
            </span>
          ))}
        </div>
      </div>

      {/* Awards Preview */}
      <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
        <h4 className="font-medium text-white mb-3">Awards</h4>
        <div className="space-y-2">
          {formData.awards.map((award, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
              <span className="text-gray-300">{award.name || award.title}</span>
              <span className="font-medium text-green-400">${(award.cashAmount ?? award.prizeAmount ?? 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phases Preview */}
      <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
        <h4 className="font-medium text-white mb-3">Timeline ({formData.phases.length} phases)</h4>
        <div className="space-y-2">
          {formData.phases.map((phase, index) => (
            <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
              <span className="w-6 h-6 flex items-center justify-center bg-blue-500/20 text-blue-400 text-xs rounded-full">
                {index + 1}
              </span>
              <span className="text-gray-300">{phase.name || `Phase ${index + 1}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN CREATE CHALLENGE PAGE
// ===========================================

const CreateChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ChallengeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/challenges/create');
    }
  }, [user, navigate]);

  const handleChange = (updates: Partial<ChallengeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.push('Title is required');
        if (!formData.shortDescription.trim()) newErrors.push('Short description is required');
        break;
      case 2:
        if (!formData.description.trim()) newErrors.push('Full description is required');
        break;
      case 3:
        if (formData.solverTypes.length === 0) newErrors.push('Select at least one solver type');
        break;
      case 4:
        if (!formData.startDate) newErrors.push('Start date is required');
        if (!formData.endDate) newErrors.push('End date is required');
        break;
      case 5:
        if (formData.awards.length === 0) newErrors.push('Add at least one award');
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors([]);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    if (!user?.id) {
      setErrors(['You must be logged in to create a challenge']);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await challengesApi.challenges.create(formData, user.id);
      if (result) {
        navigate(`/challenges/${result.slug}`);
      } else {
        setErrors(['Failed to create challenge']);
      }
    } catch (err) {
      setErrors(['An error occurred while creating the challenge']);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicsStep formData={formData} onChange={handleChange} />;
      case 2:
        return <DetailsStep formData={formData} onChange={handleChange} />;
      case 3:
        return <EligibilityStep formData={formData} onChange={handleChange} />;
      case 4:
        return <TimelineStep formData={formData} onChange={handleChange} />;
      case 5:
        return <AwardsStep formData={formData} onChange={handleChange} />;
      case 6:
        return <ResourcesStep formData={formData} onChange={handleChange} />;
      case 7:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Challenges
          </button>
          <h1 className="text-3xl font-bold text-white">Create a Challenge</h1>
          <p className="text-gray-400 mt-2">
            Post an innovation challenge to recruit solvers from around the world
          </p>
        </div>

        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => {
                      if (step.id < currentStep || validateStep(currentStep)) {
                        setCurrentStep(step.id);
                      }
                    }}
                    className={`flex flex-col items-center gap-2 ${
                      isActive || isCompleted ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isActive
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span
                      className={`text-xs font-medium hidden md:block ${
                        isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Step {currentStep}: {STEPS[currentStep - 1].name}
          </h2>
          <p className="text-gray-400">{STEPS[currentStep - 1].description}</p>
        </div>

        {/* Errors */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium text-red-400">Please fix the following:</p>
                  <ul className="mt-1 text-sm text-red-400/80 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < STEPS.length ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  Publish Challenge
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateChallengePage;
