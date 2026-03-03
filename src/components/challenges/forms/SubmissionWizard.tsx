import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Github,
  Globe,
  FileText,
  Users,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
  Plus,
} from 'lucide-react';
import type { Challenge, ChallengeSubmission, ChallengeTeam } from '@/types';
import { challengesApi } from '@/services/challengesApi';

interface SubmissionWizardProps {
  challenge: Challenge;
  existingDraft?: Partial<ChallengeSubmission>;
  team?: ChallengeTeam;
  onAutoSave: (draft: Partial<ChallengeSubmission>) => void;
  onSubmit: (submission: ChallengeSubmission) => void;
  onCancel: () => void;
}

interface TeamMemberContribution {
  userId: string;
  name: string;
  contribution: string;
}

interface FormData {
  // Step 1: Overview
  title: string;
  tagline: string;
  thumbnail: File | null;
  thumbnailPreview: string | null;

  // Step 2: Team
  teamConfirmed: boolean;
  contributions: TeamMemberContribution[];

  // Step 3: Details
  description: string;
  technicalApproach: string;
  builtWith: string[];
  imageGallery: File[];
  imagePreviews: string[];

  // Step 4: Demo & Deliverables
  videoUrl: string;
  repositoryUrl: string;
  demoUrl: string;
  files: File[];

  // Step 5: Challenge Questions
  customAnswers: Record<string, string>;
  categories: string[];
  aiToolsUsed: string[];

  // Step 6: Review
  termsAccepted: boolean;
  originalWork: boolean;
}

const TECH_STACK_OPTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular',
  'Node.js', 'Django', 'Flask', 'FastAPI', 'TensorFlow', 'PyTorch',
  'Scikit-learn', 'OpenAI API', 'Claude API', 'AWS', 'GCP', 'Azure',
  'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL',
  'REST API', 'Figma', 'Tailwind CSS', 'Three.js', 'Unity', 'Unreal'
];

const STEPS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'demo', label: 'Demo & Files', icon: Video },
  { id: 'questions', label: 'Questions', icon: FileText },
  { id: 'review', label: 'Review', icon: CheckCircle }
];

export const SubmissionWizard: React.FC<SubmissionWizardProps> = ({
  challenge,
  existingDraft,
  team,
  onAutoSave,
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: existingDraft?.title || '',
    tagline: '',
    thumbnail: null,
    thumbnailPreview: null,
    teamConfirmed: false,
    contributions: team?.members?.map(m => ({
      userId: m.userId,
      name: m.user?.firstName || m.userId || 'Team Member',
      contribution: ''
    })) || [],
    description: existingDraft?.description || '',
    technicalApproach: '',
    builtWith: [],
    imageGallery: [],
    imagePreviews: [],
    videoUrl: existingDraft?.videoUrl || '',
    repositoryUrl: existingDraft?.repositoryUrl || '',
    demoUrl: existingDraft?.demoUrl || '',
    files: [],
    customAnswers: {},
    categories: [],
    aiToolsUsed: [],
    termsAccepted: false,
    originalWork: false
  });

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      handleAutoSave();
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  const handleAutoSave = useCallback(async () => {
    if (!formData.title) return;

    setIsSaving(true);
    try {
      const draftData: Partial<ChallengeSubmission> = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        repositoryUrl: formData.repositoryUrl,
        demoUrl: formData.demoUrl,
        status: 'draft'
      };
      onAutoSave(draftData);
      setLastSaved(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [formData, onAutoSave]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    updateFormData({
      imageGallery: [...formData.imageGallery, ...files],
      imagePreviews: [...formData.imagePreviews, ...newPreviews]
    });
  };

  const removeGalleryImage = (index: number) => {
    updateFormData({
      imageGallery: formData.imageGallery.filter((_, i) => i !== index),
      imagePreviews: formData.imagePreviews.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    updateFormData({ files: [...formData.files, ...files] });
  };

  const removeFile = (index: number) => {
    updateFormData({
      files: formData.files.filter((_, i) => i !== index)
    });
  };

  const toggleTech = (tech: string) => {
    updateFormData({
      builtWith: formData.builtWith.includes(tech)
        ? formData.builtWith.filter(t => t !== tech)
        : [...formData.builtWith, tech]
    });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: // Overview
        return formData.title.length >= 5 && formData.tagline.length >= 10;
      case 1: // Team
        return !team || formData.teamConfirmed;
      case 2: // Details
        return formData.description.length >= 100;
      case 3: // Demo
        return true; // Optional
      case 4: // Questions
        return true; // Depends on required questions
      case 5: // Review
        return formData.termsAccepted && formData.originalWork;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Build submission object
      const submission: Partial<ChallengeSubmission> = {
        challengeId: challenge.id,
        title: formData.title,
        summary: formData.tagline,
        description: formData.description,
        videoUrl: formData.videoUrl,
        repositoryUrl: formData.repositoryUrl,
        demoUrl: formData.demoUrl,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };

      // Call submit API
      const result = await challengesApi.submissions.create(challenge.id, submission);
      if (result) {
        await challengesApi.submissions.submit(result.id);
        onSubmit(result as ChallengeSubmission);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Submit Your Solution</h2>
          {lastSaved && (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  Saved {lastSaved.toLocaleTimeString()}
                </>
              )}
            </span>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isCurrent
                      ? 'bg-indigo-500 text-white'
                      : isComplete
                        ? 'bg-gray-800 text-indigo-400 hover:bg-gray-700'
                        : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 w-4 ${isComplete ? 'bg-indigo-500' : 'bg-gray-700'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Overview */}
            {currentStep === 0 && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="Give your project a memorable name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tagline *
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => updateFormData({ tagline: e.target.value })}
                    placeholder="A short, catchy description of your solution"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength={140}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/140 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail Image
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.thumbnailPreview ? (
                      <div className="relative w-40 h-28 rounded-lg overflow-hidden">
                        <img
                          src={formData.thumbnailPreview}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => updateFormData({ thumbnail: null, thumbnailPreview: null })}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-40 h-28 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                        <ImageIcon className="h-8 w-8 text-gray-500 mb-2" />
                        <span className="text-xs text-gray-500">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="text-sm text-gray-400">
                      <p>Recommended: 1200x800px (3:2 ratio)</p>
                      <p>Max size: 5MB</p>
                      <p>Formats: JPG, PNG, GIF</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Team */}
            {currentStep === 1 && (
              <motion.div
                key="team"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {team ? (
                  <>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-5 w-5 text-indigo-400" />
                        <div>
                          <h4 className="font-medium text-white">{team.name}</h4>
                          <p className="text-sm text-gray-400">{team.members?.length || 1} members</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Member Contributions
                      </label>
                      <div className="space-y-3">
                        {formData.contributions.map((member, index) => (
                          <div key={member.userId} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-medium">
                              {member.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{member.name}</p>
                              <input
                                type="text"
                                value={member.contribution}
                                onChange={(e) => {
                                  const newContributions = [...formData.contributions];
                                  newContributions[index].contribution = e.target.value;
                                  updateFormData({ contributions: newContributions });
                                }}
                                placeholder="Describe their contribution..."
                                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.teamConfirmed}
                        onChange={(e) => updateFormData({ teamConfirmed: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-white">
                        I confirm all team members have contributed to and approved this submission
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-300 mb-2">Individual Submission</h4>
                    <p className="text-sm text-gray-500">
                      You're submitting as an individual. Continue to the next step.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Details */}
            {currentStep === 2 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Describe your solution in detail. What problem does it solve? How does it work?"
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <p className={`text-xs mt-1 ${formData.description.length < 100 ? 'text-amber-400' : 'text-gray-500'}`}>
                    {formData.description.length}/500+ characters (minimum 100)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technical Approach
                  </label>
                  <textarea
                    value={formData.technicalApproach}
                    onChange={(e) => updateFormData({ technicalApproach: e.target.value })}
                    placeholder="Explain your technical approach, architecture, and key implementation decisions..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Built With
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACK_OPTIONS.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          formData.builtWith.includes(tech)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image Gallery
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {formData.imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        <img src={preview} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {formData.imagePreviews.length < 10 && (
                      <label className="aspect-video flex flex-col items-center justify-center bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                        <Plus className="h-6 w-6 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-500">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Up to 10 images, max 10MB each</p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Demo & Deliverables */}
            {currentStep === 3 && (
              <motion.div
                key="demo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Video className="inline h-4 w-4 mr-2" />
                    Video Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => updateFormData({ videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">YouTube or Vimeo links supported</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Github className="inline h-4 w-4 mr-2" />
                    Repository URL
                  </label>
                  <input
                    type="url"
                    value={formData.repositoryUrl}
                    onChange={(e) => updateFormData({ repositoryUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="inline h-4 w-4 mr-2" />
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => updateFormData({ demoUrl: e.target.value })}
                    placeholder="https://your-demo-site.com"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Upload className="inline h-4 w-4 mr-2" />
                    File Uploads
                  </label>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-white">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                    <label className="flex items-center justify-center gap-2 p-4 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                      <Upload className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-400">Upload files (max 35MB each)</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Supported: ZIP, PDF, Word documents, APK</p>
                </div>
              </motion.div>
            )}

            {/* Step 5: Challenge Questions */}
            {currentStep === 4 && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Custom questions would be rendered here based on challenge.customQuestions */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    AI Tools Used (Disclosure)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Please disclose any AI tools used in developing your solution.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['ChatGPT', 'Claude', 'GitHub Copilot', 'Midjourney', 'DALL-E', 'Stable Diffusion', 'None'].map((tool) => (
                      <button
                        key={tool}
                        onClick={() => {
                          updateFormData({
                            aiToolsUsed: formData.aiToolsUsed.includes(tool)
                              ? formData.aiToolsUsed.filter(t => t !== tool)
                              : [...formData.aiToolsUsed, tool]
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          formData.aiToolsUsed.includes(tool)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Placeholder for dynamic questions */}
                <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                  <FileText className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">
                    No additional questions required for this challenge.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 6: Review */}
            {currentStep === 5 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Submission Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Project Title</p>
                      <p className="text-white font-medium">{formData.title || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Tagline</p>
                      <p className="text-white">{formData.tagline || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Technologies</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.builtWith.length > 0 ? formData.builtWith.map(tech => (
                          <span key={tech} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                            {tech}
                          </span>
                        )) : <span className="text-gray-500">-</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Video</p>
                        <p className="text-white text-sm">{formData.videoUrl ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Repository</p>
                        <p className="text-white text-sm">{formData.repositoryUrl ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Files</p>
                        <p className="text-white text-sm">{formData.files.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-white">
                      I agree to the challenge rules, terms of service, and IP assignment terms
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.originalWork}
                      onChange={(e) => updateFormData({ originalWork: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-white">
                      This is my original work and I have the right to submit it
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              onClick={handleAutoSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Draft
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionWizard;
