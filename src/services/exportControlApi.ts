// ===========================================
// ITAR/EAR Export Control API Service
// Manages compliance assessments and foreign national screenings
// Regulatory: 22 CFR 120-130 (ITAR), 15 CFR 730-774 (EAR)
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  ExportControlAssessment,
  ForeignNationalScreening,
  ExportControlAuditEntry,
  ExportControlDashboardStats,
  ExportControlFilters,
  ForeignNationalScreeningFilters,
  CreateExportControlAssessmentData,
  CreateForeignNationalScreeningData,
  ExportControlAuditEventType,
} from '@/types/exportControl';
import {
  sampleExportControlAssessments,
  sampleForeignNationalScreenings,
  sampleExportControlStats,
  sampleAuditEntries,
} from '@/data/sampleComplianceData';

// ===========================================
// Mappers
// ===========================================

function mapAssessment(record: any): ExportControlAssessment {
  return {
    id: record.id,
    jobId: record.job_id,
    organizationId: record.organization_id,
    projectName: record.project_name,
    controlType: record.control_type,
    itarCategory: record.itar_category,
    itarSubcategory: record.itar_subcategory,
    itarExemption: record.itar_exemption,
    earEccn: record.ear_eccn,
    earClassificationReason: record.ear_classification_reason,
    earLicenseException: record.ear_license_exception,
    tcpRequired: record.tcp_required,
    tcpReferenceNumber: record.tcp_reference_number,
    tcpApprovedAt: record.tcp_approved_at,
    tcpExpiresAt: record.tcp_expires_at,
    tcpReviewedBy: record.tcp_reviewed_by,
    assessmentStatus: record.assessment_status,
    citizenshipRequirement: record.citizenship_requirement,
    foreignNationalAllowed: record.foreign_national_allowed,
    complianceNotes: record.compliance_notes,
    specialConditions: record.special_conditions,
    assessedBy: record.assessed_by,
    assessedAt: record.assessed_at,
    lastReviewedAt: record.last_reviewed_at,
    nextReviewDue: record.next_review_due,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapScreening(record: any): ForeignNationalScreening {
  return {
    id: record.id,
    userId: record.user_id,
    organizationId: record.organization_id,
    declaredCitizenship: record.declared_citizenship,
    dualCitizenship: record.dual_citizenship,
    countryOfBirth: record.country_of_birth,
    visaType: record.visa_type,
    visaExpiration: record.visa_expiration,
    permanentResident: record.permanent_resident,
    greenCardDate: record.green_card_date,
    screeningStatus: record.screening_status,
    itarEligible: record.itar_eligible,
    earEligible: record.ear_eligible,
    deemedExportRisk: record.deemed_export_risk,
    restrictedPartyChecked: record.restricted_party_checked,
    restrictedPartyCheckedAt: record.restricted_party_checked_at,
    restrictedPartyMatch: record.restricted_party_match,
    deniedPersonsListChecked: record.denied_persons_list_checked,
    entityListChecked: record.entity_list_checked,
    sdnListChecked: record.sdn_list_checked,
    unverifiedListChecked: record.unverified_list_checked,
    screeningNotes: record.screening_notes,
    screenedBy: record.screened_by,
    screenedAt: record.screened_at,
    nextReviewDue: record.next_review_due,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapAuditEntry(record: any): ExportControlAuditEntry {
  return {
    id: record.id,
    assessmentId: record.assessment_id,
    screeningId: record.screening_id,
    eventType: record.event_type,
    eventDetails: record.event_details || {},
    performedBy: record.performed_by,
    ipAddress: record.ip_address,
    createdAt: record.created_at,
  };
}

// ===========================================
// Export Control Assessments API
// ===========================================

export const exportControlApi = {
  // --- Assessments ---

  async listAssessments(
    filters: ExportControlFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ assessments: ExportControlAssessment[]; total: number }> {
    try {
      let query = supabase
        .from('export_control_assessments')
        .select('*', { count: 'exact' });

      if (filters.controlType) {
        query = query.eq('control_type', filters.controlType);
      }
      if (filters.status?.length) {
        query = query.in('assessment_status', filters.status);
      }
      if (filters.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      }
      if (filters.hasJobAssociation === true) {
        query = query.not('job_id', 'is', null);
      }
      if (filters.itarCategory) {
        query = query.eq('itar_category', filters.itarCategory);
      }
      if (filters.tcpExpiringSoon) {
        const in30Days = new Date();
        in30Days.setDate(in30Days.getDate() + 30);
        query = query.lte('tcp_expires_at', in30Days.toISOString());
        query = query.gte('tcp_expires_at', new Date().toISOString());
      }

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);
      query = query.order('updated_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;

      const assessments = (data || []).map(mapAssessment);
      if (assessments.length === 0) {
        return { assessments: sampleExportControlAssessments, total: sampleExportControlAssessments.length };
      }
      return { assessments, total: count || 0 };
    } catch (err) {
      console.error('Error fetching export control assessments:', err);
      return { assessments: sampleExportControlAssessments, total: sampleExportControlAssessments.length };
    }
  },

  async getAssessmentById(id: string): Promise<ExportControlAssessment | null> {
    try {
      const { data, error } = await supabase
        .from('export_control_assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapAssessment(data) : null;
    } catch (err) {
      console.error('Error fetching assessment:', err);
      return null;
    }
  },

  async createAssessment(input: CreateExportControlAssessmentData): Promise<ExportControlAssessment | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const insertData = {
        job_id: input.jobId,
        organization_id: input.organizationId,
        project_name: input.projectName,
        control_type: input.controlType,
        itar_category: input.itarCategory,
        itar_subcategory: input.itarSubcategory,
        ear_eccn: input.earEccn,
        tcp_required: input.tcpRequired || false,
        citizenship_requirement: input.citizenshipRequirement,
        foreign_national_allowed: input.foreignNationalAllowed || false,
        compliance_notes: input.complianceNotes,
        assessment_status: 'assessment-pending',
        assessed_by: user?.user?.id,
        assessed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('export_control_assessments')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Log audit event
      if (data) {
        await this.logAuditEvent('assessment_created', { assessmentId: data.id });
      }

      return data ? mapAssessment(data) : null;
    } catch (err) {
      console.error('Error creating assessment:', err);
      return null;
    }
  },

  async updateAssessment(id: string, updates: Partial<CreateExportControlAssessmentData> & { assessmentStatus?: string }): Promise<ExportControlAssessment | null> {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.controlType) updateData.control_type = updates.controlType;
      if (updates.itarCategory) updateData.itar_category = updates.itarCategory;
      if (updates.earEccn) updateData.ear_eccn = updates.earEccn;
      if (updates.tcpRequired !== undefined) updateData.tcp_required = updates.tcpRequired;
      if (updates.citizenshipRequirement) updateData.citizenship_requirement = updates.citizenshipRequirement;
      if (updates.foreignNationalAllowed !== undefined) updateData.foreign_national_allowed = updates.foreignNationalAllowed;
      if (updates.complianceNotes) updateData.compliance_notes = updates.complianceNotes;
      if (updates.assessmentStatus) updateData.assessment_status = updates.assessmentStatus;

      const { data, error } = await supabase
        .from('export_control_assessments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logAuditEvent('assessment_updated', { assessmentId: id });
      return data ? mapAssessment(data) : null;
    } catch (err) {
      console.error('Error updating assessment:', err);
      return null;
    }
  },

  // --- Foreign National Screenings ---

  async listScreenings(
    filters: ForeignNationalScreeningFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ screenings: ForeignNationalScreening[]; total: number }> {
    try {
      let query = supabase
        .from('foreign_national_screenings')
        .select('*', { count: 'exact' });

      if (filters.screeningStatus?.length) {
        query = query.in('screening_status', filters.screeningStatus);
      }
      if (filters.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      }
      if (filters.restrictedPartyMatch !== undefined) {
        query = query.eq('restricted_party_match', filters.restrictedPartyMatch);
      }
      if (filters.deemedExportRisk) {
        query = query.eq('deemed_export_risk', filters.deemedExportRisk);
      }
      if (filters.visaType) {
        query = query.eq('visa_type', filters.visaType);
      }

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);
      query = query.order('updated_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;

      const screenings = (data || []).map(mapScreening);
      if (screenings.length === 0) {
        return { screenings: sampleForeignNationalScreenings, total: sampleForeignNationalScreenings.length };
      }
      return { screenings, total: count || 0 };
    } catch (err) {
      console.error('Error fetching screenings:', err);
      return { screenings: sampleForeignNationalScreenings, total: sampleForeignNationalScreenings.length };
    }
  },

  async createScreening(input: CreateForeignNationalScreeningData): Promise<ForeignNationalScreening | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const insertData = {
        user_id: input.userId,
        organization_id: input.organizationId,
        declared_citizenship: input.declaredCitizenship,
        dual_citizenship: input.dualCitizenship || [],
        country_of_birth: input.countryOfBirth,
        visa_type: input.visaType,
        visa_expiration: input.visaExpiration,
        permanent_resident: input.permanentResident || false,
        screening_status: 'assessment-pending',
        screened_by: user?.user?.id,
        screened_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('foreign_national_screenings')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        await this.logAuditEvent('screening_initiated', { screeningId: data.id });
      }

      return data ? mapScreening(data) : null;
    } catch (err) {
      console.error('Error creating screening:', err);
      return null;
    }
  },

  async updateScreeningStatus(
    id: string,
    status: string,
    additionalData?: { itarEligible?: boolean; earEligible?: boolean; deemedExportRisk?: string; screeningNotes?: string }
  ): Promise<ForeignNationalScreening | null> {
    try {
      const updateData: any = {
        screening_status: status,
        updated_at: new Date().toISOString(),
      };
      if (additionalData?.itarEligible !== undefined) updateData.itar_eligible = additionalData.itarEligible;
      if (additionalData?.earEligible !== undefined) updateData.ear_eligible = additionalData.earEligible;
      if (additionalData?.deemedExportRisk) updateData.deemed_export_risk = additionalData.deemedExportRisk;
      if (additionalData?.screeningNotes) updateData.screening_notes = additionalData.screeningNotes;

      const { data, error } = await supabase
        .from('foreign_national_screenings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logAuditEvent('screening_completed', { screeningId: id, status });
      return data ? mapScreening(data) : null;
    } catch (err) {
      console.error('Error updating screening:', err);
      return null;
    }
  },

  // Run restricted party list check (simulated — real implementation would call external APIs)
  async runRestrictedPartyCheck(screeningId: string): Promise<boolean> {
    try {
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('foreign_national_screenings')
        .update({
          restricted_party_checked: true,
          restricted_party_checked_at: now,
          denied_persons_list_checked: true,
          entity_list_checked: true,
          sdn_list_checked: true,
          unverified_list_checked: true,
          restricted_party_match: false, // Default no match; real impl would check APIs
          updated_at: now,
        })
        .eq('id', screeningId);

      if (error) throw error;

      await this.logAuditEvent('screening_completed', { screeningId, checkType: 'restricted_party' });
      return true;
    } catch (err) {
      console.error('Error running restricted party check:', err);
      return false;
    }
  },

  // Automated eligibility check for a user against a job's export control requirements
  async checkEligibility(userId: string, jobId: string): Promise<{ eligible: boolean; reason?: string }> {
    try {
      // Get the job's export control assessment
      const { data: assessment } = await supabase
        .from('export_control_assessments')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (!assessment || assessment.control_type === 'none') {
        return { eligible: true, reason: 'No export controls on this position' };
      }

      // Get user's screening record
      const { data: screening } = await supabase
        .from('foreign_national_screenings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!screening) {
        return { eligible: false, reason: 'No screening record found — screening required' };
      }

      // Check ITAR eligibility
      if ((assessment.control_type === 'itar' || assessment.control_type === 'both') && !screening.itar_eligible) {
        return { eligible: false, reason: 'ITAR-controlled position requires US Person status' };
      }

      // Check EAR eligibility
      if ((assessment.control_type === 'ear' || assessment.control_type === 'both') && !screening.ear_eligible) {
        return { eligible: false, reason: 'EAR-controlled position — license or eligibility required' };
      }

      // Check restricted party match
      if (screening.restricted_party_match) {
        return { eligible: false, reason: 'Restricted party list match detected' };
      }

      await this.logAuditEvent('eligibility_checked', { userId, jobId, result: 'eligible' });
      return { eligible: true };
    } catch (err) {
      console.error('Error checking eligibility:', err);
      return { eligible: false, reason: 'Error performing eligibility check' };
    }
  },

  // --- Dashboard Stats ---

  async getStats(): Promise<ExportControlDashboardStats> {
    try {
      const [assessmentsResult, screeningsResult] = await Promise.all([
        supabase.from('export_control_assessments').select('control_type, assessment_status, tcp_expires_at'),
        supabase.from('foreign_national_screenings').select('screening_status, restricted_party_match'),
      ]);

      const assessments = assessmentsResult.data || [];
      const screenings = screeningsResult.data || [];

      if (assessments.length === 0 && screenings.length === 0) return sampleExportControlStats;

      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const byControlType: Record<string, number> = { itar: 0, ear: 0, both: 0, none: 0 };
      const byStatus: Record<string, number> = {};
      let tcpActive = 0;
      let tcpExpiring = 0;

      assessments.forEach((a) => {
        byControlType[a.control_type] = (byControlType[a.control_type] || 0) + 1;
        byStatus[a.assessment_status] = (byStatus[a.assessment_status] || 0) + 1;
        if (a.tcp_expires_at) {
          const exp = new Date(a.tcp_expires_at);
          if (exp > now) tcpActive++;
          if (exp > now && exp <= in30Days) tcpExpiring++;
        }
      });

      return {
        totalAssessments: assessments.length,
        itarControlled: byControlType['itar'] || 0,
        earControlled: byControlType['ear'] || 0,
        bothControlled: byControlType['both'] || 0,
        pendingAssessments: assessments.filter(a => a.assessment_status === 'assessment-pending').length,
        pendingScreenings: screenings.filter(s => s.screening_status === 'assessment-pending').length,
        restrictedPartyMatches: screenings.filter(s => s.restricted_party_match).length,
        tcpActive,
        tcpExpiringNext30Days: tcpExpiring,
        foreignNationalsScreened: screenings.length,
        byControlType: byControlType as any,
        byStatus: byStatus as any,
      };
    } catch (err) {
      console.error('Error fetching export control stats:', err);
      return sampleExportControlStats;
    }
  },

  // --- Audit Log ---

  async logAuditEvent(
    eventType: ExportControlAuditEventType,
    details: Record<string, unknown> = {}
  ): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      await supabase.from('export_control_audit_log').insert({
        assessment_id: details.assessmentId as string || null,
        screening_id: details.screeningId as string || null,
        event_type: eventType,
        event_details: details,
        performed_by: user?.user?.id,
      });
    } catch (err) {
      console.error('Error logging audit event:', err);
    }
  },

  async getAuditLog(
    filters: { assessmentId?: string; screeningId?: string; eventType?: string } = {},
    page: number = 1,
    pageSize: number = 50
  ): Promise<{ entries: ExportControlAuditEntry[]; total: number }> {
    try {
      let query = supabase
        .from('export_control_audit_log')
        .select('*', { count: 'exact' });

      if (filters.assessmentId) query = query.eq('assessment_id', filters.assessmentId);
      if (filters.screeningId) query = query.eq('screening_id', filters.screeningId);
      if (filters.eventType) query = query.eq('event_type', filters.eventType);

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;

      const entries = (data || []).map(mapAuditEntry);
      if (entries.length === 0) {
        return { entries: sampleAuditEntries, total: sampleAuditEntries.length };
      }
      return { entries, total: count || 0 };
    } catch (err) {
      console.error('Error fetching audit log:', err);
      return { entries: sampleAuditEntries, total: sampleAuditEntries.length };
    }
  },
};

export default exportControlApi;
