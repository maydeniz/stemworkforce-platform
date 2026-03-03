import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon component to render (required) */
  icon: LucideIcon;
  /** Accessible label for screen readers (required) */
  label: string;
  /** Visual style variant */
  variant?: 'ghost' | 'outline' | 'solid' | 'danger';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Optional tooltip (visible on hover) */
  tooltip?: string;
}

const variants = {
  ghost: 'text-gray-400 hover:text-white hover:bg-white/10',
  outline: 'text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 hover:bg-white/5',
  solid: 'text-white bg-blue-500 hover:bg-blue-600',
  danger: 'text-red-400 hover:text-white hover:bg-red-500/20',
};

const sizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

/**
 * Accessible icon button component with required label for screen readers.
 * Use this instead of raw button elements with icons to ensure accessibility.
 *
 * @example
 * <IconButton
 *   icon={Menu}
 *   label="Open menu"
 *   onClick={() => setMenuOpen(true)}
 * />
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      label,
      variant = 'ghost',
      size = 'md',
      loading = false,
      tooltip,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={tooltip || label}
        disabled={disabled || loading}
        className={cn(
          'rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <Icon size={iconSizes[size]} aria-hidden="true" />
        )}
        <span className="sr-only">{label}</span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
