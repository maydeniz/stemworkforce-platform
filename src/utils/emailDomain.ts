// ===========================================
// EMAIL DOMAIN VALIDATION UTILITIES
// ===========================================

import { nationalLabs, federalAgencies, universities, communityColleges } from '@/data/organizations';
import type { Organization } from '@/data/organizations';

/**
 * Extract the domain from an email address
 */
export function extractEmailDomain(email: string): string | null {
  if (!email || !email.includes('@')) {
    return null;
  }
  return email.split('@')[1]?.toLowerCase() || null;
}

/**
 * Find an organization by its ID
 */
export function findOrganizationById(orgId: string): Organization | undefined {
  const allOrgs = [...nationalLabs, ...federalAgencies, ...universities, ...communityColleges];
  return allOrgs.find(org => org.id === orgId);
}

/**
 * Check if an email domain is allowed for a specific organization
 */
export function isDomainAllowedForOrganization(email: string, orgId: string): boolean {
  const domain = extractEmailDomain(email);
  if (!domain) return false;

  const org = findOrganizationById(orgId);
  if (!org) return true; // If org not found in our list, allow any domain

  // If org has no allowedDomains defined, allow any domain (backward compatibility)
  if (!org.allowedDomains || org.allowedDomains.length === 0) {
    return true;
  }

  // Check if domain matches any allowed domain
  return org.allowedDomains.some(allowedDomain =>
    domain === allowedDomain.toLowerCase()
  );
}

/**
 * Get the expected domains for an organization (for error messages)
 */
export function getExpectedDomainsForOrganization(orgId: string): string[] {
  const org = findOrganizationById(orgId);
  return org?.allowedDomains || [];
}

/**
 * Validate email domain and return result with message
 */
export function validateEmailDomain(
  email: string,
  orgId: string | null,
  orgName: string | null
): { valid: boolean; message?: string; autoVerified?: boolean } {
  // If no organization selected, no domain validation needed
  if (!orgId) {
    return { valid: true, autoVerified: false };
  }

  const domain = extractEmailDomain(email);
  if (!domain) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  const org = findOrganizationById(orgId);

  // If org not in our list or has no domain restrictions, allow but don't auto-verify
  if (!org || !org.allowedDomains || org.allowedDomains.length === 0) {
    return { valid: true, autoVerified: false };
  }

  // Check if domain matches
  const isAllowed = org.allowedDomains.some(
    allowedDomain => domain === allowedDomain.toLowerCase()
  );

  if (isAllowed) {
    return { valid: true, autoVerified: true };
  }

  // Domain doesn't match - provide helpful error message
  const expectedDomains = org.allowedDomains.join(' or ');
  return {
    valid: false,
    message: `To register with ${orgName || org.name}, please use an email from: ${expectedDomains}`,
    autoVerified: false
  };
}

/**
 * Check if user will be auto-verified based on their email domain
 */
export function willBeAutoVerified(email: string, orgId: string | null): boolean {
  if (!orgId) return false;

  const result = validateEmailDomain(email, orgId, null);
  return result.autoVerified === true;
}
