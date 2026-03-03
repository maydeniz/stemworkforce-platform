// ===========================================
// National Labs Partner API Service
// CRUD operations for national labs partners
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  NationalLabsPartner,
  ClearancePosition,
  ClearanceCandidate,
  ClearanceCandidateFilters,
  PositionFilters,
  FellowshipProgram,
  FellowshipFilters,
  Fellow,
  FellowFilters,
  PrincipalInvestigator,
  PIFilters,
  ResearchCollaboration,
  ComplianceRecord,
  ComplianceAuditLog,
  LabDashboardMetrics,
  ClearanceType,
  ClearanceStatus,
  LabPartnerTier
} from '@/types/nationalLabsPartner';

// ===========================================
// PARTNER PROFILE
// ===========================================

export async function getNationalLabsPartner(userId: string): Promise<NationalLabsPartner | null> {
  const { data, error } = await supabase
    .from('national_labs_partners')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching national labs partner:', error);
    return null;
  }

  return transformPartnerFromDB(data);
}

export async function getNationalLabsPartnerById(partnerId: string): Promise<NationalLabsPartner | null> {
  const { data, error } = await supabase
    .from('national_labs_partners')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error || !data) {
    console.error('Error fetching national labs partner by ID:', error);
    return null;
  }

  return transformPartnerFromDB(data);
}

export async function updateNationalLabsPartner(
  partnerId: string,
  updates: Partial<NationalLabsPartner>
): Promise<boolean> {
  const dbUpdates = transformPartnerToDB(updates);

  const { error } = await supabase
    .from('national_labs_partners')
    .update(dbUpdates)
    .eq('id', partnerId);

  if (error) {
    console.error('Error updating national labs partner:', error);
    return false;
  }

  return true;
}

// ===========================================
// CLEARANCE POSITIONS
// ===========================================

export async function getClearancePositions(partnerId: string, filters?: PositionFilters): Promise<ClearancePosition[]> {
  let query = supabase
    .from('clearance_positions')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.requiredClearance) {
    query = query.eq('required_clearance', filters.requiredClearance);
  }
  if (filters?.exportControlled !== undefined) {
    query = query.eq('export_controlled', filters.exportControlled);
  }
  if (filters?.searchQuery) {
    query = query.ilike('title', `%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching clearance positions:', error);
    return [];
  }

  return (data || []).map(transformPositionFromDB);
}

export async function createClearancePosition(
  partnerId: string,
  position: Omit<ClearancePosition, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<ClearancePosition | null> {
  const dbData = {
    partner_id: partnerId,
    title: position.title,
    department: position.department,
    division: position.division,
    required_clearance: position.requiredClearance,
    polygraph_required: position.polygraphRequired,
    citizenship_required: position.citizenshipRequired,
    export_controlled: position.exportControlled,
    description: position.description,
    requirements: position.requirements,
    location: position.location,
    remote: position.remote,
    salary_min: position.salaryMin,
    salary_max: position.salaryMax,
    status: position.status,
    openings: position.openings,
    posted_date: position.postedDate
  };

  const { data, error } = await supabase
    .from('clearance_positions')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating clearance position:', error);
    return null;
  }

  return transformPositionFromDB(data);
}

export async function updateClearancePosition(
  positionId: string,
  updates: Partial<ClearancePosition>
): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {};

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.department !== undefined) dbUpdates.department = updates.department;
  if (updates.division !== undefined) dbUpdates.division = updates.division;
  if (updates.requiredClearance !== undefined) dbUpdates.required_clearance = updates.requiredClearance;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.openings !== undefined) dbUpdates.openings = updates.openings;
  if (updates.filledCount !== undefined) dbUpdates.filled_count = updates.filledCount;

  const { error } = await supabase
    .from('clearance_positions')
    .update(dbUpdates)
    .eq('id', positionId);

  if (error) {
    console.error('Error updating clearance position:', error);
    return false;
  }

  return true;
}

// ===========================================
// CLEARANCE CANDIDATES
// ===========================================

export async function getClearanceCandidates(partnerId: string, filters?: ClearanceCandidateFilters): Promise<ClearanceCandidate[]> {
  let query = supabase
    .from('clearance_candidates')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.targetClearanceType) {
    query = query.eq('target_clearance_type', filters.targetClearanceType);
  }
  if (filters?.currentStatus) {
    query = query.eq('current_clearance_status', filters.currentStatus);
  }
  if (filters?.citizenshipStatus) {
    query = query.eq('citizenship_status', filters.citizenshipStatus);
  }
  if (filters?.eligibilityAssessment) {
    query = query.eq('eligibility_assessment', filters.eligibilityAssessment);
  }
  if (filters?.positionId) {
    query = query.eq('position_id', filters.positionId);
  }
  if (filters?.searchQuery) {
    query = query.or(`first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,email.ilike.%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching clearance candidates:', error);
    return [];
  }

  return (data || []).map(transformCandidateFromDB);
}

export async function createClearanceCandidate(
  partnerId: string,
  candidate: Omit<ClearanceCandidate, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<ClearanceCandidate | null> {
  const dbData = {
    partner_id: partnerId,
    position_id: candidate.positionId,
    first_name: candidate.firstName,
    last_name: candidate.lastName,
    email: candidate.email,
    phone: candidate.phone,
    citizenship_status: candidate.citizenshipStatus,
    birth_country: candidate.birthCountry,
    dual_citizenship: candidate.dualCitizenship,
    foreign_contacts: candidate.foreignContacts,
    foreign_travel: candidate.foreignTravel,
    financial_issues: candidate.financialIssues,
    criminal_history: candidate.criminalHistory,
    drug_use: candidate.drugUse,
    sf86_readiness_score: candidate.sf86ReadinessScore,
    eligibility_assessment: candidate.eligibilityAssessment,
    risk_factors: candidate.riskFactors,
    recommendations: candidate.recommendations,
    target_clearance_type: candidate.targetClearanceType,
    current_clearance_status: candidate.currentClearanceStatus
  };

  const { data, error } = await supabase
    .from('clearance_candidates')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating clearance candidate:', error);
    return null;
  }

  return transformCandidateFromDB(data);
}

export async function updateClearanceCandidateStatus(
  candidateId: string,
  status: ClearanceStatus,
  additionalData?: Partial<ClearanceCandidate>
): Promise<boolean> {
  const updates: Record<string, unknown> = {
    current_clearance_status: status
  };

  if (status === 'sf86_submitted' && !additionalData?.sf86SubmittedDate) {
    updates.sf86_submitted_date = new Date().toISOString();
  }
  if (status === 'investigation' && !additionalData?.investigationStartDate) {
    updates.investigation_start_date = new Date().toISOString();
  }
  if (status === 'granted' && !additionalData?.clearanceGrantedDate) {
    updates.clearance_granted_date = new Date().toISOString();
  }

  if (additionalData) {
    if (additionalData.sf86SubmittedDate) updates.sf86_submitted_date = additionalData.sf86SubmittedDate;
    if (additionalData.investigationStartDate) updates.investigation_start_date = additionalData.investigationStartDate;
    if (additionalData.adjudicationDate) updates.adjudication_date = additionalData.adjudicationDate;
    if (additionalData.clearanceGrantedDate) updates.clearance_granted_date = additionalData.clearanceGrantedDate;
  }

  const { error } = await supabase
    .from('clearance_candidates')
    .update(updates)
    .eq('id', candidateId);

  if (error) {
    console.error('Error updating candidate status:', error);
    return false;
  }

  return true;
}

// ===========================================
// FELLOWSHIP PROGRAMS
// ===========================================

export async function getFellowshipPrograms(partnerId: string, filters?: FellowshipFilters): Promise<FellowshipProgram[]> {
  let query = supabase
    .from('fellowship_programs')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.programType) {
    query = query.eq('program_type', filters.programType);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.clearanceRequired) {
    query = query.eq('clearance_required', filters.clearanceRequired);
  }
  if (filters?.searchQuery) {
    query = query.ilike('name', `%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching fellowship programs:', error);
    return [];
  }

  return (data || []).map(transformProgramFromDB);
}

export async function createFellowshipProgram(
  partnerId: string,
  program: Omit<FellowshipProgram, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<FellowshipProgram | null> {
  const dbData = {
    partner_id: partnerId,
    name: program.name,
    program_type: program.programType,
    description: program.description,
    duration: program.duration,
    is_paid: program.isPaid,
    stipend_amount: program.stipendAmount,
    housing_provided: program.housingProvided,
    relocation_assistance: program.relocationAssistance,
    citizenship_required: program.citizenshipRequired,
    clearance_required: program.clearanceRequired,
    education_levels: program.educationLevels,
    majors_preferred: program.majorsPreferred,
    gpa_minimum: program.gpaMinimum,
    application_deadline: program.applicationDeadline,
    program_start_date: program.programStartDate,
    program_end_date: program.programEndDate,
    total_slots: program.totalSlots,
    conversion_target: program.conversionTarget,
    status: program.status,
    featured: program.featured
  };

  const { data, error } = await supabase
    .from('fellowship_programs')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating fellowship program:', error);
    return null;
  }

  return transformProgramFromDB(data);
}

export async function updateFellowshipProgram(
  programId: string,
  updates: Partial<FellowshipProgram>
): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {};

  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.totalSlots !== undefined) dbUpdates.total_slots = updates.totalSlots;
  if (updates.filledSlots !== undefined) dbUpdates.filled_slots = updates.filledSlots;
  if (updates.applicationDeadline !== undefined) dbUpdates.application_deadline = updates.applicationDeadline;

  const { error } = await supabase
    .from('fellowship_programs')
    .update(dbUpdates)
    .eq('id', programId);

  if (error) {
    console.error('Error updating fellowship program:', error);
    return false;
  }

  return true;
}

// ===========================================
// FELLOWS
// ===========================================

export async function getFellows(partnerId: string, filters?: FellowFilters): Promise<Fellow[]> {
  let query = supabase
    .from('fellows')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (filters?.programId) {
    query = query.eq('program_id', filters.programId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.receivedOffer !== undefined) {
    query = query.eq('received_offer', filters.receivedOffer);
  }
  if (filters?.searchQuery) {
    query = query.or(`first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,university.ilike.%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching fellows:', error);
    return [];
  }

  return (data || []).map(transformFellowFromDB);
}

export async function createFellow(
  partnerId: string,
  fellow: Omit<Fellow, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<Fellow | null> {
  const dbData = {
    partner_id: partnerId,
    program_id: fellow.programId,
    first_name: fellow.firstName,
    last_name: fellow.lastName,
    email: fellow.email,
    phone: fellow.phone,
    university: fellow.university,
    major: fellow.major,
    degree: fellow.degree,
    graduation_date: fellow.graduationDate,
    gpa: fellow.gpa,
    mentor_id: fellow.mentorId,
    mentor_name: fellow.mentorName,
    department: fellow.department,
    project_title: fellow.projectTitle,
    project_description: fellow.projectDescription,
    status: fellow.status,
    start_date: fellow.startDate,
    end_date: fellow.endDate
  };

  const { data, error } = await supabase
    .from('fellows')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating fellow:', error);
    return null;
  }

  return transformFellowFromDB(data);
}

export async function updateFellowStatus(
  fellowId: string,
  status: Fellow['status'],
  additionalData?: Partial<Fellow>
): Promise<boolean> {
  const updates: Record<string, unknown> = { status };

  if (status === 'converted' && additionalData?.conversionDate) {
    updates.conversion_date = additionalData.conversionDate;
    updates.received_offer = true;
    updates.accepted_offer = true;
  }
  if (additionalData?.receivedOffer !== undefined) {
    updates.received_offer = additionalData.receivedOffer;
  }
  if (additionalData?.acceptedOffer !== undefined) {
    updates.accepted_offer = additionalData.acceptedOffer;
  }
  if (additionalData?.midtermEvaluation !== undefined) {
    updates.midterm_evaluation = additionalData.midtermEvaluation;
  }
  if (additionalData?.finalEvaluation !== undefined) {
    updates.final_evaluation = additionalData.finalEvaluation;
  }

  const { error } = await supabase
    .from('fellows')
    .update(updates)
    .eq('id', fellowId);

  if (error) {
    console.error('Error updating fellow status:', error);
    return false;
  }

  return true;
}

// ===========================================
// PRINCIPAL INVESTIGATORS
// ===========================================

export async function getPrincipalInvestigators(partnerId: string, filters?: PIFilters): Promise<PrincipalInvestigator[]> {
  let query = supabase
    .from('principal_investigators')
    .select('*')
    .eq('partner_id', partnerId)
    .order('last_name');

  if (filters?.department) {
    query = query.eq('department', filters.department);
  }
  if (filters?.seekingCollaborations !== undefined) {
    query = query.eq('seeking_collaborations', filters.seekingCollaborations);
  }
  if (filters?.seekingStudents !== undefined) {
    query = query.eq('seeking_students', filters.seekingStudents);
  }
  if (filters?.searchQuery) {
    query = query.or(`first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching principal investigators:', error);
    return [];
  }

  return (data || []).map(transformPIFromDB);
}

export async function createPrincipalInvestigator(
  partnerId: string,
  pi: Omit<PrincipalInvestigator, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<PrincipalInvestigator | null> {
  const dbData = {
    partner_id: partnerId,
    user_id: pi.userId,
    first_name: pi.firstName,
    last_name: pi.lastName,
    email: pi.email,
    title: pi.title,
    department: pi.department,
    division: pi.division,
    research_areas: pi.researchAreas,
    keywords: pi.keywords,
    publications: pi.publications,
    h_index: pi.hIndex,
    orcid_id: pi.orcidId,
    google_scholar_id: pi.googleScholarId,
    seeking_collaborations: pi.seekingCollaborations,
    collaboration_interests: pi.collaborationInterests,
    seeking_students: pi.seekingStudents,
    available_projects: pi.availableProjects,
    biography: pi.biography,
    photo_url: pi.photoUrl,
    website: pi.website
  };

  const { data, error } = await supabase
    .from('principal_investigators')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating principal investigator:', error);
    return null;
  }

  return transformPIFromDB(data);
}

// ===========================================
// RESEARCH COLLABORATIONS
// ===========================================

export async function getResearchCollaborations(partnerId: string): Promise<ResearchCollaboration[]> {
  const { data, error } = await supabase
    .from('research_collaborations')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching research collaborations:', error);
    return [];
  }

  return (data || []).map(transformCollaborationFromDB);
}

export async function createResearchCollaboration(
  partnerId: string,
  collaboration: Omit<ResearchCollaboration, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<ResearchCollaboration | null> {
  const dbData = {
    partner_id: partnerId,
    pi_id: collaboration.piId,
    title: collaboration.title,
    description: collaboration.description,
    collaboration_type: collaboration.collaborationType,
    external_organization: collaboration.externalOrganization,
    external_organization_type: collaboration.externalOrganizationType,
    external_contact_name: collaboration.externalContactName,
    external_contact_email: collaboration.externalContactEmail,
    start_date: collaboration.startDate,
    end_date: collaboration.endDate,
    contract_number: collaboration.contractNumber,
    funding_source: collaboration.fundingSource,
    funding_amount: collaboration.fundingAmount,
    status: collaboration.status
  };

  const { data, error } = await supabase
    .from('research_collaborations')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating research collaboration:', error);
    return null;
  }

  return transformCollaborationFromDB(data);
}

// ===========================================
// COMPLIANCE
// ===========================================

export async function getComplianceRecords(partnerId: string): Promise<ComplianceRecord[]> {
  const { data, error } = await supabase
    .from('compliance_records')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching compliance records:', error);
    return [];
  }

  return (data || []).map(transformComplianceRecordFromDB);
}

export async function getComplianceAuditLogs(partnerId: string, limit = 50): Promise<ComplianceAuditLog[]> {
  const { data, error } = await supabase
    .from('compliance_audit_logs')
    .select('*')
    .eq('partner_id', partnerId)
    .order('performed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching compliance audit logs:', error);
    return [];
  }

  return (data || []).map(transformAuditLogFromDB);
}

// ===========================================
// ANALYTICS
// ===========================================

export async function getLabDashboardMetrics(partnerId: string): Promise<LabDashboardMetrics> {
  // Fetch positions
  const { data: positions } = await supabase
    .from('clearance_positions')
    .select('status, required_clearance, filled_count, openings, average_time_to_fill')
    .eq('partner_id', partnerId);

  // Fetch candidates
  const { data: candidates } = await supabase
    .from('clearance_candidates')
    .select('current_clearance_status, target_clearance_type, eligibility_assessment')
    .eq('partner_id', partnerId);

  // Fetch fellowship programs
  const { data: programs } = await supabase
    .from('fellowship_programs')
    .select('status')
    .eq('partner_id', partnerId);

  // Fetch fellows
  const { data: fellows } = await supabase
    .from('fellows')
    .select('status, received_offer, accepted_offer')
    .eq('partner_id', partnerId);

  // Fetch PIs
  const { data: pis } = await supabase
    .from('principal_investigators')
    .select('seeking_collaborations')
    .eq('partner_id', partnerId);

  // Fetch collaborations
  const { data: collaborations } = await supabase
    .from('research_collaborations')
    .select('status')
    .eq('partner_id', partnerId);

  // Fetch compliance records
  const { data: compliance } = await supabase
    .from('compliance_records')
    .select('compliance_status')
    .eq('partner_id', partnerId);

  // Calculate metrics
  const positionList = positions || [];
  const activeOpenings = positionList.filter(p => p.status === 'open').length;
  const totalOpenings = positionList.reduce((sum, p) => sum + (p.openings || 0), 0);
  const positionsFilled = positionList.reduce((sum, p) => sum + (p.filled_count || 0), 0);
  const timeToFillValues = positionList
    .filter(p => p.average_time_to_fill)
    .map(p => p.average_time_to_fill);
  const averageTimeToFill = timeToFillValues.length > 0
    ? timeToFillValues.reduce((a, b) => a + b, 0) / timeToFillValues.length
    : 0;

  const candidateList = candidates || [];
  const pipelineSize = candidateList.length;
  const candidatesScreened = candidateList.filter(c => c.eligibility_assessment).length;
  const candidatesEligible = candidateList.filter(c => c.eligibility_assessment === 'eligible').length;
  const candidatesInProcess = candidateList.filter(c =>
    ['sf86_submitted', 'investigation', 'adjudication'].includes(c.current_clearance_status)
  ).length;

  // Clearance breakdown
  const clearanceByType = candidateList.reduce((acc, c) => {
    const type = c.target_clearance_type as ClearanceType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<ClearanceType, number>);

  const clearanceByStatus = candidateList.reduce((acc, c) => {
    const status = c.current_clearance_status as ClearanceStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<ClearanceStatus, number>);

  // Fellowship metrics
  const programList = programs || [];
  const activeFellowships = programList.filter(p => ['active', 'accepting'].includes(p.status)).length;

  const fellowList = fellows || [];
  const totalFellows = fellowList.length;
  const fellowsInProgress = fellowList.filter(f => ['active', 'accepted'].includes(f.status)).length;
  const completedFellows = fellowList.filter(f => ['completed', 'converted'].includes(f.status)).length;
  const convertedFellows = fellowList.filter(f => f.status === 'converted').length;
  const conversionRate = completedFellows > 0 ? (convertedFellows / completedFellows) * 100 : 0;

  // Research metrics
  const piList = pis || [];
  const activePIs = piList.filter(p => p.seeking_collaborations).length;

  const collabList = collaborations || [];
  const activeCollaborations = collabList.filter(c => c.status === 'active').length;
  const pendingCollaborations = collabList.filter(c => ['prospecting', 'negotiating'].includes(c.status)).length;

  // Compliance metrics
  const complianceList = compliance || [];
  const complianceRecordsTotal = complianceList.length;
  const complianceIssues = complianceList.filter(c => c.compliance_status === 'non_compliant').length;
  const pendingReviews = complianceList.filter(c => c.compliance_status === 'pending_review').length;

  return {
    activeOpenings,
    totalOpenings,
    positionsFilled,
    averageTimeToFill,
    pipelineSize,
    candidatesScreened,
    candidatesEligible,
    candidatesInProcess,
    clearanceByType,
    clearanceByStatus,
    averageScreeningTime: 0, // Would need additional tracking
    activeFellowships,
    totalFellows,
    fellowsInProgress,
    conversionRate,
    activePIs,
    activeCollaborations,
    pendingCollaborations,
    complianceRecordsTotal,
    complianceIssues,
    pendingReviews
  };
}

// ===========================================
// TRANSFORM FUNCTIONS
// ===========================================

function transformPartnerFromDB(data: Record<string, unknown>): NationalLabsPartner {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    organizationName: data.organization_name as string,
    labType: data.lab_type as NationalLabsPartner['labType'],
    labCode: data.lab_code as string | undefined,
    city: data.city as string,
    state: data.state as string,
    facility: data.facility as string | undefined,
    tier: (data.tier as LabPartnerTier) || 'research',
    status: (data.status as NationalLabsPartner['status']) || 'pending',
    primaryContactName: data.primary_contact_name as string,
    primaryContactEmail: data.primary_contact_email as string,
    primaryContactPhone: data.primary_contact_phone as string | undefined,
    primaryContactTitle: data.primary_contact_title as string | undefined,
    employeeCount: data.employee_count as number | undefined,
    clearanceTypes: (data.clearance_types as ClearanceType[]) || [],
    researchAreas: (data.research_areas as string[]) || [],
    stripeCustomerId: data.stripe_customer_id as string | undefined,
    subscriptionStatus: (data.subscription_status as NationalLabsPartner['subscriptionStatus']) || 'free',
    approvedAt: data.approved_at as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformPartnerToDB(partner: Partial<NationalLabsPartner>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (partner.organizationName !== undefined) result.organization_name = partner.organizationName;
  if (partner.labType !== undefined) result.lab_type = partner.labType;
  if (partner.labCode !== undefined) result.lab_code = partner.labCode;
  if (partner.city !== undefined) result.city = partner.city;
  if (partner.state !== undefined) result.state = partner.state;
  if (partner.facility !== undefined) result.facility = partner.facility;
  if (partner.primaryContactName !== undefined) result.primary_contact_name = partner.primaryContactName;
  if (partner.primaryContactEmail !== undefined) result.primary_contact_email = partner.primaryContactEmail;
  if (partner.clearanceTypes !== undefined) result.clearance_types = partner.clearanceTypes;
  if (partner.researchAreas !== undefined) result.research_areas = partner.researchAreas;

  return result;
}

function transformPositionFromDB(data: Record<string, unknown>): ClearancePosition {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    title: data.title as string,
    department: data.department as string | undefined,
    division: data.division as string | undefined,
    requiredClearance: data.required_clearance as ClearanceType,
    polygraphRequired: data.polygraph_required as boolean,
    citizenshipRequired: data.citizenship_required as boolean,
    exportControlled: data.export_controlled as boolean,
    description: data.description as string,
    requirements: (data.requirements as string[]) || [],
    location: data.location as string,
    remote: data.remote as boolean,
    salaryMin: data.salary_min as number | undefined,
    salaryMax: data.salary_max as number | undefined,
    status: data.status as ClearancePosition['status'],
    openings: data.openings as number,
    filledCount: data.filled_count as number,
    candidatesTotal: data.candidates_total as number,
    candidatesScreened: data.candidates_screened as number,
    candidatesEligible: data.candidates_eligible as number,
    candidatesInProcess: data.candidates_in_process as number,
    averageTimeToFill: data.average_time_to_fill as number | undefined,
    averageTimeToScreen: data.average_time_to_screen as number | undefined,
    postedDate: data.posted_date as string | undefined,
    closedDate: data.closed_date as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformCandidateFromDB(data: Record<string, unknown>): ClearanceCandidate {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    positionId: data.position_id as string | undefined,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    email: data.email as string,
    phone: data.phone as string | undefined,
    citizenshipStatus: data.citizenship_status as ClearanceCandidate['citizenshipStatus'],
    birthCountry: data.birth_country as string | undefined,
    dualCitizenship: data.dual_citizenship as boolean,
    foreignContacts: data.foreign_contacts as boolean,
    foreignTravel: data.foreign_travel as boolean,
    financialIssues: data.financial_issues as boolean,
    criminalHistory: data.criminal_history as boolean,
    drugUse: data.drug_use as boolean,
    sf86ReadinessScore: data.sf86_readiness_score as number,
    eligibilityAssessment: data.eligibility_assessment as ClearanceCandidate['eligibilityAssessment'],
    riskFactors: (data.risk_factors as string[]) || [],
    recommendations: (data.recommendations as string[]) || [],
    targetClearanceType: data.target_clearance_type as ClearanceType,
    currentClearanceStatus: data.current_clearance_status as ClearanceStatus,
    sf86SubmittedDate: data.sf86_submitted_date as string | undefined,
    investigationStartDate: data.investigation_start_date as string | undefined,
    adjudicationDate: data.adjudication_date as string | undefined,
    clearanceGrantedDate: data.clearance_granted_date as string | undefined,
    clearanceExpirationDate: data.clearance_expiration_date as string | undefined,
    screenedAt: data.screened_at as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformProgramFromDB(data: Record<string, unknown>): FellowshipProgram {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    name: data.name as string,
    programType: data.program_type as FellowshipProgram['programType'],
    description: data.description as string,
    duration: data.duration as string,
    isPaid: data.is_paid as boolean,
    stipendAmount: data.stipend_amount as number | undefined,
    housingProvided: data.housing_provided as boolean,
    relocationAssistance: data.relocation_assistance as boolean,
    citizenshipRequired: data.citizenship_required as boolean,
    clearanceRequired: data.clearance_required as ClearanceType | undefined,
    educationLevels: (data.education_levels as string[]) || [],
    majorsPreferred: (data.majors_preferred as string[]) || [],
    gpaMinimum: data.gpa_minimum as number | undefined,
    applicationDeadline: data.application_deadline as string | undefined,
    programStartDate: data.program_start_date as string | undefined,
    programEndDate: data.program_end_date as string | undefined,
    totalSlots: data.total_slots as number,
    filledSlots: data.filled_slots as number,
    waitlistCount: data.waitlist_count as number,
    conversionTarget: data.conversion_target as number | undefined,
    historicalConversionRate: data.historical_conversion_rate as number | undefined,
    status: data.status as FellowshipProgram['status'],
    featured: data.featured as boolean,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformFellowFromDB(data: Record<string, unknown>): Fellow {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    programId: data.program_id as string,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    email: data.email as string,
    phone: data.phone as string | undefined,
    university: data.university as string,
    major: data.major as string,
    degree: data.degree as string,
    graduationDate: data.graduation_date as string | undefined,
    gpa: data.gpa as number | undefined,
    mentorId: data.mentor_id as string | undefined,
    mentorName: data.mentor_name as string | undefined,
    department: data.department as string | undefined,
    projectTitle: data.project_title as string | undefined,
    projectDescription: data.project_description as string | undefined,
    status: data.status as Fellow['status'],
    startDate: data.start_date as string | undefined,
    endDate: data.end_date as string | undefined,
    completionDate: data.completion_date as string | undefined,
    midtermEvaluation: data.midterm_evaluation as number | undefined,
    finalEvaluation: data.final_evaluation as number | undefined,
    mentorFeedback: data.mentor_feedback as string | undefined,
    receivedOffer: data.received_offer as boolean,
    acceptedOffer: data.accepted_offer as boolean,
    conversionDate: data.conversion_date as string | undefined,
    conversionPositionId: data.conversion_position_id as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformPIFromDB(data: Record<string, unknown>): PrincipalInvestigator {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    userId: data.user_id as string | undefined,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    email: data.email as string,
    title: data.title as string,
    department: data.department as string,
    division: data.division as string | undefined,
    researchAreas: (data.research_areas as string[]) || [],
    keywords: (data.keywords as string[]) || [],
    publications: data.publications as number,
    hIndex: data.h_index as number | undefined,
    orcidId: data.orcid_id as string | undefined,
    googleScholarId: data.google_scholar_id as string | undefined,
    seekingCollaborations: data.seeking_collaborations as boolean,
    collaborationInterests: (data.collaboration_interests as string[]) || [],
    seekingStudents: data.seeking_students as boolean,
    availableProjects: data.available_projects as number,
    biography: data.biography as string | undefined,
    photoUrl: data.photo_url as string | undefined,
    website: data.website as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformCollaborationFromDB(data: Record<string, unknown>): ResearchCollaboration {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    piId: data.pi_id as string,
    title: data.title as string,
    description: data.description as string,
    collaborationType: data.collaboration_type as ResearchCollaboration['collaborationType'],
    externalOrganization: data.external_organization as string,
    externalOrganizationType: data.external_organization_type as ResearchCollaboration['externalOrganizationType'],
    externalContactName: data.external_contact_name as string,
    externalContactEmail: data.external_contact_email as string,
    startDate: data.start_date as string | undefined,
    endDate: data.end_date as string | undefined,
    contractNumber: data.contract_number as string | undefined,
    fundingSource: data.funding_source as string | undefined,
    fundingAmount: data.funding_amount as number | undefined,
    status: data.status as ResearchCollaboration['status'],
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformComplianceRecordFromDB(data: Record<string, unknown>): ComplianceRecord {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    recordType: data.record_type as ComplianceRecord['recordType'],
    recordId: data.record_id as string,
    exportControlType: data.export_control_type as ComplianceRecord['exportControlType'],
    itarControlled: data.itar_controlled as boolean,
    earControlled: data.ear_controlled as boolean,
    eccn: data.eccn as string | undefined,
    citizenshipVerified: data.citizenship_verified as boolean,
    citizenshipVerificationDate: data.citizenship_verification_date as string | undefined,
    citizenshipVerificationMethod: data.citizenship_verification_method as string | undefined,
    complianceStatus: data.compliance_status as ComplianceRecord['complianceStatus'],
    complianceNotes: data.compliance_notes as string | undefined,
    exceptionReason: data.exception_reason as string | undefined,
    exceptionApprovedBy: data.exception_approved_by as string | undefined,
    exceptionApprovedDate: data.exception_approved_date as string | undefined,
    lastReviewDate: data.last_review_date as string | undefined,
    nextReviewDate: data.next_review_date as string | undefined,
    reviewedBy: data.reviewed_by as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformAuditLogFromDB(data: Record<string, unknown>): ComplianceAuditLog {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    complianceRecordId: data.compliance_record_id as string | undefined,
    action: data.action as string,
    actionType: data.action_type as ComplianceAuditLog['actionType'],
    performedBy: data.performed_by as string,
    performedAt: data.performed_at as string,
    previousValue: data.previous_value as string | undefined,
    newValue: data.new_value as string | undefined,
    notes: data.notes as string | undefined,
    createdAt: data.created_at as string
  };
}

// ===========================================
// DELETE OPERATIONS
// ===========================================

export async function deleteClearancePosition(positionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('clearance_positions')
      .delete()
      .eq('id', positionId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting clearance position:', error);
    return false;
  }
}

export async function deleteClearanceCandidate(candidateId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('clearance_candidates')
      .delete()
      .eq('id', candidateId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting clearance candidate:', error);
    return false;
  }
}

export async function deleteFellowshipProgram(programId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('fellowship_programs')
      .delete()
      .eq('id', programId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting fellowship program:', error);
    return false;
  }
}

export async function deleteFellow(fellowId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('fellows')
      .delete()
      .eq('id', fellowId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting fellow:', error);
    return false;
  }
}

export async function deletePrincipalInvestigator(piId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('principal_investigators')
      .delete()
      .eq('id', piId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting principal investigator:', error);
    return false;
  }
}

export async function deleteResearchCollaboration(collaborationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('research_collaborations')
      .delete()
      .eq('id', collaborationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting research collaboration:', error);
    return false;
  }
}

export async function deleteComplianceRecord(recordId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('compliance_records')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting compliance record:', error);
    return false;
  }
}

// ===========================================
// ADDITIONAL UPDATE OPERATIONS
// ===========================================

export async function updatePrincipalInvestigator(
  piId: string,
  updates: Partial<Omit<PrincipalInvestigator, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>>
): Promise<PrincipalInvestigator | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.department !== undefined) dbUpdates.department = updates.department;
    if (updates.division !== undefined) dbUpdates.division = updates.division;
    if (updates.researchAreas !== undefined) dbUpdates.research_areas = updates.researchAreas;
    if (updates.keywords !== undefined) dbUpdates.keywords = updates.keywords;
    if (updates.publications !== undefined) dbUpdates.publications = updates.publications;
    if (updates.hIndex !== undefined) dbUpdates.h_index = updates.hIndex;
    if (updates.orcidId !== undefined) dbUpdates.orcid_id = updates.orcidId;
    if (updates.googleScholarId !== undefined) dbUpdates.google_scholar_id = updates.googleScholarId;
    if (updates.seekingCollaborations !== undefined) dbUpdates.seeking_collaborations = updates.seekingCollaborations;
    if (updates.collaborationInterests !== undefined) dbUpdates.collaboration_interests = updates.collaborationInterests;
    if (updates.seekingStudents !== undefined) dbUpdates.seeking_students = updates.seekingStudents;
    if (updates.availableProjects !== undefined) dbUpdates.available_projects = updates.availableProjects;
    if (updates.biography !== undefined) dbUpdates.biography = updates.biography;
    if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
    if (updates.website !== undefined) dbUpdates.website = updates.website;

    const { data, error } = await supabase
      .from('principal_investigators')
      .update(dbUpdates)
      .eq('id', piId)
      .select()
      .single();

    if (error) throw error;
    return transformPIFromDB(data);
  } catch (error) {
    console.error('Error updating principal investigator:', error);
    return null;
  }
}

export async function updateResearchCollaboration(
  collaborationId: string,
  updates: Partial<Omit<ResearchCollaboration, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>>
): Promise<ResearchCollaboration | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.piId !== undefined) dbUpdates.pi_id = updates.piId;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.collaborationType !== undefined) dbUpdates.collaboration_type = updates.collaborationType;
    if (updates.externalOrganization !== undefined) dbUpdates.external_organization = updates.externalOrganization;
    if (updates.externalOrganizationType !== undefined) dbUpdates.external_organization_type = updates.externalOrganizationType;
    if (updates.externalContactName !== undefined) dbUpdates.external_contact_name = updates.externalContactName;
    if (updates.externalContactEmail !== undefined) dbUpdates.external_contact_email = updates.externalContactEmail;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.contractNumber !== undefined) dbUpdates.contract_number = updates.contractNumber;
    if (updates.fundingSource !== undefined) dbUpdates.funding_source = updates.fundingSource;
    if (updates.fundingAmount !== undefined) dbUpdates.funding_amount = updates.fundingAmount;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { data, error } = await supabase
      .from('research_collaborations')
      .update(dbUpdates)
      .eq('id', collaborationId)
      .select()
      .single();

    if (error) throw error;
    return transformCollaborationFromDB(data);
  } catch (error) {
    console.error('Error updating research collaboration:', error);
    return null;
  }
}

// ===========================================
// COMPLIANCE RECORD CRUD
// ===========================================

export async function createComplianceRecord(
  partnerId: string,
  record: Omit<ComplianceRecord, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<ComplianceRecord | null> {
  try {
    const { data, error } = await supabase
      .from('compliance_records')
      .insert({
        partner_id: partnerId,
        record_type: record.recordType,
        record_id: record.recordId,
        export_control_type: record.exportControlType,
        itar_controlled: record.itarControlled,
        ear_controlled: record.earControlled,
        eccn: record.eccn,
        citizenship_verified: record.citizenshipVerified,
        citizenship_verification_date: record.citizenshipVerificationDate,
        citizenship_verification_method: record.citizenshipVerificationMethod,
        compliance_status: record.complianceStatus,
        compliance_notes: record.complianceNotes,
        exception_reason: record.exceptionReason,
        exception_approved_by: record.exceptionApprovedBy,
        exception_approved_date: record.exceptionApprovedDate,
        last_review_date: record.lastReviewDate,
        next_review_date: record.nextReviewDate,
        reviewed_by: record.reviewedBy
      })
      .select()
      .single();

    if (error) throw error;
    return transformComplianceRecordFromDB(data);
  } catch (error) {
    console.error('Error creating compliance record:', error);
    return null;
  }
}

export async function updateComplianceRecord(
  recordId: string,
  updates: Partial<Omit<ComplianceRecord, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>>
): Promise<ComplianceRecord | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.recordType !== undefined) dbUpdates.record_type = updates.recordType;
    if (updates.recordId !== undefined) dbUpdates.record_id = updates.recordId;
    if (updates.exportControlType !== undefined) dbUpdates.export_control_type = updates.exportControlType;
    if (updates.itarControlled !== undefined) dbUpdates.itar_controlled = updates.itarControlled;
    if (updates.earControlled !== undefined) dbUpdates.ear_controlled = updates.earControlled;
    if (updates.eccn !== undefined) dbUpdates.eccn = updates.eccn;
    if (updates.citizenshipVerified !== undefined) dbUpdates.citizenship_verified = updates.citizenshipVerified;
    if (updates.citizenshipVerificationDate !== undefined) dbUpdates.citizenship_verification_date = updates.citizenshipVerificationDate;
    if (updates.citizenshipVerificationMethod !== undefined) dbUpdates.citizenship_verification_method = updates.citizenshipVerificationMethod;
    if (updates.complianceStatus !== undefined) dbUpdates.compliance_status = updates.complianceStatus;
    if (updates.complianceNotes !== undefined) dbUpdates.compliance_notes = updates.complianceNotes;
    if (updates.exceptionReason !== undefined) dbUpdates.exception_reason = updates.exceptionReason;
    if (updates.exceptionApprovedBy !== undefined) dbUpdates.exception_approved_by = updates.exceptionApprovedBy;
    if (updates.exceptionApprovedDate !== undefined) dbUpdates.exception_approved_date = updates.exceptionApprovedDate;
    if (updates.lastReviewDate !== undefined) dbUpdates.last_review_date = updates.lastReviewDate;
    if (updates.nextReviewDate !== undefined) dbUpdates.next_review_date = updates.nextReviewDate;
    if (updates.reviewedBy !== undefined) dbUpdates.reviewed_by = updates.reviewedBy;

    const { data, error } = await supabase
      .from('compliance_records')
      .update(dbUpdates)
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return transformComplianceRecordFromDB(data);
  } catch (error) {
    console.error('Error updating compliance record:', error);
    return null;
  }
}

export async function createComplianceAuditLog(
  partnerId: string,
  log: Omit<ComplianceAuditLog, 'id' | 'partnerId' | 'createdAt'>
): Promise<ComplianceAuditLog | null> {
  try {
    const { data, error } = await supabase
      .from('compliance_audit_logs')
      .insert({
        partner_id: partnerId,
        compliance_record_id: log.complianceRecordId,
        action: log.action,
        action_type: log.actionType,
        performed_by: log.performedBy,
        performed_at: log.performedAt,
        previous_value: log.previousValue,
        new_value: log.newValue,
        notes: log.notes
      })
      .select()
      .single();

    if (error) throw error;
    return transformAuditLogFromDB(data);
  } catch (error) {
    console.error('Error creating compliance audit log:', error);
    return null;
  }
}
