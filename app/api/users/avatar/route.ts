import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface UploadAvatarResponse {
  success: boolean;
  imageUrl?: string;
  message?: string;
  error?: string;
}

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
    };
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  return { isValid: true };
}

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const formData = await req.formData();
    const file = formData.get('avatar') as File;
    const targetUserId = formData.get('targetUserId') as string | null;

    if (!file) {
      return NextResponse.json<UploadAvatarResponse>(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Determine which user's avatar to update
    const userIdToUpdate = targetUserId || session.userId || 'anonymous';
    
    // If updating another user's avatar, check permissions
    if (targetUserId && targetUserId !== session.userId) {
      const currentUserRole = req.headers.get('x-user-role') || 'viewer';
      const allowedRoles = ['manager', 'org_admin', 'developer'];
      
      if (!allowedRoles.includes(currentUserRole)) {
        return NextResponse.json<UploadAvatarResponse>(
          { 
            success: false, 
            error: "You do not have permission to update other users' avatars. Manager role or higher required." 
          },
          { status: 403 }
        );
      }
      
      console.log(`👑 Admin ${session.userId} (${currentUserRole}) updating avatar for user: ${targetUserId}`);
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json<UploadAvatarResponse>(
        { success: false, ...(validation.error && { error: validation.error }) },
        { status: 400 }
      );
    }

    console.log(`📷 Uploading avatar for user: ${userIdToUpdate}`);
    console.log(`File details: ${file.name}, ${file.type}, ${file.size} bytes`);

    try {
      // Convert file to base64 for Clerk upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      // Upload to Clerk for the target user
      const updatedUser = await clerkClient.users.updateUser(userIdToUpdate, {
        profileImageID: dataUrl,
      });

      const imageUrl = updatedUser.imageUrl;

      console.log(`✅ Avatar uploaded successfully for user: ${userIdToUpdate}`);
      console.log(`New image URL: ${imageUrl}`);

      return NextResponse.json<UploadAvatarResponse>({
        success: true,
        imageUrl,
        message: "Avatar updated successfully",
      });

    } catch (clerkError: any) {
      console.error("Failed to upload avatar to Clerk:", clerkError);
      
      // Handle specific Clerk errors
      if (clerkError.status === 422) {
        return NextResponse.json<UploadAvatarResponse>(
          { 
            success: false, 
            error: "Invalid image format or size. Please try a different image." 
          },
          { status: 400 }
        );
      }

      return NextResponse.json<UploadAvatarResponse>(
        { 
          success: false, 
          error: `Failed to upload avatar: ${clerkError.message}` 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Avatar upload error:", error);

    return NextResponse.json<UploadAvatarResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('targetUserId');
    
    // Determine which user's avatar to remove
    const userIdToUpdate = targetUserId || session.userId || 'anonymous';
    
    // If removing another user's avatar, check permissions
    if (targetUserId && targetUserId !== session.userId) {
      const currentUserRole = req.headers.get('x-user-role') || 'viewer';
      const allowedRoles = ['manager', 'org_admin', 'developer'];
      
      if (!allowedRoles.includes(currentUserRole)) {
        return NextResponse.json<UploadAvatarResponse>(
          { 
            success: false, 
            error: "You do not have permission to remove other users' avatars. Manager role or higher required." 
          },
          { status: 403 }
        );
      }
      
      console.log(`👑 Admin ${session.userId} (${currentUserRole}) removing avatar for user: ${targetUserId}`);
    }

    console.log(`🗑️ Removing avatar for user: ${userIdToUpdate}`);

    // Remove avatar from Clerk
    const updatedUser = await clerkClient.users.updateUser(userIdToUpdate, {
      profileImageID: "", // Empty string removes the avatar
    });

    console.log(`✅ Avatar removed successfully for user: ${userIdToUpdate}`);

    return NextResponse.json<UploadAvatarResponse>({
      success: true,
      message: "Avatar removed successfully",
    });

  } catch (clerkError: any) {
    console.error("Failed to remove avatar from Clerk:", clerkError);
    
    return NextResponse.json<UploadAvatarResponse>(
      { 
        success: false, 
        error: `Failed to remove avatar: ${clerkError.message}` 
      },
      { status: 500 }
    );
  }
});