import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, CheckCircle2, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { formSwapVariants, formSwapTransition } from './AuthAnimations';

interface ForgotPasswordFormProps {
  onBack: () => void;
  initialEmail?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, initialEmail = '' }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await resetPassword(email.trim());
    setLoading(false);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || 'Failed to send reset email');
    }
  };

  return (
    <motion.div
      variants={formSwapVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={formSwapTransition}
    >
      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </button>

      {sent ? (
        /* Success state */
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-gray-400 text-sm mb-6">
            If an account exists for <strong className="text-white">{email}</strong>, you'll receive a password reset link.
          </p>
          <Button variant="secondary" onClick={onBack} fullWidth>
            Back to Sign In
          </Button>
        </div>
      ) : (
        <>
          {/* Icon */}
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-5">
            <KeyRound className="w-6 h-6 text-indigo-400" />
          </div>

          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-bold text-white outline-none"
          >
            Reset your password
          </h2>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm" role="alert">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4.5 h-4.5" />}
              required
              disabled={loading}
            />
            <Button type="submit" fullWidth size="lg" className="mt-5" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default ForgotPasswordForm;
