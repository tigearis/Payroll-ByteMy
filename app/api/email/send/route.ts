// Email Send API Route
// Security Classification: HIGH - Email sending operations
// SOC2 Compliance: Email audit logging and delivery tracking

import { NextRequest, NextResponse } from "next/server";
import { resendService } from "@/domains/email";
import { 
  LogEmailSendDocument,
  UpdateEmailSendStatusDocument,
  GetEmailTemplateByIdDocument,
  type LogEmailSendMutation,
  type UpdateEmailSendStatusMutation,
  type GetEmailTemplateByIdQuery
} from "@/domains/email/graphql/generated/graphql";
import { templateService } from "@/domains/email/services/template-service";
import { variableProcessor } from "@/domains/email/services/variable-processor";
import type { EmailComposition, EmailCategory } from "@/domains/email/types";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

interface EmailSendRequest {
  templateId?: string;
  recipientEmails: string[];
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  variableValues?: Record<string, any>;
  businessContext?: {
    category: EmailCategory;
    payrollId?: string;
    clientId?: string;
    invoiceId?: string;
    leaveId?: string;
    assignmentId?: string;
    [key: string]: any;
  };
  scheduledFor?: string;
}

interface EmailSendResponse {
  success: boolean;
  emailId?: string;
  resendId?: string;
  message?: string;
  error?: string;
  logId?: string;
}

export const POST = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    const body: EmailSendRequest = await req.json();
    const {
      templateId,
      recipientEmails,
      subject,
      htmlContent,
      textContent,
      variableValues = {},
      businessContext,
      scheduledFor
    } = body;

    console.log(`📧 Email send request from user ${session.userId}:`, {
      templateId,
      recipientCount: recipientEmails?.length,
      hasSubject: !!subject,
      hasContent: !!htmlContent,
      category: businessContext?.category
    });

    // Validate request
    if (!recipientEmails || recipientEmails.length === 0) {
      return NextResponse.json<EmailSendResponse>(
        { success: false, error: "Recipients are required" },
        { status: 400 }
      );
    }

    if (!subject && !templateId) {
      return NextResponse.json<EmailSendResponse>(
        { success: false, error: "Either subject or templateId is required" },
        { status: 400 }
      );
    }

    let emailComposition: EmailComposition;

    // If using a template, process it
    if (templateId) {
      try {
        // Fetch template
        const templateData = await executeTypedQuery<GetEmailTemplateByIdQuery>(
          GetEmailTemplateByIdDocument,
          { templateId }
        );

        const template = templateData.emailTemplatesByPk;
        if (!template) {
          return NextResponse.json<EmailSendResponse>(
            { success: false, error: "Template not found" },
            { status: 404 }
          );
        }

        console.log(`📧 Using template: ${template.name} (${template.category})`);

        // Process business context variables
        let processedVariables = variableValues;
        if (businessContext && businessContext.category) {
          const contextVariables = await variableProcessor.processBusinessContext({
            category: businessContext.category,
            businessContext,
            userContext: { userId: session.userId }
          });
          processedVariables = { ...contextVariables, ...variableValues };
        }

        // Generate email content from template
        const templatePreview = templateService.processTemplate(
          {
            subjectTemplate: template.subjectTemplate,
            htmlContent: template.htmlContent,
            textContent: template.textContent || ""
          },
          processedVariables,
          template.category as EmailCategory
        );

        emailComposition = {
          recipientEmails,
          subject: subject || templatePreview.subject,
          htmlContent: htmlContent || templatePreview.htmlContent,
          textContent: textContent || templatePreview.textContent || "",
          variableValues: processedVariables,
          ...(templateId && { templateId }),
          ...(businessContext && { businessContext }),
          ...(scheduledFor && { scheduledFor })
        };

      } catch (templateError: any) {
        console.error('❌ Template processing error:', templateError);
        return NextResponse.json<EmailSendResponse>(
          { success: false, error: `Template processing failed: ${templateError.message}` },
          { status: 500 }
        );
      }
    } else {
      // Direct email composition
      if (!htmlContent) {
        return NextResponse.json<EmailSendResponse>(
          { success: false, error: "HTML content is required when not using a template" },
          { status: 400 }
        );
      }

      emailComposition = {
        recipientEmails,
        subject: subject!,
        htmlContent,
        textContent: textContent || "",
        ...(Object.keys(variableValues).length > 0 && { variableValues }),
        ...(businessContext && { businessContext }),
        ...(scheduledFor && { scheduledFor })
      };
    }

    // Create email log entry
    let logId: string;
    try {
      const logResult = await executeTypedMutation<LogEmailSendMutation>(
        LogEmailSendDocument,
        {
          input: {
            templateId: templateId || null,
            recipientEmails,
            senderUserId: session.userId,
            subject: emailComposition.subject,
            htmlContent: emailComposition.htmlContent,
            textContent: emailComposition.textContent,
            businessContext: businessContext || null,
            sendStatus: 'pending',
            scheduledFor: scheduledFor || null
          }
        }
      );

      if (!logResult.insertEmailSendLogsOne) {
        throw new Error('Failed to create email log entry');
      }

      logId = logResult.insertEmailSendLogsOne.id;
      console.log(`📝 Email log created: ${logId}`);

    } catch (logError: any) {
      console.error('❌ Failed to create email log:', logError);
      return NextResponse.json<EmailSendResponse>(
        { success: false, error: `Failed to log email: ${logError.message}` },
        { status: 500 }
      );
    }

    // Handle scheduled emails (future implementation with job queue)
    if (scheduledFor) {
      const scheduledDate = new Date(scheduledFor);
      if (scheduledDate <= new Date()) {
        return NextResponse.json<EmailSendResponse>(
          { success: false, error: "Scheduled time must be in the future" },
          { status: 400 }
        );
      }

      // For now, just return success for scheduled emails
      console.log(`📅 Email scheduled for ${scheduledDate.toISOString()}`);
      return NextResponse.json<EmailSendResponse>({
        success: true,
        message: `Email scheduled for ${scheduledDate.toLocaleString()}`,
        logId
      });
    }

    // Send email via Resend
    try {
      const sendResult = await resendService.sendEmail(emailComposition, session.userId);
      
      // Update email log with send result
      await executeTypedMutation<UpdateEmailSendStatusMutation>(
        UpdateEmailSendStatusDocument,
        {
          logId,
          status: sendResult.success ? 'sent' : 'failed',
          resendResponse: sendResult.resendId ? { resendId: sendResult.resendId } : null,
          errorMessage: sendResult.error || null,
          sentAt: sendResult.success ? new Date().toISOString() : null
        }
      );

      if (sendResult.success) {
        console.log(`✅ Email sent successfully: ${sendResult.resendId}`);
        return NextResponse.json<EmailSendResponse>({
          success: true,
          emailId: sendResult.emailId || "",
          resendId: sendResult.resendId || "",
          message: sendResult.message || "",
          logId
        });
      } else {
        console.error(`❌ Email send failed: ${sendResult.error}`);
        return NextResponse.json<EmailSendResponse>(
          {
            success: false,
            error: sendResult.error || "Unknown error",
            logId
          },
          { status: 500 }
        );
      }

    } catch (sendError: any) {
      console.error('❌ Email send error:', sendError);
      
      // Update log with error
      try {
        await executeTypedMutation<UpdateEmailSendStatusMutation>(
          UpdateEmailSendStatusDocument,
          {
            logId,
            status: 'failed',
            errorMessage: sendError.message
          }
        );
      } catch (updateError) {
        console.error('❌ Failed to update email log with error:', updateError);
      }

      return NextResponse.json<EmailSendResponse>(
        {
          success: false,
          error: sendError.message || "Failed to send email",
          logId
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ Email API error:', error);
    return NextResponse.json<EmailSendResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
});

// GET endpoint to check email sending capabilities
export const GET = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    return NextResponse.json({
      success: true,
      capabilities: {
        templateSupport: true,
        scheduledSending: true,
        bulkSending: false, // Not implemented yet
        variableProcessing: true,
        businessContexts: ['payroll', 'billing', 'client', 'leave', 'work_schedule', 'system']
      },
      user: {
        id: session.userId,
        canSendEmails: true // TODO: Add permission check
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});