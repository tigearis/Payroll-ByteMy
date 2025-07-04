// lib/user-sync.ts
import { gql } from "@apollo/client";
import { clerkClient } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { getPermissionsForRole, getAllowedRoles } from "@/lib/auth/simple-permissions";

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

// Query to find a user by email
const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      clerkUserId
      role
      name
      email
      isStaff
      managerId
      image
      createdAt
      updatedAt
      managerUser {
        id
        name
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
      name
      email
      isStaff
      managerId
      image
      createdAt
      updatedAt
      managerUser {
        id
        name
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
    $name: String!
    $email: String!
    $role: userrole = viewer
    $isStaff: Boolean = false
    $managerId: uuid
    $image: String
  ) {
insertUsersOne(
      object: {
        clerkUserId: $clerkId
        name: $name
        email: $email
        role: $role
        isStaff: $isStaff
        managerId: $managerId
        image: $image
      }
      onConflict: {
        constraint: users_clerk_user_id_key
        updateColumns: [name, email, image, updatedAt]
      }
    ) {
      id
      name
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
    $role: userrole!
    $managerId: uuid
    $isStaff: Boolean
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: {
        role: $role
        managerId: $managerId
        isStaff: $isStaff
        updatedAt: "now()"
      }
    ) {
      id
      name
      email
      role
      isStaff
      managerId
      updatedAt
      managerUser {
        id
        name
        email
      }
    }
  }
`;

// Update user with Clerk ID
const UPDATE_USER_CLERK_ID = gql`
  mutation UpdateUserClerkId($id: uuid!, $clerkId: String!) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: { clerkUserId: $clerkId, updatedAt: "now()" }
    ) {
      id
      name
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
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: { image: $image, updatedAt: "now()" }
    ) {
      id
      name
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
  name: string,
  email: string,
  role: UserRole = "viewer",
  managerId?: string,
  imageUrl?: string
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
          `✅ Found existing user by email, updating with Clerk ID: ${existingUserByEmail.name}`
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

        databaseUser = updateData?.updateUsersByPk;
        console.log("✅ Updated existing user with Clerk ID:", databaseUser);
      }
    }

    // If still no user found, create a new one
    if (!databaseUser && name && email) {
      console.log(
        `📝 Creating new user in database: ${name} (${email}) with role: ${role}`
      );

      const { data: newUserData, errors: mutationErrors } =
        await adminApolloClient.mutate({
          mutation: UPSERT_USER,
          variables: {
            clerkId,
            name,
            email,
            role,
            isStaff: role === "org_admin" || role === "manager",
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
      console.log(`🖼️ Updating user image: ${databaseUser.name}`);

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
        databaseUser = updateImageData?.updateUsersByPk || databaseUser;
        console.log("✅ Updated user image in database");
      }
    } else if (databaseUser) {
      console.log(
        `✅ Found existing user in database: ${databaseUser.name} (${databaseUser.role})`
      );
    }

    // ✅ CRITICAL: Always update Clerk metadata with database UUID
    if (databaseUser?.id && databaseUser?.role) {
      const client = await clerkClient();

      try {
        // Get current metadata to preserve other fields
        const currentUser = await client.users.getUser(clerkId);

        // ✅ ENSURE databaseId is ALWAYS set correctly
        const userPermissions = getPermissionsForRole(databaseUser.role);
        const allowedRoles = getAllowedRoles(databaseUser.role);
        const updatedMetadata = {
          ...currentUser.publicMetadata,
          role: databaseUser.role,
          databaseId: databaseUser.id, // ✅ CRITICAL: Database UUID for JWT
          isStaff: databaseUser.is_staff,
          managerId: databaseUser.manager_id,
          permissions: userPermissions, // ✅ CRITICAL: Permissions for JWT custom claims
          allowedRoles: allowedRoles, // ✅ NEW: Dynamic allowed roles for JWT
          lastSyncAt: new Date().toISOString(),
        };

        await client.users.updateUser(clerkId, {
          publicMetadata: updatedMetadata,
          privateMetadata: {
            ...currentUser.privateMetadata,
            lastSyncAt: new Date().toISOString(),
            syncVersion: Date.now(), // Version for debugging
          },
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
          `✅ Updated Clerk metadata with role: ${databaseUser.role}`
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
  managerId?: string
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
        isStaff: newRole === "org_admin" || newRole === "manager",
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

    // Update Clerk metadata
    if (updatedUser) {
      const client = await clerkClient();
      const userPermissions = getPermissionsForRole(updatedUser.role);
      const allowedRoles = getAllowedRoles(updatedUser.role);
      await client.users.updateUser(userId, {
        publicMetadata: {
          role: updatedUser.role,
          databaseId: updatedUser.id,
          isStaff: updatedUser.is_staff,
          managerId: updatedUser.manager_id,
          permissions: userPermissions,
          allowedRoles: allowedRoles, // ✅ NEW: Dynamic allowed roles for JWT
        },
        privateMetadata: {
          hasuraRole: updatedUser.role,
          lastRoleUpdateAt: new Date().toISOString(),
          lastUpdatedBy: updatedById,
        },
      });

      console.log(
        `✅ Updated user role to ${newRole} in both database and Clerk`
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
          name
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
