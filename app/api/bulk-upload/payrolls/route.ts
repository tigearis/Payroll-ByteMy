/**
 * Bulk Payroll Upload API Endpoint
 *
 * Handles CSV file uploads for bulk payroll creation
 * Supports validation, error handling, and progress tracking
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

// CSV validation schema
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

interface UploadResult {
  success: boolean;
  message: string;
  data?: {
    created: number;
    failed: number;
    errors: Array<{
      row: number;
      field: string;
      message: string;
      data: any;
    }>;
  };
}

/**
 * POST /api/bulk-upload/payrolls
 *
 * Process CSV file for bulk payroll creation
 */
export async function POST(request: NextRequest) {
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

    // Parse header
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const expectedHeaders = [
      "name",
      "clientname",
      "cyclename",
      "datetypename",
      "datevalue",
      "primaryconsultantemail",
      "backupconsultantemail",
      "manageremail",
      "processingtime",
      "processingdaysbeforeeft",
      "employeecount",
      "payrollsystem",
      "status",
    ];

    // Validate headers
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

    // Process data rows
    const results: UploadResult = {
      success: true,
      message: "Bulk upload completed",
      data: {
        created: 0,
        failed: 0,
        errors: [],
      },
    };

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(",").map(v => v.trim());

      if (values.length < header.length) {
        results.data!.errors.push({
          row: i + 1,
          field: "general",
          message: "Insufficient columns",
          data: { line, expected: header.length, received: values.length },
        });
        results.data!.failed++;
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
          results.data!.errors.push({
            row: i + 1,
            field: error.path.join("."),
            message: error.message,
            data: rowData,
          });
        });
        results.data!.failed++;
        continue;
      }

      const payrollData = validationResult.data;

      try {
        // Get required IDs from the database using proper documents
        const [
          clientsResponse,
          usersResponse,
          cyclesResponse,
          dateTypesResponse,
        ] = await Promise.all([
          serverApolloClient.query({
            query: GetClientsListOptimizedDocument,
            variables: { where: { name: { _eq: payrollData.clientName } } },
          }),
          serverApolloClient.query({
            query: GetUsersDocument,
            variables: { 
              where: { 
                email: { 
                  _in: [
                    payrollData.primaryConsultantEmail,
                    payrollData.backupConsultantEmail,
                    payrollData.managerEmail,
                  ].filter((email): email is string => Boolean(email))
                } 
              } 
            },
          }),
          serverApolloClient.query({
            query: GetPayrollCyclesDocument,
          }),
          serverApolloClient.query({
            query: GetPayrollDateTypesDocument,
          }),
        ]);

        const allCycles = cyclesResponse.data.payrollCycles || [];
        const allDateTypes = dateTypesResponse.data.payrollDateTypes || [];
        const allUsers = usersResponse.data.users || [];

        const lookupData = {
          clients: clientsResponse.data.clients || [],
          payrollCycles: allCycles.filter(c => c.name === payrollData.cycleName),
          payrollDateTypes: allDateTypes.filter(dt => dt.name === payrollData.dateTypeName),
          users: allUsers.filter(u => u.email === payrollData.primaryConsultantEmail),
          backupUsers: allUsers.filter(u => u.email === payrollData.backupConsultantEmail),
          managerUsers: allUsers.filter(u => u.email === payrollData.managerEmail),
        };

        // Validate lookup results
        if (!lookupData.clients?.[0]) {
          results.data!.errors.push({
            row: i + 1,
            field: "clientName",
            message: `Client not found: ${payrollData.clientName}`,
            data: payrollData,
          });
          results.data!.failed++;
          continue;
        }

        if (!lookupData.payrollCycles?.[0]) {
          results.data!.errors.push({
            row: i + 1,
            field: "cycleName",
            message: `Payroll cycle not found: ${payrollData.cycleName}`,
            data: payrollData,
          });
          results.data!.failed++;
          continue;
        }

        if (!lookupData.payrollDateTypes?.[0]) {
          results.data!.errors.push({
            row: i + 1,
            field: "dateTypeName",
            message: `Payroll date type not found: ${payrollData.dateTypeName}`,
            data: payrollData,
          });
          results.data!.failed++;
          continue;
        }

        if (!lookupData.users?.[0]) {
          results.data!.errors.push({
            row: i + 1,
            field: "primaryConsultantEmail",
            message: `Primary consultant not found: ${payrollData.primaryConsultantEmail}`,
            data: payrollData,
          });
          results.data!.failed++;
          continue;
        }

        if (!lookupData.managerUsers?.[0]) {
          results.data!.errors.push({
            row: i + 1,
            field: "managerEmail",
            message: `Manager not found: ${payrollData.managerEmail}`,
            data: payrollData,
          });
          results.data!.failed++;
          continue;
        }

        // Create payroll via GraphQL
        const { data } = await serverApolloClient.mutate({
          mutation: CreatePayrollDocument,
          variables: {
            object: {
              name: payrollData.name,
              clientId: lookupData.clients[0].id,
              cycleId: lookupData.payrollCycles[0].id,
              dateTypeId: lookupData.payrollDateTypes[0].id,
              ...(payrollData.dateValue !== null && payrollData.dateValue !== undefined && { dateValue: payrollData.dateValue }),
              primaryConsultantUserId: lookupData.users[0].id,
              ...(lookupData.backupUsers?.[0]?.id && { backupConsultantUserId: lookupData.backupUsers[0].id }),
              managerUserId: lookupData.managerUsers[0].id,
              processingTime: payrollData.processingTime,
              processingDaysBeforeEft: payrollData.processingDaysBeforeEft,
              ...(payrollData.employeeCount !== null && payrollData.employeeCount !== undefined && { employeeCount: payrollData.employeeCount }),
              ...(payrollData.payrollSystem && { payrollSystem: payrollData.payrollSystem }),
              status: payrollData.status,
            },
          },
        });

        if (data?.insertPayrollsOne) {
          results.data!.created++;

          // Audit log
          await auditLogger.log({
            userId,
            action: "bulk_create_payroll",
            entityId: data.insertPayrollsOne.id,
            entityType: "payroll",
            metadata: {
              bulkUpload: true,
              rowNumber: i + 1,
              payrollName: payrollData.name,
              clientName: payrollData.clientName,
            },
          });
        } else {
          results.data!.errors.push({
            row: i + 1,
            field: "general",
            message: "Failed to create payroll - no response data",
            data: payrollData,
          });
          results.data!.failed++;
        }
      } catch (error) {
        console.error(`Error creating payroll at row ${i + 1}:`, error);
        results.data!.errors.push({
          row: i + 1,
          field: "general",
          message: error instanceof Error ? error.message : "Unknown error",
          data: payrollData,
        });
        results.data!.failed++;
      }
    }

    // Update result message
    if (results.data!.created > 0) {
      results.message = `Successfully created ${results.data!.created} payrolls`;
      if (results.data!.failed > 0) {
        results.message += `, ${results.data!.failed} failed`;
      }
    } else {
      results.success = false;
      results.message = "No payrolls were created";
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Bulk payroll upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to process bulk upload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bulk-upload/payrolls
 *
 * Get CSV template for payroll upload
 */
export async function GET() {
  const csvTemplate = `name,clientName,cycleName,dateTypeName,dateValue,primaryConsultantEmail,backupConsultantEmail,managerEmail,processingTime,processingDaysBeforeEft,employeeCount,payrollSystem,status
"Acme Weekly Payroll","Acme Corporation","Weekly","DayOfWeek",1,"consultant@company.com","backup@company.com","manager@company.com",2,2,50,"Xero","Implementation"
"Tech Monthly Payroll","Tech Solutions","Monthly","DayOfMonth",15,"consultant@company.com","","manager@company.com",4,3,25,"MYOB","Active"`;

  return new NextResponse(csvTemplate, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=payroll-upload-template.csv",
    },
  });
}
