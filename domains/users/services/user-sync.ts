// lib/user-sync.ts
import { gql } from "@apollo/client";
import { clerkClient } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { 
  getHierarchicalPermissionsFromDatabase,
  syncUserRoleAssignmentsHierarchical,
  type UserRole as HierarchicalUserRole
} from "@/lib/permissions/hierarchical-permissions";

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

// Query to find a user by email
const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      clerkUserId
      role
      computedName
      email
      isStaff
      managerId
      image
      createdAt
      updatedAt
      managerUser {
        id
        computedName
        email
        role
      }
    }
  }
`;

// Query to find a user by Clerk ID
const GET_USER_BY_CLERK_ID = gql`
  query GetUserByClerkId($clerkId: String!) {
    users(where: { clerkUserId: { _eq: $clerkId } }) {
      id
      clerkUserId
      role
      computedName
      email
      isStaff
      managerId
      image
      createdAt
      updatedAt
      managerUser {
        id
        computedName
        email
        role
      }
    }
  }
`;

// Enhanced upsert user mutation
const UPSERT_USER = gql`
  mutation UpsertUser(
    $clerkId: String!
    $firstName: String!
    $lastName: String!
    $email: String!
    $role: user_role = "viewer"
    $isStaff: Boolean = false
    $managerId: uuid
    $image: String
  ) {
    insertUser(
      object: {
        clerkUserId: $clerkId
        firstName: $firstName
        lastName: $lastName
        email: $email
        role: $role
        isStaff: $isStaff
        managerId: $managerId
        image: $image
      }
      onConflict: {
        constraint: users_clerk_user_id_key
        updateColumns: [firstName, lastName, email, image, updatedAt]
      }
    ) {
      id
      firstName
      lastName
      computedName
      email
      role
      clerkUserId
      isStaff
      managerId
      image
      createdAt
      updatedAt
    }
  }
`;

// Update user role mutation
const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole(
    $id: uuid!
    $role: user_role!
    $managerId: uuid
    $isStaff: Boolean
  ) {
    updateUserById(
      pkColumns: { id: $id }
      _set: {
        role: $role
        managerId: $managerId
        isStaff: $isStaff
        updatedAt: "now()"
      }
    ) {
      id
      computedName
      email
      role
      isStaff
      managerId
      updatedAt
      managerUser {
        id
        computedName
        email
      }
    }
  }
`;

// Update user with Clerk ID
const UPDATE_USER_CLERK_ID = gql`
  mutation UpdateUserClerkId($id: uuid!, $clerkId: String!) {
    updateUserById(
      pkColumns: { id: $id }
      _set: { clerkUserId: $clerkId, updatedAt: "now()" }
    ) {
      id
      computedName
      email
      role
      clerkUserId
      isStaff
      managerId
      updatedAt
    }
  }
`;

// Update user image mutation
const UPDATE_USER_IMAGE = gql`
  mutation UpdateUserImage($id: uuid!, $image: String!) {
    updateUserById(
      pkColumns: { id: $id }
      _set: { image: $image, updatedAt: "now()" }
    ) {
      id
      computedName
      email
      role
      clerkUserId
      isStaff
      managerId
      image
      updatedAt
    }
  }
`;

// Enhanced user sync function with better error handling
export async function syncUserWithDatabase(
  clerkId: string,
  fullName: string,
  email: string,
  role: UserRole = "viewer",
  managerId?: string,
  imageUrl?: string,
  isStaff: boolean = false
) {
  try {
    console.log(`🔄 Syncing user with database: ${clerkId} (${email})`);

    // Get user data from Clerk to ensure we have the latest imageUrl
    let clerkImageUrl = imageUrl;
    if (!clerkImageUrl) {
      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(clerkId);
        clerkImageUrl = clerkUser.imageUrl;
      } catch (error) {
        console.warn("Could not fetch image from Clerk:", error);
      }
    }

    // First, check if user exists by Clerk ID
    const { data: userData, errors: queryErrors } =
      await adminApolloClient.query({
        query: GET_USER_BY_CLERK_ID,
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
        await adminApolloClient.query({
          query: GET_USER_BY_EMAIL,
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
          await adminApolloClient.mutate({
            mutation: UPDATE_USER_CLERK_ID,
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

        databaseUser = updateData?.updateUserById;
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
        `📝 Creating new user in database: ${fullName} (${email}) with role: ${role}`
      );

      const { data: newUserData, errors: mutationErrors } =
        await adminApolloClient.mutate({
          mutation: UPSERT_USER,
          variables: {
            clerkId,
            firstName,
            lastName,
            email,
            role,
            isStaff,
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

      databaseUser = newUserData?.insertUser;
      console.log("✅ Created new user in database:", databaseUser);
    } else if (
      databaseUser &&
      clerkImageUrl &&
      databaseUser.image !== clerkImageUrl
    ) {
      // Update existing user's image if it's different
      console.log(`🖼️ Updating user image: ${databaseUser.computedName}`);

      const { data: updateImageData, errors: updateImageErrors } =
        await adminApolloClient.mutate({
          mutation: UPDATE_USER_IMAGE,
          variables: {
            id: databaseUser.id,
            image: clerkImageUrl,
          },
          errorPolicy: "all",
        });

      if (updateImageErrors) {
        console.warn("Image update errors:", updateImageErrors);
      } else {
        databaseUser = updateImageData?.updateUserById || databaseUser;
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
          managerId: databaseUser.managerId,
          allowedRoles: permissionData.allowedRoles, // ✅ For x-hasura-allowed-roles (hierarchical) - keep as array
          excludedPermissions: arrayToString(permissionData.excludedPermissions), // ✅ Convert to string for Hasura compatibility
          permissionHash: permissionData.permissionHash, // ✅ For x-hasura-permission-hash (role + exclusions)
          permissionVersion: permissionData.permissionVersion, // ✅ For x-hasura-permission-version
          organizationId: null, // ✅ For x-hasura-org-id (future multi-tenancy)
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
    const { data: userData } = await adminApolloClient.query({
      query: GET_USER_BY_CLERK_ID,
      variables: { clerkId: userId },
      fetchPolicy: "network-only",
    });

    const databaseUser = userData?.users?.[0];
    if (!databaseUser) {
      throw new Error("User not found in database");
    }

    // Update role in database
    const { data: updateData, errors } = await adminApolloClient.mutate({
      mutation: UPDATE_USER_ROLE,
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

    const updatedUser = updateData?.updateUserById;

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
          managerId: updatedUser.managerId,
          allowedRoles: permissionData.allowedRoles, // ✅ For x-hasura-allowed-roles (hierarchical) - keep as array
          excludedPermissions: arrayToString(permissionData.excludedPermissions), // ✅ Convert to string for Hasura compatibility
          permissionHash: permissionData.permissionHash, // ✅ For x-hasura-permission-hash (role + exclusions)
          permissionVersion: permissionData.permissionVersion, // ✅ For x-hasura-permission-version
          organizationId: null, // ✅ For x-hasura-org-id
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
  const DELETE_USER = gql`
    mutation DeleteUserByClerkId($clerkId: String!) {
      deleteUsers(where: { clerkUserId: { _eq: $clerkId } }) {
        affectedRows
        returning {
          id
          computedName
          email
          clerkUserId
        }
      }
    }
  `;

  try {
    console.log(`🗑️ Deleting user from database: ${clerkId}`);

    const { data, errors } = await adminApolloClient.mutate({
      mutation: DELETE_USER,
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

    return data?.deleteUsers?.affectedRows > 0;
  } catch (error) {
    console.error("❌ Error deleting user from database:", error);
    throw error;
  }
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
