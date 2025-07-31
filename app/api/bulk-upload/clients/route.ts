/**
 * Bulk Client Upload API Endpoint
 *
 * Handles CSV file uploads for bulk client creation
 * Supports validation, error handling, and progress tracking
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateClientDocument } from "@/domains/clients/graphql/generated/graphql";
import { serverApolloClient } from "@/lib/apollo/unified-client";
import { auditLogger } from "@/lib/audit/audit-logger";

// CSV validation schema
const ClientCsvSchema = z.object({
  name: z.string().min(1, "Client name is required"),
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

type ClientCsvRow = z.infer<typeof ClientCsvSchema>;

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
 * POST /api/bulk-upload/clients
 *
 * Process CSV file for bulk client creation
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
      "contactperson",
      "contactemail",
      "contactphone",
      "active",
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
      const validationResult = ClientCsvSchema.safeParse(rowData);

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

      const clientData = validationResult.data;

      try {
        // Create client via GraphQL
        const { data } = await serverApolloClient.mutate({
          mutation: CreateClientDocument,
          variables: {
            object: {
              name: clientData.name,
              ...(clientData.contactPerson && { contactPerson: clientData.contactPerson }),
              ...(clientData.contactEmail && { contactEmail: clientData.contactEmail }),
              ...(clientData.contactPhone && { contactPhone: clientData.contactPhone }),
            }
          },
        });

        if (data?.insertClients?.returning[0]) {
          results.data!.created++;

          // Audit log
          await auditLogger.log({
            userId,
            action: "bulk_create_client",
            entityId: data.insertClients.returning[0].id,
            entityType: "client",
            metadata: {
              bulkUpload: true,
              rowNumber: i + 1,
              clientName: clientData.name,
            },
          });
        } else {
          results.data!.errors.push({
            row: i + 1,
            field: "general",
            message: "Failed to create client - no response data",
            data: clientData,
          });
          results.data!.failed++;
        }
      } catch (error) {
        console.error(`Error creating client at row ${i + 1}:`, error);
        results.data!.errors.push({
          row: i + 1,
          field: "general",
          message: error instanceof Error ? error.message : "Unknown error",
          data: clientData,
        });
        results.data!.failed++;
      }
    }

    // Update result message
    if (results.data!.created > 0) {
      results.message = `Successfully created ${results.data!.created} clients`;
      if (results.data!.failed > 0) {
        results.message += `, ${results.data!.failed} failed`;
      }
    } else {
      results.success = false;
      results.message = "No clients were created";
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Bulk client upload error:", error);

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
 * GET /api/bulk-upload/clients
 *
 * Get CSV template for client upload
 */
export async function GET() {
  const csvTemplate = `name,contactPerson,contactEmail,contactPhone,active
"Acme Corporation","John Smith","john@acme.com","+61 2 1234 5678",true
"Tech Solutions","Jane Doe","jane@techsolutions.com","+61 3 9876 5432",true
"Global Industries","Bob Wilson","bob@global.com","+61 7 5555 1234",false`;

  return new NextResponse(csvTemplate, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=client-upload-template.csv",
    },
  });
}
