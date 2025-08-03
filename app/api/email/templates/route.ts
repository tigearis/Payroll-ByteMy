// Email Templates API Route
// Security Classification: HIGH - Template management operations
// SOC2 Compliance: Template creation and modification audit

import { NextRequest, NextResponse } from "next/server";
import {
  GetEmailTemplatesDocument,
  CreateEmailTemplateDocument,
  GetSystemEmailTemplatesDocument,
  SearchEmailTemplatesDocument,
  type GetEmailTemplatesQuery,
  type CreateEmailTemplateMutation,
  type GetSystemEmailTemplatesQuery,
  type SearchEmailTemplatesQuery
} from "@/domains/email/graphql/generated/graphql";
import { templateService } from "@/domains/email/services/template-service";
import type { EmailCategory, EmailTemplate } from "@/domains/email/types";
import { EMAIL_CATEGORIES } from "@/domains/email/types/template-types";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";
import { getHierarchicalPermissionsFromDatabase, hasHierarchicalPermission } from "@/lib/permissions/hierarchical-permissions";

interface CreateTemplateRequest {
  name: string;
  description?: string;
  category: EmailCategory;
  subjectTemplate: string;
  htmlContent: string;
  textContent?: string;
  availableVariables?: string[];
  isActive?: boolean;
  requiresApproval?: boolean;
}

interface TemplateResponse {
  success: boolean;
  template?: any;
  templates?: any[];
  error?: string;
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

// GET - Fetch email templates
export const GET = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive') !== 'false';
    const systemOnly = searchParams.get('systemOnly') === 'true';
    const search = searchParams.get('search');

    console.log(`📧 Fetching templates for user ${session.userId}:`, {
      category,
      isActive,
      systemOnly,
      search
    });

    // Check permission to read email templates
    try {
      const permissionData = await getHierarchicalPermissionsFromDatabase(session.userId);
      const canReadTemplates = hasHierarchicalPermission(
        permissionData.role,
        'email.read',
        permissionData.excludedPermissions
      );

      if (!canReadTemplates) {
        console.warn(`⚠️ User ${session.userId} attempted to access templates without permission`);
        return NextResponse.json<TemplateResponse>(
          { success: false, error: "Insufficient permissions to access email templates" },
          { status: 403 }
        );
      }
    } catch (permissionError: any) {
      console.error('❌ Error checking template read permissions:', permissionError);
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Unable to verify permissions" },
        { status: 500 }
      );
    }

    let templatesData;

    if (search) {
      // Search templates
      templatesData = await executeTypedQuery<SearchEmailTemplatesQuery>(
        SearchEmailTemplatesDocument,
        {
          searchTerm: `%${search}%`,
          category: category || undefined
        }
      );
    } else if (systemOnly) {
      // System templates only
      templatesData = await executeTypedQuery<GetSystemEmailTemplatesQuery>(
        GetSystemEmailTemplatesDocument,
        {}
      );
    } else {
      // Regular template fetch
      templatesData = await executeTypedQuery<GetEmailTemplatesQuery>(
        GetEmailTemplatesDocument,
        {
          category: category || undefined,
          isActive
        }
      );
    }

    const templates = systemOnly 
      ? templatesData.emailTemplates
      : templatesData.emailTemplates;

    console.log(`✅ Found ${templates.length} templates`);

    return NextResponse.json<TemplateResponse>({
      success: true,
      templates: templates.map(template => ({
        ...template,
        // Add calculated fields
        variableCount: template.availableVariables ? template.availableVariables.length : 0,
        categoryInfo: EMAIL_CATEGORIES[template.category as EmailCategory] || null
      }))
    });

  } catch (error: any) {
    console.error('❌ Error fetching templates:', error);
    return NextResponse.json<TemplateResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// POST - Create new email template
export const POST = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    const body: CreateTemplateRequest = await req.json();
    const {
      name,
      description,
      category,
      subjectTemplate,
      htmlContent,
      textContent,
      availableVariables = [],
      isActive = true,
      requiresApproval = false
    } = body;

    console.log(`📧 Creating template "${name}" for user ${session.userId}`);

    // Check permission to create email templates
    try {
      const permissionData = await getHierarchicalPermissionsFromDatabase(session.userId);
      const canCreateTemplates = hasHierarchicalPermission(
        permissionData.role,
        'email.create',
        permissionData.excludedPermissions
      );

      if (!canCreateTemplates) {
        console.warn(`⚠️ User ${session.userId} attempted to create template without permission`);
        return NextResponse.json<TemplateResponse>(
          { success: false, error: "Insufficient permissions to create email templates" },
          { status: 403 }
        );
      }
    } catch (permissionError: any) {
      console.error('❌ Error checking template creation permissions:', permissionError);
      return NextResponse.json<TemplateResponse>(
        { success: false, error: "Unable to verify permissions" },
        { status: 500 }
      );
    }

    // Validate template data
    const templateValidationData = {
      name,
      category,
      subjectTemplate,
      htmlContent,
      availableVariables,
      ...(description && { description }),
      ...(textContent && { textContent })
    };
    const validation = templateService.validateTemplate(templateValidationData);

    if (!validation.isValid) {
      console.log(`❌ Template validation failed:`, validation.errors);
      return NextResponse.json<TemplateResponse>(
        {
          success: false,
          error: "Template validation failed",
          validation
        },
        { status: 400 }
      );
    }

    // Extract variables from content if not provided
    const extractedVariables = [
      ...templateService.extractVariables(subjectTemplate),
      ...templateService.extractVariables(htmlContent)
    ];

    const finalVariables = availableVariables.length > 0 
      ? availableVariables 
      : extractedVariables;

    // Create template
    const templateData = await executeTypedMutation<CreateEmailTemplateMutation>(
      CreateEmailTemplateDocument,
      {
        input: {
          name,
          description,
          category,
          subjectTemplate,
          htmlContent,
          textContent,
          availableVariables: JSON.stringify(finalVariables),
          isActive,
          isSystemTemplate: false,
          requiresApproval,
          createdByUserId: session.userId
        }
      }
    );

    if (!templateData.insertEmailTemplatesOne) {
      throw new Error('Failed to create template');
    }

    const newTemplate = templateData.insertEmailTemplatesOne;
    console.log(`✅ Template created: ${newTemplate.id}`);

    return NextResponse.json<TemplateResponse>({
      success: true,
      template: {
        ...newTemplate,
        variableCount: finalVariables.length,
        categoryInfo: EMAIL_CATEGORIES[category] || null
      },
      validation
    });

  } catch (error: any) {
    console.error('❌ Error creating template:', error);
    return NextResponse.json<TemplateResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// OPTIONS - Return available template categories and variables
export const OPTIONS = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    const categories = Object.values(EMAIL_CATEGORIES);
    
    // Check actual permissions instead of using hard-coded values
    let canCreate = false;
    let canCreateSystem = false;
    let canApprove = false;
    
    try {
      const permissionData = await getHierarchicalPermissionsFromDatabase(session.userId);
      
      canCreate = hasHierarchicalPermission(
        permissionData.role,
        'email.create',
        permissionData.excludedPermissions
      );
      
      canCreateSystem = hasHierarchicalPermission(
        permissionData.role,
        'email.manage',
        permissionData.excludedPermissions
      );
      
      canApprove = hasHierarchicalPermission(
        permissionData.role,
        'email.manage',
        permissionData.excludedPermissions
      );
    } catch (permissionError) {
      console.warn('Failed to check template permissions for OPTIONS check:', permissionError);
    }
    
    return NextResponse.json({
      success: true,
      categories,
      templateTypes: [
        {
          id: 'custom',
          name: 'Custom Template',
          description: 'Create a custom email template from scratch'
        },
        {
          id: 'system',
          name: 'System Template',
          description: 'Pre-built templates for common scenarios'
        }
      ],
      permissions: {
        canCreate,
        canCreateSystem,
        canApprove
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});