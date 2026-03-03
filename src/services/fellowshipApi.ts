// ===========================================
// Fellowship Program Management API Service
// DOE SULI, SCGSR, CCI, WDTS and custom programs
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  FellowshipProgram,
  FellowshipCohort,
  FellowshipApplication,
  FellowshipMentor,
  FellowshipDashboardStats,
  FellowshipProgramFilters,
  FellowshipApplicationFilters,
  FellowshipMentorFilters,
  CreateFellowshipProgramData,
  CreateFellowshipApplicationData,
} from '@/types/fellowship';
import {
  sampleFellowshipPrograms,
  sampleFellowshipCohorts,
  sampleFellowshipApplications,
  sampleFellowshipMentors,
  sampleFellowshipStats,
} from '@/data/sampleComplianceData';

// ===========================================
// Mappers
// ===========================================

function mapProgram(record: any): FellowshipProgram {
  return {
    id: record.id,
    name: record.name,
    shortName: record.short_name,
    programType: record.program_type,
    managingOrganizationId: record.managing_organization_id,
    description: record.description,
    eligibilityDescription: record.eligibility_description,
    website: record.website,
    termType: record.term_type,
    termStartMonth: record.term_start_month,
    termEndMonth: record.term_end_month,
    termDurationWeeks: record.term_duration_weeks,
    applicationOpenDate: record.application_open_date,
    applicationDeadline: record.application_deadline,
    maxParticipants: record.max_participants,
    currentParticipants: record.current_participants,
    stipendAmount: record.stipend_amount ? parseFloat(record.stipend_amount) : undefined,
    stipendFrequency: record.stipend_frequency,
    housingProvided: record.housing_provided,
    travelReimbursed: record.travel_reimbursed,
    healthInsuranceProvided: record.health_insurance_provided,
    citizenshipRequired: record.citizenship_required || [],
    minGpa: record.min_gpa ? parseFloat(record.min_gpa) : undefined,
    educationLevels: record.education_levels || [],
    requiredMajorFields: record.required_major_fields,
    clearanceRequired: record.clearance_required,
    drugTestRequired: record.drug_test_required,
    backgroundCheckRequired: record.background_check_required,
    participatingLabs: record.participating_labs,
    status: record.status,
    academicYear: record.academic_year,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    createdBy: record.created_by,
  };
}

function mapCohort(record: any): FellowshipCohort {
  return {
    id: record.id,
    programId: record.program_id,
    name: record.name,
    term: record.term,
    academicYear: record.academic_year,
    startDate: record.start_date,
    endDate: record.end_date,
    orientationDate: record.orientation_date,
    maxParticipants: record.max_participants,
    acceptedCount: record.accepted_count,
    activeCount: record.active_count,
    completedCount: record.completed_count,
    status: record.status,
    hostLab: record.host_lab,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapApplication(record: any): FellowshipApplication {
  return {
    id: record.id,
    programId: record.program_id,
    cohortId: record.cohort_id,
    userId: record.user_id,
    status: record.status,
    university: record.university,
    major: record.major,
    gpa: record.gpa ? parseFloat(record.gpa) : undefined,
    educationLevel: record.education_level,
    expectedGraduation: record.expected_graduation,
    preferredLabs: record.preferred_labs,
    preferredResearchAreas: record.preferred_research_areas,
    researchStatement: record.research_statement,
    assignedMentorId: record.assigned_mentor_id,
    assignedLab: record.assigned_lab,
    assignedDivision: record.assigned_division,
    assignedProject: record.assigned_project,
    facultyRecommendationReceived: record.faculty_recommendation_received,
    facultyRecommendationScore: record.faculty_recommendation_score,
    applicationScore: record.application_score,
    interviewScore: record.interview_score,
    overallScore: record.overall_score ? parseFloat(record.overall_score) : undefined,
    citizenshipVerified: record.citizenship_verified,
    backgroundCheckStatus: record.background_check_status,
    drugTestStatus: record.drug_test_status,
    clearanceStatus: record.clearance_status,
    midtermEvaluationScore: record.midterm_evaluation_score,
    finalEvaluationScore: record.final_evaluation_score,
    finalReportSubmitted: record.final_report_submitted,
    posterPresentationCompleted: record.poster_presentation_completed,
    completionStatus: record.completion_status,
    returnOfferExtended: record.return_offer_extended,
    convertedToHire: record.converted_to_hire,
    submittedAt: record.submitted_at,
    reviewedAt: record.reviewed_at,
    acceptedAt: record.accepted_at,
    startedAt: record.started_at,
    completedAt: record.completed_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapMentor(record: any): FellowshipMentor {
  return {
    id: record.id,
    userId: record.user_id,
    name: record.name,
    email: record.email,
    title: record.title,
    department: record.department,
    labName: record.lab_name,
    division: record.division,
    researchAreas: record.research_areas,
    specializations: record.specializations,
    maxFellows: record.max_fellows,
    currentFellows: record.current_fellows,
    totalFellowsMentored: record.total_fellows_mentored,
    averageFellowRating: record.average_fellow_rating ? parseFloat(record.average_fellow_rating) : undefined,
    fellowsConvertedToHire: record.fellows_converted_to_hire,
    status: record.status,
    availableForPrograms: record.available_for_programs,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

// ===========================================
// Programs API
// ===========================================

export const fellowshipProgramsApi = {
  async list(filters: FellowshipProgramFilters = {}): Promise<FellowshipProgram[]> {
    try {
      let query = supabase.from('fellowship_programs').select('*');

      if (filters.programType?.length) {
        query = query.in('program_type', filters.programType);
      }
      if (filters.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters.lab) {
        query = query.contains('participating_labs', [filters.lab]);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,short_name.ilike.%${filters.search}%`);
      }

      query = query.order('name', { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      const programs = (data || []).map(mapProgram);
      return programs.length > 0 ? programs : sampleFellowshipPrograms;
    } catch (err) {
      console.error('Error fetching fellowship programs:', err);
      return sampleFellowshipPrograms;
    }
  },

  async getById(id: string): Promise<FellowshipProgram | null> {
    try {
      const { data, error } = await supabase
        .from('fellowship_programs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapProgram(data) : null;
    } catch (err) {
      console.error('Error fetching program:', err);
      return null;
    }
  },

  async create(input: CreateFellowshipProgramData): Promise<FellowshipProgram | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const insertData = {
        name: input.name,
        short_name: input.shortName,
        program_type: input.programType,
        managing_organization_id: input.managingOrganizationId,
        description: input.description,
        eligibility_description: input.eligibilityDescription,
        website: input.website,
        term_type: input.termType,
        term_duration_weeks: input.termDurationWeeks,
        application_deadline: input.applicationDeadline,
        max_participants: input.maxParticipants,
        stipend_amount: input.stipendAmount,
        stipend_frequency: input.stipendFrequency,
        citizenship_required: input.citizenshipRequired || ['us_citizen'],
        education_levels: input.educationLevels || [],
        participating_labs: input.participatingLabs || [],
        status: 'draft',
        created_by: user?.user?.id,
      };

      const { data, error } = await supabase
        .from('fellowship_programs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data ? mapProgram(data) : null;
    } catch (err) {
      console.error('Error creating program:', err);
      return null;
    }
  },

  async update(id: string, updates: Partial<CreateFellowshipProgramData> & { status?: string }): Promise<FellowshipProgram | null> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.name) updateData.name = updates.name;
      if (updates.shortName) updateData.short_name = updates.shortName;
      if (updates.description) updateData.description = updates.description;
      if (updates.programType) updateData.program_type = updates.programType;
      if (updates.termType) updateData.term_type = updates.termType;
      if (updates.applicationDeadline) updateData.application_deadline = updates.applicationDeadline;
      if (updates.maxParticipants) updateData.max_participants = updates.maxParticipants;
      if (updates.stipendAmount) updateData.stipend_amount = updates.stipendAmount;
      if (updates.participatingLabs) updateData.participating_labs = updates.participatingLabs;
      if (updates.status) updateData.status = updates.status;

      const { data, error } = await supabase
        .from('fellowship_programs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? mapProgram(data) : null;
    } catch (err) {
      console.error('Error updating program:', err);
      return null;
    }
  },
};

// ===========================================
// Cohorts API
// ===========================================

export const fellowshipCohortsApi = {
  async list(programId?: string): Promise<FellowshipCohort[]> {
    try {
      let query = supabase.from('fellowship_cohorts').select('*');
      if (programId) query = query.eq('program_id', programId);
      query = query.order('start_date', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      const cohorts = (data || []).map(mapCohort);
      if (cohorts.length > 0) return cohorts;
      return programId
        ? sampleFellowshipCohorts.filter(c => c.programId === programId)
        : sampleFellowshipCohorts;
    } catch (err) {
      console.error('Error fetching cohorts:', err);
      return sampleFellowshipCohorts;
    }
  },

  async create(data: {
    programId: string; name: string; term: string;
    startDate: string; endDate: string; maxParticipants?: number;
    hostLab?: string; orientationDate?: string;
  }): Promise<FellowshipCohort | null> {
    try {
      const insertData = {
        program_id: data.programId,
        name: data.name,
        term: data.term,
        start_date: data.startDate,
        end_date: data.endDate,
        max_participants: data.maxParticipants,
        host_lab: data.hostLab,
        orientation_date: data.orientationDate,
        status: 'planning',
      };

      const { data: result, error } = await supabase
        .from('fellowship_cohorts')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return result ? mapCohort(result) : null;
    } catch (err) {
      console.error('Error creating cohort:', err);
      return null;
    }
  },

  async updateStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fellowship_cohorts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
};

// ===========================================
// Applications API
// ===========================================

export const fellowshipApplicationsApi = {
  async list(
    filters: FellowshipApplicationFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ applications: FellowshipApplication[]; total: number }> {
    try {
      let query = supabase
        .from('fellowship_applications')
        .select('*', { count: 'exact' });

      if (filters.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters.programId) {
        query = query.eq('program_id', filters.programId);
      }
      if (filters.cohortId) {
        query = query.eq('cohort_id', filters.cohortId);
      }
      if (filters.lab) {
        query = query.eq('assigned_lab', filters.lab);
      }
      if (filters.mentorId) {
        query = query.eq('assigned_mentor_id', filters.mentorId);
      }
      if (filters.search) {
        query = query.or(`university.ilike.%${filters.search}%,major.ilike.%${filters.search}%`);
      }

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;

      const applications = (data || []).map(mapApplication);
      if (applications.length === 0) {
        return { applications: sampleFellowshipApplications, total: sampleFellowshipApplications.length };
      }
      return { applications, total: count || 0 };
    } catch (err) {
      console.error('Error fetching applications:', err);
      return { applications: sampleFellowshipApplications, total: sampleFellowshipApplications.length };
    }
  },

  async getById(id: string): Promise<FellowshipApplication | null> {
    try {
      const { data, error } = await supabase
        .from('fellowship_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapApplication(data) : null;
    } catch (err) {
      console.error('Error fetching application:', err);
      return null;
    }
  },

  async create(input: CreateFellowshipApplicationData): Promise<FellowshipApplication | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const insertData = {
        program_id: input.programId,
        cohort_id: input.cohortId,
        user_id: user?.user?.id,
        university: input.university,
        major: input.major,
        gpa: input.gpa,
        education_level: input.educationLevel,
        expected_graduation: input.expectedGraduation,
        preferred_labs: input.preferredLabs || [],
        preferred_research_areas: input.preferredResearchAreas || [],
        research_statement: input.researchStatement,
        status: 'draft',
      };

      const { data, error } = await supabase
        .from('fellowship_applications')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data ? mapApplication(data) : null;
    } catch (err) {
      console.error('Error creating application:', err);
      return null;
    }
  },

  async updateStatus(id: string, status: string): Promise<boolean> {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };

      // Set timestamps based on status change
      if (status === 'submitted') updateData.submitted_at = new Date().toISOString();
      if (status === 'under-review') updateData.reviewed_at = new Date().toISOString();
      if (status === 'accepted') updateData.accepted_at = new Date().toISOString();
      if (status === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('fellowship_applications')
        .update(updateData)
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  async assignMentor(applicationId: string, mentorId: string, lab?: string, project?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fellowship_applications')
        .update({
          assigned_mentor_id: mentorId,
          assigned_lab: lab,
          assigned_project: project,
          status: 'mentor-assigned',
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId);

      return !error;
    } catch {
      return false;
    }
  },

  async submitEvaluation(
    applicationId: string,
    evaluationType: 'midterm' | 'final',
    score: number
  ): Promise<boolean> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (evaluationType === 'midterm') {
        updateData.midterm_evaluation_score = score;
      } else {
        updateData.final_evaluation_score = score;
      }

      const { error } = await supabase
        .from('fellowship_applications')
        .update(updateData)
        .eq('id', applicationId);

      return !error;
    } catch {
      return false;
    }
  },
};

// ===========================================
// Mentors API
// ===========================================

export const fellowshipMentorsApi = {
  async list(filters: FellowshipMentorFilters = {}): Promise<FellowshipMentor[]> {
    try {
      let query = supabase.from('fellowship_mentors').select('*');

      if (filters.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters.labName) {
        query = query.eq('lab_name', filters.labName);
      }
      if (filters.hasCapacity) {
        query = query.lt('current_fellows', 3); // Simplified; ideally compare to max_fellows
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,department.ilike.%${filters.search}%`);
      }

      query = query.order('name', { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      const mentors = (data || []).map(mapMentor);
      return mentors.length > 0 ? mentors : sampleFellowshipMentors;
    } catch (err) {
      console.error('Error fetching mentors:', err);
      return sampleFellowshipMentors;
    }
  },

  async create(data: {
    name: string; email: string; title?: string;
    department?: string; labName?: string; division?: string;
    researchAreas?: string[]; maxFellows?: number;
    availableForPrograms?: string[];
  }): Promise<FellowshipMentor | null> {
    try {
      const insertData = {
        name: data.name,
        email: data.email,
        title: data.title,
        department: data.department,
        lab_name: data.labName,
        division: data.division,
        research_areas: data.researchAreas || [],
        max_fellows: data.maxFellows || 3,
        available_for_programs: data.availableForPrograms || [],
        status: 'active',
      };

      const { data: result, error } = await supabase
        .from('fellowship_mentors')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return result ? mapMentor(result) : null;
    } catch (err) {
      console.error('Error creating mentor:', err);
      return null;
    }
  },

  async getAvailable(programType?: string, lab?: string): Promise<FellowshipMentor[]> {
    try {
      let query = supabase
        .from('fellowship_mentors')
        .select('*')
        .eq('status', 'active');

      if (lab) {
        query = query.eq('lab_name', lab);
      }

      const { data, error } = await query;
      if (error) throw error;

      let mentors = (data || []).map(mapMentor);

      // Filter by capacity and program availability
      mentors = mentors.filter(m => m.currentFellows < m.maxFellows);
      if (programType) {
        mentors = mentors.filter(m =>
          !m.availableForPrograms?.length || m.availableForPrograms.includes(programType)
        );
      }

      return mentors;
    } catch (err) {
      console.error('Error fetching available mentors:', err);
      return [];
    }
  },
};

// ===========================================
// Dashboard Stats API
// ===========================================

export const fellowshipStatsApi = {
  async getDashboardStats(): Promise<FellowshipDashboardStats> {
    try {
      const [programsResult, applicationsResult, mentorsResult] = await Promise.all([
        supabase.from('fellowship_programs').select('id, short_name, status'),
        supabase.from('fellowship_applications').select('program_id, status, assigned_lab, overall_score, converted_to_hire, completed_at'),
        supabase.from('fellowship_mentors').select('status, current_fellows'),
      ]);

      const programs = programsResult.data || [];
      const applications = applicationsResult.data || [];
      const mentors = mentorsResult.data || [];

      if (programs.length === 0 && applications.length === 0 && mentors.length === 0) {
        return sampleFellowshipStats;
      }

      const currentYear = new Date().getFullYear();
      const byStatus: Record<string, number> = {};
      const byLab: Record<string, number> = {};
      const byProgram: Record<string, { applications: number; active: number; completed: number }> = {};

      let totalScores = 0;
      let scoreCount = 0;
      let completedThisYear = 0;
      let convertedCount = 0;
      let totalCompleted = 0;

      applications.forEach((a) => {
        byStatus[a.status] = (byStatus[a.status] || 0) + 1;
        if (a.assigned_lab) byLab[a.assigned_lab] = (byLab[a.assigned_lab] || 0) + 1;
        if (a.overall_score) { totalScores += parseFloat(a.overall_score); scoreCount++; }
        if (a.status === 'completed') {
          totalCompleted++;
          if (a.completed_at && new Date(a.completed_at).getFullYear() === currentYear) completedThisYear++;
          if (a.converted_to_hire) convertedCount++;
        }

        // By program
        if (!byProgram[a.program_id]) byProgram[a.program_id] = { applications: 0, active: 0, completed: 0 };
        byProgram[a.program_id].applications++;
        if (['accepted', 'mentor-assigned'].includes(a.status)) byProgram[a.program_id].active++;
        if (a.status === 'completed') byProgram[a.program_id].completed++;
      });

      return {
        totalPrograms: programs.length,
        activePrograms: programs.filter(p => p.status === 'active').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => ['submitted', 'under-review', 'faculty-review'].includes(a.status)).length,
        activeFellows: applications.filter(a => ['accepted', 'mentor-assigned'].includes(a.status)).length,
        completedThisYear,
        conversionRate: totalCompleted > 0 ? (convertedCount / totalCompleted) * 100 : 0,
        averageScore: scoreCount > 0 ? totalScores / scoreCount : 0,
        totalMentors: mentors.length,
        availableMentors: mentors.filter(m => m.status === 'active').length,
        byProgram,
        byLab,
        byStatus: byStatus as any,
      };
    } catch (err) {
      console.error('Error fetching fellowship stats:', err);
      return sampleFellowshipStats;
    }
  },
};

// Combined export
export const fellowshipApi = {
  programs: fellowshipProgramsApi,
  cohorts: fellowshipCohortsApi,
  applications: fellowshipApplicationsApi,
  mentors: fellowshipMentorsApi,
  stats: fellowshipStatsApi,
};

export default fellowshipApi;
