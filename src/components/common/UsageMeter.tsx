// ===========================================
// UsageMeter Component
// Progress bar showing usage quota with
// color-coded thresholds and upgrade CTA
// ===========================================

import React from 'react';
import { cn } from '@/utils/helpers';

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number;
  upgradeLink?: string;
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'rose';
}

const colorSchemeMap = {
  blue: {
    accent: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  },
  emerald: {
    accent: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  },
  amber: {
    accent: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  },
  rose: {
    accent: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
  },
};

function getThresholdColor(percentage: number): {
  bar: string;
  text: string;
  glow: string;
} {
  if (percentage > 85) {
    return {
      bar: 'bg-red-500',
      text: 'text-red-400',
      glow: 'shadow-red-500/20',
    };
  }
  if (percentage >= 60) {
    return {
      bar: 'bg-yellow-500',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-500/20',
    };
  }
  return {
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
  };
}

export const UsageMeter: React.FC<UsageMeterProps> = ({
  label,
  used,
  limit,
  upgradeLink,
  colorScheme = 'blue',
}) => {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 100 : limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isAtLimit = !isUnlimited && limit > 0 && used >= limit;
  const scheme = colorSchemeMap[colorScheme];

  const threshold = isUnlimited
    ? { bar: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' }
    : getThresholdColor(percentage);

  return (
    <div className="rounded-xl bg-dark-surface border border-dark-border p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn('text-sm font-medium', scheme.accent)}>
          {label}
        </span>

        {isUnlimited ? (
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1',
              'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
            )}
          >
            Unlimited
          </span>
        ) : (
          <span className="text-sm text-gray-400">
            <span className={cn('font-semibold', threshold.text)}>
              {used.toLocaleString()}
            </span>
            {' '}of{' '}
            <span className="text-gray-300 font-medium">
              {limit.toLocaleString()}
            </span>
          </span>
        )}
      </div>

      {/* Progress bar track */}
      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            'transition-all duration-700 ease-out',
            threshold.bar,
            // Subtle glow on the bar
            'shadow-sm',
            threshold.glow
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={isUnlimited ? undefined : used}
          aria-valuemin={0}
          aria-valuemax={isUnlimited ? undefined : limit}
          aria-label={
            isUnlimited
              ? `${label}: Unlimited`
              : `${label}: ${used} of ${limit} used`
          }
        />
      </div>

      {/* Footer: upgrade CTA when at limit */}
      {isAtLimit && upgradeLink && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-red-400">
            Limit reached
          </span>
          <a
            href={upgradeLink}
            className={cn(
              'text-xs font-semibold text-blue-400 hover:text-blue-300',
              'transition-colors duration-200',
              'focus:outline-none focus:underline'
            )}
          >
            Upgrade for more
          </a>
        </div>
      )}
    </div>
  );
};

export default UsageMeter;
