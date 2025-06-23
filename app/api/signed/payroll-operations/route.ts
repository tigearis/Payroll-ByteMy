// app/api/signed/payroll-operations/route.ts
import { NextRequest, NextResponse } from "next/server";

import { adminApolloClient } from "@/lib/apollo/unified-client";
import {
  ProcessPayrollBatchDocument,
  ApprovePayrollBatchDocument,
  GeneratePayrollReportDocument
} from "@/domains/payrolls/graphql/generated/graphql";
import {
  withSignatureValidation,
  apiKeyManager,
} from "@/lib/security/api-signing";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// Sensitive payroll operations handler
const handlePayrollOperations = withSignatureValidation(
  async (request: NextRequest, context) => {
    try {
      const body = await request.json();
      const { operation, payload } = body;

      // Log the sensitive operation
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        resourceType: "payroll",
        action: operation.toUpperCase(),
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: {
          operation,
          apiKey: context.apiKey,
          payloadSize: JSON.stringify(payload).length,
          timestamp: context.timestamp,
        },
        complianceNote: `Signed payroll operation: ${operation}`,
      });

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
            mutation: ProcessPayrollBatchDocument,
            variables: { payrollIds, processedBy },
          });

          return NextResponse.json({
            success: true,
            operation: "process_batch",
            affected_rows: result.data?.updatePayrolls?.affected_rows || 0,
            payrolls: result.data?.updatePayrolls?.returning || [],
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
            mutation: ApprovePayrollBatchDocument,
            variables: { payrollIds, approvedBy },
          });

          return NextResponse.json({
            success: true,
            operation: "approve_batch",
            affected_rows: result.data?.updatePayrolls?.affected_rows || 0,
            payrolls: result.data?.updatePayrolls?.returning || [],
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
            query: GeneratePayrollReportDocument,
            variables: { startDate, endDate },
            fetchPolicy: "no-cache",
          });

          // Log data access for compliance
          const clientInfo = auditLogger.extractClientInfo(request);
          await auditLogger.logSOC2Event({
            level: LogLevel.INFO,
            category: LogCategory.SYSTEM_ACCESS,
            eventType: SOC2EventType.SENSITIVE_DATA_EXPORT,
            resourceType: "payroll_report",
            action: "GENERATE",
            success: true,
            ipAddress: clientInfo.ipAddress || "unknown",
            userAgent: clientInfo.userAgent || "unknown",
            metadata: {
              startDate,
              endDate,
              recordCount: result.data?.payrolls?.length || 0,
              exportFormat: "json",
            },
            complianceNote: "Payroll report generated via signed API",
          });

          return NextResponse.json({
            success: true,
            operation: "generate_report",
            data: result.data?.payrolls || [],
            metadata: {
              startDate,
              endDate,
              recordCount: result.data?.payrolls?.length || 0,
              generatedAt: new Date().toISOString(),
            },
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

      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        resourceType: "payroll",
        action: "OPERATION",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: { apiKey: context.apiKey },
        complianceNote: "Signed payroll operation failed",
      });

      return NextResponse.json(
        {
          error: "Operation failed",
          details: error instanceof Error ? error.message : "Unknown error",
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
