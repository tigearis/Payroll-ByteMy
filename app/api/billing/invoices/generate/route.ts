import { NextRequest, NextResponse } from "next/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import {
  CreateInvoiceDocument,
  type CreateInvoiceMutation,
  type CreateInvoiceMutationVariables,
} from "@/domains/billing/graphql/generated/graphql";
import { withAuth } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

interface GenerateInvoiceRequest {
  clientId: string;
  billingItemIds: string[];
  dueDate?: string;
  notes?: string;
}

/**
 * Generate invoice from billing items
 */
async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateInvoiceRequest;
    const { clientId, billingItemIds, dueDate, notes } = body as any;

    if (!clientId || !billingItemIds?.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Client ID and billing item IDs are required",
        },
        { status: 400 }
      );
    }
    // Create invoice shell and attach items using unified Apollo client
    const client = adminApolloClient;

    // Minimal create using generated operation
    const { data: createData } = await client.mutate<
      CreateInvoiceMutation,
      CreateInvoiceMutationVariables
    >({
      mutation: CreateInvoiceDocument,
      variables: {
        input: {
          clientId,
          status: "draft",
          currency: "AUD",
          notes: notes ?? null,
          dueDate: dueDate ?? null,
        } as any,
      },
    });

    const invoiceId = createData?.insertBillingInvoiceOne?.id;
    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: "Failed to create invoice" },
        { status: 500 }
      );
    }

    // If line items API exists, we would insert invoice line items here from billingItemIds.
    // For now, return the created invoice id so the UI can proceed to the invoice page/editor.
    return NextResponse.json({ success: true, data: { invoiceId } });
  } catch (error) {
    logger.error("Invoice generation failed", {
      namespace: "billing_api",
      operation: "generate_invoice",
      classification: DataClassification.CONFIDENTIAL,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString(),
      },
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export { POST };
export default withAuth(POST);
