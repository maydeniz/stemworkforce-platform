/**
 * Workforce Data Sync Edge Function
 * Fetches workforce data from BLS OEWS API and caches it in Supabase.
 * Can be triggered manually or scheduled via cron.
 *
 * OEWS Series ID Format: OEUM{stateFips}{areaCode}{industryCode}{socCode}{dataType}
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// BLS API Configuration
const BLS_API_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';

// Industry → SOC occupation code mapping (mirrors blsSeriesConfig.ts)
const INDUSTRY_SOC_MAPPING: Record<string, { socCodes: { code: string; title: string }[]; projectedGrowth: number }> = {
  'Semiconductor': {
    socCodes: [
      { code: '172061', title: 'Computer Hardware Engineers' },
      { code: '172071', title: 'Electrical Engineers' },
      { code: '172112', title: 'Industrial Engineers' },
    ],
    projectedGrowth: 7.5,
  },
  'Nuclear Technologies': {
    socCodes: [
      { code: '172161', title: 'Nuclear Engineers' },
      { code: '192012', title: 'Physicists' },
      { code: '172141', title: 'Mechanical Engineers' },
    ],
    projectedGrowth: 1.5,
  },
  'AI & Machine Learning': {
    socCodes: [
      { code: '151252', title: 'Software Developers' },
      { code: '152051', title: 'Data Scientists' },
      { code: '151221', title: 'Computer and Information Research Scientists' },
    ],
    projectedGrowth: 33.0,
  },
  'Quantum Technologies': {
    socCodes: [
      { code: '192012', title: 'Physicists' },
      { code: '151221', title: 'Computer and Information Research Scientists' },
      { code: '152031', title: 'Operations Research Analysts' },
    ],
    projectedGrowth: 23.0,
  },
  'Cybersecurity': {
    socCodes: [
      { code: '151212', title: 'Information Security Analysts' },
      { code: '151211', title: 'Computer Systems Analysts' },
      { code: '151244', title: 'Network and Computer Systems Administrators' },
    ],
    projectedGrowth: 28.0,
  },
  'Aerospace & Defense': {
    socCodes: [
      { code: '172011', title: 'Aerospace Engineers' },
      { code: '172199', title: 'Engineers, All Other' },
      { code: '151252', title: 'Software Developers' },
    ],
    projectedGrowth: 12.0,
  },
  'Biotechnology': {
    socCodes: [
      { code: '191042', title: 'Medical Scientists' },
      { code: '172031', title: 'Bioengineers and Biomedical Engineers' },
      { code: '192021', title: 'Atmospheric and Space Scientists' },
    ],
    projectedGrowth: 10.0,
  },
  'Healthcare & Medical Technology': {
    socCodes: [
      { code: '172031', title: 'Bioengineers and Biomedical Engineers' },
      { code: '151211', title: 'Computer Systems Analysts' },
      { code: '152051', title: 'Data Scientists' },
    ],
    projectedGrowth: 14.0,
  },
  'Robotics & Automation': {
    socCodes: [
      { code: '172141', title: 'Mechanical Engineers' },
      { code: '172112', title: 'Industrial Engineers' },
      { code: '151252', title: 'Software Developers' },
    ],
    projectedGrowth: 16.0,
  },
  'Clean Energy': {
    socCodes: [
      { code: '172071', title: 'Electrical Engineers' },
      { code: '172199', title: 'Engineers, All Other' },
      { code: '472231', title: 'Solar Photovoltaic Installers' },
    ],
    projectedGrowth: 22.0,
  },
  'Advanced Manufacturing': {
    socCodes: [
      { code: '172112', title: 'Industrial Engineers' },
      { code: '172141', title: 'Mechanical Engineers' },
      { code: '173026', title: 'Industrial Engineering Technologists and Technicians' },
    ],
    projectedGrowth: 4.5,
  },
};

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

interface IndustryData {
  industry: string;
  totalJobs: number;
  averageSalary: number;
  jobGrowthRate: number;
  topSkills: string[];
  topEmployers: { name: string; jobCount: number; location: string }[];
  majorHubs: { city: string; jobCount: number; averageSalary: number }[];
}

// Industry-specific skills for enrichment
const INDUSTRY_SKILLS: Record<string, string[]> = {
  'Semiconductor': ['VLSI Design', 'Cleanroom Operations', 'Process Engineering', 'Photolithography', 'Testing & Validation'],
  'Nuclear Technologies': ['Reactor Operations', 'Radiation Safety', 'Nuclear Physics', 'Quality Assurance', 'Regulatory Compliance'],
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

// State multipliers for demo data generation
const STATE_MULTIPLIERS: Record<string, { salary: number; jobs: number }> = {
  CA: { salary: 1.25, jobs: 1.4 }, TX: { salary: 1.05, jobs: 1.3 }, NY: { salary: 1.20, jobs: 1.1 },
  FL: { salary: 0.95, jobs: 1.2 }, WA: { salary: 1.18, jobs: 1.15 }, MA: { salary: 1.22, jobs: 1.0 },
  VA: { salary: 1.12, jobs: 1.25 }, CO: { salary: 1.08, jobs: 1.1 }, NC: { salary: 0.98, jobs: 1.15 },
  GA: { salary: 0.97, jobs: 1.1 }, AZ: { salary: 1.02, jobs: 1.2 }, NM: { salary: 0.92, jobs: 0.85 },
  TN: { salary: 0.95, jobs: 1.05 }, OH: { salary: 0.94, jobs: 1.0 }, PA: { salary: 1.0, jobs: 1.0 },
  IL: { salary: 1.05, jobs: 1.1 }, MI: { salary: 0.96, jobs: 0.95 }, NJ: { salary: 1.15, jobs: 0.9 },
  MD: { salary: 1.10, jobs: 1.15 }, OR: { salary: 1.05, jobs: 0.9 },
};

const INDUSTRY_BASES: Record<string, { baseSalary: number; baseJobs: number; growth: number }> = {
  'Semiconductor': { baseSalary: 125000, baseJobs: 15000, growth: 8.5 },
  'Nuclear Technologies': { baseSalary: 110000, baseJobs: 8000, growth: 12.0 },
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

/**
 * Build OEWS series ID for state-level occupation data.
 */
function buildOEWSSeriesId(stateFips: string, socCode: string, dataType: '01' | '13'): string {
  return `OEUM${stateFips}00000000000${socCode}${dataType}`;
}

/**
 * Build all series IDs for a state, deduplicating shared SOC codes.
 */
function buildSeriesIdsForState(
  stateFips: string,
  industries: string[]
): { seriesIds: string[]; socCodeMap: Map<string, string> } {
  const seriesIds: string[] = [];
  const seenSocCodes = new Set<string>();
  const socCodeMap = new Map<string, string>();

  for (const industry of industries) {
    const mapping = INDUSTRY_SOC_MAPPING[industry];
    if (!mapping) continue;

    for (const soc of mapping.socCodes) {
      if (seenSocCodes.has(soc.code)) continue;
      seenSocCodes.add(soc.code);

      const employmentId = buildOEWSSeriesId(stateFips, soc.code, '01');
      const wageId = buildOEWSSeriesId(stateFips, soc.code, '13');

      seriesIds.push(employmentId);
      seriesIds.push(wageId);

      socCodeMap.set(employmentId, soc.code);
      socCodeMap.set(wageId, soc.code);
    }
  }

  return { seriesIds, socCodeMap };
}

/**
 * Parse BLS API response into SOC-level data points.
 */
function parseSeriesResponse(
  blsResponse: any,
  socCodeMap: Map<string, string>
): Map<string, { employment: number; medianWage: number }> {
  const result = new Map<string, { employment: number; medianWage: number }>();

  if (blsResponse?.status !== 'REQUEST_SUCCEEDED' || !blsResponse?.Results?.series) {
    return result;
  }

  for (const series of blsResponse.Results.series) {
    const seriesId: string = series.seriesID;
    const socCode = socCodeMap.get(seriesId);
    if (!socCode) continue;

    const latestData = series.data?.[0];
    if (!latestData) continue;

    const value = parseFloat(latestData.value);
    if (isNaN(value)) continue;

    const dataType = seriesId.slice(-2);
    const existing = result.get(socCode) || { employment: 0, medianWage: 0 };

    if (dataType === '01') {
      existing.employment = Math.round(value * 10);
    } else if (dataType === '13') {
      existing.medianWage = Math.round(value);
    }

    result.set(socCode, existing);
  }

  return result;
}

/**
 * Aggregate SOC-level data into industry-level IndustryData.
 */
function aggregateToIndustries(
  socDataMap: Map<string, { employment: number; medianWage: number }>,
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

    if (socCodesWithData > 0) {
      const avgWage = Math.round(weightedWageSum / totalEmployment);
      const demoData = generateDemoData(stateCode, industry);

      return {
        industry,
        totalJobs: totalEmployment,
        averageSalary: avgWage,
        jobGrowthRate: mapping.projectedGrowth,
        topSkills: demoData.topSkills,
        topEmployers: demoData.topEmployers,
        majorHubs: demoData.majorHubs,
      };
    }

    return generateDemoData(stateCode, industry);
  });
}

/**
 * Fetch data from BLS OEWS API for a single state.
 */
async function fetchBLSData(
  stateFips: string,
  industries: string[],
  blsApiKey: string
): Promise<{ socDataMap: Map<string, { employment: number; medianWage: number }>; seriesCount: number }> {
  const currentYear = new Date().getFullYear();
  const { seriesIds, socCodeMap } = buildSeriesIdsForState(stateFips, industries);

  const response = await fetch(BLS_API_URL, {
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
  const socDataMap = parseSeriesResponse(data, socCodeMap);

  return { socDataMap, seriesCount: seriesIds.length };
}

/**
 * Generate demo data for a state and industry
 */
function generateDemoData(stateCode: string, industry: string): IndustryData {
  const multiplier = STATE_MULTIPLIERS[stateCode] || { salary: 0.9, jobs: 0.8 };
  const base = INDUSTRY_BASES[industry] || { baseSalary: 80000, baseJobs: 10000, growth: 5.0 };
  const skills = INDUSTRY_SKILLS[industry] || ['Technical Skills', 'Problem Solving', 'Communication'];
  const mapping = INDUSTRY_SOC_MAPPING[industry];

  const totalJobs = Math.round(base.baseJobs * multiplier.jobs * (0.8 + Math.random() * 0.4));
  const averageSalary = Math.round(base.baseSalary * multiplier.salary * (0.95 + Math.random() * 0.1));
  const jobGrowthRate = mapping?.projectedGrowth ?? base.growth;

  const stateName = STATE_NAMES[stateCode] || stateCode;
  const cityName = stateName.split(' ')[0] || 'Metro';

  return {
    industry,
    totalJobs,
    averageSalary,
    jobGrowthRate: Math.round(jobGrowthRate * 10) / 10,
    topSkills: skills.slice(0, 5),
    topEmployers: [
      { name: 'Tech Industries Inc', jobCount: Math.round(totalJobs * 0.12), location: cityName },
      { name: 'Advanced Systems Corp', jobCount: Math.round(totalJobs * 0.09), location: cityName },
      { name: 'National Labs', jobCount: Math.round(totalJobs * 0.07), location: cityName },
    ],
    majorHubs: [
      { city: cityName, jobCount: Math.round(totalJobs * 0.6), averageSalary: Math.round(averageSalary * 1.05) },
    ],
  };
}

/**
 * Update API usage tracking
 */
async function updateApiUsage(supabase: any, success: boolean, rateLimited: boolean = false) {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: existing } = await supabase
      .from('bls_api_usage')
      .select('*')
      .eq('date', today)
      .single();

    if (existing) {
      await supabase
        .from('bls_api_usage')
        .update({
          requests_made: existing.requests_made + 1,
          requests_succeeded: existing.requests_succeeded + (success ? 1 : 0),
          requests_failed: existing.requests_failed + (success ? 0 : 1),
          rate_limit_hits: existing.rate_limit_hits + (rateLimited ? 1 : 0),
          updated_at: new Date().toISOString(),
        })
        .eq('date', today);
    } else {
      await supabase.from('bls_api_usage').insert({
        date: today,
        requests_made: 1,
        requests_succeeded: success ? 1 : 0,
        requests_failed: success ? 0 : 1,
        rate_limit_hits: rateLimited ? 1 : 0,
      });
    }
  } catch (error) {
    console.error('Error updating API usage:', error);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // SECURITY: Server-to-server auth — require service role key in Authorization header
    const authHeader = req.headers.get('Authorization');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!authHeader || authHeader.replace('Bearer ', '') !== supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized: service role key required' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const blsApiKey = Deno.env.get('BLS_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for optional parameters
    let targetStates: string[] | null = null;
    let targetIndustries: string[] | null = null;
    let forceRefresh = false;

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        targetStates = body.states || null;
        targetIndustries = body.industries || null;
        forceRefresh = body.forceRefresh || false;
      } catch {
        // No body or invalid JSON
      }
    }

    const states = targetStates || Object.keys(STATE_FIPS);
    const industries = targetIndustries || Object.keys(INDUSTRY_SOC_MAPPING);

    console.log(`Starting workforce data sync for ${states.length} states and ${industries.length} industries`);

    const results = {
      statesProcessed: 0,
      statesWithRealData: 0,
      statesWithDemoData: 0,
      totalSeriesFetched: 0,
      errors: [] as string[],
    };

    // Process states in batches of 2 (each state sends ~40 series in 1 request)
    const batchSize = 2;
    for (let i = 0; i < states.length; i += batchSize) {
      const batch = states.slice(i, i + batchSize);

      await Promise.all(batch.map(async (stateCode) => {
        try {
          // Check if we have recent data (skip if less than 24 hours old)
          if (!forceRefresh) {
            const { data: cached } = await supabase
              .from('workforce_data_cache')
              .select('last_updated')
              .eq('state_code', stateCode)
              .single();

            if (cached) {
              const lastUpdated = new Date(cached.last_updated).getTime();
              const hoursSinceUpdate = (Date.now() - lastUpdated) / (1000 * 60 * 60);
              if (hoursSinceUpdate < 24) {
                console.log(`Skipping ${stateCode} - data is ${hoursSinceUpdate.toFixed(1)} hours old`);
                results.statesProcessed++;
                return;
              }
            }
          }

          let industryData: IndustryData[] = [];
          let dataSource = 'demo';

          // Try to fetch from BLS OEWS API if key is available
          if (blsApiKey) {
            const fips = STATE_FIPS[stateCode];
            if (fips) {
              try {
                const { socDataMap, seriesCount } = await fetchBLSData(fips, industries, blsApiKey);
                results.totalSeriesFetched += seriesCount;

                if (socDataMap.size > 0) {
                  industryData = aggregateToIndustries(socDataMap, industries, stateCode);
                  dataSource = 'live';
                  results.statesWithRealData++;

                  console.log(`${stateCode}: ${socDataMap.size} SOC codes returned from ${seriesCount} series`);
                } else {
                  industryData = industries.map(ind => generateDemoData(stateCode, ind));
                  results.statesWithDemoData++;
                }

                await updateApiUsage(supabase, socDataMap.size > 0);
              } catch (error) {
                console.error(`BLS API error for ${stateCode}:`, error);
                const isRateLimited = String(error).includes('429') ||
                  String(error).includes('REQUEST_NOT_PROCESSED');
                await updateApiUsage(supabase, false, isRateLimited);
                industryData = industries.map(ind => generateDemoData(stateCode, ind));
                results.statesWithDemoData++;
              }
            }
          } else {
            // No API key, use demo data
            industryData = industries.map(ind => generateDemoData(stateCode, ind));
            results.statesWithDemoData++;
          }

          // Upsert to cache
          await supabase
            .from('workforce_data_cache')
            .upsert({
              state_code: stateCode,
              industries: industryData,
              last_updated: new Date().toISOString(),
              data_source: dataSource,
              last_api_call: blsApiKey ? new Date().toISOString() : null,
            }, {
              onConflict: 'state_code',
            });

          results.statesProcessed++;
          console.log(`Processed ${stateCode} with ${dataSource} data`);
        } catch (error) {
          const errorMsg = `Error processing ${stateCode}: ${error}`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
        }
      }));

      // 1-second delay between batches to respect BLS rate limits
      if (i + batchSize < states.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update national statistics
    try {
      const { error } = await supabase.rpc('update_national_workforce_stats');
      if (error) {
        console.error('Error updating national stats:', error);
      }
    } catch (error) {
      console.error('Error calling update_national_workforce_stats:', error);
    }

    console.log('Workforce data sync completed:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Workforce data sync completed',
        results,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Workforce sync error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
