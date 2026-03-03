// ===========================================
// Data Privacy Settings Component
// GDPR-compliant data export and deletion UI
// ===========================================

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { useGDPR } from '@/hooks/useGDPR';
import { useDocumentTitle } from '@/hooks/useAccessibility';

export const DataPrivacySettings: React.FC = () => {
  useDocumentTitle('Data Privacy Settings');

  const {
    isExporting,
    exportData,
    exportError,
    requests,
    isLoadingRequests,
    generateExport,
    downloadExport,
    requestDeletion,
    cancelDeletion,
    fetchRequests,
    consents,
    updateConsent,
    fetchConsents,
  } = useGDPR();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showExportPreview, setShowExportPreview] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchConsents();
  }, [fetchRequests, fetchConsents]);

  const handleExport = async () => {
    await generateExport();
    setShowExportPreview(true);
  };

  const handleDeleteRequest = async () => {
    await requestDeletion(deleteReason);
    setShowDeleteConfirm(false);
    setDeleteReason('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-gray-500/20 text-gray-400',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Data Privacy Settings</h1>
        <p className="mt-2 text-gray-400">
          Manage your data, privacy preferences, and exercise your rights under GDPR and other privacy regulations.
        </p>
      </div>

      {/* Error Display */}
      {exportError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg" role="alert">
          <p className="text-red-400">{exportError}</p>
        </div>
      )}

      {/* Export Your Data */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Export Your Data</h2>
        <p className="text-gray-400 mb-6">
          Download a copy of all your personal data. This includes your profile information,
          applications, saved items, challenge submissions, and activity history.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleExport}
            loading={isExporting}
            disabled={isExporting}
          >
            {isExporting ? 'Generating Export...' : 'Generate Data Export'}
          </Button>

          {exportData && (
            <Button variant="secondary" onClick={downloadExport}>
              Download JSON File
            </Button>
          )}
        </div>

        {exportData && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">
              Your data export is ready. Click "Download JSON File" to save it to your computer.
            </p>
          </div>
        )}
      </Card>

      {/* Consent Preferences */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Communication Preferences</h2>
        <p className="text-gray-400 mb-6">
          Control how we communicate with you and use your data.
        </p>

        <div className="space-y-4">
          {[
            {
              type: 'marketing_emails',
              label: 'Marketing Emails',
              description: 'Receive emails about new features, opportunities, and platform updates.',
            },
            {
              type: 'job_alerts',
              label: 'Job Alerts',
              description: 'Get notified when new jobs matching your preferences are posted.',
            },
            {
              type: 'challenge_notifications',
              label: 'Challenge Notifications',
              description: 'Receive updates about challenges you are registered for.',
            },
            {
              type: 'analytics',
              label: 'Analytics & Improvements',
              description: 'Allow us to collect anonymized usage data to improve the platform.',
            },
          ].map((item) => (
            <div
              key={item.type}
              className="flex items-start justify-between p-4 bg-dark-surface border border-dark-border rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">{item.label}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={consents[item.type] || false}
                  onChange={(e) => updateConsent(item.type, e.target.checked)}
                  className="sr-only peer"
                  aria-label={`${item.label} consent`}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Request History */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Request History</h2>
        <p className="text-gray-400 mb-6">
          View the status of your data export and deletion requests.
        </p>

        {isLoadingRequests ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 py-4">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="text-left text-gray-400 border-b border-dark-border">
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Requested</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="py-4 text-white capitalize">{request.request_type}</td>
                    <td className="py-4">{getStatusBadge(request.status)}</td>
                    <td className="py-4 text-gray-400">{formatDate(request.created_at)}</td>
                    <td className="py-4">
                      {request.request_type === 'deletion' && request.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelDeletion(request.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {request.download_url && request.status === 'completed' && (
                        <a
                          href={request.download_url}
                          className="text-blue-400 hover:text-blue-300"
                          download
                        >
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Account */}
      <Card className="p-6 border-red-500/30">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Delete Your Account</h2>
        <p className="text-gray-400 mb-6">
          Permanently delete your account and all associated data. This action cannot be undone.
          Your data will be removed within 30 days of the request being processed.
        </p>

        <Button
          variant="danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Request Account Deletion
        </Button>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Your Account"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to delete your account? This will permanently remove:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Your profile and personal information</li>
            <li>All job applications and saved listings</li>
            <li>Challenge registrations and submissions</li>
            <li>Activity history and preferences</li>
          </ul>
          <p className="text-yellow-400 text-sm">
            This action cannot be undone. Your data will be permanently deleted within 30 days.
          </p>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason for leaving (optional)
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Help us improve by sharing why you're leaving..."
            />
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteRequest}
              fullWidth
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Preview Modal */}
      <Modal
        isOpen={showExportPreview}
        onClose={() => setShowExportPreview(false)}
        title="Your Data Export"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Here's a summary of your exported data:
          </p>

          {exportData && (
            <div className="space-y-3">
              <div className="p-3 bg-dark-surface rounded-lg">
                <span className="text-gray-400">Profile:</span>
                <span className="text-white ml-2">
                  {exportData.profile ? 'Included' : 'Not found'}
                </span>
              </div>
              <div className="p-3 bg-dark-surface rounded-lg">
                <span className="text-gray-400">Organizations:</span>
                <span className="text-white ml-2">
                  {exportData.organizations.length} memberships
                </span>
              </div>
              <div className="p-3 bg-dark-surface rounded-lg">
                <span className="text-gray-400">Applications:</span>
                <span className="text-white ml-2">
                  {exportData.applications.length} applications
                </span>
              </div>
              <div className="p-3 bg-dark-surface rounded-lg">
                <span className="text-gray-400">Saved Listings:</span>
                <span className="text-white ml-2">
                  {exportData.savedListings.length} items
                </span>
              </div>
              <div className="p-3 bg-dark-surface rounded-lg">
                <span className="text-gray-400">Challenge Registrations:</span>
                <span className="text-white ml-2">
                  {exportData.challengeRegistrations.length} registrations
                </span>
              </div>
              <div className="p-3 bg-dark-surface rounded-lg">
                <span className="text-gray-400">Submissions:</span>
                <span className="text-white ml-2">
                  {exportData.challengeSubmissions.length} submissions
                </span>
              </div>
              <div className="p-3 bg-dark-surface rounded-lg">
                <span className="text-gray-400">Activity Log:</span>
                <span className="text-white ml-2">
                  {exportData.activityLog.length} entries
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowExportPreview(false)}
              fullWidth
            >
              Close
            </Button>
            <Button onClick={downloadExport} fullWidth>
              Download JSON File
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataPrivacySettings;
