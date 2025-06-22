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

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users(limit: 20) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      is_active
      created_at
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Starting comprehensive user debug...");

    // Get auth info
    const { userId: clerkUserId, sessionClaims } = await auth();
    const user = await currentUser();

    // Extract database user ID from JWT claims
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const databaseUserId = hasuraClaims?.["x-hasura-user-id"];

    console.log("📊 Auth Status:", {
      clerkUserId,
      databaseUserId,
      expectedDatabaseUserId: "d9ac8a7b-f679-49a1-8c99-837eb977578b",
      expectedClerkUserId: "user_2yU7Nspg9Nemmy1FdKE1SFIofms",
    });

    let results = {
      auth: {
        clerkUserId,
        databaseUserId,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.fullName,
        hasSessionClaims: !!sessionClaims,
        hasHasuraClaims: !!hasuraClaims,
        defaultRole: hasuraClaims?.["x-hasura-default-role"],
        allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
      },
      database: {
        userFoundById: null,
        userFoundByClerkId: null,
        allUsers: null,
        errors: [],
      }
    };

    // Try to find user by database ID
    if (databaseUserId) {
      try {
        const { data } = await adminApolloClient.query({
          query: GET_USER_BY_ID,
          variables: { id: databaseUserId },
          fetchPolicy: "network-only",
        });
        results.database.userFoundById = data?.users_by_pk;
        console.log("✅ Database query by ID successful");
      } catch (error: any) {
        console.error("❌ Error querying user by database ID:", error);
        results.database.errors.push({
          type: "query_by_id",
          message: error.message,
          details: error.graphQLErrors || error.networkError,
        });
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
        results.database.userFoundByClerkId = data?.users?.[0];
        console.log("✅ Database query by Clerk ID successful");
      } catch (error: any) {
        console.error("❌ Error querying user by Clerk ID:", error);
        results.database.errors.push({
          type: "query_by_clerk_id",
          message: error.message,
          details: error.graphQLErrors || error.networkError,
        });
      }
    }

    // Get all users for debugging
    try {
      const { data } = await adminApolloClient.query({
        query: GET_ALL_USERS,
        fetchPolicy: "network-only",
      });
      results.database.allUsers = data?.users || [];
      console.log(`✅ Found ${results.database.allUsers.length} total users in database`);
    } catch (error: any) {
      console.error("❌ Error querying all users:", error);
      results.database.errors.push({
        type: "query_all_users",
        message: error.message,
        details: error.graphQLErrors || error.networkError,
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      debug: results,
      analysis: {
        clerkUserExists: !!user,
        databaseUserExistsById: !!results.database.userFoundById,
        databaseUserExistsByClerkId: !!results.database.userFoundByClerkId,
        jwtClaimsValid: !!databaseUserId,
        expectedUserFound: databaseUserId === "d9ac8a7b-f679-49a1-8c99-837eb977578b" && !!results.database.userFoundById,
        possibleIssues: [
          !databaseUserId && "JWT claims missing database user ID",
          databaseUserId && !results.database.userFoundById && "Database user not found by ID",
          clerkUserId && !results.database.userFoundByClerkId && "Database user not found by Clerk ID",
          results.database.errors.length > 0 && "Database query errors occurred",
        ].filter(Boolean),
      }
    });

  } catch (error: any) {
    console.error("❌ Debug endpoint error:", error);
    return NextResponse.json({
      error: "Debug failed",
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}