/**
 * Bulk Client Upload API Endpoint - Simplified Version
 *
 * Handles CSV file uploads for bulk client creation
 * Supports validation, error handling, and progress tracking
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { CreateClientDocument } from "@/domains/clients/graphql/generated/graphql";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
} from "@/lib/api/route-helpers";
import { clientCreateSchema } from "@/lib/validation/shared-schemas";

// CSV validation schema - extends shared schema for bulk upload
const ClientCsvSchema = clientCreateSchema.extend({
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
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return createErrorResponse("CSV file required (field 'file')", 400);
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const [header, ...rows] = lines;
    const headers = header.split(",").map(h => h.trim().toLowerCase());
    const expected = ["name", "email", "phone", "address", "notes", "active"];
    const missing = expected.filter(h => !headers.includes(h));
    if (missing.length) {
      return createErrorResponse(
        `Missing CSV headers: ${missing.join(", ")}`,
        400
      );
    }

    let created = 0;
    let failed = 0;
    const errors: UploadResult["data"]["errors"] = [] as any;

    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].split(",").map(c => c.trim());
      const data = Object.fromEntries(
        headers.map((h, idx) => [h, cols[idx] ?? ""])
      ) as any;
      try {
        const parsed = ClientCsvSchema.parse(data) as ClientCsvRow;
        const { data: insertData } = await adminApolloClient.mutate({
          mutation: CreateClientDocument as any,
          variables: {
            object: {
              name: parsed.name,
              contactEmail: parsed.email,
              contactPhone: parsed.phone,
              address: parsed.address,
              notes: (parsed as any).notes,
              active: parsed.active as unknown as boolean,
            },
          },
        });
        const returned = insertData?.insertClients?.returning?.[0];
        if (!returned?.id) throw new Error("Insert failed");
        created++;
      } catch (e: any) {
        failed++;
        errors.push({
          row: i + 2, // account for header
          field: "row",
          message: e?.message || "Validation/insert error",
          data,
        });
      }
    }

    return createApiResponse(
      { created, failed, errors },
      "Bulk client upload processed"
    );
  } catch (error) {
    console.error("Bulk client upload error:", error);
    return handleApiError(error);
  }
}

/**
 * GET /api/bulk-upload/clients
 *
 * Get upload status or template
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    return createApiResponse(
      {
        template: {
          headers: ["name", "email", "phone", "address", "notes", "active"],
          example: [
            "Example Client",
            "client@example.com",
            "+1234567890",
            "123 Main St",
            "Notes",
            "true",
          ],
        },
      },
      "CSV template for bulk client upload"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
