import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, CheckCircle2 } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Contains a number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Contains special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-gray-700' };

  const passed = REQUIREMENTS.filter(r => r.test(password)).length;

  if (passed <= 1) return { score: 20, label: 'Weak', color: 'bg-red-500' };
  if (passed <= 2) return { score: 40, label: 'Fair', color: 'bg-yellow-500' };
  if (passed <= 3) return { score: 60, label: 'Good', color: 'bg-emerald-500' };
  if (passed <= 4) return { score: 80, label: 'Strong', color: 'bg-emerald-400' };
  return { score: 100, label: 'Excellent', color: 'bg-emerald-400' };
}

function getLabelColor(label: string): string {
  switch (label) {
    case 'Weak': return 'text-red-500';
    case 'Fair': return 'text-yellow-500';
    case 'Good': return 'text-emerald-500';
    case 'Strong':
    case 'Excellent': return 'text-emerald-400';
    default: return 'text-gray-500';
  }
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score, label, color } = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-3">
      {/* Strength bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${color}`}
            initial={{ width: '0%' }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="meter"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Password strength: ${label}`}
          />
        </div>
        <span className={`text-xs font-medium ${getLabelColor(label)} min-w-[60px]`}>
          {label}
        </span>
      </div>

      {/* Requirements checklist */}
      <ul className="mt-3 space-y-1.5" aria-label="Password requirements">
        {REQUIREMENTS.map((req) => {
          const passed = req.test(password);
          return (
            <li key={req.label} className="flex items-center gap-2 text-xs">
              <AnimatePresence mode="wait">
                {passed ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </motion.div>
                ) : (
                  <motion.div key="circle" initial={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Circle className="w-3.5 h-3.5 text-gray-600" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={passed ? 'text-emerald-400' : 'text-gray-500'}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
