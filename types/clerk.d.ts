/**
 * Clerk Type Extensions
 * 
 * This file extends Clerk's global types to provide custom typing
 * for user metadata used throughout the application.
 */

export {};

declare global {
  namespace Clerk {
    interface UserPublicMetadata {
      role: "developer" | "org_admin" | "manager" | "consultant" | "viewer";
      firstName?: string;
      lastName?: string;
      managerId?: string;
      databaseId?: string;
      permissions: string[];
      allowedRoles: ("developer" | "org_admin" | "manager" | "consultant" | "viewer")[];
      // Invitation-specific metadata
      invitationMessage?: string;
      resendOfInvitation?: string;
      originalInvitationDate?: string;
    }

    interface UserPrivateMetadata {
      // Add any private metadata fields here if needed
    }

    interface UserUnsafeMetadata {
      // Add any unsafe metadata fields here if needed
    }

    interface OrganizationPublicMetadata {
      // Add organization metadata fields here if needed
    }

    interface OrganizationPrivateMetadata {
      // Add organization private metadata fields here if needed
    }
  }
}