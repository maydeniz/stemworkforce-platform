// ===========================================
// Loading Spinner Component
// ===========================================

import React from 'react';
import { cn } from '@/utils/helpers';

interface LoadingSpinnerProps {
  size?: number | 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 48,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  className,
  label = 'Loading',
}) => {
  const pixelSize = typeof size === 'string' ? sizeMap[size] : size;
  
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex items-center justify-center', className)}
    >
      <svg
        className="animate-spin text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={pixelSize}
        height={pixelSize}
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
      <span className="sr-only">{label}</span>
    </div>
  );
};

// Full page loading
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
};

// Inline loading
export const InlineLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <LoadingSpinner size={16} />
      {text && <span className="text-sm text-gray-400">{text}</span>}
    </span>
  );
};

export default LoadingSpinner;
