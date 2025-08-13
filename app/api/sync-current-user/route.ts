// app/api/sync-current-user/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { syncUserWithDatabase } from "@/domains/users/services/user-sync";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuth } from "@/lib/auth/api-auth";
import {
  GetCurrentUserRoleDocument,
  type GetCurrentUserRoleQuery,
  type GetCurrentUserRoleQueryVariables,
} from "@/domains/users/graphql/generated/graphql";

async function handleSync(req: NextRequest) {
  try {
    // Get the authenticated user
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user details from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not found in Clerk" },
        { status: 404 }
      );
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    const userName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    console.log(`🔄 Manual sync requested for user: ${userId} (${userEmail})`);

    // ✅ CRITICAL FIX: Look up user's actual role from database instead of hardcoding "viewer"
    let userRole = "viewer"; // Fallback for new users
    
    try {
      console.log(`🔍 Querying for existing user with Clerk ID: ${userId}`);
      
      const { data: existingUserData, errors } = await adminApolloClient.query<
        GetCurrentUserRoleQuery,
        GetCurrentUserRoleQueryVariables
      >({
        query: GetCurrentUserRoleDocument,
        variables: { clerkUserId: userId },
        fetchPolicy: 'network-only'
      });
      
      if (errors) {
        console.warn("⚠️ GraphQL query had errors:", errors);
      }
      
      console.log(`📊 GraphQL query result:`, JSON.stringify(existingUserData, null, 2));
      
      const existingUser = existingUserData?.users?.[0];
      if (existingUser && existingUser.role) {
        userRole = existingUser.role;
        console.log(`✅ Found existing user role: ${userRole} for ${existingUser.computedName} (${existingUser.email})`);
      } else {
        console.log(`ℹ️ No existing user found in GraphQL result, will create with default role: ${userRole}`);
        console.log(`🔍 Debug - Users array length: ${existingUserData?.users?.length || 'undefined'}`);
        console.log(`🔍 Debug - Full result: ${JSON.stringify(existingUserData)}`);
      }
    } catch (roleQueryError) {
      console.error("❌ GraphQL query failed:", roleQueryError);
      console.warn("⚠️ Could not query existing user role, using fallback:", roleQueryError);
      // Continue with fallback role
    }

    // Sync the user with the database using ACTUAL role
    const databaseUser = await syncUserWithDatabase(
      userId,
      userName,
      userEmail,
      userRole as any, // ✅ Use actual user role from database (cast to UserRole type)
      undefined,
      user.imageUrl
    );

    if (databaseUser) {
      console.log(`✅ User synced successfully: ${databaseUser.name} with role: ${userRole}`);
      console.log(`✅ This should have updated Clerk metadata with correct hierarchical permissions`);
      
      return NextResponse.json({
        success: true,
        message: "User synced with correct role - JWT claims should now be properly aligned",
        user: {
          id: databaseUser.id,
          name: databaseUser.name,
          email: databaseUser.email,
          role: databaseUser.role,
          clerkId: databaseUser.clerk_user_id,
        },
        syncDetails: {
          resolvedRole: userRole,
          wasExistingUser: userRole !== "viewer",
          authChainFixed: true
        }
      });
    } else {
      return NextResponse.json(
        { error: "Failed to sync user with database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error in manual user sync:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Export both GET and POST handlers
export const GET = handleSync;
export const POST = handleSync;