/**
 * BLS OEWS Series Configuration
 * Maps platform industries to SOC occupation codes and builds proper OEWS series IDs
 *
 * OEWS Series ID Format: OEUM{stateFips}{areaCode}{industryCode}{socCode}{dataType}
 * - OEUM = State-level OEWS data
 * - stateFips = 2-digit state FIPS code
 * - areaCode = 00000 (statewide)
 * - industryCode = 000000 (cross-industry)
 * - socCode = 6-digit SOC code (no hyphen)
 * - dataType = 01 (employment), 04 (annual mean wage), 13 (annual median wage)
 */

export interface SOCOccupation {
  code: string;   // 6-digit, no hyphen (e.g., '151252')
  title: string;
  displayCode: string; // Hyphenated for display (e.g., '15-1252')
}

export interface IndustrySOCMapping {
  socCodes: SOCOccupation[];
  projectedGrowth: number; // Weighted average growth rate 2024-2034
}

/** Maps each platform industry to its representative STEM SOC codes */
export const INDUSTRY_SOC_MAPPING: Record<string, IndustrySOCMapping> = {
  'Semiconductor': {
    socCodes: [
      { code: '172061', title: 'Computer Hardware Engineers', displayCode: '17-2061' },
      { code: '172071', title: 'Electrical Engineers', displayCode: '17-2071' },
      { code: '172112', title: 'Industrial Engineers', displayCode: '17-2112' },
    ],
    projectedGrowth: 7.5,
  },
  'Nuclear Energy': {
    socCodes: [
      { code: '172161', title: 'Nuclear Engineers', displayCode: '17-2161' },
      { code: '192012', title: 'Physicists', displayCode: '19-2012' },
      { code: '172141', title: 'Mechanical Engineers', displayCode: '17-2141' },
    ],
    projectedGrowth: 1.5,
  },
  'AI & Machine Learning': {
    socCodes: [
      { code: '151252', title: 'Software Developers', displayCode: '15-1252' },
      { code: '152051', title: 'Data Scientists', displayCode: '15-2051' },
      { code: '151221', title: 'Computer and Information Research Scientists', displayCode: '15-1221' },
    ],
    projectedGrowth: 33.0,
  },
  'Quantum Technologies': {
    socCodes: [
      { code: '192012', title: 'Physicists', displayCode: '19-2012' },
      { code: '151221', title: 'Computer and Information Research Scientists', displayCode: '15-1221' },
      { code: '152031', title: 'Operations Research Analysts', displayCode: '15-2031' },
    ],
    projectedGrowth: 23.0,
  },
  'Cybersecurity': {
    socCodes: [
      { code: '151212', title: 'Information Security Analysts', displayCode: '15-1212' },
      { code: '151211', title: 'Computer Systems Analysts', displayCode: '15-1211' },
      { code: '151244', title: 'Network and Computer Systems Administrators', displayCode: '15-1244' },
    ],
    projectedGrowth: 28.0,
  },
  'Aerospace & Defense': {
    socCodes: [
      { code: '172011', title: 'Aerospace Engineers', displayCode: '17-2011' },
      { code: '172199', title: 'Engineers, All Other', displayCode: '17-2199' },
      { code: '151252', title: 'Software Developers', displayCode: '15-1252' },
    ],
    projectedGrowth: 12.0,
  },
  'Biotechnology': {
    socCodes: [
      { code: '191042', title: 'Medical Scientists', displayCode: '19-1042' },
      { code: '172031', title: 'Bioengineers and Biomedical Engineers', displayCode: '17-2031' },
      { code: '192021', title: 'Atmospheric and Space Scientists', displayCode: '19-2021' },
    ],
    projectedGrowth: 10.0,
  },
  'Healthcare & Medical Technology': {
    socCodes: [
      { code: '172031', title: 'Bioengineers and Biomedical Engineers', displayCode: '17-2031' },
      { code: '151211', title: 'Computer Systems Analysts', displayCode: '15-1211' },
      { code: '152051', title: 'Data Scientists', displayCode: '15-2051' },
    ],
    projectedGrowth: 14.0,
  },
  'Robotics & Automation': {
    socCodes: [
      { code: '172141', title: 'Mechanical Engineers', displayCode: '17-2141' },
      { code: '172112', title: 'Industrial Engineers', displayCode: '17-2112' },
      { code: '151252', title: 'Software Developers', displayCode: '15-1252' },
    ],
    projectedGrowth: 16.0,
  },
  'Clean Energy': {
    socCodes: [
      { code: '172071', title: 'Electrical Engineers', displayCode: '17-2071' },
      { code: '172199', title: 'Engineers, All Other', displayCode: '17-2199' },
      { code: '472231', title: 'Solar Photovoltaic Installers', displayCode: '47-2231' },
    ],
    projectedGrowth: 22.0,
  },
  'Advanced Manufacturing': {
    socCodes: [
      { code: '172112', title: 'Industrial Engineers', displayCode: '17-2112' },
      { code: '172141', title: 'Mechanical Engineers', displayCode: '17-2141' },
      { code: '173026', title: 'Industrial Engineering Technologists and Technicians', displayCode: '17-3026' },
    ],
    projectedGrowth: 4.5,
  },
};

/** BLS OEWS data types */
export type OEWSDataType = '01' | '04' | '13';
export const OEWS_EMPLOYMENT = '01' as const;
export const OEWS_ANNUAL_MEAN_WAGE = '04' as const;
export const OEWS_ANNUAL_MEDIAN_WAGE = '13' as const;

/**
 * Build a proper OEWS series ID for state-level occupation data.
 * Format: OEUM + stateFips(2) + areaCode(5) + industryCode(6) + socCode(6) + dataType(2)
 */
export function buildOEWSSeriesId(
  stateFips: string,
  socCode: string,
  dataType: OEWSDataType
): string {
  return `OEUM${stateFips}00000000000${socCode}${dataType}`;
}

/**
 * Build all OEWS series IDs needed for a single state across requested industries.
 * Deduplicates SOC codes shared across industries.
 * Returns typically ~36-40 series (under BLS 50-per-request limit).
 */
export function buildSeriesIdsForState(
  stateFips: string,
  industries: string[]
): { seriesIds: string[]; socCodeMap: Map<string, string> } {
  const seriesIds: string[] = [];
  const seenSocCodes = new Set<string>();
  // Maps series ID back to SOC code for parsing responses
  const socCodeMap = new Map<string, string>();

  for (const industry of industries) {
    const mapping = INDUSTRY_SOC_MAPPING[industry];
    if (!mapping) continue;

    for (const soc of mapping.socCodes) {
      if (seenSocCodes.has(soc.code)) continue;
      seenSocCodes.add(soc.code);

      const employmentId = buildOEWSSeriesId(stateFips, soc.code, OEWS_EMPLOYMENT);
      const wageId = buildOEWSSeriesId(stateFips, soc.code, OEWS_ANNUAL_MEDIAN_WAGE);

      seriesIds.push(employmentId);
      seriesIds.push(wageId);

      socCodeMap.set(employmentId, soc.code);
      socCodeMap.set(wageId, soc.code);
    }
  }

  return { seriesIds, socCodeMap };
}

export interface SOCDataPoint {
  employment: number;
  medianWage: number;
}

/**
 * Parse a BLS API v2 response and extract SOC-level data.
 * Returns a Map of SOC code → { employment, medianWage }
 */
export function parseSeriesResponse(
  blsResponse: any,
  socCodeMap: Map<string, string>
): Map<string, SOCDataPoint> {
  const result = new Map<string, SOCDataPoint>();

  if (blsResponse?.status !== 'REQUEST_SUCCEEDED' || !blsResponse?.Results?.series) {
    return result;
  }

  for (const series of blsResponse.Results.series) {
    const seriesId: string = series.seriesID;
    const socCode = socCodeMap.get(seriesId);
    if (!socCode) continue;

    // Get the most recent data point
    const latestData = series.data?.[0];
    if (!latestData) continue;

    const value = parseFloat(latestData.value);
    if (isNaN(value)) continue;

    // Determine if this is employment or wage data based on the series suffix
    const dataType = seriesId.slice(-2);
    const existing = result.get(socCode) || { employment: 0, medianWage: 0 };

    if (dataType === OEWS_EMPLOYMENT) {
      existing.employment = Math.round(value * 10); // OEWS employment in tens, multiply by 10
    } else if (dataType === OEWS_ANNUAL_MEDIAN_WAGE) {
      existing.medianWage = Math.round(value);
    }

    result.set(socCode, existing);
  }

  return result;
}

/**
 * Get all unique SOC codes used across all industries.
 */
export function getAllSOCCodes(): SOCOccupation[] {
  const seen = new Set<string>();
  const result: SOCOccupation[] = [];

  for (const mapping of Object.values(INDUSTRY_SOC_MAPPING)) {
    for (const soc of mapping.socCodes) {
      if (!seen.has(soc.code)) {
        seen.add(soc.code);
        result.push(soc);
      }
    }
  }

  return result;
}
