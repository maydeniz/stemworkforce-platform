// ============================================================
// Experience Ledger API Service
// All Supabase calls for the Verified Experience Ledger
// ============================================================

import { supabase } from '@/lib/supabase';
import type {
  PortfolioProfile,
  VerifiedExperience,
  ExperienceEvidence,
  ExperienceSkill,
  VerificationEvent,
  EmployerTalentSave,
  TalentProfile,
  CreateExperienceInput,
  SubmitVerificationInput,
  AddEvidenceInput,
  AddSkillInput,
  UpdatePortfolioInput,
  SkillTaxonomyEntry,
  TrustLevel,
  PipelineStatus,
} from '@/types/experienceLedger';

// ── Portfolio Profile ─────────────────────────────────────────

export async function getMyPortfolio(): Promise<PortfolioProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('portfolio_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // Auto-create if missing
    if (error.code === 'PGRST116') {
      const { data: created } = await supabase
        .from('portfolio_profiles')
        .insert({ user_id: user.id })
        .select()
        .single();
      return created ?? null;
    }
    throw error;
  }
  return data;
}

export async function updatePortfolio(input: UpdatePortfolioInput): Promise<PortfolioProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('portfolio_profiles')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPortfolioByUserId(userId: string): Promise<PortfolioProfile | null> {
  const { data, error } = await supabase
    .from('portfolio_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_discoverable', true)
    .single();

  if (error) return null;
  return data;
}

// ── Experiences ───────────────────────────────────────────────

export async function getMyExperiences(): Promise<VerifiedExperience[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('verified_experiences')
    .select(`
      *,
      evidence:experience_evidence(*),
      skills:experience_skills(*)
    `)
    .eq('user_id', user.id)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return (data ?? []) as VerifiedExperience[];
}

export async function getExperienceById(id: string): Promise<VerifiedExperience | null> {
  const { data, error } = await supabase
    .from('verified_experiences')
    .select(`
      *,
      evidence:experience_evidence(*),
      skills:experience_skills(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as VerifiedExperience;
}

export async function createExperience(input: CreateExperienceInput): Promise<VerifiedExperience> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: portfolio } = await supabase
    .from('portfolio_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const { data, error } = await supabase
    .from('verified_experiences')
    .insert({
      user_id: user.id,
      portfolio_id: portfolio?.id ?? null,
      ...input,
      trust_level: 1,
      verification_status: 'draft',
    })
    .select()
    .single();

  if (error) throw error;

  // Log creation event
  await supabase.rpc('append_verification_event', {
    p_experience_id: data.id,
    p_event_type: 'created',
    p_actor_type: 'student',
    p_actor_user_id: user.id,
    p_new_status: 'draft',
    p_new_trust: 1,
  });

  return data as VerifiedExperience;
}

export async function updateExperience(
  id: string,
  input: Partial<CreateExperienceInput>
): Promise<VerifiedExperience> {
  const { data, error } = await supabase
    .from('verified_experiences')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as VerifiedExperience;
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase
    .from('verified_experiences')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function submitForVerification(input: SubmitVerificationInput): Promise<void> {
  const { error } = await supabase.rpc('submit_experience_for_verification', {
    p_experience_id: input.experience_id,
    p_verifier_name: input.verifier_name,
    p_verifier_email: input.verifier_email,
    p_verifier_title: input.verifier_title,
    p_verifier_type: input.verifier_type,
    p_notes: input.notes ?? null,
  });

  if (error) throw error;
}

// ── Evidence ──────────────────────────────────────────────────

export async function addEvidence(input: AddEvidenceInput): Promise<ExperienceEvidence> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('experience_evidence')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as ExperienceEvidence;
}

export async function deleteEvidence(id: string): Promise<void> {
  const { error } = await supabase
    .from('experience_evidence')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ── Skills ────────────────────────────────────────────────────

export async function addSkill(input: AddSkillInput): Promise<ExperienceSkill> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('experience_skills')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as ExperienceSkill;
}

export async function removeSkill(id: string): Promise<void> {
  const { error } = await supabase
    .from('experience_skills')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getSkillSuggestions(query: string): Promise<SkillTaxonomyEntry[]> {
  const { data, error } = await supabase
    .from('skill_taxonomy')
    .select('*')
    .eq('is_active', true)
    .or(`label.ilike.%${query}%,alt_labels.cs.{${query}}`)
    .order('is_stem', { ascending: false })
    .limit(20);

  if (error) return [];
  return (data ?? []) as SkillTaxonomyEntry[];
}

export async function getAllSkillTaxonomy(): Promise<SkillTaxonomyEntry[]> {
  const { data } = await supabase
    .from('skill_taxonomy')
    .select('*')
    .eq('is_active', true)
    .order('label');
  return (data ?? []) as SkillTaxonomyEntry[];
}

// ── Verification Events ───────────────────────────────────────

export async function getVerificationHistory(experienceId: string): Promise<VerificationEvent[]> {
  const { data, error } = await supabase
    .from('verification_events')
    .select('*')
    .eq('experience_id', experienceId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as VerificationEvent[];
}

// ── Employer Talent Discovery ─────────────────────────────────

export interface TalentDiscoveryFilters {
  skills?: string[];           // ESCO URIs or labels
  experience_types?: string[];
  min_trust_level?: TrustLevel;
  target_role?: string;
  is_open?: boolean;
  limit?: number;
  offset?: number;
}

export async function discoverTalent(
  filters: TalentDiscoveryFilters = {}
): Promise<TalentProfile[]> {
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  // Fetch discoverable portfolios
  let query = supabase
    .from('portfolio_profiles')
    .select('*')
    .eq('is_discoverable', true)
    .order('discoverability_score', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.target_role) {
    query = query.ilike('target_role', `%${filters.target_role}%`);
  }
  if (filters.is_open !== undefined) {
    query = query.eq('is_open_to_opportunities', filters.is_open);
  }

  const { data: portfolios, error } = await query;
  if (error) throw error;
  if (!portfolios?.length) return [];

  const userIds = portfolios.map(p => p.user_id);

  // Fetch top verified experiences per user
  const { data: experiences } = await supabase
    .from('verified_experiences')
    .select('*, skills:experience_skills(*), evidence:experience_evidence(id,evidence_type,title,url,is_public)')
    .in('user_id', userIds)
    .eq('verification_status', 'verified')
    .gte('trust_level', filters.min_trust_level ?? 3)
    .order('trust_level', { ascending: false });

  // Fetch employer's saved talent for CRM status
  const { data: { user } } = await supabase.auth.getUser();
  let saves: EmployerTalentSave[] = [];
  if (user) {
    const { data: savesData } = await supabase
      .from('employer_talent_saves')
      .select('*')
      .eq('employer_id', user.id)
      .in('student_id', userIds);
    saves = (savesData ?? []) as EmployerTalentSave[];
  }

  // Assemble talent profiles
  return portfolios.map(portfolio => {
    const userExps = (experiences ?? [])
      .filter(e => e.user_id === portfolio.user_id) as VerifiedExperience[];

    // Filter by skill if requested
    let filtered = userExps;
    if (filters.skills?.length) {
      filtered = userExps.filter(e =>
        (e.skills ?? []).some(s =>
          filters.skills!.some(f =>
            s.esco_label.toLowerCase().includes(f.toLowerCase()) ||
            (s.esco_uri && s.esco_uri === f)
          )
        )
      );
    }

    const allSkills = filtered.flatMap(e => (e.skills ?? []) as ExperienceSkill[]);
    const uniqueSkills = Array.from(
      new Map(allSkills.map(s => [s.esco_label, s])).values()
    ).sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0)).slice(0, 12);

    const save = saves.find(s => s.student_id === portfolio.user_id) ?? null;
    const trustLevels = filtered.map(e => e.trust_level as TrustLevel);
    const highest = trustLevels.length
      ? (Math.max(...trustLevels) as TrustLevel)
      : 1 as TrustLevel;

    return {
      user_id: portfolio.user_id,
      portfolio: portfolio as PortfolioProfile,
      top_experiences: filtered.slice(0, 3),
      top_skills: uniqueSkills,
      verified_count: filtered.length,
      highest_trust_level: highest,
      save,
    } satisfies TalentProfile;
  });
}

// ── Employer CRM ──────────────────────────────────────────────

export async function saveTalent(studentId: string): Promise<EmployerTalentSave> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('employer_talent_saves')
    .upsert(
      { employer_id: user.id, student_id: studentId, pipeline_status: 'saved' },
      { onConflict: 'employer_id,student_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data as EmployerTalentSave;
}

export async function updateTalentPipelineStatus(
  studentId: string,
  status: PipelineStatus,
  notes?: string
): Promise<EmployerTalentSave> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('employer_talent_saves')
    .update({ pipeline_status: status, notes: notes ?? null, updated_at: new Date().toISOString() })
    .eq('employer_id', user.id)
    .eq('student_id', studentId)
    .select()
    .single();

  if (error) throw error;
  return data as EmployerTalentSave;
}

export async function getSavedTalent(): Promise<EmployerTalentSave[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('employer_talent_saves')
    .select('*')
    .eq('employer_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as EmployerTalentSave[];
}
