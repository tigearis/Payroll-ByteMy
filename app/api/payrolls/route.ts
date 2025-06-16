// app/api/payrolls/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerApolloClient } from "@/lib/server-apollo-client";
import { GET_PAYROLLS } from "@/graphql/queries/payrolls/getPayrolls";
import { auth } from "@clerk/nextjs/server";

export async function GET(_req: NextRequest) {
  try {
    // Get Clerk authentication
    const { userId, getToken, sessionClaims } = await auth();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TEMPORARY: Extract role for debugging
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = (
      (sessionClaims?.metadata as any)?.default_role ||
      (sessionClaims?.metadata as any)?.role ||
      hasuraClaims?.["x-hasura-default-role"] ||
      hasuraClaims?.["x-hasura-role"] ||
      (sessionClaims as any)?.role
    ) as string;

    console.log("🔍 PAYROLL ROUTE - User role debug:", {
      userId: userId?.substring(0, 8) + "...",
      userRole,
      hasMetadata: !!sessionClaims?.metadata,
      hasHasuraClaims: !!hasuraClaims,
      v2DefaultRole: (sessionClaims?.metadata as any)?.default_role,
      v1DefaultRole: hasuraClaims?.["x-hasura-default-role"]
    });

    // Get Hasura token
    const token = await getToken({ template: "hasura" });

    // Ensure we have a token
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    console.log("🔍 PAYROLL ROUTE - Token info:", {
      hasToken: !!token,
      tokenLength: token?.length
    });

    // Create server-side Apollo client
    const client = await getServerApolloClient();

    // Execute GraphQL query
    const { data } = await client.query({
      query: GET_PAYROLLS,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });

    return NextResponse.json({ 
      payrolls: data.payrolls,
      // TEMPORARY: Include debug info
      debug: {
        userRole,
        hasToken: !!token,
        tokenLength: token?.length
      }
    });
  } catch (error) {
    console.error("Payroll Fetch Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch payrolls",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
