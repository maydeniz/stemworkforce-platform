// ===========================================
// Skip Link Component for Keyboard Navigation
// ===========================================

import React from 'react';

interface SkipLinkProps {
  /**
   * ID of the main content element to skip to
   */
  mainContentId?: string;
  /**
   * Additional skip targets (e.g., navigation, footer)
   */
  additionalTargets?: Array<{
    id: string;
    label: string;
  }>;
}

/**
 * Skip Link component for keyboard accessibility
 * Allows keyboard users to skip repetitive navigation
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  mainContentId = 'main-content',
  additionalTargets = [],
}) => {
  const allTargets = [
    { id: mainContentId, label: 'Skip to main content' },
    ...additionalTargets,
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="skip-links">
      {allTargets.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => handleClick(e, id)}
          className="
            sr-only focus:not-sr-only
            fixed top-4 left-4 z-[100]
            px-4 py-2
            bg-blue-600 text-white font-medium
            rounded-lg shadow-lg
            focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
            transition-transform
          "
        >
          {label}
        </a>
      ))}
    </div>
  );
};

export default SkipLink;
