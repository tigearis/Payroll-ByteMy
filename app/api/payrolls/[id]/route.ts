// app/api/payrolls/[id]/route.ts
import { NextRequest } from "next/server";
import { GetPayrollByIdDocument, type GetPayrollByIdQuery } from "@/domains/payrolls/graphql/generated/graphql";
import { 
  withErrorHandling, 
  successResponse, 
  errorResponse, 
  validateParams, 
  paramValidators 
} from "@/lib/api/route-helpers";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

export const GET = withErrorHandling(async (
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
  // Validate parameters
  const { id } = await validateParams(params, { 
    id: paramValidators.uuid 
  });

  // Execute authenticated GraphQL query with full type safety
  const data = await executeTypedQuery<GetPayrollByIdQuery>(
    GetPayrollByIdDocument,
    { id }
  );

  if (!data.payrollsByPk) {
    return errorResponse("Payroll not found", 404);
  }

  return successResponse(data.payrollsByPk);
});
