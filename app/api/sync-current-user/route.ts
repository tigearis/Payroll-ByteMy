// app/api/sync-current-user/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { syncUserWithDatabase } from "@/domains/users/services/user-sync";
import { withAuth } from "@/lib/auth/api-auth";

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

    // Sync the user with the database
    const databaseUser = await syncUserWithDatabase(
      userId,
      userName,
      userEmail,
      "viewer", // Default role
      undefined,
      user.imageUrl
    );

    if (databaseUser) {
      console.log(`✅ User synced successfully: ${databaseUser.name}`);
      return NextResponse.json({
        success: true,
        user: {
          id: databaseUser.id,
          name: databaseUser.name,
          email: databaseUser.email,
          role: databaseUser.role,
          clerkId: databaseUser.clerk_user_id,
        },
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
