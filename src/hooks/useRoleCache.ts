/**
 * Role Caching Hook
 *
 * Caches user roles to reduce database queries on route navigation.
 * Roles are cached for 5 minutes before re-fetching from the database.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface RoleCacheEntry {
  role: string;
  timestamp: number;
}

// Cache duration: 5 minutes
const CACHE_DURATION_MS = 5 * 60 * 1000;

// In-memory cache (survives re-renders but not page refresh)
const roleCache = new Map<string, RoleCacheEntry>();

/**
 * Custom hook for caching user roles
 *
 * @example
 * const { fetchRole, getCachedRole, invalidateRole } = useRoleCache();
 *
 * // Fetch role (uses cache if available)
 * const role = await fetchRole(userId);
 *
 * // Check cache without fetching
 * const cachedRole = getCachedRole(userId);
 *
 * // Force refresh on logout or role change
 * invalidateRole(userId);
 */
export function useRoleCache() {
  const [isLoading, setIsLoading] = useState(false);
  const fetchingRef = useRef<Set<string>>(new Set());

  /**
   * Check if a cached role is still valid
   */
  const isCacheValid = useCallback((userId: string): boolean => {
    const entry = roleCache.get(userId);
    if (!entry) return false;
    return Date.now() - entry.timestamp < CACHE_DURATION_MS;
  }, []);

  /**
   * Get cached role without fetching
   * Returns null if not cached or expired
   */
  const getCachedRole = useCallback(
    (userId: string): string | null => {
      if (isCacheValid(userId)) {
        return roleCache.get(userId)?.role || null;
      }
      return null;
    },
    [isCacheValid]
  );

  /**
   * Fetch user role from database with caching
   * Returns cached value if available and not expired
   */
  const fetchRole = useCallback(
    async (userId: string): Promise<string> => {
      // Return cached value if valid
      const cached = getCachedRole(userId);
      if (cached) {
        return cached;
      }

      // Prevent concurrent fetches for same user
      if (fetchingRef.current.has(userId)) {
        // Wait for existing fetch to complete
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            const cachedRole = getCachedRole(userId);
            if (cachedRole) {
              clearInterval(checkInterval);
              resolve(cachedRole);
            }
          }, 100);

          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve('jobseeker'); // Default fallback
          }, 5000);
        });
      }

      try {
        setIsLoading(true);
        fetchingRef.current.add(userId);

        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) {
          console.warn('Error fetching user role:', error.message);
          return 'jobseeker'; // Default role
        }

        const role = data?.role || 'jobseeker';

        // Cache the result
        roleCache.set(userId, {
          role,
          timestamp: Date.now(),
        });

        return role;
      } catch (err) {
        console.error('Failed to fetch role:', err);
        return 'jobseeker';
      } finally {
        setIsLoading(false);
        fetchingRef.current.delete(userId);
      }
    },
    [getCachedRole]
  );

  /**
   * Invalidate cached role for a user
   * Call this on logout or when role changes
   */
  const invalidateRole = useCallback((userId: string): void => {
    roleCache.delete(userId);
  }, []);

  /**
   * Invalidate all cached roles
   * Call this on global logout or admin role changes
   */
  const invalidateAll = useCallback((): void => {
    roleCache.clear();
  }, []);

  /**
   * Prefetch roles for multiple users
   * Useful for admin dashboards
   */
  const prefetchRoles = useCallback(
    async (userIds: string[]): Promise<Map<string, string>> => {
      const results = new Map<string, string>();
      const toFetch: string[] = [];

      // Check cache first
      userIds.forEach((userId) => {
        const cached = getCachedRole(userId);
        if (cached) {
          results.set(userId, cached);
        } else {
          toFetch.push(userId);
        }
      });

      // Fetch remaining in batch
      if (toFetch.length > 0) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id, role')
            .in('id', toFetch);

          if (!error && data) {
            data.forEach((user) => {
              const role = user.role || 'jobseeker';
              results.set(user.id, role);
              roleCache.set(user.id, {
                role,
                timestamp: Date.now(),
              });
            });
          }
        } catch (err) {
          console.error('Failed to batch fetch roles:', err);
        }
      }

      return results;
    },
    [getCachedRole]
  );

  // Cleanup expired entries periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      roleCache.forEach((entry, userId) => {
        if (now - entry.timestamp > CACHE_DURATION_MS) {
          roleCache.delete(userId);
        }
      });
    }, CACHE_DURATION_MS);

    return () => clearInterval(cleanup);
  }, []);

  return {
    fetchRole,
    getCachedRole,
    invalidateRole,
    invalidateAll,
    prefetchRoles,
    isLoading,
    isCacheValid,
  };
}

export default useRoleCache;
