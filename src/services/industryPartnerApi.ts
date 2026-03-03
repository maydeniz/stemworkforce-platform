// ===========================================
// Industry Partner API Service
// CRUD operations for employer/industry partners
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  IndustryPartner,
  JobPosting,
  JobStatus,
  JobFilters,
  Candidate,
  CandidateStage,
  CandidateSource,
  CandidateFilters,
  CandidateActivity,
  WorkBasedProgram,
  ProgramFilters,
  ProgramParticipant,
  RecruitingEvent,
  UniversityRelationship,
  CompanyProfile,
  RecruitingMetrics,
  SourcePerformance,
  PartnershipType
} from '@/types/industryPartner';

// ===========================================
// PARTNER PROFILE
// ===========================================

export async function getIndustryPartner(userId: string): Promise<IndustryPartner | null> {
  const { data, error } = await supabase
    .from('industry_partners')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching industry partner:', error);
    return null;
  }

  return transformPartnerFromDB(data);
}

export async function getIndustryPartnerById(partnerId: string): Promise<IndustryPartner | null> {
  const { data, error } = await supabase
    .from('industry_partners')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error || !data) {
    console.error('Error fetching industry partner:', error);
    return null;
  }

  return transformPartnerFromDB(data);
}

export async function updateIndustryPartner(
  partnerId: string,
  updates: Partial<IndustryPartner>
): Promise<boolean> {
  const updateData: Record<string, unknown> = {};

  if (updates.companyName) updateData.company_name = updates.companyName;
  if (updates.industry) updateData.industry = updates.industry;
  if (updates.companySize) updateData.company_size = updates.companySize;
  if (updates.headquarters) updateData.headquarters = updates.headquarters;
  if (updates.website) updateData.website = updates.website;
  if (updates.logoUrl) updateData.logo_url = updates.logoUrl;
  if (updates.description) updateData.description = updates.description;
  if (updates.partnershipTypes) updateData.partnership_types = updates.partnershipTypes;
  if (updates.primaryContactName) updateData.primary_contact_name = updates.primaryContactName;
  if (updates.primaryContactEmail) updateData.primary_contact_email = updates.primaryContactEmail;
  if (updates.primaryContactPhone) updateData.primary_contact_phone = updates.primaryContactPhone;
  if (updates.primaryContactTitle) updateData.primary_contact_title = updates.primaryContactTitle;

  const { error } = await supabase
    .from('industry_partners')
    .update(updateData)
    .eq('id', partnerId);

  if (error) {
    console.error('Error updating industry partner:', error);
    return false;
  }

  return true;
}

// ===========================================
// JOB POSTINGS
// ===========================================

export async function getJobPostings(
  partnerId: string,
  filters?: JobFilters
): Promise<JobPosting[]> {
  let query = supabase
    .from('employer_job_postings')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.status?.length) {
    query = query.in('status', filters.status);
  }
  if (filters?.jobType?.length) {
    query = query.in('job_type', filters.jobType);
  }
  if (filters?.experienceLevel?.length) {
    query = query.in('experience_level', filters.experienceLevel);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching job postings:', error);
    return [];
  }

  return (data || []).map(transformJobFromDB);
}

export async function getJobPosting(jobId: string): Promise<JobPosting | null> {
  const { data, error } = await supabase
    .from('employer_job_postings')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error || !data) {
    console.error('Error fetching job posting:', error);
    return null;
  }

  return transformJobFromDB(data);
}

export async function createJobPosting(
  partnerId: string,
  job: Omit<JobPosting, 'id' | 'partnerId' | 'viewCount' | 'applicationCount' | 'createdAt' | 'updatedAt'>
): Promise<JobPosting | null> {
  const { data, error } = await supabase
    .from('employer_job_postings')
    .insert({
      partner_id: partnerId,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      job_type: job.jobType,
      experience_level: job.experienceLevel,
      work_location: job.workLocation,
      department: job.department,
      city: job.city,
      state: job.state,
      country: job.country,
      remote_allowed: job.remoteAllowed,
      salary_min: job.salaryMin,
      salary_max: job.salaryMax,
      salary_type: job.salaryType,
      show_salary: job.showSalary,
      benefits: job.benefits,
      required_skills: job.requiredSkills,
      preferred_skills: job.preferredSkills,
      education_requirement: job.educationRequirement,
      clearance_required: job.clearanceRequired,
      status: job.status,
      featured: job.featured,
      application_url: job.applicationUrl,
      application_email: job.applicationEmail,
      expires_at: job.expiresAt
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating job posting:', error);
    return null;
  }

  return transformJobFromDB(data);
}

export async function updateJobPosting(
  jobId: string,
  updates: Partial<JobPosting>
): Promise<boolean> {
  const updateData: Record<string, unknown> = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.requirements !== undefined) updateData.requirements = updates.requirements;
  if (updates.responsibilities !== undefined) updateData.responsibilities = updates.responsibilities;
  if (updates.jobType !== undefined) updateData.job_type = updates.jobType;
  if (updates.experienceLevel !== undefined) updateData.experience_level = updates.experienceLevel;
  if (updates.workLocation !== undefined) updateData.work_location = updates.workLocation;
  if (updates.department !== undefined) updateData.department = updates.department;
  if (updates.city !== undefined) updateData.city = updates.city;
  if (updates.state !== undefined) updateData.state = updates.state;
  if (updates.country !== undefined) updateData.country = updates.country;
  if (updates.remoteAllowed !== undefined) updateData.remote_allowed = updates.remoteAllowed;
  if (updates.salaryMin !== undefined) updateData.salary_min = updates.salaryMin;
  if (updates.salaryMax !== undefined) updateData.salary_max = updates.salaryMax;
  if (updates.salaryType !== undefined) updateData.salary_type = updates.salaryType;
  if (updates.showSalary !== undefined) updateData.show_salary = updates.showSalary;
  if (updates.benefits !== undefined) updateData.benefits = updates.benefits;
  if (updates.requiredSkills !== undefined) updateData.required_skills = updates.requiredSkills;
  if (updates.preferredSkills !== undefined) updateData.preferred_skills = updates.preferredSkills;
  if (updates.educationRequirement !== undefined) updateData.education_requirement = updates.educationRequirement;
  if (updates.clearanceRequired !== undefined) updateData.clearance_required = updates.clearanceRequired;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.featured !== undefined) updateData.featured = updates.featured;
  if (updates.applicationUrl !== undefined) updateData.application_url = updates.applicationUrl;
  if (updates.applicationEmail !== undefined) updateData.application_email = updates.applicationEmail;
  if (updates.expiresAt !== undefined) updateData.expires_at = updates.expiresAt;
  if (updates.publishedAt !== undefined) updateData.published_at = updates.publishedAt;

  const { error } = await supabase
    .from('employer_job_postings')
    .update(updateData)
    .eq('id', jobId);

  if (error) {
    console.error('Error updating job posting:', error);
    return false;
  }

  return true;
}

export async function deleteJobPosting(jobId: string): Promise<boolean> {
  const { error } = await supabase
    .from('employer_job_postings')
    .delete()
    .eq('id', jobId);

  if (error) {
    console.error('Error deleting job posting:', error);
    return false;
  }

  return true;
}

export async function publishJobPosting(jobId: string): Promise<boolean> {
  return updateJobPosting(jobId, {
    status: 'active' as JobStatus,
    publishedAt: new Date().toISOString()
  });
}

// ===========================================
// CANDIDATES
// ===========================================

export async function getCandidates(
  partnerId: string,
  filters?: CandidateFilters
): Promise<Candidate[]> {
  let query = supabase
    .from('employer_candidates')
    .select('*')
    .eq('partner_id', partnerId)
    .order('applied_at', { ascending: false });

  if (filters?.stage?.length) {
    query = query.in('stage', filters.stage);
  }
  if (filters?.source?.length) {
    query = query.in('source', filters.source);
  }
  if (filters?.jobPostingId) {
    query = query.eq('job_posting_id', filters.jobPostingId);
  }
  if (filters?.minFitScore) {
    query = query.gte('fit_score', filters.minFitScore);
  }
  if (filters?.search) {
    query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }

  return (data || []).map(transformCandidateFromDB);
}

export async function getCandidate(candidateId: string): Promise<Candidate | null> {
  const { data, error } = await supabase
    .from('employer_candidates')
    .select('*')
    .eq('id', candidateId)
    .single();

  if (error || !data) {
    console.error('Error fetching candidate:', error);
    return null;
  }

  return transformCandidateFromDB(data);
}

export async function updateCandidateStage(
  candidateId: string,
  stage: CandidateStage,
  performedBy: string
): Promise<boolean> {
  const { error: updateError } = await supabase
    .from('employer_candidates')
    .update({ stage, last_activity_at: new Date().toISOString() })
    .eq('id', candidateId);

  if (updateError) {
    console.error('Error updating candidate stage:', updateError);
    return false;
  }

  // Log activity
  await supabase.from('candidate_activities').insert({
    candidate_id: candidateId,
    activity_type: 'stage_change',
    description: `Stage changed to ${stage}`,
    performed_by: performedBy
  });

  return true;
}

export async function addCandidateNote(
  candidateId: string,
  note: string,
  performedBy: string
): Promise<boolean> {
  // Get current notes
  const { data: candidate } = await supabase
    .from('employer_candidates')
    .select('notes')
    .eq('id', candidateId)
    .single();

  const existingNotes = candidate?.notes || '';
  const newNotes = existingNotes
    ? `${existingNotes}\n\n---\n${new Date().toISOString()}\n${note}`
    : note;

  const { error } = await supabase
    .from('employer_candidates')
    .update({ notes: newNotes, last_activity_at: new Date().toISOString() })
    .eq('id', candidateId);

  if (error) {
    console.error('Error adding candidate note:', error);
    return false;
  }

  // Log activity
  await supabase.from('candidate_activities').insert({
    candidate_id: candidateId,
    activity_type: 'note_added',
    description: 'Note added',
    performed_by: performedBy
  });

  return true;
}

export async function getCandidateActivities(candidateId: string): Promise<CandidateActivity[]> {
  const { data, error } = await supabase
    .from('candidate_activities')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching candidate activities:', error);
    return [];
  }

  return (data || []).map(transformActivityFromDB);
}

// ===========================================
// WORK-BASED PROGRAMS
// ===========================================

export async function getWorkBasedPrograms(
  partnerId: string,
  filters?: ProgramFilters
): Promise<WorkBasedProgram[]> {
  let query = supabase
    .from('work_based_programs')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.programType?.length) {
    query = query.in('program_type', filters.programType);
  }
  if (filters?.status?.length) {
    query = query.in('status', filters.status);
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return (data || []).map(transformProgramFromDB);
}

export async function createWorkBasedProgram(
  partnerId: string,
  program: Omit<WorkBasedProgram, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<WorkBasedProgram | null> {
  const { data, error } = await supabase
    .from('work_based_programs')
    .insert({
      partner_id: partnerId,
      name: program.name,
      program_type: program.programType,
      description: program.description,
      department: program.department,
      location: program.location,
      is_remote: program.isRemote,
      duration: program.duration,
      hours_per_week: program.hoursPerWeek,
      is_paid: program.isPaid,
      compensation: program.compensation,
      compensation_type: program.compensationType,
      start_date: program.startDate,
      end_date: program.endDate,
      application_deadline: program.applicationDeadline,
      required_majors: program.requiredMajors,
      required_skills: program.requiredSkills,
      minimum_gpa: program.minimumGpa,
      eligibility_requirements: program.eligibilityRequirements,
      total_positions: program.totalPositions,
      filled_positions: program.filledPositions,
      dol_registered: program.dolRegistered,
      dol_registration_number: program.dolRegistrationNumber,
      related_technical_instruction: program.relatedTechnicalInstruction,
      status: program.status
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating program:', error);
    return null;
  }

  return transformProgramFromDB(data);
}

export async function updateWorkBasedProgram(
  programId: string,
  updates: Partial<WorkBasedProgram>
): Promise<boolean> {
  const updateData: Record<string, unknown> = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.programType !== undefined) updateData.program_type = updates.programType;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.department !== undefined) updateData.department = updates.department;
  if (updates.location !== undefined) updateData.location = updates.location;
  if (updates.isRemote !== undefined) updateData.is_remote = updates.isRemote;
  if (updates.duration !== undefined) updateData.duration = updates.duration;
  if (updates.hoursPerWeek !== undefined) updateData.hours_per_week = updates.hoursPerWeek;
  if (updates.isPaid !== undefined) updateData.is_paid = updates.isPaid;
  if (updates.compensation !== undefined) updateData.compensation = updates.compensation;
  if (updates.compensationType !== undefined) updateData.compensation_type = updates.compensationType;
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate;
  if (updates.applicationDeadline !== undefined) updateData.application_deadline = updates.applicationDeadline;
  if (updates.requiredMajors !== undefined) updateData.required_majors = updates.requiredMajors;
  if (updates.requiredSkills !== undefined) updateData.required_skills = updates.requiredSkills;
  if (updates.minimumGpa !== undefined) updateData.minimum_gpa = updates.minimumGpa;
  if (updates.eligibilityRequirements !== undefined) updateData.eligibility_requirements = updates.eligibilityRequirements;
  if (updates.totalPositions !== undefined) updateData.total_positions = updates.totalPositions;
  if (updates.filledPositions !== undefined) updateData.filled_positions = updates.filledPositions;
  if (updates.dolRegistered !== undefined) updateData.dol_registered = updates.dolRegistered;
  if (updates.dolRegistrationNumber !== undefined) updateData.dol_registration_number = updates.dolRegistrationNumber;
  if (updates.relatedTechnicalInstruction !== undefined) updateData.related_technical_instruction = updates.relatedTechnicalInstruction;
  if (updates.status !== undefined) updateData.status = updates.status;

  const { error } = await supabase
    .from('work_based_programs')
    .update(updateData)
    .eq('id', programId);

  if (error) {
    console.error('Error updating program:', error);
    return false;
  }

  return true;
}

export async function deleteWorkBasedProgram(programId: string): Promise<boolean> {
  const { error } = await supabase
    .from('work_based_programs')
    .delete()
    .eq('id', programId);

  if (error) {
    console.error('Error deleting program:', error);
    return false;
  }

  return true;
}

export async function getProgramParticipants(programId: string): Promise<ProgramParticipant[]> {
  const { data, error } = await supabase
    .from('program_participants')
    .select('*')
    .eq('program_id', programId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching participants:', error);
    return [];
  }

  return (data || []).map(transformParticipantFromDB);
}

// ===========================================
// RECRUITING EVENTS
// ===========================================

export async function getRecruitingEvents(partnerId: string): Promise<RecruitingEvent[]> {
  const { data, error } = await supabase
    .from('recruiting_events')
    .select('*')
    .eq('partner_id', partnerId)
    .order('start_datetime', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return (data || []).map(transformEventFromDB);
}

export async function createRecruitingEvent(
  partnerId: string,
  event: Omit<RecruitingEvent, 'id' | 'partnerId' | 'currentRegistrations' | 'createdAt' | 'updatedAt'>
): Promise<RecruitingEvent | null> {
  const { data, error } = await supabase
    .from('recruiting_events')
    .insert({
      partner_id: partnerId,
      name: event.name,
      event_type: event.eventType,
      description: event.description,
      format: event.format,
      venue: event.venue,
      city: event.city,
      state: event.state,
      virtual_link: event.virtualLink,
      start_datetime: event.startDateTime,
      end_datetime: event.endDateTime,
      timezone: event.timezone,
      max_registrations: event.maxRegistrations,
      registration_deadline: event.registrationDeadline,
      is_sponsor: event.isSponsor,
      sponsorship_tier: event.sponsorshipTier,
      sponsorship_cost: event.sponsorshipCost,
      status: event.status
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating event:', error);
    return null;
  }

  return transformEventFromDB(data);
}

export async function updateRecruitingEvent(
  eventId: string,
  updates: Partial<RecruitingEvent>
): Promise<boolean> {
  const updateData: Record<string, unknown> = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.eventType !== undefined) updateData.event_type = updates.eventType;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.format !== undefined) updateData.format = updates.format;
  if (updates.venue !== undefined) updateData.venue = updates.venue;
  if (updates.city !== undefined) updateData.city = updates.city;
  if (updates.state !== undefined) updateData.state = updates.state;
  if (updates.virtualLink !== undefined) updateData.virtual_link = updates.virtualLink;
  if (updates.startDateTime !== undefined) updateData.start_datetime = updates.startDateTime;
  if (updates.endDateTime !== undefined) updateData.end_datetime = updates.endDateTime;
  if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
  if (updates.maxRegistrations !== undefined) updateData.max_registrations = updates.maxRegistrations;
  if (updates.registrationDeadline !== undefined) updateData.registration_deadline = updates.registrationDeadline;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.attendeeCount !== undefined) updateData.attendee_count = updates.attendeeCount;
  if (updates.leadsGenerated !== undefined) updateData.leads_generated = updates.leadsGenerated;

  const { error } = await supabase
    .from('recruiting_events')
    .update(updateData)
    .eq('id', eventId);

  if (error) {
    console.error('Error updating event:', error);
    return false;
  }

  return true;
}

export async function deleteRecruitingEvent(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('recruiting_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    return false;
  }

  return true;
}

// ===========================================
// UNIVERSITY RELATIONSHIPS
// ===========================================

export async function getUniversityRelationships(partnerId: string): Promise<UniversityRelationship[]> {
  const { data, error } = await supabase
    .from('university_relationships')
    .select('*')
    .eq('partner_id', partnerId)
    .order('institution_name', { ascending: true });

  if (error) {
    console.error('Error fetching university relationships:', error);
    return [];
  }

  return (data || []).map(transformUniversityRelFromDB);
}

export async function createUniversityRelationship(
  partnerId: string,
  relationship: Omit<UniversityRelationship, 'id' | 'partnerId' | 'hiresFromInstitution' | 'internsFromInstitution' | 'eventsAttended' | 'createdAt' | 'updatedAt'>
): Promise<UniversityRelationship | null> {
  const { data, error } = await supabase
    .from('university_relationships')
    .insert({
      partner_id: partnerId,
      institution_id: relationship.institutionId,
      institution_name: relationship.institutionName,
      status: relationship.status,
      partnership_type: relationship.partnershipType,
      primary_contact: relationship.primaryContact,
      target_programs: relationship.targetPrograms,
      target_majors: relationship.targetMajors,
      last_contact_date: relationship.lastContactDate,
      next_follow_up_date: relationship.nextFollowUpDate,
      notes: relationship.notes
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating university relationship:', error);
    return null;
  }

  return transformUniversityRelFromDB(data);
}

export async function updateUniversityRelationship(
  relationshipId: string,
  updates: Partial<UniversityRelationship>
): Promise<boolean> {
  const updateData: Record<string, unknown> = {};

  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.partnershipType !== undefined) updateData.partnership_type = updates.partnershipType;
  if (updates.primaryContact !== undefined) updateData.primary_contact = updates.primaryContact;
  if (updates.targetPrograms !== undefined) updateData.target_programs = updates.targetPrograms;
  if (updates.targetMajors !== undefined) updateData.target_majors = updates.targetMajors;
  if (updates.lastContactDate !== undefined) updateData.last_contact_date = updates.lastContactDate;
  if (updates.nextFollowUpDate !== undefined) updateData.next_follow_up_date = updates.nextFollowUpDate;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.hiresFromInstitution !== undefined) updateData.hires_from_institution = updates.hiresFromInstitution;
  if (updates.internsFromInstitution !== undefined) updateData.interns_from_institution = updates.internsFromInstitution;
  if (updates.eventsAttended !== undefined) updateData.events_attended = updates.eventsAttended;

  const { error } = await supabase
    .from('university_relationships')
    .update(updateData)
    .eq('id', relationshipId);

  if (error) {
    console.error('Error updating university relationship:', error);
    return false;
  }

  return true;
}

// ===========================================
// COMPANY PROFILE
// ===========================================

export async function getCompanyProfile(partnerId: string): Promise<CompanyProfile | null> {
  const { data, error } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('partner_id', partnerId)
    .single();

  if (error || !data) {
    // Profile might not exist yet
    return null;
  }

  return transformCompanyProfileFromDB(data);
}

export async function upsertCompanyProfile(
  partnerId: string,
  profile: Omit<CompanyProfile, 'partnerId' | 'updatedAt'>
): Promise<boolean> {
  const { error } = await supabase
    .from('company_profiles')
    .upsert({
      partner_id: partnerId,
      tagline: profile.tagline,
      about_us: profile.aboutUs,
      mission_statement: profile.missionStatement,
      logo_url: profile.logoUrl,
      cover_image_url: profile.coverImageUrl,
      video_url: profile.videoUrl,
      photos: profile.photos,
      culture_highlights: profile.cultureHighlights,
      perks: profile.perks,
      tech_stack: profile.techStack,
      awards: profile.awards,
      press_features: profile.pressFeatures,
      testimonials: profile.testimonials,
      dei_statement: profile.deiStatement,
      employee_resource_groups: profile.employeeResourceGroups,
      diversity_stats: profile.diversityStats
    });

  if (error) {
    console.error('Error upserting company profile:', error);
    return false;
  }

  return true;
}

// ===========================================
// ANALYTICS & METRICS
// ===========================================

export async function getRecruitingMetrics(partnerId: string): Promise<RecruitingMetrics> {
  // Get candidates by stage
  const { data: candidates } = await supabase
    .from('employer_candidates')
    .select('stage, source')
    .eq('partner_id', partnerId);

  // Get job postings
  const { data: jobs } = await supabase
    .from('employer_job_postings')
    .select('status, application_count')
    .eq('partner_id', partnerId);

  // Get programs
  const { data: programs } = await supabase
    .from('work_based_programs')
    .select('status, program_type')
    .eq('partner_id', partnerId);

  // Get events
  const { data: events } = await supabase
    .from('recruiting_events')
    .select('status, leads_generated')
    .eq('partner_id', partnerId);

  // Calculate metrics
  const candidatesByStage: Record<CandidateStage, number> = {
    new: 0, reviewed: 0, screened: 0, interviewing: 0,
    offered: 0, hired: 0, rejected: 0, withdrawn: 0
  };
  const candidatesBySource: Record<string, number> = {
    platform: 0, career_fair: 0, university: 0, referral: 0, direct: 0, other: 0
  };

  (candidates || []).forEach(c => {
    candidatesByStage[c.stage as CandidateStage] = (candidatesByStage[c.stage as CandidateStage] || 0) + 1;
    candidatesBySource[c.source] = (candidatesBySource[c.source] || 0) + 1;
  });

  const activeJobs = (jobs || []).filter(j => j.status === 'active').length;
  const totalApplications = (jobs || []).reduce((sum, j) => sum + (j.application_count || 0), 0);
  const hiresYTD = candidatesByStage.hired;

  const activeInterns = (programs || []).filter(p =>
    p.status === 'active' && ['internship', 'apprenticeship', 'co_op'].includes(p.program_type)
  ).length;

  const completedEvents = (events || []).filter(e => e.status === 'completed').length;
  const leadsFromEvents = (events || []).reduce((sum, e) => sum + (e.leads_generated || 0), 0);

  return {
    totalCandidates: candidates?.length || 0,
    candidatesByStage,
    candidatesBySource: candidatesBySource as Record<CandidateSource, number>,
    activeJobPostings: activeJobs,
    totalApplications,
    averageTimeToFill: 45, // Placeholder - would calculate from actual data
    hiresYTD,
    hiresVsGoal: hiresYTD > 0 ? 85 : 0, // Placeholder
    costPerHire: 2500, // Placeholder
    activeInterns,
    conversionRate: 78, // Placeholder
    eventsAttended: completedEvents,
    leadsFromEvents,
    eventROI: leadsFromEvents > 0 ? 3.2 : 0 // Placeholder
  };
}

export async function getSourcePerformance(partnerId: string): Promise<SourcePerformance[]> {
  const { data: candidates } = await supabase
    .from('employer_candidates')
    .select('source, stage')
    .eq('partner_id', partnerId);

  const sourceMap: Record<string, { applications: number; hires: number }> = {};

  (candidates || []).forEach(c => {
    if (!sourceMap[c.source]) {
      sourceMap[c.source] = { applications: 0, hires: 0 };
    }
    sourceMap[c.source].applications++;
    if (c.stage === 'hired') {
      sourceMap[c.source].hires++;
    }
  });

  const sourceNames: Record<string, string> = {
    platform: 'Platform Direct',
    career_fair: 'Career Fairs',
    university: 'University Partners',
    referral: 'Employee Referrals',
    direct: 'Direct Applications',
    other: 'Other Sources'
  };

  return Object.entries(sourceMap).map(([source, data]) => ({
    source: source as CandidateSource,
    sourceName: sourceNames[source] || source,
    applications: data.applications,
    hires: data.hires,
    conversionRate: data.applications > 0 ? (data.hires / data.applications) * 100 : 0,
    costPerHire: data.hires > 0 ? Math.round(2500 / data.hires * data.applications) : 0,
    averageTimeToHire: 45 // Placeholder
  }));
}

// ===========================================
// TRANSFORM FUNCTIONS
// ===========================================

function transformPartnerFromDB(data: Record<string, unknown>): IndustryPartner {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    companyName: data.company_name as string,
    industry: data.industry as string,
    companySize: data.company_size as string,
    headquarters: data.headquarters as string,
    website: data.website as string | undefined,
    logoUrl: data.logo_url as string | undefined,
    description: data.description as string | undefined,
    partnershipTypes: (data.partnership_types as PartnershipType[]) || [],
    tier: (data.tier as IndustryPartner['tier']) || 'starter',
    status: (data.status as IndustryPartner['status']) || 'pending',
    primaryContactName: data.primary_contact_name as string,
    primaryContactEmail: data.primary_contact_email as string,
    primaryContactPhone: data.primary_contact_phone as string | undefined,
    primaryContactTitle: data.primary_contact_title as string | undefined,
    stripeCustomerId: data.stripe_customer_id as string | undefined,
    subscriptionStatus: (data.subscription_status as IndustryPartner['subscriptionStatus']) || 'free',
    approvedAt: data.approved_at as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformJobFromDB(data: Record<string, unknown>): JobPosting {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    title: data.title as string,
    description: data.description as string,
    requirements: (data.requirements as string[]) || [],
    responsibilities: (data.responsibilities as string[]) || [],
    jobType: (data.job_type as JobPosting['jobType']) || 'full_time',
    experienceLevel: (data.experience_level as JobPosting['experienceLevel']) || 'entry',
    workLocation: (data.work_location as JobPosting['workLocation']) || 'onsite',
    department: data.department as string | undefined,
    city: data.city as string | undefined,
    state: data.state as string | undefined,
    country: (data.country as string) || 'USA',
    remoteAllowed: (data.remote_allowed as boolean) || false,
    salaryMin: data.salary_min as number | undefined,
    salaryMax: data.salary_max as number | undefined,
    salaryType: (data.salary_type as JobPosting['salaryType']) || 'annual',
    showSalary: (data.show_salary as boolean) || true,
    benefits: (data.benefits as string[]) || [],
    requiredSkills: (data.required_skills as string[]) || [],
    preferredSkills: (data.preferred_skills as string[]) || [],
    educationRequirement: data.education_requirement as string | undefined,
    clearanceRequired: data.clearance_required as string | undefined,
    status: (data.status as JobPosting['status']) || 'draft',
    featured: (data.featured as boolean) || false,
    applicationUrl: data.application_url as string | undefined,
    applicationEmail: data.application_email as string | undefined,
    viewCount: (data.view_count as number) || 0,
    applicationCount: (data.application_count as number) || 0,
    publishedAt: data.published_at as string | undefined,
    expiresAt: data.expires_at as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformCandidateFromDB(data: Record<string, unknown>): Candidate {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    jobPostingId: data.job_posting_id as string | undefined,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    email: data.email as string,
    phone: data.phone as string | undefined,
    linkedinUrl: data.linkedin_url as string | undefined,
    portfolioUrl: data.portfolio_url as string | undefined,
    resumeUrl: data.resume_url as string | undefined,
    education: (data.education as Candidate['education']) || [],
    currentTitle: data.current_title as string | undefined,
    currentCompany: data.current_company as string | undefined,
    yearsOfExperience: (data.years_of_experience as number) || 0,
    skills: (data.skills as string[]) || [],
    certifications: (data.certifications as string[]) || [],
    stage: (data.stage as Candidate['stage']) || 'new',
    source: (data.source as Candidate['source']) || 'platform',
    sourceDetail: data.source_detail as string | undefined,
    fitScore: data.fit_score as number | undefined,
    notes: data.notes as string | undefined,
    tags: (data.tags as string[]) || [],
    appliedAt: data.applied_at as string,
    lastActivityAt: data.last_activity_at as string,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformActivityFromDB(data: Record<string, unknown>): CandidateActivity {
  return {
    id: data.id as string,
    candidateId: data.candidate_id as string,
    activityType: data.activity_type as CandidateActivity['activityType'],
    description: data.description as string,
    metadata: data.metadata as Record<string, unknown> | undefined,
    performedBy: data.performed_by as string,
    createdAt: data.created_at as string
  };
}

function transformProgramFromDB(data: Record<string, unknown>): WorkBasedProgram {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    name: data.name as string,
    programType: (data.program_type as WorkBasedProgram['programType']) || 'internship',
    description: data.description as string,
    department: data.department as string,
    location: data.location as string,
    isRemote: (data.is_remote as boolean) || false,
    duration: data.duration as string,
    hoursPerWeek: (data.hours_per_week as number) || 40,
    isPaid: (data.is_paid as boolean) || true,
    compensation: data.compensation as number | undefined,
    compensationType: data.compensation_type as WorkBasedProgram['compensationType'] | undefined,
    startDate: data.start_date as string,
    endDate: data.end_date as string,
    applicationDeadline: data.application_deadline as string,
    requiredMajors: (data.required_majors as string[]) || [],
    requiredSkills: (data.required_skills as string[]) || [],
    minimumGpa: data.minimum_gpa as number | undefined,
    eligibilityRequirements: (data.eligibility_requirements as string[]) || [],
    totalPositions: (data.total_positions as number) || 1,
    filledPositions: (data.filled_positions as number) || 0,
    dolRegistered: (data.dol_registered as boolean) || false,
    dolRegistrationNumber: data.dol_registration_number as string | undefined,
    relatedTechnicalInstruction: data.related_technical_instruction as string | undefined,
    status: (data.status as WorkBasedProgram['status']) || 'planning',
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformParticipantFromDB(data: Record<string, unknown>): ProgramParticipant {
  return {
    id: data.id as string,
    programId: data.program_id as string,
    candidateId: data.candidate_id as string,
    mentorId: data.mentor_id as string | undefined,
    mentorName: data.mentor_name as string | undefined,
    supervisorId: data.supervisor_id as string | undefined,
    supervisorName: data.supervisor_name as string | undefined,
    startDate: data.start_date as string,
    expectedEndDate: data.expected_end_date as string,
    actualEndDate: data.actual_end_date as string | undefined,
    status: (data.status as ProgramParticipant['status']) || 'pending',
    midpointEvaluation: data.midpoint_evaluation as ProgramParticipant['midpointEvaluation'] | undefined,
    finalEvaluation: data.final_evaluation as ProgramParticipant['finalEvaluation'] | undefined,
    convertedToFullTime: (data.converted_to_full_time as boolean) || false,
    conversionDate: data.conversion_date as string | undefined,
    conversionRole: data.conversion_role as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformEventFromDB(data: Record<string, unknown>): RecruitingEvent {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    name: data.name as string,
    eventType: (data.event_type as RecruitingEvent['eventType']) || 'career_fair',
    description: data.description as string | undefined,
    format: (data.format as RecruitingEvent['format']) || 'virtual',
    venue: data.venue as string | undefined,
    city: data.city as string | undefined,
    state: data.state as string | undefined,
    virtualLink: data.virtual_link as string | undefined,
    startDateTime: data.start_datetime as string,
    endDateTime: data.end_datetime as string,
    timezone: (data.timezone as string) || 'America/New_York',
    maxRegistrations: data.max_registrations as number | undefined,
    currentRegistrations: (data.current_registrations as number) || 0,
    registrationDeadline: data.registration_deadline as string | undefined,
    isSponsor: (data.is_sponsor as boolean) || false,
    sponsorshipTier: data.sponsorship_tier as string | undefined,
    sponsorshipCost: data.sponsorship_cost as number | undefined,
    status: (data.status as RecruitingEvent['status']) || 'upcoming',
    attendeeCount: data.attendee_count as number | undefined,
    leadsGenerated: data.leads_generated as number | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformUniversityRelFromDB(data: Record<string, unknown>): UniversityRelationship {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    institutionId: data.institution_id as string | undefined,
    institutionName: data.institution_name as string,
    status: (data.status as UniversityRelationship['status']) || 'prospect',
    partnershipType: (data.partnership_type as UniversityRelationship['partnershipType']) || 'recruiting',
    primaryContact: data.primary_contact as UniversityRelationship['primaryContact'] | undefined,
    targetPrograms: (data.target_programs as string[]) || [],
    targetMajors: (data.target_majors as string[]) || [],
    lastContactDate: data.last_contact_date as string | undefined,
    nextFollowUpDate: data.next_follow_up_date as string | undefined,
    notes: data.notes as string | undefined,
    hiresFromInstitution: (data.hires_from_institution as number) || 0,
    internsFromInstitution: (data.interns_from_institution as number) || 0,
    eventsAttended: (data.events_attended as number) || 0,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformCompanyProfileFromDB(data: Record<string, unknown>): CompanyProfile {
  return {
    partnerId: data.partner_id as string,
    tagline: data.tagline as string | undefined,
    aboutUs: data.about_us as string | undefined,
    missionStatement: data.mission_statement as string | undefined,
    logoUrl: data.logo_url as string | undefined,
    coverImageUrl: data.cover_image_url as string | undefined,
    videoUrl: data.video_url as string | undefined,
    photos: (data.photos as string[]) || [],
    cultureHighlights: (data.culture_highlights as string[]) || [],
    perks: (data.perks as string[]) || [],
    techStack: (data.tech_stack as string[]) || [],
    awards: (data.awards as CompanyProfile['awards']) || [],
    pressFeatures: (data.press_features as CompanyProfile['pressFeatures']) || [],
    testimonials: (data.testimonials as CompanyProfile['testimonials']) || [],
    deiStatement: data.dei_statement as string | undefined,
    employeeResourceGroups: (data.employee_resource_groups as string[]) || [],
    diversityStats: (data.diversity_stats as CompanyProfile['diversityStats']) || [],
    updatedAt: data.updated_at as string
  };
}
