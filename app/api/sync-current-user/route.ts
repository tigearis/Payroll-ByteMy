// app/api/sync-current-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { syncUserWithDatabase } from "@/lib/user-sync";

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ error: "User not found in Clerk" }, { status: 404 });
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
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
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}