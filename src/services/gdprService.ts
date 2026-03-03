// ===========================================
// GDPR Data Export Service
// Handles user data export and deletion requests
// ===========================================

import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export interface DataExportRequest {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  request_type: 'export' | 'deletion';
  download_url?: string;
  expires_at?: string;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface UserDataExport {
  exportedAt: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
    lastSignIn?: string;
  };
  profile: Record<string, unknown> | null;
  organizations: Array<Record<string, unknown>>;
  applications: Array<Record<string, unknown>>;
  savedListings: Array<Record<string, unknown>>;
  challengeRegistrations: Array<Record<string, unknown>>;
  challengeSubmissions: Array<Record<string, unknown>>;
  activityLog: Array<Record<string, unknown>>;
  settings: Record<string, unknown> | null;
}

/**
 * GDPR Data Export Service
 */
class GDPRService {
  /**
   * Request a data export for the current user
   */
  async requestDataExport(): Promise<{ requestId: string }> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Check for existing pending request
    const { data: existingRequest } = await supabase
      .from('dsr_requests')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('request_type', 'export')
      .in('status', ['pending', 'processing'])
      .single();

    if (existingRequest) {
      throw new Error('You already have a pending export request');
    }

    // Create new request
    const { data: request, error } = await supabase
      .from('dsr_requests')
      .insert({
        user_id: user.id,
        request_type: 'export',
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create data export request', error);
      throw new Error('Failed to create export request');
    }

    logger.info('Data export request created', { requestId: request.id });

    return { requestId: request.id };
  }

  /**
   * Get the status of a data export request
   */
  async getExportStatus(requestId: string): Promise<DataExportRequest> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('dsr_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      throw new Error('Export request not found');
    }

    return data as DataExportRequest;
  }

  /**
   * Get all export requests for the current user
   */
  async getMyExportRequests(): Promise<DataExportRequest[]> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('dsr_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      logger.error('Failed to fetch export requests', error);
      throw new Error('Failed to fetch export requests');
    }

    return (data || []) as DataExportRequest[];
  }

  /**
   * Generate and download user data export immediately
   * This is for smaller datasets that can be generated client-side
   */
  async generateImmediateExport(): Promise<UserDataExport> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    logger.info('Starting immediate data export', { userId: user.id });

    // Fetch all user data in parallel
    const [
      profileResult,
      organizationsResult,
      applicationsResult,
      savedListingsResult,
      challengeRegsResult,
      submissionsResult,
      activityResult,
      settingsResult,
    ] = await Promise.all([
      // User profile
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(),

      // Organizations user belongs to
      supabase
        .from('organization_members')
        .select(`
          role,
          joined_at,
          organization:organizations(id, name, type)
        `)
        .eq('user_id', user.id),

      // Job applications
      supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          cover_letter,
          listing:federated_listings(id, title, organization_name)
        `)
        .eq('user_id', user.id),

      // Saved listings
      supabase
        .from('saved_listings')
        .select(`
          saved_at,
          listing:federated_listings(id, title, content_type, organization_name)
        `)
        .eq('user_id', user.id),

      // Challenge registrations
      supabase
        .from('challenge_solvers')
        .select(`
          registered_at,
          participation_type,
          status,
          challenge:challenges(id, title, slug)
        `)
        .eq('user_id', user.id),

      // Challenge submissions
      supabase
        .from('challenge_submissions')
        .select(`
          id,
          title,
          description,
          submitted_at,
          status,
          score,
          challenge:challenges(id, title)
        `)
        .eq('submitted_by', user.id),

      // Activity/audit log (limited)
      supabase
        .from('audit_logs')
        .select('action, resource_type, created_at, ip_address')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100),

      // User settings/preferences
      supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single(),
    ]);

    const exportData: UserDataExport = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email || '',
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
      },
      profile: profileResult.data,
      organizations: organizationsResult.data || [],
      applications: applicationsResult.data || [],
      savedListings: savedListingsResult.data || [],
      challengeRegistrations: challengeRegsResult.data || [],
      challengeSubmissions: submissionsResult.data || [],
      activityLog: activityResult.data || [],
      settings: settingsResult.data,
    };

    logger.info('Data export generated successfully', { userId: user.id });

    return exportData;
  }

  /**
   * Download export data as JSON file
   */
  downloadAsJSON(data: UserDataExport, filename = 'my-data-export.json'): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    logger.info('Data export downloaded', { filename });
  }

  /**
   * Request account deletion (GDPR right to be forgotten)
   */
  async requestAccountDeletion(reason?: string): Promise<{ requestId: string }> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Check for existing pending deletion request
    const { data: existingRequest } = await supabase
      .from('dsr_requests')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('request_type', 'deletion')
      .in('status', ['pending', 'processing'])
      .single();

    if (existingRequest) {
      throw new Error('You already have a pending deletion request');
    }

    // Create deletion request
    const { data: request, error } = await supabase
      .from('dsr_requests')
      .insert({
        user_id: user.id,
        request_type: 'deletion',
        status: 'pending',
        metadata: reason ? { reason } : null,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create deletion request', error);
      throw new Error('Failed to create deletion request');
    }

    logger.info('Account deletion request created', { requestId: request.id });

    return { requestId: request.id };
  }

  /**
   * Cancel a pending deletion request
   */
  async cancelDeletionRequest(requestId: string): Promise<void> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('dsr_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .eq('user_id', user.id)
      .eq('request_type', 'deletion')
      .eq('status', 'pending');

    if (error) {
      logger.error('Failed to cancel deletion request', error);
      throw new Error('Failed to cancel deletion request');
    }

    logger.info('Deletion request cancelled', { requestId });
  }

  /**
   * Get user's consent preferences
   */
  async getConsentPreferences(): Promise<Record<string, boolean>> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_consents')
      .select('consent_type, granted')
      .eq('user_id', user.id);

    if (error) {
      logger.error('Failed to fetch consent preferences', error);
      return {};
    }

    const preferences: Record<string, boolean> = {};
    (data || []).forEach((consent: { consent_type: string; granted: boolean }) => {
      preferences[consent.consent_type] = consent.granted;
    });

    return preferences;
  }

  /**
   * Update consent preference
   */
  async updateConsentPreference(
    consentType: string,
    granted: boolean
  ): Promise<void> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('user_consents')
      .upsert({
        user_id: user.id,
        consent_type: consentType,
        granted,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,consent_type',
      });

    if (error) {
      logger.error('Failed to update consent', error);
      throw new Error('Failed to update consent preference');
    }

    logger.info('Consent preference updated', { consentType, granted });
  }
}

export const gdprService = new GDPRService();

export default gdprService;
