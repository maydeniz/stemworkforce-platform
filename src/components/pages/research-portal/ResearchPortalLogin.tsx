// ===========================================
// Research Portal Login Page
// FERPA-compliant login with institutional verification
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Shield,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  BookOpen,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

// ===========================================
// TYPES
// ===========================================

interface IRBTrainingStatus {
  citiCompleted: boolean;
  citiExpirationDate?: string;
  ferpaTrainingCompleted: boolean;
  ferpaTrainingDate?: string;
  humanSubjectsApproved: boolean;
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
  // Remove TLD and common subdomains
  const parts = domain.split('.');
  if (parts.length >= 2) {
    // Get the institution name (usually the second-to-last part before TLD)
    const institutionPart = parts[parts.length - 2];
    return institutionPart.charAt(0).toUpperCase() + institutionPart.slice(1);
  }
  return 'Unknown Institution';
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
        <h3 className="font-semibold text-white mb-2">FERPA Compliance Notice</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          The Research Portal provides access to de-identified educational data protected under the
          Family Educational Rights and Privacy Act (FERPA). By accessing this portal, you acknowledge
          that you have completed required FERPA training and agree to handle all data in accordance
          with federal privacy regulations and your institution's IRB protocols.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded text-xs">
            <Lock className="w-3 h-3" />
            20 U.S.C. § 1232g
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded text-xs">
            <FileText className="w-3 h-3" />
            34 CFR Part 99
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
      </label>
    </div>
  </div>
);

// ===========================================
// IRB/CITI TRAINING STATUS INDICATOR
// ===========================================

interface TrainingStatusIndicatorProps {
  status: IRBTrainingStatus | null;
  email: string;
}

const TrainingStatusIndicator: React.FC<TrainingStatusIndicatorProps> = ({ status, email }) => {
  // Mock status check based on email - in production, this would query the backend
  const mockStatus: IRBTrainingStatus = status || {
    citiCompleted: email.includes('.edu'),
    ferpaTrainingCompleted: email.includes('.edu'),
    humanSubjectsApproved: false,
  };

  if (!email) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mt-4">
      <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-indigo-400" />
        IRB / CITI Training Status
      </h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">CITI Human Subjects Training</span>
          {mockStatus.citiCompleted ? (
            <span className="flex items-center gap-1 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Required
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">FERPA Training</span>
          {mockStatus.ferpaTrainingCompleted ? (
            <span className="flex items-center gap-1 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Required
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">IRB Protocol Approval</span>
          {mockStatus.humanSubjectsApproved ? (
            <span className="flex items-center gap-1 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Approved
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <XCircle className="w-4 h-4" />
              Not Required for Login
            </span>
          )}
        </div>
      </div>
      {(!mockStatus.citiCompleted || !mockStatus.ferpaTrainingCompleted) && (
        <p className="mt-3 text-xs text-amber-400/80 bg-amber-500/10 p-2 rounded">
          Note: Incomplete training may limit access to certain data sets. Complete required training
          through your institution's research compliance office.
        </p>
      )}
    </div>
  );
};

// ===========================================
// MAIN LOGIN COMPONENT
// ===========================================

const ResearchPortalLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dataUseAgreementAccepted, setDataUseAgreementAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Training status (would be fetched from backend in production)
  const [trainingStatus] = useState<IRBTrainingStatus | null>(null);

  // Email validation
  const emailValidation = useMemo(() => {
    if (!email) return { valid: true, message: undefined };
    return validateInstitutionalEmail(email);
  }, [email]);

  // Detected institution from email
  const detectedInstitution = useMemo(() => {
    if (!email || !emailValidation.valid) return null;
    return getInstitutionFromEmail(email);
  }, [email, emailValidation.valid]);

  // Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate institutional email
    const validation = validateInstitutionalEmail(email);
    if (!validation.valid) {
      setError(validation.message || 'Invalid institutional email');
      setLoading(false);
      return;
    }

    // Require data use agreement acknowledgment
    if (!dataUseAgreementAccepted) {
      setError('You must acknowledge the Data Use Agreement to access the Research Portal');
      setLoading(false);
      return;
    }

    // Attempt sign in
    const result = await signIn(email, password);

    if (result.success) {
      // Redirect to research portal dashboard
      navigate('/research-portal');
    } else {
      let errorMessage = result.error || 'Login failed. Please try again.';

      // Provide clearer error messages
      if (errorMessage.toLowerCase().includes('email not confirmed')) {
        errorMessage = 'Please confirm your email before signing in. Check your institutional inbox for a confirmation link.';
      } else if (errorMessage.toLowerCase().includes('invalid login credentials')) {
        errorMessage = 'Invalid email or password. If you have not registered, please create an account first.';
      }

      setError(errorMessage);
    }

    setLoading(false);
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your institutional email address');
      return;
    }

    // Validate institutional email for password reset
    const validation = validateInstitutionalEmail(email);
    if (!validation.valid) {
      setError(validation.message || 'Please enter a valid institutional email');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await resetPassword(email);

    setLoading(false);

    if (result.success) {
      setMessage('If an account exists with this institutional email, you will receive a password reset link.');
      setShowForgotPassword(false);
    } else {
      setError(result.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Research Portal</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Researcher Sign In</h1>
          <p className="text-gray-400 mt-2">
            Access educational research data with FERPA compliance
          </p>
        </div>

        {/* FERPA Compliance Notice */}
        <FerpaComplianceNotice />

        {/* Login Card */}
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-emerald-400 text-sm">{message}</p>
            </div>
          )}

          {/* Login Form */}
          {!showForgotPassword ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Institutional Email */}
                <div>
                  <Input
                    label="Institutional Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@university.edu"
                    required
                    disabled={loading}
                    error={email && !emailValidation.valid ? emailValidation.message : undefined}
                  />
                  {email && emailValidation.valid && detectedInstitution && (
                    <p className="mt-1 text-sm text-indigo-400 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      Institution detected: {detectedInstitution}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setError(null);
                      setMessage(null);
                    }}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* IRB/CITI Training Status */}
                {email && emailValidation.valid && (
                  <TrainingStatusIndicator status={trainingStatus} email={email} />
                )}

                {/* Data Use Agreement */}
                <DataUseAgreement
                  accepted={dataUseAgreementAccepted}
                  onChange={setDataUseAgreementAccepted}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                disabled={loading || !emailValidation.valid || !dataUseAgreementAccepted}
              >
                {loading ? 'Signing in...' : 'Sign In to Research Portal'}
              </Button>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword}>
              <p className="text-gray-400 text-sm mb-4">
                Enter your institutional email address and we will send you a link to reset your password.
              </p>

              <Input
                label="Institutional Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@university.edu"
                required
                disabled={loading}
                error={email && !emailValidation.valid ? emailValidation.message : undefined}
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                    setMessage(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-gray-800 border border-gray-700 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">New to Research Portal?</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="space-y-4">
            <Link
              to="/research-portal/register"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              <GraduationCap className="w-5 h-5" />
              Register as a Researcher
            </Link>
            <p className="text-center text-sm text-gray-500">
              Registration requires institutional email verification and IRB/CITI training credentials
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Need help?{' '}
            <Link to="/help" className="text-indigo-400 hover:text-indigo-300">
              Contact Research Support
            </Link>
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-400">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/terms" className="text-gray-500 hover:text-gray-400">
              Terms of Use
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/research-portal/data-governance" className="text-gray-500 hover:text-gray-400">
              Data Governance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPortalLogin;
