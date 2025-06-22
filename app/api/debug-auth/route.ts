import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { gql } from "@apollo/client";

const GET_USER_BY_ID = gql`
  query GetUserById($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      is_active
      created_at
      updated_at
    }
  }
`;

const GET_USER_BY_CLERK_ID = gql`
  query GetUserByClerkId($clerkId: String!) {
    users(where: { clerk_user_id: { _eq: $clerkId } }) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      is_active
      created_at
      updated_at
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Starting auth debug...");

    // Get auth info
    const { userId: clerkUserId, sessionClaims } = await auth();
    const user = await currentUser();

    console.log("👤 Clerk user info:", {
      clerkUserId,
      userExists: !!user,
      email: user?.emailAddresses[0]?.emailAddress,
    });

    // Extract database user ID from JWT claims
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const databaseUserId = hasuraClaims?.["x-hasura-user-id"];

    console.log("🎟️ JWT Claims analysis:", {
      hasSessionClaims: !!sessionClaims,
      hasHasuraClaims: !!hasuraClaims,
      extractedDatabaseUserId: databaseUserId,
      clerkUserIdFromClaims: hasuraClaims?.["x-hasura-clerk-user-id"],
      defaultRole: hasuraClaims?.["x-hasura-default-role"],
      allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
    });

    let databaseUserById = null;
    let databaseUserByClerkId = null;

    // Try to find user by database ID
    if (databaseUserId) {
      try {
        const { data } = await adminApolloClient.query({
          query: GET_USER_BY_ID,
          variables: { id: databaseUserId },
          fetchPolicy: "network-only",
        });
        databaseUserById = data?.users_by_pk;
        console.log("📊 User found by database ID:", !!databaseUserById);
      } catch (error) {
        console.error("❌ Error querying user by database ID:", error);
      }
    }

    // Try to find user by Clerk ID
    if (clerkUserId) {
      try {
        const { data } = await adminApolloClient.query({
          query: GET_USER_BY_CLERK_ID,
          variables: { clerkId: clerkUserId },
          fetchPolicy: "network-only",
        });
        databaseUserByClerkId = data?.users?.[0];
        console.log("📊 User found by Clerk ID:", !!databaseUserByClerkId);
      } catch (error) {
        console.error("❌ Error querying user by Clerk ID:", error);
      }
    }

    return NextResponse.json({
      success: true,
      debug: {
        clerk: {
          userId: clerkUserId,
          email: user?.emailAddresses[0]?.emailAddress,
          name: user?.fullName,
          hasUser: !!user,
        },
        jwt: {
          hasSessionClaims: !!sessionClaims,
          hasHasuraClaims: !!hasuraClaims,
          extractedDatabaseUserId: databaseUserId,
          clerkUserIdFromClaims: hasuraClaims?.["x-hasura-clerk-user-id"],
          defaultRole: hasuraClaims?.["x-hasura-default-role"],
          allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
        },
        database: {
          userFoundById: !!databaseUserById,
          userFoundByClerkId: !!databaseUserByClerkId,
          userByIdData: databaseUserById,
          userByClerkIdData: databaseUserByClerkId,
          databaseUserIdMatch: databaseUserById?.id === databaseUserId,
          clerkUserIdMatch: databaseUserByClerkId?.clerk_user_id === clerkUserId,
        },
        analysis: {
          expectedDatabaseUserId: "d9ac8a7b-f679-49a1-8c99-837eb977578b",
          actualDatabaseUserId: databaseUserId,
          idsMatch: databaseUserId === "d9ac8a7b-f679-49a1-8c99-837eb977578b",
          expectedClerkUserId: "user_2yU7Nspg9Nemmy1FdKE1SFIofms",
          actualClerkUserId: clerkUserId,
          clerkIdsMatch: clerkUserId === "user_2yU7Nspg9Nemmy1FdKE1SFIofms",
        }
      }
    });

  } catch (error: any) {
    console.error("❌ Debug auth error:", error);
    return NextResponse.json({
      error: "Debug failed",
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}