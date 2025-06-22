import { gql } from "@apollo/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { SecureHasuraService } from "@/lib/apollo/secure-hasura-service";

// GraphQL query to get Hasura claims
const GET_HASURA_CLAIMS = gql`
  query GetHasuraClaimsForUser($clerkUserId: String!) {
    get_hasura_claims(args: { user_clerk_id: $clerkUserId })
  }
`;

export async function GET(req: NextRequest) {
  console.log("🔍 Hasura claims endpoint called");

  try {
    // Get the authenticated user's session
    const authResult = await auth();
    const clerkUserId = authResult.userId;

    console.log("🔍 Clerk user ID:", `${clerkUserId?.substring(0, 8)}...`);

    if (!clerkUserId) {
      console.log("🚨 No Clerk user ID found");
      return NextResponse.json(
        {
          error: "No authenticated user found",
        },
        { status: 401 }
      );
    }

    // Use the secure Hasura service to get claims
    const hasuraService = SecureHasuraService.getInstance();

    try {
      const { data, errors } = await hasuraService.executeAdminQuery(
        GET_HASURA_CLAIMS,
        { clerkUserId },
        { skipAuth: true } // Skip auth check since this is for auth itself
      );

      if (errors && errors.length > 0) {
        console.error("🚨 GraphQL errors getting claims:", errors);
        return NextResponse.json(
          {
            error: "Failed to get user claims",
            details: errors,
          },
          { status: 500 }
        );
      }

      const claims = data?.get_hasura_claims;
      console.log("🔍 Retrieved claims:", {
        hasUserId: !!claims?.["x-hasura-user-id"],
        defaultRole: claims?.["x-hasura-default-role"],
        allowedRoles: claims?.["x-hasura-allowed-roles"],
      });

      if (!claims || !claims["x-hasura-user-id"]) {
        console.log("🚨 User not found in database for Clerk ID:", clerkUserId);
        return NextResponse.json(
          {
            error: "User not found in database",
            clerkUserId,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        claims,
        clerkUserId,
        success: true,
      });
    } catch (queryError) {
      console.error("🚨 Error executing claims query:", queryError);
      return NextResponse.json(
        {
          error: "Database query failed",
          details:
            queryError instanceof Error ? queryError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("🚨 Error in hasura-claims endpoint:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
