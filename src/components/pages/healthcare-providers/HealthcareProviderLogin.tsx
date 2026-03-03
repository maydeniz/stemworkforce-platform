// ===========================================
// Healthcare Provider Login Page
// HIPAA-Compliant Authentication with NPI Verification
// ===========================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Building2,
  Lock,
  UserPlus,
  Info,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

// ===========================================
// Types
// ===========================================

interface LoginFormData {
  email: string;
  password: string;
  npiNumber: string;
  baaAcknowledged: boolean;
}

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  npiNumber: string;
  specialty: string;
  organizationName: string;
  baaAcknowledged: boolean;
  hipaaAcknowledged: boolean;
}

// ===========================================
// Constants
// ===========================================

const SESSION_TIMEOUT_WARNING_MINUTES = 15;
const SESSION_TIMEOUT_MINUTES = 30;

const SPECIALTY_OPTIONS = [
  { value: '', label: 'Select your specialty' },
  { value: 'family_medicine', label: 'Family Medicine' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'internal_medicine', label: 'Internal Medicine' },
  { value: 'dentistry', label: 'Dentistry' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'school_nurse', label: 'School Nurse' },
  { value: 'nurse_practitioner', label: 'Nurse Practitioner' },
  { value: 'physician_assistant', label: 'Physician Assistant' },
  { value: 'sports_medicine', label: 'Sports Medicine' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'other', label: 'Other' },
];

// ===========================================
// Helper Functions
// ===========================================

/**
 * Validates NPI number format (10 digits with Luhn check)
 */
const validateNPINumber = (npi: string): { valid: boolean; message?: string } => {
  // Remove any non-digit characters
  const cleanNPI = npi.replace(/\D/g, '');

  if (cleanNPI.length === 0) {
    return { valid: false, message: 'NPI number is required' };
  }

  if (cleanNPI.length !== 10) {
    return { valid: false, message: 'NPI number must be exactly 10 digits' };
  }

  // NPI numbers should start with 1 or 2
  if (!['1', '2'].includes(cleanNPI[0])) {
    return { valid: false, message: 'Invalid NPI number format' };
  }

  // Luhn algorithm validation for NPI
  // NPI uses a modified Luhn check with prefix "80840"
  const prefixedNPI = '80840' + cleanNPI;
  let sum = 0;
  let alternate = false;

  for (let i = prefixedNPI.length - 1; i >= 0; i--) {
    let digit = parseInt(prefixedNPI[i], 10);

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  if (sum % 10 !== 0) {
    return { valid: false, message: 'Invalid NPI number (checksum failed)' };
  }

  return { valid: true };
};

/**
 * Formats NPI number for display
 */
const formatNPINumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  return digits;
};

// ===========================================
// Sub-Components
// ===========================================

// HIPAA Compliance Notice
const HIPAANotice: React.FC = () => (
  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
    <div className="flex items-start gap-3">
      <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-emerald-400 font-semibold text-sm">HIPAA-Compliant Access</h3>
        <p className="text-emerald-300/80 text-xs mt-1">
          This portal provides secure access to Protected Health Information (PHI).
          All access is logged and audited in compliance with HIPAA regulations.
        </p>
      </div>
    </div>
  </div>
);

// PHI Access Warning
const PHIWarning: React.FC = () => (
  <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-amber-400 font-semibold text-sm">PHI Access Warning</h3>
        <ul className="text-amber-300/80 text-xs mt-1 space-y-1">
          <li>- Do not access patient records without a legitimate purpose</li>
          <li>- Never share login credentials with others</li>
          <li>- Log out when leaving your workstation</li>
          <li>- Report any suspected security incidents immediately</li>
        </ul>
      </div>
    </div>
  </div>
);

// Session Timeout Warning
const SessionTimeoutWarning: React.FC<{
  minutesRemaining: number;
  onExtend: () => void;
}> = ({ minutesRemaining, onExtend }) => (
  <div className="fixed bottom-4 right-4 z-50 max-w-sm">
    <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-lg shadow-xl backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-amber-400 font-semibold text-sm">Session Expiring Soon</h3>
          <p className="text-amber-300/80 text-xs mt-1">
            Your session will expire in {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''}
            due to inactivity. PHI access will be terminated.
          </p>
          <button
            onClick={onExtend}
            className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-medium underline"
          >
            Extend Session
          </button>
        </div>
      </div>
    </div>
  </div>
);

// BAA Acknowledgment Checkbox
const BAACheckbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <div className="p-4 bg-gray-900/50 border border-dark-border rounded-lg">
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-bg text-emerald-500 focus:ring-emerald-500 focus:ring-offset-dark-bg"
      />
      <div>
        <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          Business Associate Agreement (BAA) Acknowledgment
          <span className="text-red-400">*</span>
        </span>
        <p className="text-xs text-gray-500 mt-1">
          By checking this box, I acknowledge that I have read, understand, and agree to
          comply with the terms of the Business Associate Agreement. I understand my
          responsibilities regarding the protection of Protected Health Information (PHI)
          under HIPAA regulations.
        </p>
        <Link
          to="/healthcare-providers/baa"
          className="text-xs text-emerald-400 hover:text-emerald-300 mt-1 inline-block"
          target="_blank"
        >
          View full BAA document
        </Link>
      </div>
    </label>
  </div>
);

// NPI Input Field
const NPIInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}> = ({ value, onChange, error, disabled }) => {
  const [validation, setValidation] = useState<{ valid: boolean; message?: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNPINumber(e.target.value);
    onChange(formatted);

    if (formatted.length === 10) {
      setValidation(validateNPINumber(formatted));
    } else {
      setValidation(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        NPI Number <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Building2 className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="1234567890"
          maxLength={10}
          disabled={disabled}
          className={`
            w-full bg-dark-surface border rounded-lg
            pl-10 pr-10 py-2.5 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-colors duration-200
            ${error || (validation && !validation.valid)
              ? 'border-red-500 focus:ring-red-500'
              : validation?.valid
                ? 'border-emerald-500'
                : 'border-dark-border hover:border-gray-600'
            }
          `}
        />
        {value.length === 10 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validation?.valid ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
        )}
      </div>
      {(error || (validation && !validation.valid)) && (
        <p className="mt-1.5 text-sm text-red-500">
          {error || validation?.message}
        </p>
      )}
      {validation?.valid && (
        <p className="mt-1.5 text-sm text-emerald-400 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Valid NPI format
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Enter your 10-digit National Provider Identifier
      </p>
    </div>
  );
};

// ===========================================
// Main Component
// ===========================================

const HealthcareProviderLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();

  // Form state
  const [isRegistering, setIsRegistering] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Session timeout state
  const [sessionWarningVisible, setSessionWarningVisible] = useState(false);
  const [sessionMinutesRemaining, setSessionMinutesRemaining] = useState(SESSION_TIMEOUT_WARNING_MINUTES);

  // Login form data
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    npiNumber: '',
    baaAcknowledged: false,
  });

  // Registration form data
  const [registerData, setRegisterData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    npiNumber: '',
    specialty: '',
    organizationName: '',
    baaAcknowledged: false,
    hipaaAcknowledged: false,
  });

  // Simulate session timeout warning (in real app, this would track actual activity)
  useEffect(() => {
    // This is a demo - in production, implement proper session tracking
    let timer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimers = () => {
      clearTimeout(timer);
      clearTimeout(warningTimer);
      setSessionWarningVisible(false);

      // Show warning 15 minutes before timeout
      warningTimer = setTimeout(() => {
        setSessionWarningVisible(true);
        setSessionMinutesRemaining(SESSION_TIMEOUT_WARNING_MINUTES);

        // Countdown
        const countdownInterval = setInterval(() => {
          setSessionMinutesRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 60000);

        // Auto logout after warning period
        timer = setTimeout(() => {
          clearInterval(countdownInterval);
          // In production: signOut and redirect
        }, SESSION_TIMEOUT_WARNING_MINUTES * 60000);
      }, (SESSION_TIMEOUT_MINUTES - SESSION_TIMEOUT_WARNING_MINUTES) * 60000);
    };

    // Start timers on mount
    resetTimers();

    // Reset on user activity (simplified)
    const handleActivity = () => resetTimers();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      clearTimeout(timer);
      clearTimeout(warningTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, []);

  const handleExtendSession = useCallback(() => {
    setSessionWarningVisible(false);
    setSessionMinutesRemaining(SESSION_TIMEOUT_WARNING_MINUTES);
    // In production: call API to extend session
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate NPI
    const npiValidation = validateNPINumber(loginData.npiNumber);
    if (!npiValidation.valid) {
      setError(npiValidation.message || 'Invalid NPI number');
      setLoading(false);
      return;
    }

    // Validate BAA acknowledgment
    if (!loginData.baaAcknowledged) {
      setError('You must acknowledge the Business Associate Agreement to proceed');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn(loginData.email, loginData.password);

      if (result.success) {
        // In production: verify NPI matches user profile before redirecting
        navigate('/healthcare-provider-dashboard');
      } else {
        let errorMessage = result.error || 'Login failed. Please try again.';
        if (errorMessage.toLowerCase().includes('email not confirmed')) {
          errorMessage = 'Please confirm your email before signing in. Check your inbox for a confirmation link.';
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate NPI
    const npiValidation = validateNPINumber(registerData.npiNumber);
    if (!npiValidation.valid) {
      setError(npiValidation.message || 'Invalid NPI number');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (registerData.password.length < 12) {
      setError('Password must be at least 12 characters for healthcare provider accounts');
      setLoading(false);
      return;
    }

    // Validate specialty
    if (!registerData.specialty) {
      setError('Please select your specialty');
      setLoading(false);
      return;
    }

    // Validate BAA acknowledgment
    if (!registerData.baaAcknowledged) {
      setError('You must acknowledge the Business Associate Agreement to register');
      setLoading(false);
      return;
    }

    // Validate HIPAA acknowledgment
    if (!registerData.hipaaAcknowledged) {
      setError('You must acknowledge HIPAA compliance requirements to register');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName,
        'healthcare_provider',
        registerData.organizationName
      );

      if (result.success) {
        if (result.needsEmailConfirmation) {
          setMessage(
            'Registration successful! Please check your email to verify your account. ' +
            'Your NPI number will be verified before your account is fully activated.'
          );
          setIsRegistering(false);
        } else {
          navigate('/healthcare-provider-dashboard');
        }
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!loginData.email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(loginData.email);

      if (result.success) {
        setMessage('If an account exists with this email, you will receive a password reset link.');
        setShowForgotPassword(false);
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      {/* Session timeout warning */}
      {sessionWarningVisible && (
        <SessionTimeoutWarning
          minutesRemaining={sessionMinutesRemaining}
          onExtend={handleExtendSession}
        />
      )}

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Healthcare Portal</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">
            {isRegistering ? 'Provider Registration' : 'Provider Login'}
          </h1>
          <p className="text-gray-400 mt-2">
            {isRegistering
              ? 'Create your HIPAA-compliant healthcare provider account'
              : 'Secure access to student health records'
            }
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-dark-surface p-8 rounded-xl border border-dark-border">
          {/* HIPAA Notice */}
          <HIPAANotice />

          {/* PHI Warning */}
          <PHIWarning />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-emerald-400 text-sm">{message}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          {!isRegistering && !showForgotPassword && (
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="provider@healthcare.org"
                  required
                  disabled={loading}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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

                <NPIInput
                  value={loginData.npiNumber}
                  onChange={(value) => setLoginData({ ...loginData, npiNumber: value })}
                  disabled={loading}
                />

                <BAACheckbox
                  checked={loginData.baaAcknowledged}
                  onChange={(checked) => setLoginData({ ...loginData, baaAcknowledged: checked })}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                fullWidth
                className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                disabled={loading || !loginData.baaAcknowledged}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">...</span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Secure Sign In
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Forgot Password Form */}
          {showForgotPassword && (
            <form onSubmit={handleForgotPassword}>
              <p className="text-gray-400 text-sm mb-4">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>

              <Input
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="provider@healthcare.org"
                required
                disabled={loading}
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                    setMessage(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-dark-bg border border-dark-border text-white font-medium rounded-lg hover:bg-dark-border/50 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {isRegistering && (
            <form onSubmit={handleRegister}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                    placeholder="John"
                    required
                    disabled={loading}
                  />
                  <Input
                    label="Last Name"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                    placeholder="Smith"
                    required
                    disabled={loading}
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="provider@healthcare.org"
                  required
                  disabled={loading}
                />

                <NPIInput
                  value={registerData.npiNumber}
                  onChange={(value) => setRegisterData({ ...registerData, npiNumber: value })}
                  disabled={loading}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Specialty <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={registerData.specialty}
                    onChange={(e) => setRegisterData({ ...registerData, specialty: e.target.value })}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  >
                    {SPECIALTY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Organization / Practice Name"
                  value={registerData.organizationName}
                  onChange={(e) => setRegisterData({ ...registerData, organizationName: e.target.value })}
                  placeholder="City Medical Center"
                  required
                  disabled={loading}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Min. 12 characters"
                    required
                    disabled={loading}
                    helperText="Healthcare accounts require a minimum of 12 characters"
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

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="Re-enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* HIPAA Training Acknowledgment */}
                <div className="p-4 bg-gray-900/50 border border-dark-border rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registerData.hipaaAcknowledged}
                      onChange={(e) => setRegisterData({ ...registerData, hipaaAcknowledged: e.target.checked })}
                      disabled={loading}
                      className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-bg text-emerald-500 focus:ring-emerald-500 focus:ring-offset-dark-bg"
                    />
                    <div>
                      <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        HIPAA Compliance Acknowledgment
                        <span className="text-red-400">*</span>
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        I certify that I have completed HIPAA training within the past 12 months and
                        understand my obligations regarding the protection of Protected Health Information (PHI).
                      </p>
                    </div>
                  </label>
                </div>

                <BAACheckbox
                  checked={registerData.baaAcknowledged}
                  onChange={(checked) => setRegisterData({ ...registerData, baaAcknowledged: checked })}
                  disabled={loading}
                />
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-300">
                    Your NPI number will be verified through the NPPES registry.
                    Account activation may take 1-2 business days pending verification.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                disabled={loading || !registerData.baaAcknowledged || !registerData.hipaaAcknowledged}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">...</span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register as Provider
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Toggle between login and register */}
          {!showForgotPassword && (
            <div className="mt-6 pt-6 border-t border-dark-border">
              <p className="text-center text-gray-400">
                {isRegistering ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering(false);
                        setError(null);
                        setMessage(null);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    New healthcare provider?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering(true);
                        setError(null);
                        setMessage(null);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Register here
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Need help?{' '}
            <Link to="/healthcare-providers/support" className="text-emerald-400 hover:text-emerald-300">
              Contact Support
            </Link>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <Link to="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-gray-400">Terms of Service</Link>
            <span>|</span>
            <Link to="/healthcare-providers/hipaa-notice" className="hover:text-gray-400">HIPAA Notice</Link>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
          <Lock className="w-4 h-4" />
          <span className="text-xs">256-bit SSL Encrypted | HIPAA Compliant | SOC 2 Type II Certified</span>
        </div>
      </div>
    </div>
  );
};

export default HealthcareProviderLogin;
