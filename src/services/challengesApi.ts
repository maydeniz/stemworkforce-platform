// ===========================================
// CHALLENGES API SERVICE
// Handles all challenge-related database operations
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  Challenge,
  ChallengeSponsor,
  ChallengePhase,
  ChallengeResource,
  ChallengeSolver,
  ChallengeTeam,
  ChallengeTeamMember,
  ChallengeSubmission,
  ChallengeJudge,
  ChallengeComment,
  ChallengeFilters,
  ChallengesQueryResult,
  ChallengeFormData,
  IndustryType,
} from '@/types';

// ===========================================
// DATABASE ROW TYPES
// ===========================================

interface DBChallenge {
  id: string;
  sponsor_id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  problem_statement: string;
  type: string;
  registration_deadline: string;
  submission_deadline: string;
  judging_start: string;
  judging_end: string;
  winners_announced_date: string;
  current_phase: number;
  eligibility: Record<string, unknown>;
  requirements: Record<string, unknown>;
  judging_criteria: Record<string, unknown>[];
  solver_types: string[];
  team_size_min: number;
  team_size_max: number;
  max_submissions_per_solver: number;
  industries: string[];
  skills: string[];
  tags: string[];
  total_prize_pool: number;
  non_monetary_benefits: string[];
  status: string;
  submissions_count: number;
  registered_solvers_count: number;
  teams_count: number;
  views_count: number;
  visibility: string;
  discussion_enabled: boolean;
  team_formation_enabled: boolean;
  slack_channel_id: string | null;
  slack_channel_url: string | null;
  banner_image: string | null;
  thumbnail_image: string | null;
  featured_rank: number | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Joined data
  sponsor?: DBChallengeSponsor;
}

interface DBChallengeSponsor {
  id: string;
  user_id: string | null;
  name: string;
  slug: string;
  logo: string | null;
  type: string;
  website: string | null;
  description: string | null;
  contact_email: string | null;
  verified: boolean;
  active: boolean;
}

interface DBChallengePhase {
  id: string;
  challenge_id: string;
  phase_number: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  prize_amount: number | null;
  winners_count: number | null;
  status: string;
  requirements: string[] | null;
  deliverables: string[] | null;
}

interface DBChallengeAward {
  id: string;
  challenge_id: string;
  rank: number;
  title: string;
  prize_amount: number;
  additional_benefits: string[] | null;
  winners_count: number;
}

interface DBChallengeResource {
  id: string;
  challenge_id: string;
  name: string;
  description: string | null;
  type: string;
  url: string | null;
  access_instructions: string | null;
  restricted: boolean;
}

// DBChallengeSolver removed - unused

interface DBChallengeTeam {
  id: string;
  challenge_id: string;
  name: string;
  description: string | null;
  leader_id: string;
  max_members: number;
  is_recruiting: boolean;
  skills_needed: string[] | null;
  slack_channel_id: string | null;
  status: string;
  created_at: string;
}

// ===========================================
// TRANSFORM FUNCTIONS
// ===========================================

function transformSponsor(db: DBChallengeSponsor): ChallengeSponsor {
  return {
    id: db.id,
    name: db.name,
    logo: db.logo || undefined,
    type: db.type as ChallengeSponsor['type'],
    website: db.website || undefined,
    description: db.description || undefined,
    contactEmail: db.contact_email || undefined,
    verified: db.verified,
  };
}

function transformChallenge(db: DBChallenge, phases?: DBChallengePhase[], awards?: DBChallengeAward[], resources?: DBChallengeResource[]): Challenge {
  const requirements = db.requirements as {
    deliverables?: Array<{id: string; name: string; description: string; type: string; required: boolean; maxFileSize?: number; allowedFormats?: string[]}>;
    documentationRequired?: boolean;
    videoRequired?: boolean;
    videoDurationMax?: number;
    pitchRequired?: boolean;
    pitchDurationMax?: number;
    openSourceRequired?: boolean;
    repositoryRequired?: boolean;
    techStack?: string[];
    platformRequirements?: string[];
  };

  const eligibility = db.eligibility as {
    countries?: string[];
    excludedCountries?: string[];
    minAge?: number;
    studentOnly?: boolean;
    clearanceRequired?: string;
    experienceLevel?: string;
    employeeRestrictions?: string[];
    affiliationRequired?: string[];
    requiredSkills?: string[];
    requiredCertifications?: string[];
    mustAcceptTerms: boolean;
    ipAssignment: string;
    ndaRequired: boolean;
    customRequirements?: string[];
  };

  return {
    id: db.id,
    title: db.title,
    slug: db.slug,
    description: db.description,
    shortDescription: db.short_description,
    problemStatement: db.problem_statement,
    type: db.type as Challenge['type'],
    sponsor: db.sponsor ? transformSponsor(db.sponsor) : {
      id: db.sponsor_id,
      name: 'Unknown Sponsor',
      type: 'company',
      verified: false,
    },
    phases: phases?.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      startDate: p.start_date,
      endDate: p.end_date,
      prizeAmount: p.prize_amount || undefined,
      winnersCount: p.winners_count || undefined,
      status: p.status as ChallengePhase['status'],
      requirements: p.requirements || undefined,
      deliverables: p.deliverables || undefined,
    })) || [],
    currentPhase: db.current_phase,
    registrationDeadline: db.registration_deadline,
    submissionDeadline: db.submission_deadline,
    judgingPeriod: {
      start: db.judging_start,
      end: db.judging_end,
    },
    winnersAnnouncedDate: db.winners_announced_date,
    eligibility: {
      countries: eligibility.countries,
      excludedCountries: eligibility.excludedCountries,
      minAge: eligibility.minAge,
      studentOnly: eligibility.studentOnly,
      clearanceRequired: eligibility.clearanceRequired as Challenge['eligibility']['clearanceRequired'],
      experienceLevel: eligibility.experienceLevel as Challenge['eligibility']['experienceLevel'],
      employeeRestrictions: eligibility.employeeRestrictions,
      affiliationRequired: eligibility.affiliationRequired,
      requiredSkills: eligibility.requiredSkills,
      requiredCertifications: eligibility.requiredCertifications,
      mustAcceptTerms: eligibility.mustAcceptTerms ?? true,
      ipAssignment: (eligibility.ipAssignment || 'shared') as Challenge['eligibility']['ipAssignment'],
      ndaRequired: eligibility.ndaRequired ?? false,
      customRequirements: eligibility.customRequirements,
    },
    requirements: {
      deliverables: (requirements.deliverables || []).map(d => ({
        id: d.id,
        name: d.name,
        description: d.description,
        type: d.type as Challenge['requirements']['deliverables'][0]['type'],
        required: d.required,
        maxFileSize: d.maxFileSize,
        allowedFormats: d.allowedFormats,
      })),
      techStack: requirements.techStack,
      platformRequirements: requirements.platformRequirements,
      documentationRequired: requirements.documentationRequired ?? true,
      videoRequired: requirements.videoRequired ?? false,
      videoDurationMax: requirements.videoDurationMax,
      pitchRequired: requirements.pitchRequired ?? false,
      pitchDurationMax: requirements.pitchDurationMax,
      openSourceRequired: requirements.openSourceRequired ?? false,
      repositoryRequired: requirements.repositoryRequired ?? false,
    },
    resources: resources?.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || '',
      type: r.type as ChallengeResource['type'],
      url: r.url || undefined,
      accessInstructions: r.access_instructions || undefined,
      restricted: r.restricted,
    })) || [],
    judgingCriteria: db.judging_criteria.map((c: Record<string, unknown>) => ({
      id: c.id as string,
      name: c.name as string,
      description: c.description as string,
      weight: c.weight as number,
      maxScore: c.maxScore as number,
      rubric: c.rubric as Challenge['judgingCriteria'][0]['rubric'],
    })),
    awards: awards?.map(a => ({
      id: a.id,
      rank: a.rank,
      title: a.title,
      prizeAmount: a.prize_amount,
      additionalBenefits: a.additional_benefits || undefined,
      winnersCount: a.winners_count,
    })) || [],
    totalPrizePool: db.total_prize_pool,
    nonMonetaryBenefits: db.non_monetary_benefits || [],
    solverTypes: db.solver_types as Challenge['solverTypes'],
    teamSizeRange: {
      min: db.team_size_min,
      max: db.team_size_max,
    },
    maxSubmissionsPerSolver: db.max_submissions_per_solver,
    industries: db.industries as IndustryType[],
    skills: db.skills || [],
    tags: db.tags || [],
    status: db.status as Challenge['status'],
    submissionsCount: db.submissions_count,
    registeredSolversCount: db.registered_solvers_count,
    teamsCount: db.teams_count,
    viewsCount: db.views_count,
    visibility: db.visibility as Challenge['visibility'],
    discussionEnabled: db.discussion_enabled,
    teamFormationEnabled: db.team_formation_enabled,
    slackChannelId: db.slack_channel_id || undefined,
    slackChannelUrl: db.slack_channel_url || undefined,
    bannerImage: db.banner_image || undefined,
    thumbnailImage: db.thumbnail_image || undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    publishedAt: db.published_at || undefined,
    featuredRank: db.featured_rank || undefined,
  };
}

// ===========================================
// CHALLENGES SERVICE
// ===========================================

export const challengesService = {
  // ===========================================
  // CHALLENGES
  // ===========================================
  challenges: {
    // List challenges with filters
    async list(filters: ChallengeFilters = {}): Promise<ChallengesQueryResult> {
      const {
        search,
        types,
        industries,
        solverTypes,
        status,
        prizeMin,
        prizeMax,
        deadlineFrom,
        deadlineTo,
        skills,
        page = 1,
        pageSize = 12,
        sortBy = 'created',
        sortOrder = 'desc',
      } = filters;

      let query = supabase
        .from('challenges')
        .select(`
          *,
          sponsor:challenge_sponsors!sponsor_id(*)
        `, { count: 'exact' })
        .in('status', ['registration-open', 'active', 'submission-closed', 'judging', 'winners-announced', 'completed'])
        .eq('visibility', 'public');

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
      }
      if (types && types.length > 0) {
        query = query.in('type', types);
      }
      if (industries && industries.length > 0) {
        query = query.overlaps('industries', industries);
      }
      if (solverTypes && solverTypes.length > 0) {
        query = query.overlaps('solver_types', solverTypes);
      }
      if (status && status.length > 0) {
        query = query.in('status', status);
      }
      if (prizeMin !== undefined) {
        query = query.gte('total_prize_pool', prizeMin);
      }
      if (prizeMax !== undefined) {
        query = query.lte('total_prize_pool', prizeMax);
      }
      if (deadlineFrom) {
        query = query.gte('submission_deadline', deadlineFrom);
      }
      if (deadlineTo) {
        query = query.lte('submission_deadline', deadlineTo);
      }
      if (skills && skills.length > 0) {
        query = query.overlaps('skills', skills);
      }

      // Sorting
      const sortColumn = sortBy === 'deadline' ? 'submission_deadline' :
                         sortBy === 'prize' ? 'total_prize_pool' :
                         sortBy === 'popularity' ? 'views_count' : 'created_at';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching challenges:', error);
        return { challenges: [], total: 0, page, pageSize, hasMore: false };
      }

      const challenges = (data || []).map(db => transformChallenge(db as DBChallenge));

      return {
        challenges,
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > page * pageSize,
      };
    },

    // Get featured challenges
    async getFeatured(limit = 3): Promise<Challenge[]> {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          sponsor:challenge_sponsors!sponsor_id(*)
        `)
        .in('status', ['registration-open', 'active'])
        .eq('visibility', 'public')
        .not('featured_rank', 'is', null)
        .order('featured_rank', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured challenges:', error);
        return [];
      }

      return (data || []).map(db => transformChallenge(db as DBChallenge));
    },

    // Get single challenge by ID or slug
    async get(idOrSlug: string): Promise<Challenge | null> {
      const { data: challenge, error } = await supabase
        .from('challenges')
        .select(`
          *,
          sponsor:challenge_sponsors!sponsor_id(*)
        `)
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .single();

      if (error || !challenge) {
        console.error('Error fetching challenge:', error);
        return null;
      }

      // Fetch related data
      const [phasesResult, awardsResult, resourcesResult] = await Promise.all([
        supabase.from('challenge_phases').select('*').eq('challenge_id', challenge.id).order('phase_number'),
        supabase.from('challenge_awards').select('*').eq('challenge_id', challenge.id).order('rank'),
        supabase.from('challenge_resources').select('*').eq('challenge_id', challenge.id),
      ]);

      // Increment view count
      await supabase.rpc('increment_challenge_views', { challenge_uuid: challenge.id });

      return transformChallenge(
        challenge as DBChallenge,
        phasesResult.data as DBChallengePhase[],
        awardsResult.data as DBChallengeAward[],
        resourcesResult.data as DBChallengeResource[]
      );
    },

    // Create new challenge
    async create(formData: ChallengeFormData, sponsorId: string): Promise<Challenge | null> {
      // Generate slug
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { data: challenge, error } = await supabase
        .from('challenges')
        .insert({
          sponsor_id: sponsorId,
          title: formData.title,
          slug,
          short_description: formData.shortDescription,
          description: formData.description,
          problem_statement: formData.problemStatement,
          type: formData.type,
          registration_deadline: formData.registrationDeadline,
          submission_deadline: formData.submissionDeadline,
          judging_start: formData.judgingStart,
          judging_end: formData.judgingEnd,
          winners_announced_date: formData.winnersAnnouncedDate,
          eligibility: formData.eligibility,
          requirements: {
            deliverables: formData.deliverables,
            documentationRequired: formData.documentationRequired,
            videoRequired: formData.videoRequired,
            videoDurationMax: formData.videoDurationMax,
            repositoryRequired: formData.repositoryRequired,
            openSourceRequired: formData.openSourceRequired,
            techStack: formData.techStack,
          },
          judging_criteria: formData.judgingCriteria,
          solver_types: formData.solverTypes,
          team_size_min: formData.teamSizeMin,
          team_size_max: formData.teamSizeMax,
          max_submissions_per_solver: formData.maxSubmissionsPerSolver,
          industries: formData.industries,
          skills: formData.skills,
          tags: formData.tags,
          total_prize_pool: formData.awards.reduce((sum, a) => sum + a.prizeAmount * a.winnersCount, 0),
          non_monetary_benefits: formData.nonMonetaryBenefits,
          visibility: formData.visibility,
          discussion_enabled: formData.discussionEnabled,
          team_formation_enabled: formData.teamFormationEnabled,
          banner_image: formData.bannerImage,
          thumbnail_image: formData.thumbnailImage,
          status: 'draft',
        })
        .select()
        .single();

      if (error || !challenge) {
        console.error('Error creating challenge:', error);
        return null;
      }

      // Insert phases
      if (formData.phases.length > 0) {
        await supabase.from('challenge_phases').insert(
          formData.phases.map((p, i) => ({
            challenge_id: challenge.id,
            phase_number: i + 1,
            name: p.name,
            description: p.description,
            start_date: p.startDate,
            end_date: p.endDate,
            prize_amount: p.prizeAmount,
            winners_count: p.winnersCount,
            status: 'upcoming',
          }))
        );
      }

      // Insert awards
      if (formData.awards.length > 0) {
        await supabase.from('challenge_awards').insert(
          formData.awards.map(a => ({
            challenge_id: challenge.id,
            rank: a.rank,
            title: a.title,
            prize_amount: a.prizeAmount,
            additional_benefits: a.additionalBenefits,
            winners_count: a.winnersCount,
          }))
        );
      }

      // Insert resources
      if (formData.resources.length > 0) {
        await supabase.from('challenge_resources').insert(
          formData.resources.map(r => ({
            challenge_id: challenge.id,
            name: r.name,
            description: r.description,
            type: r.type,
            url: r.url,
            access_instructions: r.accessInstructions,
            restricted: r.restricted,
          }))
        );
      }

      return this.get(challenge.id);
    },

    // Update challenge status
    async updateStatus(challengeId: string, status: Challenge['status']): Promise<boolean> {
      const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (status === 'registration-open') {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('challenges')
        .update(updates)
        .eq('id', challengeId);

      return !error;
    },
  },

  // ===========================================
  // SOLVERS
  // ===========================================
  solvers: {
    // Register as solver
    async register(challengeId: string, skills?: string[]): Promise<ChallengeSolver | null> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('challenge_solvers')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          type: 'individual',
          agreed_to_terms: true,
          skills,
        })
        .select()
        .single();

      if (error) {
        console.error('Error registering solver:', error);
        return null;
      }

      return {
        id: data.id,
        challengeId: data.challenge_id,
        userId: data.user_id,
        type: data.type as 'individual' | 'team-member',
        teamId: data.team_id || undefined,
        registeredAt: data.registered_at,
        eligibilityVerified: data.eligibility_verified,
        agreedToTerms: data.agreed_to_terms,
        status: data.status as ChallengeSolver['status'],
        skills: data.skills || undefined,
      };
    },

    // Get current user's registration for a challenge
    async getRegistration(challengeId: string): Promise<ChallengeSolver | null> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('challenge_solvers')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        challengeId: data.challenge_id,
        userId: data.user_id,
        type: data.type as 'individual' | 'team-member',
        teamId: data.team_id || undefined,
        registeredAt: data.registered_at,
        eligibilityVerified: data.eligibility_verified,
        agreedToTerms: data.agreed_to_terms,
        status: data.status as ChallengeSolver['status'],
        skills: data.skills || undefined,
      };
    },

    // Withdraw from challenge
    async withdraw(challengeId: string): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('challenge_solvers')
        .update({ status: 'withdrawn' })
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id);

      return !error;
    },

    // Get all challenges the user is registered for
    async getMyRegistrations(): Promise<Challenge[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get all registrations for the user
      const { data: registrations, error: regError } = await supabase
        .from('challenge_solvers')
        .select('challenge_id')
        .eq('user_id', user.id)
        .neq('status', 'withdrawn');

      if (regError || !registrations?.length) return [];

      const challengeIds = registrations.map(r => r.challenge_id);

      // Fetch the challenges
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          sponsor:organizations!challenges_sponsor_id_fkey(id, name, type, verified),
          phases:challenge_phases(*),
          resources:challenge_resources(*),
          awards:challenge_awards(*)
        `)
        .in('id', challengeIds)
        .order('submission_deadline', { ascending: true });

      if (error) {
        console.error('Error fetching registered challenges:', error);
        return [];
      }

      return (data || []).map(transformDBChallenge);
    },
  },

  // ===========================================
  // TEAMS
  // ===========================================
  teams: {
    // Create team
    async create(challengeId: string, name: string, description?: string, skillsNeeded?: string[]): Promise<ChallengeTeam | null> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('challenge_teams')
        .insert({
          challenge_id: challengeId,
          name,
          description,
          leader_id: user.id,
          skills_needed: skillsNeeded,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating team:', error);
        return null;
      }

      // Add leader as team member
      await supabase.from('challenge_team_members').insert({
        team_id: data.id,
        user_id: user.id,
        role: 'leader',
        status: 'accepted',
      });

      // Update solver to be team-member
      await supabase
        .from('challenge_solvers')
        .update({ type: 'team-member', team_id: data.id })
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id);

      return {
        id: data.id,
        challengeId: data.challenge_id,
        name: data.name,
        description: data.description || undefined,
        leaderId: data.leader_id,
        members: [],
        maxMembers: data.max_members,
        isRecruiting: data.is_recruiting,
        skillsNeeded: data.skills_needed || undefined,
        createdAt: data.created_at,
        status: data.status as ChallengeTeam['status'],
      };
    },

    // List recruiting teams for a challenge
    async listRecruiting(challengeId: string): Promise<ChallengeTeam[]> {
      const { data, error } = await supabase
        .from('challenge_teams')
        .select(`
          *,
          members:challenge_team_members(*)
        `)
        .eq('challenge_id', challengeId)
        .eq('is_recruiting', true)
        .eq('status', 'forming');

      if (error) {
        console.error('Error fetching teams:', error);
        return [];
      }

      return (data || []).map((t: DBChallengeTeam & { members: unknown[] }) => ({
        id: t.id,
        challengeId: t.challenge_id,
        name: t.name,
        description: t.description || undefined,
        leaderId: t.leader_id,
        members: (t.members || []) as ChallengeTeamMember[],
        maxMembers: t.max_members,
        isRecruiting: t.is_recruiting,
        skillsNeeded: t.skills_needed || undefined,
        createdAt: t.created_at,
        status: t.status as ChallengeTeam['status'],
      }));
    },

    // Request to join team
    async requestJoin(teamId: string, skills?: string[]): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('challenge_team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          role: 'member',
          skills,
          status: 'pending',
        });

      return !error;
    },

    // Accept/decline join request
    async respondToRequest(teamId: string, userId: string, accept: boolean): Promise<boolean> {
      const { error } = await supabase
        .from('challenge_team_members')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (!error && accept) {
        // Get team's challenge_id
        const { data: team } = await supabase
          .from('challenge_teams')
          .select('challenge_id')
          .eq('id', teamId)
          .single();

        if (team) {
          // Update solver to be team-member
          await supabase
            .from('challenge_solvers')
            .update({ type: 'team-member', team_id: teamId })
            .eq('challenge_id', team.challenge_id)
            .eq('user_id', userId);
        }
      }

      return !error;
    },

    // Get all teams the user is a member of
    async getMyTeams(): Promise<ChallengeTeam[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get teams where user is a member
      const { data: membershipData, error: membershipError } = await supabase
        .from('challenge_team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (membershipError || !membershipData?.length) return [];

      const teamIds = membershipData.map(m => m.team_id);

      const { data, error } = await supabase
        .from('challenge_teams')
        .select(`
          *,
          members:challenge_team_members(*)
        `)
        .in('id', teamIds);

      if (error) {
        console.error('Error fetching my teams:', error);
        return [];
      }

      return (data || []).map((t: DBChallengeTeam & { members: unknown[] }) => ({
        id: t.id,
        challengeId: t.challenge_id,
        name: t.name,
        description: t.description || undefined,
        leaderId: t.leader_id,
        members: (t.members || []) as ChallengeTeamMember[],
        maxMembers: t.max_members,
        isRecruiting: t.is_recruiting,
        skillsNeeded: t.skills_needed || undefined,
        createdAt: t.created_at,
        status: t.status as ChallengeTeam['status'],
      }));
    },
  },

  // ===========================================
  // SUBMISSIONS
  // ===========================================
  submissions: {
    // Create submission
    async create(challengeId: string, submission: Partial<ChallengeSubmission>): Promise<ChallengeSubmission | null> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get solver registration
      const solver = await challengesService.solvers.getRegistration(challengeId);
      if (!solver) return null;

      const { data, error } = await supabase
        .from('challenge_submissions')
        .insert({
          challenge_id: challengeId,
          solver_id: solver.teamId || user.id,
          solver_type: solver.teamId ? 'team' : 'individual',
          title: submission.title,
          summary: submission.summary,
          description: submission.description,
          deliverables: submission.deliverables || [],
          repository_url: submission.repositoryUrl,
          demo_url: submission.demoUrl,
          video_url: submission.videoUrl,
          status: 'draft',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating submission:', error);
        return null;
      }

      return {
        id: data.id,
        challengeId: data.challenge_id,
        phaseId: data.phase_id || undefined,
        solverId: data.solver_id,
        solverType: data.solver_type as 'individual' | 'team',
        title: data.title,
        summary: data.summary,
        description: data.description,
        deliverables: data.deliverables || [],
        repositoryUrl: data.repository_url || undefined,
        demoUrl: data.demo_url || undefined,
        videoUrl: data.video_url || undefined,
        submittedAt: data.submitted_at,
        updatedAt: data.updated_at,
        version: data.version,
        status: data.status as ChallengeSubmission['status'],
      };
    },

    // Submit (change status from draft to submitted)
    async submit(submissionId: string): Promise<boolean> {
      const { error } = await supabase
        .from('challenge_submissions')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      return !error;
    },

    // Get user's submission for a challenge
    async getMySubmission(challengeId: string): Promise<ChallengeSubmission | null> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('challenge_submissions')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('solver_id', user.id)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        challengeId: data.challenge_id,
        phaseId: data.phase_id || undefined,
        solverId: data.solver_id,
        solverType: data.solver_type as 'individual' | 'team',
        title: data.title,
        summary: data.summary,
        description: data.description,
        deliverables: data.deliverables || [],
        repositoryUrl: data.repository_url || undefined,
        demoUrl: data.demo_url || undefined,
        videoUrl: data.video_url || undefined,
        aiEvaluation: data.ai_evaluation || undefined,
        submittedAt: data.submitted_at,
        updatedAt: data.updated_at,
        version: data.version,
        status: data.status as ChallengeSubmission['status'],
        finalScore: data.final_score || undefined,
        rank: data.rank || undefined,
        feedback: data.feedback || undefined,
      };
    },
  },

  // ===========================================
  // COMMENTS & DISCUSSIONS
  // ===========================================
  comments: {
    // Get comments for a challenge
    async list(challengeId: string): Promise<ChallengeComment[]> {
      const { data, error } = await supabase
        .from('challenge_comments')
        .select('*')
        .eq('challenge_id', challengeId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      return (data || []).map(c => ({
        id: c.id,
        challengeId: c.challenge_id,
        userId: c.user_id,
        parentId: c.parent_id || undefined,
        content: c.content,
        isPinned: c.is_pinned,
        isAnnouncement: c.is_announcement,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));
    },

    // Add comment
    async add(challengeId: string, content: string, parentId?: string): Promise<ChallengeComment | null> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('challenge_comments')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          content,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        return null;
      }

      return {
        id: data.id,
        challengeId: data.challenge_id,
        userId: data.user_id,
        parentId: data.parent_id || undefined,
        content: data.content,
        isPinned: data.is_pinned,
        isAnnouncement: data.is_announcement,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },
  },

  // ===========================================
  // SAVES/BOOKMARKS
  // ===========================================
  saves: {
    async save(challengeId: string): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('challenge_saves')
        .insert({ challenge_id: challengeId, user_id: user.id });

      return !error;
    },

    async unsave(challengeId: string): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('challenge_saves')
        .delete()
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id);

      return !error;
    },

    async isSaved(challengeId: string): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('challenge_saves')
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id)
        .single();

      return !!data;
    },

    async getSaved(): Promise<Challenge[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('challenge_saves')
        .select(`
          challenge:challenges(
            *,
            sponsor:challenge_sponsors!sponsor_id(*)
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching saved challenges:', error);
        return [];
      }

      return (data || [])
        .filter(d => d.challenge)
        .map(d => transformChallenge(d.challenge as unknown as DBChallenge));
    },
  },

  // ===========================================
  // JUDGES & EVALUATIONS
  // ===========================================
  judges: {
    // Get judge assignments for current user
    async getMyAssignments(): Promise<ChallengeJudge[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('challenge_judges')
        .select(`
          *,
          challenge:challenges(id, title, slug, submission_deadline, status)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching judge assignments:', error);
        return [];
      }

      return (data || []).map(j => ({
        id: j.id,
        challengeId: j.challenge_id,
        userId: j.user_id,
        role: j.role as ChallengeJudge['role'],
        expertise: j.expertise || [],
        assignedSubmissions: j.assigned_submissions || undefined,
        status: j.status as ChallengeJudge['status'],
        conflictsOfInterest: j.conflicts_of_interest || undefined,
      }));
    },

    // Invite a judge to a challenge
    async invite(challengeId: string, email: string, role: string = 'judge'): Promise<boolean> {
      const { error } = await supabase
        .from('challenge_judge_invitations')
        .insert({
          challenge_id: challengeId,
          email,
          role,
          status: 'pending',
        });

      return !error;
    },

    // Accept judge invitation
    async acceptInvitation(invitationId: string): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Get invitation
      const { data: invitation } = await supabase
        .from('challenge_judge_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (!invitation) return false;

      // Create judge record
      const { error: createError } = await supabase
        .from('challenge_judges')
        .insert({
          challenge_id: invitation.challenge_id,
          user_id: user.id,
          role: invitation.role,
          status: 'active',
          accepted_at: new Date().toISOString(),
        });

      if (createError) return false;

      // Update invitation status
      await supabase
        .from('challenge_judge_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      return true;
    },

    // Get submissions assigned to judge
    async getAssignedSubmissions(challengeId: string): Promise<ChallengeSubmission[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('challenge_judge_assignments')
        .select(`
          submission:challenge_submissions(*)
        `)
        .eq('judge_id', user.id)
        .eq('challenge_id', challengeId);

      if (error) {
        console.error('Error fetching assigned submissions:', error);
        return [];
      }

      return (data || [])
        .filter(d => d.submission)
        .map(d => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sub = d.submission as any;
          return {
            id: sub.id,
            challengeId: sub.challenge_id,
            phaseId: sub.phase_id || undefined,
            solverId: sub.solver_id,
            solverType: sub.solver_type as 'individual' | 'team',
            title: sub.title,
            summary: sub.summary,
            description: sub.description,
            deliverables: sub.deliverables || [],
            repositoryUrl: sub.repository_url || undefined,
            demoUrl: sub.demo_url || undefined,
            videoUrl: sub.video_url || undefined,
            submittedAt: sub.submitted_at,
            updatedAt: sub.updated_at,
            version: sub.version,
            status: sub.status as ChallengeSubmission['status'],
          };
        });
    },
  },

  evaluations: {
    // Submit evaluation for a submission
    async submit(
      submissionId: string,
      evaluation: {
        scores: Record<string, number>;
        feedback: string;
        recommendation: 'strong-yes' | 'yes' | 'maybe' | 'no';
        exceedsExpectations: boolean;
        conflictOfInterest: boolean;
        timeSpentMinutes: number;
      },
      status: 'draft' | 'final' = 'final'
    ): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check for existing evaluation
      const { data: existing } = await supabase
        .from('challenge_evaluations')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('judge_id', user.id)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('challenge_evaluations')
          .update({
            scores: evaluation.scores,
            feedback: evaluation.feedback,
            recommendation: evaluation.recommendation,
            exceeds_expectations: evaluation.exceedsExpectations,
            conflict_of_interest: evaluation.conflictOfInterest,
            time_spent_minutes: evaluation.timeSpentMinutes,
            status,
            submitted_at: status === 'final' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        return !error;
      } else {
        // Create new
        const { error } = await supabase
          .from('challenge_evaluations')
          .insert({
            submission_id: submissionId,
            judge_id: user.id,
            scores: evaluation.scores,
            feedback: evaluation.feedback,
            recommendation: evaluation.recommendation,
            exceeds_expectations: evaluation.exceedsExpectations,
            conflict_of_interest: evaluation.conflictOfInterest,
            time_spent_minutes: evaluation.timeSpentMinutes,
            status,
            submitted_at: status === 'final' ? new Date().toISOString() : null,
          });

        return !error;
      }
    },

    // Get evaluation by judge for a submission
    async get(submissionId: string): Promise<unknown | null> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('challenge_evaluations')
        .select('*')
        .eq('submission_id', submissionId)
        .eq('judge_id', user.id)
        .single();

      if (error || !data) return null;
      return data;
    },

    // Skip submission with reason
    async skip(submissionId: string, reason: string): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('challenge_evaluations')
        .insert({
          submission_id: submissionId,
          judge_id: user.id,
          status: 'skipped',
          skip_reason: reason,
        });

      return !error;
    },
  },

  // ===========================================
  // SPONSOR MANAGEMENT
  // ===========================================
  sponsor: {
    // Get challenges by sponsor
    async getChallenges(sponsorId: string): Promise<Challenge[]> {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          sponsor:challenge_sponsors!sponsor_id(*)
        `)
        .eq('sponsor_id', sponsorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sponsor challenges:', error);
        return [];
      }

      return (data || []).map(db => transformChallenge(db as DBChallenge));
    },

    // Get all submissions for a challenge (sponsor view)
    async getSubmissions(challengeId: string): Promise<ChallengeSubmission[]> {
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select(`
          *,
          evaluations:challenge_evaluations(*)
        `)
        .eq('challenge_id', challengeId)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        return [];
      }

      return (data || []).map(s => ({
        id: s.id,
        challengeId: s.challenge_id,
        phaseId: s.phase_id || undefined,
        solverId: s.solver_id,
        solverType: s.solver_type as 'individual' | 'team',
        title: s.title,
        summary: s.summary,
        description: s.description,
        deliverables: s.deliverables || [],
        repositoryUrl: s.repository_url || undefined,
        demoUrl: s.demo_url || undefined,
        videoUrl: s.video_url || undefined,
        submittedAt: s.submitted_at,
        updatedAt: s.updated_at,
        version: s.version,
        status: s.status as ChallengeSubmission['status'],
        finalScore: s.final_score,
        rank: s.rank,
        feedback: s.feedback,
      }));
    },

    // Get all solvers for a challenge
    async getSolvers(challengeId: string): Promise<ChallengeSolver[]> {
      const { data, error } = await supabase
        .from('challenge_solvers')
        .select(`
          *,
          user:users(id, email, full_name, avatar_url)
        `)
        .eq('challenge_id', challengeId)
        .order('registered_at', { ascending: false });

      if (error) {
        console.error('Error fetching solvers:', error);
        return [];
      }

      return (data || []).map(s => ({
        id: s.id,
        challengeId: s.challenge_id,
        userId: s.user_id,
        type: s.type as 'individual' | 'team-member',
        teamId: s.team_id || undefined,
        registeredAt: s.registered_at,
        eligibilityVerified: s.eligibility_verified,
        agreedToTerms: s.agreed_to_terms,
        status: s.status as ChallengeSolver['status'],
        skills: s.skills || [],
      }));
    },

    // Update challenge
    async update(challengeId: string, updates: Partial<Challenge>): Promise<boolean> {
      const dbUpdates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title) dbUpdates.title = updates.title;
      if (updates.shortDescription) dbUpdates.short_description = updates.shortDescription;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.visibility) dbUpdates.visibility = updates.visibility;
      if (updates.submissionDeadline) dbUpdates.submission_deadline = updates.submissionDeadline;
      if (updates.registrationDeadline) dbUpdates.registration_deadline = updates.registrationDeadline;

      const { error } = await supabase
        .from('challenges')
        .update(dbUpdates)
        .eq('id', challengeId);

      return !error;
    },

    // Announce winners
    async announceWinners(challengeId: string, winners: Array<{ submissionId: string; rank: number; prizeAmount: number }>): Promise<boolean> {
      // Update submission ranks
      for (const winner of winners) {
        await supabase
          .from('challenge_submissions')
          .update({
            rank: winner.rank,
            final_score: winner.prizeAmount, // Or actual score
            status: 'winner',
          })
          .eq('id', winner.submissionId);
      }

      // Update challenge status
      const { error } = await supabase
        .from('challenges')
        .update({
          status: 'winners-announced',
          updated_at: new Date().toISOString(),
        })
        .eq('id', challengeId);

      return !error;
    },

    // Send announcement to all participants
    async sendAnnouncement(challengeId: string, title: string, content: string): Promise<boolean> {
      const { error } = await supabase
        .from('challenge_announcements')
        .insert({
          challenge_id: challengeId,
          title,
          content,
          visibility: 'all',
        });

      return !error;
    },
  },

  // ===========================================
  // LEADERBOARD
  // ===========================================
  leaderboard: {
    // Get public leaderboard for a challenge
    async getPublic(challengeId: string): Promise<Array<{
      rank: number;
      solverId: string;
      solverName: string;
      teamName?: string;
      isTeam: boolean;
      score: number;
      submissionCount: number;
      lastSubmission: string;
    }>> {
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select(`
          id,
          solver_id,
          solver_type,
          title,
          final_score,
          submitted_at,
          team:challenge_teams(name)
        `)
        .eq('challenge_id', challengeId)
        .eq('status', 'submitted')
        .not('final_score', 'is', null)
        .order('final_score', { ascending: false });

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      return (data || []).map((entry, index) => ({
        rank: index + 1,
        solverId: entry.solver_id,
        solverName: entry.title || `Solver ${index + 1}`,
        teamName: (entry.team as unknown as { name: string } | null)?.name,
        isTeam: entry.solver_type === 'team',
        score: entry.final_score || 0,
        submissionCount: 1,
        lastSubmission: entry.submitted_at,
      }));
    },
  },
};

// Helper function that may be referenced elsewhere
function transformDBChallenge(db: DBChallenge): Challenge {
  return transformChallenge(db);
}

// Named export for convenient importing
export const challengesApi = challengesService;

export default challengesService;
