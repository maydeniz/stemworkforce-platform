// ===========================================
// CareerNet Data Sync Edge Function
// Fetches expert-annotated career Q&A from CareerVillage.org
// Parses CSV, filters quality, maps tags to industries, upserts to Supabase
// Triggered on schedule (weekly) or manually
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ===========================================
// DATASET CONFIGURATION
// ===========================================

interface DatasetConfig {
  name: string;
  key: 'general' | 'technology' | 'health';
  url: string;
}

const DATASETS: DatasetConfig[] = [
  {
    name: 'General Career Q&A',
    key: 'general',
    url: 'https://raw.githubusercontent.com/RenaissancePhilanthropy/careernet-data/main/general_public.csv',
  },
  {
    name: 'Technology Career Q&A',
    key: 'technology',
    url: 'https://raw.githubusercontent.com/RenaissancePhilanthropy/careernet-data/main/technology_public.csv',
  },
  {
    name: 'Health Career Q&A',
    key: 'health',
    url: 'https://raw.githubusercontent.com/RenaissancePhilanthropy/careernet-data/main/health_public.csv',
  },
];

// Minimum quality threshold (1-4 scale)
const MIN_CORRECTNESS = 3;
const BATCH_SIZE = 500;

// ===========================================
// TAG-TO-INDUSTRY MAPPING
// ===========================================

const TAG_INDUSTRY_MAP: Record<string, string[]> = {
  'ai': ['ai'], 'artificial-intelligence': ['ai'], 'machine-learning': ['ai'],
  'deep-learning': ['ai'], 'data-science': ['ai'], 'nlp': ['ai'],
  'computer-vision': ['ai'], 'neural-networks': ['ai'],
  'natural-language-processing': ['ai'],
  'cybersecurity': ['cybersecurity'], 'information-security': ['cybersecurity'],
  'network-security': ['cybersecurity'], 'ethical-hacking': ['cybersecurity'],
  'cyber-security': ['cybersecurity'],
  'renewable-energy': ['clean-energy'], 'solar-energy': ['clean-energy'],
  'wind-energy': ['clean-energy'], 'clean-energy': ['clean-energy'],
  'sustainability': ['clean-energy'], 'environmental-engineering': ['clean-energy'],
  'environmental-science': ['clean-energy'],
  'biotechnology': ['biotech'], 'biology': ['biotech'], 'genetics': ['biotech'],
  'pharmaceutical': ['biotech'], 'molecular-biology': ['biotech'],
  'biochemistry': ['biotech'], 'bioinformatics': ['biotech'],
  'microbiology': ['biotech'], 'biomedical': ['biotech'],
  'aerospace': ['aerospace'], 'aviation': ['aerospace'], 'space': ['aerospace'],
  'aerospace-engineering': ['aerospace'],
  'semiconductor': ['semiconductor'], 'microelectronics': ['semiconductor'],
  'vlsi': ['semiconductor'], 'electrical-engineering': ['semiconductor'],
  'electronics': ['semiconductor'],
  'quantum-computing': ['quantum'], 'quantum-physics': ['quantum'],
  'quantum-mechanics': ['quantum'], 'quantum': ['quantum'],
  'manufacturing': ['manufacturing'], 'industrial-engineering': ['manufacturing'],
  'mechanical-engineering': ['manufacturing'], 'materials-science': ['manufacturing'],
  'robotics': ['robotics'], '3d-printing': ['manufacturing'],
  'nuclear-engineering': ['nuclear'], 'nuclear-physics': ['nuclear'],
  'nuclear-energy': ['nuclear'], 'nuclear': ['nuclear'],
  'healthcare': ['healthcare'], 'medical-devices': ['healthcare'],
  'biomedical-engineering': ['healthcare'], 'health-informatics': ['healthcare'],
  'nursing': ['healthcare'], 'medicine': ['healthcare'],
  'public-health': ['healthcare'], 'health': ['healthcare'],
  'medical': ['healthcare'], 'pharmacy': ['healthcare'],
  'computer-science': ['ai', 'cybersecurity'],
  'engineering': ['manufacturing', 'aerospace'],
  'technology': ['ai', 'cybersecurity'],
  'science': ['biotech', 'nuclear'],
  'mathematics': ['ai', 'quantum'], 'math': ['ai', 'quantum'],
  'physics': ['quantum', 'nuclear', 'aerospace'],
  'chemistry': ['biotech', 'clean-energy'],
  'programming': ['ai', 'cybersecurity'],
  'software-engineering': ['ai'], 'software-development': ['ai'],
  'data-analytics': ['ai'], 'statistics': ['ai'], 'big-data': ['ai'],
};

// ===========================================
// SCENARIO LABEL NORMALIZATION
// ===========================================

const SCENARIO_MAP: Record<string, string> = {
  'Skill Development': 'skill-development',
  'Career Advancement': 'career-advancement',
  'Interview Preparation': 'interview-prep',
  'First Job Navigation': 'first-job',
  'Resume/CV/LinkedIn Optimization': 'resume-optimization',
  'Networking and Mentorship': 'networking-mentorship',
  'Industry Transition': 'industry-transition',
  'Work-Life Balance': 'work-life-balance',
  'Salary and Benefits Negotiation': 'salary-negotiation',
  'Education and Certification Planning': 'education-planning',
  'Entrepreneurship': 'entrepreneurship',
  'Workplace Challenges': 'workplace-challenges',
  'Job Search Strategy': 'job-search-strategy',
  'Career Exploration': 'career-exploration',
  'Professional Identity': 'professional-identity',
  'Remote Work': 'remote-work',
  'Leadership Development': 'leadership-development',
  'Technical Skills': 'technical-skills',
};

// ===========================================
// CSV PARSING
// ===========================================

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j].trim()] = (values[j] || '').trim();
    }
    rows.push(row);
  }

  return rows;
}

// ===========================================
// CLASSIFICATION FUNCTIONS
// ===========================================

function mapTagsToIndustries(tagString: string): string[] {
  const tags = tagString.toLowerCase().split(/\s+/).filter(Boolean);
  const industries = new Set<string>();

  for (const tag of tags) {
    const mapped = TAG_INDUSTRY_MAP[tag];
    if (mapped) {
      for (const ind of mapped) {
        industries.add(ind);
      }
    }
  }

  return Array.from(industries);
}

function normalizeScenarioLabels(rawLabel: string): string[] {
  if (!rawLabel || rawLabel === 'NA') return [];

  const labels: string[] = [];
  // ScenarioLabels may contain multiple labels separated by semicolons or commas
  const parts = rawLabel.split(/[;,]/).map(s => s.trim()).filter(Boolean);

  for (const part of parts) {
    const normalized = SCENARIO_MAP[part];
    if (normalized) {
      labels.push(normalized);
    }
  }

  return labels;
}

function parseFunctionLabel(value: string): boolean {
  if (!value || value === 'NA' || value === '') return false;
  return value === '1' || value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
}

async function generateChecksum(answerId: string, questionId: string): Promise<string> {
  const data = new TextEncoder().encode(`careernet|${answerId}|${questionId}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
}

// ===========================================
// MAIN HANDLER
// ===========================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Auth check: require service role key
    const authHeader = req.headers.get('Authorization');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    if (!authHeader || authHeader.replace('Bearer ', '') !== serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized: service role key required' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    // Optional: sync only specific dataset
    let targetDatasets = DATASETS;
    try {
      const body = await req.json();
      if (body?.dataset) {
        targetDatasets = DATASETS.filter(d => d.key === body.dataset);
      }
    } catch {
      // No body or invalid JSON — sync all datasets
    }

    const results: Array<{
      dataset: string;
      rowsTotal: number;
      rowsImported: number;
      rowsFiltered: number;
      errors: number;
    }> = [];

    for (const dataset of targetDatasets) {
      console.log(`[careernet-sync] Processing: ${dataset.name}`);

      // Update sync status to running
      await supabase
        .from('career_qa_sync_status')
        .update({ status: 'running', updated_at: new Date().toISOString() })
        .eq('dataset', dataset.key);

      let rowsTotal = 0;
      let rowsImported = 0;
      let rowsFiltered = 0;
      let errorCount = 0;

      try {
        // Fetch CSV from GitHub
        const response = await fetch(dataset.url, {
          headers: {
            'User-Agent': 'STEMWorkforce-CareerNetSync/1.0',
            'Accept': 'text/csv, */*',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const csvText = await response.text();
        const rows = parseCSV(csvText);
        rowsTotal = rows.length;

        console.log(`[careernet-sync] Parsed ${rowsTotal} rows from ${dataset.key}`);

        // Process in batches
        const batch: Array<Record<string, unknown>> = [];

        for (const row of rows) {
          try {
            const correctness = parseInt(row.correctness || '0', 10);
            const completeness = parseInt(row.completeness || '0', 10);
            const coherency = parseInt(row.coherency || '0', 10);

            // Quality filter
            if (correctness < MIN_CORRECTNESS) {
              rowsFiltered++;
              continue;
            }

            // Validate required fields
            const answerId = parseInt(row.answer_id || '0', 10);
            const questionId = parseInt(row.question_id || '0', 10);
            if (!answerId || !questionId || !row.answer_body || !row.question_title) {
              rowsFiltered++;
              continue;
            }

            const tagString = (row.question_tagnames || '').trim();
            const tags = tagString.toLowerCase().split(/\s+/).filter(Boolean);
            const industries = mapTagsToIndustries(tagString);
            const scenarioLabels = normalizeScenarioLabels(row.ScenarioLabels || '');
            const checksum = await generateChecksum(row.answer_id, row.question_id);

            batch.push({
              answer_id: answerId,
              question_id: questionId,
              source_dataset: dataset.key,
              question_title: row.question_title || '',
              question_body: row.question_body || '',
              question_score: parseInt(row.question_score || '0', 10),
              question_views: parseInt(row.question_views || '0', 10),
              question_added_at: row.question_added_at || null,
              answer_body: row.answer_body || '',
              answer_score: parseInt(row.answer_score || '0', 10),
              answer_added_at: row.answer_added_at || null,
              correctness,
              completeness,
              coherency,
              scenario_labels: scenarioLabels,
              explore_options: parseFunctionLabel(row.explore_options),
              take_action: parseFunctionLabel(row.take_action),
              understanding_purpose: parseFunctionLabel(row.understanding_purpose),
              validation_support: parseFunctionLabel(row.validation_support),
              find_resources: parseFunctionLabel(row.find_resources),
              navigate_constraints: parseFunctionLabel(row.navigate_constraints),
              compare_options: parseFunctionLabel(row.compare_options),
              unclear_goal: parseFunctionLabel(row.unclear_goal),
              question_tags: tags,
              industries,
              asker_location: row.asker_location || null,
              answerer_location: row.answerer_location || null,
              content_checksum: checksum,
              synced_at: new Date().toISOString(),
            });

            // Flush batch
            if (batch.length >= BATCH_SIZE) {
              const { error: upsertError } = await supabase
                .from('career_qa')
                .upsert(batch, { onConflict: 'answer_id', ignoreDuplicates: false });

              if (upsertError) {
                console.error(`[careernet-sync] Batch upsert error:`, upsertError.message);
                errorCount += batch.length;
              } else {
                rowsImported += batch.length;
              }
              batch.length = 0;
            }
          } catch (rowErr: unknown) {
            errorCount++;
            const msg = rowErr instanceof Error ? rowErr.message : String(rowErr);
            console.error(`[careernet-sync] Row error:`, msg);
          }
        }

        // Flush remaining batch
        if (batch.length > 0) {
          const { error: upsertError } = await supabase
            .from('career_qa')
            .upsert(batch, { onConflict: 'answer_id', ignoreDuplicates: false });

          if (upsertError) {
            console.error(`[careernet-sync] Final batch error:`, upsertError.message);
            errorCount += batch.length;
          } else {
            rowsImported += batch.length;
          }
        }

        // Update sync status
        await supabase
          .from('career_qa_sync_status')
          .update({
            status: 'completed',
            last_synced_at: new Date().toISOString(),
            rows_total: rowsTotal,
            rows_imported: rowsImported,
            rows_filtered: rowsFiltered,
            error_message: errorCount > 0 ? `${errorCount} row errors` : null,
            updated_at: new Date().toISOString(),
          })
          .eq('dataset', dataset.key);

      } catch (datasetErr: unknown) {
        const msg = datasetErr instanceof Error ? datasetErr.message : String(datasetErr);
        console.error(`[careernet-sync] Dataset ${dataset.key} error:`, msg);

        await supabase
          .from('career_qa_sync_status')
          .update({
            status: 'failed',
            error_message: msg,
            updated_at: new Date().toISOString(),
          })
          .eq('dataset', dataset.key);
      }

      results.push({
        dataset: dataset.key,
        rowsTotal,
        rowsImported,
        rowsFiltered,
        errors: errorCount,
      });

      // Rate limit between datasets
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const summary = {
      success: true,
      datasets: results,
      totalImported: results.reduce((s, r) => s + r.rowsImported, 0),
      totalFiltered: results.reduce((s, r) => s + r.rowsFiltered, 0),
    };

    console.log(`[careernet-sync] Complete:`, summary);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[careernet-sync] Fatal error:', msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
