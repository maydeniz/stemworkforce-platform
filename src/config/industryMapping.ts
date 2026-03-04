// ===========================================
// Industry Name Mapping
// Maps between WorkforceMap display names and BLS cache canonical names
// ===========================================

/**
 * BLS cache stores industry names from blsSeriesConfig.ts (INDUSTRY_SOC_MAPPING keys).
 * These match the WorkforceMap display names exactly — no mapping needed for most.
 * Only 'Healthcare' in the map corresponds to 'Healthcare' in BLS (identical).
 *
 * This mapping exists for any future divergence and for normalizing
 * federated listing industry tags to our canonical names.
 */

// Canonical industry names used across the platform
export const CANONICAL_INDUSTRIES = [
  'Nuclear Technologies',
  'Semiconductor',
  'Healthcare',
  'AI & Machine Learning',
  'Quantum Technologies',
  'Aerospace & Defense',
  'Clean Energy',
  'Cybersecurity',
  'Biotechnology',
  'Robotics & Automation',
  'Advanced Manufacturing',
] as const;

export type CanonicalIndustry = typeof CANONICAL_INDUSTRIES[number];

/**
 * Maps federated listing industry tags (lowercase/varied) to canonical names.
 * USAJobs listings come with varied industry/tag names — normalize here.
 */
export const listingTagToCanonical: Record<string, CanonicalIndustry> = {
  // Direct matches (lowercase)
  'nuclear energy': 'Nuclear Technologies',
  'semiconductor': 'Semiconductor',
  'healthcare': 'Healthcare',
  'ai & machine learning': 'AI & Machine Learning',
  'quantum technologies': 'Quantum Technologies',
  'aerospace & defense': 'Aerospace & Defense',
  'clean energy': 'Clean Energy',
  'cybersecurity': 'Cybersecurity',
  'biotechnology': 'Biotechnology',
  'robotics & automation': 'Robotics & Automation',
  'advanced manufacturing': 'Advanced Manufacturing',

  // Common variations
  'nuclear': 'Nuclear Technologies',
  'semiconductors': 'Semiconductor',
  'chips': 'Semiconductor',
  'health': 'Healthcare',
  'medical': 'Healthcare',
  'health care': 'Healthcare',
  'ai': 'AI & Machine Learning',
  'machine learning': 'AI & Machine Learning',
  'artificial intelligence': 'AI & Machine Learning',
  'quantum': 'Quantum Technologies',
  'quantum computing': 'Quantum Technologies',
  'aerospace': 'Aerospace & Defense',
  'defense': 'Aerospace & Defense',
  'renewable energy': 'Clean Energy',
  'solar': 'Clean Energy',
  'wind energy': 'Clean Energy',
  'cyber security': 'Cybersecurity',
  'information security': 'Cybersecurity',
  'biotech': 'Biotechnology',
  'bioscience': 'Biotechnology',
  'pharmaceutical': 'Biotechnology',
  'robotics': 'Robotics & Automation',
  'automation': 'Robotics & Automation',
  'manufacturing': 'Advanced Manufacturing',
};

/**
 * Try to match a listing's industry tags to a canonical industry.
 * Returns the first match found, or null if none.
 */
export function matchIndustry(tags: string[]): CanonicalIndustry | null {
  for (const tag of tags) {
    const normalized = tag.toLowerCase().trim();
    if (listingTagToCanonical[normalized]) {
      return listingTagToCanonical[normalized];
    }
  }
  return null;
}
