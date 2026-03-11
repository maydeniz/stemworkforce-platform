// ===========================================
// UpgradePrompt Component
// Modal/banner shown when users hit a feature gate
// ===========================================

import React from 'react';
import { cn } from '@/utils/helpers';

interface UpgradePromptProps {
  feature: string;
  currentTier: string;
  requiredTier: string;
  price: string;
  onUpgrade: () => void;
  onDismiss: () => void;
  variant?: 'modal' | 'banner';
}

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('w-5 h-5', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('w-5 h-5', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  currentTier,
  requiredTier,
  price,
  onUpgrade,
  onDismiss,
  variant = 'modal',
}) => {
  if (variant === 'banner') {
    return (
      <div
        role="alert"
        className={cn(
          'relative flex items-center justify-between gap-4 px-6 py-3',
          'bg-gradient-to-r from-blue-950/80 via-gray-900 to-blue-950/80',
          'border border-blue-500/30 rounded-lg'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
            <LockIcon className="w-4 h-4" />
          </div>
          <p className="text-sm text-gray-300 truncate">
            <span className="font-semibold text-white">{feature}</span>
            {' '}requires the{' '}
            <span className="font-semibold text-blue-400">{requiredTier}</span>
            {' '}plan.
            <span className="text-gray-500 ml-1">
              Currently on {currentTier}.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-medium text-gray-400 hidden sm:inline">
            {price}
          </span>
          <button
            onClick={onUpgrade}
            className={cn(
              'px-4 py-1.5 text-sm font-semibold rounded-lg',
              'bg-blue-600 hover:bg-blue-500 text-white',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            )}
          >
            Upgrade
          </button>
          <button
            onClick={onDismiss}
            className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Dismiss upgrade prompt"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Modal variant
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-prompt-title"
        className={cn(
          'relative w-full max-w-md',
          'bg-gray-900 rounded-2xl shadow-2xl',
          // Gradient border effect via a wrapping technique using ring + gradient
          'ring-1 ring-blue-500/30',
          'before:absolute before:inset-0 before:rounded-2xl before:p-px',
          'before:bg-gradient-to-b before:from-blue-500/20 before:to-purple-500/20',
          'before:-z-10 before:pointer-events-none'
        )}
      >
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className={cn(
            'absolute top-4 right-4 p-2 rounded-lg',
            'text-gray-500 hover:text-white hover:bg-white/10',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
          aria-label="Close upgrade prompt"
        >
          <CloseIcon />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Lock icon badge */}
          <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-blue-500/30">
            <LockIcon className="w-8 h-8 text-blue-400" />
          </div>

          {/* Feature name */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <LockIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Premium Feature
            </span>
          </div>

          <h2
            id="upgrade-prompt-title"
            className="text-2xl font-bold text-white mb-3"
          >
            {feature}
          </h2>

          <p className="text-gray-400 mb-2">
            This feature requires the{' '}
            <span className="font-semibold text-blue-400">{requiredTier}</span>
            {' '}plan.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You are currently on the{' '}
            <span className="text-gray-300">{currentTier}</span> plan.
          </p>

          {/* Price */}
          <div className="mb-6 py-4 px-6 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">Starting at</p>
            <p className="text-3xl font-bold text-white">{price}</p>
          </div>

          {/* CTA */}
          <button
            onClick={onUpgrade}
            className={cn(
              'w-full py-3 px-6 rounded-xl text-base font-semibold',
              'bg-gradient-to-r from-blue-600 to-blue-500',
              'hover:from-blue-500 hover:to-blue-400',
              'text-white shadow-lg shadow-blue-500/25',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            )}
          >
            Upgrade to {requiredTier}
          </button>

          <button
            onClick={onDismiss}
            className="mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
