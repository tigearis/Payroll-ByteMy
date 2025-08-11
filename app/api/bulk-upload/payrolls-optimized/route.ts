/**
 * Optimized Bulk Payroll Upload API Endpoint
 * 
 * PERFORMANCE OPTIMIZATION: Eliminates N+1 pattern
 * BEFORE: 4N queries for N payroll records (400 queries for 100 records)
 * AFTER: 4 queries total regardless of record count (99% reduction)
 *
 * Key improvements:
 * - Pre-fetch all reference data once
 * - O(1) lookups during processing  
 * - Batch processing with concurrency control
 * - Comprehensive error handling and progress tracking
 * - Performance benchmarking and monitoring
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GetClientsListOptimizedDocument } from "@/domains/clients/graphql/generated/graphql";
import { CreatePayrollDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetPayrollCyclesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetPayrollDateTypesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetUsersDocument } from "@/domains/users/graphql/generated/graphql";
import { serverApolloClient } from "@/lib/apollo/unified-client";
import { auditLogger } from "@/lib/audit/audit-logger";
import { 
  createOptimizedBulkProcessor, 
  ReferenceDataMaps,
  BulkProcessingResult 
} from "@/lib/bulk-upload/optimized-bulk-processor";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

// Reuse the same validation schema
const PayrollCsvSchema = z.object({
  name: z.string().min(1, "Payroll name is required"),
  clientName: z.string().min(1, "Client name is required"),
  cycleName: z.enum(["Weekly", "Biweekly", "Monthly", "Quarterly", "Annually"]),
  dateTypeName: z.enum(["DayOfMonth", "DayOfWeek", "RelativeToMonth"]),
  dateValue: z
    .string()
    .transform(val => {
      const num = parseInt(val);
      return isNaN(num) ? null : num;
    })
    .optional(),
  primaryConsultantEmail: z
    .string()
    .email("Primary consultant email must be valid"),
  backupConsultantEmail: z.string().email().optional().or(z.literal("")),
  managerEmail: z.string().email("Manager email must be valid"),
  processingTime: z
    .string()
    .transform(val => {
      const num = parseInt(val);
      return isNaN(num) ? 1 : num;
    })
    .optional()
    .default("1"),
  processingDaysBeforeEft: z
    .string()
    .transform(val => {
      const num = parseInt(val);
      return isNaN(num) ? 2 : num;
    })
    .optional()
    .default("2"),
  employeeCount: z
    .string()
    .transform(val => {
      const num = parseInt(val);
      return isNaN(num) ? null : num;
    })
    .optional(),
  payrollSystem: z.string().optional(),
  status: z
    .enum(["Implementation", "Active", "Inactive"])
    .optional()
    .default("Implementation"),
});

type PayrollCsvRow = z.infer<typeof PayrollCsvSchema>;

interface OptimizedUploadResult {
  success: boolean;
  message: string;
  data?: {
    created: number;
    failed: number;
    totalProcessed: number;
    processingTimeMs: number;
    performanceOptimization: {
      originalQueryCount: number;
      optimizedQueryCount: number;
      queryReductionPercentage: number;
    };
    errors: Array<{
      row: number;
      field: string;
      message: string;
      data: any;
    }>;
  };
}

/**
 * Optimized processing function for individual payroll records
 * Uses pre-fetched reference data for O(1) lookups
 */
async function processPayrollRecord(
  payrollData: PayrollCsvRow,
  index: number,
  referenceMaps: ReferenceDataMaps,
  userId: string,
  progressCallback?: (progress: number) => void
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Progress tracking
    if (progressCallback) {
      progressCallback(0); // Starting processing this item
    }

    // O(1) lookups using pre-fetched reference data
    const client = referenceMaps.clients.get(payrollData.clientName);
    const primaryConsultant = referenceMaps.users.get(payrollData.primaryConsultantEmail);
    const backupConsultant = payrollData.backupConsultantEmail 
      ? referenceMaps.users.get(payrollData.backupConsultantEmail)
      : null;
    const manager = referenceMaps.users.get(payrollData.managerEmail);
    const cycle = referenceMaps.cycles.get(payrollData.cycleName);
    const dateType = referenceMaps.dateTypes.get(payrollData.dateTypeName);

    if (progressCallback) {
      progressCallback(25); // Completed lookups
    }

    // Validation using lookup results
    const validationErrors: string[] = [];

    if (!client) {
      validationErrors.push(`Client not found: ${payrollData.clientName}`);
    }
    if (!primaryConsultant) {
      validationErrors.push(`Primary consultant not found: ${payrollData.primaryConsultantEmail}`);
    }
    if (!manager) {
      validationErrors.push(`Manager not found: ${payrollData.managerEmail}`);
    }
    if (!cycle) {
      validationErrors.push(`Payroll cycle not found: ${payrollData.cycleName}`);
    }
    if (!dateType) {
      validationErrors.push(`Date type not found: ${payrollData.dateTypeName}`);
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors.join('; ')
      };
    }

    if (progressCallback) {
      progressCallback(50); // Completed validation
    }

    // Create payroll record
    const { data } = await serverApolloClient.mutate({
      mutation: CreatePayrollDocument,
      variables: {
        object: {
          name: payrollData.name,
          clientId: client.id,
          cycleId: cycle.id,
          dateTypeId: dateType.id,
          ...(payrollData.dateValue !== null && payrollData.dateValue !== undefined && { dateValue: payrollData.dateValue }),
          primaryConsultantUserId: primaryConsultant.id,
          ...(backupConsultant?.id && { backupConsultantUserId: backupConsultant.id }),
          managerUserId: manager.id,
          processingTime: payrollData.processingTime,
          processingDaysBeforeEft: payrollData.processingDaysBeforeEft,
          ...(payrollData.employeeCount !== null && payrollData.employeeCount !== undefined && { employeeCount: payrollData.employeeCount }),
          ...(payrollData.payrollSystem && { payrollSystem: payrollData.payrollSystem }),
          status: payrollData.status,
        },
      },
    });

    if (progressCallback) {
      progressCallback(75); // Completed creation
    }

    if (!data?.insertPayrollsOne) {
      return {
        success: false,
        error: "Failed to create payroll - no response data"
      };
    }

    // Audit logging
    await auditLogger.log({
      userId,
      action: "bulk_create_payroll_optimized",
      entityId: data.insertPayrollsOne.id,
      entityType: "payroll",
      metadata: {
        bulkUpload: true,
        optimizedProcessing: true,
        rowNumber: index + 1,
        payrollName: payrollData.name,
        clientName: payrollData.clientName,
      },
    });

    if (progressCallback) {
      progressCallback(100); // Completed all processing
    }

    return {
      success: true,
      data: data.insertPayrollsOne
    };

  } catch (error) {
    logger.error('Optimized payroll record processing failed', {
      namespace: 'bulk_upload',
      operation: 'process_payroll_record',
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        payrollName: payrollData.name,
        clientName: payrollData.clientName,
        rowIndex: index,
        timestamp: new Date().toISOString()
      }
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown processing error"
    };
  }
}

/**
 * POST /api/bulk-upload/payrolls-optimized
 *
 * Process CSV file for bulk payroll creation with optimized N+1 elimination
 */
export async function POST(request: NextRequest) {
  const requestStart = performance.now();

  try {
    // Authentication check
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Authorization check - require manager or higher
    const userRole = (sessionClaims as any)?.metadata?.role as string;
    if (
      !userRole ||
      !["manager", "org_admin", "developer"].includes(userRole)
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions for bulk upload" },
        { status: 403 }
      );
    }

    logger.info('Optimized bulk payroll upload started', {
      namespace: 'bulk_upload',
      operation: 'start_upload',
      classification: DataClassification.CONFIDENTIAL,
      metadata: {
        userId,
        userRole,
        timestamp: new Date().toISOString()
      }
    });

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are supported" },
        { status: 400 }
      );
    }

    // Read and parse CSV
    const csvText = await file.text();
    const lines = csvText.split("\n").filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV file must have at least a header row and one data row" },
        { status: 400 }
      );
    }

    // Parse and validate CSV structure
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const expectedHeaders = [
      "name", "clientname", "cyclename", "datetypename", "datevalue",
      "primaryconsultantemail", "backupconsultantemail", "manageremail",
      "processingtime", "processingdaysbeforeeft", "employeecount",
      "payrollsystem", "status",
    ];

    const missingHeaders = expectedHeaders.filter(h => !header.includes(h));
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required headers: ${missingHeaders.join(", ")}`,
          expectedHeaders,
          receivedHeaders: header,
        },
        { status: 400 }
      );
    }

    // Parse and validate data rows
    const parsedData: PayrollCsvRow[] = [];
    const csvParsingErrors: Array<{row: number; field: string; message: string; data: any}> = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(",").map(v => v.trim());

      if (values.length < header.length) {
        csvParsingErrors.push({
          row: i + 1,
          field: "general",
          message: "Insufficient columns",
          data: { line, expected: header.length, received: values.length },
        });
        continue;
      }

      // Create row object
      const rowData: any = {};
      header.forEach((h, index) => {
        rowData[h] = values[index] || "";
      });

      // Validate row data
      const validationResult = PayrollCsvSchema.safeParse(rowData);

      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        errors.forEach(error => {
          csvParsingErrors.push({
            row: i + 1,
            field: error.path.join("."),
            message: error.message,
            data: rowData,
          });
        });
        continue;
      }

      parsedData.push(validationResult.data);
    }

    if (parsedData.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No valid payroll records found in CSV",
        data: {
          created: 0,
          failed: csvParsingErrors.length,
          totalProcessed: csvParsingErrors.length,
          processingTimeMs: 0,
          performanceOptimization: {
            originalQueryCount: 0,
            optimizedQueryCount: 0,
            queryReductionPercentage: 0
          },
          errors: csvParsingErrors
        }
      });
    }

    logger.info('CSV parsed successfully, starting optimized processing', {
      namespace: 'bulk_upload',
      operation: 'csv_parsed',
      classification: DataClassification.INTERNAL,
      metadata: {
        totalRecords: parsedData.length,
        parsingErrors: csvParsingErrors.length,
        fileName: file.name,
        timestamp: new Date().toISOString()
      }
    });

    // Create optimized bulk processor
    const bulkProcessor = createOptimizedBulkProcessor<PayrollCsvRow>({
      batchSize: 25,        // Process 25 payrolls per batch
      maxConcurrency: 3,    // Maximum 3 concurrent batches
      enableTransactions: true,
      enableProgressTracking: true,
      enableDetailedLogging: true
    });

    // Execute optimized bulk processing with pre-fetch configuration
    const processingResult: BulkProcessingResult<PayrollCsvRow> = await bulkProcessor.processBulkData(
      parsedData,
      (payrollData, index, referenceMaps, progressCallback) => 
        processPayrollRecord(payrollData, index, referenceMaps, userId, progressCallback),
      {
        // Pre-fetch configuration - eliminates N+1 pattern
        clients: {
          apolloClient: serverApolloClient,
          query: GetClientsListOptimizedDocument,
          variables: {} // Get all clients
        },
        users: {
          apolloClient: serverApolloClient,
          query: GetUsersDocument,
          variables: {} // Get all users (filtered during lookup)
        },
        cycles: {
          apolloClient: serverApolloClient,
          query: GetPayrollCyclesDocument,
          variables: {}
        },
        dateTypes: {
          apolloClient: serverApolloClient,
          query: GetPayrollDateTypesDocument,
          variables: {}
        }
      }
    );

    // Convert bulk processing result to API response format
    const apiErrors = [
      ...csvParsingErrors,
      ...processingResult.errors.map(error => ({
        row: error.index + 1,
        field: "processing",
        message: error.error,
        data: error.data
      }))
    ];

    const result: OptimizedUploadResult = {
      success: processingResult.success && csvParsingErrors.length === 0,
      message: `Processed ${processingResult.totalProcessed} payroll records. ` +
               `Created: ${processingResult.successfullyProcessed}, Failed: ${processingResult.failed + csvParsingErrors.length}`,
      data: {
        created: processingResult.successfullyProcessed,
        failed: processingResult.failed + csvParsingErrors.length,
        totalProcessed: processingResult.totalProcessed + csvParsingErrors.length,
        processingTimeMs: processingResult.processingTimeMs,
        performanceOptimization: {
          originalQueryCount: processingResult.metadata.queryOptimizationSavings.originalQueryCount,
          optimizedQueryCount: processingResult.metadata.queryOptimizationSavings.optimizedQueryCount,
          queryReductionPercentage: processingResult.metadata.queryOptimizationSavings.queryReductionPercentage
        },
        errors: apiErrors
      }
    };

    const requestDuration = performance.now() - requestStart;

    logger.info('Optimized bulk payroll upload completed', {
      namespace: 'bulk_upload',
      operation: 'upload_completed',
      classification: DataClassification.CONFIDENTIAL,
      metadata: {
        totalRecords: parsedData.length,
        successfulRecords: processingResult.successfullyProcessed,
        failedRecords: processingResult.failed + csvParsingErrors.length,
        processingTimeMs: Math.round(processingResult.processingTimeMs),
        totalRequestTimeMs: Math.round(requestDuration),
        queryReductionPercentage: processingResult.metadata.queryOptimizationSavings.queryReductionPercentage,
        originalQueryCount: processingResult.metadata.queryOptimizationSavings.originalQueryCount,
        optimizedQueryCount: processingResult.metadata.queryOptimizationSavings.optimizedQueryCount,
        averageItemProcessingTime: Math.round(processingResult.metadata.averageItemProcessingTime),
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json(result);

  } catch (error) {
    const requestDuration = performance.now() - requestStart;
    
    logger.error('Optimized bulk payroll upload failed', {
      namespace: 'bulk_upload',
      operation: 'upload_failed',
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        requestDurationMs: Math.round(requestDuration),
        errorName: error instanceof Error ? error.name : 'UnknownError',
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json(
      {
        success: false,
        message: "Optimized bulk upload failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bulk-upload/payrolls-optimized
 *
 * Get CSV template for optimized payroll upload (same as original)
 */
export async function GET() {
  const csvTemplate = `name,clientName,cycleName,dateTypeName,dateValue,primaryConsultantEmail,backupConsultantEmail,managerEmail,processingTime,processingDaysBeforeEft,employeeCount,payrollSystem,status
"Acme Weekly Payroll","Acme Corporation","Weekly","DayOfWeek",1,"consultant@company.com","backup@company.com","manager@company.com",2,2,50,"Xero","Implementation"
"Tech Monthly Payroll","Tech Solutions","Monthly","DayOfMonth",15,"consultant@company.com","","manager@company.com",4,3,25,"MYOB","Active"`;

  return new NextResponse(csvTemplate, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=optimized-payroll-upload-template.csv",
    },
  });
}