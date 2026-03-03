// ===========================================
// Accessibility Utilities
// ===========================================

/**
 * Generate unique IDs for accessibility attributes
 */
let idCounter = 0;
export function generateId(prefix = 'a11y'): string {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Announce message to screen readers via live region
 */
export function announce(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcer = document.getElementById('a11y-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);

  // Clear and set message (ensures announcement even if same message)
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}

/**
 * Create the live region announcer element
 */
function createAnnouncer(): HTMLElement {
  const announcer = document.createElement('div');
  announcer.id = 'a11y-announcer';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(announcer);
  return announcer;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark color scheme
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Check if user has high contrast preference
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: more)').matches;
}

/**
 * Trap focus within an element (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Handle roving tabindex for keyboard navigation
 * (used in toolbars, tab lists, radio groups)
 */
export function rovingTabIndex(
  container: HTMLElement,
  selector: string,
  orientation: 'horizontal' | 'vertical' | 'both' = 'horizontal'
): () => void {
  const items = container.querySelectorAll<HTMLElement>(selector);
  let currentIndex = 0;

  // Initialize: first item focusable, others not
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';
    const isVertical = orientation === 'vertical' || orientation === 'both';

    let nextIndex = currentIndex;

    if (isHorizontal && e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (isHorizontal && e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (isVertical && e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % items.length;
    } else if (isVertical && e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    items[currentIndex].setAttribute('tabindex', '-1');
    items[nextIndex].setAttribute('tabindex', '0');
    items[nextIndex].focus();
    currentIndex = nextIndex;
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Format relative time in accessible manner
 */
export function formatRelativeTimeAccessible(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Create accessible description for progress
 */
export function describeProgress(
  current: number,
  total: number,
  label = 'Progress'
): string {
  const percentage = Math.round((current / total) * 100);
  return `${label}: ${current} of ${total} (${percentage}% complete)`;
}

/**
 * Get accessible label for status badges
 */
export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Status: Pending',
    active: 'Status: Active',
    completed: 'Status: Completed',
    failed: 'Status: Failed',
    cancelled: 'Status: Cancelled',
    draft: 'Status: Draft',
    published: 'Status: Published',
    archived: 'Status: Archived',
    approved: 'Status: Approved',
    rejected: 'Status: Rejected',
  };

  return statusMap[status.toLowerCase()] || `Status: ${status}`;
}

/**
 * Keyboard shortcuts helper
 */
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

export function registerKeyboardShortcuts(
  shortcuts: KeyboardShortcut[]
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.metaKey);
      const altMatch = !!shortcut.alt === e.altKey;
      const shiftMatch = !!shortcut.shift === e.shiftKey;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        // Don't trigger shortcuts when typing in inputs
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }

        e.preventDefault();
        shortcut.action();
        return;
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Common ARIA patterns
 */
export const ariaPatterns = {
  // For expandable sections
  expandable: (expanded: boolean, controlsId: string) => ({
    'aria-expanded': expanded,
    'aria-controls': controlsId,
  }),

  // For tabs
  tab: (selected: boolean, panelId: string) => ({
    role: 'tab',
    'aria-selected': selected,
    'aria-controls': panelId,
    tabIndex: selected ? 0 : -1,
  }),

  // For tab panels
  tabPanel: (tabId: string, hidden: boolean) => ({
    role: 'tabpanel',
    'aria-labelledby': tabId,
    hidden,
    tabIndex: 0,
  }),

  // For sortable columns
  sortable: (sorted: 'ascending' | 'descending' | 'none') => ({
    'aria-sort': sorted,
  }),

  // For loading states
  loading: (isLoading: boolean, label = 'Loading') => ({
    'aria-busy': isLoading,
    'aria-label': isLoading ? label : undefined,
  }),

  // For required fields
  required: (isRequired: boolean) => ({
    'aria-required': isRequired,
  }),

  // For invalid fields
  invalid: (hasError: boolean, errorId?: string) => ({
    'aria-invalid': hasError,
    'aria-describedby': hasError ? errorId : undefined,
  }),

  // For progress indicators
  progress: (value: number, min = 0, max = 100, label?: string) => ({
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-label': label || `Progress: ${value}%`,
  }),

  // For dialogs
  dialog: (labelId: string, descriptionId?: string) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': labelId,
    'aria-describedby': descriptionId,
  }),

  // For alerts
  alert: (_message: string) => ({
    role: 'alert',
    'aria-live': 'assertive' as const,
    'aria-atomic': true,
  }),
};

/**
 * Screen reader only CSS class
 */
export const srOnly = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

/**
 * Focus visible styles
 */
export const focusVisible = `
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
`;

export default {
  generateId,
  announce,
  prefersReducedMotion,
  prefersDarkMode,
  prefersHighContrast,
  trapFocus,
  rovingTabIndex,
  formatRelativeTimeAccessible,
  describeProgress,
  getStatusLabel,
  registerKeyboardShortcuts,
  ariaPatterns,
};
