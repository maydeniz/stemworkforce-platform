// ===========================================
// Accessibility Hooks
// ===========================================

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  prefersReducedMotion,
  prefersHighContrast,
  trapFocus,
  rovingTabIndex,
  registerKeyboardShortcuts,
  type KeyboardShortcut,
} from '@/lib/accessibility';

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

/**
 * Hook to detect high contrast preference
 */
export function useHighContrast(): boolean {
  const [highContrast, setHighContrast] = useState(prefersHighContrast);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');

    const handler = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return highContrast;
}

/**
 * Hook for focus trap in modals/dialogs
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  active: boolean
): void {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const cleanup = trapFocus(containerRef.current);
    return cleanup;
  }, [containerRef, active]);
}

/**
 * Hook for roving tabindex navigation
 */
export function useRovingTabIndex(
  containerRef: React.RefObject<HTMLElement>,
  selector: string,
  orientation: 'horizontal' | 'vertical' | 'both' = 'horizontal'
): void {
  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = rovingTabIndex(containerRef.current, selector, orientation);
    return cleanup;
  }, [containerRef, selector, orientation]);
}

/**
 * Hook to manage focus when content changes
 */
export function useFocusOnMount(
  ref: React.RefObject<HTMLElement>,
  shouldFocus = true
): void {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [ref, shouldFocus]);
}

/**
 * Hook to restore focus when component unmounts
 */
export function useFocusReturn(): void {
  const previousElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousElement.current = document.activeElement as HTMLElement;

    return () => {
      previousElement.current?.focus();
    };
  }, []);
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  useEffect(() => {
    return registerKeyboardShortcuts(shortcuts);
  }, [shortcuts]);
}

/**
 * Hook for escape key handling
 */
export function useEscapeKey(callback: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, enabled]);
}

/**
 * Hook for click outside detection (useful for dropdowns)
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback, enabled]);
}

/**
 * Hook for managing aria-expanded state
 */
export function useAriaExpanded(
  defaultExpanded = false
): [boolean, () => void, { 'aria-expanded': boolean }] {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return [expanded, toggle, { 'aria-expanded': expanded }];
}

/**
 * Hook for managing form error announcements
 */
export function useFormErrorAnnounce() {
  const [errors, setErrors] = useState<string[]>([]);

  const announceErrors = useCallback((newErrors: string[]) => {
    if (newErrors.length > 0) {
      setErrors(newErrors);
      // Also use native announce for immediate feedback
      const errorText =
        newErrors.length === 1
          ? `Error: ${newErrors[0]}`
          : `${newErrors.length} errors: ${newErrors.join('. ')}`;

      // Create a temporary live region for immediate announcement
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'alert');
      announcer.setAttribute('aria-live', 'assertive');
      announcer.style.cssText =
        'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0';
      announcer.textContent = errorText;
      document.body.appendChild(announcer);

      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return { errors, announceErrors, clearErrors };
}

/**
 * Hook for managing loading state announcements
 */
export function useLoadingAnnounce(
  isLoading: boolean,
  loadingMessage = 'Loading',
  completeMessage = 'Content loaded'
): void {
  const wasLoading = useRef(false);

  useEffect(() => {
    if (isLoading && !wasLoading.current) {
      // Announce loading started
      announceStatus(loadingMessage);
    } else if (!isLoading && wasLoading.current) {
      // Announce loading complete
      announceStatus(completeMessage);
    }
    wasLoading.current = isLoading;
  }, [isLoading, loadingMessage, completeMessage]);
}

function announceStatus(message: string): void {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.style.cssText =
    'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0';
  announcer.textContent = message;
  document.body.appendChild(announcer);

  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Hook for managing document title with context
 */
export function useDocumentTitle(
  title: string,
  retainOnUnmount = false
): void {
  const previousTitle = useRef(document.title);

  useEffect(() => {
    document.title = `${title} | STEM Workforce`;

    return () => {
      if (!retainOnUnmount) {
        document.title = previousTitle.current;
      }
    };
  }, [title, retainOnUnmount]);
}

export default {
  useReducedMotion,
  useHighContrast,
  useFocusTrap,
  useRovingTabIndex,
  useFocusOnMount,
  useFocusReturn,
  useKeyboardShortcuts,
  useEscapeKey,
  useClickOutside,
  useAriaExpanded,
  useFormErrorAnnounce,
  useLoadingAnnounce,
  useDocumentTitle,
};
