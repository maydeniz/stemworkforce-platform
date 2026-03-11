import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmailDomain } from '@/utils/emailDomain';
import StepProgressIndicator from './StepProgressIndicator';
import OAuthButtons from './OAuthButtons';
import RegistrationSuccessScreen from './RegistrationSuccessScreen';
import RoleSelectionStep from './steps/RoleSelectionStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import OrganizationStep from './steps/OrganizationStep';
import { stepForwardVariants, stepBackwardVariants, stepTransition } from './AuthAnimations';

/** Map pricing page persona query param to a registration role value.
 *  Values MUST match ROLE_OPTIONS in RoleSelectionStep.tsx */
const PERSONA_TO_ROLE: Record<string, string> = {
  jobseeker: 'jobseeker',
  student_hs: 'student_hs',
  student_college: 'student_college',
  student: 'student_college',          // generic "student" defaults to college
  employer: 'employer',
  industry_partner: 'partner_industry',
  education_partner: 'educator',
  service_provider: 'service_provider',
  government: 'partner_federal',
  national_labs: 'partner_lab',
  nonprofit: 'partner_nonprofit',
};

const RegisterWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form data — pre-populate role from ?persona= query param if present
  const personaParam = searchParams.get('persona');
  const planParam = searchParams.get('plan');
  const initialRole = personaParam ? (PERSONA_TO_ROLE[personaParam] || '') : '';
  const [role, setRole] = useState(initialRole);

  // If persona was pre-selected, skip the role step
  useEffect(() => {
    if (initialRole && currentStep === 0) {
      setDirection('forward');
      setCurrentStep(1);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
  const [organizationName, setOrganizationName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [collegeUnit, setCollegeUnit] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Role requires organization step?
  const isPartnerRole = role.startsWith('partner_') || role === 'educator' || role === 'service_provider' || role === 'employer';
  const usesOrgSelector = ['partner_lab', 'partner_federal'].includes(role);
  const totalSteps = isPartnerRole ? 3 : 2;
  const isLastPersonalStep = !isPartnerRole;

  const stepLabels = isPartnerRole
    ? [{ label: 'Role' }, { label: 'Details' }, { label: 'Organization' }]
    : [{ label: 'Role' }, { label: 'Details' }];

  const getEffectiveOrgName = (): string => {
    if (role === 'educator') {
      const parts = [collegeName, collegeUnit].filter(Boolean);
      return parts.join(' - ');
    }
    if (usesOrgSelector) {
      const parts = [];
      if (organizationData.organizationName) parts.push(organizationData.organizationName);
      else if (organizationData.customOrganization) parts.push(organizationData.customOrganization);
      if (organizationData.subunitName || organizationData.customSubunit) {
        parts.push(organizationData.subunitName || organizationData.customSubunit);
      }
      if (organizationData.departmentName || organizationData.customDepartment) {
        parts.push(organizationData.departmentName || organizationData.customDepartment);
      }
      return parts.join(' - ');
    }
    return organizationName;
  };

  const goForward = () => {
    setDirection('forward');
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const goBack = () => {
    setDirection('backward');
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate organization if on org step
    if (isPartnerRole) {
      if (role === 'educator') {
        if (!collegeName.trim()) {
          setError('Please enter your college or university name');
          return;
        }
      } else if (usesOrgSelector) {
        const hasOrg = organizationData.organizationName || organizationData.customOrganization;
        if (!hasOrg) {
          setError('Please select or enter your organization');
          return;
        }
        const validation = validateEmailDomain(
          personalInfo.email,
          organizationData.organizationId,
          organizationData.organizationName
        );
        if (!validation.valid) {
          setError(validation.message || 'Email domain does not match the selected organization');
          return;
        }
      } else if (!organizationName.trim()) {
        setError('Please enter your organization name');
        return;
      }
    }

    // Validate personal info
    if (!personalInfo.firstName.trim() || !personalInfo.lastName.trim()) {
      setError('Please enter your first and last name');
      return;
    }
    if (!personalInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (personalInfo.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (personalInfo.password !== personalInfo.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    const effectiveOrgName = getEffectiveOrgName();

    const result = await signUp(
      personalInfo.email.trim(),
      personalInfo.password,
      personalInfo.firstName.trim(),
      personalInfo.lastName.trim(),
      role,
      effectiveOrgName || undefined
    );

    setLoading(false);

    if (result.success) {
      if (result.needsEmailConfirmation) {
        setSuccess(true);
      } else {
        // If a plan was pre-selected from pricing page, redirect to billing
        navigate(planParam ? `/dashboard?plan=${planParam}` : '/dashboard');
      }
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleOAuthError = (msg: string) => {
    setError(msg);
  };

  if (success) {
    return <RegistrationSuccessScreen email={personalInfo.email} />;
  }

  const variants = direction === 'forward' ? stepForwardVariants : stepBackwardVariants;

  return (
    <div>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="text-sm text-gray-400 mt-1">Join the STEM workforce platform</p>
      </div>

      {/* Step indicator */}
      <StepProgressIndicator steps={stepLabels} currentStep={currentStep} />

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm" role="alert">{error}</p>
        </div>
      )}

      {/* Steps */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepTransition}
            >
              <RoleSelectionStep
                selectedRole={role}
                onSelect={setRole}
                onNext={goForward}
              />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepTransition}
            >
              <PersonalInfoStep
                data={personalInfo}
                onChange={setPersonalInfo}
                onNext={isLastPersonalStep ? () => {} : goForward}
                onBack={goBack}
                isLastStep={isLastPersonalStep}
                loading={loading}
                acceptedTerms={acceptedTerms}
                onAcceptedTermsChange={setAcceptedTerms}
              />
            </motion.div>
          )}

          {currentStep === 2 && isPartnerRole && (
            <motion.div
              key="step-2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepTransition}
            >
              <OrganizationStep
                role={role}
                email={personalInfo.email}
                organizationData={organizationData}
                organizationName={organizationName}
                collegeName={collegeName}
                collegeUnit={collegeUnit}
                onOrganizationDataChange={setOrganizationData}
                onOrganizationNameChange={setOrganizationName}
                onCollegeNameChange={setCollegeName}
                onCollegeUnitChange={setCollegeUnit}
                onBack={goBack}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* OAuth + sign in link (only on step 0) */}
      {currentStep === 0 && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#0a0a0f] text-gray-500">Or continue with</span>
            </div>
          </div>

          <OAuthButtons onError={handleOAuthError} mode="signup" />

          <p className="text-center text-gray-400 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default RegisterWizard;
