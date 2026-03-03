// ===========================================
// Education Partner API Service
// CRUD operations for education partner features
// ===========================================

import { supabase } from '@/lib/supabase';

// ===========================================
// TYPES
// ===========================================

export interface EducationPartner {
  id: string;
  institutionName: string;
  institutionType: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  contactEmail: string;
  contactPhone?: string;
  tier: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'suspended' | 'inactive';
  approvedAt?: string;
  totalPrograms: number;
  totalStudentsReached: number;
  totalEmployerConnections: number;
  averagePlacementRate?: number;
  canListPrograms: boolean;
  canHostEvents: boolean;
  canAccessEmployerNetwork: boolean;
  canTrackOutcomes: boolean;
  maxProgramListings: number;
  maxEventsPerYear: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerProgram {
  id: string;
  partnerId: string;
  name: string;
  programType: string;
  description?: string;
  duration?: string;
  format: 'in_person' | 'online' | 'hybrid' | 'self_paced' | 'cohort_based';
  accreditation?: string;
  enrollmentSize?: number;
  focusAreas: string[];
  industries: string[];
  skills: string[];
  graduationRate?: number;
  placementRate?: number;
  averageStartingSalary?: number;
  tuitionCost?: number;
  financialAidAvailable: boolean;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  featured: boolean;
  externalUrl?: string;
  applicationUrl?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerConnection {
  id: string;
  partnerId: string;
  employerId?: string;
  employerName: string;
  connectionType: 'hiring_partner' | 'internship_provider' | 'advisory_board' | 'sponsor' | 'guest_speaker';
  status: 'pending' | 'active' | 'inactive';
  studentsPlaced: number;
  internshipsProvided: number;
  eventsHosted: number;
  establishedAt?: string;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraduateOutcome {
  id: string;
  partnerId: string;
  programId?: string;
  graduationYear: number;
  graduationTerm?: string;
  cohortSize?: number;
  employedCount: number;
  employedInFieldCount: number;
  continuingEducationCount: number;
  notSeekingCount: number;
  unknownCount: number;
  averageSalary?: number;
  medianSalary?: number;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  placementRate?: number;
  fieldPlacementRate?: number;
  dataVerified: boolean;
  verifiedAt?: string;
  verificationMethod?: string;
  topEmployers: { name: string; count: number; industry?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PartnerEvent {
  id: string;
  partnerId: string;
  title: string;
  description?: string;
  eventType: 'career_fair' | 'info_session' | 'workshop' | 'networking' | 'panel';
  format: 'virtual' | 'in_person' | 'hybrid';
  startTime: string;
  endTime: string;
  timezone: string;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  virtualPlatform?: string;
  virtualLink?: string;
  registrationRequired: boolean;
  maxAttendees?: number;
  registrationDeadline?: string;
  currentRegistrations: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  publishedAt?: string;
  participatingEmployers: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PartnerDashboardStats {
  totalPrograms: number;
  activePrograms: number;
  totalStudentsReached: number;
  employerConnections: number;
  upcomingEvents: number;
  averagePlacementRate: number;
  recentActivity: {
    action: string;
    entityType: string;
    details: Record<string, unknown>;
    createdAt: string;
  }[];
}

// ===========================================
// PARTNER PROFILE
// ===========================================

/**
 * Get partner profile by ID
 */
export async function getPartnerProfile(partnerId: string): Promise<EducationPartner | null> {
  const { data, error } = await supabase
    .from('education_partners')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error) {
    console.error('Error fetching partner profile:', error);
    return null;
  }

  return transformPartnerFromDB(data);
}

/**
 * Get partner profile by user ID (for logged-in users)
 */
export async function getPartnerByUserId(userId: string): Promise<EducationPartner | null> {
  const { data, error } = await supabase
    .from('education_partners')
    .select('*')
    .eq('primary_contact_user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching partner by user:', error);
    return null;
  }

  return transformPartnerFromDB(data);
}

/**
 * Update partner profile
 */
export async function updatePartnerProfile(
  partnerId: string,
  updates: Partial<Pick<EducationPartner, 'institutionName' | 'website' | 'logoUrl' | 'description' | 'address' | 'city' | 'state' | 'zipCode' | 'contactEmail' | 'contactPhone'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('education_partners')
    .update({
      institution_name: updates.institutionName,
      website: updates.website,
      logo_url: updates.logoUrl,
      description: updates.description,
      address: updates.address,
      city: updates.city,
      state: updates.state,
      zip_code: updates.zipCode,
      contact_email: updates.contactEmail,
      contact_phone: updates.contactPhone,
      updated_at: new Date().toISOString()
    })
    .eq('id', partnerId);

  if (error) {
    console.error('Error updating partner profile:', error);
    return false;
  }

  return true;
}

// ===========================================
// PROGRAMS CRUD
// ===========================================

/**
 * Get all programs for a partner
 */
export async function getPartnerPrograms(partnerId: string): Promise<PartnerProgram[]> {
  const { data, error } = await supabase
    .from('education_partner_programs')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return data.map(transformProgramFromDB);
}

/**
 * Get a single program
 */
export async function getProgram(programId: string): Promise<PartnerProgram | null> {
  const { data, error } = await supabase
    .from('education_partner_programs')
    .select('*')
    .eq('id', programId)
    .single();

  if (error) {
    console.error('Error fetching program:', error);
    return null;
  }

  return transformProgramFromDB(data);
}

/**
 * Create a new program
 */
export async function createProgram(
  partnerId: string,
  program: Omit<PartnerProgram, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<PartnerProgram | null> {
  const { data, error } = await supabase
    .from('education_partner_programs')
    .insert({
      partner_id: partnerId,
      name: program.name,
      program_type: program.programType,
      description: program.description,
      duration: program.duration,
      format: program.format,
      accreditation: program.accreditation,
      enrollment_size: program.enrollmentSize?.toString(),
      focus_areas: program.focusAreas,
      industries: program.industries,
      skills: program.skills,
      graduation_rate: program.graduationRate,
      placement_rate: program.placementRate,
      average_starting_salary: program.averageStartingSalary,
      tuition_cost: program.tuitionCost,
      financial_aid_available: program.financialAidAvailable,
      status: program.status || 'draft',
      featured: program.featured || false,
      external_url: program.externalUrl,
      application_url: program.applicationUrl
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating program:', error);
    return null;
  }

  // Update partner's program count
  await updatePartnerProgramCount(partnerId);

  return transformProgramFromDB(data);
}

/**
 * Update a program
 */
export async function updateProgram(
  programId: string,
  updates: Partial<Omit<PartnerProgram, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>>
): Promise<boolean> {
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.programType !== undefined) updateData.program_type = updates.programType;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.duration !== undefined) updateData.duration = updates.duration;
  if (updates.format !== undefined) updateData.format = updates.format;
  if (updates.accreditation !== undefined) updateData.accreditation = updates.accreditation;
  if (updates.enrollmentSize !== undefined) updateData.enrollment_size = updates.enrollmentSize?.toString();
  if (updates.focusAreas !== undefined) updateData.focus_areas = updates.focusAreas;
  if (updates.industries !== undefined) updateData.industries = updates.industries;
  if (updates.skills !== undefined) updateData.skills = updates.skills;
  if (updates.graduationRate !== undefined) updateData.graduation_rate = updates.graduationRate;
  if (updates.placementRate !== undefined) updateData.placement_rate = updates.placementRate;
  if (updates.averageStartingSalary !== undefined) updateData.average_starting_salary = updates.averageStartingSalary;
  if (updates.tuitionCost !== undefined) updateData.tuition_cost = updates.tuitionCost;
  if (updates.financialAidAvailable !== undefined) updateData.financial_aid_available = updates.financialAidAvailable;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.featured !== undefined) updateData.featured = updates.featured;
  if (updates.externalUrl !== undefined) updateData.external_url = updates.externalUrl;
  if (updates.applicationUrl !== undefined) updateData.application_url = updates.applicationUrl;

  // Set published_at when publishing
  if (updates.status === 'active') {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('education_partner_programs')
    .update(updateData)
    .eq('id', programId);

  if (error) {
    console.error('Error updating program:', error);
    return false;
  }

  return true;
}

/**
 * Delete a program
 */
export async function deleteProgram(programId: string, partnerId: string): Promise<boolean> {
  const { error } = await supabase
    .from('education_partner_programs')
    .delete()
    .eq('id', programId);

  if (error) {
    console.error('Error deleting program:', error);
    return false;
  }

  // Update partner's program count
  await updatePartnerProgramCount(partnerId);

  return true;
}

// ===========================================
// EMPLOYER CONNECTIONS
// ===========================================

/**
 * Get employer connections for a partner
 */
export async function getEmployerConnections(partnerId: string): Promise<EmployerConnection[]> {
  const { data, error } = await supabase
    .from('partner_employer_connections')
    .select('*')
    .eq('partner_id', partnerId)
    .order('students_placed', { ascending: false });

  if (error) {
    console.error('Error fetching employer connections:', error);
    return [];
  }

  return data.map(transformEmployerConnectionFromDB);
}

/**
 * Create an employer connection
 */
export async function createEmployerConnection(
  partnerId: string,
  connection: Omit<EmployerConnection, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<EmployerConnection | null> {
  const { data, error } = await supabase
    .from('partner_employer_connections')
    .insert({
      partner_id: partnerId,
      employer_id: connection.employerId,
      employer_name: connection.employerName,
      connection_type: connection.connectionType,
      status: connection.status || 'pending',
      students_placed: connection.studentsPlaced || 0,
      internships_provided: connection.internshipsProvided || 0,
      events_hosted: connection.eventsHosted || 0,
      established_at: connection.establishedAt
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating employer connection:', error);
    return null;
  }

  return transformEmployerConnectionFromDB(data);
}

// ===========================================
// GRADUATE OUTCOMES
// ===========================================

/**
 * Get graduate outcomes for a partner
 */
export async function getGraduateOutcomes(partnerId: string): Promise<GraduateOutcome[]> {
  const { data, error } = await supabase
    .from('graduate_outcomes')
    .select('*')
    .eq('partner_id', partnerId)
    .order('graduation_year', { ascending: false });

  if (error) {
    console.error('Error fetching graduate outcomes:', error);
    return [];
  }

  return data.map(transformOutcomeFromDB);
}

/**
 * Create or update graduate outcome
 */
/**
 * Create graduate outcome
 */
export async function createGraduateOutcome(
  partnerId: string,
  outcome: {
    programId: string;
    graduationYear: number;
    totalGraduates: number;
    employedInField: number;
    continuedEducation: number;
    averageStartingSalary: number;
    topEmployers: string[];
    certificationsPassed: number;
    reportingPeriod: string;
    verificationStatus: string;
    notes?: string;
  }
): Promise<GraduateOutcome | null> {
  const { data, error } = await supabase
    .from('graduate_outcomes')
    .insert({
      partner_id: partnerId,
      program_id: outcome.programId,
      graduation_year: outcome.graduationYear,
      cohort_size: outcome.totalGraduates,
      employed_in_field_count: outcome.employedInField,
      continuing_education_count: outcome.continuedEducation,
      average_salary: outcome.averageStartingSalary,
      top_employers: outcome.topEmployers.map(name => ({ name, count: 0 })),
      data_verified: outcome.verificationStatus === 'verified'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating outcome:', error);
    return null;
  }

  return transformOutcomeFromDB(data);
}

/**
 * Update graduate outcome
 */
export async function updateGraduateOutcome(
  outcomeId: string,
  updates: Partial<{
    programId: string;
    graduationYear: number;
    totalGraduates: number;
    employedInField: number;
    continuedEducation: number;
    averageStartingSalary: number;
    topEmployers: string[];
    certificationsPassed: number;
    reportingPeriod: string;
    verificationStatus: string;
    notes?: string;
  }>
): Promise<boolean> {
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (updates.programId !== undefined) updateData.program_id = updates.programId;
  if (updates.graduationYear !== undefined) updateData.graduation_year = updates.graduationYear;
  if (updates.totalGraduates !== undefined) updateData.cohort_size = updates.totalGraduates;
  if (updates.employedInField !== undefined) updateData.employed_in_field_count = updates.employedInField;
  if (updates.continuedEducation !== undefined) updateData.continuing_education_count = updates.continuedEducation;
  if (updates.averageStartingSalary !== undefined) updateData.average_salary = updates.averageStartingSalary;
  if (updates.topEmployers !== undefined) updateData.top_employers = updates.topEmployers.map(name => ({ name, count: 0 }));
  if (updates.verificationStatus !== undefined) updateData.data_verified = updates.verificationStatus === 'verified';

  const { error } = await supabase
    .from('graduate_outcomes')
    .update(updateData)
    .eq('id', outcomeId);

  if (error) {
    console.error('Error updating outcome:', error);
    return false;
  }

  return true;
}

/**
 * Delete graduate outcome
 */
export async function deleteGraduateOutcome(outcomeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('graduate_outcomes')
    .delete()
    .eq('id', outcomeId);

  if (error) {
    console.error('Error deleting outcome:', error);
    return false;
  }

  return true;
}

/**
 * Upsert graduate outcome (legacy)
 */
export async function upsertGraduateOutcome(
  partnerId: string,
  outcome: Omit<GraduateOutcome, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<GraduateOutcome | null> {
  const { data, error } = await supabase
    .from('graduate_outcomes')
    .upsert({
      partner_id: partnerId,
      program_id: outcome.programId,
      graduation_year: outcome.graduationYear,
      graduation_term: outcome.graduationTerm,
      cohort_size: outcome.cohortSize,
      employed_count: outcome.employedCount,
      employed_in_field_count: outcome.employedInFieldCount,
      continuing_education_count: outcome.continuingEducationCount,
      not_seeking_count: outcome.notSeekingCount,
      unknown_count: outcome.unknownCount,
      average_salary: outcome.averageSalary,
      median_salary: outcome.medianSalary,
      salary_range_min: outcome.salaryRangeMin,
      salary_range_max: outcome.salaryRangeMax,
      placement_rate: outcome.placementRate,
      field_placement_rate: outcome.fieldPlacementRate,
      data_verified: outcome.dataVerified || false,
      verification_method: outcome.verificationMethod,
      top_employers: outcome.topEmployers
    }, {
      onConflict: 'partner_id,program_id,graduation_year,graduation_term'
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting outcome:', error);
    return null;
  }

  return transformOutcomeFromDB(data);
}

// ===========================================
// EVENTS
// ===========================================

/**
 * Get events for a partner
 */
export async function getPartnerEvents(partnerId: string): Promise<PartnerEvent[]> {
  const { data, error } = await supabase
    .from('partner_events')
    .select('*')
    .eq('partner_id', partnerId)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data.map(transformEventFromDB);
}

/**
 * Create an event
 */
export async function createPartnerEvent(
  partnerId: string,
  event: Omit<PartnerEvent, 'id' | 'partnerId' | 'currentRegistrations' | 'createdAt' | 'updatedAt'>
): Promise<PartnerEvent | null> {
  const { data, error } = await supabase
    .from('partner_events')
    .insert({
      partner_id: partnerId,
      title: event.title,
      description: event.description,
      event_type: event.eventType,
      format: event.format,
      start_time: event.startTime,
      end_time: event.endTime,
      timezone: event.timezone || 'America/New_York',
      venue_name: event.venueName,
      address: event.address,
      city: event.city,
      state: event.state,
      virtual_platform: event.virtualPlatform,
      virtual_link: event.virtualLink,
      registration_required: event.registrationRequired,
      max_attendees: event.maxAttendees,
      registration_deadline: event.registrationDeadline,
      status: event.status || 'draft',
      participating_employers: event.participatingEmployers || []
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }

  return transformEventFromDB(data);
}

/**
 * Update an event
 */
export async function updatePartnerEvent(
  eventId: string,
  updates: Partial<Omit<PartnerEvent, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>>
): Promise<boolean> {
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.eventType !== undefined) updateData.event_type = updates.eventType;
  if (updates.format !== undefined) updateData.format = updates.format;
  if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
  if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
  if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
  if (updates.venueName !== undefined) updateData.venue_name = updates.venueName;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.city !== undefined) updateData.city = updates.city;
  if (updates.state !== undefined) updateData.state = updates.state;
  if (updates.virtualPlatform !== undefined) updateData.virtual_platform = updates.virtualPlatform;
  if (updates.virtualLink !== undefined) updateData.virtual_link = updates.virtualLink;
  if (updates.registrationRequired !== undefined) updateData.registration_required = updates.registrationRequired;
  if (updates.maxAttendees !== undefined) updateData.max_attendees = updates.maxAttendees;
  if (updates.registrationDeadline !== undefined) updateData.registration_deadline = updates.registrationDeadline;
  if (updates.status !== undefined) {
    updateData.status = updates.status;
    if (updates.status === 'published') {
      updateData.published_at = new Date().toISOString();
    }
  }
  if (updates.participatingEmployers !== undefined) updateData.participating_employers = updates.participatingEmployers;

  const { error } = await supabase
    .from('partner_events')
    .update(updateData)
    .eq('id', eventId);

  if (error) {
    console.error('Error updating event:', error);
    return false;
  }

  return true;
}

/**
 * Delete an event
 */
export async function deletePartnerEvent(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('partner_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    return false;
  }

  return true;
}

// ===========================================
// DASHBOARD STATS
// ===========================================

/**
 * Get dashboard statistics for a partner
 */
export async function getPartnerDashboardStats(partnerId: string): Promise<PartnerDashboardStats> {
  // Use the database function if available, otherwise calculate manually
  const { data, error } = await supabase.rpc('get_partner_dashboard_stats', {
    p_partner_id: partnerId
  });

  if (error || !data) {
    console.error('Error fetching dashboard stats:', error);
    // Return default stats
    return {
      totalPrograms: 0,
      activePrograms: 0,
      totalStudentsReached: 0,
      employerConnections: 0,
      upcomingEvents: 0,
      averagePlacementRate: 0,
      recentActivity: []
    };
  }

  return {
    totalPrograms: data.total_programs || 0,
    activePrograms: data.total_programs || 0, // TODO: Add active filter
    totalStudentsReached: data.students_placed || 0,
    employerConnections: data.employer_connections || 0,
    upcomingEvents: data.upcoming_events || 0,
    averagePlacementRate: 0, // TODO: Calculate from outcomes
    recentActivity: data.recent_activity || []
  };
}

// ===========================================
// ACTIVITY LOGGING
// ===========================================

/**
 * Log partner activity
 */
export async function logPartnerActivity(
  partnerId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  await supabase
    .from('partner_activity_log')
    .insert({
      partner_id: partnerId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || {}
    });
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

async function updatePartnerProgramCount(partnerId: string): Promise<void> {
  const { count } = await supabase
    .from('education_partner_programs')
    .select('*', { count: 'exact', head: true })
    .eq('partner_id', partnerId);

  await supabase
    .from('education_partners')
    .update({ total_programs: count || 0 })
    .eq('id', partnerId);
}

// Transform functions to convert from DB snake_case to camelCase
function transformPartnerFromDB(data: Record<string, unknown>): EducationPartner {
  return {
    id: data.id as string,
    institutionName: data.institution_name as string,
    institutionType: data.institution_type as string,
    website: data.website as string | undefined,
    logoUrl: data.logo_url as string | undefined,
    description: data.description as string | undefined,
    address: data.address as string | undefined,
    city: data.city as string | undefined,
    state: data.state as string | undefined,
    zipCode: data.zip_code as string | undefined,
    country: data.country as string | undefined,
    contactEmail: data.contact_email as string,
    contactPhone: data.contact_phone as string | undefined,
    tier: (data.tier as 'starter' | 'growth' | 'enterprise') || 'starter',
    status: (data.status as 'active' | 'suspended' | 'inactive') || 'active',
    approvedAt: data.approved_at as string | undefined,
    totalPrograms: (data.total_programs as number) || 0,
    totalStudentsReached: (data.total_students_reached as number) || 0,
    totalEmployerConnections: (data.total_employer_connections as number) || 0,
    averagePlacementRate: data.average_placement_rate as number | undefined,
    canListPrograms: (data.can_list_programs as boolean) ?? true,
    canHostEvents: (data.can_host_events as boolean) ?? false,
    canAccessEmployerNetwork: (data.can_access_employer_network as boolean) ?? true,
    canTrackOutcomes: (data.can_track_outcomes as boolean) ?? false,
    maxProgramListings: (data.max_program_listings as number) || 5,
    maxEventsPerYear: (data.max_events_per_year as number) || 0,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformProgramFromDB(data: Record<string, unknown>): PartnerProgram {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    name: data.name as string,
    programType: data.program_type as string,
    description: data.description as string | undefined,
    duration: data.duration as string | undefined,
    format: data.format as PartnerProgram['format'],
    accreditation: data.accreditation as string | undefined,
    enrollmentSize: data.enrollment_size ? parseInt(data.enrollment_size as string) : undefined,
    focusAreas: (data.focus_areas as string[]) || [],
    industries: (data.industries as string[]) || [],
    skills: (data.skills as string[]) || [],
    graduationRate: data.graduation_rate as number | undefined,
    placementRate: data.placement_rate as number | undefined,
    averageStartingSalary: data.average_starting_salary as number | undefined,
    tuitionCost: data.tuition_cost as number | undefined,
    financialAidAvailable: (data.financial_aid_available as boolean) || false,
    status: (data.status as PartnerProgram['status']) || 'draft',
    featured: (data.featured as boolean) || false,
    externalUrl: data.external_url as string | undefined,
    applicationUrl: data.application_url as string | undefined,
    publishedAt: data.published_at as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformEmployerConnectionFromDB(data: Record<string, unknown>): EmployerConnection {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    employerId: data.employer_id as string | undefined,
    employerName: data.employer_name as string,
    connectionType: data.connection_type as EmployerConnection['connectionType'],
    status: (data.status as EmployerConnection['status']) || 'pending',
    studentsPlaced: (data.students_placed as number) || 0,
    internshipsProvided: (data.internships_provided as number) || 0,
    eventsHosted: (data.events_hosted as number) || 0,
    establishedAt: data.established_at as string | undefined,
    lastActivityAt: data.last_activity_at as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformOutcomeFromDB(data: Record<string, unknown>): GraduateOutcome {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    programId: data.program_id as string | undefined,
    graduationYear: data.graduation_year as number,
    graduationTerm: data.graduation_term as string | undefined,
    cohortSize: data.cohort_size as number | undefined,
    employedCount: (data.employed_count as number) || 0,
    employedInFieldCount: (data.employed_in_field_count as number) || 0,
    continuingEducationCount: (data.continuing_education_count as number) || 0,
    notSeekingCount: (data.not_seeking_count as number) || 0,
    unknownCount: (data.unknown_count as number) || 0,
    averageSalary: data.average_salary as number | undefined,
    medianSalary: data.median_salary as number | undefined,
    salaryRangeMin: data.salary_range_min as number | undefined,
    salaryRangeMax: data.salary_range_max as number | undefined,
    placementRate: data.placement_rate as number | undefined,
    fieldPlacementRate: data.field_placement_rate as number | undefined,
    dataVerified: (data.data_verified as boolean) || false,
    verifiedAt: data.verified_at as string | undefined,
    verificationMethod: data.verification_method as string | undefined,
    topEmployers: (data.top_employers as GraduateOutcome['topEmployers']) || [],
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformEventFromDB(data: Record<string, unknown>): PartnerEvent {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    title: data.title as string,
    description: data.description as string | undefined,
    eventType: data.event_type as PartnerEvent['eventType'],
    format: data.format as PartnerEvent['format'],
    startTime: data.start_time as string,
    endTime: data.end_time as string,
    timezone: (data.timezone as string) || 'America/New_York',
    venueName: data.venue_name as string | undefined,
    address: data.address as string | undefined,
    city: data.city as string | undefined,
    state: data.state as string | undefined,
    virtualPlatform: data.virtual_platform as string | undefined,
    virtualLink: data.virtual_link as string | undefined,
    registrationRequired: (data.registration_required as boolean) ?? true,
    maxAttendees: data.max_attendees as number | undefined,
    registrationDeadline: data.registration_deadline as string | undefined,
    currentRegistrations: (data.current_registrations as number) || 0,
    status: (data.status as PartnerEvent['status']) || 'draft',
    publishedAt: data.published_at as string | undefined,
    participatingEmployers: (data.participating_employers as PartnerEvent['participatingEmployers']) || [],
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}
