import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import OAuthButtons from './OAuthButtons';
import ForgotPasswordForm from './ForgotPasswordForm';
import { formSwapVariants, formSwapTransition } from './AuthAnimations';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  // Inline email validation
  const [emailTouched, setEmailTouched] = useState(false);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(email.trim(), password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      let errorMessage = result.error || 'Login failed. Please try again.';
      if (errorMessage.toLowerCase().includes('email not confirmed')) {
        errorMessage = 'Please confirm your email before signing in. Check your inbox for a confirmation link.';
      }
      setError(errorMessage);
    }

    setLoading(false);
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
            setMessage(null);
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

        {/* Error/success messages */}
        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm" role="alert">{error}</p>
          </div>
        )}
        {message && (
          <div className="mb-5 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm" role="status">{message}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} aria-label="Sign in form" className="space-y-4">
          {/* Email */}
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
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
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
            disabled={loading}
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-400">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setShowForgot(true);
                setError(null);
                setMessage(null);
              }}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
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
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginForm;
