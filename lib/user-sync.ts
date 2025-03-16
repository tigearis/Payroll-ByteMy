// lib/user-sync.ts
import { clerkClient } from "@clerk/express";
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/apollo-client";

// Query to find a user by Clerk ID
const GET_USER_BY_CLERK_ID = gql`
  query GetUserByClerkId($clerkId: String!) {
    users(where: {clerk_id: {_eq: $clerkId}}) {
      id
      clerk_id
      role
      name
      email
    }
  }
`;

// Create or update user mutation
const UPSERT_USER = gql`
  mutation UpsertUser($clerkId: String!, $name: String, $email: String) {
    insert_users_one(
      object: {
        clerk_id: $clerkId, 
        name: $name, 
        email: $email
      },
      on_conflict: {
        constraint: users_clerk_id_key, 
        update_columns: [name, email, updated_at]
      }
    ) {
      id
      clerk_id
      role
    }
  }
`;

export async function syncUserWithDatabase(clerkId: string, name: string, email: string) {
  try {
    // Check if user exists in database
    const { data: userData } = await adminApolloClient.query({
      query: GET_USER_BY_CLERK_ID,
      variables: { clerkId },
      fetchPolicy: 'network-only' // Don't use cache
    });

    let databaseUser = userData?.users?.[0] || null;
    
    // If user doesn't exist, create them
    if (!databaseUser && name && email) {
      const { data: newUserData } = await adminApolloClient.mutate({
        mutation: UPSERT_USER,
        variables: {
          clerkId,
          name,
          email
        }
      });
      
      databaseUser = newUserData?.insert_users_one;
      console.log("Created new user in database:", databaseUser);
    }
    
    // Update Clerk metadata with the role from database
    if (databaseUser?.role) {
      await clerkClient.users.updateUser(clerkId, {
        publicMetadata: {
          role: databaseUser.role
        }
      });
      console.log(`Updated Clerk metadata with role: ${databaseUser.role}`);
    }
    
    return databaseUser;
  } catch (error) {
    console.error("Error syncing user with database:", error);
    throw error;
  }
}

export async function deleteUserFromDatabase(clerkId: string) {
  const DELETE_USER = gql`
    mutation DeleteUser($clerkId: String!) {
      delete_users(where: {clerk_id: {_eq: $clerkId}}) {
        affected_rows
      }
    }
  `;
  
  try {
    const { data } = await adminApolloClient.mutate({
      mutation: DELETE_USER,
      variables: { clerkId }
    });
    
    return data?.delete_users?.affected_rows > 0;
  } catch (error) {
    console.error("Error deleting user from database:", error);
    throw error;
  }
}
