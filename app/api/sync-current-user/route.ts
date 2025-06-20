import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
// app/api/sync-current-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { syncUserWithDatabase } from "@/lib/user-sync";
import { MetadataManager } from "@/lib/auth/metadata-manager.server";

async function handleSync(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = await auth();

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

    // Extract the user's current role from metadata, do not default to viewer
    const existingRole = MetadataManager.extractUserRole({
      publicMetadata: sessionClaims?.metadata,
    });

    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    const userName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    console.log(
      `🔄 Manual sync requested for user: ${userId} (${userEmail}) with role ${existingRole}`
    );

    // Sync the user with the database, preserving their existing role
    const databaseUser = await syncUserWithDatabase(
      userId,
      userName,
      userEmail,
      existingRole, // Pass the existing role
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
    return handleApiError(error, "sync-current-user");
  },
      { status: 500 }
    );
  }
}

// Export both GET and POST handlers
export const GET = handleSync;
export const POST = handleSync;
