import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    console.log("📋 API called: /api/staff/invitation-status");

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking invitation status for: ${email}`);

    const client = await clerkClient();

    // Get user by email address
    try {
      const users = await client.users.getUserList({
        emailAddress: [email],
      });

      if (users.data.length === 0) {
        return NextResponse.json({
          exists: false,
          onboardingComplete: false,
          invitationStatus: "not_sent",
          message: "User not found in Clerk",
        });
      }

      const user = users.data[0];
      const metadata = user.publicMetadata || {};

      return NextResponse.json({
        exists: true,
        userId: user.id,
        onboardingComplete: metadata.onboardingComplete || false,
        invitationStatus: metadata.invitationStatus || "unknown",
        invitationSentAt: metadata.invitationSentAt || null,
        onboardingCompletedAt: metadata.onboardingCompletedAt || null,
        needsResend: metadata.needsResend || false,
        metadata,
      });
    } catch (userError) {
      console.log("ℹ️ User not found in Clerk");
      return NextResponse.json({
        exists: false,
        onboardingComplete: false,
        invitationStatus: "not_sent",
        message: "User not found in Clerk",
      });
    }
  } catch (error) {
    console.error("❌ Error checking invitation status:", error);
    return NextResponse.json(
      {
        error: "Failed to check invitation status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("📧 API called: /api/staff/invitation-status (resend)");

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { email, name, role } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: "Email, name, and role are required" },
        { status: 400 }
      );
    }

    console.log(`📨 Resending invitation to: ${email}`);

    const client = await clerkClient();

    // Create a new invitation
    const invitation = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `https://payroll.app.bytemy.com.au/accept-invitation?firstName=${encodeURIComponent(
        name.split(" ")[0] || name
      )}&lastName=${encodeURIComponent(
        name.split(" ").slice(1).join(" ") || ""
      )}`,
      publicMetadata: {
        // Onboarding tracking
        onboardingComplete: false,
        invitationSent: true,
        invitationSentAt: new Date().toISOString(),
        isResend: true,
        resendCount: 1, // Could be incremented if tracking multiple resends

        // User role and permissions
        role: role,
        isStaff: true,

        // User information for prefilling
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ").slice(1).join(" ") || "",
        fullName: name,

        // Audit trail
        resentBy: userId,
        resentAt: new Date().toISOString(),
        source: "invitation_resend",

        // Track invitation status
        invitationStatus: "pending",
        needsResend: false,
      },
    });

    console.log(`✅ Invitation resent successfully: ${invitation.id}`);

    return NextResponse.json({
      success: true,
      message: "Invitation resent successfully",
      invitationId: invitation.id,
    });
  } catch (error) {
    console.error("❌ Error resending invitation:", error);
    return NextResponse.json(
      {
        error: "Failed to resend invitation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
