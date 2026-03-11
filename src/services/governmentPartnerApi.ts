// ===========================================
// Government Partner API Service
// Federal Agencies, State Workforce Boards, CHIPS Act Programs
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  GovernmentPartner,
  WorkforceProgram,
  ProgramParticipant,
  EmployerPartnership,
  ComplianceReport,
  RegionalLaborData,
  EconomicImpactMetrics,
  GovernmentDashboardMetrics,
  ProgramFilters,
  ParticipantFilters,
  EmployerFilters,
  ReportFilters
} from '@/types/governmentPartner';

// ===========================================
// GOVERNMENT PARTNER OPERATIONS
// ===========================================

export async function getGovernmentPartner(userId: string): Promise<GovernmentPartner | null> {
  try {
    const { data, error } = await supabase
      .from('government_partners')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data ? transformPartnerFromDB(data) : null;
  } catch (error) {
    console.error('Error fetching government partner:', error);
    return null;
  }
}

export async function getGovernmentPartnerById(partnerId: string): Promise<GovernmentPartner | null> {
  try {
    const { data, error } = await supabase
      .from('government_partners')
      .select('*')
      .eq('id', partnerId)
      .single();

    if (error) throw error;
    return data ? transformPartnerFromDB(data) : null;
  } catch (error) {
    console.error('Error fetching government partner by ID:', error);
    return null;
  }
}

export async function updateGovernmentPartner(
  partnerId: string,
  updates: Partial<Omit<GovernmentPartner, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<GovernmentPartner | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.agencyName !== undefined) dbUpdates.agency_name = updates.agencyName;
    if (updates.agencyType !== undefined) dbUpdates.agency_type = updates.agencyType;
    if (updates.agencyLevel !== undefined) dbUpdates.agency_level = updates.agencyLevel;
    if (updates.agencyCode !== undefined) dbUpdates.agency_code = updates.agencyCode;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.state !== undefined) dbUpdates.state = updates.state;
    if (updates.region !== undefined) dbUpdates.region = updates.region;
    if (updates.tier !== undefined) dbUpdates.tier = updates.tier;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.primaryContactName !== undefined) dbUpdates.primary_contact_name = updates.primaryContactName;
    if (updates.primaryContactEmail !== undefined) dbUpdates.primary_contact_email = updates.primaryContactEmail;
    if (updates.primaryContactPhone !== undefined) dbUpdates.primary_contact_phone = updates.primaryContactPhone;
    if (updates.primaryContactTitle !== undefined) dbUpdates.primary_contact_title = updates.primaryContactTitle;
    if (updates.jurisdiction !== undefined) dbUpdates.jurisdiction = updates.jurisdiction;
    if (updates.coveredPopulation !== undefined) dbUpdates.covered_population = updates.coveredPopulation;
    if (updates.annualBudget !== undefined) dbUpdates.annual_budget = updates.annualBudget;

    const { data, error } = await supabase
      .from('government_partners')
      .update(dbUpdates)
      .eq('id', partnerId)
      .select()
      .single();

    if (error) throw error;
    return transformPartnerFromDB(data);
  } catch (error) {
    console.error('Error updating government partner:', error);
    return null;
  }
}

export async function createGovernmentPartner(
  partner: Omit<GovernmentPartner, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GovernmentPartner | null> {
  try {
    const { data, error } = await supabase
      .from('government_partners')
      .insert({
        user_id: partner.userId,
        agency_name: partner.agencyName,
        agency_type: partner.agencyType,
        agency_level: partner.agencyLevel,
        agency_code: partner.agencyCode,
        city: partner.city,
        state: partner.state,
        region: partner.region,
        tier: partner.tier || 'basic',
        status: partner.status || 'pending',
        primary_contact_name: partner.primaryContactName,
        primary_contact_email: partner.primaryContactEmail,
        primary_contact_phone: partner.primaryContactPhone,
        primary_contact_title: partner.primaryContactTitle,
        jurisdiction: partner.jurisdiction,
        covered_population: partner.coveredPopulation,
        annual_budget: partner.annualBudget,
      })
      .select()
      .single();

    if (error) throw error;
    return transformPartnerFromDB(data);
  } catch (error) {
    console.error('Error creating government partner:', error);
    return null;
  }
}

// ===========================================
// WORKFORCE PROGRAM OPERATIONS
// ===========================================

export async function getWorkforcePrograms(partnerId: string, filters?: ProgramFilters): Promise<WorkforceProgram[]> {
  try {
    let query = supabase
      .from('workforce_programs')
      .select('*')
      .eq('partner_id', partnerId);

    if (filters?.programType) {
      query = query.eq('program_type', filters.programType);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.fundingSource) {
      query = query.eq('funding_source', filters.fundingSource);
    }
    if (filters?.complianceStatus) {
      query = query.eq('compliance_status', filters.complianceStatus);
    }
    if (filters?.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformProgramFromDB);
  } catch (error) {
    console.error('Error fetching workforce programs:', error);
    return [];
  }
}

export async function createWorkforceProgram(
  partnerId: string,
  program: Omit<WorkforceProgram, 'id' | 'partnerId' | 'budgetRemaining' | 'createdAt' | 'updatedAt'>
): Promise<WorkforceProgram | null> {
  try {
    const { data, error } = await supabase
      .from('workforce_programs')
      .insert({
        partner_id: partnerId,
        name: program.name,
        program_type: program.programType,
        description: program.description,
        funding_source: program.fundingSource,
        grant_number: program.grantNumber,
        total_budget: program.totalBudget,
        spent_to_date: program.spentToDate,
        start_date: program.startDate,
        end_date: program.endDate,
        reporting_deadlines: program.reportingDeadlines,
        enrollment_target: program.enrollmentTarget,
        placement_target: program.placementTarget,
        wage_gain_target: program.wageGainTarget,
        current_enrollment: program.currentEnrollment,
        completed_count: program.completedCount,
        placed_count: program.placedCount,
        average_wage_gain: program.averageWageGain,
        status: program.status,
        milestone_progress: program.milestoneProgress,
        compliance_status: program.complianceStatus,
        last_report_date: program.lastReportDate,
        next_report_due: program.nextReportDue,
        industry_focus: program.industryFocus,
        occupation_codes: program.occupationCodes
      })
      .select()
      .single();

    if (error) throw error;
    return transformProgramFromDB(data);
  } catch (error) {
    console.error('Error creating workforce program:', error);
    return null;
  }
}

export async function updateWorkforceProgram(
  programId: string,
  updates: Partial<Omit<WorkforceProgram, 'id' | 'partnerId' | 'budgetRemaining' | 'createdAt' | 'updatedAt'>>
): Promise<WorkforceProgram | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.programType !== undefined) dbUpdates.program_type = updates.programType;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.fundingSource !== undefined) dbUpdates.funding_source = updates.fundingSource;
    if (updates.grantNumber !== undefined) dbUpdates.grant_number = updates.grantNumber;
    if (updates.totalBudget !== undefined) dbUpdates.total_budget = updates.totalBudget;
    if (updates.spentToDate !== undefined) dbUpdates.spent_to_date = updates.spentToDate;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.reportingDeadlines !== undefined) dbUpdates.reporting_deadlines = updates.reportingDeadlines;
    if (updates.enrollmentTarget !== undefined) dbUpdates.enrollment_target = updates.enrollmentTarget;
    if (updates.placementTarget !== undefined) dbUpdates.placement_target = updates.placementTarget;
    if (updates.wageGainTarget !== undefined) dbUpdates.wage_gain_target = updates.wageGainTarget;
    if (updates.currentEnrollment !== undefined) dbUpdates.current_enrollment = updates.currentEnrollment;
    if (updates.completedCount !== undefined) dbUpdates.completed_count = updates.completedCount;
    if (updates.placedCount !== undefined) dbUpdates.placed_count = updates.placedCount;
    if (updates.averageWageGain !== undefined) dbUpdates.average_wage_gain = updates.averageWageGain;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.milestoneProgress !== undefined) dbUpdates.milestone_progress = updates.milestoneProgress;
    if (updates.complianceStatus !== undefined) dbUpdates.compliance_status = updates.complianceStatus;
    if (updates.lastReportDate !== undefined) dbUpdates.last_report_date = updates.lastReportDate;
    if (updates.nextReportDue !== undefined) dbUpdates.next_report_due = updates.nextReportDue;
    if (updates.industryFocus !== undefined) dbUpdates.industry_focus = updates.industryFocus;
    if (updates.occupationCodes !== undefined) dbUpdates.occupation_codes = updates.occupationCodes;

    const { data, error } = await supabase
      .from('workforce_programs')
      .update(dbUpdates)
      .eq('id', programId)
      .select()
      .single();

    if (error) throw error;
    return transformProgramFromDB(data);
  } catch (error) {
    console.error('Error updating workforce program:', error);
    return null;
  }
}

export async function deleteWorkforceProgram(programId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('workforce_programs')
      .delete()
      .eq('id', programId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting workforce program:', error);
    return false;
  }
}

// ===========================================
// PARTICIPANT OPERATIONS
// ===========================================

export async function getProgramParticipants(partnerId: string, filters?: ParticipantFilters): Promise<ProgramParticipant[]> {
  try {
    let query = supabase
      .from('program_participants')
      .select('*')
      .eq('partner_id', partnerId);

    if (filters?.programId) {
      query = query.eq('program_id', filters.programId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.veteranStatus !== undefined) {
      query = query.eq('veteran_status', filters.veteranStatus);
    }
    if (filters?.placed !== undefined) {
      query = query.eq('placed', filters.placed);
    }
    if (filters?.searchQuery) {
      query = query.or(`first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,email.ilike.%${filters.searchQuery}%`);
    }

    const { data, error } = await query.order('enrollment_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformParticipantFromDB);
  } catch (error) {
    console.error('Error fetching program participants:', error);
    return [];
  }
}

export async function createProgramParticipant(
  partnerId: string,
  participant: Omit<ProgramParticipant, 'id' | 'partnerId' | 'wageGain' | 'wageGainPercent' | 'createdAt' | 'updatedAt'>
): Promise<ProgramParticipant | null> {
  try {
    const { data, error } = await supabase
      .from('program_participants')
      .insert({
        partner_id: partnerId,
        program_id: participant.programId,
        first_name: participant.firstName,
        last_name: participant.lastName,
        email: participant.email,
        phone: participant.phone,
        date_of_birth: participant.dateOfBirth,
        zip_code: participant.zipCode,
        county: participant.county,
        veteran_status: participant.veteranStatus,
        disability_status: participant.disabilityStatus,
        barriers: participant.barriers,
        education_level: participant.educationLevel,
        prior_credentials: participant.priorCredentials,
        employed_at_enrollment: participant.employedAtEnrollment,
        prior_wage: participant.priorWage,
        prior_occupation: participant.priorOccupation,
        unemployment_duration: participant.unemploymentDuration,
        status: participant.status,
        enrollment_date: participant.enrollmentDate,
        exit_date: participant.exitDate,
        completion_date: participant.completionDate,
        training_hours_completed: participant.trainingHoursCompleted,
        credentials_earned: participant.credentialsEarned,
        skills_gained: participant.skillsGained,
        placed: participant.placed,
        placement_date: participant.placementDate,
        placement_employer: participant.placementEmployer,
        placement_occupation: participant.placementOccupation,
        placement_wage: participant.placementWage,
        retained_at_90_days: participant.retainedAt90Days,
        retained_at_180_days: participant.retainedAt180Days
      })
      .select()
      .single();

    if (error) throw error;
    return transformParticipantFromDB(data);
  } catch (error) {
    console.error('Error creating program participant:', error);
    return null;
  }
}

export async function updateParticipantStatus(
  participantId: string,
  updates: Partial<Pick<ProgramParticipant, 'status' | 'exitDate' | 'completionDate' | 'placed' | 'placementDate' | 'placementEmployer' | 'placementOccupation' | 'placementWage' | 'retainedAt90Days' | 'retainedAt180Days'>>
): Promise<ProgramParticipant | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.exitDate !== undefined) dbUpdates.exit_date = updates.exitDate;
    if (updates.completionDate !== undefined) dbUpdates.completion_date = updates.completionDate;
    if (updates.placed !== undefined) dbUpdates.placed = updates.placed;
    if (updates.placementDate !== undefined) dbUpdates.placement_date = updates.placementDate;
    if (updates.placementEmployer !== undefined) dbUpdates.placement_employer = updates.placementEmployer;
    if (updates.placementOccupation !== undefined) dbUpdates.placement_occupation = updates.placementOccupation;
    if (updates.placementWage !== undefined) dbUpdates.placement_wage = updates.placementWage;
    if (updates.retainedAt90Days !== undefined) dbUpdates.retained_at_90_days = updates.retainedAt90Days;
    if (updates.retainedAt180Days !== undefined) dbUpdates.retained_at_180_days = updates.retainedAt180Days;

    const { data, error } = await supabase
      .from('program_participants')
      .update(dbUpdates)
      .eq('id', participantId)
      .select()
      .single();

    if (error) throw error;
    return transformParticipantFromDB(data);
  } catch (error) {
    console.error('Error updating participant status:', error);
    return null;
  }
}

export async function deleteParticipant(participantId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('program_participants')
      .delete()
      .eq('id', participantId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting participant:', error);
    return false;
  }
}

// ===========================================
// EMPLOYER PARTNERSHIP OPERATIONS
// ===========================================

export async function getEmployerPartnerships(partnerId: string, filters?: EmployerFilters): Promise<EmployerPartnership[]> {
  try {
    let query = supabase
      .from('employer_partnerships')
      .select('*')
      .eq('partner_id', partnerId);

    if (filters?.programId) {
      query = query.eq('program_id', filters.programId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters?.searchQuery) {
      query = query.ilike('employer_name', `%${filters.searchQuery}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformEmployerFromDB);
  } catch (error) {
    console.error('Error fetching employer partnerships:', error);
    return [];
  }
}

export async function createEmployerPartnership(
  partnerId: string,
  employer: Omit<EmployerPartnership, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<EmployerPartnership | null> {
  try {
    const { data, error } = await supabase
      .from('employer_partnerships')
      .insert({
        partner_id: partnerId,
        program_id: employer.programId,
        employer_name: employer.employerName,
        industry: employer.industry,
        naics_code: employer.naicsCode,
        contact_name: employer.contactName,
        contact_email: employer.contactEmail,
        contact_phone: employer.contactPhone,
        contact_title: employer.contactTitle,
        city: employer.city,
        state: employer.state,
        commitment_types: employer.commitmentTypes,
        status: employer.status,
        hiring_pledge_count: employer.hiringPledgeCount,
        hired_to_date: employer.hiredToDate,
        wage_commitment: employer.wageCommitment,
        ojt_slots_offered: employer.ojtSlotsOffered,
        ojt_slots_used: employer.ojtSlotsUsed,
        apprenticeship_slots: employer.apprenticeshipSlots,
        agreement_start_date: employer.agreementStartDate,
        agreement_end_date: employer.agreementEndDate,
        moa_signed_date: employer.moaSignedDate,
        notes: employer.notes
      })
      .select()
      .single();

    if (error) throw error;
    return transformEmployerFromDB(data);
  } catch (error) {
    console.error('Error creating employer partnership:', error);
    return null;
  }
}

export async function updateEmployerPartnership(
  employerId: string,
  updates: Partial<Omit<EmployerPartnership, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>>
): Promise<EmployerPartnership | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.programId !== undefined) dbUpdates.program_id = updates.programId;
    if (updates.employerName !== undefined) dbUpdates.employer_name = updates.employerName;
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry;
    if (updates.naicsCode !== undefined) dbUpdates.naics_code = updates.naicsCode;
    if (updates.contactName !== undefined) dbUpdates.contact_name = updates.contactName;
    if (updates.contactEmail !== undefined) dbUpdates.contact_email = updates.contactEmail;
    if (updates.contactPhone !== undefined) dbUpdates.contact_phone = updates.contactPhone;
    if (updates.contactTitle !== undefined) dbUpdates.contact_title = updates.contactTitle;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.state !== undefined) dbUpdates.state = updates.state;
    if (updates.commitmentTypes !== undefined) dbUpdates.commitment_types = updates.commitmentTypes;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.hiringPledgeCount !== undefined) dbUpdates.hiring_pledge_count = updates.hiringPledgeCount;
    if (updates.hiredToDate !== undefined) dbUpdates.hired_to_date = updates.hiredToDate;
    if (updates.wageCommitment !== undefined) dbUpdates.wage_commitment = updates.wageCommitment;
    if (updates.ojtSlotsOffered !== undefined) dbUpdates.ojt_slots_offered = updates.ojtSlotsOffered;
    if (updates.ojtSlotsUsed !== undefined) dbUpdates.ojt_slots_used = updates.ojtSlotsUsed;
    if (updates.apprenticeshipSlots !== undefined) dbUpdates.apprenticeship_slots = updates.apprenticeshipSlots;
    if (updates.agreementStartDate !== undefined) dbUpdates.agreement_start_date = updates.agreementStartDate;
    if (updates.agreementEndDate !== undefined) dbUpdates.agreement_end_date = updates.agreementEndDate;
    if (updates.moaSignedDate !== undefined) dbUpdates.moa_signed_date = updates.moaSignedDate;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { data, error } = await supabase
      .from('employer_partnerships')
      .update(dbUpdates)
      .eq('id', employerId)
      .select()
      .single();

    if (error) throw error;
    return transformEmployerFromDB(data);
  } catch (error) {
    console.error('Error updating employer partnership:', error);
    return null;
  }
}

export async function deleteEmployerPartnership(employerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('employer_partnerships')
      .delete()
      .eq('id', employerId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting employer partnership:', error);
    return false;
  }
}

// ===========================================
// COMPLIANCE REPORT OPERATIONS
// ===========================================

export async function getComplianceReports(partnerId: string, filters?: ReportFilters): Promise<ComplianceReport[]> {
  try {
    let query = supabase
      .from('compliance_reports')
      .select('*')
      .eq('partner_id', partnerId);

    if (filters?.programId) {
      query = query.eq('program_id', filters.programId);
    }
    if (filters?.reportType) {
      query = query.eq('report_type', filters.reportType);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.overdue) {
      query = query.lt('due_date', new Date().toISOString().split('T')[0])
        .not('status', 'in', '(submitted,accepted)');
    }

    const { data, error } = await query.order('due_date', { ascending: true });

    if (error) throw error;
    return (data || []).map(transformReportFromDB);
  } catch (error) {
    console.error('Error fetching compliance reports:', error);
    return [];
  }
}

export async function createComplianceReport(
  partnerId: string,
  report: Omit<ComplianceReport, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<ComplianceReport | null> {
  try {
    const { data, error } = await supabase
      .from('compliance_reports')
      .insert({
        partner_id: partnerId,
        program_id: report.programId,
        report_type: report.reportType,
        reporting_period_start: report.reportingPeriodStart,
        reporting_period_end: report.reportingPeriodEnd,
        due_date: report.dueDate,
        status: report.status,
        submitted_date: report.submittedDate,
        accepted_date: report.acceptedDate,
        rejection_reason: report.rejectionReason,
        enrollment_count: report.enrollmentCount,
        completion_count: report.completionCount,
        placement_count: report.placementCount,
        placement_rate: report.placementRate,
        average_wage_at_placement: report.averageWageAtPlacement,
        average_wage_gain: report.averageWageGain,
        expenditures_reported: report.expendituresReported,
        veterans_enrolled: report.veteransEnrolled,
        veterans_placed: report.veteransPlaced,
        prepared_by: report.preparedBy,
        reviewed_by: report.reviewedBy,
        notes: report.notes
      })
      .select()
      .single();

    if (error) throw error;
    return transformReportFromDB(data);
  } catch (error) {
    console.error('Error creating compliance report:', error);
    return null;
  }
}

export async function updateComplianceReport(
  reportId: string,
  updates: Partial<Omit<ComplianceReport, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>>
): Promise<ComplianceReport | null> {
  try {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.submittedDate !== undefined) dbUpdates.submitted_date = updates.submittedDate;
    if (updates.acceptedDate !== undefined) dbUpdates.accepted_date = updates.acceptedDate;
    if (updates.rejectionReason !== undefined) dbUpdates.rejection_reason = updates.rejectionReason;
    if (updates.enrollmentCount !== undefined) dbUpdates.enrollment_count = updates.enrollmentCount;
    if (updates.completionCount !== undefined) dbUpdates.completion_count = updates.completionCount;
    if (updates.placementCount !== undefined) dbUpdates.placement_count = updates.placementCount;
    if (updates.placementRate !== undefined) dbUpdates.placement_rate = updates.placementRate;
    if (updates.averageWageAtPlacement !== undefined) dbUpdates.average_wage_at_placement = updates.averageWageAtPlacement;
    if (updates.averageWageGain !== undefined) dbUpdates.average_wage_gain = updates.averageWageGain;
    if (updates.expendituresReported !== undefined) dbUpdates.expenditures_reported = updates.expendituresReported;
    if (updates.veteransEnrolled !== undefined) dbUpdates.veterans_enrolled = updates.veteransEnrolled;
    if (updates.veteransPlaced !== undefined) dbUpdates.veterans_placed = updates.veteransPlaced;
    if (updates.reviewedBy !== undefined) dbUpdates.reviewed_by = updates.reviewedBy;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { data, error } = await supabase
      .from('compliance_reports')
      .update(dbUpdates)
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return transformReportFromDB(data);
  } catch (error) {
    console.error('Error updating compliance report:', error);
    return null;
  }
}

export async function deleteComplianceReport(reportId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('compliance_reports')
      .delete()
      .eq('id', reportId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting compliance report:', error);
    return false;
  }
}

// ===========================================
// REGIONAL LABOR DATA OPERATIONS
// ===========================================

export async function getRegionalLaborData(partnerId: string): Promise<RegionalLaborData[]> {
  try {
    const { data, error } = await supabase
      .from('regional_labor_data')
      .select('*')
      .eq('partner_id', partnerId)
      .order('data_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformLaborDataFromDB);
  } catch (error) {
    console.error('Error fetching regional labor data:', error);
    return [];
  }
}

export async function createRegionalLaborData(
  partnerId: string,
  laborData: Omit<RegionalLaborData, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>
): Promise<RegionalLaborData | null> {
  try {
    const { data, error } = await supabase
      .from('regional_labor_data')
      .insert({
        partner_id: partnerId,
        region: laborData.region,
        state: laborData.state,
        data_date: laborData.dataDate,
        labor_force_size: laborData.laborForceSize,
        unemployment_rate: laborData.unemploymentRate,
        stem_workforce: laborData.stemWorkforce,
        stem_unemployment_rate: laborData.stemUnemploymentRate,
        job_openings: laborData.jobOpenings,
        stem_job_openings: laborData.stemJobOpenings,
        hard_to_fill_positions: laborData.hardToFillPositions,
        median_wage: laborData.medianWage,
        stem_median_wage: laborData.stemMedianWage,
        wage_growth_yoy: laborData.wageGrowthYoY,
        top_industries: laborData.topIndustries,
        top_occupations: laborData.topOccupations,
        top_skills: laborData.topSkills
      })
      .select()
      .single();

    if (error) throw error;
    return transformLaborDataFromDB(data);
  } catch (error) {
    console.error('Error creating regional labor data:', error);
    return null;
  }
}

// ===========================================
// ECONOMIC IMPACT OPERATIONS
// ===========================================

export async function getEconomicImpactMetrics(partnerId: string, programId?: string): Promise<EconomicImpactMetrics[]> {
  try {
    let query = supabase
      .from('economic_impact_metrics')
      .select('*')
      .eq('partner_id', partnerId);

    if (programId) {
      query = query.eq('program_id', programId);
    }

    const { data, error } = await query.order('calculated_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformEconomicImpactFromDB);
  } catch (error) {
    console.error('Error fetching economic impact metrics:', error);
    return [];
  }
}

export async function createEconomicImpactMetrics(
  partnerId: string,
  metrics: Omit<EconomicImpactMetrics, 'id' | 'partnerId' | 'calculatedAt' | 'createdAt' | 'updatedAt'>
): Promise<EconomicImpactMetrics | null> {
  try {
    const { data, error } = await supabase
      .from('economic_impact_metrics')
      .insert({
        partner_id: partnerId,
        program_id: metrics.programId,
        reporting_period: metrics.reportingPeriod,
        total_wages_generated: metrics.totalWagesGenerated,
        average_wage_gain_per_participant: metrics.averageWageGainPerParticipant,
        jobs_created: metrics.jobsCreated,
        jobs_retained: metrics.jobsRetained,
        estimated_tax_revenue: metrics.estimatedTaxRevenue,
        federal_tax_impact: metrics.federalTaxImpact,
        state_tax_impact: metrics.stateTaxImpact,
        local_tax_impact: metrics.localTaxImpact,
        economic_multiplier: metrics.economicMultiplier,
        total_economic_impact: metrics.totalEconomicImpact,
        program_costs: metrics.programCosts,
        roi_ratio: metrics.roiRatio,
        cost_per_placement: metrics.costPerPlacement,
        cost_per_credential: metrics.costPerCredential,
        public_assistance_reduction: metrics.publicAssistanceReduction
      })
      .select()
      .single();

    if (error) throw error;
    return transformEconomicImpactFromDB(data);
  } catch (error) {
    console.error('Error creating economic impact metrics:', error);
    return null;
  }
}

// ===========================================
// DASHBOARD METRICS
// ===========================================

export async function getGovernmentDashboardMetrics(partnerId: string): Promise<GovernmentDashboardMetrics> {
  try {
    // Get programs
    const { data: programs } = await supabase
      .from('workforce_programs')
      .select('*')
      .eq('partner_id', partnerId);

    // Get participants
    const { data: participants } = await supabase
      .from('program_participants')
      .select('*')
      .eq('partner_id', partnerId);

    // Get employer partnerships
    const { data: employers } = await supabase
      .from('employer_partnerships')
      .select('*')
      .eq('partner_id', partnerId);

    // Get compliance reports
    const { data: reports } = await supabase
      .from('compliance_reports')
      .select('*')
      .eq('partner_id', partnerId);

    // Get economic impact
    const { data: economicData } = await supabase
      .from('economic_impact_metrics')
      .select('*')
      .eq('partner_id', partnerId)
      .order('calculated_at', { ascending: false })
      .limit(1);

    const programsList = programs || [];
    const participantsList = participants || [];
    const employersList = employers || [];
    const reportsList = reports || [];

    const activePrograms = programsList.filter(p => p.status === 'active');
    const chipsPrograms = programsList.filter(p => p.program_type === 'chips_act');
    const atRiskPrograms = programsList.filter(p => p.compliance_status === 'at_risk');

    const totalEnrolled = programsList.reduce((sum, p) => sum + (p.current_enrollment || 0), 0);
    const completedCount = programsList.reduce((sum, p) => sum + (p.completed_count || 0), 0);
    const placedCount = programsList.reduce((sum, p) => sum + (p.placed_count || 0), 0);

    const veterans = participantsList.filter(p => p.veteran_status);
    const veteransPlaced = veterans.filter(p => p.placed);

    const activeEmployers = employersList.filter(e => e.status === 'active');
    const totalPledges = employersList.reduce((sum, e) => sum + (e.hiring_pledge_count || 0), 0);
    const fulfilledPledges = employersList.reduce((sum, e) => sum + (e.hired_to_date || 0), 0);

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const upcomingReports = reportsList.filter(r =>
      r.due_date > today && r.due_date <= thirtyDaysFromNow &&
      r.status !== 'submitted' && r.status !== 'accepted'
    );

    const overdueReports = reportsList.filter(r =>
      r.due_date < today &&
      r.status !== 'submitted' && r.status !== 'accepted'
    );

    const totalEconomicImpact = economicData?.[0]?.total_economic_impact || 0;
    const roiRatio = economicData?.[0]?.roi_ratio || 0;

    // Calculate enrollment progress
    const enrollmentTarget = programsList.reduce((sum, p) => sum + (p.enrollment_target || 0), 0);
    const enrollmentProgress = enrollmentTarget > 0 ? Math.round((totalEnrolled / enrollmentTarget) * 100) : 0;

    // Calculate placement rate
    const overallPlacementRate = completedCount > 0 ? Math.round((placedCount / completedCount) * 100) : 0;
    const placementTarget = programsList.reduce((sum, p) => sum + (p.placement_target || 0), 0) / (programsList.length || 1);

    // Calculate total wages generated
    const totalWagesGenerated = participantsList
      .filter(p => p.placement_wage)
      .reduce((sum, p) => sum + (p.placement_wage || 0), 0);

    // Calculate average wage gain
    const wageGains = participantsList.filter(p => p.wage_gain);
    const averageWageGain = wageGains.length > 0
      ? wageGains.reduce((sum, p) => sum + (p.wage_gain || 0), 0) / wageGains.length
      : 0;

    // Calculate average wage at placement
    const placedParticipants = participantsList.filter(p => p.placement_wage);
    const averageWageAtPlacement = placedParticipants.length > 0
      ? placedParticipants.reduce((sum, p) => sum + (p.placement_wage || 0), 0) / placedParticipants.length
      : 0;

    // Calculate compliance score
    const totalProgramCount = programsList.length || 1;
    const compliantCount = programsList.filter(p => p.compliance_status === 'compliant').length;
    const complianceScore = Math.round((compliantCount / totalProgramCount) * 100);

    // Calculate veterans placement rate
    const veteransPlacementRate = veterans.length > 0
      ? Math.round((veteransPlaced.length / veterans.length) * 100)
      : 0;

    return {
      activePrograms: activePrograms.length,
      totalPrograms: programsList.length,
      chipsActPrograms: chipsPrograms.length,
      programsAtRisk: atRiskPrograms.length,
      totalEnrolled,
      enrollmentThisQuarter: totalEnrolled, // Would need date filtering for actual value
      enrollmentTarget,
      enrollmentProgress,
      completedCount,
      placedCount,
      overallPlacementRate,
      placementTarget,
      averageWageGain,
      totalWagesGenerated,
      averageWageAtPlacement,
      veteransEnrolled: veterans.length,
      veteransPlaced: veteransPlaced.length,
      veteransPlacementRate,
      activeEmployerPartners: activeEmployers.length,
      hiringPledgesTotal: totalPledges,
      hiringPledgesFulfilled: fulfilledPledges,
      upcomingReports: upcomingReports.length,
      overdueReports: overdueReports.length,
      complianceScore,
      totalEconomicImpact,
      roiRatio
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      activePrograms: 0,
      totalPrograms: 0,
      chipsActPrograms: 0,
      programsAtRisk: 0,
      totalEnrolled: 0,
      enrollmentThisQuarter: 0,
      enrollmentTarget: 0,
      enrollmentProgress: 0,
      completedCount: 0,
      placedCount: 0,
      overallPlacementRate: 0,
      placementTarget: 0,
      averageWageGain: 0,
      totalWagesGenerated: 0,
      averageWageAtPlacement: 0,
      veteransEnrolled: 0,
      veteransPlaced: 0,
      veteransPlacementRate: 0,
      activeEmployerPartners: 0,
      hiringPledgesTotal: 0,
      hiringPledgesFulfilled: 0,
      upcomingReports: 0,
      overdueReports: 0,
      complianceScore: 0,
      totalEconomicImpact: 0,
      roiRatio: 0
    };
  }
}

// ===========================================
// TRANSFORM FUNCTIONS
// ===========================================

function transformPartnerFromDB(data: Record<string, unknown>): GovernmentPartner {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    agencyName: data.agency_name as string,
    agencyType: data.agency_type as GovernmentPartner['agencyType'],
    agencyLevel: data.agency_level as GovernmentPartner['agencyLevel'],
    agencyCode: data.agency_code as string | undefined,
    city: data.city as string,
    state: data.state as string,
    region: data.region as string | undefined,
    tier: data.tier as GovernmentPartner['tier'],
    status: data.status as GovernmentPartner['status'],
    primaryContactName: data.primary_contact_name as string,
    primaryContactEmail: data.primary_contact_email as string,
    primaryContactPhone: data.primary_contact_phone as string | undefined,
    primaryContactTitle: data.primary_contact_title as string | undefined,
    jurisdiction: data.jurisdiction as string | undefined,
    coveredPopulation: data.covered_population as number | undefined,
    annualBudget: data.annual_budget as number | undefined,
    stripeCustomerId: data.stripe_customer_id as string | undefined,
    subscriptionStatus: data.subscription_status as GovernmentPartner['subscriptionStatus'],
    approvedAt: data.approved_at as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformProgramFromDB(data: Record<string, unknown>): WorkforceProgram {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    name: data.name as string,
    programType: data.program_type as WorkforceProgram['programType'],
    description: data.description as string,
    fundingSource: data.funding_source as WorkforceProgram['fundingSource'],
    grantNumber: data.grant_number as string | undefined,
    totalBudget: data.total_budget as number,
    spentToDate: data.spent_to_date as number,
    budgetRemaining: data.budget_remaining as number,
    startDate: data.start_date as string,
    endDate: data.end_date as string,
    reportingDeadlines: data.reporting_deadlines as string[],
    enrollmentTarget: data.enrollment_target as number,
    placementTarget: data.placement_target as number,
    wageGainTarget: data.wage_gain_target as number | undefined,
    currentEnrollment: data.current_enrollment as number,
    completedCount: data.completed_count as number,
    placedCount: data.placed_count as number,
    averageWageGain: data.average_wage_gain as number | undefined,
    status: data.status as WorkforceProgram['status'],
    milestoneProgress: data.milestone_progress as number,
    complianceStatus: data.compliance_status as WorkforceProgram['complianceStatus'],
    lastReportDate: data.last_report_date as string | undefined,
    nextReportDue: data.next_report_due as string | undefined,
    industryFocus: data.industry_focus as string[],
    occupationCodes: data.occupation_codes as string[] | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformParticipantFromDB(data: Record<string, unknown>): ProgramParticipant {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    programId: data.program_id as string,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    email: data.email as string | undefined,
    phone: data.phone as string | undefined,
    dateOfBirth: data.date_of_birth as string | undefined,
    zipCode: data.zip_code as string | undefined,
    county: data.county as string | undefined,
    veteranStatus: data.veteran_status as boolean,
    disabilityStatus: data.disability_status as boolean,
    barriers: data.barriers as ProgramParticipant['barriers'],
    educationLevel: data.education_level as string | undefined,
    priorCredentials: data.prior_credentials as string[] | undefined,
    employedAtEnrollment: data.employed_at_enrollment as boolean,
    priorWage: data.prior_wage as number | undefined,
    priorOccupation: data.prior_occupation as string | undefined,
    unemploymentDuration: data.unemployment_duration as number | undefined,
    status: data.status as ProgramParticipant['status'],
    enrollmentDate: data.enrollment_date as string,
    exitDate: data.exit_date as string | undefined,
    completionDate: data.completion_date as string | undefined,
    trainingHoursCompleted: data.training_hours_completed as number,
    credentialsEarned: data.credentials_earned as string[],
    skillsGained: data.skills_gained as string[],
    placed: data.placed as boolean,
    placementDate: data.placement_date as string | undefined,
    placementEmployer: data.placement_employer as string | undefined,
    placementOccupation: data.placement_occupation as string | undefined,
    placementWage: data.placement_wage as number | undefined,
    retainedAt90Days: data.retained_at_90_days as boolean | undefined,
    retainedAt180Days: data.retained_at_180_days as boolean | undefined,
    wageGain: data.wage_gain as number | undefined,
    wageGainPercent: data.wage_gain_percent as number | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformEmployerFromDB(data: Record<string, unknown>): EmployerPartnership {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    programId: data.program_id as string | undefined,
    employerName: data.employer_name as string,
    industry: data.industry as string,
    naicsCode: data.naics_code as string | undefined,
    contactName: data.contact_name as string,
    contactEmail: data.contact_email as string,
    contactPhone: data.contact_phone as string | undefined,
    contactTitle: data.contact_title as string | undefined,
    city: data.city as string,
    state: data.state as string,
    commitmentTypes: data.commitment_types as EmployerPartnership['commitmentTypes'],
    status: data.status as EmployerPartnership['status'],
    hiringPledgeCount: data.hiring_pledge_count as number | undefined,
    hiredToDate: data.hired_to_date as number,
    wageCommitment: data.wage_commitment as number | undefined,
    ojtSlotsOffered: data.ojt_slots_offered as number | undefined,
    ojtSlotsUsed: data.ojt_slots_used as number,
    apprenticeshipSlots: data.apprenticeship_slots as number | undefined,
    agreementStartDate: data.agreement_start_date as string | undefined,
    agreementEndDate: data.agreement_end_date as string | undefined,
    moaSignedDate: data.moa_signed_date as string | undefined,
    notes: data.notes as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformReportFromDB(data: Record<string, unknown>): ComplianceReport {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    programId: data.program_id as string,
    reportType: data.report_type as ComplianceReport['reportType'],
    reportingPeriodStart: data.reporting_period_start as string,
    reportingPeriodEnd: data.reporting_period_end as string,
    dueDate: data.due_date as string,
    status: data.status as ComplianceReport['status'],
    submittedDate: data.submitted_date as string | undefined,
    acceptedDate: data.accepted_date as string | undefined,
    rejectionReason: data.rejection_reason as string | undefined,
    enrollmentCount: data.enrollment_count as number,
    completionCount: data.completion_count as number,
    placementCount: data.placement_count as number,
    placementRate: data.placement_rate as number,
    averageWageAtPlacement: data.average_wage_at_placement as number | undefined,
    averageWageGain: data.average_wage_gain as number | undefined,
    expendituresReported: data.expenditures_reported as number,
    veteransEnrolled: data.veterans_enrolled as number,
    veteransPlaced: data.veterans_placed as number,
    preparedBy: data.prepared_by as string,
    reviewedBy: data.reviewed_by as string | undefined,
    notes: data.notes as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformLaborDataFromDB(data: Record<string, unknown>): RegionalLaborData {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    region: data.region as string,
    state: data.state as string,
    dataDate: data.data_date as string,
    laborForceSize: data.labor_force_size as number,
    unemploymentRate: data.unemployment_rate as number,
    stemWorkforce: data.stem_workforce as number,
    stemUnemploymentRate: data.stem_unemployment_rate as number | undefined,
    jobOpenings: data.job_openings as number,
    stemJobOpenings: data.stem_job_openings as number,
    hardToFillPositions: data.hard_to_fill_positions as number,
    medianWage: data.median_wage as number,
    stemMedianWage: (data.stem_median_wage as number) || 0,
    wageGrowthYoY: data.wage_growth_yoy as number | undefined,
    topIndustries: data.top_industries as RegionalLaborData['topIndustries'],
    topOccupations: data.top_occupations as RegionalLaborData['topOccupations'],
    topSkills: data.top_skills as string[],
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}

function transformEconomicImpactFromDB(data: Record<string, unknown>): EconomicImpactMetrics {
  return {
    id: data.id as string,
    partnerId: data.partner_id as string,
    programId: data.program_id as string | undefined,
    reportingPeriod: data.reporting_period as string,
    totalWagesGenerated: data.total_wages_generated as number,
    averageWageGainPerParticipant: data.average_wage_gain_per_participant as number,
    jobsCreated: data.jobs_created as number,
    jobsRetained: data.jobs_retained as number,
    estimatedTaxRevenue: data.estimated_tax_revenue as number,
    federalTaxImpact: data.federal_tax_impact as number,
    stateTaxImpact: data.state_tax_impact as number,
    localTaxImpact: data.local_tax_impact as number,
    economicMultiplier: data.economic_multiplier as number,
    totalEconomicImpact: data.total_economic_impact as number,
    programCosts: data.program_costs as number,
    roiRatio: data.roi_ratio as number,
    costPerPlacement: (data.cost_per_placement as number) || 0,
    costPerCredential: (data.cost_per_credential as number) || 0,
    publicAssistanceReduction: data.public_assistance_reduction as number | undefined,
    calculatedAt: data.calculated_at as string,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
}
