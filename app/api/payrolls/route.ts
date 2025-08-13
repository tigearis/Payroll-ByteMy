/**
 * Payrolls API Route - SECURED WITH COMPREHENSIVE PROTECTION
 *
 * This route demonstrates the new secure API wrapper with:
 * - Authentication & authorization
 * - Input validation with Zod schemas
 * - Rate limiting
 * - Standardized error handling
 * - Complete audit logging
 * - Security headers
 */

import { NextResponse } from "next/server";
import {
  GetPayrollsDocument,
  type GetPayrollsQuery,
} from "@/domains/payrolls/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { createSuccessResponse } from "@/lib/error-handling/standardized-errors";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import {
  sensitiveRoute,
  mutationRoute,
} from "@/lib/security/secure-api-wrapper";
import { CreatePayrollSchema } from "@/lib/validation/schemas";

// ============================================================================
// GET /api/payrolls - List payrolls with pagination
// ============================================================================

export const GET = sensitiveRoute(
  "payrolls",
  "read"
)(async (request, context, secureContext) => {
  try {
    // Validate query parameters
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 20;
    const offset = Number(url.searchParams.get("offset")) || 0;

    // Execute authenticated GraphQL query with full type safety
    const data = await executeTypedQuery<GetPayrollsQuery>(
      GetPayrollsDocument,
      {
        limit: Math.min(limit, 100), // Enforce max limit
        offset: Math.max(offset, 0), // Ensure non-negative offset
      }
    );

    logger.info("Payrolls fetched successfully", {
      namespace: "payrolls_api",
      operation: "list_payrolls",
      classification: DataClassification.CONFIDENTIAL,
      ...(secureContext.auth?.userId && { userId: secureContext.auth.userId }),
      ...(secureContext.metadata?.requestId && {
        requestId: secureContext.metadata.requestId,
      }),
      metadata: {
        userRole: secureContext.auth?.role,
        payrollCount: data.payrolls?.length,
        timestamp: new Date().toISOString(),
      },
    });

    return createSuccessResponse(
      {
        payrolls: data.payrolls,
        pagination: {
          limit,
          offset,
          total: data.payrollsAggregate?.aggregate?.count || 0,
        },
      },
      "Payrolls fetched successfully"
    );
  } catch (error) {
    logger.error("Payroll fetch operation failed", {
      namespace: "payrolls_api",
      operation: "list_payrolls",
      classification: DataClassification.CONFIDENTIAL,
      ...(secureContext.auth?.userId && { userId: secureContext.auth.userId }),
      ...(secureContext.metadata?.requestId && {
        requestId: secureContext.metadata.requestId,
      }),
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString(),
      },
    });

    // Error handling is managed by the secure wrapper
    throw error;
  }
});

// ============================================================================
// POST /api/payrolls - Create new payroll
// ============================================================================

export const POST = mutationRoute(
  "payrolls",
  "create"
)(async (request, context, secureContext) => {
  try {
    // Get validated request body from secure context
    const body = await request.json();

    // Validate input with Zod schema
    const validation = CreatePayrollSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Invalid payroll data",
          code: "VALIDATION_FAILED",
          details: {
            errors: validation.error.errors.map(err => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Business logic validation
    if (validatedData.employeeCount > 1000) {
      return NextResponse.json(
        {
          error: "Business Rule Violation",
          message: "Employee count exceeds maximum limit",
          code: "EMPLOYEE_COUNT_EXCEEDED",
          details: { limit: 1000, provided: validatedData.employeeCount },
          timestamp: new Date().toISOString(),
        },
        { status: 422 }
      );
    }

    // Implement actual payroll creation with GraphQL mutation
    const { adminApolloClient } = await import("@/lib/apollo/unified-client");
    const { CreatePayrollDocument } = await import(
      "@/domains/payrolls/graphql/generated/graphql"
    );
    const { data: createData } = await adminApolloClient.mutate({
      mutation: CreatePayrollDocument as any,
      variables: {
        object: {
          name: validatedData.name,
          clientId: validatedData.clientId,
          status: validatedData.status,
          employeeCount: validatedData.employeeCount ?? null,
          cycleId: validatedData.payrollCycleId,
          dateTypeId: validatedData.payrollDateTypeId,
          dateValue: validatedData.dateValue ?? null,
        },
      },
    });

    const created = createData?.insertPayrollsOne;
    if (!created?.id) {
      return NextResponse.json(
        { error: "Failed to create payroll" },
        { status: 500 }
      );
    }
    logger.info("Payroll created successfully", {
      namespace: "payrolls_api",
      operation: "create_payroll",
      classification: DataClassification.CONFIDENTIAL,
      ...(secureContext.auth?.userId && { userId: secureContext.auth.userId }),
      ...(secureContext.metadata?.requestId && {
        requestId: secureContext.metadata.requestId,
      }),
      metadata: {
        userRole: secureContext.auth?.role,
        payrollName: validatedData.name,
        clientId: validatedData.clientId,
        timestamp: new Date().toISOString(),
      },
    });

    return createSuccessResponse(created, "Payroll created successfully", 201);
  } catch (error) {
    logger.error("Payroll creation failed", {
      namespace: "payrolls_api",
      operation: "create_payroll",
      classification: DataClassification.CONFIDENTIAL,
      ...(secureContext.auth?.userId && { userId: secureContext.auth.userId }),
      ...(secureContext.metadata?.requestId && {
        requestId: secureContext.metadata.requestId,
      }),
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString(),
      },
    });

    // Error handling is managed by the secure wrapper
    throw error;
  }
});
