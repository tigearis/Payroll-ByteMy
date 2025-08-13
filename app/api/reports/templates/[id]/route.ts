import { NextRequest, NextResponse } from "next/server";
import { ReportAuditService } from "@/domains/reports/services/audit.service";
import { ReportTemplateSchema } from "@/domains/reports/types/report.types";
import { withAuthParams } from "@/lib/auth/api-auth";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { gql } from "@apollo/client";

const auditService = new ReportAuditService();

export const GET = withAuthParams(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
    session
  ): Promise<NextResponse> => {
    try {
      const params = await context.params;

      // Check if user has report template access permissions
      const userRole = session.role || session.defaultRole || "viewer";

      const hasReportAccess =
        userRole &&
        ["developer", "org_admin", "manager", "consultant"].includes(userRole);

      if (!hasReportAccess) {
        return NextResponse.json(
          {
            error: `Insufficient permissions for report templates. Current role: ${userRole}`,
          },
          { status: 403 }
        );
      }

      // Fetch template from Hasura
      const { data } = await adminApolloClient.query({
        query: gql`
          query GetTemplate($id: uuid!) {
            customQueryTemplatesByPk(id: $id) {
              id
              name
              description
              query
              variables
              isPublic
              tags
              createdAt
              updatedAt
              createdBy
            }
          }
        `,
        variables: { id: params.id },
        fetchPolicy: "no-cache",
      });
      const template = data?.customQueryTemplatesByPk;

      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      // Check access
      if (!template.isPublic && template.createdBy !== session.userId) {
        return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
        );
      }

      return NextResponse.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
);

export const PATCH = withAuthParams(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
    session
  ): Promise<NextResponse> => {
    try {
      const params = await context.params;

      // Check permissions
      const userRole = session.role || session.defaultRole || "viewer";

      const hasUpdateAccess =
        userRole && ["developer", "org_admin", "manager"].includes(userRole);

      if (!hasUpdateAccess) {
        return NextResponse.json(
          {
            error: `Insufficient permissions to update report templates. Current role: ${userRole}`,
          },
          { status: 403 }
        );
      }

      // Fetch existing template
      const { data: existingData } = await adminApolloClient.query({
        query: gql`
          query GetTemplate($id: uuid!) {
            customQueryTemplatesByPk(id: $id) {
              id
              createdBy
            }
          }
        `,
        variables: { id: params.id },
        fetchPolicy: "no-cache",
      });
      const existingTemplate = existingData?.customQueryTemplatesByPk;

      if (!existingTemplate) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      // Check ownership
      if (existingTemplate.createdBy !== session.userId) {
        return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
        );
      }

      // Validate and update template
      const body = await request.json();
      const validatedUpdates = ReportTemplateSchema.partial().parse({
        ...body,
        updatedAt: new Date(),
      });

      // Update template
      const { data: updatedData } = await adminApolloClient.mutate({
        mutation: gql`
          mutation UpdateTemplate(
            $id: uuid!
            $set: custom_query_templates_set_input!
          ) {
            updateCustomQueryTemplatesByPk(pkColumns: { id: $id }, _set: $set) {
              id
              name
              description
              query
              variables
              isPublic
              tags
              updatedAt
            }
          }
        `,
        variables: { id: params.id, set: validatedUpdates },
      });
      const updatedTemplate = updatedData?.updateCustomQueryTemplatesByPk;

      // Log audit event
      await auditService.logTemplateAction(
        session.userId,
        "UPDATE",
        params.id,
        updatedTemplate
      );

      return NextResponse.json(updatedTemplate);
    } catch (error) {
      console.error("Error updating template:", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
);

export const DELETE = withAuthParams(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
    session
  ): Promise<NextResponse> => {
    try {
      const params = await context.params;

      // Check permissions
      const userRole = session.role || session.defaultRole || "viewer";

      const hasDeleteAccess =
        userRole && ["developer", "org_admin", "manager"].includes(userRole);

      if (!hasDeleteAccess) {
        return NextResponse.json(
          {
            error: `Insufficient permissions to delete report templates. Current role: ${userRole}`,
          },
          { status: 403 }
        );
      }

      // Fetch template
      const { data } = await adminApolloClient.query({
        query: gql`
          query GetTemplate($id: uuid!) {
            customQueryTemplatesByPk(id: $id) {
              id
              createdBy
            }
          }
        `,
        variables: { id: params.id },
        fetchPolicy: "no-cache",
      });
      const template = data?.customQueryTemplatesByPk;

      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      // Check ownership
      if (template.createdBy !== session.userId) {
        return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
        );
      }

      // Delete template
      await adminApolloClient.mutate({
        mutation: gql`
          mutation DeleteTemplate($id: uuid!) {
            deleteCustomQueryTemplatesByPk(id: $id) {
              id
            }
          }
        `,
        variables: { id: params.id },
      });

      // Log audit event
      await auditService.logTemplateAction(session.userId, "DELETE", params.id);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
);
