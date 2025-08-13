// lib/user-sync.ts
import { DocumentNode } from "@apollo/client";
import { clerkClient } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { 
  getHierarchicalPermissionsFromDatabase,
  syncUserRoleAssignmentsHierarchical,
  type UserRole as HierarchicalUserRole
} from "@/lib/permissions/hierarchical-permissions";
import {
  GetUserByEmailUserSyncDocument,
  GetUserByEmailUserSyncQuery,
  GetUserByEmailUserSyncQueryVariables,
  GetUserByClerkIdUserSyncDocument,
  GetUserByClerkIdUserSyncQuery,
  GetUserByClerkIdUserSyncQueryVariables,
  UpsertUserUserSyncDocument,
  UpsertUserUserSyncMutation,
  UpsertUserUserSyncMutationVariables,
  UpdateUserRoleUserSyncDocument,
  UpdateUserRoleUserSyncMutation,
  UpdateUserRoleUserSyncMutationVariables,
  UpdateUserClerkIdUserSyncDocument,
  UpdateUserClerkIdUserSyncMutation,
  UpdateUserClerkIdUserSyncMutationVariables,
  UpdateUserImageUserSyncDocument,
  UpdateUserImageUserSyncMutation,
  UpdateUserImageUserSyncMutationVariables,
  DeleteUserByClerkIdUserSyncDocument,
  DeleteUserByClerkIdUserSyncMutation,
  DeleteUserByClerkIdUserSyncMutationVariables
} from "../graphql/generated/graphql";

// Define user role hierarchy for permission checking
// These must match the Hasura database enum values exactly
export const USER_ROLES = {
  developer: 5, // Developers - highest level
  org_admin: 4, // Standard Admins
  manager: 3,
  consultant: 2,
  viewer: 1,
} as const;

export type UserRole = keyof typeof USER_ROLES;


// Utility function to convert arrays to comma-separated strings for Hasura compatibility
// Hasura v2.0+ supports arrays for x-hasura-allowed-roles but not for other claims
function arrayToString(arr: string[]): string {
  return arr.join(',');
}

// Utility function to convert boolean to string for Hasura compatibility
// Hasura expects string values for all claims except x-hasura-allowed-roles
function booleanToString(value: boolean | null | undefined): string {
  return String(Boolean(value));
}

// GraphQL operations now imported from generated types






// Enhanced user sync function with better error handling
export async function syncUserWithDatabase(
  clerkId: string,
  fullName: string,
  email: string,
  role: UserRole = "viewer",
  managerId?: string,
  imageUrl?: string,
  isStaff?: boolean // Remove default value - will be calculated if not provided
) {
  try {
    console.log(`🔄 Syncing user with database: ${clerkId} (${email})`);

    // Determine staff status if not explicitly provided
    // Manager, org_admin, and developer roles are considered staff
    const finalIsStaff = isStaff !== undefined ? isStaff : 
      ["manager", "org_admin", "developer"].includes(role);
    
    console.log(`📋 Staff status determined: ${finalIsStaff} (role: ${role}, explicit: ${isStaff !== undefined})`);

    // Get user data from Clerk to ensure we have the latest imageUrl
    let clerkImageUrl = imageUrl;
    if (!clerkImageUrl) {
      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(clerkId);
        
        // Use the helper function to prioritize external accounts avatar over image URL
        clerkImageUrl = getBestAvatarUrl({
          external_accounts: clerkUser.externalAccounts,
          image_url: clerkUser.imageUrl
        });
      } catch (error) {
        console.warn("Could not fetch image from Clerk:", error);
      }
    }

    // First, check if user exists by Clerk ID
    const { data: userData, errors: queryErrors } =
      await adminApolloClient.query<GetUserByClerkIdUserSyncQuery, GetUserByClerkIdUserSyncQueryVariables>({
        query: GetUserByClerkIdUserSyncDocument,
        variables: { clerkId },
        fetchPolicy: "network-only",
        errorPolicy: "all",
      });

    if (queryErrors) {
      console.warn("GraphQL query errors:", queryErrors);
    }

    let databaseUser = userData?.users?.[0] || null;

    // If no user found by Clerk ID, check by email
    if (!databaseUser && email) {
      console.log(`🔍 No user found by Clerk ID, checking by email: ${email}`);

      const { data: emailUserData, errors: emailQueryErrors } =
        await adminApolloClient.query<GetUserByEmailUserSyncQuery, GetUserByEmailUserSyncQueryVariables>({
          query: GetUserByEmailUserSyncDocument,
          variables: { email },
          fetchPolicy: "network-only",
          errorPolicy: "all",
        });

      if (emailQueryErrors) {
        console.warn("Email query errors:", emailQueryErrors);
      }

      const existingUserByEmail = emailUserData?.users?.[0];

      if (existingUserByEmail) {
        console.log(
          `✅ Found existing user by email, updating with Clerk ID: ${existingUserByEmail.computedName || `${existingUserByEmail.firstName || ''} ${existingUserByEmail.lastName || ''}`.trim() || 'Unknown User'}`
        );

        // Update the existing user with the Clerk ID
        const { data: updateData, errors: updateErrors } =
          await adminApolloClient.mutate<UpdateUserClerkIdUserSyncMutation, UpdateUserClerkIdUserSyncMutationVariables>({
            mutation: UpdateUserClerkIdUserSyncDocument,
            variables: {
              id: existingUserByEmail.id,
              clerkId,
            },
            errorPolicy: "all",
          });

        if (updateErrors) {
          console.error("Clerk ID update errors:", updateErrors);
          throw new Error(
            `Failed to update user with Clerk ID: ${updateErrors
              .map(e => e.message)
              .join(", ")}`
          );
        }

        databaseUser = updateData?.updateUsersByPk;
        console.log("✅ Updated existing user with Clerk ID:", databaseUser);
      }
    }

    // If still no user found, create a new one
    if (!databaseUser && fullName && email) {
      // Parse fullName into firstName and lastName
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
      
      console.log(
        `📝 Creating new user in database: ${fullName} (${email}) with role: ${role}, staff: ${finalIsStaff}`
      );

      const { data: newUserData, errors: mutationErrors } =
        await adminApolloClient.mutate<UpsertUserUserSyncMutation, UpsertUserUserSyncMutationVariables>({
          mutation: UpsertUserUserSyncDocument,
          variables: {
            clerkId,
            firstName,
            lastName,
            email,
            role,
            isStaff: finalIsStaff,
            managerId: managerId || null,
            image: clerkImageUrl || null,
          },
          errorPolicy: "all",
        });

      if (mutationErrors) {
        console.error("User creation errors:", mutationErrors);
        throw new Error(
          `Failed to create user: ${mutationErrors
            .map(e => e.message)
            .join(", ")}`
        );
      }

      databaseUser = newUserData?.insertUsersOne;
      console.log("✅ Created new user in database:", databaseUser);
    } else if (
      databaseUser &&
      clerkImageUrl &&
      databaseUser.image !== clerkImageUrl
    ) {
      // Update existing user's image if it's different
      console.log(`🖼️ Updating user image: ${databaseUser.computedName}`);

      const { data: updateImageData, errors: updateImageErrors } =
        await adminApolloClient.mutate<UpdateUserImageUserSyncMutation, UpdateUserImageUserSyncMutationVariables>({
          mutation: UpdateUserImageUserSyncDocument,
          variables: {
            id: databaseUser.id,
            image: clerkImageUrl,
          },
          errorPolicy: "all",
        });

      if (updateImageErrors) {
        console.warn("Image update errors:", updateImageErrors);
      } else {
        databaseUser = updateImageData?.updateUsersByPk || databaseUser;
        console.log("✅ Updated user image in database");
      }
    } else if (databaseUser) {
      console.log(
        `✅ Found existing user in database: ${databaseUser.computedName} (${databaseUser.role})`
      );
    }

    // ✅ CRITICAL: Always update Clerk metadata with database UUID
    if (databaseUser?.id && databaseUser?.role) {
      const client = await clerkClient();

      try {
        // Get current metadata to preserve other fields
        const currentUser = await client.users.getUser(clerkId);

        // ✅ Sync user role assignments to userroles table
        await syncUserRoleAssignmentsHierarchical(databaseUser.id, databaseUser.role);

        // ✅ Get hierarchical permissions from database (role + exclusions)
        const permissionData = await getHierarchicalPermissionsFromDatabase(databaseUser.id);
        
        // ✅ CRITICAL: Structure metadata for hierarchical JWT template 
        const updatedPublicMetadata = {
          ...currentUser.publicMetadata,
          role: databaseUser.role,
          databaseId: databaseUser.id, // ✅ CRITICAL: Database UUID for JWT x-hasura-user-id
          isStaff: booleanToString(databaseUser.isStaff), // ✅ Convert boolean to string for Hasura
          managerId: databaseUser.managerId || '', // ✅ Convert null to empty string for Hasura
          allowedRoles: permissionData.allowedRoles, // ✅ Keep as array for JWT template without quotes
          excludedPermissions: arrayToString(permissionData.excludedPermissions), // ✅ Convert to string for Hasura compatibility
          permissionHash: permissionData.permissionHash, // ✅ For x-hasura-permission-hash (role + exclusions)
          permissionVersion: permissionData.permissionVersion, // ✅ For x-hasura-permission-version
          organizationId: '', // ✅ For x-hasura-org-id (future multi-tenancy) - must be string not null
          lastSyncAt: new Date().toISOString(),
        };

        // ✅ CRITICAL: Keep private metadata minimal (sensitive data only)
        const updatedPrivateMetadata = {
          ...currentUser.privateMetadata,
          lastSyncAt: new Date().toISOString(),
          syncVersion: Date.now(), // Version for debugging
          syncSource: "database", // Track sync source
        };

        await client.users.updateUser(clerkId, {
          publicMetadata: updatedPublicMetadata,
          privateMetadata: updatedPrivateMetadata,
        });

        // ✅ VERIFY the update worked
        const verifyUser = await client.users.getUser(clerkId);
        const savedDatabaseId = verifyUser.publicMetadata?.databaseId;

        if (savedDatabaseId !== databaseUser.id) {
          console.error(`❌ SYNC VERIFICATION FAILED!`);
          console.error(`Expected: ${databaseUser.id}`);
          console.error(`Got: ${savedDatabaseId}`);
          throw new Error("Clerk metadata sync verification failed");
        }

        console.log(
          `✅ Verified Clerk metadata sync: databaseId = ${savedDatabaseId}`
        );
        console.log(
          `✅ Updated Clerk metadata with role: ${databaseUser.role}, ${permissionData.excludedPermissions.length} exclusions, allowedRoles: ${permissionData.allowedRoles.join(', ')}`
        );
      } catch (clerkError) {
        console.error(
          "❌ CRITICAL: Failed to update Clerk metadata:",
          clerkError
        );
        // Don't throw here - database user exists, just metadata sync failed
        // This allows the system to work with partial functionality
      }
    } else {
      console.warn(
        "⚠️ No valid database user found or created - skipping Clerk metadata update"
      );
    }

    return databaseUser;
  } catch (error) {
    console.error("❌ Error syncing user with database:", error);
    throw error;
  }
}

// Function to update user role in both database and Clerk
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  updatedById: string,
  managerId?: string,
  isStaff?: boolean
) {
  try {
    console.log(`🔄 Updating user role: ${userId} to ${newRole}`);

    // Get the user being updated
    const { data: userData } = await adminApolloClient.query<GetUserByClerkIdUserSyncQuery, GetUserByClerkIdUserSyncQueryVariables>({
      query: GetUserByClerkIdUserSyncDocument,
      variables: { clerkId: userId },
      fetchPolicy: "network-only",
    });

    const databaseUser = userData?.users?.[0];
    if (!databaseUser) {
      throw new Error("User not found in database");
    }

    // Update role in database
    const { data: updateData, errors } = await adminApolloClient.mutate<UpdateUserRoleUserSyncMutation, UpdateUserRoleUserSyncMutationVariables>({
      mutation: UpdateUserRoleUserSyncDocument,
      variables: {
        id: databaseUser.id,
        role: newRole,
        managerId: managerId || null,
        isStaff: isStaff !== undefined ? isStaff : databaseUser.isStaff,
      },
      errorPolicy: "all",
    });

    if (errors) {
      console.error("Role update errors:", errors);
      throw new Error(
        `Failed to update role: ${errors.map(e => e.message).join(", ")}`
      );
    }

    const updatedUser = updateData?.updateUsersByPk;

    // Update Clerk metadata using consistent structure
    if (updatedUser) {
      const client = await clerkClient();

      // ✅ Sync user role assignments to userroles table
      await syncUserRoleAssignmentsHierarchical(updatedUser.id, updatedUser.role);

      // ✅ Get hierarchical permissions from database (role + exclusions)
      const permissionData = await getHierarchicalPermissionsFromDatabase(updatedUser.id);

      // Get current user to preserve existing metadata
      const currentUser = await client.users.getUser(userId);
      
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...currentUser.publicMetadata,
          role: updatedUser.role,
          databaseId: updatedUser.id,
          isStaff: booleanToString(updatedUser.isStaff), // ✅ Convert boolean to string for Hasura
          managerId: updatedUser.managerId || '', // ✅ Convert null to empty string for Hasura
          allowedRoles: permissionData.allowedRoles, // ✅ Keep as array for JWT template without quotes
          excludedPermissions: arrayToString(permissionData.excludedPermissions), // ✅ Convert to string for Hasura compatibility
          permissionHash: permissionData.permissionHash, // ✅ For x-hasura-permission-hash (role + exclusions)
          permissionVersion: permissionData.permissionVersion, // ✅ For x-hasura-permission-version
          organizationId: '', // ✅ For x-hasura-org-id - must be string not null
          lastRoleUpdateAt: new Date().toISOString(),
        },
        privateMetadata: {
          ...currentUser.privateMetadata,
          lastRoleUpdateAt: new Date().toISOString(),
          lastUpdatedBy: updatedById,
          syncSource: "role_update",
        },
      });

      console.log(
        `✅ Updated user role to ${newRole} in both database and Clerk, ${permissionData.excludedPermissions.length} exclusions, allowedRoles: ${permissionData.allowedRoles.join(', ')}`
      );
    }

    return updatedUser;
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    throw error;
  }
}

// Enhanced delete user function
export async function deleteUserFromDatabase(clerkId: string) {
  // Use generated DELETE_USER operation

  try {
    console.log(`🗑️ Deleting user from database: ${clerkId}`);

    const { data, errors } = await adminApolloClient.mutate<DeleteUserByClerkIdUserSyncMutation, DeleteUserByClerkIdUserSyncMutationVariables>({
      mutation: DeleteUserByClerkIdUserSyncDocument,
      variables: { clerkId },
      errorPolicy: "all",
    });

    if (errors) {
      console.error("User deletion errors:", errors);
      throw new Error(
        `Failed to delete user: ${errors.map(e => e.message).join(", ")}`
      );
    }

    const deletedUsers = data?.deleteUsers?.returning || [];
    console.log(`✅ Deleted ${deletedUsers.length} user(s) from database`);

    return (data?.deleteUsers?.affectedRows || 0) > 0;
  } catch (error) {
    console.error("❌ Error deleting user from database:", error);
    throw error;
  }
}

// Helper function to extract the best avatar URL from Clerk user data
// Prioritizes external_accounts avatar_url over image_url
export function getBestAvatarUrl(clerkUserData: {
  external_accounts?: Array<any>; // Use any to handle Clerk's ExternalAccount type flexibility
  image_url?: string;
}): string | undefined {
  console.log("🖼️ Extracting best avatar URL from Clerk data:", {
    hasExternalAccounts: !!clerkUserData.external_accounts?.length,
    externalAccountsCount: clerkUserData.external_accounts?.length || 0,
    hasImageUrl: !!clerkUserData.image_url,
    imageUrl: clerkUserData.image_url ? clerkUserData.image_url.substring(0, 50) + "..." : null
  });

  // First priority: Check external_accounts for avatar_url
  if (clerkUserData.external_accounts?.length) {
    for (const account of clerkUserData.external_accounts) {
      // Check for various possible avatar URL property names
      // Note: Clerk SDK uses 'imageUrl' for external account avatars (may be proxied)
      const avatarUrl = account.avatar_url || account.avatarUrl || account.picture || account.avatar || account.imageUrl;
      if (avatarUrl) {
        console.log("✅ Using external account avatar URL:", avatarUrl.substring(0, 50) + "...");
        return avatarUrl;
      }
    }
    console.log("⚠️ External accounts found but no avatar URL in any account");
  }

  // Second priority: Fall back to image_url
  if (clerkUserData.image_url) {
    console.log("✅ Using fallback image_url:", clerkUserData.image_url.substring(0, 50) + "...");
    return clerkUserData.image_url;
  }

  console.log("ℹ️ No avatar URL found in external accounts or image_url");
  return undefined;
}

// Function to check if user has permission for role assignment
export function canAssignRole(
  currentUserRole: UserRole | "developer",
  targetRole: UserRole
): boolean {
  // Use roles as-is - no normalization needed
  const normalizedCurrentRole = currentUserRole as UserRole;

  const currentLevel = USER_ROLES[normalizedCurrentRole];
  const targetLevel = USER_ROLES[targetRole];

  // Developers (developer) and Standard Admins (org_admin) can assign any role
  if (
    normalizedCurrentRole === "developer" ||
    normalizedCurrentRole === "org_admin"
  ) {
    return true;
  }

  // Managers can assign consultant and viewer roles
  if (
    normalizedCurrentRole === "manager" &&
    (targetRole === "consultant" || targetRole === "viewer")
  ) {
    return true;
  }

  // Users cannot assign roles higher than or equal to their own
  return currentLevel > targetLevel;
}

// Function to get user permissions
export function getUserPermissions(role: UserRole | "developer") {
  const permissions = {
    canCreate: false,
    canManageUsers: false,
    canManagePayrolls: false,
    canViewReports: false,
    canManageClients: false,
    canManageSystem: false,
  };

  // No normalization needed - use roles as-is
  const normalizedRole = role;

  switch (normalizedRole) {
    case "developer": // Developers - highest level
      return {
        canCreate: true,
        canManageUsers: true,
        canManagePayrolls: true,
        canViewReports: true,
        canManageClients: true,
        canManageSystem: true,
      };
    case "org_admin": // Standard Admins
      return {
        canCreate: true,
        canManageUsers: true,
        canManagePayrolls: true,
        canViewReports: true,
        canManageClients: true,
        canManageSystem: true,
      };
    case "manager":
      return {
        canCreate: true,
        canManageUsers: true, // Limited to lower roles
        canManagePayrolls: true,
        canViewReports: true,
        canManageClients: true,
        canManageSystem: false,
      };
    case "consultant":
      return {
        canCreate: false,
        canManageUsers: false,
        canManagePayrolls: true,
        canViewReports: true,
        canManageClients: false,
        canManageSystem: false,
      };
    case "viewer":
      return {
        canCreate: false,
        canManageUsers: false,
        canManagePayrolls: false,
        canViewReports: true,
        canManageClients: false,
        canManageSystem: false,
      };
    default:
      return permissions;
  }
}
