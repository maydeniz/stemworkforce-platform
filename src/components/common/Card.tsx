// ===========================================
// Card Component
// ===========================================

import React from 'react';
import { cn } from '@/utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick,
}) => {
  return (
    <div
      className={cn(
        'bg-dark-surface border border-dark-border rounded-xl',
        paddingStyles[padding],
        hover && 'hover:border-blue-500/50 hover:shadow-glow transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <h3 className={cn('text-lg font-semibold text-white', className)}>{children}</h3>;
};

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <p className={cn('text-sm text-gray-400 mt-1', className)}>{children}</p>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('', className)}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('mt-4 pt-4 border-t border-dark-border', className)}>{children}</div>;
};

// ===========================================
// Skeleton Component
// ===========================================

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className,
}) => {
  return (
    <div
      role="progressbar"
      aria-busy="true"
      aria-label="Loading content"
      className={cn('animate-shimmer', className)}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #1e1e2e 25%, #2a2a3e 50%, #1e1e2e 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
};

// Card skeleton for loading states
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton width={48} height={48} borderRadius="12px" />
            <div className="flex-1 space-y-2">
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={16} />
            </div>
          </div>
          <Skeleton width="100%" height={60} />
          <div className="flex gap-2">
            <Skeleton width={80} height={28} borderRadius="9999px" />
            <Skeleton width={100} height={28} borderRadius="9999px" />
            <Skeleton width={90} height={28} borderRadius="9999px" />
          </div>
        </Card>
      ))}
    </>
  );
};

export default Card;
