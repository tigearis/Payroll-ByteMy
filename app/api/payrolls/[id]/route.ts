// app/api/payrolls/[id]/route.ts
import { NextRequest } from "next/server";
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
} from "@/lib/api/route-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate parameters
    const { id } = await params;

    if (!id) {
      return createErrorResponse("Payroll ID is required", 400);
    }

    const { adminApolloClient } = await import("@/lib/apollo/unified-client");
    const { GetPayrollByIdDocument } = await import(
      "@/domains/payrolls/graphql/generated/graphql"
    );

    const { data } = await adminApolloClient.query({
      query: GetPayrollByIdDocument as any,
      variables: { id },
      fetchPolicy: "no-cache",
    });

    const payroll = data?.payrollsByPk;
    if (!payroll) {
      return createErrorResponse("Payroll not found", 404);
    }

    return createApiResponse({ payroll }, "Payroll fetched");
  } catch (error) {
    console.error("Payroll API error:", error);
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return createErrorResponse("Payroll ID is required", 400);
    }
    const payload = await req.json();
    const { adminApolloClient } = await import("@/lib/apollo/unified-client");
    const gql = await import("@/domains/payrolls/graphql/generated/graphql");

    // Update status
    if (typeof payload?.status === "string") {
      await adminApolloClient.mutate({
        mutation: (gql as any).UpdatePayrollStatusDocument,
        variables: { id, status: payload.status },
      });
      return createApiResponse(
        { id, status: payload.status },
        "Payroll status updated"
      );
    }

    // Update assignments or simple fields
    const set: any = {};
    if (payload?.primaryConsultantUserId)
      set.primaryConsultantUserId = payload.primaryConsultantUserId;
    if (payload?.backupConsultantUserId)
      set.backupConsultantUserId = payload.backupConsultantUserId;

    if (Object.keys(set).length) {
      await adminApolloClient.mutate({
        mutation: (gql as any).UpdatePayrollSimpleDocument,
        variables: { id, set },
      });
      return createApiResponse({ id }, "Payroll updated");
    }

    return createErrorResponse("No supported fields provided", 400);
  } catch (error) {
    console.error("Payroll update API error:", error);
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return createErrorResponse("Payroll ID is required", 400);
    }
    const { adminApolloClient } = await import("@/lib/apollo/unified-client");
    const { DeletePayrollDocument } = await import(
      "@/domains/payrolls/graphql/generated/graphql"
    );
    await adminApolloClient.mutate({
      mutation: DeletePayrollDocument as any,
      variables: { id },
    });
    return createApiResponse({ id }, "Payroll deleted");
  } catch (error) {
    console.error("Payroll delete API error:", error);
    return handleApiError(error);
  }
}
