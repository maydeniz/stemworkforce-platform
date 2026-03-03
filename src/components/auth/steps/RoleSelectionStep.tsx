import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { staggerContainer, staggerItem } from '../AuthAnimations';

export const ROLE_OPTIONS = [
  { value: 'student_hs', label: 'High School Student', description: 'College prep, STEM career discovery', icon: '🎓' },
  { value: 'student_college', label: 'College Student', description: 'Internships, career launch, research', icon: '🎯' },
  { value: 'jobseeker', label: 'Job Seeker', description: 'Full-time STEM positions and career growth', icon: '💼' },
  { value: 'educator', label: 'Education Partner', description: 'Universities, colleges, training programs', icon: '📚' },
  { value: 'partner_federal', label: 'Federal Agency', description: 'DOE, DOD, NASA, NSF and more', icon: '🏛️' },
  { value: 'partner_state', label: 'State & Local Agency', description: 'Workforce boards, economic development', icon: '🗺️' },
  { value: 'partner_lab', label: 'National Laboratory', description: 'DOE national labs and FFRDCs', icon: '⚛️' },
  { value: 'partner_industry', label: 'Industry Partner', description: 'Private sector and corporate sponsors', icon: '🏢' },
  { value: 'partner_nonprofit', label: 'Non-Profit Organization', description: 'Workforce nonprofits and STEM ed orgs', icon: '💚' },
  { value: 'service_provider', label: 'Service Provider', description: 'Consultants, recruiters, career coaches', icon: '⭐' },
];

interface RoleSelectionStepProps {
  selectedRole: string;
  onSelect: (role: string) => void;
  onNext: () => void;
}

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({ selectedRole, onSelect, onNext }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">I am a...</h2>
      <p className="text-sm text-gray-400 mb-6">Select the role that best describes you</p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selectedRole === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              variants={staggerItem}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(option.value)}
              className={`
                relative text-left p-4 rounded-xl transition-all duration-200
                ${isSelected
                  ? 'bg-indigo-500/10 border-2 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900'
                }
              `}
            >
              {isSelected && (
                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-indigo-400" />
              )}
              <span className="text-2xl block mb-2">{option.icon}</span>
              <span className="text-sm font-medium text-white block">{option.label}</span>
              <span className="text-xs text-gray-500 mt-0.5 block">{option.description}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <Button
        type="button"
        fullWidth
        size="lg"
        className="mt-6"
        disabled={!selectedRole}
        onClick={onNext}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Continue
      </Button>
    </div>
  );
};

export default RoleSelectionStep;
