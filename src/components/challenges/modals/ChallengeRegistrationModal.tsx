import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  Users,
  User,
  MapPin,
  Calendar,
  Shield,
  AlertTriangle,
  Loader2,
  Sparkles,
  Trophy,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Challenge, ChallengeSolver } from '@/types';
import { challengesApi } from '@/services/challengesApi';
import { useAuth } from '@/contexts';

interface ChallengeRegistrationModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registration: ChallengeSolver) => void;
}

interface EligibilityCheck {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  required: boolean;
}

export const ChallengeRegistrationModal: React.FC<ChallengeRegistrationModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'eligibility' | 'skills' | 'participation' | 'success'>('eligibility');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [eligibilityChecks, setEligibilityChecks] = useState<EligibilityCheck[]>([
    {
      id: 'age',
      label: `I am ${challenge.eligibility?.minAge || 18} years or older`,
      checked: false,
      required: true
    },
    {
      id: 'location',
      label: challenge.eligibility?.countries?.length
        ? `I am located in an eligible country (${challenge.eligibility.countries.slice(0, 3).join(', ')}${challenge.eligibility.countries.length > 3 ? '...' : ''})`
        : 'I confirm my location eligibility',
      checked: false,
      required: true
    },
    {
      id: 'ip',
      label: 'I accept the IP assignment terms',
      description: challenge.eligibility?.ipAssignment === 'full-transfer'
        ? 'Winning solutions will be fully transferred to the sponsor'
        : challenge.eligibility?.ipAssignment === 'license'
          ? 'You grant the sponsor a license to use your solution'
          : 'You retain ownership of your solution',
      checked: false,
      required: true
    },
    {
      id: 'rules',
      label: 'I agree to the challenge rules and requirements',
      checked: false,
      required: true
    }
  ]);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [participationType, setParticipationType] = useState<'individual' | 'team'>('individual');
  const [registration, setRegistration] = useState<ChallengeSolver | null>(null);

  // Skill suggestions based on challenge
  const suggestedSkills = challenge.skills || [
    'Python', 'Machine Learning', 'Data Science', 'JavaScript', 'React',
    'Cloud Computing', 'Algorithm Design', 'System Design'
  ];

  const allEligibilityMet = eligibilityChecks.filter(c => c.required).every(c => c.checked);

  const handleEligibilityCheck = (id: string) => {
    setEligibilityChecks(prev =>
      prev.map(check =>
        check.id === id ? { ...check, checked: !check.checked } : check
      )
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleRegister = async () => {
    if (!user) {
      setError('Please log in to register');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await challengesApi.solvers.register(challenge.id, selectedSkills);
      if (result) {
        setRegistration(result);
        setStep('success');
        onSuccess(result);
      } else {
        throw new Error('Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDeadline = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (date: string) => {
    const now = new Date();
    const deadline = new Date(date);
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              {step === 'success' ? (
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-indigo-400" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {step === 'success' ? "You're In!" : 'Join Challenge'}
                </h2>
                <p className="text-sm text-gray-400 truncate max-w-[250px]">
                  {challenge.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Eligibility */}
              {step === 'eligibility' && (
                <motion.div
                  key="eligibility"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Challenge Quick Info */}
                  <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Trophy className="h-4 w-4 text-amber-400" />
                      <span className="font-semibold text-amber-400">
                        ${(challenge.totalPrizePool || 0).toLocaleString()} Prize Pool
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span>
                        Deadline: {formatDeadline(challenge.submissionDeadline)}
                        <span className="text-blue-400 ml-1">
                          ({getDaysRemaining(challenge.submissionDeadline)} days left)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Eligibility Checklist */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Eligibility Requirements
                    </h3>
                    <div className="space-y-3">
                      {eligibilityChecks.map((check) => (
                        <label
                          key={check.id}
                          className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={check.checked}
                            onChange={() => handleEligibilityCheck(check.id)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
                          />
                          <div className="flex-1">
                            <span className="text-sm text-white">{check.label}</span>
                            {check.description && (
                              <p className="text-xs text-gray-400 mt-1">{check.description}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Warning if not all checked */}
                  {!allEligibilityMet && (
                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-200">
                        Please confirm all eligibility requirements to continue.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Skills */}
              {step === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">
                      Your Skills (Optional)
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Select skills you'll bring to this challenge. This helps with team matching.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedSkills.includes(skill)
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Participation Type */}
              {step === 'participation' && (
                <motion.div
                  key="participation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-4">
                      How will you participate?
                    </h3>
                    <div className="space-y-3">
                      <label
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                          participationType === 'individual'
                            ? 'bg-indigo-500/20 border-2 border-indigo-500'
                            : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="participation"
                          checked={participationType === 'individual'}
                          onChange={() => setParticipationType('individual')}
                          className="sr-only"
                        />
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">Individual</div>
                          <div className="text-sm text-gray-400">Compete on your own</div>
                        </div>
                        {participationType === 'individual' && (
                          <CheckCircle className="h-5 w-5 text-indigo-400" />
                        )}
                      </label>

                      <label
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                          participationType === 'team'
                            ? 'bg-indigo-500/20 border-2 border-indigo-500'
                            : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="participation"
                          checked={participationType === 'team'}
                          onChange={() => setParticipationType('team')}
                          className="sr-only"
                        />
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">Team</div>
                          <div className="text-sm text-gray-400">Form or join a team later</div>
                        </div>
                        {participationType === 'team' && (
                          <CheckCircle className="h-5 w-5 text-indigo-400" />
                        )}
                      </label>
                    </div>
                  </div>

                  {challenge.teamSizeRange && (
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team size: {challenge.teamSizeRange.min}-{challenge.teamSizeRange.max} members
                    </div>
                  )}
                </motion.div>
              )}

              {/* Success Step */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle className="h-10 w-10 text-green-400" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      You're registered!
                    </h3>
                    <p className="text-gray-400">
                      You've successfully registered for this challenge.
                    </p>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gray-800/50 rounded-xl p-4 text-left">
                    <h4 className="text-sm font-medium text-white mb-3">What's Next?</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-indigo-400">1.</span>
                        Read the full challenge brief and rules
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-indigo-400">2.</span>
                        {participationType === 'team'
                          ? 'Find or form a team'
                          : 'Download resources and datasets'}
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-indigo-400">3.</span>
                        Start working on your solution
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-indigo-400">4.</span>
                        Submit before {formatDeadline(challenge.submissionDeadline)}
                      </li>
                    </ul>
                  </div>

                  {/* Slack Integration */}
                  {challenge.slackChannelUrl && (
                    <a
                      href={challenge.slackChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      Join Slack Channel
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/50">
            {step === 'eligibility' && (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('skills')}
                  disabled={!allEligibilityMet}
                  className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 'skills' && (
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('eligibility')}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('participation')}
                  className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 'participation' && (
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('skills')}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleRegister}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="flex gap-3">
                {participationType === 'team' && (
                  <Link
                    to={`/challenges/${challenge.slug || challenge.id}/teams`}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors text-center"
                  >
                    Find Teammates
                  </Link>
                )}
                <Link
                  to={`/challenges/${challenge.slug || challenge.id}`}
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors text-center"
                >
                  View Challenge
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChallengeRegistrationModal;
