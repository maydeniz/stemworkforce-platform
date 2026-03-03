/**
 * BLS Employment Projections 2024-2034
 * Source: https://www.bls.gov/emp/tables.htm
 *
 * These numbers come from BLS published projection tables (not the time-series API).
 * Update this file annually when new projections are released.
 * Last updated: March 2026 (based on BLS August 2025 release)
 */

export interface OccupationProjection {
  socCode: string;          // Hyphenated (e.g., '15-1252')
  title: string;
  employment2024: number;   // Employment in 2024 (actual count, not thousands)
  employment2034: number;   // Projected employment in 2034
  changePercent: number;    // Percent change 2024-2034
  annualOpenings: number;   // Average annual job openings
  medianWage2024: number;   // National median annual wage (2024)
  typicalEducation: string; // Entry-level education requirement
}

/**
 * STEM occupation projections for the ~20 SOC codes used across
 * the platform's 11 industries.
 */
export const STEM_OCCUPATION_PROJECTIONS: OccupationProjection[] = [
  // Computer & Mathematical Occupations
  {
    socCode: '15-1252',
    title: 'Software Developers',
    employment2024: 1847900,
    employment2034: 2514300,
    changePercent: 36.0,
    annualOpenings: 140400,
    medianWage2024: 132270,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '15-2051',
    title: 'Data Scientists',
    employment2024: 192800,
    employment2034: 259200,
    changePercent: 34.4,
    annualOpenings: 20800,
    medianWage2024: 108020,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '15-1212',
    title: 'Information Security Analysts',
    employment2024: 175400,
    employment2034: 233100,
    changePercent: 32.9,
    annualOpenings: 17300,
    medianWage2024: 112000,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '15-1211',
    title: 'Computer Systems Analysts',
    employment2024: 527900,
    employment2034: 555600,
    changePercent: 5.2,
    annualOpenings: 43900,
    medianWage2024: 103800,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '15-1221',
    title: 'Computer and Information Research Scientists',
    employment2024: 37200,
    employment2034: 47600,
    changePercent: 28.0,
    annualOpenings: 3400,
    medianWage2024: 145080,
    typicalEducation: "Master's degree",
  },
  {
    socCode: '15-1244',
    title: 'Network and Computer Systems Administrators',
    employment2024: 363100,
    employment2034: 372500,
    changePercent: 2.6,
    annualOpenings: 28100,
    medianWage2024: 95360,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '15-2031',
    title: 'Operations Research Analysts',
    employment2024: 119300,
    employment2034: 147900,
    changePercent: 23.0,
    annualOpenings: 12200,
    medianWage2024: 83640,
    typicalEducation: "Bachelor's degree",
  },

  // Engineering Occupations
  {
    socCode: '17-2011',
    title: 'Aerospace Engineers',
    employment2024: 62300,
    employment2034: 66000,
    changePercent: 6.0,
    annualOpenings: 4100,
    medianWage2024: 130720,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '17-2031',
    title: 'Bioengineers and Biomedical Engineers',
    employment2024: 19500,
    employment2034: 22700,
    changePercent: 16.4,
    annualOpenings: 1500,
    medianWage2024: 100590,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '17-2061',
    title: 'Computer Hardware Engineers',
    employment2024: 79200,
    employment2034: 84900,
    changePercent: 7.2,
    annualOpenings: 5300,
    medianWage2024: 138080,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '17-2071',
    title: 'Electrical Engineers',
    employment2024: 188100,
    employment2034: 200300,
    changePercent: 6.5,
    annualOpenings: 13200,
    medianWage2024: 109600,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '17-2112',
    title: 'Industrial Engineers',
    employment2024: 308900,
    employment2034: 325200,
    changePercent: 5.3,
    annualOpenings: 23600,
    medianWage2024: 99380,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '17-2141',
    title: 'Mechanical Engineers',
    employment2024: 284900,
    employment2034: 293800,
    changePercent: 3.1,
    annualOpenings: 19200,
    medianWage2024: 99510,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '17-2161',
    title: 'Nuclear Engineers',
    employment2024: 12900,
    employment2034: 13200,
    changePercent: 2.3,
    annualOpenings: 900,
    medianWage2024: 124680,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '17-2199',
    title: 'Engineers, All Other',
    employment2024: 168400,
    employment2034: 178300,
    changePercent: 5.9,
    annualOpenings: 13400,
    medianWage2024: 104600,
    typicalEducation: "Bachelor's degree",
  },
  {
    socCode: '17-3026',
    title: 'Industrial Engineering Technologists and Technicians',
    employment2024: 82400,
    employment2034: 84800,
    changePercent: 2.9,
    annualOpenings: 7200,
    medianWage2024: 60220,
    typicalEducation: "Associate's degree",
  },

  // Life, Physical, and Social Science Occupations
  {
    socCode: '19-1042',
    title: 'Medical Scientists',
    employment2024: 133900,
    employment2034: 152000,
    changePercent: 13.5,
    annualOpenings: 10300,
    medianWage2024: 100890,
    typicalEducation: 'Doctoral or professional degree',
  },
  {
    socCode: '19-2012',
    title: 'Physicists',
    employment2024: 20800,
    employment2034: 23100,
    changePercent: 11.1,
    annualOpenings: 1600,
    medianWage2024: 155680,
    typicalEducation: 'Doctoral or professional degree',
  },
  {
    socCode: '19-2021',
    title: 'Atmospheric and Space Scientists',
    employment2024: 9500,
    employment2034: 10200,
    changePercent: 7.4,
    annualOpenings: 600,
    medianWage2024: 108080,
    typicalEducation: "Bachelor's degree",
  },

  // Construction & Installation
  {
    socCode: '47-2231',
    title: 'Solar Photovoltaic Installers',
    employment2024: 17800,
    employment2034: 26700,
    changePercent: 48.3,
    annualOpenings: 3000,
    medianWage2024: 48800,
    typicalEducation: 'High school diploma',
  },
];

/**
 * Indexed by 6-digit SOC code (no hyphen) for fast lookup from BLS series responses.
 */
export const PROJECTIONS_BY_SOC: Record<string, OccupationProjection> = Object.fromEntries(
  STEM_OCCUPATION_PROJECTIONS.map(p => [p.socCode.replace(/-/g, ''), p])
);

/**
 * Indexed by hyphenated SOC code for display purposes.
 */
export const PROJECTIONS_BY_DISPLAY_CODE: Record<string, OccupationProjection> = Object.fromEntries(
  STEM_OCCUPATION_PROJECTIONS.map(p => [p.socCode, p])
);

/**
 * Get projection data for an industry by averaging its constituent SOC codes.
 */
export function getIndustryProjectionSummary(industrySocCodes: string[]): {
  avgGrowthPercent: number;
  totalAnnualOpenings: number;
  avgMedianWage: number;
  topGrowingOccupation: OccupationProjection | null;
} {
  let growthSum = 0;
  let openingsSum = 0;
  let wageSum = 0;
  let count = 0;
  let topGrowing: OccupationProjection | null = null;

  for (const code of industrySocCodes) {
    const proj = PROJECTIONS_BY_SOC[code];
    if (!proj) continue;

    growthSum += proj.changePercent;
    openingsSum += proj.annualOpenings;
    wageSum += proj.medianWage2024;
    count++;

    if (!topGrowing || proj.changePercent > topGrowing.changePercent) {
      topGrowing = proj;
    }
  }

  return {
    avgGrowthPercent: count > 0 ? Math.round((growthSum / count) * 10) / 10 : 0,
    totalAnnualOpenings: openingsSum,
    avgMedianWage: count > 0 ? Math.round(wageSum / count) : 0,
    topGrowingOccupation: topGrowing,
  };
}
