import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  ApiResponses,
  validateRequiredFields,
  handleApiError,
} from "@/lib/api-responses";

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  unsafeMetadata?: {
    bio?: string;
    location?: string;
    company?: string;
    website?: string;
    phone?: string;
    [key: string]: any;
  };
}

export async function PATCH(req: NextRequest) {
  console.log("API: Starting profile update request");

  try {
    const { userId } = await auth();
    console.log("API: User ID:", userId);

    if (!userId) {
      console.log("API: No user ID found, returning 401");
      return ApiResponses.authenticationRequired();
    }

    let updateData: UpdateProfileRequest;
    try {
      updateData = await req.json();
      console.log("API: Request data:", updateData);
    } catch (jsonError) {
      console.error("API: Failed to parse JSON:", jsonError);
      return ApiResponses.badRequest("Invalid JSON in request body");
    }

    // Validate the request
    if (!updateData || typeof updateData !== "object") {
      return ApiResponses.badRequest("Invalid request data");
    }

    let client;
    try {
      client = await clerkClient();
      console.log("API: Clerk client created successfully");
    } catch (clerkClientError) {
      console.error("API: Failed to create Clerk client:", clerkClientError);
      return ApiResponses.serverError(
        "Failed to initialize authentication service"
      );
    }

    // Get current user to compare changes
    let currentUser;
    try {
      currentUser = await client.users.getUser(userId);
      console.log("API: Current user fetched:", {
        id: currentUser.id,
        username: currentUser.username,
      });
    } catch (getUserError) {
      console.error("API: Failed to get current user:", getUserError);
      return ApiResponses.serverError("Failed to fetch current user data");
    }

    // Prepare update payload for Clerk
    const clerkUpdatePayload: any = {};

    // Handle first name
    if (updateData.firstName !== undefined) {
      const trimmedFirstName = updateData.firstName.trim();
      if (trimmedFirstName !== currentUser.firstName) {
        clerkUpdatePayload.firstName = trimmedFirstName;
      }
    }

    // Handle last name
    if (updateData.lastName !== undefined) {
      const trimmedLastName = updateData.lastName.trim();
      if (trimmedLastName !== currentUser.lastName) {
        clerkUpdatePayload.lastName = trimmedLastName;
      }
    }

    // Handle username with validation
    if (updateData.username !== undefined) {
      const trimmedUsername = updateData.username?.trim() || null;

      // Allow null/empty username (user can clear their username)
      if (trimmedUsername !== currentUser.username) {
        if (trimmedUsername) {
          // Only validate if username is not null/empty
          const usernameRegex = /^[a-zA-Z0-9_-]+$/;
          if (!usernameRegex.test(trimmedUsername)) {
            return ApiResponses.invalidInput(
              "username",
              "Username can only contain letters, numbers, underscores, and hyphens"
            );
          }

          if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
            return ApiResponses.invalidInput(
              "username",
              "Username must be between 3 and 30 characters long"
            );
          }
        }

        clerkUpdatePayload.username = trimmedUsername;
      }
    }

    // Handle unsafe metadata (bio, location, company, website, etc.)
    if (
      updateData.unsafeMetadata &&
      typeof updateData.unsafeMetadata === "object"
    ) {
      const currentMetadata = currentUser.unsafeMetadata || {};
      const newMetadata = { ...currentMetadata };
      let metadataChanged = false;

      // Update each metadata field if provided
      Object.keys(updateData.unsafeMetadata).forEach((key) => {
        const newValue = updateData.unsafeMetadata![key];
        if (newValue !== currentMetadata[key]) {
          newMetadata[key] = newValue;
          metadataChanged = true;
        }
      });

      if (metadataChanged) {
        clerkUpdatePayload.unsafeMetadata = newMetadata;
      }
    }

    // Only make API call if there are actual changes
    if (Object.keys(clerkUpdatePayload).length === 0) {
      return ApiResponses.success(
        {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          username: currentUser.username,
          unsafeMetadata: currentUser.unsafeMetadata,
        },
        "No changes detected"
      );
    }

    try {
      // Update user using Clerk Backend API
      const updatedUser = await client.users.updateUser(
        userId,
        clerkUpdatePayload
      );

      return ApiResponses.updated(
        {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          username: updatedUser.username,
          emailAddress: updatedUser.primaryEmailAddress?.emailAddress,
          imageUrl: updatedUser.imageUrl,
          unsafeMetadata: updatedUser.unsafeMetadata,
          changes: Object.keys(clerkUpdatePayload),
        },
        "Profile updated successfully"
      );
    } catch (clerkError: any) {
      console.error("Clerk API error:", clerkError);

      // Handle specific Clerk errors
      if (clerkError.errors && Array.isArray(clerkError.errors)) {
        const errorMessages = clerkError.errors.map((err: any) => ({
          field: err.meta?.paramName || "unknown",
          message: err.message || err.longMessage || "Unknown error",
        }));

        // Check for username-specific errors
        const usernameError = errorMessages.find(
          (err: any) =>
            err.field === "username" ||
            err.message.toLowerCase().includes("username")
        );

        if (usernameError) {
          return ApiResponses.duplicateResource("Username", "username");
        }

        // Return all validation errors
        return ApiResponses.validationError(
          errorMessages.map((err: { field: string; message: string }) => ({
            field: err.field,
            message: err.message,
            code: "CLERK_VALIDATION_ERROR",
          }))
        );
      }

      // Generic Clerk error
      return ApiResponses.serverError("Failed to update profile in Clerk", {
        message: clerkError.message || "Unknown Clerk error",
      });
    }
  } catch (error) {
    return handleApiError(error, "update-profile");
  }
}

// GET endpoint to fetch current user profile
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return ApiResponses.authenticationRequired();
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return ApiResponses.success({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      emailAddress: user.primaryEmailAddress?.emailAddress,
      imageUrl: user.imageUrl,
      unsafeMetadata: user.unsafeMetadata,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
    });
  } catch (error) {
    return handleApiError(error, "get-user-profile");
  }
}
