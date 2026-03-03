// ===========================================
// Email Notification Service (Placeholder)
// Will integrate with SendGrid, AWS SES, or similar
// ===========================================

// Types for email notifications
export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export interface EmailPayload {
  to: EmailRecipient | EmailRecipient[];
  templateId: string;
  templateData: Record<string, string | number | boolean>;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
    contentType: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ===========================================
// EMAIL TEMPLATES
// ===========================================

export const EMAIL_TEMPLATES = {
  // Partner Application Templates
  PARTNER_APPLICATION_RECEIVED: 'partner_application_received',
  PARTNER_APPLICATION_APPROVED: 'partner_application_approved',
  PARTNER_APPLICATION_REJECTED: 'partner_application_rejected',
  PARTNER_APPLICATION_MORE_INFO: 'partner_application_more_info',

  // Partner Account Templates
  PARTNER_WELCOME: 'partner_welcome',
  PARTNER_PASSWORD_RESET: 'partner_password_reset',
  PARTNER_SUBSCRIPTION_UPGRADED: 'partner_subscription_upgraded',
  PARTNER_SUBSCRIPTION_DOWNGRADED: 'partner_subscription_downgraded',
  PARTNER_PAYMENT_RECEIVED: 'partner_payment_received',
  PARTNER_PAYMENT_FAILED: 'partner_payment_failed',

  // Employer Connection Templates
  CONNECTION_REQUEST_SENT: 'connection_request_sent',
  CONNECTION_REQUEST_RECEIVED: 'connection_request_received',
  CONNECTION_REQUEST_ACCEPTED: 'connection_request_accepted',
  CONNECTION_REQUEST_DECLINED: 'connection_request_declined',

  // Event Templates
  EVENT_REGISTRATION_CONFIRMATION: 'event_registration_confirmation',
  EVENT_REMINDER: 'event_reminder',
  EVENT_CANCELLED: 'event_cancelled',
  EVENT_UPDATED: 'event_updated',

  // General Notifications
  WEEKLY_DIGEST: 'weekly_digest',
  MONTHLY_REPORT: 'monthly_report',
} as const;

// ===========================================
// PLACEHOLDER EMAIL SERVICE
// ===========================================

class EmailNotificationService {
  private isInitialized = false;
  private _apiKey: string | null = null; // Prefixed with _ as placeholder for future Stripe integration
  private defaultFromEmail = 'noreply@stemworkforce.org';
  private defaultFromName = 'STEM Workforce Platform';

  /**
   * Initialize the email service with API credentials
   * TODO: Replace with actual provider (SendGrid, AWS SES, etc.)
   */
  initialize(config: { apiKey: string; fromEmail?: string; fromName?: string }) {
    this._apiKey = config.apiKey;
    this.defaultFromEmail = config.fromEmail || this.defaultFromEmail;
    this.defaultFromName = config.fromName || this.defaultFromName;
    this.isInitialized = true;
    console.log('[EmailService] Initialized (placeholder mode)', { hasApiKey: !!this._apiKey });
  }

  /**
   * Send a single email using a template
   */
  async sendEmail(payload: EmailPayload): Promise<EmailResult> {
    if (!this.isInitialized) {
      console.warn('[EmailService] Not initialized, email not sent');
      return { success: false, error: 'Email service not initialized' };
    }

    // PLACEHOLDER: Log the email that would be sent
    const recipients = Array.isArray(payload.to) ? payload.to : [payload.to];
    console.log('[EmailService] Would send email:', {
      to: recipients.map(r => r.email),
      template: payload.templateId,
      data: payload.templateData
    });

    // Simulate successful send
    return {
      success: true,
      messageId: `placeholder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Send bulk emails using a template
   */
  async sendBulkEmails(
    recipients: EmailRecipient[],
    templateId: string,
    commonData: Record<string, string | number | boolean>,
    _perRecipientData?: Map<string, Record<string, string | number | boolean>> // Prefixed with _ as placeholder for future implementation
  ): Promise<{ sent: number; failed: number; errors: string[] }> {
    if (!this.isInitialized) {
      return { sent: 0, failed: recipients.length, errors: ['Email service not initialized'] };
    }

    console.log('[EmailService] Would send bulk email:', {
      recipientCount: recipients.length,
      template: templateId,
      commonData
    });

    // Simulate successful bulk send
    return { sent: recipients.length, failed: 0, errors: [] };
  }

  // ===========================================
  // PARTNER NOTIFICATION HELPERS
  // ===========================================

  /**
   * Send application received confirmation
   */
  async sendApplicationReceived(
    applicantEmail: string,
    applicantName: string,
    institutionName: string,
    applicationId: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: applicantEmail, name: applicantName },
      templateId: EMAIL_TEMPLATES.PARTNER_APPLICATION_RECEIVED,
      templateData: {
        name: applicantName,
        institution: institutionName,
        applicationId: applicationId,
        dashboardUrl: `${window.location.origin}/partner-application-status/${applicationId}`
      }
    });
  }

  /**
   * Send application approved notification
   */
  async sendApplicationApproved(
    applicantEmail: string,
    applicantName: string,
    institutionName: string,
    tempPassword: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: applicantEmail, name: applicantName },
      templateId: EMAIL_TEMPLATES.PARTNER_APPLICATION_APPROVED,
      templateData: {
        name: applicantName,
        institution: institutionName,
        tempPassword: tempPassword,
        loginUrl: `${window.location.origin}/education-partner-login`
      }
    });
  }

  /**
   * Send connection request notification
   */
  async sendConnectionRequest(
    employerEmail: string,
    employerName: string,
    partnerName: string,
    connectionType: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: employerEmail, name: employerName },
      templateId: EMAIL_TEMPLATES.CONNECTION_REQUEST_RECEIVED,
      templateData: {
        employerName: employerName,
        partnerName: partnerName,
        connectionType: connectionType,
        reviewUrl: `${window.location.origin}/employer/connection-requests`
      }
    });
  }

  /**
   * Send event registration confirmation
   */
  async sendEventRegistration(
    attendeeEmail: string,
    attendeeName: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    isVirtual: boolean,
    virtualLink?: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: attendeeEmail, name: attendeeName },
      templateId: EMAIL_TEMPLATES.EVENT_REGISTRATION_CONFIRMATION,
      templateData: {
        name: attendeeName,
        eventTitle: eventTitle,
        eventDate: eventDate,
        eventLocation: eventLocation,
        isVirtual: isVirtual,
        virtualLink: virtualLink || ''
      }
    });
  }

  /**
   * Send payment received notification
   */
  async sendPaymentReceived(
    partnerEmail: string,
    partnerName: string,
    amount: number,
    planName: string,
    invoiceUrl?: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: partnerEmail, name: partnerName },
      templateId: EMAIL_TEMPLATES.PARTNER_PAYMENT_RECEIVED,
      templateData: {
        name: partnerName,
        amount: amount,
        planName: planName,
        invoiceUrl: invoiceUrl || ''
      }
    });
  }

  /**
   * Send weekly digest
   */
  async sendWeeklyDigest(
    partnerEmail: string,
    partnerName: string,
    stats: {
      newConnections: number;
      newRegistrations: number;
      upcomingEvents: number;
    }
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: partnerEmail, name: partnerName },
      templateId: EMAIL_TEMPLATES.WEEKLY_DIGEST,
      templateData: {
        name: partnerName,
        newConnections: stats.newConnections,
        newRegistrations: stats.newRegistrations,
        upcomingEvents: stats.upcomingEvents,
        dashboardUrl: `${window.location.origin}/education-partner-dashboard`
      }
    });
  }
}

// Export singleton instance
export const emailService = new EmailNotificationService();

// Initialize with placeholder API key for development
// TODO: Replace with actual API key from environment variables
if (typeof window !== 'undefined') {
  emailService.initialize({
    apiKey: 'placeholder_api_key',
    fromEmail: 'noreply@stemworkforce.org',
    fromName: 'STEM Workforce Platform'
  });
}

export default emailService;
