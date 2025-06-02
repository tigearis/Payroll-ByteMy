// lib/user-sync.ts
import { clerkClient } from "@clerk/nextjs/server";
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/server-apollo-client";

// Define user role hierarchy for permission checking
// These must match the Hasura database enum values exactly
export const USER_ROLES = {
  org_admin: 4, // Maps to Admin and Developer in the roles enum
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
      clerk_user_id
      role
      name
      email
      is_staff
      manager_id
      image
      created_at
      updated_at
      manager {
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
    users(where: { clerk_user_id: { _eq: $clerkId } }) {
      id
      clerk_user_id
      role
      name
      email
      is_staff
      manager_id
      image
      created_at
      updated_at
      manager {
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
    $role: user_role = viewer
    $isStaff: Boolean = false
    $managerId: uuid
    $image: String
  ) {
    insert_users_one(
      object: {
        clerk_user_id: $clerkId
        name: $name
        email: $email
        role: $role
        is_staff: $isStaff
        manager_id: $managerId
        image: $image
      }
      on_conflict: {
        constraint: users_clerk_user_id_key
        update_columns: [name, email, image, updated_at]
      }
    ) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      manager_id
      image
      created_at
      updated_at
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
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: {
        role: $role
        manager_id: $managerId
        is_staff: $isStaff
        updated_at: "now()"
      }
    ) {
      id
      name
      email
      role
      is_staff
      manager_id
      updated_at
      manager {
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
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { clerk_user_id: $clerkId, updated_at: "now()" }
    ) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      manager_id
      updated_at
    }
  }
`;

// Update user image mutation
const UPDATE_USER_IMAGE = gql`
  mutation UpdateUserImage($id: uuid!, $image: String!) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { image: $image, updated_at: "now()" }
    ) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      manager_id
      image
      updated_at
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
              clerkId: clerkId,
            },
            errorPolicy: "all",
          });

        if (updateErrors) {
          console.error("Clerk ID update errors:", updateErrors);
          throw new Error(
            `Failed to update user with Clerk ID: ${updateErrors
              .map((e) => e.message)
              .join(", ")}`
          );
        }

        databaseUser = updateData?.update_users_by_pk;
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
            .map((e) => e.message)
            .join(", ")}`
        );
      }

      databaseUser = newUserData?.insert_users_one;
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
        databaseUser = updateImageData?.update_users_by_pk || databaseUser;
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
        const updatedMetadata = {
          ...currentUser.publicMetadata,
          role: databaseUser.role,
          databaseId: databaseUser.id, // ✅ CRITICAL: Database UUID for JWT
          isStaff: databaseUser.is_staff,
          managerId: databaseUser.manager_id,
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
        `Failed to update role: ${errors.map((e) => e.message).join(", ")}`
      );
    }

    const updatedUser = updateData?.update_users_by_pk;

    // Update Clerk metadata
    if (updatedUser) {
      const client = await clerkClient();
      await client.users.updateUser(userId, {
        publicMetadata: {
          role: updatedUser.role,
          databaseId: updatedUser.id,
          isStaff: updatedUser.is_staff,
          managerId: updatedUser.manager_id,
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
      delete_users(where: { clerk_user_id: { _eq: $clerkId } }) {
        affected_rows
        returning {
          id
          name
          email
          clerk_user_id
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
        `Failed to delete user: ${errors.map((e) => e.message).join(", ")}`
      );
    }

    const deletedUsers = data?.delete_users?.returning || [];
    console.log(`✅ Deleted ${deletedUsers.length} user(s) from database`);

    return data?.delete_users?.affected_rows > 0;
  } catch (error) {
    console.error("❌ Error deleting user from database:", error);
    throw error;
  }
}

// Function to check if user has permission for role assignment
export function canAssignRole(
  currentUserRole: UserRole | "admin",
  targetRole: UserRole
): boolean {
  // Handle legacy "admin" role as "org_admin"
  const normalizedCurrentRole =
    currentUserRole === "admin" ? "org_admin" : currentUserRole;

  const currentLevel = USER_ROLES[normalizedCurrentRole];
  const targetLevel = USER_ROLES[targetRole];

  // org_admin can assign any role (including other org_admin roles)
  if (normalizedCurrentRole === "org_admin") return true;

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
export function getUserPermissions(role: UserRole | "admin") {
  const permissions = {
    canCreate: false,
    canManageUsers: false,
    canManagePayrolls: false,
    canViewReports: false,
    canManageClients: false,
    canManageSystem: false,
  };

  // Handle legacy "admin" role as "org_admin"
  const normalizedRole = role === "admin" ? "org_admin" : role;

  switch (normalizedRole) {
    case "org_admin":
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
