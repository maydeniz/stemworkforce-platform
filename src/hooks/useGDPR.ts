// ===========================================
// GDPR Data Export Hook
// ===========================================

import { useState, useCallback } from 'react';
import { gdprService, type UserDataExport, type DataExportRequest } from '@/services/gdprService';
import { logger } from '@/lib/logger';

interface UseGDPRReturn {
  // Export state
  isExporting: boolean;
  exportData: UserDataExport | null;
  exportError: string | null;

  // Request state
  requests: DataExportRequest[];
  isLoadingRequests: boolean;

  // Actions
  generateExport: () => Promise<void>;
  downloadExport: () => void;
  requestAsyncExport: () => Promise<void>;
  requestDeletion: (reason?: string) => Promise<void>;
  cancelDeletion: (requestId: string) => Promise<void>;
  fetchRequests: () => Promise<void>;

  // Consent
  consents: Record<string, boolean>;
  updateConsent: (type: string, granted: boolean) => Promise<void>;
  fetchConsents: () => Promise<void>;
}

export function useGDPR(): UseGDPRReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [exportData, setExportData] = useState<UserDataExport | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const [requests, setRequests] = useState<DataExportRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const [consents, setConsents] = useState<Record<string, boolean>>({});

  /**
   * Generate immediate data export
   */
  const generateExport = useCallback(async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const data = await gdprService.generateImmediateExport();
      setExportData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setExportError(message);
      logger.error('Data export failed', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  /**
   * Download the generated export as JSON
   */
  const downloadExport = useCallback(() => {
    if (exportData) {
      const timestamp = new Date().toISOString().split('T')[0];
      gdprService.downloadAsJSON(exportData, `stem-workforce-data-${timestamp}.json`);
    }
  }, [exportData]);

  /**
   * Request async export (for large datasets)
   */
  const requestAsyncExport = useCallback(async () => {
    setExportError(null);

    try {
      await gdprService.requestDataExport();
      await fetchRequests();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      setExportError(message);
      logger.error('Export request failed', error);
    }
  }, []);

  /**
   * Fetch all export requests
   */
  const fetchRequests = useCallback(async () => {
    setIsLoadingRequests(true);

    try {
      const data = await gdprService.getMyExportRequests();
      setRequests(data);
    } catch (error) {
      logger.error('Failed to fetch requests', error);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  /**
   * Request account deletion
   */
  const requestDeletion = useCallback(async (reason?: string) => {
    setExportError(null);

    try {
      await gdprService.requestAccountDeletion(reason);
      await fetchRequests();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      setExportError(message);
      logger.error('Deletion request failed', error);
    }
  }, [fetchRequests]);

  /**
   * Cancel deletion request
   */
  const cancelDeletion = useCallback(async (requestId: string) => {
    try {
      await gdprService.cancelDeletionRequest(requestId);
      await fetchRequests();
    } catch (error) {
      logger.error('Failed to cancel deletion', error);
    }
  }, [fetchRequests]);

  /**
   * Fetch consent preferences
   */
  const fetchConsents = useCallback(async () => {
    try {
      const data = await gdprService.getConsentPreferences();
      setConsents(data);
    } catch (error) {
      logger.error('Failed to fetch consents', error);
    }
  }, []);

  /**
   * Update consent preference
   */
  const updateConsent = useCallback(async (type: string, granted: boolean) => {
    try {
      await gdprService.updateConsentPreference(type, granted);
      setConsents((prev) => ({ ...prev, [type]: granted }));
    } catch (error) {
      logger.error('Failed to update consent', error);
    }
  }, []);

  return {
    isExporting,
    exportData,
    exportError,
    requests,
    isLoadingRequests,
    generateExport,
    downloadExport,
    requestAsyncExport,
    requestDeletion,
    cancelDeletion,
    fetchRequests,
    consents,
    updateConsent,
    fetchConsents,
  };
}

export default useGDPR;
