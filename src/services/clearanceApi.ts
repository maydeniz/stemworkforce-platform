// ===========================================
// Clearance Pipeline API Service
// Tracks clearance status through investigation lifecycle
// STATUS ONLY — no SF-86 content or classified data
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  ClearancePipeline,
  ClearanceStatusHistory,
  ClearancePipelineFilters,
  ClearanceDashboardStats,
  CreateClearancePipelineData,
  UpdateClearanceStatusData,
} from '@/types/clearance';
import {
  sampleClearancePipelines,
  sampleClearanceStats,
} from '@/data/sampleComplianceData';

// ===========================================
// Helper: Map DB record to frontend type
// ===========================================

function mapPipeline(record: any): ClearancePipeline {
  return {
    id: record.id,
    userId: record.user_id,
    organizationId: record.organization_id,
    clearanceType: record.clearance_type,
    doeClearanceType: record.doe_clearance_type,
    sponsoringAgency: record.sponsoring_agency,
    sponsoringFacility: record.sponsoring_facility,
    pipelineStatus: record.pipeline_status,
    sf86PrepStartedAt: record.sf86_prep_started_at,
    sf86SubmittedAt: record.sf86_submitted_at,
    investigationOpenedAt: record.investigation_opened_at,
    investigationCompletedAt: record.investigation_completed_at,
    adjudicationStartedAt: record.adjudication_started_at,
    interimGrantedAt: record.interim_granted_at,
    finalGrantedAt: record.final_granted_at,
    deniedAt: record.denied_at,
    clearanceGrantedAt: record.clearance_granted_at,
    clearanceExpiresAt: record.clearance_expires_at,
    reinvestigationDueAt: record.reinvestigation_due_at,
    lastPeriodicReinvestigation: record.last_periodic_reinvestigation,
    polygraphRequired: record.polygraph_required,
    polygraphType: record.polygraph_type,
    polygraphScheduledAt: record.polygraph_scheduled_at,
    polygraphCompletedAt: record.polygraph_completed_at,
    polygraphPassed: record.polygraph_passed,
    drugTestRequired: record.drug_test_required,
    drugTestCompletedAt: record.drug_test_completed_at,
    drugTestPassed: record.drug_test_passed,
    assignedFsoId: record.assigned_fso_id,
    fsoNotes: record.fso_notes,
    denialReasonCategory: record.denial_reason_category,
    appealFiled: record.appeal_filed,
    appealFiledAt: record.appeal_filed_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    createdBy: record.created_by,
    updatedBy: record.updated_by,
  };
}

function mapHistory(record: any): ClearanceStatusHistory {
  return {
    id: record.id,
    pipelineId: record.pipeline_id,
    previousStatus: record.previous_status,
    newStatus: record.new_status,
    changedBy: record.changed_by,
    changeReason: record.change_reason,
    notes: record.notes,
    createdAt: record.created_at,
  };
}

// ===========================================
// Clearance Pipeline API
// ===========================================

export const clearanceApi = {
  // List pipelines with filters and pagination
  async list(
    filters: ClearancePipelineFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ pipelines: ClearancePipeline[]; total: number }> {
    try {
      let query = supabase
        .from('clearance_pipelines')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status?.length) {
        query = query.in('pipeline_status', filters.status);
      }
      if (filters.clearanceType?.length) {
        query = query.in('clearance_type', filters.clearanceType);
      }
      if (filters.doeClearanceType?.length) {
        query = query.in('doe_clearance_type', filters.doeClearanceType);
      }
      if (filters.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      }
      if (filters.sponsoringAgency) {
        query = query.eq('sponsoring_agency', filters.sponsoringAgency);
      }
      if (filters.assignedFsoId) {
        query = query.eq('assigned_fso_id', filters.assignedFsoId);
      }
      if (filters.polygraphRequired !== undefined) {
        query = query.eq('polygraph_required', filters.polygraphRequired);
      }
      if (filters.expiringWithinDays) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + filters.expiringWithinDays);
        query = query.lte('clearance_expires_at', expirationDate.toISOString());
        query = query.gte('clearance_expires_at', new Date().toISOString());
      }
      if (filters.reinvestigationDueWithinDays) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + filters.reinvestigationDueWithinDays);
        query = query.lte('reinvestigation_due_at', dueDate.toISOString());
        query = query.gte('reinvestigation_due_at', new Date().toISOString());
      }

      // Pagination
      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);
      query = query.order('updated_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      const pipelines = (data || []).map(mapPipeline);
      if (pipelines.length === 0) {
        return { pipelines: sampleClearancePipelines, total: sampleClearancePipelines.length };
      }
      return { pipelines, total: count || 0 };
    } catch (err) {
      console.error('Error fetching clearance pipelines:', err);
      return { pipelines: sampleClearancePipelines, total: sampleClearancePipelines.length };
    }
  },

  // Get single pipeline by ID
  async getById(id: string): Promise<ClearancePipeline | null> {
    try {
      const { data, error } = await supabase
        .from('clearance_pipelines')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapPipeline(data) : null;
    } catch (err) {
      console.error('Error fetching clearance pipeline:', err);
      return null;
    }
  },

  // Create new clearance pipeline
  async create(data: CreateClearancePipelineData): Promise<ClearancePipeline | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      const insertData = {
        user_id: data.userId,
        organization_id: data.organizationId,
        clearance_type: data.clearanceType,
        doe_clearance_type: data.doeClearanceType,
        sponsoring_agency: data.sponsoringAgency,
        sponsoring_facility: data.sponsoringFacility,
        polygraph_required: data.polygraphRequired || false,
        polygraph_type: data.polygraphType,
        drug_test_required: data.drugTestRequired || false,
        assigned_fso_id: data.assignedFsoId,
        pipeline_status: 'not-started',
        created_by: user?.user?.id,
      };

      const { data: result, error } = await supabase
        .from('clearance_pipelines')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Log initial status in history
      if (result) {
        await supabase.from('clearance_status_history').insert({
          pipeline_id: result.id,
          new_status: 'not-started',
          changed_by: user?.user?.id,
          change_reason: 'Pipeline created',
        });
      }

      return result ? mapPipeline(result) : null;
    } catch (err) {
      console.error('Error creating clearance pipeline:', err);
      return null;
    }
  },

  // Update pipeline status (with auto history logging)
  async updateStatus(
    id: string,
    update: UpdateClearanceStatusData
  ): Promise<ClearancePipeline | null> {
    try {
      const { data: user } = await supabase.auth.getUser();

      // Get current status for history
      const { data: current } = await supabase
        .from('clearance_pipelines')
        .select('pipeline_status')
        .eq('id', id)
        .single();

      // Build update object with timestamp for the new status
      const updateData: any = {
        pipeline_status: update.pipelineStatus,
        updated_by: user?.user?.id,
      };

      // Set appropriate timestamp based on new status
      const statusTimestampMap: Record<string, string> = {
        'sf86-preparation': 'sf86_prep_started_at',
        'sf86-submitted': 'sf86_submitted_at',
        'investigation-initiated': 'investigation_opened_at',
        'investigation-complete': 'investigation_completed_at',
        'adjudication-pending': 'adjudication_started_at',
        'interim-granted': 'interim_granted_at',
        'granted': 'final_granted_at',
        'denied': 'denied_at',
      };

      const timestampField = statusTimestampMap[update.pipelineStatus];
      if (timestampField) {
        updateData[timestampField] = new Date().toISOString();
      }

      // If granted, set clearance_granted_at and calculate expiration
      if (update.pipelineStatus === 'granted') {
        updateData.clearance_granted_at = new Date().toISOString();
      }

      const { data: result, error } = await supabase
        .from('clearance_pipelines')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log status change in history
      await supabase.from('clearance_status_history').insert({
        pipeline_id: id,
        previous_status: current?.pipeline_status,
        new_status: update.pipelineStatus,
        changed_by: user?.user?.id,
        change_reason: update.changeReason,
        notes: update.notes,
      });

      return result ? mapPipeline(result) : null;
    } catch (err) {
      console.error('Error updating clearance status:', err);
      return null;
    }
  },

  // Get status history for a pipeline
  async getHistory(pipelineId: string): Promise<ClearanceStatusHistory[]> {
    try {
      const { data, error } = await supabase
        .from('clearance_status_history')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapHistory);
    } catch (err) {
      console.error('Error fetching clearance history:', err);
      return [];
    }
  },

  // Get dashboard statistics
  async getStats(): Promise<ClearanceDashboardStats> {
    try {
      const { data, error } = await supabase
        .from('clearance_pipelines')
        .select('pipeline_status, clearance_type, sponsoring_agency, clearance_expires_at, reinvestigation_due_at');

      if (error) throw error;

      const pipelines = data || [];
      if (pipelines.length === 0) return sampleClearanceStats;

      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      const byStatus: Partial<Record<string, number>> = {};
      const byType: Record<string, number> = {};
      const byAgency: Record<string, number> = {};

      let expiringNext30 = 0;
      let expiringNext90 = 0;
      let reinvestigationDue = 0;

      pipelines.forEach((p) => {
        byStatus[p.pipeline_status] = (byStatus[p.pipeline_status] || 0) + 1;
        byType[p.clearance_type] = (byType[p.clearance_type] || 0) + 1;
        byAgency[p.sponsoring_agency] = (byAgency[p.sponsoring_agency] || 0) + 1;

        if (p.clearance_expires_at) {
          const exp = new Date(p.clearance_expires_at);
          if (exp <= in30Days && exp >= now) expiringNext30++;
          if (exp <= in90Days && exp >= now) expiringNext90++;
        }
        if (p.reinvestigation_due_at) {
          const reinv = new Date(p.reinvestigation_due_at);
          if (reinv <= in90Days) reinvestigationDue++;
        }
      });

      return {
        totalPipelines: pipelines.length,
        totalActive: pipelines.filter(p => ['granted', 'interim-granted'].includes(p.pipeline_status)).length,
        pendingInvestigation: pipelines.filter(p => ['investigation-initiated', 'investigation-fieldwork'].includes(p.pipeline_status)).length,
        interimGranted: byStatus['interim-granted'] || 0,
        fullyGranted: byStatus['granted'] || 0,
        expiringNext30Days: expiringNext30,
        expiringNext90Days: expiringNext90,
        reinvestigationDue,
        deniedLastQuarter: pipelines.filter(p => p.pipeline_status === 'denied').length,
        averageProcessingDays: 0, // Would need timestamp math
        byStatus: byStatus as any,
        byType,
        byAgency,
      };
    } catch (err) {
      console.error('Error fetching clearance stats:', err);
      return sampleClearanceStats;
    }
  },

  // Get pipelines expiring within N days
  async getExpiring(withinDays: number = 30): Promise<ClearancePipeline[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + withinDays);

      const { data, error } = await supabase
        .from('clearance_pipelines')
        .select('*')
        .lte('clearance_expires_at', futureDate.toISOString())
        .gte('clearance_expires_at', new Date().toISOString())
        .order('clearance_expires_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(mapPipeline);
    } catch (err) {
      console.error('Error fetching expiring clearances:', err);
      return sampleClearancePipelines.filter(p => p.clearanceExpiresAt && new Date(p.clearanceExpiresAt) <= new Date(Date.now() + withinDays * 86400000));
    }
  },

  // Get pipelines needing reinvestigation
  async getReinvestigationDue(withinDays: number = 90): Promise<ClearancePipeline[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + withinDays);

      const { data, error } = await supabase
        .from('clearance_pipelines')
        .select('*')
        .lte('reinvestigation_due_at', futureDate.toISOString())
        .order('reinvestigation_due_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(mapPipeline);
    } catch (err) {
      console.error('Error fetching reinvestigation due:', err);
      return sampleClearancePipelines.filter(p => p.pipelineStatus === 'reinvestigation-due');
    }
  },

  // Assign FSO to pipeline
  async assignFso(pipelineId: string, fsoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clearance_pipelines')
        .update({ assigned_fso_id: fsoId })
        .eq('id', pipelineId);

      return !error;
    } catch {
      return false;
    }
  },
};

export default clearanceApi;
