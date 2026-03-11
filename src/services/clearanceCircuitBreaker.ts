// ===========================================
// CLEARANCE DATA CIRCUIT BREAKER
// Emergency isolation service for clearance-related data
//
// Provides immediate kill-switch capability to cut off
// all clearance data access in case of a security breach.
// Designed for NIST 800-53 IR-4 (Incident Handling) compliance.
//
// SECURITY NOTES:
// - tripBreaker / resetBreaker require admin or super_admin role (H2)
// - isDomainAccessible returns false for unknown domains (deny-by-default) (M1)
// - localStorage is validated by shape before being trusted (H1, M10)
// - audit log org_id is resolved from the user's actual organization (H8)
// - The server-side breaker (clearance_circuit_breakers table) is the
//   authoritative kill-switch; this frontend breaker is a UX-layer complement (C1 note)
// ===========================================

import { supabase } from '@/lib/supabase';

// Clearance data domains that can be independently isolated
export type ClearanceDomain =
  | 'cleared_employees'     // SEVERE PII: names, emails, clearance levels, SAP access
  | 'cv_alerts'             // HIGH PII: watchlist matches linked to employee IDs
  | 'reportable_incidents'  // HIGH PII: incident details, employee involvement
  | 'clearance_assessments' // MEDIUM PII: self-assessment answers to SEAD-4 guidelines
  | 'visit_requests'        // MEDIUM PII: visitor names, CAGE codes, facility info
  | 'fso_audit_log'         // LOW: action metadata (immutable, never delete)
  | 'clearance_demand_data'; // LOW: aggregate market data (non-sensitive)

// half-open is defined for DB compat but this service only sets closed/open
export type BreakerState = 'closed' | 'open' | 'half-open';

interface CircuitBreakerStatus {
  domain: ClearanceDomain;
  state: BreakerState;
  openedAt: string | null;
  openedBy: string | null;
  reason: string | null;
  lastChecked: string;
}

// In-memory breaker state (also persisted to localStorage for tab sync)
const STORAGE_KEY = 'stemworkforce_clearance_breaker';

// PII severity ordering for triage
export const DOMAIN_SEVERITY: Record<ClearanceDomain, 'critical' | 'high' | 'medium' | 'low'> = {
  cleared_employees: 'critical',
  cv_alerts: 'critical',
  reportable_incidents: 'high',
  clearance_assessments: 'medium',
  visit_requests: 'medium',
  fso_audit_log: 'low',
  clearance_demand_data: 'low',
};

// Domains ordered by breach severity (isolate most sensitive first)
export const ISOLATION_PRIORITY: ClearanceDomain[] = [
  'cleared_employees',
  'cv_alerts',
  'reportable_incidents',
  'clearance_assessments',
  'visit_requests',
  // fso_audit_log and clearance_demand_data are never isolated
  // audit logs must remain accessible for forensics
];

// ─── H1 / M10: Shape validation — never trust localStorage blindly ───────────
function isValidBreakerStatus(val: unknown): val is CircuitBreakerStatus {
  if (!val || typeof val !== 'object') return false;
  const s = val as Record<string, unknown>;
  const allDomains: ClearanceDomain[] = [
    'cleared_employees', 'cv_alerts', 'reportable_incidents',
    'clearance_assessments', 'visit_requests', 'fso_audit_log', 'clearance_demand_data',
  ];
  return (
    typeof s.domain === 'string' &&
    allDomains.includes(s.domain as ClearanceDomain) &&
    (s.state === 'closed' || s.state === 'open' || s.state === 'half-open') &&
    (s.openedAt === null || typeof s.openedAt === 'string') &&
    (s.openedBy === null || typeof s.openedBy === 'string') &&
    (s.reason === null || typeof s.reason === 'string') &&
    typeof s.lastChecked === 'string'
  );
}

function loadBreakerState(): Map<ClearanceDomain, CircuitBreakerStatus> {
  const states = new Map<ClearanceDomain, CircuitBreakerStatus>();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          // H1: validate shape before accepting — reject malformed entries
          if (isValidBreakerStatus(entry)) {
            states.set(entry.domain, entry);
          }
        }
      }
    }
  } catch {
    // If localStorage is corrupted, start with all breakers closed
  }

  // Initialize any missing domains as closed
  const allDomains: ClearanceDomain[] = [...ISOLATION_PRIORITY, 'fso_audit_log', 'clearance_demand_data'];
  for (const domain of allDomains) {
    if (!states.has(domain)) {
      states.set(domain, {
        domain,
        state: 'closed',
        openedAt: null,
        openedBy: null,
        reason: null,
        lastChecked: new Date().toISOString(),
      });
    }
  }

  return states;
}

function saveBreakerState(states: Map<ClearanceDomain, CircuitBreakerStatus>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(states.values())));
  } catch {
    // Storage full or unavailable — breaker still works in-memory
  }
}

// Singleton breaker state
let breakerStates = loadBreakerState();

// Listen for cross-tab sync — M10: re-validate parsed shape before accepting
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      // Re-load and re-validate rather than blindly accepting the new value
      breakerStates = loadBreakerState();
    }
  });
}

// ─── H2: Role enforcement — only admins may trip/reset breakers ───────────────
async function assertAdminRole(): Promise<string> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Not authenticated.');

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) throw new Error('Could not verify user role.');

  const role = data.role as string;
  if (!['admin', 'super_admin'].includes(role)) {
    throw new Error('Permission denied: admin role required to modify circuit breakers.');
  }
  return user.id;
}

// ─── H8: Resolve actual org_id for audit log attribution ─────────────────────
async function getUserOrgId(userId: string): Promise<string> {
  const { data } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', userId)
    .single();
  return (data as { organization_id?: string } | null)?.organization_id
    ?? '00000000-0000-0000-0000-000000000000';
}

/**
 * Check if a clearance data domain is currently accessible.
 * Call this before ANY clearance data read/write operation.
 * M1: Returns false for unknown domains (deny-by-default).
 */
export function isDomainAccessible(domain: ClearanceDomain): boolean {
  const status = breakerStates.get(domain);
  // M1: unknown domain → deny (was previously allow)
  if (!status) return false;
  return status.state === 'closed';
}

/**
 * EMERGENCY: Open the circuit breaker for a domain.
 * This immediately blocks all frontend access to the domain's data.
 * H2: Requires admin or super_admin role.
 *
 * For full isolation, pair with server-side RLS policy revocation via the
 * clearance_circuit_breakers DB table (migration 064 + 068).
 */
export async function tripBreaker(
  domain: ClearanceDomain,
  reason: string
): Promise<{ success: boolean; message: string }> {
  // Prevent isolating audit logs (needed for forensics)
  if (domain === 'fso_audit_log') {
    return {
      success: false,
      message: 'Cannot isolate audit logs — required for incident forensics (NIST 800-53 AU-9)',
    };
  }

  // H2: Enforce admin-only access before any state mutation
  let userId: string;
  try {
    userId = await assertAdminRole();
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Permission denied.',
    };
  }

  const status: CircuitBreakerStatus = {
    domain,
    state: 'open',
    openedAt: new Date().toISOString(),
    openedBy: userId,
    reason,
    lastChecked: new Date().toISOString(),
  };

  breakerStates.set(domain, status);
  saveBreakerState(breakerStates);

  // H8: resolve actual org_id for audit attribution
  const orgId = await getUserOrgId(userId);

  // Log the isolation event to the FSO audit log
  try {
    await supabase.from('fso_audit_log').insert({
      organization_id: orgId,
      user_id: userId,
      event_type: 'circuit_breaker_tripped',
      entity_type: 'circuit_breaker',
      entity_id: crypto.randomUUID(),
      previous_state: { state: 'closed', domain },
      new_state: {
        state: 'open',
        domain,
        reason,
        severity: DOMAIN_SEVERITY[domain],
      },
      change_description: `Circuit breaker tripped for ${domain} — reason: ${reason}`,
    });
  } catch {
    // Audit log failure should not prevent isolation
  }

  return {
    success: true,
    message: `Circuit breaker OPEN for ${domain}. All frontend access blocked.`,
  };
}

/**
 * EMERGENCY: Trip ALL high-severity breakers at once.
 * Use during active breach response.
 * H2: Requires admin or super_admin role (enforced per-domain in tripBreaker).
 */
export async function tripAllCritical(
  reason: string
): Promise<{ tripped: ClearanceDomain[]; failed: ClearanceDomain[] }> {
  const tripped: ClearanceDomain[] = [];
  const failed: ClearanceDomain[] = [];

  for (const domain of ISOLATION_PRIORITY) {
    const severity = DOMAIN_SEVERITY[domain];
    if (severity === 'critical' || severity === 'high') {
      const result = await tripBreaker(domain, reason);
      if (result.success) {
        tripped.push(domain);
      } else {
        failed.push(domain);
      }
    }
  }

  return { tripped, failed };
}

/**
 * Reset a circuit breaker after incident resolution.
 * Requires explicit confirmation and logs the reset.
 * H2: Requires admin or super_admin role.
 */
export async function resetBreaker(
  domain: ClearanceDomain,
  resolutionNotes: string
): Promise<{ success: boolean; message: string }> {
  const current = breakerStates.get(domain);
  if (!current || current.state === 'closed') {
    return { success: true, message: `${domain} breaker is already closed.` };
  }

  // H2: Enforce admin-only access before any state mutation
  let userId: string;
  try {
    userId = await assertAdminRole();
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Permission denied.',
    };
  }

  const status: CircuitBreakerStatus = {
    domain,
    state: 'closed',
    openedAt: null,
    openedBy: null,
    reason: null,
    lastChecked: new Date().toISOString(),
  };

  breakerStates.set(domain, status);
  saveBreakerState(breakerStates);

  // H8: resolve actual org_id for audit attribution
  const orgId = await getUserOrgId(userId);

  try {
    await supabase.from('fso_audit_log').insert({
      organization_id: orgId,
      user_id: userId,
      event_type: 'circuit_breaker_reset',
      entity_type: 'circuit_breaker',
      entity_id: crypto.randomUUID(),
      previous_state: {
        state: 'open',
        domain,
        opened_at: current.openedAt,
        opened_by: current.openedBy,
        reason: current.reason,
      },
      new_state: { state: 'closed', domain },
      change_description: `Circuit breaker reset for ${domain} — ${resolutionNotes}`,
    });
  } catch {
    // Audit log failure should not prevent reset
  }

  return {
    success: true,
    message: `Circuit breaker CLOSED for ${domain}. Access restored.`,
  };
}

/**
 * Get the current status of all circuit breakers.
 */
export function getAllBreakerStatuses(): CircuitBreakerStatus[] {
  return Array.from(breakerStates.values()).sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (severityOrder[DOMAIN_SEVERITY[a.domain]] || 3) - (severityOrder[DOMAIN_SEVERITY[b.domain]] || 3);
  });
}

/**
 * Get the status of a specific breaker.
 */
export function getBreakerStatus(domain: ClearanceDomain): CircuitBreakerStatus | undefined {
  return breakerStates.get(domain);
}

/**
 * Check if any breaker is currently open.
 */
export function hasActiveBreaker(): boolean {
  for (const status of breakerStates.values()) {
    if (status.state === 'open') return true;
  }
  return false;
}
