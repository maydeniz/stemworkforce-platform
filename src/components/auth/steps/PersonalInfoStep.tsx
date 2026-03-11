import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import PasswordStrengthMeter from '../PasswordStrengthMeter';

interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  loading: boolean;
  acceptedTerms?: boolean;
  onAcceptedTermsChange?: (accepted: boolean) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onChange,
  onNext,
  onBack,
  isLastStep,
  loading,
  acceptedTerms,
  onAcceptedTermsChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

  const update = (field: keyof PersonalInfoData, value: string) => {
    onChange({ ...data, [field]: value });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!data.firstName.trim()) errs.firstName = 'First name is required';
    if (!data.lastName.trim()) errs.lastName = 'Last name is required';
    if (!data.email.trim()) errs.email = 'Email is required';
    else if (!isEmailValid) errs.email = 'Please enter a valid email';
    if (!data.password) errs.password = 'Password is required';
    else if (data.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!data.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (data.password !== data.confirmPassword) errs.confirmPassword = "Passwords don't match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Your details</h2>
      <p className="text-sm text-gray-400 mb-6">Tell us about yourself</p>

      <div className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            value={data.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            placeholder="First"
            autoComplete="given-name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.firstName}
            required
            disabled={loading}
          />
          <Input
            label="Last name"
            value={data.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            placeholder="Last"
            autoComplete="family-name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.lastName}
            required
            disabled={loading}
          />
        </div>

        {/* Email */}
        <Input
          label="Email address"
          type="email"
          value={data.email}
          onChange={(e) => update('email', e.target.value)}
          onBlur={() => setEmailTouched(true)}
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          rightIcon={
            emailTouched && data.email && isEmailValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : undefined
          }
          error={errors.email || (emailTouched && data.email && !isEmailValid ? 'Please enter a valid email' : undefined)}
          required
          disabled={loading}
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={data.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="Create a strong password"
            autoComplete="new-password"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password}
            required
            disabled={loading}
          />
          <PasswordStrengthMeter password={data.password} />
        </div>

        {/* Confirm password */}
        <Input
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          value={data.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          onBlur={() => setConfirmTouched(true)}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={
            errors.confirmPassword ||
            (confirmTouched && data.confirmPassword && data.password !== data.confirmPassword
              ? "Passwords don't match"
              : undefined)
          }
          required
          disabled={loading}
        />

        {/* Terms of Service */}
        {isLastStep && (
          <label className="flex items-start gap-3 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={acceptedTerms || false}
              onChange={(e) => onAcceptedTermsChange?.(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
              disabled={loading}
            />
            <span className="text-sm text-gray-400 leading-snug">
              I agree to the{' '}
              <Link to="/terms" target="_blank" className="text-indigo-400 hover:text-indigo-300 underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" className="text-indigo-400 hover:text-indigo-300 underline">
                Privacy Policy
              </Link>
            </span>
          </label>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <Button type="button" variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button
          type={isLastStep ? 'submit' : 'button'}
          fullWidth
          size="lg"
          onClick={isLastStep ? undefined : handleContinue}
          disabled={loading}
          rightIcon={!isLastStep ? <ArrowRight className="w-4 h-4" /> : undefined}
        >
          {loading ? 'Creating Account...' : isLastStep ? 'Create Account' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
