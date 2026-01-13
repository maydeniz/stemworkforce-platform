// ===========================================
// CHALLENGE PROGRESS TRACKER
// Visual progress indicator for solvers
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Clock,
  FileText,
  Users,
  Send,
  Trophy,
  AlertCircle,
} from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'warning';
  icon: React.ElementType;
  timestamp?: string;
}

interface ChallengeProgressTrackerProps {
  challengeId: string;
  registrationDate?: string;
  teamFormed?: boolean;
  draftStarted?: boolean;
  submissionDate?: string;
  submissionDeadline: string;
  judging?: boolean;
  resultsAnnounced?: boolean;
  variant?: 'horizontal' | 'vertical';
}

export const ChallengeProgressTracker: React.FC<ChallengeProgressTrackerProps> = ({
  challengeId,
  registrationDate,
  teamFormed,
  draftStarted,
  submissionDate,
  submissionDeadline,
  judging,
  resultsAnnounced,
  variant = 'horizontal',
}) => {
  const now = new Date();
  const deadline = new Date(submissionDeadline);
  const isDeadlinePassed = now > deadline;
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Build progress steps based on current state
  const steps: ProgressStep[] = [
    {
      id: 'register',
      label: 'Registered',
      description: registrationDate
        ? `Registered on ${new Date(registrationDate).toLocaleDateString()}`
        : 'Complete registration',
      status: registrationDate ? 'completed' : 'current',
      icon: CheckCircle,
      timestamp: registrationDate,
    },
    {
      id: 'team',
      label: 'Team Setup',
      description: teamFormed ? 'Team formed' : 'Form or join a team (optional)',
      status: teamFormed ? 'completed' : registrationDate ? 'current' : 'upcoming',
      icon: Users,
    },
    {
      id: 'draft',
      label: 'Working',
      description: draftStarted
        ? 'Draft in progress'
        : 'Start working on your submission',
      status: draftStarted
        ? (submissionDate ? 'completed' : 'current')
        : 'upcoming',
      icon: FileText,
    },
    {
      id: 'submit',
      label: 'Submitted',
      description: submissionDate
        ? `Submitted on ${new Date(submissionDate).toLocaleDateString()}`
        : isDeadlinePassed
          ? 'Deadline passed'
          : `Due in ${daysUntilDeadline} days`,
      status: submissionDate
        ? 'completed'
        : isDeadlinePassed
          ? 'warning'
          : draftStarted
            ? 'current'
            : 'upcoming',
      icon: submissionDate ? Send : (isDeadlinePassed ? AlertCircle : Clock),
      timestamp: submissionDate,
    },
    {
      id: 'judging',
      label: 'Judging',
      description: judging
        ? 'Under review'
        : resultsAnnounced
          ? 'Review complete'
          : 'Awaiting review',
      status: resultsAnnounced
        ? 'completed'
        : judging
          ? 'current'
          : 'upcoming',
      icon: Clock,
    },
    {
      id: 'results',
      label: 'Results',
      description: resultsAnnounced
        ? 'Winners announced'
        : 'Pending announcement',
      status: resultsAnnounced ? 'completed' : 'upcoming',
      icon: Trophy,
    },
  ];

  const getStatusColor = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-yellow-500 text-black';
      case 'warning':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };

  const getLineColor = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-700';
    }
  };

  if (variant === 'vertical') {
    return (
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4 relative">
            {/* Vertical line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 ${getLineColor(step.status)}`}
              />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(step.status)}`}
            >
              <step.icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="pb-8">
              <h4 className="font-medium text-white">{step.label}</h4>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-700 -translate-y-1/2" />

        {/* Completed line */}
        <motion.div
          className="absolute left-0 top-1/2 h-0.5 bg-green-500 -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{
            width: `${(steps.filter(s => s.status === 'completed').length / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative z-10 flex flex-col items-center"
            style={{ flex: index === 0 || index === steps.length - 1 ? '0 0 auto' : '1' }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}
            >
              <step.icon className="w-5 h-5" />
            </motion.div>
            <div className="mt-2 text-center">
              <span className={`text-xs font-medium ${
                step.status === 'current' ? 'text-yellow-400' :
                step.status === 'completed' ? 'text-green-400' :
                step.status === 'warning' ? 'text-red-400' :
                'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Current step details */}
      {steps.find(s => s.status === 'current') && (
        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              {React.createElement(
                steps.find(s => s.status === 'current')!.icon,
                { className: 'w-5 h-5 text-yellow-400' }
              )}
            </div>
            <div>
              <h4 className="font-medium text-white">
                {steps.find(s => s.status === 'current')!.label}
              </h4>
              <p className="text-sm text-gray-400">
                {steps.find(s => s.status === 'current')!.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeProgressTracker;
