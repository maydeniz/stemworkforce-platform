// ===========================================
// FeatureGate Component
// Wrapper that shows a lock overlay for non-paid users.
//
// H5 FIX: Locked content is NEVER rendered in the DOM. A skeleton placeholder
//   is shown instead. CSS blur on real content is purely visual and readable
//   via DevTools — this fix eliminates that information leak entirely.
// M7 FIX: aria-live moved to the status message only (not outer container).
// M8 FIX: Upgrade CTA uses react-router-dom <Link> instead of <a href>
//   to avoid full-page reload.
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/helpers';

interface FeatureGateProps {
  feature: string;
  isUnlocked: boolean;
  requiredTier?: string;
  upgradeLink?: string;
  children: React.ReactNode;
  blurAmount?: number; // kept for API compat but no longer used when locked
}

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('w-6 h-6', className)}
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

// Generic skeleton shown in place of locked content.
// Does NOT render children — eliminates the information leak of blurred real data.
const LockedSkeleton: React.FC = () => (
  <div className="p-6 space-y-3" aria-hidden="true">
    <div className="h-4 bg-white/5 rounded-lg w-3/4 animate-pulse" />
    <div className="h-4 bg-white/5 rounded-lg w-1/2 animate-pulse" />
    <div className="h-4 bg-white/5 rounded-lg w-5/6 animate-pulse" />
    <div className="h-32 bg-white/5 rounded-xl animate-pulse mt-4" />
    <div className="h-4 bg-white/5 rounded-lg w-2/3 animate-pulse" />
  </div>
);

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  isUnlocked,
  requiredTier = 'Pro',
  upgradeLink = '/pricing',
  children,
}) => {
  // When unlocked, render children directly with no wrapper overhead
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* H5: Skeleton placeholder — real content is never in the DOM when locked */}
      <LockedSkeleton />

      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center',
          'bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-900/60',
          'backdrop-blur-[1px]'
        )}
        role="region"
        aria-label={`${feature} — locked feature`}
      >
        {/* Lock badge */}
        <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 ring-1 ring-white/10">
          <LockIcon className="w-7 h-7 text-gray-400" />
        </div>

        {/* Feature name */}
        <h3 className="text-lg font-bold text-white mb-1">
          {feature}
        </h3>

        {/* M7: aria-live on the specific status message, not the container */}
        <p
          className="text-sm text-gray-400 mb-5 text-center max-w-xs px-4"
          role="status"
          aria-live="polite"
        >
          Upgrade to{' '}
          <span className="font-semibold text-blue-400">{requiredTier}</span>
          {' '}to unlock this feature
        </p>

        {/* M8: Use Link for SPA navigation instead of full-page <a href> reload */}
        <Link
          to={upgradeLink}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-2.5 rounded-xl',
            'text-sm font-semibold text-white',
            'bg-gradient-to-r from-blue-600 to-blue-500',
            'hover:from-blue-500 hover:to-blue-400',
            'shadow-lg shadow-blue-500/25',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
          )}
        >
          <LockIcon className="w-4 h-4" />
          Upgrade to {requiredTier}
        </Link>
      </div>
    </div>
  );
};

export default FeatureGate;
