import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
// app/api/payrolls/route.ts - Enhanced permissions implementation
import { NextRequest, NextResponse } from "next/server";
import { createServerApolloClient } from "@/lib/apollo/server-client";
import { GET_PAYROLLS } from "@/graphql/queries/payrolls/getPayrolls";
import { withEnhancedAuth } from "@/lib/auth/enhanced-api-auth";

export const GET = withEnhancedAuth(
  async (req: NextRequest, context) => {
    try {
      console.log("🔍 PAYROLL ROUTE - Enhanced auth context:", {
        userId: context.userId,
        userRole: context.userRole
      });

      // Create server-side Apollo client
      const client = await createServerApolloClient();

      // Execute GraphQL query
      const { data } = await client.query({
        query: GET_PAYROLLS,
        fetchPolicy: 'no-cache',
      });

      return NextResponse.json({ 
        payrolls: data.payrolls,
        // Enhanced auth debug info
        debug: {
          userRole: context.userRole,
          hasPermission: true
        }
      });
    } catch (error) {
      return handleApiError(error, "payrolls");
    }
  },
  {
    permission: "custom:payroll:read"
  }
);
