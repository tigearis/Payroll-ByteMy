// Resend Email Service
// Security Classification: HIGH - Email communication service
// SOC2 Compliance: Email delivery tracking and audit logging

import { Resend } from 'resend';
import type { 
  EmailComposition, 
  EmailSendResponse, 
  EmailSendLog,
  EmailCategory 
} from '../types';

class ResendEmailService {
  private resend: Resend;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@bytemy.com.au';
    this.fromName = process.env.RESEND_FROM_NAME || 'ByteMy Payroll';
  }

  /**
   * Send a single email using Resend
   */
  async sendEmail(
    composition: EmailComposition,
    senderId: string
  ): Promise<EmailSendResponse> {
    try {
      console.log(`📧 Sending email via Resend:`, {
        subject: composition.subject,
        recipients: composition.recipientEmails,
        senderId,
        category: composition.businessContext?.category || 'general'
      });

      // Validate recipients
      if (!composition.recipientEmails || composition.recipientEmails.length === 0) {
        return {
          success: false,
          error: 'No recipients specified'
        };
      }

      // Validate email addresses
      const invalidEmails = composition.recipientEmails.filter(
        email => !this.isValidEmail(email)
      );
      if (invalidEmails.length > 0) {
        return {
          success: false,
          error: `Invalid email addresses: ${invalidEmails.join(', ')}`
        };
      }

      // Prepare email data for Resend
      const emailData: any = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: composition.recipientEmails,
        subject: composition.subject,
        html: composition.htmlContent,
        tags: this.buildEmailTags(composition),
        headers: this.buildEmailHeaders(composition, senderId)
      };

      // Only add text if it's not undefined
      if (composition.textContent !== undefined) {
        emailData.text = composition.textContent;
      }

      // Send via Resend
      const response = await this.resend.emails.send(emailData);

      if (response.error) {
        console.error('❌ Resend email send failed:', response.error);
        return {
          success: false,
          error: response.error.message || 'Failed to send email'
        };
      }

      console.log(`✅ Email sent successfully via Resend:`, {
        resendId: response.data?.id,
        recipients: composition.recipientEmails.length
      });

      return {
        success: true,
        emailId: response.data?.id,
        resendId: response.data?.id,
        message: `Email sent successfully to ${composition.recipientEmails.length} recipient(s)`
      };

    } catch (error: any) {
      console.error('❌ Resend service error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred while sending email'
      };
    }
  }

  /**
   * Send bulk emails (up to 100 recipients)
   */
  async sendBulkEmails(
    compositions: EmailComposition[],
    senderId: string
  ): Promise<EmailSendResponse[]> {
    console.log(`📧 Sending ${compositions.length} bulk emails via Resend`);

    // Process in batches to respect rate limits
    const batchSize = 10;
    const results: EmailSendResponse[] = [];

    for (let i = 0; i < compositions.length; i += batchSize) {
      const batch = compositions.slice(i, i + batchSize);
      
      const batchPromises = batch.map(composition => 
        this.sendEmail(composition, senderId)
      );

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`❌ Bulk email ${i + index} failed:`, result.reason);
          results.push({
            success: false,
            error: result.reason?.message || 'Unknown error'
          });
        }
      });

      // Rate limiting delay between batches
      if (i + batchSize < compositions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Bulk email sending completed: ${results.filter(r => r.success).length}/${results.length} successful`);
    return results;
  }

  /**
   * Send scheduled email (future implementation with job queue)
   */
  async scheduleEmail(
    composition: EmailComposition,
    senderId: string,
    scheduledFor: Date
  ): Promise<EmailSendResponse> {
    // For now, just validate and return success
    // In production, this would integrate with a job queue like Bull or Agenda
    
    if (scheduledFor <= new Date()) {
      return {
        success: false,
        error: 'Scheduled time must be in the future'
      };
    }

    console.log(`📅 Email scheduled for ${scheduledFor.toISOString()}:`, {
      subject: composition.subject,
      recipients: composition.recipientEmails.length
    });

    return {
      success: true,
      message: `Email scheduled for ${scheduledFor.toLocaleString()}`
    };
  }

  /**
   * Get email delivery status from Resend
   */
  async getEmailStatus(resendEmailId: string): Promise<{
    status: string;
    deliveredAt?: string;
    openedAt?: string;
    clickedAt?: string;
  } | null> {
    try {
      // Note: Resend API doesn't currently provide detailed delivery status
      // This is a placeholder for future implementation
      console.log(`📊 Checking email status for: ${resendEmailId}`);
      
      return {
        status: 'sent'
      };
    } catch (error) {
      console.error('❌ Failed to get email status:', error);
      return null;
    }
  }

  /**
   * Validate email address format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Build email tags for tracking and categorization
   */
  private buildEmailTags(composition: EmailComposition): Array<{ name: string; value: string }> {
    const tags = [];

    // Add category tag
    if (composition.businessContext?.category) {
      tags.push({
        name: 'category',
        value: composition.businessContext.category
      });
    }

    // Add business context tags
    if (composition.businessContext?.payrollId) {
      tags.push({
        name: 'payroll_id',
        value: composition.businessContext.payrollId
      });
    }

    if (composition.businessContext?.clientId) {
      tags.push({
        name: 'client_id',
        value: composition.businessContext.clientId
      });
    }

    if (composition.businessContext?.invoiceId) {
      tags.push({
        name: 'invoice_id',
        value: composition.businessContext.invoiceId
      });
    }

    return tags;
  }

  /**
   * Build custom email headers
   */
  private buildEmailHeaders(
    composition: EmailComposition, 
    senderId: string
  ): Record<string, string> {
    return {
      'X-ByteMy-Sender-Id': senderId,
      'X-ByteMy-Category': composition.businessContext?.category || 'general',
      'X-ByteMy-Template-Id': composition.templateId || 'custom',
      'X-ByteMy-Timestamp': new Date().toISOString()
    };
  }

  /**
   * Process Resend webhook events
   */
  async processWebhookEvent(event: any): Promise<void> {
    try {
      console.log(`📨 Processing Resend webhook event:`, {
        type: event.type,
        emailId: event.data?.email_id
      });

      // Handle different event types
      switch (event.type) {
        case 'email.sent':
          await this.handleEmailSentEvent(event.data);
          break;
        case 'email.delivered':
          await this.handleEmailDeliveredEvent(event.data);
          break;
        case 'email.opened':
          await this.handleEmailOpenedEvent(event.data);
          break;
        case 'email.clicked':
          await this.handleEmailClickedEvent(event.data);
          break;
        case 'email.bounced':
          await this.handleEmailBouncedEvent(event.data);
          break;
        case 'email.complained':
          await this.handleEmailComplainedEvent(event.data);
          break;
        default:
          console.log(`⚠️ Unknown webhook event type: ${event.type}`);
      }
    } catch (error) {
      console.error('❌ Error processing webhook event:', error);
      throw error;
    }
  }

  private async handleEmailSentEvent(data: any): Promise<void> {
    // Update email log status to 'sent'
    console.log(`📤 Email sent: ${data.email_id}`);
  }

  private async handleEmailDeliveredEvent(data: any): Promise<void> {
    // Update email log status to 'delivered'
    console.log(`📬 Email delivered: ${data.email_id}`);
  }

  private async handleEmailOpenedEvent(data: any): Promise<void> {
    // Update email log with open timestamp
    console.log(`👁️ Email opened: ${data.email_id}`);
  }

  private async handleEmailClickedEvent(data: any): Promise<void> {
    // Update email log with click timestamp
    console.log(`🖱️ Email clicked: ${data.email_id}`);
  }

  private async handleEmailBouncedEvent(data: any): Promise<void> {
    // Update email log status to 'bounced'
    console.log(`⚠️ Email bounced: ${data.email_id}`);
  }

  private async handleEmailComplainedEvent(data: any): Promise<void> {
    // Handle spam complaints
    console.log(`🚫 Email complaint: ${data.email_id}`);
  }
}

// Singleton instance
export const resendService = new ResendEmailService();
export default resendService;