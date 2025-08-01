// Individual Email Template API Route
// Security Classification: HIGH - Template management operations
// SOC2 Compliance: Template modification and deletion audit

import { NextRequest, NextResponse } from "next/server";
import {
  GetEmailTemplateByIdDocument,
  UpdateEmailTemplateDocument,
  DeleteEmailTemplateDocument,
  DuplicateEmailTemplateDocument,
  ApproveEmailTemplateDocument,
  ToggleEmailTemplateStatusDocument,
  type GetEmailTemplateByIdQuery,
  type UpdateEmailTemplateMutation,
  type DeleteEmailTemplateMutation,
  type DuplicateEmailTemplateMutation,
  type ApproveEmailTemplateMutation,
  type ToggleEmailTemplateStatusMutation
} from "@/domains/email/graphql/generated/graphql";
import { templateService } from "@/domains/email/services/template-service";
import type { EmailCategory } from "@/domains/email/types";
import { EMAIL_CATEGORIES, SAMPLE_PREVIEW_DATA } from "@/domains/email/types/template-types";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  category?: EmailCategory;
  subjectTemplate?: string;
  htmlContent?: string;
  textContent?: string;
  availableVariables?: string[];
  isActive?: boolean;
  requiresApproval?: boolean;
}

interface TemplateActionRequest {
  action: 'duplicate' | 'approve' | 'toggle' | 'preview';
  newName?: string; // For duplicate
  previewData?: Record<string, any>; // For preview
}

interface TemplateResponse {
  success: boolean;
  template?: any;
  preview?: {
    subject: string;
    htmlContent: string;
    textContent?: string;
  };
  error?: string;
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

// GET - Fetch individual template
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    
    console.log(`📧 Fetching template ${id} for user ${session.userId}`);

    const templateData = await executeTypedQuery<GetEmailTemplateByIdQuery>(
      GetEmailTemplateByIdDocument,
      { templateId: id }
    );

    const template = templateData.emailTemplatesByPk;
    if (!template) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    // Check permissions - users can only see their own templates or system templates
    const userRole = req.headers.get('x-user-role') || 'viewer';
    if (!template.isSystemTemplate && 
        template.createdByUserId !== session.userId && 
        !['org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    console.log(`✅ Template fetched: ${template.name}`);

    return NextResponse.json<TemplateResponse>({
      success: true,
      template: {
        ...template,
        categoryInfo: EMAIL_CATEGORIES[template.category as EmailCategory] || null,
        suggestedVariables: templateService.getSuggestedVariables(template.category as EmailCategory),
        extractedVariables: [
          ...templateService.extractVariables(template.subjectTemplate),
          ...templateService.extractVariables(template.htmlContent)
        ]
      }
    });

  } catch (error: any) {
    console.error('❌ Error fetching template:', error);
    return NextResponse.json<TemplateResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// PUT - Update template
export const PUT = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    const body: UpdateTemplateRequest = await req.json();

    console.log(`📧 Updating template ${id} for user ${session.userId}`);

    // First, fetch the existing template to check permissions
    const existingData = await executeTypedQuery<GetEmailTemplateByIdQuery>(
      GetEmailTemplateByIdDocument,
      { templateId: id }
    );

    const existingTemplate = existingData.emailTemplatesByPk;
    if (!existingTemplate) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const userRole = req.headers.get('x-user-role') || 'viewer';
    if (existingTemplate.isSystemTemplate && !['org_admin'].includes(userRole)) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Cannot modify system templates" },
        { status: 403 }
      );
    }

    if (!existingTemplate.isSystemTemplate && 
        existingTemplate.createdByUserId !== session.userId && 
        !['org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Validate template data if content fields are being updated
    let validation;
    if (body.name || body.subjectTemplate || body.htmlContent) {
      validation = templateService.validateTemplate({
        name: body.name || existingTemplate.name,
        subjectTemplate: body.subjectTemplate || existingTemplate.subjectTemplate,
        htmlContent: body.htmlContent || existingTemplate.htmlContent,
        category: body.category || (existingTemplate.category as EmailCategory)
      });

      if (!validation.isValid) {
        return NextResponse.json<TemplateResponse>(
          {
            success: false,
            error: "Template validation failed",
            validation
          },
          { status: 400 }
        );
      }
    }

    // Update available variables if content changed
    let finalVariables = body.availableVariables;
    if (body.subjectTemplate || body.htmlContent) {
      const extractedVariables = [
        ...templateService.extractVariables(body.subjectTemplate || existingTemplate.subjectTemplate),
        ...templateService.extractVariables(body.htmlContent || existingTemplate.htmlContent)
      ];
      finalVariables = finalVariables || extractedVariables;
    }

    // Update template
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.subjectTemplate !== undefined) updateData.subjectTemplate = body.subjectTemplate;
    if (body.htmlContent !== undefined) updateData.htmlContent = body.htmlContent;
    if (body.textContent !== undefined) updateData.textContent = body.textContent;
    if (finalVariables !== undefined) updateData.availableVariables = JSON.stringify(finalVariables);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.requiresApproval !== undefined) updateData.requiresApproval = body.requiresApproval;

    const templateData = await executeTypedMutation<UpdateEmailTemplateMutation>(
      UpdateEmailTemplateDocument,
      {
        templateId: id,
        updates: updateData
      }
    );

    if (!templateData.updateEmailTemplatesByPk) {
      throw new Error('Failed to update template');
    }

    const updatedTemplate = templateData.updateEmailTemplatesByPk;
    console.log(`✅ Template updated: ${updatedTemplate.name}`);

    return NextResponse.json<TemplateResponse>({
      success: true,
      template: {
        ...updatedTemplate,
        categoryInfo: EMAIL_CATEGORIES[updatedTemplate.category as EmailCategory] || null
      },
      ...(validation && { validation })
    });

  } catch (error: any) {
    console.error('❌ Error updating template:', error);
    return NextResponse.json<TemplateResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// DELETE - Delete template
export const DELETE = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;

    console.log(`📧 Deleting template ${id} for user ${session.userId}`);

    // Check permissions and template existence
    const existingData = await executeTypedQuery<GetEmailTemplateByIdQuery>(
      GetEmailTemplateByIdDocument,
      { templateId: id }
    );

    const existingTemplate = existingData.emailTemplatesByPk;
    if (!existingTemplate) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    if (existingTemplate.isSystemTemplate) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Cannot delete system templates" },
        { status: 403 }
      );
    }

    const userRole = req.headers.get('x-user-role') || 'viewer';
    if (existingTemplate.createdByUserId !== session.userId && 
        !['org_admin'].includes(userRole)) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Delete template
    const deleteData = await executeTypedMutation<DeleteEmailTemplateMutation>(
      DeleteEmailTemplateDocument,
      { templateId: id }
    );

    if (!deleteData.deleteEmailTemplatesByPk) {
      throw new Error('Failed to delete template');
    }

    console.log(`✅ Template deleted: ${deleteData.deleteEmailTemplatesByPk.name}`);

    return NextResponse.json<TemplateResponse>({
      success: true,
      template: deleteData.deleteEmailTemplatesByPk
    });

  } catch (error: any) {
    console.error('❌ Error deleting template:', error);
    return NextResponse.json<TemplateResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// POST - Template actions (duplicate, approve, preview, etc.)
export const POST = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    const body: TemplateActionRequest = await req.json();
    const { action } = body;

    console.log(`📧 Template action "${action}" on ${id} for user ${session.userId}`);

    // Fetch template first
    const templateData = await executeTypedQuery<GetEmailTemplateByIdQuery>(
      GetEmailTemplateByIdDocument,
      { templateId: id }
    );

    const template = templateData.emailTemplatesByPk;
    if (!template) {
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    switch (action) {
      case 'duplicate':
        if (!body.newName) {
          return NextResponse.json<TemplateResponse>(
            { success: false, error: "New name required for duplication" },
            { status: 400 }
          );
        }

        const duplicateResult = await executeTypedMutation<DuplicateEmailTemplateMutation>(
          DuplicateEmailTemplateDocument,
          {
            sourceTemplateId: id,
            newName: body.newName,
            userId: session.userId
          }
        );

        return NextResponse.json<TemplateResponse>({
          success: true,
          template: duplicateResult.insertEmailTemplatesOne
        });

      case 'approve':
        const userRole = req.headers.get('x-user-role') || 'viewer';
        if (!['org_admin', 'manager'].includes(userRole)) {
          return NextResponse.json<TemplateResponse>(
            { success: false, error: "Insufficient permissions to approve templates" },
            { status: 403 }
          );
        }

        const approveResult = await executeTypedMutation<ApproveEmailTemplateMutation>(
          ApproveEmailTemplateDocument,
          {
            templateId: id,
            approverId: session.userId
          }
        );

        return NextResponse.json<TemplateResponse>({
          success: true,
          template: approveResult.updateEmailTemplatesByPk
        });

      case 'toggle':
        const toggleResult = await executeTypedMutation<ToggleEmailTemplateStatusMutation>(
          ToggleEmailTemplateStatusDocument,
          {
            templateId: id,
            isActive: !template.isActive
          }
        );

        return NextResponse.json<TemplateResponse>({
          success: true,
          template: toggleResult.updateEmailTemplatesByPk
        });

      case 'preview':
        const previewData = body.previewData || 
          SAMPLE_PREVIEW_DATA[template.category as EmailCategory] || {};

        const templateData = {
          subjectTemplate: template.subjectTemplate,
          htmlContent: template.htmlContent,
          ...(template.textContent && { textContent: template.textContent })
        };

        const preview = templateService.processTemplate(
          templateData,
          previewData,
          template.category as EmailCategory
        );

        return NextResponse.json<TemplateResponse>({
          success: true,
          preview
        });

      default:
        return NextResponse.json<TemplateResponse>(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('❌ Error performing template action:', error);
    return NextResponse.json<TemplateResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});