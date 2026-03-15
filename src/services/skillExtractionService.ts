// ============================================================
// Skill Extraction Service — Phase 1
//
// Extracts ESCO-mapped skills from experience descriptions.
// Phase 1: rule-based keyword matching against the ESCO
//   taxonomy already seeded in the database.
// Phase 2 (future): Replace with embedding-based extraction
//   using sentence-transformers/all-mpnet-base-v2 + Claude API.
// ============================================================

import { supabase } from '@/lib/supabase';
import { getAllSkillTaxonomy, addSkill } from '@/services/experienceLedgerApi';
import type { ExtractedSkill, SkillTaxonomyEntry } from '@/types/experienceLedger';

// Cache taxonomy in memory for the session to avoid repeated DB hits
let _taxonomyCache: SkillTaxonomyEntry[] | null = null;

async function getTaxonomy(): Promise<SkillTaxonomyEntry[]> {
  if (_taxonomyCache) return _taxonomyCache;
  _taxonomyCache = await getAllSkillTaxonomy();
  return _taxonomyCache;
}

/**
 * Tokenize text into lowercase words, stripping punctuation.
 */
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
}

/**
 * Find the best matching skill in the taxonomy for a given phrase.
 * Returns confidence based on how complete the match is.
 */
function matchSkill(
  phrase: string,
  taxonomy: SkillTaxonomyEntry[]
): { entry: SkillTaxonomyEntry; confidence: number; matched_label: string } | null {
  const lc = phrase.toLowerCase().trim();
  if (lc.length < 3) return null;

  let best: { entry: SkillTaxonomyEntry; confidence: number; matched_label: string } | null = null;

  for (const entry of taxonomy) {
    const candidates = [entry.label, ...entry.alt_labels].map(l => l.toLowerCase());

    for (const candidate of candidates) {
      let confidence = 0;

      if (lc === candidate) {
        confidence = 1.0;                          // Exact match
      } else if (lc.includes(candidate) || candidate.includes(lc)) {
        const longer = Math.max(lc.length, candidate.length);
        const shorter = Math.min(lc.length, candidate.length);
        confidence = shorter / longer * 0.85;      // Partial match
      }

      if (confidence > 0.5 && (!best || confidence > best.confidence)) {
        best = { entry, confidence: Math.round(confidence * 100) / 100, matched_label: candidate };
      }
    }
  }

  return best;
}

/**
 * Extract skill triples from free-form experience text.
 * Returns array of ExtractedSkill with evidence spans.
 *
 * Phase 1 approach: sliding window over n-grams (1–4 words),
 * matched against ESCO taxonomy. Deduplicates by esco_uri.
 */
export async function extractSkillsFromText(text: string): Promise<ExtractedSkill[]> {
  if (!text || text.trim().length < 10) return [];

  const taxonomy = await getTaxonomy();
  const words = tokenize(text);
  const results: Map<string, ExtractedSkill> = new Map();

  // Sliding window: 1-gram through 4-gram
  for (let size = 4; size >= 1; size--) {
    for (let i = 0; i <= words.length - size; i++) {
      const phrase = words.slice(i, i + size).join(' ');
      const match = matchSkill(phrase, taxonomy);
      if (!match) continue;

      const key = match.entry.esco_uri ?? match.entry.label;
      // Only keep if not already found at higher confidence
      if (!results.has(key) || results.get(key)!.confidence < match.confidence) {
        // Find the original evidence span in the source text (case-insensitive)
        const spanRegex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const spanMatch = text.match(spanRegex);

        results.set(key, {
          esco_uri: match.entry.esco_uri,
          label: match.entry.label,
          confidence: match.confidence,
          evidence_span: spanMatch ? spanMatch[0] : phrase,
          extraction_method: 'ai_extracted',
        });
      }
    }
  }

  // Return sorted by confidence, max 15 skills
  return Array.from(results.values())
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 15);
}

/**
 * Run skill extraction on an experience and persist results.
 * Merges with any existing manually-added skills.
 */
export async function extractAndPersistSkills(
  experienceId: string,
  userId: string,
  text: string
): Promise<ExtractedSkill[]> {
  const extracted = await extractSkillsFromText(text);
  if (!extracted.length) return [];

  // Fetch existing skills to avoid duplicates
  const { data: existing } = await supabase
    .from('experience_skills')
    .select('esco_uri, esco_label')
    .eq('experience_id', experienceId);

  const existingKeys = new Set([
    ...(existing ?? []).map(s => s.esco_uri).filter(Boolean),
    ...(existing ?? []).map(s => s.esco_label.toLowerCase()),
  ]);

  const toInsert = extracted.filter(s => {
    const key = s.esco_uri ?? s.label;
    return !existingKeys.has(key) && !existingKeys.has(s.label.toLowerCase());
  });

  // Batch insert new skills
  for (const skill of toInsert) {
    try {
      await addSkill({
        experience_id: experienceId,
        esco_uri: skill.esco_uri ?? undefined,
        esco_label: skill.label,
        confidence: skill.confidence,
        evidence_span: skill.evidence_span ?? undefined,
        extraction_method: 'ai_extracted',
      });
    } catch {
      // Skip duplicates silently
    }
  }

  // Update the experience with the extracted skills JSON and log event
  await supabase
    .from('verified_experiences')
    .update({
      extracted_skills: extracted,
      updated_at: new Date().toISOString(),
    })
    .eq('id', experienceId);

  await supabase.rpc('append_verification_event', {
    p_experience_id: experienceId,
    p_event_type: 'skill_extracted',
    p_actor_type: 'system',
    p_actor_user_id: userId,
    p_notes: `Extracted ${toInsert.length} new skill(s) from description`,
    p_metadata: { skill_count: extracted.length, new_count: toInsert.length },
  });

  return extracted;
}

/**
 * Generate capability tags from a set of verified skills.
 * Phase 1: rule-based grouping by ISCO occupation group.
 * Phase 2: embedding cluster + Claude narrative.
 */
export function generateCapabilityTags(skills: ExtractedSkill[]): string[] {
  const iscoGroups: Record<string, string[]> = {
    '2512': ['Software Engineer', 'Developer'],
    '2519': ['AI/ML Practitioner', 'Data Scientist'],
    '2521': ['Data Engineer', 'Data Analyst'],
    '2529': ['Cybersecurity Specialist'],
    '2149': ['Robotics Engineer', 'Autonomous Systems Engineer'],
    '2141': ['Nuclear/Materials Engineer'],
    '2151': ['Electrical Engineer'],
    '2131': ['Computational Biologist', 'Bioinformatics Analyst'],
    '2166': ['Technical Writer', 'GIS Analyst'],
    '1219': ['Project Manager'],
    '2111': ['Research Scientist'],
    '3111': ['Laboratory Technician'],
  };

  const tags = new Set<string>();

  for (const skill of skills) {
    if (skill.confidence < 0.6) continue;
    // Look up taxonomy entry for ISCO group
    const iscoGroup = Object.entries(iscoGroups).find(([group]) =>
      skill.label.toLowerCase().includes(group.toLowerCase()) ||
      Object.values(iscoGroups[group] ?? []).some(t =>
        skill.label.toLowerCase().includes(t.toLowerCase())
      )
    );
    if (iscoGroup) {
      iscoGroup[1].forEach(tag => tags.add(tag));
    }
  }

  // Fallback: use high-confidence skill labels as tags
  if (tags.size === 0) {
    skills
      .filter(s => s.confidence >= 0.8)
      .slice(0, 3)
      .forEach(s => tags.add(s.label));
  }

  return Array.from(tags).slice(0, 5);
}

/**
 * Parse a resume/CV text and extract experiences + skills.
 * Phase 1: returns structured skill list for manual review.
 * Phase 2: full experience segmentation with Claude.
 */
export async function parseResumeSkills(resumeText: string): Promise<{
  skills: ExtractedSkill[];
  capability_tags: string[];
  summary: string;
}> {
  const skills = await extractSkillsFromText(resumeText);
  const capability_tags = generateCapabilityTags(skills);

  const highConfidence = skills.filter(s => s.confidence >= 0.8);
  const summary = highConfidence.length > 0
    ? `Identified ${skills.length} skills including ${highConfidence.slice(0, 3).map(s => s.label).join(', ')}.`
    : `Identified ${skills.length} potential skills. Review and confirm below.`;

  return { skills, capability_tags, summary };
}
