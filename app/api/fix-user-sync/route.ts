import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { syncUserWithDatabase } from "@/domains/users/services/user-sync";

/**
 * Manual user sync endpoint for fixing authentication issues
 * This endpoint manually syncs the current Clerk user with the database
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Manual user sync initiated");

    // Get current Clerk user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    console.log("👤 Found Clerk user:", {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName} ${user.lastName}`.trim(),
    });

    // Extract user information
    const email = user.emailAddresses[0]?.emailAddress;
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

    if (!email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Check if user has OAuth (Google) - auto-assign org_admin role
    const hasOAuth = user.externalAccounts && user.externalAccounts.length > 0;
    const defaultRole = hasOAuth ? "org_admin" : "developer"; // Default to developer for manual sync

    console.log("🔄 Syncing user with database:", {
      clerkId: user.id,
      name,
      email,
      role: defaultRole,
      hasOAuth,
    });

    // Sync user with database
    const databaseUser = await syncUserWithDatabase(
      user.id,
      name,
      email,
      defaultRole,
      undefined, // no manager
      user.imageUrl
    );

    if (databaseUser) {
      console.log("✅ User sync successful:", databaseUser);

      return NextResponse.json({
        success: true,
        message: "User successfully synced with database",
        user: {
          id: databaseUser.id,
          name: databaseUser.name,
          email: databaseUser.email,
          role: databaseUser.role,
          clerkId: user.id,
        },
      });
    } else {
      throw new Error("Failed to create or find database user");
    }
  } catch (error: any) {
    console.error("❌ Manual user sync failed:", error);

    return NextResponse.json(
      {
        error: "Failed to sync user",
        message: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check current user sync status
 */
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      clerkUser: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.publicMetadata?.role,
        databaseId: user.publicMetadata?.databaseId,
        hasOAuth: user.externalAccounts && user.externalAccounts.length > 0,
      },
      syncNeeded: !user.publicMetadata?.databaseId,
    });
  } catch (error: any) {
    console.error("❌ Error checking user sync status:", error);

    return NextResponse.json(
      {
        error: "Failed to check user status",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
