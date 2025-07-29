// Removed useUser import - not needed in server route
import { NextRequest, NextResponse } from "next/server";
import {
  GetUserByClerkIdDocument,
  type GetUserByClerkIdQuery,
  UpdateUserProfileDocument,
  type UpdateUserProfileMutation,
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface ProfileResponse {
  success: boolean;
  user?: any;
  message?: string;
  error?: string;
}

export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    // Get user profile by Clerk user ID
    const userData = await executeTypedQuery<GetUserByClerkIdQuery>(
      GetUserByClerkIdDocument,
      { clerkUserId: session.userId }
    );

    const user = userData.users[0];
    if (!user) {
      return NextResponse.json<ProfileResponse>(
        { success: false, error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ProfileResponse>({
      success: true,
      user: {
        id: user.id,
        name: user.computedName || `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: (user as any).phone || null,
        address: (user as any).address || null,
        bio: (user as any).bio || null,
        role: user.role,
        isActive: user.isActive,
        createdAt: (user as any).createdAt || null,
        managerUser: (user as any).managerUser ? {
          id: (user as any).managerUser.id,
          name: (user as any).managerUser.name,
          email: (user as any).managerUser.email,
        } : null,
      },
    });

  } catch (error: any) {
    console.error("Get user profile error:", error);

    return NextResponse.json<ProfileResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (req: NextRequest, session) => {
  try {
    const body: UpdateProfileRequest = await req.json();
    
    // Get current user first
    const userData = await executeTypedQuery<GetUserByClerkIdQuery>(
      GetUserByClerkIdDocument,
      { clerkUserId: session.userId }
    );

    const user = userData.users[0];
    if (!user) {
      return NextResponse.json<ProfileResponse>(
        { success: false, error: "User profile not found" },
        { status: 404 }
      );
    }

    // Update user profile
    const updatedUserData = await executeTypedMutation<UpdateUserProfileMutation>(
      UpdateUserProfileDocument,
      {
        id: user.id,
        input: {
          name: body.name || user.computedName || `${user.firstName} ${user.lastName}`.trim(),
          phone: body.phone !== undefined ? body.phone : (user as any).phone,
          address: body.address !== undefined ? body.address : (user as any).address,
          bio: body.bio !== undefined ? body.bio : (user as any).bio,
        },
      }
    );

    const updatedUser = updatedUserData.updateUserById;

    if (!updatedUser) {
      return NextResponse.json<ProfileResponse>(
        { success: false, error: "Failed to update user profile" },
        { status: 500 }
      );
    }

    console.log(`✅ Profile updated successfully for user: ${user.id}`);

    return NextResponse.json<ProfileResponse>({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.computedName || `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        bio: updatedUser.bio,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        updatedAt: updatedUser.updatedAt,
      },
      message: "Profile updated successfully",
    });

  } catch (error: any) {
    console.error("Update user profile error:", error);

    return NextResponse.json<ProfileResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});