import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { staggerContainer, staggerItem } from '../AuthAnimations';

const INDIVIDUAL_ROLES = [
  { value: 'student_hs', label: 'High School Student', description: 'College prep, STEM career discovery', icon: '🎓' },
  { value: 'student_college', label: 'College Student', description: 'Internships, career launch, research', icon: '🎯' },
  { value: 'jobseeker', label: 'Job Seeker', description: 'Full-time STEM positions and career growth', icon: '💼' },
  { value: 'employer', label: 'Employer', description: 'Post jobs and recruit STEM talent', icon: '🏗️' },
];

const ORGANIZATION_ROLES = [
  { value: 'educator', label: 'Education Partner', description: 'Universities, colleges, training programs', icon: '📚' },
  { value: 'partner_federal', label: 'Federal Agency', description: 'DOE, DOD, NASA, NSF and more', icon: '🏛️' },
  { value: 'partner_state', label: 'State & Local Agency', description: 'Workforce boards, economic development', icon: '🗺️' },
  { value: 'partner_lab', label: 'National Laboratory', description: 'DOE national labs and FFRDCs', icon: '⚛️' },
  { value: 'partner_industry', label: 'Industry Partner', description: 'Private sector and corporate sponsors', icon: '🏢' },
  { value: 'partner_nonprofit', label: 'Non-Profit Organization', description: 'Workforce nonprofits and STEM ed orgs', icon: '💚' },
  { value: 'service_provider', label: 'Service Provider', description: 'Consultants, recruiters, career coaches', icon: '⭐' },
];

export const ROLE_OPTIONS = [...INDIVIDUAL_ROLES, ...ORGANIZATION_ROLES];

interface RoleSelectionStepProps {
  selectedRole: string;
  onSelect: (role: string) => void;
  onNext: () => void;
}

const RoleCard: React.FC<{
  option: typeof ROLE_OPTIONS[0];
  isSelected: boolean;
  onSelect: () => void;
}> = ({ option, isSelected, onSelect }) => (
  <motion.button
    type="button"
    variants={staggerItem}
    whileTap={{ scale: 0.97 }}
    onClick={onSelect}
    aria-pressed={isSelected}
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
    <span className="text-2xl block mb-2" aria-hidden="true">{option.icon}</span>
    <span className="text-sm font-medium text-white block">{option.label}</span>
    <span className="text-xs text-gray-500 mt-0.5 block">{option.description}</span>
  </motion.button>
);

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({ selectedRole, onSelect, onNext }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">I am a...</h2>
      <p className="text-sm text-gray-400 mb-5">Select the role that best describes you</p>

      {/* Individual roles */}
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Individuals</p>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {INDIVIDUAL_ROLES.map((option) => (
          <RoleCard
            key={option.value}
            option={option}
            isSelected={selectedRole === option.value}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </motion.div>

      {/* Organization roles */}
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Organizations & Partners</p>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {ORGANIZATION_ROLES.map((option) => (
          <RoleCard
            key={option.value}
            option={option}
            isSelected={selectedRole === option.value}
            onSelect={() => onSelect(option.value)}
          />
        ))}
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
