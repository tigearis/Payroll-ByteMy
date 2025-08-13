import { NextRequest, NextResponse } from "next/server";
import { ReportAuditService } from "@/domains/reports/services/audit.service";
import { ReportCacheService } from "@/domains/reports/services/cache.service";
import { ReportQueueService } from "@/domains/reports/services/queue.service";
import { ReportConfigSchema } from "@/domains/reports/types/report.types";
import {
  GetUserWithRolesDocument,
  type GetUserWithRolesQuery,
  type GetUserWithRolesQueryVariables,
} from "@/domains/users/graphql/generated/graphql";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuth } from "@/lib/auth/api-auth";
import { getHierarchicalPermissionsFromDatabase } from "@/lib/permissions/hierarchical-permissions";

const queueService = new ReportQueueService();
const cacheService = new ReportCacheService();
const auditService = new ReportAuditService();

export const POST = withAuth(async (request: NextRequest, session) => {
  try {
    console.log("🔍 Getting user and permissions for Clerk user:", session.userId);
    
    // Get user and role assignments in a single query using Clerk user ID
    const { data: userData } = await adminApolloClient.query<
      GetUserWithRolesQuery,
      GetUserWithRolesQueryVariables
    >({
      query: GetUserWithRolesDocument,
      variables: { clerkUserId: session.userId },
      fetchPolicy: "network-only",
    });

    const user = userData?.users?.[0];
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Determine the highest priority role (lowest priority number = highest role)
    const roleAssignments = user.roleAssignments || [];
    const highestRole = roleAssignments.length > 0 
      ? roleAssignments.reduce((highest: any, current: any) => 
          current.role.priority < highest.role.priority ? current : highest
        ).role.name
      : user.role; // Fallback to user.role if no assignments

    console.log("📋 User role determined:", {
      userId: user.id,
      email: user.email,
      userRole: user.role,
      roleAssignments: roleAssignments.map((ra: any) => `${ra.role.name}(${ra.role.priority})`),
      finalRole: highestRole
    });
    
    // Check if user has report generation permissions
    const hasReportAccess = highestRole && ["developer", "org_admin", "manager", "consultant"].includes(highestRole);

    if (!hasReportAccess) {
      return NextResponse.json(
        { 
          error: `Insufficient permissions to generate reports. Current role: ${highestRole}`,
          debug: { 
            finalRole: highestRole,
            userRole: user.role,
            roleAssignments: roleAssignments.map((ra: any) => ra.role.name),
            sessionUserId: session.userId,
            databaseUserId: user.id,
            userEmail: user.email
          }
        },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedConfig = ReportConfigSchema.parse(body);

    // Check cache
    const cachedReport = await cacheService.getCachedReport(validatedConfig);
    if (cachedReport) {
      await auditService.logReportGeneration(session.userId, validatedConfig);
      return NextResponse.json({
        id: "cached",
        config: validatedConfig,
        status: "completed",
        result: cachedReport,
        userId: session.userId,
        completedAt: new Date(),
      });
    }

    // Create and queue job
    const job = await queueService.enqueueJob(validatedConfig, session.userId);

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
