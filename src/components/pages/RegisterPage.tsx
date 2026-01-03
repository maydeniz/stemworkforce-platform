import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { OrganizationSelector } from '@/components/common/OrganizationSelector';

// Role options for registration
const ROLE_OPTIONS = [
  { value: 'intern', label: 'Intern / Student', description: 'Looking for internships and learning opportunities', icon: '🎓' },
  { value: 'jobseeker', label: 'Job Seeker', description: 'Looking for full-time STEM positions', icon: '💼' },
  { value: 'educator', label: 'Education Provider', description: 'Universities, colleges, training programs', icon: '📚' },
  { value: 'partner_federal', label: 'Federal Government', description: 'Federal agencies and departments', icon: '🏛️' },
  { value: 'partner_lab', label: 'National Laboratory', description: 'DOE national laboratories', icon: '⚛️' },
  { value: 'partner_industry', label: 'Industry Partner', description: 'Private sector companies', icon: '🏢' },
  { value: 'partner_nonprofit', label: 'Non-Profit Organization', description: 'Non-profit and NGOs', icon: '💚' },
  { value: 'partner_academic', label: 'Academic Institution', description: 'Research universities and institutes', icon: '🔬' },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, signInWithGithub, signInWithApple } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    organizationName: '',
  });

  // Organization selector state for hierarchical selection
  const [organizationData, setOrganizationData] = useState<{
    organizationId: string;
    organizationName: string;
    subunitId?: string;
    subunitName?: string;
    departmentId?: string;
    departmentName?: string;
    customOrganization?: string;
    customSubunit?: string;
    customDepartment?: string;
  }>({
    organizationId: '',
    organizationName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isPartnerRole = formData.role.startsWith('partner_') || formData.role === 'educator';

  // Check if role uses hierarchical organization selector
  const usesOrgSelector = ['educator', 'partner_academic', 'partner_lab', 'partner_federal'].includes(formData.role);

  // Get the effective organization name for submission
  const getEffectiveOrgName = () => {
    if (usesOrgSelector) {
      // Build full organization path
      const parts = [];
      if (organizationData.organizationName) {
        parts.push(organizationData.organizationName);
      } else if (organizationData.customOrganization) {
        parts.push(organizationData.customOrganization);
      }
      if (organizationData.subunitName || organizationData.customSubunit) {
        parts.push(organizationData.subunitName || organizationData.customSubunit);
      }
      if (organizationData.departmentName || organizationData.customDepartment) {
        parts.push(organizationData.departmentName || organizationData.customDepartment);
      }
      return parts.join(' - ');
    }
    return formData.organizationName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.role) {
      setError('Please select your role');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Validate organization based on role type
    if (isPartnerRole) {
      if (usesOrgSelector) {
        // For roles using the organization selector
        const hasOrg = organizationData.organizationName || organizationData.customOrganization;
        if (!hasOrg) {
          setError('Please select or enter your organization');
          setLoading(false);
          return;
        }
      } else {
        // For other partner roles using simple text input
        if (!formData.organizationName.trim()) {
          setError('Please enter your organization name');
          setLoading(false);
          return;
        }
      }
    }

    const effectiveOrgName = getEffectiveOrgName();

    const result = await signUp(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.role,
      effectiveOrgName || undefined
    );

    setLoading(false);

    if (result.success) {
      if (result.needsEmailConfirmation) {
        // Show success screen - user needs to confirm email
        setSuccess(true);
      } else {
        // User is signed in, navigate to dashboard
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || 'Failed to sign in with Google');
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    const result = await signInWithGithub();
    if (!result.success) {
      setError(result.error || 'Failed to sign in with GitHub');
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    const result = await signInWithApple();
    if (!result.success) {
      setError(result.error || 'Failed to sign in with Apple');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-dark-surface p-8 rounded-xl border border-dark-border text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-gray-400 mb-6">
              We've sent a confirmation link to <strong className="text-white">{formData.email}</strong>.
              Click the link to activate your account.
            </p>
            <Link to="/login">
              <Button variant="secondary">Back to Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SW</span>
            </div>
            <span className="text-white font-bold text-xl">STEMWorkforce</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Join the STEM workforce platform</p>
        </div>

        <div className="bg-dark-surface p-8 rounded-xl border border-dark-border">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  I am a... <span className="text-red-400">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select your role</option>
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                {formData.role && (
                  <p className="mt-1 text-xs text-gray-500">
                    {ROLE_OPTIONS.find(r => r.value === formData.role)?.description}
                  </p>
                )}
              </div>

              {/* Organization Selector - shown for partners and educators */}
              {isPartnerRole && (
                usesOrgSelector ? (
                  // Hierarchical organization selector for universities, labs, and federal agencies
                  <OrganizationSelector
                    role={formData.role}
                    value={organizationData}
                    onChange={setOrganizationData}
                    disabled={loading}
                  />
                ) : (
                  // Simple text input for industry and nonprofit partners
                  <Input
                    label="Organization Name"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="e.g., Lockheed Martin, SpaceX, Red Cross"
                    required
                    disabled={loading}
                  />
                )
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  disabled={loading}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  disabled={loading}
                />
              </div>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" fullWidth className="mt-6" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-surface text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dark-border rounded-lg text-white hover:bg-dark-bg transition-colors"
              title="Sign up with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={handleGithubSignIn}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dark-border rounded-lg text-white hover:bg-dark-bg transition-colors"
              title="Sign up with GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={handleAppleSignIn}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dark-border rounded-lg text-white hover:bg-dark-bg transition-colors"
              title="Sign up with Apple"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
