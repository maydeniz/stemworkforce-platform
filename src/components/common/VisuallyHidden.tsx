// ===========================================
// Visually Hidden Component for Screen Readers
// ===========================================

import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  /**
   * If true, becomes visible when focused (useful for skip links)
   */
  focusable?: boolean;
  /**
   * HTML element to render
   */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Visually hides content while keeping it accessible to screen readers
 */
export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  focusable = false,
  as: Component = 'span',
}) => {
  return (
    <Component
      className={focusable ? 'sr-only focus:not-sr-only' : 'sr-only'}
    >
      {children}
    </Component>
  );
};

export default VisuallyHidden;
