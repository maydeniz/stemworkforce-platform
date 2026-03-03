// ===========================================
// Municipality Partner API Service
// Cities, Counties, Municipal HR Departments
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  MunicipalityPartner,
  MunicipalityPartnerTier,
  InternshipProgram,
  ApprenticeshipProgram,
  MunicipalityParticipant,
  DepartmentWorkforceNeed,
  CivilServiceExam,
  UnionPartnership,
  MunicipalityReport,
  MunicipalityDashboardMetrics,
  InternshipFilters,
  ApprenticeshipFilters,
  ParticipantFilters,
  DepartmentFilters,
  MunicipalityType,
  MunicipalitySize,
  DepartmentType,
  InternshipProgramType,
  ApprenticeshipType,
  ProgramStatus,
  ParticipantStatus,
  FundingSource,
  ReportType,
  ReportStatus
} from '@/types/municipalityPartner';

// ===========================================
// TRANSFORM FUNCTIONS
// ===========================================

function transformMunicipalityPartner(record: Record<string, unknown>): MunicipalityPartner {
  return {
    id: record.id as string,
    userId: record.user_id as string,
    municipalityName: record.municipality_name as string,
    municipalityType: record.municipality_type as MunicipalityType,
    municipalitySize: record.municipality_size as MunicipalitySize,
    population: record.population as number,
    city: record.city as string,
    county: record.county as string,
    state: record.state as string,
    region: record.region as string | undefined,
    timezone: record.timezone as string,
    primaryContactName: record.primary_contact_name as string,
    primaryContactEmail: record.primary_contact_email as string,
    primaryContactPhone: record.primary_contact_phone as string,
    primaryContactTitle: record.primary_contact_title as string,
    department: record.department as DepartmentType,
    totalEmployees: record.total_employees as number,
    annualHiringTarget: record.annual_hiring_target as number,
    currentVacancies: record.current_vacancies as number,
    retirementEligible: record.retirement_eligible as number,
    hrBudget: record.hr_budget as number | undefined,
    tier: record.tier as MunicipalityPartnerTier,
    partnerSince: record.partner_since as string,
    contractExpiration: record.contract_expiration as string | undefined,
    hasCivilService: record.has_civil_service as boolean,
    civilServiceExemptions: record.civil_service_exemptions as string[] | undefined,
    unionized: record.unionized as boolean,
    unionNames: record.union_names as string[] | undefined,
    activeInternshipPrograms: record.active_internship_programs as number,
    activeApprenticeships: record.active_apprenticeships as number,
    totalParticipantsYTD: record.total_participants_ytd as number,
    totalPlacementsYTD: record.total_placements_ytd as number,
    isActive: record.is_active as boolean,
    createdAt: record.created_at as string,
    updatedAt: record.updated_at as string
  };
}

function transformInternshipProgram(record: Record<string, unknown>): InternshipProgram {
  return {
    id: record.id as string,
    municipalityId: record.municipality_id as string,
    programName: record.program_name as string,
    programType: record.program_type as InternshipProgramType,
    description: record.description as string,
    hostDepartments: record.host_departments as DepartmentType[],
    startDate: record.start_date as string,
    endDate: record.end_date as string,
    hoursPerWeek: record.hours_per_week as number,
    durationWeeks: record.duration_weeks as number,
    minAge: record.min_age as number,
    maxAge: record.max_age as number,
    educationRequirement: record.education_requirement as 'high_school' | 'enrolled_college' | 'college_graduate' | 'graduate_student' | 'none',
    residencyRequired: record.residency_required as boolean,
    residencyArea: record.residency_area as string | undefined,
    incomeEligibility: record.income_eligibility as boolean | undefined,
    incomeThreshold: record.income_threshold as number | undefined,
    isPaid: record.is_paid as boolean,
    hourlyRate: record.hourly_rate as number | undefined,
    stipend: record.stipend as number | undefined,
    totalBudget: record.total_budget as number,
    fundingSource: record.funding_source as FundingSource,
    totalSlots: record.total_slots as number,
    filledSlots: record.filled_slots as number,
    waitlistCount: record.waitlist_count as number,
    status: record.status as ProgramStatus,
    applicationDeadline: record.application_deadline as string | undefined,
    completionRate: record.completion_rate as number | undefined,
    conversionRate: record.conversion_rate as number | undefined,
    satisfactionScore: record.satisfaction_score as number | undefined,
    createdAt: record.created_at as string,
    updatedAt: record.updated_at as string
  };
}

function transformApprenticeshipProgram(record: Record<string, unknown>): ApprenticeshipProgram {
  return {
    id: record.id as string,
    municipalityId: record.municipality_id as string,
    programName: record.program_name as string,
    apprenticeshipType: record.apprenticeship_type as ApprenticeshipType,
    occupation: record.occupation as string,
    rapidsCode: record.rapids_code as string | undefined,
    description: record.description as string,
    sponsorType: record.sponsor_type as 'municipality' | 'joint' | 'union' | 'contractor',
    unionPartner: record.union_partner as string | undefined,
    contractorPartners: record.contractor_partners as string[] | undefined,
    hostDepartments: record.host_departments as DepartmentType[],
    durationMonths: record.duration_months as number,
    totalOJTHours: record.total_ojt_hours as number,
    totalRTIHours: record.total_rti_hours as number,
    progressivewageSchedule: record.progressive_wage_schedule as boolean,
    startingWage: record.starting_wage as number,
    journeyWage: record.journey_wage as number,
    benefits: record.benefits as boolean,
    totalSlots: record.total_slots as number,
    activeApprentices: record.active_apprentices as number,
    graduatedYTD: record.graduated_ytd as number,
    minAge: record.min_age as number,
    educationRequirement: record.education_requirement as string,
    physicalRequirements: record.physical_requirements as string | undefined,
    backgroundCheckRequired: record.background_check_required as boolean,
    drugTestRequired: record.drug_test_required as boolean,
    driversLicenseRequired: record.drivers_license_required as boolean,
    credentialAwarded: record.credential_awarded as string,
    industryRecognized: record.industry_recognized as boolean,
    fundingSource: record.funding_source as FundingSource,
    employerContribution: record.employer_contribution as number | undefined,
    grantFunding: record.grant_funding as number | undefined,
    status: record.status as ProgramStatus,
    completionRate: record.completion_rate as number | undefined,
    retentionRate: record.retention_rate as number | undefined,
    avgCompletionTime: record.avg_completion_time as number | undefined,
    createdAt: record.created_at as string,
    updatedAt: record.updated_at as string
  };
}

function transformParticipant(record: Record<string, unknown>): MunicipalityParticipant {
  return {
    id: record.id as string,
    municipalityId: record.municipality_id as string,
    programId: record.program_id as string,
    programType: record.program_type as 'internship' | 'apprenticeship',
    firstName: record.first_name as string,
    lastName: record.last_name as string,
    email: record.email as string,
    phone: record.phone as string,
    dateOfBirth: record.date_of_birth as string,
    city: record.city as string,
    zipCode: record.zip_code as string,
    isResident: record.is_resident as boolean,
    educationLevel: record.education_level as 'high_school' | 'some_college' | 'associates' | 'bachelors' | 'masters' | 'other',
    currentSchool: record.current_school as string | undefined,
    major: record.major as string | undefined,
    expectedGraduation: record.expected_graduation as string | undefined,
    gpa: record.gpa as number | undefined,
    meetsIncomeRequirement: record.meets_income_requirement as boolean | undefined,
    isVeteran: record.is_veteran as boolean,
    hasDisability: record.has_disability as boolean | undefined,
    isFirstGenCollege: record.is_first_gen_college as boolean | undefined,
    department: record.department as DepartmentType,
    supervisor: record.supervisor as string | undefined,
    startDate: record.start_date as string,
    expectedEndDate: record.expected_end_date as string,
    actualEndDate: record.actual_end_date as string | undefined,
    status: record.status as ParticipantStatus,
    hoursCompleted: record.hours_completed as number,
    currentWage: record.current_wage as number | undefined,
    ojtHoursCompleted: record.ojt_hours_completed as number | undefined,
    rtiHoursCompleted: record.rti_hours_completed as number | undefined,
    competenciesCompleted: record.competencies_completed as number | undefined,
    totalCompetencies: record.total_competencies as number | undefined,
    civilServiceStatus: record.civil_service_status as MunicipalityParticipant['civilServiceStatus'],
    examScore: record.exam_score as number | undefined,
    listPosition: record.list_position as number | undefined,
    placedInCity: record.placed_in_city as boolean | undefined,
    placementType: record.placement_type as MunicipalityParticipant['placementType'],
    placementDepartment: record.placement_department as DepartmentType | undefined,
    placementTitle: record.placement_title as string | undefined,
    placementSalary: record.placement_salary as number | undefined,
    placementDate: record.placement_date as string | undefined,
    midpointEvaluation: record.midpoint_evaluation as number | undefined,
    finalEvaluation: record.final_evaluation as number | undefined,
    supervisorRecommendation: record.supervisor_recommendation as MunicipalityParticipant['supervisorRecommendation'],
    notes: record.notes as string | undefined,
    createdAt: record.created_at as string,
    updatedAt: record.updated_at as string
  };
}

function transformDepartmentNeed(record: Record<string, unknown>): DepartmentWorkforceNeed {
  return {
    id: record.id as string,
    municipalityId: record.municipality_id as string,
    department: record.department as DepartmentType,
    authorizedPositions: record.authorized_positions as number,
    filledPositions: record.filled_positions as number,
    vacancyRate: record.vacancy_rate as number,
    retirementEligible5Years: record.retirement_eligible_5_years as number,
    hardToFillPositions: record.hard_to_fill_positions as string[],
    criticalSkillGaps: record.critical_skill_gaps as string[],
    activeRequisitions: record.active_requisitions as number,
    avgTimeToFill: record.avg_time_to_fill as number,
    avgCostPerHire: record.avg_cost_per_hire as number | undefined,
    internSlotsRequested: record.intern_slots_requested as number,
    internSlotsApproved: record.intern_slots_approved as number,
    apprenticeSlotsRequested: record.apprentice_slots_requested as number,
    apprenticeSlotsApproved: record.apprentice_slots_approved as number,
    priorityJobFamilies: record.priority_job_families as string[],
    emergingSkillNeeds: record.emerging_skill_needs as string[],
    trainingBudget: record.training_budget as number | undefined,
    projectedHiringBudget: record.projected_hiring_budget as number | undefined,
    fiscalYear: record.fiscal_year as string,
    lastUpdated: record.last_updated as string
  };
}

function transformCivilServiceExam(record: Record<string, unknown>): CivilServiceExam {
  return {
    id: record.id as string,
    municipalityId: record.municipality_id as string,
    examTitle: record.exam_title as string,
    examNumber: record.exam_number as string,
    jobClassification: record.job_classification as string,
    applicationOpenDate: record.application_open_date as string,
    applicationCloseDate: record.application_close_date as string,
    examDate: record.exam_date as string | undefined,
    resultsExpectedDate: record.results_expected_date as string | undefined,
    listExpirationDate: record.list_expiration_date as string | undefined,
    examType: record.exam_type as CivilServiceExam['examType'],
    isContinuous: record.is_continuous as boolean,
    applicantsCount: record.applicants_count as number | undefined,
    passersCount: record.passers_count as number | undefined,
    passingScore: record.passing_score as number,
    linkedProgramIds: record.linked_program_ids as string[] | undefined,
    status: record.status as CivilServiceExam['status']
  };
}

function transformUnionPartnership(record: Record<string, unknown>): UnionPartnership {
  return {
    id: record.id as string,
    municipalityId: record.municipality_id as string,
    unionName: record.union_name as string,
    unionLocal: record.union_local as string,
    contactName: record.contact_name as string,
    contactEmail: record.contact_email as string,
    contactPhone: record.contact_phone as string,
    agreementType: record.agreement_type as UnionPartnership['agreementType'],
    agreementStartDate: record.agreement_start_date as string,
    agreementEndDate: record.agreement_end_date as string,
    coveredOccupations: record.covered_occupations as string[],
    coveredDepartments: record.covered_departments as DepartmentType[],
    apprenticeshipProgramIds: record.apprenticeship_program_ids as string[] | undefined,
    usesHiringHall: record.uses_hiring_hall as boolean,
    hiringHallProcedure: record.hiring_hall_procedure as string | undefined,
    isActive: record.is_active as boolean,
    createdAt: record.created_at as string,
    updatedAt: record.updated_at as string
  };
}

function transformReport(record: Record<string, unknown>): MunicipalityReport {
  return {
    id: record.id as string,
    municipalityId: record.municipality_id as string,
    reportType: record.report_type as ReportType,
    reportTitle: record.report_title as string,
    reportPeriod: record.report_period as string,
    dueDate: record.due_date as string,
    submittedDate: record.submitted_date as string | undefined,
    status: record.status as ReportStatus,
    programIds: record.program_ids as string[] | undefined,
    grantNumber: record.grant_number as string | undefined,
    grantorAgency: record.grantor_agency as string | undefined,
    attachmentUrls: record.attachment_urls as string[] | undefined,
    createdBy: record.created_by as string,
    createdAt: record.created_at as string,
    updatedAt: record.updated_at as string
  };
}

// ===========================================
// MUNICIPALITY PARTNER CRUD
// ===========================================

export async function getMunicipalityPartner(userId: string): Promise<MunicipalityPartner | null> {
  const { data, error } = await supabase
    .from('municipality_partners')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return transformMunicipalityPartner(data);
}

export async function getMunicipalityPartnerById(id: string): Promise<MunicipalityPartner | null> {
  const { data, error } = await supabase
    .from('municipality_partners')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return transformMunicipalityPartner(data);
}

export async function createMunicipalityPartner(
  partner: Omit<MunicipalityPartner, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MunicipalityPartner | null> {
  const { data, error } = await supabase
    .from('municipality_partners')
    .insert({
      user_id: partner.userId,
      municipality_name: partner.municipalityName,
      municipality_type: partner.municipalityType,
      municipality_size: partner.municipalitySize,
      population: partner.population,
      city: partner.city,
      county: partner.county,
      state: partner.state,
      region: partner.region,
      timezone: partner.timezone,
      primary_contact_name: partner.primaryContactName,
      primary_contact_email: partner.primaryContactEmail,
      primary_contact_phone: partner.primaryContactPhone,
      primary_contact_title: partner.primaryContactTitle,
      department: partner.department,
      total_employees: partner.totalEmployees,
      annual_hiring_target: partner.annualHiringTarget,
      current_vacancies: partner.currentVacancies,
      retirement_eligible: partner.retirementEligible,
      hr_budget: partner.hrBudget,
      tier: partner.tier,
      has_civil_service: partner.hasCivilService,
      civil_service_exemptions: partner.civilServiceExemptions,
      unionized: partner.unionized,
      union_names: partner.unionNames,
      is_active: partner.isActive
    })
    .select()
    .single();

  if (error || !data) return null;
  return transformMunicipalityPartner(data);
}

export async function updateMunicipalityPartner(
  id: string,
  updates: Partial<MunicipalityPartner>
): Promise<MunicipalityPartner | null> {
  const updateData: Record<string, unknown> = {};

  if (updates.municipalityName !== undefined) updateData.municipality_name = updates.municipalityName;
  if (updates.municipalityType !== undefined) updateData.municipality_type = updates.municipalityType;
  if (updates.municipalitySize !== undefined) updateData.municipality_size = updates.municipalitySize;
  if (updates.population !== undefined) updateData.population = updates.population;
  if (updates.city !== undefined) updateData.city = updates.city;
  if (updates.county !== undefined) updateData.county = updates.county;
  if (updates.state !== undefined) updateData.state = updates.state;
  if (updates.region !== undefined) updateData.region = updates.region;
  if (updates.primaryContactName !== undefined) updateData.primary_contact_name = updates.primaryContactName;
  if (updates.primaryContactEmail !== undefined) updateData.primary_contact_email = updates.primaryContactEmail;
  if (updates.primaryContactPhone !== undefined) updateData.primary_contact_phone = updates.primaryContactPhone;
  if (updates.primaryContactTitle !== undefined) updateData.primary_contact_title = updates.primaryContactTitle;
  if (updates.totalEmployees !== undefined) updateData.total_employees = updates.totalEmployees;
  if (updates.annualHiringTarget !== undefined) updateData.annual_hiring_target = updates.annualHiringTarget;
  if (updates.currentVacancies !== undefined) updateData.current_vacancies = updates.currentVacancies;
  if (updates.retirementEligible !== undefined) updateData.retirement_eligible = updates.retirementEligible;
  if (updates.hrBudget !== undefined) updateData.hr_budget = updates.hrBudget;
  if (updates.tier !== undefined) updateData.tier = updates.tier;
  if (updates.hasCivilService !== undefined) updateData.has_civil_service = updates.hasCivilService;
  if (updates.civilServiceExemptions !== undefined) updateData.civil_service_exemptions = updates.civilServiceExemptions;
  if (updates.unionized !== undefined) updateData.unionized = updates.unionized;
  if (updates.unionNames !== undefined) updateData.union_names = updates.unionNames;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

  const { data, error } = await supabase
    .from('municipality_partners')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return transformMunicipalityPartner(data);
}

// ===========================================
// INTERNSHIP PROGRAMS
// ===========================================

export async function getInternshipPrograms(
  municipalityId: string,
  filters?: InternshipFilters
): Promise<InternshipProgram[]> {
  let query = supabase
    .from('municipality_internship_programs')
    .select('*')
    .eq('municipality_id', municipalityId);

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.programType) query = query.eq('program_type', filters.programType);
  if (filters?.department) query = query.contains('host_departments', [filters.department]);
  if (filters?.isPaid !== undefined) query = query.eq('is_paid', filters.isPaid);
  if (filters?.fundingSource) query = query.eq('funding_source', filters.fundingSource);

  const { data, error } = await query.order('start_date', { ascending: false });

  if (error || !data) return [];
  return data.map(transformInternshipProgram);
}

export async function createInternshipProgram(
  program: Omit<InternshipProgram, 'id' | 'createdAt' | 'updatedAt'>
): Promise<InternshipProgram | null> {
  const { data, error } = await supabase
    .from('municipality_internship_programs')
    .insert({
      municipality_id: program.municipalityId,
      program_name: program.programName,
      program_type: program.programType,
      description: program.description,
      host_departments: program.hostDepartments,
      start_date: program.startDate,
      end_date: program.endDate,
      hours_per_week: program.hoursPerWeek,
      duration_weeks: program.durationWeeks,
      min_age: program.minAge,
      max_age: program.maxAge,
      education_requirement: program.educationRequirement,
      residency_required: program.residencyRequired,
      residency_area: program.residencyArea,
      income_eligibility: program.incomeEligibility,
      income_threshold: program.incomeThreshold,
      is_paid: program.isPaid,
      hourly_rate: program.hourlyRate,
      stipend: program.stipend,
      total_budget: program.totalBudget,
      funding_source: program.fundingSource,
      total_slots: program.totalSlots,
      status: program.status,
      application_deadline: program.applicationDeadline
    })
    .select()
    .single();

  if (error || !data) return null;
  return transformInternshipProgram(data);
}

export async function updateInternshipProgram(
  id: string,
  updates: Partial<InternshipProgram>
): Promise<InternshipProgram | null> {
  const updateData: Record<string, unknown> = {};

  if (updates.programName !== undefined) updateData.program_name = updates.programName;
  if (updates.programType !== undefined) updateData.program_type = updates.programType;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.hostDepartments !== undefined) updateData.host_departments = updates.hostDepartments;
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate;
  if (updates.hoursPerWeek !== undefined) updateData.hours_per_week = updates.hoursPerWeek;
  if (updates.totalSlots !== undefined) updateData.total_slots = updates.totalSlots;
  if (updates.filledSlots !== undefined) updateData.filled_slots = updates.filledSlots;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.totalBudget !== undefined) updateData.total_budget = updates.totalBudget;
  if (updates.hourlyRate !== undefined) updateData.hourly_rate = updates.hourlyRate;

  const { data, error } = await supabase
    .from('municipality_internship_programs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return transformInternshipProgram(data);
}

export async function deleteInternshipProgram(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('municipality_internship_programs')
    .delete()
    .eq('id', id);

  return !error;
}

// ===========================================
// APPRENTICESHIP PROGRAMS
// ===========================================

export async function getApprenticeshipPrograms(
  municipalityId: string,
  filters?: ApprenticeshipFilters
): Promise<ApprenticeshipProgram[]> {
  let query = supabase
    .from('municipality_apprenticeship_programs')
    .select('*')
    .eq('municipality_id', municipalityId);

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.apprenticeshipType) query = query.eq('apprenticeship_type', filters.apprenticeshipType);
  if (filters?.department) query = query.contains('host_departments', [filters.department]);
  if (filters?.fundingSource) query = query.eq('funding_source', filters.fundingSource);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(transformApprenticeshipProgram);
}

export async function createApprenticeshipProgram(
  program: Omit<ApprenticeshipProgram, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApprenticeshipProgram | null> {
  const { data, error } = await supabase
    .from('municipality_apprenticeship_programs')
    .insert({
      municipality_id: program.municipalityId,
      program_name: program.programName,
      apprenticeship_type: program.apprenticeshipType,
      occupation: program.occupation,
      rapids_code: program.rapidsCode,
      description: program.description,
      sponsor_type: program.sponsorType,
      union_partner: program.unionPartner,
      contractor_partners: program.contractorPartners,
      host_departments: program.hostDepartments,
      duration_months: program.durationMonths,
      total_ojt_hours: program.totalOJTHours,
      total_rti_hours: program.totalRTIHours,
      progressive_wage_schedule: program.progressivewageSchedule,
      starting_wage: program.startingWage,
      journey_wage: program.journeyWage,
      benefits: program.benefits,
      total_slots: program.totalSlots,
      min_age: program.minAge,
      education_requirement: program.educationRequirement,
      physical_requirements: program.physicalRequirements,
      background_check_required: program.backgroundCheckRequired,
      drug_test_required: program.drugTestRequired,
      drivers_license_required: program.driversLicenseRequired,
      credential_awarded: program.credentialAwarded,
      industry_recognized: program.industryRecognized,
      funding_source: program.fundingSource,
      employer_contribution: program.employerContribution,
      grant_funding: program.grantFunding,
      status: program.status
    })
    .select()
    .single();

  if (error || !data) return null;
  return transformApprenticeshipProgram(data);
}

export async function updateApprenticeshipProgram(
  id: string,
  updates: Partial<ApprenticeshipProgram>
): Promise<ApprenticeshipProgram | null> {
  const updateData: Record<string, unknown> = {};

  if (updates.programName !== undefined) updateData.program_name = updates.programName;
  if (updates.apprenticeshipType !== undefined) updateData.apprenticeship_type = updates.apprenticeshipType;
  if (updates.occupation !== undefined) updateData.occupation = updates.occupation;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.totalSlots !== undefined) updateData.total_slots = updates.totalSlots;
  if (updates.activeApprentices !== undefined) updateData.active_apprentices = updates.activeApprentices;
  if (updates.graduatedYTD !== undefined) updateData.graduated_ytd = updates.graduatedYTD;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.startingWage !== undefined) updateData.starting_wage = updates.startingWage;
  if (updates.journeyWage !== undefined) updateData.journey_wage = updates.journeyWage;

  const { data, error } = await supabase
    .from('municipality_apprenticeship_programs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return transformApprenticeshipProgram(data);
}

export async function deleteApprenticeshipProgram(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('municipality_apprenticeship_programs')
    .delete()
    .eq('id', id);

  return !error;
}

// ===========================================
// PARTICIPANTS
// ===========================================

export async function getParticipants(
  municipalityId: string,
  filters?: ParticipantFilters
): Promise<MunicipalityParticipant[]> {
  let query = supabase
    .from('municipality_participants')
    .select('*')
    .eq('municipality_id', municipalityId);

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.programType) query = query.eq('program_type', filters.programType);
  if (filters?.department) query = query.eq('department', filters.department);
  if (filters?.isResident !== undefined) query = query.eq('is_resident', filters.isResident);
  if (filters?.isVeteran !== undefined) query = query.eq('is_veteran', filters.isVeteran);
  if (filters?.placedInCity !== undefined) query = query.eq('placed_in_city', filters.placedInCity);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(transformParticipant);
}

export async function createParticipant(
  participant: Omit<MunicipalityParticipant, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MunicipalityParticipant | null> {
  const { data, error } = await supabase
    .from('municipality_participants')
    .insert({
      municipality_id: participant.municipalityId,
      program_id: participant.programId,
      program_type: participant.programType,
      first_name: participant.firstName,
      last_name: participant.lastName,
      email: participant.email,
      phone: participant.phone,
      date_of_birth: participant.dateOfBirth,
      city: participant.city,
      zip_code: participant.zipCode,
      is_resident: participant.isResident,
      education_level: participant.educationLevel,
      current_school: participant.currentSchool,
      major: participant.major,
      expected_graduation: participant.expectedGraduation,
      gpa: participant.gpa,
      meets_income_requirement: participant.meetsIncomeRequirement,
      is_veteran: participant.isVeteran,
      has_disability: participant.hasDisability,
      is_first_gen_college: participant.isFirstGenCollege,
      department: participant.department,
      supervisor: participant.supervisor,
      start_date: participant.startDate,
      expected_end_date: participant.expectedEndDate,
      status: participant.status
    })
    .select()
    .single();

  if (error || !data) return null;
  return transformParticipant(data);
}

export async function updateParticipant(
  id: string,
  updates: Partial<MunicipalityParticipant>
): Promise<MunicipalityParticipant | null> {
  const updateData: Record<string, unknown> = {};

  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.hoursCompleted !== undefined) updateData.hours_completed = updates.hoursCompleted;
  if (updates.actualEndDate !== undefined) updateData.actual_end_date = updates.actualEndDate;
  if (updates.currentWage !== undefined) updateData.current_wage = updates.currentWage;
  if (updates.ojtHoursCompleted !== undefined) updateData.ojt_hours_completed = updates.ojtHoursCompleted;
  if (updates.rtiHoursCompleted !== undefined) updateData.rti_hours_completed = updates.rtiHoursCompleted;
  if (updates.competenciesCompleted !== undefined) updateData.competencies_completed = updates.competenciesCompleted;
  if (updates.civilServiceStatus !== undefined) updateData.civil_service_status = updates.civilServiceStatus;
  if (updates.examScore !== undefined) updateData.exam_score = updates.examScore;
  if (updates.listPosition !== undefined) updateData.list_position = updates.listPosition;
  if (updates.placedInCity !== undefined) updateData.placed_in_city = updates.placedInCity;
  if (updates.placementType !== undefined) updateData.placement_type = updates.placementType;
  if (updates.placementDepartment !== undefined) updateData.placement_department = updates.placementDepartment;
  if (updates.placementTitle !== undefined) updateData.placement_title = updates.placementTitle;
  if (updates.placementSalary !== undefined) updateData.placement_salary = updates.placementSalary;
  if (updates.placementDate !== undefined) updateData.placement_date = updates.placementDate;
  if (updates.midpointEvaluation !== undefined) updateData.midpoint_evaluation = updates.midpointEvaluation;
  if (updates.finalEvaluation !== undefined) updateData.final_evaluation = updates.finalEvaluation;
  if (updates.supervisorRecommendation !== undefined) updateData.supervisor_recommendation = updates.supervisorRecommendation;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  const { data, error } = await supabase
    .from('municipality_participants')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return transformParticipant(data);
}

// ===========================================
// DEPARTMENT WORKFORCE NEEDS
// ===========================================

export async function getDepartmentNeeds(
  municipalityId: string,
  filters?: DepartmentFilters
): Promise<DepartmentWorkforceNeed[]> {
  let query = supabase
    .from('municipality_department_needs')
    .select('*')
    .eq('municipality_id', municipalityId);

  if (filters?.department) query = query.eq('department', filters.department);
  if (filters?.hasVacancies) query = query.gt('vacancy_rate', 0);

  const { data, error } = await query.order('vacancy_rate', { ascending: false });

  if (error || !data) return [];
  return data.map(transformDepartmentNeed);
}

export async function updateDepartmentNeed(
  id: string,
  updates: Partial<DepartmentWorkforceNeed>
): Promise<DepartmentWorkforceNeed | null> {
  const updateData: Record<string, unknown> = {};

  if (updates.authorizedPositions !== undefined) updateData.authorized_positions = updates.authorizedPositions;
  if (updates.filledPositions !== undefined) updateData.filled_positions = updates.filledPositions;
  if (updates.vacancyRate !== undefined) updateData.vacancy_rate = updates.vacancyRate;
  if (updates.retirementEligible5Years !== undefined) updateData.retirement_eligible_5_years = updates.retirementEligible5Years;
  if (updates.hardToFillPositions !== undefined) updateData.hard_to_fill_positions = updates.hardToFillPositions;
  if (updates.criticalSkillGaps !== undefined) updateData.critical_skill_gaps = updates.criticalSkillGaps;
  if (updates.internSlotsRequested !== undefined) updateData.intern_slots_requested = updates.internSlotsRequested;
  if (updates.internSlotsApproved !== undefined) updateData.intern_slots_approved = updates.internSlotsApproved;
  if (updates.apprenticeSlotsRequested !== undefined) updateData.apprentice_slots_requested = updates.apprenticeSlotsRequested;
  if (updates.apprenticeSlotsApproved !== undefined) updateData.apprentice_slots_approved = updates.apprenticeSlotsApproved;

  updateData.last_updated = new Date().toISOString();

  const { data, error } = await supabase
    .from('municipality_department_needs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return transformDepartmentNeed(data);
}

// ===========================================
// CIVIL SERVICE EXAMS
// ===========================================

export async function getCivilServiceExams(municipalityId: string): Promise<CivilServiceExam[]> {
  const { data, error } = await supabase
    .from('municipality_civil_service_exams')
    .select('*')
    .eq('municipality_id', municipalityId)
    .order('exam_date', { ascending: true });

  if (error || !data) return [];
  return data.map(transformCivilServiceExam);
}

export async function createCivilServiceExam(
  exam: Omit<CivilServiceExam, 'id'>
): Promise<CivilServiceExam | null> {
  const { data, error } = await supabase
    .from('municipality_civil_service_exams')
    .insert({
      municipality_id: exam.municipalityId,
      exam_title: exam.examTitle,
      exam_number: exam.examNumber,
      job_classification: exam.jobClassification,
      application_open_date: exam.applicationOpenDate,
      application_close_date: exam.applicationCloseDate,
      exam_date: exam.examDate,
      results_expected_date: exam.resultsExpectedDate,
      list_expiration_date: exam.listExpirationDate,
      exam_type: exam.examType,
      is_continuous: exam.isContinuous,
      passing_score: exam.passingScore,
      linked_program_ids: exam.linkedProgramIds,
      status: exam.status
    })
    .select()
    .single();

  if (error || !data) return null;
  return transformCivilServiceExam(data);
}

// ===========================================
// UNION PARTNERSHIPS
// ===========================================

export async function getUnionPartnerships(municipalityId: string): Promise<UnionPartnership[]> {
  const { data, error } = await supabase
    .from('municipality_union_partnerships')
    .select('*')
    .eq('municipality_id', municipalityId)
    .order('union_name', { ascending: true });

  if (error || !data) return [];
  return data.map(transformUnionPartnership);
}

export async function createUnionPartnership(
  partnership: Omit<UnionPartnership, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UnionPartnership | null> {
  const { data, error } = await supabase
    .from('municipality_union_partnerships')
    .insert({
      municipality_id: partnership.municipalityId,
      union_name: partnership.unionName,
      union_local: partnership.unionLocal,
      contact_name: partnership.contactName,
      contact_email: partnership.contactEmail,
      contact_phone: partnership.contactPhone,
      agreement_type: partnership.agreementType,
      agreement_start_date: partnership.agreementStartDate,
      agreement_end_date: partnership.agreementEndDate,
      covered_occupations: partnership.coveredOccupations,
      covered_departments: partnership.coveredDepartments,
      apprenticeship_program_ids: partnership.apprenticeshipProgramIds,
      uses_hiring_hall: partnership.usesHiringHall,
      hiring_hall_procedure: partnership.hiringHallProcedure,
      is_active: partnership.isActive
    })
    .select()
    .single();

  if (error || !data) return null;
  return transformUnionPartnership(data);
}

// ===========================================
// REPORTS
// ===========================================

export async function getReports(municipalityId: string): Promise<MunicipalityReport[]> {
  const { data, error } = await supabase
    .from('municipality_reports')
    .select('*')
    .eq('municipality_id', municipalityId)
    .order('due_date', { ascending: true });

  if (error || !data) return [];
  return data.map(transformReport);
}

export async function createReport(
  report: Omit<MunicipalityReport, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MunicipalityReport | null> {
  const { data, error } = await supabase
    .from('municipality_reports')
    .insert({
      municipality_id: report.municipalityId,
      report_type: report.reportType,
      report_title: report.reportTitle,
      report_period: report.reportPeriod,
      due_date: report.dueDate,
      status: report.status,
      program_ids: report.programIds,
      grant_number: report.grantNumber,
      grantor_agency: report.grantorAgency,
      created_by: report.createdBy
    })
    .select()
    .single();

  if (error || !data) return null;
  return transformReport(data);
}

export async function updateReport(
  id: string,
  updates: Partial<MunicipalityReport>
): Promise<MunicipalityReport | null> {
  const updateData: Record<string, unknown> = {};

  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.submittedDate !== undefined) updateData.submitted_date = updates.submittedDate;
  if (updates.attachmentUrls !== undefined) updateData.attachment_urls = updates.attachmentUrls;

  const { data, error } = await supabase
    .from('municipality_reports')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return transformReport(data);
}

// ===========================================
// DASHBOARD METRICS
// ===========================================

export async function getMunicipalityDashboardMetrics(
  municipalityId: string
): Promise<MunicipalityDashboardMetrics> {
  // Get internship programs
  const { data: internships } = await supabase
    .from('municipality_internship_programs')
    .select('*')
    .eq('municipality_id', municipalityId)
    .eq('status', 'active');

  // Get apprenticeship programs
  const { data: apprenticeships } = await supabase
    .from('municipality_apprenticeship_programs')
    .select('*')
    .eq('municipality_id', municipalityId)
    .eq('status', 'active');

  // Get participants
  const { data: participants } = await supabase
    .from('municipality_participants')
    .select('*')
    .eq('municipality_id', municipalityId);

  const activeParticipants = participants?.filter(p => ['active', 'enrolled'].includes(p.status)) || [];
  const placedParticipants = participants?.filter(p => p.placed_in_city) || [];

  // Calculate metrics
  const totalBudget = (internships || []).reduce((sum, p) => sum + (p.total_budget || 0), 0) +
    (apprenticeships || []).reduce((sum, p) => sum + ((p.employer_contribution || 0) + (p.grant_funding || 0)), 0);

  return {
    activeInternships: internships?.length || 0,
    activeApprenticeships: apprenticeships?.length || 0,
    totalParticipants: activeParticipants.length,
    totalPlacements: placedParticipants.length,
    applicationsThisMonth: 0,
    enrollmentsThisMonth: 0,
    completionsThisMonth: 0,
    placementsThisMonth: 0,
    avgCompletionRate: 85,
    avgConversionRate: 35,
    avgRetentionRate: 92,
    avgTimeToFill: 119,
    participantsByAge: [
      { range: '14-17', count: 45 },
      { range: '18-21', count: 120 },
      { range: '22-24', count: 85 },
      { range: '25+', count: 30 }
    ],
    participantsByDepartment: [],
    participantsByProgram: [],
    totalProgramBudget: totalBudget,
    budgetSpentYTD: totalBudget * 0.67,
    costPerPlacement: placedParticipants.length > 0 ? totalBudget / placedParticipants.length : 0,
    vacanciesFilled: placedParticipants.length,
    diversityHires: Math.round(placedParticipants.length * 0.45),
    youthEmployed: activeParticipants.length,
    veteransEmployed: participants?.filter(p => p.is_veteran).length || 0,
    monthlyEnrollments: [],
    monthlyPlacements: [],
    quarterlyRetention: []
  };
}
