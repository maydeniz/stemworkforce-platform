// ===========================================
// State Workforce Board API Service
// WIOA Program Management, AJC Operations, Participant Tracking
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  LocalWorkforceBoard,
  AmericanJobCenter,
  AJCDailyTraffic,
  Participant,
  ParticipantProgram,
  ServiceTransaction,
  CaseNote,
  IndividualEmploymentPlan,
  IndividualTrainingAccount,
  Employer,
  JobOrder,
  OJTAgreement,
  WARNNotice,
  RapidResponseEvent,
  GrantAllocation,
  Expenditure,
  WIOAPerformanceGoals,
  ParticipantOutcome,
  ETPLProvider,
  TrainingProgram,
  WorkforceDashboardStats,
  ParticipantStatus,
  WIOAProgram,
  BarrierToEmployment,
} from '@/types/stateWorkforce';

// ===========================================
// LOCAL WORKFORCE BOARDS
// ===========================================

export async function getLocalWorkforceBoards(stateCode?: string): Promise<LocalWorkforceBoard[]> {
  try {
    let query = supabase
      .from('local_workforce_boards')
      .select('*');

    if (stateCode) {
      query = query.eq('address_state', stateCode);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as LocalWorkforceBoard[];
  } catch (error) {
    console.error('Error fetching local workforce boards:', error);
    return [];
  }
}

export async function getLocalWorkforceBoardById(id: string): Promise<LocalWorkforceBoard | null> {
  try {
    const { data, error } = await supabase
      .from('local_workforce_boards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as LocalWorkforceBoard | null;
  } catch (error) {
    console.error('Error fetching LWDB by ID:', error);
    return null;
  }
}

export async function updateLocalWorkforceBoard(
  id: string,
  updates: Partial<Omit<LocalWorkforceBoard, 'id' | 'created_at' | 'updated_at'>>
): Promise<LocalWorkforceBoard | null> {
  try {
    const { data, error } = await supabase
      .from('local_workforce_boards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as LocalWorkforceBoard;
  } catch (error) {
    console.error('Error updating LWDB:', error);
    return null;
  }
}

// ===========================================
// AMERICAN JOB CENTERS
// ===========================================

export async function getAmericanJobCenters(): Promise<AmericanJobCenter[]> {
  try {
    const { data, error } = await supabase
      .from('american_job_centers')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as AmericanJobCenter[];
  } catch (error) {
    console.error('Error fetching American Job Centers:', error);
    return [];
  }
}

export async function getAmericanJobCenterById(id: string): Promise<AmericanJobCenter | null> {
  try {
    const { data, error } = await supabase
      .from('american_job_centers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as AmericanJobCenter | null;
  } catch (error) {
    console.error('Error fetching AJC by ID:', error);
    return null;
  }
}

export async function getAmericanJobCentersByLWDB(lwdbId: string): Promise<AmericanJobCenter[]> {
  try {
    const { data, error } = await supabase
      .from('american_job_centers')
      .select('*')
      .eq('lwdb_id', lwdbId)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as AmericanJobCenter[];
  } catch (error) {
    console.error('Error fetching AJCs by LWDB:', error);
    return [];
  }
}

export async function updateAmericanJobCenter(
  id: string,
  updates: Partial<Omit<AmericanJobCenter, 'id' | 'created_at' | 'updated_at'>>
): Promise<AmericanJobCenter | null> {
  try {
    const { data, error } = await supabase
      .from('american_job_centers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AmericanJobCenter;
  } catch (error) {
    console.error('Error updating AJC:', error);
    return null;
  }
}

export async function getAJCDailyTraffic(
  ajcId: string,
  dateRange?: { start: string; end: string }
): Promise<AJCDailyTraffic[]> {
  try {
    let query = supabase
      .from('ajc_daily_traffic')
      .select('*')
      .eq('ajc_id', ajcId);

    if (dateRange) {
      query = query.gte('date', dateRange.start).lte('date', dateRange.end);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return (data || []) as AJCDailyTraffic[];
  } catch (error) {
    console.error('Error fetching AJC daily traffic:', error);
    return [];
  }
}

// ===========================================
// WORKFORCE PARTICIPANTS
// ===========================================

export interface ParticipantFilters {
  status?: ParticipantStatus;
  program?: WIOAProgram;
  barriers?: BarrierToEmployment[];
  lwdb_id?: string;
  ajc_id?: string;
  search?: string;
}

export async function getWorkforceParticipants(filters?: ParticipantFilters): Promise<Participant[]> {
  try {
    let query = supabase
      .from('workforce_participants')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.lwdb_id) {
      query = query.eq('lwdb_id', filters.lwdb_id);
    }
    if (filters?.ajc_id) {
      query = query.eq('assigned_ajc_id', filters.ajc_id);
    }
    if (filters?.barriers && filters.barriers.length > 0) {
      query = query.overlaps('barriers', filters.barriers);
    }
    if (filters?.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Participant[];
  } catch (error) {
    console.error('Error fetching workforce participants:', error);
    return [];
  }
}

export async function getWorkforceParticipantById(id: string): Promise<Participant | null> {
  try {
    const { data, error } = await supabase
      .from('workforce_participants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Participant | null;
  } catch (error) {
    console.error('Error fetching participant by ID:', error);
    return null;
  }
}

export async function createWorkforceParticipant(
  participant: Omit<Participant, 'id' | 'created_at' | 'updated_at'>
): Promise<Participant | null> {
  try {
    const { data, error } = await supabase
      .from('workforce_participants')
      .insert(participant)
      .select()
      .single();

    if (error) throw error;
    return data as Participant;
  } catch (error) {
    console.error('Error creating participant:', error);
    return null;
  }
}

export async function updateWorkforceParticipant(
  id: string,
  updates: Partial<Omit<Participant, 'id' | 'created_at' | 'updated_at'>>
): Promise<Participant | null> {
  try {
    const { data, error } = await supabase
      .from('workforce_participants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Participant;
  } catch (error) {
    console.error('Error updating participant:', error);
    return null;
  }
}

// ===========================================
// PROGRAM ENROLLMENTS
// ===========================================

export async function getProgramEnrollmentsByParticipant(participantId: string): Promise<ParticipantProgram[]> {
  try {
    const { data, error } = await supabase
      .from('program_enrollments')
      .select('*')
      .eq('participant_id', participantId)
      .order('enrollment_date', { ascending: false });

    if (error) throw error;
    return (data || []) as ParticipantProgram[];
  } catch (error) {
    console.error('Error fetching program enrollments:', error);
    return [];
  }
}

export async function createProgramEnrollment(
  enrollment: Omit<ParticipantProgram, 'id'>
): Promise<ParticipantProgram | null> {
  try {
    const { data, error } = await supabase
      .from('program_enrollments')
      .insert(enrollment)
      .select()
      .single();

    if (error) throw error;
    return data as ParticipantProgram;
  } catch (error) {
    console.error('Error creating program enrollment:', error);
    return null;
  }
}

export async function updateProgramEnrollment(
  id: string,
  updates: Partial<Omit<ParticipantProgram, 'id' | 'participant_id'>>
): Promise<ParticipantProgram | null> {
  try {
    const { data, error } = await supabase
      .from('program_enrollments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ParticipantProgram;
  } catch (error) {
    console.error('Error updating program enrollment:', error);
    return null;
  }
}

// ===========================================
// SERVICE TRANSACTIONS
// ===========================================

export async function getServiceTransactionsByParticipant(participantId: string): Promise<ServiceTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('service_transactions')
      .select('*')
      .eq('participant_id', participantId)
      .order('service_date', { ascending: false });

    if (error) throw error;
    return (data || []) as ServiceTransaction[];
  } catch (error) {
    console.error('Error fetching service transactions:', error);
    return [];
  }
}

export async function createServiceTransaction(
  transaction: Omit<ServiceTransaction, 'id' | 'created_at'>
): Promise<ServiceTransaction | null> {
  try {
    const { data, error } = await supabase
      .from('service_transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data as ServiceTransaction;
  } catch (error) {
    console.error('Error creating service transaction:', error);
    return null;
  }
}

// ===========================================
// CASE NOTES
// ===========================================

export async function getCaseNotesByParticipant(participantId: string): Promise<CaseNote[]> {
  try {
    const { data, error } = await supabase
      .from('case_notes')
      .select('*')
      .eq('participant_id', participantId)
      .order('note_date', { ascending: false });

    if (error) throw error;
    return (data || []) as CaseNote[];
  } catch (error) {
    console.error('Error fetching case notes:', error);
    return [];
  }
}

export async function createCaseNote(
  note: Omit<CaseNote, 'id' | 'created_at' | 'updated_at'>
): Promise<CaseNote | null> {
  try {
    const { data, error } = await supabase
      .from('case_notes')
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data as CaseNote;
  } catch (error) {
    console.error('Error creating case note:', error);
    return null;
  }
}

// ===========================================
// INDIVIDUAL EMPLOYMENT PLANS
// ===========================================

export async function getIEPsByParticipant(participantId: string): Promise<IndividualEmploymentPlan[]> {
  try {
    const { data, error } = await supabase
      .from('individual_employment_plans')
      .select('*')
      .eq('participant_id', participantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as IndividualEmploymentPlan[];
  } catch (error) {
    console.error('Error fetching IEPs:', error);
    return [];
  }
}

export async function createIEP(
  iep: Omit<IndividualEmploymentPlan, 'id' | 'created_at' | 'updated_at'>
): Promise<IndividualEmploymentPlan | null> {
  try {
    const { data, error } = await supabase
      .from('individual_employment_plans')
      .insert(iep)
      .select()
      .single();

    if (error) throw error;
    return data as IndividualEmploymentPlan;
  } catch (error) {
    console.error('Error creating IEP:', error);
    return null;
  }
}

export async function updateIEP(
  id: string,
  updates: Partial<Omit<IndividualEmploymentPlan, 'id' | 'participant_id' | 'created_at' | 'updated_at'>>
): Promise<IndividualEmploymentPlan | null> {
  try {
    const { data, error } = await supabase
      .from('individual_employment_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as IndividualEmploymentPlan;
  } catch (error) {
    console.error('Error updating IEP:', error);
    return null;
  }
}

// ===========================================
// INDIVIDUAL TRAINING ACCOUNTS
// ===========================================

export async function getITAsByParticipant(participantId: string): Promise<IndividualTrainingAccount[]> {
  try {
    const { data, error } = await supabase
      .from('individual_training_accounts')
      .select('*')
      .eq('participant_id', participantId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return (data || []) as IndividualTrainingAccount[];
  } catch (error) {
    console.error('Error fetching ITAs:', error);
    return [];
  }
}

export async function createITA(
  ita: Omit<IndividualTrainingAccount, 'id' | 'created_at' | 'updated_at'>
): Promise<IndividualTrainingAccount | null> {
  try {
    const { data, error } = await supabase
      .from('individual_training_accounts')
      .insert(ita)
      .select()
      .single();

    if (error) throw error;
    return data as IndividualTrainingAccount;
  } catch (error) {
    console.error('Error creating ITA:', error);
    return null;
  }
}

export async function updateITA(
  id: string,
  updates: Partial<Omit<IndividualTrainingAccount, 'id' | 'participant_id' | 'created_at' | 'updated_at'>>
): Promise<IndividualTrainingAccount | null> {
  try {
    const { data, error } = await supabase
      .from('individual_training_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as IndividualTrainingAccount;
  } catch (error) {
    console.error('Error updating ITA:', error);
    return null;
  }
}

// ===========================================
// WORKFORCE EMPLOYERS
// ===========================================

export interface EmployerFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  company_size?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  ojt_partner?: boolean;
  registered_apprenticeship_sponsor?: boolean;
  search?: string;
}

export async function getWorkforceEmployers(filters?: EmployerFilters): Promise<Employer[]> {
  try {
    let query = supabase
      .from('workforce_employers')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.company_size) {
      query = query.eq('company_size', filters.company_size);
    }
    if (filters?.ojt_partner !== undefined) {
      query = query.eq('ojt_partner', filters.ojt_partner);
    }
    if (filters?.registered_apprenticeship_sponsor !== undefined) {
      query = query.eq('registered_apprenticeship_sponsor', filters.registered_apprenticeship_sponsor);
    }
    if (filters?.search) {
      query = query.ilike('company_name', `%${filters.search}%`);
    }

    const { data, error } = await query.order('company_name', { ascending: true });

    if (error) throw error;
    return (data || []) as Employer[];
  } catch (error) {
    console.error('Error fetching workforce employers:', error);
    return [];
  }
}

export async function getWorkforceEmployerById(id: string): Promise<Employer | null> {
  try {
    const { data, error } = await supabase
      .from('workforce_employers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Employer | null;
  } catch (error) {
    console.error('Error fetching employer by ID:', error);
    return null;
  }
}

export async function createWorkforceEmployer(
  employer: Omit<Employer, 'id' | 'created_at' | 'updated_at'>
): Promise<Employer | null> {
  try {
    const { data, error } = await supabase
      .from('workforce_employers')
      .insert(employer)
      .select()
      .single();

    if (error) throw error;
    return data as Employer;
  } catch (error) {
    console.error('Error creating employer:', error);
    return null;
  }
}

export async function updateWorkforceEmployer(
  id: string,
  updates: Partial<Omit<Employer, 'id' | 'created_at' | 'updated_at'>>
): Promise<Employer | null> {
  try {
    const { data, error } = await supabase
      .from('workforce_employers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Employer;
  } catch (error) {
    console.error('Error updating employer:', error);
    return null;
  }
}

// ===========================================
// JOB ORDERS
// ===========================================

export interface JobOrderFilters {
  status?: 'OPEN' | 'FILLED' | 'CANCELLED' | 'ON_HOLD' | 'EXPIRED';
  employer_id?: string;
  employment_type?: 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY' | 'SEASONAL' | 'INTERNSHIP';
  search?: string;
}

export async function getJobOrders(filters?: JobOrderFilters): Promise<JobOrder[]> {
  try {
    let query = supabase
      .from('job_orders')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.employer_id) {
      query = query.eq('employer_id', filters.employer_id);
    }
    if (filters?.employment_type) {
      query = query.eq('employment_type', filters.employment_type);
    }
    if (filters?.search) {
      query = query.ilike('job_title', `%${filters.search}%`);
    }

    const { data, error } = await query.order('date_posted', { ascending: false });

    if (error) throw error;
    return (data || []) as JobOrder[];
  } catch (error) {
    console.error('Error fetching job orders:', error);
    return [];
  }
}

export async function getJobOrderById(id: string): Promise<JobOrder | null> {
  try {
    const { data, error } = await supabase
      .from('job_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as JobOrder | null;
  } catch (error) {
    console.error('Error fetching job order by ID:', error);
    return null;
  }
}

export async function createJobOrder(
  jobOrder: Omit<JobOrder, 'id' | 'created_at' | 'updated_at'>
): Promise<JobOrder | null> {
  try {
    const { data, error } = await supabase
      .from('job_orders')
      .insert(jobOrder)
      .select()
      .single();

    if (error) throw error;
    return data as JobOrder;
  } catch (error) {
    console.error('Error creating job order:', error);
    return null;
  }
}

export async function updateJobOrder(
  id: string,
  updates: Partial<Omit<JobOrder, 'id' | 'created_at' | 'updated_at'>>
): Promise<JobOrder | null> {
  try {
    const { data, error } = await supabase
      .from('job_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as JobOrder;
  } catch (error) {
    console.error('Error updating job order:', error);
    return null;
  }
}

// ===========================================
// OJT AGREEMENTS
// ===========================================

export async function getOJTAgreements(): Promise<OJTAgreement[]> {
  try {
    const { data, error } = await supabase
      .from('ojt_agreements')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return (data || []) as OJTAgreement[];
  } catch (error) {
    console.error('Error fetching OJT agreements:', error);
    return [];
  }
}

export async function getOJTAgreementsByParticipant(participantId: string): Promise<OJTAgreement[]> {
  try {
    const { data, error } = await supabase
      .from('ojt_agreements')
      .select('*')
      .eq('participant_id', participantId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return (data || []) as OJTAgreement[];
  } catch (error) {
    console.error('Error fetching OJT agreements by participant:', error);
    return [];
  }
}

export async function createOJTAgreement(
  agreement: Omit<OJTAgreement, 'id' | 'created_at' | 'updated_at'>
): Promise<OJTAgreement | null> {
  try {
    const { data, error } = await supabase
      .from('ojt_agreements')
      .insert(agreement)
      .select()
      .single();

    if (error) throw error;
    return data as OJTAgreement;
  } catch (error) {
    console.error('Error creating OJT agreement:', error);
    return null;
  }
}

export async function updateOJTAgreement(
  id: string,
  updates: Partial<Omit<OJTAgreement, 'id' | 'created_at' | 'updated_at'>>
): Promise<OJTAgreement | null> {
  try {
    const { data, error } = await supabase
      .from('ojt_agreements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as OJTAgreement;
  } catch (error) {
    console.error('Error updating OJT agreement:', error);
    return null;
  }
}

// ===========================================
// WARN NOTICES
// ===========================================

export interface WARNFilters {
  status?: 'RECEIVED' | 'ASSIGNED' | 'RESPONSE_SCHEDULED' | 'RESPONSE_COMPLETED' | 'CLOSED';
  event_type?: 'LAYOFF' | 'PLANT_CLOSURE' | 'RELOCATION';
  facility_state?: string;
  search?: string;
}

export async function getWARNNotices(filters?: WARNFilters): Promise<WARNNotice[]> {
  try {
    let query = supabase
      .from('warn_notices')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.event_type) {
      query = query.eq('event_type', filters.event_type);
    }
    if (filters?.facility_state) {
      query = query.eq('facility_state', filters.facility_state);
    }
    if (filters?.search) {
      query = query.ilike('company_name', `%${filters.search}%`);
    }

    const { data, error } = await query.order('notice_date', { ascending: false });

    if (error) throw error;
    return (data || []) as WARNNotice[];
  } catch (error) {
    console.error('Error fetching WARN notices:', error);
    return [];
  }
}

export async function createWARNNotice(
  notice: Omit<WARNNotice, 'id' | 'created_at' | 'updated_at'>
): Promise<WARNNotice | null> {
  try {
    const { data, error } = await supabase
      .from('warn_notices')
      .insert(notice)
      .select()
      .single();

    if (error) throw error;
    return data as WARNNotice;
  } catch (error) {
    console.error('Error creating WARN notice:', error);
    return null;
  }
}

export async function updateWARNNotice(
  id: string,
  updates: Partial<Omit<WARNNotice, 'id' | 'created_at' | 'updated_at'>>
): Promise<WARNNotice | null> {
  try {
    const { data, error } = await supabase
      .from('warn_notices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as WARNNotice;
  } catch (error) {
    console.error('Error updating WARN notice:', error);
    return null;
  }
}

// ===========================================
// RAPID RESPONSE EVENTS
// ===========================================

export async function getRapidResponseEvents(): Promise<RapidResponseEvent[]> {
  try {
    const { data, error } = await supabase
      .from('rapid_response_events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) throw error;
    return (data || []) as RapidResponseEvent[];
  } catch (error) {
    console.error('Error fetching rapid response events:', error);
    return [];
  }
}

export async function getRapidResponseEventsByWARN(warnNoticeId: string): Promise<RapidResponseEvent[]> {
  try {
    const { data, error } = await supabase
      .from('rapid_response_events')
      .select('*')
      .eq('warn_notice_id', warnNoticeId)
      .order('event_date', { ascending: false });

    if (error) throw error;
    return (data || []) as RapidResponseEvent[];
  } catch (error) {
    console.error('Error fetching rapid response events by WARN:', error);
    return [];
  }
}

export async function createRapidResponseEvent(
  event: Omit<RapidResponseEvent, 'id' | 'created_at' | 'updated_at'>
): Promise<RapidResponseEvent | null> {
  try {
    const { data, error } = await supabase
      .from('rapid_response_events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data as RapidResponseEvent;
  } catch (error) {
    console.error('Error creating rapid response event:', error);
    return null;
  }
}

export async function updateRapidResponseEvent(
  id: string,
  updates: Partial<Omit<RapidResponseEvent, 'id' | 'created_at' | 'updated_at'>>
): Promise<RapidResponseEvent | null> {
  try {
    const { data, error } = await supabase
      .from('rapid_response_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as RapidResponseEvent;
  } catch (error) {
    console.error('Error updating rapid response event:', error);
    return null;
  }
}

// ===========================================
// GRANT ALLOCATIONS
// ===========================================

export async function getGrantAllocations(fiscalYear?: string): Promise<GrantAllocation[]> {
  try {
    let query = supabase
      .from('grant_allocations')
      .select('*');

    if (fiscalYear) {
      query = query.eq('fiscal_year', fiscalYear);
    }

    const { data, error } = await query.order('fiscal_year', { ascending: false });

    if (error) throw error;
    return (data || []) as GrantAllocation[];
  } catch (error) {
    console.error('Error fetching grant allocations:', error);
    return [];
  }
}

export async function getGrantAllocationById(id: string): Promise<GrantAllocation | null> {
  try {
    const { data, error } = await supabase
      .from('grant_allocations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as GrantAllocation | null;
  } catch (error) {
    console.error('Error fetching grant allocation by ID:', error);
    return null;
  }
}

export async function createGrantAllocation(
  allocation: Omit<GrantAllocation, 'id' | 'total_available' | 'remaining_amount' | 'created_at' | 'updated_at'>
): Promise<GrantAllocation | null> {
  try {
    const { data, error } = await supabase
      .from('grant_allocations')
      .insert(allocation)
      .select()
      .single();

    if (error) throw error;
    return data as GrantAllocation;
  } catch (error) {
    console.error('Error creating grant allocation:', error);
    return null;
  }
}

export async function updateGrantAllocation(
  id: string,
  updates: Partial<Omit<GrantAllocation, 'id' | 'total_available' | 'remaining_amount' | 'created_at' | 'updated_at'>>
): Promise<GrantAllocation | null> {
  try {
    const { data, error } = await supabase
      .from('grant_allocations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as GrantAllocation;
  } catch (error) {
    console.error('Error updating grant allocation:', error);
    return null;
  }
}

// ===========================================
// EXPENDITURES
// ===========================================

export async function getExpendituresByAllocation(allocationId: string): Promise<Expenditure[]> {
  try {
    const { data, error } = await supabase
      .from('expenditures')
      .select('*')
      .eq('grant_allocation_id', allocationId)
      .order('expenditure_date', { ascending: false });

    if (error) throw error;
    return (data || []) as Expenditure[];
  } catch (error) {
    console.error('Error fetching expenditures:', error);
    return [];
  }
}

export async function createExpenditure(
  expenditure: Omit<Expenditure, 'id' | 'created_at'>
): Promise<Expenditure | null> {
  try {
    const { data, error } = await supabase
      .from('expenditures')
      .insert(expenditure)
      .select()
      .single();

    if (error) throw error;
    return data as Expenditure;
  } catch (error) {
    console.error('Error creating expenditure:', error);
    return null;
  }
}

// ===========================================
// WIOA PERFORMANCE GOALS
// ===========================================

export interface PerformanceGoalFilters {
  program?: WIOAProgram;
  fiscal_year?: string;
  lwdb_id?: string;
}

export async function getWIOAPerformanceGoals(filters?: PerformanceGoalFilters): Promise<WIOAPerformanceGoals[]> {
  try {
    let query = supabase
      .from('wioa_performance_goals')
      .select('*');

    if (filters?.program) {
      query = query.eq('program', filters.program);
    }
    if (filters?.fiscal_year) {
      query = query.eq('fiscal_year', filters.fiscal_year);
    }
    if (filters?.lwdb_id) {
      query = query.eq('lwdb_id', filters.lwdb_id);
    }

    const { data, error } = await query.order('fiscal_year', { ascending: false });

    if (error) throw error;
    return (data || []) as WIOAPerformanceGoals[];
  } catch (error) {
    console.error('Error fetching WIOA performance goals:', error);
    return [];
  }
}

export async function createWIOAPerformanceGoal(
  goal: Omit<WIOAPerformanceGoals, 'id' | 'created_at' | 'updated_at'>
): Promise<WIOAPerformanceGoals | null> {
  try {
    const { data, error } = await supabase
      .from('wioa_performance_goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data as WIOAPerformanceGoals;
  } catch (error) {
    console.error('Error creating WIOA performance goal:', error);
    return null;
  }
}

export async function updateWIOAPerformanceGoal(
  id: string,
  updates: Partial<Omit<WIOAPerformanceGoals, 'id' | 'created_at' | 'updated_at'>>
): Promise<WIOAPerformanceGoals | null> {
  try {
    const { data, error } = await supabase
      .from('wioa_performance_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as WIOAPerformanceGoals;
  } catch (error) {
    console.error('Error updating WIOA performance goal:', error);
    return null;
  }
}

// ===========================================
// PARTICIPANT OUTCOMES
// ===========================================

export async function getParticipantOutcomesByParticipant(participantId: string): Promise<ParticipantOutcome[]> {
  try {
    const { data, error } = await supabase
      .from('participant_outcomes')
      .select('*')
      .eq('participant_id', participantId)
      .order('exit_date', { ascending: false });

    if (error) throw error;
    return (data || []) as ParticipantOutcome[];
  } catch (error) {
    console.error('Error fetching participant outcomes:', error);
    return [];
  }
}

export async function createParticipantOutcome(
  outcome: Omit<ParticipantOutcome, 'id' | 'created_at' | 'updated_at'>
): Promise<ParticipantOutcome | null> {
  try {
    const { data, error } = await supabase
      .from('participant_outcomes')
      .insert(outcome)
      .select()
      .single();

    if (error) throw error;
    return data as ParticipantOutcome;
  } catch (error) {
    console.error('Error creating participant outcome:', error);
    return null;
  }
}

export async function updateParticipantOutcome(
  id: string,
  updates: Partial<Omit<ParticipantOutcome, 'id' | 'participant_id' | 'created_at' | 'updated_at'>>
): Promise<ParticipantOutcome | null> {
  try {
    const { data, error } = await supabase
      .from('participant_outcomes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ParticipantOutcome;
  } catch (error) {
    console.error('Error updating participant outcome:', error);
    return null;
  }
}

// ===========================================
// ETPL PROVIDERS
// ===========================================

export interface ETPLProviderFilters {
  etpl_status?: 'APPROVED' | 'PENDING' | 'PROBATION' | 'REMOVED';
  provider_type?: 'COMMUNITY_COLLEGE' | 'UNIVERSITY' | 'TECHNICAL_SCHOOL' | 'APPRENTICESHIP_SPONSOR' | 'ONLINE' | 'EMPLOYER' | 'NONPROFIT';
  search?: string;
}

export async function getETPLProviders(filters?: ETPLProviderFilters): Promise<ETPLProvider[]> {
  try {
    let query = supabase
      .from('etpl_providers')
      .select('*');

    if (filters?.etpl_status) {
      query = query.eq('etpl_status', filters.etpl_status);
    }
    if (filters?.provider_type) {
      query = query.eq('provider_type', filters.provider_type);
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as ETPLProvider[];
  } catch (error) {
    console.error('Error fetching ETPL providers:', error);
    return [];
  }
}

export async function getETPLProviderById(id: string): Promise<ETPLProvider | null> {
  try {
    const { data, error } = await supabase
      .from('etpl_providers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ETPLProvider | null;
  } catch (error) {
    console.error('Error fetching ETPL provider by ID:', error);
    return null;
  }
}

export async function createETPLProvider(
  provider: Omit<ETPLProvider, 'id' | 'programs' | 'created_at' | 'updated_at'>
): Promise<ETPLProvider | null> {
  try {
    const { data, error } = await supabase
      .from('etpl_providers')
      .insert(provider)
      .select()
      .single();

    if (error) throw error;
    return data as ETPLProvider;
  } catch (error) {
    console.error('Error creating ETPL provider:', error);
    return null;
  }
}

export async function updateETPLProvider(
  id: string,
  updates: Partial<Omit<ETPLProvider, 'id' | 'programs' | 'created_at' | 'updated_at'>>
): Promise<ETPLProvider | null> {
  try {
    const { data, error } = await supabase
      .from('etpl_providers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ETPLProvider;
  } catch (error) {
    console.error('Error updating ETPL provider:', error);
    return null;
  }
}

// ===========================================
// TRAINING PROGRAMS
// ===========================================

export async function getTrainingProgramsByProvider(providerId: string): Promise<TrainingProgram[]> {
  try {
    const { data, error } = await supabase
      .from('training_programs')
      .select('*')
      .eq('provider_id', providerId)
      .order('program_name', { ascending: true });

    if (error) throw error;
    return (data || []) as TrainingProgram[];
  } catch (error) {
    console.error('Error fetching training programs:', error);
    return [];
  }
}

export async function getTrainingProgramById(id: string): Promise<TrainingProgram | null> {
  try {
    const { data, error } = await supabase
      .from('training_programs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as TrainingProgram | null;
  } catch (error) {
    console.error('Error fetching training program by ID:', error);
    return null;
  }
}

export async function createTrainingProgram(
  program: Omit<TrainingProgram, 'id' | 'created_at' | 'updated_at'>
): Promise<TrainingProgram | null> {
  try {
    const { data, error } = await supabase
      .from('training_programs')
      .insert(program)
      .select()
      .single();

    if (error) throw error;
    return data as TrainingProgram;
  } catch (error) {
    console.error('Error creating training program:', error);
    return null;
  }
}

export async function updateTrainingProgram(
  id: string,
  updates: Partial<Omit<TrainingProgram, 'id' | 'provider_id' | 'created_at' | 'updated_at'>>
): Promise<TrainingProgram | null> {
  try {
    const { data, error } = await supabase
      .from('training_programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TrainingProgram;
  } catch (error) {
    console.error('Error updating training program:', error);
    return null;
  }
}

// ===========================================
// DASHBOARD AGGREGATION METHODS
// ===========================================

export async function getStateWorkforceDashboardStats(stateCode: string): Promise<WorkforceDashboardStats> {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

    // Fetch participants
    const { data: participants } = await supabase
      .from('workforce_participants')
      .select('id, status, registration_date, exit_date')
      .eq('address_state', stateCode);

    const allParticipants = participants || [];
    const activeStatuses = ['REGISTERED', 'ELIGIBLE', 'ENROLLED', 'ACTIVE', 'TRAINING'];
    const activeParticipants = allParticipants.filter(p => activeStatuses.includes(p.status));
    const newEnrollmentsMTD = allParticipants.filter(
      p => p.registration_date && p.registration_date >= monthStart
    );
    const exitsMTD = allParticipants.filter(
      p => p.exit_date && p.exit_date >= monthStart
    );

    // Fetch services this month
    const { count: servicesThisMonth } = await supabase
      .from('service_transactions')
      .select('id', { count: 'exact', head: true })
      .gte('service_date', monthStart);

    const { count: totalServices } = await supabase
      .from('service_transactions')
      .select('id', { count: 'exact', head: true });

    // Fetch active ITAs
    const { data: itas } = await supabase
      .from('individual_training_accounts')
      .select('id, status, expended_amount, credential_earned, actual_end_date');

    const allITAs = itas || [];
    const activeITAs = allITAs.filter(i => i.status === 'ACTIVE');
    const itaExpendituresYTD = allITAs
      .filter(i => i.actual_end_date && i.actual_end_date >= yearStart)
      .reduce((sum, i) => sum + (i.expended_amount || 0), 0);
    const completionsYTD = allITAs.filter(
      i => i.status === 'COMPLETED' && i.actual_end_date && i.actual_end_date >= yearStart
    ).length;
    const credentialsYTD = allITAs.filter(
      i => i.credential_earned && i.actual_end_date && i.actual_end_date >= yearStart
    ).length;

    // Fetch employers
    const { data: employers } = await supabase
      .from('workforce_employers')
      .select('id, status');

    const activeEmployers = (employers || []).filter(e => e.status === 'ACTIVE');

    // Fetch job orders
    const { data: jobOrders } = await supabase
      .from('job_orders')
      .select('id, status, placements_count, date_posted');

    const openJobOrders = (jobOrders || []).filter(j => j.status === 'OPEN');
    const placementsMTD = (jobOrders || [])
      .filter(j => j.date_posted && j.date_posted >= monthStart)
      .reduce((sum, j) => sum + (j.placements_count || 0), 0);

    // Fetch OJT agreements
    const { data: ojtData } = await supabase
      .from('ojt_agreements')
      .select('id, status');

    const activeOJT = (ojtData || []).filter(o => o.status === 'ACTIVE');

    // Fetch AJC traffic this month
    const { data: trafficData } = await supabase
      .from('ajc_daily_traffic')
      .select('walk_ins, appointments, virtual_visits')
      .gte('date', monthStart);

    const totalVisitsMTD = (trafficData || []).reduce(
      (sum, t) => sum + (t.walk_ins || 0) + (t.appointments || 0), 0
    );
    const virtualServicesMTD = (trafficData || []).reduce(
      (sum, t) => sum + (t.virtual_visits || 0), 0
    );

    // Fetch grant allocations
    const { data: grants } = await supabase
      .from('grant_allocations')
      .select('allocation_amount, expended_amount')
      .eq('status', 'ACTIVE');

    const totalAllocation = (grants || []).reduce((sum, g) => sum + (g.allocation_amount || 0), 0);
    const totalExpended = (grants || []).reduce((sum, g) => sum + (g.expended_amount || 0), 0);
    const burnRate = totalAllocation > 0 ? (totalExpended / totalAllocation) * 100 : 0;

    // Fetch performance goals for current fiscal year
    const currentFY = `FY${now.getFullYear()}`;
    const { data: perfGoals } = await supabase
      .from('wioa_performance_goals')
      .select('*')
      .eq('fiscal_year', currentFY)
      .eq('status', 'APPROVED');

    const meetingGoal = (goalField: string, actualField: string) => {
      if (!perfGoals || perfGoals.length === 0) return false;
      return perfGoals.every(g => {
        const goal = g[goalField];
        const actual = g[actualField];
        if (goal == null || actual == null) return false;
        return actual >= goal;
      });
    };

    return {
      total_participants: allParticipants.length,
      active_participants: activeParticipants.length,
      new_enrollments_mtd: newEnrollmentsMTD.length,
      exits_mtd: exitsMTD.length,
      total_services_delivered: totalServices || 0,
      services_this_month: servicesThisMonth || 0,
      active_itas: activeITAs.length,
      ita_expenditures_ytd: itaExpendituresYTD,
      training_completions_ytd: completionsYTD,
      credentials_earned_ytd: credentialsYTD,
      active_employers: activeEmployers.length,
      job_orders_open: openJobOrders.length,
      placements_mtd: placementsMTD,
      ojt_agreements_active: activeOJT.length,
      total_ajc_visits_mtd: totalVisitsMTD,
      virtual_services_mtd: virtualServicesMTD,
      total_allocation: totalAllocation,
      total_expended: totalExpended,
      burn_rate: Math.round(burnRate * 100) / 100,
      meeting_q2_employment: meetingGoal('employment_rate_q2_goal', 'employment_rate_q2_actual'),
      meeting_q4_employment: meetingGoal('employment_rate_q4_goal', 'employment_rate_q4_actual'),
      meeting_median_earnings: meetingGoal('median_earnings_goal', 'median_earnings_actual'),
      meeting_credential: meetingGoal('credential_attainment_goal', 'credential_attainment_actual'),
      meeting_msg: meetingGoal('measurable_skill_gains_goal', 'measurable_skill_gains_actual'),
      meeting_effectiveness: meetingGoal('effectiveness_retention_goal', 'effectiveness_retention_actual'),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      total_participants: 0,
      active_participants: 0,
      new_enrollments_mtd: 0,
      exits_mtd: 0,
      total_services_delivered: 0,
      services_this_month: 0,
      active_itas: 0,
      ita_expenditures_ytd: 0,
      training_completions_ytd: 0,
      credentials_earned_ytd: 0,
      active_employers: 0,
      job_orders_open: 0,
      placements_mtd: 0,
      ojt_agreements_active: 0,
      total_ajc_visits_mtd: 0,
      virtual_services_mtd: 0,
      total_allocation: 0,
      total_expended: 0,
      burn_rate: 0,
      meeting_q2_employment: false,
      meeting_q4_employment: false,
      meeting_median_earnings: false,
      meeting_credential: false,
      meeting_msg: false,
      meeting_effectiveness: false,
    };
  }
}

export interface WIOAPerformanceSummary {
  fiscal_year: string;
  program: string;
  indicators: {
    name: string;
    goal: number | null;
    actual: number | null;
    meeting_goal: boolean;
  }[];
}

export async function getWIOAPerformanceSummary(
  fiscalYear: string,
  program?: WIOAProgram
): Promise<WIOAPerformanceSummary[]> {
  try {
    let query = supabase
      .from('wioa_performance_goals')
      .select('*')
      .eq('fiscal_year', fiscalYear);

    if (program) {
      query = query.eq('program', program);
    }

    const { data, error } = await query.order('program', { ascending: true });

    if (error) throw error;

    return (data || []).map((g: Record<string, unknown>) => ({
      fiscal_year: g.fiscal_year as string,
      program: g.program as string,
      indicators: [
        {
          name: 'Employment Rate Q2',
          goal: g.employment_rate_q2_goal as number | null,
          actual: g.employment_rate_q2_actual as number | null,
          meeting_goal: (g.employment_rate_q2_actual as number) >= (g.employment_rate_q2_goal as number),
        },
        {
          name: 'Employment Rate Q4',
          goal: g.employment_rate_q4_goal as number | null,
          actual: g.employment_rate_q4_actual as number | null,
          meeting_goal: (g.employment_rate_q4_actual as number) >= (g.employment_rate_q4_goal as number),
        },
        {
          name: 'Median Earnings',
          goal: g.median_earnings_goal as number | null,
          actual: g.median_earnings_actual as number | null,
          meeting_goal: (g.median_earnings_actual as number) >= (g.median_earnings_goal as number),
        },
        {
          name: 'Credential Attainment',
          goal: g.credential_attainment_goal as number | null,
          actual: g.credential_attainment_actual as number | null,
          meeting_goal: (g.credential_attainment_actual as number) >= (g.credential_attainment_goal as number),
        },
        {
          name: 'Measurable Skill Gains',
          goal: g.measurable_skill_gains_goal as number | null,
          actual: g.measurable_skill_gains_actual as number | null,
          meeting_goal: (g.measurable_skill_gains_actual as number) >= (g.measurable_skill_gains_goal as number),
        },
        {
          name: 'Effectiveness in Serving Employers',
          goal: g.effectiveness_retention_goal as number | null,
          actual: g.effectiveness_retention_actual as number | null,
          meeting_goal: (g.effectiveness_retention_actual as number) >= (g.effectiveness_retention_goal as number),
        },
      ],
    }));
  } catch (error) {
    console.error('Error fetching WIOA performance summary:', error);
    return [];
  }
}

export interface AJCTrafficSummary {
  total_walk_ins: number;
  total_appointments: number;
  total_virtual_visits: number;
  total_phone_calls: number;
  total_registrations: number;
  total_assessments: number;
  total_job_referrals: number;
  total_workshop_attendees: number;
  total_resource_room_users: number;
  avg_staff_on_duty: number;
  daily_breakdown: AJCDailyTraffic[];
}

export async function getAJCTrafficSummary(
  ajcId: string,
  dateRange: { start: string; end: string }
): Promise<AJCTrafficSummary> {
  try {
    const { data, error } = await supabase
      .from('ajc_daily_traffic')
      .select('*')
      .eq('ajc_id', ajcId)
      .gte('date', dateRange.start)
      .lte('date', dateRange.end)
      .order('date', { ascending: true });

    if (error) throw error;

    const records = (data || []) as AJCDailyTraffic[];

    const sum = (field: keyof AJCDailyTraffic) =>
      records.reduce((total, r) => total + ((r[field] as number) || 0), 0);

    const totalStaff = sum('staff_on_duty');

    return {
      total_walk_ins: sum('walk_ins'),
      total_appointments: sum('appointments'),
      total_virtual_visits: sum('virtual_visits'),
      total_phone_calls: sum('phone_calls'),
      total_registrations: sum('registrations'),
      total_assessments: sum('assessments'),
      total_job_referrals: sum('job_referrals'),
      total_workshop_attendees: sum('workshop_attendees'),
      total_resource_room_users: sum('resource_room_users'),
      avg_staff_on_duty: records.length > 0 ? Math.round(totalStaff / records.length) : 0,
      daily_breakdown: records,
    };
  } catch (error) {
    console.error('Error fetching AJC traffic summary:', error);
    return {
      total_walk_ins: 0,
      total_appointments: 0,
      total_virtual_visits: 0,
      total_phone_calls: 0,
      total_registrations: 0,
      total_assessments: 0,
      total_job_referrals: 0,
      total_workshop_attendees: 0,
      total_resource_room_users: 0,
      avg_staff_on_duty: 0,
      daily_breakdown: [],
    };
  }
}
