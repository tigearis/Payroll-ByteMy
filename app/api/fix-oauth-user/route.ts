import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, _NextResponse } from "next/server";

import { _syncUserWithDatabase } from "@/domains/users/services/user-sync";

export async function POST(req: NextRequest) {
  try {
    console.log("🔧 API called: /api/fix-oauth-user");

    const { _userId } = await auth();
    const body = await req.json().catch(() => ({}));
    const targetUserId = body.targetUserId || userId; // Allow fixing specific users

    if (!targetUserId) {
      console.log("❌ No user ID found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log(`🔧 Fixing OAuth user metadata for: ${targetUserId}`);

    // Get user details from Clerk
    const client = await clerkClient();
    const _user = await client.users.getUser(targetUserId);

    if (!_user) {
      console.log("❌ User not found in Clerk");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if this is an OAuth user
    const hasOAuthProvider =
      user.externalAccounts && user.externalAccounts.length > 0;
    const oauthProvider = hasOAuthProvider
      ? user.externalAccounts[0].provider
      : null;

    console.log(`🔍 User analysis:`, {
      userId: targetUserId,
      hasOAuth: hasOAuthProvider,
      provider: oauthProvider,
      currentPublicMetadata: user.publicMetadata,
      currentPrivateMetadata: user.privateMetadata,
    });

    // For OAuth users, ensure they have Developer role (maps to "org_admin" value)
    // For specific problematic users, always set to org_admin regardless
    const isProblematicUser =
      targetUserId === "user_2uCU9pKf7RP2FiORHJVM5IH0Pd1";
    const shouldBeAdmin = hasOAuthProvider || isProblematicUser;
    const targetRole = shouldBeAdmin ? "org_admin" : "viewer"; // Use org_admin for consistency
    const displayName = shouldBeAdmin ? "Developer" : "Viewer";

    console.log(`📝 Setting role to: ${displayName} (value: ${targetRole})`);

    // Clean up metadata - remove any conflicting role fields
    const cleanPublicMetadata = { ...user.publicMetadata };
    const cleanPrivateMetadata = { ...user.privateMetadata };

    // Remove old hasuraRole fields if they exist
    delete (cleanPublicMetadata as any).hasuraRole;
    delete (cleanPrivateMetadata as any).hasuraRole;

    // Update Clerk metadata with the correct role
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        ...cleanPublicMetadata,
        role: targetRole, // Set the actual role value: "org_admin" or "viewer"
      },
      privateMetadata: {
        ...cleanPrivateMetadata,
        lastFixedAt: new Date().toISOString(),
        fixReason: shouldBeAdmin
          ? "OAuth user or problematic user -> org_admin"
          : "Regular user -> viewer",
      },
    });

    console.log(`✅ Updated Clerk metadata with role: ${targetRole}`);

    // Now sync with database to ensure consistency
    console.log("🔄 Syncing with database...");

    // Prepare user data for database sync
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      "Unknown User";
    const primaryEmail = user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    );

    if (primaryEmail) {
      await syncUserWithDatabase(
        targetUserId,
        name,
        primaryEmail.emailAddress,
        targetRole as any, // Cast to UserRole type
        undefined, // managerId - not needed for OAuth fix
        user.imageUrl
      );
      console.log(`✅ Synced user with database using role: ${targetRole}`);
    } else {
      console.warn("⚠️ No primary email found, skipping database sync");
    }

    // Get the updated user to verify the fix
    const updatedUser = await client.users.getUser(targetUserId);
    const finalRole = updatedUser.publicMetadata?.role;
    const finalDisplayName =
      finalRole === "org_admin"
        ? "Developer"
        : finalRole === "manager"
          ? "Manager"
          : finalRole === "consultant"
            ? "Consultant"
            : "Viewer";

    console.log(`✅ OAuth user fix completed:`, {
      userId: targetUserId,
      provider: oauthProvider,
      finalRole,
      displayName: finalDisplayName,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully updated user role to ${finalDisplayName}`,
      user: {
        id: targetUserId,
        role: finalRole,
        displayName: finalDisplayName,
        provider: oauthProvider,
        wasOAuth: hasOAuthProvider,
        wasProblematic: isProblematicUser,
      },
      instructions: [
        "✅ Clerk metadata updated",
        "✅ Database synced",
        "🔄 Please refresh your browser to see the changes",
        "🧪 Test by visiting /developer, /users, or /staff pages",
      ],
    });
  } catch (_error) {
    console.error("❌ Error fixing OAuth user:", _error);
    return NextResponse.json(
      {
        error: "Failed to fix OAuth user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { _userId } = await auth();

    if (!_userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clerkClient();
    const _user = await client.users.getUser(_userId);

    const hasOAuthProvider =
      user.externalAccounts && user.externalAccounts.length > 0;
    const oauthProvider = hasOAuthProvider
      ? user.externalAccounts[0].provider
      : null;

    const currentRole = user.publicMetadata?.role || "viewer"; // This is the actual role value
    const hasuraRole = currentRole === "org_admin" ? "org_admin" : "viewer"; // Map role value to Hasura role
    const displayName =
      currentRole === "org_admin"
        ? "Developer"
        : currentRole === "manager"
          ? "Manager"
          : currentRole === "consultant"
            ? "Consultant"
            : "Viewer";
    const needsFix =
      !user.publicMetadata?.role ||
      (hasOAuthProvider && currentRole === "viewer");

    return NextResponse.json({
      _userId,
      currentRole, // Actual role value: "org_admin", "manager", "consultant", "viewer"
      displayName, // Display name: "Developer", "Manager", "Consultant", "Viewer"
      hasuraRole, // Hasura role: "org_admin" or "viewer"
      isOAuth: hasOAuthProvider,
      provider: oauthProvider,
      needsFix,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
    });
  } catch (_error) {
    console.error("Error checking OAuth status:", _error);
    return NextResponse.json(
      { error: "Failed to check OAuth status" },
      { status: 500 }
    );
  }
}
