/**
 * Workforce Data Service
 * Fetches real workforce data from BLS OEWS API with fallback to demo data.
 *
 * Data flow: Cache (24h) → BLS OEWS API (batched, 1 request per state) → Demo data
 */

import { supabase } from '@/lib/supabase';
import {
  INDUSTRY_SOC_MAPPING,
  buildSeriesIdsForState,
  parseSeriesResponse,
  type SOCDataPoint,
} from './blsSeriesConfig';
// Projections data is used by blsSeriesConfig.ts for growth rates

// Types for workforce data
export interface StateWorkforceData {
  stateCode: string;
  stateName: string;
  industries: IndustryData[];
  lastUpdated: string;
}

export interface IndustryData {
  industry: string;
  totalJobs: number;
  averageSalary: number;
  jobGrowthRate: number;
  topSkills: string[];
  topEmployers: EmployerData[];
  majorHubs: HubData[];
}

export interface EmployerData {
  name: string;
  jobCount: number;
  location: string;
}

export interface HubData {
  city: string;
  jobCount: number;
  averageSalary: number;
}

// State FIPS codes for BLS API
const STATE_FIPS: Record<string, string> = {
  AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10',
  FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19', KS: '20',
  KY: '21', LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27', MS: '28',
  MO: '29', MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35', NY: '36',
  NC: '37', ND: '38', OH: '39', OK: '40', OR: '41', PA: '42', RI: '44', SC: '45',
  SD: '46', TN: '47', TX: '48', UT: '49', VT: '50', VA: '51', WA: '53', WV: '54',
  WI: '55', WY: '56', DC: '11',
};

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
};

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Fetch OEWS occupation data from BLS API v2 for a single state.
 * Sends one batched request with all ~40 series IDs (under the 50-series limit).
 * Returns a Map of SOC code → { employment, medianWage }.
 */
async function fetchOEWSData(
  stateCode: string,
  industries: string[]
): Promise<Map<string, SOCDataPoint>> {
  const blsApiKey = import.meta.env.VITE_BLS_API_KEY;

  if (!blsApiKey) {
    console.warn('BLS API key not configured, using demo data');
    return new Map();
  }

  const fips = STATE_FIPS[stateCode];
  if (!fips) {
    console.warn(`No FIPS code for state: ${stateCode}`);
    return new Map();
  }

  const { seriesIds, socCodeMap } = buildSeriesIdsForState(fips, industries);

  if (seriesIds.length === 0) {
    return new Map();
  }

  try {
    const currentYear = new Date().getFullYear();

    const response = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seriesid: seriesIds,
        startyear: currentYear - 2,
        endyear: currentYear,
        registrationkey: blsApiKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`BLS API error: ${response.status}`);
    }

    const data = await response.json();
    const result = parseSeriesResponse(data, socCodeMap);

    console.log(
      `BLS OEWS fetch for ${stateCode}: ${seriesIds.length} series requested, ` +
      `${result.size} SOC codes returned`
    );

    return result;
  } catch (error) {
    console.error(`Error fetching OEWS data for ${stateCode}:`, error);
    return new Map();
  }
}

/**
 * Aggregate SOC-level OEWS data into the platform's industry-level IndustryData format.
 * Uses real employment/wage data where available, projections for growth rates,
 * and demo data for fields BLS doesn't provide (skills, employers, hubs).
 */
function aggregateToIndustries(
  socDataMap: Map<string, SOCDataPoint>,
  industries: string[],
  stateCode: string
): IndustryData[] {
  return industries.map(industry => {
    const mapping = INDUSTRY_SOC_MAPPING[industry];
    if (!mapping) return generateDemoData(stateCode, industry);

    let totalEmployment = 0;
    let weightedWageSum = 0;
    let socCodesWithData = 0;

    for (const soc of mapping.socCodes) {
      const data = socDataMap.get(soc.code);
      if (data && data.employment > 0) {
        totalEmployment += data.employment;
        weightedWageSum += data.medianWage * data.employment;
        socCodesWithData++;
      }
    }

    // If we got real data for at least one SOC code, use it
    if (socCodesWithData > 0) {
      const avgWage = Math.round(weightedWageSum / totalEmployment);

      // Use hardcoded BLS projections for growth rate (national-level)
      const growthRate = mapping.projectedGrowth;

      // Fill non-BLS fields from demo data (skills, employers, hubs)
      const demoData = generateDemoData(stateCode, industry);

      return {
        industry,
        totalJobs: totalEmployment,
        averageSalary: avgWage,
        jobGrowthRate: growthRate,
        topSkills: demoData.topSkills,
        topEmployers: demoData.topEmployers,
        majorHubs: demoData.majorHubs,
      };
    }

    // No real data for this industry — fall back entirely to demo
    return generateDemoData(stateCode, industry);
  });
}

/**
 * Get cached data from Supabase
 */
async function getCachedData(stateCode: string): Promise<StateWorkforceData | null> {
  try {
    const { data, error } = await supabase
      .from('workforce_data_cache')
      .select('*')
      .eq('state_code', stateCode)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if cache is still valid
    const lastUpdated = new Date(data.last_updated).getTime();
    if (Date.now() - lastUpdated > CACHE_DURATION) {
      return null; // Cache expired
    }

    return {
      stateCode: data.state_code,
      stateName: STATE_NAMES[data.state_code] || data.state_code,
      industries: data.industries,
      lastUpdated: data.last_updated,
    };
  } catch (error) {
    console.error('Error fetching cached data:', error);
    return null;
  }
}

/**
 * Save data to cache
 */
async function cacheData(
  stateCode: string,
  industries: IndustryData[],
  dataSource: 'live' | 'demo' = 'demo'
): Promise<void> {
  try {
    await supabase
      .from('workforce_data_cache')
      .upsert({
        state_code: stateCode,
        industries,
        last_updated: new Date().toISOString(),
        data_source: dataSource,
      }, {
        onConflict: 'state_code',
      });
  } catch (error) {
    console.error('Error caching workforce data:', error);
  }
}

/**
 * Generate demo data for a state and industry (fallback)
 */
function generateDemoData(stateCode: string, industry: string): IndustryData {
  // State multipliers for realistic variation
  const stateMultipliers: Record<string, { salary: number; jobs: number }> = {
    CA: { salary: 1.25, jobs: 1.4 },
    TX: { salary: 1.05, jobs: 1.3 },
    NY: { salary: 1.20, jobs: 1.1 },
    FL: { salary: 0.95, jobs: 1.2 },
    WA: { salary: 1.18, jobs: 1.15 },
    MA: { salary: 1.22, jobs: 1.0 },
    VA: { salary: 1.12, jobs: 1.25 },
    CO: { salary: 1.08, jobs: 1.1 },
    NC: { salary: 0.98, jobs: 1.15 },
    GA: { salary: 0.97, jobs: 1.1 },
    AZ: { salary: 1.02, jobs: 1.2 },
    NM: { salary: 0.92, jobs: 0.85 },
    TN: { salary: 0.95, jobs: 1.05 },
    OH: { salary: 0.94, jobs: 1.0 },
    PA: { salary: 1.0, jobs: 1.0 },
    IL: { salary: 1.05, jobs: 1.1 },
    MI: { salary: 0.96, jobs: 0.95 },
    NJ: { salary: 1.15, jobs: 0.9 },
    MD: { salary: 1.10, jobs: 1.15 },
    OR: { salary: 1.05, jobs: 0.9 },
  };

  // Industry base data (aligned with BLS projections)
  const industryBases: Record<string, { baseSalary: number; baseJobs: number; growth: number }> = {
    'Semiconductor': { baseSalary: 125000, baseJobs: 15000, growth: 8.5 },
    'Nuclear Energy': { baseSalary: 110000, baseJobs: 8000, growth: 12.0 },
    'AI & Machine Learning': { baseSalary: 145000, baseJobs: 25000, growth: 22.0 },
    'Quantum Technologies': { baseSalary: 155000, baseJobs: 3000, growth: 35.0 },
    'Cybersecurity': { baseSalary: 120000, baseJobs: 45000, growth: 15.0 },
    'Aerospace & Defense': { baseSalary: 105000, baseJobs: 55000, growth: 6.0 },
    'Biotechnology': { baseSalary: 95000, baseJobs: 22000, growth: 10.0 },
    'Healthcare & Medical Technology': { baseSalary: 88000, baseJobs: 65000, growth: 12.0 },
    'Robotics & Automation': { baseSalary: 115000, baseJobs: 18000, growth: 18.0 },
    'Clean Energy': { baseSalary: 85000, baseJobs: 35000, growth: 25.0 },
    'Advanced Manufacturing': { baseSalary: 75000, baseJobs: 120000, growth: 5.0 },
  };

  // Industry-specific skills
  const industrySkills: Record<string, string[]> = {
    'Semiconductor': ['VLSI Design', 'Cleanroom Operations', 'Process Engineering', 'Photolithography', 'Testing & Validation'],
    'Nuclear Energy': ['Reactor Operations', 'Radiation Safety', 'Nuclear Physics', 'Quality Assurance', 'Regulatory Compliance'],
    'AI & Machine Learning': ['Python', 'TensorFlow/PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps'],
    'Quantum Technologies': ['Quantum Mechanics', 'Cryogenics', 'Python/Qiskit', 'Linear Algebra', 'Error Correction'],
    'Cybersecurity': ['Penetration Testing', 'SIEM', 'Incident Response', 'Cloud Security', 'Zero Trust Architecture'],
    'Aerospace & Defense': ['Systems Engineering', 'CAD/CAM', 'Flight Dynamics', 'Avionics', 'Project Management'],
    'Biotechnology': ['Molecular Biology', 'CRISPR', 'Bioinformatics', 'Lab Techniques', 'Regulatory Affairs'],
    'Healthcare & Medical Technology': ['FDA Regulations', 'Medical Devices', 'Clinical Trials', 'Quality Systems', 'Biomedical Engineering'],
    'Robotics & Automation': ['ROS', 'PLC Programming', 'Motion Control', 'Computer Vision', 'Embedded Systems'],
    'Clean Energy': ['Solar/Wind Technology', 'Energy Storage', 'Grid Integration', 'Sustainability', 'Project Development'],
    'Advanced Manufacturing': ['Lean Manufacturing', 'Six Sigma', 'CNC Programming', 'Industry 4.0', 'Supply Chain'],
  };

  // State industry hubs
  const stateHubs: Record<string, Record<string, { city: string; jobMultiplier: number }[]>> = {
    CA: {
      'Semiconductor': [{ city: 'San Jose', jobMultiplier: 0.4 }, { city: 'Irvine', jobMultiplier: 0.25 }],
      'AI & Machine Learning': [{ city: 'San Francisco', jobMultiplier: 0.35 }, { city: 'Palo Alto', jobMultiplier: 0.3 }],
      'Biotechnology': [{ city: 'San Diego', jobMultiplier: 0.35 }, { city: 'South San Francisco', jobMultiplier: 0.3 }],
    },
    TX: {
      'Semiconductor': [{ city: 'Austin', jobMultiplier: 0.45 }, { city: 'Dallas', jobMultiplier: 0.25 }],
      'Aerospace & Defense': [{ city: 'Houston', jobMultiplier: 0.4 }, { city: 'Fort Worth', jobMultiplier: 0.3 }],
      'Clean Energy': [{ city: 'Houston', jobMultiplier: 0.35 }, { city: 'Austin', jobMultiplier: 0.2 }],
    },
    WA: {
      'AI & Machine Learning': [{ city: 'Seattle', jobMultiplier: 0.5 }, { city: 'Bellevue', jobMultiplier: 0.25 }],
      'Aerospace & Defense': [{ city: 'Seattle', jobMultiplier: 0.6 }, { city: 'Everett', jobMultiplier: 0.25 }],
    },
    MA: {
      'Biotechnology': [{ city: 'Cambridge', jobMultiplier: 0.45 }, { city: 'Boston', jobMultiplier: 0.35 }],
      'Quantum Technologies': [{ city: 'Cambridge', jobMultiplier: 0.5 }, { city: 'Boston', jobMultiplier: 0.3 }],
    },
    VA: {
      'Cybersecurity': [{ city: 'Arlington', jobMultiplier: 0.35 }, { city: 'Tysons', jobMultiplier: 0.25 }],
      'Aerospace & Defense': [{ city: 'Arlington', jobMultiplier: 0.3 }, { city: 'Chantilly', jobMultiplier: 0.25 }],
    },
    MD: {
      'Cybersecurity': [{ city: 'Fort Meade', jobMultiplier: 0.4 }, { city: 'Columbia', jobMultiplier: 0.25 }],
      'Biotechnology': [{ city: 'Bethesda', jobMultiplier: 0.35 }, { city: 'Rockville', jobMultiplier: 0.25 }],
    },
  };

  const multiplier = stateMultipliers[stateCode] || { salary: 0.9, jobs: 0.8 };
  const base = industryBases[industry] || { baseSalary: 80000, baseJobs: 10000, growth: 5.0 };
  const skills = industrySkills[industry] || ['Technical Skills', 'Problem Solving', 'Communication'];

  // Use projections-based growth rate when available
  const mapping = INDUSTRY_SOC_MAPPING[industry];
  const growthRate = mapping?.projectedGrowth ?? base.growth;

  // Calculate state-specific values
  const totalJobs = Math.round(base.baseJobs * multiplier.jobs * (0.8 + Math.random() * 0.4));
  const averageSalary = Math.round(base.baseSalary * multiplier.salary * (0.95 + Math.random() * 0.1));

  // Generate hubs
  const hubs = stateHubs[stateCode]?.[industry] || [{ city: STATE_NAMES[stateCode]?.split(' ')[0] || 'Metro', jobMultiplier: 0.6 }];
  const majorHubs: HubData[] = hubs.map(hub => ({
    city: hub.city,
    jobCount: Math.round(totalJobs * hub.jobMultiplier),
    averageSalary: Math.round(averageSalary * (0.95 + Math.random() * 0.1)),
  }));

  // Generate mock employers
  const employerPrefixes = ['Tech', 'Advanced', 'National', 'Global', 'Prime', 'United', 'Pacific', 'Atlantic'];
  const employerSuffixes = ['Systems', 'Labs', 'Industries', 'Technologies', 'Solutions', 'Corp', 'Inc'];
  const topEmployers: EmployerData[] = Array.from({ length: 5 }, (_, i) => ({
    name: `${employerPrefixes[Math.floor(Math.random() * employerPrefixes.length)]} ${employerSuffixes[Math.floor(Math.random() * employerSuffixes.length)]}`,
    jobCount: Math.round(totalJobs * (0.15 - i * 0.02) * (0.8 + Math.random() * 0.4)),
    location: majorHubs[0]?.city || 'Various',
  }));

  return {
    industry,
    totalJobs,
    averageSalary,
    jobGrowthRate: Math.round(growthRate * 10) / 10,
    topSkills: skills.slice(0, 5),
    topEmployers,
    majorHubs,
  };
}

/**
 * Main function to get workforce data for a state.
 * Tries: 1) Cache 2) BLS OEWS API (single batched request) 3) Demo data
 */
export async function getWorkforceData(stateCode: string, industries?: string[]): Promise<StateWorkforceData> {
  const targetIndustries = industries || Object.keys(INDUSTRY_SOC_MAPPING);

  // Try to get cached data first
  const cachedData = await getCachedData(stateCode);
  if (cachedData) {
    console.log(`Using cached data for ${stateCode}`);
    return cachedData;
  }

  // Try to fetch fresh data from BLS OEWS API (single batched call for all industries)
  let industryData: IndustryData[];
  let dataSource: 'live' | 'demo' = 'demo';

  try {
    const socDataMap = await fetchOEWSData(stateCode, targetIndustries);

    if (socDataMap.size > 0) {
      industryData = aggregateToIndustries(socDataMap, targetIndustries, stateCode);
      dataSource = 'live';
    } else {
      industryData = targetIndustries.map(ind => generateDemoData(stateCode, ind));
    }
  } catch (error) {
    console.error(`BLS fetch failed for ${stateCode}:`, error);
    industryData = targetIndustries.map(ind => generateDemoData(stateCode, ind));
  }

  const result: StateWorkforceData = {
    stateCode,
    stateName: STATE_NAMES[stateCode] || stateCode,
    industries: industryData,
    lastUpdated: new Date().toISOString(),
  };

  // Cache the results
  await cacheData(stateCode, industryData, dataSource);

  return result;
}

/**
 * Get workforce data for all states (for map visualization)
 */
export async function getAllStatesWorkforceData(industry?: string): Promise<Map<string, StateWorkforceData>> {
  const states = Object.keys(STATE_FIPS);
  const targetIndustries = industry ? [industry] : undefined;

  const dataMap = new Map<string, StateWorkforceData>();

  // Fetch data for all states in parallel (with rate limiting)
  const batchSize = 10;
  for (let i = 0; i < states.length; i += batchSize) {
    const batch = states.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(stateCode => getWorkforceData(stateCode, targetIndustries))
    );

    results.forEach((data, idx) => {
      dataMap.set(batch[idx], data);
    });
  }

  return dataMap;
}

/**
 * Get aggregated national statistics for an industry
 */
export async function getNationalIndustryStats(industry: string): Promise<{
  totalJobs: number;
  averageSalary: number;
  topStates: { stateCode: string; stateName: string; jobs: number }[];
  growthRate: number;
}> {
  const allData = await getAllStatesWorkforceData(industry);

  let totalJobs = 0;
  let salarySum = 0;
  let salaryCount = 0;
  let growthSum = 0;
  let growthCount = 0;

  const stateJobs: { stateCode: string; stateName: string; jobs: number }[] = [];

  allData.forEach((data, stateCode) => {
    const industryData = data.industries.find(i => i.industry === industry);
    if (industryData) {
      totalJobs += industryData.totalJobs;
      salarySum += industryData.averageSalary;
      salaryCount++;
      growthSum += industryData.jobGrowthRate;
      growthCount++;
      stateJobs.push({
        stateCode,
        stateName: data.stateName,
        jobs: industryData.totalJobs,
      });
    }
  });

  // Sort by jobs descending
  stateJobs.sort((a, b) => b.jobs - a.jobs);

  return {
    totalJobs,
    averageSalary: salaryCount > 0 ? Math.round(salarySum / salaryCount) : 0,
    topStates: stateJobs.slice(0, 10),
    growthRate: growthCount > 0 ? Math.round((growthSum / growthCount) * 10) / 10 : 0,
  };
}

/**
 * Check if real data is available (API key configured)
 */
export function isRealDataAvailable(): boolean {
  return !!import.meta.env.VITE_BLS_API_KEY;
}

/**
 * Get data source status
 */
export function getDataSourceStatus(): 'live' | 'cached' | 'demo' {
  if (!import.meta.env.VITE_BLS_API_KEY) {
    return 'demo';
  }
  return 'live';
}
