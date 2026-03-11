import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import OAuthButtons from './OAuthButtons';
import ForgotPasswordForm from './ForgotPasswordForm';
import { formSwapVariants, formSwapTransition } from './AuthAnimations';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  // Inline email validation
  const [emailTouched, setEmailTouched] = useState(false);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Redirect already-authenticated users
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email.trim(), password);

      if (result.success) {
        navigate(returnTo);
      } else {
        let errorMessage = result.error || 'Login failed. Please try again.';
        if (errorMessage.toLowerCase().includes('email not confirmed')) {
          errorMessage = 'Please confirm your email before signing in. Check your inbox for a confirmation link.';
        } else if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        }
        setError(errorMessage);
      }
    } catch {
      setError('Unable to connect. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthError = (msg: string) => {
    setError(msg);
  };

  if (showForgot) {
    return (
      <AnimatePresence mode="wait">
        <ForgotPasswordForm
          key="forgot"
          onBack={() => {
            setShowForgot(false);
            setError(null);
          }}
          initialEmail={email}
        />
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="login"
        variants={formSwapVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={formSwapTransition}
      >
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
        </div>

        {/* Error message with animation */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm" role="alert">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} aria-label="Sign in form" className="space-y-4" id="login-form">
          {/* Email */}
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
            rightIcon={
              emailTouched && email && isEmailValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : undefined
            }
            error={emailTouched && email && !isEmailValid ? 'Please enter a valid email' : undefined}
            required
            disabled={loading}
          />

          {/* Password */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
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
            required
            disabled={loading}
          />

          {/* Forgot password */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForgot(true);
                setError(null);
              }}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            Sign In
          </Button>

          {/* Trust signal (visible on all screens) */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <Shield className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <span className="text-xs text-gray-500">Protected by 256-bit TLS encryption</span>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#0a0a0f] text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* OAuth */}
        <OAuthButtons onError={handleOAuthError} mode="signin" />

        {/* Sign up link */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
          <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <span>·</span>
          <Link to="/help" className="hover:text-gray-400 transition-colors">Help</Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginForm;
