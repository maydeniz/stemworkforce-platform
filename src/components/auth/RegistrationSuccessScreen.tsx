import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { successCheckVariants, successCheckTransition } from './AuthAnimations';

interface RegistrationSuccessScreenProps {
  email: string;
}

const RegistrationSuccessScreen: React.FC<RegistrationSuccessScreenProps> = ({ email }) => {
  return (
    <div className="text-center py-8">
      {/* Animated checkmark */}
      <motion.div
        className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        variants={successCheckVariants}
        initial="initial"
        animate="animate"
        transition={successCheckTransition}
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-3">Check Your Email</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          We've sent a confirmation link to{' '}
          <strong className="text-white">{email}</strong>.
          <br />
          Click the link to activate your account.
        </p>
        <Link to="/login">
          <Button variant="secondary" size="lg">
            Back to Sign In
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default RegistrationSuccessScreen;
