// ===========================================
// Auth Required Modal
// ===========================================
// Informative modal shown when unauthenticated users
// try to request a consultation
// ===========================================

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  UserPlus,
  LogIn,
  Shield,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useFocusTrap, useKeyPress } from '@/hooks';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  industry: string;
  serviceName: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  industry,
  serviceName,
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and keyboard handling
  useFocusTrap(modalRef, isOpen);
  useKeyPress('Escape', () => {
    if (isOpen) onClose();
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSignUp = () => {
    const returnUrl = encodeURIComponent(window.location.pathname);
    navigate(`/register?role=client&industry=${industry}&returnUrl=${returnUrl}&openConsultation=true`);
    onClose();
  };

  const handleSignIn = () => {
    const returnUrl = encodeURIComponent(window.location.pathname);
    navigate(`/login?returnUrl=${returnUrl}&openConsultation=true`);
    onClose();
  };

  const benefits = [
    { icon: <Clock className="w-5 h-5" />, text: 'Save your consultation request for later' },
    { icon: <Shield className="w-5 h-5" />, text: 'Track status and communicate with consultants' },
    { icon: <Sparkles className="w-5 h-5" />, text: 'Get personalized recommendations' },
  ];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md mx-4 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>

              <h2 id="auth-modal-title" className="text-2xl font-bold text-center text-white mb-2">
                Create an Account to Continue
              </h2>
              <p className="text-gray-400 text-center">
                Sign up or log in to request a consultation for{' '}
                <span className="text-purple-400 font-medium">{serviceName}</span>
              </p>
            </div>

            {/* Benefits */}
            <div className="px-6 py-4 border-t border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Why create an account?
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-purple-400">
                      {benefit.icon}
                    </div>
                    <span className="text-sm">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="px-6 py-5 bg-gray-950/50 border-t border-gray-800">
              <button
                onClick={handleSignUp}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mb-3"
              >
                <UserPlus className="w-5 h-5" />
                Create Free Account
              </button>

              <button
                onClick={handleSignIn}
                className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                I Already Have an Account
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                <CheckCircle2 className="w-3 h-3 inline mr-1" />
                Free to create • No credit card required
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Use portal to render at document root
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
};

export default AuthRequiredModal;
