import { NextRequest, NextResponse } from "next/server";
import { ReportAuditService } from "@/domains/reports/services/audit.service";
import { ReportTemplateSchema } from "@/domains/reports/types/report.types";
import { withAuth } from "@/lib/auth/api-auth";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import {
  CustomQueryTemplatesInsertInput,
  CustomQueryTemplatesBoolExp,
} from "@/domains/reports/graphql/generated/graphql";
import { gql } from "@apollo/client";

const auditService = new ReportAuditService();

export const GET = withAuth(
  async (request: NextRequest, session): Promise<NextResponse> => {
    try {
      // Check if user has report template access permissions
      const userRole = session.role || session.defaultRole || "viewer";

      const hasReportAccess =
        userRole && ["developer", "org_admin", "manager"].includes(userRole);

      if (!hasReportAccess) {
        return NextResponse.json(
          {
            error: `Insufficient permissions for report templates. Current role: ${userRole}`,
          },
          { status: 403 }
        );
      }

      // 2. Parse query parameters
      const { searchParams } = new URL(request.url);
      const isPublic = searchParams.get("isPublic") === "true";
      const tags = searchParams.get("tags")?.split(",").filter(Boolean);

      // Fetch templates from Hasura (custom_query_templates)
      const where: CustomQueryTemplatesBoolExp = {};
      if (isPublic) (where as any).isPublic = { _eq: true };
      if (tags?.length) (where as any).tags = { _hasKeysAny: tags } as any;

      const { data } = await adminApolloClient.query({
        query: gql`
          query GetTemplates($where: custom_query_templates_bool_exp) {
            customQueryTemplates(where: $where, orderBy: { updatedAt: DESC }) {
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
        variables: { where },
        fetchPolicy: "no-cache",
      });

      return NextResponse.json(data.customQueryTemplates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
);

export const POST = withAuth(
  async (request: NextRequest, session): Promise<NextResponse> => {
    try {
      // Check if user has report template creation permissions
      const userRole = session.role || session.defaultRole || "viewer";

      const hasReportAccess =
        userRole && ["developer", "org_admin", "manager"].includes(userRole);

      if (!hasReportAccess) {
        return NextResponse.json(
          {
            error: `Insufficient permissions to create report templates. Current role: ${userRole}`,
          },
          { status: 403 }
        );
      }

      // Validate request body
      const body = await request.json();
      const validatedTemplate = ReportTemplateSchema.parse({
        ...body,
        createdBy: session.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save template to Hasura
      const insert: CustomQueryTemplatesInsertInput = {
        name: validatedTemplate.name,
        description: (validatedTemplate as any).description,
        query: validatedTemplate.query,
        variables: validatedTemplate.variables as any,
        isPublic: !!validatedTemplate.isPublic,
        tags: (validatedTemplate as any).tags as any,
        createdBy: session.userId,
      };

      const { data } = await adminApolloClient.mutate({
        mutation: gql`
          mutation InsertTemplate(
            $object: custom_query_templates_insert_input!
          ) {
            insertCustomQueryTemplatesOne(object: $object) {
              id
              name
              description
              query
              variables
              isPublic
              tags
              createdBy
              createdAt
              updatedAt
            }
          }
        `,
        variables: { object: insert },
      });

      const savedTemplate = data?.insertCustomQueryTemplatesOne;

      // Log audit event
      await auditService.logTemplateAction(
        session.userId,
        "CREATE",
        savedTemplate.id,
        savedTemplate
      );

      return NextResponse.json(savedTemplate);
    } catch (error) {
      console.error("Error creating template:", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
);
