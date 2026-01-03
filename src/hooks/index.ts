// ===========================================
// Custom React Hooks
// ===========================================

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ENV_CONFIG } from '@/config';
import { secureStore } from '@/utils/security';

/**
 * useLocalStorage - Persist state in secure local storage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = secureStore.get<T>(key);
      return item !== null ? item : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        secureStore.set(key, valueToStore);
      } catch (error) {
        console.error(`[useLocalStorage] Error setting ${key}:`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    secureStore.remove(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * useDebounce - Debounce a value
 */
export function useDebounce<T>(value: T, delay: number = ENV_CONFIG.SEARCH_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useAsync - Handle async operations with loading/error states
 */
interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: unknown[]) => Promise<T | undefined>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  immediate: boolean = false
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    loading: immediate,
    error: null,
    data: null,
  });

  const mountedRef = useRef(true);

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState({ loading: true, error: null, data: null });

      try {
        const response = await asyncFunction(...args);
        if (mountedRef.current) {
          setState({ loading: false, error: null, data: response });
        }
        return response;
      } catch (error) {
        if (mountedRef.current) {
          setState({ loading: false, error: error as Error, data: null });
        }
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { ...state, execute, reset };
}

/**
 * useMediaQuery - Responsive design hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Convenience hooks for common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 640px)');
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/**
 * useOnClickOutside - Detect clicks outside an element
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/**
 * useKeyPress - Detect key presses
 */
export function useKeyPress(targetKey: string, handler: () => void): void {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler();
      }
    };

    window.addEventListener('keydown', downHandler);
    return () => window.removeEventListener('keydown', downHandler);
  }, [targetKey, handler]);
}

/**
 * useToggle - Boolean toggle state
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setValueDirect = useCallback((newValue: boolean) => setValue(newValue), []);

  return [value, toggle, setValueDirect];
}

/**
 * usePrevious - Get previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * useIntersectionObserver - Detect element visibility
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options.root, options.rootMargin, options.threshold]);

  return isIntersecting;
}

/**
 * useCopyToClipboard - Copy text to clipboard
 */
export function useCopyToClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return [copied, copy];
}

/**
 * useDocumentTitle - Set document title
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | STEMWorkforce`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

/**
 * usePagination - Pagination state management
 */
interface UsePaginationReturn {
  page: number;
  pageSize: number;
  offset: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination(
  initialPage: number = 1,
  initialPageSize: number = ENV_CONFIG.DEFAULT_PAGE_SIZE
): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const reset = useCallback(() => setPage(1), []);

  return {
    page,
    pageSize,
    offset,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    reset,
  };
}

/**
 * useSearchFilters - Manage search filters state
 */
interface SearchFilters {
  query: string;
  industries: string[];
  locations: string[];
  remote: boolean;
  clearance: string[];
  jobTypes: string[];
  [key: string]: unknown;
}

interface UseSearchFiltersReturn {
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  toggleArrayFilter: (key: keyof SearchFilters, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const initialFilters: SearchFilters = {
  query: '',
  industries: [],
  locations: [],
  remote: false,
  clearance: [],
  jobTypes: [],
};

export function useSearchFilters(): UseSearchFiltersReturn {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const setFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters((prev) => {
      const array = prev[key] as string[];
      const newArray = array.includes(value)
        ? array.filter((v) => v !== value)
        : [...array, value];
      return { ...prev, [key]: newArray };
    });
  }, []);

  const clearFilters = useCallback(() => setFilters(initialFilters), []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.query !== '' ||
      filters.industries.length > 0 ||
      filters.locations.length > 0 ||
      filters.remote ||
      filters.clearance.length > 0 ||
      filters.jobTypes.length > 0
    );
  }, [filters]);

  return {
    filters,
    setFilter,
    toggleArrayFilter,
    clearFilters,
    hasActiveFilters,
  };
}

/**
 * useFocusTrap - Trap focus within an element (for modals)
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean): void {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, isActive]);
}
