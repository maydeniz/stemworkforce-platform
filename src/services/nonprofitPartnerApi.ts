// ===========================================
// Nonprofit Partner API Service
// CRUD operations for nonprofit partners
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  NonprofitPartner,
  Program,
  ProgramStatus,
  ProgramFilters,
  Participant,
  ParticipantStatus,
  ParticipantFilters,
  ParticipantMilestone,
  Grant,
  GrantStatus,
  GrantFilters,
  GrantReport,
  EmployerConnection,
  EmployerFilters,
  Coalition,
  CoalitionMembership,
  SuccessStory,
  ImpactMetrics,
  PartnerTier
} from '@/types/nonprofitPartner';

// ===========================================
// PARTNER PROFILE
// ===========================================

export async function getNonprofitPartner(userId: string): Promise<NonprofitPartner | null> {
  const { data, error } = await supabase
    .from('nonprofit_partners')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching nonprofit partner:', error);
    return null;
  }

  return transformPartnerFromDB(data);
}

export async function getNonprofitPartnerById(partnerId: string): Promise<NonprofitPartner | null> {
  const { data, error } = await supabase
    .from('nonprofit_partners')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error || !data) {
    console.error('Error fetching nonprofit partner by ID:', error);
    return null;
  }

  return transformPartnerFromDB(data);
}

export async function updateNonprofitPartner(
  partnerId: string,
  updates: Partial<NonprofitPartner>
): Promise<boolean> {
  const dbUpdates = transformPartnerToDB(updates);

  const { error } = await supabase
    .from('nonprofit_partners')
    .update(dbUpdates)
    .eq('id', partnerId);

  if (error) {
    console.error('Error updating nonprofit partner:', error);
    return false;
  }

  return true;
}

// ===========================================
// PROGRAMS
// ===========================================

export async function getPrograms(partnerId: string, filters?: ProgramFilters): Promise<Program[]> {
  let query = supabase
    .from('nonprofit_programs')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.programType) {
    query = query.eq('program_type', filters.programType);
  }
  if (filters?.searchQuery) {
    query = query.ilike('name', `%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return (data || []).map(transformProgramFromDB);
}

export async function createProgram(
  partnerId: string,
  program: Omit<Program, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<Program | null> {
  const dbData = {
    partner_id: partnerId,
    name: program.name,
    description: program.description,
    program_type: program.programType,
    target_population: program.targetPopulation,
    eligibility_criteria: program.eligibilityCriteria,
    duration: program.duration,
    format: program.format,
    location: program.location,
    capacity: program.capacity,
    enrolled_count: program.enrolledCount || 0,
    waitlist_count: program.waitlistCount || 0,
    start_date: program.startDate,
    end_date: program.endDate,
    application_deadline: program.applicationDeadline,
    is_rolling_admission: program.isRollingAdmission,
    funding_sources: program.fundingSources,
    status: program.status,
    featured: program.featured || false
  };

  const { data, error } = await supabase
    .from('nonprofit_programs')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating program:', error);
    return null;
  }

  return transformProgramFromDB(data);
}

export async function updateProgram(
  programId: string,
  updates: Partial<Program>
): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {};

  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.programType !== undefined) dbUpdates.program_type = updates.programType;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.capacity !== undefined) dbUpdates.capacity = updates.capacity;
  if (updates.enrolledCount !== undefined) dbUpdates.enrolled_count = updates.enrolledCount;
  if (updates.featured !== undefined) dbUpdates.featured = updates.featured;

  const { error } = await supabase
    .from('nonprofit_programs')
    .update(dbUpdates)
    .eq('id', programId);

  if (error) {
    console.error('Error updating program:', error);
    return false;
  }

  return true;
}

export async function deleteProgram(programId: string): Promise<boolean> {
  const { error } = await supabase
    .from('nonprofit_programs')
    .delete()
    .eq('id', programId);

  if (error) {
    console.error('Error deleting program:', error);
    return false;
  }

  return true;
}

// ===========================================
// PARTICIPANTS
// ===========================================

export async function getParticipants(partnerId: string, filters?: ParticipantFilters): Promise<Participant[]> {
  let query = supabase
    .from('nonprofit_participants')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.programId) {
    query = query.eq('program_id', filters.programId);
  }
  if (filters?.searchQuery) {
    query = query.or(`first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,email.ilike.%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching participants:', error);
    return [];
  }

  return (data || []).map(transformParticipantFromDB);
}

export async function createParticipant(
  partnerId: string,
  participant: Omit<Participant, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<Participant | null> {
  const dbData = {
    partner_id: partnerId,
    program_id: participant.programId,
    first_name: participant.firstName,
    last_name: participant.lastName,
    email: participant.email,
    phone: participant.phone,
    date_of_birth: participant.dateOfBirth,
    gender: participant.gender,
    ethnicity: participant.ethnicity,
    veteran_status: participant.veteranStatus,
    disability_status: participant.disabilityStatus,
    education_level: participant.educationLevel,
    prior_wage_hourly: participant.priorWageHourly,
    employment_status_at_intake: participant.employmentStatusAtIntake,
    barriers: participant.barriers,
    barrier_notes: participant.barrierNotes,
    status: participant.status || 'intake',
    intake_date: participant.intakeDate
  };

  const { data, error } = await supabase
    .from('nonprofit_participants')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating participant:', error);
    return null;
  }

  return transformParticipantFromDB(data);
}

export async function updateParticipantStatus(
  participantId: string,
  status: ParticipantStatus,
  additionalData?: Partial<Participant>
): Promise<boolean> {
  const updates: Record<string, unknown> = { status };

  if (status === 'enrolled' && !additionalData?.enrollmentDate) {
    updates.enrollment_date = new Date().toISOString().split('T')[0];
  }
  if (status === 'completed' && !additionalData?.completionDate) {
    updates.completion_date = new Date().toISOString().split('T')[0];
  }
  if (status === 'placed') {
    if (additionalData?.placementDate) updates.placement_date = additionalData.placementDate;
    if (additionalData?.placedEmployerName) updates.placed_employer_name = additionalData.placedEmployerName;
    if (additionalData?.placedJobTitle) updates.placed_job_title = additionalData.placedJobTitle;
    if (additionalData?.placedWageHourly) updates.placed_wage_hourly = additionalData.placedWageHourly;
  }

  const { error } = await supabase
    .from('nonprofit_participants')
    .update(updates)
    .eq('id', participantId);

  if (error) {
    console.error('Error updating participant status:', error);
    return false;
  }

  return true;
}

export async function addParticipantMilestone(
  participantId: string,
  milestone: Omit<ParticipantMilestone, 'id' | 'participantId' | 'createdAt'>
): Promise<ParticipantMilestone | null> {
  const dbData = {
    participant_id: participantId,
    milestone_type: milestone.milestoneType,
    title: milestone.title,
    description: milestone.description,
    achieved_date: milestone.achievedDate
  };

  const { data, error } = await supabase
    .from('participant_milestones')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error adding milestone:', error);
    return null;
  }

  return {
    id: data.id,
    participantId: data.participant_id,
    milestoneType: data.milestone_type,
    title: data.title,
    description: data.description,
    achievedDate: data.achieved_date,
    createdAt: data.created_at
  };
}

// ===========================================
// GRANTS
// ===========================================

export async function getGrants(partnerId: string, filters?: GrantFilters): Promise<Grant[]> {
  let query = supabase
    .from('nonprofit_grants')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.funderType) {
    query = query.eq('funder_type', filters.funderType);
  }
  if (filters?.searchQuery) {
    query = query.or(`name.ilike.%${filters.searchQuery}%,funder_name.ilike.%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching grants:', error);
    return [];
  }

  return (data || []).map(transformGrantFromDB);
}

export async function createGrant(
  partnerId: string,
  grant: Omit<Grant, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<Grant | null> {
  const dbData = {
    partner_id: partnerId,
    name: grant.name,
    funder_name: grant.funderName,
    funder_type: grant.funderType,
    grant_number: grant.grantNumber,
    award_amount: grant.awardAmount,
    application_date: grant.applicationDate,
    award_date: grant.awardDate,
    start_date: grant.startDate,
    end_date: grant.endDate,
    reporting_deadlines: grant.reportingDeadlines,
    target_enrollment: grant.targetEnrollment,
    target_placements: grant.targetPlacements,
    target_wage_goal: grant.targetWageGoal,
    target_retention_rate: grant.targetRetentionRate,
    status: grant.status,
    program_ids: grant.programIds,
    notes: grant.notes
  };

  const { data, error } = await supabase
    .from('nonprofit_grants')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating grant:', error);
    return null;
  }

  return transformGrantFromDB(data);
}

export async function updateGrant(grantId: string, updates: Partial<Grant>): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {};

  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.actualEnrollment !== undefined) dbUpdates.actual_enrollment = updates.actualEnrollment;
  if (updates.actualPlacements !== undefined) dbUpdates.actual_placements = updates.actualPlacements;
  if (updates.actualAverageWage !== undefined) dbUpdates.actual_average_wage = updates.actualAverageWage;
  if (updates.actualRetentionRate !== undefined) dbUpdates.actual_retention_rate = updates.actualRetentionRate;
  if (updates.disbursedAmount !== undefined) dbUpdates.disbursed_amount = updates.disbursedAmount;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { error } = await supabase
    .from('nonprofit_grants')
    .update(dbUpdates)
    .eq('id', grantId);

  if (error) {
    console.error('Error updating grant:', error);
    return false;
  }

  return true;
}

// ===========================================
// GRANT REPORTS
// ===========================================

export async function getGrantReports(grantId: string): Promise<GrantReport[]> {
  const { data, error } = await supabase
    .from('grant_reports')
    .select('*')
    .eq('grant_id', grantId)
    .order('due_date', { ascending: false });

  if (error) {
    console.error('Error fetching grant reports:', error);
    return [];
  }

  return (data || []).map(transformGrantReportFromDB);
}

export async function createGrantReport(
  grantId: string,
  partnerId: string,
  report: Omit<GrantReport, 'id' | 'grantId' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<GrantReport | null> {
  const dbData = {
    grant_id: grantId,
    partner_id: partnerId,
    report_type: report.reportType,
    reporting_period_start: report.reportingPeriodStart,
    reporting_period_end: report.reportingPeriodEnd,
    due_date: report.dueDate,
    enrollment_count: report.enrollmentCount,
    completion_count: report.completionCount,
    placement_count: report.placementCount,
    average_wage: report.averageWage,
    retention_rate: report.retentionRate,
    narrative_summary: report.narrativeSummary,
    challenges_encountered: report.challengesEncountered,
    success_stories: report.successStories,
    status: report.status
  };

  const { data, error } = await supabase
    .from('grant_reports')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating grant report:', error);
    return null;
  }

  return transformGrantReportFromDB(data);
}

export async function submitGrantReport(reportId: string): Promise<boolean> {
  const { error } = await supabase
    .from('grant_reports')
    .update({
      status: 'submitted',
      submitted_date: new Date().toISOString().split('T')[0]
    })
    .eq('id', reportId);

  if (error) {
    console.error('Error submitting grant report:', error);
    return false;
  }

  return true;
}

// ===========================================
// EMPLOYER CONNECTIONS
// ===========================================

export async function getEmployerConnections(partnerId: string, filters?: EmployerFilters): Promise<EmployerConnection[]> {
  let query = supabase
    .from('nonprofit_employer_connections')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.industry) {
    query = query.eq('industry', filters.industry);
  }
  if (filters?.searchQuery) {
    query = query.ilike('employer_name', `%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching employer connections:', error);
    return [];
  }

  return (data || []).map(transformEmployerConnectionFromDB);
}

export async function createEmployerConnection(
  partnerId: string,
  connection: Omit<EmployerConnection, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<EmployerConnection | null> {
  const dbData = {
    partner_id: partnerId,
    employer_name: connection.employerName,
    employer_id: connection.employerId,
    industry: connection.industry,
    company_size: connection.companySize,
    location: connection.location,
    contact_name: connection.contactName,
    contact_email: connection.contactEmail,
    contact_phone: connection.contactPhone,
    contact_title: connection.contactTitle,
    status: connection.status,
    partnership_type: connection.partnershipType,
    last_contact_date: connection.lastContactDate,
    next_follow_up_date: connection.nextFollowUpDate,
    notes: connection.notes
  };

  const { data, error } = await supabase
    .from('nonprofit_employer_connections')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating employer connection:', error);
    return null;
  }

  return transformEmployerConnectionFromDB(data);
}

export async function updateEmployerConnection(
  connectionId: string,
  updates: Partial<EmployerConnection>
): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {};

  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.lastContactDate !== undefined) dbUpdates.last_contact_date = updates.lastContactDate;
  if (updates.nextFollowUpDate !== undefined) dbUpdates.next_follow_up_date = updates.nextFollowUpDate;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.participantsPlaced !== undefined) dbUpdates.participants_placed = updates.participantsPlaced;
  if (updates.participantsInterviewed !== undefined) dbUpdates.participants_interviewed = updates.participantsInterviewed;

  const { error } = await supabase
    .from('nonprofit_employer_connections')
    .update(dbUpdates)
    .eq('id', connectionId);

  if (error) {
    console.error('Error updating employer connection:', error);
    return false;
  }

  return true;
}

// ===========================================
// COALITIONS
// ===========================================

export async function getCoalitions(): Promise<Coalition[]> {
  const { data, error } = await supabase
    .from('nonprofit_coalitions')
    .select('*')
    .eq('status', 'active')
    .order('name');

  if (error) {
    console.error('Error fetching coalitions:', error);
    return [];
  }

  return (data || []).map(transformCoalitionFromDB);
}

export async function getCoalitionMemberships(partnerId: string): Promise<CoalitionMembership[]> {
  const { data, error } = await supabase
    .from('coalition_memberships')
    .select('*')
    .eq('partner_id', partnerId);

  if (error) {
    console.error('Error fetching coalition memberships:', error);
    return [];
  }

  return (data || []).map((m: Record<string, unknown>) => ({
    id: m.id as string,
    coalitionId: m.coalition_id as string,
    partnerId: m.partner_id as string,
    role: m.role as CoalitionMembership['role'],
    joinedAt: m.joined_at as string,
    dataShareConsent: m.data_share_consent as boolean,
    consentDate: m.consent_date as string | undefined
  }));
}

export async function getPartnerCoalitions(partnerId: string): Promise<(Coalition & { membership: CoalitionMembership })[]> {
  const { data: memberships, error } = await supabase
    .from('coalition_memberships')
    .select(`
      *,
      coalition:nonprofit_coalitions(*)
    `)
    .eq('partner_id', partnerId);

  if (error) {
    console.error('Error fetching partner coalitions:', error);
    return [];
  }

  return (memberships || []).map((m: Record<string, unknown>) => ({
    ...transformCoalitionFromDB(m.coalition as Record<string, unknown>),
    membership: {
      id: m.id as string,
      coalitionId: m.coalition_id as string,
      partnerId: m.partner_id as string,
      role: m.role as CoalitionMembership['role'],
      joinedAt: m.joined_at as string,
      dataShareConsent: m.data_share_consent as boolean,
      consentDate: m.consent_date as string | undefined
    }
  }));
}

// ===========================================
// SUCCESS STORIES
// ===========================================

export async function getSuccessStories(partnerId: string): Promise<SuccessStory[]> {
  const { data, error } = await supabase
    .from('nonprofit_success_stories')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching success stories:', error);
    return [];
  }

  return (data || []).map(transformSuccessStoryFromDB);
}

export async function createSuccessStory(
  partnerId: string,
  story: Omit<SuccessStory, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<SuccessStory | null> {
  const dbData = {
    partner_id: partnerId,
    participant_id: story.participantId,
    title: story.title,
    summary: story.summary,
    full_story: story.fullStory,
    wage_increase: story.wageIncrease,
    outcome_type: story.outcomeType,
    photo_url: story.photoUrl,
    video_url: story.videoUrl,
    has_consent: story.hasConsent,
    consent_date: story.consentDate,
    can_use_externally: story.canUseExternally,
    status: story.status
  };

  const { data, error } = await supabase
    .from('nonprofit_success_stories')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating success story:', error);
    return null;
  }

  return transformSuccessStoryFromDB(data);
}

// ===========================================
// ANALYTICS
// ===========================================

export async function getImpactMetrics(partnerId: string): Promise<ImpactMetrics> {
  // Fetch participants
  const { data: participants } = await supabase
    .from('nonprofit_participants')
    .select('status, program_id, prior_wage_hourly, placed_wage_hourly, retention_30_day, retention_90_day, retention_180_day')
    .eq('partner_id', partnerId);

  // Fetch programs
  const { data: programs } = await supabase
    .from('nonprofit_programs')
    .select('id, status, enrolled_count, waitlist_count')
    .eq('partner_id', partnerId);

  // Fetch grants
  const { data: grants } = await supabase
    .from('nonprofit_grants')
    .select('id, status, award_amount')
    .eq('partner_id', partnerId);

  // Fetch upcoming report deadlines
  const { data: reports } = await supabase
    .from('grant_reports')
    .select('due_date')
    .eq('partner_id', partnerId)
    .eq('status', 'draft')
    .gte('due_date', new Date().toISOString().split('T')[0]);

  // Fetch employer connections
  const { data: employers } = await supabase
    .from('nonprofit_employer_connections')
    .select('status, participants_placed, participants_interviewed')
    .eq('partner_id', partnerId);

  // Calculate metrics
  const participantList = participants || [];
  const totalParticipants = participantList.length;
  const activeParticipants = participantList.filter(p => p.status === 'active').length;

  const participantsByStatus = participantList.reduce((acc, p) => {
    acc[p.status as ParticipantStatus] = (acc[p.status as ParticipantStatus] || 0) + 1;
    return acc;
  }, {} as Record<ParticipantStatus, number>);

  const participantsByProgram = participantList.reduce((acc, p) => {
    if (p.program_id) {
      acc[p.program_id] = (acc[p.program_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const completedOrPlaced = participantList.filter(p =>
    ['completed', 'placed', 'retained'].includes(p.status)
  );
  const placedOrRetained = participantList.filter(p =>
    ['placed', 'retained'].includes(p.status)
  );

  const completionRate = totalParticipants > 0
    ? (completedOrPlaced.length / totalParticipants) * 100
    : 0;

  const placementRate = completedOrPlaced.length > 0
    ? (placedOrRetained.length / completedOrPlaced.length) * 100
    : 0;

  const wageIncreases = participantList
    .filter(p => p.placed_wage_hourly && p.prior_wage_hourly)
    .map(p => (p.placed_wage_hourly - p.prior_wage_hourly) * 2080); // Annual increase

  const averageWageIncrease = wageIncreases.length > 0
    ? wageIncreases.reduce((a, b) => a + b, 0) / wageIncreases.length
    : 0;

  const totalWagesGenerated = participantList
    .filter(p => p.placed_wage_hourly)
    .reduce((sum, p) => sum + (p.placed_wage_hourly || 0) * 2080, 0);

  const retentionParticipants = participantList.filter(p => p.retention_30_day !== null);
  const retentionRate30Day = retentionParticipants.length > 0
    ? (retentionParticipants.filter(p => p.retention_30_day).length / retentionParticipants.length) * 100
    : 0;

  const retention90Participants = participantList.filter(p => p.retention_90_day !== null);
  const retentionRate90Day = retention90Participants.length > 0
    ? (retention90Participants.filter(p => p.retention_90_day).length / retention90Participants.length) * 100
    : 0;

  const retention180Participants = participantList.filter(p => p.retention_180_day !== null);
  const retentionRate180Day = retention180Participants.length > 0
    ? (retention180Participants.filter(p => p.retention_180_day).length / retention180Participants.length) * 100
    : 0;

  const programList = programs || [];
  const activePrograms = programList.filter(p => p.status === 'active').length;
  const totalEnrollments = programList.reduce((sum, p) => sum + (p.enrolled_count || 0), 0);
  const waitlistTotal = programList.reduce((sum, p) => sum + (p.waitlist_count || 0), 0);

  const grantList = grants || [];
  const activeGrants = grantList.filter(g => ['active', 'reporting'].includes(g.status)).length;
  const grantFundingTotal = grantList
    .filter(g => ['awarded', 'active', 'reporting'].includes(g.status))
    .reduce((sum, g) => sum + (g.award_amount || 0), 0);

  const employerList = employers || [];
  const activeEmployerPartners = employerList.filter(e => e.status === 'partner').length;
  const totalPlacements = employerList.reduce((sum, e) => sum + (e.participants_placed || 0), 0);
  const interviewsScheduled = employerList.reduce((sum, e) => sum + (e.participants_interviewed || 0), 0);

  const costPerPlacement = totalPlacements > 0 ? grantFundingTotal / totalPlacements : 0;
  const roiMultiplier = grantFundingTotal > 0 ? totalWagesGenerated / grantFundingTotal : 0;

  return {
    totalParticipants,
    activeParticipants,
    participantsByStatus,
    participantsByProgram,
    completionRate,
    placementRate,
    averageWageIncrease,
    retentionRate30Day,
    retentionRate90Day,
    retentionRate180Day,
    totalWagesGenerated,
    costPerPlacement,
    roiMultiplier,
    activePrograms,
    totalEnrollments,
    waitlistTotal,
    activeEmployerPartners,
    totalPlacements,
    interviewsScheduled,
    activeGrants,
    grantFundingTotal,
    upcomingReportDeadlines: (reports || []).length
  };
}

// ===========================================
// TRANSFORM FUNCTIONS
// ===========================================

function transformPartnerFromDB(data: Record<string, unknown>): NonprofitPartner {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    organizationName: data.organization_name as string,
    nonprofitType: data.nonprofit_type as NonprofitPartner['nonprofitType'],
    ein: data.ein as string | undefined,
    mission: data.mission as string,
    website: data.website as string | undefined,
    logoUrl: data.logo_url as string | undefined,
    city: data.city as string,
    state: data.state as string,
    serviceArea: (data.service_area as string[]) || [],
    tier: (data.tier as PartnerTier) || 'community',
    status: (data.status as NonprofitPartner['status']) || 'pending',
    primaryContactName: data.primary_contact_name as string,
    primaryContactEmail: data.primary_contact_email as string,
    primaryContactPhone: data.primary_contact_phone as string | undefined,
    primaryContactTitle: data.primary_contact_title as string | undefined,
    annualBudget: data.annual_budget as string | undefined,
    staffCount: data.staff_count as number | undefined,
    volunteersCount: data.volunteers_count as number | undefined,
    stripeCustomerId: data.stripe_customer_id as string | undefined,
    subscriptionStatus: (data.subscription_status as NonprofitPartner['subscriptionStatus']) || 'free',
    approvedAt: data.approved_at as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformPartnerToDB(partner: Partial<NonprofitPartner>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (partner.organizationName !== undefined) result.organization_name = partner.organizationName;
  if (partner.nonprofitType !== undefined) result.nonprofit_type = partner.nonprofitType;
  if (partner.mission !== undefined) result.mission = partner.mission;
  if (partner.website !== undefined) result.website = partner.website;
  if (partner.city !== undefined) result.city = partner.city;
  if (partner.state !== undefined) result.state = partner.state;
  if (partner.serviceArea !== undefined) result.service_area = partner.serviceArea;
  if (partner.primaryContactName !== undefined) result.primary_contact_name = partner.primaryContactName;
  if (partner.primaryContactEmail !== undefined) result.primary_contact_email = partner.primaryContactEmail;
  if (partner.primaryContactPhone !== undefined) result.primary_contact_phone = partner.primaryContactPhone;
  if (partner.primaryContactTitle !== undefined) result.primary_contact_title = partner.primaryContactTitle;

  return result;
}

function transformProgramFromDB(data: Record<string, unknown>): Program {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    name: data.name as string,
    description: data.description as string,
    programType: data.program_type as Program['programType'],
    targetPopulation: (data.target_population as string[]) || [],
    eligibilityCriteria: data.eligibility_criteria as string | undefined,
    duration: data.duration as string,
    format: data.format as Program['format'],
    location: data.location as string | undefined,
    capacity: data.capacity as number,
    enrolledCount: data.enrolled_count as number,
    waitlistCount: data.waitlist_count as number,
    startDate: data.start_date as string | undefined,
    endDate: data.end_date as string | undefined,
    applicationDeadline: data.application_deadline as string | undefined,
    isRollingAdmission: data.is_rolling_admission as boolean,
    fundingSources: (data.funding_sources as Program['fundingSources']) || [],
    grantIds: data.grant_ids as string[] | undefined,
    completionRate: data.completion_rate as number | undefined,
    placementRate: data.placement_rate as number | undefined,
    averageWageIncrease: data.average_wage_increase as number | undefined,
    status: data.status as ProgramStatus,
    featured: data.featured as boolean,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformParticipantFromDB(data: Record<string, unknown>): Participant {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    programId: data.program_id as string | undefined,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    email: data.email as string,
    phone: data.phone as string | undefined,
    dateOfBirth: data.date_of_birth as string | undefined,
    gender: data.gender as string | undefined,
    ethnicity: data.ethnicity as string | undefined,
    veteranStatus: data.veteran_status as boolean | undefined,
    disabilityStatus: data.disability_status as boolean | undefined,
    educationLevel: data.education_level as string | undefined,
    priorWageHourly: data.prior_wage_hourly as number | undefined,
    employmentStatusAtIntake: data.employment_status_at_intake as string | undefined,
    barriers: (data.barriers as Participant['barriers']) || [],
    barrierNotes: data.barrier_notes as string | undefined,
    status: data.status as ParticipantStatus,
    intakeDate: data.intake_date as string,
    enrollmentDate: data.enrollment_date as string | undefined,
    completionDate: data.completion_date as string | undefined,
    placementDate: data.placement_date as string | undefined,
    placedEmployerId: data.placed_employer_id as string | undefined,
    placedEmployerName: data.placed_employer_name as string | undefined,
    placedJobTitle: data.placed_job_title as string | undefined,
    placedWageHourly: data.placed_wage_hourly as number | undefined,
    retention30Day: data.retention_30_day as boolean | undefined,
    retention60Day: data.retention_60_day as boolean | undefined,
    retention90Day: data.retention_90_day as boolean | undefined,
    retention180Day: data.retention_180_day as boolean | undefined,
    caseNotes: data.case_notes as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformGrantFromDB(data: Record<string, unknown>): Grant {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    name: data.name as string,
    funderName: data.funder_name as string,
    funderType: data.funder_type as Grant['funderType'],
    grantNumber: data.grant_number as string | undefined,
    awardAmount: data.award_amount as number | undefined,
    disbursedAmount: data.disbursed_amount as number | undefined,
    remainingAmount: data.remaining_amount as number | undefined,
    applicationDate: data.application_date as string | undefined,
    awardDate: data.award_date as string | undefined,
    startDate: data.start_date as string | undefined,
    endDate: data.end_date as string | undefined,
    reportingDeadlines: data.reporting_deadlines as string[] | undefined,
    targetEnrollment: data.target_enrollment as number | undefined,
    targetPlacements: data.target_placements as number | undefined,
    targetWageGoal: data.target_wage_goal as number | undefined,
    targetRetentionRate: data.target_retention_rate as number | undefined,
    actualEnrollment: data.actual_enrollment as number | undefined,
    actualPlacements: data.actual_placements as number | undefined,
    actualAverageWage: data.actual_average_wage as number | undefined,
    actualRetentionRate: data.actual_retention_rate as number | undefined,
    status: data.status as GrantStatus,
    programIds: (data.program_ids as string[]) || [],
    notes: data.notes as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformGrantReportFromDB(data: Record<string, unknown>): GrantReport {
  return {
    id: data.id as string,
    grantId: data.grant_id as string,
    partnerId: data.partner_id as string,
    reportType: data.report_type as GrantReport['reportType'],
    reportingPeriodStart: data.reporting_period_start as string,
    reportingPeriodEnd: data.reporting_period_end as string,
    dueDate: data.due_date as string,
    submittedDate: data.submitted_date as string | undefined,
    enrollmentCount: data.enrollment_count as number,
    completionCount: data.completion_count as number,
    placementCount: data.placement_count as number,
    averageWage: data.average_wage as number,
    retentionRate: data.retention_rate as number,
    narrativeSummary: data.narrative_summary as string | undefined,
    challengesEncountered: data.challenges_encountered as string | undefined,
    successStories: data.success_stories as string | undefined,
    status: data.status as GrantReport['status'],
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformEmployerConnectionFromDB(data: Record<string, unknown>): EmployerConnection {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    employerName: data.employer_name as string,
    employerId: data.employer_id as string | undefined,
    industry: data.industry as string,
    companySize: data.company_size as string | undefined,
    location: data.location as string,
    contactName: data.contact_name as string | undefined,
    contactEmail: data.contact_email as string | undefined,
    contactPhone: data.contact_phone as string | undefined,
    contactTitle: data.contact_title as string | undefined,
    status: data.status as EmployerConnection['status'],
    partnershipType: data.partnership_type as EmployerConnection['partnershipType'],
    lastContactDate: data.last_contact_date as string | undefined,
    nextFollowUpDate: data.next_follow_up_date as string | undefined,
    notes: data.notes as string | undefined,
    participantsPlaced: data.participants_placed as number,
    participantsInterviewed: data.participants_interviewed as number,
    averageWagePlaced: data.average_wage_placed as number | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformCoalitionFromDB(data: Record<string, unknown>): Coalition {
  return {
    id: data.id as string,
    name: data.name as string,
    description: data.description as string,
    region: data.region as string,
    focusAreas: (data.focus_areas as string[]) || [],
    targetPopulations: (data.target_populations as string[]) || [],
    leadOrganizationId: data.lead_organization_id as string,
    memberCount: data.member_count as number,
    activeGrants: data.active_grants as string[] | undefined,
    sharedPrograms: data.shared_programs as string[] | undefined,
    status: data.status as Coalition['status'],
    formedAt: data.formed_at as string,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformSuccessStoryFromDB(data: Record<string, unknown>): SuccessStory {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    participantId: data.participant_id as string | undefined,
    title: data.title as string,
    summary: data.summary as string,
    fullStory: data.full_story as string | undefined,
    wageIncrease: data.wage_increase as number | undefined,
    outcomeType: data.outcome_type as SuccessStory['outcomeType'],
    photoUrl: data.photo_url as string | undefined,
    videoUrl: data.video_url as string | undefined,
    hasConsent: data.has_consent as boolean,
    consentDate: data.consent_date as string | undefined,
    canUseExternally: data.can_use_externally as boolean,
    usedInReports: data.used_in_reports as string[] | undefined,
    usedInMarketing: data.used_in_marketing as boolean | undefined,
    status: data.status as SuccessStory['status'],
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}
