import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { syncUserWithDatabase } from "@/lib/user-sync";
import { Role } from "@/types/enums";

export async function POST(req: NextRequest) {
  try {
    console.log("🔧 API called: /api/set-admin-role");

    const { userId } = await auth();

    if (!userId) {
      console.log("❌ No user ID found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log(`🔧 Setting developer role for user: ${userId}`);

    // Get user details from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user) {
      console.log("❌ User not found in Clerk");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use the Developer role which maps to "admin"
    const developerRole = "admin"; // "admin"

    console.log(`📝 Setting role: ${developerRole} for user: ${userId}`);

    // Set role in Clerk public metadata
    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        role: developerRole,
        isStaff: true,
        hasuraRole: developerRole, // Ensure this is set for JWT template
      },
      privateMetadata: {
        ...user.privateMetadata,
        hasuraRole: developerRole,
        lastRoleUpdateAt: new Date().toISOString(),
      },
    });

    console.log(`✅ Updated Clerk metadata with role: ${developerRole}`);

    // Sync with database - Developer role uses "admin" for database
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (primaryEmail) {
      await syncUserWithDatabase(
        userId,
        name,
        primaryEmail.emailAddress,
        developerRole as any, // This will be "admin"
        undefined,
        user.imageUrl
      );
      console.log(`✅ Synced user with database using role: ${developerRole}`);
    }

    console.log(`✅ Developer role set successfully for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message:
        "Developer role set successfully. Please sign out and sign back in for the changes to take effect.",
      user: {
        id: userId,
        role: developerRole,
        metadata: {
          role: developerRole,
          hasuraRole: developerRole,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error setting developer role:", error);
    return NextResponse.json(
      {
        error: "Failed to set developer role",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Add GET method for easier testing
export async function GET(req: NextRequest) {
  try {
    console.log("🔧 GET request to /api/set-admin-role");

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      message: "This endpoint is working. Use POST to set the developer role.",
      userId,
      availableRoles: Object.values(Role),
    });
  } catch (error) {
    console.error("❌ Error in GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
