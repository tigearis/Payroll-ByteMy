import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateClientDocument } from "@/domains/clients/graphql/generated/graphql";
import { GetClientsDocument } from "@/domains/clients/graphql/generated/graphql";
import { CreatePayrollDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetPayrollCyclesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetPayrollDateTypesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetUsersDocument } from "@/domains/users/graphql/generated/graphql";
import { serverApolloClient } from "@/lib/apollo/unified-client";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

// Schema for client data
const clientSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  active: z
    .string()
    .transform(
      val => val.toLowerCase() === "true" || val.toLowerCase() === "yes"
    )
    .optional()
    .default("true"),
});

// Schema for payroll data
const payrollSchema = z.object({
  payrollName: z.string().min(1, "Payroll name is required"),
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

// Combined schema for a row that contains both client and payroll data
const combinedRowSchema = z.object({
  // Client fields
  clientName: z.string().min(1, "Client name is required"),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  clientActive: z
    .string()
    .transform(
      val => val.toLowerCase() === "true" || val.toLowerCase() === "yes"
    )
    .optional()
    .default("true"),
  // Payroll fields
  payrollName: z.string().min(1, "Payroll name is required"),
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
  payrollStatus: z
    .enum(["Implementation", "Active", "Inactive"])
    .optional()
    .default("Implementation"),
});

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read and parse CSV
    const text = await file.text();
    const lines = text.split("\n").filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "File must contain at least a header row and one data row" },
        { status: 400 }
      );
    }

    // Parse header
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const expectedHeaders = [
      "clientname",
      "contactperson",
      "contactemail",
      "contactphone",
      "clientactive",
      "payrollname",
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
      "payrollstatus",
    ];

    // Validate headers
    const missingHeaders = expectedHeaders.filter(
      expected => !header.includes(expected)
    );

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

    // Get reference data
    const [clientsResponse, usersResponse, cyclesResponse, dateTypesResponse] =
      await Promise.all([
        serverApolloClient.query({
          query: GetClientsDocument,
        }),
        serverApolloClient.query({
          query: GetUsersDocument,
        }),
        serverApolloClient.query({
          query: GetPayrollCyclesDocument,
        }),
        serverApolloClient.query({
          query: GetPayrollDateTypesDocument,
        }),
      ]);

    const existingClients = clientsResponse.data.clients || [];
    const existingUsers = usersResponse.data.users || [];
    const existingCycles = cyclesResponse.data.payrollCycles || [];
    const existingDateTypes = dateTypesResponse.data.payrollDateTypes || [];

    // Process each row
    const results = {
      success: true,
      data: {
        clientsCreated: 0,
        clientsFailed: 0,
        payrollsCreated: 0,
        payrollsFailed: 0,
        errors: [] as Array<{
          line: number;
          field: string;
          message: string;
          data?: any;
        }>,
      },
    };

    // Track created clients to avoid duplicates within the same upload
    const createdClientsInUpload = new Map<string, string>();

    for (let i = 1; i < lines.length; i++) {
      const line = i + 1;
      const values = lines[i].split(",").map(v => v.trim());

      if (values.length !== header.length) {
        results.data!.errors.push({
          line,
          field: "general",
          message: "Insufficient columns",
          data: { row: line, expected: header.length, received: values.length },
        });
        results.data!.clientsFailed++;
        results.data!.payrollsFailed++;
        continue;
      }

      // Create row data object
      const rowData: any = {};
      header.forEach((h, index) => {
        rowData[h] = values[index];
      });

      try {
        // Validate row data
        const validatedData = combinedRowSchema.parse(rowData);

        // Check if client already exists (either in database or created in this upload)
        let clientId: string | null = null;

        // First check if created in this upload
        if (createdClientsInUpload.has(validatedData.clientName)) {
          clientId = createdClientsInUpload.get(validatedData.clientName)!;
        } else {
          // Check if exists in database
          const existingClient = existingClients.find(
            c => c.name.toLowerCase() === validatedData.clientName.toLowerCase()
          );
          if (existingClient) {
            clientId = existingClient.id;
          }
        }

        // Create client if it doesn't exist
        if (!clientId) {
          try {
            const clientData = {
              name: validatedData.clientName,
              contact_person: validatedData.contactPerson || null,
              contact_email: validatedData.contactEmail || null,
              contact_phone: validatedData.contactPhone || null,
              active: validatedData.clientActive,
            };

            const clientResponse = await serverApolloClient.mutate({
              mutation: CreateClientDocument,
              variables: { object: clientData },
            });

            if (clientResponse.data?.insertClients?.returning[0]?.id) {
              clientId = clientResponse.data.insertClients.returning[0].id;
              createdClientsInUpload.set(validatedData.clientName, clientId);
              results.data!.clientsCreated++;
            } else {
              results.data!.errors.push({
                line,
                field: "clientName",
                message: "Failed to create client - no response data",
                data: { row: line, ...clientData },
              });
              results.data!.clientsFailed++;
              results.data!.payrollsFailed++;
              continue;
            }
          } catch (error) {
            results.data!.errors.push({
              line,
              field: "clientName",
              message: error instanceof Error ? error.message : "Unknown error",
              data: { row: line, ...validatedData },
            });
            results.data!.clientsFailed++;
            results.data!.payrollsFailed++;
            continue;
          }
        }

        // Validate payroll dependencies
        const primaryConsultant = existingUsers.find(
          u =>
            u.email.toLowerCase() ===
            validatedData.primaryConsultantEmail.toLowerCase()
        );
        if (!primaryConsultant) {
          results.data!.errors.push({
            line,
            field: "primaryConsultantEmail",
            message: `Primary consultant not found: ${validatedData.primaryConsultantEmail}`,
            data: { row: line, ...validatedData },
          });
          results.data!.payrollsFailed++;
          continue;
        }

        const manager = existingUsers.find(
          u =>
            u.email.toLowerCase() === validatedData.managerEmail.toLowerCase()
        );
        if (!manager) {
          results.data!.errors.push({
            line,
            field: "managerEmail",
            message: `Manager not found: ${validatedData.managerEmail}`,
            data: { row: line, ...validatedData },
          });
          results.data!.payrollsFailed++;
          continue;
        }

        const cycle = existingCycles.find(
          c => c.name === validatedData.cycleName
        );
        if (!cycle) {
          results.data!.errors.push({
            line,
            field: "cycleName",
            message: `Payroll cycle not found: ${validatedData.cycleName}`,
            data: { row: line, ...validatedData },
          });
          results.data!.payrollsFailed++;
          continue;
        }

        const dateType = existingDateTypes.find(
          dt => dt.name === validatedData.dateTypeName
        );
        if (!dateType) {
          results.data!.errors.push({
            line,
            field: "dateTypeName",
            message: `Payroll date type not found: ${validatedData.dateTypeName}`,
            data: { row: line, ...validatedData },
          });
          results.data!.payrollsFailed++;
          continue;
        }

        // Create payroll
        try {
          const payrollData = {
            name: validatedData.payrollName,
            clientId: clientId,
            cycleId: cycle.id,
            dateTypeId: dateType.id,
            dateValue: validatedData.dateValue ?? undefined,
            primaryConsultantUserId: primaryConsultant.id,
            backupConsultantUserId: validatedData.backupConsultantEmail
              ? existingUsers.find(
                  u =>
                    u.email.toLowerCase() ===
                    validatedData.backupConsultantEmail!.toLowerCase()
                )?.id || null
              : null,
            managerUserId: manager.id,
            processingTime: validatedData.processingTime,
            processingDaysBeforeEft: validatedData.processingDaysBeforeEft,
            employeeCount: validatedData.employeeCount ?? undefined,
            payrollSystem: validatedData.payrollSystem || undefined,
            status: validatedData.payrollStatus,
          };

          const payrollResponse = await serverApolloClient.mutate({
            mutation: CreatePayrollDocument,
            variables: { object: payrollData },
          });

          if (payrollResponse.data?.insertPayrollsOne?.id) {
            results.data!.payrollsCreated++;
          } else {
            results.data!.errors.push({
              line,
              field: "general",
              message: "Failed to create payroll - no response data",
              data: { row: line, ...payrollData },
            });
            results.data!.payrollsFailed++;
          }
        } catch (error) {
          results.data!.errors.push({
            line,
            field: "general",
            message: error instanceof Error ? error.message : "Unknown error",
            data: { row: line, ...validatedData },
          });
          results.data!.payrollsFailed++;
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach(validationError => {
            results.data!.errors.push({
              line,
              field: validationError.path.join("."),
              message: validationError.message,
              data: { row: line, ...rowData },
            });
          });
        } else {
          results.data!.errors.push({
            line,
            field: "general",
            message: error instanceof Error ? error.message : "Unknown error",
            data: { row: line, ...rowData },
          });
        }
        results.data!.clientsFailed++;
        results.data!.payrollsFailed++;
      }
    }

    // Log audit entry
    logger.info("Combined bulk upload summary", {
      namespace: "bulk_upload_combined_api",
      classification: DataClassification.CONFIDENTIAL,
      metadata: {
        userId,
        clientsCreated: results.data!.clientsCreated,
        payrollsCreated: results.data!.payrollsCreated,
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    logger.error("Combined bulk upload error", {
      namespace: "bulk_upload_combined_api",
      classification: DataClassification.CONFIDENTIAL,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      {
        error: "Failed to process combined bulk upload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
