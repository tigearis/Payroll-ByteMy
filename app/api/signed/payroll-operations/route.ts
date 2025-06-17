// app/api/signed/payroll-operations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withSignatureValidation, apiKeyManager } from "@/lib/security/api-signing";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";
import { soc2Logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging/soc2-logger";

// GraphQL mutations for payroll operations
const PROCESS_PAYROLL_BATCH = gql`
  mutation ProcessPayrollBatch($payrollIds: [uuid!]!, $processedBy: String!) {
    update_payrolls(
      where: { id: { _in: $payrollIds } }
      _set: {
        status: "Processing"
        processed_at: "now()"
        processed_by: $processedBy
        updated_at: "now()"
      }
    ) {
      affected_rows
      returning {
        id
        name
        status
        processed_at
      }
    }
  }
`;

const APPROVE_PAYROLL_BATCH = gql`
  mutation ApprovePayrollBatch($payrollIds: [uuid!]!, $approvedBy: String!) {
    update_payrolls(
      where: { id: { _in: $payrollIds } }
      _set: {
        status: "Approved"
        approved_at: "now()"
        approved_by: $approvedBy
        updated_at: "now()"
      }
    ) {
      affected_rows
      returning {
        id
        name
        status
        approved_at
        total_amount
      }
    }
  }
`;

const GENERATE_PAYROLL_REPORT = gql`
  query GeneratePayrollReport($startDate: date!, $endDate: date!) {
    payrolls(
      where: {
        _and: [
          { created_at: { _gte: $startDate } }
          { created_at: { _lte: $endDate } }
          { status: { _in: ["Approved", "Completed"] } }
        ]
      }
      order_by: { created_at: desc }
    ) {
      id
      name
      status
      total_amount
      created_at
      approved_at
      processed_at
      client {
        id
        name
      }
      primary_consultant {
        id
        name
        email
      }
    }
  }
`;

// Sensitive payroll operations handler
const handlePayrollOperations = withSignatureValidation(
  async (request: NextRequest, context) => {
    try {
      const body = await request.json();
      const { operation, payload } = body;

      // Log the sensitive operation
      await soc2Logger.log({
        level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
        message: `Signed payroll operation: ${operation}`,
        entityType: "payroll",
        metadata: {
          operation,
          apiKey: context.apiKey,
          payloadSize: JSON.stringify(payload).length,
          timestamp: context.timestamp
        }
      }, request);

      switch (operation) {
        case "process_batch": {
          const { payrollIds, processedBy } = payload;
          
          if (!Array.isArray(payrollIds) || payrollIds.length === 0) {
            return NextResponse.json(
              { error: "Invalid payroll IDs provided" },
              { status: 400 }
            );
          }

          const result = await adminApolloClient.mutate({
            mutation: PROCESS_PAYROLL_BATCH,
            variables: { payrollIds, processedBy }
          });

          return NextResponse.json({
            success: true,
            operation: "process_batch",
            affected_rows: result.data?.update_payrolls?.affected_rows || 0,
            payrolls: result.data?.update_payrolls?.returning || []
          });
        }

        case "approve_batch": {
          const { payrollIds, approvedBy } = payload;
          
          if (!Array.isArray(payrollIds) || payrollIds.length === 0) {
            return NextResponse.json(
              { error: "Invalid payroll IDs provided" },
              { status: 400 }
            );
          }

          const result = await adminApolloClient.mutate({
            mutation: APPROVE_PAYROLL_BATCH,
            variables: { payrollIds, approvedBy }
          });

          return NextResponse.json({
            success: true,
            operation: "approve_batch",
            affected_rows: result.data?.update_payrolls?.affected_rows || 0,
            payrolls: result.data?.update_payrolls?.returning || []
          });
        }

        case "generate_report": {
          const { startDate, endDate } = payload;
          
          if (!startDate || !endDate) {
            return NextResponse.json(
              { error: "Start date and end date are required" },
              { status: 400 }
            );
          }

          const result = await adminApolloClient.query({
            query: GENERATE_PAYROLL_REPORT,
            variables: { startDate, endDate },
            fetchPolicy: "no-cache"
          });

          // Log data access for compliance
          await soc2Logger.log({
            level: LogLevel.INFO,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
            message: "Payroll report generated via signed API",
            entityType: "payroll_report",
            metadata: {
              startDate,
              endDate,
              recordCount: result.data?.payrolls?.length || 0,
              exportFormat: "json",
            }
          }, request);

          return NextResponse.json({
            success: true,
            operation: "generate_report",
            data: result.data?.payrolls || [],
            metadata: {
              startDate,
              endDate,
              recordCount: result.data?.payrolls?.length || 0,
              generatedAt: new Date().toISOString()
            }
          });
        }

        default:
          return NextResponse.json(
            { error: `Unknown operation: ${operation}` },
            { status: 400 }
          );
      }

    } catch (error) {
      console.error("Signed payroll operation error:", error);
      
      await soc2Logger.log({
        level: LogLevel.ERROR,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
        message: "Signed payroll operation failed",
        errorDetails: {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined
        },
        metadata: { apiKey: context.apiKey }
      }, request);

      return NextResponse.json(
        { 
          error: "Operation failed",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      );
    }
  },
  // API secret lookup function
  async (apiKey: string) => {
    return await apiKeyManager.getSecret(apiKey);
  }
);

// Export the signed handler
export const POST = handlePayrollOperations;