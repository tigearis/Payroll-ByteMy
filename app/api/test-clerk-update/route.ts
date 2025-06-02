import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return NextResponse.json({
      userId,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
      externalAccounts: user.externalAccounts?.map((acc) => ({
        provider: acc.provider,
        externalId: acc.externalId,
      })),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clerkClient();

    // Get current user
    const user = await client.users.getUser(userId);

    // Test update - set role to "Developer"
    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        role: "Developer",
        testUpdate: new Date().toISOString(),
      },
    });

    // Fetch updated user to verify
    const updatedUser = await client.users.getUser(userId);

    return NextResponse.json({
      success: true,
      message: "Test update successful",
      before: {
        role: user.publicMetadata?.role,
      },
      after: {
        role: updatedUser.publicMetadata?.role,
        testUpdate: updatedUser.publicMetadata?.testUpdate,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}
