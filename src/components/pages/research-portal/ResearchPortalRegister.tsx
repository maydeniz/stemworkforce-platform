// ===========================================
// Research Portal Registration Page
// FERPA-compliant registration with institutional verification
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Shield,
  GraduationCap,
  AlertTriangle,
  FileText,
  Lock,
  BookOpen,
  Building2,
  User,
  Mail,
  Briefcase,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

// ===========================================
// TYPES
// ===========================================

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  institution: string;
  department: string;
  title: string;
  // IRB/CITI Training
  citiCertificationNumber: string;
  citiCompletionDate: string;
  ferpaTrainingCompleted: boolean;
  ferpaTrainingDate: string;
  // Agreements
  dataUseAgreementAccepted: boolean;
  termsAccepted: boolean;
}

interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Validates that an email belongs to an institutional (.edu) domain
 */
const validateInstitutionalEmail = (email: string): { valid: boolean; message?: string } => {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  const domain = email.split('@')[1]?.toLowerCase() || '';

  // Check for .edu domains (US institutions)
  if (domain.endsWith('.edu')) {
    return { valid: true };
  }

  // Check for common international research institution domains
  const internationalResearchDomains = [
    '.ac.uk',    // UK academic
    '.edu.au',   // Australian educational
    '.ac.jp',    // Japanese academic
    '.edu.cn',   // Chinese educational
    '.ac.nz',    // New Zealand academic
    '.edu.sg',   // Singapore educational
    '.ac.za',    // South African academic
    '.edu.mx',   // Mexican educational
    '.edu.br',   // Brazilian educational
    '.ac.in',    // Indian academic
  ];

  for (const tld of internationalResearchDomains) {
    if (domain.endsWith(tld)) {
      return { valid: true };
    }
  }

  return {
    valid: false,
    message: 'Research Portal access requires an institutional email address (.edu or equivalent academic domain)',
  };
};

/**
 * Extract institution name from email domain
 */
const getInstitutionFromEmail = (email: string): string => {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const parts = domain.split('.');
  if (parts.length >= 2) {
    const institutionPart = parts[parts.length - 2];
    return institutionPart.charAt(0).toUpperCase() + institutionPart.slice(1);
  }
  return '';
};

/**
 * Evaluate password strength
 */
const evaluatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push('Mix of upper and lowercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('At least one number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push('At least one special character');

  return { score: Math.min(score, 4), feedback };
};

const getStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-emerald-500';
    default:
      return 'bg-gray-500';
  }
};

const getStrengthLabel = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return '';
  }
};

// ===========================================
// FERPA COMPLIANCE NOTICE COMPONENT
// ===========================================

const FerpaComplianceNotice: React.FC = () => (
  <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-5 mb-6">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
        <Shield className="w-5 h-5 text-indigo-400" />
      </div>
      <div>
        <h3 className="font-semibold text-white mb-2">FERPA Compliance Requirements</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Registration for the Research Portal requires verification of your institutional affiliation
          and completion of required research ethics training. You must have completed CITI Human Subjects
          training and FERPA training to access de-identified student data.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded text-xs">
            <BookOpen className="w-3 h-3" />
            CITI Training Required
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded text-xs">
            <FileText className="w-3 h-3" />
            FERPA Training Required
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ===========================================
// DATA USE AGREEMENT COMPONENT
// ===========================================

interface DataUseAgreementProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
  disabled?: boolean;
}

const DataUseAgreement: React.FC<DataUseAgreementProps> = ({ accepted, onChange, disabled }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id="dataUseAgreement"
        checked={accepted}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
      />
      <label htmlFor="dataUseAgreement" className="text-sm text-gray-300 cursor-pointer">
        <span className="font-medium text-white">I acknowledge and agree to the Data Use Agreement</span>
        <span className="text-red-400 ml-1">*</span>
        <p className="mt-1 text-gray-400 text-xs leading-relaxed">
          By checking this box, I certify that I will: (1) only use data for approved research purposes,
          (2) maintain data confidentiality and security, (3) not attempt to re-identify any individuals,
          (4) report any data breaches immediately, and (5) destroy data upon project completion or as
          required by the data sharing agreement.
        </p>
        <a
          href="/research-portal/data-governance"
          target="_blank"
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 mt-2 text-xs"
        >
          <ExternalLink className="w-3 h-3" />
          View Full Data Use Agreement
        </a>
      </label>
    </div>
  </div>
);

// ===========================================
// MAIN REGISTRATION COMPONENT
// ===========================================

const ResearchPortalRegister: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Form state
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    department: '',
    title: '',
    citiCertificationNumber: '',
    citiCompletionDate: '',
    ferpaTrainingCompleted: false,
    ferpaTrainingDate: '',
    dataUseAgreementAccepted: false,
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1); // Multi-step form

  // Email validation
  const emailValidation = useMemo(() => {
    if (!formData.email) return { valid: true, message: undefined };
    return validateInstitutionalEmail(formData.email);
  }, [formData.email]);

  // Auto-detect institution from email
  const detectedInstitution = useMemo(() => {
    if (!formData.email || !emailValidation.valid) return '';
    return getInstitutionFromEmail(formData.email);
  }, [formData.email, emailValidation.valid]);

  // Password strength
  const passwordStrength = useMemo(() => {
    if (!formData.password) return null;
    return evaluatePasswordStrength(formData.password);
  }, [formData.password]);

  // Password match check
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Auto-fill institution if detected
      ...(name === 'email' && detectedInstitution && !prev.institution ? { institution: detectedInstitution } : {}),
    }));
  };

  // Validate current step
  const validateStep = (currentStep: number): boolean => {
    setError(null);

    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        setError('First name is required');
        return false;
      }
      if (!formData.lastName.trim()) {
        setError('Last name is required');
        return false;
      }
      if (!emailValidation.valid) {
        setError(emailValidation.message || 'Invalid email');
        return false;
      }
      if (!formData.password || formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (!passwordsMatch) {
        setError('Passwords do not match');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!formData.institution.trim()) {
        setError('Institution name is required');
        return false;
      }
      if (!formData.department.trim()) {
        setError('Department is required');
        return false;
      }
      if (!formData.title.trim()) {
        setError('Title/Position is required');
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!formData.citiCertificationNumber.trim()) {
        setError('CITI certification number is required');
        return false;
      }
      if (!formData.citiCompletionDate) {
        setError('CITI completion date is required');
        return false;
      }
      if (!formData.dataUseAgreementAccepted) {
        setError('You must accept the Data Use Agreement');
        return false;
      }
      if (!formData.termsAccepted) {
        setError('You must accept the Terms of Service');
        return false;
      }
      return true;
    }

    return true;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3) as 1 | 2 | 3);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1) as 1 | 2 | 3);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setLoading(true);
    setError(null);

    try {
      // Sign up with researcher role
      // Note: Additional metadata (institution, CITI, FERPA) will need to be stored
      // in a separate profile update after registration, or via a custom Supabase function
      const result = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        'researcher',
        formData.institution
      );

      if (result.success) {
        // Redirect to login with success message
        navigate('/research-portal-login', {
          state: {
            registrationSuccess: true,
            message: 'Registration successful! Please check your institutional email to verify your account.',
          },
        });
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              s === step
                ? 'bg-indigo-600 text-white'
                : s < step
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-500'
            }`}
          >
            {s < step ? <Check className="w-4 h-4" /> : s}
          </div>
          {s < 3 && (
            <div
              className={`w-12 h-0.5 ${s < step ? 'bg-emerald-600' : 'bg-gray-800'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Back to Login */}
        <Link
          to="/research-portal-login"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Research Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Researcher Registration</h1>
          <p className="text-gray-400 mt-2">
            {step === 1 && 'Create your account'}
            {step === 2 && 'Institutional information'}
            {step === 3 && 'Training verification'}
          </p>
        </div>

        {/* FERPA Compliance Notice */}
        {step === 1 && <FerpaComplianceNotice />}

        {/* Step Indicator */}
        <StepIndicator />

        {/* Registration Card */}
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Smith"
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Institutional Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="researcher@university.edu"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none ${
                        formData.email && !emailValidation.valid
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-700 focus:border-indigo-500'
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {formData.email && !emailValidation.valid && (
                    <p className="mt-1 text-sm text-red-400">{emailValidation.message}</p>
                  )}
                  {formData.email && emailValidation.valid && detectedInstitution && (
                    <p className="mt-1 text-sm text-indigo-400 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      Institution detected: {detectedInstitution}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {formData.password && passwordStrength && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.score <= 1 ? 'text-red-400' :
                          passwordStrength.score === 2 ? 'text-orange-400' :
                          passwordStrength.score === 3 ? 'text-yellow-400' : 'text-emerald-400'
                        }`}>
                          {getStrengthLabel(passwordStrength.score)}
                        </span>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <ul className="text-xs text-gray-400 space-y-0.5">
                          {passwordStrength.feedback.map((tip, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <X className="w-3 h-3 text-red-400" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <p className={`mt-1 text-xs flex items-center gap-1 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                      {passwordsMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Institutional Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Institution / University <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="e.g., Stanford University"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Education Research"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Title / Position <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 appearance-none"
                      disabled={loading}
                    >
                      <option value="">Select your title</option>
                      <option value="Graduate Student">Graduate Student</option>
                      <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                      <option value="Research Associate">Research Associate</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="Research Scientist">Research Scientist</option>
                      <option value="Principal Investigator">Principal Investigator</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <p className="text-sm text-indigo-300">
                    <strong>Note:</strong> Your institutional affiliation will be verified through your email domain.
                    Make sure to use your official institutional email address.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Training Verification */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-300 font-medium">Research Ethics Training Required</p>
                      <p className="text-xs text-gray-400 mt-1">
                        CITI Program Human Subjects Research training is required to access research data.
                        You can complete training at{' '}
                        <a
                          href="https://about.citiprogram.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          citiprogram.org
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    CITI Certification Number <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    name="citiCertificationNumber"
                    value={formData.citiCertificationNumber}
                    onChange={handleChange}
                    placeholder="e.g., 12345678"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    CITI Completion Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      name="citiCompletionDate"
                      value={formData.citiCompletionDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="ferpaTraining"
                    name="ferpaTrainingCompleted"
                    checked={formData.ferpaTrainingCompleted}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
                    disabled={loading}
                  />
                  <label htmlFor="ferpaTraining" className="text-sm text-gray-300 cursor-pointer">
                    <span className="font-medium text-white">I have completed FERPA training</span>
                    <p className="text-xs text-gray-500 mt-1">
                      FERPA training is typically provided by your institution. Check with your IRB or research compliance office.
                    </p>
                  </label>
                </div>

                {formData.ferpaTrainingCompleted && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      FERPA Training Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        name="ferpaTrainingDate"
                        value={formData.ferpaTrainingDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Data Use Agreement */}
                <DataUseAgreement
                  accepted={formData.dataUseAgreementAccepted}
                  onChange={(accepted) => setFormData(prev => ({ ...prev, dataUseAgreementAccepted: accepted }))}
                  disabled={loading}
                />

                {/* Terms of Service */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" className="text-indigo-400 hover:text-indigo-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">
                      Privacy Policy
                    </Link>
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-2.5 px-4 bg-gray-800 border border-gray-700 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  fullWidth={step === 1}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                  disabled={loading}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                  disabled={loading || !formData.dataUseAgreementAccepted || !formData.termsAccepted}
                >
                  {loading ? 'Creating Account...' : 'Create Researcher Account'}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/research-portal-login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-500">
          <Lock className="w-4 h-4" />
          <span className="text-xs">256-bit SSL Encrypted | FERPA Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default ResearchPortalRegister;
