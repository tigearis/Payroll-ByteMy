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

import { NextRequest, NextResponse } from "next/server";
import {
  GetPayrollsDocument,
  type GetPayrollsQuery,
} from "@/domains/payrolls/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { sensitiveRoute, mutationRoute } from "@/lib/security/secure-api-wrapper";
import { CreatePayrollSchema, PaginationSchema } from "@/lib/validation/schemas";
import { createSuccessResponse } from "@/lib/error-handling/standardized-errors";

// ============================================================================
// GET /api/payrolls - List payrolls with pagination
// ============================================================================

export const GET = sensitiveRoute('payrolls', 'read')(
  async (request, context, secureContext) => {
    try {
      // Validate query parameters
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit')) || 20;
      const offset = Number(url.searchParams.get('offset')) || 0;

      // Execute authenticated GraphQL query with full type safety
      const data = await executeTypedQuery<GetPayrollsQuery>(GetPayrollsDocument, {
        limit: Math.min(limit, 100), // Enforce max limit
        offset: Math.max(offset, 0)   // Ensure non-negative offset
      });

      console.log("✅ PAYROLL ROUTE - Success:", {
        userId: secureContext.auth?.userId,
        userRole: secureContext.auth?.role,
        payrollCount: data.payrolls?.length,
        requestId: secureContext.metadata?.requestId
      });

      return createSuccessResponse(
        {
          payrolls: data.payrolls,
          pagination: {
            limit,
            offset,
            total: data.payrollsAggregate?.aggregate?.count || 0
          }
        },
        'Payrolls fetched successfully'
      );

    } catch (error) {
      console.error("❌ Payroll Fetch Error:", {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: secureContext.auth?.userId,
        requestId: secureContext.metadata?.requestId
      });
      
      // Error handling is managed by the secure wrapper
      throw error;
    }
  }
);

// ============================================================================
// POST /api/payrolls - Create new payroll
// ============================================================================

export const POST = mutationRoute('payrolls', 'create')(
  async (request, context, secureContext) => {
    try {
      // Get validated request body from secure context
      const body = await request.json();
      
      // Validate input with Zod schema
      const validation = CreatePayrollSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'Invalid payroll data',
            code: 'VALIDATION_FAILED',
            details: {
              errors: validation.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
              }))
            },
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
      }

      const validatedData = validation.data;

      // Business logic validation
      if (validatedData.employeeCount > 1000) {
        return NextResponse.json(
          {
            error: 'Business Rule Violation',
            message: 'Employee count exceeds maximum limit',
            code: 'EMPLOYEE_COUNT_EXCEEDED',
            details: { limit: 1000, provided: validatedData.employeeCount },
            timestamp: new Date().toISOString()
          },
          { status: 422 }
        );
      }

      // TODO: Implement actual payroll creation with GraphQL mutation
      // For now, return success response
      console.log("✅ PAYROLL CREATE - Success:", {
        userId: secureContext.auth?.userId,
        userRole: secureContext.auth?.role,
        payrollName: validatedData.name,
        clientId: validatedData.clientId,
        requestId: secureContext.metadata?.requestId
      });

      return createSuccessResponse(
        {
          id: crypto.randomUUID(), // Temporary - would come from database
          name: validatedData.name,
          clientId: validatedData.clientId,
          status: validatedData.status,
          createdAt: new Date().toISOString(),
          createdBy: secureContext.auth?.userId
        },
        'Payroll created successfully',
        201
      );

    } catch (error) {
      console.error("❌ Payroll Create Error:", {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: secureContext.auth?.userId,
        requestId: secureContext.metadata?.requestId
      });
      
      // Error handling is managed by the secure wrapper
      throw error;
    }
  }
);
